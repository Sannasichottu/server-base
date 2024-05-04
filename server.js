//Using Express
const express = require('express');
const mongoose = require('mongoose');

//create aan instance of express
const app = express();
app.use(express.json())

//sample in-memory storage for product items
// let products = [];

//connecting mongoDb
mongoose.connect("mongodb+srv://work-order:workorder@tamilinfo.kswrkst.mongodb.net/server").then(() => {
    console.log('DB Connected!')
})
.catch((err) => {
    console.log(err)
})

//creating schema
const productSchema = new mongoose.Schema({
    productName:{
        required: true,
        type: String
    },
    description:String,
    price:String,
    qyt:String
})

//creating Model    
const productModel = mongoose.model('Product', productSchema)

//creating a new product item
app.post('/createProduct', async (req,res) => {
    const {productName,description,price,qty} = req.body;
    // const newProduct = {
    //     id:products.length + 1,
    //     productName,
    //     description,
    //     price,
    //     qty
    // }
    // products.push(newProduct);
    // console.log(products);
    try {
        const newProduct = new productModel({productName, description, price, qty});
        await newProduct.save();
        res.status(201).json(newProduct)
    }catch(error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
})


//get all items
app.get('/getAllProducts', async (req,res) => {
    try{
        const products = await productModel.find();
        res.json(products);
    }catch (error){
        console.log(error);
        res.status(500).json({message: error.message})
    }
})


//Update a todo item
app.put("/products/:id", async( req,res) => {
   try {
    const {productName,description,price,qty} = req.body;
    const id = req.params.id;
    const updateProduct = await productModel.findByIdAndUpdate(
        id,
        {
         productName, description, price, qty   
        },
        {
            new : true

        }
    )
    if(!updateProduct) {
        return res.status(404).json({ message: "Product not found"})
    }
    res.json(updateProduct)
   } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message})
   }
})

//Delete a product item 
app.delete('/products/:id', async(req,res) => {
   try {
    const id = req.params.id;
    await productModel.findByIdAndDelete(id);
    res.status(204).end();
   } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message})
   }
})

//start the server
const port = 5000;
app.listen(port,() => {
    console.log(`Server is listening to port ${port}`)
})
