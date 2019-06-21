//Solidity online complier: https://remix.ethereum.org/

pragma solidity ^0.5.0;

//** This contract holds information on different votes that occur in the company, specifically:
// - The vote question
// - The vote options
// - The different vote answers (ballots)
// - The vote expiry date
// - The related company
//**

contract VotingData {
    
    //holds the address of the contract creator
    address public Owner;
    //holds the address of the company
    address linkedCompany;
    //holds all of the different votes for this company
    mapping (uint => Vote) id;
    uint voteCount;

    
    /******** Start of Structures *********/

    struct Vote {

        //when the vote will expire
        uint expiry_date;
        //what security types can vote
        mapping (uint => string) security_types;    //the prototype only allows the first one
        //the vote question
        string vote_question;
        //the different ballot options
        mapping (uint => Option) vote_option;
        //number Of Options
        uint optionCount;
        //all of the investors ballots, indexed by the investorId
        mapping (uint => Answer) vote_answer;
        //The list of which investors voted, indexed by natural numbers
        mapping (uint => uint) voter_recorded;
        //The total number of voters
        uint voterCount;
        //has the vote started
        bool started;
        //has the vote finished
        bool finished;

    }
        
    struct Answer {

        //the date this answer occurred
        uint256 date;
        //the answer selected 
        string value;
        //corresponds to optionId
        uint optionId;
    }
    
    struct Option {

        //this option 
        string name;
        //the option count 
        uint tally;
    }
    
    /******** End of Structures *********/
    
    /******** Start of modifiers *********/
	
	//** any function containing this modifier, only allows the contract owner to call it**//
	modifier ifOwner(){
        if(Owner != msg.sender){
            revert("Not the contract owner");
        }else{
            _; //means continue on the functions that called it
        }
    }

	
	/******** End of Modifiers  *********/
    
    /******** Start of Functions  *********/

	//** The constructor sets the smart contract owner as the address that put the create contract transaction onto the blockchain**//
    constructor (address companyDataContract) public {
    
            Owner = msg.sender;
            linkedCompany = companyDataContract;
            
    }  
    
    /*********************Start of SET functions**************************************************/
    
    function setOwner(address newOwner) external ifOwner() {
        
        Owner = newOwner;
        
    } 
    
    function setLinkedCompany(address newLinkedCompany) external ifOwner() {
        
       linkedCompany = newLinkedCompany;
        
    } 
    
    function setExpiryDate(uint voteId, uint newExpiryDate) external  ifOwner() {
    
        id[voteId].expiry_date = newExpiryDate;

    }
    
    function setSecurityType(uint voteId, uint securityId, string calldata newSecurityType) external ifOwner()  {
        
        id[voteId].security_types[securityId] = newSecurityType;
        
    }
    
    function setVoteQuestion(uint voteId, string calldata newQuestion) external ifOwner()  {
        
        id[voteId].vote_question = newQuestion;
        
    }
    
    function setVoteOption(uint voteId, uint optionId, string calldata newVoteOption) external ifOwner() {

        id[voteId].vote_option[optionId].name = newVoteOption;
        
    }
    
    function setVoteOptionCount(uint voteId, bool add, uint number) external  ifOwner() {
        
        if (add == true){
            id[voteId].optionCount = id[voteId].optionCount + number;    
        } else {
            id[voteId].optionCount = id[voteId].optionCount - number;
        }
        
    }
    
    function setVoteAnswer(uint voteId, uint investorId, uint256 newDate, string calldata newValue, uint newOptionId) external ifOwner() {
        
        id[voteId].vote_answer[investorId].date = newDate;
        id[voteId].vote_answer[investorId].value = newValue;
        id[voteId].vote_answer[investorId].optionId = newOptionId;
        
    }
    
    function setVoterRecorded(uint voteId, uint voterId, uint investorId) external ifOwner() {

        id[voteId].voter_recorded[voterId] = investorId;
        
    }
    
    function setVoterCount(uint voteId, bool add, uint number) external ifOwner() {
        
        if (add == true){
            id[voteId].voterCount = id[voteId].voterCount + number;
        } else {
            id[voteId].voterCount = id[voteId].voterCount - number;
        }
        
    }
    
    function setVoteStarted(uint voteId) external ifOwner() {

        id[voteId].started = true;

    }
    
    function setVoteFinished(uint voteId) external ifOwner() {

        id[voteId].finished = true;

    }
    
    function setVoteOptionTally(uint voteId, uint voteOptionId, bool add, uint number) external ifOwner() {
        
        if (add == true){
            id[voteId].vote_option[voteOptionId].tally = id[voteId].vote_option[voteOptionId].tally + number;    
        } else {
            id[voteId].vote_option[voteOptionId].tally = id[voteId].vote_option[voteOptionId].tally - number;
        }
        
    }
    
    function ChangeVoteCount(bool add, uint number) external {
        
        if (add == true){
            voteCount = voteCount + number;    
        } else {
            voteCount = voteCount - number;
        }
        
    }
    
    /***********************End of SET functions**************************************************/


    /*********************Start of GET functions**************************************************/
    
    function getOwner() public view returns (address) {
        return Owner;
    }
    
    function getLinkedCompany() public view returns (address) {
        return linkedCompany;
    }
    
    function getVoteExpiryDate(uint voteId) public view returns (uint256) {
        return id[voteId].expiry_date;
    }
    
    function getVoteSecurityType(uint voteId, uint securityTypeId) public view returns (string memory){
        return id[voteId].security_types[securityTypeId];
    }
    
    function getVoteQuestion(uint voteId) public view returns (string memory){
        return id[voteId].vote_question;
    }
    
    function getVoteOptionName(uint voteId, uint voteOptionId) public view returns (string memory){
        return id[voteId].vote_option[voteOptionId].name;
    }
    
    function getVoteOptionTally(uint voteId, uint voteOptionId) public view returns (uint){
        return id[voteId].vote_option[voteOptionId].tally;
    }
    
    function getVoteOptionCount(uint voteId) public view returns (uint) {
        return id[voteId].optionCount;
    }
    
    function getVoteAnswerDate(uint voteId, uint investorId) public view  returns (uint256) {
        return id[voteId].vote_answer[investorId].date;
    }
    
    function getVoteAnswerValue(uint voteId, uint investorId) public view  returns (string memory){
        return id[voteId].vote_answer[investorId].value;
    }
    
    function getVoteAnswerOptionId(uint voteId, uint investorId) public view  returns (uint){
        return id[voteId].vote_answer[investorId].optionId;
    }
    
    function getVoterRecorded(uint voteId, uint investorId) public view  returns (uint) {
        return id[voteId].voter_recorded[investorId];
    }
    
    function getVoterCount(uint voteId) public view  returns (uint) {
        return id[voteId].voterCount;
    }
    
    function getVoteStarted(uint voteId) public view  returns (bool){
        return id[voteId].started;
    }
    
    function getVoteFinished(uint voteId) public view  returns (bool){
        return id[voteId].finished;
    }
    
    function getNumberOfVotes() public view  returns(uint){
        return voteCount;
    }
    
    
    /***********************End of GET functions**************************************************/
    
}
