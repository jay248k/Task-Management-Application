import express from 'express';
import taskRouter from './routes/task.route.js';
import { connectDB } from './config/db.js';
import cors from 'cors'
const app=express();
app.use(cors())

app.use(express.json());
app.use('/tasks',taskRouter)
app.get('/',(req,res)=>{
    res.send("Server is running");
})
connectDB();
const PORT=3000;

app.listen(PORT,()=>{
    console.log(`Port is running on http://localhost:${PORT}`);
});