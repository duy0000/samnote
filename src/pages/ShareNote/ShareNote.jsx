import { useContext, useEffect, useState } from 'react'

import { convertApiToTime, isLightColor } from '../../utils/utils'
import { AppContext } from '../../context'
import imageCreateNote from '../../assets/create-note.png'

import {
 Checkbox,
 FormControl,
 FormControlLabel,
 InputLabel,
 MenuItem,
 Select,
 TextField,
} from '@mui/material'

import Slider from 'react-slick'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import ChecklistNote from '../../share/ChecklistNote'
import TextEditor from '../../share/TextEditor'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'
import { useParams } from 'react-router-dom'

const ShareNote = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext

 const [checklist, setChecklist] = useState([])
 const [dataContent, setDataContent] = useState({
  isError: false,
  message: '',
  content: '',
 })

 const [color, setColor] = useState({
  b: 250,
  g: 250,
  r: 255,
  name: 'snow',
 })

 const [dataForm, setDataForm] = useState({
  title: '',
  dueAt: null,
  type: 'text',
  data: '',

  remindAt: null,
  pinned: false,
  notePublic: 1,
  lock: '',
  color: '',
  idFolder: null,
 })

 const { title, dueAt, type, remindAt, pinned, notePublic, lock, idFolder } =
  dataForm

 const [images, setImages] = useState([])

 const [colorList, setColorList] = useState([])
 const [folderList, setFolderList] = useState([])

 useEffect(() => {
  if (!user?.id) return

  fetchApiSamenote('get', '/get_all_color').then((data) =>
   setColorList(data.data)
  )
  fetchApiSamenote('get', `/folder/${user?.id}`).then((data) =>
   setFolderList(data.folder)
  )
 }, [user?.id])

 const { id } = useParams()

 useEffect(() => {
  fetchApiSamenote('get', `/note-share/${id}`).then((data) => {
   setImages(data.note.image)
   setDataForm({
    title: data.note.title,
    dueAt: data.note.dueAt ? convertApiToTime(data.note.dueAt) : null,
    type: data.note.type,
    data: data.note.data,

    remindAt: data.note.remindAt ? convertApiToTime(data.note.remindAt) : null,
    pinned: data.note.pinned,
    notePublic: data.note.notePublic,
    lock: '',
    color: data.note.color,
    idFolder: 46,
   })
  })
 }, [id])

 useEffect(() => {
  // render color when component mounted
  const handleColor = () => {
   if (colorList.length < 1 || !dataForm.color) return

   const colorMatch = colorList?.filter(
    (item) =>
     item.r === dataForm?.color.r &&
     item.g === dataForm?.color.g &&
     item.b === dataForm?.color.b
   )
   setColor(colorMatch[0] || color)
  }
  handleColor()
 }, [colorList, dataForm])

 const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 8,
  slidesToScroll: 1,
  className: 'slider-btn-arrow',
  nextArrow: (
   <button type='button'>
    <ArrowForwardIosIcon />
   </button>
  ),
  prevArrow: (
   <button type='button'>
    <ArrowBackIosIcon />
   </button>
  ),

  responsive: [
   {
    breakpoint: 1500,
    settings: {
     slidesToShow: 7,
     slidesToScroll: 1,
    },
   },
   {
    breakpoint: 1000,
    settings: {
     slidesToShow: 5,
     slidesToScroll: 1,
    },
   },

   {
    breakpoint: 700,
    settings: {
     slidesToShow: 3,
     slidesToScroll: 1,
    },
   },

   {
    breakpoint: 400,
    settings: {
     slidesToShow: 2,
     slidesToScroll: 1,
    },
   },
  ],
 }


 return (
  <div className='bg-[#181A1B] w-full h-screen p-md-4 p-2 flex flex-col gap-3 overflow-y-auto style-scrollbar-y style-scrollbar-y-md'>
   <div className='flex justify-center items-end gap-2'>
    <img src={imageCreateNote} alt='' />

    <h3 className='text-white'>Share Note</h3>
   </div>

   <form className='bg-[#3A3F42] grid grid-cols-1 xl:grid-cols-2 flex-grow-1 rounded-t-[10px]'>
    <div className='p-md-4 p-2 flex flex-col justify-between'>
     <div className='max-w-[600px] mx-auto w-full'>
      <div className='grid sm:grid-cols-2 grid-cols-1 2xl:gap-3 gap-2'>
       <div className=''>
        <InputLabel className='text-white'>Title</InputLabel>
        <TextField
         className='w-full bg-white rounded-1 '
         size='small'
         type='text'
         value={title}
        />
       </div>

       <div>
        <InputLabel className='text-white' id='select-type-form'>
         Type
        </InputLabel>

        <FormControl className=' bg-white rounded-1 w-full'>
         <Select
          value={type}
          labelId='select-type-form'
          size='small'
          className='capitalize'
         >
          <MenuItem value={'text'} className='capitalize'>
           text
          </MenuItem>

          <MenuItem value={'checklist'} className='capitalize'>
           check list
          </MenuItem>
         </Select>
        </FormControl>
       </div>

       <div>
        <InputLabel className='text-white'>Lock</InputLabel>
        <TextField
         className='w-full bg-white rounded-1 '
         size='small'
         type='password'
         value={lock}
        />
       </div>

       <div>
        <InputLabel className='text-white' id='select-folder-form'>
         Folder
        </InputLabel>

        <FormControl className=' bg-white rounded-1 w-full'>
         <Select
          labelId='select-folder-form'
          size='small'
          className='capitalize'
          value={idFolder}
         >
          {folderList?.map(({ id, nameFolder }) => (
           <MenuItem key={id} value={id} className='capitalize'>
            {nameFolder}
           </MenuItem>
          ))}
         </Select>
        </FormControl>
       </div>

       <div>
        <InputLabel className='text-white' id='select-color-form'>
         Background
        </InputLabel>

        <FormControl className=' bg-white rounded-1 w-full'>
         <Select
          style={{
           background: `rgb(${color?.r}, ${color?.g}, ${color?.b})`,
           color: isLightColor(color) ? 'black' : 'white',
          }}
          labelId='select-color-form'
          size='small'
          value={color?.name}
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
         <Select labelId='select-public-form' size='small' value={notePublic}>
          <MenuItem value={1}>Public</MenuItem>
          <MenuItem value={0}>Private</MenuItem>
         </Select>
        </FormControl>
       </div>

       <div>
        <div>
         <InputLabel className='text-white'>Remind At</InputLabel>
         <TextField
          className='w-full bg-white rounded-1 '
          size='small'
          type='date'
          value={remindAt}
         />
        </div>
       </div>

       <div>
        <div>
         <InputLabel className='text-white'>Due At</InputLabel>
         <TextField
          className='w-full bg-white rounded-1 '
          size='small'
          type='date'
          value={dueAt}
         />
        </div>
       </div>
      </div>

      <div className='flex justify-between 2xl:mt-4 mt-2'>
       <div className='flex justify-start items-center gap-3'>
        <FormControlLabel
         className=' text-white rounded-1 '
         label='Pinned'
         control={<Checkbox className='text-white w-max h-max' />}
         value={pinned}
        />
       </div>

       <div>
        <button
         disabled={true}
         className='btn btn-primary text-white md:text-lg text-sm uppercase opacity-50'
        >
         Create
        </button>
       </div>
      </div>
     </div>

     {images.length > 0 ? (
      <div className='bg-white px-2 pt-1 px-sm-3 pt-sm-2 rounded-sm sm:rounded-md'>
       <div className='flex justify-end gap-2 mb-2'>
        <div>
         <input id='checked-list' type='checkbox' hidden />
         <label
          className='btn btn-primary md:text-lg text-sm'
          htmlFor='checked-list'
         >
          Select All
         </label>
        </div>

        <div>
         <button type='button' className='btn btn-danger md:text-lg text-sm'>
          Delete
         </button>
        </div>
       </div>

       <div className='xl:max-w-[40vw] max-w-[80vw] mx-auto'>
        <Slider {...settings}>
         {images?.map(({ id, link }) => (
          <li key={id} className='p-1 position-relative noteEdit-imageItem'>
           <div className='position-absolute right-0 left-0 top-0 px-1 flex justify-between w-full items-center'>
            <div>
             <button type='button'>
              <CloseIcon className='text-[20px]' />
             </button>
            </div>

            <div>
             <input type='checkbox' />
            </div>
           </div>

           <img
            className='object-cover aspect-[3/4] w-full rounded-sm border border-gray-400'
            src={link}
            alt='img-editnote'
           />
          </li>
         ))}
        </Slider>
       </div>
      </div>
     ) : null}
    </div>

    <div className='flex relative p-xl-0 p-md-4 p-2'>
     {type === 'text' ? (
      <TextEditor
       setDataContent={setDataContent}
       onChangeTextEditor={() => {}}
       value={dataForm.data}
      />
     ) : (
      <ChecklistNote checklist={dataForm.data} setChecklist={setChecklist} />
     )}
    </div>
   </form>
  </div>
 )
}

export default ShareNote
