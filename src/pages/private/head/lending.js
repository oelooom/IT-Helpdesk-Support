import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { confirmLending, returnLending } from '../../../config/post/ticket';
import { addLending } from '../../../redux/ticket/ticketAction';
import { addSupport } from '../../../redux/user/userAction';
import { connect } from 'react-redux';
import { firestore } from '../../../config/firebase';
import { Link } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
    root: {
        width: '90%',
    },
    container: {
        maxHeight: 440,
    },
    tableHead: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(3)
    },
    search: {
        marginBottom: theme.spacing(1)
    }
}));

function Lending({ addLending, currentUser, addSupport, support, lending }) {


    useEffect(() => {
        async function getData() {
            const userRef = firestore.collection('ticket').where('isLending', '==', true);

            userRef.onSnapshot(async snap => {
                const changes = snap.docChanges();
                changes.forEach(change => {
                    if (change.type === 'added') {
                        addLending({ id: change.doc.id, ...change.doc.data() })
                    }
                    else if (change.type === 'modified') {
                        addLending({ id: change.doc.id, ...change.doc.data() })
                    }
                })
            })

            const supportRef = firestore.collection('users').where('isSupport', '==', true);
            supportRef.onSnapshot(async snap => {
                const changes = snap.docChanges();
                changes.forEach(change => {
                    addSupport({ id: change.doc.id, ...change.doc.data() })
                })
            })
        }

        getData();
    }, [addLending, currentUser, addSupport])

    const columns = [
        { id: 'title', label: 'Title', minWidth: 180 },
        { id: 'category', label: 'Category', align: 'center', minWidth: 160 },
        { id: 'status', label: 'Status', minWidth: 160, align: 'center' },
        { id: 'action', label: 'Action', minWidth: 160, align: 'center' },
        { id: 'detail', label: 'Detail', minWidth: 100, align: 'center' }
    ];

    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [isSubmitting, setSubmitting] = useState(false);
    const [confirm, setConfirm] = React.useState(false);
    const [confirmData, setConfirmData] = React.useState({
        ticketId: '',
        status: ''
    });
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const confirms = [{ id: 5, label: 'Accept' }, { id: 0, label: 'Reject' }]

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleConfirm = (data) => {
        setConfirm(true);
        setConfirmData({
            ...confirmData,
            ticketId: data
        })
    }

    const handleConfirmChange = (data, value) => {
        setConfirmData({
            ...confirmData,
            status: value.id
        })
    }

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            await confirmLending(confirmData);
            setConfirm(false);
            setSubmitting(false);
        } catch (e) {
            alert(e.message)
            setSubmitting(false);

        }
    }
    const handleReturn = async data => {
        try {
            setSubmitting(true);
            await returnLending(data);
            setConfirm(false);
            setSubmitting(false);
        } catch (e) {
            alert(e.message)
            setSubmitting(false);

        }
    }

    return (
        <React.Fragment>
            <Paper className={classes.root} elevation={2}>
                <div className={classes.tableHead}>
                    <Typography variant='h6'>Asset Lending</Typography>
                    <TextField className={classes.search} id='search' name='search' label='Search Ticket' size='small' />
                </div>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableCell
                                        key={index}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lending.sort((a, b) => new Date(b.created.seconds * 1000) - new Date(a.created.seconds * 1000)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                let status;
                                if (row.status === '1') {
                                    status = 'Received'
                                } else if (row.status === '2') {
                                    status = `Assigned To ${row.supportData.displayName}`
                                } else if (row.status === '3') {
                                    status = `Troubleshoot by ${row.supportData.displayName} `
                                } else if (row.status === '4') {
                                    status = `Finish `
                                } else if (row.status === '5') {
                                    status = 'Lending Accepted'
                                } else if (row.status === '6') {
                                    status = 'Lending Returned'
                                } else {
                                    status = `Rejected By IT Dept`
                                }
                                return (
                                    <React.Fragment key={index}>
                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                            <TableCell
                                                style={{ minWidth: 180 }}
                                            >
                                                {row.title}
                                            </TableCell>
                                            <TableCell
                                                align='center'
                                                style={{ minWidth: 160 }}
                                            >
                                                {row.category}
                                            </TableCell>
                                            <TableCell
                                                align='center'
                                                style={{ minWidth: 160 }}
                                            >
                                                {status}
                                            </TableCell>

                                            <TableCell
                                                align='center'
                                                style={{ minWidth: 160 }}
                                            >
                                                {row.status === '1' && <Button variant='contained' color='secondary' size='small' onClick={() => handleConfirm(row.id)} disabled={isSubmitting}>Confirm</Button>}

                                                {row.status === '5' && <Button variant='contained' color='secondary' size='small' onClick={() => handleReturn(row.id)} disabled={isSubmitting}>Return</Button>}

                                                {row.status === '6' && 'Ticket Finish'}

                                            </TableCell>

                                            <TableCell
                                                align='center'
                                                style={{ minWidth: 100 }}
                                            >
                                                <Button variant='contained' component={Link} to={`/user/ticket/${row.id}`} color='primary' size='small'>Detail</Button>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={lending.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <Dialog open={confirm}
                disableBackdropClick={isSubmitting}
                disableEscapeKeyDown={isSubmitting}
                onBackdropClick={() => setConfirm(false)}
                maxWidth='xs'
                fullWidth>
                <DialogTitle> Lending Confirmation</DialogTitle>
                <DialogContent dividers>
                    <Autocomplete
                        id="confirm"
                        options={confirms}
                        onChange={handleConfirmChange}
                        getOptionLabel={(option) => option.label}
                        getOptionSelected={(option) => option.id === confirmData.status}
                        renderInput={(params) => <TextField {...params} label="Lending Confirmation" variant="outlined" size='small' disabled={isSubmitting} fullWidth margin='normal' />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirm(false)}>Batal</Button>
                    <Button color='primary' onClick={handleSubmit}>Simpan</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    );
}

const mapStateToProps = state => ({
    lending: state.ticket.lending,
    currentUser: state.user.currentUser,
    support: state.user.support,
})

const mapDispatchToProps = dispatch => ({
    addLending: lending => dispatch(addLending(lending)),
    addSupport: support => dispatch(addSupport(support))
})

export default connect(mapStateToProps, mapDispatchToProps)(Lending);