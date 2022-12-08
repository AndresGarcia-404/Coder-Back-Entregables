const fs = require('fs');
const path = require('path');

class ProductManager {
    
    constructor() {
      this.aumentID = 0
      this.products = [];
      this.file = path.join(__dirname, 'products.json');
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
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
        return console.log("El producto ya existe");
      } else {
        this.products.push(producto);
        fs.writeFileSync(this.file,JSON.stringify(this.products),"utf8")
      }
    }
  
    getProducts() {
      try{
        this.products = JSON.parse(fs.readFileSync(this.file))
        return this.products;
      }catch(err){
        this.products = [];
        return this.products;
      }
    }
  
    getProductById(id) {
      let idBuscar = id;
      let miProducto = null;
      this.products = JSON.parse(fs.readFileSync(this.file))
      this.products.forEach((producto) => {
        if (producto.id === idBuscar) {
          miProducto = producto;
        }
      });
      if (miProducto === null) {
        return console.log("Not found");
      } else {
        return miProducto;
      }
    }
  
  deleteProduct(id) {
    this.products = JSON.parse(fs.readFileSync(this.file))
    let len1 = this.products.length;
    this.products = this.products.filter((producto) => producto.id !== id);
    let len2 = this.products.length;
    fs.writeFileSync(this.file,JSON.stringify(this.products),"utf8");

    if (len1 === len2) {
      console.log("no se elimino ningun producto, verifique el id");      
    } else {
      console.log(`El producto con id: ${id} se elimino con exito`);
    }

  }

  updateProduct(id, llave, valor) {
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
    fs.writeFileSync(this.file,JSON.stringify(this.products),"utf8");
  }

};

//modulo de pruebas:


//creacion de la instancia de la clase "productManager"
const productManager = new ProductManager([],"products.json");
//llamar el metodo "getProducts" debe retornar un arreglo vacio"
console.log(productManager.getProducts());
//agregar un producto  con el metodo "addProduct"

productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "sin Imagen",
  "abc123",
  25
);
//volvemos a llamar el metodo "getProducts" para comprobar que se agrego satisfactoriamente
console.log(productManager.getProducts());
//uso de el metodo "getProductById" para comprobar que funciona, en caso de no existir marcar el error

//aqui no existe el producto (marca que no hay id correspondiente)
console.log(productManager.getProductById(1234));
//aqui si existe (muestra el objeto)
console.log(productManager.getProductById(1));

//comprobamos que el metodo "updateProduct" funciones, este recibe como parametros, el id, la llave a modificar, y el valor a agregar.
productManager.updateProduct(1,"title","Espadas (prueba update)")

//comprobamos que se haya cambiado sin cambiar el id
console.log(productManager.getProducts());

//uso del metodo "deleteProduct" para comprobar que si elimina el producto en caso de que no exista el id asociado mostrar un mensaje 

//aqui no existe el id
productManager.deleteProduct(12345)
//aqui si existe el id
productManager.deleteProduct(1)

//agregue otra vez el producto de prueba para que denote que el id es creciente y no se repite 
productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "sin Imagen",
  "abc123",
  25
);
//por ultimo comprobamos que si se haya eliminado 
console.log(productManager.getProducts());
