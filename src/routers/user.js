const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')


// create user
router.post('/user', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = user.generateAuthToken()
    res.send({user, token})
  } catch (e) {
    console.log(`Failed ${e}`)
    res.status(400).send(e)
  }
})

// login
router.post('/user/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()


    res.send({user, token})
  } catch (e) {
    res.status(400).send({error: e})

  }
})

// logout
router.post('/user/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })

    await req.user.save()
    res.send()

 } catch (e) {
   res.status(400).send({error: e})
 }
})

// get user
router.get('/user/me', auth, async (req, res) => {
  res.send(req.user)

})

// delete user
router.delete('/user/me',auth,  async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
})

// update user
router.patch('/user/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password']

  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidUpdate) {
    return res.status(400).send({error: 'Update is not valid'})
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()

    res.send(req.user)
  } catch (e) {
    res.status(400).send({error: e})

  }
})

module.exports = router
