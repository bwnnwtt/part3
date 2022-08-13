const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
  }
  
  const password = process.argv[2]

  const url = `mongodb+srv://puayjianjun:${password}@cluster0.138lhuz.mongodb.net/?retryWrites=true&w=majority`
  
  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)

  if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    mongoose
        .connect(url)
        .then((result) => {
            const person = new Person({
                name,
                number
            })

            return person.save()
        })
        .then(() => {
            console.log(`added ${name} number ${number} to phonebook`)
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
  }

  if (process.argv.length === 3) {
    mongoose
        .connect(url)
        .then((result) => {
            Person
                .find({})
                .then(persons => {
                    console.log('phonebook:')
                    persons.forEach(person => {
                        console.log(`${person.name} ${person.number}`)
                    })
                    mongoose.connection.close()
                })
        })
        .catch((err) => console.log(err))
  }
