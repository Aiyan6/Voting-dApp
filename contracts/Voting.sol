// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Option {
        string option;
        uint256 voteCount;
    }

    Option[] public options;
    address owner;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

    string public question;

constructor(string memory _question, string[] memory _options, uint256 _durationInMinutes) {

    question = _question;

    for (uint256 i = 0; i < _options.length; i++) {
        options.push(Option({
            option: _options[i],
            voteCount: 0
        }));
    }
    owner = msg.sender;
    votingStart = block.timestamp;
    votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
}

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function vote(uint256 _optionIndex) public {
        require(!voters[msg.sender], "You have already voted.");

        options[_optionIndex].voteCount++;
        voters[msg.sender] = true;
    }

    function getQuestion() public view returns (string memory) {
        return question;
    }

    function getAllVotes() public view returns (Option[] memory) {
        return options;
    }

    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= votingStart, "The poll has not started yet.");
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }
}