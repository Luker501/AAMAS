pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CompanyManagementData.sol";
import "../contracts/CompanyManagementLogic.sol";

contract TestCompanyManagementContracts {
 // The address of the CompanyManagementData contract to be tested
 CompanyManagementData cmd = CompanyManagementData(DeployedAddresses.CompanyManagementData());

 // The address of the CompanyManagementLogic contract to be tested
 CompanyManagementLogic cml = CompanyManagementLogic(DeployedAddresses.CompanyManagementLogic());

// Testing the companyManagement connections function
function testAreCompanyManagementContractsConnected() public {	
	 //The expected data address of cml
	 address currentDataAddress = cml.getContractDataAddress();
	Assert.equal(currentDataAddress, address(cmd), "Data Address should be pointed at by the CompanyManagementLogic contract.");

}

// Testing that the owner of the companyManagementData contract is the logic contract
function testDataContractOwner() public {
  	address currentOwner = cmd.getOwner();	
	Assert.equal(currentOwner, address(cml), "Logic contract should be the owner of the CompanyManagementData contract.");

}


}
