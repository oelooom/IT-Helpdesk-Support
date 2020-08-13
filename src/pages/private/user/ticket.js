import React, { useState } from 'react';
import useStyles from './styles/ticket';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormHelperText from '@material-ui/core/FormHelperText';
import { connect } from 'react-redux';
import { createTicket } from '../../../config/post/ticket';
import { useSnackbar } from 'notistack';
import ListTicket from './listticket';

const Home = ({ history, currentUser }) => {

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [form, setForm] = useState({
        title: '',
        category: '',
        detail: '',
        source: '',
        ip: '',
        software: '',
        dest: '',
        printer: '',
        status: '1',
        userId: currentUser.id,
        userdata: { ...currentUser }
    })

    const [component, setComponent] = useState(null);
    const [helperText, setHelpertext] = useState(null);
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const problemCategories = [
        { title: 'Copy Data', id: '1' },
        { title: 'Software Install', id: '2' },
        { title: 'Software Problem', id: '3' },
        { title: 'PC Repair', id: '4' },
        { title: 'Printer Repair', id: '5' },
        { title: 'Connection Problem', id: '6' },
        { title: 'Email Problem', id: '7' },
        { title: 'UCP ETP Error', id: '8' },
        { title: 'Security Issues', id: '9' },
        { title: 'Asset Lending', id: '10' },
        { title: 'Others', id: '11' },
    ];
    const printerTypes = [
        { title: 'Passbook' },
        { title: 'Lexmark' }
    ]

    // Event Handler
    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSelectChange = (event, value) => {
        console.log(value)
        if (value == null) {
            setComponent(null)
        } else if (value) {
            setComponent(value.title);

            setForm({
                ...form,
                category: value.title
            })

            if (value.title === 'Email Problem') {
                setHelpertext('Whoops!, If you look for an email instllation help, We have made a work instruction with the keyword "Email Installation", otherwise, please inform us, we will help you as soon as posible')
            } else if (value.title === 'UCP ETP Error') {
                setHelpertext('Excuse me!, If you meet UCP/ETP error with a message "IE Not Compatible, Please Use IE11" or UCP/ETP always self-closing the windows, gratefully. we have made a work isntruction for that, with keyword "UCP Blocked" and "UCP Not Compatible", otherwise, please inform us, we will help you as soon as posible ')
            } else {
                setHelpertext(null)
            }

        }

    }

    const handlePrinterChange = (event, value) => {
        if (value) {
            setForm({
                ...form,
                printer: value.title
            })
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            await createTicket(form);
            setForm({
                ...form,
                title: '',
                detail: '',
                source: '',
                ip: '',
                software: '',
                dest: '',
                printer: ''
            })
            enqueueSnackbar('Seeesh! Ticket has been added', { variant: 'success' });
            setSubmitting(false);
        } catch (e) {
            setError(e.message);
            setSubmitting(false);
        }
    }

    return (
        <React.Fragment>

            <Container maxWidth="lg" className={classes.topContainer}>
                <Grid container>
                    <Grid item sm={5} className={classes.gridItem}>
                        <Paper elevation={2} className={classes.paper}>
                            <Typography variant='h4' className={classes.title}>Add Ticket Form</Typography>
                            <Typography variant='subtitle1' className={classes.title}>Please complete the form below to to create a new ticket</Typography>
                            <form className={classes.formContainer} onSubmit={handleSubmit}>
                                <TextField
                                    id='title'
                                    type='text'
                                    name='title'
                                    label='Ticket Title'
                                    variant='outlined'
                                    size='small'
                                    margin='normal'
                                    value={form.title}
                                    disabled={isSubmitting}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                                <Autocomplete
                                    id="category"
                                    options={problemCategories}
                                    getOptionLabel={(option) => option.title}
                                    getOptionSelected={(option) => option.title === form.category}
                                    onChange={handleSelectChange}
                                    renderInput={(params) => <TextField {...params} label="Problem Category" variant="outlined" size='small' disabled={isSubmitting} fullWidth margin='normal' required />}
                                />

                                {component !== 'Copy Data' && component !== 'Asset Lending' ?
                                    <TextField
                                        id='ip'
                                        type='text'
                                        name='ip'
                                        label='IP Address'
                                        variant='outlined'
                                        size='small'
                                        margin='normal'
                                        helperText='e.g. 172.25.96.165. we have  write a guide about how to check IP'
                                        value={form.ip}
                                        disabled={isSubmitting}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    /> : null}


                                {component === 'Copy Data' &&
                                    <React.Fragment>
                                        <TextField
                                            id='source'
                                            type='text'
                                            name='source'
                                            label='IP Source'
                                            variant='outlined'
                                            size='small'
                                            margin='normal'
                                            value={form.source}
                                            disabled={isSubmitting}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                        <TextField
                                            id='dest'
                                            type='text'
                                            name='dest'
                                            label='IP Destination'
                                            variant='outlined'
                                            size='small'
                                            margin='normal'
                                            value={form.dest}
                                            disabled={isSubmitting}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                    </React.Fragment>
                                }

                                {component === 'Software Install' || component === 'Software Problem' ?
                                    <TextField
                                        id='software'
                                        type='text'
                                        name='software'
                                        label='Software Name'
                                        variant='outlined'
                                        size='small'
                                        margin='normal'
                                        value={form.software}
                                        disabled={isSubmitting}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                    : null}

                                {component === 'Printer Repair' &&
                                    <Autocomplete
                                        id="printer"
                                        options={printerTypes}
                                        getOptionLabel={(option) => option.title}
                                        getOptionSelected={(option) => option.title === component}
                                        onChange={handlePrinterChange}
                                        renderInput={(params) => <TextField {...params} label="Printer Category" variant="outlined" size='small' disabled={isSubmitting} fullWidth margin='normal' />}
                                    />}
                                <TextField
                                    id="detail"
                                    name="detail"
                                    label="Problem Details"
                                    variant="outlined"
                                    size='small'
                                    margin='normal'
                                    rows={4}
                                    value={form.detail}
                                    disabled={isSubmitting}
                                    onChange={handleChange}
                                    multiline
                                    fullWidth
                                />
                                <FormHelperText>{helperText}</FormHelperText>
                                <FormHelperText>{error}</FormHelperText>
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
                        <ListTicket />
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    )
}

const mapStateToPros = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToPros)(Home);