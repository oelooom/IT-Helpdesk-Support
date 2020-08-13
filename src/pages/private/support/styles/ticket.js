import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
    topContainer: {
        minHeight: '85vh',
        minWidth: '85vh',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gridItem: {
        borderRight: '1px solid #ccc',
        height: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    gridItemm: {
        height: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        textAlign: 'center'
    },
    paper: {
        padding: theme.spacing(4),
        textAlign: 'center',
        width: 350,
        marginRight: theme.spacing(6)
    },
    formContainer: {
        marginTop: theme.spacing(1)
    },
    buttonGroup: {
        marginTop: theme.spacing(2),
        justifyContent: 'space-between'
    },
}));

export default useStyles;