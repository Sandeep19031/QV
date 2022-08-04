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
import { useEffect, useState } from "react";
import { useEth } from "contexts/EthContext";
import toast from "cogo-toast";
import { Link } from "react-router-dom";

const ProposalCard = () => {
  return (
    <Col lg="6" xl="3">
      <Card className="card-stats mb-4 mb-xl-0">
        <CardBody>
          <Row>
            <div className="col">
              <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                Proposal No
              </CardTitle>
              <span className="h2 font-weight-bold mb-0">1</span>
            </div>
          </Row>
          <p className="mt-3 mb-0 text-muted text-sm">
            <Countdown
              date={Date.now() + 100000000}
              renderer={({ days, hours, minutes, seconds }) => (
                <span className="text-nowrap">
                  TIME LEFT: {days} Days {zeroPad(hours)}:{zeroPad(minutes)}:
                  {zeroPad(seconds)}
                </span>
              )}
            />
          </p>
        </CardBody>
      </Card>
    </Col>
  );
};
const ProposalList = () => {
  const [proposalCount, setProposalCount] = useState(Number(0));
  const [proposalList, setProposalList] = useState(
    Array.from(new Array(proposalCount))
  );
  const [refresh, setRefresh] = useState(false);

  const {
    state: { contract, accounts },
  } = useEth();

  useEffect(() => {
    const ProposalCount = async () => {
      try {
        const pC = await contract?.methods
          .getProposalCount()
          .call({ from: accounts[0] });
        setProposalCount(pC);
        console.log("res from pC", pC);
      } catch (err) {
        toast.error("Error while fetching proposals!!");
      }
    };

    const fetProposalInfo = async (pID) => {
      let res;
      try {
        res = await contract?.methods
          .getDetails(pID)
          .call({ from: accounts[0] });
        let pInfoObject = {
          description: res[0],
          optionsList: res[1],
          noOfOptions: res[1].length,
          expirationTime: res[2],
          status: res[3],
        };
        return pInfoObject;
      } catch (err) {
        toast.error("Error in fetching proposal info!!");
      }
    };

    const Fetching = async () => {
      for (let i = 1; i <= proposalCount; i++) {
        const infoObj = await fetProposalInfo(i);
        proposalList[i] = infoObj;
        setProposalList(proposalList);
      }
    };

    const updateState = () => {
      if (proposalCount > 0 && refresh === false) {
        setRefresh(true);
      }
    };
    const getData = async () => {
      await ProposalCount();
      await Fetching();
      updateState();
    };
    getData();
  });
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              {proposalCount == 0 && <p>No proposals..</p>}
              {proposalCount > 0 &&
                proposalList?.map((proposal, index) => {
                  if (index === 0 || index < 5) return;
                  return (
                    <Col lg="6" xl="3">
                      <Link
                        to={{
                          pathname: `/castVote/${index}`,
                          state: {
                            proposalID: index,
                            description: proposal.description,
                            optionsList: proposal.optionsList,
                            noOfOptions: proposal.noOfOptions,
                            expirationTime: proposal.expirationTime,
                            proposalStatus: proposal.status,
                          },
                        }}
                        style={{ textDecoration: "none" }}
                      >
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Proposal No
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {index}
                                </span>
                              </div>
                            </Row>
                            <p className="mt-3 mb-0 text-muted text-sm">
                              <Countdown
                                date={proposal.expirationTime * 1000}
                                renderer={({
                                  days,
                                  hours,
                                  minutes,
                                  seconds,
                                }) => (
                                  <span className="text-nowrap">
                                    TIME LEFT: {days} Days {zeroPad(hours)}:
                                    {zeroPad(minutes)}:{zeroPad(seconds)}
                                  </span>
                                )}
                              />
                            </p>
                          </CardBody>
                        </Card>
                      </Link>
                    </Col>
                  );
                })}
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default ProposalList;
