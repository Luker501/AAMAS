pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CompanyData.sol";
import "../contracts/CompanyLogic.sol";

contract TestCompanyContracts {
 // The address of the CompanyData contract to be tested
 CompanyData cd = CompanyData(DeployedAddresses.CompanyData());

 // The address of the CompanyLogic contract to be tested
 CompanyLogic cl = CompanyLogic(DeployedAddresses.CompanyLogic());

// Testing the company connections function
function testAreCompanyContractsConnected() public {	
	 //The expected data address of cml
	 address currentDataAddress = cl.getContractDataAddress();
	Assert.equal(currentDataAddress, address(cd), "CompanyData Address should be pointed at by the CompanyLogic contract.");

}

// Testing that the owner of the companyData contract is the logic contract
function testDataContractOwner() public {
  	address currentOwner = cd.getOwner();	
	Assert.equal(currentOwner, address(cl), "CompanyLogic contract should be the owner of the CompanyData contract.");

}


}
