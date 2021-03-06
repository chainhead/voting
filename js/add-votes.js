var Web3 = require('web3');
var fs = require('fs');
var path = require('path');
//
var ethereumHttpEndpoint = "http://18.212.67.23:8545";
var contractHome = "/home/ubuntu/voting";
var contractName = "Rating";
var contractAddresss = "0xB3F3379eD84173d304bB0fD5d929a2e60a38574c";
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
web3.personal.unlockAccount(web3.eth.accounts[0], "Welc0me");   
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