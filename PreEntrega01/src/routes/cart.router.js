import express from 'express';
import { CartFileManager,ProductFileManager } from '../classes/FileManager.js';
import { v1 } from "uuid"
import path from "path";
import productRouter from './products.router.js';

const cartRouter = express.Router();
const cartFileManager = new CartFileManager(path.resolve(process.cwd(),"public", "carts.json"));
const productFileManager = new ProductFileManager(path.resolve(process.cwd(),"public", "products.json"));

cartRouter.get('/', async (req, res) => {
    try {
        const carts = await cartFileManager.getAll();
        res.status(200).send(carts);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

cartRouter.get('/:cid', async (req, res) => {
    const {cid} = req.params;
    try {
        const carts = await cartFileManager.getAll();
        const cart = carts.find((car) => car.id === cid);
        if(!cart){
            res.status(404).send("Carrito no encontrado");
            return;
        }
        res.status(200).send(cart);
    } catch (err) {
        res.status(500).send(err.message);
    }

})


cartRouter.post("/", async (req, res) => {
    const newCart = {
        id: v1(),
        products: []
    };
    try {
        const carts = await cartFileManager.getAll();
        await cartFileManager.writeAll([...carts,newCart]);
        res.status(200).send(newCart);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

cartRouter.post("/:cid/product/:pid", async (req,res)=>{
    const {cid, pid} = req.params;

    try {
        const carts = await cartFileManager.getAll();
        const cart = carts.find((car)=> car.id === cid);
        if(!cart) {
            res.status(404).send("Carrito no encontrado");
            return;
        }
        const products = await productFileManager.getAll();
        const product = products.find((product)=> product.id === pid);
        if(!product){
            res.status(404).send("Producto no encontrado");
            return;
        }
        const productInCart = cart.products.find((product) => product.id === pid);
        if (productInCart) {
            productInCart.quantity++;
            await cartFileManager.writeAll(carts);
            res.status(200).send("Producto agregado al carrito")
            return;
        } else {
            cart.products.push({id:pid,quantity:1});
            await cartFileManager.writeAll(carts);
            res.status(200).send("Producto agregado al carrito")
            return;
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default cartRouter;