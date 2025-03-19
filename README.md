# Slotskolan

En modern webbplats för casinorecensioner och spelguider.

## Projektstruktur

Projektet är organiserat enligt följande struktur:

```
src/
├── app/                    # Next.js app-router och sidor
│   ├── api/                # API-endpoints
│   ├── spel/               # Spelsidor
│   ├── casino-utan-spelpaus/ # Casinosidor
│   └── ...                 # Övriga sidor
├── components/             # React-komponenter
│   ├── common/             # Återanvändbara UI-komponenter
│   ├── layout/             # Layout-komponenter (Header, Footer, etc.)
│   ├── slots/              # Spelrelaterade komponenter
│   ├── casino/             # Casinorelaterade komponenter
│   ├── forms/              # Formulärkomponenter
│   ├── providers/          # Kontext-providers
│   └── shared/             # Delade komponenter
├── context/                # React-kontext
├── lib/                    # Bibliotekskod
│   ├── data/               # Datakällor och datahantering
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Tjänster för API-anrop, etc.
│   ├── types/              # TypeScript-typdefinitioner
│   ├── utils/              # Hjälpfunktioner
│   └── constants/          # Konstanter
├── styles/                 # Globala stilar
└── middleware.ts           # Next.js middleware
```

## Komponentbibliotek

Projektet använder ett eget komponentbibliotek för att säkerställa konsekvent design:

- `Button`: Standardiserade knappar med olika varianter
- `Card`: Kortkomponenter för att visa innehåll
- `NavLink`: Navigeringslänkar med aktiv-tillstånd

## Utveckling

### Förutsättningar

- Node.js 18+
- npm eller yarn

### Installation

```bash
npm install
```

### Utvecklingsserver

```bash
npm run dev
```

### Bygga för produktion

```bash
npm run build
npm start
```

## Kodkonventioner

- Använd TypeScript för all kod
- Använd funktionella komponenter med hooks
- Följ BEM-namnkonventioner för CSS-klasser
- Använd Tailwind CSS för styling
