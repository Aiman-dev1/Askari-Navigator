// Basic profanity masking for chat messages (scope doc Phase 3).
// Word-boundary matching so "class" or "assistant" are untouched.
const BANNED = [
  "fuck", "fucking", "fucker", "shit", "bitch", "asshole",
  "bastard", "dick", "cunt", "slut", "whore", "piss",
];

const pattern = new RegExp(`\\b(${BANNED.join("|")})\\b`, "gi");

export function cleanMessage(text) {
  return text.replace(pattern, (word) => word[0] + "*".repeat(word.length - 1));
}
