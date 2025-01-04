import {create} from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios.js";
import {useAuthStore} from "./useAuthStore.js";

export const useChatStore = create ((set,get)=>({
    messages : [],
    users : [],
    selectedUser : null ,
    isUsersLoading : false,
    isMessagesLoading : false,
    isContactAdding :false,
    isContactDeleting:false,

    getUsers: async () => {
        set({isUsersLoading:true});
        try{
            const res = await axiosInstance.get("/messages/users");
            set({users:res.data});
        }catch(error){
            console.log(error);
        }finally{
            set({isUsersLoading:false});
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading:true});
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data});
        }catch(error){
            toast.error(error.response.data.messages);
            console.log(error);
        }finally{
            set({isMessagesLoading:false});
        }
    },

    sendMessage: async (messageData) => {
        const {selectedUser,messages} = get();
        try{
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages :[...messages,res.data]});
        }catch(error){
            toast.error(error.response.data.message);
            console.log("Error in sending message",error);
        }
    },

    subscribeToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        // now how do socket comes here from useAuthStore? .. zustand lets you extract states from other files..

        const socket = useAuthStore.getState().socket;

        //some issue->fixed with if statement
        socket.on("newMessage",(newMessage)=>{
            if(newMessage.senderId !==selectedUser._id) return;
            set({
                messages: [...get().messages,newMessage],
            });

        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({selectedUser}),

    addContacts: async (messageData) => {
        set({isContactAdding:true});
        
        try{
            await axiosInstance.put("./messages/users/", messageData);
            toast.success("contact added successfully.")
        }catch(error){
            toast.error(error.response.data.message);
            console.log(error);
        }finally{
            set({isContactAdding:false}); 
        }

    },

    deleteContacts: async(messageData) => {
        set({isContactDeleting:true});
        try{
            await axiosInstance.delete("./messages/users", {
                data: { email: messageData.email },
            });
            toast.success("contact deleted successfully.");
        }catch(error){
            toast.error(error.response.data.message);
            console.log(error);
        }finally{
            set({isContactDeleting:false}); 
        }
    }

}))