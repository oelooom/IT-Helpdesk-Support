import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import useStyles from './styles';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Home = ({ currentUser, history }) => {

    const classes = useStyles();

    return (
        <React.Fragment>
            <div className={classes.title}>
                <h1 className={classes.title}>Hehehehe</h1>
            </div>

            <Container maxWidth="sm" className={classes.topContainer}>
                <Paper></Paper>
            </Container>
        </React.Fragment>
    )
}

const mapStateToPros = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToPros)(Home);