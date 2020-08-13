import React from 'react';
import clsx from 'clsx';
import useStyles from './styles'
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SignOutIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import CallToActionIcon from '@material-ui/icons/CallToAction';
import GroupIcon from '@material-ui/icons/Group';
import SdStorageIcon from '@material-ui/icons/SdStorage';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SettingIcon from '@material-ui/icons/Settings';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useFirebase } from '../../../config/firebase';
import AppLoading from '../../../components/AppLoading';
import Dashboard from './dashboard';
import User from './user';
import Ticket from './ticket';
import Instruction from './instruction';
import Asset from './asset';
import Setting from './setting';
import DetailTicket from './detailticket';
import { auth } from '../../../config/firebase';
import { connect } from 'react-redux';


function ITSupport({ currentUser, history, location }) {
    const classes = useStyles();
    const { user } = useFirebase();
    const [open, setOpen] = React.useState(true);

    if (!user) {
        return <Redirect to={{ pathname: '/', state: { from: location } }} />
    }

    if (!currentUser) {
        return <AppLoading />
    }

    if (currentUser.isHead) {
        history.push('/head')
    } else if (currentUser.isUser) {
        history.push('/user')
    }


    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };


    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        <Switch>
                            <Route exact path='/support' children='Dashboard' />
                            <Route path='/support/user' children='User Management' />
                            <Route path='/support/ticket:ticketId' children='Tikcet Management' />
                            <Route path='/support/ticket' children='Tikcet Management' />
                            <Route path='/support/instruction' children='Lending Management' />
                            <Route path='/support/asset' children='Asset Management' />
                            <Route path='/support/setting' children='Account Setting' />
                        </Switch>
                    </Typography>
                    <IconButton color="inherit" onClick={() => auth.signOut()}>
                        <SignOutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <Typography variant='h5' className={classes.toolbarIconText}>IT Support Pages</Typography>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <Route exact path='/support' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/support')}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary='Dashboard' />
                        </ListItem>)
                    }} />
                    <Route path='/support/user' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/support/user')}>
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary='User Management' />
                        </ListItem>)
                    }} />
                    <Route path='/support/ticket' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/support/ticket')}>
                            <ListItemIcon>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText primary='Tikcet' />
                        </ListItem>)
                    }} />
                    <Route path='/support/instruction' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/support/instruction')}>
                            <ListItemIcon>
                                <SdStorageIcon />
                            </ListItemIcon>
                            <ListItemText primary='Work Instruction' />
                        </ListItem>)
                    }} />
                    <Route path='/support/asset' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/support/asset')}>
                            <ListItemIcon>
                                <CallToActionIcon />
                            </ListItemIcon>
                            <ListItemText primary='Asset Management' />
                        </ListItem>)
                    }} />
                    <Route path='/support/setting' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/support/setting')}>
                            <ListItemIcon>
                                <SettingIcon />
                            </ListItemIcon>
                            <ListItemText primary='Pengaturan' />
                        </ListItem>)
                    }} />
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Switch>
                        <Route path='/support/user' component={User} />
                        <Route path='/support/ticket/:ticketId' component={DetailTicket} />
                        <Route path='/support/ticket' component={Ticket} />
                        <Route path='/support/instruction' component={Instruction} />
                        <Route path='/support/setting' component={Setting} />
                        <Route path='/support/asset' component={Asset} />
                        <Route component={Dashboard} />
                    </Switch>
                </Container>
            </main>
        </div>
    );
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(ITSupport);