var Web3 = require('web3');
var fs = require('fs');
var path = require('path');
//var uuid = require('uuid-v4');
//
var ethereumHttpEndpoint = "http://18.212.67.23:8545";
var contractHome = "/home/ubuntu/voting";
var contractName = "Rating";
var contractAddresss = "0x0D2918D53807cDF852f78Af8689A2D9E47044896";
//
var abiFilePath = path.join(contractHome, 'bin', 'sol', contractName) + '.abi';
var web3 = new Web3(new Web3.providers.HttpProvider(ethereumHttpEndpoint));
//
var abiFile = fs.readFileSync(abiFilePath).toString();
var abiDef = JSON.parse(abiFile);
var ratingContract = web3.eth.contract(abiDef);
var contractInstance = ratingContract.at(contractAddresss);
//
// Set-up rating and contestants
ratingId = 'R001';
limit = 5;
gasPayment = {
    "from": "web3.eth.accounts[0]",
    "gas": 90000
};
contractInstance.getRatingResult.call(function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log(res);
    }
});