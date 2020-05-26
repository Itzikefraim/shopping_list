require('./db/mongoose')

const express = require('express')
const userRouter = require('./routers/user')
const itemRouter = require('./routers/item')
const listRouter = require('./routers/list')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(listRouter)
 app.use(itemRouter)

const port = process.env.PORT || 3000


app.listen(port, () => {
  console.log(`app is runnig on port ${port}`)

})
