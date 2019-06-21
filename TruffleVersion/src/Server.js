//general imports
console.log('Starting imports');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var formidable = require('formidable');
const app = express();
var Web3 = require('web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
var lightwallet = require('eth-lightwallet');
var txutils = lightwallet.txutils;

var companyManagementDataAbi = [{"constant":true,"inputs":[{"name":"companyAddress","type":"address"}],"name":"getCompanyNumberOfVotingContracts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"companyAddress","type":"address"},{"name":"votingContractCount","type":"uint256"}],"name":"getCompanyVotingAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"companyAddressId","type":"uint256"}],"name":"getCompanyAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"add","type":"bool"},{"name":"number","type":"uint256"}],"name":"changeNumberOfCompanyCounter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newCompanyAddress","type":"address"},{"name":"companyAddressCount","type":"uint256"}],"name":"addNewCompanyAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"companyAddress","type":"address"},{"name":"votingContract","type":"address"}],"name":"getCompanyVotingContractUsed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"companyAddress","type":"address"},{"name":"newVotingAddress","type":"address"},{"name":"votingContractCount","type":"uint256"}],"name":"addVotingContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"companyAddress","type":"address"},{"name":"votingContract","type":"address"},{"name":"used","type":"bool"}],"name":"addVotingContractUsed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNumberOfCompanyAddresses","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"add","type":"bool"},{"name":"number","type":"uint256"},{"name":"companyAddress","type":"address"}],"name":"changeVotingContractCount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

var companyManagementLogicAbi = [{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"thisCurrentCompanyManagementData","type":"address"}],"name":"upgradeCompanyDataContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwnerOfDataContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getContractDataAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"companyAddress","type":"address"},{"name":"newVotingAddress","type":"address"},{"name":"votingAddressCount","type":"uint256"}],"name":"addVotingContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"Owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newCompanyAddress","type":"address"},{"name":"companyAddressCount","type":"uint256"},{"name":"newVotingAddress","type":"address"},{"name":"votingAddressCount","type":"uint256"}],"name":"addNewCompany","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"thisCurrentCompanyManagmentData","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

var companyDataAbi = [{"constant":true,"inputs":[],"name":"getNumOfActiveInvestors","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"add","type":"bool"},{"name":"number","type":"uint256"}],"name":"changeActiveInvestorsCount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newId","type":"uint256"}],"name":"setCompanyId","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"roundId","type":"uint256"},{"name":"investmentId","type":"uint256"}],"name":"getInvestmentSecurityType","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"roundId","type":"uint256"},{"name":"investorId","type":"uint256"},{"name":"newNumSecurities","type":"uint256"},{"name":"newSecurityType","type":"string"}],"name":"changeInvestment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"add","type":"bool"},{"name":"number","type":"uint256"}],"name":"changeRoundCounter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newRoundId","type":"uint256"},{"name":"newName","type":"string"}],"name":"addNewRound","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAllActiveSecurities","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"roundId","type":"uint256"}],"name":"getNumberOfInvestments","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"roundId","type":"uint256"},{"name":"investmentId","type":"uint256"}],"name":"getInvestmentNumSecurities","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"add","type":"bool"},{"name":"number","type":"uint256"}],"name":"changeActiveSecuritiesCount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"add","type":"bool"},{"name":"number","type":"uint256"},{"name":"roundId","type":"uint256"}],"name":"changeNextFreeInvestmentCounter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCompanyId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"roundId","type":"uint256"}],"name":"getRoundName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getNumberOfRounds","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newName","type":"string"}],"name":"setCompanyName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];


var companyLogicAbi = [{"constant":false,"inputs":[{"name":"newId","type":"uint256"},{"name":"name","type":"string"}],"name":"setCompanyInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"thisCurrentCompanyData","type":"address"}],"name":"upgradeCompanyDataContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newRoundId","type":"uint256"},{"name":"newName","type":"string"}],"name":"addNewRound","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwnerOfDataContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getContractDataAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newRoundId","type":"uint256"},{"name":"newInvestorId","type":"uint256"},{"name":"newNumSecurities","type":"uint256"},{"name":"newSecurityType","type":"string"},{"name":"newInvestor","type":"bool"}],"name":"addNewInvestment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"roundId","type":"uint256"},{"name":"investorId","type":"uint256"},{"name":"newNumSecurities","type":"uint256"},{"name":"newSecurityType","type":"string"},{"name":"removeInvestor","type":"bool"}],"name":"changeInvestment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"thisCurrentCompanyData","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

