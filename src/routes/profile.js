const express = require('express');
const authValidate = require('../middlewares/auth');
const User = require('../models/user');

const profileRouter = express.Router();


profileRouter.get('/profile', authValidate ,(req, res)=>{
    res.send(req.user)
})


profileRouter.patch('/profile/edit', async (req, res)=>{
    const { firstName, lastName } = req.body;

    try {
        const user = await User.findByIdAndUpdate(req.user._id, { firstName, lastName }, { new: true });
        res.send(user)
    } catch (err) {
        res.status(500).send(err.message);
    }
})


module.exports = profileRouter;