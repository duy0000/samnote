import { useEffect, useState } from 'react'

import {
 FormControl,
 InputLabel,
 MenuItem,
 Select,
 TextField,
} from '@mui/material'
import { fetchApiSamenote } from '../utils/fetchApiSamnote'

import AddIcon from '@mui/icons-material/Add'
import ModalCreateFolder from './ModalCreateFolder'
import { isLightColor } from '../utils/utils'

const FormNote = ({
 register,
 watch,
 errors,
 userID,
 dirtyFields,
 onChangeColor,
 color,
}) => {
 const [colorList, setColorList] = useState([])
 const [folderList, setFolderList] = useState([])

 const notePublicForm = watch('notePublic')
 const colorForm = watch('color')
 const folderForm = watch('idFolder')
 const typeForm = watch('type')

 useEffect(() => {
  if (!userID) return

  fetchApiSamenote('get', '/get_all_color').then((data) =>
   setColorList(data.data)
  )
  fetchApiSamenote('get', `/folder/${userID}`).then((data) =>
   setFolderList(data.folder)
  )
 }, [userID])

 useEffect(() => {
  // check color form change?
  if (!dirtyFields.color) return

  // handle change color
  const colorMatch = colorList?.find((color) => color.name === colorForm)
  onChangeColor(colorMatch)
 }, [colorForm])

 // create folder

 const [showModalFolder, setShowModalFolder] = useState(false)
 const handleShowModalFolder = () => setShowModalFolder(true)

 return (
  <div className='grid sm:grid-cols-2 grid-cols-1 2xl:gap-3 gap-2'>
   <ModalCreateFolder
    showModalFolder={showModalFolder}
    setShowModalFolder={setShowModalFolder}
    folderList={folderList}
    setFolderList={setFolderList}
   />
   <div className=''>
    <InputLabel className='text-white'>Title</InputLabel>
    <TextField
     className='w-full bg-white rounded-1 '
     size='small'
     type='text'
     {...register('title')}
    />

    {errors.title && (
     <p className='text-red-600 md:text-[16px] text-sm border-b border-red-600 mt-1'>
      {errors.title.message}
     </p>
    )}
   </div>

   <div>
    <InputLabel className='text-white' id='select-type-form'>
     Type
    </InputLabel>

    <FormControl className=' bg-white rounded-1 w-full'>
     <Select
      value={typeForm}
      {...register('type')}
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

    {errors.type && (
     <p className='text-red-600 border-b border-red-600 md:text-[16px] text-sm mt-1'>
      {errors.type.message}
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
    <InputLabel className='text-white' id='select-folder-form'>
     Folder
    </InputLabel>

    <FormControl className=' bg-white rounded-1 w-full'>
     <Select
      value={folderForm}
      {...register('idFolder')}
      labelId='select-folder-form'
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
     <Select
      labelId='select-public-form'
      value={notePublicForm}
      {...register('notePublic')}
      size='small'
     >
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
      {...register('remindAt')}
     />
    </div>

    {errors.remindAt && (
     <p
      style={{ borderBottom: '1px solid red' }}
      className='text-red-600 md:text-[16px] text-sm mt-1'
     >
      {errors.remindAt.message}
     </p>
    )}
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
     <p
      style={{ borderBottom: '1px solid red' }}
      className='text-red-600 md:text-[16px] text-sm mt-1'
     >
      {errors.dueAt.message}
     </p>
    )}
   </div>
  </div>
 )
}

export default FormNote
