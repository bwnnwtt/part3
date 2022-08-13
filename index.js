const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

const customLogger = (tokens,req,res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(customLogger))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(request.headers['content-type'] !== 'application/json') {
    return response.status(400).json({ 
      error: 'bad request' 
    })
  }
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }
  Person.find({}).then(persons => {
    if (persons.map(person => person.name).find(name => name === body.name) !== undefined) {
      return response.status(400).json({ 
        error: 'name already exists in phonebook' 
      })
    }
  })

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<div>Phonebook has info for ${persons.length} people</div><div>${date}</div>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})
