const { MongoClient } = require('mongodb')
require('dotenv/config')

function circulationRepo() {
    //Build a circulation object
    function loadData(data) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(process.env.MONGODB_URL)
            try {
                await client.connect()
                const db = client.db(process.env.MONGODB_DATABASE)

                results = await db.collection('newspapers').insertMany(data)
                
                resolve(results)
            } catch (error) {
                reject(error)
            }
        })
    }

    return { loadData }
}

module.exports = circulationRepo()