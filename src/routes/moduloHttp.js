const https = require("https")

const resultado = ["hola", "chau"]

const options = {
    hostname: 'localhost:8080',
    port: 443,
    path: '/api/productos',
    method: 'GET'
}


const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
        process.stdout.write(d)
    })
})

req.on('error', error => {
    console.error(error)
})

function trarLosDatos(){
    console.log("ingrese")
    return resultado
}

req.end()

module.exports = trarLosDatos;