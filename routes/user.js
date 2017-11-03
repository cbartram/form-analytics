// a placeholder for a user route, if needed
import express from 'express';
import Form from '../models/Form';
import User from '../models/User';

const router = express.Router();

// a mock signup. Not secure.
router.post('/signup', async (req, res) => {
  const newUser = req.body;

  if (newUser) {
    let isUser;
    try {
      isUser = await User.findOneAsync({ userName: newUser.userName });
    } catch (err) {
      return res.status(500).send(`ERROR: error processing user: ${err}`);
    }
    if (isUser) {
      return res.status(409).send(new Error('Username Already Taken'));
    } else {
      let user;
      try {
        user = await User.createAsync(newUser);
      } catch (err) {
        return res.status(500).send(`ERROR: error registering user: ${err}`);
      }
      if (!user) {
        return res.status(500).send(`ERROR: error registering user: User not found`);
      } else {
        res.send(user);
      }
    }

  }
});

// a mock login. Not secure.
router.post('/login', async (req, res) => {
  const loggedUser = req.body;

  if (loggedUser) {
    let isUser;
    try {
      isUser = await User.findOneAsync({ userName: loggedUser.userName });
    } catch (err) {
      return res.status(500).send(`ERROR: error processing user: ${err}`);
    }
    if (!isUser) {
      return res.send({error: 'Invalid Username/combination'});
    } else {
      if (loggedUser.password === isUser.password) {
        let user;
       
        try {
          user = await User.createAsync(newUser);
        } catch (err) {
          return res.status(500).send(`ERROR: error registering user: ${err}`);
        }
        if (!user) {
          return res.status(500).send(`ERROR: error registering user: User not found`);
        } else {
          return res.send(user);
        }
      } else {
        return res.send({error: 'Invalid Username/combination'});
      }

    }

  } else {
    return res.send({error: 'User Not Processed From Form'})
  }
});

module.exports = router;