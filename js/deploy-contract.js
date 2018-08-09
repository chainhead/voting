var Web3 = require('web3');
var fs = require('fs');
var path = require('path');
//var uuid = require('uuid-v4');
//
var ethereumHttpEndpoint = process.env.ETHEREUM_END_POINT;
var contractHome = process.env.CONTRACT_HOME;
var contractName = process.env.CONTRACT_NAME;
//
var abiFilePath = path.join(contractHome, 'bin', 'sol', contractName) + '.abi';
var bytecodeFilePath = path.join(contractHome, 'bin', 'sol', contractName) + '.bin';
//
var ethHttpProvider = new Web3.providers.HttpProvider(ethereumHttpEndpoint);
var web3 = new Web3(ethHttpProvider);
//
var abiFile = fs.readFileSync(abiFilePath).toString();
var abiDef = JSON.parse(abiFile);
var byteCode = fs.readFileSync(bytecodeFilePath).toString();
//
//var ratingId = uuid();
var ratingId = 'R001';
var ratingContract = web3.eth.Contract(abiDef);
byteCode = "0x" + byteCode;
web3.personal.unlockAccount(web3.eth.accounts[0], "Welc0me");
var deployedContract = ratingContract.new(ratingId, {
        data: byteCode,
        from: web3.eth.accounts[0],
        gas: 900000
    },
    (err, res) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("Transaction hash : " + res.transactionHash);
            console.log("Contract address : " + res.address);
            console.log("Rating Id : " + ratingId);
        }
    }
);