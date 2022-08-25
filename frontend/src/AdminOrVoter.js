import React, { useEffect, useState } from "react";
import { useEth } from "./contexts/EthContext";
import { useNavigate } from "react-router-dom";
import toast from "cogo-toast";
import AdminPage from "./AdminPage";
import VoterPage from "./VoterPage";
import NoticeNoArtifact from "NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

export default function AdminOrVoter() {
  const [isAdmin, setIsAdmin] = useState(null);
  const { state } = useEth();
  const {
    state: { contract, accounts },
  } = useEth();

  useEffect(() => {
    const checkAdminLocal = async () => {
      const alreadyCheck = localStorage.getItem("isAdmin");
      if (alreadyCheck) {
        setIsAdmin(alreadyCheck);
        return true;
      } else {
        return false;
      }
    };

    const fethAdminInfo = async () => {
      try {
        const res = await contract.methods
          .checkAdmin()
          .call({ from: accounts[0] });

        if (res === true) {
          localStorage.setItem("isAdmin", "true");

          return true;
        } else if (res === false) {
          localStorage.setItem("isAdmin", "false");

          return false;
        }
      } catch (err) {
        toast.error("Error in Login!");
        console.log("error in login", err);
      }
    };

    const setUser = async () => {
      const res = await checkAdminLocal();

      if (res) {
        return;
      }
      if (contract && !isAdmin) {
        const admin = await fethAdminInfo();
        if (admin) {
          toast.success("Successfully Logged in as Admin!!");
        } else {
          toast.error("error");
        }
        setIsAdmin(admin);
      }
    };

    setUser();
  });

  if (isAdmin === "true") {
    return <AdminPage />;
  } else if (isAdmin === "false") {
    return <VoterPage />;
  } else {
    if (!state.artifact) {
      return <NoticeNoArtifact />;
    } else if (!state.contract) {
      return <NoticeWrongNetwork />;
    }
  }
  return <div>Loading...</div>;
}
