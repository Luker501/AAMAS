pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/InvestorManagementData.sol";
import "../contracts/InvestorManagementLogic.sol";

contract TestInvestorManagementContracts {
 // The address of the CompanyManagementData contract to be tested
 InvestorManagementData imd = InvestorManagementData(DeployedAddresses.InvestorManagementData());

 // The address of the CompanyManagementLogic contract to be tested
 InvestorManagementLogic iml = InvestorManagementLogic(DeployedAddresses.InvestorManagementLogic());

// Testing the companyManagement connections function
function testAreInvestorManagementContractsConnected() public {	
	 //The expected data address of cml
	 address currentDataAddress = iml.getContractDataAddress();
	Assert.equal(currentDataAddress, address(imd), "InvestorManagementData Address should be pointed at by the InvestorManagementLogic contract.");

}

// Testing that the owner of the companyManagementData contract is the logic contract
function testDataContractOwner() public {
  	address currentOwner = imd.getOwner();	
	Assert.equal(currentOwner, address(iml), "Logic contract should be the owner of the CompanyManagementData contract.");

}


}
