import React from 'react';
import AppLoading from '../../../components/AppLoading';
import { connect } from 'react-redux';

const RolesChecking = ({ currentUser, history }) => {


    setTimeout(() => {
        if (!currentUser) {
            history.push('/')
        }
        else {
            if (currentUser.isUser) {
                history.push('/user')
            }
            else if (currentUser.isSupport) {
                history.push('/support')
            }
            else if (currentUser.isHead) {
                history.push('/head')
            }
        }

    }, 1000)

    return (
        <AppLoading />
    )

}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(RolesChecking);