const mongoose = require('mongoose')

const connectionURL = 'mongodb+srv://Itzikefraim:Itzik170295@cluster0-ruhul.gcp.mongodb.net/shopping_list?retryWrites=true&w=majority'

mongoose.connect(connectionURL, {
  useNewUrlParser:true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).catch((e) => {
  console.log(e)
})
