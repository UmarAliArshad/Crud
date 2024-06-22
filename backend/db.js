const mongoose = require("mongoose")

mongoose.connect(process.env.DB).then(() => {
  console.log("DB connected Successfully...")
}).catch((error) => {
  console.log(error)
})