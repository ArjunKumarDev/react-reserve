import Product from '../../models/Product';
import Cart from "../../models/Cart";
import connectDb from '../../utils/connectDb';


connectDb();


export default async (req, res) => {
    switch(req.method){
        case "GET":
           await getProducts(req,res);
           break;

        case "POST":
            await handlePostRequest(req,res);
            break;

        case "DELETE":
            await deleteProduct(req,res);
            break;

        default:
            res.status(405).send(`Method ${req.method} not allowed`)    

    }
}


const getProducts = async (req, res) => {
    const { _id } = req.query;
    const product = await Product.findOne({ _id })

    res.status(200).json(product)
}

const handlePostRequest = async (req, res) => {

    try {
        const { name,price,description,mediaUrl} = req.body;

        if(!name || !price || !description || !mediaUrl) {
            return res.status(422).send("Product missing one or more fields")
        }
        
        const product = await new Product({
            name,
            description,
            price,
            mediaUrl
        }).save()
    
        res.status(201).json(product)
    }catch(error) {
       res.status(500).json("Servor Error")
    }
 

    
}

const deleteProduct = async (req, res) => {
    const { _id } = req.query;

    try {
        await Product.findOneAndDelete({ _id })

        await Cart.updateMany(
            { "products.product": _id },
            { $pull:  { products : { product: _id } } }
        )

        res.status(200).json({})
    }catch(error) {
        res.status(500).json("Error deleting product")
    }


}


