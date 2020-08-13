import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    container: {
        minHeight: '84vh',
        padding: theme.spacing(15)
    },
    hideInputFile: {
        display: 'none'
    },
    uploadFotoProduk: {
        textAlign: 'center',
        marginLeft: theme.spacing(4)
    },
    previewFotoProduk: {
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        marginBottom: theme.spacing(2)
    },
    iconRight: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(0.5)
    },
    form: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4)
    }

}))

export default useStyles;