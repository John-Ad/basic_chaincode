//#########################################################################
//###   server related imports
//#########################################################################
import * as path from 'path'
import * as express from 'express';         // esModInterop causes issues with fabric-ca    // default imports are done this way instead
import { Express, Request, Response, NextFunction } from 'express'

//#########################################################################
//###   fabric related imports
//#########################################################################
import { Gateway, GatewayOptions, Network, Contract } from 'fabric-network'
import { buildCCPOrg1, buildWallet, prettyJSONString, buildCAClient, enrollAdmin, registerAndEnrollUser } from './utils'

//#########################################################################
//###   interface and enum imports
//#########################################################################
import { IFrame, ITransaction, TRAN_TYPES, SALE_STAGES, CC_FUNCS } from './interfaces'

//#########################################################################
//###   fabric network setup
//#########################################################################

// error const
const ERROR: string = "ERROR";

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
        //console.log(ccp);
        // build ca client profile
        const caClient = buildCAClient(ccp, 'ca.org1.example.com');
        //console.log(caClient);
        // setup a wallet to store credentials
        const wallet = await buildWallet(walletPath);
        //console.log(wallet);
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
//################################################################################################################################
//################################################################################################################################


//################################################################
//###   chaincode invocation functions
//################################################################
async function submitTransaction(functionName: string, args: string[]): Promise<Buffer> {
    try {
        let res = await contract.submitTransaction(functionName, ...args);
        return res;
    } catch (err) {
        console.log(err);
        return null;
    }
}

let initLedger = async () => {
    let json = await submitTransaction(CC_FUNCS.INIT_LEDGER, []);
    console.log("Initialized ledger with test values");
    console.log(json.toString());
}

let addFrame = async (args: string[]): Promise<number> => {
    let json = await submitTransaction(CC_FUNCS.ADD_FRAME, args);
    //console.log(json.toString());
    if (json)
        return 0;
    return 1;
}

let getFrame = async (id: string): Promise<string> => {
    let json = await submitTransaction(CC_FUNCS.GET_FRAME, [id]);
    if (json) {
        console.log(json.toString());
        return json.toString();
    }
    return "ERROR";
}

let getAllFrames = async (): Promise<string> => {
    let json = await submitTransaction(CC_FUNCS.GET_ALL_FRAMES, []);
    console.log(json.toString());
    return json.toString();
}

let addTran = async (args: string[]): Promise<number> => {
    let json = await submitTransaction(CC_FUNCS.ADD_TRAN, args);
    //console.log(json.toString());
    if (json)
        return 0;
    return 1;
}

let getTran = async (id: string): Promise<string> => {
    let json = await submitTransaction(CC_FUNCS.GET_TRAN, [id]);
    if (json) {
        console.log(json.toString());
        return json.toString();
    }
    return "ERROR";
}
//################################################################################################################################
//################################################################################################################################


//#########################################################################
//###   server setup and api endpoints
//#########################################################################

const app: Express = express();
app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction) {
    inResponse.header("Access-Control-Allow-Origin", "*");      //allows requests from any domain
    inResponse.header("Access-Control-Allow-Methods", "GET,POST");   //allows these methods
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");   //allows these headers
    inNext();
});
app.listen(8081, 'localhost', () => {
    console.log("Server is running!");
});

// get reqs
app.get("/parts/get/allFrames/", async (req, res) => {      // get all frames
    let result = await getAllFrames();
    res.send(result);
});
app.get("/parts/get/frame/:id", async (req, res) => {       // get specific frame
    console.log(req.params.id);
    let id: string = JSON.parse(req.params.id);
    let result = await getFrame(id);
    console.log(result);
    res.send(result);
});
app.get("/transactions/get/:id", async (req, res) => {       // get specific transaction
    console.log(req.params.id);
    let id: string = JSON.parse(req.params.id);
    let result = await getTran(id);
    console.log(result);
    res.send(result);
});

// post reqs
app.post("/parts/add/frame/:frame", async (req, res) => {   // add new frame
    console.log(req.params.frame);
    let frame: IFrame = JSON.parse(req.params.frame);
    let arr: string[] = [
        frame.id,
        frame.size.toString(),
        frame.color,
        frame.price.toString()
    ];

    let result = await addFrame(arr);
    res.send(result.toString());       // return either 0 for success or 1 for failure
});
app.post("/transactions/add/:tran", async (req, res) => {   // add new transaction
    console.log(req.params.tran);

    let tran: ITransaction = JSON.parse(req.params.tran);
    let items: string[] = [];

    tran.items.forEach((item) => {
        items.push(item.id);
    });

    let arr: string[] = [
        tran.txID,
        tran.buyer,
        JSON.stringify(items),
        tran.numOfItems.toString(),
        TRAN_TYPES.TRAN_SALE
    ];

    let result = await addTran(arr);
    console.log(result);
    res.send(result.toString());
});

//################################################################################################################################
//################################################################################################################################

async function main() {
    await initSetup();
    //await initLedger();
    //await addFrame(["SUBROSA_MR", "20.5", "RED", "229.99"]);
    await getAllFrames();
    await getFrame("SUBROSA_MR");
    console.log("########################### END OF INIT #############################");
    console.log("");
}
main();
