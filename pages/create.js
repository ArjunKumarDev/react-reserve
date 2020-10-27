import React,{useState,useEffect} from 'react';
import { Form,Header,Button,Icon,Message,TextArea,Image,Input } from "semantic-ui-react";
import axios from 'axios';
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";



function CreateProduct() {


  const INITIAL_PRODUCT = {
    name:"",
    price:"",
    media:"",
    description:""
  }


  const [product,setProduct] = useState({
    name:"",
    price:"",
    media:"",
    description:""
  })



  const [preview,setPreview] = useState("")

  const [success,setSuccess] = useState(false)

  const [loading,setLoading] = useState(false)

  const [disabled,setDisabled] = useState(true)

  const [error,setError] = useState("")


  useEffect(() => {
        const isProduct = Object.values(product).every(el => Boolean(el))
        isProduct ? setDisabled(false) : setDisabled(true)
  },[product])

  const handleChange = (event) => {

    const {name,value,files} = event.target;

    if(name === "media") {

      setProduct(prevState => ({...prevState, media:files[0] }))

      setPreview(window.URL.createObjectURL(files[0]))
    } else {
      setProduct( prevState => ( { ...prevState, [name]:value } ));
    }

   

    console.log(product)
  }


  const handleSubmit = async (event) => {


  try{
    event.preventDefault();

    setLoading(true)
  
     const mediaUrl =  await handleImageUpload()
  
  
     const url = `${baseUrl}/api/product`
     const payload = {...product,mediaUrl}
  
      await axios.post(url,payload)
      setProduct(INITIAL_PRODUCT)
      setSuccess(true)
    }catch(error) {
       catchErrors(error,setError)
    } finally {
      setLoading(false)
    }
   
  }

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append('file',product.media)
    data.append('upload_preset','reactreserve')
    data.append('cloud_name','dxkgtzwwq')

    const response = await axios.post(process.env.CLOUDINARY_URL,data)
    const mediaUrl = response.data.url;
  
    return mediaUrl
  }

  return (
 
    <>
       {console.log("checkstate",Boolean(error))}
    <Header as="h2" block>

      <Icon name="add" color="orange" />
        Create New Product
    </Header>

    <Form loading={loading} error={Boolean(error)} success={success} onSubmit={handleSubmit}>

      <Message error content={error} header="Oops!" />

      <Message success icon="check" header="Success!" content="Your product has been posted" />

      <Form.Group widths="equal">
        <Form.Field 
          control={Input}
          name="name"
          label="Name"
          placeholder="Name"
          onChange={handleChange}
          value={product.name}
        />

    <Form.Field 
          control={Input}
          name="price"
          label="Price"
          placeholder="Price"
          min="0.00"
          step="0.01"
          type="number"
          onChange={handleChange}
          value={product.price}
        />

   <Form.Field 
          control={Input}
          name="media"
          label="Media"
          type="file"
          content="Select Image"
          accept="image/*"
          onChange={handleChange}
        
        />


      </Form.Group>

      <Image src={preview} rounded  size="small" />

      <Form.Field 
        control={TextArea}
        name="description"
        label="Description"
        placeholder="Description"
        onChange={handleChange}
        value={product.description}
      />

      <Form.Field 
       control={Button}
       disabled={disabled}
       loading={loading}
       color="blue"
       icon="pencil alternate"
       content="Submit"
       type="Submit"
      />
    </Form>
    </>
  );
}

export default CreateProduct;
