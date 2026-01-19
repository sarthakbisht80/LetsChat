import express from 'express';
import   "dotenv/config";
import cookieParser from 'cookie-parser';

import path from "path";//coming from node.js

import authRoutes from './routes/auth.route.js'; // Adjust the path as necessary
import userRoutes from './routes/user.route.js'; // Adjust the path as necessary
import { connectDB } from './lib/db.js';
import chatRoutes from "./routes/chat.route.js"
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ;


const __dirname= path.resolve();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
})
);

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use("/api/auth",authRoutes); 

app.use("/api/users",userRoutes); 
app.use("/api/chat",chatRoutes);

if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    
})
}


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});