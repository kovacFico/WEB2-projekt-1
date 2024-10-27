const dotenv = require("dotenv");
const request = require("request");


async function getToken() {
    const options = {
        method: 'POST',
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            client_id: `${process.env.CLIENT_ID_M2M}`,
            client_secret: `${process.env.CLIENT_SECRET_M2M}`,
            audience: `${process.env.AUTH0_AUDIENCE}`,
            grant_type: "client_credentials"
        })
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                return reject(new Error(error));
            }
            
            try {
                const jsonBody = JSON.parse(body);
                console.log(jsonBody.access_token); 
                resolve(jsonBody.access_token);
            } catch (parseError) {
                reject(new Error('Failed to parse response body'));
            }
        });
    });
}

const getHeader = async (req, res, next) => {
    var token = await getToken()
    req.headers["authorization"] =  "Bearer " + token
    console.log(req.headers)
    next()
};


module.exports = {
    getHeader,
};