const Clarifai = require('clarifai')
const { clarifaikey }= require('../constants/clarifaikey')

//IMPORTANT FOR CLARIFAI
const app = new Clarifai.App({
    apiKey: clarifaikey.key
});

const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => res.json(data))
        .catch(err => res.status(400).json(err));
}
const handleImagePut = (req, res, db) => {
    var { id } = req.body;
    
    db('users')
        .where({id})
        .increment('entries', 1) //We can use increment in this case instead of update
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => send.status(400).send('Unable to get entries'));
}

module.exports = {
    handleImagePut,
    handleApiCall
}