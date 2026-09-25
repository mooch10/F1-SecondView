import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { TeamRadioCapture } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface StoredTranscript {
  transcript: string;
  category?: TeamRadioCapture['category'];
  driverNumber?: number;
  driverCode?: string;
  driverName?: string;
}

// In-memory transcript cache to avoid redundant processing
const transcriptCache = new Map<
  string,
  { transcript?: string; category?: TeamRadioCapture['category'] }
>();

function loadTranscriptsDatabase(): Record<string, StoredTranscript> {
  const possiblePaths = [
    path.join(__dirname, 'data', 'radio_transcripts.json'),
    path.join(__dirname, '..', 'src', 'data', 'radio_transcripts.json'),
    path.join(process.cwd(), 'src', 'data', 'radio_transcripts.json'),
    path.join(process.cwd(), 'backend', 'src', 'data', 'radio_transcripts.json'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.warn(`[RadioTranscription] Error reading ${p}:`, err);
      }
    }
  }
  return {};
}

const storedTranscripts: Record<string, StoredTranscript> = loadTranscriptsDatabase();

/**
 * Match authentic Whisper transcriptions by filename first, then fallback to substring match.
 * Never fabricate generic or imaginary quotes.
 */
function inferTranscriptAndCategory(radio: TeamRadioCapture): {
  transcript?: string;
  category?: TeamRadioCapture['category'];
} {
  // 1. Direct match by exact MP3 filename from Whisper transcription database
  if (radio.audioUrl) {
    const filename = path.basename(radio.audioUrl.split('?')[0]);
    const stored = storedTranscripts[filename];
    if (stored?.transcript) {
      return {
        transcript: stored.transcript,
        category: stored.category || 'GENERAL',
      };
    }
  }

  // 2. Substring match against stored transcripts
  for (const [key, val] of Object.entries(storedTranscripts)) {
    if (val.transcript && (radio.audioUrl.includes(key) || radio.id.includes(key))) {
      return {
        transcript: val.transcript,
        category: val.category || 'GENERAL',
      };
    }
  }

  // If no authentic transcription exists yet, return empty without fabricating fake dialogue
  return {};
}

/**
 * Enriches a list of raw Team Radio captures with transcripts and contextual categories.
 * Caches results to guarantee instant performance on high-frequency live polling.
 */
export function enrichWithTranscripts(radios: TeamRadioCapture[]): TeamRadioCapture[] {
  if (!radios || radios.length === 0) return [];

  return radios.map((radio) => {
    const cacheKey = radio.id || radio.audioUrl;
    const cached = transcriptCache.get(cacheKey);
    if (cached) {
      return {
        ...radio,
        transcript: cached.transcript,
        category: cached.category,
      };
    }

    const { transcript, category } = inferTranscriptAndCategory(radio);
    transcriptCache.set(cacheKey, { transcript, category });

    return {
      ...radio,
      transcript,
      category,
    };
  });
}
