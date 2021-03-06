pragma solidity ^0.5.0;
import "./CompanyData.sol";

//** This contract holds information on:
//**

contract CompanyLogic {
    
    //holds the address of the contract creator
    address public Owner;
    //The current CompanyData contract
    CompanyData CurrentCompanyData;
    
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
    constructor (address thisCurrentCompanyData) public {
    
            Owner = msg.sender;
            CurrentCompanyData = CompanyData(thisCurrentCompanyData);
            
    }  
    
    function upgradeCompanyDataContract(address thisCurrentCompanyData) external ifOwner {
        CurrentCompanyData = CompanyData(thisCurrentCompanyData);
    }

	
    /*********************Start of SET functions**************************************************/

    function setOwner(address newOwner) external ifOwner {
        
        Owner = newOwner;
        
    } 
    
    function setOwnerOfDataContract(address newOwner) external ifOwner {
        
        CurrentCompanyData.setOwner(newOwner);
        
    } 

     function setCompanyInfo(uint newId, string calldata name) external ifOwner {
        //only set companyId if it is not already set
//        uint currentCompanyId = CurrentCompanyData.getCompanyId();
//        if (currentCompanyId == 0){
            CurrentCompanyData.setCompanyId(newId);    
//        } else {
    //        revert("The company's ID has already been set");
 //       }
//        if (keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(""))){
            CurrentCompanyData.setCompanyName(name);
 //       } else {
  //          revert("The company's name has already been set");
//        }
        
    }

    function addNewRound(uint newRoundId, string calldata newName) external ifOwner {

        //only set the newRound if it is not already set
        string memory currentRoundName = CurrentCompanyData.getRoundName(newRoundId);
        if (keccak256(abi.encodePacked(currentRoundName)) == keccak256(abi.encodePacked(""))){
           CurrentCompanyData.addNewRound(newRoundId, newName);
           CurrentCompanyData.addNewRoundName(newRoundId, newName);
           CurrentCompanyData.changeRoundCounter(true, 1);
        } else {
            revert("This round has already been added");
        }
    }
    
    function addNewInvestment(uint newRoundId, uint newInvestorId, uint newNumSecurities, string calldata newSecurityType, bool newInvestor) external ifOwner {

        //If the new security type has not been saved then save it
       // if (securityTypeId == 0){
         //  uint newTypeId = CurrentCompanyData.getNumOfSecurityTypes() + 1;
         //  CurrentCompanyData.addNewSecurityType(newTypeId, newSecurityType);
        //}
        //only set the new Investment if it is not already set
        uint currentNumSecurities = CurrentCompanyData.getInvestmentNumSecurities(newRoundId, newInvestorId);
        string memory currentSecurityType = CurrentCompanyData.getInvestmentSecurityType(newRoundId, newInvestorId);
        if ((currentNumSecurities == 0)&&(keccak256(abi.encodePacked(currentSecurityType)) == keccak256(abi.encodePacked("")))){
            CurrentCompanyData.changeInvestment(newRoundId, newInvestorId, newNumSecurities,newSecurityType);
            CurrentCompanyData.changeNextFreeInvestmentCounter(true, 1, newRoundId);
            CurrentCompanyData.changeActiveSecuritiesCount(true, newNumSecurities);
            if (newInvestor == true){
                CurrentCompanyData.changeActiveInvestorsCount(true, 1);
            }
        } else {
            revert("This investment has already been added");
        }
        
    }
    
    function changeInvestment(uint roundId, uint investorId, uint newNumSecurities, string calldata newSecurityType, bool removeInvestor) external ifOwner {

        //If the new security type has not been saved then save it
       // if (securityTypeId == 0){
         //  uint newTypeId = CurrentCompanyData.getNumOfSecurityTypes() + 1;
           //CurrentCompanyData.addNewSecurityType(newTypeId, newSecurityType);
        //}
        //only change the new Investment if it is already set
        string memory currentSecurityType = CurrentCompanyData.getInvestmentSecurityType(roundId, investorId);
        uint currentNumSecurities = CurrentCompanyData.getInvestmentNumSecurities(roundId, investorId);
        if ((keccak256(abi.encodePacked(currentSecurityType)) != keccak256(abi.encodePacked("")))){
            CurrentCompanyData.changeInvestment(roundId, investorId, newNumSecurities, newSecurityType);
            CurrentCompanyData.changeActiveSecuritiesCount(false, currentNumSecurities);
            CurrentCompanyData.changeActiveSecuritiesCount(true, newNumSecurities);
            if ((newNumSecurities == 0)&&(removeInvestor == true)){
                CurrentCompanyData.changeActiveInvestorsCount(false, 1);
            } else if (removeInvestor == true) {
                revert("Cannot remove investor if the newNumSecurities is still > 0");
            }
        } else {
            revert("You can only change a current investment");
        }
        
    }
    

    

    /***********************End of SET functions**************************************************/


    /*********************Start of GET functions**************************************************/


    function getOwner() public view returns (address){
        return Owner;
    }
    
    function getContractDataAddress() public view returns (address){
        return address(CurrentCompanyData);
    }
    /***********************End of GET functions**************************************************/

    
}
