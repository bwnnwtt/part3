const express = require('express')
const morgan = require('morgan')
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


app.use(express.json())
app.use(morgan(customLogger))

let persons = [
      { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
    ]
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
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
  if (persons.map(person => person.name).find(name => name === body.name) !== undefined) {
    return response.status(400).json({ 
      error: 'name already exists in phonebook' 
    })
  }

  const existingIds = persons.map(person => person.id)
  let newId = parseInt(Math.random() * 1000)

  while(typeof(existingIds.find(id => id === newId)) === "number") {
    newId = parseInt(Math.random() * 1000)
  }

  const person = request.body
  person.id = newId
  
  // console.log("person",person)
  persons = persons.concat(person)

  response.json(person)
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

const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})
