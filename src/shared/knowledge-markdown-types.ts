export type MdInline =
  | { kind: 'text'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'strong'; children: MdInline[] }
  | { kind: 'em'; children: MdInline[] }
  | { kind: 'link'; href: string; children: MdInline[] }
  | { kind: 'image'; alt: string; src: string }

export type MdBlock =
  | { kind: 'heading'; level: 1 | 2 | 3; children: MdInline[] }
  | { kind: 'paragraph'; children: MdInline[] }
  | { kind: 'blockquote'; children: MdInline[] }
  | { kind: 'hr' }
  | { kind: 'ul'; items: MdInline[][] }
  | { kind: 'ol'; items: MdInline[][] }
  | { kind: 'pre'; language: string | null; code: string }
