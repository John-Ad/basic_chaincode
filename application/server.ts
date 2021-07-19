import { Gateway, GatewayOptions, Network, Contract } from 'fabric-network'
import * as path from 'path'
import { buildCCPOrg1, buildWallet, prettyJSONString, buildCAClient, enrollAdmin, registerAndEnrollUser } from './utils'

// consts for network initialization
const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

// vars for using network and chaincode
let network: Network;
let contract: Contract;

let initSetup = async () => {
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
        // connect to gateway
        await gateway.connect(ccp, gatewayOpts);

        // build net instance based on channel
        network = await gateway.getNetwork(channelName);
        contract = network.getContract(chaincodeName);

    } catch (err) {
        console.log(err);
    }
}

//################################################################
//###   chaincode invocation functions
//################################################################
async function submitTransaction(functionName: string, args: string[]): Promise<Buffer> {
    try {
        let res = await contract.submitTransaction(functionName, ...args);
        return res;
    } catch (err) {
        console.log(err);
    }
}

let initLedger = async () => {
    let json = await submitTransaction("InitLedger", []);
    console.log(json.toString());
}

let addFrame = async (id: string, size: string, color: string, price: string) => {
    let json = await submitTransaction("AddFrame", [id, size, color, price]);
    console.log(json.toString());
}

let getFrame = async (id: string) => {
    let json = await submitTransaction("GetFrame", [id]);
    console.log(json.toString());
}

let getAllFrames = async () => {
    let json = await submitTransaction("GetAllFrames", []);
    console.log(json.toString());
}

async function main() {
    await initSetup();
    //await initLedger();
    await getAllFrames();
}
main();
