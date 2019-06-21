//general imports
console.log('Starting imports');
const express = require('express');
const request = require('request');
//var formidable = require('formidable');
const app = express();
const bodyParser = require('body-parser');
var multer  = require('multer');
var Web3 = require('web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
var lightwallet = require('eth-lightwallet');
var TruffleContract = require('truffle-contract');
var txutils = lightwallet.txutils;
var path = require('path');
var fs = require('fs');
var CompanyDataArtifact = require(path.join(__dirname,'../build/contracts/CompanyData.json'));
var CompanyLogicArtifact = require(path.join(__dirname,'../build/contracts/CompanyLogic.json'));
var CompanyManagementDataArtifact = require(path.join(__dirname,'../build/contracts/CompanyManagementData.json'));
var CompanyManagementLogicArtifact = require(path.join(__dirname,'../build/contracts/CompanyManagementLogic.json'));
var InvestorManagementDataArtifact = require(path.join(__dirname,'../build/contracts/InvestorManagementData.json'));
var InvestorManagementLogicArtifact = require(path.join(__dirname,'../build/contracts/InvestorManagementLogic.json'));
var VotingDataArtifact = require(path.join(__dirname,'../build/contracts/VotingData.json'));
var VotingLogicArtifact = require(path.join(__dirname,'../build/contracts/VotingLogic.json'));
var Contracts = [];

console.log('In app use');
app.use(express.static('public'));
//app.use(bodyParser.json() );       // to support JSON-encoded bodies
//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies
//app.use(express.bodyParser());
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // to support URL-encoded bodies
//var urlencodedParser = bodyParser.urlencoded({extended: false});
//app.use(bodyParser.text({ type: 'text/html' }))
//app.use(bodyParser.text({ type: 'text/xml' }))
//app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
//app.use(bodyParser.json({ type: 'application/*+json' }))
//app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.json())
//app.use(multer({ dest: '/tmp/'}));
var upload = multer({ dest: '/tmp'});
app.set('view engine', 'ejs');

console.log('Start of Quorum setup');
provider = new Web3.providers.HttpProvider("http://0.0.0.0:22000");
web3 = new Web3(provider);
web3.eth.defaultAccount = web3.eth.accounts[0];
console.log('End of Quorum setup');


console.log('In Truffle start');
// Connect to all contracts using truffle
//CompanyData
var CompanyDataContract = TruffleContract(CompanyDataArtifact);
Contracts.CompanyDataContract = CompanyDataContract;
Contracts.CompanyDataContract.setProvider(provider);
//Contracts.CompanyDataContract.deployed().then(function(instance) {
//    return instance.getOwner();
//}).then(function(result) {
//    console.log("getOwner:" + result + " (CompanyData)");
//}, function(error) {
//    console.log(error);
//});

//CompanyLogic
var CompanyLogicContract = TruffleContract(CompanyLogicArtifact);
Contracts.CompanyLogicContract = CompanyLogicContract;
Contracts.CompanyLogicContract.setProvider(provider);

//CompanyManagementData
var CompanyManagementDataContract = TruffleContract(CompanyManagementDataArtifact);
Contracts.CompanyManagementDataContract = CompanyManagementDataContract;
Contracts.CompanyManagementDataContract.setProvider(provider);

//CompanyManagementLogic
var CompanyManagementLogicContract = TruffleContract(CompanyManagementLogicArtifact);
Contracts.CompanyManagementLogicContract = CompanyManagementLogicContract;
Contracts.CompanyManagementLogicContract.setProvider(provider);

//InvestorManagementData
var InvestorManagementDataContract = TruffleContract(InvestorManagementDataArtifact);
Contracts.InvestorManagementDataContract = InvestorManagementDataContract;
Contracts.InvestorManagementDataContract.setProvider(provider);

//InvestorManagementLogic
var InvestorManagementLogicContract = TruffleContract(InvestorManagementLogicArtifact);
Contracts.InvestorManagementLogicContract = InvestorManagementLogicContract;
Contracts.InvestorManagementLogicContract.setProvider(provider);

//VotingData
var VotingDataContract = TruffleContract(VotingDataArtifact);
Contracts.VotingDataContract = VotingDataContract;
Contracts.VotingDataContract.setProvider(provider);

//VotingLogic
var VotingLogicContract = TruffleContract(VotingLogicArtifact);
Contracts.VotingLogicContract = VotingLogicContract;
Contracts.VotingLogicContract.setProvider(provider);
console.log('End of Truffle section');

app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
})

app.get('/', function (req, res) {
  res.render('Website2/login');
})

app.get('/Vote', function (req, res) {
  res.render('Website2/Vote');
})

app.get('/Shareholders', async function (req, res) {
   	console.log("********************FUNCTION:GET:Shareholders********************");

let CompanyData = await getCompanyNamesAndNumberOfVotes();
	let CompanyNames = [];
	let count = 1;
console.log('CompanyData[0].length: ' + CompanyData[0].length);
	while (count < CompanyData[0].length){
		CompanyNames[count] = CompanyData[0][count]; 
		console.log('companyNames[count]: ' + CompanyNames[count]);
		count = count + 1;
	}
  res.render('Website2/DisplayShareholders',{varCompanies: CompanyNames,varTableRows:[]});
})

app.post('/LoadShareholders', async function (req, res) {
   	console.log("********************FUNCTION:POST:LoadShareholders********************");

console.log('req.body: ' + JSON.stringify(req.body));
	console.log('Post occurred with (CompanyName): ' + req.body.CompanyName);
	let givenCompanyName = req.body.CompanyName;
	let CompanyData = await getCompanyNamesAndNumberOfVotes();
	let CompanyNames = [];
	let count = 1;
console.log('CompanyData[0].length: ' + CompanyData[0].length);
	while (count < CompanyData[0].length){
		if (givenCompanyName == CompanyData[0][count]){
			//add at position 1
		CompanyNames[1] = CompanyData[0][count]; 
		console.log('companyNames[1]: ' + CompanyNames[1]);
		} else {
			CompanyNames[count+1] = CompanyData[0][count]; 
			console.log('companyNames[count]: ' + CompanyNames[count]);
		}
		count = count + 1;
	}

	//getCompanyShareholders

		//go through all investors
		let InvestorManagementDataInst = await 	Contracts.InvestorManagementDataContract.deployed();
		let investorCount = 1;
		let numOfInvestors = await InvestorManagementDataInst.getNumOfActiveInvestors();
		let recordedCount = 1;
		let tableRows = [];
		while (investorCount <= numOfInvestors){
			//get investor companyName

			let companyDataAddress = await InvestorManagementDataInst.getInvestorInvestmentCompany(parseInt(investorCount),1);
			let CDContract = web3.eth.contract(Contracts.CompanyDataContract.abi).at(companyDataAddress);
			let company = CDContract.getName();
			console.log("companyDataAddress: " + companyDataAddress);			
			console.log("company: " + company);
			console.log("given company: " + givenCompanyName);
			if (company == givenCompanyName){
				//get investorName
				let investorName = await InvestorManagementDataInst.getInvestorName(parseInt(investorCount));
			console.log("investorName: " + investorName);
				//get investor number of securites
				let numOfSecurities = await InvestorManagementDataInst.getInvestorTotalNumOfSecurities(parseInt(investorCount),company);
			console.log("numOfSecurities: " + numOfSecurities);
				tableRows[recordedCount] = {UserId:investorCount,Name:investorName, Securities:numOfSecurities};
				recordedCount = recordedCount + 1;
			}		
			
			investorCount = investorCount + 1;
		}
	//if they have an investment with this company then keep that data - assume only one investment per person for now
	res.render('Website2/DisplayShareholders',{varCompanies: CompanyNames,varTableRows:tableRows});
})


