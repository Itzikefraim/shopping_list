const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const listSchema = new mongoose.Schema({
  listName: {
    type: String,
    required: true,
    maxLength: 30
  },
  description: {
    type: String,
    required: false,
    maxLength: 200
  },
  owner: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
  tokens: [{
    token: {
      type: String,
      required: true

    }
  }]

})

listSchema.virtual('item', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'owner'
})


listSchema.methods.generateAuthToken = async function () {
  const list = this
  const token = jwt.sign({_id: list._id.toString()}, 'imadethisapplist')

  list.tokens = list.tokens.concat({token})

  await list.save()

  return token
}


const List = mongoose.model('List', listSchema)

module.exports = List
