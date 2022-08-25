import {
  Card,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
  Table,
  FormGroup,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import Countdown, { zeroPad } from "react-countdown";
import "./Styles.scss";
import { useLocation } from "react-router-dom";
import { useEth } from "contexts/EthContext";
import { useEffect, useState } from "react";
import toast from "cogo-toast";
import Winner from "./Winner";

const Voting = () => {
  const location = useLocation();
  console.log("location", location);
  const proposalID = location.state.proposalID;
  const description = location.state.description;
  const noOfOptions = location.state.noOfOptions;
  const optionsList = location.state.optionsList;
  const expTime = location.state.expirationTime;
  const proposalStatus = location.state.proposalStatus;
  const voteRights = location.state.credits;
  const {
    state: { contract, accounts },
  } = useEth();

  const [remainingCredits, setRemainingCredits] = useState();
  const [totalCredits, setTotalCredits] = useState();
  const [subQuantity, setSubQuantity] = useState(Number(0));
  const [isComplete, setIsComplete] = useState(false);
  const [voted, setVoted] = useState();
  const [votesList, setVotesList] = useState(
    Array.from(new Array(noOfOptions))
  );
  const [update, setUpdate] = useState(false);
  const [votingTransacation, setVotingTransacation] = useState();
  let arr = [];
  for (let i = 1; i <= noOfOptions; i++) {
    arr.push(i);
  }
  useEffect(() => {
    const getRemainingCredits = async () => {
      try {
        // const credits = await contract.methods.balanceOf(accounts[0]).call();
        // console.log("res from balanceOf", credits, voteRights);

        const v = await contract.methods
          .allVoters(accounts[0], proposalID)
          .call();
        setRemainingCredits(Number(v.voteNum));
        setTotalCredits(Number(v.voteNum));
      } catch (err) {
        console.log("error in fetching proposal!");
      }
    };

    const checkVoted = async () => {
      try {
        // const v = await contract?.methods
        //   .userHasVoted(proposalID, accounts[0])
        //   .call();
        const v = await contract.methods
          .allVoters(accounts[0], proposalID)
          .call();
        console.log("user voted", v.hasVoted);
        setVoted(v.hasVoted);
      } catch (err) {
        console.log("user voted err", err);
      }
    };

    const fetchData = async () => {
      if (remainingCredits === undefined && contract !== null) {
        await getRemainingCredits();
      }
      if (voted === undefined && contract !== null) {
        await checkVoted();
      }
    };
    fetchData();
  });

  const handleSubmitButton = async () => {
    console.log("votesList", votesList);

    if (votesList.length !== noOfOptions) {
      return toast.error("Please vote to all the candidates. ");
    }
    try {
      const res = await contract.methods
        .responseProposal(proposalID, accounts[0], optionsList, votesList)
        .send({ from: accounts[0] });

      const res2 = contract.methods.allVoters(accounts[0], proposalID).call();
      setRemainingCredits(res2.voteNum);
      setSubQuantity(res2.voteNum);

      console.log("res from castVote", res);
      if (res) {
        toast.success("Your votes are successfully casted ...");
        setVoted(true);
        setVotingTransacation(res.blockHash);
      }
    } catch (err) {
      //toast.err("Error in Vote Casting !!");
      console.log("Proposal has expired");
      toast.error("There is some error in casting your vote!!");
    }
  };

  const handleVoteInput = (e, index) => {
    if (isComplete) {
      toast.error("Proposal is ended..");
      return (e.target.value = null);
    }
    if (voted) {
      toast.error("You have already voted.");
      return (e.target.value = null);
    }
    let name = e.target.name;
    let newValue = e.target.value;
    let sQ = newValue * newValue;

    let rc = remainingCredits + subQuantity - sQ;
    console.log(
      "subQuantity",
      subQuantity,
      "sQ",
      sQ,
      "remaing credit",
      remainingCredits,
      "totalCredits",
      totalCredits
    );
    if (totalCredits === 0 || totalCredits === null) {
      toast.error("You don't have credits to vote..");
      return (e.target.value = null);
    }
    if (rc < 0) {
      return toast.error(
        "You'll exceed the remaining credits, you can't vote more"
      );
    }

    votesList[index] = Number(newValue);

    setVotesList(votesList);
    setRemainingCredits(rc);
    setSubQuantity(sQ);
  };

  const VoteContainer = ({ key, index, optionName }) => {
    return (
      <tr>
        <th scope="row">
          <span className="mb-0 text-sm">{optionName}</span>
        </th>
        <td>
          <Input
            type="number"
            value={votesList[index]}
            placeholder="Vote"
            min={0}
            name={index}
            onFocus={(e) => setSubQuantity(e.target.value * e.target.value)}
            onChange={(e) => {
              return handleVoteInput(e, index);
            }}
          />
        </td>
        <td>{votesList[index] * votesList[index]}</td>
      </tr>
    );
  };

  const VoteContainerList = arr.map((number) => {
    let index = number - 1;
    let optionName = optionsList[index];
    return VoteContainer({ key: number, index: index, optionName: optionName });
  });

  const CastVoteContainer = () => {
    return (
      <>
        {/* <p className="mt-3 mb-0 text-muted text-sm">{description}</p> */}
        <Table className="align-items-center table-flush" responsive borderless>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Votes</th>
              <th scope="col">Credits USed</th>
            </tr>
          </thead>
          <tbody>{VoteContainerList}</tbody>
        </Table>
      </>
    );
  };

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      setIsComplete(true);
    }
    // Render a countdown
    return (
      <span className="text-nowrap">
        TIME LEFT: {days} Days {zeroPad(hours)}:{zeroPad(minutes)}:
        {zeroPad(seconds)}
      </span>
    );
  };
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        {" "}
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col>
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      {description}
                    </CardTitle>

                    <Col>
                      <Row style={{ justifyContent: "space-between" }}>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          Remaining Credits: {remainingCredits}
                        </p>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          <Countdown
                            date={Number(expTime)}
                            renderer={renderer}
                          />
                        </p>
                      </Row>
                    </Col>
                    {CastVoteContainer()}

                    {isComplete ? (
                      <></>
                    ) : voted ? (
                      <></>
                    ) : (
                      <div className="text-center mt-4">
                        <Button
                          className="btn-icon btn-3"
                          color="primary"
                          type="button"
                          data-testid="submit-btn"
                          onClick={handleSubmitButton}
                        >
                          Submit
                        </Button>
                      </div>
                    )}

                    {!isComplete && voted ? (
                      <div>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          Your votes are successfully casted. Please wait for
                          the result...
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}

                    {voted ? (
                      <p>
                        Voting transaction{" "}
                        <a
                          href={`https://mumbai.polygonscan.com/block/${votingTransacation}`}
                          target="_blank"
                        >
                          {votingTransacation}
                        </a>
                      </p>
                    ) : (
                      <></>
                    )}
                    {isComplete && (
                      <Winner
                        proposaID={proposalID}
                        optionsList={optionsList}
                      />
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Voting;
