// SPDX-License-Identifier: MIT

// File @openzeppelin/contracts/utils/ReentrancyGuard.sol@v5.3.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (utils/ReentrancyGuard.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private _status;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        if (_status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }

        // Any calls to nonReentrant after this point will fail
        _status = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == ENTERED;
    }
}


// File contracts/TimedLockerV5.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;
contract TimedLockerV5 is ReentrancyGuard {
    struct Lock {
        address locker;
        address beneficiary;
        uint256 value;
        uint256 unlockTimestamp;
    }

    mapping(address => mapping(address => bool)) private designatedLockers;
    mapping(address => Lock[]) private lockedFundsByBeneficiary;
    mapping(address => Lock[]) private lockedFundsByLocker;

    // check if the given locker has been designated by the beneficiary. An address is always self-designated.
    function isDesignatedLocker(address beneficiary, address locker) internal view returns (bool) {
        return locker == beneficiary || designatedLockers[beneficiary][locker];
    }

    // Beneficiary should designate who can lock values for them. This allows to prevent spamming.
    function addDesignatedLocker(address locker) external {
        require(!designatedLockers[msg.sender][locker], "Already a designated locker.");
        designatedLockers[msg.sender][locker] = true;
    }

    // remove given designnated locker
    function removeDesignatedLocker(address locker) external {
        require(designatedLockers[msg.sender][locker], "Locker not found.");
        designatedLockers[msg.sender][locker] = false;
    }

    // lock ether for the given beneficiary and given timestamp
    function deposit(address beneficiary, uint256 unlockTimestamp) external payable {
        require(isDesignatedLocker(beneficiary, msg.sender), "Not a designated locker.");
        require(unlockTimestamp > block.timestamp, "Unlock timestamp must be in future.");

        Lock memory newLock = Lock(msg.sender, beneficiary, msg.value, unlockTimestamp);
        lockedFundsByBeneficiary[beneficiary].push(newLock);
        lockedFundsByLocker[msg.sender].push(newLock);
    }

    // withdraw all eligible values for the beneficiary (sender). Eligible value is one whose timestamp has reached
    function withdraw() external nonReentrant {
        Lock[] storage beneficiaryLocks = lockedFundsByBeneficiary[msg.sender];
        uint256 totalEligibleValue = 0;
        uint256 i = 0;

        while (i < beneficiaryLocks.length) {
            if (beneficiaryLocks[i].unlockTimestamp <= block.timestamp) {
                totalEligibleValue += beneficiaryLocks[i].value;

                // Remove lock from lockedFundsByLocker
                Lock[] storage lockerLocks = lockedFundsByLocker[beneficiaryLocks[i].locker];
                for (uint256 j = 0; j < lockerLocks.length; j++) {
                    if (lockerLocks[j].beneficiary == msg.sender && lockerLocks[j].unlockTimestamp == beneficiaryLocks[i].unlockTimestamp) {
                        lockerLocks[j] = lockerLocks[lockerLocks.length - 1];
                        lockerLocks.pop();
                        break;
                    }
                }

                // Remove lock from lockedFundsByBeneficiary
                beneficiaryLocks[i] = beneficiaryLocks[beneficiaryLocks.length - 1];
                beneficiaryLocks.pop();
            } else {
                i++;
            }
        }

        require(totalEligibleValue > 0, "No eligible locked value to withdraw");
        payable(msg.sender).transfer(totalEligibleValue);
    }

    // get all locks by the given locker
    function getLockedValuesByLocker(address locker) external view returns (Lock[] memory) {
        return lockedFundsByLocker[locker];
    }

    // get all locks for the given beneficiary
    function getLockedValuesForBeneficiary(address beneficiary) external view returns (Lock[] memory) {
        return lockedFundsByBeneficiary[beneficiary];
    }
}
