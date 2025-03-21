// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SimpleSFTContract is ERC1155, ERC1155Supply, Ownable {
    using Strings for uint256;

    // Token details
    uint256 public constant TOKEN_ID = 1;
    uint256 public constant MAX_SUPPLY = 101;
    uint256 public tokenPrice;
    
    // Token metadata URI
    string private _baseURI;
    
    // Track purchases to limit 1 per user
    mapping(address => bool) public hasPurchased;
    uint256 public totalSold = 0;
    
    // Events
    event TokenPurchased(address indexed buyer);
    event PriceChanged(uint256 newPrice);

    constructor(
        string memory baseURI,
        uint256 price
    ) ERC1155("") Ownable(msg.sender) {
        _baseURI = baseURI;
        tokenPrice = price;
        
        // Mint tokens to the contract itself instead of the owner
        _mint(address(this), TOKEN_ID, MAX_SUPPLY, "");
    }
    
    /**
     * @dev Allow a user to purchase exactly one token
     */
    function buyToken() external payable {
        // Check if user already owns this token
        require(!hasPurchased[msg.sender], "You already own this token");
        
        // Check if enough tokens are available
        uint256 availableTokens = balanceOf(address(this), TOKEN_ID);
        require(availableTokens > 0, "No tokens left for sale");
        
        // Check payment amount
        require(msg.value >= tokenPrice, "Insufficient payment");
        
        // Transfer token from contract to buyer
        _safeTransferFrom(address(this), msg.sender, TOKEN_ID, 1, "");
        
        // Mark user as having purchased
        hasPurchased[msg.sender] = true;
        totalSold++;
        
        // Refund excess payment if any
        if (msg.value > tokenPrice) {
            payable(msg.sender).transfer(msg.value - tokenPrice);
        }
        
        emit TokenPurchased(msg.sender);
    }
    
    /**
     * @dev Get available tokens from contract's perspective
     */
    function getAvailableTokens() external view returns (uint256) {
        return balanceOf(address(this), TOKEN_ID);
    }
    
    // Other functions remain the same...
    
    function setTokenPrice(uint256 newPrice) external onlyOwner {
        tokenPrice = newPrice;
        emit PriceChanged(newPrice);
    }
    
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseURI = newBaseURI;
    }
    
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(exists(tokenId), "URI query for nonexistent token");
        return string(abi.encodePacked(_baseURI, tokenId.toString()));
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    function hasUserPurchased(address user) external view returns (bool) {
        return hasPurchased[user];
    }

    // Override required for ERC1155 and ERC1155Supply compatibility
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }
}