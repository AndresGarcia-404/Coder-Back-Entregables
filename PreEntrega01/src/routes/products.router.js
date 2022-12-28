import express from "express";
import { ProductFileManager } from "../classes/FileManager.js";
import { v1 } from "uuid";
import path from "path";

const productRouter = express.Router();
const productFileManager = new ProductFileManager( path.resolve(process.cwd(), "public", "products.json"));

productRouter.get("/",async (req,res) => {
    const {limit} = req.query;
    try {
        const products = await productFileManager.getAll();
        if(limit){
            res.send(products.slice(0, limit));
            return;
        }
        res.status(200).send(products);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

productRouter.get("/:pid", async(req, res) => {
    const {pid} = req.params;
    try {
        const products = await productFileManager.getAll();
        const product = products.find((product) => product.id == pid);
        if(!product){
            res.status(404).send("Producto no encontrado");
            return;
        }
        res.status(200).send(product)
    } catch (err) {
        res.status(500).send(err.message);
    }
});

productRouter.post("/", async (req,res) => {
    if(!req.body.title || !req.body.code || !req.body.description || !req.body.price || !req.body.status || !req.body.category || !req.body.stock){
        res.status(400).send("Faltan datos");
        return;
    }        
    const newProduct = {
        id: v1(),
        ...req.body,
    };

    try {
        const products = await productFileManager.getAll();
        await productFileManager.writeAll([...products,newProduct]);
        res.status(200).send(newProduct);
    } catch (err) {
        res.status(500).send(err.message)
    }
});

productRouter.delete("/:pid", async (req,res) => {
    const {pid} = req.params;
    try {
        const products = await productFileManager.getAll();
        const productIndex = products.findIndex((product) => product.id === pid)
        if (productIndex === -1) {
            res.status(404).send("Producto no encontrado")
            return;
        }
        products.splice(productIndex, 1);
        await productFileManager.writeAll(products);
        res.status(200).send("Producto Eliminado");
    } catch (err) {
        res.status(500).send(err.message)
    }
});

productRouter.put("/:pid", async (req,res) => {
    const {pid} = req.params;
    const newProduct = req.body;

    try{
        const products = await productFileManager.getAll();
        const productIndex = products.findIndex((product) => product.id === pid);
        if (productIndex === -1) {
            res.status(404).send("Producto no encontrado");
            return;
        }
        newProduct.id = pid;
        products[productIndex] = newProduct;
        await productFileManager.writeAll(products);
        res.status(200).send(newProduct)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

export default productRouter;