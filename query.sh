#!/bin/sh

#export PATH=${PWD}/../bin:$PATH
#export FABRIC_CFG_PATH=$PWD/../config/
#
##   test getall functions
#echo "frames: "
#peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllFrames"]}'
#echo "transactions: "
#peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllTransactions"]}'
#
##   test exists functions
#echo "FIEND_GR frame exists: " # should return true
#peer chaincode query -C mychannel -n basic -c '{"Args":["FrameExists","FIEND_GR"]}'
#echo "SUBROSA_MR frame exists: " # should return false
#peer chaincode query -C mychannel -n basic -c '{"Args":["FrameExists","SUBROSA_MR"]}'
#echo "tx 1 exists: " # should return true
#peer chaincode query -C mychannel -n basic -c '{"Args":["TransactionExists","1"]}'
#echo "tx 3 exists: " # should return false
#peer chaincode query -C mychannel -n basic -c '{"Args":["TransactionExists","3"]}'
#
##   test add functions
#peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"AddFrame","Args":["SUBROSA_MR","20.75","Black","329.99"]}'
#peer chaincode query -C mychannel -n basic -c '{"Args":["FrameExists","SUBROSA_MR"]}'
#
#peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"AddTransaction","Args":["3","Eric","AWAIT_PAYMENT","[\"FIEND_GR\",\"SUNDAY_NS\"]","2","TRAN_SALE"]}'
#peer chaincode query -C mychannel -n basic -c '{"Args":["TransactionExists","3"]}'
#
#peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"UpdateFrame","Args":["SUBROSA_MR","20.75","Black","229.99"]}'
#peer chaincode query -C mychannel -n basic -c '{"Args":["GetFrame","SUBROSA_MR"]}'

