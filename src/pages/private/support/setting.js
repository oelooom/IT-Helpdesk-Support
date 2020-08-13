import React, { useState } from 'react';
import useStyles from './styles/edit';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import UploadIcon from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import { useFirebase } from '../../../config/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import AppPageLoading from '../../../components/AppPageLoading';
import { useSnackbar } from 'notistack';
import { Prompt } from 'react-router-dom';

const Setting = ({ match }) => {

    const { firestore, user, storage } = useFirebase();

    const classes = useStyles();

    const [isSomethingChange, setSomethingChange] = useState(false);

    const { enqueueSnackbar } = useSnackbar()

    const userDoc = firestore.doc(`users/${user.uid}`);
    const userStorageRef = storage.ref(`toko/${user.uid}/user/${match.params.userId}`);

    const [snapshot, loading] = useDocument(userDoc);

    const [form, setForm] = useState({
        displayName: '',
        email: '',
        phoneNumber: '',
        photoUrl: ''
    })

    const [error, setError] = useState({
        displayName: '',
        email: '',
        phoneNumber: '',
        photoUrl: ''
    })

    React.useEffect(() => {

        if (snapshot) {
            setForm(currentForm => ({
                ...currentForm,
                ...snapshot.data()
            }));
        }

    }, [snapshot])

    const [isSubmitting, setSubmitting] = useState(false);


    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setError({
            ...error,
            [e.target.name]: ''
        })
        setSomethingChange(true);
    }

    const validate = () => {
        const newError = { ...error };

        if (!form.displayName) {
            newError.displayName = 'Name must me filled'
        }
        if (!form.phoneNumber) {
            newError.phoneNumber = 'PhoneNumber must be filled'
        }

        return newError;

    }

    const handleSubmit = async e => {
        e.preventDefault();

        setSubmitting(true);

        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {

            try {
                await userDoc.set(form, { merge: true })
                enqueueSnackbar('Data berhasil diupdate', { variant: 'success' })
            } catch (e) {
                enqueueSnackbar('Terjadi kesalahan, silahkan coba lagi', { variant: 'danger' })
            }

        }
        setSubmitting(false);
        setSomethingChange(false);
    }

    const handleUploadFile = async (e) => {

        const file = e.target.files[0];

        if (!['image/png', 'image/jpeg'].includes(file.type)) {
            setError(error => ({
                ...error,
                foto: `Tipe File Tidak Didukung : ${file.type}`
            }))
        } else if (file.size >= 5120000) {
            setError(error => ({
                ...error,
                foto: `Ukuran File Lebih Dari 5Mb : ${file.size}`
            }))
        } else {
            const reader = new FileReader();

            reader.onabort = () => {
                setError(error => ({
                    ...error,
                    foto: `Proses Pemilihan File Dibatalkan`
                }))
            }

            reader.onerror = () => {
                setError(error => ({
                    ...error,
                    foto: `File Tidak Bisa Dibaca`
                }))
            }

            reader.onload = async () => {
                setError(error => ({
                    ...error,
                    foto: ''
                }))

                setSubmitting(true);
                setSomethingChange(true);

                try {
                    const fotoExt = file.name.substring(file.name.lastIndexOf('.'));
                    const fotoRef = userStorageRef.child(`${match.params.produkId}${new Date().getTime()}${fotoExt}`);
                    const fotoSnapshot = await fotoRef.putString(reader.result, 'data_url');
                    const fotoUrl = await fotoSnapshot.ref.getDownloadURL();

                    setForm(currentForm => ({
                        ...currentForm,
                        photoUrl: fotoUrl
                    }))

                } catch (e) {
                    setError(err => ({
                        ...err,
                        photoUrl: e.message
                    }))
                }

                setSubmitting(false);
                setSomethingChange(false);
            }


            reader.readAsDataURL(file);
        }

    }

    if (loading) {
        return <AppPageLoading />
    }

    return (
        <div>
            <Grid container alignItems='center' justify='center'>
                <Grid item xs={12} sm={7} className={classes.form}>
                    <form id='produk-form' onSubmit={handleSubmit} noValidate>
                        <TextField
                            id='displayName'
                            name='displayName'
                            label='Account Name'
                            margin='normal'
                            fullWidth
                            value={form.displayName}
                            error={error.displayName ? true : false}
                            helperText={error.displayName}
                            disabled={isSubmitting}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            id='email'
                            name='email'
                            label='Email Address'
                            margin='normal'
                            fullWidth
                            value={form.email}
                            error={error.email ? true : false}
                            helperText={error.email}
                            disabled={isSubmitting}
                            onChange={handleChange}
                            required
                            readOnly
                        />
                        <TextField
                            id='phoneNumber'
                            name='phoneNumber'
                            label='Phone Number'
                            margin='normal'
                            fullWidth
                            value={form.phoneNumber}
                            error={error.phoneNumber ? true : false}
                            helperText={error.phoneNumber}
                            disabled={isSubmitting}
                            onChange={handleChange}
                            required
                        />
                        <Button
                            color='primary'
                            variant='contained'
                            type='submit'
                            form='produk-form'>
                            Simpan
                    </Button>
                    </form>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <div className={classes.uploadFotoProduk}>
                        {form.photoUrl &&
                            <img src={form.photoUrl} alt='Foto User' className={classes.previewFotoProduk} />
                        }
                        <input
                            type='file'
                            className={classes.hideInputFile}
                            id='upload-foto-produk'
                            accept='image/jpeg, image/png'
                            onChange={handleUploadFile}
                        />
                        <label htmlFor='upload-foto-produk'>
                            <Button component='span' variant='outlined' disabled={isSubmitting}>Upload Foto <UploadIcon className={classes.iconRight} /> </Button>
                        </label>
                        <Typography color='error'>
                            {error.photoUrl}
                        </Typography>
                    </div>
                </Grid>

            </Grid>

            <Prompt when={isSomethingChange} message='Terdapat perubahan yang belum disimpan, silahkan menyimpan terlebih dahulu' />

        </div>
    )
}

export default Setting;