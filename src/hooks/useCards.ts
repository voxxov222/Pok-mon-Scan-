import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, doc, deleteDoc, updateDoc, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { CardData } from '../types';
import { onAuthStateChanged } from 'firebase/auth';

export function useCards() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setCards([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'cards'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cardData: CardData[] = [];
      snapshot.forEach((doc) => {
        cardData.push({ id: doc.id, ...doc.data() } as CardData);
      });
      
      // Sort client-side to avoid Firestore composite index requirement
      cardData.sort((a, b) => (b.dateScanned || 0) - (a.dateScanned || 0));
      
      setCards(cardData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching cards from Firestore:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addCard = async (cardData: Omit<CardData, 'id' | 'userId' | 'dateScanned'>) => {
    if (!user) throw new Error("Must be logged in to save cards");
    
    const docRef = await addDoc(collection(db, 'cards'), {
      ...cardData,
      userId: user.uid,
      dateScanned: Date.now()
    });
    return docRef.id;
  };

  const removeCard = async (cardId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'cards', cardId));
  };

  const toggleTradeStatus = async (cardId: string, isForTrade: boolean, tradeWants?: string) => {
    if (!user) return;
    await updateDoc(doc(db, 'cards', cardId), {
      isForTrade,
      tradeWants: tradeWants || ''
    });
  };

  const importCards = async (importedCards: Omit<CardData, 'id' | 'userId' | 'dateScanned'>[]) => {
    if (!user) throw new Error("Must be logged in to import cards");
    
    for (const card of importedCards) {
      await addDoc(collection(db, 'cards'), {
        ...card,
        userId: user.uid,
        dateScanned: Date.now()
      });
    }
  };

  return { cards, loading, user, addCard, removeCard, toggleTradeStatus, importCards };
}
