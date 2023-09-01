const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())

const rp = require('request-promise');
const ArduinoIotClient = require('@arduino/arduino-iot-client');
let token = "";

async function getAccessToken() {
    const options = {
        method: 'POST',
        url: 'https://api2.arduino.cc/iot/v1/clients/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        json: true,
        form: {
            grant_type: 'client_credentials',
            client_id: '************************************',
            client_secret: '************************************************************************',
            audience: 'https://api2.arduino.cc/iot'
        }
    };

    const response = await rp(options);
    console.log("Access token: " + response['access_token']);
    token = response['access_token'];
}

getAccessToken().then();

async function publish(token, led, state) {
    let defaultClient = ArduinoIotClient.ApiClient.instance;

    // Configure OAuth2 access token for authorization: oauth2
    let oauth2 = defaultClient.authentications['oauth2'];
    oauth2.accessToken = token

    let api = new ArduinoIotClient.PropertiesV2Api()
    let id = "************************************"; // {String} The id of the thing
    let RedLedID = "************************************"
    let BlueLedID = "************************************"
    let GreenLedID = "************************************"

    let propertyValue = {
        value: state
    }; // {PropertyValue}

    // Checking conditions
    if (led === "red") {
        api.propertiesV2Publish(id, RedLedID, propertyValue).then(function() {
            console.log('API called successfully.');
        }, function(error) {
            console.error(error);
        });
    } else if (led === "green") {
        api.propertiesV2Publish(id, GreenLedID, propertyValue).then(function() {
            console.log('API called successfully.');
        }, function(error) {
            console.error(error);
        });
    } else if (led === "blue") {
        api.propertiesV2Publish(id, BlueLedID, propertyValue).then(function() {
            console.log('API called successfully.');
        }, function(error) {
            console.error(error);
        });
    }
}

app.use(express.static('public'));

app.post('/api/handler', (req, res) => {
    console.log(JSON.stringify(req.body))
    console.log("Received Message");
    publish(token, req.body.led, req.body.value).then()
})

app.listen(port, () => {
    console.log('Listening on port 3000');
})

// Using index.html
app.use('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})