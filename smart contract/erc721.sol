//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract erc721Con is ERC721, ERC721URIStorage {

    uint public ids;
    
    constructor() ERC721("NFT_Token","NFT") { }

    function mintNow(string memory uri) external {
        ids++;
        _safeMint(msg.sender, ids);
        _setTokenURI(ids, uri);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
}