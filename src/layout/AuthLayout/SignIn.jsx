import { TOKEN, USER } from '../../utils/constant'

import { Modal } from 'react-bootstrap'
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom'

import { joiResolver } from '@hookform/resolvers/joi'
import { useForm } from 'react-hook-form'
import { loginSchema } from '../../utils/schema'

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

const SignIn = () => {
    const { showModal, onChangeShowModal, setSnackbar, setUser } =
        useOutletContext()

    const navigate = useNavigate()
    const { state } = useLocation()

    const {
        register,
        handleSubmit,
        reset,

        formState: { errors },
    } = useForm({
        resolver: joiResolver(loginSchema),
    })

    const handleHideModal = () => {
        onChangeShowModal(false)
        reset()
        navigate('/auth')
    }

    const onSubmit = (data) => {
        fetchApiSamenote('post', '/login', data).then((response) => {

            if (response?.error) {
                return setSnackbar({
                    isOpen: true,
                    message: response.error,
                    severity: 'error',
                })
            }
            setUser(response.user)
            localStorage.setItem(USER, JSON.stringify(response.user))
            localStorage.setItem(TOKEN, response.jwt)

            setTimeout(() => {
                navigate('/')
            }, 200)
        })
    }

    return (
        <Modal
            centered={true}
            dialogClassName='login-modal auth-modal max-w-full'
            show={showModal}
            onHide={handleHideModal}
        >
            <div>
                <h1
                    className={`font-semibold font-SourceSan capitalize text-4xl lg:text-5xl ${state?.title ? 'text-left' : 'text-center'
                        }`}
                >
                    {state?.title ? state?.title : 'Sign in'}
                </h1>

                {state?.subtitle && (
                    <p className='text-2xl font-normal font-Mulish leading-normal mt-4'>
                        {state?.subtitle}
                    </p>
                )}
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className='mt-4 flex flex-col gap-3'
                action=''
            >
                <CardField
                    Icon={IconEmail}
                    type='text'
                    placeholder={'Email address or username'}
                    errors={errors}
                    register={register}
                    registerName={'user_name'}
                />
                <CardField
                    Icon={IconPassword}
                    type='password'
                    placeholder='Password'
                    errors={errors}
                    register={register}
                    registerName={'password'}
                />

                <CardBtnSubmit name='Login' />
                <CardBtnSubtitle name='I forgot my password' link='/auth/forgot-password' />
            </form>
        </Modal>
    )
}

export default SignIn
