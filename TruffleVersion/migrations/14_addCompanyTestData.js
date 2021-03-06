
var CompanyLogic = artifacts.require("./CompanyLogic.sol");
var CompanyManagementLogic = artifacts.require("./CompanyManagementLogic.sol");
var VotingLogic = artifacts.require("./VotingLogic.sol");

module.exports = async function(deployer) {
	let CompanyLogicInstance = await CompanyLogic.deployed();
	let CompanyManagementLogicInstance = await CompanyManagementLogic.deployed();	
	let VotingLogicInstance = await VotingLogic.deployed();	
	console.log("CompanyLogicInstance address is: " + CompanyLogicInstance.address); 
	console.log("CompanyManagementLogicInstance address is: " + CompanyManagementLogicInstance.address); 
	console.log("VotingLogicInstance address is: " + VotingLogicInstance.address); 

	//add to current companyLogic contract (this is our test contract! -> we can currently only migrate one of this type, all other instances of this type will have to be made on the fly in the standard web3 way)
	CompanyLogicInstance.setCompanyInfo(1, "Test Company Name");
	
	//then add company logic to company management logic
	return CompanyManagementLogicInstance.addNewCompany(CompanyLogicInstance.address, 1, VotingLogicInstance.address, 1);

};
