import { TOKEN, USER } from './constant'
import moment from 'moment'
import { getLuminance } from '@mui/material/styles'

export const handleLogOut = () => {
 localStorage.removeItem(USER)
 localStorage.removeItem(TOKEN)
 window.location.href = '/'
}

export const getFormattedDate = (datetime) => {
 const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
 ]
 const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
 ]

 // Kiểm tra nếu input là chuỗi, chuyển đổi thành đối tượng Date
 const date = typeof datetime === 'string' ? new Date(datetime) : datetime

 const dayName = days[date.getDay()]
 const day = date.getDate()
 const month = months[date.getMonth()]
 const year = date.getFullYear()

 // Thêm hậu tố cho ngày
 const daySuffix = (day) => {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
   case 1:
    return 'st'
   case 2:
    return 'nd'
   case 3:
    return 'rd'
   default:
    return 'th'
  }
 }

 // Kiểm tra nếu input là đối tượng Date thì trả về với dayName, nếu không thì bỏ dayName
 if (typeof datetime === 'string') {
  return `${day}${daySuffix(day)} ${month} ${year}`
 } else {
  return `${dayName}, ${day}${daySuffix(day)} ${month} ${year}`
 }
}

export const formatTimeAgo = (dateString) => {
 const date = new Date(dateString)
 const now = new Date()
 const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
 const diffInMinutes = Math.floor(diffInSeconds / 60)
 const diffInHours = Math.floor(diffInMinutes / 60)
 const diffInDays = Math.floor(diffInHours / 24)
 const diffInWeeks = Math.floor(diffInDays / 7)
 const diffInMonths = Math.floor(diffInDays / 30)
 const diffInYears = Math.floor(diffInDays / 365)

 if (diffInYears > 0)
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
 if (diffInMonths > 0)
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
 if (diffInWeeks > 0)
  return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
 if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
 if (diffInHours > 0)
  return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
 if (diffInMinutes > 0)
  return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
 return 'Just now'
}

export const handleErrorAvatar = (e) => {
 if (e.target instanceof HTMLImageElement) {
  e.target.src = '/src/assets/avatar-default.png'
 }
}

// ** time
export const convertApiToTime = (time) =>
 moment(`${time}+0700`).format('YYYY-MM-DD')

export const convertTimeToApi = (time) =>
 `${moment(time).format('DD/MM/YYYY hh:mm A')} +07:00`

export const convertTimeApiNoteToHtml = (time) =>
 `${moment(time).format('DD/MM/YYYY')}`

export const convertTimeMessage = (time) => moment(`${time}+0700`).calendar()

// ** color
export const isLightColor = (colorObj) => {
 if (!colorObj) return true
 
 const luminance = getLuminance(
  `rgb(${colorObj.r}, ${colorObj.g}, ${colorObj.b})`
 )
 return luminance > 0.5
}

export const convertColorNoteToApi = (color) => ({
 r: color.r,
 b: color.b,
 g: color.g,
 a: 1,
})

export const debounce = (callBack, delay) => {
 let timeOut = null

 return (...args) => {
  clearTimeout(timeOut)
  timeOut = setTimeout(() => {
   callBack(...args)
  }, delay)
 }
}
