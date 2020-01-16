const ethers = require("ethers")
const Notary = require("@shareandcharge/ocn-notary").default

const notary = new Notary()
const privkey = ethers.Wallet.createRandom().privateKey


async function getSignature() {
    await notary.sign({
        headers: {
            // paste Postman headers here
            "x-correlation-id": "1",
            "ocpi-from-country-code": "DE",
            "ocpi-from-party-id": "MSP",
            "ocpi-to-country-code": "NL",
            "ocpi-to-party-id": "CPX"
        },
        params: {
            // paste Postman parameters here
        },
        body: {
            // paste Postman body here
            "response_url": "http://localhost:3002/ocpi/emsp/2.2/commands/START_SESSION/1",
            "token": {
                "country_code": "DE",
                "party_id": "MSP",
                "uid": "0102030405",
                "type": "APP_USER",
                "contract_id": "XX-12345",
                "issuer": "Test MSP",
                "valid": true,
                "whitelist": "ALWAYS",
                "last_updated": "2019-08-13T14:44:25.561Z"
            },
            "location_id": "LOC1"
        }
    }, privkey)
    return notary.serialize()
}

getSignature().then(console.log).catch(console.error)