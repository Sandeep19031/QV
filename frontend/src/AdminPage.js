import React, { useEffect } from "react";
import CreateProposal from "views/CreateProposal";
import Mint from "views/Mint";
import ProposalList from "views/ProposalList";

export default function AdminPage() {
  return (
    <div>
      <CreateProposal />
      <hr />
      <Mint />
      <hr />
      <ProposalList />
    </div>
  );
}
