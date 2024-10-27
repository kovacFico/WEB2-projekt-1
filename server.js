const express = require('express')
const app = express()
const path = require('path')
const { auth } = require('express-openid-connect')


const homeRouter = require('./routes/home.routes');
const eventsRouter = require('./routes/events.routes');
const qrcodeRouter = require('./routes/qrcode.routes');
const detailsRouter = require('./routes/details.routes');


const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 3000;
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: `${process.env.MY_SECRET}`,
    baseURL: externalUrl || `http://localhost:${port}`,
    clientID: `${process.env.CLIENT_ID_AUTR}`,
    issuerBaseURL:  `https://${process.env.AUTH0_DOMAIN}`,
    clientSecret: `${process.env.CLIENT_SECRET_AUTR}`,
    authorizationParams: {
        response_type: 'code'
    },
};


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(auth(config))


app.use('/', homeRouter);
app.use('/events', eventsRouter);
app.use('/qrcode', qrcodeRouter);
app.use('/', detailsRouter);


if (externalUrl) {
    const hostname = '0.0.0.0';
    app.listen(port, hostname, () => {
        console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`);
    });
} else {
    app.listen(port, function () {
        console.log(`Server running at https://localhost:${port}/`);
    });
}

