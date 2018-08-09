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
// Set-up rating and voters
ratingId = 'R001';
limit = 10;
gasPayment = {
    "from": web3.eth.accounts[0],
    "gas": 90000
};
for (var i = 0; i <= limit; i++) {
    //voterId = uuid();
    voterId = 'V' + String.fromCharCode(65 + i);
    contractInstance.addVoter.sendTransaction(ratingId, voterId, gasPayment,
        function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        }
    );
}