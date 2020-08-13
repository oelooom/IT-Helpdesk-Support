import React, { useEffect } from 'react';
import clsx from 'clsx';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import useStyles from './styles/detailticket';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { connect } from 'react-redux';
import { addSelectedTicket, addCommentary } from '../../../redux/ticket/ticketAction';
import Repair from '../../../assets/illustration.png';
import { firestore } from '../../../config/firebase';
import { createCommentary } from '../../../config/post/ticket';
import { useSnackbar } from 'notistack';


function DetailTicket({ addSelectedTicket, selectedTicket, match, addCommentary, commentary, currentUser }) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [form, setForm] = React.useState(null);
    const [commentaryForm, setCommentaryForm] = React.useState('');
    const { enqueueSnackbar } = useSnackbar();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        async function getData() {
            const ticketRef = firestore.doc(`ticket/${match.params.ticketId}`);
            console.log(ticketRef);
            ticketRef.onSnapshot(async snapshot => {
                console.log(snapshot);
                addSelectedTicket({
                    id: snapshot.id,
                    ...snapshot.data()
                })
                setForm({
                    id: snapshot.id,
                    ...snapshot.data()
                })
            })

            const commentaryRef = firestore.collection('ticket').doc(match.params.ticketId).collection('commentary').where('ticketId', '==', `${match.params.ticketId}`);

            commentaryRef.onSnapshot(async snap => {
                const changes = snap.docChanges();
                changes.forEach(change => {
                    console.log(change);
                    if (change.type === 'added') {
                        addCommentary({ id: change.doc.id, ...change.doc.data() })
                    }
                })
            })

        }

        getData();
    }, [addSelectedTicket, match.params.ticketId, addCommentary])

    let date;
    let status;
    if (form) {
        const dateData = new Date(form.created.seconds * 1000).toString().replace('GMT+0700 (Western Indonesia Time)', '');
        date = dateData.slice(4, 15);

        if (form.status === '1') {
            status = 'Received'
        } else if (form.status === '2') {
            status = `Assigned To ${form.supportData.displayName}`
        } else if (form.status === '3') {
            status = `Troubleshoot by ${form.supportData.displayName} `
        } else if (form.status === '4') {
            status = `Finish `
        } else if (form.status === '5') {
            status = 'Lending Accepted'
        } else if (form.status === '6') {
            status = 'Returned'
        } else {
            status = `Rejected By IT Dept`
        }
    }

    const handleCommentary = (e) => {
        setCommentaryForm(e.target.value)
    }

    const handleSubmitCommentary = async e => {
        e.preventDefault();

        let data = {
            ticketId: form.id,
            userId: currentUser.id,
            displayName: currentUser.displayName,
            photoUrl: currentUser.photoUrl,
            commentary: commentaryForm
        }

        try {
            await createCommentary(data)
            setCommentaryForm('');
            enqueueSnackbar('Your comment has been added', { variant: 'success' });
        } catch (e) {
            alert(e.message)
        }
    }

    return (
        <Container className={classes.container}>
            <Card className={classes.root} elevation={2}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="data" className={classes.avatar}>
                            {form ? <img src={form && form.userdata.photoUrl} alt='account-phptp' className={classes.photo} /> : 'U'}
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={form && form.userdata.displayName}
                    subheader={date}
                />
                <CardMedia
                    className={classes.media}
                    image={Repair}
                    title="Paella dish"
                />
                <CardContent>
                    <Typography variant="body1" color="textSecondary" component="p">
                        {form && form.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" className={classes.detail}>
                        {form && form.detail}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <span className={classes.span}> {form && form.ip ? ` IP Address: ${form.ip}  ` : null}</span>
                        {form && form.software ? <span className={classes.span}>{form && form.software ? `Software: ${form.software}  ` : null}</span> : null}
                        {form && form.source ? <span className={classes.span}>{form && form.source ? `IP Source: ${form.source}  ` : null}</span> : null}
                        {form && form.destination ? <span className={classes.span}>{form && form.destination ? `IP destination: ${form.destination}  ` : null}</span> : null}
                        {form && form.printer ? <span className={classes.span}>{form && form.printer ? `Priter Category: ${form.printer}  ` : null}</span> : null}
                        {form && form.status ? <span className={classes.span}>{form && form.status ? `Status: ${status}  ` : null}</span> : null}
                    </Typography>
                </CardContent>
                <CardActions>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph>Komentar:</Typography>
                        <form className={classes.formContainer} onSubmit={handleSubmitCommentary}>
                            <TextField
                                id="detail"
                                name="detail"
                                label="Problem Details"
                                variant="outlined"
                                size='small'
                                rows={4}
                                value={commentaryForm}
                                onChange={handleCommentary}
                                multiline
                                fullWidth
                                required
                            />
                            <Button className={classes.alignRight} type='submit' variant='contained' color='primary' size='small' margin='normal'>Post</Button>
                        </form>
                        <Grid container>

                            <Grid item >
                                {commentary && commentary.sort((a, b) => new Date(b.created.seconds * 1000) - new Date(a.created.seconds * 1000)).map((item, index) => {
                                    const dateData = new Date(item.created.seconds * 1000).toString().replace('GMT+0700 (Western Indonesia Time)', '');
                                    const hour = dateData.slice(16, 24);
                                    return (
                                        <CardHeader
                                            key={index}
                                            title={`${item.displayName} (Posted on: ${hour})`}
                                            subheader={`${item.commentary}`}
                                            avatar={
                                                <Avatar aria-label="data" className={classes.avatar}>
                                                    {form ? <img src={item.photoUrl} alt='account-phptp' className={classes.photo} /> : 'U'}
                                                </Avatar>
                                            }
                                        />
                                    )
                                })}
                            </Grid>


                        </Grid>
                    </CardContent>
                </Collapse>
            </Card>
        </Container>
    );
}

const mapStateToProps = state => ({
    selectedTicket: state.ticket.selectedTicket,
    commentary: state.ticket.commentary,
    currentUser: state.user.currentUser
})

const mapDispatchToProps = dispatch => ({
    addSelectedTicket: ticket => dispatch(addSelectedTicket(ticket)),
    addCommentary: commentary => dispatch(addCommentary(commentary))
})

export default connect(mapStateToProps, mapDispatchToProps)(DetailTicket);