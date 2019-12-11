const fetch = require("node-fetch")
const ethers = require("ethers")
const signer = require("../src/lib/signer")
const utils = require("../src/lib/utils")

fetch("http://localhost:8080/ocn/registry/node-info").then(async nodeInfoRes => {

    const nodeInfoBody = await nodeInfoRes.json()

    // this wallet will send the transaction (it doesn't need to be the same as the CPO which signs the data)
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8544")
    let wallet = ethers.Wallet.fromMnemonic("candy maple cake sugar pudding cream honey rich smooth crumble sweet treat")
    wallet = wallet.connect(provider)
    
    // load the OCN Registry contract using its address and ABI
    const contract = new ethers.Contract("0x345cA3e014Aaf5dcA488057592ee47305D9B3e10", require("../src/registry.json"), wallet)
    
    const mpsWallet = ethers.Wallet.createRandom()

    // sign the transaction data with the CPO's wallet (in this case randomly created)
    const data = await signer.sign(utils.toHex("DE"), utils.toHex("MSP"), nodeInfoBody.url, nodeInfoBody.address, mpsWallet)
    const tx = await contract.register(...data)
    
    await tx.wait()
    
    console.log("EMSP [DE MSP] has registered to the OCN on node http://localhost:8080 using wallet with address", mpsWallet.address)

})
