var web3 = new Web3(Web3.givenProvider);
var contractInstance;



$(document).ready(function() {
    window.ethereum.enable()
    .then(function(accounts){
        //accounts is an array of addresses
        // abi is found in the compiled json of the contract
        // contract address is found in truffel console when migrate --reset is done
        contractInstance = new web3.eth.Contract(
          abi,
          "0x8324Fec0B0AAC95DdACDD01Da3CB302A66c7af58",
          {from: accounts[0]}
        );
        console.log(contractInstance);
    });

    $("#bet_heads_button").click(placeBetHeads);
    $("#bet_tails_button").click(placeBetTails);
    $("#set_balance_button").click(setBalance);
    $("#withdraw_button").click(withdraw);
    $("#get_balance_button").click(getBalance);
});

function withdraw() {
  var config = {};
  contractInstance.methods.withdrawGambledBalance()
  .send(config)
  .on("transactionHash", function(hash) {
    console.log("transactionHash =" + hash);
  })
  .on("confirmation", function(confirmationNr) {
      console.log("Confirmation = " + confirmationNr);
  })
  .on("receipt", function(receipt) {
    console.log(receipt);
  })
};

function getBalance() {
  contractInstance.methods.getBalance().call()
  .then(function(res) {
    console.log(res);
      $("#balance").text(" = " + web3.utils.fromWei(res, "ether") + " ETH");
  });
}

function setBalance() {
  var config = {
    value: web3.utils.toWei("2", "ether")
  }

  contractInstance.methods.refillPriceMoney()
  .send(config)
  .on("transactionHash", function(hash) {
    console.log("transactionHash =" + hash);
  })
  .on("confirmation", function(confirmationNr) {
      console.log("Confirmation = " + confirmationNr);
  })
  .on("receipt", function(receipt) {
    console.log(receipt);
  })
};

function placeBetHeads() {
  var amount = $("#amount_input").val();

  alert("Betted on heads " + amount + " ETH");
  var config = {
    value: web3.utils.toWei(amount, "ether")
  };

  placeBet(true, config);
};

function placeBetTails() {
  var amount = $("#amount_input").val();

  alert("Betting on tails " + amount + " ETH");
  var config = {
    value: web3.utils.toWei(amount, "ether")
  };

  placeBet(false, config);
};

function placeBet(isHeads, config) {
  contractInstance.methods.flipCoin(isHeads)
  .send(config)
  .on("transactionHash", function(hash) {
    console.log("transactionHash =" + hash);
  })
  .on("confirmation", function(confirmationNr) {
    //if (confirmationNr > 12) {
      console.log("Confirmation = " + confirmationNr);
    //}
  })
  .on("receipt", function(receipt) {
    console.log(receipt);
    // win or close
    if (receipt.events.betMade.returnValues["2"]) {
      $("#outcome_output").text("CONTRATS CHAD!!! YOU'VE WON");
    }
    else {
      $("#outcome_output").text("SORRY CHAD!!! YOU'VE LOST");
    }
    // Amount won or lost
    $("#gains_output").text(web3.utils.fromWei(receipt.events.betMade.returnValues["1"],"ether") + " ETH");
  })
};
