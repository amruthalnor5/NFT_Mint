import React, { useState, useEffect, useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Web3 from 'web3';
import Navigation from './components/Navigation';
import Create from './pages/Create';
import Networks from './Networks/Networks.json';
import Home from './pages/Home';
import NFTAbi from './contractsData/NFT.json';
import NFTAddress from './contractsData/NFT-address.json';
import { Spinner } from 'react-bootstrap';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

const networks = Networks.map((value)=>{
  return {
    ...value,
    chainId : `0x${Number(value.chainId).toString(16)}`,
  }
});

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({})
  const [currentNetwork, setCurrentNetwork] = useState();

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    sessionStorage.setItem("ACCOUNT", accounts[0]);
    setAccount(accounts[0]);

    const _network = window.ethereum.networkVersion;
    const web3 = new Web3(window.ethereum);
  
    const storeNetwork =  Networks.find(el => el.chainId == _network);
    setCurrentNetwork(storeNetwork);

    if (_network && !storeNetwork) {
      await changeNetwork(Networks[0].chainName);
    }

    window.ethereum.on('chainChanged', async (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      console.log('accountsChanged');
      window.location.reload();
    })
    loadContracts(storeNetwork,web3); 
  }

  const loadContracts = async (network,web3) => {
    if (network) {
      const nft = new web3.eth.Contract(NFTAbi, NFTAddress[network.chainId]);
      setNFT(nft)
      setLoading(false); 
    }
  }

  const changeNetwork = async (e) => {
    const networkName = e;
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId : networks.find((e)=> e.chainName === networkName).chainId
          }
        ]
      });
    } catch (err) {
      console.log("changeNetwork err:",err);
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                  ...networks.find((e)=> e.chainName === networkName)
              }
            ],
          });
        } catch (error) {
          console.log("changeNetwork error:",error);
        }
      }
    }
  };

  useEffect(()=>{
    web3Handler();
  },[]);

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <>
            <Navigation web3Handler={web3Handler} account={account} changeNetwork={changeNetwork} currentNetwork={currentNetwork} />
          </>
          <div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Spinner animation="border" style={{ display: 'flex' }} />
                <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={
                  <Home currentNetwork={currentNetwork} account={account} nft={nft} />
                } />
                <Route path="/create" element={
                  <Create currentNetwork={currentNetwork} nft={nft} account={account} />
                } />
              </Routes>
            )}
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
