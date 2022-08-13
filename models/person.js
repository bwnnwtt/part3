const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB: ', error.message)
    })

const numValidator = (number) => {
    let count = (number.match(/-/g) || []).length
    console.log(count)
    if (count === 0) {
        return true
    } else if (count === 1) {
        let idx = number.indexOf('-')
        return idx === 2 || idx === 3
    } else {
        return false
    }
    // return count === 0 || count === 1
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        // validate: [numberValidator, `phone number is shorter than 8`]
        validate: [numValidator, 'invalid phone number type']
    }
  })


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema)