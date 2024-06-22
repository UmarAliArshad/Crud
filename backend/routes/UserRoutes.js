const express = require('express')
const bodyParser = require("body-parser")
const joi = require("joi")
const bcrypt = require("bcrypt")
const router = express.Router()

// validators
const addUserValidator = joi.object({
  school_name: joi.string().required(),
  phone_number: joi.string().required(),
  city_name: joi.string().required(),
  name: joi.string().required(),
  email: joi.string().email().required(),  // email validation
  password: joi.string().required(),
  confirm_password: joi.string().required(),
  address: joi.string().optional()  // making address optional
})

const User = require("../models/UserModel")
const jsonParser = bodyParser.json()

router.post('/register', jsonParser, async (req, res) => {
  try {
    // Validate request body
    await addUserValidator.validateAsync(req.body)

    // Check if passwords match
    if (req.body.password !== req.body.confirm_password) {
      return res.status(400).send({ status: false, message: "Passwords do not match" })
    }

    // Check if user already exists
    const checkEmail = await User.findOne({ email: req.body.email })
    if (checkEmail) {
      return res.status(400).send({ status: false, message: "User already exists" })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    
    // Create new user object with hashed password
    const user = new User({
      ...req.body,
      password: hashedPassword
    })

    // Save the new user to the database
    await user.save()
    res.status(201).send({ status: true, message: "User added successfully!" })

  } catch (error) {
    console.log(error)
    if (error.isJoi) {
      res.status(400).send({ status: false, message: error.details[0].message })
    } else {
      res.status(500).send({ status: false, message: "Internal Server Error" })
    }
  }
})

module.exports = router