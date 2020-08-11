import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import useStyles from './styles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Home = ({ currentUser, history }) => {

    const classes = useStyles();

    if (!currentUser) {
        history.push('/roleschecking')
    }

    return (
        <React.Fragment>
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                Welcome to IT Helpdesk Support System
                    </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
                While waiting for our response, please search and read the work instruction first, hopefully it can help solve the problem, cheers :)
                    </Typography>
            <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                    <Grid item>
                        <Button component={Link} to='/user/ticket' variant="contained" color="primary">
                            Open New Ticket
                            </Button>
                    </Grid>
                    <Grid item>
                        <Button component={Link} to='/user/instruction' variant="outlined" color="primary">
                            Search Work Instruction
                         </Button>
                    </Grid>
                </Grid>
            </div>
        </React.Fragment>
    )
}

const mapStateToPros = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToPros)(Home);