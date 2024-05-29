import mongoose from "mongoose";


const URI = process.env.URI
export const connect = async()=>{
try {
      const connectionInstance = await mongoose.connect(URI!)
      console.log(`mongoose  connected on ${connectionInstance.connection.host}`)
    
} catch (error) {
    console.log(error)
    process.exit(1)
}
}