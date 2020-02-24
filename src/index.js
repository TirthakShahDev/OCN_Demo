const fetch = require("node-fetch")
const ethers = require("ethers")
const Registry = require("@shareandcharge/ocn-registry").Registry
const CpoBackend = require("./cpo-backend")
const mspBackend = require("./msp-backend")

const SPENDER = "0x1c3e5453c0f9aa74a8eb0216310b2b013f017813a648fce364bf41dbc0b37647"

const nodes = [
    {
        privateKey: "0x1c3e5453c0f9aa74a8eb0216310b2b013f017813a648fce364bf41dbc0b37647",
        domain: "http://localhost:8080",
    },
    {
        privateKey: "0x0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1",
        domain: "http://localhost:8081"
    }
]

const cpoInfo = [
    {
        partyID: "CPO",
        countryCode: "DE",
        roles: [1],
        operator: "0x9bC1169Ca09555bf2721A5C9eC6D69c8073bfeB4",
        node: "http://localhost:8080",
        backendPort: "3100"
    },
    {
        partyID: "CPX",
        countryCode: "NL",
        roles: [1],
        operator: "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef",
        node: "http://localhost:8081",
        backendPort: "3101"
    }
]


async function main() {

    const registry = new Registry("local", SPENDER)

    /**
     * Register OCN Node Operator(s)
     */
    for (const node of nodes) {
        const wallet = new ethers.Wallet(node.privateKey)
        const exists = await registry.getNode(wallet.address)
        if (!exists) {
            await registry.setNodeRaw(node.domain, node.privateKey)
        }
    }
    

    /**
     * Setup each of the CPOs
     */

    for (cpo of cpoInfo) {

        /**
         * Start the specific CPO backend
         */
        const cpoBackend = new CpoBackend(cpo)
        await cpoBackend.start()

        /**
         * Register to OCN Registry (if not already)
         */

        const party = await registry.getPartyByOcpi(cpo.countryCode, cpo.partyID)

        if (!party || party.node.url === "") {

            /**
             * Register to OCN Registry
             */

            // add party to registry
            const key = ethers.Wallet.createRandom().privateKey
            await registry.setPartyRaw(cpo.countryCode, cpo.partyID, cpo.roles, cpo.operator, key)

            console.log(`CPO [${cpo.countryCode} ${cpo.partyID}] written into OCN Registry with OCN node ${cpo.node}`)
        } else {
            console.log(`CPO [${cpo.countryCode} ${cpo.partyID}] has already registered to OCN Registry. Skipping...`)
        }

        /**
         * Register CPO to OCN Node (if not already)
         */

        const regCheckRes = await fetch(`${cpo.node}/admin/connection-status/${cpo.countryCode}/${cpo.partyID}`, {
            headers: {
                "Authorization": "Token randomkey"
            }
        })

        const regCheckText = await regCheckRes.text()

        if (regCheckRes.status !== 200 || regCheckText !== "CONNECTED") {


            /**
             * Request TOKEN_A via OCN Node admin panel 
             */

            const adminRes = await fetch(`${cpo.node}/admin/generate-registration-token`, {
                method: "POST",
                headers: {
                    "Authorization": "Token randomkey",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([{country_code: cpo.countryCode, party_id: cpo.partyID}])
            })

            const adminBody = await adminRes.json()

            /**
             * Get list of OCPI versions supported by OCN Node
             */

            const versionRes = await fetch(adminBody.versions, {
                headers: {
                    "Authorization": `Token ${adminBody.token}`
                }
            })

            const versionBody = await versionRes.json()

            /**
             * Get and store v2.2 endpoints of OCPI module interfaces supported by OCN Node
             */

            const versionDetailRes = await fetch(versionBody.data.find(v => v.version === "2.2").url, {
                headers: {
                    "Authorization": `Token ${adminBody.token}`
                }
            })

            const versionDetailBody = await versionDetailRes.json()
            cpoBackend.nodeEndpoints = versionDetailBody.data.endpoints

            /**
             * Register to OCN Node using OCPI credentials module
             */

            const regRes = await fetch(`${cpo.node}/ocpi/2.2/credentials`, {
                method: "POST",
                headers: {
                    "Authorization": `Token ${adminBody.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: CpoBackend.TOKEN_B,
                    url: `http://localhost:${cpo.backendPort}/ocpi/versions`,
                    roles: [{
                        party_id: cpo.partyID,
                        country_code: cpo.countryCode,
                        role: "CPO",
                        business_details: {
                            name: "Test CPO"
                        }
                    }]
                })
            })

            const regBody = await regRes.json()
            cpoBackend.saveTokenC(regBody.data.token)

            console.log(`CPO [${cpo.countryCode} ${cpo.partyID}] completed OCPI connection with OCN node at ${cpo.node}`)
        } else {
            console.log(`CPO [${cpo.countryCode} ${cpo.partyID}] has already connected to OCN node at ${cpo.node}. Skipping...`)
        }

    }

    /**
     * Run the EMSP backend which will provide the version endpoints for the OCN Node during the credentials handshake/registration
     */

    await mspBackend.start()
    console.log("MSP [DE MSP] listening on 3002")

    /**
     * Check MSP connection/registration status
     */
    const msp = await registry.getPartyByOcpi("DE", "MSP")

    const mspRegCheck = await fetch("http://localhost:8080/admin/connection-status/DE/MSP", {
        headers: {
            "Authorization": "Token randomkey"
        }
    })

    const mspRegCheckText = await mspRegCheck.text()

    console.log(`MSP [DE MSP] connection status: [${(msp && msp.node.url !== "") ? "x" : " "}] OCN Registry [${mspRegCheckText === "CONNECTED" ? "x" : " "}] OCN Node`)

}

main()
