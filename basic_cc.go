package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

// consts for composite key
const (
	CK_PART = "PART"
	CK_TRAN = "TRAN"
)

// consts for parts
const (
	PART_FRAME = "FRAME"
)

//	consts for tran types
const (
	TRAN_SALE   = "TRAN_SALE"
	TRAN_REFUND = "TRAN_REFUND"
)

//	consts for transaction stages
const (
	SALE_STAGE_AWAIT_PAYMENT         = "AWAIT_PAYMENT"
	SALE_STAGE_PAYMENT_RECEIVED      = "PAYMENT_RECEIVED"
	SALE_STAGE_PACKAGING             = "PACKAGING"
	SALE_STAGE_HANDED_OFF_TO_COURIER = "HANDED_OFF_TO_COURIER"
	SALE_STAGE_SHIPPING              = "SHIPPING"
	SALE_STAGE_DELIVERED             = "DELIVERED"
)

// frame object definition
type Frame struct {
	ID    string  `json:"id"`
	Size  float32 `json:"size"`
	Color string  `json:"color"`
	Price float64 `json:"price"`
}

// transaction object definition
type Transaction struct {
	TxID       string  `json:"txID"`
	Buyer      string  `json:"Buyer"`
	Stage      string  `json:"stage"`
	Items      []Frame `json:"items"`
	NumOfItems int     `json:"numOfItems"`
	Amount     float64 `json:"amount"`
}

// init function
func (smartContr *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	//#################################################
	//##### 		add frames to ledger			###
	//#################################################
	// initial frames available
	frames := []Frame{
		{
			ID:    "FIEND_GR",
			Size:  20.75,
			Color: "Transluscent green",
			Price: 299.99,
		},
		{
			ID:    "SUNDAY_NS",
			Size:  21,
			Color: "Blue",
			Price: 319.99,
		},
	}

	// add frames to world state
	for _, frame := range frames {
		//create comp key
		key, err := ctx.GetStub().CreateCompositeKey(CK_PART, []string{PART_FRAME, frame.ID})
		if err != nil {
			return err
		}

		frameJSON, err := json.Marshal(frame)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(key, frameJSON)
		if err != nil {
			return fmt.Errorf("failed to initialize world state")
		}
	}
	//##############	END OF FRAME INIT	######################

	//#################################################
	//##### 	add transactions to ledger			###
	//#################################################
	// initial transactions available
	transactions := []Transaction{
		{
			TxID:       "1",
			Buyer:      "John Adriaans",
			Stage:      SALE_STAGE_DELIVERED,
			Items:      []Frame{frames[0]},
			NumOfItems: 1,
			Amount:     frames[0].Price,
		},
		{
			TxID:       "2",
			Buyer:      "John Adriaans",
			Stage:      SALE_STAGE_DELIVERED,
			Items:      []Frame{frames[1]},
			NumOfItems: 1,
			Amount:     frames[1].Price,
		},
	}

	// add frames to world state
	for _, transaction := range transactions {
		//create comp key
		key, err := ctx.GetStub().CreateCompositeKey(CK_TRAN, []string{TRAN_SALE, transaction.TxID})
		if err != nil {
			return err
		}

		transactionJSON, err := json.Marshal(transaction)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(key, transactionJSON)
		if err != nil {
			return fmt.Errorf("failed to initialize world state")
		}
	}
	//##############	END OF TRAN INIT	######################

	return nil
}

//###################################################################
//#####		...Exists functions									  ###
//###################################################################

//	check if frame exists
func (smartContr *SmartContract) FrameExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	key, err := ctx.GetStub().CreateCompositeKey(CK_PART, []string{PART_FRAME, id})
	if err != nil {
		return false, err
	}

	frameJSON, err := ctx.GetStub().GetState(key)
	if err != nil {
		return false, err
	}

	return frameJSON != nil, nil
}

//	check if transaction exists
func (smartContr *SmartContract) TransactionExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	key, err := ctx.GetStub().CreateCompositeKey(CK_TRAN, []string{TRAN_SALE, id})
	if err != nil {
		return false, err
	}

	tranJSON, err := ctx.GetStub().GetState(key)
	if err != nil {
		return false, err
	}

	return tranJSON != nil, nil
}

