import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';

export const WalletConnection: React.FC = () => {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex items-center gap-3">
      {connected && publicKey && (
        <div className="hidden sm:flex items-center gap-2 bg-meme-green-500/20 backdrop-blur-sm rounded-lg px-3 py-1.5 text-meme-green-400 text-sm font-fun border border-meme-green-500/30">
          <Wallet size={16} />
          <span className="font-mono">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </span>
        </div>
      )}
      <WalletMultiButton className="!bg-gradient-to-r !from-meme-green-500 !to-meme-green-600 !text-dark-900 !rounded-lg !px-4 !py-2 !font-fun !font-semibold hover:!from-meme-green-600 hover:!to-meme-green-700 transition-all !border-0" />
    </div>
  );
};