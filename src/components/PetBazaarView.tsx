import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Check,
  CheckCircle2,
  Heart,
  Zap,
  Shield,
  Coins,
} from 'lucide-react';
import { UserProfile, PetState } from '../types';
import { sound } from '../utils/audioFx';
import confetti from 'canvas-confetti';

interface PetBazaarViewProps {
  user: UserProfile;
  pet: PetState;
  onPurchase: (cost: number, itemName: string, itemType: 'accessory' | 'heart' | 'snack' | 'freeze') => void;
}

interface BazaarItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  category: 'Food' | 'Accessory' | 'Utility';
  description: string;
  type: 'accessory' | 'heart' | 'snack' | 'freeze';
}

const BAZAAR_ITEMS: BazaarItem[] = [
  {
    id: 'cyber_berry',
    name: 'Cyber Berry Snack',
    price: 15,
    icon: '🍎',
    category: 'Food',
    description: 'Fresh digital organic fruit that restores companion energy +25%.',
    type: 'snack',
  },
  {
    id: 'energy_core',
    name: 'Supercharged Battery',
    price: 25,
    icon: '⚡',
    category: 'Food',
    description: 'Refills energy to 100% and puts your buddy in an ecstatic mood.',
    type: 'snack',
  },
  {
    id: 'wizard_hat',
    name: 'Wizard Hat',
    price: 50,
    icon: '🎩',
    category: 'Accessory',
    description: 'Enchanted pointed hat imbued with algorithms of wisdom.',
    type: 'accessory',
  },
  {
    id: 'cyber_shades',
    name: 'Cyber Shades',
    price: 60,
    icon: '🕶️',
    category: 'Accessory',
    description: 'Reflective neon shades for code debugging in style.',
    type: 'accessory',
  },
  {
    id: 'royal_crown',
    name: 'Royal Golden Crown',
    price: 100,
    icon: '👑',
    category: 'Accessory',
    description: 'Dazzling gold crown reserved for top-tier master learners.',
    type: 'accessory',
  },
  {
    id: 'streak_freeze',
    name: 'Streak Freeze Shield',
    price: 40,
    icon: '❄️',
    category: 'Utility',
    description: 'Protects your streak for 1 missed calendar day automatically.',
    type: 'freeze',
  },
  {
    id: 'heart_refill',
    name: 'Full Heart Refill',
    price: 30,
    icon: '❤️',
    category: 'Utility',
    description: 'Instantly restores your heart pool to maximum capacity.',
    type: 'heart',
  },
];

export const PetBazaarView: React.FC<PetBazaarViewProps> = ({
  user,
  pet,
  onPurchase,
}) => {
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const handleBuy = (item: BazaarItem) => {
    if (user.gems < item.price) {
      sound.playError(user.soundEnabled);
      alert(`Not enough gems! You need ${item.price} gems (you currently have ${user.gems}). Complete more chapters or quests to earn gems!`);
      return;
    }

    sound.playLevelUp(user.soundEnabled);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    onPurchase(item.price, item.name, item.type);
    setPurchaseSuccess(`Purchased ${item.name}! Check your companion wardrobe.`);
    setTimeout(() => setPurchaseSuccess(null), 3500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
            PET BAZAAR
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            CodePaw Marketplace
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Exchange your hard-earned gems for snacks, cool accessories, and streak perks.
          </p>
        </div>

        {/* Live Wallet balance pills */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-base">💎</span>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Your Gems</div>
              <div className="text-sm font-extrabold text-emerald-700">{user.gems}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Hearts</div>
              <div className="text-sm font-extrabold text-rose-700">{user.hearts} / 5</div>
            </div>
          </div>
        </div>
      </div>

      {purchaseSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{purchaseSuccess}</span>
        </div>
      )}

      {/* Bazaar Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BAZAAR_ITEMS.map((item) => {
          const canAfford = user.gems >= item.price;
          const isOwned =
            user.inventory && user.inventory.includes(item.name);

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    {item.icon}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <span>💎</span>
                    <span>{item.price}</span>
                  </span>
                </div>

                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {item.category}
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleBuy(item)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    canAfford
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <span>{isOwned ? 'Buy Again' : 'Purchase'}</span>
                  <span>({item.price} 💎)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
