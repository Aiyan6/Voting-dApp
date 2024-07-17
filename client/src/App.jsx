import { useState, useEffect } from 'react';
import {ethers} from 'ethers';
import {contractAbi, contractAddress} from './constant/constant';

import Header from './components/Header/Header';

import WelcomePage from './components/WelcomePage/WelcomePage';
import VotingPage from './components/VotingPage/VotingPage';
import PollOverPage from './components/PollOverPage/PollOverPage';

import './App.css';

function App() {

  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState(null);
  const [options, setOptions] = useState([]);
  const [number, setNumber] = useState(null);
  const [CanVote, setCanVote] = useState(true);
  const [question, setQuestion] = useState('');


  useEffect( () => {
    getOptions();
    getRemainingTime();
    getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return() => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  });


  async function vote() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract (contractAddress, contractAbi, signer);

      const tx = await contractInstance.vote(number);
      await tx.wait();
      canVote();
  }

  async function canVote() {

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract (contractAddress, contractAbi, signer);
      const voteStatus = await contractInstance.voters(await signer.getAddress());

      setCanVote(voteStatus);

  }

  async function getQuestion() {

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

    const question = await contractInstance.getQuestion();

    setQuestion(question);
  }

  async function getOptions() {

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

      const optionsList = await contractInstance.getAllVotes();
      const formattedOptionsList = optionsList.map((option, index) => {
        return {
          name: option.option,
          voteCount: Number(option.voteCount)
        }
      });

      setOptions(formattedOptionsList);
  }

  async function getRemainingTime() {

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract (contractAddress, contractAbi, signer);
    const time = await contractInstance.getRemainingTime();

    setRemainingTime(Number(time)/60);
}


  async function getCurrentStatus() {

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract (contractAddress, contractAbi, signer);
      const status = await contractInstance.getVotingStatus();

      setVotingStatus(status);
  }



  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
    } 
    
    else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setAccount(address);
        setIsConnected(true);

        canVote();
      } 
      
      catch (err) {
        console.error(err);
      }
    } 
    
    else {
      console.error("Metamask is not detected in the browser")
    }

  }

  async function handleOptionButtons(number) {
    setNumber(number);
    vote();
  }

  getQuestion();

  return (

    <>

      <Header/>

      { votingStatus 
      
      ? 
      (isConnected ? (<VotingPage 
                      account = {account}
                      options = {options}
                      remainingTime = {remainingTime}
                      pollQuestion = {question}
                      handleOptionButtons = {handleOptionButtons}
                      showButtons = {CanVote}/>) 
                      
                      : 
                      
                      (<WelcomePage connectWallet = {connectToMetamask}/>))

                      : 

                       <PollOverPage/>
      }
      
    </>

  );
}

export default App;