# 🌸 Nihongemu — Japanese Grammar Sandbox

A kawaii anime-styled interactive web app for learning Japanese grammar through drag-and-drop sentence building exercises.

🔗 **Live App**: https://shinichiZero.github.io/nihongemu

## Features

- 🎯 **5 Grammar Categories**: Intentions, Conditionals, Sensory, Comparisons, Experience
- 🧩 **Drag-and-Drop**: Build sentences by dragging word tiles into slots
- 🌟 **Focus Mode**: Distraction-free learning overlay
- 📊 **Progress Tracking**: Saved to localStorage
- 🔊 **Audio Feedback**: Web Audio API tones (no external files)
- ✨ **Animations**: Framer Motion powered transitions

## Grammar Points Covered

| Category | Grammar Points |
|----------|---------------|
| Intentions | 〜よう, 〜ようと思う, 〜つもり / 〜ないつもり |
| Conditionals | 〜ば, 〜たら, 〜と (with sameSubject validation) |
| Sensory | 〜がする, 〜は...〜が (physical attributes) |
| Comparisons | 〜より/のほうが, 〜ほど〜ない, 〜の中で一番 |
| Experience | 〜たことがある, 〜（ない）ことがある |

## Tech Stack

- **React 18** + **TypeScript** + **Vite 5**
- **Tailwind CSS 3** — Utility-first styling
- **Framer Motion** — Animations
- **Zustand** — State management
- **@dnd-kit** — Accessible drag-and-drop

## Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Security Checklist

- ✅ No `dangerouslySetInnerHTML` used
- ✅ All dependency versions pinned (no `^` or `~`)
- ✅ Content Security Policy meta tag
- ✅ Prototype-safe objects (`Object.create(null)`)
- ✅ localStorage data validated with type guards
- ✅ npm audit in CI (high severity threshold)
- ✅ CodeQL scanning enabled
- 🔲 Subresource Integrity (future: if CDN assets added)
- 🔲 Rate limiting (N/A — frontend only)