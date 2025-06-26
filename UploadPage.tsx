import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSolanaProgram } from '../hooks/useSolanaProgram';
import { uploadToIPFS, validateImageFile } from '../utils/imageUpload';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { connected } = useWallet();
  const { uploadMeme } = useSolanaProgram();
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) {
      setError('Please select a valid image file (JPG, PNG, GIF) under 10MB');
      return;
    }

    setError('');
    setImage(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!image || !caption.trim()) {
      setError('Please provide both an image and caption');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload image to IPFS (or equivalent)
      const imageHash = await uploadToIPFS(image);
      
      // Store meme data on Solana
      await uploadMeme(imageHash, caption.trim());
      
      // Navigate back to feed
      navigate('/');
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload meme. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setImage(null);
    setImagePreview('');
    setCaption('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-dark-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-meme-green-500/20">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-meme-green-500 to-meme-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-meme-green-500/30">
              <Upload className="w-8 h-8 text-dark-900" />
            </div>
            <h2 className="text-4xl font-meme text-transparent bg-gradient-to-r from-meme-green-400 to-meme-green-300 bg-clip-text mb-2">
              SHARE YOUR MEME
            </h2>
            <p className="text-gray-400 font-fun">
              Upload your masterpiece to the blockchain 🚀
            </p>
          </div>

          {!connected && (
            <div className="bg-yellow-900/50 border border-yellow-500/50 rounded-lg p-4 mb-6">
              <p className="text-yellow-300 text-center font-fun">
                Connect your wallet to upload memes
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-meme-green-400 mb-3 font-fun">
                <ImageIcon className="inline w-4 h-4 mr-1" />
                MEME IMAGE
              </label>
              
              {!imagePreview ? (
                <label className="border-2 border-dashed border-meme-green-500/50 rounded-xl p-8 block cursor-pointer hover:border-meme-green-400 hover:bg-meme-green-500/5 transition-all">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-meme-green-400 mx-auto mb-3" />
                    <p className="text-gray-300 mb-2 font-fun font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 font-fun">
                      JPG, PNG, GIF up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-80 object-cover rounded-xl border border-meme-green-500/30"
                  />
                  <button
                    type="button"
                    onClick={resetForm}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-bold text-meme-green-400 mb-3 font-fun">
                <FileText className="inline w-4 h-4 mr-1" />
                CAPTION
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, 200))}
                placeholder="Add a dank caption for your meme..."
                className="w-full p-4 bg-dark-700 border border-meme-green-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-meme-green-500 focus:border-transparent resize-none text-gray-200 placeholder-gray-500 font-fun"
                rows={4}
                maxLength={200}
                disabled={uploading}
              />
              <div className="text-right text-sm text-gray-500 mt-1 font-fun">
                {caption.length}/200 characters
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-300 text-center font-fun">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!connected || !image || !caption.trim() || uploading}
              className="w-full py-4 bg-gradient-to-r from-meme-green-500 to-meme-green-600 text-dark-900 font-meme text-lg rounded-xl hover:from-meme-green-600 hover:to-meme-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-meme-green-500/30"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  UPLOADING TO BLOCKCHAIN...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  SHARE MEME
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};