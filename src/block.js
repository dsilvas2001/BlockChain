
//No importamos toda solo el siguiente algoritmo
//(Despues del codigo explicar)
// Esta nos ayudara  para cifrar los datos
const SHA256 = require('crypto-js/sha256');
//
const hex2ascii = require('hex2ascii');

class Block {

    constructor(data) {
        this.hash = null;
        this.height = 0;
        //se transforma a hexadecimal mediante esto oString('hex')
        this.body = Buffer.from(JSON.stringify(data).toString('hex'));

        this.time = 0;
        this.previousBlockHash = '';
    }


    //metodo valida que el bloque es correcto es decir que no sea manipulado donde comprobamos mediantes las hashes

    validate() {
        const self = this;
        return new Promise((
            resolve, reject
        ) => {
            //hash actual   
            let currentHash = self.hash;
            //hash que se genera
            //enoncres debemos calcular mediante esl siguiente comando
            self.hash = SHA256(
                JSON.stringify({ ...self, hash: null })).toString();

            if (currentHash != self.hash) {
                return resolve(false);
            }
            resolve(true);
        });
    }
    //Metodo de clase
    getBlockData() {
        //instalar dependencia npm i hex2ascii  importa al inicio
        const self = this;
        return new Promise((resolve, reject) => {
            //esto seria en el bloque en el que estamos
            let encodedData = self.body;
            let decodedData = hex2ascii(encodedData);
            let dataobject = JSON.parse(decodedData);


            //Genesis Block es el primer bloque de toda la cena blockchain que no tiene un hash previo
            if (dataobject == 'Genesis Block') {
                reject(new Error('Es es el primer bloque de la cadena Genesis Block'));
            }
            resolve(dataobject);

        });
    }
    toString() {
        const { hash, height, body, time, previousBlockHash } = this;

        return ` Block - 
            hash: ${hash}
            height: ${height}
            body: ${body}
            time: ${time}
            previousBlockHash: ${previousBlockHash}
            ---------------------------------------------------`;
    }
}


//Exportar el modelo blockchain

module.exports = Block;
