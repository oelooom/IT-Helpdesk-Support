import React from 'react';

// Material UI
import { CircularProgress } from '@material-ui/core';
import useStyles from './styles';

function AppPageLoading() {

    const classes = useStyles();

    return (
        <div className={classes.loadingBox}>
            <CircularProgress />
        </div>
    )
}

export default AppPageLoading;