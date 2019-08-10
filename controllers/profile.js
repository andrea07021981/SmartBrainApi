const handleProfileGet = (req, res, db) => {
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
}

module.exports = {
    handleProfileGet
}