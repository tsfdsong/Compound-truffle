pragma solidity ^0.5.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TetherUSDT is ERC20 {
    string public name = "Tether USDT";
    string public symbol = "USDT";
    uint256 public decimals = 6;
    uint256 public INITIAL_SUPPLY = 10000 * (10**decimals);

    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
