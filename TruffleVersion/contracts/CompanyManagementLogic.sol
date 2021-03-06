pragma solidity ^0.5.0;
import "./CompanyManagementData.sol";

//** This contract holds information on:
//** All the listed companies
//** All the listed voting contracts

contract CompanyManagementLogic {
    
    //holds the address of the contract creator
    address public Owner;
    //The current CompanyData contract
    CompanyManagementData CurrentCompanyManagementData;

    
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
	

    /******** Start of Structures *********/
    
    struct CompanyContract {

        //addresses of any voting contracts
        mapping (uint => address) votingContractAddresses;
        //number of voting contracts
        uint votingContractCount;
    }
    
    /******** End of Structures *********/
    
    		//** The constructor sets the smart contract owner as the address that put the create contract transaction onto the blockchain**//
    constructor (address thisCurrentCompanyManagmentData) public {
    
            Owner = msg.sender;
            CurrentCompanyManagementData = CompanyManagementData(thisCurrentCompanyManagmentData);
            
    }  
    
    function upgradeCompanyDataContract(address thisCurrentCompanyManagementData) external ifOwner {
        CurrentCompanyManagementData = CompanyManagementData(thisCurrentCompanyManagementData);
    }
    
    /*********************Start of SET functions**************************************************/
        
        function setOwner(address newOwner) external ifOwner {
            
            Owner = newOwner;
            
        } 
        
        function setOwnerOfDataContract(address newOwner) external ifOwner {
            
            CurrentCompanyManagementData.setOwner(newOwner);
            
        } 
        
        function addNewCompany(address newCompanyAddress, uint companyAddressCount, address newVotingAddress, uint votingAddressCount) external ifOwner {
        
            //check if company contract is already there
            if (CurrentCompanyManagementData.getCompanyNumberOfVotingContracts(newCompanyAddress) > 0){
                revert("You can only add another company if it has not already been added!");                
            } else {
                CurrentCompanyManagementData.addNewCompanyAddress(newCompanyAddress, companyAddressCount);
                CurrentCompanyManagementData.changeNumberOfCompanyCounter(true, 1); 
                CurrentCompanyManagementData.addVotingContractAddress(newCompanyAddress, newVotingAddress, votingAddressCount);
                CurrentCompanyManagementData.changeVotingContractCount(true, 1, newCompanyAddress);
                CurrentCompanyManagementData.addVotingContractUsed(newCompanyAddress, newVotingAddress, true);
            }
           
        }
        
        function addVotingContractAddress(address companyAddress, address newVotingAddress, uint votingAddressCount) external ifOwner {
         
            //check if company contract is already there
            if (CurrentCompanyManagementData.getCompanyNumberOfVotingContracts(companyAddress) > 0){
                revert("You can only add another company if it has not already been added!");                
            } else if (CurrentCompanyManagementData.getCompanyVotingContractUsed(companyAddress, newVotingAddress) == true){
                //check if votingContract has already been used
                revert("You can only add another voting contract if it has not already been added!");
            } else {
                CurrentCompanyManagementData.addVotingContractAddress(companyAddress, newVotingAddress, votingAddressCount);
                CurrentCompanyManagementData.changeVotingContractCount(true, 1, companyAddress);   
            }
            
        }
        
    
    
    /*********************End of SET functions**************************************************/    
    
    /*********************Start of GET functions**************************************************/
    
    function getOwner() public view returns (address){
        return Owner;
    }
    
    function getContractDataAddress() public view returns (address){
        return address(CurrentCompanyManagementData);
    } 
    
    /*********************End of GET functions**************************************************/


	
}
