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
import AssignmentIcon from '@material-ui/icons/Assignment';
import SettingIcon from '@material-ui/icons/Settings';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Support from './support';
import Ticket from './ticket';
import Lending from './lending';
import Setting from './setting';
import { auth } from '../../../config/firebase';


function Head() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
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
                            <Route exact path='/head' children='Dashboard' />
                            <Route path='/head/support' children='IT Support Management' />
                            <Route path='/head/ticket' children='Tikcet Management' />
                            <Route path='/head/lending' children='Lending Management' />
                            <Route path='/head/setting' children='Account Setting' />
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
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <Route exact path='/head' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/head')}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary='Dashboard' />
                        </ListItem>)
                    }} />
                    <Route path='/head/support' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/head/support')}>
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary='IT Support' />
                        </ListItem>)
                    }} />
                    <Route path='/head/ticket' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/head/ticket')}>
                            <ListItemIcon>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText primary='Tikcet' />
                        </ListItem>)
                    }} />
                    <Route path='/head/lending' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/head/lending')}>
                            <ListItemIcon>
                                <CallToActionIcon />
                            </ListItemIcon>
                            <ListItemText primary='Lending' />
                        </ListItem>)
                    }} />
                    <Route path='/head/setting' children={({ match, history }) => {
                        return (<ListItem button selected={match ? true : false} onClick={() => history.push('/head/setting')}>
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
                        <Route path='/head/support' component={Support} />
                        <Route path='/head/ticket' component={Ticket} />
                        <Route path='/head/lending' component={Lending} />
                        <Route path='/head/setting' component={Setting} />
                        <Route component={Dashboard} />
                    </Switch>
                </Container>
            </main>
        </div>
    );
}

export default Head;