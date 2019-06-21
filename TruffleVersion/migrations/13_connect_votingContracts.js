
var VotingLogic = artifacts.require("./VotingLogic.sol");
var VotingData = artifacts.require("./VotingData.sol");

module.exports = async function(deployer) {
	let DataInstance = await VotingData.deployed();
	let LogicInstance = await VotingLogic.deployed();	
	console.log("VotingData address is: " + DataInstance.address); 
	console.log("VotingLogic address is: " + LogicInstance.address); 
	return DataInstance.setOwner(LogicInstance.address);

	//then we need to allow the contractManagementLogic to be the owner of the data contract.

};
