import React,{ useState,useEffect } from "react";
import {Button,Icon,Form,Message,Segment} from "semantic-ui-react";
import catchErrors from "../utils/catchErrors";
import Link from "next/link";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { handleLogin } from "../utils/auth";


const INITIAL_USER = {
  email:"",
  password:""
}

const Login = () => {

  const [user,setUser] = useState(INITIAL_USER)
  const [disabled,setDisabled] = useState(false)
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

  useEffect(() => {
  
     const isUser = Object.values(user).every(el => Boolean(el))

     isUser ? setDisabled(false) : setDisabled(true)
  },[user])  

  const handleChange = (event) => {

    const {name,value} = event.target;
   
    setUser(prevState => ({ ...prevState,[name]:value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try{
      setLoading(true);
      setError('')
      const url = `${baseUrl}/api/login`
      const payload = { ...user }
      const response = await axios.post(url,payload)
      handleLogin(response.data)
     
    }catch(error) {
   
     catchErrors(error,setError);

    } finally {
      setLoading(false)   
    
    }
  }

  return(
    <>
       <Message attached icon="privacy" header="Welcome Back!" content="Log in with email and password" color="blue" />

       <Form  error={Boolean(error)} loading={loading} onSubmit={handleSubmit}>

         <Message error header="Oops!" content={error} />

         <Segment>
          

        <Form.Input 
            fluid
            icon="envelope"
            iconPosition="left"
            label="Email"
            placeholder="Email"
            name="email"
            value={user.email}
            type="email"
            onChange={handleChange}
           />
 
       <Form.Input 
            fluid
            icon="lock"
            iconPosition="left"
            label="Password"
            placeholder="Password"
            name="password"
            value={user.password}
            type="password"
            onChange={handleChange}
           />

           <Button
             disabled={disabled}
             loading={loading}
             icon="sign in"
             type="submit"
             color="orange"
             content="Login"
            />
         </Segment>
       </Form>

       <Message attached warning>
          <Icon name="help" />
           New user? {" "}
           <Link href="/signup">
             <a>Sign up here</a>
           </Link> {" "} instead
       </Message>
    </>
  )
}

export default Login;
