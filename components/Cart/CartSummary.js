import React,{useState,useEffect} from "react";
import {Button,Segment,Divider} from "semantic-ui-react";
import calculateCartTotal from  "../../utils/calculateCartTotal";
import StripeCheckout from "react-stripe-checkout";

const CartSummary = ( { products,handleCheckOut,success } ) => {

  const [cartEmpty,setCartEmpty] = useState(false)
  const [cartAmount,setCartAmount] = useState(0)
  const [stripeAmount,setStripeAmount] = useState(0)

  useEffect(() => {

     const { cartTotal,stripeTotal } = calculateCartTotal(products)
     setCartAmount(cartTotal)
     setStripeAmount(stripeTotal)
     setCartEmpty(products.length === 0)
  },[products])

  return (
   
  <>
      <Divider />
        <Segment clearing size="large">
            <strong>Sub total:</strong> $ {cartAmount}

            <StripeCheckout
             name="React Reserve"
             amount={stripeAmount}
             image={products.length > 0 ? products[0].product.mediaUrl : ""}
             shippingAddress={true}
             zipCode={true}
             currency="INR"
             stripeKey="pk_test_51HbqTgCZ3MS7PpwcdLTst7THGORVbJCS9Xh8U4WXxpSmb7KManqMB0Y0yE9ipAm3QeO9ejhFiH3wgHTCI0LbUKIu00vxUPHsFV"
             billingAddress={true}
             token={handleCheckOut}
             triggerEvent={"onClick"}
            >
            <Button 
              icon="cart"
              color="teal"
              disabled={cartEmpty || success}
              floated="right"
              content="Checkout"
            />
            </StripeCheckout>
        </Segment>
  </>
  );
}

export default CartSummary;
