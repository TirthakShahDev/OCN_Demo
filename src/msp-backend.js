const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan(`EMSP [DE MSP] -- :method :url :status :res[content-length] - :response-time ms`))


function authorize(req, res, next) {
    if (req.headers["authorization"] !== "Token abc-123") {
        return res.status(401).send({
            status_code: 2001,
            timestamp: new Date()
        })
    }
    next()
}


app.get("/ocpi/versions", authorize, async (req, res) => {
    res.send({
        status_code: 1000,
        data: [{
            version: "2.2",
            url: "http://localhost:3002/ocpi/2.2"
        }],
        timestamp: new Date()
    })
})

app.get("/ocpi/2.2", authorize, async (req, res) => {
    res.send({
        status_code: 1000,
        data: {
            version: "2.2",
            endpoints: [
                {
                    "identifier": "cdrs",
                    "role": "RECEIVER",
                    "url": "http://localhost:3002/ocpi/emsp/2.2/cdrs"
                },
                {
                    "identifier": "commands",
                    "role": "SENDER",
                    "url": "http://localhost:3002/ocpi/emsp/2.2/commands"
                }
            ]
        },
        timestamp: new Date()
    })
})

app.post("/ocpi/emsp/2.2/commands/:command/:uid", authorize, async (req, res) => {
    console.log(`EMSP [DE MSP] received async command response: ${JSON.stringify(req.body)}`)
    res.send({
        status_code: 1000,
        timestamp: new Date()
    })
})

let cdr

app.get("/ocpi/emsp/2.2/cdrs/1", authorize, async (req, res) => {
    res.send({
        status_code: 1000,
        data: cdr,
        timestamp: new Date()
    })
})

app.post("/ocpi/emsp/2.2/cdrs", authorize, async (req, res) => {
    cdr = req.body
    res.set({
        "Location": "http://localhost:3002/ocpi/emsp/2.2/cdrs/1"
    }).send({
        status_code: 1000,
        timestamp: new Date()
    })
})

module.exports = {
    start: async () => new Promise((resolve, _) => app.listen("3002", resolve))
}
