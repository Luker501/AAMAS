pragma solidity ^0.5.0;
import "./VotingData.sol";
import "./InvestorManagementData.sol";

//** This contract holds information on:

contract VotingLogic {
    
    //holds the address of the contract creator
    address public Owner; 
       //The current VotingData contract
    VotingData CurrentVotingData;
    InvestorManagementData CurrentInvestorData;
    
    /******** Start of modifiers *********/
	
	//** any function containing this modifier, only allows the contract owner to call it**//
	modifier ifOwner(){
        if(Owner != msg.sender){
            revert("Not the contract owner");
        }else{
            _; //means continue on the functions that called it
        }
    }
    
    //the given voteId cannot be more than 1 ahead of the current count
    modifier voteIdOk(uint voteId){
        uint currentVoteId = CurrentVotingData.getNumberOfVotes();
        if (currentVoteId + 1 < voteId){
            revert("The given voteId cannot be more than 1 ahead of the current count");
        } else{
            _; //carry on
        }
    }
	
	/******** End of Modifiers  *********/
	
	/******** Start of blockchain events *********/
	
	//event fires when the contract has been added to the blockchain
	event NewVoter(string s, uint voteId, uint investorId, uint newDate, string selectedOption, uint currentVoterId);
	
	/******** End of blockchain events *********/
	
	//** The constructor sets the smart contract owner as the address that put the create contract transaction onto the blockchain**//
    constructor (address votingDataContract, address investorManagementContract) public {
    
            Owner = msg.sender;
            CurrentVotingData = VotingData(votingDataContract);
            CurrentInvestorData = InvestorManagementData(investorManagementContract);
            
    }  
    
    function upgradeVotingDataContract(address thisCurrentVotingData) external ifOwner {
        CurrentVotingData = VotingData(thisCurrentVotingData);
    }
    
    
    function upgradeInvestorDataContract(address thisCurrentInvestorData) external ifOwner {
        CurrentInvestorData = InvestorManagementData(thisCurrentInvestorData);
    }
    
    /*********************Start of SET functions**************************************************/
    
    function setOwner(address newOwner) external ifOwner() {
        
        CurrentVotingData.setOwner(newOwner);
        
    } 
    
    function setLinkedCompany(address newLinkedCompany) external ifOwner() {
        
       CurrentVotingData.setLinkedCompany(newLinkedCompany);
        
    }
    
    function incrementVoteId(uint voteId) internal view returns(bool) {
        //get realVoteId
        uint currentVoteId = CurrentVotingData.getNumberOfVotes();
        
        //if voterId is +1 of current voterId then yes but the counter needs to be updated
        if (currentVoteId + 1 == voteId){
            return true;
        }
        //if voterId is <= voterId then thats fine
        if (currentVoteId + 1 < voteId){
            return false;
        }
    }
    
    function setExpiryDate(uint voteId, uint newExpiryDate) external ifOwner() voteIdOk(voteId) {
    
        //check if the vote has started
        bool started = CurrentVotingData.getVoteStarted(voteId);
        if (started == false){
            CurrentVotingData.setExpiryDate(voteId, newExpiryDate);
        } else {
            revert("Cannot change the expiry date once the voting has commenced");
        }

    }
    
    function setSecurityType(uint voteId, uint securityId, string calldata newSecurityType) external ifOwner() voteIdOk(voteId) {
        
        //check if the vote has started
        bool started = CurrentVotingData.getVoteStarted(voteId);
        if (started == false){
            CurrentVotingData.setSecurityType(voteId, securityId, newSecurityType);
        } else {
            revert("Cannot change the security type once the voting has commenced");
        }
        
    }
    
    function addANewVote(uint voteId, string calldata newQuestion, string calldata optionOne, string calldata optionTwo, string calldata newSecurityType, uint newExpiryDate) external {
        if (incrementVoteId(voteId) == true){
                CurrentVotingData.setVoteQuestion(voteId, newQuestion);
                CurrentVotingData.setVoteOption(voteId, 1, optionOne);        //the first option id=1
                CurrentVotingData.setVoteOption(voteId, 2, optionTwo);      //the second option id=1
                CurrentVotingData.setVoteOptionCount(voteId, true, 2);
                CurrentVotingData.setSecurityType(voteId, 1, newSecurityType); //the first securitytype id=1
                CurrentVotingData.setExpiryDate(voteId, newExpiryDate);
                CurrentVotingData.ChangeVoteCount(true, 1);
        } else{
       //     revert("This is an attempt to override a current vote");
        }
     }
    
    
    function setVoteOption(uint voteId, uint optionId, string calldata newVoteOption) external ifOwner() voteIdOk(voteId) {
    
        //check if the vote has started
        bool started = CurrentVotingData.getVoteStarted(voteId);
        if (started == false){
            CurrentVotingData.setVoteOption(voteId, optionId, newVoteOption);
            CurrentVotingData.setVoteOptionCount(voteId, true, 1);
        } else {
            revert("Cannot change the vote option once the voting has commenced");
        }    
        
    }
    
    //Note that the date can be manipulated in a decentralised network
    function setVoteAnswer(uint voteId, uint investorId, string calldata investorName, uint256 newDate, string calldata selectedOption, uint optionId, string calldata companyName) external ifOwner() voteIdOk(voteId) {
        
        //check if the vote has started
        if (CurrentVotingData.getVoteStarted(voteId) == false){
            revert("An investor can only vote after the vote has openned");
        } else if (CurrentVotingData.getVoteExpiryDate(voteId) <= block.timestamp){
            revert("An investor cannot vote when the vote has closed");
        } else if (keccak256(abi.encodePacked(CurrentVotingData.getVoteAnswerValue(voteId, investorId))) != keccak256(abi.encodePacked(""))) {
            //make sure the voter has not voted 
            revert("The investor has already voted");
        } else if (keccak256(abi.encodePacked(CurrentInvestorData.getInvestorName(investorId))) != keccak256(abi.encodePacked(investorName))){
            //make sure that the voterId is correct
            revert("The investorId and investorName do not match");
        }else {
            //make sure that the option is true
          if ((keccak256(abi.encodePacked(selectedOption)))!=((keccak256(abi.encodePacked(CurrentVotingData.getVoteOptionName(voteId, optionId)))))) {
              revert("The selectedOption and the optionId do not match");
          } else {
              uint currentVoterId = CurrentVotingData.getVoterCount(voteId)+1;
              CurrentVotingData.setVoterCount(voteId, true, 1);
              CurrentVotingData.setVoteAnswer(voteId, investorId, newDate, selectedOption,optionId); 
              CurrentVotingData.setVoterRecorded(voteId, currentVoterId, investorId);
              //get the valid securityType for this voteId
              //string memory voteSec = CurrentVotingData.getVoteSecurityType(voteId, 1);
              //gets the number of shares that user has
              uint investorSec = CurrentInvestorData.getInvestorTotalNumOfSecurities(investorId, companyName/*, voteSec*/);
              CurrentVotingData.setVoteOptionTally(voteId, optionId, true, investorSec);
             // looping(voteId, investorId, optionId, voteSecurities);
              emit NewVoter("A new vote has been recorded", voteId, investorId, newDate, selectedOption, currentVoterId);
              
          }
          
        }
        
    }
    
/*    function looping(uint voteId, uint investorId, uint optionId, uint[] memory voteSecurities) internal {
              //get investors number of securities
              //here we assume the maximum securities a vote can have is 5 -> but this can be changed of course
              uint count = 0;
              string memory voteSec = "";
              uint investorSec = 0;
              while (count < 5){
                //get the number of every security
                if ((voteSecurities[count] == 0)&&(count == 0)){
                    revert("The investor must have at least one security related to the company to participate in the vote");
                } else if ((voteSecurities[count] == 0)&&(count > 0)) {
                    count = 5;
                }else {
                    //gets the voting security type that can vote
                    voteSec = CurrentVotingData.getVoteSecurityType(voteId, voteSecurities[count]);
                    //gets the investor security type
                    investorSec = CurrentInvestorData.getInvestorTotalNumOfSecurity(investorId, voteSec);
                    if (investorSec == 0){
                        revert("The listed security for the vote and the investor security do not match");
                    } else {
                        CurrentVotingData.setVoteOptionTally(voteId, optionId, true, investorSec);
                    }
                    count = count + 1;   
                }
              }
    }*/
    
    function setVoteStarted(uint voteId) external ifOwner() voteIdOk(voteId) {
        
        //can only start with a question, options and expiry date
        string memory question = CurrentVotingData.getVoteQuestion(voteId);
        uint256 date = CurrentVotingData.getVoteExpiryDate(voteId);
        uint optionsCount = CurrentVotingData.getVoteOptionCount(voteId);
        if (keccak256(abi.encodePacked(question)) == keccak256("")){
            revert("A vote cannot start with an empty question");
        } else if (date == 0) {
            revert("A vote cannot start with an empty expiry date");
        } else if (optionsCount < 2) {
            revert("A vote must have at least 2 options");    
        } else {
            CurrentVotingData.setVoteStarted(voteId);
        }

    }
    
    function setVoteFinished(uint voteId) external ifOwner() voteIdOk(voteId) {
        
        if (CurrentVotingData.getVoteStarted(voteId) == false) {
            revert("Vote cannot finish as it has not started yet");
        }else if (CurrentVotingData.getVoteExpiryDate(voteId) <= block.timestamp){
            CurrentVotingData.setVoteFinished(voteId);
        } else if (CurrentVotingData.getVoteExpiryDate(voteId) > block.timestamp){
            revert("The expiry date of the vote has not yet completed");
        }

    }
    

    
    /***********************End of SET functions**************************************************/
    
    /***********************Start of GET functions**************************************************/
        function getOwner() public view returns (address){
        return Owner;
    }
    
    function getContractDataAddress() public view returns (address){
        return address(CurrentVotingData);
    }
    
    function getCurrentInvestorDataAddress() public view returns (address){
        return address(CurrentInvestorData);
    }
    

    /***********************End of GET functions**************************************************/
    
}
