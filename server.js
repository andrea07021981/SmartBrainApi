const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

//We need cors for security
app.use(cors());
/************************************************************
//MPORTANT: WE MUST USE BODY PARSER EVERYTIME WE SEND JSON
*/
app.use(bodyParser.json());
//IF WE SEND FORM ENCODED, WE USE:
//app.use(bodyParser.urlencoded({extended: false}))
/************************************************************/


//TEMP DATABASE
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '234',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}
app.get('/', (req,res) => {
    res.send('Helloooooooooo')
})

//SIGNIN
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json(database.users[0])
    } else {
        res.status(400).json('Error loggin in')
    }
})

//REGISTER
 app.post('/register', (req, res) => {
    //Desctructuring
    const { email, name, password } = req.body;
    let min = 0;
    let max = 100;
    let id = (Math.floor(Math.random() * (+max - +min)) + +min).toString();
    database.users.push({
        "id": id,
        "name": name,
        "email": email,
        "password": password,
        "entries": 0,
        "joined": new Date()
    })

    let found = database.users.filter(user => user.id === id);

    if (found.length > 0) {
        res.json(found);
    } else {
        res.status(404).json('Not created');
    }
 })

//PROFILE
app.get('/profile/:id', (req, res) => {
    //Destructuring
    var { id } = req.params;
    const userFound = database.users.filter(user => user.id === id);
    if (userFound.length > 0) {
        res.status(200).json(`User found! It is ${userFound[0].name}`);
    } else {
        res.status(404).json('Not found');
    }
})

//IMAGE
app.put('/image', (req, res) => {
    var { id } = req.body;
    const userFound = database.users.filter(user => user.id === id);
    if (userFound.length > 0) {
        userFound[0].entries++;
        res.status(200).json(`User found! His current entries are ${userFound[0].entries}`);
    } else {
        res.status(404).json('Not found');
    }
})

//----------------------------------------------------------------------
app.listen(3000, ()=> {
    console.log('App is running on port 3000');
})

/* STEPS
/ --> res = This is working
/signin --> POST = Successful/fail (We use post instead of GET because we'll send psw, For security reasons, we should put these info into body of POST)
/register --> POST = user
/profile/:userId --> GET = User
/image --> PUT = User
*/