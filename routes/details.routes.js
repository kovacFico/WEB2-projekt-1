const express = require('express');
const router = express.Router();
const db = require('../db');
const { requiresAuth } = require('express-openid-connect');


router.get('/:uuid', requiresAuth(), async function (req, res, next) {
    if (req.oidc && req.oidc.isAuthenticated()) {
        username = req.oidc.user.name;
    } else {
        res.redirect('/')
    }
    
    var uuid = req.params['uuid'] 
    const sqlTicketDetails = `SELECT * FROM gen_tickets JOIN events ON events.id = gen_tickets.eventId WHERE uuid = '` + uuid + `';`;
    const sqlTickets = `SELECT COUNT(*) FROM gen_tickets;`;
    
    try {
        const resultTicketDetails = (await db.query(sqlTicketDetails, [])).rows;
        const resultTickets = (await db.query(sqlTickets, [])).rows;
        console.log(resultTicketDetails)
        res.render("details", {
            title: 'Details',
            details: resultTicketDetails[0],
            tickets: resultTickets[0].count,
            user_name: username,
        });
    } catch (err) {
        console.log(err);
        res.type('text/plain');
        res.status(500);
        res.send('500 Server Error');
    }
});

module.exports = router;