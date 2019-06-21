pragma solidity ^0.5.0;

//** This contract holds information on:
//** All the listed companies
//** All the listed voting contracts

contract CompanyManagementData {
    
    //holds the address of the contract creator
    address Owner;
    mapping (uint => address) companyAddresses;
    uint numberOfCompanyAddresses;
    mapping (address => CompanyContract) companies;
    
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
        mapping (address => bool) votingContractUsed;
        //number of voting contracts
        uint votingContractCount;
    }
    
    /******** End of Structures *********/
    
    	//** The constructor sets the smart contract owner as the address that put the create contract transaction onto the blockchain**//
    constructor () public {
    
            Owner = msg.sender;
            
    } 
    
    /*********************Start of SET functions**************************************************/
        
        function setOwner(address newOwner) external ifOwner {
        
            Owner = newOwner;
        
        } 
        
        function addNewCompanyAddress(address newCompanyAddress, uint companyAddressCount) external ifOwner {
        
            companyAddresses[companyAddressCount] = newCompanyAddress;
        
        }
        
        function changeNumberOfCompanyCounter(bool add, uint number) external ifOwner{
            
            if (add == true){
                numberOfCompanyAddresses = numberOfCompanyAddresses + number;
            } else {
                numberOfCompanyAddresses = numberOfCompanyAddresses - number;
            }
            
        }
        
        function addVotingContractAddress(address companyAddress, address newVotingAddress, uint votingContractCount) external ifOwner {
         
            companies[companyAddress].votingContractAddresses[votingContractCount] = newVotingAddress;
            
        }
        
        function addVotingContractUsed(address companyAddress, address votingContract, bool used) external ifOwner {
            companies[companyAddress].votingContractUsed[votingContract] = used;
        }
        
        function changeVotingContractCount(bool add, uint number, address companyAddress) external ifOwner{
            
            if (add == true){
                companies[companyAddress].votingContractCount = companies[companyAddress].votingContractCount  + number;
            } else {
                companies[companyAddress].votingContractCount  = companies[companyAddress].votingContractCount  - number;
            }
            
        }
    
    
    /*********************End of SET functions**************************************************/    
    
    /*********************Start of GET functions**************************************************/
    
    function getOwner() public view returns (address){
        return Owner;
    }
    
    function getCompanyAddress(uint companyAddressId) public view returns (address){
        return  companyAddresses[companyAddressId];
    }
    
    function getNumberOfCompanyAddresses() public view returns (uint){
        return  numberOfCompanyAddresses;
    }
    
    function getCompanyNumberOfVotingContracts(address companyAddress) public view returns (uint){
        return  companies[companyAddress].votingContractCount;
    }  
    
    function getCompanyVotingAddress(address companyAddress, uint votingContractCount) public view returns (address){
        return  companies[companyAddress].votingContractAddresses[votingContractCount];
    }  
    
    function getCompanyVotingContractUsed(address companyAddress, address votingContract) public view returns (bool){
        return companies[companyAddress].votingContractUsed[votingContract];
    }
    
    /*********************End of GET functions**************************************************/


	
}
