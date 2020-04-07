var pipeline = [
    {
        $match: {
            'imdb.rating': { $gte: 7 },
            'genres': { $nin: ['Crime', 'Horror'] },
            'rated': { $in: ['PG', 'G'] },
            $and: [
                { 'languages': 'English' },
                { 'languages': 'Japanese' }
            ]
        }
    }
]