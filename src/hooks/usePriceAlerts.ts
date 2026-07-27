import { useState, useEffect } from 'react';
import { CardData, PriceAlert } from '../types';

export function usePriceAlerts(cards: CardData[]) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!cards || cards.length === 0) return;

    // Generate simulated/real price fluctuation alerts for cards where highPrice vs lowPrice spread or market movement exceeds 10%
    const generatedAlerts: PriceAlert[] = [];

    cards.forEach((card) => {
      const spread = ((card.highPrice - card.lowPrice) / (card.lowPrice || 1)) * 100;
      if (spread >= 10) {
        generatedAlerts.push({
          id: `alert-${card.id}`,
          cardName: card.name,
          oldPrice: card.lowPrice,
          newPrice: card.highPrice,
          percentageChange: Math.round(spread),
          timestamp: Date.now() - 3600000, // 1 hr ago
          read: false
        });
      }
    });

    setAlerts(generatedAlerts);
    setUnreadCount(generatedAlerts.length);
  }, [cards]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification("PokéVault Alerts Active", {
          body: "You will be notified when cards in your collection fluctuate by over 10%!"
        });
      }
      return perm;
    }
    return 'denied';
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    setUnreadCount(0);
  };

  return { alerts, unreadCount, requestNotificationPermission, markAllAsRead };
}
