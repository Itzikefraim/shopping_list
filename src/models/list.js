const mongoose = require('mongoose')

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
  }]

})

listSchema.virtual('item', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'owner'
})

const List = mongoose.model('List', listSchema)

module.exports = List
