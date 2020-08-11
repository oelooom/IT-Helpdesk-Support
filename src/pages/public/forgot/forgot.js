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
import Footer from '../../../components/footer/footer';
import { useFirebase } from '../../../config/firebase';
import AppLoading from '../../../components/AppLoading';
import { useSnackbar } from 'notistack';


const Forgot = () => {

    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { loading, user } = useFirebase();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: '',
    })
    const [error, setError] = useState({
        email: '',
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
            newError.email = `Email Should'nt Be Empty`;
        } else if (!isEmail(form.email)) {
            newError.email = 'Email Not Valid';
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
                const actionCodeSettings = {
                    url: `${window.location.origin}/`
                }
                await auth.sendPasswordResetEmail(form.email, actionCodeSettings);
                enqueueSnackbar(`Password Reset Link Has Been Sent To ${form.email}, Please Check Your Email`, { variant: 'success' })
                setSubmitting(false);
            } catch (e) {
                const newError = {};

                switch (e.code) {
                    case 'auth/user-not-found':
                        newError.email = 'User Not Found';
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Invalid Email';
                        break;
                    default:
                        newError.email = 'Something Wrong, Please try again';
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
        return <Redirect to='/roleschecking' />
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
                        <img src='https://firebasestorage.googleapis.com/v0/b/it-helpdesk-support.appspot.com/o/component%2Fillustration-login-4.png?alt=media&token=fde52fb7-9787-40b2-aee4-c0e869598b2d' alt='Ilustrasi IT' className={classes.illustration} />
                    </Grid>
                    <Grid item sm={5} className={classes.gridItem}>
                        <Paper elevation={2} className={classes.paper}>
                            <Typography variant='h4'>Forgot Password</Typography>
                            <Typography variant='subtitle1'>Please complete the form below to reset your password</Typography>
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
                                <Grid container className={classes.buttonGroup}>
                                    <Grid item>
                                        <Button
                                            type='submit'
                                            color='primary'
                                            variant='contained'
                                            size='large'
                                            disabled={isSubmitting}>
                                            Reset
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            type='button'
                                            component={Link}
                                            to='/'
                                            variant='contained'
                                            size='large'
                                            disabled={isSubmitting}>
                                            Login
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </div>
    )
}

export default Forgot;