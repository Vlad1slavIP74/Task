"use strict";

const Telegraf = require("telegraf");
const Telegram = require("telegraf/telegram");
const mongoose = require("mongoose");
const DBgroup = require("./DBgroup");
const DBuser = require("./DbUser");
const config = require ("./config.json");
const bot = new Telegraf(config.token);
const mongoDB = "mongodb://PerkyRaccon:78a78a98a@ds145923.mlab.com:45923/bot";

let chatId;
let botUsername = "DerbiesBot";

bot.on("new_chat_members", (ctx, next) => {

	chatId = ctx.chat.id;
	if(ctx.message.new_chat_members[0].username === botUsername) {

		bot.telegram.getChat(chatId).then((chatInfo) => {
			mongoose.connect(mongoDB,function (err) {
				if (err) throw err;

				let DataBase = new DBgroup({
					_id: new mongoose.Types.ObjectId(),
					id: chatInfo.id,
					title: chatInfo.title,
					type: chatInfo.type
				});

				DataBase.save(function(err) {
					if (err) throw err;
				});
			});
			// mongoose.disconnect(function (err) {
			// 	if (err) throw err
			// });
		});

		// telegram.getChatMembersCount(chatId).then((Count) => console.log(Count));


		return next(ctx).then(() => bot.telegram.sendMessage(chatId, "HEELLLLL"));
	}
	else {


		mongoose.connect(mongoDB, function (err) {
			if (err) throw err;

			//console.log(ctx.message.new_chat_members);
			let NewUser = ctx.message.new_chat_members[0].first_name;
			NewUser = new DBuser({
				_id: new mongoose.Types.ObjectId(),
				userId: ctx.message.new_chat_members[0].id,
				is_bot: ctx.message.new_chat_members[0].is_bot,
				first_name: ctx.message.new_chat_members[0].first_name,
				last_name: ctx.message.new_chat_members[0].last_name,
				user_name:ctx.message.new_chat_members[0].user_name,
				language_code:ctx.message.new_chat_members[0].language_code,
				Group_id: chatId,
				status: "active"
			});
			console.log("SAVED ABOUT USER");
			NewUser.save(function (err){
				if (err) throw err;
			});

		});


		return next(ctx).then(() =>
		{
			//console.log(ctx.message.new_chat_members);
			//bot.telegram.sendMessage(chatId, "HEELLLLLOOO NEW USER");
		});
	}
});

bot.on ("left_chat_member", (ctx)=>{
	mongoose.connect(mongoDB, function (err) {
		if (err) throw err;
		console.log(ctx.message.from.id);
		DBuser.find({userId:ctx.message.from.id}).exec(function (err, user) {
			if (err) throw err;
			try {
				DBuser.findById(user[0]._id, function (err,DbUser) {
					if (err) throw err;
					console.log("Saved about delete");
					DbUser.status = "inactive";
					DbUser.save(function (err) {
						if (err) throw err;

					});
				});
			}
		 catch (err) {
		  console.log("Smthng go BAD");
			}
		});
	});
});

bot.telegram.getMe().then((botInfo) => {
	console.log(botInfo);
});

bot.use((ctx) => {


	mongoose.connect(mongoDB, function (err) {
		if (err) throw err;
		DBuser.find({userId:ctx.message.from.id}).exec(function (err, user) {
			if (err) throw err;
			try {
				DBuser.findById(user[0]._id, function (err,DbUser) {
					if (err) throw err;
					console.log("Saved");
		      DbUser.message.push(ctx.message.text);
					DbUser.save(function (err) {
						if (err) throw err;

					});
				});
			}
		 catch (err) {
			 console.log("Smthng go BAD");
			}
		});
	});
});


bot.startPolling();
