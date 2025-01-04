import {useChatStore} from "../store/useChatStore.js";
import { useEffect,useRef } from "react";
import {ChatHeader} from "./ChatHeader.jsx";
import {MessageInput} from "./MessageInput.jsx";
import {MessageSkeleton} from "./skeletons/MessageSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";

export const ChatContainer = () => {
  const {selectedUser,getMessages,isMessagesLoading,messages,subscribeToMessages,unsubscribeFromMessages} = useChatStore();
  const {authUser} = useAuthStore();
  const chatContainerRef = useRef(null);

  useEffect(()=>{
    getMessages(selectedUser._id);

    // starting the socket with this function
    subscribeToMessages();

    //ending that.. just for performance reasons.. yet to study in detail about this
    return () => unsubscribeFromMessages();
  },[selectedUser._id,getMessages]);

   // Scroll to the bottom whenever the messages change
   useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]); // Trigger scroll when messages change


  if(isMessagesLoading) return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>
  )
  
  return (
    <div className="flex-1 flex flex-col overflow-auto" ref={chatContainerRef}>

        <ChatHeader/>

      {messages.map((message) => {

      return (
        <div
          key={message._id}
          className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
        >
          <div className="chat-image avatar">
            <div className="size-10 rounded-full border">
              <img
                src={
                  message.senderId === authUser._id
                    ? authUser.profilePic || "/avatar.png"
                    : selectedUser.profilePic || "/avatar.png"
                }
                alt="profile pic"
              />
            </div>
          </div>
            <div className="flex-col">
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
        </div>
      );
    })}


      <MessageInput/>

    </div>
  )
}
