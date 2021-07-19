import { Wallet, Wallets } from 'fabric-network'
import * as FabricCAServices from 'fabric-ca-client'
import * as fs from 'fs'
import * as path from 'path'

// consts for ca building
const adminUserId = 'admin';
const adminUserPassword = 'adminpw';

// ###############################################################
// ###  ccp and wallet
// ###############################################################
export const buildCCPOrg1 = (): Record<string, any> => {
    // get path where network conf is located
    const ccpPath = path.resolve('..', '..', 'github.com', 'John-Ad', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');

    // check if file exists
    const exists = fs.existsSync(ccpPath);
    if (!exists)
        throw new Error(`no such file exists ${ccpPath}`);

    // load contents in plain text
    const contents = fs.readFileSync(ccpPath, 'utf8');

    // convert to json
    const ccp = JSON.parse(contents);

    console.log(`loaded network conf located at ${ccpPath}`);
    return ccp;
}

export const buildWallet = async (walletPath: string): Promise<Wallet> => {
    // create a new wallet for storing identities
    let wallet: Wallet;
    if (walletPath) {
        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`built a file system wallet at ${walletPath}`);
    } else {
        wallet = await Wallets.newInMemoryWallet();
        console.log(`built an in memory wallet`);
    }
    return wallet;
}
// ########################################################################

export const prettyJSONString = (input: string): string => {
    if (input)
        return JSON.stringify(JSON.parse(input), null, 2);
    else
        return input;
}


// ###############################################################
// ###  ca client and enrollment funcs
// ###############################################################
export const buildCAClient = (ccp: Record<string, any>, caHostName: string): FabricCAServices => {
    // create new ca client for interacting with ca
    const caInfo = ccp.certificateAuthorities[caHostName];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
    console.log(`built a ca client named ${caInfo.caName}`);
    return caClient;
}

export const enrollAdmin = async (caClient: FabricCAServices, wallet: Wallet, orgMspId: string): Promise<void> => {
    try {
        // check if admin already enrolled
        const identity = await wallet.get(adminUserId);
        if (identity) {
            console.log(`admin already enrolled`);
            return;
        }

        // enroll admin user
        const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPassword });
        const x509Id = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes()
            },
            mspId: orgMspId,
            type: 'X.509'
        }
        await wallet.put(adminUserId, x509Id);
        console.log('successfully enrolled admin and stored creds in wallet');
    } catch (err) {
        console.log(err);
    }
}

export const registerAndEnrollUser = async (caClient: FabricCAServices, wallet: Wallet, orgMspId: string, userId: string, affiliation: string): Promise<void> => {
    try {
        // check if user already enrolled
        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
            console.log(`an identity for user already exists in wallet`);
            return;
        }

        // load admin id
        const adminIdentity = await wallet.get(adminUserId);
        if (!adminIdentity) {
            console.log('admin identity does not exist\n\nEnroll admin before retrying');
            return;
        }

        // build user object for authenticating with ca
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

        // register user, enroll user, store identity in wallet 
        const secret = await caClient.register({
            affiliation,
            enrollmentID: userId,
            role: 'client'
        }, adminUser);

        const enrollment = await caClient.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret
        });

        const x509Id = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes()
            },
            mspId: orgMspId,
            type: 'X.509'
        };

        await wallet.put(userId, x509Id);
        console.log('user successfully registered, enrolledy, and stored in wallet');
    } catch (err) {
        console.log(err);
    }
}
// ########################################################################
//
//
//
//
//
//
