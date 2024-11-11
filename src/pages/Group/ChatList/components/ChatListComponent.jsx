import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'

const ChatListComponent = ({ data, renderItem }) => {
 return data?.length === 0 ? (
  <div className='text-center'>
   <div>
    <ChatBubbleOutlineIcon className='text-[80px]' />
   </div>
   <h3>Không có tin nhắn nào</h3>
   <p>Tin nhắn mới sẽ được hiện thị tại đây</p>
  </div>
 ) : (
  data.map((item) => renderItem(item))
 )
}

export default ChatListComponent
