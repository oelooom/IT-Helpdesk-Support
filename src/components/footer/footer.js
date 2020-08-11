import React from 'react';
import useStyles from './styles';
import Typography from '@material-ui/core/Typography';

const Footer = () => {
    const classes = useStyles();
    return (
        <footer className={classes.footer}>
            <Typography variant="body1">Copyright &copy; 2020 Sistem Informasi IT Helpdesk Support</Typography>
        </footer>
    )

}

export default Footer;