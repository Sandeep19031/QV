import { useEth } from "contexts/EthContext";
import React, { useEffect, useState } from "react";

export default function Winner({ proposaID, optionsList }) {
  const {
    state: { contract, accounts },
  } = useEth();

  const [totalVotesList, setTotalVotesList] = useState(
    Array.from(new Array(optionsList.length))
  );
  let arr = [];
  const totalVotes = {};
  for (let i = 0; i < optionsList.length; i++) {
    totalVotes[i + 1] = 0;
  }
  const [winnerIndex, setWinnerIndex] = useState();
  const [winnerVotes, setWinnerVotes] = useState();
  const [winnerName, setWinnerName] = useState();
  const [isComplete, setIsComplete] = useState(false);
  const [totalVotesObject, setTotalVotesObject] = useState(totalVotes);
  useEffect(() => {
    const fetchTotalVotes = async () => {
      try {
        for (let i = 0; i < optionsList.length; i++) {
          const res = await contract.methods.getWeight(proposaID, i + 1).call();
          totalVotesList[i] = res;
          setTotalVotesList(totalVotesList);
          console.log("res from total votes", totalVotesList);
        }
      } catch (err) {
        console.log("Error in fetching total votes", err);
      }
    };

    const getWinner = async () => {
      try {
        const res = await contract.methods.countVotes(proposaID).call();
        setWinnerIndex(res[0]);
        setWinnerVotes(res[1]);
        setWinnerName(res[2]);
        console.log("res from getWinner", res);
      } catch (err) {
        console.log("error in getWinner", err);
      }
    };

    const fetchData = async () => {
      await fetchTotalVotes();
      await getWinner();
      setIsComplete(true);
    };

    fetchData();
  });

  if (isComplete && totalVotesList.length === optionsList.length) {
    return (
      <div className="winner">
        <p></p>
        <h4 className="mt-3 mb-0 text-muted text-sm"> Result: </h4>
        {totalVotesList.map((vote, i) => {
          return (
            <p className="mt-3 mb-0 text-muted text-sm">
              {optionsList[i]} = {vote} votes
            </p>
          );
        })}
        {winnerName ? (
          <p className="mt-3 mb-0 text-muted text-sm">
            Winner is <b>{winnerName}</b> with <b>{winnerVotes}</b> votes.
          </p>
        ) : (
          <p className="mt-3 mb-0 text-muted text-sm"> Waiting for winner...</p>
        )}
      </div>
    );
  }
  return <></>;
}