app.post('/UploadVote', function (req, res) {
   	console.log("********************FUNCTION:POST:VoteUpload********************");
	//check the variables have been passed up
	console.log('req.body: ' + JSON.stringify(req.body));
	res.json(req.body);
	console.log('Post occurred with (Name): ' + req.body.Name);	
	console.log('Post occurred with (InvestorID): ' + req.body.InvestorID);	
	console.log('Post occurred with (CompanyName): ' + req.body.CompanyName);	
	console.log('Post occurred with (VoteID): ' + req.body.VoteID);	
	console.log('Post occurred with (VoteOptionSelectedID): ' + req.body.VoteOptionSelectedID);
	console.log('Post occurred with (VoteOptionSelectedText): ' + req.body.VoteOptionSelectedText);
	//now create the new vote
	registerVote(req.body.Name,req.body.InvestorID,req.body.CompanyName,req.body.VoteID,req.body.VoteOptionSelectedID,req.body.VoteOptionSelectedText);
	res.render('Website2/CreateVote3', {varInfoBar: "The new vote has been uploaded!"});
});

async function registerVote(Name,InvestorID,CompanyName,VoteID,VoteOptionSelectedID,VoteOptionSelectedText){
	console.log("********************FUNCTION:POST:RegisterVote********************");
	//need to get the company and the voting contract (use the correct function)
	let companyInfo = await getCorrectCompanyAndVotingContract(CompanyName);
	if (companyInfo[1] == ""){
		console.log("The company's voting contract was not found so the vote cannot be registered");		
		return; 
	}
	//add the vote to the voting contract
	console.log("votingDataAddress: " + companyInfo[1]);
	let VDContract = web3.eth.contract(Contracts.VotingDataContract.abi).at(companyInfo[1]);
	let votingLogicAddress = VDContract.getOwner();
	console.log("votingLogicAddress: " + votingLogicAddress); 
	let VLContract = web3.eth.contract(Contracts.VotingLogicContract.abi).at(votingLogicAddress);
	let UTCDateNow = Date.now();
	UTCDateNow = parseInt(parseInt(UTCDateNow)/1000); 
	console.log("UTCDateNow" + UTCDateNow);

	console.log("***TESTS***");
			
	//run preliminary tests
		//check if vote has started
		let started = await VDContract.getVoteStarted(parseInt(VoteID));
		console.log("started: " + started);
		//get block timestamp
		let blockNumber = web3.eth.blockNumber;
		console.log("blockNumber: " + blockNumber);
		let timestamp = web3.eth.getBlock(blockNumber).timestamp;
		console.log("timestamp: " + timestamp);
		//make sure voter has not already voted
		let currentVote = await VDContract.getVoteAnswerValue(parseInt(VoteID),parseInt(InvestorID));
		console.log("currentVote: " + currentVote);
		//make sure that the option is true
		let voteOptionName = await VDContract.getVoteOptionName(parseInt(VoteID),parseInt(VoteOptionSelectedID));
		console.log("VoteID: " + VoteID);
		console.log("VoteOptionSelectedID: " + VoteOptionSelectedID);
		console.log("voteOptionName: " + voteOptionName);
		//checkVoteId
		let currentNumberOfVotes = await VDContract.getNumberOfVotes();
		console.log("NumberOfVotes: " + currentNumberOfVotes);		
		//checkOwner
		let contractOwner = VDContract.getOwner();
		console.log("Get Owner: " + contractOwner);
		//check that investorID and investorName match
		let InvestorManagementDataInst = await 	Contracts.InvestorManagementDataContract.deployed();
		let investorName = await InvestorManagementDataInst.getInvestorName(parseInt(InvestorID));
		console.log("Investor Name: " + investorName);
		//check the number of securities for the investor
		let investorSecurities = await InvestorManagementDataInst.getInvestorTotalNumOfSecurities(parseInt(InvestorID),CompanyName);
		console.log("investorSecurities: " + investorSecurities);

	let AddVoteHash = await VLContract.setVoteAnswer(parseInt(VoteID),parseInt(InvestorID),Name,UTCDateNow,VoteOptionSelectedText,parseInt(VoteOptionSelectedID),CompanyName,{gas: 5000000});
	console.log("Adding vote TransHash is: " + AddVoteHash);
	let tr;
	let count = 0;	
	while ((tr == null)&&(count < 40)){	//max 10 sec wait
		tr = await web3.eth.getTransactionReceipt(AddVoteHash);
		sleep(250);	//0.25 second wait
		count = count + 1;
	}
	console.log("Count for adding the vote is: " + count);
   	console.log("\nregisterVote TransactionHash status is: " + tr.status);
}

app.post('/FileUpload', upload.single("Uploadedfile"), async function(req, res) {
   	console.log("********************FUNCTION:POST:FileUpload********************");
try{
	console.log('req.file: ' + JSON.stringify(req.file));
   console.log('req.file.fieldname: ' + req.file.fieldname);
   console.log('req.file.originalname: ' + req.file.originalname);
   console.log('req.file.path: ' + req.file.path);

   let fileData = await fs.readFile(req.file.path, function (err, data) {
         if( err ){
              console.log( err );
		return "";
         }else{
             console.log('fileData: ' + data);
		parseDataUpload(data + '');
       }
	return data;
   })

}catch(err) {
		console.log("Error in FileUpload is: " + err);
	}
	res.render('Website2/DataImport');
});

