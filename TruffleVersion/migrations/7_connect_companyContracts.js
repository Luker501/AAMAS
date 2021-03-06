
var ContractLogic = artifacts.require("./CompanyLogic.sol");
var ContractData = artifacts.require("./CompanyData.sol");

module.exports = async function(deployer) {
	let DataInstance = await ContractData.deployed();
	let LogicInstance = await ContractLogic.deployed();	
	console.log("CompanyData address is: " + DataInstance.address); 
	console.log("CompanyLogic address is: " + LogicInstance.address); 
	return DataInstance.setOwner(LogicInstance.address);

	//then we need to allow the contractManagementLogic to be the owner of the data contract.

};
