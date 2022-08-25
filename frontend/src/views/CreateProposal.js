import React, { useEffect, useReducer, useRef, useState } from "react";

import toast from "cogo-toast";
import { useEth } from "contexts/EthContext";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  FormGroup,
  Input,
  Row,
} from "reactstrap";
import "./Styles.scss";
import Multiselect from "multiselect-react-dropdown";
import votersList from "./voterData";
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

  const [voteRight, setVoteRight] = useState();
  const selectedDropdown = useRef();
  const multiselectRef = useRef();
  const [state, setState] = useState({
    selectedVoters: [],
  });
  const reset = () => {
    setDescription("");
    setExpTime(0);
    setNoOfOptions(0);
    setOptionsList(Array.from(new Array(noOfOptions)).map((_) => ""));
    setVoteRight(0);
    setState({ selectedVoters: [] });
  };
  const handleCreateButton = async () => {
    try {
      console.log("option list", optionsList);

      let voterList = state.selectedVoters.map((e, k) => e.label);
      console.log("voterList", voterList);
      console.log("date now", Date.now());
      console.log("exp time", Date.now() + expTime * 60 * 1000);
      console.log("owner address", accounts[0]);

      // const burnByOwner = contract.methods
      //   .burnOwner(2, accounts[0])
      //   .call({ from: accounts[0] });
      // console.log("burn ownber", burnByOwner);

      const res = await contract.methods
        .createProposal(
          2,
          voterList,
          accounts[0],
          Date.now(),
          Date.now() + expTime * 60 * 1000 + 5000,
          description,
          optionsList,
          voteRight
        )
        .send({ from: accounts[0] });

      toast.success("Successfully Created..");
      console.log("res of create proposal", res);
      reset();
    } catch (err) {
      console.log("create proposal", err);
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
      <Row>
        <Col lg="6">
          <FormGroup>
            <label className="form-control-label" htmlFor="input-username">
              Option {number + 1}
            </label>
            <Input
              className="form-control-alternative"
              id="input-option"
              placeholder="Option"
              type="text"
              value={optionsList[inputName - 1]}
              name={inputName}
              onChange={handleUserInputChange}
            />
          </FormGroup>
        </Col>
      </Row>
    );
  });

  const AddVoter = () => {
    return (
      <Row>
        <Col>
          <FormGroup>
            <label className="form-control-label" htmlFor="input-username">
              Add voters
            </label>
            <Multiselect
              options={votersList}
              singleSelect={false}
              key={state.selectedVoters.length}
              selectedValues={state.selectedVoters}
              onSelect={(event) => setState({ selectedVoters: event })}
              displayValue="label"
              showCheckbox={true}
              onRemove={(event) => setState({ selectedVoters: event })}
              placeholder="Select or Search voters"
              ref={multiselectRef}
            />
          </FormGroup>
        </Col>
      </Row>
    );
  };

  const onSelect = (selectedList, selectedItem) => {
    clearTimeout(selectedDropdown);
    let timeout = 2000;
    selectedDropdown = setTimeout(() => {
      setState({ selectedVoters: selectedList });
    }, timeout);
  };
  return (
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
          <Row style={{ justifyContent: "center" }}>
            <Card className="card-stats mb-4 mb-xl-0" style={{ width: "50%" }}>
              <CardBody>
                <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                  Create Proposal
                </CardTitle>

                <div className="pl-lg-4">
                  <Row>
                    <Col>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-username"
                        >
                          Description
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-description"
                          placeholder="Description"
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-username"
                        >
                          No. of options
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-description"
                          placeholder="noOfOptions"
                          type="text"
                          value={noOfOptions}
                          onChange={(e) => setNoOfOptions(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {OptionInput}
                  <Row>
                    <Col>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-username"
                        >
                          Expiration Time(Min)
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-description"
                          placeholder="min"
                          type="number"
                          min={0}
                          value={expTime}
                          onChange={(e) => setExpTime(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-voteRight"
                        >
                          Vote Right
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-voteRight"
                          placeholder="0"
                          type="number"
                          min={0}
                          value={voteRight}
                          onChange={(e) => setVoteRight(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <AddVoter />
                  <div className="text-center mt-4">
                    <Button
                      className="btn-icon btn-3"
                      color="primary"
                      type="button"
                      data-testid="submit-btn"
                      onClick={handleCreateButton}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Row>
        </div>
      </Container>
    </div>
  );
}
