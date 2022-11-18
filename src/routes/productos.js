const {Router}=require("express");
const { productoDao }= require("../dao/index.js")

const routerProducto = Router();
const productos=new productoDao;

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