import { useContext, useState } from 'react'
import { AppContext } from '../../../../context'

import { useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import TextTruncate from 'react-text-truncate'

import avatarDefault from '../../../../assets/avatar-default.png'
import { fetchApiSamenote } from '../../../../utils/fetchApiSamnote'

const ModalSearchUserChat = ({ showModalSearch, setShowModalSearch }) => {
 const navigate = useNavigate()

 const appContext = useContext(AppContext)
 const { socket, user } = appContext

 const [searchUserName, setSearchUserName] = useState('')
 const [searchUserResult, setSearchUserResult] = useState([])
 const [messageNotifi, setMessageNotifi] = useState('')

 const roomSplit = (idUser, idOther) =>
  idUser > idOther ? `${idOther}#${idUser}` : `${idUser}#${idOther}`

 const postRelation = (userID, otherUserID) => {
  fetchApiSamenote('post', `/chatblock/${userID}`, {
   idReceive: otherUserID,
  })
 }

 const handleSubmitSearchUser = (e) => {
  e.preventDefault()
  if (
   searchUserName.trim().split(' ').length !== 1 ||
   searchUserName.trim() === ''
  )
   return

  fetchApiSamenote('post', '/group/search_user_by_word', {
   start_name: searchUserName,
  })
   .then((response) => {
    if (response?.data) {
     setSearchUserResult(
      response.data.filter((item) => item.idUser !== user?.id)
     )
     setMessageNotifi('')
    } else {
     setSearchUserResult([])
     setMessageNotifi('Not found')
    }
   })
   .catch((error) => console.log(error))
 }

 const handleClickChatBtn = (otherUserID) => {
  if (!otherUserID) return

  const roomID = roomSplit(user?.id, otherUserID)

  // join room
  socket.emit('join_room', { room: roomID })
  // set relationship true
  socket.emit('chat_strangers', { idSend: user?.id, idReceive: otherUserID })
  // postRelation(user?.id, otherUserID)

  setShowModalSearch(false)

  setTimeout(() => {
   navigate(`/messages/chat/${otherUserID}`)
  }, 300)
 }

 const handleHideModalSearch = (e) => {
  setSearchUserName('')
  setSearchUserResult([])
  setMessageNotifi('')
  setShowModalSearch(false)
 }
 const handleChangeSearchUser = (e) => {
  setSearchUserName(e.target.value)
 }

 return (
  <Modal show={showModalSearch} centered={true} onHide={handleHideModalSearch}>
   <div className='p-3'>
    <h3 className='text-[25px] font-bold'>Search user</h3>

    <form
     onSubmit={handleSubmitSearchUser}
     className='flex gap-2 my-3 items-center'
    >
     <div className='border border-black rounded-sm p-2 w-100'>
      <input
       className='w-100 text-[25px]'
       type='text'
       placeholder='User name'
       onChange={handleChangeSearchUser}
       value={searchUserName}
      />
     </div>

     <button
      className='bg-black h-max text-white text-[20px] px-3 py-1 rounded-md'
      type='submit'
     >
      Search
     </button>
    </form>

    <ul className='flex flex-col gap-2 max-h-[70vh] overflow-x-hidden overflow-y-auto style-scrollbar-y style-scrollbar-y-sm pe-2'>
     {searchUserResult?.map((user) => (
      <li
       key={user.idUser}
       className='flex justify-between bg-white items-center rounded-[40px] cursor-pointer'
      >
       <div className='flex gap-2 items-center'>
        <div>
         <img
          onError={(e) => {
           e.target.src = avatarDefault
          }}
          src={user.linkAvatar}
          alt='avatar '
          className='w-[50px] h-[50px] object-cover rounded-[100%]'
         />
        </div>

        <div>
         <TextTruncate
          line={1}
          element='h6'
          truncateText='…'
          text={user.userName}
          containerClassName='text-lg font-extrabold capitalize break-all'
         />
        </div>
       </div>

       <button
        onClick={() => handleClickChatBtn(user.idUser)}
        type='button'
        className='bg-[#F56852] text-white rounded-sm text-decoration-none px-3 py-2 text-xl font-medium'
       >
        Chat
       </button>
      </li>
     ))}

     {messageNotifi.trim() !== '' && (
      <li className='font-bold text-[#ff2d2d]'>{messageNotifi} !</li>
     )}
    </ul>

    <div className='text-right'>
     <button
      className='text-[25px] font-medium text-[#ff2d2d] mt-3'
      type='button'
      onClick={handleHideModalSearch}
     >
      Cancel
     </button>
    </div>
   </div>
  </Modal>
 )
}

export default ModalSearchUserChat
