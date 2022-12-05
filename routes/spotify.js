const express = require("express");
const router = express.Router();
const querystring = require('node:querystring');
const axios = require('axios');

const client_id = process.env.CLIENT_ID;
const redirect_uri = "http://localhost:3000/spotify/callback";
const client_secret = process.env.CLIENT_SECRET;

router.get("/", (req, res)=> {
	console.log(process.env.CLIENT_ID);
	let scope = 'user-top-read playlist-read-private';
	let state = generateString(12);
	//TODO: add state later for increased security
	res.redirect('https://accounts.spotify.com/authorize?' +
	querystring.stringify({
		response_type: 'code',
		client_id: client_id,
		scope: scope,
		redirect_uri:redirect_uri,
		state: state
	}));
	console.log("spotify root")
});

router.get("/callback", (req, res) => {
	let code = req.query.code || null;
	let state = req.query.state || null;
	console.log("callback")

	if (state === null) {
		res.redirect('/error' + querystring.stringify({
			error: 'state_mismatch'
		}));
	} else {
		let tokenHeaders = new Headers();
		tokenHeaders.append('Authorization','Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')));
		let tokenUrl = 'https://accounts.spotify.com/api/token'
		let tokenBody = new URLSearchParams();
		tokenBody.append('code', code);
		tokenBody.append('redirect_uri', redirect_uri);
		tokenBody.append('grant_type', 'authorization_code');

		fetch(tokenUrl, {
			method: 'POST',
			headers: tokenHeaders,
			body: tokenBody
		})
		.then((response) => (response.json()))
		.then((data)=>topSongs(data.access_token));	
	}
});

//HELPER FUNCTIONS
function topSongs(code) {
	let itemUrl = "https://api.spotify.com/v1/me/top/tracks";
	let itemHeaders = new Headers();
	itemHeaders.append('Authorization', "Bearer " + code);
	let itemBody = new URLSearchParams();
	itemBody.append('limit', 5);

	fetch(itemUrl, {
		method: "GET",
		headers: itemHeaders
	})
	.then((response) => (response.json()))
	.then((data)=> console.log(data));
}

function generateString(length) {
	const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = router;
