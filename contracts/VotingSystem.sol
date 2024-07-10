// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract VotingSystem {
    address public owner;
    string public proposal;
    mapping(address => bool) public votes;
    uint256 public yesVotes;
    uint256 public noVotes;

    event Voted(address indexed voter, bool vote);
    event ProposalChanged(string newProposal);

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    constructor(string memory _proposal) {
        owner = msg.sender;
        proposal = _proposal;
    }

    function setProposal(string memory _proposal) public onlyOwner {
        proposal = _proposal;
        yesVotes = 0;
        noVotes = 0;
        emit ProposalChanged(_proposal);
    }

    function vote(bool _vote) public {
        require(!votes[msg.sender], "You have already voted");
        votes[msg.sender] = true;
        if (_vote) {
            yesVotes += 1;
        } else {
            noVotes += 1;
        }
        emit Voted(msg.sender, _vote);
    }

    function getVotes() public view returns (uint256, uint256) {
        return (yesVotes, noVotes);
    }
}
