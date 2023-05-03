const { Router } = require('express')
const { ObjectId } = require("mongodb")

const { getDb } = require("../lib/mongo")

const router = Router()

router.get('/', async function (req, res, next) {
    const db = getDb()
    const collection = db.collection("lodgings")

    let page = parseInt(req.query.page) || 1
    page = Math.max(1, page)
    const pageSize = 5
    const offset = (page - 1) * pageSize

    const lodgings = await collection.find({})
        .sort({ _id: 1 })
        .skip(offset)
        .limit(pageSize)
        .toArray()

    res.status(200).send({
        lodgings: lodgings
    })
})

router.post('/', async function (req, res, next) {
    const db = getDb()
    const collection = db.collection("lodgings")
    const result = await collection.insertOne(req.body)
    res.status(201).send({
        id: result.insertedId
    })
})

router.get('/:id', async function (req, res, next) {
    const id = req.params.id
    console.log("  -- id:", id)
    console.log("  -- is valid:", ObjectId.isValid(id))
    const db = getDb()
    const collection = db.collection("lodgings")
    if (ObjectId.isValid(id)) {
        const results = await collection.find({
            _id: new ObjectId(id)
        }).toArray()
        if (results.length !== 0) {
            res.status(200).send(results[0])
        } else {
            next()
        }
    } else {
        next()
    }
})

router.patch('/:id', function (req, res, next) {
    const id = req.params.id
    res.status(200).send({})
})

router.delete('/:id', function (req, res, next) {
    const id = req.params.id
    res.status(204).send()
})

module.exports = router
