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

    try {
        console.log('CONECTOU')

        //const results = await circulationRepo.loadData(data)
        //assert.equal(data.lenght, results.lenght)

        const getData = await circulationRepo.get()
        assert.equal(data.lenght, getData.lenght)

        const filterData = await circulationRepo.get({ Newspaper: getData[4].Newspaper })
        assert.deepEqual(getData[4], filterData[0])

        const limitData = await circulationRepo.get({}, 3);
        assert.equal(limitData.length, 3);

        const id = getData[4]._id.toString()
        const byId = await circulationRepo.getById(id)
        assert.deepEqual(byId, getData[4])

        let newItem = {
            'Newspaper': 'Jornal Hoje Brasil',
            'Daily Circulation, 2004': 1,
            'Daily Circulation, 2013': 2,
            'Change in Daily Circulation, 2004-2013': 100,
            'Pulitzer Prize Winners and Finalists, 1990-2003': 0,
            'Pulitzer Prize Winners and Finalists, 2004-2004': 0,
            'Pulitzer Prize Winners and Finalists, 1990-2004': 0
        }
        const addedItem = await circulationRepo.addItem(newItem)
        assert(addedItem._id)

        const updateItem = await circulationRepo.update(addedItem._id, {
            'Newspaper': 'Jornal Ontem Brasil',
            'Daily Circulation, 2004': 1,
            'Daily Circulation, 2013': 2,
            'Change in Daily Circulation, 2004-2013': 100,
            'Pulitzer Prize Winners and Finalists, 1990-2003': 0,
            'Pulitzer Prize Winners and Finalists, 2004-2004': 0,
            'Pulitzer Prize Winners and Finalists, 1990-2004': 0
        })
        assert.equal(updateItem.Newspaper, 'Jornal Ontem Brasil')

        const removed = await circulationRepo.remove(updateItem._id)
        assert(removed)

        console.log(updateItem)

        const avgFinalists = await circulationRepo.averageFinalists()
        console.log('Average Finalists', avgFinalists)

        const avgFinalistsByCirculation = await circulationRepo.averageFinalistsByCirculation()
        console.log('Average By Circulation', avgFinalistsByCirculation)

    } catch (error) {
        console.error(error)
    } finally {
        //await client.db(process.env.MONGODB_DATABASE).dropCollection(process.env.COLLECTION)
        client.close()
        console.log('BANCO DROP & DESCONECTOU')
    }
}

main()
