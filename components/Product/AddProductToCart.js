import React,{useState,useEffect} from "react";
import {Input} from 'semantic-ui-react';
import {useRouter} from "next/router";
import cookie from "js-cookie";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import catchErrors from "../../utils/catchErrors";

const AddProductToCart = ({ user,productId }) => {

  const router = useRouter();

  const [quantity,setQuantity] = useState(1)
  const [loading,setLoading] = useState(false)
  const [success,setSuccess] = useState(false)

  useEffect(() => {
    let timeout;
      if(success) {
        timeout = setTimeout(() => setSuccess(false),3000)
      }

      return () => {
        clearTimeout(timeout)
      }
      
  },[success])

  const handleAddCartToProudct = async () => {

    try{
      setLoading(true)
      const token = cookie.get('token')
      const url = `${baseUrl}/api/cart`;
      const payload = { quantity,productId}
      const headers = { headers:{ Authorization:token }}

      await axios.put(url,payload,headers)
      setSuccess(true)
    }catch(error) {
        catchErrors(error,window.alert)
    }finally {
        setLoading(false)
    }
  
  }
  return <>
       <Input 
        type="number"
        min="1"
        placeholder="Quantity"
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
        action={ user && success ? {
          color:"blue",
          content:"Item Added",
          icon: "plus cart",
          disabled:true
        } : user ? 
          {color:"orange",
          content:"Add to cart",
          loading,
          disabled:loading,
          icon:"plus cart",
          onClick:handleAddCartToProudct} : {color:"blue",content:"Signup to purchase",icon:"signup",onClick: () => router.push("/signup")}
        }
        />
  </>;
}

export default AddProductToCart;
