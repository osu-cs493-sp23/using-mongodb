const { Router } = require('express')
const { ObjectId } = require("mongodb")

const { getDb } = require("../lib/mongo")

const router = Router()

router.post('/', async function (req, res, next) {
    const db = getDb()
    const collection = db.collection("reservations")
    const reservation = {
        ...req.body,
        lodgingId: new ObjectId(req.body.lodgingId)
    }
    const result = await collection.insertOne(reservation)
    res.status(201).send({
        id: result.insertedId
    })
})

module.exports = router
