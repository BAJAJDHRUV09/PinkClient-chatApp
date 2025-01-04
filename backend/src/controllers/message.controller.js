import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import List from "../models/list.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { getReceiverSocketId , io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        
        // Find the List document for the logged-in user (by their User _id)
        const filteredUsers = await List.findOne({ userId: loggedInUserId }).populate('contacts');

        // Extract the contacts list (which should be populated with user details)
        const filteredUsersList = filteredUsers.contacts;

        // Send the list of users as the response
        res.status(200).json(filteredUsersList);
    } 
    catch (error) {
        console.log("Error in getUserSideBar: ", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};


export const updateContactList = async (req, res) => {
    try {
        const { email } = req.body;
        const senderId = new mongoose.Types.ObjectId(req.user._id);

        // Check if contact exists
        const contact = await User.findOne({ email });
        if (!contact) {
            return res.status(404).json({ message: "Contact not found with this email." });
        }
        const contactId = contact._id;

        // Find the sender's contact list
        let senderList = await List.findOne({ userId: senderId });
        console.log(senderList);
        // If the contact list does not exist, create a new one
        if (!senderList) {
            senderList = new List({
                userId: senderId,
                contacts: [contactId]
            });
            await senderList.save();
            return res.status(201).json({ message: "Contact list created and contact added successfully." });
        }

        // Check if the contact already exists
        if (senderList.contacts.includes(contactId)) {
            return res.status(400).json({ message: "Contact already exists in the list." });
        }

        // Add the contact to the list
        senderList.contacts.push(contactId);
        await senderList.save();

        return res.status(200).json({ message: "Contact added successfully." });
    } catch (error) {
        console.error("Error in updating Contact List:", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const deleteContactList = async (req, res) => {
    try {
        const email = req.body.email;
        const loggedInUserId = req.user._id;
        // Find the List document for the logged-in user (by their User _id)
        const filteredUsers = await List.findOne({ userId: loggedInUserId });
        
        if (!filteredUsers) {
            return res.status(404).json({ message: "Already empty list." });
        }

        const filteredUsersList = filteredUsers.contacts;

        // Find the contact by email
        const contact = await User.findOne({ email });
        if (!contact) {
            return res.status(404).json({ message: "Contact not found with this email." });
        }

        const contactId = contact._id;

        // Check if the contactId exists in the user's contacts list
        if (filteredUsersList.includes(contactId.toString())) {
            // Use $pull to remove the contact from the contacts array
            const updatedList = await List.updateOne(
                { userId: loggedInUserId },
                { $pull: { contacts: contactId } }
            );

            if (updatedList.modifiedCount > 0) {
                return res.status(200).json({ message: "Contact has been successfully deleted." });
            } else {
                return res.status(500).json({ message: "Failed to delete contact from your list." });
            }
        } else {
            console.log("Contact not found in your contact list.");
            return res.status(500).json({ message: "Contact doesn't exist in your contact list." });
        }
    } catch (error) {
        console.error("Error in deleting contact from contact List:", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const getMessages = async (req,res) => {
    try{
        const {id:userToChatId} = req.params;
        const myId= req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId},
            ]
        })

        res.status(200).json(messages);
    }
    catch(error){
        console.log("Error in getMessages: ", error.message);
        res.status(500).json({message:"Internal Sever error."});
    }
};

export const sendMessage = async (req,res) => {
    try{
        const {text,image} = req.body;
        const {id} = req.params;
        const receiverId = id;
        const senderId = req.user._id;

        //for debugging
        console.log("Request params: ", req.params);
        console.log("Request body: ", req.body);


        // trying to handle the case where the message cointains an image
        let imageUrl;
        if(image){
            //the image is in base64 string
            const uploadResponse =await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }   

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });

        await newMessage.save();

        //now implementing real time functionality 

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            // to ensures we are sending it to user only
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        res.status(201).json(newMessage);

    }
    catch(error){
        console.log("Error in sendMessagefunction: ", error.message);
        res.status(500).json({message:"Internal Sever error."});
    }
};
