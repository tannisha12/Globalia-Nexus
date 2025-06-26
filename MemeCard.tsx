import React, { useState } from 'react';
import { Heart, MessageCircle, User, Clock } from 'lucide-react';
import { Meme } from '../types/meme';
import { useSolanaProgram } from '../hooks/useSolanaProgram';
import { useWallet } from '@solana/wallet-adapter-react';

interface MemeCardProps {
  meme: Meme;
  onUpdate: () => void;
}

export const MemeCard: React.FC<MemeCardProps> = ({ meme, onUpdate }) => {
  const { likeMeme, addComment, isConnected } = useSolanaProgram();
  const { publicKey } = useWallet();
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const isLikedByUser = publicKey && meme.likedBy.includes(publicKey.toString());
  const timeAgo = new Date(meme.timestamp).toLocaleDateString();

  const handleLike = async () => {
    if (!isConnected || isLiking) return;
    
    setIsLiking(true);
    try {
      await likeMeme(meme.id);
      onUpdate();
    } catch (error) {
      console.error('Error liking meme:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !newComment.trim() || isCommenting) return;

    setIsCommenting(true);
    try {
      await addComment(meme.id, newComment.trim());
      setNewComment('');
      onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="bg-dark-800/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden hover:shadow-meme-green-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-meme-green-500/20">
      {/* Image */}
      <div className="relative">
        <img
          src={meme.imageUrl}
          alt="Meme"
          className="w-full h-80 object-cover"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-dark-900/80 backdrop-blur-sm rounded-full px-3 py-1 text-meme-green-400 text-sm font-fun font-bold border border-meme-green-500/30">
          {meme.likes} 💚
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-200 text-lg mb-4 leading-relaxed font-fun">{meme.caption}</p>
        
        {/* Author Info */}
        <div className="flex items-center gap-3 text-gray-400 text-sm mb-4 font-fun">
          <div className="flex items-center gap-1">
            <User size={16} />
            <span className="font-mono text-meme-green-400">
              {meme.author.slice(0, 6)}...{meme.author.slice(-4)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            disabled={!isConnected || isLiking}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-fun font-medium transition-all ${
              isLikedByUser
                ? 'bg-meme-green-500/20 text-meme-green-400 border border-meme-green-500/30 hover:bg-meme-green-500/30'
                : 'bg-dark-700 text-gray-400 hover:bg-meme-green-500/10 hover:text-meme-green-400 border border-gray-600 hover:border-meme-green-500/30'
            } ${!isConnected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Heart size={18} fill={isLikedByUser ? 'currentColor' : 'none'} />
            <span>{meme.likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-fun font-medium bg-dark-700 text-gray-400 hover:bg-meme-green-500/10 hover:text-meme-green-400 transition-all border border-gray-600 hover:border-meme-green-500/30"
          >
            <MessageCircle size={18} />
            <span>{meme.comments?.length || 0}</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            {/* Add Comment Form */}
            {isConnected && (
              <form onSubmit={handleComment} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value.slice(0, 100))}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 bg-dark-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-meme-green-500 focus:border-transparent text-gray-200 placeholder-gray-500 font-fun"
                    maxLength={100}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isCommenting}
                    className="px-4 py-2 bg-meme-green-500 text-dark-900 rounded-lg hover:bg-meme-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-fun font-bold"
                  >
                    {isCommenting ? '...' : 'Post'}
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1 font-fun">
                  {newComment.length}/100 characters
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {meme.comments?.map((comment) => (
                <div key={comment.id} className="bg-dark-700/50 rounded-lg p-3 border border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1 font-fun">
                    <User size={14} />
                    <span className="font-mono text-meme-green-400">
                      {comment.author.slice(0, 6)}...{comment.author.slice(-4)}
                    </span>
                    <span>·</span>
                    <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-200 font-fun">{comment.text}</p>
                </div>
              ))}
              {(!meme.comments || meme.comments.length === 0) && (
                <p className="text-gray-500 text-center py-4 font-fun">No comments yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};