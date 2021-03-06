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
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { addTicket, removeTicket } from '../../../redux/ticket/ticketAction';
import { updateStatus } from '../../../config/post/ticket';
import { addSupport } from '../../../redux/user/userAction';
import { connect } from 'react-redux';
import { firestore } from '../../../config/firebase';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';


const useStyles = makeStyles(theme => ({
    root: {
        width: '90%'
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

function Ticket({ addTicket, removeTicket, ticket, currentUser, addSupport, support }) {


    useEffect(() => {
        async function getData() {
            const userRef = firestore.collection('ticket').where('supportId', '==', currentUser.id);

            userRef.onSnapshot(async snap => {
                const changes = snap.docChanges();
                changes.forEach(change => {
                    if (change.type === 'added') {
                        addTicket({ id: change.doc.id, ...change.doc.data() })
                    }
                    else if (change.type === 'modified') {
                        addTicket({ id: change.doc.id, ...change.doc.data() })
                    }
                    else if (change.type === 'removed') {
                        removeTicket({ id: change.doc.id, ...change.doc.data() });

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
    }, [addTicket, removeTicket, currentUser, addSupport])

    const columns = [
        { id: 'title', label: 'Title', minWidth: 180 },
        { id: 'category', label: 'Category', align: 'center', minWidth: 160 },
        { id: 'status', label: 'Status', minWidth: 160, align: 'center' },
        { id: 'assign', label: 'Assign To', minWidth: 160, align: 'center' },
        { id: 'detail', label: 'Detail', minWidth: 100, align: 'center' }
    ];

    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const { enqueueSnackbar } = useSnackbar();
    const [ticketData, setTicketData] = React.useState({
        ticketId: '',
        status: ''
    });
    const [dialog, setDialog] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [isSubmitting, setSubmitting] = useState(false);

    const handleClick = (data) => {
        console.log(data);
        setTicketData({
            ...ticketData,
            ticketId: data.id,
            status: data.status
        })
        setDialog(true);
    }

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            await updateStatus(ticketData)
            setDialog(false);
            enqueueSnackbar('Status has been updated', { variant: 'success' })
            setSubmitting(false);
        } catch (e) {
            alert(e.message)
        }
    }

    const [search, setSearch] = React.useState('');
    const handleSearch = (event) => {
        event.preventDefault();

        setSearch(event.target.value.toLowerCase());
    }

    return (
        <React.Fragment>
            <Paper className={classes.root} elevation={2}>
                <div className={classes.tableHead}>
                    <Typography variant='h6'>List Ticket</Typography>
                    <TextField className={classes.search} id='search' name='search' label='Search Ticket' size='small' onChange={handleSearch} />
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
                            {ticket.sort((a, b) => new Date(b.created.seconds * 1000) - new Date(a.created.seconds * 1000)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).filter(data => data.title.toLowerCase().includes(search)).map((row, index) => {
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

                                                {row.status === '2' && <Button variant='contained' color='primary' size='small' onClick={() => handleClick({ id: row.id, status: '3' })}>Troubleshoot</Button>}

                                                {row.status === '3' && <Button variant='contained' color='primary' size='small' onClick={() => handleClick({ id: row.id, status: '4' })}>Finish</Button>}

                                                {row.status === '4' && <Button variant='contained' color='primary' size='small' onClick={() => handleClick({ id: row.id, status: '3' })}>Reopen</Button>}

                                            </TableCell>
                                            <TableCell
                                                align='center'
                                                style={{ minWidth: 100 }}
                                            >
                                                <Button variant='contained' component={Link} to={`/support/ticket/${row.id}`} color='primary' size='small'>Detail</Button>
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
                    count={ticket.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <Dialog open={dialog}
                disableBackdropClick={isSubmitting}
                disableEscapeKeyDown={isSubmitting}
                onBackdropClick={() => setDialog(false)}
                maxWidth='xs'
                fullWidth>
                <DialogTitle> Are You Sure?</DialogTitle>
                <DialogContent dividers>
                    <Typography variant='h6'>{ticketData.status === '3' ? 'You must take the responsibility to troubleshoot thiis problem, with carefelly and warmly to user' : 'Make sure yang have solve the problem entirely, bruh!'} </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialog(false)} disabled={isSubmitting}>Cancel</Button>
                    <Button color='primary' onClick={handleSubmit} disabled={isSubmitting}>Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    );
}

const mapStateToProps = state => ({
    ticket: state.ticket.ticket,
    currentUser: state.user.currentUser,
    support: state.user.support,
})

const mapDispatchToProps = dispatch => ({
    addTicket: ticket => dispatch(addTicket(ticket)),
    removeTicket: ticket => dispatch(removeTicket(ticket)),
    addSupport: support => dispatch(addSupport(support))
})

export default connect(mapStateToProps, mapDispatchToProps)(Ticket);