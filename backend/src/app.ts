import  Express  from "express";
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = Express()

const port = process.env.PORT

app.listen(port ,()=>{
    console.log(`app listen on port ${port}`)
})
