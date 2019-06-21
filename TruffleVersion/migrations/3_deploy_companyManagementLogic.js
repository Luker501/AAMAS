
var ContractManagementLogic = artifacts.require("./CompanyManagementLogic.sol");
var ContractManagementData = artifacts.require("./CompanyManagementData.sol");

module.exports = async function(deployer) {
	let instance = await ContractManagementData.deployed();
	console.log("CompanyManagementData address is: " + instance.address); 
	return deployer.deploy(ContractManagementLogic,instance.address);

	//then we need to allow the contractManagementLogic to be the owner of the data contract.

	
};
