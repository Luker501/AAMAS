pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CompanyManagementData.sol";
import "../contracts/CompanyLogic.sol";
import "../contracts/VotingLogic.sol";

contract TestCompanyAddedToCompanyManagement {
 // The address of the CompanyManagementData contract to be tested
 CompanyManagementData cmd = CompanyManagementData(DeployedAddresses.CompanyManagementData());

 // The address of the CompanyLogic contract to be tested
 CompanyLogic cl = CompanyLogic(DeployedAddresses.CompanyLogic());

 // The address of the CompanyLogic contract to be tested
 VotingLogic vl = VotingLogic(DeployedAddresses.VotingLogic());

// Testing the addition of the company logic contract
function testIsACompanyRegistered() public {	
	 uint howManyCompanies = cmd.getNumberOfCompanyAddresses();
	Assert.equal(howManyCompanies, 1, "There should have been one company added (through the migration).");

}

// Testing the addition of the company logic contract
function testIsTheCorrectCompanyRegistered() public {	
	 //The expected data address of company logic contract
	address companyAddress = cmd.getCompanyAddress(1);
	Assert.equal(companyAddress, address(cl), "The migrated companyLogic contract should be connected to the companyManagementLogic contract");

}
 
// Testing the addition of the voting logic contract
function testIsAVotingContractRegistered() public {	
	uint howManyVotingContracts = cmd.getCompanyNumberOfVotingContracts(address(cl));
	Assert.equal(howManyVotingContracts, 1, "There should have been one voting contract added (through the migration).");

}

// Testing the addition of the voting logic contract
function testIsTheCorrectVotingContractRegistered() public {	
	 //The expected data address of company logic contract
	address votingAddress = cmd.getCompanyVotingAddress(address(cl), 1);
	Assert.equal(votingAddress, address(vl), "The migrated votingLogic contract should be connected");

}

// Testing the addition of the voting logic contract as being used
function testIsTheCorrectVotingContractUsed() public {	
	 //The expected data address of company logic contract
	bool votingConUsed = cmd.getCompanyVotingContractUsed(address(cl), address(vl));
	Assert.equal(votingConUsed, true, "The migrated votingLogic contract was used");

}

}
