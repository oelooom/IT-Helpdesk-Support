import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    overrides: {
        MuiCssBaseline: {
            '@global': {
                body: {
                    backgroundColor: 'white'
                }
            }
        }
    },
    palette: {
        primary: {
            main: '#1976D2'
        },
        background: {
            paper: '#fff'
        }
    }
})

export default theme;