//########  End of ...Exists functions  #############################

//###################################################################
//#####		read functions      								  ###
//###################################################################

//	get frame
func (smartContr *SmartContract) GetFrame(ctx contractapi.TransactionContextInterface, id string) (*Frame, error) {
	key, err := ctx.GetStub().CreateCompositeKey(CK_PART, []string{PART_FRAME, id})
	if err != nil {
		return nil, err
	}

	frameJSON, err := ctx.GetStub().GetState(key)
	if err != nil {
		return nil, err
	}

	var frame Frame
	err = json.Unmarshal(frameJSON, &frame)
	if err != nil {
		return nil, err
	}

	return &frame, nil
}

//	get transaction
func (smartContr *SmartContract) GetTransaction(ctx contractapi.TransactionContextInterface, id string) (*Transaction, error) {
	key, err := ctx.GetStub().CreateCompositeKey(CK_TRAN, []string{TRAN_SALE, id})
	if err != nil {
		return nil, err
	}

	tranJSON, err := ctx.GetStub().GetState(key)
	if err != nil {
		return nil, err
	}

	var transaction Transaction
	err = json.Unmarshal(tranJSON, &transaction)
	if err != nil {
		return nil, err
	}

	return &transaction, nil
}

//########  End of read functions  		#############################

//###################################################################
//#####		add functions      									  ###
//###################################################################
//	add new frame
func (smartContr *SmartContract) AddFrame(ctx contractapi.TransactionContextInterface, id string, size float32, color string, price float64) error {
	exists, err := smartContr.FrameExists(ctx, id)
	if err != nil {
		return err
	}

	if exists {
		return fmt.Errorf("frame %s already exists", id)
	}

	key, err := ctx.GetStub().CreateCompositeKey(CK_PART, []string{PART_FRAME, id})
	if err != nil {
		return err
	}

	frame := Frame{
		ID:    id,
		Size:  size,
		Color: color,
		Price: price,
	}

	frameJSON, err := json.Marshal(frame)
	if err != nil {
		return err
	}

	if frameJSON == nil {
		return fmt.Errorf("frame does not exist")
	}

	return ctx.GetStub().PutState(key, frameJSON)
}

//	add new transaction
func (smartContr *SmartContract) AddTransaction(ctx contractapi.TransactionContextInterface, id string, buyer string, stage string, items []string, numOfItems int, tranType string) error {
	exists, err := smartContr.TransactionExists(ctx, id)
	if err != nil {
		return err
	}

	if exists {
		return fmt.Errorf("transaction %s already exists", id)
	}

	key, err := ctx.GetStub().CreateCompositeKey(CK_TRAN, []string{tranType, id})
	if err != nil {
		return err
	}

	var frames []Frame
	var amount float64
	for _, item := range items {
		frame, err := smartContr.GetFrame(ctx, item)
		if err != nil {
			return fmt.Errorf("failed to add transaction due to an issue with the items selected: %s", err)
		}

		frames = append(frames, *frame)
		amount += frame.Price
	}

	transaction := Transaction{
		TxID:       id,
		Buyer:      buyer,
		Stage:      stage,
		Items:      frames,
		NumOfItems: numOfItems,
		Amount:     amount,
	}

	tranJSON, err := json.Marshal(transaction)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(key, tranJSON)
}

//########  End of add functions  		#############################

//###################################################################
//#####		update functions  									  ###
//###################################################################
//	update frame
func (smartContr *SmartContract) UpdateFrame(ctx contractapi.TransactionContextInterface, id string, size float32, color string, price float64) error {
	exists, err := smartContr.FrameExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("cannot update frame, frame does not exist")
	}

	key, err := ctx.GetStub().CreateCompositeKey(CK_PART, []string{PART_FRAME, id})
	if err != nil {
		return err
	}

	frame := Frame{
		ID:    id,
		Size:  size,
		Color: color,
		Price: price,
	}

	frameJSON, err := json.Marshal(frame)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(key, frameJSON)
}

