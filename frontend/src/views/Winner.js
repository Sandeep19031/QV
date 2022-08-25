import { useEth } from "contexts/EthContext";
import React, { useEffect, useState } from "react";

export default function Winner({ proposaID, optionsList }) {
  const {
    state: { contract, accounts },
  } = useEth();

  const [state, setState] = useState({
    totalVotesList: [],
    winnerVotes: null,
    winnerName: [],
  });
  useEffect(() => {
    const getMaxIndexs = async (res, maxVotes) => {
      var maxIndexs = [];
      for (var i = 0; i < res.length; i++) {
        if (Number(res[i]) === maxVotes) {
          maxIndexs.push(i);
        }
      }
      return maxIndexs;
    };
    const getWinner = async (res, maxVotes) => {
      const maxIndexs = await getMaxIndexs(res, maxVotes);
      let winner = [];
      for (let i = 0; i < maxIndexs.length; i++) {
        winner.push(optionsList[maxIndexs[i]]);
      }

      return winner;
    };
    const fetchTotalVotes = async () => {
      try {
        const res = await contract.methods.votesArrayById(proposaID).call();
        const maxVotes = Math.max(...res);
        const winner = await getWinner(res, maxVotes);

        setState({
          totalVotesList: res,
          winnerVotes: maxVotes,
          winnerName: winner,
        });
        console.log("winner state", res);
      } catch {
        console.log("error in winner function");
      }
    };
    fetchTotalVotes();
  }, [contract]);

  return (
    <div className="winner">
      <p></p>
      <h4 className="mt-3 mb-0 text-muted text-sm"> Result: </h4>
      {state.totalVotesList.map((vote, i) => {
        return (
          <p className="mt-3 mb-0 text-muted text-sm">
            {optionsList[i]} = {vote} votes
          </p>
        );
      })}
      {state.winnerName.length > 1 ? (
        <p className="mt-3 mb-0 text-muted text-sm">
          Winners are{" "}
          {state.winnerName.map((winner) => {
            return <b>{winner} </b>;
          })}{" "}
          with <b>{state.winnerVotes}</b> votes.
        </p>
      ) : state.winnerName.length === 1 ? (
        <p className="mt-3 mb-0 text-muted text-sm">
          Winner is <b>{state.winnerName[0]} </b>
          with <b>{state.winnerVotes}</b> votes.
        </p>
      ) : (
        <p className="mt-3 mb-0 text-muted text-sm"> Waiting for winner...</p>
      )}
    </div>
  );
}
