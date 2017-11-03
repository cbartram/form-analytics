		/* 
aroute for the pizza controlls

*/

import express from 'express';
import Pizza from '../models/pizza.js';
import Tracker from '../models/tracker.js';
import Form from '../models/Form.js';
import { checkTracker } from '../utils/';

const router = express.Router();
/* GET home page. */


router.get('/test', (req, res) => {
  Form.find({namespace: "pizzaForm"}, (err, data) => {
      console.log(data);
  });

   res.json({value: true});
});

// Pizza routes, used for the demo page
router.post('/makePizza', async (req, res) => {
	try {
		const pizza = await Pizza.createAsync(req.body);

	  res.send({
	  	success: true,
	  	data: pizza
	  });
	} catch (err) {
		res.status(500).send('Something broke!')
	}

});/* GET home page. */


// endpoint for getting suggestions
router.get('/getSuggestions', async (req, res) => {
	const highestRated = {};
	await Promise.all(['meat', 'veggies'].map(async (e) => {
		const ranking = await checkTracker('pizza', e, res);
		if (typeof ranking === 'string') {
			return res.status(500).send(ranking)
		}
		highestRated[e] = ranking;
	}));

	res.send(highestRated);
});


module.exports = router;