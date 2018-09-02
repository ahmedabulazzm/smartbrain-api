const handleRegister = (req, res, db, bcrypt) => {
	const {name, email, password} = req.body;
	if(!name || !email || !password){
		return res.status(400).json("Incomplete form submission");
	}
	const hashedPW = bcrypt.hashSync(password); // hashing our pw using bcrypt nodejs

	db.transaction(trx => {
		trx.insert({
			hash: hashedPW,
			email: email
		})
		.into('login') // into login table
		.returning('email') // give back the new e-mail
		.then(loginEmail => { //use the new e-mail as param
			return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
				.then(trx.commit)
				.catch(trx.rollback)
		})
	})
	.catch(err => {
		res.status(400).json("Unable to register");
	})
}

module.exports = {
	handleRegister: handleRegister
}