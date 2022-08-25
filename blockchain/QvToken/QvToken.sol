// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

import "./ERC20.sol";

contract QVtoken is ERC20 {
    address private owner;

    constructor() ERC20("QVotingToken", "Qv") {
        owner = msg.sender;
    }

    modifier onlyOwner(address msgSender) {
        require(owner == msgSender);
        _;
    }

    function checkAdmin() public view returns (bool) {
        if (msg.sender == owner) {
            return true;
        }
        return false;
    }

    function mint(address to, uint256 amount) internal onlyOwner(_msgSender()) {
        _mint(to, amount);
    }

    function burn(address to, uint256 amount) internal onlyOwner(_msgSender()) {
        _burn(to, amount);
    }
}
