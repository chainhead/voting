var Web3 = require('web3');
var fs = require('fs');
var path = require('path');
//
var ethereumHttpEndpoint = process.env.ETHEREUM_END_POINT;
var contractHome = process.env.CONTRACT_HOME;
var contractName = process.env.CONTRACT_NAME;
var contractAddresss = process.env.CONTRACT_ADDRESS;
//
var voteFilePath = path.join(contractHome, 'votes.json');
var votesFile = fs.readFileSync(voteFilePath);
var votes = JSON.parse(votesFile);
var web3 = new Web3(new Web3.providers.HttpProvider(ethereumHttpEndpoint));
//
var abiFilePath = path.join(contractHome, 'bin', 'sol', contractName) + '.abi';
var abiFile = fs.readFileSync(abiFilePath).toString();
var abiDef = JSON.parse(abiFile);
//
var web3 = new Web3(new Web3.providers.HttpProvider(ethereumHttpEndpoint));
var ratingContract = web3.eth.contract(abiDef);
var contractInstance = ratingContract.at(contractAddresss);
//
var ratingId = votes.ratingId;
var contestants = votes.contestantVotes;
gasPayment = {
    "from": web3.eth.accounts[0],
    "gas": 90000
};
//
for (var i = 0; i < contestants.length; i++) {
    contestant = Object.keys(contestants[i]);
    contestantId = contestant[0];
    voters = contestants[i][contestant];
    for (var j = 0; j < voters.length; j++) {
        contractInstance.addVote.sendTransaction(ratingId, contestantId, voters[j], gasPayment, function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        });
    }
}