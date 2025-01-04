import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE==="development" ? "http://localhost:5001": "/";

export const  useAuthStore = create ((set,get)=>({
    authUser : null,
    isSigningUp:false,
    isLoggingIn:false,
    isLoggingOut:false,
    isUpdatingProfile:false,
    isCheckingAuth : true,
    onlineUsers: [],
    isOtpVerifying:false,
    otpGenerated:false,
    socket:null,

    checkAuth : async()=>{
        try{
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});

            get().connectSocket();
        }
        catch(error){
            set({authUser:null});
            console.log("Error in checkingAuth: ",error);
        }finally{
            set({isCheckingAuth:false});
        }
    },

    signUp: async(data) => {
        set({isSigningUp:true});
        try{
            const res = await axiosInstance.post("auth/signup",data);
            
            // setting the token to local storage to send it along with it later
            const tokenOtpVerification = res.data.tokenOtpVerification;
            localStorage.setItem('tokenOtpVerification',tokenOtpVerification);
            set({otpGenerated:true});
            //if it's a success
            toast.success("Otp sent successfully.")
        }catch(error){
            toast.error(error.response.data.message);
            console.log("Error in generating otp:",error);
        }finally{
            set({isSigningUp:false});
        }
    },

    verifyOtp: async(data) => {
        set({isOtpVerifying:true});
        try{
            const { otp } = data;;
            const tokenOtpVerification = localStorage.getItem('tokenOtpVerification');
            const res = await axiosInstance.post('/auth/verifyotp', {
                otp,
                tokenOtpVerification
            });
            if(res && res.data) set({authUser:res.data});

            get().connectSocket();
            toast.success("otp verified successfully.");
        }catch(error){
            toast.error(error.response.data.message);
            console.log("Error in SigningUp:",error);
        }finally{
            set({isOtpVerifying:false});
        }
    },

    login: async(data) => {
        set({isLoggingIn:true});
        try{
            const res = await  axiosInstance.post("/auth/login",data);
            if(res && res.data) set({authUser:res.data});

            get().connectSocket();
            toast.success("Successfully logged in.");
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn:false});
        }
    },

    logout: async() => {
        set({isLoggingOut:true});
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});

            //wont't allow navigating back to page where we logged out...
            localStorage.removeItem("jwt_token"); // If using localStorage
            sessionStorage.removeItem("jwt_token");
            get().disconnectSocket();
            toast.success("You're logged out successfully.");
        }catch(error){
            toast.error("error.response.data.message");
            console.log(error);
        }finally{
            set({isLoggingOut:false});
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
    
        // Check if the file size exceeds 500KB
        if (data.file && data.file.size > 500 * 1024) {  // 500KB = 500 * 1024 bytes
            toast.error("File size should be less than 500KB");
            set({ isUpdatingProfile: false });
            return; // Stop the function if the file is too large
        }
    
        try {
            const res = await axiosInstance.put("/auth/updateProfile", data);
            set({ authUser: res.data });
            toast.success("Profile Updated Successfully.");
        } catch (error) {
            console.log("Error in updating profile:", error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    backToSignUpPage:() => {
        set({otpGenerated:false});
    },

    connectSocket: ()=> {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return ;
        const socket = io(BASE_URL,{
            query:{
                userId:authUser._id,
            },
        });
        socket.connect();

        set({socket:socket});

        socket.on("getOnlineUsers" , (userIds) => {
            set({onlineUsers:userIds});
        });
    },

    disconnectSocket: ()=> {
        if(get().socket?.connected) get().socket.disconnect();
    },

}))