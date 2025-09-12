import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import App from './App'
import { config } from './wagmi'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <RainbowKitProvider theme={lightTheme()}>
        <App />
      </RainbowKitProvider>
    </WagmiProvider>
  </React.StrictMode>
)
