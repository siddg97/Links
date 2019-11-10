require('dotenv').config();
const express = require('express');
const passport = require('passport');

// Initialize router
const router = express.Router();

// load validator

const verifyBugData = require('../validators/bug.js');

// load Bug model
const Bug = require('../models/bug.js');



// ###############################
// ###############################
// ###    GET BUGS ENDPOINT    ###
// ### + Method = GET          ###
// ### + Desc = get all bugs   ###
// ### + Access = protected    ###
// ###############################
// ###############################
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
	await Bug.find({openedBy:req.user.id})
		.then(bugs => res.send(bugs))
		.catch(err => {
			console.log(err)
		});
});



// ###############################
// ###############################
// ###    ADD BUG ENDPOINT     ###
// ### + Method = POST         ###
// ### + Desc = open new bug   ###
// ### + Access = protected    ###
// ###############################
// ###############################
router.post('/', passport.authenticate('jwt', { session: false }), async (req,res) => {

	const { errors, isValid } = verifyBugData(req.body);

	// check the validator output
	if(!isValid){
		return res.status(400).json(errors);
	}

	const newBug = new Bug({
		title: req.body.title,
		openedBy: req.user.id,
		status: req.body.status,
		openedOn: Date.now(),
		description: req.body.description
	});

	newBug.save()
		.then(bug => res.json(bug))
		.catch(err => console.log(err));
})



// ###############################
// ###############################
// ###   DELTE BUG ENDPOINT    ###
// ### + Method = DELETE       ###
// ### + Desc = deleter bug    ###
// ### + Access = protected    ###
// ###############################
// ###############################
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

	Bug.findById(req.params.id)
		.then(bug => {
			bug.remove()
				.then(() => res.json({ success: true }))
		})
		.catch(err => console.log(err));

})

module.exports = router;
