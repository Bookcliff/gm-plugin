//This is required from discord-interactions (package)
const {
	InteractionResponseType,
	InteractionType,
	verifyKey,
  } = require('discord-interactions');
  
//Required package for the request and response streams to and from Vercel.
const getRawBody = require('raw-body');

//This constructs the object "GM".
  
const GM = {
name: 'GM',
description: 'Good morning!',
options: [
	{
	name: 'user',
	description: 'Sending GM',
		//type was originally 6 (I think this is DEFERRED_UPDATE_MESSAGE), but was changed to 4 (CHANNEL_MESSAGE_WITH_SOURCE) since I'm not using components.
	type: 4,
	required: true,
	},
],
};

//This constructs the INVITE_COMMAND object.
  
const INVITE_COMMAND = {
name: 'Invite',
description: 'Get an invite link to add the bot to your server',
};

//Not sure what is supposed to be added to the INVITE_URL object. Will look into further.
  
//   const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${process.env.APPLICATION_ID}&scope=applications.commands`;

//These are the vercel parameters.

/**
 * @param {VercelRequest} request
 * @param {VercelResponse} response
 */

//Function being exported which takes in the Vercel request and subsequent response (I think?).

 module.exports = async (request, response) => {

//If the function is triggered by a request, it generates a POST sent to Vercel with the signature, timestamp, and rawBody(which is the callback for the function - if request returns 200 - returns promise to resolve; if error - throws an error). Signature and timestamp vars are predefined by Discord dev.

	if (request.method === 'POST') {
	  const signature = request.headers['x-signature-ed25519'];
	  const timestamp = request.headers['x-signature-timestamp'];
	  const rawBody = await getRawBody(request);
  
//Requires the above variables along with the public key to validate the request (function in the discord-interactions package).

	  const isValidRequest = verifyKey(
		rawBody,
		signature,
		timestamp,
		process.env.PUBLIC_KEY
	  );

//If the request is not valid, throws an error.
  
	  if (!isValidRequest) {
		console.error('Invalid Request');
		return response.status(401).send({ error: 'Bad request signature ' });
	  }

//Creates the message object in the body of the request (Vercel syntax).
  
	  const message = request.body;

//If the message is a PING, it logs it and returns a PONG.
  
	  if (message.type === InteractionType.PING) {
		console.log('Handling Ping request');
		response.send({
		  type: InteractionResponseType.PONG,
		});

//If the message is an APPLICATION_COMMAND: ==> I think this is where I need to input the bot listening for when a user logs in.
	  } else if (message.type === InteractionType.APPLICATION_COMMAND) {
		switch (message.data.name.toLowerCase()) {

			//sends "GM" if 200 status.
		  case GM.name.toLowerCase():
			response.status(200).send({
			  type: 4,
			  data: {
				content: `*<@${message.member.user.id}>: GM*`,
			  },
			});
			console.log('GM');
			break;

			//sends invite URL if 200 status.
		  case INVITE_COMMAND.name.toLowerCase():
			response.status(200).send({
			  type: 4,
			  data: {
				content: INVITE_URL,
				flags: 64,
			  },
			});
			console.log('Invite request');
			break;

			//sends error if 400 status.
		  default:
			console.error('Unknown Command');
			response.status(400).send({ error: 'Unknown Type' });
			break;
		}

		//if not APPLICATION_COMMAND or PING, sends error (400).
	  } else {
		console.error('Unknown Type');
		response.status(400).send({ error: 'Unknown Type' });
	  }
	}
  };