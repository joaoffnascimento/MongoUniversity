//Trazer o nome dos planetas e o meu peso em cada um deles.

var pipeline = [
    {
        $project: {
            _id: 0,
            name: 1,
            myWeight: {
                $multiply: [
                    { $divide: ["$gravity.value", 9.8] },
                    68
                ]
            }
        }
    }
]

db.solarSystem.aggregate(pipeline)

/**
 * Things to Remember
 *  We must specify all fields we want to retain. (Exception _id field);
 *  $project let us add new fields (ex.: gravity: "$gravity.value");
 *  Reuse many times as required;
 *  $project can be used to reassign values to existing fields names and to derive entirely new fields.
 */