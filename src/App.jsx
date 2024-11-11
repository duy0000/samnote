import { useContext, useEffect, useState } from 'react'

import { Alert, Snackbar } from '@mui/material'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppContext } from './context'

import RootLayout from './layout/RootLayout'

import AuthLayout from './layout/AuthLayout/AuthLayout'
import ForgotPassword from './layout/AuthLayout/ForgotPassword'
import Register from './layout/AuthLayout/Register'
import SignIn from './layout/AuthLayout/SignIn'
import {
 AnonymousMessage,
 CreateNote,
 Dustbin,
 FormEdit,
 EditNote,
 EditNoteLayout,
 Group,
 Home,
 Photo,
 //  UserSetting,
 Sketch,
 UserProfile,
 SearchResults,
} from './pages'

import UserSetting from './pages/Setting/UserSetting'
import MainMessage from './pages/Group/MainMessage/MainMessage'
import ShareNote from './pages/ShareNote/ShareNote'

const AppSnackbar = () => {
 const appContext = useContext(AppContext)
 const { snackbar, setSnackbar } = appContext
 const { isOpen, message, severity } = snackbar

 const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') {
   return
  }

  setSnackbar({ isOpen: false, message: '', severity: '' })
 }

 return (
  <Snackbar open={isOpen} autoHideDuration={1000} onClose={handleCloseSnackbar}>
   <Alert
    onClose={handleCloseSnackbar}
    severity={severity}
    variant='filled'
    sx={{ width: '100%' }}
   >
    {message}
   </Alert>
  </Snackbar>
 )
}

function App() {
 const [isScreenMd, setIsScreenMd] = useState(
  window.matchMedia('(min-width: 768px)').matches
 )
 const [isScreenXl, setIsScreenXl] = useState(
  window.matchMedia('(min-width: 1280px)').matches
 )

 useEffect(() => {
  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
   e.matches ? setIsScreenMd(true) : setIsScreenMd(false)
  })

  window.matchMedia('(min-width: 1280px)').addEventListener('change', (e) => {
   e.matches ? setIsScreenXl(true) : setIsScreenXl(false)
  })
 }, [])

 return (
  <main>
   <AppSnackbar />
   <Routes>
    <Route path='/auth' element={<AuthLayout />}>
     <Route path='signin' element={<SignIn />} />
     <Route path='register' element={<Register />} />
     <Route path='forgot-password' element={<ForgotPassword />} />
    </Route>

    <Route path='/' exact element={<Home />} />
    <Route path='*' element={<Navigate replace to='/' />} />

    <Route path='/share-note/:id' element={<ShareNote />} />

    <Route element={<RootLayout />}>
     <Route path='/incognito'>
      <Route index element={<AnonymousMessage />} />
      <Route path='anonymous/:id' element={<AnonymousMessage />} />
      <Route path='user/:id' element={<AnonymousMessage />} />
     </Route>

     <Route path='/editnote' exact element={<EditNoteLayout />}>
      <Route index element={<EditNote />} />
      <Route path=':id' element={isScreenXl ? <EditNote /> : <FormEdit />} />
     </Route>

     <Route path='/messages'>
      <Route index element={<Group />} />
      <Route
       path='chat/:id'
       element={isScreenMd ? <Group /> : <MainMessage />}
      />
      <Route
       path='group/:id'
       element={isScreenMd ? <Group /> : <MainMessage />}
      />
     </Route>
     {/* ................................ */}
     <Route path='/setting' element={<UserSetting />} />
     <Route path='/search-results' element={<SearchResults />} />
     <Route path='/photo' element={<Photo />} />
     <Route path='/profile/:id' element={<UserProfile />} />
     <Route path='/create-note' element={<CreateNote />} />
     <Route path='/sketch' element={<Sketch />} />
     <Route path='/dustbin' element={<Dustbin />} />
     <Route path='/dustbin/:id' element={<Dustbin />} />
    </Route>
   </Routes>
  </main>
 )
}

export default App
