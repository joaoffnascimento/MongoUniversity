var pipeline = [
    {
        $match: {
            "writers": { $elemMatch: { $exists: true } },
            "cast": { $elemMatch: { $exists: true } },
            "directors": { $elemMatch: { $exists: true } }
        }
    },
    {
        $project: {
            "writers": {
                $map: {
                    input: "$writers",
                    as: "writer",
                    in: {
                        $arrayElemAt: [
                            { $split: ["$$writer", " ("] },
                            0
                        ]
                    }
                }
            },
            "cast": 1,
            "directors": 1
        }
    },
    {
        $project:
            { "laborOfLove": { $gt: [{ $size: { $setIntersection: ["$writers", "$cast", "$directors"] } }, 0] } }
    },
    { $match: { "laborOfLove": true } }
];

// Prints the result.
var result = db.movies.aggregate(pipeline).itcount();
print("Result: " + result);