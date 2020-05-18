const mongoose = require('mongoose')
const validator = require('validator')
const List = require('./list')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

userSchema.virtual('list', {
  ref: 'List',
  localField: '_id',
  foreignField: 'owner'
})

// login function
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email})

  if (!user) {
    throw new Error('Unable to login')
  }
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

// hashing password
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

// generates token
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({_id: user._id.toString()}, 'imadethisapp')

  user.tokens = user.tokens.concat({token})

  await user.save()

  return token
}

const User = mongoose.model('User', userSchema)

module.exports = User
