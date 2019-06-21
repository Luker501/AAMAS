
var InvestorManagementLogic = artifacts.require("./InvestorManagementLogic.sol");
var InvestorManagementData = artifacts.require("./InvestorManagementData.sol");

module.exports = async function(deployer) {
	let DataInstance = await InvestorManagementData.deployed();
	let LogicInstance = await InvestorManagementLogic.deployed();	
	console.log("InvestorManagementData address is: " + DataInstance.address); 
	console.log("InvestorManagementLogic address is: " + LogicInstance.address); 
	return DataInstance.setOwner(LogicInstance.address);

	//then we need to allow the contractManagementLogic to be the owner of the data contract.

};
