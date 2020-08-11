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
import { createUser } from '../../../config/post/user';
import { useFirebase } from '../../../config/firebase';
import AppLoading from '../../../components/AppLoading'


const Register = ({ currentUser }) => {

    const classes = useStyles();
    const { user, loading } = useFirebase();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
        password_confirmation: '',
        displayName: '',
        photoUrl: 'https://firebasestorage.googleapis.com/v0/b/pharmacy-db-c9def.appspot.com/o/user.png?alt=media&token=86125a0a-c596-458e-a74b-5b6ded205658',
        phoneNumber: ''
    })
    const [error, setError] = useState({
        email: '',
        password: '',
        password_confirmation: '',
        displayName: '',
        phoneNumber: ''
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

        if (!form.displayName) {
            newError.displayName = "Display Name Should'nt be Empty";
        }

        if (!form.email) {
            newError.email = `Email Should'nt Be Empty`;
        } else if (!isEmail(form.email)) {
            newError.email = 'Email Is Not Valid';
        }

        if (!form.password) {
            newError.password = `Password Should'nt Be Empty`;
        }

        if (!form.phoneNumber) {
            newError.phoneNumber = `Phone Number Should'nt Be Empty`;
        }

        if (!form.password_confirmation) {
            newError.password_confirmation = `Password Confirmation Should'nt Be Empty`;
        } else if (form.password_confirmation !== form.password) {
            newError.password_confirmation = `Password dan Confirmation Not Match`;
        }

        return newError;

    }

    const handleSubmit = async e => {
        e.preventDefault();
        const findErrors = validate();
        setSubmitting(true);

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
            setSubmitting(false);

        } else {
            try {
                const { displayName, email, password, photoUrl, phoneNumber } = form;
                const { user } = await auth.createUserWithEmailAndPassword(email, password);
                console.log(displayName, photoUrl, phoneNumber);
                await createUser(user, { displayName, photoUrl, phoneNumber })

            } catch (e) {
                const newError = {};

                switch (e.code) {
                    case 'auth/email-already-in-use':
                        newError.email = 'Email Already In Use';
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Email Is Not Valid';
                        break;
                    case 'auth/weak-password':
                        newError.password = 'Weak Password';
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
                            <Typography variant='h4'>Account Register</Typography>
                            <Typography variant='subtitle1'>Please complete the form below to create an account</Typography>
                            <form className={classes.formContainer} onSubmit={handleSubmit} noValidate>
                                <TextField
                                    id='displayName'
                                    type='displayName'
                                    name='displayName'
                                    label='Display Name'
                                    variant='outlined'
                                    size='small'
                                    margin='normal'
                                    value={form.displayName}
                                    error={error.displayName ? true : false}
                                    helperText={error.displayName}
                                    disabled={isSubmitting}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
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
                                    id='phoneNumber'
                                    type='text'
                                    name='phoneNumber'
                                    label='Phone Number'
                                    variant='outlined'
                                    size='small'
                                    margin='normal'
                                    value={form.phoneNumber}
                                    error={error.phoneNumber ? true : false}
                                    helperText={error.phoneNumber}
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
                                <TextField
                                    id='password_confirmation'
                                    type='password'
                                    name='password_confirmation'
                                    label='Password Confirmartion'
                                    variant='outlined'
                                    size='small'
                                    margin='normal'
                                    value={form.password_confirmation}
                                    error={error.password_confirmation ? true : false}
                                    helperText={error.password_confirmation}
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
                                            Register
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

export default Register;