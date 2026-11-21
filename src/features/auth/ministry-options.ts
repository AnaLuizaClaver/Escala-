export const ministryOptions = ['Louvor & Adoração', 'Mídia & Transmissão'] as const;

export function isMinistryOption(value: unknown): value is (typeof ministryOptions)[number] {
  return ministryOptions.some(name => name === value);
}
