import React from 'react';
import { PetId } from '../types';

interface PetAvatarProps {
  petId: PetId;
  isEvolved?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  animate?: boolean;
}

const SIZE_MAP = {
  xs: 'w-7 h-7',
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-28 h-28',
  xl: 'w-44 h-44',
  hero: 'w-60 h-60 max-w-full',
};

export const PetAvatar: React.FC<PetAvatarProps> = ({
  petId,
  isEvolved = false,
  size = 'md',
  className = '',
  animate = true,
}) => {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  const renderPetSvg = () => {
    switch (petId) {
      case 'byte':
        // Byte: The Cyber Pup (black/charcoal cyber dog with glowing cyan eyes)
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="byte-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="byte-neon" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            {/* Tail */}
            <path
              d={isEvolved ? "M 115 105 Q 145 90 135 65" : "M 115 105 Q 135 95 130 80"}
              fill="none"
              stroke={isEvolved ? "#38bdf8" : "#1e293b"}
              strokeWidth={isEvolved ? "8" : "7"}
              strokeLinecap="round"
            />
            {isEvolved && <circle cx="135" cy="65" r="5" fill="#38bdf8" className="animate-pulse" />}

            {/* Paws / Feet */}
            <ellipse cx="62" cy="132" rx="14" ry="10" fill="#0f172a" />
            <ellipse cx="98" cy="132" rx="14" ry="10" fill="#0f172a" />
            <circle cx="58" cy="133" r="2.5" fill="#38bdf8" />
            <circle cx="66" cy="133" r="2.5" fill="#38bdf8" />
            <circle cx="94" cy="133" r="2.5" fill="#38bdf8" />
            <circle cx="102" cy="133" r="2.5" fill="#38bdf8" />

            {/* Body */}
            <rect x="52" y="85" width="56" height="48" rx="24" fill="url(#byte-body)" />
            {/* Cyber Belly Panel */}
            <rect x="64" y="94" width="32" height="26" rx="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <path d="M 72 107 L 88 107" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="80" cy="102" r="3" fill="#38bdf8" />

            {/* Ears */}
            <path d="M 45 42 Q 25 35 30 65 Q 40 65 48 55 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth={isEvolved ? "2" : "1"} />
            <path d="M 115 42 Q 135 35 130 65 Q 120 65 112 55 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth={isEvolved ? "2" : "1"} />

            {/* Head */}
            <rect x="42" y="32" width="76" height="66" rx="30" fill="url(#byte-body)" stroke="#334155" strokeWidth="2" />

            {/* Evolved Cyber Horns / Antenna */}
            {isEvolved ? (
              <>
                <polygon points="80,14 74,32 86,32" fill="#0284c7" />
                <circle cx="80" cy="14" r="4" fill="#38bdf8" className="animate-ping" />
                {/* Cyber Visor */}
                <rect x="48" y="52" width="64" height="20" rx="8" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
                <line x1="52" y1="62" x2="108" y2="62" stroke="#bae6fd" strokeWidth="2.5" />
                <circle cx="70" cy="62" r="3" fill="#ffffff" />
                <circle cx="90" cy="62" r="3" fill="#ffffff" />
              </>
            ) : (
              <>
                {/* Big Cyber Eyes */}
                <ellipse cx="64" cy="58" rx="8" ry="10" fill="#38bdf8" />
                <circle cx="66" cy="55" r="3" fill="#ffffff" />
                <ellipse cx="96" cy="58" rx="8" ry="10" fill="#38bdf8" />
                <circle cx="98" cy="55" r="3" fill="#ffffff" />
                {/* Snout & Nose */}
                <ellipse cx="80" cy="74" rx="14" ry="9" fill="#1e293b" />
                <polygon points="80,72 75,68 85,68" fill="#38bdf8" />
                <path d="M 77 76 Q 80 79 83 76" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}

            {/* Collar */}
            <rect x="56" y="86" width="48" height="8" rx="4" fill="#0284c7" />
            <circle cx="80" cy="90" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
          </svg>
        );

      case 'rexi':
        // Rexi: The Data Dino (bright vibrant green friendly dinosaur with dorsal spines)
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="rexi-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              <linearGradient id="rexi-belly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#bbf7d0" />
                <stop offset="100%" stopColor="#86efac" />
              </linearGradient>
            </defs>

            {/* Tail */}
            <path
              d="M 105 110 Q 145 115 138 90 Q 128 100 110 105"
              fill="#22c55e"
              stroke="#15803d"
              strokeWidth="1.5"
            />
            {/* Tail Spikes */}
            <polygon points="125,98 132,92 133,101" fill="#15803d" />
            <polygon points="138,90 144,82 143,93" fill="#15803d" />

            {/* Back Spikes */}
            <polygon points="56,38 52,24 64,32" fill="#15803d" />
            <polygon points="72,28 72,12 82,24" fill="#15803d" />
            <polygon points="90,32 96,18 98,34" fill="#15803d" />
            {isEvolved && (
              <>
                <polygon points="106,44 118,30 114,48" fill="#047857" />
                <circle cx="72" cy="12" r="3" fill="#86efac" />
                <circle cx="96" cy="18" r="3" fill="#86efac" />
              </>
            )}

            {/* Feet */}
            <ellipse cx="60" cy="136" rx="15" ry="9" fill="#16a34a" />
            <ellipse cx="100" cy="136" rx="15" ry="9" fill="#16a34a" />
            {/* Claws */}
            <circle cx="53" cy="138" r="2.5" fill="#fef08a" />
            <circle cx="60" cy="139" r="2.5" fill="#fef08a" />
            <circle cx="67" cy="138" r="2.5" fill="#fef08a" />
            <circle cx="93" cy="138" r="2.5" fill="#fef08a" />
            <circle cx="100" cy="139" r="2.5" fill="#fef08a" />
            <circle cx="107" cy="138" r="2.5" fill="#fef08a" />

            {/* Body */}
            <ellipse cx="80" cy="105" rx="36" ry="32" fill="url(#rexi-body)" stroke="#15803d" strokeWidth="2" />
            {/* Belly */}
            <ellipse cx="80" cy="112" rx="22" ry="20" fill="url(#rexi-belly)" />
            {/* Belly Stripes */}
            <path d="M 68 107 Q 80 112 92 107" stroke="#4ade80" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 70 117 Q 80 122 90 117" stroke="#4ade80" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Small Dino Arms */}
            <path d="M 52 98 Q 42 104 48 112 Q 55 110 56 102 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
            <path d="M 108 98 Q 118 104 112 112 Q 105 110 104 102 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />

            {/* Head */}
            <rect x="42" y="32" width="76" height="60" rx="30" fill="url(#rexi-body)" stroke="#15803d" strokeWidth="2" />

            {/* Cheeks */}
            <ellipse cx="54" cy="74" rx="6" ry="4" fill="#f43f5e" opacity="0.4" />
            <ellipse cx="106" cy="74" rx="6" ry="4" fill="#f43f5e" opacity="0.4" />

            {/* Big Friendly Dino Eyes */}
            <ellipse cx="64" cy="54" rx="9" ry="11" fill="#0f172a" />
            <circle cx="67" cy="50" r="4" fill="#ffffff" />
            <circle cx="62" cy="58" r="1.5" fill="#ffffff" />

            <ellipse cx="96" cy="54" rx="9" ry="11" fill="#0f172a" />
            <circle cx="99" cy="50" r="4" fill="#ffffff" />
            <circle cx="94" cy="58" r="1.5" fill="#ffffff" />

            {/* Cute Smile / Snout */}
            <circle cx="76" cy="68" r="1.5" fill="#15803d" />
            <circle cx="84" cy="68" r="1.5" fill="#15803d" />
            <path d="M 72 74 Q 80 82 88 74" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

            {/* Evolved Tech Crown / Visor */}
            {isEvolved && (
              <>
                <polygon points="80,18 72,28 88,28" fill="#10b981" />
                <circle cx="80" cy="18" r="3.5" fill="#facc15" />
                <path d="M 44 48 L 116 48" stroke="#10b981" strokeWidth="3" opacity="0.8" />
              </>
            )}
          </svg>
        );

      case 'pip':
        // Pip: The Scripting Penguin (black penguin with wizard hat and golden cape)
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            {/* Feet */}
            <ellipse cx="64" cy="138" rx="14" ry="7" fill="#f59e0b" />
            <ellipse cx="96" cy="138" rx="14" ry="7" fill="#f59e0b" />

            {/* Wizard Cape */}
            <path d="M 45 75 Q 80 82 115 75 L 126 130 Q 80 138 34 130 Z" fill="#ca8a04" opacity="0.8" />

            {/* Penguin Body */}
            <ellipse cx="80" cy="100" rx="38" ry="38" fill="#0f172a" />
            {/* White Belly */}
            <ellipse cx="80" cy="106" rx="24" ry="28" fill="#ffffff" />

            {/* Wings / Flippers */}
            <path d="M 42 85 Q 26 105 38 120 Q 48 112 46 95 Z" fill="#0f172a" />
            <path d="M 118 85 Q 134 105 122 120 Q 112 112 114 95 Z" fill="#0f172a" />

            {/* Head */}
            <circle cx="80" cy="58" r="30" fill="#0f172a" />
            {/* Face White Patches */}
            <ellipse cx="68" cy="58" rx="10" ry="12" fill="#ffffff" />
            <ellipse cx="92" cy="58" rx="10" ry="12" fill="#ffffff" />

            {/* Eyes */}
            <circle cx="69" cy="58" r="5" fill="#0f172a" />
            <circle cx="71" cy="56" r="2" fill="#ffffff" />
            <circle cx="91" cy="58" r="5" fill="#0f172a" />
            <circle cx="93" cy="56" r="2" fill="#ffffff" />

            {/* Orange Beak */}
            <polygon points="73,66 87,66 80,78" fill="#f97316" />

            {/* Wizard Hat */}
            <ellipse cx="80" cy="38" rx="34" ry="9" fill="#1e1b4b" stroke="#facc15" strokeWidth="2" />
            <polygon points="58,36 80,6 102,36" fill="#312e81" />
            {/* Hat Buckle */}
            <rect x="73" y="30" width="14" height="7" rx="2" fill="#facc15" />

            {isEvolved && (
              <>
                <polygon points="80,4 82,10 88,10 83,14 85,20 80,16 75,20 77,14 72,10 78,10" fill="#fde047" />
                <circle cx="34" cy="115" r="4" fill="#38bdf8" className="animate-ping" />
              </>
            )}
          </svg>
        );

      case 'kumo':
        // Kumo: The Cloud Kitty (soft gray/silver kitten with pink ears)
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            {/* Tail */}
            <path d="M 110 115 Q 138 105 132 80" fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />

            {/* Paws */}
            <ellipse cx="62" cy="134" rx="12" ry="8" fill="#cbd5e1" />
            <ellipse cx="98" cy="134" rx="12" ry="8" fill="#cbd5e1" />

            {/* Body */}
            <ellipse cx="80" cy="108" rx="34" ry="28" fill="#94a3b8" />
            <ellipse cx="80" cy="114" rx="20" ry="18" fill="#f1f5f9" />

            {/* Ears */}
            <polygon points="46,55 36,25 64,40" fill="#64748b" />
            <polygon points="48,52 42,32 60,42" fill="#f472b6" />
            <polygon points="114,55 124,25 96,40" fill="#64748b" />
            <polygon points="112,52 118,32 100,42" fill="#f472b6" />

            {/* Head */}
            <circle cx="80" cy="62" r="32" fill="#94a3b8" />
            {/* Muzzle */}
            <ellipse cx="80" cy="72" rx="16" ry="10" fill="#f8fafc" />
            <polygon points="80,68 76,64 84,64" fill="#f472b6" />
            <path d="M 76 72 Q 80 76 84 72" stroke="#64748b" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Sparkling Teal Eyes */}
            <ellipse cx="66" cy="58" rx="7" ry="9" fill="#0d9488" />
            <circle cx="68" cy="55" r="3" fill="#ffffff" />
            <ellipse cx="94" cy="58" rx="7" ry="9" fill="#0d9488" />
            <circle cx="96" cy="55" r="3" fill="#ffffff" />

            {/* Whiskers */}
            <line x1="42" y1="68" x2="60" y2="70" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="42" y1="74" x2="60" y2="73" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="118" y1="68" x2="100" y2="70" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="118" y1="74" x2="100" y2="73" stroke="#cbd5e1" strokeWidth="1.5" />

            {isEvolved && (
              <path d="M 40 135 Q 80 148 120 135" stroke="#38bdf8" strokeWidth="3" fill="none" opacity="0.8" />
            )}
          </svg>
        );

      case 'milo':
        // Milo: The Logic Monkey
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            {/* Tail */}
            <path d="M 110 115 Q 148 115 142 80 Q 138 60 128 65" fill="none" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />

            {/* Feet */}
            <ellipse cx="62" cy="134" rx="14" ry="8" fill="#78350f" />
            <ellipse cx="98" cy="134" rx="14" ry="8" fill="#78350f" />

            {/* Body */}
            <ellipse cx="80" cy="106" rx="34" ry="28" fill="#92400e" />
            <ellipse cx="80" cy="112" rx="20" ry="18" fill="#fde68a" />

            {/* Ears */}
            <circle cx="44" cy="58" r="16" fill="#92400e" />
            <circle cx="44" cy="58" r="10" fill="#fde68a" />
            <circle cx="116" cy="58" r="16" fill="#92400e" />
            <circle cx="116" cy="58" r="10" fill="#fde68a" />

            {/* Head */}
            <circle cx="80" cy="58" r="30" fill="#92400e" />
            {/* Face Mask */}
            <ellipse cx="80" cy="64" rx="20" ry="16" fill="#fde68a" />

            {/* Eyes */}
            <circle cx="70" cy="56" r="6" fill="#0f172a" />
            <circle cx="72" cy="54" r="2.5" fill="#ffffff" />
            <circle cx="90" cy="56" r="6" fill="#0f172a" />
            <circle cx="92" cy="54" r="2.5" fill="#ffffff" />

            {/* Snout & Smile */}
            <circle cx="77" cy="68" r="1.5" fill="#78350f" />
            <circle cx="83" cy="68" r="1.5" fill="#78350f" />
            <path d="M 74 72 Q 80 77 86 72" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />

            {isEvolved && (
              <rect x="52" y="44" width="56" height="12" rx="4" fill="#0284c7" opacity="0.85" />
            )}
          </svg>
        );

      case 'hedge':
        // Hedge: The Prickly Coder (Lion / Hedgehog coder with spectacles)
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            {/* Mane / Prickles */}
            <circle cx="80" cy="75" r="54" fill="#d97706" />
            <circle cx="80" cy="75" r="48" fill="#f59e0b" />

            {/* Feet */}
            <ellipse cx="64" cy="135" rx="14" ry="8" fill="#b45309" />
            <ellipse cx="96" cy="135" rx="14" ry="8" fill="#b45309" />

            {/* Body */}
            <ellipse cx="80" cy="110" rx="30" ry="26" fill="#f59e0b" />
            <ellipse cx="80" cy="115" rx="18" ry="16" fill="#fef3c7" />

            {/* Face */}
            <circle cx="80" cy="70" r="30" fill="#fef3c7" />

            {/* Ears */}
            <circle cx="56" cy="46" r="8" fill="#d97706" />
            <circle cx="104" cy="46" r="8" fill="#d97706" />

            {/* Glasses */}
            <circle cx="68" cy="68" r="11" fill="none" stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="92" cy="68" r="11" fill="none" stroke="#0f172a" strokeWidth="2.5" />
            <line x1="79" y1="68" x2="81" y2="68" stroke="#0f172a" strokeWidth="3" />

            {/* Eyes inside glasses */}
            <circle cx="68" cy="68" r="4.5" fill="#0f172a" />
            <circle cx="70" cy="66" r="1.5" fill="#ffffff" />
            <circle cx="92" cy="68" r="4.5" fill="#0f172a" />
            <circle cx="94" cy="66" r="1.5" fill="#ffffff" />

            {/* Nose & Mouth */}
            <polygon points="80,78 77,75 83,75" fill="#78350f" />
            <path d="M 76 82 Q 80 85 84 82" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        );

      case 'nimbus':
        // Nimbus: The Wise Storm Owl
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            {/* Claws / Feet */}
            <ellipse cx="64" cy="136" rx="10" ry="6" fill="#f59e0b" />
            <ellipse cx="96" cy="136" rx="10" ry="6" fill="#f59e0b" />

            {/* Body */}
            <ellipse cx="80" cy="98" rx="36" ry="36" fill="#4338ca" />
            {/* Belly feathers */}
            <ellipse cx="80" cy="105" rx="22" ry="24" fill="#e0e7ff" />
            <path d="M 72 98 Q 80 102 88 98" stroke="#6366f1" strokeWidth="2" fill="none" />
            <path d="M 74 108 Q 80 112 86 108" stroke="#6366f1" strokeWidth="2" fill="none" />

            {/* Head Feathers / Ears */}
            <polygon points="52,42 42,16 66,32" fill="#312e81" />
            <polygon points="108,42 118,16 94,32" fill="#312e81" />

            {/* Owl Goggles / Eye Rings */}
            <circle cx="64" cy="62" r="17" fill="#312e81" />
            <circle cx="64" cy="62" r="14" fill="#fef08a" />
            <circle cx="64" cy="62" r="7" fill="#0f172a" />
            <circle cx="66" cy="59" r="2.5" fill="#ffffff" />

            <circle cx="96" cy="62" r="17" fill="#312e81" />
            <circle cx="96" cy="62" r="14" fill="#fef08a" />
            <circle cx="96" cy="62" r="7" fill="#0f172a" />
            <circle cx="98" cy="59" r="2.5" fill="#ffffff" />

            {/* Beak */}
            <polygon points="76,68 84,68 80,78" fill="#f97316" />

            {isEvolved && (
              <polygon points="80,10 84,24 96,24 86,32 90,46 80,38 70,46 74,32 64,24 76,24" fill="#38bdf8" />
            )}
          </svg>
        );

      case 'uni':
      default:
        // Uni: The Creative Unicorn
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            {/* Hooves */}
            <ellipse cx="64" cy="136" rx="12" ry="7" fill="#f472b6" />
            <ellipse cx="96" cy="136" rx="12" ry="7" fill="#f472b6" />

            {/* Rainbow Mane Back */}
            <path d="M 44 48 Q 28 85 44 115 Q 56 95 56 65 Z" fill="#ec4899" />
            <path d="M 38 60 Q 24 90 38 120 Q 48 100 48 75 Z" fill="#a855f7" />

            {/* Body */}
            <ellipse cx="80" cy="106" rx="34" ry="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
            <ellipse cx="80" cy="112" rx="20" ry="18" fill="#fdf2f8" />

            {/* Head */}
            <circle cx="80" cy="60" r="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />

            {/* Ears */}
            <polygon points="52,44 46,20 66,34" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
            <polygon points="53,40 49,26 62,34" fill="#f472b6" />
            <polygon points="108,44 114,20 94,34" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
            <polygon points="107,40 111,26 98,34" fill="#f472b6" />

            {/* Golden Horn */}
            <polygon points="76,34 80,4 84,34" fill="#facc15" stroke="#eab308" strokeWidth="1" />
            <line x1="77" y1="24" x2="83" y2="22" stroke="#ca8a04" strokeWidth="1" />
            <line x1="78" y1="14" x2="82" y2="12" stroke="#ca8a04" strokeWidth="1" />

            {/* Star Cheek Blush */}
            <polygon points="56,72 58,68 62,70 60,74" fill="#ec4899" opacity="0.6" />
            <polygon points="104,72 102,68 98,70 100,74" fill="#ec4899" opacity="0.6" />

            {/* Big Anime Eyes */}
            <ellipse cx="66" cy="58" rx="7" ry="9" fill="#0f172a" />
            <circle cx="68" cy="55" r="3" fill="#ffffff" />
            <circle cx="64" cy="62" r="1.5" fill="#ffffff" />

            <ellipse cx="94" cy="58" rx="7" ry="9" fill="#0f172a" />
            <circle cx="96" cy="55" r="3" fill="#ffffff" />
            <circle cx="92" cy="62" r="1.5" fill="#ffffff" />

            {/* Smile */}
            <path d="M 76 72 Q 80 76 84 72" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />

            {isEvolved && (
              <path d="M 35 75 Q 15 50 40 40 Q 35 60 55 65 Z" fill="#f472b6" opacity="0.8" />
            )}
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeClass} ${className} ${
        animate ? 'transition-transform duration-300 hover:scale-105' : ''
      }`}
    >
      {renderPetSvg()}
    </div>
  );
};
