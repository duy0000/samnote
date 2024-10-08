import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context'
import api from '../../api'
import { Box } from '@mui/material'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'swiper/css'
import './UserProfile.css'

import {
 UserIntro,
 LeftsideContent,
 RightsideContent,
 Footer,
} from './components'

const UserProfile = () => {
 const appContext = useContext(AppContext)
 const { setSnackbar, user } = appContext
 const [userInfomations, setUserInformations] = useState(null)
 const [lastUsers, setLastUsers] = useState([])

 //data note
 const [allNotePublic, setAllNotePublic] = useState([])
 const [userNotes, setUserNotes] = useState([])
 const [archivedNotes, setArchivedNotes] = useState([])

 const [reload, setReload] = useState(0)

 const params = useParams()
 const userID = params.id

 useEffect(() => {
  // let ignore = false
  const getUserInformation = async (userID) => {
   try {
    const res = await api.get(
     `https://samnote.mangasocial.online/profile/${userID}`
    )
    setUserInformations(res.data.user)
    setUserNotes(res.data.note)
    setArchivedNotes(res.data.note.filter((note) => note.inArchived))
   } catch (err) {
    console.log(err)
   }
  }
  getUserInformation(userID)
 }, [userID, reload])

 useEffect(() => {
  fetchLastUsers()
  fetchAllNotePublic()
 }, [])

 const fetchLastUsers = async () => {
  const response = await api.get('/lastUser')
  if (response && response.data.status === 200) {
   setLastUsers(response.data.data)
  }
 }

 const fetchAllNotePublic = async () => {
  try {
   const response = await api.get('/notes_public')
   if (response && response.data.message === 'success') {
    setAllNotePublic(response.data.public_note)
   }
  } catch (err) {
   console.log(err)
  }
 }

 return (
  <Box className='w-full bg-[#4A4B51] h-auto overflow-y-auto'>
   <Box className='w-full bg-[#4A4B51] h-auto'>
    {userInfomations ? (
     <>
      <UserIntro userInfomations={userInfomations} user={user} />
      <div className='container-content row m-auto'>
       <LeftsideContent
        userInfomations={userInfomations}
        archivedNotes={archivedNotes}
        setReload={setReload}
       />
       <RightsideContent
        userInfomations={userInfomations}
        lastUsers={lastUsers}
        allNotePublic={allNotePublic}
        setReload={setReload}
       />
      </div>
      <Footer />
     </>
    ) : (
     <div className='flex justify-center items-center text-2xl font-bold'>
      Not found
     </div>
    )}
   </Box>
  </Box>
 )
}

export default UserProfile
