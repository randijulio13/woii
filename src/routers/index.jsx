import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from '../middlewares/Auth'
import Guest from '../middlewares/Guest'
import Create from '../views/Create'
import Home from '../views/Home'
import Profile from '../views/Profile'
import SignIn from '../views/SignIn'
import Test from '../views/Test'

export default function index() {
  return (
    <Routes>
      <Route element={<Auth />}>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/test" element={<Test />} />
        <Route path="/:userName" element={<Profile />} />
      </Route>
      <Route element={<Guest />}>
        <Route path="/signin" element={<SignIn />} />
      </Route>
    </Routes>
  )
}
