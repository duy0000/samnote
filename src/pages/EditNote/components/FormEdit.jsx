import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom'

import { AppContext } from '../../../context'
import { joiResolver } from '@hookform/resolvers/joi'
import { useForm } from 'react-hook-form'
import { schemaNoteEdit } from '../../../utils/schema'

import {
 convertApiToTime,
 convertColorNoteToApi,
 convertTimeToApi,
 isLightColor,
} from '../../../utils/utils'

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { fetchAllFolder, fetchNoteList } from '../fetchApiEditNote'
import DeleteImages from './DeleteImages'

import {
 Checkbox,
 FormControl,
 FormControlLabel,
 InputLabel,
 MenuItem,
 Select,
 TextField,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import LinkIcon from '@mui/icons-material/Link'

import configs from '../../../configs/configs.json'
import ModalCreateFolder from '../../../share/ModalCreateFolder'
import TextEditor from '../../../share/TextEditor'
import AddImages from './AddImages'
import ChecklistNote from '../../../share/ChecklistNote'
import { Modal } from 'react-bootstrap'
const { API_SERVER_URL } = configs

const FormEdit = (props) => {
 const { updateNotes } = props
 const appContext = useContext(AppContext)
 const { user, setSnackbar } = appContext
 const { id } = useParams()
 const [searchParams, setSearchParam] = useSearchParams()
 const currentPage = searchParams.get('page')

 const [noteItem, setNoteItem] = useState({})

 const navigate = useNavigate()

 const [checklist, setChecklist] = useState([])
 const [dataContent, setDataContent] = useState({
  isError: false,
  message: '',
  content: '',
 })

 const [colorList, setColorList] = useState([])
 const [folderList, setFolderList] = useState([])
 const [color, setColor] = useState({
  b: 250,
  g: 250,
  r: 255,
  name: 'snow',
 })

 const [textEditor, setTextEditor] = useState('')

 const handleChangeTextEditor = (text) => setTextEditor(text)

 // Declare variables for the form
 const {
  register,
  handleSubmit,
  setValue,
  watch,
  reset,

  formState: { errors, dirtyFields },
 } = useForm({
  resolver: joiResolver(schemaNoteEdit),
  defaultValues: {
   notePublic: 1,
   pinned: false,
   title: '',
   dueAt: null,
   remindAt: null,
   lock: '',
   color: '',
   type: 'text',
   idFolder: '',
  },
 })

 const notePublicForm = watch('notePublic')
 const colorForm = watch('color')
 const folderForm = watch('idFolder')
 const pinnedForm = watch('pinned')
 const typeForm = watch('type')

 const getDataNoteId = async () => {
  const noteList = await fetchNoteList(user?.id)
  const noteId = noteList.filter((note) => note.idNote === Number.parseInt(id))

  setNoteItem(noteId[0])

  // set values form default
  setValue('title', noteId[0].title)
  setValue('pinned', noteId[0].pinned)
  setValue('type', noteId[0].type)
  setValue('notePublic', noteId[0].notePublic)
  setValue('idFolder', noteId[0].idFolder)

  noteId[0].remindAt
   ? setValue('remindAt', convertApiToTime(noteId[0].remindAt))
   : setValue('remindAt', null)

  noteId[0].dueAt
   ? setValue('dueAt', convertApiToTime(noteId[0].dueAt))
   : setValue('dueAt', null)

  if (noteId[0].type === 'text') {
   setDataContent((prev) => ({
    ...prev,
    content: noteId[0].data,
    isError: false,
   }))
  } else {
   setChecklist(noteId[0].data)
  }
 }

 // reset content
 useEffect(() => {
  if (typeForm === 'text') {
   setChecklist([])
   setDataContent((prev) => ({ ...prev, isError: false }))
  } else {
   setDataContent((prev) => ({ ...prev, isError: false, content: '' }))
  }
 }, [typeForm])

 // reset errors
 useEffect(() => {
  if (
   dataContent.content.trim() === '<p><br></p>' &&
   typeForm === 'text' &&
   textEditor?.trim() === ''
  )
   return
  if (checklist.length === 0 && typeForm === 'checklist') return

  if (
   checklist.length > 0 ||
   (typeForm === 'text' && dataContent.content.trim() !== '<p><br></p>')
  )
   setDataContent((prev) => ({ ...prev, isError: false, message: '' }))
 }, [textEditor, checklist.length, dataContent.content])

 useEffect(() => {
  const fetchAllColor = async () => {
   try {
    const response = await axios.get(`${API_SERVER_URL}/get_all_color`)
    setColorList(response.data.data)
   } catch (error) {
    console.error(error)
   }
  }

  const getFolders = async () => {
   const folders = await fetchAllFolder(user?.id)
   setFolderList(folders)
  }

  if (!user?.id) return
  getFolders()
  fetchAllColor()

  if (!id) {
   setDataContent({
    isError: false,
    message: '',
    content: '',
   })

   return reset()
  }

  getDataNoteId()
 }, [user?.id, id])

 useEffect(() => {
  // render color when component mounted
  const handleColor = () => {
   if (colorList.length < 1 || !noteItem.color) return

   const colorMatch = colorList?.filter(
    (item) =>
     item.r === noteItem?.color.r &&
     item.g === noteItem?.color.g &&
     item.b === noteItem?.color.b
   )
   setValue('color', colorMatch[0]?.name)
   setColor(colorMatch[0])
  }

  handleColor()
 }, [colorList, noteItem, id])

 useEffect(() => {
  // check color form change?
  if (!dirtyFields.color) return

  // handle change color
  const colorMatch = colorList?.filter((color) => color.name === colorForm)
  setColor(colorMatch[0])
 }, [colorForm])

 const pacthNote = async (noteId, data) => {
  try {
   const response = await axios.patch(`${API_SERVER_URL}/notes/${noteId}`, data)
   updateNotes && updateNotes()

   setSnackbar({
    isOpen: true,
    message: `Update note complete!`,
    severity: 'success',
   })
  } catch (error) {
   console.error(error)
  }
 }

 const onSubmit = async (data) => {
  if (color.name !== data.color || !noteItem.idNote || !id) return

  // set errors when text empty
  if (typeForm === 'text') {
   if (
    textEditor?.trim() === '' &&
    dataContent.content.trim() === '<p><br></p>'
   )
    return setDataContent((prev) => ({
     ...prev,
     isError: true,
     message: 'Not content yet!',
    }))
  }

  // set errors when checkbox empty
  if (typeForm === 'checklist') {
   if (checklist.length === 0)
    return setDataContent((prev) => ({
     ...prev,
     isError: true,
     message: 'Not content yet!',
    }))
  }

  const newChecklist = checklist?.map((item) => {
   delete item.id
   return item
  })

  const dataForm = {
   ...data,
   data: typeForm === 'text' ? dataContent.content : newChecklist,
   color: convertColorNoteToApi(color),
   dueAt: convertTimeToApi(data.dueAt),
   remindAt: convertTimeToApi(data.remindAt),
   type: noteItem.type,
  }

  pacthNote(noteItem.idNote, dataForm)
 }

 // disable btn
 const disableBtnSubmit = () => {
  const isChangeForm =
   Object.keys(dirtyFields).length === 0 &&
   (noteItem.data === dataContent.content.trim() ||
    noteItem.data === textEditor?.trim())

  const isNoteIdEdit = !id
  return isChangeForm || isNoteIdEdit
 }

 // create folder

 const [showModalFolder, setShowModalFolder] = useState(false)
 const handleShowModalFolder = () => setShowModalFolder(true)

 const [showModalShareNote, setShowModalShareNote] = useState(false)
 return (
  <div className='p-2 bg-[#3A3F42] rounded-lg flex flex-col flex-grow-1'>
   <Link
    to={`/editnote?page=${currentPage}`}
    className='absolute top-2 left-2 lg:top-6 lg:left-6 flex bg-white rounded-sm'
   >
    <KeyboardBackspaceIcon className='xl:hidden lg:text-3xl text-2xl text-dark' />
   </Link>

   <ModalCreateFolder
    showModalFolder={showModalFolder}
    setShowModalFolder={setShowModalFolder}
    setFolderList={setFolderList}
    folderList={folderList}
   />

   <form
    onSubmit={handleSubmit(onSubmit)}
    className='flex flex-col flex-grow-1 gap-3'
    action=''
   >
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 gap-sm-3 text-white'>
     <div>
      <InputLabel className='text-white'>Type</InputLabel>
      <TextField
       className='w-full bg-white rounded-1 '
       size='small'
       type='text'
       disabled={true}
       {...register('type')}
      />
     </div>

     <div>
      <InputLabel className='text-white'>Title</InputLabel>
      <TextField
       className='w-full bg-white rounded-1 '
       size='small'
       type='text'
       {...register('title')}
      />

      {errors.title && (
       <p style={{ borderBottom: '1px solid red' }} className='text-red-600'>
        {errors.title.message}
       </p>
      )}
     </div>

     <div>
      <div>
       <InputLabel className='text-white'>Remind At</InputLabel>
       <TextField
        className='w-full bg-white rounded-1 '
        size='small'
        type='date'
        {...register('remindAt')}
       />
      </div>

      {errors.remindAt && (
       <p style={{ borderBottom: '1px solid red' }} className='text-red-600'>
        {errors.remindAt.message}
       </p>
      )}
     </div>

     <div>
      <InputLabel className='text-white'>Lock</InputLabel>
      <TextField
       className='w-full bg-white rounded-1 '
       size='small'
       type='password'
       {...register('lock')}
      />
     </div>

     <div>
      <InputLabel className='text-white' id='select-public-form'>
       Folder
      </InputLabel>

      <FormControl className=' bg-white rounded-1 w-full'>
       <Select
        value={folderForm}
        {...register('idFolder')}
        labelId='select-public-form'
        size='small'
        className='capitalize'
       >
        {folderList?.map(({ id, nameFolder }) => (
         <MenuItem key={id} value={id} className='capitalize'>
          {nameFolder}
         </MenuItem>
        ))}

        <MenuItem value={null} onClick={handleShowModalFolder}>
         <AddIcon className='me-2' /> Create folder
        </MenuItem>
       </Select>
      </FormControl>
     </div>

     <div>
      <div>
       <InputLabel className='text-white'>Due At</InputLabel>
       <TextField
        className='w-full bg-white rounded-1 '
        size='small'
        type='date'
        {...register('dueAt')}
       />
      </div>

      {errors.dueAt && (
       <p style={{ borderBottom: '1px solid red' }} className='text-red-600'>
        {errors.dueAt.message}
       </p>
      )}
     </div>

     <div>
      <InputLabel className='text-white' id='select-color-form'>
       Background
      </InputLabel>

      <FormControl className=' bg-white rounded-1 w-full'>
       <Select
        value={colorForm}
        style={{
         background: `rgb(${color?.r}, ${color?.g}, ${color?.b})`,
         color: isLightColor(color) ? 'black' : 'white',
        }}
        {...register('color')}
        labelId='select-color-form'
        size='small'
       >
        {colorList?.map((colorOption) => (
         <MenuItem
          className='capitalize'
          key={colorOption.id}
          value={colorOption.name}
         >
          {colorOption.name}
          <span
           style={{
            height: '20px',
            width: '20px',
            border: '1px solid black',
            marginLeft: '3px',
            background: `rgb(${colorOption.r}, ${colorOption.g}, ${colorOption.b})`,
           }}
          ></span>
         </MenuItem>
        ))}
       </Select>
      </FormControl>
     </div>

     <div>
      <InputLabel className='text-white' id='select-public-form'>
       Note Public
      </InputLabel>

      <FormControl className=' bg-white rounded-1 w-full'>
       <Select value={notePublicForm} {...register('notePublic')} size='small'>
        <MenuItem value={1}>Public</MenuItem>
        <MenuItem value={0}>Private</MenuItem>
       </Select>
      </FormControl>
     </div>

     <div className='flex justify-end items-end pt-sm-0 pt-2 sm:col-span-2 lg:col-span-1'>
      <button
       disabled={disableBtnSubmit()}
       type='submit'
       className='btn btn-primary uppercase'
      >
       Save
      </button>
     </div>
    </div>

    <DeleteImages
     images={noteItem?.image}
     userId={user?.id}
     noteId={noteItem.idNote}
     updateNotes={updateNotes || null}
     onGetNoteId={getDataNoteId}
    />

    <div className='flex justify-start items-center'>
     <FormControlLabel
      className=' text-white rounded-1'
      label='Pinned'
      control={
       <Checkbox
        className='text-white'
        value={pinnedForm}
        {...register('pinned')}
       />
      }
     />

     {notePublicForm === 1 && id && (
      <div>
       <button
        type='button'
        onClick={() => setShowModalShareNote(true)}
        className='btn btn-primary w-max'
       >
        Share Note
       </button>
      </div>
     )}

     <Modal
      centered
      show={showModalShareNote}
      onHide={() => setShowModalShareNote(false)}
      size='sm'
     >
      <div className='bg-slate-600 flex justify-center items-center rounded-lg'>
       <button
        type='button'
        onClick={() => {
         navigator.clipboard
          .writeText(`${window.location.origin}/share-note/${noteItem.idNote}`)
          .then(() => {
           setSnackbar({
            isOpen: true,
            message: `Link copied`,
            severity: 'success',
           })

           setShowModalShareNote(false)
          })
        }}
        title='Copy link'
       >
        <LinkIcon className='text-white text-[60px]' />
       </button>
      </div>
     </Modal>

     {typeForm === 'text' && (
      <AddImages
       userId={user?.id}
       noteId={id}
       updateNotes={updateNotes || null}
       onGetNoteId={getDataNoteId}
      />
     )}
    </div>

    <div className='mx-auto w-full flex flex-col flex-grow-1 gap-2'>
     {dataContent.isError && (
      <p
       style={{ borderBottom: '1px solid red' }}
       className='text-red-600 w-max'
      >
       {dataContent.message}
      </p>
     )}

     {typeForm === 'text' ? (
      <TextEditor
       value={dataContent.content}
       setDataContent={setDataContent}
       onChangeTextEditor={handleChangeTextEditor}
      />
     ) : (
      <ChecklistNote checklist={checklist} setChecklist={setChecklist} />
     )}
    </div>
   </form>
  </div>
 )
}

export default FormEdit
