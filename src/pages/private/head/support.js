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
import { addSupport, removeSupport } from '../../../redux/user/userAction';
import AddDialog from './dialog';



function Support({ addSupport, removeSupport, support }) {

    const classes = useStyles();
    const [openAddDialod, setAddDialog] = useState(false);

    const handleDialog = (data) => {
        setAddDialog(data);
    }

    useEffect(() => {
        async function getData() {
            const supportRef = firestore.collection('users').where('isSupport', '==', true);
            supportRef.onSnapshot(snap => {
                const changes = snap.docChanges();
                changes.forEach(change => {
                    if (change.type === 'added') {
                        addSupport({ id: change.doc.id, ...change.doc.data() })
                    }
                    else if (change.type === 'modified') {
                        addSupport({ id: change.doc.id, ...change.doc.data() })
                    }
                    else if (change.type === 'removed') {
                        removeSupport({ id: change.doc.id, ...change.doc.data() });

                    }
                })
            })
        }
        getData();
    }, [addSupport, removeSupport])

    return (
        <React.Fragment>
            {support.map((data, index) => {
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
                                {data.displayName} is an IT Support who works for CIMB Niaga, he has helped many users in dealing with the problems they face.
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
    support: state.user.support
})

const mapDispatchToprops = dispatch => ({
    addSupport: support => dispatch(addSupport(support)),
    removeSupport: support => dispatch(removeSupport(support))
})

export default connect(mapStateToProps, mapDispatchToprops)(Support);