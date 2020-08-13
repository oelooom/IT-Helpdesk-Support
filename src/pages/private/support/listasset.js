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
import { addAsset, removeAsset } from '../../../redux/asset/assetAction';
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

function ListAsset({ addAsset, removeTicket, asset, currentUser }) {


    useEffect(() => {
        async function getData() {
            const userRef = firestore.collection('assets');

            userRef.onSnapshot(async snap => {
                const changes = snap.docChanges();
                changes.forEach(change => {
                    if (change.type === 'added') {
                        addAsset({ id: change.doc.id, ...change.doc.data() })
                    }
                    else if (change.type === 'modified') {
                        addAsset({ id: change.doc.id, ...change.doc.data() })
                    }
                    else if (change.type === 'removed') {
                        removeTicket({ id: change.doc.id, ...change.doc.data() });

                    }
                })
            })
        }

        getData();
    }, [addAsset, removeTicket, currentUser])

    const columns = [
        { id: 'title', label: 'Title', minWidth: 180 },
        { id: 'quantity', label: 'Quantity', align: 'center', minWidth: 160 },
        { id: 'action', label: 'action', Align: 'center', minWidth: 100 }
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

    const [search, setSearch] = React.useState('');
    const handleSearch = (event) => {
        event.preventDefault();

        setSearch(event.target.value.toLowerCase());
    }


    return (
        <Paper className={classes.root} elevation={2}>
            <div className={classes.tableHead}>
                <Typography variant='h6'>List Assets</Typography>
                <TextField className={classes.search} id='search' name='search' label='Search Assets' size='small' onChange={handleSearch} />
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
                        {asset.sort((a, b) => new Date(b.created.seconds * 1000) - new Date(a.created.seconds * 1000)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).filter(data => data.displayName.toLowerCase().includes(search)).map((row, index) => {

                            return (
                                <React.Fragment key={index}>
                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                        <TableCell
                                            style={{ minWidth: 180 }}
                                        >
                                            {row.displayName}
                                        </TableCell>
                                        <TableCell
                                            align='center'
                                            style={{ minWidth: 160 }}
                                        >
                                            {row.quantity}
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
                count={asset.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

const mapStateToProps = state => ({
    asset: state.asset.asset
})

const mapDispatchToProps = dispatch => ({
    addAsset: asset => dispatch(addAsset(asset)),
    removeAsset: asset => dispatch(removeAsset(asset))
})

export default connect(mapStateToProps, mapDispatchToProps)(ListAsset);