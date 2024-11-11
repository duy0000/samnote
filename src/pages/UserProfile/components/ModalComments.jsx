import React, { useState, useEffect, useContext, useCallback } from 'react'
import api from '../../../api'
import { AppContext } from '../../../context'
import SendIcon from '@mui/icons-material/Send'
import { formatTimeAgo } from '../../../utils/utils'

import moment from 'moment'

const ModalComments = ({ infoNote, setIsShowModalComments, setReload }) => {
 const [dataComments, setDataComments] = useState([])
 const [contentComment, setContentComment] = useState('')
 const [contentReplyComment, setContentReplyComment] = useState('')
 const appContext = useContext(AppContext)
 const { user, socket } = appContext

 const fetchAllDataComments = useCallback(async () => {
  try {
   const res = await api.get(`/notes/notes-comment/${infoNote.idNote}`)
   setDataComments(res.data.data)
  } catch (err) {
   console.error(err)
  }
 }, [infoNote])

 useEffect(() => {
  fetchAllDataComments()
 }, [fetchAllDataComments])

 useEffect(() => {
  if (!socket) return

  fetchAllDataComments()

  socket.on('post_comment_note', (data) => {
   console.log(data)

   if (infoNote.idNote === data.data.idNote) {
    fetchAllDataComments()
    setReload((prev) => prev + 1)
   }
  })

  socket.on('favorite_notes_comment', (data) => {
   if (infoNote.idNote === data.idNote) {
    fetchAllDataComments()
   }
  })

  socket.on('favorite_reply', (data) => {
   if (infoNote.idNote === data.idNote) {
    fetchAllDataComments()
   }
  })
 }, [socket])

 const handleSubmitComment = async (parentsNoteId) => {
  const content = parentsNoteId ? contentReplyComment : contentComment
  if (content.trim() === '') {
   return
  }

  try {
   socket.emit('post_comment_note', {
    data: {
     parent_id: parentsNoteId,
     sendAt: moment().format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
     content: content,
     idNote: infoNote.idNote,
     idUser: user.id,
    },
   })
   setContentComment('')
   setContentReplyComment('')
  } catch (err) {
   console.error('err', err)
  }
 }

 const handleLikeComment = async (idComment, type, isReply) => {
  try {
   if (isReply) {
    socket.emit('favorite_reply', { idReply: idComment, idUser: user.id, type })
   } else {
    socket.emit('favorite_notes_comment', { idComment, idUser: user.id, type })
   }
  } catch (err) {
   console.error(err)
  }
 }

 const [seeReplyStates, setSeeReplyStates] = useState(
  new Array(dataComments.length).fill(false)
 )
 const [isCreateReply, setIsCreateReply] = useState(
  new Array(dataComments.length).fill(false)
 )

 const handleSeeAllReply = (index, isShow) => {
  setContentComment('')
  setContentReplyComment('')
  const newSeeReplyStates = [...seeReplyStates]
  newSeeReplyStates[index] = isShow
  setSeeReplyStates(newSeeReplyStates)
 }

 const handleShowCreateReply = (index) => {
  setContentReplyComment('')
  const newIsCreateReply = new Array(dataComments.length).fill(false)
  if (index !== -1) {
   newIsCreateReply[index] = true
   setContentComment('')
  }
  setIsCreateReply(newIsCreateReply)
 }

 const adjustTextareaHeight = (element) => {
  element.style.height = 'auto'
  element.style.height = `${element.scrollHeight}px`
 }

 const handleOnChangeContentComment = (e) => {
  setContentComment(e.target.value)
  adjustTextareaHeight(e.target)
 }

 return (
  <>
   <div
    className='modal-backdrop fade show'
    onClick={() => setIsShowModalComments(false)}
   ></div>
   <div className='modal d-flex align-items-center justify-content-center pointer-events-none'>
    <div className='modal-dialog-container w-[45rem] max-w-[70%] max-h-[90vh] pointer-events-auto'>
     <div className='modal-content'>
      <div className='modal-header'>
       <h5 className='modal-title font-bold truncate-text'>
        {infoNote.title}'s Comments
       </h5>
       <button
        type='button'
        className='btn-close'
        onClick={() => setIsShowModalComments(false)}
       ></button>
      </div>
      <div className='modal-body'>
       <div
        className='comments-list overflow-auto'
        style={{ maxHeight: '25rem' }}
       >
        {dataComments.length > 0 ? (
         dataComments.map((comment, index) => {
          return (
           <div key={comment.id} className='comment-item d-flex flex-col mb-3'>
            <div className='main-comment flex'>
             <div className='flex flex-col me-2'>
              <img
               src={comment.avt}
               alt={comment.user_name}
               className='rounded-circle'
               style={{ width: '40px', height: '40px' }}
              />
              {(isCreateReply[index] ||
               (comment.reply_comments &&
                comment.reply_comments.length > 0)) && (
               <div className='bg-gray-200 h-full w-[2px] ml-[19px] mt-2' />
              )}
             </div>
             <div className='content-comment w-full'>
              <div className='bg-gray-100 px-3 py-2 rounded-4'>
               <div className='flex flex-row justify-between gap-2'>
                <h6 className='mb-0 font-weight-bold'>{comment.user_name}</h6>
                <p
                 className='mb-0 text-sm text-gray-500'
                 data-bs-toggle='tooltip'
                 data-bs-placement='bottom'
                 title={comment.sendAt}
                >
                 {formatTimeAgo(comment.sendAt)}
                </p>
               </div>
               <p className='mb-0'>{comment.content}</p>
              </div>
              <div className='comment-actions d-flex align-items-center mt-1 ml-2 relative'>
               <div className='amount-like-dislike flex flex-row gap-1'>
                <p className='text-sm mr-5 mb-0'>Like: {comment.like || 0}</p>
                <p className='text-sm mr-5 mb-0'>
                 Dislike: {comment.dislike || 0}
                </p>
               </div>
               <div
                className='interacted-comment flex justify-end items-center gap-2 opacity-80
                                                                            absolute top-[-100%] right-[7%]'
               >
                <div
                 className='like cursor-pointer flex items-center p-2 rounded-full bg-gray-200 hover:bg-gray-300'
                 onClick={() => handleLikeComment(comment.id, 'like', false)}
                >
                 <svg
                  width='1rem'
                  height='1rem'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 512 512'
                 >
                  <path d='M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16l-97.5 0c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8l97.5 0c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0z' />
                 </svg>
                </div>
                <div
                 className='dislike cursor-pointer flex items-center p-2 rounded-full bg-gray-200 hover:bg-gray-300'
                 onClick={() => handleLikeComment(comment.id, 'dislike', false)}
                >
                 <svg
                  width='1rem'
                  height='1rem'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 512 512'
                 >
                  <path d='M323.8 477.2c-38.2 10.9-78.1-11.2-89-49.4l-5.7-20c-3.7-13-10.4-25-19.5-35l-51.3-56.4c-8.9-9.8-8.2-25 1.6-33.9s25-8.2 33.9 1.6l51.3 56.4c14.1 15.5 24.4 34 30.1 54.1l5.7 20c3.6 12.7 16.9 20.1 29.7 16.5s20.1-16.9 16.5-29.7l-5.7-20c-5.7-19.9-14.7-38.7-26.6-55.5c-5.2-7.3-5.8-16.9-1.7-24.9s12.3-13 21.3-13L448 288c8.8 0 16-7.2 16-16c0-6.8-4.3-12.7-10.4-15c-7.4-2.8-13-9-14.9-16.7s.1-15.8 5.3-21.7c2.5-2.8 4-6.5 4-10.6c0-7.8-5.6-14.3-13-15.7c-8.2-1.6-15.1-7.3-18-15.2s-1.6-16.7 3.6-23.3c2.1-2.7 3.4-6.1 3.4-9.9c0-6.7-4.2-12.6-10.2-14.9c-11.5-4.5-17.7-16.9-14.4-28.8c.4-1.3 .6-2.8 .6-4.3c0-8.8-7.2-16-16-16l-97.5 0c-12.6 0-25 3.7-35.5 10.7l-61.7 41.1c-11 7.4-25.9 4.4-33.3-6.7s-4.4-25.9 6.7-33.3l61.7-41.1c18.4-12.3 40-18.8 62.1-18.8L384 32c34.7 0 62.9 27.6 64 62c14.6 11.7 24 29.7 24 50c0 4.5-.5 8.8-1.3 13c15.4 11.7 25.3 30.2 25.3 51c0 6.5-1 12.8-2.8 18.7C504.8 238.3 512 254.3 512 272c0 35.3-28.6 64-64 64l-92.3 0c4.7 10.4 8.7 21.2 11.8 32.2l5.7 20c10.9 38.2-11.2 78.1-49.4 89zM32 384c-17.7 0-32-14.3-32-32L0 128c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0z' />
                 </svg>
                </div>
                <div
                 className='reply cursor-pointer flex items-center p-2 rounded-full bg-gray-200 hover:bg-gray-300'
                 onClick={() => handleShowCreateReply(index)}
                >
                 <svg
                  width='1rem'
                  height='1rem'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 512 512'
                 >
                  <path d='M168.2 384.9c-15-5.4-31.7-3.1-44.6 6.4c-8.2 6-22.3 14.8-39.4 22.7c5.6-14.7 9.9-31.3 11.3-49.4c1-12.9-3.3-25.7-11.8-35.5C60.4 302.8 48 272 48 240c0-79.5 83.3-160 208-160s208 80.5 208 160s-83.3 160-208 160c-31.6 0-61.3-5.5-87.8-15.1zM26.3 423.8c-1.6 2.7-3.3 5.4-5.1 8.1l-.3 .5c-1.6 2.3-3.2 4.6-4.8 6.9c-3.5 4.7-7.3 9.3-11.3 13.5c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c5.1 0 10.2-.3 15.3-.8l.7-.1c4.4-.5 8.8-1.1 13.2-1.9c.8-.1 1.6-.3 2.4-.5c17.8-3.5 34.9-9.5 50.1-16.1c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9zM144 272a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm80 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z' />
                 </svg>
                </div>
               </div>
              </div>
             </div>
            </div>
            {comment.reply_comments &&
             comment.reply_comments.length > 0 &&
             (seeReplyStates[index] ? (
              <div className='replies-list flex flex-col'>
               {comment.reply_comments.map((reply) => (
                <div key={reply.id_reply} className='flex flex-row'>
                 <div className='line-reply-straight ml-[19px]'>
                  <div className='bg-gray-200 h-full w-[2px]' />
                 </div>
                 <div className='reply-item d-flex my-2 w-full'>
                  <div className='curved-line'></div>
                  <img
                   src={reply.avt}
                   alt={reply.user_name}
                   className='rounded-circle me-2'
                   style={{ width: '30px', height: '30px' }}
                  />
                  <div className='reply-content w-full'>
                   <div className='bg-gray-100 px-3 py-2 rounded-4'>
                    <div className='flex flex-row justify-between gap-2'>
                     <h6 className='mb-0 font-weight-bold'>
                      {reply.user_name}
                     </h6>
                     <p
                      className='mb-0 text-sm text-gray-500'
                      data-bs-toggle='tooltip'
                      data-bs-placement='bottom'
                      title={reply.sendAt}
                     >
                      {formatTimeAgo(reply.sendAt)}
                     </p>
                    </div>
                    <p className='mb-0'>{reply.content}</p>
                   </div>
                   <div className='reply-actions d-flex align-items-center mt-1 ml-2 relative'>
                    <div className='amount-like-dislike flex flex-row gap-1'>
                     <p className='text-sm mr-5 mb-0'>
                      Like: {reply.like_count || 0}
                     </p>
                     <p className='text-sm mr-5 mb-0'>
                      Dislike: {reply.dislike_count || 0}
                     </p>
                    </div>
                    <div
                     className='interacted-rely flex justify-end items-center gap-2 opacity-80
                                                                                                absolute top-[-100%] right-[7%]'
                    >
                     <div
                      className='like cursor-pointer flex items-center p-2 rounded-full bg-gray-200 hover:bg-gray-300'
                      onClick={() =>
                       handleLikeComment(reply.id_reply, 'like', true)
                      }
                     >
                      <svg
                       width='1rem'
                       height='1rem'
                       xmlns='http://www.w3.org/2000/svg'
                       viewBox='0 0 512 512'
                      >
                       <path d='M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16l-97.5 0c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8l97.5 0c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0z' />
                      </svg>
                     </div>
                     <div
                      className='dislike cursor-pointer flex items-center p-2 rounded-full bg-gray-200 hover:bg-gray-300'
                      onClick={() =>
                       handleLikeComment(reply.id_reply, 'dislike', true)
                      }
                     >
                      <svg
                       width='1rem'
                       height='1rem'
                       xmlns='http://www.w3.org/2000/svg'
                       viewBox='0 0 512 512'
                      >
                       <path d='M323.8 477.2c-38.2 10.9-78.1-11.2-89-49.4l-5.7-20c-3.7-13-10.4-25-19.5-35l-51.3-56.4c-8.9-9.8-8.2-25 1.6-33.9s25-8.2 33.9 1.6l51.3 56.4c14.1 15.5 24.4 34 30.1 54.1l5.7 20c3.6 12.7 16.9 20.1 29.7 16.5s20.1-16.9 16.5-29.7l-5.7-20c-5.7-19.9-14.7-38.7-26.6-55.5c-5.2-7.3-5.8-16.9-1.7-24.9s12.3-13 21.3-13L448 288c8.8 0 16-7.2 16-16c0-6.8-4.3-12.7-10.4-15c-7.4-2.8-13-9-14.9-16.7s.1-15.8 5.3-21.7c2.5-2.8 4-6.5 4-10.6c0-7.8-5.6-14.3-13-15.7c-8.2-1.6-15.1-7.3-18-15.2s-1.6-16.7 3.6-23.3c2.1-2.7 3.4-6.1 3.4-9.9c0-6.7-4.2-12.6-10.2-14.9c-11.5-4.5-17.7-16.9-14.4-28.8c.4-1.3 .6-2.8 .6-4.3c0-8.8-7.2-16-16-16l-97.5 0c-12.6 0-25 3.7-35.5 10.7l-61.7 41.1c-11 7.4-25.9 4.4-33.3-6.7s-4.4-25.9 6.7-33.3l61.7-41.1c18.4-12.3 40-18.8 62.1-18.8L384 32c34.7 0 62.9 27.6 64 62c14.6 11.7 24 29.7 24 50c0 4.5-.5 8.8-1.3 13c15.4 11.7 25.3 30.2 25.3 51c0 6.5-1 12.8-2.8 18.7C504.8 238.3 512 254.3 512 272c0 35.3-28.6 64-64 64l-92.3 0c4.7 10.4 8.7 21.2 11.8 32.2l5.7 20c10.9 38.2-11.2 78.1-49.4 89zM32 384c-17.7 0-32-14.3-32-32L0 128c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0z' />
                      </svg>
                     </div>
                     <div
                      className='reply cursor-pointer flex items-center p-2 rounded-full bg-gray-200 hover:bg-gray-300'
                      onClick={() => handleShowCreateReply(index)}
                     >
                      <svg
                       width='1rem'
                       height='1rem'
                       xmlns='http://www.w3.org/2000/svg'
                       viewBox='0 0 512 512'
                      >
                       <path d='M168.2 384.9c-15-5.4-31.7-3.1-44.6 6.4c-8.2 6-22.3 14.8-39.4 22.7c5.6-14.7 9.9-31.3 11.3-49.4c1-12.9-3.3-25.7-11.8-35.5C60.4 302.8 48 272 48 240c0-79.5 83.3-160 208-160s208 80.5 208 160s-83.3 160-208 160c-31.6 0-61.3-5.5-87.8-15.1zM26.3 423.8c-1.6 2.7-3.3 5.4-5.1 8.1l-.3 .5c-1.6 2.3-3.2 4.6-4.8 6.9c-3.5 4.7-7.3 9.3-11.3 13.5c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c5.1 0 10.2-.3 15.3-.8l.7-.1c4.4-.5 8.8-1.1 13.2-1.9c.8-.1 1.6-.3 2.4-.5c17.8-3.5 34.9-9.5 50.1-16.1c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9zM144 272a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm80 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z' />
                      </svg>
                     </div>
                    </div>
                   </div>
                  </div>
                 </div>
                </div>
               ))}
               <div
                className={`hide-reply-container flex flex-row 
                                        ${
                                         isCreateReply[index]
                                          ? 'ml-[19px]'
                                          : 'ml-[21px]'
                                        }`}
               >
                {isCreateReply[index] && (
                 <div className='line-reply-straight'>
                  <div className='bg-gray-200 h-full w-[2px]' />
                 </div>
                )}
                <div className='curved-line'></div>
                <div
                 className='hide-reply cursor-pointer hover:opacity-80'
                 onClick={() => handleSeeAllReply(index, false)}
                >
                 Hide all replies
                </div>
               </div>
              </div>
             ) : (
              <div
               className={`show-reply-container flex flex-row
                                    ${
                                     isCreateReply[index]
                                      ? 'ml-[19px]'
                                      : 'ml-[21px]'
                                    }`}
              >
               {isCreateReply[index] && (
                <div className='line-reply-straight'>
                 <div className='bg-gray-200 h-full w-[2px]' />
                </div>
               )}
               <div className='flex flex-row'>
                <div className='curved-line'></div>
                <div
                 className='show-reply cursor-pointer hover:opacity-80'
                 onClick={() => handleSeeAllReply(index, true)}
                >
                 View{' '}
                 {comment.reply_comments.length > 1
                  ? `all ${comment.reply_comments.length} replies`
                  : `${comment.reply_comments.length} reply`}
                </div>
               </div>
              </div>
             ))}
            {isCreateReply[index] && (
             <div className='create-reply-comment flex flex-row items-center gap-1 mt-2 ml-[21px] '>
              <div className='curved-line'></div>
              <textarea
               className='form-control rounded-4'
               value={contentReplyComment}
               onChange={(e) => setContentReplyComment(e.target.value)}
               placeholder='Reply a comment...'
               rows={1}
              />
              <div
               className='cursor-pointer hover:bg-gray-200 rounded-full p-1.5 pl-3'
               onClick={() => handleSubmitComment(comment.id)}
              >
               <SendIcon className='w-7 h-7 text-blue-700' />
              </div>
             </div>
            )}
           </div>
          )
         })
        ) : (
         <p className='text-center'>No comments yet</p>
        )}
       </div>
       <div className='create-comment flex flex-row items-center gap-1 mt-3'>
        <img
         src={user.Avarta}
         className='rounded-circle me-2'
         style={{ width: '40px', height: '40px' }}
        />
        <textarea
         className='form-control rounded-4'
         value={contentComment}
         onChange={handleOnChangeContentComment}
         placeholder='Write a comment...'
         rows={1}
         onFocus={() => handleShowCreateReply(-1)}
         style={{ resize: 'vertical', maxHeight: '5rem', overflowY: 'scroll' }}
         ref={(el) => el && adjustTextareaHeight(el)}
        />
        <div
         className='cursor-pointer hover:bg-gray-200 rounded-full p-1.5 pl-3'
         onClick={() => handleSubmitComment(0)}
        >
         <SendIcon className='w-7 h-7 text-blue-700' />
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>
  </>
 )
}

export default ModalComments
