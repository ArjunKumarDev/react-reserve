import User from "../../models/User";
import bcrypt from "bcrypt";
import connectDb from '../../utils/connectDb';
import jwt from "jsonwebtoken";


connectDb();

export default async (req, res) => {
    console.log("loginreq",req.body)
    const { email,password } = req.body;

    try{
        // if user exists or not
       const user = await User.findOne({ email }).select("+password")
       console.log("duckin",user)

       if(!user) {
           return res.status(404).send("No user exists with that email")
       }

       //password matches with db
        const passwordMatch =  await bcrypt.compare(password, user.password)


        // passwordMatch => True => generateToken
        if(passwordMatch) {
            const token = jwt.sign({ userId:user._id },process.env.JWT_SECRET,{expiresIn:"7d"})

            res.status(200).json(token)
        }else{
            res.status(401).send("Passwords do not match")
        }

    }catch(error) {
        res.status(500).json({ message:error.message })
    }
}