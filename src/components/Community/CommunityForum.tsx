import React, { useState } from 'react';
import { useCommunity } from '../../hooks/useCommunity';
import { MessageSquare, Heart, Plus, Sparkles, Send, X, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function CommunityForum() {
  const { forumPosts, createForumPost, toggleLikePost } = useCommunity();
  const [showNewPost, setShowNewPost] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('Market Talk');

  const availableTags = ['Market Talk', 'Grading', 'Pulls', 'Deck Strategy', 'General TCG'];

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return;
    await createForumPost(title, content, [selectedTag]);
    setShowNewPost(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Forum Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Pokémon TCG Community Forum
          </h2>
          <p className="text-xs text-white/50">Discuss market trends, pull highlights, PSA grading tips, and TCG strategies.</p>
        </div>

        <button 
          onClick={() => setShowNewPost(true)}
          className="bg-primary hover:bg-primary-hover text-black px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> New Discussion
        </button>
      </div>

      {/* Forum Posts List */}
      <div className="space-y-4">
        {forumPosts.length === 0 ? (
          <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
            <MessageSquare className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-sm font-bold text-white/60">No community discussions yet</p>
            <p className="text-xs text-white/40 mt-1">Start a discussion on card values, pull rates, or grading tips!</p>
          </div>
        ) : (
          forumPosts.map(post => (
            <div key={post.id} className="bg-[#12121a] border border-white/10 rounded-2xl p-5 space-y-3 hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                      {post.tags[0] || 'Discussion'}
                    </span>
                    <span className="text-xs font-bold text-white/70">by {post.userName}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{post.title}</h3>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed font-sans">{post.content}</p>

              <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                <button 
                  onClick={() => toggleLikePost(post.id, post.likedBy || [])}
                  className="flex items-center gap-1.5 text-white/60 hover:text-red-400 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${(post.likedBy || []).length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="font-bold">{post.likes || 0} Likes</span>
                </button>

                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#12121a] border border-white/15 rounded-3xl max-w-lg w-full p-6 relative space-y-4 shadow-2xl"
            >
              <button onClick={() => setShowNewPost(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white">New Discussion Post</h3>

              <div className="space-y-2">
                <label className="text-xs text-white/70 block font-bold">Category Tag:</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-xl transition-colors ${
                        selectedTag === tag 
                          ? 'bg-primary text-black' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/70 block font-bold">Post Title:</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Is 151 Charizard VMAX heading up in value?"
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/70 block font-bold">Discussion Content:</label>
                <textarea 
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your insights, questions, or card photos..."
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setShowNewPost(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreate}
                  disabled={!title.trim() || !content.trim()}
                  className="px-6 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-black rounded-xl text-xs font-bold uppercase tracking-widest"
                >
                  Publish Post
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
