import { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useParams, Link } from 'react-router-dom'

import { AppContext } from '../../../context'

import FormMessage from './FormMessage'
import Information from './Information'
import SettingGroup from './SettingGroup'

import bgMessage from '../../../assets/img-chat-an-danh.jpg'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { fetchApiSamenote } from '../../../utils/fetchApiSamnote'
import MessageChatCard from './components/MessageChatCard'
import MessageComponent from './components/MessageComponent'
import MessageGroupCard from './components/MessageGroupCard'
import InfoMessageTop from './InfoMessageTop'

const MainMessage = (props) => {
 const { typeFilterChat, getAllMessageList } = props
 const appContent = useContext(AppContext)
 const { user, socket } = appContent
 const { id } = useParams()
 const { pathname } = useLocation()

 // ********************************

 const [typeMessage, setTypeMessage] = useState(null)

 const [infoMessageChat, setInfoMessageChat] = useState({
  name: '',
  avatar: '',
  id: null,
 })
 const [infoMessageGroup, setInfoMessageGroup] = useState({
  idGroup: null,
  idOwner: null,
  avatar: '',
  name: '',
  members: [],
 })

 const [allMessageList, setAllMessageList] = useState([])
 const [messagesChat, setMessagesChat] = useState([])
 const [messagesGroup, setMessagesGroup] = useState([])

 //  var setting group

 const [showInforMation, setShowInforMation] = useState(false)

 const handleHideInformation = () => {
  setShowInforMation(false)
 }

 // get data messages
 const getInfoMessageChat = () =>
  fetchApiSamenote('get', `/profile/${id}`).then((data) => {
   const newInfoMessage = {
    name: data.user.name,
    avatar: data.user.Avarta,
    id: data.user.id,
   }

   setInfoMessageChat(newInfoMessage)
  })

 const getInfoMesssageGroup = (groupId) =>
  fetchApiSamenote('get', `/group/only/${groupId}`).then((data) => {
   setInfoMessageGroup({
    idGroup: data.data.idGroup,
    idOwner: data.data.idOwner,
    avatar: data.data.avt.avt,
    name: data.data.name,
    members: data.data.members,
   })
  })

 const getMessagesChat = (userID, otherID) =>
  fetchApiSamenote(
   'get',
   `/message/list_message_chat1vs1/${userID}/${otherID}`,
   {},
   { page: 1 }
  ).then((data) => {
   const newMessagesChat = []
   data.data.map((item) => {
    return item.messages.map((message) => newMessagesChat.push(message))
   })

   setMessagesChat(newMessagesChat)
  })

 const getMessagesGroup = (groupID) =>
  fetchApiSamenote('get', `/group/messages/${groupID}`, {}, { page: 1 }).then(
   (data) => {
    setMessagesGroup(data.data)
   }
  )

 const roomSplit = (idUser, idOther) =>
  idUser > idOther ? `${idOther}#${idUser}` : `${idUser}#${idOther}`

 // handle socket

 useEffect(() => {
  if (!socket) return

  socket.on('chat_strangers', (data) => {
   console.log('relation', data)
   if (data.message.relation) {
    const { idReceive, idSend } = data.message

    // join room chat
    socket.emit('join_room', { room: roomSplit(idSend, idReceive) })
   }
  })
 }, [socket])

 useEffect(() => {
  if (!socket) return

  //join room
  fetchApiSamenote('get', `/message/list_all_message/${user?.id}`).then(
   (data) => {
    data.data.map((item) => {
     if (item.type_chat === '1chat1')
      return socket.emit('join_room', { room: item.idRoom })

     if (item.type_chat === 'chatgroup')
      return socket.emit('join_room', { room: item.idGroup })
    })

    setAllMessageList(data.data)
   }
  )

  socket.on('send_message', (result) => {
   if (result.message === 'Error') return

   getAllMessageList && getAllMessageList()
   const { ReceivedID, SenderID, MessageID } = result?.data

   if (
    typeMessage === 'chat' &&
    (ReceivedID === infoMessageChat.id || SenderID === infoMessageChat.id)
   ) {
    getMessagesChat(user?.id, ReceivedID === user?.id ? SenderID : ReceivedID)
   }
  })

  socket.on('chat_group', (result) => {
   getAllMessageList && getAllMessageList()

   if (typeMessage === 'group') {
    const newIdGroup = result.data.idGroup
    getMessagesGroup(newIdGroup)
   }
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [socket, typeFilterChat, typeMessage, pathname, infoMessageChat])

 //   ****************************************

 useEffect(() => {
  const isChat = pathname.includes('chat')
  const isGroup = pathname.includes('group')

  if (!id) {
   // reset data
   setInfoMessageChat({
    name: '',
    avatar: '',
    id: null,
   })

   setInfoMessageGroup({
    idGroup: null,
    idOwner: null,
    avatar: '',
    name: '',
    members: [],
   })

   setTypeMessage(null)

   return
  }

  if (isChat) {
   setTypeMessage('chat')
   setInfoMessageGroup({
    idGroup: null,
    idOwner: null,
    avatar: '',
    name: '',
    members: [],
   })

   getInfoMessageChat()

   // ********* handle link profile to group
   //đặt mối quan hệ true vs user khác
   fetchApiSamenote('post', `/chatblock/${user?.id}`, {
    idReceive: id,
   })

   //join room chat
   socket && socket.emit('join_room', { room: roomSplit(user?.id, id) })
  }

  if (isGroup) {
   setTypeMessage('group')
   setInfoMessageChat({
    name: '',
    avatar: '',
    id: null,
   })

   getInfoMesssageGroup(id)
  }
 }, [id, pathname])

 useEffect(() => {
  infoMessageChat.id && getMessagesChat(user?.id, infoMessageChat.id)
  infoMessageGroup.idGroup && getMessagesGroup(infoMessageGroup.idGroup)
 }, [infoMessageChat.id, infoMessageGroup.idGroup, user?.id])

 // handle message chat
 const handleDeleteMessage = async (messageID) => {
  fetchApiSamenote('delete', `/message/${messageID}`).then(() => {
   getAllMessageList && getAllMessageList()
   getMessagesChat(user?.id, infoMessageChat.id)
  })
 }

 const propsSettingGroup = {
  userID: user?.id,
  typeMessage,
  infoMessageGroup,

  setShowInforMation,
  getAllMessageList,
  getInfoMesssageGroup,
 }

 const propsFormMessage = {
  userID: user?.id,
  otherUserID: infoMessageChat?.id,
  idGroup: infoMessageGroup.idGroup,

  formName: typeMessage,
  socket,
 }

 const propsInformation = {
  showInfo: showInforMation,
  onHide: handleHideInformation,
  infoMessageGroup,
 }

 const propsInfoMessage = {
  typeMessage,
  userID: user?.id,
  onGetAllMessageList: getAllMessageList,

  infoMessageGroup,
  setInfoMessageGroup,
  infoMessageChat,
  getInfoMesssageGroup,
 }

 // handle scroll content message
 const scrollViewRef = useRef()
 useEffect(() => {
  scrollViewRef?.current.scrollIntoView()
 }, [messagesChat, messagesGroup])

 return (
  <div className='col-md-8 col-xl-9 w-full px-0 flex flex-col relative overflow-x-hidden'>
   <div className='flex justify-between items-center bg-[#dffffe] p-[10px] md:py-[20px] md:px-[15px] xl:py-[30px] xl:px-[20px]'>
    <div className='md:hidden'>
     <Link to='/messages'>
      <ArrowBackIosIcon className='text-xl' />
     </Link>
    </div>
    <InfoMessageTop {...propsInfoMessage} />
    <SettingGroup data={propsSettingGroup} />
   </div>

   <div
    style={{
     background: `url(${bgMessage}) no-repeat center/cover`,
     boxShadow: '0 0px 10px 0px #00000040, 0px 1px 10px 0px #00000040',
    }}
    className='flex-grow-1 flex flex-col md:relative'
   >
    <div className='flex-grow-1 p-[20px] h-[30vh] overflow-y-auto style-scrollbar-y style-scrollbar-y-md'>
     <ul id='message-content'>
      {typeMessage === 'chat' && (
       <MessageComponent
        data={messagesChat}
        renderItem={(message) => (
         <MessageChatCard
          key={message.id}
          message={message}
          userID={user?.id}
          onDeleteMessage={handleDeleteMessage}
          avatar={infoMessageChat.avatar}
         />
        )}
       />
      )}

      {typeMessage === 'group' && (
       <MessageComponent
        data={messagesGroup}
        renderItem={(message) => (
         <MessageGroupCard
          key={message.id}
          message={message}
          userID={user?.id}
         />
        )}
       />
      )}

      <span ref={scrollViewRef}></span>
     </ul>
    </div>

    <FormMessage {...propsFormMessage} />
    <Information data={propsInformation} />
   </div>
  </div>
 )
}

export default MainMessage
