import { useContext, useEffect, useState } from 'react'
import './Group.css'

import { AppContext } from '../../context'
import { fetchAllMessageList } from './fetchApiGroup'

import ChatList from './ChatList/ChatList'
import MainMessage from './MainMessage/MainMessage'

const Group = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext

 // var data message
 const [allMessageList, setAllMessageList] = useState([])
 const [typeFilterChat, setTypeFilterChat] = useState(
  window.localStorage.getItem('typeFilterChat') || 'All'
 )

 console.log('allMessageList', allMessageList)

 const handleChangeTypeFilterChat = (type) => setTypeFilterChat(type)

 //______________________________________
 const getAllMessageList = async () => {
  const typeFilterLocal = window.localStorage.getItem('typeFilterChat')
  const messageList = await fetchAllMessageList(
   user.id,
   typeFilterLocal || typeFilterChat
  )

  console.log('messageList', messageList)

  setAllMessageList(messageList)
 }

 useEffect(() => {
  if (!user?.id) return

  getAllMessageList()
 }, [user?.id, typeFilterChat])

 const propsChatList = {
  userID: user?.id,
  typeFilterChat,
  allMessageList,

  getAllMessageList,
  onChangeTypeFilter: handleChangeTypeFilterChat,
 }

 const propsMainMessage = {
  typeFilterChat,
  getAllMessageList,
 }

 return (
  <div className='flex flex-grow-1'>
   <div className='col col-md-4 col-xl-3 group-sidebar flex flex-col px-0'>
    <h3 className='text-center xl:py-[60px] md:py-[30px] py-[15px] px-3 font-bold'>
     Chat
    </h3>

    <ChatList data={propsChatList} />
   </div>

   <div
    style={{ boxShadow: '0px 8px 10px 0px #00000040' }}
    className='hidden md:flex w-full'
   >
    <MainMessage {...propsMainMessage} />
   </div>
  </div>
 )
}

export default Group
