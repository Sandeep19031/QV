import React from "react";
import ProposalList from "views/ProposalList";
import BrainChainLogo from "./assets/img/brand/BrainChainNew.png";

export default function VoterPage() {
  return (
    <div>
      <img
        alt="..."
        src={BrainChainLogo}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          width: "5%",
          zIndex: "100",
        }}
      />
      <ProposalList />
    </div>
  );
}
