
		
		/* 

a temporary file to test endpoints

*/

import express from 'express';
import Pizza from '../models/pizza.js';
import Tracker from '../models/tracker.js';
import Form from '../models/Form.js';
import { checkTracker } from '../utils/';

const router = express.Router();
/* GET home page. */


router.get('/', (req, res) => {
  res.json({
      success: true,
      msg: 'You have reached the home page of the Analytics Server!'
  })
});


module.exports = router;