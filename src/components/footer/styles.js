import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    footer: {
        width: '100vw',
        minHeight: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.grey[200]
    }
}));

export default useStyles;