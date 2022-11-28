const ProdfirebaseController=require ( '../../controllers/firebase/productsFirebase.js');


class ProductosDaoFirebase extends ProdfirebaseController{
    constructor(){
        super ('products',{
    
        })
    }
}

module.exports= ProductosDaoFirebase;