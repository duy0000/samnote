import React, { useState, useContext } from 'react'
import {
 Box,
 TextField,
 IconButton,
 CircularProgress,
 Typography,
 Avatar,
 Button,
} from '@mui/material'
import { NavLink, useParams, useLocation, useNavigate } from 'react-router-dom'

import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { AppContext } from '../../context'
import api from '../../api'
import './AnonymousMess.css'

const SearchUnknowMessage = ({ onUserSelect }) => {
 const appContext = useContext(AppContext)
 const { user } = appContext
 const [state, setState] = useState({
  searchData: '',
  dataSearch: null,
  loading: false,
  status: false,
 })

 const handleSearchChange = (event) => {
  setState({ ...state, searchData: event.target.value })
 }

 const SearchMessage = async () => {
  try {
   setState({ ...state, loading: true })

   // Tạo payload cho body request
   const payload = {
    start_name: state.searchData,
   }

   // Gửi request POST đến API
   const res = await api.post(
    'https://samnote.mangasocial.online/group/search_user_by_word',
    payload
   )

   // Cập nhật state với dữ liệu trả về
   if (res.data.status == 200) {
    setState({
     ...state,
     dataSearch: res.data.data.filter((item) => item.idUser !== user.id),
    })
   } else {
    setState({
     ...state,
     dataSearch: res.data.message,
    })
   }
  } catch (err) {
   console.error(err)
   setState((prevState) => ({ ...prevState, loading: false })) // Đảm bảo loading được tắt ngay cả khi có lỗi
  } finally {
   setState((prevState) => ({ ...prevState, loading: false }))
  }
 }

 const clearSearch = () => {
  setState({ ...state, status: false, searchData: '', dataSearch: null })
 }

 const handleClick = (event) => {
  event.stopPropagation() // Ngăn sự kiện click truyền lên cha
 }

 const { searchData, dataSearch, loading, status } = state

 return (
  <Box>
   <Box
    className='flex items-center bg-white rounded-[30px] h-[40px] xl:h-[60px] text-black my-[10px] mx-[20px] px-[20px] lg:text-[15px] xl:text-[20px] w-[90%] justify-between'
    onClick={() => setState({ ...state, status: true })} // Mở khi nhấp vào Box
   >
    Search User
    <SearchIcon />
   </Box>

   {/* Search Results */}
   {status && (
    <div
     className='absolute top-0 left-0 right-0 bottom-0 z-[100]'
     style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
     onClick={clearSearch}
    >
     <div
      className='pb-[30px] bottom-5 lg:w-[350px] xxl:w-[400px] overflow-hidden absolute bg-white px-1 z-[10] rounded-md left-3 xxl:left-[100px] top-3 xxl:top-20'
      onClick={handleClick}
     >
      <div className='h-[140px]'>
       <div className='my-[15px] px-[10px] flex items-center justify-between'>
        <h3 className='text-black capitalize'>search user</h3>
        <CloseIcon className='bg-black cursor-pointer' onClick={clearSearch} />
       </div>
       <div className='py-[15px] px-[10px] flex items-center justify-between'>
        <TextField
         id='outlined-basic'
         placeholder='User Name'
         value={searchData}
         size='small'
         onChange={handleSearchChange}
         sx={{
          width: '90%',
          padding: 0,
          margin: '0 0 0px 15px',
          input: { color: '#000' },
         }}
         InputLabelProps={{ style: { color: '#000' } }}
        />
        <IconButton className='w-[100px] h-[20px]'>
         {loading ? (
          <CircularProgress size={24} />
         ) : (
          <Button
           disabled={!searchData}
           variant='contained'
           className={`${
            searchData
             ? 'bg-black lg:h-[30px] lg:text-[12px] xxl:h-[40px] xxl:text-[14px]'
             : ''
           }`}
           onClick={SearchMessage}
          >
           Search
          </Button>
         )}
        </IconButton>
       </div>
      </div>
      <div className='overflow-auto h-[410px] scrollbar pb-[30px]'>
       {dataSearch && Array.isArray(dataSearch) ? (
        dataSearch.map((item) => (
         <Box
          key={item.idUser}
          sx={{
           display: 'flex',
           alignItems: 'center',
           borderRadius: '10px',
           margin: '5px 0px',
           padding: '5px',
           color: '#000',
           justifyContent: 'space-between',
          }}
         >
          <Box
           sx={{
            display: 'flex',
            alignItems: 'center',
            width: '80%',
           }}
          >
           <Avatar
            className='size-[40px] xxl:size-[60px]'
            sx={{
             margin: '0 4px',
            }}
            src={item.linkAvatar}
           />
           <Box sx={{ marginLeft: '10px', width: '70%' }}>
            <Typography
             sx={{
              overflow: 'hidden',
              width: '100%',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              fontSize: '20px',
              fontWeight: '700',
             }}
            >
             {item.userName}
            </Typography>
           </Box>
          </Box>

          <NavLink
           to={`/incognito/user/${item.idUser}`}
           className='bg-[#F56852]  lg:h-[30px] lg:text-[12px] xxl:h-[40px] xxl:text-[14px] py-1 px-3 uppercase font-bold text-white rounded-md flex items-center'
           onClick={() => {
            clearSearch() // Xóa tìm kiếm
           }}
          >
           Chat
          </NavLink>
         </Box>
        ))
       ) : (
        <Typography
         variant='body1'
         sx={{ margin: '20px 10px 0 20px', color: 'red' }}
        >
         {dataSearch}
        </Typography>
       )}
      </div>
     </div>
    </div>
   )}
  </Box>
 )
}

export default SearchUnknowMessage