async function parseDataUpload(data) {

	//split by lines
	let dataLines = data.split("\n");
	//split by comma
	
	let count = 0
	console.log('dataLines.length: ' + dataLines.length);
	console.log('dataLines[0].length: ' + dataLines[0].length);
	var companyDataAddress = "";
	var companyLogicAddress = "";
	while ((count < dataLines.length)&&(dataLines[count].split(",").length == 6)){
		console.log("********WHILELOOP:ParseDataUpload********");
		console.log("count is: " + count);		
		//locate company -> If it does not exist then create it and a voting contract
		let dataCommas = dataLines[count].split(",");
		console.log("***WHILELOOP:AddCompany***");
		console.log('Searching for company: ' + dataCommas[2]);
		let CompanyContracts = await getCorrectCompanyAndVotingContract(dataCommas[2]);	
		if (CompanyContracts[0] == ""){
			//company not there so it needs to be created
			console.log('Company NOT found - so it will be created');
			//get currentNumber of companyContracts
			let CompanyManagementDataInst = await 	Contracts.CompanyManagementDataContract.deployed();
			let numOfCompanies = await CompanyManagementDataInst.getNumberOfCompanyAddresses();
			nextCompanyNum = parseInt(numOfCompanies)+1;
			console.log('numOfCompanies: ' + numOfCompanies);		
			console.log('nextCompanyNum: ' + nextCompanyNum);					
			//create company data and logic contracts			
			let dcdInfo = await deployCompanyData();
			console.log('dcdInfo: ' + dcdInfo);
			let dclInfo = await deployCompanyLogicContract(dcdInfo); 
			console.log('dclInfo[0] (companyDataAddress): ' + dclInfo[0]);
			console.log('dclInfo[1] (companyLogicHash): ' + dclInfo[1]);
			//link the company contracts
			let scdoInfo = await setCompanyDataOwner(dclInfo[0],dclInfo[1]);
			console.log('scdoInfo[0] (companyDataAddress): ' + scdoInfo[0]);
			console.log('scdoInfo[1] (companyLogicAddress): ' + scdoInfo[1]);
			companyDataAddress = scdoInfo[0];			
			companyLogicAddress = scdoInfo[1];			
			//add the data to the company contract
			let aciInfo = await addCompanyInfo(nextCompanyNum,dataCommas[2],scdoInfo[1]);
			//create voting data and logic contracts
			let dvdInfo = await deployVotingData(scdoInfo[0]);
			console.log('dcdInfo: ' + dcdInfo);
			let dvlInfo = await deployVotingLogicContract(dvdInfo);
			console.log('dvlInfo[0] (votingDataAddress): ' + dvlInfo[0]);
			console.log('dvlInfo[1] (votingLogicHash): ' + dvlInfo[1]);
			//link the voting contracts			
			let svdoInfo = await setVotingDataOwner(dvlInfo[0],dvlInfo[1]);
			//link the voting contracts to the company contracts through the company management contracts
			console.log('svdoInfo[0] (votingDataAddress): ' + svdoInfo[0]);
			console.log('svdoInfo[1] (votingLogicHash): ' + svdoInfo[1]);
			let TransHash = await addCompanyAndVoteToCompanyManagement(scdoInfo[1],nextCompanyNum,svdoInfo[1],1);
			//function here to wait for the hash to be recorded onto the chain
			console.log("TransHash: " + TransHash);
			let tr2;
			let countF = 0;	
			while ((tr2 == null)&&(countF < 40)){	//max 10 sec wait
				tr2 = await web3.eth.getTransactionReceipt(TransHash);
		   		sleep(250);	//0.25 second wait
				countF = countF + 1;
			}
			console.log("Count for adding the company is: " + countF);
   			console.log("\naddCompanyAndVote TransactionHash status is: " + tr2.status);
			
		} else {
			console.log('Company found (!) - so no need to create it');
		}
		//locate round -> If it does not exist then create it
		console.log("***WHILELOOP:AddRound***");
		console.log('Searching for round: ' + dataCommas[3]);
		console.log('CompanyContracts[0]: ' + CompanyContracts[0]);
		if (companyDataAddress == ""){
			companyDataAddress = CompanyContracts[0];
			let CDContract = web3.eth.contract(Contracts.CompanyDataContract.abi).at(companyDataAddress);
			companyLogicAddress = await CDContract.getOwner(); 
		}
		console.log('companyDataAddress: ' + companyDataAddress);
		console.log('companyLogicAddress: ' + companyLogicAddress);
		let roundId = await getRoundId(companyDataAddress,dataCommas[3]);	
		console.log('returned roundId: ' + roundId);		
		if (roundId == 0){
			console.log("Round NOT found so it will be added...");
			var roundHash = await createRound(companyLogicAddress,parseInt(roundId+1),dataCommas[3]);
		}
			let tr4;
			let countR = 0;	
			while ((tr4 == null)&&(countR < 40)){	//max 10 sec wait
				tr4 = await web3.eth.getTransactionReceipt(roundHash);
		   		sleep(250);	//0.25 second wait
				countR = countR + 1;
			}
			console.log("Count for adding the round is: " + countR);
   			console.log("\naddRound TransactionHash status is: " + tr4.status);


		console.log("***WHILELOOP:AddInvestor***");
		let InvestorManagementDataInst = await 	Contracts.InvestorManagementDataContract.deployed();
		let numOfInvestors = await InvestorManagementDataInst.getNextFreeInvestor();

		let addInvestmentBool = false;
		let newInvestor = false;
		//add investor to company
		if (parseInt(dataCommas[0]) == 0){
			console.log("investorName is: " + dataCommas[1]);
			//get numberOfCurrentInvestors
			//then this investor is a new investor
			var investorHash = await addInvestor(parseInt(numOfInvestors)+1,dataCommas[1]);
			//wait for the transaction to be confirmed before adding the investment?
			addInvestmentBool = true;
			newInvestor = true;
			console.log("investorHash: " + investorHash);
			let tr3;
			let countI = 0;	
			while ((tr3 == null)&&(countI < 40)){	//max 10 sec wait
				tr3 = await web3.eth.getTransactionReceipt(investorHash);
		   		sleep(250);	//0.25 second wait
				countI = countI + 1;
			}
			console.log("Count for adding the investor is: " + countI);
   			console.log("\naddInvestor TransactionHash status is: " + tr3.status);

		} else {
			console.log("investorName in file is: " + dataCommas[1]);			
			//we need to check if this investor has previously been added
			let investorNameCheck = await InvestorManagementDataInst. getInvestorName(dataCommas[0]);
			console.log("investorName from blockchain is: " + investorNameCheck);
			if (investorNameCheck == dataCommas[1]){
				addInvestmentBool = true;
			}else {
				console.log("File and Blockchain data DO NOT match so no investment will be added for this row of data");
			}					
		}

		console.log("***WHILELOOP:AddInvestment***");
		if (addInvestmentBool == true){
		//add investment to company
			var newInvestorId;
			if (newInvestor == true){
				newInvestorId = parseInt(numOfInvestors)+1;
			} else {
				newInvestorId = parseInt(dataCommas[0]);
			}
			let roundIdNow = await getRoundId(companyDataAddress,dataCommas[3]);	
		console.log('roundIdNow: ' + roundIdNow);	
			let investmentHash = await addInvestment(companyLogicAddress,roundIdNow,newInvestorId,dataCommas[4],dataCommas[5],newInvestor);
			let investmentToInvestorHash = await addInvestmentToInvestor(newInvestorId,dataCommas[1],dataCommas[4],dataCommas[5],dataCommas[2]);
			let tr5;
			let countM = 0;	
			while ((tr5 == null)&&(countM < 40)){	//max 10 sec wait
				tr5 = await web3.eth.getTransactionReceipt(investorHash);
		   		sleep(250);	//0.25 second wait
				countM = countM + 1;
			}
			console.log("Count for adding the investment is: " + countM);
   			console.log("\naddInvestment TransactionHash status is: " + tr5.status);
			let newInvestorsInvestmentHash = await addInvestorsInvestment(newInvestorId,companyDataAddress,roundIdNow);
			let tr6;
			let countN = 0;	
			while ((tr6 == null)&&(countN < 40)){	//max 10 sec wait
				tr6 = await web3.eth.getTransactionReceipt(newInvestorsInvestmentHash);
		   		sleep(250);	//0.25 second wait
				countN = countN + 1;
			}
			console.log("Count for adding the investment is: " + countN);
   			console.log("\naddInvestment TransactionHash status is: " + tr6.status);
		}
		
		count = count + 1;	
	}


}

