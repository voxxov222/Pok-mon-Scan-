import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, doc, updateDoc, arrayUnion, arrayRemove, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { TradeListing, TradeMessage, ForumPost, ForumComment } from '../types';

export function useCommunity() {
  const [trades, setTrades] = useState<TradeListing[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [activeChatTrade, setActiveChatTrade] = useState<TradeListing | null>(null);
  const [chatMessages, setChatMessages] = useState<TradeMessage[]>([]);

  // Real-time Trades listener
  useEffect(() => {
    const q = query(collection(db, 'trades'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: TradeListing[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as TradeListing);
      });
      setTrades(list);
    }, (err) => console.error("Trades listener error:", err));
    return () => unsubscribe();
  }, []);

  // Real-time Forum listener
  useEffect(() => {
    const q = query(collection(db, 'forum'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts: ForumPost[] = [];
      snapshot.forEach((d) => {
        posts.push({ id: d.id, ...d.data() } as ForumPost);
      });
      setForumPosts(posts);
    }, (err) => console.error("Forum listener error:", err));
    return () => unsubscribe();
  }, []);

  // Real-time Chat Messages for active trade
  useEffect(() => {
    if (!activeChatTrade) {
      setChatMessages([]);
      return;
    }

    const q = query(collection(db, `trades/${activeChatTrade.id}/messages`), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: TradeMessage[] = [];
      snapshot.forEach((d) => {
        msgs.push({ id: d.id, ...d.data() } as TradeMessage);
      });
      setChatMessages(msgs);
    }, (err) => console.error("Chat listener error:", err));
    return () => unsubscribe();
  }, [activeChatTrade]);

  const createTradeListing = async (card: any, lookingFor: string) => {
    const user = auth.currentUser;
    if (!user) return;
    await addDoc(collection(db, 'trades'), {
      userId: user.uid,
      userDisplayName: user.displayName || user.email?.split('@')[0] || 'Trainer',
      card,
      lookingFor,
      status: 'active',
      createdAt: Date.now()
    });
  };

  const sendTradeMessage = async (tradeId: string, text: string) => {
    const user = auth.currentUser;
    if (!user || !text.trim()) return;
    await addDoc(collection(db, `trades/${tradeId}/messages`), {
      tradeId,
      senderId: user.uid,
      senderName: user.displayName || user.email?.split('@')[0] || 'Collector',
      text: text.trim(),
      timestamp: Date.now()
    });
  };

  const createForumPost = async (title: string, content: string, tags: string[]) => {
    const user = auth.currentUser;
    if (!user) return;
    await addDoc(collection(db, 'forum'), {
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'TCG Master',
      title,
      content,
      tags: tags.length ? tags : ['General'],
      likes: 0,
      likedBy: [],
      commentCount: 0,
      createdAt: Date.now()
    });
  };

  const toggleLikePost = async (postId: string, likedBy: string[]) => {
    const user = auth.currentUser;
    if (!user) return;
    const isLiked = likedBy.includes(user.uid);
    const postRef = doc(db, 'forum', postId);
    if (isLiked) {
      await updateDoc(postRef, {
        likedBy: arrayRemove(user.uid),
        likes: (likedBy.length - 1 >= 0) ? likedBy.length - 1 : 0
      });
    } else {
      await updateDoc(postRef, {
        likedBy: arrayUnion(user.uid),
        likes: likedBy.length + 1
      });
    }
  };

  return {
    trades,
    forumPosts,
    activeChatTrade,
    setActiveChatTrade,
    chatMessages,
    createTradeListing,
    sendTradeMessage,
    createForumPost,
    toggleLikePost
  };
}
