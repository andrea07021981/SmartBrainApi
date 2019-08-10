const handleSigninPost = (req, res, db, bcrypt)  => {
    const {email, password} = req.body;
    
    db
        .select('email', 'hash')
        .from('login')
        .where({email})
        .then(data => {
            let isValid = bcrypt.compareSync(password, data[0].hash);
            console.log(isValid);
            
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
};

module.exports = {
    handleSigninPost
}