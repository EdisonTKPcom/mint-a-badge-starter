import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';

export const chains = [sepolia] as const;

export const config = createConfig(getDefaultConfig({
  appName: 'MintABadge',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string,
  chains,
  transports: { [sepolia.id]: http() }
}));
