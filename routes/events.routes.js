const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateAccessToken } = require('./helpers/auth0.middleware');
const { errorHandler } = require('./helpers/error.middleware')
const { getHeader } = require('./helpers/header.middleware')



router.get('/', getHeader, validateAccessToken, errorHandler, async function (req, res) {
    const sqlEvents = `SELECT * FROM events ORDER BY city DESC, when_held, id;`;
    const sqlTickets = `SELECT COUNT(*) FROM gen_tickets;`;

    try {
        const resultEvents = (await db.query(sqlEvents, [])).rows;
        const resultTickets = (await db.query(sqlTickets, [])).rows;

        res.render("events", {
            title: 'Events',
            events: resultEvents,
            tickets: resultTickets[0].count,
            user_name: undefined,
        });
    } catch (err) {
        console.log(err);
        res.type('text/plain');
        res.status(500);
        res.send('500 Server Error');
    }
});


module.exports = router;