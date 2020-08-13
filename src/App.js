import React, { useEffect } from 'react';
import theme from './config/theme';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { Switch, Route } from 'react-router-dom';
import { auth } from './config/firebase';
import { createUser } from './config/post/user';
import { connect } from 'react-redux';
import { setCurrentUser } from './redux/user/userAction';
import FirebaseProvider from './config/firebase';
import RolesChecking from './pages/public/roleschecking/roleschecking';
import User from './pages/private/user';
import Auth from './pages/public';
import Head from './pages/private/head';
import Support from './pages/private/support';
import Report from './pages/private/head/report';

function App({ setCurrentUser, currentUser }) {

  useEffect(() => {

    const fetchData = async () => {
      auth.onAuthStateChanged(async userAuth => {
        if (userAuth) {
          const userRef = await createUser(userAuth);
          userRef.onSnapshot(snapShot => {
            setCurrentUser({
              id: snapShot.id,
              ...snapShot.data()
            })
          })
        }
        else {
          setCurrentUser(userAuth)
        }
      })
    }
    fetchData();

  }, [setCurrentUser])


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <FirebaseProvider>
            <Switch>
              <Route exact path='/support/setting' component={Support} />
              <Route exact path='/support/asset' component={Support} />
              <Route exact path='/support/instruction' component={Support} />
              <Route exact path='/support/ticket/:ticketId' component={Support} />
              <Route exact path='/support/ticket' component={Support} />
              <Route exact path='/support/user' component={Support} />
              <Route exact path='/support/' component={Support} />
              <Route exact path='/head/report' component={Report} />
              <Route exact path='/head/setting' component={Head} />
              <Route exact path='/head/ticket/:ticketID' component={Head} />
              <Route exact path='/head/ticket' component={Head} />
              <Route exact path='/head/lending' component={Head} />
              <Route exact path='/head/support' component={Head} />
              <Route exact path='/head' component={Head} />
              <Route exact path='/user/ticket/:ticketID' component={User} />
              <Route exact path='/user/setting' component={User} />
              <Route exact path='/user/instruction' component={User} />
              <Route exact path='/user/ticket' component={User} />
              <Route exact path='/user' component={User} />
              <Route exact path='/roleschecking' component={RolesChecking} />
              <Route exact path='/forgot' component={Auth} />
              <Route exact path='/register' component={Auth} />
              <Route exact path='/' component={Auth} />
            </Switch>
          </FirebaseProvider>
        </SnackbarProvider>
      </CssBaseline>
    </ThemeProvider>
  );
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})
export default connect(mapStateToProps, mapDispatchToProps)(App);
