const fetch = require("node-fetch")
const ethers = require("ethers")
const signer = require("../src/lib/signer")
const utils = require("../src/lib/utils")

async function main() {

    // this wallet will send the transaction (it doesn't need to be the same as the CPO which signs the data)
    const provider = new ethers.providers.JsonRpcProvider("http://18.184.14.37:8545")
    let wallet = ethers.Wallet.fromMnemonic("candy maple cake sugar pudding cream honey rich smooth crumble sweet treat")
    wallet = wallet.connect(provider)
    
    // load the OCN Registry contract using its address and ABI
    const contract = new ethers.Contract("0x9d5644f31ea3b0524051318133eBf8A0D82EE6E9", require("../src/registry.json"), wallet)
    
    const mpsWallet = ethers.Wallet.createRandom()

    // sign the transaction data with the CPO's wallet (in this case randomly created)
    // const data = await signer.sign(utils.toHex("DE"), utils.toHex("CPO"), nodeInfoBody.url, nodeInfoBody.address, mpsWallet)
    // const tx = await contract.register(...data)
    
    // await tx.wait()
    
    // console.log("EMSP [DE MSP] has registered to the OCN on node http://localhost:8080 using wallet with address", mpsWallet.address)

    const url = await contract.nodeURLOf(utils.toHex("DE"), utils.toHex("MSP"))

    console.log("url:", url)

    const addr = await contract.nodeAddressOf(utils.toHex("DE"), utils.toHex("MSP"))

    console.log("addr:", addr)

}

main()
