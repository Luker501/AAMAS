//Solidity online complier: https://remix.ethereum.org/

pragma solidity ^0.5.0;


contract InvestorManagementData {
    
    //holds the address of the contract creator
    address public Owner;	
    mapping (uint => Investor) investors;
    uint nextFreeInvestor;
    //The number of investors after deletion
    uint numOfActiveInvestors;
    //all investors securities
    uint allActiveSecurities;
    
    struct Investor{

        //the name of this investor
        string name;
        //total of all securities held by investor
        uint totalSecurities;
        //all investments held at some point
        mapping (uint => Investment) investments;
        uint nextFreeInvestment;
        //NOTE that this string is a combination of companyName and securityName
        //mapping (string => mapping (string => uint)) totalNumOfSecurity;
        //in this case it is just going to have to be companyName and not differiante on the securitytype
        mapping (string => uint) totalNumOfSecurity;
    }
    
    struct Investment {
        //the address of the company being invested into
        address company;
        //the roundId of the investment
        uint roundId;
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

    function addNewInvestor(uint newInvestorId, string calldata newName) external ifOwner {

        investors[newInvestorId].name = newName;
        investors[newInvestorId].totalSecurities = 0;
        investors[newInvestorId].nextFreeInvestment = 1; //0 will be used for error condition

    }
    
    function deleteInvestor(uint investorId) external ifOwner {

        investors[investorId].name = "";
        investors[investorId].totalSecurities = 0;
        investors[investorId].nextFreeInvestment = 0; //0 will be used for error condition

    }
    
    
    function addInvestorsInvestment(uint investorId, address company, uint roundId) external ifOwner {
        
        uint counter = investors[investorId].nextFreeInvestment;
        investors[investorId].investments[counter].company = company;
        investors[investorId].investments[counter].roundId = roundId;
        
    }
    
    function changeNextFreeInvestor(bool add, uint number) external ifOwner {
        if (add == true){
            nextFreeInvestor = nextFreeInvestor + number;
        } else {
            nextFreeInvestor = nextFreeInvestor - number;
        }
    }
    
    function changeActiveInvestorCount(bool add, uint number) external ifOwner {
        if (add == true){
            numOfActiveInvestors = numOfActiveInvestors + number;
        } else {
            numOfActiveInvestors = numOfActiveInvestors - number;
        }
    }
    
    function changeAllActiveSecuritiesCount(bool add, uint number) external ifOwner {
        
        if (add == true){
            allActiveSecurities = allActiveSecurities + number;
        } else {
            allActiveSecurities = allActiveSecurities - number;
        }
        
    }
    
    function changeInvestorSecurityTotal(bool add, uint number, uint investorId) external ifOwner {
        if (add == true){
            investors[investorId].totalSecurities = investors[investorId].totalSecurities + number;
        } else {
            investors[investorId].totalSecurities = investors[investorId].totalSecurities - number;
        }
    }
    
    function changeInvestorsInvestmentCount(bool add, uint number, uint investorId) external ifOwner {
        
        if (add == true){
            investors[investorId].nextFreeInvestment = investors[investorId].nextFreeInvestment + number;
        } else {
            investors[investorId].nextFreeInvestment = investors[investorId].nextFreeInvestment - number;
        }
        
    }
    
        function changeInvestorsTotalNumOfSecurityCount(bool add, uint number, uint investorId, string calldata companyName/*,string calldata security*/) external ifOwner {
        if (add == true){
            investors[investorId].totalNumOfSecurity[companyName] = investors[investorId].totalNumOfSecurity[companyName] + number;
        } else {
            investors[investorId].totalNumOfSecurity[companyName] = investors[investorId].totalNumOfSecurity[companyName] - number;
        }
        
    }
    

    /***********************End of SET functions**************************************************/


    /*********************Start of GET functions**************************************************/
    
    
    function getOwner() public view returns (address){
        return Owner;
    }

    function getNextFreeInvestor() public view returns (uint){
        return nextFreeInvestor;
    }
    
    function getNumOfActiveInvestors() public view returns (uint){
        return numOfActiveInvestors;
    }
    
    function getInvestorName(uint investorId) public view returns (string memory){
        return investors[investorId].name;    
    }
    
    function getInvestorTotalSecurities(uint investorId) public view returns (uint){
        return investors[investorId].totalSecurities;
    }
    
    function getNextFreeInvestment(uint investorId) public view returns (uint){
        return investors[investorId].nextFreeInvestment;
    }
    
    function getInvestorInvestmentCompany(uint investorId, uint investmentId) public view returns (address){
        return investors[investorId].investments[investmentId].company;
    }
    
    function getInvestorTotalNumOfSecurities(uint investorId, string memory companyName/*, string memory securityName*/) public view returns (uint) {
        return investors[investorId].totalNumOfSecurity[companyName];
    }

    function getInvestorInvestmentId(uint investorId, uint investmentId) public view returns (uint) {
        return investors[investorId].investments[investmentId].roundId;
    }
    
    function getAllActiveSecurities() public view returns (uint) {
        return allActiveSecurities;
    }
    
}
