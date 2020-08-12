import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useStyles from './styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import isEmail from 'validator/lib/isEmail';
import { auth } from '../../../config/firebase';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Redirect } from 'react-router-dom';
import Footer from '../../../components/Footer/footer';
import { useFirebase } from '../../../config/firebase';
import AppLoading from '../../../components/AppLoading'
import Illustration from '../../../assets/illustration-login-4.png';


const Login = ({ location }) => {

    const classes = useStyles();
    const { loading, user } = useFirebase();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState({
        email: '',
        password: ''
    })


    // Event Handler
    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setError({
            ...error,
            [e.target.name]: ''
        })
    }

    const validate = () => {
        const newError = { ...error };

        if (!form.email) {
            newError.email = 'Email Tidak Boleh Kosong';
        } else if (!isEmail(form.email)) {
            newError.email = 'Email Tidak Valid';
        }

        if (!form.password) {
            newError.password = 'Password Tidak Boleh Kosong'
        }

        return newError;

    }

    const handleSubmit = async e => {
        e.preventDefault();

        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {
            try {
                setSubmitting(true);
                await auth.signInWithEmailAndPassword(form.email, form.password)
            } catch (e) {
                const newError = {};

                switch (e.code) {
                    case 'auth/user-not-found':
                        newError.email = 'User Not Found';
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Email Is Not Valid';
                        break;
                    case 'auth/wrong-password':
                        newError.password = 'Wrong Password';
                        break;
                    case 'auth/user-disabled':
                        newError.email = 'Accound Disabled, Please Contact IT';
                        break;
                    default:
                        newError.email = 'Something Wrong, Please Try Again';
                }

                setError(newError);
            }

            setSubmitting(false);
        }
    }

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
                        <Paper elevation={2} className={classes.paper}>
                            <Typography variant='h4'>Account Login</Typography>
                            <Typography variant='subtitle1'>Please complete the form below to login</Typography>
                            <form className={classes.formContainer} onSubmit={handleSubmit} noValidate>
                                <TextField
                                    id='email'
                                    type='email'
                                    name='email'
                                    label='Email Address'
                                    variant='outlined'
                                    size='small'
                                    margin='normal'
                                    value={form.email}
                                    error={error.email ? true : false}
                                    helperText={error.email}
                                    disabled={isSubmitting}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    id='password'
                                    type='password'
                                    name='password'
                                    label='Account Password'
                                    variant='outlined'
                                    size='small'
                                    margin='normal'
                                    value={form.password}
                                    error={error.password ? true : false}
                                    helperText={error.password}
                                    disabled={isSubmitting}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                                <Grid container className={classes.buttonGroup}>
                                    <Grid item>
                                        <Button
                                            type='submit'
                                            color='primary'
                                            variant='contained'
                                            size='large'
                                            disabled={isSubmitting}>
                                            Login
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            type='button'
                                            component={Link}
                                            to='/register'
                                            variant='contained'
                                            size='large'
                                            disabled={isSubmitting}>
                                            Register
                                        </Button>
                                    </Grid>
                                </Grid>

                                <div className={classes.forgotPassword}>
                                    <Typography component={Link} to='/forgot' color='primary'>
                                        Forgot Password?
                                </Typography>
                                </div>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </div>
    )
}

export default Login;