import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    gridItem: {
        height: '85vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paper: {
        minHeight: '400px',
        width: '400px',
        padding: theme.spacing(3),
        paddingTop: theme.spacing(8),
        textAlign: 'center'
    },
    formContainer: {
        marginTop: theme.spacing(3)
    },
    buttonGroup: {
        marginTop: theme.spacing(3),
        justifyContent: 'space-between'
    },
    forgotPassword: {
        marginTop: theme.spacing(3),
        textAlign: 'left',
        textDecoration: 'none'
    },
    illustration: {
        width: '550px',
        height: '500px'
    }
}))

export default useStyles;