import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 295,
        margin: theme.spacing(2)
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2)
    },
    media: {
        height: 180,
        width: 180,
        borderRadius: '50%',
    },
    header: {
        borderBottom: '1px solid #ccc'
    },
    content: {
        textAlign: 'center'
    }, fab: {
        position: 'absolute',
        right: theme.spacing(2),
        bottom: theme.spacing(2)
    }
}));

export default useStyles;
