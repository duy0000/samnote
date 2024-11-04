import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom'

import { joiResolver } from '@hookform/resolvers/joi'
import { useForm } from 'react-hook-form'
import { registerSchema } from '../../utils/schema'

import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'
import CardBtnSubmit from './components/CardBtnSubmit'
import CardBtnSubtitle from './components/CardBtnSubtitle'
import CardField from './components/CardField'

const IconEmail = () => (
 <MailOutlineIcon className='text-[#9CADF2] text-[20px]' />
)
const IconPassword = () => (
 <svg
  width='20'
  height='21'
  viewBox='0 0 20 21'
  fill='none'
  xmlns='http://www.w3.org/2000/svg'
 >
  <path
   fillRule='evenodd'
   clipRule='evenodd'
   d='M10 10.5C9.48223 10.5 9.0625 10.9197 9.0625 11.4375C9.0625 11.9553 9.48223 12.375 10 12.375C10.5178 12.375 10.9375 11.9553 10.9375 11.4375C10.9375 10.9197 10.5178 10.5 10 10.5ZM7.8125 11.4375C7.8125 10.2294 8.79188 9.25 10 9.25C11.2081 9.25 12.1875 10.2294 12.1875 11.4375C12.1875 12.6456 11.2081 13.625 10 13.625C8.79188 13.625 7.8125 12.6456 7.8125 11.4375Z'
   fill='#9CADF2'
  />
  <path
   fillRule='evenodd'
   clipRule='evenodd'
   d='M10 12.375C10.3452 12.375 10.625 12.6548 10.625 13V14.875C10.625 15.2202 10.3452 15.5 10 15.5C9.65482 15.5 9.375 15.2202 9.375 14.875V13C9.375 12.6548 9.65482 12.375 10 12.375Z'
   fill='#9CADF2'
  />
  <path
   fillRule='evenodd'
   clipRule='evenodd'
   d='M2.5 8C2.5 7.30964 3.05964 6.75 3.75 6.75H16.25C16.9404 6.75 17.5 7.30964 17.5 8V16.75C17.5 17.4404 16.9404 18 16.25 18H3.75C3.05964 18 2.5 17.4404 2.5 16.75V8ZM16.25 8H3.75V16.75H16.25V8Z'
   fill='#9CADF2'
  />
  <path
   fillRule='evenodd'
   clipRule='evenodd'
   d='M10 2.375C9.41984 2.375 8.86344 2.60547 8.4532 3.0157C8.04297 3.42594 7.8125 3.98234 7.8125 4.5625V7.375C7.8125 7.72018 7.53268 8 7.1875 8C6.84232 8 6.5625 7.72018 6.5625 7.375V4.5625C6.5625 3.65082 6.92466 2.77648 7.56932 2.13182C8.21398 1.48716 9.08832 1.125 10 1.125C10.9117 1.125 11.786 1.48716 12.4307 2.13182C13.0753 2.77648 13.4375 3.65082 13.4375 4.5625V7.375C13.4375 7.72018 13.1577 8 12.8125 8C12.4673 8 12.1875 7.72018 12.1875 7.375V4.5625C12.1875 3.98234 11.957 3.42594 11.5468 3.0157C11.1366 2.60547 10.5802 2.375 10 2.375Z'
   fill='#9CADF2'
  />
 </svg>
)
const IconUserName = () => (
 <svg
  width='20'
  height='21'
  viewBox='0 0 20 21'
  fill='none'
  xmlns='http://www.w3.org/2000/svg'
 >
  <path
   fillRule='evenodd'
   clipRule='evenodd'
   d='M10 3.625C7.58375 3.625 5.625 5.58375 5.625 8C5.625 10.4162 7.58375 12.375 10 12.375C12.4162 12.375 14.375 10.4162 14.375 8C14.375 5.58375 12.4162 3.625 10 3.625ZM4.375 8C4.375 4.8934 6.8934 2.375 10 2.375C13.1066 2.375 15.625 4.8934 15.625 8C15.625 11.1066 13.1066 13.625 10 13.625C6.8934 13.625 4.375 11.1066 4.375 8Z'
   fill='#9CADF2'
  />
  <path
   fillRule='evenodd'
   clipRule='evenodd'
   d='M10.0001 13.6245C8.57374 13.6245 7.17251 14 5.93728 14.7132C4.70205 15.4265 3.67634 16.4523 2.96327 17.6877C2.79071 17.9866 2.40848 18.0891 2.10953 17.9165C1.81058 17.7439 1.70812 17.3617 1.88068 17.0628C2.70345 15.6374 3.88696 14.4537 5.31223 13.6307C6.7375 12.8078 8.3543 12.3745 10.0001 12.3745C11.6459 12.3745 13.2627 12.8078 14.688 13.6307C16.1132 14.4537 17.2968 15.6374 18.1195 17.0628C18.2921 17.3617 18.1896 17.7439 17.8907 17.9165C17.5917 18.0891 17.2095 17.9866 17.0369 17.6877C16.3239 16.4523 15.2982 15.4265 14.0629 14.7132C12.8277 14 11.4265 13.6245 10.0001 13.6245Z'
   fill='#9CADF2'
  />
 </svg>
)

