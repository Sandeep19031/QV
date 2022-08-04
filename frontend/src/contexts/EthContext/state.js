const actions = {
  init: "INIT",
  createProposal: "CREATE_PROPOSAL",
  setDescription: "SET_DESCRIPTION",
  setCredits: "SET_CREDITS",
};

const initialState = {
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contract: null,
  isAdmin: null,
  proposalID: null,
  description: null,
  credits: null,
};

const reducer = (state, action) => {
  const { type, data } = action;

  switch (type) {
    case actions.init:
      return { ...state, ...data };
    case actions.createProposal:
      return { ...state, ...data };

    case actions.setDescription:
      return { ...state, ...data };

    case actions.setCredits:
      return { ...state, ...data };
    default:
      throw new Error("Undefined reducer action type");
  }
};

export { actions, initialState, reducer };
