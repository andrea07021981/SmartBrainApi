const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');//Password crypting
const cors = require('cors');
const knex = require('knex');//It's used for postgreesql connections (with npm install pg)


const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'afranco',
        password : '',
        database : 'smart-brain'
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
app.post('/signin', (req, res) => {
    const {email, password} = req.body;
    
    db
        .select('email', 'hash')
        .from('login')
        .where({email})
        .then(data => {
            let isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db
                    .select('*')
                    .from('users')
                    .where({email})
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('Unable to get user'));
            } else {
                res.status(400).json('Wrong credentials')
            }
        })
        .catch(err => res.status(400).json('Wrong credentials'));
})

//REGISTER
 app.post('/register', (req, res) => {
    //Desctructuring
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);

    //We are using TRANSACTIONS in order to avoid partial inserts
    db.transaction(trx => {
        trx 
            .insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginemail => {
                return trx
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginemail[0],
                        joined: new Date()
                    })
                    .into('users')
                    .then(user => {
                        if (user.length > 0) {
                            res.json(user[0]);
                        } else {
                            throw('');
                        }
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).send('Unable to register'));
 })

//PROFILE
app.get('/profile/:id', (req, res) => {
    //Destructuring
    var { id } = req.params;
    db
        .select('*')
        .from('users')
        .where({id})//ES6 allows us to avoid repeating variables if they have the same name
        .then(user => {
            //We must check because in js Boolean([]) return true
            if (user.length) {
                res.send(user[0]);
            } else {
                throw("");
            }
        })
        .catch(err => res.status(400).send('Error getting user'));
})

//IMAGE
app.put('/image', (req, res) => {
    var { id } = req.body;
    
    db('users')
        .where({id})
        .increment('entries', 1) //We can use increment in this case instead of update
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => send.status(400).send('Unable to get entries'));
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