import { useEffect, useState, useContext } from 'react'
import axios from 'axios'

import { AppContext } from '../../context'

import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'
import NoteCard from '../../share/NoteCard'

const Dustbin = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext
 const [dustbinNotes, setDustbinNotes] = useState([])

 const getDustbinNotes = () => {
  return fetchApiSamenote('get', `/trash/${user?.id}`).then((data) => {
   setDustbinNotes(data.notes)
  })
 }

 useEffect(() => {
  if (!user) return

  getDustbinNotes()
 }, [user])

 //  const noteListInitial = [...dustbinNotes]

 //  const handleChangeSearchNote = async (e) => {
 //   const textSearch = e.target.value

 //   console.log('textSearch', textSearch)

 //   if (textSearch.trim() === '') {
 //    // return setDustbinNotes(noteListInitial)
 //   }

 //   try {
 //    const response = await axios.get(
 //     `https://samnote.mangasocial.online/notes_search_user/${user.id}/${textSearch}`
 //    )

 //    const data = response.data.search_note
 //    const filterNoteList = noteListInitial.filter((note) =>
 //     data.some((item) => note.idNote === item.idNote)
 //    )

 //    console.log('data', data)

 //    // setDustbinNotes(filterNoteList)
 //   } catch (error) {
 //    console.error(error)
 //   }
 //  }

 return (
  <div className='flex flex-col flex-grow-1 px-lg-4 py-lg-3 px-2 py-2 bg-[#181A1B] text-white'>
   <div className='flex gap-1 justify-center items-center'>
    <h3 className='xl:text-4xl lg:text-3xl text-2xl font-semibold xl:font-bold'>
     Recycle bin
    </h3>
    <span>
     <DeleteIcon className='xl:text-4xl lg:text-3xl text-2xl' />
    </span>
   </div>

   <div className='mx-auto mt-xl-5 mt-lg-3 mt-2'>
    <div className='flex px-3 gap-2 max-w-[400px] items-center h-[40px] rounded-[40px] text-black bg-white'>
     <span>
      <SearchIcon />
     </span>

     <div className='w-full'>
      <input
       //    onChange={handleChangeSearchNote}
       className='w-full'
       type='Search note'
       placeholder='Search note'
      />
     </div>
    </div>

    <h5 className='mt-2 text-[#FF2323] xl:text-3xl text-2xl'>
     Auto-delete after 30 days
    </h5>
   </div>

   <ul className='grid grid-cols-1 md:grid-cols-2 my-lg-4 my-2 my-md-3 gap-lg-3 gap-2 flex-grow-1 overflow-y-auto style-scrollbar-y style-scrollbar-y-sm'>
    {dustbinNotes?.map((note) => (
     <NoteCard
      type='delete'
      note={note}
      noteList={dustbinNotes}
      key={note.idNote}
      updateNotes={getDustbinNotes}
     />
    ))}
   </ul>
  </div>
 )
}

export default Dustbin
