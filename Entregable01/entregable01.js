class ProductManager {
    constructor() {
      this.products = [];
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
      const producto = {
        id: this.products.length + 1,
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
      }
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(id) {
      let idBuscar = id;
      let miProducto = null;
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
};
  
const productManager = new ProductManager();
productManager.addProduct(
    "Balon",
    "El balon del mundial qatar 2022",
    700,
    "thumbnaildelbalon.com",
    "0001",
    25
);
productManager.addProduct(
    "medias",
    "Las mejores medias del mundo",
    50,
    "thumbnailMedias.com",
    "0002",
    100
);
//que sucede cuando no se completan los datos
productManager.addProduct(
    "raqueta",
    800,
    "thumbnailRaqueta.com",
    "0003",
    9
);
//que sucede cuando el producto se repite por codigo
productManager.addProduct(
    "Libreta",
    "escribe sin necesidad de una pluma",
    50,
    "thumbnailMedias.com",
    "0001",
    78
);
  
//obtener todos los productos
console.log(productManager.getProducts());
console.log("\n\n");
console.log(productManager.getProductById(1));
console.log("\n\n");
//cuando el id no coincide con ningun producto
console.log(productManager.getProductById(7));
