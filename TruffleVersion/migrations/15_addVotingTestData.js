
var CompanyLogic = artifacts.require("./CompanyLogic.sol");
var CompanyManagementLogic = artifacts.require("./CompanyManagementLogic.sol");
var VotingLogic = artifacts.require("./VotingLogic.sol");
var VotingData = artifacts.require("./VotingData.sol");

module.exports = async function(deployer) {
	let CompanyLogicInstance = await CompanyLogic.deployed();
	let CompanyManagementLogicInstance = await CompanyManagementLogic.deployed();	
	let VotingLogicInstance = await VotingLogic.deployed();
	let VotingDataInstance = await VotingData.deployed();		
	console.log("CompanyLogicInstance address is: " + CompanyLogicInstance.address); 
	console.log("CompanyManagementLogicInstance address is: " + CompanyManagementLogicInstance.address); 
	console.log("VotingLogicInstance address is: " + VotingLogicInstance.address); 
	console.log("VotingDataInstance address is: " + VotingDataInstance.address); 
	let owner = await VotingLogicInstance.getOwner();
	console.log("Owner: " + owner);
	let numOfVotes = await VotingDataInstance.getNumberOfVotes();
	console.log("numOfVotes: " + numOfVotes);
	//add to current votingLogic contract (this is our test contract! -> we can currently only migrate one of this type, all other instances of this type will have to be made on the fly in the standard web3 way)
	var datum = new Date(Date.UTC('2019','02','13','12','31','30'));
	var timestamp =  parseInt(datum.getTime()/1000);
	console.log("timestamp: " + timestamp);
	return VotingLogicInstance.addANewVote(1, 'Test question', 'First option', 'Second option', 'any', 10, {from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d", gas: 5000000});
	
};
