var pipeline = [
    {
        $project: {
            _id: 0,
            size: {
                $size: {
                    $split: ['$title', ' ']
                }
            }
        }
    },
    {
        $match: {
            size: { $eq: 1 }
        }
    }
]