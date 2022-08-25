import React, { useEffect } from "react";
import CreateProposal from "views/CreateProposal";
import Profile from "views/examples/Profile";
import Mint from "views/Mint";
import ProposalList from "views/ProposalList";
import BrainChainLogo from "./assets/img/brand/BrainChainNew.png";

export default function AdminPage() {
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
      <CreateProposal />
      <hr />
      <ProposalList />
    </div>
  );
}