var votingDataAbi = [{"constant":false,"inputs":[{"name":"voteId","type":"uint256"}],"name":"setVoteStarted","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"voteId","type":"uint256"}],"name":"getVoteExpiryDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"voteId","type":"uint256"},{"name":"securityTypeId","type":"uint256"}],"name":"getVoteSecurityType","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"voteId","type":"uint256"}],"name":"getVoteFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"voteId","type":"uint256"},{"name":"investorId","type":"uint256"}],"name":"getVoteAnswerValue","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"}],"name":"setVoteFinished","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"},{"name":"voterId","type":"uint256"},{"name":"investorId","type":"uint256"}],"name":"setVoterRecorded","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"},{"name":"optionId","type":"uint256"},{"name":"newVoteOption","type":"string"}],"name":"setVoteOption","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getLinkedCompany","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"voteId","type":"uint256"},{"name":"voteOptionId","type":"uint256"}],"name":"getVoteOptionName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"},{"name":"voteOptionId","type":"uint256"},{"name":"add","type":"bool"},{"name":"number","type":"uint256"}],"name":"setVoteOptionTally","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"voteId","type":"uint256"}],"name":"getVoteQuestion","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"},{"name":"securityId","type":"uint256"},{"name":"newSecurityType","type":"string"}],"name":"setSecurityType","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"voteId","type":"uint256"}],"name":"getVoteStarted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"},{"name":"add","type":"bool"},{"name":"number","type":"uint256"}],"name":"setVoteOptionCount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"voteId","type":"uint256"},{"name":"investorId","type":"uint256"}],"name":"getVoterRecorded","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"},{"name":"add","type":"bool"},{"name":"number","type":"uint256"}],"name":"setVoterCount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"voteId","type":"uint256"}],"name":"getVoteOptionCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"voteId","type":"uint256"},{"name":"investorId","type":"uint256"}],"name":"getVoteAnswerDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"},{"name":"investorId","type":"uint256"},{"name":"newDate","type":"uint256"},{"name":"newValue","type":"string"}],"name":"setVoteAnswer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"voteId","type":"uint256"},{"name":"voteOptionId","type":"uint256"}],"name":"getVoteOptionTally","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"},{"name":"newExpiryDate","type":"uint256"}],"name":"setExpiryDate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"voteId","type":"uint256"}],"name":"getVoterCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newLinkedCompany","type":"address"}],"name":"setLinkedCompany","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"},{"name":"newQuestion","type":"string"}],"name":"setVoteQuestion","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"companyDataContract","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

var votingLogicAbi = [{"constant":false,"inputs":[{"name":"voteId","type":"uint256"}],"name":"setVoteStarted","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"},{"name":"investorId","type":"uint256"},{"name":"newDate","type":"uint256"},{"name":"selectedOption","type":"string"},{"name":"optionId","type":"uint256"},{"name":"voteSecurities","type":"uint256[]"},{"name":"investorSecurities","type":"uint256[]"}],"name":"setVoteAnswer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"}],"name":"setVoteFinished","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"},{"name":"optionId","type":"uint256"},{"name":"newVoteOption","type":"string"}],"name":"setVoteOption","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"thisCurrentCompanyData","type":"address"}],"name":"upgradeCompanyDataContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"},{"name":"securityId","type":"uint256"},{"name":"newSecurityType","type":"string"}],"name":"setSecurityType","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"thisCurrentVotingData","type":"address"}],"name":"upgradeVotingDataContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"Owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"},{"name":"newExpiryDate","type":"uint256"}],"name":"setExpiryDate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newLinkedCompany","type":"address"}],"name":"setLinkedCompany","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"voteId","type":"uint256"},{"name":"newQuestion","type":"string"}],"name":"setVoteQuestion","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"votingDataContract","type":"address"},{"name":"companyDataContract","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"s","type":"string"},{"indexed":false,"name":"voteId","type":"uint256"},{"indexed":false,"name":"investorId","type":"uint256"},{"indexed":false,"name":"newDate","type":"uint256"},{"indexed":false,"name":"selectedOption","type":"string"},{"indexed":false,"name":"currentVoterId","type":"uint256"}],"name":"NewVoter","type":"event"}];

