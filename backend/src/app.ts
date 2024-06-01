import  Express  from "express";
import cors from "cors"
import dotenv from "dotenv"
import { connect } from "./db/index.js";
import transactionRoutes from "./routes/transactionRoutes.js"
import { startDataPolling } from "./services/syncTransactions.js";
dotenv.config()

const app = Express()

const port = process.env.PORT

connect()

app.use(cors({
    origin:"*",
    credentials:true
}))
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json())

app.use("/api/v1/transactions" , transactionRoutes ) 

app.listen(port ,()=>{
    console.log(`app listen on port ${port}`)
    startDataPolling();

})
