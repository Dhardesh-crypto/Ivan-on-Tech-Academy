import "./Owner.sol";
pragma solidity 0.5.12;

contract CoinFlip is Owner{

  uint private balance;

  modifier costs(uint cost) {
    require(msg.value >= cost, "Minimum bet is 0.1 ETH");
    _;
  }

  event betMade(address user, uint bet, bool);
  event fundingHappened(address owner, uint funding);

  function flipCoin(bool isHead) public payable costs(0.1 ether) returns(bool){
    // Check if balance is sufficient to support the bet
    require(balance >= msg.value, "Balance not sufficient to support bet");

    // Always add the amount beted to the balance first
    balance += msg.value;

    // Now use pseudo randomness to determine heads or tails
    bool coinFlipIsHead = (now % 2 == 0) ? false : true;
    bool betWon = false;
    // If the coinflip is head ad the person betted on head
    // Or coinflip is tails and person betted on tails
    if ((coinFlipIsHead && isHead) || (!coinFlipIsHead && !isHead))
    {
        balance -= msg.value*2;
        msg.sender.transfer(msg.value*2);
        betWon = true;
    }
    emit betMade(msg.sender, msg.value, betWon);
    return betWon;
  }

  // Function for the owner to refill the
  function refillPriceMoney() public isOwner payable returns(uint){
    require(msg.value > 0, "Cannot refund with nothing");
    balance += msg.value;
    emit fundingHappened(msg.sender, msg.value);
    return balance;
  }

  function getBalance() public isOwner view returns(uint) {
    return balance;
  }

  // Function for contractowner to transfer the gambled currency into his account
  function withdrawGambledBalance() public isOwner returns(uint) {
    uint toTransfer = balance;
    balance = 0;
    msg.sender.transfer(toTransfer);
    return toTransfer;
  }

}
