import React, { useState } from 'react';
import useStyles from './styles/ticket';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { createAsset } from '../../../config/post/asset';
import { useSnackbar } from 'notistack';
import ListAsset from './listasset';

const Asset = ({ history, currentUser }) => {

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [form, setForm] = useState({
        displayName: '',
        quantity: '',
    })
    const [isSubmitting, setSubmitting] = useState(false);

    // Event Handler
    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            await createAsset(form);
            setForm({
                ...form,
                displayName: '',
                quantity: ''
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
                <Grid container>
                    <Grid item sm={5} className={classes.gridItem}>
                        <Paper elevation={2} className={classes.paper}>
                            <Typography variant='h4' className={classes.title}>Add Asset Form</Typography>
                            <Typography variant='subtitle1' className={classes.title}>Please complete the form below to to save our asset</Typography>
                            <form className={classes.formContainer} onSubmit={handleSubmit}>
                                <TextField
                                    id='displayName'
                                    type='text'
                                    name='displayName'
                                    label='Assets Title'
                                    variant='outlined'
                                    size='small'
                                    margin='normal'
                                    value={form.displayName}
                                    disabled={isSubmitting}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    id='quantity'
                                    type='number'
                                    name='quantity'
                                    label='Quantity Address'
                                    variant='outlined'
                                    size='small'
                                    margin='normal'
                                    value={form.quantity}
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

                                            Submit
                                </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                    <Grid item sm={7} className={classes.gridItemm}>
                        <ListAsset />
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    )
}

const mapStateToPros = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToPros)(Asset);