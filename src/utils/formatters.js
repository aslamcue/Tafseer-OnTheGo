// --- TAFSEER FORMATTING UTILITIES ---

/**
 * Formats raw HTML tafseer text into beautiful, readable content
 * with proper spacing, styled paragraphs, and visual hierarchy. 
 */
export const formatTafseerHTML = (rawHTML) => {
  if (!rawHTML) return '<p class="text-slate-400 italic">Tafseer unavailable for this verse.</p>';
  
  let formatted = rawHTML;
  
  // Step 1: Clean up excessive whitespace and normalize line breaks
  formatted = formatted.replace(/\s+/g, ' ').trim();
  
  // Step 2: Convert <p> tags to styled paragraphs with proper spacing
  formatted = formatted.replace(
    /<p>/gi, 
    '<p class="text-slate-300 leading-relaxed mb-4 text-sm md:text-base">'
  );
  
  // Step 3: Style headings if present
  formatted = formatted.replace(
    /<h(\d)>/gi, 
    '<h$1 class="text-cyan-400 font-bold mt-6 mb-3 text-base md:text-lg">'
  );
  
  // Step 4: Convert plain numbered lists (1. 2. 3.) to styled bullet points
  // Match patterns like "1." or "(1)" at the start of sentences
  formatted = formatted.replace(
    /(\d+)\.\s+/g, 
    '</p><div class="flex items-start gap-3 mb-3 pl-2"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-main/20 text-cyan-main text-xs flex items-center justify-center font-bold">$1</span><p class="text-slate-300 leading-relaxed flex-1">'
  );
  
  // Step 5: Handle bullet points that use • or -
  formatted = formatted.replace(
    /[•\-]\s+/g,
    '</p><div class="flex items-start gap-3 mb-3 pl-2"><span class="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-main mt-2"></span><p class="text-slate-300 leading-relaxed flex-1">'
  );
  
  // Step 6: Add visual breaks for long passages (after every ~3 paragraphs)
  let paragraphCount = 0;
  formatted = formatted.replace(/<\/p>/gi, () => {
    paragraphCount++;
    if (paragraphCount % 3 === 0) {
      return '</p><div class="my-6 border-t border-glass-border/30"></div>';
    }
    return '</p>';
  });
  
  // Step 7: Style any inline quotes with italic and distinct color
  formatted = formatted.replace(
    /"([^"]+)"/g, 
    '<span class="italic text-amber-300/90">"$1"</span>'
  );
  
  // Step 8: Style Arabic text if enclosed in specific markers
  formatted = formatted.replace(
    /\{([^}]+)\}/g,
    '<span class="font-quran text-lg text-white bg-charcoal-900/50 px-2 py-1 rounded inline-block my-1">$1</span>'
  );
  
  // Step 9: Wrap the entire content if it doesn't start with a paragraph
  if (!formatted.startsWith('<p') && !formatted.startsWith('<h') && !formatted.startsWith('<div')) {
    formatted = `<p class="text-slate-300 leading-relaxed mb-4 text-sm md:text-base">${formatted}</p>`;
  }
  
  return formatted;
};

/**
 * Cleans tafseer text for TTS reading - removes references, 
 * formats for natural speech pauses, and sanitizes special characters.
 */
export const formatTafseerForTTS = (rawText) => {
  if (!rawText) return "";
  
  let cleaned = rawText;
  
  // Step 1: Strip all HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Step 2: Remove reference numbers like [1], (2), {3}, etc. 
  cleaned = cleaned.replace(/\[\d+\]/g, '');
  cleaned = cleaned.replace(/\(\d+\)/g, '');
  cleaned = cleaned.replace(/\{\d+\}/g, '');
  
  // Step 3: Remove footnote markers and superscripts
  cleaned = cleaned.replace(/[\u00B2\u00B3\u00B9\u2070-\u209F]/g, '');
  
  // Step 4: Remove verse reference patterns like "1: 1" or "Surah 2:255"
  cleaned = cleaned.replace(/\b\d+:\d+\b/g, '');
  
  // Step 5: Normalize quotes for better TTS pronunciation
  cleaned = cleaned.replace(/[""]/g, '"');
  cleaned = cleaned.replace(/['']/g, "'");
  
  // Step 6: Add pauses after colons (for natural reading)
  cleaned = cleaned.replace(/:\s*/g, '.  ');
  
  // Step 7: Ensure sentences end with proper punctuation
  cleaned = cleaned.replace(/([a-zA-Z])\s+([A-Z])/g, '$1. $2');
  
  // Step 8: Remove excessive punctuation
  cleaned = cleaned.replace(/\.\s{2,}/g, '.');
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  
  // Step 9: Remove any remaining special characters that confuse TTS
  cleaned = cleaned.replace(/[^\w\s.,?!;:'"()-]/g, '');
  
  // Step 10: Ensure proper spacing around punctuation
  cleaned = cleaned.replace(/\s+\./g, '.');
  cleaned = cleaned.replace(/\s+,/g, ',');
  cleaned = cleaned.replace(/\s+!/g, '!');
  cleaned = cleaned.replace(/\s+\?/g, '?');
  
  return cleaned.trim();
};

/**
 * Generates a concise summary from tafseer text (first 2-3 key sentences)
 */
export const generateTafseerSummary = (plainText) => {
  if (!plainText) return "Summary unavailable.";
  
  const cleaned = formatTafseerForTTS(plainText);
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
  
  // Take first 2-3 sentences, but ensure we have meaningful content
  const summarySentences = sentences.slice(0, 3).filter(s => s.trim().length > 20);
  
  if (summarySentences.length === 0) {
    return sentences.slice(0, 2).join(' ').trim();
  }
  
  return summarySentences.join(' ').trim();
};
