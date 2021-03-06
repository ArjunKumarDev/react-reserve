import React,{ useState,useEffect } from "react";
import {Segment} from "semantic-ui-react";
import CartItemList from "../components/Cart/CartItemList";
import CartSummary from "../components/Cart/CartSummary";
import {parseCookies} from 'nookies';
import axios from 'axios';
import baseUrl from "../utils/baseUrl";
import cookie from "js-cookie";
import catchErrors from "../utils/catchErrors";


const Cart = ({ products,user }) => {

  const [cartProduct,setCartProduct] = useState(products)
  const [success,setSuccess] = useState(false)
  const [loading,setLoading] = useState(false)

  const handleRemoveFromCart = async (productId) => {

        const url = `${baseUrl}/api/cart`
        const token = cookie.get('token')
        const payload = {
          params: {productId},
          headers:{ Authorization:token }
        }

        const response = await axios.delete(url,payload)

        setCartProduct(response.data)
  }


  const handleCheckOut = async (paymentData) => {
      try{
         setLoading(true)
         const url = `${baseUrl}/api/checkout`
         const token = cookie.get('token')
         const payload = { paymentData }
         const headers = { headers:{ Authorization:token} }

         await axios.post(url,payload,headers)
         setSuccess(true)
      }catch(error){
          catchErrors(error,window.alert)
      }finally{
          setLoading(false)
      }
  }


 
 
  return(
    <Segment loading={loading}>
      <CartItemList success={success} products={cartProduct} user={user} handleRemoveFromCart={handleRemoveFromCart} />
      <CartSummary  success={success} products={cartProduct} handleCheckOut={handleCheckOut} />
    </Segment>
  );
}


Cart.getInitialProps = async ctx => {
    const {token} = parseCookies(ctx)

    if(!token) {
      return { products:[] }
    }

    const url = `${baseUrl}/api/cart`;
    const payload = { headers: { Authorization:token } }
    const response = await axios.get(url,payload)

    return { products:response.data }

   
}

export default Cart;
