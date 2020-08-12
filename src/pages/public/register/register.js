import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useStyles from './styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import isEmail from 'validator/lib/isEmail';
import { auth } from '../../../config/firebase';
import { createUser } from '../../../config/post/user';


const Register = ({ currentUser }) => {

    const classes = useStyles();
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

    return (
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
    )
}

export default Register;