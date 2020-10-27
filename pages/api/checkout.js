import Stripe from "stripe";
import uuidv4 from "uuid/v4";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import Order from "../../models/Order";
import calculateCartTotal from "../../utils/calculateCartTotal";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY) 

console.log("stripe",stripe)


export default async (req, res) => {
    console.log("request",req.body)
    const {paymentData} = req.body 

    try{
         //verify token
          const {userId} = jwt.verify(req.headers.authorization,process.env.JWT_SECRET)

          console.log("userid",userId)

         // Find cart based on userId
         const cart = await Cart.findOne({ user:userId }).populate({
              path:"products.product",
              model: "Product"
          })

          console.log("usercart",cart)
         // calculate cart totals
         const{cartTotal,stripeTotal} = calculateCartTotal(cart.products)

         

        //  Get email for paymentData see if email linked with existing stripe customer
        const prevCustomer = await stripe.customers.list({
            email: paymentData.email,
            limit:1
        })

        console.log("prevCustomer",prevCustomer)

        const isExistingCustomer = prevCustomer.data.length > 0;


        console.log("isexist",isExistingCustomer)

        // if not existing customer create them based on their email
        let newCustomer;
        if(!isExistingCustomer) {
            newCustomer = await stripe.customers.create({
                email:paymentData.email,
                source:paymentData.id
            })
        }

        const customer = (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id;

        console.log("customer",customer)

        // Create charge with total,send receipt email
        const charge = await stripe.charges.create({
            currency:"INR",
            amount:stripeTotal,
            receipt_email:paymentData.email,
            customer,
            description: `Checkout | ${paymentData.email} | ${paymentData.id}`
        },{
            idempotency_key:uuidv4()
        })

        // Add Order to database

        await new Order({
            user:userId,
            email:paymentData.email,
            total:cartTotal,
            products:cart.products
        }).save()

        // clear products in cart
        await Cart.findOneAndUpdate(
            {_id: cart._id},
            { $set:{ products:[] } }
        )

        // Send back success
        res.status(200).send("Checkout Successfull")

    }catch(error) {
        console.error(error)
        res.status(500).send("Error processing charge")
    }
}