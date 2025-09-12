// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract MintABadge is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenId;
    mapping(address => bool) public hasMinted;

    event Minted(address indexed to, uint256 indexed tokenId);

    constructor() ERC721("MintABadge", "MBADGE") Ownable(msg.sender) {}

    function mint() external {
        require(!hasMinted[msg.sender], "Already minted");
        _tokenId += 1;
        hasMinted[msg.sender] = true;
        _safeMint(msg.sender, _tokenId);
        emit Minted(msg.sender, _tokenId);
    }

    function totalMinted() external view returns (uint256) {
        return _tokenId;
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        require(_ownerOf(id) != address(0), "Nonexistent token");

        // derive a simple color from tokenId
        bytes32 hash = keccak256(abi.encodePacked(id));
        string memory color = string(abi.encodePacked("#", _hexSlice(hash, 0, 6)));

        string memory ownerShort = _short(_ownerOf(id));
        string memory name = string(abi.encodePacked("MintABadge #", id.toString()));

        string memory svg = string(
            abi.encodePacked(
                "<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'>",
                "<rect width='100%' height='100%' fill='", color, "'/>",
                "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='28' font-family='monospace'>",
                name, " ", ownerShort,
                "</text></svg>"
            )
        );

        string memory json = string(
            abi.encodePacked(
                '{"name":"', name,
                '","description":"One-per-wallet on-chain SVG badge.",',
                '"image":"data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '"}'
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    // helpers
    function _hexSlice(bytes32 data, uint256 start, uint256 len) internal pure returns (string memory) {
        bytes memory HEX = "0123456789abcdef";
        bytes memory out = new bytes(len);
        for (uint256 i = 0; i < len; i++) {
            uint8 b = uint8(data[start + i]) & 0x0f;
            out[i] = HEX[b];
        }
        return string(out);
    }

    function _short(address a) internal pure returns (string memory) {
        bytes20 b = bytes20(a);
        bytes memory HEX = "0123456789abcdef";
        bytes memory s = new bytes(13);
        s[0] = "0"; s[1] = "x";
        for (uint i = 0; i < 4; i++) {
            s[2+i*2] = HEX[uint8(b[i] >> 4)];
            s[3+i*2] = HEX[uint8(b[i] & 0x0f)];
        }
        s[10] = "."; s[11] = "."; s[12] = ".";
        return string(s);
    }
}
