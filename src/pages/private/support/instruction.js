import React, { useState } from 'react';
import useStyles from './styles/ticket';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import UploadIcon from '@material-ui/icons/CloudUpload';
import { connect } from 'react-redux';
import { createIntsruction } from '../../../config/post/instruction';
import { useSnackbar } from 'notistack';
import Listinstruction from './listinstruction';
import { FormHelperText } from '@material-ui/core';
import { useFirebase } from '../../../config/firebase';

const Instruction = ({ history, currentUser }) => {

    const { enqueueSnackbar } = useSnackbar();
    const { storage } = useFirebase();
    const produkStorageRef = storage.ref(`instructions/`);

    const classes = useStyles();
    const [form, setForm] = useState({
        keyword: '',
        file: '',
    })
    const [isSubmitting, setSubmitting] = useState(false);

    // Event Handler
    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleFileChange = (e) => {

        setSubmitting(true);

        const file = e.target.files[0];


        const reader = new FileReader();

        reader.onabort = () => {
            setForm(data => ({
                ...data,
                file: `Proses Pemilihan File Dibatalkan`
            }))
        }

        reader.onerror = () => {
            setForm(data => ({
                ...data,
                file: `File Tidak Bisa Dibaca`
            }))
        }

        reader.onload = async () => {

            try {
                const fotoExt = file.name.substring(file.name.lastIndexOf('.'));
                const fotoRef = produkStorageRef.child(`${form.file}${new Date().getTime()}${fotoExt}`);
                const fotoSnapshot = await fotoRef.putString(reader.result, 'data_url');
                const fotoUrl = await fotoSnapshot.ref.getDownloadURL();

                setForm(currentForm => ({
                    ...currentForm,
                    file: fotoUrl
                }))

            } catch (e) {
                alert(e)
            }

            setSubmitting(false);

        }
        reader.readAsDataURL(file);


    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            await createIntsruction(form);
            setForm({
                ...form,
                keyword: '',
                file: ''
            })
            enqueueSnackbar('Seeesh! Ticket has been added', { variant: 'success' });
            setSubmitting(false);
        } catch (e) {
            alert(e.message)
            setSubmitting(false);
        }
    }

    return (
        <React.Fragment>

            <Container maxWidth="lg" className={classes.topContainer}>
                <Grid container className={classes.reverse}>
                    <Grid item sm={5} className={classes.gridItem}>
                        <Paper elevation={2} className={classes.paper}>
                            <Typography variant='h4' className={classes.title}>Add Instruction</Typography>
                            <Typography variant='subtitle1' className={classes.title}>Please complete the form below to to save work instructions</Typography>
                            <form className={classes.formContainer} onSubmit={handleSubmit}>
                                <TextField
                                    id='keyword'
                                    type='text'
                                    name='keyword'
                                    label='Work Instruction'
                                    variant='outlined'
                                    size='small'
                                    margin='normal'
                                    value={form.keyword}
                                    disabled={isSubmitting}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                                <input
                                    type='file'
                                    className={classes.hideInputFile}
                                    id='upload-foto-produk'
                                    onChange={handleFileChange}
                                />
                                <label htmlFor='upload-foto-produk'>
                                    <Button component='span' variant='outlined' disabled={isSubmitting} fullWidth>Upload Foto Produk <UploadIcon className={classes.iconRight} /> </Button>
                                </label>
                                <FormHelperText>{form.file && `Filename : ${form.file}`}</FormHelperText>
                                <Grid container className={classes.buttonGroup}>
                                    <Grid item>
                                        <Button
                                            type='submit'
                                            color='primary'
                                            variant='contained'
                                            size='large'
                                            disabled={isSubmitting}>

                                            Submit
                                </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                    <Grid item sm={7} className={classes.gridItem}>
                        <Listinstruction />
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    )
}

const mapStateToPros = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToPros)(Instruction);