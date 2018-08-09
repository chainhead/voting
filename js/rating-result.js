var Web3 = require('web3');
var fs = require('fs');
var path = require('path');
//var uuid = require('uuid-v4');
//
var ethereumHttpEndpoint = "http://18.212.67.23:8545";
var contractHome = "/home/ubuntu/voting";
var contractName = "Rating";
var contractAddresss = "0xB3F3379eD84173d304bB0fD5d929a2e60a38574c";
//
var abiFilePath = path.join(contractHome, 'bin', 'sol', contractName) + '.abi';
var web3 = new Web3(new Web3.providers.HttpProvider(ethereumHttpEndpoint));
//
var abiFile = fs.readFileSync(abiFilePath).toString();
var abiDef = JSON.parse(abiFile);
var ratingContract = web3.eth.contract(abiDef);
var contractInstance = ratingContract.at(contractAddresss);
//
web3.personal.unlockAccount(web3.eth.accounts[0], "Welc0me");   
// Set-up rating and contestants
ratingId = 'R001';
limit = 5;
gasPayment = {
    "from": web3.eth.accounts[0],
    "gas": 90000
};
contractInstance.ratingResult(ratingId, gasPayment, function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log(res);
    }
});