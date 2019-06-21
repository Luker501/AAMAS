
var VotingLogic = artifacts.require("./VotingLogic.sol");
var VotingData = artifacts.require("./VotingData.sol");
var InvestorManagementData = artifacts.require("./InvestorManagementData.sol");


module.exports = async function(deployer) {
	let VotingDataInstance = await VotingData.deployed();
	console.log("VotingData address is: " + VotingDataInstance.address); 
	let InvestorManagementDataInstance = await InvestorManagementData.deployed();
	console.log("InvestorManagementData address is: " + InvestorManagementData.address); 
	return deployer.deploy(VotingLogic,VotingDataInstance.address,InvestorManagementData.address);

	
};
