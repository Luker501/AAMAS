
var ContractManagementLogic = artifacts.require("./CompanyManagementLogic.sol");
var ContractManagementData = artifacts.require("./CompanyManagementData.sol");

module.exports = async function(deployer) {
	let DataInstance = await ContractManagementData.deployed();
	let LogicInstance = await ContractManagementLogic.deployed();	
	console.log("CompanyManagementData address is: " + DataInstance.address); 
	console.log("CompanyManagementLogic address is: " + LogicInstance.address); 
	return DataInstance.setOwner(LogicInstance.address);

	//then we need to allow the contractManagementLogic to be the owner of the data contract.

	
};