app.post('/CreateNewVote', function (req, res) {
   	console.log("********************FUNCTION:POST:CreateNewVote********************");

//check the variables have been passed up
console.log('req.body: ' + JSON.stringify(req.body));
res.json(req.body);
	console.log('Post occurred with (companyName): ' + req.body.CompanyName);	
	console.log('Post occurred with (GivenDate): ' + req.body.GivenDate);	
	console.log('Post occurred with (GivenTime): ' + req.body.GivenTime);		
	console.log('Post occurred with (Documents): ' + req.body.Documents);	
	console.log('Post occurred with (Question): ' + req.body.Question);	
	console.log('Post occurred with (Explanation): ' + req.body.Explanation);	
	console.log('Post occurred with (Option1): ' + req.body.Option1);	
	console.log('Post occurred with (Option2): ' + req.body.Option2);	
//now create the new vote
createVote(req.body.CompanyName,req.body.GivenDate,req.body.GivenTime,req.body.Documents,req.body.Question,req.body.Explanation,req.body.Option1,req.body.Option2);
});

async function createVote(thisCompanyName, givenDate, givenTime, documents, question, explanation, option1, option2){
("********************FUNCTION:CREATEVOTE********************");

//get all company contracts
	let CompanyManagementDataInst = await 	Contracts.CompanyManagementDataContract.deployed();
	let numberOfCompanies = await CompanyManagementDataInst.getNumberOfCompanyAddresses();
	console.log('numberOfCompanies' + numberOfCompanies);
	
//get list of ALL companies

//look for the one with the correct name -> get the address

//Get the attached voting contract (we will create one on data upload -> created with the company contract);
	let count = 1;
	let continuing = true;	
	let companyAddress;
	let CLContract;
	let CDContract;
	let VLContract;
	let found = false;
	while (continuing == true){
		let companyLogicAddress = await CompanyManagementDataInst.getCompanyAddress(count);
		let votingLogicAddress = await CompanyManagementDataInst.getCompanyVotingAddress(companyLogicAddress, 1); //we assume at point 1
		console.log('companyLogic address: ' + companyLogicAddress);
		console.log('votingLogicAddress: ' + votingLogicAddress);
//check if this company is active
		CLContract = web3.eth.contract(Contracts.CompanyLogicContract.abi).at(companyLogicAddress);		
		companyDataAddress = CLContract.getContractDataAddress();
		console.log('companyData address: ' + companyDataAddress);
		if ((web3.toBigNumber(companyLogicAddress).isZero())||(web3.toBigNumber(companyDataAddress).isZero())){
			console.log('No new company smart contract address found, so exiting');
			continuing = false;	
		}else {
			//check if companyName exists
			CDContract = web3.eth.contract(Contracts.CompanyDataContract.abi).at(companyDataAddress);
		companyName = CDContract.getName();	
			if ((companyName === undefined) ||
    			(companyName == null) || (companyName == 				"undefined") || companyName == ""){
				console.log('No company name found, so exiting');
				continuing = false;
			} else {
				//if it exists, check it matches the one sent
				console.log('companyName[count]: ' + count + " is 					"+companyName);
				count = count + 1;
				//check if companyName is equal to the given name. If so we have found our company.
				if (companyName == thisCompanyName){
					continuing = false;
					//create a new vote in the voting contract, if the company has been found
					addNewVoteToVotingContract(votingLogicAddress, givenDate, givenTime, question, option1, option2);
				}
			}

		}
	}

}

async function addNewVoteToVotingContract(votingLogicAddress, givenDate, givenTime, question, option1, option2){
("********************FUNCTION:ADDNEWVOTETOVOTINGCONTRACT********************");

	var VLContract = web3.eth.contract(Contracts.VotingLogicContract.abi).at(votingLogicAddress);
	let votingDataAddress = await VLContract.getContractDataAddress(); 
	let VDContract = web3.eth.contract(Contracts.VotingDataContract.abi).at(votingDataAddress);
	//get current voteId and add this vote as the next voteId
	let newVoteId = parseInt(VDContract.getNumberOfVotes())+1;
	let dateTime = givenDate + "T" + givenTime;
	console.log("dateTime" + dateTime);
	let expiry = parseInt(Date.parse(dateTime))/1000;
	console.log("expiry: " + expiry);
	console.log("newVoteId: " + newVoteId);
	console.log("question: " + question);
	console.log("option1: " + option1);
	console.log("option2: " + option2);
	//console.log("this.state.address: " + this.state.address);
	console.log("web3.eth.defaultAccount: " + web3.eth.defaultAccount);
	let owner = VLContract.getOwner();
	console.log("owner: " + owner);	
	let security = "any";

	let AddNewVoteHash = await VLContract.addANewVote(newVoteId,question,option1,option2,security,expiry,{gas: 5000000});
	
	let tr;
	let count = 0;	
	while ((tr == null)&&(count < 40)){	//max 10 sec wait
		tr = await web3.eth.getTransactionReceipt(AddNewVoteHash);
   		sleep(250);	//0.25 second wait
		count = count + 1;
	}
	console.log("Count for adding the newVote is: " + count);
	console.log("\naddNewVote TransactionHash status is: " + tr.status);

	let startVoteHash = await VLContract.setVoteStarted(newVoteId,{gas: 5000000});

	let tr2;
	let count2 = 0;	
	while ((tr2 == null)&&(count2 < 40)){	//max 10 sec wait
		tr2 = await web3.eth.getTransactionReceipt(startVoteHash);
   		sleep(250);	//0.25 second wait
		count2 = count2 + 1;
	}
	console.log("Count for changing the vote status is: " + count2);
	console.log("\nChange the vote status is: " + tr2.status);

}

//functions required:

//1. Data Import page, Upload button: Take investment data upload, parse it and add it to the live smart contracts


//2. Home page, loadup: Display the list of companies managed on the platform, and the various stats around them
app.get('/Index', function (req, res) {
	console.log('Inside GET Index');
	getIndex(req, res);
})

app.get('/InitiateEvent', function (req, res) {
   	console.log("********************FUNCTION:GET:InitiateEvent********************");
	res.render('Website2/InitiateEvent');
})

app.get('/DataImport', function (req, res) {
   	console.log("********************FUNCTION:GET:DataImport********************")
	res.render('Website2/DataImport');
})

app.get('/VoteResults', async function (req, res) {
   	console.log("********************FUNCTION:GET:VoteResults********************");

	let CompanyData = await getCompanyNamesAndNumberOfVotes();
	let CompanyNames = [];
	let count = 1;
console.log('CompanyData[0].length: ' + CompanyData[0].length);
	while (count < CompanyData[0].length){
		CompanyNames[count] = CompanyData[0][count] + " (" + CompanyData[1][count] + " votes)"; 
		console.log('companyNames[count]: ' + CompanyNames[count]);
		count = count + 1;
	}
	res.render('Website2/VoteResults', {varQuestionNumber: 'Question', varCompanies: CompanyNames, varExpirationDate: "N/A", varQuestion: "Question: N/A", varOptionOne: "Option 1: ", varOptionOnePercentage: "N/A", varOptionTwo: "Option 2: ", varOptionTwoPercentage: "N/A", varPercentageOfVoters: "N/A", varNumOfVoters: 0, varTableRows: []});
})