var investorManagementDataAbi = [{"constant":true,"inputs":[],"name":"getNumOfActiveInvestors","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"investorId","type":"int256"},{"name":"company","type":"address"},{"name":"roundId","type":"int256"}],"name":"addInvestorsInvestment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"investorId","type":"int256"},{"name":"investmentId","type":"int256"}],"name":"getInvestorInvestmentId","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllActiveSecurities","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"add","type":"bool"},{"name":"number","type":"int256"},{"name":"investorId","type":"int256"}],"name":"changeInvestorSecurityTotal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"add","type":"bool"},{"name":"number","type":"int256"}],"name":"changeActiveInvestorCount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"add","type":"bool"},{"name":"number","type":"int256"}],"name":"changeNextFreeInvestor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"investorId","type":"int256"}],"name":"getInvestorTotalSecurities","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"add","type":"bool"},{"name":"number","type":"int256"},{"name":"investorId","type":"int256"}],"name":"changeInvestorsInvestmentCount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"Owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"investorId","type":"int256"}],"name":"getNextFreeInvestment","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"investorId","type":"int256"}],"name":"getInvestorName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"investorId","type":"int256"},{"name":"investmentId","type":"int256"}],"name":"getInvestorInvestmentCompany","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newInvestorId","type":"int256"},{"name":"newName","type":"string"}],"name":"addNewInvestor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"investorId","type":"int256"}],"name":"deleteInvestor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"add","type":"bool"},{"name":"number","type":"int256"}],"name":"changeAllActiveSecuritiesCount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNextFreeInvestor","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

var investorManagementLogicAbi = [{"constant":false,"inputs":[{"name":"investorId","type":"int256"},{"name":"investorName","type":"string"},{"name":"add","type":"bool"},{"name":"number","type":"int256"}],"name":"changeInvestorSecurityCount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"investorId","type":"int256"},{"name":"company","type":"address"},{"name":"roundId","type":"int256"}],"name":"addInvestorsInvestment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwnerOfDataContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getContractDataAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"thisCurrentInvestorManagementData","type":"address"}],"name":"upgradeInvestorDataContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newInvestorId","type":"int256"},{"name":"newName","type":"string"}],"name":"addNewInvestor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"investorId","type":"int256"}],"name":"deleteInvestor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"thisCurrentInvestorManagmentData","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

console.log('In app use');
app.use(express.static('public'));
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.set('view engine', 'ejs');

console.log('In Quorum start');
web3 = new Web3(new Web3.providers.HttpProvider("http://0.0.0.0:22000"));
web3.eth.defaultAccount = web3.eth.accounts[0];
//ContractManagementLogic
var CMDAddress = '0x6585c8466ecd527dda9e09ebc1390ecab0844f2c';
//ContractManagementData
let CMLAddress = '0xab4cb6367adcbb464eede7f397c2931a3ddf5937';
//InvestorManagementLogic
let IMDAddress = '0x24c71281cd4f8a4848eb4cc96551196fa3c665de';
//InvestorManagementLogic
let IMLAddress = '0xe2f1a35043889bd02e60b3d86e47ce69e6eb477b';
console.log('CMDAddress: ' + CMDAddress);
console.log('CMLAddress: ' + CMLAddress);
console.log('IMDAddress: ' + IMDAddress);
console.log('IMLAddress: ' + IMLAddress);

