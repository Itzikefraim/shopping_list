const express = require('express')
const router = new express.Router()
const Item = require('../models/item')
const authList = require('../middleware/authList')


// create an item
router.post('/item', authList, async (req, res) => {
  const item = new Item ({
    ...req.body,
    owner: req.list._id
  })
  try {
    await item.save()
    res.send(item)
  } catch (e) {

    res.status(400).send({error: e})
  }
})

// get all items of a list
router.get('/item', authList, async (req, res) => {
  try {
    await Item.find({owner: req.list._id}, (err, items) => {
      if (err) {
        return res.status(400).send({error: err})
      }

      res.send(items)
    })
  } catch (e) {
    res.status(400).send({error: e})
  }
})


router.delete('/item/:id', authList, async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({_id: req.params.id})

    if (!item) {
      return res.status(404)
    }

    res.send(item)
  } catch (e) {
    res.status(400).send({error: e})
  }
})




















module.exports = router
