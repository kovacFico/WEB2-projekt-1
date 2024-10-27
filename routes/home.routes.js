const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', async function (req, res) {
    const sqlTickets = `SELECT COUNT(*) FROM gen_tickets;`;

    try {
        const resultTickets = (await db.query(sqlTickets, [])).rows;

        res.render('home', {
            title: 'Home',
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