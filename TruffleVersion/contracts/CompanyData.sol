//Solidity online complier: https://remix.ethereum.org/

pragma solidity ^0.5.0;

//** This contract holds information on:
// - A company
// - Company investor rounds
// - Company investments
// - Company Investors
//**

contract CompanyData {

    //holds the address of the contract creator
    address public Owner;					
    //holds the crowdcube ID of the CompanyID
    uint CompanyId;         
    //holds the name of the CompanyID
    string name;
    //holds the different investment rounds of the company
    mapping(uint => string) roundNames;
    //*NOTE given a roundName has it actually been assigned a roundId? (if not -> then it is not a valid round)
    mapping(string => uint) Rounds;
    //holds the number of different investment Rounds
    uint numOfRounds;
    //holds the different individual investment in the company
    //*NOTE that the index is the roundId then the investorId*
    mapping(uint => mapping (uint => Investment)) Investments;
    //holds the number of different individual investments
    mapping (uint => uint) numOfInvestments;
    //The number of investors after deletion
    uint numOfActiveInvestors;
    //all investors securities
    uint allActiveSecurities;
    //list the different security types
    mapping (uint => string) AllSecurityTypes;
    //list the number of security types
    uint numOfSecurityTypes;
    	

    /******** Start of Structures *********/
    
    struct Round {

        //the name of this round
        string name;
    }
    
    struct Investment {
        
        //the number of securities this investor has
        uint numSecurities;
        //what type of security these are
        string securityType;
        //if the investor
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
    constructor () public {
    
            Owner = msg.sender;
            
    }    
    
    
    /*********************Start of SET functions**************************************************/

    function setOwner(address newOwner) external ifOwner {
        
        Owner = newOwner;
        
    } 

    function setCompanyId(uint newId) external ifOwner {
        
        CompanyId = newId;
    }
    
    function setCompanyName(string calldata newName) external ifOwner {
        
        name = newName;
    }
    
    function addNewRound(uint newRoundId, string calldata roundName) external ifOwner {

        Rounds[roundName] = newRoundId;
    }
    
    function addNewRoundName(uint newRoundId, string calldata roundName) external ifOwner {

        roundNames[newRoundId] = roundName;
    }
    
    function changeRoundCounter(bool add, uint number) external ifOwner {
        
        if (add == true){
            numOfRounds = numOfRounds + number;    
        } else {
            numOfRounds = numOfRounds - number;
        }
    }

    function changeInvestment(uint roundId, uint investorId, uint newNumSecurities, string calldata newSecurityType) external ifOwner {

        Investments[roundId][investorId].numSecurities = newNumSecurities;
        Investments[roundId][investorId].securityType = newSecurityType;
        
    }
    
    
    function changeNextFreeInvestmentCounter(bool add, uint number, uint roundId) external ifOwner {
        if (add == true){
            numOfInvestments[roundId] = numOfInvestments[roundId] + number;
        } else {
            numOfInvestments[roundId] = numOfInvestments[roundId] - number;
        }
    }
    
    function changeActiveInvestorsCount(bool add, uint number) external ifOwner {
        if (add == true){
            numOfActiveInvestors = numOfActiveInvestors + number;
        } else {
            numOfActiveInvestors = numOfActiveInvestors - number;
        }
    }
    
    function changeActiveSecuritiesCount(bool add, uint number) external ifOwner {
        if (add == true){
            allActiveSecurities = allActiveSecurities + number;
        } else {
            allActiveSecurities = allActiveSecurities - number;
        }
    }
    
    function addNewSecurityType(uint typeId, string calldata newType) external ifOwner {
        
        AllSecurityTypes[typeId] = newType;
    }
    
    function changeNumberOfSecurityTypes(bool add, uint number) external ifOwner {
        if (add == true){
            numOfSecurityTypes = numOfSecurityTypes + number;
        } else {
            numOfSecurityTypes = numOfSecurityTypes - number;
        }
    }
    

    /***********************End of SET functions**************************************************/


    /*********************Start of GET functions**************************************************/
    
    
    function getOwner() public view returns (address){
        return Owner;
    }
    
    function getCompanyId() public view returns (uint) {
        return CompanyId;
    }

    function getName() public view returns (string memory) {
        return name;
    }
    
    function getRoundId(string memory roundName) public view returns (uint) {
        return Rounds[roundName];
    }
    
    function getRoundName(uint roundId) public view returns (string memory){
        return roundNames[roundId];
    }
    
    function getInvestmentNumSecurities(uint roundId, uint investorId) public view returns (uint) {
        return Investments[roundId][investorId].numSecurities;
    }
    
    function getInvestmentSecurityType(uint roundId, uint investorId) public view returns (string memory) {
        return Investments[roundId][investorId].securityType;
    }
    
    function getNumberOfRounds() public view returns (uint) {
        return numOfRounds;
    }
    
    function getNumberOfInvestments(uint roundId) public view returns (uint) {
        return numOfInvestments[roundId];
    }
    
    function getAllActiveSecurities() public view returns (uint) {
        return allActiveSecurities;
    }
    
    function getNumOfActiveInvestors() public view returns (uint){
        return numOfActiveInvestors;
    }
    
    function getNumOfSecurityTypes() public view returns (uint){
        return numOfSecurityTypes;
    }
    
    function getSecurityType(uint typeId) public view returns (string memory){
        return AllSecurityTypes[typeId];
    }

    /***********************End of GET functions**************************************************/



}
	

     
