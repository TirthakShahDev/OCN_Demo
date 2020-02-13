/*
    Copyright 2019-2020 eMobilify GmbH

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
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