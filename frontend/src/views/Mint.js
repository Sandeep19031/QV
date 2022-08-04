import React, { useState } from "react";
import toast from "cogo-toast";
import "./Mint.css";
import { useEth } from "contexts/EthContext";

export default function Mint() {
  const [account, setAccount] = useState();
  const [credit, setCredit] = useState();
  const {
    state: { contract, accounts },
    dispatch,
  } = useEth();
  const handleMintButton = async () => {
    try {
      const res = await contract.methods
        .mint(account, credit)
        .send({ from: accounts[0] });

      toast.success("Minted");
    } catch (err) {
      console.log("err in mint function", err);
    }
  };
  return (
    <div className="mint">
      <h3>Mint Credit</h3>
      <br />
      <div className="accountInput">
        <p>Account Address:</p>
        <div className="accountInputContainer">
          <input
            type="text"
            value={account}
            placeholder="account"
            onChange={(e) => setAccount(e.target.value)}
          />
        </div>
      </div>
      <div className="creditInput">
        <p>Credit: </p>
        <div className="creditInputContainer">
          <input
            type="number"
            value={credit}
            placeholder="credit"
            onChange={(e) => setCredit(e.target.value)}
          />
        </div>
      </div>
      <div className="buttonContainer">
        <div className="mintButton" onClick={handleMintButton}>
          <p>MINT</p>
        </div>
      </div>
    </div>
  );
}
