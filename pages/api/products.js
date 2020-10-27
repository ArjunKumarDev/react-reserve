// import Products from "../../static/products.json";
// import connectDb from "../../utils/connectDb";

// connectDb()

// export default((req,res) => {
//        res.status(200).json(Products)
// })


import PRODUCTS from '../../static/products.json';
import connectDb from '../../utils/connectDb';
import Product from '../../models/Product';
 
connectDb();
 
export default async (req, res) => {

    const { page,size } = req.query;

    const pageNum = Number(page)
    const pageSize = Number(size)

    try {

        let products = [];
        const totalDocs = await Product.countDocuments();
        const totalPages = Math.ceil(totalDocs / pageSize);

        console.log("totalpages",totalPages)

        if(pageNum === 1) {
            products = await Product.find().sort({ name: "asc" }).limit(pageSize)
        } else {
          
            const skips = pageSize * (pageNum - 1)
            products = await Product.find().sort({ name: "asc" }).skip(skips).limit(pageSize)
        }

        // const products = await Product.find();
 
        // If product list is empty manually export them
        
        if (!products.length) {
            console.log('Manually exporting data');
 
            PRODUCTS.forEach(async (product) => {
                const prod = new Product();
                prod.name = product.name;
                prod.price = product.price;
                prod.description = product.description;
                prod.sku = product.sku;
                prod.mediaUrl = product.mediaUrl;
 
                return await prod.save();
            });
        }
 
        res.status(200).json({ products, totalPages });
    } catch (err) {
        console.log(err);
    }
}