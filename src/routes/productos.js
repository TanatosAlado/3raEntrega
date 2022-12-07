const {Router}=require("express");
const { productoDao }= require("../dao/index.js")
const routerProducto = Router();

const Singleton = require("../services/singletonP")
const productos2=new productoDao;
let pruebaSingleton = Singleton.getInstance();
pruebaSingleton.crearProductos(productos2)

const productos = pruebaSingleton.getProductos()


// Comienzo codigo AXIOS
const axios = require("axios")

async function traerDatos() {
    try{
        const response = await axios.get("http://localhost:8080/api/productos");
        console.log(response.data);
    } catch (err) {
        console.log(err)
    }
}

routerProducto.
route('/axios')
.get(async (req, res) => {
    const product = await traerDatos()
    res.status(200).json(product);
})
// Fin codigo AXIOS

// Comienzo codigo modulo HTTP
const modhttp = require("./moduloHttp")

routerProducto.
route('/modulo')
.get(async (req, res) => {
    const product = await traerDatos()
    res.status(200).json(product);
})
// Fin codigo modulo HTTP



routerProducto.
route('/:id?')
.get(async (req, res) => {
    if (req.params.id) {
        const product = await productos.getById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).send({ message: "Producto no encontrado" });
        }
    } else {
        const products = await productos.getAll();
        if (products) {
            res.status(200).json(products);
        } else {
            res.status(404).send({ message: "Producto no encontrado" });
        }
    }
})
.post( async (req, res) => {
    if (req.params.id) {
        res.status(400).json('no es posible crear un producto con un ID ya que es generado automaticamente');
    } else {
         await productos.save(req.body);
        res.status(201).json(`el producto se ha creado correctamente`);
    }
})

.delete( async (req, res) => {
    if (req.params.id) {
        const product = await productos.deleteById(req.params.id);
        if (product) {
            res.status(200).json('producto eliminado correctamente');
        } else {
            res.status(404).json({ error: 'No existe producto con dicho ID' });
        }
    } else {
        const products = await productos.deleteAll();
        if (!products) {
            res.status(200).json('todos los productos eliminados correctamente');
        } else {
            res.status(404).json({ error: 'error al borrar productos' });
        }
    }

})
.put( (req, res) => {
    const product = productos.updateById(req.params.id, req.body);
    if (product) {
        res.status(201).json(`el producto se ha actualizado correctamente`)
    } else {
        res.status(404).json({ error: 'No existe producto con dicho ID' });
    }
})



module.exports= {routerProducto}