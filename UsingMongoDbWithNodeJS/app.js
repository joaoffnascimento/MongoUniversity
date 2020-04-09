const MongoClient = require('mongodb').MongoClient
const circulationRepo = require('./repository/circulationRepo')
const data = require('./circulation.json')
const assert = require('assert')

require('dotenv/config')


const url = process.env.MONGODB_URL
const dbName = process.env.MONGODB_DATABASE

console.log(url)
async function main() {
    const client = new MongoClient(url)
    await client.connect()
    console.log('CONECTOU')

    const results = await circulationRepo.loadData(data)
    console.log(results.insertedCount, results.ops)
}

main()