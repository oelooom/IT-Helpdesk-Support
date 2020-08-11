import React from 'react';
import { auth } from '../../../config/firebase';

const RolesChecking = () => {
    return <input type='button' onClick={() => auth.signOut()} value='logot' />
}

export default RolesChecking;