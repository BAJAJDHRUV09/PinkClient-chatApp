import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
// this server is required because socket.io needs to work with raw http requests not express
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: ["http://localhost:5173"],
    }
})

//so for storing online users..it's like an object
const userSocketMap = {};

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

//connection is special event emitted by Socket.io
io.on("connection",(socket)=>{
    console.log("A user is connected",socket.id);
    
    // handshake.query -- It contains metadata sent by the frontend during connection
    const userId = socket.handshake.query.userId;
    //if user is online adding it to that object list
    if(userId) userSocketMap[userId]=socket.id;

    //io.emit() function is used to send to all the connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
})

export {app,server,io};