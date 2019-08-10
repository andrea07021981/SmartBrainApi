 const handleRegisterPost = (req, res, db, bcrypt) => {
    //Desctructuring
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    console.log(req.body.email);
    
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
                    .catch(err => console.log(err));
            })
            .then(trx.commit)
            .catch(err =>{
                console.log(err);
                
                trx.rollback;
            })
        })
        .catch(err => res.status(400).send(err));
 }

 //Mandatory for using the function elsewhere
 module.exports = {
     //handleRegisterPost: handleRegisterPost
     //With ES6 we can avoit the map when names are the same
     handleRegisterPost
 };