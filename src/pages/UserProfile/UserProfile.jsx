import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import 'swiper/css'
import api from '../../api'
import Loading from '../../share/Loading'
import './UserProfile.css'

import {
    Footer,
    LeftsideContent,
    RightsideContent,
    UserIntro,
} from './components'

const UserProfile = () => {
    const [userInfomations, setUserInformations] = useState(null)

    const [reload, setReload] = useState(0)

    const params = useParams()
    const userID = params.id

    const getUserInformation = async (userID) => {
        try {
            const res = await api.get(
                `https://samnote.mangasocial.online/profile/${userID}`
            )
            setUserInformations(res.data.user)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getUserInformation(userID)
    }, [userID, reload])

    return userInfomations ? (
        <Box className='w-full bg-[#4A4B51] h-auto overflow-y-auto'>
            <Box className='w-full bg-[#4A4B51] h-auto'>
                <>
                    <UserIntro userInfomations={userInfomations} />
                    <div className='container-content w-[98%] flex flex-col lg:flex-row justify-between m-auto'>
                        <LeftsideContent
                            userInfomations={userInfomations}
                            setReload={setReload}
                        />
                        <RightsideContent
                            userInfomations={userInfomations}
                            setReload={setReload}
                        />
                    </div>
                    <Footer />
                </>
            </Box>
        </Box>
    ) : (
        <Loading />
    )
}

export default UserProfile
