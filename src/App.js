import React, { useEffect } from 'react';
import theme from './config/theme';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { Switch, Route } from 'react-router-dom';
import Login from './pages/public/login/login';
import Register from './pages/public/register/register';
import { auth } from './config/firebase';
import { createUser } from './config/post/user';
import { connect } from 'react-redux';
import { setCurrentUser } from './redux/user/userAction';
import FirebaseProvider from './config/firebase';
import RolesChecking from './pages/public/roleschecking/roleschecking';
import Forgot from './pages/public/forgot/forgot';

function App({ setCurrentUser, currentUser }) {

  useEffect(() => {
    function fetchData() {
      auth.onAuthStateChanged(async userAuth => {
        if (userAuth) {
          const userRef = await createUser(userAuth);

          userRef.onSnapshot(snapShot => {
            console.log(snapShot.id)
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
              <Route exact path='/roleschecking' component={RolesChecking} />
              <Route exact path='/forgot' component={Forgot} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/' component={Login} />
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
