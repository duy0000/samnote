import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const SOCKET_SERVER_URL = "https://your-api-server.com"; // Replace with your actual Socket.IO server URL

const useChatSocket = (groupId, userId) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);  // Use a ref to store the socket object

  useEffect(() => {
    if (groupId) {
      socketRef.current = io(SOCKET_SERVER_URL, {
        query: { groupId }
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      socketRef.current.on("chat message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [groupId]);

  const sendMessage = async (content, idReceive) => {
    const messageData = {
      sendAt: new Date().toISOString(),
      idReceive,
      content,
      idSend: userId
    };

    try {
      await axios.post(`https://samnote.mangasocial.online/message/chat-unknown/${userId}`, messageData);
      // Emit the message via the socket to update other clients
      if (socketRef.current) {
        socketRef.current.emit("chat message", messageData);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`https://samnote.mangasocial.online/message/chat-unknown/${userId}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userId, groupId]);

  return { messages, sendMessage };
};

export default useChatSocket;
