"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import urlconfig from "../../config";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const head = urlconfig.serverUrlPrefix;
  const socket = io(head); // connect Strapi Server
  const [latestMessageId, setLatestMessageId] = useState(0);
  const [connectionCount, setConnectionCount] = useState(0);

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const response = await axios.get(head + '/api/messages');
  //       const messages = response.data.data;

  //       setMessages(messages);

  //       if (messages.length > 0) {
  //         const latestMessageId = Math.max(...messages.map(msg => msg.messageid));
  //         setLatestMessageId(latestMessageId);
  //       }

  //       console.log("Fetched messages:", messages);
  //     } catch (error) {
  //       console.error('Error fetching messages:', error);
  //     }
  //   };

  //   fetchMessages();
  // }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(head + "/api/messages");
      const messages = response.data.data;

      setMessages(messages);

      if (messages.length > 0) {
        const latestMessageId = Math.max(
          ...messages.map((msg) => msg.messageid)
        );
        setLatestMessageId(latestMessageId);
      }

      console.log("Fetched messages:", messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    socket.on("newMessage", (message) => {
      console.log("Received new message:", message.data); // check message data
      setMessages((prevMessages) => [...prevMessages, message.data]);
      setLatestMessageId(message.data.messageid);
      console.log("Latest message ID:", latestMessageId);
    });

    //console.log('Connected to server:', connectionCount);

    return () => {
      socket.disconnect();
      socket.off("updateConnectionCount");
    };
  }, [socket]);

  const sendMessage = async () => {
    if (inputMessage.trim() !== "") {
      try {
        const newMessageId =
          latestMessageId !== undefined ? latestMessageId + 1 : 1;

        await axios.post("http://localhost:1337/api/messages", {
          data: {
            message: inputMessage,
            messageid: newMessageId,
          },
        });

        setInputMessage(""); // ✅ clear input after sending message
        setLatestMessageId(newMessageId); // ✅ update message
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="bg-[#1d1e20] h-screen flex flex-col">

      <div className="p-7 grid justify-items-start">
        <h1 className="text-xl font-bold mb-4 text-center">
          Realtime Chat with Strapi & WebSocket
        </h1>
      </div>

      <div className="h-screen p-12 flex flex-col items-center justify-around">
          <div className="p-8 h-80 overflow-y-auto mb-4 rounded-lg w-full max-w-[50rem] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* show message */}
            {messages.map((msg, index) => (
              <p key={index} className="text-white-800 mb-8">
                {msg.message}
              </p>
            ))}
          </div>

          <div className="flex space-x-2 bg-[#313335] p-6 rounded-3xl w-full max-w-[50rem]">
            <input
              type="text"
              className="flex-grow bg-[#313335] outline-none"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <div>
              <button
                onClick={sendMessage}
                className="bg-[#5E6668] text-white px-4 py-2 rounded-3xl hover:scale-105 hover:shadow-md transition duration-200"
              >
                Send
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
