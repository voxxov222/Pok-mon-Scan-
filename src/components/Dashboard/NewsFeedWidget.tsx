import React from 'react';
import { Newspaper, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  isOfficial: boolean;
  link: string;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'New Scarlet & Violet Expansion "Twilight Masquerade" Revealed!',
    source: 'Pokemon.com',
    timeAgo: '2h ago',
    isOfficial: true,
    link: '#'
  },
  {
    id: '2',
    title: 'Market Watch: Vintage Holos see 15% spike across the board',
    source: 'Community Forums',
    timeAgo: '5h ago',
    isOfficial: false,
    link: '#'
  },
  {
    id: '3',
    title: 'Play! Pokémon 2026 Championship Series Update',
    source: 'Pokemon.com',
    timeAgo: '1d ago',
    isOfficial: true,
    link: '#'
  },
  {
    id: '4',
    title: 'TCG Live: New Battle Pass features special illustration rares',
    source: 'Pokemon.com',
    timeAgo: '2d ago',
    isOfficial: true,
    link: '#'
  }
];

export function NewsFeedWidget() {
  return (
    <div className="bg-[#12121a] rounded-3xl p-5 border border-white/10 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Feed</h3>
            <p className="text-[9px] text-white/50 uppercase tracking-widest">News & Updates</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
        {MOCK_NEWS.map((news, i) => (
          <motion.div 
            key={news.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group block rounded-xl p-3 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/20 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-start gap-3 relative z-10">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {news.isOfficial && (
                    <span className="px-1.5 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Official
                    </span>
                  )}
                  <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{news.source} • {news.timeAgo}</span>
                </div>
                <h4 className="text-xs font-medium text-white/90 leading-snug group-hover:text-white transition-colors">
                  {news.title}
                </h4>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
