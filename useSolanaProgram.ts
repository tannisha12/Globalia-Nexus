import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useCallback } from 'react';
import { Meme } from '../types/meme';

// Mock program ID - in production, this would be your deployed Solana program
const PROGRAM_ID = new PublicKey('11111111111111111111111111111111');

export const useSolanaProgram = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const uploadMeme = useCallback(async (imageHash: string, caption: string): Promise<string> => {
    if (!publicKey) throw new Error('Wallet not connected');

    // In a real implementation, this would create a transaction to store meme data
    // For demo purposes, we'll simulate the on-chain storage
    const memeId = Date.now().toString();
    
    // Store in localStorage for demo (in production, this would be on-chain)
    const existingMemes = JSON.parse(localStorage.getItem('memes') || '[]');
    const newMeme: Meme = {
      id: memeId,
      imageUrl: imageHash,
      caption,
      author: publicKey.toString(),
      timestamp: Date.now(),
      likes: 0,
      likedBy: [],
      comments: []
    };
    
    existingMemes.unshift(newMeme);
    localStorage.setItem('memes', JSON.stringify(existingMemes));
    
    return memeId;
  }, [publicKey]);

  const likeMeme = useCallback(async (memeId: string): Promise<void> => {
    if (!publicKey) throw new Error('Wallet not connected');

    // In production, this would interact with the Solana program
    const existingMemes = JSON.parse(localStorage.getItem('memes') || '[]');
    const memeIndex = existingMemes.findIndex((m: Meme) => m.id === memeId);
    
    if (memeIndex !== -1) {
      const meme = existingMemes[memeIndex];
      const userAddress = publicKey.toString();
      
      if (meme.likedBy.includes(userAddress)) {
        // Unlike
        meme.likedBy = meme.likedBy.filter((addr: string) => addr !== userAddress);
        meme.likes--;
      } else {
        // Like
        meme.likedBy.push(userAddress);
        meme.likes++;
      }
      
      localStorage.setItem('memes', JSON.stringify(existingMemes));
    }
  }, [publicKey]);

  const addComment = useCallback(async (memeId: string, text: string): Promise<void> => {
    if (!publicKey) throw new Error('Wallet not connected');

    const existingMemes = JSON.parse(localStorage.getItem('memes') || '[]');
    const memeIndex = existingMemes.findIndex((m: Meme) => m.id === memeId);
    
    if (memeIndex !== -1) {
      const meme = existingMemes[memeIndex];
      if (!meme.comments) meme.comments = [];
      
      meme.comments.push({
        id: Date.now().toString(),
        text,
        author: publicKey.toString(),
        timestamp: Date.now()
      });
      
      localStorage.setItem('memes', JSON.stringify(existingMemes));
    }
  }, [publicKey]);

  return {
    uploadMeme,
    likeMeme,
    addComment,
    isConnected: !!publicKey
  };
};