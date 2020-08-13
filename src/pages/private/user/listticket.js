import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { addTicket, removeTicket } from '../../../redux/ticket/ticketAction';
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

function ListTicket({ addTicket, removeTicket, ticket, currentUser }) {


    useEffect(() => {
        async function getData() {
            const userRef = firestore.collection('ticket').where('userId', '==', currentUser.id);

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
        }

        getData();
    }, [addTicket, removeTicket, currentUser])

    const columns = [
        { id: 'title', label: 'Title', minWidth: 180 },
        { id: 'category', label: 'Category', align: 'center', minWidth: 160 },
        { id: 'status', label: 'Status', minWidth: 160, align: 'center' },
        { id: 'detail', label: 'Detail', minWidth: 100, align: 'center' }
    ];

    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    return (
        <Paper className={classes.root} elevation={2}>
            <div className={classes.tableHead}>
                <Typography variant='h6'>List Ticket</Typography>
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
                        {ticket.sort((a, b) => new Date(b.created.seconds * 1000) - new Date(a.created.seconds * 1000)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                            let status;
                            if (row.status === '1') {
                                status = 'Received'
                            } else if (row.status === '2') {
                                status = `Assigned To ${row.support}`
                            } else if (row.status === '3') {
                                status = `Troubleshoot by ${row.support} `
                            } else if (row.status === '4') {
                                status = `Finish `
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
                count={ticket.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

const mapStateToProps = state => ({
    ticket: state.ticket.ticket,
    currentUser: state.user.currentUser
})

const mapDispatchToProps = dispatch => ({
    addTicket: ticket => dispatch(addTicket(ticket)),
    removeTicket: ticket => dispatch(removeTicket(ticket))
})

export default connect(mapStateToProps, mapDispatchToProps)(ListTicket);