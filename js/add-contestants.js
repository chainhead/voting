var Web3 = require('web3');
var fs = require('fs');
var path = require('path');
//var uuid = require('uuid-v4');
//
var ethereumHttpEndpoint = process.env.ETHEREUM_END_POINT;
var contractHome = process.env.CONTRACT_HOME;
var contractName = process.env.CONTRACT_NAME;
var contractAddresss = process.env.CONTRACT_ADDRESS;
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
    "from": web3.eth.accounts[3],
    "gas": 90000
};
for (var i = 0; i <= limit; i++) {
    //contestantId = uuid();
    contestantId = 'C' + String.fromCharCode(65+i);
    contractInstance.addContestant.sendTransaction(ratingId, contestantId, gasPayment,
        function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        }
    );
}
