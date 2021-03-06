pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/VotingData.sol";
import "../contracts/VotingLogic.sol";


contract TestVotingContracts {
 // The address of the CompanyManagementData contract to be tested
 VotingData vd = VotingData(DeployedAddresses.VotingData());

 // The address of the CompanyManagementLogic contract to be tested
 VotingLogic vl = VotingLogic(DeployedAddresses.VotingLogic());

  event information(string info, address thisAddress);

// Testing the voting connections function
function testAreVotingContractsConnected() public {	
	 //The expected data address of vl
	 address currentDataAddress = vl.getContractDataAddress();
	Assert.equal(currentDataAddress, address(vd), "VotingData Address should be pointed at by the VotingLogic contract.");

}

// Testing that the owner of the votingData contract is the logic contract
function testDataContractOwner() public {
  	address currentOwner = vd.getOwner();
	emit information("CurrentOwner is: ", currentOwner);	
	Assert.equal(currentOwner, address(vl), "VotingLogic contract should be the owner of the VotingData contract.");

}

//Testing that the companyData address is stored in the VotingData contract
function testCompanyDataLinked() public {
  	address currentCompanyData = vd.getLinkedCompany();
	emit information("currentCompanyData is: ", currentCompanyData);	
	Assert.equal(currentCompanyData, DeployedAddresses.CompanyData(), "The CompanyData contract address should be stored in the VotingData contract.");

}

//test investorManagementData in VotingLogic
function testinvestorManagementDataLinked() public {
  	address currentInvestorManagementData = vl.getCurrentInvestorDataAddress();	
	Assert.equal(currentInvestorManagementData, DeployedAddresses.InvestorManagementData(), "The InvestorManagementData contract address should be stored in the VotingLogic contract.");

}

//test question is correct
function testQuestionIsLoaded() public {
    string memory question = vd.getVoteQuestion(1);
	Assert.equal(question, "Test question", "The test question should be stored in the VotingData contract.");
    
}

//test first option is correct
function testOption1IsLoaded() public {
    string memory option1 = vd.getVoteOptionName(1, 1);
	Assert.equal(option1, "First option", "The first option should be stored in the VotingData contract.");
    
}

//test second option is correct
function testOption2IsLoaded() public {
    string memory option2 = vd.getVoteOptionName(1, 2);
	Assert.equal(option2, "Second option", "The first option should be stored in the VotingData contract.");
    
}

//test securityType is correct
function testSecurityTypeIsLoaded() public {
    string memory security = vd.getVoteSecurityType(1, 1);
	Assert.equal(security, "any", "The security type should be stored in the VotingData contract.");
    
}

//test expiryDate is correct
function testExpiryTimeIsLoaded() public {
    uint expiry = vd.getVoteExpiryDate(1);
	Assert.equal(expiry, 10, "The security type should be stored in the VotingData contract.");
    
}
}
