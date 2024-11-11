import { useEffect, useState } from 'react'

import Undo from '../../assets/svgs/Undo'
import Redo from '../../assets/svgs/Redo'
import penCanvas from '../../assets/pen.png'
import BackspaceIcon from '@mui/icons-material/Backspace'
import Eraser from '../../assets/svgs/Eraser'

import uniqid from 'uniqid'

import { COLOR_LIST } from '../../utils/constant'

const SketchBar = ({
 sketchCanvasRef,
 strokeColor,
 strokeWidth,
 onChangeColorCanvas,
 onChangeStrokeWidth,
 setFileImage,
}) => {
 const [eraseMode, setEraseMode] = useState(false)

 const handleEraserClick = () => {
  setEraseMode(true)
  sketchCanvasRef.current?.eraseMode(true)
 }

 const handlePenClick = () => {
  setEraseMode(false)
  sketchCanvasRef.current?.eraseMode(false)
 }

 const handleUndoClick = () => {
  sketchCanvasRef.current?.undo()
 }

 const handleRedoClick = () => {
  sketchCanvasRef.current?.redo()
 }

 const handleClearClick = () => {
  sketchCanvasRef.current?.clearCanvas()
 }

 const handleSaveCanvas = () => {
  // convert base64 to file

  const file = sketchCanvasRef.current.exportImage('png').then((data) => {
   fetch(data)
    .then((res) => res.blob())
    .then((blob) => {
     const file = new File([blob], `samnote_${uniqid()}`, { type: 'image/png' })
     setFileImage(file)
    })
  })
 }

 return (
  <>
   <div className='md:max-w-[200px] max-w-[150px] md:aspect-[1/2] hidden xsm:flex flex-col flex-grow-1 bg-[#618EA9] px-md-2 px-1 overflow-y-auto style-scrollbar-y style-scrollbar-y-sm'>
    <div className='px-md-2 px-1 flex flex-col gap-2 mb-3'>
     <button
      onClick={handleSaveCanvas}
      type='button'
      className='bg-red-600 opacity-90 duration-150 ease-out hover:opacity-100 text-white w-max mx-auto py-1 px-3 mt-2 rounded-md xl:text-xl md:text-lg text-[14px]'
     >
      Save
     </button>

     <div className='flex justify-between'>
      <button onClick={handleUndoClick} type='button'>
       <Undo />
      </button>

      <button onClick={handleRedoClick} type='button'>
       <Redo />
      </button>
     </div>

     <div className='flex justify-between'>
      <button type='button' disabled={!eraseMode} onClick={handlePenClick}>
       <img
        className={!eraseMode ? 'border border-white rounded-xl' : ''}
        src={penCanvas}
        alt='pen canvas'
       />
      </button>

      <div className='flex flex-col gap-2'>
       <button
        onClick={() => onChangeStrokeWidth(1)}
        className={`w-[40px] h-[30px] ${
         strokeWidth === 1 ? 'bg-white text-black' : 'bg-black text-white'
        }`}
       >
        X1
       </button>
       <button
        onClick={() => onChangeStrokeWidth(2)}
        className={`w-[40px] h-[30px] ${
         strokeWidth === 2 ? 'bg-white text-black' : 'bg-black text-white'
        }`}
       >
        X2
       </button>
       <button
        onClick={() => onChangeStrokeWidth(4)}
        className={`w-[40px] h-[30px] ${
         strokeWidth === 4 ? 'bg-white text-black' : 'bg-black text-white'
        }`}
       >
        X4
       </button>
      </div>
     </div>

     <div className='flex justify-between'>
      <button
       className={eraseMode ? 'border border-white rounded-xl' : ''}
       onClick={handleEraserClick}
       disabled={eraseMode}
       type='button'
      >
       <Eraser />
      </button>
      <button
       className='text-red-500 ease-in-out duration-100 hover:text-red-700'
       onClick={handleClearClick}
       type='button'
      >
       <BackspaceIcon className='text-5xl' />
      </button>
     </div>
    </div>

    <ul className='flex flex-wrap gap-2 justify-center'>
     {COLOR_LIST?.map((color) => (
      <li key={color}>
       <button
        onClick={() => onChangeColorCanvas(color)}
        type='button'
        style={{ backgroundColor: color }}
        className={`md:size-[30px] size-[25px] rounded-full border-solid border-white flex ${
         strokeColor === color ? 'border-4' : 'border'
        }`}
       ></button>
      </li>
     ))}
    </ul>
   </div>

   <div className='xsm:hidden grid grid-cols-2 gap-2 p-2 bg-[#618EA9]'>
    <ul className='flex flex-wrap gap-2 h-max'>
     {COLOR_LIST?.map((color) => (
      <li key={color}>
       <button
        onClick={() => onChangeColorCanvas(color)}
        type='button'
        style={{ backgroundColor: color }}
        className={`md:size-[30px] size-[25px] rounded-full border-solid border-white flex ${
         strokeColor === color ? 'border-2' : 'border'
        }`}
       ></button>
      </li>
     ))}
    </ul>
    <div className='px-md-2 px-1 flex'>
     <div className='w-1/2 flex flex-col gap-2'>
      <div className='flex justify-between'>
       <button onClick={handleUndoClick} type='button'>
        <Undo />
       </button>

       <button onClick={handleRedoClick} type='button'>
        <Redo />
       </button>
      </div>

      <div className='flex justify-between'>
       <div className='flex flex-col justify-between'>
        <button
         className={eraseMode ? 'border border-white rounded-xl' : ''}
         onClick={handleEraserClick}
         disabled={eraseMode}
         type='button'
        >
         <Eraser />
        </button>
        <button
         className='text-red-500 ease-in-out duration-100 hover:text-red-700'
         onClick={handleClearClick}
         type='button'
        >
         <BackspaceIcon className='xsm:text-5xl text-4xl' />
        </button>
       </div>

       <button type='button' disabled={!eraseMode} onClick={handlePenClick}>
        <img
         className={`w-[30px] ${
          !eraseMode ? 'border border-white rounded-xl' : ''
         }`}
         src={penCanvas}
         alt='pen canvas'
        />
       </button>
      </div>
     </div>

     <div className='flex flex-col flex-grow-1 gap-2 items-center justify-center'>
      <div className='flex flex-col'>
       <button
        onClick={() => onChangeStrokeWidth(1)}
        className={`xsm:w-[40px] xsm:h-[30px] xsm:text-[16px] text-sm w-[30px] h-[25px]  ${
         strokeWidth === 1 ? 'bg-white text-black' : 'bg-black text-white'
        }`}
       >
        X1
       </button>
       <button
        onClick={() => onChangeStrokeWidth(2)}
        className={`xsm:w-[40px] xsm:h-[30px] xsm:text-[16px] text-sm w-[30px] h-[25px] ${
         strokeWidth === 2 ? 'bg-white text-black' : 'bg-black text-white'
        }`}
       >
        X2
       </button>
       <button
        onClick={() => onChangeStrokeWidth(4)}
        className={`xsm:w-[40px] xsm:h-[30px] xsm:text-[16px] text-sm w-[30px] h-[25px] ${
         strokeWidth === 4 ? 'bg-white text-black' : 'bg-black text-white'
        }`}
       >
        X4
       </button>
      </div>

      <div>
       <button
        onClick={handleSaveCanvas}
        type='button'
        className='bg-red-600 opacity-90 duration-150 ease-out hover:opacity-100 text-white w-max mx-auto py-1 px-2 px-sm-3 rounded-md xl:text-xl md:text-lg text-[14px]'
       >
        Save
       </button>
      </div>
     </div>
    </div>
   </div>
  </>
 )
}

export default SketchBar
