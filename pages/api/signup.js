
import User from "../../models/User";
import Cart from "../../models/Cart";
import bcrypt from "bcrypt";
import connectDb from '../../utils/connectDb';
import jwt from "jsonwebtoken";
import isLength from "validator/lib/isLength";
import isEmail from "validator/lib/isEmail";


connectDb();

export default async (req, res) => {

    console.log("signup",req.body)
    const { name,email,password } = req.body;


    try{

        if(!isLength(name, {min:3,max:10})) {
            return res.status(422).send("Name must be 3-10 character long")
        }else if(!isLength(password, {min:6})) {
            return res.status(422).send("Password must be atleast 6 characters")
        }else if(!isEmail(email)) {
            return res.status(422).send("Email must be valid")
        }
        //  If user already exists
        const user = await User.findOne({ email })

        if(user) {
            res.status(422).send(`User already exists with email ${email}`)
        }

        // else hash password
        const hash = await bcrypt.hash(password, 10)

        // create user
        const newUser = await new User({
            name,
            email,
            password: hash
        }).save()

        // create cart for new user
        await new Cart({ user: newUser._id }).save()

        // create token for the new user
        const token = jwt.sign({ userId: newUser._id },process.env.JWT_SECRET, {expiresIn: '7d' })

        // send back token
        res.status(201).json(token)

    }catch(error) {
        res.status(500).json({ message: error.message })
    }
}