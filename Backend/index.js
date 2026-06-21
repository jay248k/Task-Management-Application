import express from 'express';

const app=express();

app.get('/',(req,res)=>{
    res.send("Server is running");
})

const PORT=3000;

app.listen(PORT,()=>{
    console.log(`Port is running on http://localhost:${PORT}`);
});