import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

export default function Guest() {
    const { user } = useContext(UserContext);

    if (user) {
        return <Navigate to="/" />
    }
    return <div><Outlet /></div>

}
