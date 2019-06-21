
var ContractManagementData = artifacts.require("./CompanyManagementData.sol");

module.exports = function(deployer) {
    deployer.deploy(ContractManagementData);
};
