# OCN Demo

Contains mock eMobility Service Provider (eMSP) and Charge Point Operator (CPO) servers for use in developing connections
to an OCN Node.

The servers are designed to be used with the [OCN Node tutorial](https://bitbucket.org/shareandcharge/ocn-node/src/develop/examples/).

To start the servers:

```
npm install
npm start
```

This will start an EMSP server which implements the OCPI `cdrs` (receiver) and `commands` (sender) module interfaces, as well as two 
identical CPO servers which implement `locations` (sender), `tariffs` (sender) and `commands` (receiver) interfaces. On startup a CPO, with
country code `DE` and party ID `CPO`, will attempt to connect to an OCN node on `http://localhost:8080` (if not already) and another, 
with country code `NL` and party ID `CPX`, on `http://localhost:8081`.


To register the MSP used in the tutorial (with country code "DE" and party ID "MSP"):

```
npm run register-msp
```
