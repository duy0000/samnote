import { Navigate, Outlet } from 'react-router-dom'
import UserPanel from '../share/UserPanel'

const RootLayout = () => {
 const isLogin = JSON.parse(localStorage.getItem('USER'))

 return isLogin ? (
  <section className='w-full vh-100 flex flex-col lgEqual:flex-row'>
   <div className='lgEqual:w-[100px] w-full static z-[1000]'>
    <UserPanel />
   </div>
   <div
    className={`w-full flex flex-grow-1 mt-[80px] lgEqual:max-w-[calc(100%-100px)] lgEqual:mt-[0px]`}
   >
    <Outlet />
   </div>
  </section>
 ) : (
  <Navigate to='/login' />
 )
}

export default RootLayout
