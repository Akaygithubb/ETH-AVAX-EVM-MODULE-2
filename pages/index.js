import { useState, useEffect } from "react";
import { ethers } from "ethers";
import votingSystem_abi from "../artifacts/contracts/VotingSystem.sol/VotingSystem.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [votingSystem, setVotingSystem] = useState(undefined);
  const [proposal, setProposal] = useState("");
  const [yesVotes, setYesVotes] = useState(0);
  const [noVotes, setNoVotes] = useState(0);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const votingSystemABI = votingSystem_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getVotingSystemContract();
  };

  const getVotingSystemContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const votingSystemContract = new ethers.Contract(contractAddress, votingSystemABI, signer);

    setVotingSystem(votingSystemContract);
  };

  const fetchProposal = async () => {
    if (votingSystem) {
      const proposal = await votingSystem.proposal();
      setProposal(proposal);
    }
  };

  const fetchVotes = async () => {
    if (votingSystem) {
      const votes = await votingSystem.getVotes();
      setYesVotes(votes[0].toNumber());
      setNoVotes(votes[1].toNumber());
    }
  };

  const vote = async (vote) => {
    if (votingSystem) {
      const tx = await votingSystem.vote(vote);
      await tx.wait();
      fetchVotes();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use the voting system.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Connect MetaMask Wallet</button>;
    }

    if (!proposal) {
      fetchProposal();
    }

    return (
      <div>
        <p>Proposal: {proposal}</p>
        <p>Yes Votes: {yesVotes}</p>
        <p>No Votes: {noVotes}</p>
        <button onClick={() => vote(true)}>Vote Yes</button>
        <button onClick={() => vote(false)}>Vote No</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Voting System!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
