import express from "express";
import path from "path";
import ProductManager from "./ProductManager.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const productManager = new ProductManager(
  path.resolve(process.cwd(), "src", "products.json")
);

//solicitar products y limite
app.get("/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const limit = req.query.limit;
    let limitedProducts;
    if (limit) {
      limitedProducts = products.slice(0, limit);
    }
    res.send(limitedProducts || products);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//solicitar products por id
app.get("/products/:id", async (req,res)=>{
    try{
        const products = await productManager.getProducts();
        const idProd = req.params.id;
        const prodMostrar = products[idProd-1];
        if (prodMostrar){
            res.status(200).send(prodMostrar)
        } else {
            res.status(404).send('product not found')
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.listen(port, () => {
  console.log(`Iniciado en http://localhost:${port}`);
});