const express = require('express');
const router = express.Router();
const QRCode = require('qrcode')
const db = require('../db');
const { randomUUID } = require('crypto');


router.get('/', async function (req, res) {
    const sqlTickets = `SELECT COUNT(*) FROM gen_tickets;`;

    try {
        const resultTickets = (await db.query(sqlTickets, [])).rows;

        res.render("qrcode", {
            title: 'QRcode',
            tickets: resultTickets[0].count,
            qrcode: undefined,
            err: undefined,
            user_name: undefined,
        });

    } catch (err) {
        console.log(err);
        res.type('text/plain');
        res.status(500);
        res.send('500 Server Error');
    }
});

router.post('/', async function (req, res) {
    const sqlTickets = `SELECT COUNT(*) FROM gen_tickets;`;
    const sqlTicketsPerVatin = `SELECT COUNT(*) FROM gen_tickets WHERE vatin = ` + req.body.user[2] + `;`;

    var date = new Date(Date.now()).toISOString().replace('T', ' ')
    

    try {
        const resultTicketsPerVatin = (await db.query(sqlTicketsPerVatin, [])).rows;
        if (req.body.user.includes('')) {
            const resultTickets = (await db.query(sqlTickets, [])).rows;
            error = '400 Bad Request: Missing informations about ticket'
            res.render("qrcode", {
                title: 'QRcode',
                tickets: resultTickets[0].count,
                qrcode: undefined,
                err: error,
                user_name: undefined,
            });
        } else if (resultTicketsPerVatin[0].count > 2) {
            const resultTickets = (await db.query(sqlTickets, [])).rows;
            error = '400 Bad Request: User can generate maximum of 3 tickets'
            res.render("qrcode", {
                title: 'QRcode',
                tickets: resultTickets[0].count,
                qrcode: undefined,
                err: error,
                user_name: undefined,
            });
        } else {
            let uuid = randomUUID()
            console.log(req.body)
            const sqlGenTickets = `INSERT INTO gen_tickets (
                uuid, vatin, firstName , lastName, created_at, eventId) VALUES ('` 
                + uuid + `', ` 
                + req.body.user[2] + `, '` 
                + req.body.user[0] + `', '`  
                + req.body.user[1] + `', '` 
                + date + `', `
                + req.body.event_id + `);`
            console.log(sqlGenTickets)
            const resultGenTickets = (await db.query(sqlGenTickets, [])).rows;
            const resultTickets = (await db.query(sqlTickets, [])).rows;
            const externalUrl = process.env.RENDER_EXTERNAL_URL;
            if (externalUrl) {
                var qrcode = await QRCode.toDataURL(externalUrl + uuid)
            } else {
                var qrcode = await QRCode.toDataURL(`http://localhost:${port}` + uuid)
            }
            console.log(uuid)
            
            res.render("qrcode", {
                title: 'QRcode',
                tickets: resultTickets[0].count,
                qrcode: qrcode,
                err: undefined,
                user_name: undefined,
            });
        }
    } catch (err) {
        console.log(err);
        res.type('text/plain');
        res.status(500);
        res.send('500 Server Error');
    }
});

module.exports = router;