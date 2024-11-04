import { useNavigate, NavLink } from 'react-router-dom'
import IconChatUnknow from '../assets/iconChatUnknow'
import IconCreateNewNote from '../assets/iconCreateNewNote'
import IconLogout from '../assets/iconLogout'
import CloseIcon from '@mui/icons-material/Close'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import EventNoteIcon from '@mui/icons-material/EventNote'
import GroupIcon from '@mui/icons-material/Group'
import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import SearchIcon from '@mui/icons-material/Search'
import SettingsIcon from '@mui/icons-material/Settings'
import { Box, Slide, Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

import { useContext, useEffect, useState } from 'react'
import api from '../api'
import '../App.css'
import { AppContext } from '../context'
import { handleLogOut } from '../utils/utils'
import avatarDefault from '../assets/avatar-default.png'

const UserPanel = () => {
 const appContext = useContext(AppContext)
 const { user, setUser } = appContext
 const [userInfomations, setUserInformations] = useState(null)
 const navigate = useNavigate()
 const [open, setOpen] = useState(false)
 const [changeStatus, setChangeStatus] = useState(
  window.innerWidth >= 992 ? 'white' : 'black'
 )
 useEffect(() => {
  const handleResize = () => {
   setChangeStatus(window.innerWidth >= 992 ? 'white' : 'black')
  }
  window.addEventListener('resize', handleResize)
  return () => {
   window.removeEventListener('resize', handleResize)
  }
 }, [])

 const handleToggle = () => {
  setOpen(!open)
 }
 const navbarItems = [
  {
   name: 'Profile',
   icon: (
    <img
     src={userInfomations ? userInfomations.Avarta : avatarDefault}
     alt=''
     className='img-user-panel rounded-full size-[50px] xl:size-[70px]'
    />
   ),
   url: `/profile/${user.id}`,
  },
  {
   name: 'Find Note',
   icon: <SearchIcon className='mr-1 text-white size-[25px] xl:size-[30px]' />,
   url: 'search-results',
  },
  {
   name: 'Create Note',
   icon: (
    <div className='bg-[#198E39] rounded-full w-[100px] h-[50px] items-center flex justify-center'>
     <IconCreateNewNote className='size-[20px] xl:size-[25px]' />
     <span className='text-[15px] xl:text-[20px] pl-1'>new</span>
    </div>
   ),
   url: '/create-note',
  },
  {
   name: 'Home Page',
   icon: <HomeIcon className='size-[25px] lg:size-[30px]' />,
   url: '/',
  },
  {
   name: 'Photos',
   icon: <PhotoLibraryIcon className='size-[25px] lg:size-[30px]' />,
   url: '/photo',
  },
  {
   name: 'Note',
   icon: <EventNoteIcon className='size-[25px] lg:size-[30px]' />,
   url: `/editnote?page=1`,
  },
  {
   name: 'Message',
   icon: <GroupIcon className='size-[25px] lg:size-[30px]' />,
   url: '/messages',
  },

  {
   name: 'incognito',

   icon: (
    <IconChatUnknow
     className='size-[25px] lg:size-[30px] '
     fill={changeStatus}
    />
   ),
   url: '/incognito',
   state: { userInfomations: null },
  },

  {
   name: 'Dustbin',
   icon: <DeleteIcon className='size-[25px] lg:size-[30px]' />,
   url: '/dustbin?page=1',
  },

  {
   name: 'Sketch',
   icon: <DriveFileRenameOutlineIcon className='size-[25px] lg:size-[30px]' />,
   url: '/sketch',
  },
  {
   name: 'setting',
   icon: <SettingsIcon className='size-[25px] lg:size-[30px]' />,
   url: '/setting',
  },
 ]

 useEffect(() => {
  let ignore = false
  const getUserInformation = async (userID) => {
   try {
    const res = await api.get(
     `https://samnote.mangasocial.online/profile/${userID}`
    )
    if (!ignore) {
     setUserInformations(res.data.user)
    }
   } catch (err) {
    console.log(err)
   }
  }

  user && getUserInformation(user.id)

  return () => {
   ignore = true
  }
 }, [user])

 return (
  <Box id='navbar' className='gap-[10px]'>
   <NavLink
    to={`/profile/${user.id}`}
    className='flex items-center cursor-pointer lgEqual:hidden block'
    onClick={() => navigate(`/profile/${user.id}`)}
   >
    <img
     src={userInfomations ? userInfomations.Avarta : avatarDefault}
     alt=''
     className='rounded-full size-[50px] lg:size-[60px] xl:size-[80px]'
    />
   </NavLink>
   {navbarItems.map((item, idx) => (
    <NavLink
     to={item.url}
     key={idx}
     className='cursor-pointer item-navbar lgEqual:block'
     title={item.name}
     onClick={() => {
      if (item.state) {
       navigate(item.url, { state: item.state })
      } else {
       navigate(item.url)
      }
     }}
    >
     <span className='item-icon-panel  text-white'>{item.icon}</span>
     <span className='item-name-panel text-[25px] capitalize'>{item.name}</span>
    </NavLink>
   ))}
   <Button
    className='hidden lgEqual:block'
    onClick={() => {
     const submit = confirm('Do you want to logout?')
     if (submit) {
      setUser(null)
      handleLogOut()
     }
    }}
   >
    <IconLogout className='size-[25px] lgEqual:size-[30px] xl:size-[35px] ' />
   </Button>
   <MenuIcon
    onClick={handleToggle}
    className='lgEqual:hidden block text-black text-[25px] cursor-pointer'
   />
   {open && (
    <div
     style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
     }}
     onClick={handleToggle}
    ></div>
   )}
   <Slide
    // timeout={1000}
    direction='right'
    in={open}
    mountOnEnter
    unmountOnExit
    id='navbar-mobile'
    className='fixed top-0 left-0 w-[200px] bottom-0 bg-[#F56852] pt-[80px]'
   >
    <div
     className='relative  text-white  h-[100vh]  flex items-lgEqual-center flex-col '
     onClick={(event) => {
      event.stopPropagation()
     }}
    >
     <span
      style={{
       position: 'absolute',
       top: 5,
       right: 5,
       backgroundColor: '#fff',
       color: '#000',
       cursor: 'pointer',
      }}
      onClick={handleToggle}
     >
      <CloseIcon />
     </span>
     {navbarItems.slice(3).map((item, idx) => (
      <NavLink
       to={item.url}
       key={idx}
       className='item-mobile cursor-pointer lgEqual:block items-center flex w-full justify-start py-[10px] px-[5px]'
       title={item.name}
       onClick={() => {
        if (item.state) {
         navigate(item.url, { state: item.state })
        } else {
         navigate(item.url)
        }
       }}
      >
       <span className='text-black mr-3 fw-bold'>{item.icon}</span>
       <span className='text-black capitalize fw-bold'>{item.name}</span>
      </NavLink>
     ))}
     <button
      className='item-mobile flex text-black fw-bold py-[10px] px-[5px]'
      onClick={() => {
       const submit = confirm('Do you want to logout?')
       if (submit) {
        setUser(null)
        handleLogOut()
       }
      }}
     >
      <IconLogout
       className=' fw-bold size-[25px] lgEqual:size-[30px] xl:size-[35px] mr-3 '
       fill='black'
      />
      Logout
     </button>
    </div>
   </Slide>
  </Box>
 )
}

export default UserPanel
