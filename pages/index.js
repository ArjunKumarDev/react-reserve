import React,{useEffect} from 'react';
import axios from "axios";
import ProductList from "../components/Index/ProductList";
import ProductPagination from "../components/Index/ProductPagination";
import baseUrl from "../utils/baseUrl";

const Home = ({ products,totalPages }) => {
  console.log("main",products)

  // useEffect(() => {
  //   getProducts()
  // },[])

  // const getProducts = async () => {
  //     const url = 'http://localhost:3000/api/products';
  //     const response = await axios.post(url);

  //     console.log(response.data)
  // }

  return (
    <>
      <ProductList products={products}/>
      <ProductPagination totalPages={totalPages} />
    </>
  )
}


Home.getInitialProps = async (ctx) => {

 
  const page = ctx.query.page ? ctx.query.page : "1";

 

  const size = 9;


  // fetch data on server
  // return response data as an object
  const url = `${baseUrl}/api/products`;

  const payload = { params: { page,size }}

  const response = await axios.get(url,payload);

  console.log("mapresp",response)
 

  return { products:response.data.products,totalPages:response.data.totalPages }
}

export default Home;
