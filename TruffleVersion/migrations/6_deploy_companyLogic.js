
var ContractLogic = artifacts.require("./CompanyLogic.sol");
var ContractData = artifacts.require("./CompanyData.sol");

module.exports = async function(deployer) {
	let instance = await ContractData.deployed();
	console.log("CompanyData address is: " + instance.address); 
	return deployer.deploy(ContractLogic,instance.address);

	
};
