import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import {ChainId, ThirdwebProvider} from '@thirdweb-dev/react';
import { Sepolia } from "@thirdweb-dev/chains";
import App from './App';
import './index.css'
import { StateContextProvider } from './context';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThirdwebProvider clientId='74ed7df412e17432f6eb9afcff4d9cfb' activeChain={Sepolia} desiredChainId={ChainId.Sepolia}>
    <Router>
      <StateContextProvider>
      <App/>
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
)