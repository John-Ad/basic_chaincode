import { Gateway, GatewayOptions } from 'fabric-network'
import * as path from 'path'
import { buildCCPOrg1, buildWallet, prettyJSONString, buildCAClient, enrollAdmin, registerAndEnrollUser } from './utils'

// consts
const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

async function main() {
    try {
        //################################################################
        //###   build net conf profile, wallet, register and enroll users
        //################################################################
        // build connection profile
        const ccp = buildCCPOrg1();
        console.log(ccp);
        // build ca client profile
        const caClient = buildCAClient(ccp, 'ca.org1.example.com');
        console.log(caClient);
        // setup a wallet to store credentials
        const wallet = await buildWallet(walletPath);
        console.log(wallet);
        // enroll admin and store creds in wallet
        await enrollAdmin(caClient, wallet, mspOrg1);
        // register and enroll user
        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

        //################################################################
        //###   setup gateway, connect to network, and access chaincode
        //################################################################
        const gateway = new Gateway();
        const gatewayOpts: GatewayOptions = {
            wallet,
            identity: org1UserId,
            discovery: { enabled: true, asLocalhost: true }//network deployed locally
        };

        try {
            // connect to gateway
            await gateway.connect(ccp, gatewayOpts);

            // build net instance based on channel
            const network = await gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);

            // invoke chaincode functions
            console.log('Submitting transaction: InitLedger\nInitializing ledger with some assets');
            let res = await contract.submitTransaction('InitLedger');
            console.log(res.toString());

            console.log('Submitting transaction: GetAllFrames');
            res = await contract.evaluateTransaction('GetAllFrames');
            console.log(res.toString());
        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err)
    }
}

main();
