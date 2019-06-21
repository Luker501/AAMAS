pragma solidity ^0.5.0;
import "./InvestorManagementData.sol";

//** This contract holds information on:
//**

contract InvestorManagementLogic {
    
        //holds the address of the contract creator
    address public Owner;
    //The current CompanyData contract
    InvestorManagementData CurrentInvestorManagementData;
    

    
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
	
    
    		//** The constructor sets the smart contract owner as the address that put the create contract transaction onto the blockchain**//
    constructor (address thisCurrentInvestorManagmentData) public {
    
            Owner = msg.sender;
            CurrentInvestorManagementData = InvestorManagementData(thisCurrentInvestorManagmentData);
            
    }  
    
    function upgradeInvestorDataContract(address thisCurrentInvestorManagementData) external ifOwner {
        CurrentInvestorManagementData = InvestorManagementData(thisCurrentInvestorManagementData);
    }
    
    /*********************Start of SET functions**************************************************/
        
        function setOwner(address newOwner) external ifOwner {
            
            Owner = newOwner;
            
        } 
        
        function setOwnerOfDataContract(address newOwner) external ifOwner {
            
            CurrentInvestorManagementData.setOwner(newOwner);
            
        } 
        
    function addNewInvestor(uint newInvestorId, string calldata newName) external ifOwner {

            //only set the new investor if it is not already set
            string memory currentName = CurrentInvestorManagementData.getInvestorName(newInvestorId);
            if (keccak256(abi.encodePacked(currentName)) == keccak256(abi.encodePacked(""))){
                CurrentInvestorManagementData.addNewInvestor(newInvestorId, newName);
                CurrentInvestorManagementData.changeNextFreeInvestor(true, 1);
                CurrentInvestorManagementData.changeActiveInvestorCount(true, 1);
            } else {
                revert("This investor has already been added");
            }

    }
        
    function deleteInvestor(uint investorId) external ifOwner {
        
            string memory currentName = CurrentInvestorManagementData.getInvestorName(investorId);
            if (keccak256(abi.encodePacked(currentName)) != keccak256(abi.encodePacked(""))){
                CurrentInvestorManagementData.deleteInvestor(investorId);
                CurrentInvestorManagementData.changeActiveInvestorCount(false, 1);
                
            } 
        
    }
    
    function changeInvestorSecurityCount(uint investorId, string calldata investorName, bool add, uint number, string calldata companyName/*, string calldata securityName*/) external ifOwner {
        //if investor exists...
        string memory currentName = CurrentInvestorManagementData.getInvestorName(investorId);
        if (keccak256(abi.encodePacked(currentName)) == keccak256(abi.encodePacked(investorName))){
            CurrentInvestorManagementData.changeInvestorSecurityTotal(add,number,investorId);
            CurrentInvestorManagementData.changeAllActiveSecuritiesCount(add, number);
            CurrentInvestorManagementData.changeInvestorsTotalNumOfSecurityCount(add,number,investorId,companyName);
        } else {
            revert("Given investorName and saved investor name do not match, so no update to the security count has occurred");
        }
        
    }
    
    
    function addInvestorsInvestment(uint investorId, address company, uint roundId) external ifOwner {
        //if investor exists...
        string memory currentName = CurrentInvestorManagementData.getInvestorName(investorId);
        if (keccak256(abi.encodePacked(currentName)) != keccak256(abi.encodePacked(""))){
            CurrentInvestorManagementData.addInvestorsInvestment(investorId,company,roundId);
            CurrentInvestorManagementData.changeInvestorsInvestmentCount(true, 1, investorId);
        } else {
            revert("The given investor does not exist, so an investment has not been added");
        }    
                
    }
    
        /*********************Start of GET functions**************************************************/


    function getOwner() public view returns (address){
        return Owner;
    }
    
    function getContractDataAddress() public view returns (address){
        return address(CurrentInvestorManagementData);
    }
    /***********************End of GET functions**************************************************/

        
        
    
}
