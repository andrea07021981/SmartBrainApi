const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');//Password crypting
const cors = require('cors');
const knex = require('knex');//It's used for postgreesql connections (with npm install pg)

const register = require('./controllers/register');
const signin = require('./controllers/signin')
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'andreafranco',
        password : '',
        database : 'smart-brain-db'
    }
});

//Exemple of select
// console.log(db.select('*').from('users').then(data => {
//     console.log(data);
// }));

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

app.get('/', (req,res) => {
    res.send('Helloooooooooo')
})

//SIGNIN
//WE could also use composing for functions like :
//signin.handleSigninPost(db, bcrypt)(req, res);
//And in signin 
//const handleSigninPost = (db, bcrypt)  => (req, res) => .....

app.post('/signin',(req, res) => { signin.handleSigninPost(req, res, db, bcrypt) });

//REGISTER
 app.post('/register', (req, res) => { register.handleRegisterPost(req, res, db, bcrypt) });

//PROFILE
app.get('/profile/:id', (req, res) =>{ profile.handleProfileGet(req, res, db) });

//IMAGE
app.put('/image', (req, res) => { image.handleImagePut(req, res, db) });

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