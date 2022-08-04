import React, { useEffect, useReducer, useState } from "react";
import "./CreateProposal.css";

import toast from "cogo-toast";
import { useEth } from "contexts/EthContext";

export default function CreateProposal() {
  const [description, setDescription] = useState();
  const [expTime, setExpTime] = useState(0);
  const [noOfOptions, setNoOfOptions] = useState();
  const [optionsList, setOptionsList] = useState(
    Array.from(new Array(noOfOptions)).map((_) => "")
  );

  const {
    state: { contract, accounts },
  } = useEth();

  useEffect(() => {});

  const handleCreateButton = async () => {
    try {
      console.log("option list", optionsList);
      const res = await contract.methods
        .createProposal(description, optionsList, expTime)
        .send({ from: accounts[0] });

      toast.success("Successfully Created..");
    } catch (err) {
      console.log(err);
      toast.error("Error in Creating Proposal !!");
    }
  };

  let arr = [];
  for (let i = 0; i < noOfOptions; i++) {
    arr.push(i);
  }
  let initialState = {};

  arr.forEach((element) => {
    initialState[element] = "";
  });

  const [input, setInput] = useState(initialState);
  let inputName = 0;

  const handleUserInputChange = (e) => {
    const name = e.target.name;
    const newValue = e.target.value;

    let newOptionsList = optionsList;
    newOptionsList[name - 1] = newValue;
    setInput({ [name]: newValue });
    setOptionsList(newOptionsList);
  };

  const OptionInput = arr.map((number) => {
    inputName++;
    return (
      <div className="options" key={number + 1}>
        <div className="option-title">
          <p>Option {number + 1} </p>
        </div>
        <div className="option-inputBox">
          <input
            type="text"
            className="option-input"
            placeholder="option"
            value={optionsList[inputName - 1]}
            name={inputName}
            onChange={handleUserInputChange}
          />
        </div>
      </div>
    );
  });

  return (
    <div className="createPurposal">
      <div className="title">
        <h2>Proposal for voting</h2>
        <br />
      </div>

      <div className="description">
        <div className="description-title">
          <p>Description: </p>
        </div>
        <div className="description-inputBox">
          <input
            type="textarea"
            className="description-input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="noOfOptions">
        <div className="noOfOptions-title">
          <p>Total Options: </p>
        </div>
        <div className="noOfOptions-inputBox">
          <input
            type="number"
            className="noOfOptions-input"
            placeholder="Options"
            value={noOfOptions}
            onChange={(e) => setNoOfOptions(e.target.value)}
          />
        </div>
      </div>
      {OptionInput}

      <div className="expirationTime">
        <div className="expirationTime-title">
          <p>expirationTime: </p>
        </div>
        <div className="expirationTime-inputBox">
          <input
            type="number"
            className="expirationTime-input"
            placeholder="Expiration Time"
            value={expTime}
            onChange={(e) => setExpTime(e.target.value)}
          />
        </div>
      </div>

      <div className="button-container">
        <div className="createButton" onClick={handleCreateButton}>
          <p>CREATE</p>
        </div>
      </div>
    </div>
  );
}
