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
        } 
        this.products.push(producto);
        fs.writeFile(this.file,JSON.stringify(this.products),(err) => {
            if (err) {
                return console.log("error al agregar el producto");
            }
            resolve();
        })
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
                if (productoFind.length === 0) {
                    console.log("No se encontro el producto con este id");
                }
                resolve(productoFind);
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
            let len1 = this.products.length;
            this.products = this.products.filter((product)=> product.id !== id)
            let len2 = this.products.length;
            fs.writeFile(this.file,JSON.stringify(this.products),(err) => {
                if (err) {
                    return console.log("error al eliminar producto");
                }
                resolve();
            })
            if (len1 === len2) {
                return console.log("no se elimino ningun producto con ese id");
            }
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
    fs.writeFile(this.file,JSON.stringify(this.products), (err) => {
        if (err) {
            reject(err)
        }
        resolve();
    });
    });
    }

};

//modulo de pruebas
const productManager = new ProductManager([],"products.json");

const runAwait = async () => {
    //llamar el metodo "getProducts" debe retornar un arreglo vacio"
    let products = await productManager.getProducts()
    console.log(products);
    //agregar un producto  con el metodo "addProduct"
    await productManager.addProduct(
        "producto prueba",
        "Este es un producto prueba",
        200,
        "sin Imagen",
        "abc123",
        25
    );
    await productManager.addProduct(
        "producto prueba -2",
        "Este es un producto prueba -2",
        200,
        "sin Imagen -2",
        "abc124",
        30
    );
    //volvemos a llamar el metodo "getProducts" para comprobar que se agrego satisfactoriamente
    products = await productManager.getProducts()
    console.log(products);
    //uso de el metodo "getProductById" para comprobar que funciona, en caso de no existir muestra un mensaje
    //aqui muestra cuando no se encuentra
    let productErr = await productManager.getProductById(12345)
    let productOk = await productManager.getProductById(1)
    console.log(productErr);
    //aqui ya retorna el producto encontrado por id
    console.log(productOk);
    //comprobamos que el metodo "updateProduct" funciones, este recibe como parametros, el id, la llave a modificar, y el valor a agregar.
    await productManager.updateProduct(1,"title","Espadas (prueba update)")
    //comprobamos que si haya cambiado
    products = await productManager.getProducts()
    console.log(products);
    //uso del metodo "deleteProduct" para comprobar que si elimina el producto en caso de que no exista el id asociado mostrar un mensaje 
    //aqui no existe el id
    await productManager.deleteProduct(12345)
    //aqui si existe el id
    await productManager.deleteProduct(1)     
    //comprobamos que si se haya eliminado, debera mostrar un arreglo solo con el objeto con id 2
    products = await productManager.getProducts()
    console.log(products);
};

runAwait();