export function sanitizeText(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function validateSameSubjectBa(
  sameSubject: boolean,
  conditionalType: string,
  hasSubjectiveEnding: boolean
): { valid: boolean; warning: string | null } {
  if (sameSubject && conditionalType === 'ba' && hasSubjectiveEnding) {
    return {
      valid: false,
      warning: '⚠️ Logic Warning: When using 〜ば with matching subjects and action verbs, avoid subjective endings (commands/desires). Use 〜たら or 〜と instead for this context.',
    };
  }
  return { valid: true, warning: null };
}