import React, { useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import Burn from "./Burn";

export default function ProposalCard({ proposal, index }) {
  const [isComplete, setIsComplete] = useState();
  return (
    <Col lg="6" xl="3">
      <Card className="card-stats mb-4 mb-xl-0">
        <CardBody>
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
                credits: proposal.credits,
              },
            }}
            style={{ textDecoration: "none" }}
          >
            <Row>
              <div className="col">
                <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                  Proposal No
                </CardTitle>
                <span className="h2 font-weight-bold mb-0">{index}</span>
              </div>
            </Row>
          </Link>
          <p className="mt-3 mb-0 text-muted text-sm">
            <Countdown
              date={Number(proposal.expirationTime)}
              renderer={({ days, hours, minutes, seconds, completed }) => {
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
              }}
            />
          </p>
          {isComplete ? <Burn proposalID={index} /> : <></>}
        </CardBody>
      </Card>
    </Col>
  );
}
