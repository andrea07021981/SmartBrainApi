const handleImagePut = (req, res) => {
    var { id } = req.body;
    
    db('users')
        .where({id})
        .increment('entries', 1) //We can use increment in this case instead of update
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => send.status(400).send('Unable to get entries'));
}

module.exports = {
    handleImagePut
}