pragma solidity =0.5.17;

import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./sablier/ISablier.sol";

import "hardhat/console.sol";

/**
 * @title StreamPie
 * @author Ameen Soleimani
 * @notice Money Streaming With Friends!
 */

contract StreamPie is ERC20Burnable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    ISablier public sablier;
    uint256 public streamPieId;
    address public owner;
    IERC20 public token;
    uint256[] public forks;

    constructor(address owner_, ISablier sablier_) public {
        owner = owner_;
        sablier = sablier_;
        _mint(msg.sender, 1000000);
    }

    function createStreamPie(
        address recipient,
        uint256 deposit,
        IERC20 _token,
        uint256 startTime,
        uint256 stopTime
    ) external {
        require(streamPieId == 0, "only one stream pie can be created");
        token = _token;

        _token.safeTransferFrom(msg.sender, address(this), deposit);
        _token.approve(address(sablier), uint256(-1));
        streamPieId = sablier.createStream(recipient, deposit, address(_token), startTime, stopTime);
    }

    function cancelStreamPie() public {
        require(msg.sender == owner, "only owner is allowed to cancel stream pie");
        sablier.cancelStream(streamPieId);
        withdrawTokens();
    }

    function cancelForkStream(uint256 forkStreamIndex) public {
        require(msg.sender == owner, "only owner is allowed to cancel a fork stream");
        uint256 forkStreamId = forks[forkStreamIndex];
        sablier.cancelStream(forkStreamId);
        withdrawTokens();
    }

    function withdrawTokens() public {
        uint256 balance = token.balanceOf(address(this));
        token.safeTransfer(owner, balance);
    }

    function rageStream(address newRecipient, uint256 tokensToBurn) public {
        require(balanceOf(msg.sender) >= tokensToBurn, "not enough tokens to burn");
        this.transferFrom(msg.sender, address(this), tokensToBurn);

        (, address streamPieRecipient, , , uint256 streamPieStartTime, uint256 streamPieStopTime, , ) = sablier.getStream(
            streamPieId
        );
        sablier.cancelStream(streamPieId);
        uint256 balance = token.balanceOf(address(this));
        token.approve(address(sablier), balance);

        require(streamPieStopTime > now, "streampie has ended");

        // if start time has passed, start now
        streamPieStartTime = streamPieStartTime > now ? streamPieStartTime : now;

        // calculate the fork deposit amount
        uint256 streamPieDuration = streamPieStopTime.sub(streamPieStartTime);

        uint256 forkDeposit = tokensToBurn.mul(balance).div(this.totalSupply());
        uint256 forkDepositAdjusted = forkDeposit.sub(forkDeposit.mod(streamPieDuration));

        uint256 streamPieDeposit = balance.sub(forkDepositAdjusted);
        uint256 streamPieDepositAdjusted = streamPieDeposit.sub(streamPieDeposit.mod(streamPieDuration));

        this.burn(tokensToBurn);

        // create a forked stream
        uint256 forkStreamId = sablier.createStream(
            newRecipient,
            forkDepositAdjusted,
            address(token),
            streamPieStartTime,
            streamPieStopTime
        );
        forks.push(forkStreamId);

        // re-create the main stream pie
        streamPieId = sablier.createStream(
            streamPieRecipient,
            streamPieDepositAdjusted,
            address(token),
            streamPieStartTime,
            streamPieStopTime
        );
    }
}
