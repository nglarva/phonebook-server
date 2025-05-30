const express = require('express');
const morgan = require('morgan')
const app = express();

app.use(express.json());
app.use(express.static('dist'))
morgan.token("content", function getContent (req) { return JSON.stringify(req.body)})

app.use(morgan(':method :url :status :res[content-length] - :response-time[digits] ms :content'));
persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

const requestLogger = (request, response, next) =>{
    console.log('Method: ', request.method);
    console.log('Path: ', request.path);
    console.log('Body: ', request.body)
}
const unknownEnpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
//app.use(requestLogger)
app.get('/api/persons', (request, response) =>{
    response.json(persons)
})

app.get('/api/persons/:id', (req, res) =>{
   const person =  persons.find(person => person.id === req.params.id);
   if(person){
        res.json(person);
   } else {
        res.status(404).send("Not found");
   }
   
})
app.get('/api/posts', (req, res)=>{
    res.json(persons)
})
app.get('/info', (request, response) =>{
    const time = new Date();
    const message1 = `Phonebook has info for ${persons.length} people`;
    const message2 = `${time}`;
    response.send(message1 + "<br> <br>" + message2)
    
})
const generatorId = () => {
    return Math.floor(Math.random()*10 + persons.length+1);
}

app.post('/api/persons', (req, res)=>{
    if (!req.body.name || !req.body.number){
        res.status(500).send("Information is not enough");
    }
    else {
        try {
            if(!persons.find(p => p.name === req.body.name)){
                const newPerson = {
                    name: req.body.name,
                    number: req.body.number,
                    id: String(generatorId())
            
                }
                persons.push(newPerson);
                res.status(201).send(persons);
            }
            else {
                res.end('\{"error: name must be unique"\}')
            }      
        
    } catch(err){

    }
    }
    
})

app.delete('/api/persons/:id', (req, res) => {
    try{
        persons = persons.filter(p=>p.id !== req.params.id);
        res.json(persons);
    } catch(error){
        res.status(500).send("That person is not exist")
    }
    
    

})
app.use(unknownEnpoint);

const PORT = process.env.PORT || 3002
app.listen(PORT);

console.log("Server is running on port ", PORT)