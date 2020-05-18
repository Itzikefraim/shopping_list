const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 30
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is not valid')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

const User = mongoose.model('User', userSchema)

module.exports = User
