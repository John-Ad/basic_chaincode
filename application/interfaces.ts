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

export enum TRAN_TYPES {
    TRAN_SALE = "TRAN_SALE",
    TRAN_REFUND = "TRAN_REFUND"
}

export enum SALE_STAGES {
    SALE_STAGE_AWAIT_PAYMENT = "AWAIT_PAYMENT",
    SALE_STAGE_PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
    SALE_STAGE_PACKAGING = "PACKAGING",
    SALE_STAGE_HANDED_OFF_TO_COURIER = "HANDED_OFF_TO_COURIER",
    SALE_STAGE_SHIPPING = "SHIPPING",
    SALE_STAGE_DELIVERED = "DELIVERED"
}

export enum CC_FUNCS {
    INIT_LEDGER = "InitLedger",
    FRAME_EXISTS = "FrameExists",
    TRAN_EXISTS = "TransactionExists",
    GET_FRAME = "GetFrame",
    GET_TRAN = "GetTransaction",
    ADD_FRAME = "AddFrame",
    ADD_TRAN = "AddTransaction",
    UPDATE_FRAME = "UpdateFrame",
    UPDATE_TRAN = "UpdateTransaction",
    GET_ALL_FRAMES = "GetAllFrames",
    GET_ALL_TRANS = "GetAllTransactions"
}
