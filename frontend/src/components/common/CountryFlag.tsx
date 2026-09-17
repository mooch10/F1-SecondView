import React, { useState } from 'react';

// Maps common motorsport country names and languages to ISO 3166-1 alpha-2 codes
const COUNTRY_MAP: Record<string, string> = {
  argentina: 'ar',
  reino_unido: 'gb',
  gran_bretana: 'gb',
  great_britain: 'gb',
  united_kingdom: 'gb',
  espana: 'es',
  spain: 'es',
  paises_bajos: 'nl',
  netherlands: 'nl',
  holanda: 'nl',
  brasil: 'br',
  brazil: 'br',
  estados_unidos: 'us',
  united_states: 'us',
  usa: 'us',
  mexico: 'mx',
  italia: 'it',
  italy: 'it',
  francia: 'fr',
  france: 'fr',
  monaco: 'mc',
  alemania: 'de',
  germany: 'de',
  australia: 'au',
  japon: 'jp',
  japan: 'jp',
  nueva_zelanda: 'nz',
  new_zealand: 'nz',
  canada: 'ca',
  dinamarca: 'dk',
  denmark: 'dk',
  finlandia: 'fi',
  finland: 'fi',
  irlanda: 'ie',
  ireland: 'ie',
  polonia: 'pl',
  poland: 'pl',
  singapur: 'sg',
  singapore: 'sg',
  peru: 'pe',
  portugal: 'pt',
  bulgaria: 'bg',
  jamaica: 'jm',
  china: 'cn',
  austria: 'at',
  belgica: 'be',
  belgium: 'be',
  hungria: 'hu',
  hungary: 'hu',
  azerbaiyan: 'az',
  azerbaijan: 'az',
  barein: 'bh',
  bahrain: 'bh',
  arabia_saudita: 'sa',
  saudi_arabia: 'sa',
  emiratos_arabes_unidos: 'ae',
  uae: 'ae',
  catar: 'qa',
  qatar: 'qa',
  suiza: 'ch',
  switzerland: 'ch',
  thailand: 'th',
  tailandia: 'th',
};

/**
 * Extracts a 2-letter ISO country code from a Unicode flag emoji
 * (e.g. 🇦🇷 -> 'AR', 🇬🇧 -> 'GB', 🇪🇸 -> 'ES')
 */
export function emojiToCountryCode(emoji: string | undefined | null): string | null {
  if (!emoji) return null;
  const chars = Array.from(emoji);
  if (chars.length < 2) return null;
  const cp1 = chars[0].codePointAt(0);
  const cp2 = chars[1].codePointAt(0);
  if (
    cp1 &&
    cp2 &&
    cp1 >= 0x1f1e6 &&
    cp1 <= 0x1f1ff &&
    cp2 >= 0x1f1e6 &&
    cp2 <= 0x1f1ff
  ) {
    return String.fromCharCode(cp1 - 0x1f1e6 + 65, cp2 - 0x1f1e6 + 65);
  }
  return null;
}

export interface CountryFlagProps {
  countryCode?: string | null;
  flagEmoji?: string | null;
  countryName?: string | null;
  className?: string;
  alt?: string;
  title?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryCode,
  flagEmoji,
  countryName,
  className = 'w-5 h-3.5',
  alt,
  title,
}) => {
  const [hasError, setHasError] = useState(false);

  // Derive 2-letter ISO code from countryCode, flagEmoji, or countryName
  let code = countryCode?.trim().toLowerCase();
  if (!code && flagEmoji) {
    const extracted = emojiToCountryCode(flagEmoji);
    if (extracted) code = extracted.toLowerCase();
  }
  if (!code && countryName) {
    const normalized = countryName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');
    code = COUNTRY_MAP[normalized];
  }

  // If code resolved and not in error state, render crisp vector flag
  if (code && code.length === 2 && !hasError) {
    return (
      <img
        src={`https://flagcdn.com/${code}.svg`}
        alt={alt || code.toUpperCase()}
        title={title || alt || code.toUpperCase()}
        loading="lazy"
        onError={() => setHasError(true)}
        className={`inline-block object-cover rounded-[2px] border border-black/10 dark:border-white/20 align-middle select-none shrink-0 ${className}`}
      />
    );
  }

  // Fallback if image failed or couldn't resolve code
  return (
    <span
      className={`inline-flex items-center justify-center align-middle font-mono font-bold text-xs select-none ${className}`}
      title={title || alt || flagEmoji || countryCode || ''}
      role="img"
      aria-label={alt || 'flag'}
    >
      {flagEmoji || countryCode?.toUpperCase() || '🏁'}
    </span>
  );
};

/**
 * Splits text by flag emojis and replaces them with CountryFlag components.
 */
export function renderTextWithFlags(
  text: string | undefined | null,
  flagClassName: string = 'w-4 h-2.5 rounded-[2px] inline-block mx-1 align-middle'
): React.ReactNode {
  if (!text) return text;
  if (!/[\u{1F1E6}-\u{1F1FF}]{2}/u.test(text)) {
    return text;
  }
  const parts = text.split(/([\u{1F1E6}-\u{1F1FF}]{2})/u);
  return (
    <>
      {parts.map((part, idx) => {
        if (/^[\u{1F1E6}-\u{1F1FF}]{2}$/u.test(part)) {
          return (
            <CountryFlag
              key={idx}
              flagEmoji={part}
              className={flagClassName}
            />
          );
        }
        return part;
      })}
    </>
  );
}

