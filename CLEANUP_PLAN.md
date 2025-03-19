# Städplan för Slotskolan-kodbasen

Baserat på kodanalys har vi identifierat flera områden där kodbasen kan förbättras, städas upp och optimeras.

## 1. Ta bort oanvända filer och komponenter

### Potentiellt oanvända UI-komponenter att kontrollera/ta bort:
- [ ] `src/components/ui/tabs.tsx` (om dessa inte används dynamiskt)
- [ ] `src/components/ui/accordion.tsx`
- [ ] `src/components/ui/dialog.tsx`
- [ ] `src/components/ui/table.tsx`
- [ ] `src/components/ui/dropdown-menu.tsx`

### Övriga oanvända filer att kontrollera/ta bort:
- [ ] `src/middleware.ts` (OBS: kan vara viktig för autentisering, kontrollera noga)
- [ ] `src/app/ClientBody.tsx`
- [ ] `src/app/slots/metadata.ts`
- [ ] `src/components/SectionHeader.tsx`
- [ ] `src/components/CasinoFilter.tsx`
- [ ] `src/components/HeroBanner.tsx`

### Fixa saknad integration:
- [ ] Uppdatera `src/app/api/upload/route.ts` för att använda Cloudinary (vi har redan gjort detta)

## 2. Refaktorisera stora komponenter

Stora komponenter bör brytas ner i mindre, mer hanterliga komponenter. Prioritera:

- [ ] `src/components/CasinoReview.tsx` (450 rader)
- [ ] `src/components/CasinoPopupModal.tsx` (417 rader)
- [ ] `src/components/SlotModal.tsx` (323 rader)
- [ ] `src/components/CommentSection.tsx` (317 rader)

För varje komponent, identifiera återkommande mönster eller logiska block som kan brytas ut till separata komponenter.

## 3. Konsolidera duplicerad kod

### API-routes:
- [ ] Skapa gemensamma hjälpfunktioner för vanliga databasoperationer
- [ ] Konsolidera liknande felhantering i API-routes
- [ ] Skapa återanvändbara valideringshjälpmedel

### Komponenter:
- [ ] Identifiera och konsolidera liknande funktionalitet mellan komponenter
- [ ] Skapa återanvändbara hooks för gemensam logik
- [ ] Standardisera mönster för formulärhantering och datainhämtning

## 4. Optimera kodens struktur

- [ ] Organisera komponenter i logiska mappar (UI, Layout, Features, osv)
- [ ] Använd index.ts-filer för att förenkla importer
- [ ] Standardisera namngivningskonventioner
- [ ] Lägg till TypeScript-typer där de saknas

## 5. Förbättra kodkvalitet

- [ ] Aktivera ESLint-regler för oanvända variabler
- [ ] Skriv enhetstester för kritiska komponenter
- [ ] Lägg till JSDoc-kommentarer för viktiga funktioner
- [ ] Implementera Storybook för UI-komponenter

## Prioriterad ordning:

1. Fixa Cloudinary-integrationen (klar)
2. Ta bort oanvända filer
3. Refaktorisera de största komponenterna
4. Konsolidera duplicerad kod
5. Implementera strukturella förbättringar

## Långsiktiga förbättringar:

- Överväg att migrera komponenter till TypeScript om de inte redan är det
- Implementera caching-strategier för databasanrop
- Optimera bilder och statiska resurser 