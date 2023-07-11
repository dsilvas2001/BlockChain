const SHA256 = require('crypto-js/sha256');
const Block = require('./block');



// Lista blanca de direcciones IP autorizadas
const ipWhitelist = ['192.168.56.8', '10.0.0.1', '123.456.789.0'];

// Obtener la dirección IP de tu computadora
const { networkInterfaces } = require('os');

function getMyIP() {
    const interfaces = networkInterfaces();
    for (let interfaceName in interfaces) {
        const addresses = interfaces[interfaceName];
        for (let address of addresses) {
            if (address.family === 'IPv4' && !address.internal) {
                return address.address;
            }
        }
    }
    return null;
}





class Blockchain {

    constructor() {
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    async initializeChain() {

        const myIP = getMyIP();

        if (!ipWhitelist.includes(myIP)) {
            console.error('Acceso denegado. Tu dirección IP no está autorizada:', myIP);
            process.exit(1); // Salir del programa con código de error
        }

        if (this.height == -1) {
            const block = new Block({ data: 'Genesis Block' });
            await this.addBlock(block)
        }
    }


    //AGREGAR NUEVOS BLOQUES
    addBlock(block) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            block.height = self.chain.length;
            block.time = new Date().getTime().toString();

            //si la longitud de la cadena es mayor a 0  no estamos en el bloque genesis  
            if (self.chain.length > 0) {

                // que el hash del bloque anterior va hacer 
                block.previousBlockHash = self.chain[self.chain.length - 1].hash; block
            }

            let errors = await self.validateChain();
            if (errors.length > 0) {
                reject(new Error("The chain is not valid: ", errors));
            }

            //crear Hash
            block.hash = SHA256(JSON.stringify(block)).toString();
            //se añade el self a la cadena
            self.chain.push(block);
            resolve(block);
        });
    }

    validateChain() {
        let self = this;
        const errors = [];

        return new Promise(async (resolve, reject) => {
            self.chain.map(async (block) => {
                try {
                    let isValid = await block.validate();
                    if (!isValid) {
                        errors.push(new Error('The block ${block.height} no es valido!'));
                    }
                } catch (err) {
                    errors.push(errors);
                }
            });
            resolve(errors);
        });
    }


    print() {
        let self = this;
        for (let block of self.chain) {
            console.log(block.toString());
        }
    }




}
module.exports = Blockchain;