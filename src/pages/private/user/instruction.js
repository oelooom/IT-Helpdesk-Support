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
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { addInstruction, removeInstruction } from '../../../redux/instruction/instructionAction';
import { connect } from 'react-redux';
import { firestore } from '../../../config/firebase';

const useStyles = makeStyles(theme => ({
    wrapper: {
        width: '100vw',
        height: '84vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
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

function ListInstruction({ addInstruction, removeInstruction, instruction, currentUser }) {


    useEffect(() => {
        async function getData() {
            const userRef = firestore.collection('instructions');

            userRef.onSnapshot(async snap => {
                const changes = snap.docChanges();
                changes.forEach(change => {
                    if (change.type === 'added') {
                        addInstruction({ id: change.doc.id, ...change.doc.data() })
                    }
                    else if (change.type === 'modified') {
                        addInstruction({ id: change.doc.id, ...change.doc.data() })
                    }
                    else if (change.type === 'removed') {
                        removeInstruction({ id: change.doc.id, ...change.doc.data() });

                    }
                })
            })
        }

        getData();
    }, [addInstruction, removeInstruction, currentUser])

    const columns = [
        { id: 'keyword', label: 'Keyword', minWidth: 180 },
        { id: 'file', label: 'File', align: 'center', minWidth: 160 },
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
        <Container maxWidth='lg' className={classes.wrapper}>
            <Paper className={classes.root} elevation={2}>
                <div className={classes.tableHead}>
                    <Typography variant='h5'>Work Instructions</Typography>
                    <TextField className={classes.search} id='search' name='search' label='Search Instruction' size='small' onChange={handleSearch} />
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
                            {instruction.sort((a, b) => new Date(b.created.seconds * 1000) - new Date(a.created.seconds * 1000)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).filter(data => data.keyword.toLowerCase().includes(search)).map((row, index) => {

                                return (
                                    <React.Fragment key={index}>
                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                            <TableCell
                                                style={{ minWidth: 180 }}
                                            >
                                                {row.keyword}
                                            </TableCell>
                                            <TableCell
                                                align='center'
                                                style={{ minWidth: 160 }}
                                            >
                                                <Button component={Link} variant='contained' target="_blank" href={row.file}>File</Button>
                                            </TableCell>
                                            <TableCell
                                                align='center'
                                                style={{ minWidth: 100 }}
                                            >
                                                <Button variant='contained' color='primary' size='small'>Detail</Button>
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
                    count={instruction.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </Container>
    );
}

const mapStateToProps = state => ({
    instruction: state.instruction.instruction
})

const mapDispatchToProps = dispatch => ({
    addInstruction: instruction => dispatch(addInstruction(instruction)),
    removeInstruction: instruction => dispatch(removeInstruction(instruction))
})

export default connect(mapStateToProps, mapDispatchToProps)(ListInstruction);