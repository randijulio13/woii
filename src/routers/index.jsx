import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from '../middlewares/Auth'
import Guest from '../middlewares/Guest'
import Create from '../views/Create'
import Home from '../views/Home'
import NoMatch from '../views/NoMatch'
import Pin from '../views/Pin'
import Profile from '../views/Profile'
import SignIn from '../views/SignIn'

export default function index() {
  return (
    <Routes>
      <Route element={<Auth />}>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/pin/:pinId" element={<Pin />} />
      </Route>
      <Route element={<Guest />}>
        <Route path="/signin" element={<SignIn />} />
      </Route>
      <Route element={<Auth />}>
        <Route path="/profile/:userName?" element={<Profile />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  )
}
