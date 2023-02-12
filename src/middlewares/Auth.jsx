import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

export default function Auth() {
    const { user } = useContext(UserContext);

    if (!user) {
        return <Navigate to="/signin" />
    }
    return <div><Outlet /></div>

}
