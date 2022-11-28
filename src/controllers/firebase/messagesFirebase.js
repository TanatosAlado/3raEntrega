module.exports=class messagesfirebaseController {
	constructor() {
		this.db = config.firebase.db;
		this.query = this.db.collection('messages');
	}

     saveMsjs = async (msj) => {
        const newMsj = new msjModel(msj);
        try {
            newMsj.save()
        } catch (error) {
            throw new Error(error);
        }
    }
}