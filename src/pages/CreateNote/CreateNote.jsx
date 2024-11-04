import { useContext, useEffect, useState } from 'react'

import uniqid from 'uniqid'
import { convertColorNoteToApi, convertTimeToApi } from '../../utils/utils'

import { joiResolver } from '@hookform/resolvers/joi'
import { useForm } from 'react-hook-form'
import { schemaNoteCreate } from '../../utils/schema'

import { AppContext } from '../../context'

import ImageIcon from '@mui/icons-material/Image'
import { Checkbox, FormControlLabel } from '@mui/material'
import imageCreateNote from '../../assets/create-note.png'
import FormNote from '../../share/FormNote'

import AddImages from './AddImages'
import TextEditor from '../../share/TextEditor'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'
import ChecklistNote from '../../share/ChecklistNote'

const CreateNote = () => {
 const appContext = useContext(AppContext)
 const { user, setSnackbar } = appContext

 const [checklist, setChecklist] = useState([])
 const [dataContent, setDataContent] = useState({
  isError: false,
  message: '',
  content: '',
 })

 const [uploadImageList, setUploadImageList] = useState([])
 const [color, setColor] = useState({
  b: 250,
  g: 250,
  r: 255,
  name: 'snow',
 })

 const {
  register,
  handleSubmit,
  watch,
  reset,

  formState: { errors, dirtyFields },
 } = useForm({
  resolver: joiResolver(schemaNoteCreate),
  defaultValues: {
   title: '',
   dueAt: null,
   type: 'text',

   remindAt: null,
   pinned: false,
   notePublic: 1,
   lock: '',
   color: '',
   idFolder: null,
  },
 })

 const typeForm = watch('type')

 const [textEditor, setTextEditor] = useState('')
 const handleChangeTextEditor = (text) => setTextEditor(text)
 const handleChangeColor = (color) => setColor(color)

 const postNote = (data) => {
  fetchApiSamenote('post', `/notes/${user?.id}`, data).then((data) => {
   if (data?.error) {
    return setSnackbar({
     isOpen: true,
     message: `${data?.error}`,
     severity: 'error',
    })
   }

   reset()
   setDataContent({
    isError: false,
    message: '',
    content: '',
   })
   setChecklist([])
   setColor({ b: 250, g: 250, r: 255, name: 'snow' })

   setSnackbar({
    isOpen: true,
    message: `Create note success!`,
    severity: 'success',
   })

   setUploadImageList([])
   // post image list
   const newFormData = new FormData()
   newFormData.append('id_user', user?.id)
   newFormData.append('id_note', data.note.idNote)

   uploadImageList.forEach((image) => {
    newFormData.append('image_note', image.file)
   })

   fetchApiSamenote('post', '/add_image_note', newFormData)
  })
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
  if (textEditor.trim() === '' && typeForm === 'text') return
  if (checklist.length === 0 && typeForm === 'checklist') return

  if (checklist.length > 0 || typeForm === 'text')
   setDataContent((prev) => ({ ...prev, isError: false, message: '' }))
 }, [textEditor, checklist.length])

 console.log('errors', errors)

 const onSubmit = async (data) => {
  // set errors when text empty
  if (typeForm === 'text') {
   if (textEditor.trim() === '')
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
   linkNoteShare: '',
  }

  return postNote(dataForm)
 }

 // handle upload image
 const handleChangeImage = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const blobUrl = URL.createObjectURL(file)
  const image = {
   id: uniqid(file.id),
   file,
   src: blobUrl,
  }

  setUploadImageList([...uploadImageList, image])
 }

 // disable btn
 const disableBtnSubmit = () => {
  return Object.keys(dirtyFields).length === 0 && textEditor?.trim() == ''
 }

 return (
  <div className='bg-[#181A1B] w-full p-md-4 p-2 flex flex-col gap-3 overflow-y-auto style-scrollbar-y style-scrollbar-y-md'>
   <div className='flex justify-center items-end gap-2'>
    <img src={imageCreateNote} alt='' />

    <h3 className='text-white'>Create Note</h3>
   </div>

   <form
    onSubmit={handleSubmit(onSubmit)}
    className='bg-[#3A3F42] grid grid-cols-1 xl:grid-cols-2 flex-grow-1 rounded-t-[10px]'
   >
    <div className='p-md-4 p-2 flex flex-col justify-between'>
     <div className='max-w-[600px] mx-auto w-full'>
      <FormNote
       userID={user?.id}
       register={register}
       watch={watch}
       errors={errors}
       dirtyFields={dirtyFields}
       onChangeColor={handleChangeColor}
       color={color}
      />

      <div className='flex justify-between 2xl:mt-4 mt-2'>
       <div className='flex justify-start items-center gap-3'>
        <FormControlLabel
         className=' text-white rounded-1 '
         label='Pinned'
         control={
          <Checkbox
           className='text-white w-max h-max'
           {...register('pinned')}
          />
         }
        />

        {typeForm === 'text' && (
         <div>
          <input
           onChange={handleChangeImage}
           id='upload-file-craete-note'
           type='file'
           className='hidden'
          />
          <label htmlFor='upload-file-craete-note' className='flex'>
           <ImageIcon className='text-[40px] text-white' />
          </label>
         </div>
        )}
       </div>

       <div>
        <button
         disabled={disableBtnSubmit()}
         className={`btn btn-primary text-white md:text-lg text-sm uppercase ${
          disableBtnSubmit() ? 'opacity-50' : 'opacity-100'
         }`}
        >
         Create
        </button>
       </div>
      </div>
     </div>

     <AddImages
      imageList={uploadImageList}
      onChangeUploadImages={setUploadImageList}
     />
    </div>

    <div className='flex relative p-xl-0 p-md-4 p-2'>
     {dataContent.isError && (
      <p className='text-red-600 w-max absolute top-[120px] left-[15px]'>
       {dataContent.message}
      </p>
     )}

     {typeForm === 'text' ? (
      <TextEditor
       setDataContent={setDataContent}
       onChangeTextEditor={handleChangeTextEditor}
       value={dataContent.content}
      />
     ) : (
      <ChecklistNote checklist={checklist} setChecklist={setChecklist} />
     )}
    </div>
   </form>
  </div>
 )
}

export default CreateNote
