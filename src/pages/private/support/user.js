import React, { useEffect, useState } from 'react';
import useStyles from './styles/support'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { firestore } from '../../../config/firebase';
import { connect } from 'react-redux';
import { addUser, removeUser } from '../../../redux/user/userAction';
import AddDialog from './dialog';



function User({ addUser, removeUser, user }) {

    const classes = useStyles();
    const [openAddDialod, setAddDialog] = useState(false);

    const handleDialog = (data) => {
        setAddDialog(data);
    }

    useEffect(() => {
        async function getData() {
            const userRef = firestore.collection('users').where('isUser', '==', true);
            userRef.onSnapshot(snap => {
                const changes = snap.docChanges();
                changes.forEach(change => {
                    if (change.type === 'added') {
                        addUser({ id: change.doc.id, ...change.doc.data() })
                    }
                    else if (change.type === 'modified') {
                        addUser({ id: change.doc.id, ...change.doc.data() })
                    }
                    else if (change.type === 'removed') {
                        removeUser({ id: change.doc.id, ...change.doc.data() });

                    }
                })
            })
        }
        getData();
    }, [addUser, removeUser])

    return (
        <React.Fragment>
            {user.map((data, index) => {
                return (
                    <Card className={classes.root} key={index} elevation={2}>
                        <CardHeader
                            avatar={
                                <Avatar aria-label="recipe" className={classes.avatar}>
                                    {data.displayName.charAt(0)}
                                </Avatar>
                            }
                            title={data.displayName}
                            subheader={data.email}
                            className={classes.header}
                        />
                        <CardActionArea className={classes.container}>

                            <CardMedia
                                className={classes.media}
                                image={data.photoUrl}
                                title="Contemplative Reptile"
                            />
                        </CardActionArea>
                        <CardContent className={classes.content}>
                            <Typography gutterBottom variant="h6" component="h2">
                                {data.displayName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {data.displayName} is an Employee who works for CIMB Niaga.
                                </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary">
                                Resign
                            </Button>
                            <Button size="small" color="primary">
                                Data Tickets
                            </Button>
                        </CardActions>
                    </Card>
                )
            })}

            <Fab className={classes.fab} color='primary' onClick={() => setAddDialog(true)} >
                <AddIcon />
            </Fab>

            <AddDialog open={openAddDialod} closeDialog={handleDialog} handleClose={() => setAddDialog(false)} />

        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    user: state.user.user
})

const mapDispatchToprops = dispatch => ({
    addUser: user => dispatch(addUser(user)),
    removeUser: user => dispatch(removeUser(user))
})

export default connect(mapStateToProps, mapDispatchToprops)(User);