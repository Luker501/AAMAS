
var InvestorManagementData = artifacts.require("./InvestorManagementData.sol");

module.exports = function(deployer) {
    deployer.deploy(InvestorManagementData);
};
