const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VotingModule", (m) => {
  const voting = m.contract("Voting", ["Is the sky blue?", ["Yes", "No"], 10080]);

  return { voting };
});