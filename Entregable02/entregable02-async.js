const fs = require('fs');
const path = require('path');

class ProductManager {
    
    constructor() {
      this.aumentID = 0
      this.products = [];
      this.file = path.join(__dirname, 'products.json');
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
    return new Promise((resolve,reject) => {
            this.aumentID +=1
            const producto = {
            id: this.aumentID,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        if (title === undefined || description === undefined || price === undefined || thumbnail === undefined || code === undefined || stock === undefined) {
            return console.log("Todos los campos son obligatorios");
        }

        let existencia = this.products.find((producto) => producto.code === code);
        if (existencia) {
            reject(console.log("El producto ya existe"));
        } else {
            this.products.push(producto);
            fs.writeFileSync(this.file,JSON.stringify(this.products),"utf8")
        }
        resolve();
    });
    }
  
    getProducts(){
        return new Promise((resolve, reject) => {
            try{
                this.products = JSON.parse(fs.readFileSync(this.file))
                resolve(this.products);
              }catch(err){
                this.products = [];
                resolve(this.products);
              }
        });
    }
  
    getProductById(id) {    
        return new Promise((resolve, reject) => {
            fs.readFile(this.file,"utf8",(err,data)=>{
                if(err){
                    reject(err);
                }
                this.products = JSON.parse(data);
                const productoFind = this.products.filter((product) => product.id === id );
                if (productoFind.length === 0){
                    resolve("No se encontro el producto con este id")
                }else{
                    resolve(productoFind);
                }
            });
        });
    }
  
  deleteProduct(id) {
    return new Promise((resolve, reject) => {
        fs.readFile(this.file,"utf8",(err,data) => {
            if (err){
                reject(err)
            }
            this.products = JSON.parse(data);
            this.products = this.products.filter((product)=> product.id !== id)
            fs.writeFile("products.json",JSON.stringify(this.products), (err) => {
                if (err) {
                    reject(err)
                }
                resolve();
            });
        });
    });
  }

  updateProduct(id, llave, valor) {
    return new Promise((resolve, reject) => {
    let miProducto = null;
    let posCamb = null;
    this.products = JSON.parse(fs.readFileSync(this.file))
    this.products.forEach((producto) => {
      if (producto.id === id) {
        miProducto = producto;
        posCamb = this.products.indexOf(producto)
      }
    });
    switch (llave) {
      case "title":
        miProducto.title = valor;
        break;
      case "description":
        miProducto.description = valor;
        break;
      case "price":
        miProducto.price = valor;
        break;
      case "thumbnail":
        miProducto.thumbnail = valor;
        break;
      case "code":
        miProducto.code = valor;
        break;
      case "stock":
        miProducto.stock = valor;  
      default:
        break;
    }
    this.products[posCamb]=miProducto
    fs.writeFile;
    resolve();
    });
    }

};

//modulo de pruebas
const productManager = new ProductManager([],"products.json");

const runAwait = async () => {
    let users = await productManager.getProducts();
    console.log(users);
    await productManager.addProduct(
    "Balon",
    "El balon del mundial qatar 2022",
    700,
    "thumbnaildelbalon.com",
    "0001",
    25);
    await productManager.addProduct(
    "Balon2",
    "El balon del mundial qatar 2022-2",
    700,
    "thumbnaildelbalon.com2",
    "0002",
    25);
    users = await productManager.getProducts();
    console.log(users);
    await productManager.deleteProduct(2)
    console.log("borramos el id 2");
    users = await productManager.getProducts();
    console.log(users);

/*     const productFilterErr = await productManager.getProductById(1234);
    const productFilter = await productManager.getProductById(1);
    console.log(productFilterErr);
    console.log(productFilter);
    await productManager.updateProduct(1,"title","Espadas (prueba update)")
    users = await productManager.getProducts();
    console.log(users);
    await productManager.deleteProduct(12345);
    await productManager.deleteProduct(1)
    users = await productManager.getProducts();
    console.log(users); */

};

runAwait();