//	update transaction stage
func (smartContr *SmartContract) UpdateTransaction(ctx contractapi.TransactionContextInterface, id string, stage string) error {
	exists, err := smartContr.TransactionExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("cant update transaction, transaction does not exist")
	}

	key, err := ctx.GetStub().CreateCompositeKey(CK_TRAN, []string{TRAN_SALE, id})
	if err != nil {
		return err
	}

	var transaction *Transaction

	transactionJSON, err := ctx.GetStub().GetState(key)
	if err != nil {
		return err
	}

	err = json.Unmarshal(transactionJSON, transaction)
	if err != nil {
		return err
	}

	switch transaction.Stage {
	case SALE_STAGE_AWAIT_PAYMENT:
		if stage != SALE_STAGE_PAYMENT_RECEIVED {
			return fmt.Errorf("current stage is: %s. The next stage must be: %s", SALE_STAGE_AWAIT_PAYMENT, SALE_STAGE_PAYMENT_RECEIVED)
		}
	case SALE_STAGE_PAYMENT_RECEIVED:
		if stage != SALE_STAGE_PACKAGING {
			return fmt.Errorf("current stage is: %s. The next stage must be: %s", SALE_STAGE_PAYMENT_RECEIVED, SALE_STAGE_PACKAGING)
		}
	case SALE_STAGE_PACKAGING:
		if stage != SALE_STAGE_HANDED_OFF_TO_COURIER {
			return fmt.Errorf("current stage is: %s. The next stage must be: %s", SALE_STAGE_PACKAGING, SALE_STAGE_HANDED_OFF_TO_COURIER)
		}
	case SALE_STAGE_HANDED_OFF_TO_COURIER:
		if stage != SALE_STAGE_SHIPPING {
			return fmt.Errorf("current stage is: %s. The next stage must be: %s", SALE_STAGE_HANDED_OFF_TO_COURIER, SALE_STAGE_SHIPPING)
		}
	case SALE_STAGE_SHIPPING:
		if stage != SALE_STAGE_DELIVERED {
			return fmt.Errorf("current stage is: %s. The next stage must be: %s", SALE_STAGE_SHIPPING, SALE_STAGE_DELIVERED)
		}
	case SALE_STAGE_DELIVERED:
		return fmt.Errorf("order already delivered, cannot update stage")
	default:
		return fmt.Errorf("an issue occured: the transaction has no stage set")
	}

	transaction.Stage = stage

	transactionJSON, err = json.Marshal(transaction)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(key, transactionJSON)
}

//###################################################################
//#####		getAll functions  									  ###
//###################################################################
//	retrieve all transactions
func (smartContr *SmartContract) GetAllTransactions(ctx contractapi.TransactionContextInterface) ([]*Transaction, error) {
	tranIter, err := ctx.GetStub().GetStateByPartialCompositeKey(CK_TRAN, nil)
	if err != nil {
		return nil, err
	}
	defer tranIter.Close()

	if !tranIter.HasNext() {
		return nil, fmt.Errorf("no transactions have been found")
	}

	var transactions []*Transaction
	var transaction Transaction
	for tranIter.HasNext() {
		tranVal, err := tranIter.Next()
		if err != nil {
			return nil, err
		}

		json.Unmarshal(tranVal.Value, &transaction)
		transactions = append(transactions, &transaction)
	}

	return transactions, nil
}

//	retrieve all frames
func (smartContr *SmartContract) GetAllFrames(ctx contractapi.TransactionContextInterface) ([]*Frame, error) {
	frameIter, err := ctx.GetStub().GetStateByPartialCompositeKey(CK_PART, []string{PART_FRAME})
	if err != nil {
		return nil, err
	}
	defer frameIter.Close()

	if !frameIter.HasNext() {
		return nil, fmt.Errorf("no frames have been found")
	}

	var frames []*Frame
	var frame Frame
	for frameIter.HasNext() {
		frameVal, err := frameIter.Next()
		if err != nil {
			return nil, err
		}

		json.Unmarshal(frameVal.Value, &frame)
		frames = append(frames, &frame)
	}

	return frames, nil
}

//########  End of getAll functions		#############################

func main() {
	assetChaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		log.Panicf("error creating basic_cc chaincode: %v", err)
	}

	if err := assetChaincode.Start(); err != nil {
		log.Panicf("Error starting asset-transfer-basic chaincode: %v", err)
	}
}
