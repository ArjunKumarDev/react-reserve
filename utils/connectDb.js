import mongoose from "mongoose";

const connection = {};

async function connectDb() {
    if(connection.isConnected) {
        console.log("using existing")
        return;
    }
    const db = await mongoose.connect(process.env.MONGO_SRV,{
        useCreateIndex:true,
        useFindAndModify:false,
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

    console.log("DB Connected")
    connection.isConnected = db.connections[0].readyState;
    console.log(connection)
}


export default connectDb;