app.post('/LoadVoteResults', async function (req, res) {
   	console.log("********************FUNCTION:POST:LoadVoteResults********************");
	//get CompanyName
	//get VoteNumber
	console.log('req.body: ' + JSON.stringify(req.body));
	let CompanyName = req.body.CompanyName;	
	let VoteNumber = parseInt(req.body.VoteNumber);
	console.log('Post occurred with (companyName): ' + CompanyName);	
	console.log('Post occurred with (VoteNumber): ' + VoteNumber);	
	//get the required data.
	//get company contract
	//get voting contract
	let DataAddresses = await getCorrectCompanyAndVotingContract(CompanyName);
	console.log('DataAddresses[0]: ' + DataAddresses[0]);
	console.log('DataAddresses[1]: ' + DataAddresses[1]);		
	let CDContract = await web3.eth.contract(Contracts.CompanyDataContract.abi).at(DataAddresses[0]);
	let VDContract = await web3.eth.contract(Contracts.VotingDataContract.abi).at(DataAddresses[1]);
	//get question, options, expirationDate, responded, number of voters.
	//question -> votingContract
	let question = await VDContract.getVoteQuestion(parseInt(VoteNumber));
	//options -> votingContract
	let option1 = await VDContract.getVoteOptionName(VoteNumber, 1);
	let option2 = await VDContract.getVoteOptionName(VoteNumber, 2);
	//expirationDate -> votingContract 
	let expiry = await VDContract.getVoteExpiryDate(VoteNumber);
	var myObj = JSON.parse('{"date_created":"'+ expiry +'"}');
    	var expiryAsDate = new Date(1000*myObj.date_created);
	console.log('myDate.toString(): ' + expiryAsDate.toString());
	//responded -> votingContract
	let respondNum = await parseInt(VDContract.getVoterCount(VoteNumber));
	//numberOfVoters -> companyContract
	let numOfVoters = await parseInt(CDContract.getNumOfActiveInvestors());
	//option percentages
	let numOfSecurities = await parseInt(CDContract.getAllActiveSecurities());
	let option1Votes = await parseInt(VDContract.getVoteOptionTally(VoteNumber, 1));
	let option2Votes = await parseInt(VDContract.getVoteOptionTally(VoteNumber, 2)); 
	let option1Perc = parseFloat((option1Votes/numOfSecurities)*100).toFixed(2);
	let option2Perc = parseFloat((option2Votes/numOfSecurities)*100).toFixed(2);
	let respondedPerc = parseFloat((respondNum/numOfVoters)*100).toFixed(2); 
	console.log('question: ' + question);
	console.log('option1: ' + option1);
	console.log('option2: ' + option2);
	console.log('expiry: ' + expiry);
	console.log('expiryAsDate: ' + expiryAsDate);
	console.log('respondNum: ' + respondNum);
	console.log('numOfVoters: ' + numOfVoters);
	console.log('option1Votes: ' + option1Votes);
	console.log('option2Votes: ' + option2Votes);
	console.log('option1Perc: ' + option1Perc);
	console.log('option2Perc: ' + option2Perc);
 	console.log('respondedPerc: ' + respondedPerc);
	//getCompanyNames
	let CompanyData = await getCompanyNamesAndNumberOfVotes();
	let CompanyNames = [];
	let count = 1;
	console.log('CompanyData[0].length: ' + CompanyData[0].length);
	while (count < CompanyData[0].length){
		if (CompanyName == CompanyData[0][count]){
			//add at position 1
		CompanyNames[1] = CompanyData[0][count] + " (" + CompanyData[1][count] + " votes)"; 
		console.log('companyNames[1]: ' + CompanyNames[1]);
		} else {
			CompanyNames[count+1] = CompanyData[0][count] + " (" + CompanyData[1][count] + " votes)"; 
			console.log('companyNames[count]: ' + CompanyNames[count]);
		}		
		
		count = count + 1;
	}
	//get voter information
		//for each voter...
	let voterCount = 1;
	let tableRows = [];
	let InvestorManagementDataInst = await Contracts.InvestorManagementDataContract.deployed();
	while (voterCount <= respondNum){
		console.log("voterCount: " + voterCount);
		//get the ID of the voter
		let voterID = VDContract.getVoterRecorded(VoteNumber,voterCount);
		console.log("voterID: " + voterID);
		//get the name of the voter
		let voterName = await InvestorManagementDataInst.getInvestorName(parseInt(voterID));
		console.log("voterName: " + voterName);
		//get the number of his securities
		let numOfSecurities = await InvestorManagementDataInst.getInvestorTotalNumOfSecurities(parseInt(voterID),CompanyName);
		console.log("numOfSecurities: " + numOfSecurities);
		//write his response
		let voteAnswer = await VDContract.getVoteAnswerValue(parseInt(VoteNumber),parseInt(voterID));
		console.log("voteAnswer: " + voteAnswer);
		//collect information together
		tableRows[voterCount] = {UserId:voterID,Name:voterName, Securities:numOfSecurities,Response:voteAnswer};
		voterCount = voterCount + 1;
	}	

	//render the data
	console.log('Now to render'); 
	res.render('Website2/VoteResults', {varQuestionNumber: 'Question '+ VoteNumber, varCompanies: CompanyNames, varExpirationDate: expiryAsDate, varQuestion: "Question: " + question, varOptionOne: option1, varOptionOnePercentage: option1Perc.toString(), varOptionTwo: option2, varOptionTwoPercentage: option2Perc.toString(), varPercentageOfVoters: respondedPerc.toString(), varNumOfVoters: numOfVoters.toString(), varTableRows: tableRows});
})

async function getDataForVoting(DataAddresses,VoteNumber){

	console.log('(in function) DataAddresses[0]: ' + DataAddresses[0]);
	console.log('(in function) DataAddresses[1]: ' + DataAddresses[1]);


}


