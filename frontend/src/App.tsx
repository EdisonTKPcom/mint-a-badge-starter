import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useMemo, useState } from 'react';
import { parseAbi, createPublicClient, http, decodeEventLog } from 'viem';
import { sepolia } from 'wagmi/chains';

const ABI = parseAbi([
  "function mint()",
  "function hasMinted(address) view returns (bool)",
  "function totalMinted() view returns (uint256)",
  "function tokenURI(uint256) view returns (string)",
  "event Minted(address indexed to, uint256 indexed tokenId)"
]);

const CONTRACT = (import.meta.env.VITE_CONTRACT_ADDRESS || '').trim() as `0x${string}`;

const client = createPublicClient({ chain: sepolia, transport: http() });

export default function App() {
  const { address, isConnected } = useAccount();
  const [myId, setMyId] = useState<number | null>(null);

  const { data: already } = useReadContract({
    address: CONTRACT,
    abi: ABI,
    functionName: 'hasMinted',
    args: [address ?? '0x0000000000000000000000000000000000000000']
  });

  const { data: total } = useReadContract({
    address: CONTRACT,
    abi: ABI,
    functionName: 'totalMinted'
  });

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleMint = () => {
    writeContract({ address: CONTRACT, abi: ABI, functionName: 'mint' });
  };

  useEffect(() => {
    if (isSuccess) {
      // after success, read total to infer id; robust way: scan the tx logs
      (async () => {
        try {
          const receipt = await client.getTransactionReceipt({ hash: hash! });
          const ev = receipt.logs
            .map(log => {
              try {
                return decodeEventLog({ abi: ABI, data: log.data, topics: log.topics });
              } catch { return null; }
            })
            .find(e => e && e.eventName === 'Minted');
          if (ev && ev.args && typeof ev.args.tokenId === 'bigint') {
            setMyId(Number(ev.args.tokenId));
          }
        } catch {
          if (total) setMyId(Number(total));
        }
      })();
    }
  }, [isSuccess, hash, total]);

  const MintButton = useMemo(() => (
    <button
      onClick={handleMint}
      disabled={!isConnected || Boolean(already) || isPending || isMining || !CONTRACT}
      style={{ padding: '10px 16px', borderRadius: 12, border: '1px solid #ddd', cursor: 'pointer' }}
    >
      { !CONTRACT ? 'Set VITE_CONTRACT_ADDRESS' : already ? 'Already minted' : (isPending || isMining) ? 'Minting…' : 'Mint My Badge' }
    </button>
  ), [already, isConnected, isPending, isMining]);

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!myId) return;
      const tokenUri = await client.readContract({ address: CONTRACT, abi: ABI, functionName: 'tokenURI', args: [BigInt(myId)] }) as string;
      setUri(tokenUri);
      if (tokenUri.startsWith("data:application/json;base64,")) {
        const b64 = tokenUri.replace("data:application/json;base64,", "");
        const json = JSON.parse(atob(b64));
        setImgSrc(json.image);
      }
    };
    load();
  }, [myId]);

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'Inter, system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Mint‑a‑Badge</h1>
        <ConnectButton />
      </div>

      {!isConnected && <p>Connect your wallet to mint your on‑chain SVG badge.</p>}

      {isConnected && (
        <>
          <p><b>Address:</b> {address}</p>
          <p><b>Total minted:</b> {String(total ?? 0)}</p>
          {MintButton}

          {myId && (
            <div style={{ marginTop: 16 }}>
              <p>Your token ID: <b>#{myId}</b></p>
              {imgSrc && <img src={imgSrc} width={256} height={256} />}
              {uri && <details style={{marginTop:8}}><summary>tokenURI</summary><pre style={{ whiteSpace:'pre-wrap', background:'#f6f6f6', padding:12, borderRadius:8 }}>{uri}</pre></details>}
            </div>
          )}
        </>
      )}

      <hr style={{ margin: '24px 0' }} />
      <h3>Setup</h3>
      <ol>
        <li>In project root: <code>npm i</code></li>
        <li>Copy <code>.env.example</code> to <code>.env</code> and fill values.</li>
        <li>Compile: <code>npm run compile</code></li>
        <li>Deploy: <code>npm run deploy:sepolia</code> (copy the printed address)</li>
        <li>Frontend: <code>cd frontend && npm i && cp .env.example .env</code>, then set <code>VITE_*</code> values</li>
        <li>Run FE dev server: <code>npm run dev</code></li>
      </ol>
    </div>
  );
}
