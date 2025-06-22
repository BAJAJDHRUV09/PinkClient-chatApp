import express from "express";
import authRoutes from "./routes/auth.route.js" ;
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import bodyParser from "body-parser";
import cors from "cors";
import { app,server,io } from "./lib/socket.js";
import path from "path";

dotenv.config();
const port = process.env.PORT;
const _dirname = path.resolve();

app.use(bodyParser.json({ limit: '500kb' }));
// extended:true handles complex DS
app.use(bodyParser.urlencoded({ limit: '500kb', extended: true }));

app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    // without credentials:true, browser block cookies and auth-headers in cross origin req
    credentials:true,
}))

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

// static file requests in production
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname,"../frontend/dist")));
    // unknown path redirected to main reeact app
    app.get("*",(req,res) => {
        res.sendFile(path.join(_dirname,"../frontend","dist","index.html"));
    })
}

server.listen(port,()=>{
    connectDB();
    console.log(`server is running on port ${port}`);
});