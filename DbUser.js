const mongoose = require("mongoose");

let dbSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: Number,
	is_bot: Boolean,
	first_name: String,
	last_name: String,
	user_name: String,
	language_code: String,
	Group_id: Number,
	status: String,
	message: ['']
});

let DBuser = mongoose.model("DBuser", dbSchema);

module.exports = DBuser;
