import toast from "cogo-toast";
import useEth from "contexts/EthContext/useEth.js";
import React, { useEffect, useState } from "react";
import { Button, Container, Toast } from "reactstrap";
import voterList from "./voterData.js";

export default function Burn({ proposalID }) {
  // const voter = await contract.methods
  //   .allVoters("0xffd3452eFa0eda06F8F1F7e2442C3E075905AE3e", 1)
  //   .call();
  // console.log("res voters", voter.proposalId);
  const {
    state: { contract, accounts },
  } = useEth();
  const [voters, setVoters] = useState([]);
  const [alreadyBurned, setAlreadyBurned] = useState();
  useEffect(() => {
    let list = [];
    const checkAlreadyBurned = async () => {
      try {
        const checkBurn = await contract.methods
          .allVoters(list[0], proposalID)
          .call();
        if (checkBurn.burn) {
          setAlreadyBurned(true);
        }
        console.log("checkBurn", checkBurn);
      } catch {
        console.log("Err in Check Burn function");
      }
    };
    const checkVoter = async (addr) => {
      const res = await contract.methods.allVoters(addr, proposalID).call();
      if (res.proposalId == proposalID) {
        return true;
      }
      return false;
    };

    const getVoters = async () => {
      for (let i = 0; i < voterList.length; i++) {
        const b = await checkVoter(voterList[i].label);
        if (b === true) {
          list.push(voterList[i].label);
        }
        console.log("im calling check voters", b);
      }
      setVoters(list);
    };

    const fetch = async () => {
      await getVoters();
      await checkAlreadyBurned();
    };

    fetch();
  }, []);

  const BurnToken = async () => {
    console.log("voters List", voters, alreadyBurned);
    if (alreadyBurned) {
      return toast.error("Already Burned...");
    }
    try {
      const burn = await contract.methods
        .burnOwner(proposalID, accounts)
        .send({ from: accounts[0] });
      if (burn) {
        toast.success("Successfully Burned!!");
      }
      console.log("burn", burn);
    } catch (err) {
      toast.error("Error in Burn function...");
      console.log(err);
    }
  };
  return (
    <Container className="mt-1 box-bg" style={{ paddingLeft: "0px" }}>
      <Button style={{ backgroundColor: "#ea6464" }} onClick={BurnToken}>
        Burn{" "}
      </Button>
    </Container>
  );
}
