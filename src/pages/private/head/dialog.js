import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withRouter } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import { createSupport, auth2 } from '../../../config/post/support';


import PropTypes from 'prop-types';

function AddDialog({ history, open, handleClose, closeDialog }) {

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
                const { user } = await auth2.createUserWithEmailAndPassword(email, password);
                await createSupport(user, { displayName, photoUrl, phoneNumber })
                auth2.signOut();
                closeDialog(false);
                setSubmitting(false);
                setForm({
                    email: '',
                    password: '',
                    password_confirmation: '',
                    displayName: '',
                    photoUrl: 'https://firebasestorage.googleapis.com/v0/b/pharmacy-db-c9def.appspot.com/o/user.png?alt=media&token=86125a0a-c596-458e-a74b-5b6ded205658',
                    phoneNumber: ''
                })
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
                setSubmitting(false);
            }

        }
    }

    return (
        <Dialog open={open}
            disableBackdropClick={isSubmitting}
            disableEscapeKeyDown={isSubmitting}
            onClose={handleClose}
            maxWidth='xs'
            fullWidth>
            <DialogTitle> Create IT Support Account</DialogTitle>
            <DialogContent dividers>
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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isSubmitting}>Batal</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} color='primary'>Simpan</Button>
            </DialogActions>
        </Dialog>
    )
}

AddDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
}

export default withRouter(AddDialog);