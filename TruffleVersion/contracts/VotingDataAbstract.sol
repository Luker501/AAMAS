//Solidity online complier: https://remix.ethereum.org/

pragma solidity ^0.5.0;

//** This contract holds information on different votes that occur in the company, specifically:
// - The vote question
// - The vote options
// - The different vote answers (ballots)
// - The vote expiry date
// - The related company
//**

contract VotingDataAbstract {
    
    /******** Start of Functions  *********/

    /*********************Start of SET functions**************************************************/
    
    function setOwner(address newOwner) external;
    
    function setLinkedCompany(address newLinkedCompany) external;
    
    function setExpiryDate(uint voteId, uint newExpiryDate) external;
    
    function setSecurityType(uint voteId, uint securityId, string calldata newSecurityType) external;
    
    function setVoteQuestion(uint voteId, string calldata newQuestion) external;
    
    function setVoteOption(uint voteId, uint optionId, string calldata newVoteOption) external;
    
    function setVoteOptionCount(uint voteId, bool add, uint number) external;
    
    function setVoteAnswer(uint voteId, uint investorId, uint256 newDate, string calldata newValue) external;
    
    function setVoterRecorded(uint voteId, uint voterId, uint investorId) external;
    
    function setVoterCount(uint voteId, bool add, uint number) external;
    
    function setVoteStarted(uint voteId) external;
    
    function setVoteFinished(uint voteId) external;
    
    function setVoteOptionTally(uint voteId, uint voteOptionId, bool add, uint number) external;
    
    function ChangeVoteCount(bool add, uint number) external;
    
    /***********************End of SET functions**************************************************/


    /*********************Start of GET functions**************************************************/
    
    function getOwner() public view returns (address);
    
    function getLinkedCompany() public view returns (address);
    
    function getVoteExpiryDate(uint voteId) public view returns (uint256);
    
    function getVoteSecurityType(uint voteId, uint securityTypeId) public view returns (string memory);
    
    function getVoteQuestion(uint voteId) public view returns (string memory);
    
    function getVoteOptionName(uint voteId, uint voteOptionId) public view returns (string memory);
    
    function getVoteOptionTally(uint voteId, uint voteOptionId) public view returns (uint);
    
    function getVoteOptionCount(uint voteId) public view returns (uint);
    
    function getVoteAnswerDate(uint voteId, uint investorId) public view  returns (uint256);
    
    function getVoteAnswerValue(uint voteId, uint investorId) public view  returns (string memory);
    
    function getVoterRecorded(uint voteId, uint investorId) public view  returns (uint);
    
    function getVoterCount(uint voteId) public view  returns (uint);
    
    function getVoteStarted(uint voteId) public view  returns (bool);
    
    function getVoteFinished(uint voteId) public view  returns (bool);
    
    function getNumberOfVotes() public view  returns(uint);
    
    
    /***********************End of GET functions**************************************************/
    
}
