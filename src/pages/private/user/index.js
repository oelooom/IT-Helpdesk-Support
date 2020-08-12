import React from 'react';
import UserAppBar from '../../../components/UserAppBar';
import Footer from '../../../components/Footer/footer';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useFirebase } from '../../../config/firebase';
import Home from './home';
import Ticket from './ticket';
import Instruction from './instruction';
import AppLoading from '../../../components/AppLoading';


const User = ({ currentUser, history, location }) => {

    const { user } = useFirebase();

    if (!user) {
        return <Redirect to={{ pathname: '/', state: { from: location } }} />
    }

    if (!currentUser) {
        return <AppLoading />
    }

    if (currentUser.isSupport) {
        history.push('/support')
    } else if (currentUser.isHead) {
        history.push('/support')
    }

    return (
        <React.Fragment>
            <UserAppBar />
            <Switch>
                <Route path='/user/instruction' component={Instruction} />
                <Route path='/user/ticket' component={Ticket} />
                <Route component={Home} />
            </Switch>
            <Footer />
        </React.Fragment>
    )
}

const mapStateToPros = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToPros)(User);