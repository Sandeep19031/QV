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
import "./Styles.scss";
import { useEffect, useState } from "react";
import { useEth } from "contexts/EthContext";
import toast from "cogo-toast";
import { Link } from "react-router-dom";
import ProposalCard from "./ProposalCard";

const ProposalList = () => {
  const [proposalCount, setProposalCount] = useState(Number(0));
  const [proposalList, setProposalList] = useState(
    Array.from(new Array(proposalCount))
  );
  const [refresh, setRefresh] = useState(false);
  const [balance, setBalance] = useState(Number(0));
  const {
    state: { contract, accounts },
  } = useEth();

  useEffect(() => {
    const ProposalCount = async () => {
      try {
        const pC = await contract?.methods.getProposalCount().call();
        let balance = await contract?.methods.balanceOf(accounts[0]).call();
        setBalance(balance);
        setProposalCount(pC);
        console.log("res from pC", pC);
      } catch (err) {
        toast.error("Error while fetching proposals!!");
        console.log("proposal fetching error", err);
      }
    };

    const fetProposalInfo = async (pID) => {
      let res;

      console.log(
        "varible",
        contract.methods.proposals(1).call((err, res) => {
          console.log(res);
        })
      );
      try {
        res = await contract?.methods.proposals(pID).call();
        console.log("res", res);
        let oL = await contract?.methods.optionById(pID).call();

        console.log("options", oL);
        let pInfoObject = {
          description: res[2],
          optionsList: oL,
          noOfOptions: oL.length,
          expirationTime: res[4],
          status: res[1],
          credits: res[6],
        };
        console.log("prepared object", pInfoObject);
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
            <h4 style={{ color: "white" }}>Balance: {balance}</h4>
            <Row>
              {(proposalCount == 0 || proposalCount === undefined) && (
                <h4>No proposals..</h4>
              )}

              {proposalCount > 0 &&
                proposalList?.map((proposal, index) => {
                  if (index === 0) return;
                  let isComplete = Date.now() > proposal.expirationTime;
                  return <ProposalCard proposal={proposal} index={index} />;
                })}
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default ProposalList;
