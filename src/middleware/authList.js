const jwt = require('jsonwebtoken')
const List = require('../models/list')

const authList = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '').trim()

    const decoded = jwt.verify(token, 'imadethisapplist')

    const list = await List.findOne({_id: decoded._id, 'tokens.token': token})

    if (!list) {
      throw new Error()
    }

    req.token = token
    req.list = list
    next()

  } catch (e) {
    res.status(401).send({error: 'Please authenticate'})
  }
}

module.exports = authList
