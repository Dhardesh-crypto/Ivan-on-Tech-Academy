const CoinFlip = artifacts.require("CoinFlip");
const truffleAssert = require('truffle-assertions');

contract("CoinFlip", async function(accounts) {
    let instance;

    before(async function() {
      instance = await CoinFlip.deployed();
    });

    it("should not allow non-owners to fund the balance", async function() {
      await truffleAssert.fails(instance.refillPriceMoney({from: accounts[2], value: 1000}), truffleAssert.ErrorType.REVERT);
    });
    it("should allow owner to fund the balance", async function() {
      await truffleAssert.passes(instance.refillPriceMoney({from: accounts[0], value: 1000}), truffleAssert.ErrorType.REVERT);
    });
    it("should not allow non-owner to witdraw the balance", async function() {
      await truffleAssert.fails(instance.withdrawGambledBalance({from: accounts[2]}), truffleAssert.ErrorType.REVERT);
    });
    it("should allow owner to witdraw the balance", async function() {
      await truffleAssert.passes(instance.withdrawGambledBalance({from: accounts[0]}), truffleAssert.ErrorType.REVERT);
    });
    it("should not allow a bet bigger than half the value of the balance", async function() {
      // First fill her up
      await instance.refillPriceMoney({from: accounts[0], value: web3.utils.toWei("1", "ether")});
      // Now try to ganble with more than half te price money
      await truffleAssert.fails(instance.flipCoin(false, {value: web3.utils.toWei("1.1", "ether")}));
    });
    it("should allow a bet smaller up half the value of the balance", async function() {
      // First fill her up
      await instance.refillPriceMoney({from: accounts[0], value: web3.utils.toWei("1", "ether")});
      // Now try to ganble with more than half te price money
      await truffleAssert.passes(instance.flipCoin(false, {value: web3.utils.toWei("1", "ether")}));
    });
});
