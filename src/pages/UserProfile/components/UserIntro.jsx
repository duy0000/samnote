import React, { useState, useEffect, useRef, useContext } from 'react'
import { Box, Typography, Button } from '@mui/material'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import GroupIcon from '@mui/icons-material/Group'
import ModalChat from '../../../share/ModalChat'
import api from '../../../api'
import { getFormattedDate, handleErrorAvatar } from '../../../utils/utils'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../../context'

const UserIntro = ({ userInfomations }) => {
 const appContext = useContext(AppContext)
 const { user, socket } = appContext
 const [isModalMess, setIsModalMessage] = useState(false)
 const [dataMess, setDataMess] = useState([])
 const messageIconRef = useRef(null)
 const navigate = useNavigate()

 useEffect(() => {
  if (!socket) return

  fetchAllDataMess()

  socket.on('send_message', (newMessage) => {
   console.log('New message received:', newMessage)
   fetchAllDataMess()
  })

  return () => {
   socket.off('send_message', fetchAllDataMess)
  }
 }, [socket])

 const fetchAllDataMess = async () => {
  const response = await api.get(
   `https://samnote.mangasocial.online/message/list_user_chat1vs1/${userInfomations.id}`
  )
  if (response && response.data.status === 200) {
   setDataMess(response.data.data)

   response.data.data.map((item) =>
    socket.emit('join_room', { room: item.idRoom })
   )
  }
 }

 const handleMess = () => {
  setIsModalMessage(!isModalMess)
 }

 console.log('dataMess', dataMess)

 return (
  <div className='intro-user w-full h-auto'>
   <div className='cover-photo-container relative'>
    <img
     src={userInfomations.AvtProfile}
     alt='cover photo'
     className='w-full lg:h-[500px] h-[300px] object-fit-cover cover-photo'
     style={{ filter: 'brightness(0.9)' }}
    />
    {user.id === userInfomations.id && (
     <Box
      className='position-absolute flex justify-end w-full px-5'
      style={{
       top: '25%',
       left: '0',
      }}
     >
      <Box className='flex align-items-center'>
       <div
        className='infomation text-white mr-5'
        style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)' }}
       >
        <Typography className='font-bold text-2xl md:text-3xl text-capitalize'>
         Hello {userInfomations.name} !
        </Typography>
        <Typography className='text-base md:text-xl'>
         {getFormattedDate(new Date())}
        </Typography>
       </div>
       <Box className='flex align-items-center'>
        <div
         className='flex align-items-center rounded-circle p-2 me-2'
         style={{ cursor: 'pointer', height: '39px' }}
        >
         <svg
          className='w-6 h-6 md:w-7 md:h-7'
          fill='#fff'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 448 512'
         >
          <path d='M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z' />
         </svg>
        </div>
        <div className='position-relative'>
         <div
          className='d-flex align-items-center p-2 cursor-pointer rounded-circle'
          onClick={handleMess}
          style={{ height: '39px' }}
          ref={messageIconRef}
         >
          <svg
           className='w-6 h-6 md:w-7 md:h-7'
           viewBox='0 0 48 48'
           fill='none'
           xmlns='http://www.w3.org/2000/svg'
          >
           <g clipPath='url(#clip0_295_3410)'>
            <path
             d='M0.00198132 23.278C0.00198132 9.898 10.482 0 24.002 0C37.522 0 48 9.9 48 23.278C48 36.656 37.52 46.554 24 46.554C21.58 46.554 19.24 46.234 17.06 45.634C16.6345 45.5195 16.1825 45.5548 15.78 45.734L11 47.834C10.7118 47.9623 10.3965 48.0176 10.0819 47.995C9.76732 47.9724 9.46312 47.8727 9.19622 47.7047C8.92931 47.5366 8.70791 47.3054 8.5516 47.0315C8.39528 46.7575 8.30887 46.4493 8.29998 46.134L8.15998 41.854C8.14913 41.5961 8.08694 41.343 7.97704 41.1095C7.86715 40.876 7.71176 40.6667 7.51998 40.494C5.11521 38.324 3.20093 35.6661 1.90487 32.6977C0.608801 29.7293 -0.0392407 26.5187 0.00398132 23.28L0.00198132 23.278ZM16.642 18.898L9.60198 30.098C8.90198 31.158 10.242 32.376 11.242 31.598L18.822 25.858C19.342 25.458 20.022 25.458 20.562 25.858L26.162 30.058C27.842 31.318 30.242 30.858 31.362 29.098L38.402 17.898C39.102 16.838 37.762 15.638 36.762 16.398L29.182 22.138C28.682 22.538 27.982 22.538 27.462 22.138L21.862 17.938C21.4637 17.6372 21.0073 17.4224 20.5216 17.3074C20.036 17.1924 19.5317 17.1796 19.0408 17.2698C18.55 17.3601 18.0832 17.5515 17.6703 17.8318C17.2573 18.1121 16.9071 18.4752 16.642 18.898Z'
             fill='#fff'
            />
           </g>
           <defs>
            <clipPath id='clip0_295_3410'>
             <rect width='48' height='48' fill='white' />
            </clipPath>
           </defs>
          </svg>
         </div>
         <div className='absolute top-[15%] left-[85%] translate-middle badge rounded-pill bg-danger'>
          {dataMess.filter((mess) => !mess.is_seen && mess.idSend !== user?.id)
           .length || 0}
         </div>
         {isModalMess && (
          <ModalChat
           dataMess={dataMess}
           setIsModalMessage={setIsModalMessage}
           messageIconRef={messageIconRef}
          />
         )}
        </div>
       </Box>
      </Box>
     </Box>
    )}
   </div>
   <div
    className='info-user-container w-full flex md:items-center items-start justify-between 
                                md:flex-row flex-col px-12 py-8 relative gap-2'
   >
    <div className='info-user flex items-center gap-2 w-full md:max-w-[80%]'>
     <div className='avartar-user relative'>
      <img
       src={
        userInfomations.Avarta
         ? userInfomations.Avarta
         : '/src/assets/avatar-default.png'
       }
       alt=''
       className='w-20 h-20 md:w-28 md:h-28 rounded-full object-cover'
       onError={handleErrorAvatar}
      />
      <div className='absolute bottom-1 right-1 bg-green-500 w-5 h-5 md:w-7 md:h-7 rounded-full'></div>
     </div>
     <Box className='text-white flex-1 truncate-text'>
      <Typography className='name-user font-bold mb-1 text-3xl md:text-4xl truncate-text text-capitalize'>
       {userInfomations.name}
      </Typography>
      <Typography className='date-joined text-base md:text-xl'>
       Join at {getFormattedDate(userInfomations.createAccount)}
      </Typography>
     </Box>
    </div>

    {user.id !== userInfomations.id && (
     <div className='actions-user flex gap-2 mt-2'>
      {/* <Button variant="contained" color="primary" style={{ textTransform: 'none' }}>
                            <GroupAddIcon className='mr-2' />
                            Add to your group
                        </Button> */}
      <Button
       variant='contained'
       color='primary'
       style={{ textTransform: 'none' }}
       onClick={() => navigate(`/messages/chat/${userInfomations.id}`)}
      >
       <svg
        className='mr-2'
        width='20'
        height='20'
        fill='#fff'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 512 512'
       >
        <path d='M256.6 8C116.5 8 8 110.3 8 248.6c0 72.3 29.7 134.8 78.1 177.9 8.4 7.5 6.6 11.9 8.1 58.2A19.9 19.9 0 0 0 122 502.3c52.9-23.3 53.6-25.1 62.6-22.7C337.9 521.8 504 423.7 504 248.6 504 110.3 396.6 8 256.6 8zm149.2 185.1l-73 115.6a37.4 37.4 0 0 1 -53.9 9.9l-58.1-43.5a15 15 0 0 0 -18 0l-78.4 59.4c-10.5 7.9-24.2-4.6-17.1-15.7l73-115.6a37.4 37.4 0 0 1 53.9-9.9l58.1 43.5a15 15 0 0 0 18 0l78.4-59.4c10.4-8 24.1 4.5 17.1 15.6z' />
       </svg>
       Messenger
      </Button>
      {/* <Button variant="contained" color="primary" style={{ textTransform: 'none' }}>
                            <GroupIcon className='mr-2' />
                            Create group
                        </Button> */}
     </div>
    )}
   </div>
  </div>
 )
}

export default UserIntro
