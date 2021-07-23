import Axios, { AxiosResponse } from "axios";

export const ERROR: string = "ERROR";

export enum GET_REQ_TYPES {
    GET_FRAME = `http://localhost:8081/parts/get/frame/`,
    GET_TRAN = `http://localhost:8081/transactions/get/`,
}

export enum POST_REQ_TYPES {
    ADD_FRAME = `http://localhost:8081/parts/add/frame/`,
    ADD_TRAN = `http://localhost:8081/transactions/add/`
}

export interface IFrame {
    id: string,
    size: number,
    color: string,
    price: number
}

export interface ITransaction {
    txID: string,
    buyer: string,
    stage: string,
    items: IFrame[],
    numOfItems: number,
    amount: number
}

class Connection {
    constructor() {
        //this.test();
    }

    // for testing purposes
    test = async () => {
        let resp = await Axios.get(`http://localhost:8081/parts/frame/${JSON.stringify("hello")}`);
        console.log(resp.data);
    }
    //#####################################

    // handle get requests
    getReq = async (reqType: GET_REQ_TYPES, data: any): Promise<any> => {
        let resp = await Axios.get(reqType + `${JSON.stringify(data)}`);
        console.log(resp.data);
        return resp.data;
    }

    // handle post requests
    postReq = async (reqType: POST_REQ_TYPES, data: any): Promise<any> => {
        let resp = await Axios.post(reqType + `${JSON.stringify(data)}`, {});
        console.log(resp.data);
        return resp.data;
    }
}

export default Connection;
