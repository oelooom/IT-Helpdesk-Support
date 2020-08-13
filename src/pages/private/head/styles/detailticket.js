import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
    container: {
        width: '100vw',
        minHeight: '85vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10vh'
    },
    root: {
        width: 555,
    },
    media: {
        height: 250,
        paddingTop: '30%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: '50%'
    },
    span: {
        paddingRight: theme.spacing(1)
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    alignRight: {
        marginTop: theme.spacing(1),
        textAlign: 'rigth'
    }
}));

export default useStyles;