const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'c1ae2c3469ea4281be18f2634e72d0f0'
});

const handleApiCall = (req, res) => {
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)	
	.then(data => {
		res.json(data);
	})
	.catch(err => res.status(400).json("unable to work with api"))
}

const handleImage = (req, res, db) => {
	const {id} = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('unable to get entires'))

}

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
}