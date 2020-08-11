import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: '80px',
        color: 'white'
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    topContainer: {
        minHeight: '67vh'
    }
}));

export default useStyles;