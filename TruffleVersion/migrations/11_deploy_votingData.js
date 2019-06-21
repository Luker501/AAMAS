
var VotingData = artifacts.require("./VotingData.sol");
var CompanyData = artifacts.require("./CompanyData.sol");

module.exports = async function(deployer) {
	let instance = await CompanyData.deployed();
	console.log("CompanyData address is: " + instance.address); 
	return deployer.deploy(VotingData,instance.address);
};
