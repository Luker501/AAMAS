
var InvestorManagementData = artifacts.require("./InvestorManagementData.sol");
var InvestorManagementLogic = artifacts.require("./InvestorManagementLogic.sol");

module.exports = async function(deployer) {
	let instance = await InvestorManagementData.deployed();
	console.log("InvestorManagementData address is: " + instance.address); 
	return deployer.deploy(InvestorManagementLogic,instance.address);

	
};
