const messagefirebaseController=require ( '../../controllers/firebase/messagesFirebase.js');


class messageDaoFirebase extends messagefirebaseController{
    constructor(){
        super ('messages',{
    
        })
    }
}

module.exports= messageDaoFirebase;