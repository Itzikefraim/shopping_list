const express = require('express')
const router = new express.Router()
const List = require('../models/list')
const auth = require('../middleware/auth')
const authList = require('../middleware/authList')



// create a new list. one owner
router.post('/list', auth, async (req, res) => {
  const list = new List({
    ...req.body,
    owner: req.user._id
  })

  await list.generateAuthToken()

  try {
    await list.save()
    res.send(list)
  } catch (e) {
    res.status(400).send({error: e})
  }

})

// add another owner to a list.
// get current owner from req.user
// get list id from params
// get new owner id from req.body._id
router.patch('/list/:id', auth, async (req, res) => {
  try {
    var list = await List.findOne({ owner:req.user._id, _id: req.params.id })

    list.owner.push(req.body._id)
    console.log(list.owner)


    await list.save()
    res.send(list)
  } catch (e) {
    res.status(400).send({error: e})
  }
})

// get one list by id
router.get('/list/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const list = List.findOne({_id, owner: req.user._id})

    if (!list) {
      return res.status(404).send()
    }

    res.send(list)

  } catch (e) {
    res.status(400).send({error: e})
  }
})

// get all lists of a user
router.get('/list', auth, async (req, res) => {
  try {
    await List.find({owner: req.user._id}, (err, listsDB) => {
      if (err) {
        return res.status(404).send({error: err})
      }

      res.send(listsDB)
    })

  } catch (e) {
    res.status(400).send({error: e})
  }
})

// delete list
router.delete('/list/:id', auth, async (req, res) => {
  try {
    const list = await List.findOneAndDelete({_id: req.params.id, owner: req.user._id})
    if (!list) {
      return res.status(404).send()
    }
    res.send(list)
  } catch (e) {
    res.status(400).send({error: e})
  }
})

module.exports = router
