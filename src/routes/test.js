const chai=require('chai')
const supertest=require('supertest')
const expect=chai.expect
const axios=require('axios')
const URL='http://localhost:8000'
const request=supertest(URL)




describe('Test Productos',()=>{
    let producto
    let id
    let productoNuevo
    beforeEach(()=>{
        producto={
            title: "Camara Polaroid",
            price: 4800,
            image: "https://cdn2.iconfinder.com/data/icons/80-s-stuffs/63/Asset_38-256.png",
            description: "Camara Polaroid original ",
            stock: 8,
            categoria:"Video"
          }

          id='638a7ec6620fdd9603328e14'

          productoNuevo={
            title: "Camara Polaroid",
            price: 3200,
            image: "https://cdn2.iconfinder.com/data/icons/80-s-stuffs/63/Asset_38-256.png",
            description: "Camara Polaroid original ",
            stock: 8,
            categoria:"Video"
          }

    })
     it('Traer todos los productos',async ()=>{
        const response=await axios.get(`${URL}/productos`)
        expect(response.status).to.eql(200)
        expect(response.data).to.be.an('array')
        expect(response.data).to.not.be.undefined
    
}) 


})