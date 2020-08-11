import React from 'react';
import UserAppBar from '../../../components/UserAppBar';
import useStyles from './styles';
import Footer from '../../../components/footer/footer';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Home from './home';
import Ticket from './ticket';
import Instruction from './instruction';


const User = ({ currentUser, history }) => {

    const classes = useStyles();

    if (!currentUser) {
        history.push('/roleschecking')
    }

    return (
        <React.Fragment>
            <UserAppBar />
            <div className={classes.title}>
                <h1 className={classes.title}>Hehehehe</h1>
            </div>

            <Container maxWidth="sm" className={classes.topContainer}>
                <Switch>
                    <Route path='/user/instruction' component={Instruction} />
                    <Route path='/user/ticket' component={Ticket} />
                    <Route component={Home} />
                </Switch>
            </Container>
            <Footer />
        </React.Fragment>
    )
}

const mapStateToPros = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToPros)(User);