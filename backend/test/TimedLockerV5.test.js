const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TimedLockerV5", function () {
  let timedLocker;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const TimedLockerV5 = await ethers.getContractFactory("TimedLockerV5");
    timedLocker = await TimedLockerV5.deploy();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(timedLocker.target).to.be.properAddress;
    });
  });

  describe("Designated Lockers", function () {
    it("Should allow adding designated lockers", async function () {
      await timedLocker.connect(addr1).addDesignatedLocker(addr2.address);
      // Test would pass if no error is thrown
    });

    it("Should allow removing designated lockers", async function () {
      await timedLocker.connect(addr1).addDesignatedLocker(addr2.address);
      await timedLocker.connect(addr1).removeDesignatedLocker(addr2.address);
      // Test would pass if no error is thrown
    });
  });

  describe("Deposits", function () {
    it("Should allow self-deposits", async function () {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      await timedLocker.connect(addr1).deposit(addr1.address, futureTimestamp, {
        value: ethers.parseEther("1.0")
      });
      
      const locks = await timedLocker.getLockedValuesForBeneficiary(addr1.address);
      expect(locks.length).to.equal(1);
      expect(locks[0].value).to.equal(ethers.parseEther("1.0"));
    });
  });
}); 