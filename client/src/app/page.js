"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
export default function Home() {
  const [messages, setMessages] = useState([]);  // ไม่ระบุ type
  const [inputMessage, setInputMessage] = useState('');
  const socket = io('http://localhost:1337'); // เชื่อมต่อกับ Strapi Server
  const [latestMessageId, setLatestMessageId] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/messages');
        const messages = response.data.data;

        setMessages(messages);  

        if (messages.length > 0) {
          const latestMessageId = Math.max(...messages.map(msg => msg.messageid));
          setLatestMessageId(latestMessageId);  
          console.log("Latest message ID:", latestMessageId);
        }

        console.log("Fetched messages:", messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);


  useEffect(() => {
    socket.on('newMessage', (message) => {
      console.log("Received new message:", message.data); // ตรวจสอบว่าได้รับข้อความหรือไม่
      setMessages((prevMessages) => [...prevMessages, message.data]);
    });


    return () => socket.disconnect();
  }, [socket]);


  const sendMessage = async () => {
    if (inputMessage.trim() !== '') {
      try {
        const newMessageId = latestMessageId !== undefined ? latestMessageId + 1 : 1;

        await axios.post('http://localhost:1337/api/messages', {
          data: {
            message: inputMessage,
            messageid: newMessageId
          }
        });

        setInputMessage('');  // ✅ เคลียร์ช่องข้อความหลังส่ง
        setLatestMessageId(newMessageId);  // ✅ อัปเดตค่า messageid ล่าสุด
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow-md">
        <h1 className="text-xl font-bold mb-4 text-center">Realtime Chat with Strapi & WebSocket</h1>

        <div className="border p-2 h-64 overflow-y-auto mb-4 bg-gray-50 rounded-lg">
          {/* แสดงข้อความ */}
          {messages.map((msg, index) => (
            <p key={index} className="text-gray-800">{msg.message}</p>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-grow border rounded-lg p-2"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
