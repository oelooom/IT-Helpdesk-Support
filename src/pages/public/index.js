import React from 'react';
import useStyles from './styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Redirect } from 'react-router-dom';
import Footer from '../../components/Footer/footer';
import { useFirebase } from '../../config/firebase';
import AppLoading from '../../components/AppLoading'
import Illustration from '../../assets/illustration-login-4.png';
import { Switch, Route } from 'react-router-dom';
import Login from './login/login';
import Register from './register/register';
import Forgot from './forgot/forgot';


const Auth = ({ location }) => {

    const classes = useStyles();
    const { loading, user } = useFirebase();

    if (loading) {
        return <AppLoading />
    }

    if (user) {
        const redirectTo = location.state && location.state.from && location.state.from.pathname
            ? location.state.from.pathname
            : '/roleschecking';
        return <Redirect to={redirectTo} />
    }

    return (
        <div className={classes.root}>

            <AppBar position="static">
                <Toolbar className={classes.root}>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        IT Helpdesk Support
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth='lg'>
                <Grid container>
                    <Grid item sm={7} className={classes.gridItem}>
                        <img src={Illustration} alt='Ilustrasi IT' className={classes.illustration} />
                    </Grid>
                    <Grid item sm={5} className={classes.gridItem}>
                        <Switch>
                            <Route exact path='/' component={Login} />
                            <Route exact path='/register' component={Register} />
                            <Route exact path='/forgot' component={Forgot} />
                        </Switch>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </div>
    )
}

export default Auth;