async function getCorrectCompanyAndVotingContract(thisCompanyName){
("********************FUNCTION:getCorrectCompanyAndVotingContract:AV1********************");

	console.log('We are looking for' + thisCompanyName);
	//get search all company contracts through the management console
	let CompanyManagementDataInst = await 	Contracts.CompanyManagementDataContract.deployed();
	let numberOfCompanies = await CompanyManagementDataInst.getNumberOfCompanyAddresses();
	console.log('(AV1) numberOfCompanies: ' + numberOfCompanies);

	let count = 1;
	let continuing = true;	
	let companyAddress;
	let CLContract;
	let CDContract;
	let VLContract;
	let found = false;
	while (continuing == true){
		let companyLogicAddress = await CompanyManagementDataInst.getCompanyAddress(count);
		let votingLogicAddress = await CompanyManagementDataInst.getCompanyVotingAddress(companyLogicAddress, 1); //we assume at point 1
		console.log('(AV1) companyLogic address: ' + companyLogicAddress);
		console.log('(AV1) votingLogicAddress: ' + votingLogicAddress);
//check if this company is active
		CLContract = web3.eth.contract(Contracts.CompanyLogicContract.abi).at(companyLogicAddress);		
		companyDataAddress = CLContract.getContractDataAddress();
		console.log('(AV1) companyData address: ' + companyDataAddress);
		if ((web3.toBigNumber(companyLogicAddress).isZero())||(web3.toBigNumber(companyDataAddress).isZero())){
			console.log('(AV1) No new company smart contract address found, so exiting');
			continuing = false;	
		}else {
			//check if companyName exists
			CDContract = web3.eth.contract(Contracts.CompanyDataContract.abi).at(companyDataAddress);
		companyName = CDContract.getName();	
			if ((companyName === undefined) ||
    			(companyName == null) || (companyName == 				"undefined") || companyName == ""){
				console.log('(AV1) No company name found, so exiting');
				continuing = false;
			} else {
				//if it exists, check it matches the one sent
				console.log('(AV1) companyName[count]: ' + count + " is 					"+companyName);
				count = count + 1;
				//check if companyName is equal to the given name. If so we have found our company.
				if (companyName.trim() == thisCompanyName.trim()){
					continuing = false;
					//return the two contract data addresses
					let VLContract = web3.eth.contract(Contracts.VotingLogicContract.abi).at(votingLogicAddress);
					let votingDataAddress = await VLContract.getContractDataAddress(); //we assume at point 1
					return [companyDataAddress,votingDataAddress];
				}
			}

		}
	}

	return["",""];

}


app.get('/CreateVote1', async function (req, res) {
   	console.log("********************FUNCTION:GET:CreateVote1********************");

	
	let CompanyData = await getCompanyNamesAndNumberOfVotes();
	let today = new Date();
	let dd = today.getUTCDate();
	let mm = today.getUTCMonth()+1;
	let yyyy = today.getUTCFullYear();
	let dateControlIs = "2018-01-12";
	console.log('DateControl is ' + dateControlIs);
	let hh = today.getUTCHours();
	let ii = today.getUTCMinutes();
	let ss = today.getUTCSeconds();
	let timeControlIs = "13:10:54";
	console.log('TimeControl is ' + timeControlIs);
	//for each company we need to get the 

  	res.render('Website2/CreateVote1', {varCompanies: CompanyData[0], dateIs: dateControlIs, timeIs: timeControlIs});

})


async function getCompanyNamesAndNumberOfVotes(){

("********************FUNCTION:getCompanyNamesAndNumberOfVotes:GC1********************");
	let CompanyManagementDataInst = await Contracts.CompanyManagementDataContract.deployed();
		let numberOfCompanies = await CompanyManagementDataInst.getNumberOfCompanyAddresses();
		console.log('(GC1) numberOfCompanies: ' + numberOfCompanies);
	//get list of ALL companies

		let companyName = [];
		let votingNumber = [];
		let count = 1;
		let continuing = true;	
		let companyAddress;
		let CLContract;
		let CDContract;
		let VLContract;
		let VDContract;
		while (continuing == true){
			let companyLogicAddress = await CompanyManagementDataInst.getCompanyAddress(count);
			let votingLogicAddress = await CompanyManagementDataInst.getCompanyVotingAddress(companyLogicAddress, 1); //we assume at point 1
			console.log('(GC1) companyLogic address: ' + companyLogicAddress);
			console.log('(GC1) votingLogicAddress: ' + votingLogicAddress);
			CLContract = web3.eth.contract(Contracts.CompanyLogicContract.abi).at(companyLogicAddress);		
			companyDataAddress = CLContract.getContractDataAddress();
			console.log('(GC1) companyData address: ' + companyDataAddress);
			if ((web3.toBigNumber(companyLogicAddress).isZero())||(web3.toBigNumber(companyDataAddress).isZero())){
				console.log('(GC1) No new company smart contract address found, so exiting');
				continuing = false;	
			}else {
				CDContract = web3.eth.contract(Contracts.CompanyDataContract.abi).at(companyDataAddress);	
			companyName[count] = CDContract.getName();	
				if ((companyName[count] === undefined) ||
	    			(companyName[count] == null) || (companyName[count] == 				"undefined") || companyName[count] == ""){
					console.log('(GC1) No company name found, so exiting');
					continuing = false;
				} else {

					console.log('(GC1) companyName[count]: ' + count + " is 					"+companyName[count]);
					//get votingData contract
					VLContract = web3.eth.contract(Contracts.VotingLogicContract.abi).at(votingLogicAddress);
					let votingDataAddress = await VLContract.getContractDataAddress();
					console.log('(GC1) votingDataAddress: ' + votingDataAddress);
					VDContract = web3.eth.contract(Contracts.VotingDataContract.abi).at(votingDataAddress);
					votingNumber[count] = VDContract.getNumberOfVotes();
					console.log('(GC1) votingNumber[count]: ' + votingNumber[count]);
					count = count + 1;
		
				}

			}
		}

	return [companyName,votingNumber];

}

app.get('/CreateVote3', function (req, res) {
   	console.log("********************FUNCTION:GET:CreateVote3********************");

	res.render('Website2/CreateVote3', {varInfoBar: ""});
})


