const cartfirebaseController=require ( '../../controllers/firebase/cartFirebase.js');


class cartDaoFirebase extends cartfirebaseController{
    constructor(){
        super ('carts',{
    
        })
    }
}

module.exports= cartDaoFirebase