const Register = () => {
 const { showModal, onChangeShowModal, setSnackbar } = useOutletContext()
 const [isCreateAccount, setIsCreateAccount] = useState(false)

 const navigate = useNavigate()

 const handleHideModal = () => {
  onChangeShowModal(false)
  reset()
  navigate('/auth')
  setIsCreateAccount(false)
 }

 const {
  register,
  handleSubmit,
  reset,
  watch,
  formState: { errors },
 } = useForm({
  resolver: joiResolver(registerSchema),
 })

 const fieldList = [
  {
   placeholder: 'User name',
   type: 'text',
   Icon: IconUserName,
   name: 'user_name',
  },

  {
   placeholder: 'Email address',
   type: 'email',
   Icon: IconEmail,
   name: 'gmail',
  },

  {
   placeholder: 'Password',
   type: 'password',
   Icon: IconPassword,
   name: 'password',
  },

  {
   placeholder: 'Confirm password',
   type: 'password',
   Icon: IconPassword,
   name: 'confirm_password',
  },
 ]

 const onSubmit = (data) => {
  const dataForm = {
   ...data,
   name: data.user_name,
  }

  fetchApiSamenote('post', '/register', dataForm).then((response) => {
   if (response?.error) {
    return setSnackbar({
     isOpen: true,
     message: response.error,
     severity: 'error',
    })
   } else {
    setIsCreateAccount(true)
    return setSnackbar({
     isOpen: true,
     message: response.message,
     severity: 'success',
    })
   }
  })
 }

 const handleResendConfirmMail = () => {
  const gmail = watch('gmail')
  fetchApiSamenote('post', '/resetPassword', { gmail }).then((data) => {
   if (data?.error) {
    return setSnackbar({
     isOpen: true,
     message: data.error,
     severity: 'error',
    })
   }

   return setSnackbar({
    isOpen: true,
    message: 'Resend confirmation email successfully',
    severity: 'success',
   })
  })
 }

 return (
  <Modal
   centered={true}
   dialogClassName='register-modal auth-modal'
   show={showModal}
   onHide={handleHideModal}
   size={isCreateAccount ? 'lg' : null}
  >
   <h1
    className={`font-semibold font-SourceSan capitalize text-4xl lg:text-5xl ${
     isCreateAccount ? 'text-left' : 'text-center '
    }`}
   >
    {isCreateAccount ? 'Account created' : 'Create Account'}
   </h1>

   {isCreateAccount ? (
    <div>
     <p className='text-2xl font-normal font-Mulish leading-normal'>
      We have sent a confirmation letter to your email address. Please check
      your email and access the link. If you haven't received our letter, please
      click the button below to resend.
     </p>

     <div className='gap-4 grid grid-cols-2 mt-4 '>
      <div>
       <NavLink
        to='/auth/signin'
        className='text-decoration-none rounded-lg text-[#08174E] flex items-center justify-center h-[60px] col-span-1 font-Mulish font-bold bg-[#5BE260] hover:bg-[#24dd2a] ease-linear duration-200'
       >
        Login
       </NavLink>
      </div>

      <div className='col-span-1'>
       <button
        onClick={handleResendConfirmMail}
        type='button'
        className='bg-[#0E0F131C] w-full h-full text-[#08174E] cursor-pointer hover:bg-[#090c141c] ease-linear duration-200 rounded-lg flex justify-center items-center'
       >
        Resend confirmation mail
       </button>
      </div>
     </div>
    </div>
   ) : (
    <form
     onSubmit={handleSubmit(onSubmit)}
     className='mt-4 flex flex-col gap-3'
     action=''
    >
     {fieldList?.map(({ type, placeholder, Icon, name }) => (
      <CardField
       errors={errors}
       register={register}
       registerName={name}
       type={type}
       placeholder={placeholder}
       Icon={Icon}
       key={placeholder}
      />
     ))}

     <CardBtnSubmit name='Register' />
     <CardBtnSubtitle name='I already have an account' link='/auth/signin' />
    </form>
   )}
  </Modal>
 )
}

export default Register
