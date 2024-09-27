import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { AppContext } from '../../../context'
import NoteItem from './NoteItem'
import { fetchNoteList } from '../fetchApiEditNote'

import SearchIcon from '@mui/icons-material/Search'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import axios from 'axios'

const NoteList = ({ noteList, onChangeNoteList, userID }) => {
 const [noteListInitial, setNoteListInitial] = useState([])

 useEffect(() => {
  const getNoteListInitial = async (userID) => {
   const noteListInit = await fetchNoteList(userID)
   setNoteListInitial(noteListInit)
  }

  userID && getNoteListInitial(userID)
 }, [userID])

 const handleChangeSearchNote = async (e) => {
  const textSearch = e.target.value
  if (textSearch.trim() === '') {
   return onChangeNoteList(noteListInitial)
  }

  console.log('noteListInitial', noteListInitial)

  try {
   const response = await axios.get(
    `https://samnote.mangasocial.online/notes_search?key=${textSearch}`
   )

   const data = response.data.search_note
   //    const filterNoteList = noteListInitial.filter((note) =>
   //     data.some((item) => note.idNote === item.idNote)
   //    )

   console.log('filterNoteList', data)

   //   onChangeNoteList(filterNoteList)
  } catch (error) {
   console.error(error)
  }
 }

 return (
  <div className='p-2 bg-[#3A3F42] rounded-lg flex flex-col flex-grow-1'>
   <div className='flex items-center justify-between'>
    <div
     style={{ boxShadow: '4px 8px 10px 0px #00000073' }}
     className='bg-white rounded-3xl w-1/2 flex items-center px-3 py-[5px] gap-2'
    >
     <SearchIcon className='text-3xl' />
     <input
      onChange={handleChangeSearchNote}
      className='w-full'
      type='text'
      placeholder='Search note'
     />
    </div>

    <nav aria-label='Page navigation'>
     <ul className='pagination items-center gap-2'>
      <li className='page-item'>
       <a className='text-white text-decoration-none ' href='#'>
        <SkipPreviousIcon className='text-2xl' />
       </a>
      </li>
      <li className='page-item'>
       <a
        className='text-black text-center w-[25px] rounded-sm block bg-white text-decoration-none text-xl'
        href='#'
       >
        1
       </a>
      </li>
      <li className='page-item'>
       <a
        className='text-black text-center w-[25px] rounded-sm  block bg-white text-decoration-none text-xl'
        href='#'
       >
        2
       </a>
      </li>
      <li className='page-item'>
       <a
        className='text-black text-center w-[25px] rounded-sm  block bg-white text-decoration-none text-xl'
        href='#'
       >
        3
       </a>
      </li>

      <li className='page-item'>
       <a
        className='text-black text-center w-[25px] rounded-sm  block bg-white text-decoration-none text-xl'
        href='#'
       >
        ...
       </a>
      </li>

      <li className='page-item'>
       <a className='text-white text-decoration-none ' href='#'>
        <SkipNextIcon className='text-2xl' />
       </a>
      </li>
     </ul>
    </nav>
   </div>

   <div className='mt-3 flex flex-col flex-grow-1'>
    <div className='row row-cols-4 text-white'>
     <div className='col'>
      <h6 className='text-2xl'>Name</h6>
     </div>
     <div className='col-6'>
      <h6 className='text-2xl text-center'>Content</h6>
     </div>
     <div className='col'>
      <h6 className='text-2xl text-right'>Date</h6>
     </div>
    </div>

    {noteList.length > 0 ? (
     <ul className='bg-[#dedede] flex flex-col flex-grow-1 gap-3 rounded-lg overflow-y-auto h-[60vh] p-2 editnote-notelist'>
      {noteList.map((note) => (
       <NoteItem note={note} key={note.idNote} />
      ))}
     </ul>
    ) : null}
   </div>
  </div>
 )
}

export default NoteList