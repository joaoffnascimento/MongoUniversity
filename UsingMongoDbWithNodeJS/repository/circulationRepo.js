const { MongoClient, ObjectID } = require('mongodb')
require('dotenv/config')

function circulationRepo() {
    function remove(id) {
        return new Promise(async (resolve, reject) => {
            const client = MongoClient(process.env.MONGODB_URL)

            try {
                await client.connect()
                const db = client.db(process.env.MONGODB_DATABASE)

                const result = await db.collection(process.env.COLLECTION).deleteOne({ _id: ObjectID(id) })
                resolve(result.deletedCount === 1)
                client.close()
            } catch (error) {
                reject(error)
            }
        })
    }

    function update(id, newItem) {
        return new Promise(async (resolve, reject) => {
            const client = MongoClient(process.env.MONGODB_URL)

            try {
                await client.connect()
                const db = client.db(process.env.MONGODB_DATABASE)

                const result = await db.collection(process.env.COLLECTION)
                    .findOneAndReplace({ _id: ObjectID(id) }, newItem, { returnOriginal: false })
                resolve(result.value)

                client.close()
            } catch (error) {
                reject(error)
            }
        })
    }

    function addItem(item) {
        return new Promise(async (resolve, reject) => {
            const client = MongoClient(process.env.MONGODB_URL)

            try {
                await client.connect()
                const db = client.db(process.env.MONGODB_DATABASE)

                const result = await db.collection(process.env.COLLECTION).insertOne(item)
                resolve(result.ops[0])

                client.close()
            } catch (error) {
                reject(error)
            }
        })
    }

    function getById(id) {
        return new Promise(async (resolve, reject) => {
            const client = MongoClient(process.env.MONGODB_URL)
            try {
                await client.connect()
                const db = client.db(process.env.MONGODB_DATABASE)

                const result = await db.collection(process.env.COLLECTION).findOne({ _id: ObjectID(id) })

                resolve(await result)

                client.close()
            } catch (error) {
                reject(error)
            }
        })
    }

    function get(query, limit) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(process.env.MONGODB_URL)
            try {

                await client.connect()
                const db = client.db(process.env.MONGODB_DATABASE)

                let items = db.collection(process.env.COLLECTION).find(query)

                if (limit > 0) {
                    items = items.limit(limit)
                }
                resolve(await items.toArray())

                client.close()
            } catch (error) {
                reject(error)
            }
        })
    }

    function loadData(data) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(process.env.MONGODB_URL)
            try {

                await client.connect()
                const db = client.db(process.env.MONGODB_DATABASE)

                results = await db.collection(process.env.COLLECTION).insertMany(data)

                resolve(results)
                client.close()
            } catch (error) {
                reject(error)
            }
        })
    }

    function averageFinalists() {
        return new Promise(async (resolve, reject) => {
            const client = MongoClient(process.env.MONGODB_URL)

            try {
                await client.connect()
                const db = client.db(process.env.MONGODB_DATABASE)

                const result = await db.collection(process.env.COLLECTION)
                    .aggregate([
                        {
                            $group: {
                                _id: null,
                                avgFinalists: { $avg: '$Pulitzer Prize Winners and Finalists, 1990-2014' }
                            }
                        }
                    ]).toArray()

                resolve(result[0].avgFinalists)
                client.close()
            } catch (error) {
                reject(error)
            }
        })
    }

    function averageFinalistsByCirculation() {
        return new Promise(async (resolve, reject) => {
            const client = MongoClient(process.env.MONGODB_URL)

            try {
                await client.connect()
                const db = client.db(process.env.MONGODB_DATABASE)

                const result = db.collection(process.env.COLLECTION)
                    .aggregate([
                        {
                            $project: {
                                "Newspaper": 1,
                                "Pulitzer Prize Winners and Finalists, 1990-2014": 1,
                                "Change in Daily Circulation, 2004-2013": 1,
                                overallChange: {
                                    $cond: { if: { $gte: ["$Change in Daily Circulation, 2004-2013", 0] }, then: "positive", else: "negative" }
                                }
                            }
                        },
                        {
                            $group:
                            {
                                _id: "$overallChange",
                                avgFinalists: { $avg: "$Pulitzer Prize Winners and Finalists, 1990-2014" }
                            }
                        }
                    ]).toArray()

                resolve(result)
                client.close()
            } catch (error) {
                reject(error)
            }
        })
    }

    return { loadData, get, getById, addItem, update, remove, averageFinalists, averageFinalistsByCirculation }
}

module.exports = circulationRepo()

// collection.find({}).project({ a: 1 })                             // Create a projection of field a
// collection.find({}).skip(1).limit(10)                          // Skip 1 and limit 10
// collection.find({}).batchSize(5)                               // Set batchSize on cursor to 5
// collection.find({}).filter({ a: 1 })                              // Set query on the cursor
// collection.find({}).comment('add a comment')                   // Add a comment to the query, allowing to correlate queries
// collection.find({}).addCursorFlag('tailable', true)            // Set cursor as tailable
// collection.find({}).addCursorFlag('oplogReplay', true)         // Set cursor as oplogReplay
// collection.find({}).addCursorFlag('noCursorTimeout', true)     // Set cursor as noCursorTimeout
// collection.find({}).addCursorFlag('awaitData', true)           // Set cursor as awaitData
// collection.find({}).addCursorFlag('exhaust', true)             // Set cursor as exhaust
// collection.find({}).addCursorFlag('partial', true)             // Set cursor as partial
// collection.find({}).addQueryModifier('$orderby', { a: 1 })        // Set $orderby {a:1}
// collection.find({}).max(10)                                    // Set the cursor max
// collection.find({}).maxTimeMS(1000)                            // Set the cursor maxTimeMS
// collection.find({}).min(100)                                   // Set the cursor min
// collection.find({}).returnKey(10)                              // Set the cursor returnKey
// collection.find({}).setReadPreference(ReadPreference.PRIMARY)  // Set the cursor readPreference
// collection.find({}).showRecordId(true)                         // Set the cursor showRecordId
// collection.find({}).sort([['a', 1]])                           // Sets the sort order of the cursor query
// collection.find({}).hint('a_1')                                // Set the cursor hint