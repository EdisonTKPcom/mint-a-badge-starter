# Mint‑a‑Badge — Web3 DApp Starter (3‑Hour Assignment)

One‑per‑wallet ERC‑721 with **on‑chain SVG** and a minimal **Vite/React + wagmi + RainbowKit** front end.

## Features
- ✅ OpenZeppelin ERC‑721
- ✅ `mint()` once per wallet, emits `Minted(address,to tokenId)`
- ✅ `tokenURI()` serves base64 JSON with embedded SVG
- ✅ React dapp: Connect → Mint → View image + tokenURI
- ✅ Hardhat deploy script and a simple unit test

## Quick Start

```bash
# 1) Install root deps
npm i

# 2) Configure env
cp .env.example .env
# Fill RPC_URL, PRIVATE_KEY, ETHERSCAN_KEY (optional), WALLETCONNECT_PROJECT_ID

# 3) Compile & Test
npm run compile
npm test

# 4) Deploy to Sepolia (or remove --network for local)
npm run deploy:sepolia
# Copy printed address into:
#   - .env -> CONTRACT_ADDRESS (optional)
#   - frontend/.env -> VITE_CONTRACT_ADDRESS

# 5) Frontend
cd frontend
npm i
cp .env.example .env
# Set VITE_WALLETCONNECT_PROJECT_ID and VITE_CONTRACT_ADDRESS
npm run dev
```

## Folder Structure
```
.
├─ contracts/          # Solidity
├─ script/             # deployment
├─ test/               # unit tests
└─ frontend/           # React + wagmi + RainbowKit
```

## FAQ
- **No WalletConnect ID?** Create one free at WalletConnect Cloud or temporarily use wagmi without RainbowKit.
- **Testnet faucets?** Use Sepolia ETH faucet(s) recommended by your RPC provider.
- **Local development?** Use Hardhat network (default). Add a custom RPC in your wallet to `http://127.0.0.1:8545`.

## License
MIT
