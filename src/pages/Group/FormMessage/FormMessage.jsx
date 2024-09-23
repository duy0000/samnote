import { useState } from 'react'

import uniqid from 'uniqid'

import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react'

import CancelIcon from '@mui/icons-material/Cancel'
import ImageIcon from '@mui/icons-material/Image'
import SendIcon from '@mui/icons-material/Send'
import AddBoxIcon from '@mui/icons-material/AddBox'

import configs from '../../../configs/configs.json'
const { BASE64_URL } = configs

const FormMessage = ({
 userID,
 otherUserID,
 socket,
 formName,
 inputMessageFormRef,
 idGroup,
}) => {
 const [messageForm, setMessageForm] = useState({
  content: '',
  images: [],
  emoji: null,
  showEmoji: false,
 })

 const { content, images, emoji, showEmoji } = messageForm

 const handleChangeValueMsg = (e) => {
  setMessageForm({
   ...messageForm,
   content: emoji ? '' : e.target.value,
   emoji: null,
  })
 }

 const handleChangeImageMsg = (e) => {
  const reader = new FileReader()

  reader.onload = () => {
   // @ts-ignore
   const imageBase64 = reader.result.split(',')[1]
   setMessageForm({
    ...messageForm,
    images: [...images, imageBase64],
   })
  }

  reader.readAsDataURL(e.target.files[0])
  e.target.value = null
 }

 const handleToggleEmoji = () => {
  setMessageForm({
   ...messageForm,
   showEmoji: !showEmoji,
  })
 }

 const handleClickEmoji = (data) => {
  setMessageForm({
   ...messageForm,
   content: data.emoji,
   emoji: convertEmojiToBase64(data.emoji),
   showEmoji: false,
  })
 }

 const sendMessage = (room, data) => {
  if (socket) {
   // * send message chat

   if (formName === 'chat') {
    socket.emit('send_message', { room, data }) // Gửi sự kiện "send_message" tới server

    setMessageForm({
     content: '',
     images: [],
     emoji: null,
     showEmoji: false,
    })

    return
   }

   // * send message group

   if (formName === 'group') {
    // socket.emit('join_room', { room })
    socket.emit('chat_group', { room, data }) // Gửi sự kiện "chat_group" tới server

    setMessageForm({
     content: '',
     images: [],
     emoji: null,
     showEmoji: false,
    })

    return
   }
  } else {
   console.error('Socket.io not initialized.')
   // Xử lý khi socket chưa được khởi tạo
  }
 }
 const handleSubmitMessage = (e) => {
  e.preventDefault()

  // * submit form chat

  if (formName === 'chat') {
   if (!otherUserID) return

   const roomID = roomSplit(userID, otherUserID)

   const dataForm = {
    idSend: `${userID}`,
    idReceive: `${otherUserID}`,
    type: 'text',
    state: '',
    content: content,
   }

   if (images.length > 1) {
    dataForm.type = 'muti-image'
    dataForm.content = emoji ? '' : content
    dataForm.data = images[0]

    sendMessage(roomID, dataForm)
    return
   }

   if (images.length === 1) {
    dataForm.type = 'image'
    dataForm.content = emoji ? '' : content
    dataForm.data = images[0]

    sendMessage(roomID, dataForm)
    console.log('submit')
    return
   }

   if (emoji) {
    dataForm.type = 'icon-image'
    dataForm.content = ''
    dataForm.data = emoji

    sendMessage(roomID, dataForm)
    return
   }

   if (content.trim() !== '') {
    sendMessage(roomID, dataForm)
   }
   return
  }

  // * submit form group chat
  if (formName === 'group' && idGroup) {
   const roomID = idGroup

   const dataForm = {
    idSend: `${userID}`,
    type: 'text',
   }

   if (images.length >= 1) {
    dataForm.type = 'image'
    dataForm.metaData = images[0]

    sendMessage(roomID, dataForm)
    return
   }

//    if (images.length > 1) {
//     dataForm.type = 'image'
//     dataForm.metaData = images[0]

//     sendMessage(roomID, dataForm)
//     return
//    }

   if (emoji) {
    dataForm.type = 'icon-image'
    dataForm.metaData = emoji

    sendMessage(roomID, dataForm)
    return
   }

   if (content.trim() !== '') {
    dataForm.content = content
    sendMessage(roomID, dataForm)
   }
  }

  return null
 }

 const convertEmojiToBase64 = (emoji) => {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const context = canvas.getContext('2d')
  context.font = '48px Arial'
  context.fillText(emoji, 0, 48)

  const base64 = canvas.toDataURL().split(',')[1]
  return base64
 }

 const roomSplit = (idUser, idOther) =>
  idUser > idOther ? `${idOther}#${idUser}` : `${idUser}#${idOther}`

 return (
  <div className='form-message'>
   {images.length > 0 ? (
    <ul className='my-2 row row-cols-5 mx-0 overflow-hidden'>
     <li className='position-relative'>
      <input
       type='file'
       className='hidden'
       id='add-image-form'
       onChange={handleChangeImageMsg}
      />

      <label
       style={{
        position: 'absolute',
        right: '10%',
        top: '50%',
        transform: 'translateY(-50%)',
       }}
       htmlFor='add-image-form'
      >
       <AddBoxIcon className='text-[40px] cursor-pointer' />
      </label>
     </li>

     {images?.map((image, index) => {
      if (index >= 3) return
      return (
       <li key={uniqid()} className='col p-2 position-relative'>
        <button
         className='delete-image -top-1 right-0 absolute'
         onClick={() =>
          setMessageForm({
           ...messageForm,
           images: images.filter((image, idx) => idx !== index),
          })
         }
        >
         <CancelIcon />
        </button>

        {images.length > 3 && index === 2 && (
         <div
          style={{ fontSize: '-webkit-xxx-large' }}
          className='position-absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold'
         >
          +{images.length - (index + 1)}
         </div>
        )}

        <img
         src={`${BASE64_URL}${image}`}
         alt='anh message'
         className='rounded-[8px] object-cover aspect-[3/2] w-full'
        />
       </li>
      )
     })}
    </ul>
   ) : null}
   <form
    className='flex items-center gap-[30px] flex-grow-1'
    onSubmit={handleSubmitMessage}
   >
    <div className='w-100'>
     <input
      onChange={handleChangeValueMsg}
      type='text'
      className='w-100 h-[80px] bg-white rounded-[54px] px-[22px]'
      placeholder='Enter chat content...'
      value={content}
      ref={inputMessageFormRef}
     />
    </div>

    <button type='submit'>
     <SendIcon className='text-[40px] text-[#0095ff]' />
    </button>

    <div>
     <input
      onChange={handleChangeImageMsg}
      id='file-message-form'
      type='file'
      className='hidden m-0'
     />
     <label htmlFor='file-message-form'>
      <ImageIcon className='text-[40px] text-[#0095ff]' />
     </label>
    </div>

    <button type='button' onClick={handleToggleEmoji}>
     <EmojiEmotionsIcon className='text-[40px] text-[#0095ff]' />
    </button>

    {showEmoji && (
     <div className='position-absolute bottom-[100%] left-0'>
      <EmojiPicker
       width='20em'
       onEmojiClick={handleClickEmoji}
       emojiStyle={EmojiStyle.FACEBOOK}
       lazyLoadEmojis={true}
      />
     </div>
    )}
   </form>
  </div>
 )
}

export default FormMessage
