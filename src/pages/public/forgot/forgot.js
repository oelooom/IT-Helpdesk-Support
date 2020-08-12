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
import { useSnackbar } from 'notistack';


const Forgot = () => {

    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
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


    return (

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
    )
}

export default Forgot;