async function getIndex(req, res){

   	console.log("********************FUNCTION:GETINDEX********************");

	let CompanyManagementDataInst = await Contracts.CompanyManagementDataContract.deployed();
	let InvestorManagementDataInst = await Contracts.InvestorManagementDataContract.deployed();	
	console.log("CompanyManagementDataInst address is: " + CompanyManagementDataInst.address);
	console.log("InvestorManagementDataInst address is: " + InvestorManagementDataInst.address); 
	let numberOfCompanies = await CompanyManagementDataInst.getNumberOfCompanyAddresses();
	console.log("numberOfCompanies is:" + numberOfCompanies);	
		
//get list of ALL companies

	let companyName = [];
	let companySecurityTotal = [];
	let companyActiveInvestors = [];
	let count = 1;
	let continuing = true;	
	let CLContract;
	let CDContract;
	let tableRows = [];
	while (continuing == true){
	console.log("***Loop number: " + count + "***"); 
		let companyLogicAddress = await CompanyManagementDataInst.getCompanyAddress(count);
		console.log('companyLogic address: ' + companyLogicAddress);
		CLContract = web3.eth.contract(Contracts.CompanyLogicContract.abi).at(companyLogicAddress);		
		let companyDataAddress = CLContract.getContractDataAddress();
		console.log('companyData address: ' + companyDataAddress);
		if ((web3.toBigNumber(companyLogicAddress).isZero())||(web3.toBigNumber(companyDataAddress).isZero())){
			console.log('No new company smart contract address found, so exiting');
			continuing = false;	
		}else {
			CDContract = web3.eth.contract(Contracts.CompanyDataContract.abi).at(companyDataAddress);	
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

	let numberOfInvestors = await InvestorManagementDataInst.getNumOfActiveInvestors();		
	let numberOfSecurities = await InvestorManagementDataInst.getAllActiveSecurities();
	console.log("numberOfInvestors is:" + numberOfInvestors);
	console.log("numberOfSecurities is:" + numberOfSecurities);
	
	res.render('Website2/index', {varCompaniesUnderManagement: numberOfCompanies, varSecurityHoldersUnderManagement: numberOfInvestors, varSecurityUnderManagement: numberOfSecurities, varValueOfSecurities: 0, varPendingTransfers: 0, varTableRows:tableRows});
}



async function deployCompanyData(){

   	console.log("********************FUNCTION:DEPLOYCOMPANYDATA********************");
	let companyDataContract = web3.eth.contract(Contracts.CompanyDataContract.abi);
	let companyData = await companyDataContract.new(
	   {
	     from: web3.eth.accounts[0], 
	     data: Contracts.CompanyDataContract.bytecode,
	     gas: '5000000'
	   });
	console.log("companyData transaction Hash to return: " + companyData.transactionHash);
	return companyData.transactionHash;
}

async function deployCompanyLogicContract(companyDataTransactionHash){

   	console.log("********************FUNCTION:DEPLOYCOMPANYLOGIC********************");
	console.log("companyDataTransactionHash: " + companyDataTransactionHash);
   	let tr = null;
	let count = 0;
	while ((tr == null)&&(count < 40)){	//max 10 sec wait
		tr = await web3.eth.getTransactionReceipt(companyDataTransactionHash);
   		sleep(250);	//0.25 second wait
		count = count + 1;
	}
	console.log("\nCompanyData TransactionHash status is: " + tr.status);
	console.log("\ncount finished at: " + count);
	let companyDataAddress = tr.contractAddress;   	
	console.log("\nCompanyData contractAddress is: " + companyDataAddress);
  
	if (companyDataAddress == 'undefined'){

		console.log('There has been a problem deploying the CompanyData contract');	
		return ["",""];

	} else {

		let companyLogicContract = web3.eth.contract(Contracts.CompanyLogicContract.abi);
		let companyLogic = companyLogicContract.new(
		   companyDataAddress,
		   {
		     from: web3.eth.accounts[0], 
		     data: Contracts.CompanyLogicContract.bytecode,
		     gas: '5000000'
		   });
		console.log("companyData transaction Hash to return: " + companyLogic.transactionHash);
	return [companyDataAddress,companyLogic.transactionHash];
	}

}

async function setCompanyDataOwner(companyDataAddress,companyLogicTransactionHash){
   	console.log("********************FUNCTION:SETCOMPANYOWNER********************");
	let tr2;
	let count = 0;	
	while ((tr2 == null)&&(count < 40)){	//max 10 sec wait
		tr2 = await web3.eth.getTransactionReceipt(companyLogicTransactionHash);
   		sleep(250);	//0.25 second wait
		count = count + 1;
	}
   	console.log("\nCompanyLogic TransactionHash status is: " + tr2.status);
	console.log("\ncount finished at: " + count);
	let companyLogicAddress = tr2.contractAddress;   	
	console.log("\nCompanyLogic contractAddress is: " + companyLogicAddress);

	if (companyLogicAddress == 'undefined'){

		console.log('There has been a problem deploying the companyLogicAddress');
		return ["",""];	

	}

	console.log('contractAddress: ' + companyDataAddress);
	let CDContract = web3.eth.contract(Contracts.CompanyDataContract.abi).at(companyDataAddress);
	
	try{

		CDContract.setOwner(companyLogicAddress,{gas: 4700000}, function(error, result){
			if (!error) {
				console.log('The ownership of the companyData contract has been given to the companyLogic contract! Transaction Hash:  ' + result);
				//addCompanyInfo(companyId,companyName,companyDataAddress,companyLogicAddress);
			} else {
				console.log('ERROR when changing the ownership of the new companyData contract: ' + error);
			}
		});

	}catch(err) {
		console.log("err.message:" + err.message);

	}

	return[companyDataAddress,companyLogicAddress];

}

async function addCompanyInfo(companyId,companyName,companyLogicAddress){
   	console.log("********************FUNCTION:ADDCOMPANYINFO********************");
	let CLContract = web3.eth.contract(Contracts.CompanyLogicContract.abi).at(companyLogicAddress);
	console.log('companyLogicAddress: ' + companyLogicAddress);
	let owner = CLContract.getOwner();
	console.log('CLContract owner: ' + owner);

try{

	CLContract.setCompanyInfo(companyId, companyName,{gas: 4700000}, function(error, result){
		if (!error) {
			console.log('The new company info has been added! Transaction Hash:  ' + result);	
		} else {
			console.log('ERROR when adding the companyInfo to the new CompanyLogic contract: ' + error);
		}
	});

}catch(err) {

  console.log("err.message:" + err.message);

}


}

async function deployVotingData(companyDataAddress){

   	console.log("********************FUNCTION:DEPLOYVOTINGDATA********************");
	let votingDataContract = web3.eth.contract(Contracts.VotingDataContract.abi);
	let votingData = votingDataContract.new(
	   {
	     from: web3.eth.accounts[0], 
	     data: Contracts.VotingDataContract.bytecode,
	     gas: '5000000'
	   });
	
	console.log("votingData transaction Hash to return: " + votingData.transactionHash);
	return votingData.transactionHash;

}

async function deployVotingLogicContract(votingDataTransactionHash){

   	console.log("********************FUNCTION:DEPLOYVOTINGLOGIC********************");
   	let tr;
	let count = 0;
	while ((tr == null)&&(count < 40)){	//max 10 sec wait
		tr = await web3.eth.getTransactionReceipt(votingDataTransactionHash);
   		sleep(250);	//0.25 second wait
		count = count + 1;
	}
   	console.log("\nVotingData TransactionHash status is: " + tr.status);
	console.log("\ncount finished at: " + count);	
	let votingDataAddress = tr.contractAddress;   	
	console.log("\nVotingData contractAddress is: " + votingDataAddress);
	let InvestorManagementDataInst = await Contracts.InvestorManagementDataContract.deployed();	
	console.log("InvestorManagementDataInst address is: " + InvestorManagementDataInst.address); 
	
	if (votingDataAddress == 'undefined'){

		console.log('There has been a problem deploying the VotingData contract');
	return ["",""];	

	} else {

		let votingLogicContract = web3.eth.contract(Contracts.VotingLogicContract.abi);
		let votingLogic = votingLogicContract.new(
		   votingDataAddress,
		   InvestorManagementDataInst.address,
		   {
		     from: web3.eth.accounts[0], 
		     data: Contracts.VotingLogicContract.bytecode,
		     gas: '5000000'
		   });
		console.log("votingData transaction Hash to return: " + votingLogic.transactionHash);
		return [votingDataAddress,votingLogic.transactionHash];
	}

	return ["",""];
}

async function setVotingDataOwner(votingDataAddress,votingLogicTransactionHash){
   	console.log("********************FUNCTION:SETVOTINGOWNER********************");
	let tr2;
	let count = 0;	
	while ((tr2 == null)&&(count < 40)){	//max 10 sec wait
		tr2 = await web3.eth.getTransactionReceipt(votingLogicTransactionHash);
   		sleep(250);	//0.25 second wait
		count = count + 1;
	}
   	console.log("\nVotingLogic TransactionHash status is: " + tr2.status);
	let votingLogicAddress = tr2.contractAddress;   	
	console.log("\nVotingLogic contractAddress is: " + votingLogicAddress);

	if (votingLogicAddress == 'undefined'){

		console.log('There has been a problem deploying the votingLogic contract');
		return ["",""];	

	}

	console.log('votingData contractAddress: ' + votingDataAddress);
	let VDContract = web3.eth.contract(Contracts.VotingDataContract.abi).at(votingDataAddress);
	
	try{

		VDContract.setOwner(votingLogicAddress,{gas: 5000000}, function(error, result){
			if (!error) {
				console.log('The ownership of the votingData contract has been given to the votingLogic contract! Transaction Hash:  ' + result);
			} else {
				console.log('ERROR when changing the ownership of the new votingData contract: ' + error);
			}
		});

	}catch(err) {
		console.log("err.message:" + err.message);

	}
	return[votingDataAddress,votingLogicAddress];

}

async function addCompanyAndVoteToCompanyManagement(companyLogicAddress,companyContractNumber,votingLogicAddress,votingContractNumber){
   	console.log("********************FUNCTION:ADDCOMPANYANDVOTETOCOMPANYMANAGEMENT********************");
	let CompanyManagementLogicInst = await 	Contracts.CompanyManagementLogicContract.deployed();
	console.log('CompanyManagementLogicInst: ' + CompanyManagementLogicInst.address);
	console.log('companyLogicAddress: ' + companyLogicAddress);
	console.log('companyContractNumber: ' + companyContractNumber);
	console.log('votingLogicAddress: ' + votingLogicAddress);
	console.log('votingContractNumber: ' + votingContractNumber);


	let CMLContract = web3.eth.contract(Contracts.CompanyManagementLogicContract.abi).at(CompanyManagementLogicInst.address);
	let waitingForHash = await CMLContract.addNewCompany(companyLogicAddress,parseInt(companyContractNumber),votingLogicAddress,parseInt(votingContractNumber),{gas: 5000000});
	console.log("waitingForHash is: " + waitingForHash);
	return waitingForHash;

}

async function createRound(companyLogicAddress,roundId,roundName){
	//round is in CompanyData contract
	console.log("********************FUNCTION:CREATEROUND********************");
	console.log('companyLogicAddress: ' + companyLogicAddress);
	console.log('roundId: ' + roundId);
	console.log('roundName: ' + roundName);
	let CLContract = web3.eth.contract(Contracts.CompanyLogicContract.abi).at(companyLogicAddress);

try{

	let createRoundHash = await CLContract.addNewRound(parseInt(roundId),roundName,{gas: 4700000});
	console.log('createRoundHash: ' + createRoundHash);
	return createRoundHash;

}catch(err) {

	console.log("err.message:" + err.message);

}

}

async function addInvestor(newInvestorId,newName){
	//investors are in the InvestmentManagementData contract
	console.log("********************FUNCTION:ADDINVESTOR********************");
	let InvestorManagementLogicInst = await 	Contracts.InvestorManagementLogicContract.deployed();
	console.log('newInvestorId: ' + newInvestorId);
	console.log('newName: ' + newName);

let IMLContract = web3.eth.contract(Contracts.InvestorManagementLogicContract.abi).at(InvestorManagementLogicInst.address);
	let waitingForHash = await IMLContract.addNewInvestor(parseInt(newInvestorId),newName,{gas: 5000000});
	console.log("creating Investor ("+newName+") and TransHash is: " + waitingForHash);
	return waitingForHash;
	
}

async function addInvestment(companyLogicAddress,roundId,investorId,numSecurities,securityType,newInvestor){
	//investments are in the CompanyData contract
	console.log("********************FUNCTION:ADDINVESTMENT********************");
	console.log('companyLogicAddress: ' + companyLogicAddress);
	console.log('roundId: ' + roundId);
	console.log('investorId: ' + investorId);
	console.log('numSecurities: ' + numSecurities);
	console.log('securityType: ' + securityType);
	console.log('newInvestor: ' + newInvestor);
	let CLContract = web3.eth.contract(Contracts.CompanyLogicContract.abi).at(companyLogicAddress);

	let createInvestmentHash = await CLContract.addNewInvestment(parseInt(roundId),parseInt(investorId),parseInt(numSecurities),securityType,newInvestor,{gas: 5000000});
	console.log("creating Investment (roundId:"+roundId+",investorId"+investorId+") and TransHash is: " + createInvestmentHash);
	return createInvestmentHash;
}

async function addInvestmentToInvestor(investorId,investorName,number,security,companyName){
	//investments are in the CompanyData contract
	console.log("********************FUNCTION:ADDINVESTMENTTOINVESTOR********************");
	console.log('investorId: ' + investorId);
	console.log('investorName: ' + investorName);
	console.log('number: ' + number);
	console.log('security: ' + security);
	let InvestorManagementLogicInst = await 	Contracts.InvestorManagementLogicContract.deployed();
	let IMLContract = web3.eth.contract(Contracts.InvestorManagementLogicContract.abi).at(InvestorManagementLogicInst.address);

	let createInvestHash = await IMLContract.changeInvestorSecurityCount(parseInt(investorId),investorName,true,parseInt(number),companyName,{gas: 5000000});
	console.log("Adding investment to investor and TransHash is: " + createInvestHash);
	return createInvestHash;
}

async function addInvestorsInvestment(investorId,companyDataAddress,roundId){
	//investments are in the CompanyData contract
	console.log("********************FUNCTION:ADDINVESTORSINVESTMENT********************");
	console.log('investorId: ' + investorId);
	console.log('companyDataAddress: ' + companyDataAddress);
	console.log('roundId: ' + roundId);
	let InvestorManagementLogicInst = await 	Contracts.InvestorManagementLogicContract.deployed();
	let IMLContract = web3.eth.contract(Contracts.InvestorManagementLogicContract.abi).at(InvestorManagementLogicInst.address);

	let createInvestHash = await IMLContract.addInvestorsInvestment(parseInt(investorId),companyDataAddress,parseInt(roundId),{gas: 5000000});
	console.log("Adding investor's investment and TransHash is: " + createInvestHash);
	return createInvestHash;
}

async function getRoundId(companyDataAddress,roundName){

	console.log('companyDataAddress: ' + companyDataAddress);
	console.log('roundName: ' + roundName);
	let CDContract = web3.eth.contract(Contracts.CompanyDataContract.abi).at(companyDataAddress);

	let roundId = await CDContract.getRoundId(roundName);
	console.log("RoundName:"+roundName+", maps to: " + roundId);
	return roundId;

}

function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}

console.log('At end of file');
//3. Create New Vote 3, submit button: Setup a vote if submitted correctly. Use smart contract validations and convert them to user messages

//4. Vote Page: Allow a user to vote if the details are correct

//5. Report/Results page, loadup: List of users, whether they have voted, and the current interim stats.