app.get('/', function (req, res) {
  res.render('login');
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.post('/FileUpload', function(req, res) {
	console.log('Inside GET dataFileUpload');
	    var form = new formidable.IncomingForm();
	    form.parse(req);
	console.log('form: ' + form);
	    form.on('fileBegin', function (name, file){
		console.log('New File detected: ' + file.name);
		file.path = __dirname + '/uploads/' + file.name;
	    });
	    form.on('file', function (name, file){
		console.log('Uploaded ' + file.name);
	    });
	res.render('DataImport');
});

app.post('/CreateNewVote', function (req, res) {
  console.log('Inside CreateNewVote');
	//this is to call a function on this contract (vote)
console.log('req.body: ' + req.body);
	console.log('Post occurred with (companyName): ' + req.body.CompanyName);	
	console.log('Post occurred with (Question): ' + req.body.QuestionIs);	
	console.log('Post occurred with (Explanation): ' + req.body.ExplanationIs);	
	console.log('Post occurred with (Answer1): ' + req.body.Answer1Is);	
	console.log('Post occurred with (Answer2): ' + req.body.Answer2Is);	
	console.log('Post occurred with (example-date-input): ' + req.body.example-date-input);	
	console.log('Post occurred with (example-time-input): ' + req.body.example-time-input);		

//	console.log('Building vote transaction');	
//	var contract = web3.eth.contract(interface);
//	console.log('contract: ' + contract);
//	console.log('contractAddress: ' + contractAddress);
//	var instance = contract.at(contractAddress);
//	console.log('instance: ' + instance);
//	instance.set(req.body.voteNum, {gas: 6000000}, function(error, result){
//					if (!error) {
//						var num = result;
//						console.log('sent the change, response: ' + num);
//getProposal(req, res);
//				} else {
//						console.log('ERROR when sending the vote: ' + error);
//	res.render('index', {voteIs: "error getting vote", error: null});

//				}
//	});
      
//  } else {
//	  console.log('voteNum is not undefined');
//	res.render('index', {voteIs: "you must vote", error: null});	
});

function createVote(CompanyNameGiven, Question, Explanation, Option1, Option2, date, time){

//get all company contracts
	var CMDContract = web3.eth.contract(companyManagementDataAbi).at(CMDAddress);
	var numberOfCompanies = CMDContract.getNumberOfCompanyAddresses();
	console.log('numberOfCompanies' + numberOfCompanies);
//get list of ALL companies

//look for the one with the correct name -> get the address


//Get the attached voting contract (we will create one on data upload -> created with the company contract)	var companyName = "";
	var count = 1;
	var continuing = true;	
	var companyAddress;
	var CLContract;
	var CDContract;
	var VLContract;
	while (continuing == true){
		var companyLogicAddress = CMDContract.getCompanyAddress(count);
		var votingLogicAddress = CMD.getCompanyVotingAddress(companyLogicAddress, 1); //we assume at point 1
		console.log('companyLogic address: ' + companyLogicAddress);
		console.log('votingLogicAddress: ' + votingLogicAddress);
		CLContract = web3.eth.contract(companyLogicAbi).at(companyLogicAddress);		
		companyDataAddress = CLContract.getContractDataAddress();
		console.log('companyData address: ' + companyDataAddress);
		if ((web3.toBigNumber(companyLogicAddress).isZero())||(web3.toBigNumber(companyDataAddress).isZero())){
			console.log('No new company smart contract address found, so exiting');
			continuing = false;	
		}else {
			CDContract = web3.eth.contract(companyDataAbi).at(companyDataAddress);	
		companyName = CDContract.getName();	
			if ((companyName === undefined) ||
    			(companyName == null) || (companyName == 				"undefined") || companyName == ""){
				console.log('No company name found, so exiting');
				continuing = false;
			} else {

				console.log('companyName[count]: ' + count + " is 					"+companyName);
				count = count + 1;
				//check if companyName is equal to the given name. If so we have found our company.
				if (companyName == CompanyNameGiven){
					continuing = false;
				}
			}

		}
	}



//create a new vote in the voting contract. 

}

//functions required:

//1. Data Import page, Upload button: Take investment data upload, parse it and add it to the live smart contracts


//2. Home page, loadup: Display the list of companies managed on the platform, and the various stats around them
app.get('/Index', function (req, res) {
	console.log('Inside GET Index');
	getIndex(req, res);
})

app.get('/InitiateEvent', function (req, res) {
	console.log('Inside GET InitiateEvent');
	res.render('InitiateEvent');
})

app.get('/DataImport', function (req, res) {
	console.log('Inside GET DataImport');
	res.render('DataImport');
})

app.get('/VoteResults', function (req, res) {
	console.log('Inside GET VoteResults');
	res.render('VoteResults', {varExpirationDate: "2018-02-13", varQuestion: "server Question", varOptionOne: "Option1", varOptionOnePercentage: "11", varOptionTwo: "Option2", varOptionTwoPercentage: "15", varPercentageOfVoters: "4", varNumOfVoters: 2300, varTableRows: []});
})

app.get('/CreateVote1', function (req, res) {
	console.log('Inside GET CreateVote1');
	var CMDContract = web3.eth.contract(companyManagementDataAbi).at(CMDAddress);
	var numberOfCompanies = CMDContract.getNumberOfCompanyAddresses();
	console.log('numberOfCompanies' + numberOfCompanies);
//get list of ALL companies

	var companyName = [];
	var count = 1;
	var continuing = true;	
	var companyAddress;
	var CLContract;
	var CDContract;
	while (continuing == true){
		companyLogicAddress = CMDContract.getCompanyAddress(count);
		console.log('companyLogic address: ' + companyLogicAddress);
		CLContract = web3.eth.contract(companyLogicAbi).at(companyLogicAddress);		
		companyDataAddress = CLContract.getContractDataAddress();
		console.log('companyData address: ' + companyDataAddress);
		if ((web3.toBigNumber(companyLogicAddress).isZero())||(web3.toBigNumber(companyDataAddress).isZero())){
			console.log('No new company smart contract address found, so exiting');
			continuing = false;	
		}else {
			CDContract = web3.eth.contract(companyDataAbi).at(companyDataAddress);	
		companyName[count] = CDContract.getName();	
			if ((companyName[count] === undefined) ||
    			(companyName[count] == null) || (companyName[count] == 				"undefined") || companyName[count] == ""){
				console.log('No company name found, so exiting');
				continuing = false;
			} else {

				console.log('companyName[count]: ' + count + " is 					"+companyName[count]);
				count = count + 1;
		
			}

		}
	}


	var today = new Date();
	var dd = today.getUTCDate();
	var mm = today.getUTCMonth()+1;
	var yyyy = today.getUTCFullYear();
	var dateControlIs = "2018-01-12";
	console.log('DateControl is ' + dateControlIs);

	var hh = today.getUTCHours();
	var mm = today.getUTCMinutes();
	var ss = today.getUTCSeconds();
	var timeControlIs = "13:10:54";
	console.log('TimeControl is ' + timeControlIs);

  	res.render('CreateVote1', {varCompanies: companyName, dateIs: dateControlIs, timeIs: timeControlIs});

})

app.get('/CreateVote3', function (req, res) {
	console.log('Inside GET CreateVote3');
	res.render('CreateVote3');
})


function getIndex(req, res){

   	console.log("********************FUNCTION:GETINDEX********************");

	var CMDContract = web3.eth.contract(companyManagementDataAbi).at(CMDAddress);
	
	var IMDContract = web3.eth.contract(investorManagementDataAbi).at(IMDAddress);


//get number of ALL companies

	var numberOfCompanies = CMDContract.getNumberOfCompanyAddresses();
	console.log('numberOfCompanies' + numberOfCompanies);
//get number of ALL users

	var numberOfInvestors = IMDContract.getNumOfActiveInvestors();
	console.log('numberOfInvestors' + numberOfInvestors);
//get number of ALL securities

	var numberOfSecurities = IMDContract.getAllActiveSecurities();
	console.log('numberOfSecurities' + numberOfSecurities);
//get value of ALL securities WILL NOT DO

//get number of pending transfers WILL NOT DO

//get list of ALL companies

	var companyName = [];
	var companySecurityTotal = [];
	var companyActiveInvestors = [];
	var count = 1;
	var continuing = true;	
	var companyAddress;
	var CLContract;
	var CDContract;
	var tableRows = [];
	while (continuing == true){
		companyLogicAddress = CMDContract.getCompanyAddress(count);
		console.log('companyLogic address: ' + companyLogicAddress);
		CLContract = web3.eth.contract(companyLogicAbi).at(companyLogicAddress);		
		companyDataAddress = CLContract.getContractDataAddress();
		console.log('companyData address: ' + companyDataAddress);
		if ((web3.toBigNumber(companyLogicAddress).isZero())||(web3.toBigNumber(companyDataAddress).isZero())){
			console.log('No new company smart contract address found, so exiting');
			continuing = false;	
		}else {
			CDContract = web3.eth.contract(companyDataAbi).at(companyDataAddress);	
		companyName[count] = CDContract.getName();	
		if ((companyName[count] === undefined) ||
    (companyName[count] == null) || (companyName[count] == "undefined") || companyName[count] == ""){
			console.log('No company name found, so exiting');
			continuing = false;
		} else {

			console.log('companyName[count]: ' + count + " is "+companyName[count]);
			companySecurityTotal[count] = parseInt(CDContract.getAllActiveSecurities());
			console.log('companySecurityTotal[count]: ' + count + " is "+companySecurityTotal[count]);
			companyActiveInvestors[count] = parseInt(CDContract.getNumOfActiveInvestors());
			console.log('companyActiveInvestors[count]: ' + count + " is "+companyActiveInvestors[count]);		
	tableRows[count] = {Company:companyName[count], SecurityHolders:companyActiveInvestors[count], SecuritiesUnderManagement:companySecurityTotal[count],ValueOfSecurities:0,PendingTransfers:0};
			count = count + 1;
		
		}

		}
				 
	}

	
	res.render('index', {varCompaniesUnderManagement: numberOfCompanies, varSecurityHoldersUnderManagement: numberOfInvestors, varSecurityUnderManagement: numberOfSecurities, varValueOfSecurities: 0, varPendingTransfers: 0, varTableRows:tableRows});
}

app.get('/DataImport', function (req, res) {
	console.log('Inside GET DataImport');
	getDataImport(req, res);
})


function getDataImport(req, res){

//parse data file

//add investors (if not already added)

//add company (if not already added)

//add to company management (if not already added)


}

function addInvestor(investorId,investorName){

   	console.log("********************FUNCTION:ADDINVESTOR********************");

	var VMLContract = web3.eth.contract(investorManagementLogicAbi).at(IMLAddress);
	var VMDContract = web3.eth.contract(investorManagementDataAbi).at(IMDAddress);
	var currentName = VMDContract.getInvestorName(investorId);
	//check if investor has already been added
	if (currentName != ""){
		return;
	}
	//if investor has not been added, add it
	VMLContract.addNewInvestor(newInvestorId, investorName, {gas: 4700000}, function(error, result){
		if (!error) {
			console.log('A new investor has been added! Transaction Id:  ' + result);
		} else {
			console.log('ERROR when adding a new investor: ' + error);
		}
		});

}

function addCompany(companyId,companyName){

   	console.log("********************FUNCTION:ADDCOMPANY********************");
	var CMDContract = web3.eth.contract(companyManagementDataAbi).at(CMDAddress);
	//check if the company has already been added
	var currentAddress = CMDContract.getCompanyAddress(companyId);	
	if (web3.toBigNumber(currentAddress).isZero() == false){
		console.log('Company has already been added');
		return;
	}
	//else we need to create a new version of the company contract and add it to company management
	deployCompanyData(companyId,companyName);

}

function addInvestment(investorId,companyId,roundName,numOfSecurities,typeOfSecurities){

   	console.log("********************FUNCTION:ADDINVESTMENT********************");

//check if investment has already been created, if so then add to it.
}

function deployCompanyData(companyId,companyName){

   	console.log("********************FUNCTION:DEPLOYCOMPANYDATA********************");
	var companyDataContract = web3.eth.contract(companyDataAbi);
	var companyData = companyDataContract.new(
	   {
	     from: web3.eth.accounts[0], 
	     data: companyDataByteCode,
	     gas: '4700000'
	   }, function (e, contract){
	    console.log('CompanyData deploy contract transaction created! ' + ' TransactionHash: ' + contract.transactionHash);
		sleep(sleepLengthMs);
		deployCompanyLogicContract(companyId,companyName,contract.transactionHash);
	 });

}

function deployCompanyLogicContract(companyId,companyName,companyDataTransactionHash){

   	console.log("********************FUNCTION:DEPLOYCOMPANYLOGIC********************");
   	var tr = web3.eth.getTransactionReceipt(companyDataTransactionHash);
   	console.log("\ncompanyData TransactionHash status is: " + tr.status);
	var companyDataAddress = tr.contractAddress;   	
	console.log("\nCompanyData contractAddress is: " + companyDataAddress);
   	console.log("\nGas used is: " + tr.cumulativeGasUsed);

	if (companyDataAddress == 'undefined'){

		console.log('There has been a problem deploying the CompanyData contract');	

	} else {

		var companyLogicContract = web3.eth.contract(companyLogicAbi);
		var companylogic = companyLogicContract.new(
		   companyDataAddress,
		   {
		     from: web3.eth.accounts[0], 
		     data: companyLogicByteCode,
		     gas: '4700000'
		   }, function (e, contract){
		    console.log('CompanyLogic deploy contract transaction created! ' + ' TransactionHash: ' + contract.transactionHash);
		     sleep(sleepLengthMs);
		     setCompanyDataOwner(companyId,companyName,companyDataAddress,contract.transactionHash);
		 });
	}

}

function setCompanyDataOwner(companyId,companyName,companyDataAddress,companyLogicTransactionHash){
   	console.log("********************FUNCTION:SETCOMPANYOWNER********************");
   	var tr2 = web3.eth.getTransactionReceipt(companyLogicTransactionHash);
   	console.log("\ncompanyLogic TransactionHash status is: " + tr2.status);
	var companyLogicAddress = tr2.contractAddress;   	
	console.log("\nCompanyLogic contractAddress is: " + companyLogicAddress);
   	console.log("\nGas used is: " + tr2.cumulativeGasUsed);

	if (companyLogicAddress == 'undefined'){

		console.log('There has been a problem deploying the companyLogicAddress');
		return;	

	}

	var CDContract = web3.eth.contract(companyDataAbi).at(companyDataAddress);
	console.log('contractAddress: ' + companyDataAddress);
	
	try{

		CDContract.setOwner(companyLogicAddress,{gas: 4700000}, function(error, result){
			if (!error) {
				var num = result;
				console.log('The ownership of the companyData contract has been given to the companyLogic contract! Transaction Id:  ' + num);
				addCompanyInfo(companyId,companyName,companyDataAddress,companyLogicAddress);
			} else {
				console.log('ERROR when adding a new company: ' + error);
			}
		});

	}catch(err) {
		console.log("err.message:" + err.message);

	}

}

function addCompanyInfo(companyId,companyName,companyDataAddress,companyLogicAddress){
   	console.log("********************FUNCTION:ADDCOMPANYINFO********************");
	var CLContract = web3.eth.contract(companyLogicAbi).at(companyLogicAddress);
	console.log('companyManagementLogicAddress: ' + companyLogicAddress);
	var owner = CLContract.getOwner();
	console.log('CLContract owner: ' + owner);

try{

	CLContract.setCompanyInfo(companyId, companyName,{gas: 4700000}, function(error, result){
		if (!error) {
			var num = result;
			console.log('The new company info has been added! Transaction Id:  ' + num);
			sleep(sleepLengthMs);
			checkCompanyInfo(companyManagementLogicAddress,companyManagementDataAddress,companyDataAddress,companyLogicAddress,companyVotingLogicAddress);
				
		} else {
			console.log('ERROR when adding a new company: ' + error);
		}
	});

}catch(err) {

  console.log("err.message:" + err.message);

}


}


console.log('At end of file');
//3. Create New Vote 3, submit button: Setup a vote if submitted correctly. Use smart contract validations and convert them to user messages

//4. Vote Page: Allow a user to vote if the details are correct

//5. Report/Results page, loadup: List of users, whether they have voted, and the current interim stats.
