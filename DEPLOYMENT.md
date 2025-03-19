# Driftsättningsguide för Slotskolan på Strato

Denna guide beskriver hur du driftsätter Slotskolan på Strato webhost med MySQL och Cloudinary för bildhantering.

## Förberedelse

1. Bygg projektet för produktion:
```bash
npm run build
```

2. Kontrollera att .env.production innehåller rätt inställningar för Strato, inklusive Cloudinary API secret.

## Driftsättning på Strato

### Steg 1: Konfigurera MySQL

När du använder MySQL på Strato behöver du komma ihåg följande:
- På Strato kan du endast ansluta till MySQL-databasen från servern själv
- Använd `localhost` som värdnamn i produktionsmiljön istället för det externa värdnamnet

### Steg 2: Konfigurera Cloudinary

Säkerställ att du har lagt till din Cloudinary API secret i `.env.production`:
```
CLOUDINARY_API_SECRET="iyKDf2zZ3T-mxsZpV9MoVjzr0mQ"
CLOUDINARY_URL="cloudinary://259583662719614:iyKDf2zZ3T-mxsZpV9MoVjzr0mQ@djpivnnxc"
```

### Steg 3: Ladda upp filerna

1. Ladda upp följande filer och mappar till din webbplats på Strato:
   - `.next/` mappen (den byggda applikationen)
   - `public/` mappen
   - `prisma/` mappen
   - `.env.production` (döp om till `.env` på servern)
   - `package.json` och `package-lock.json`
   - `next.config.ts`

2. FTP-programvara som [FileZilla](https://filezilla-project.org/) rekommenderas för uppladdning.

### Steg 4: Installera Node-moduler på servern

Kör följande kommando på Strato-servern:
```bash
npm install --production
```

### Steg 5: Konfigurera Prisma för MySQL

1. Redigera `prisma/schema.prisma` på servern för att använda MySQL:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

2. Kör Prisma-migreringarna på servern:
```bash
npx prisma migrate deploy
```

### Steg 6: Konfigurera Webbservern

På Strato behöver du konfigurera webbservern att peka på Next.js-applikationen:

1. Om du använder Node.js-miljö, konfigurera den att köra:
```bash
npm start
```

2. För Strato-specifika inställningar, se deras dokumentation för Node.js-applikationer.

### Steg 7: Konfigurera domänen

1. Uppdatera `NEXTAUTH_URL` i `.env`-filen på servern att peka till din faktiska domän:
```
NEXTAUTH_URL="https://slotskolan.se"
```

## Felsökning

Om du stöter på problem med databasen, kontrollera:
1. Att du använder `localhost` i `DATABASE_URL` på servern
2. Att du har korrekt användarnamn och lösenord
3. Att MySQL-användaren har tillräckliga rättigheter

För auth-problem, kontrollera att `NEXTAUTH_URL` är korrekt och att `NEXTAUTH_SECRET` är satt.

För bilduppladdningsproblem, kontrollera:
1. Att Cloudinary API-nyckeln och hemligheten är korrekt inställda
2. Att nätverksanslutningen från servern till Cloudinary fungerar

## Viktiga kommandon

- Starta servern i produktionsläge: `npm start`
- Applicera databas-migrationer: `npx prisma migrate deploy`
- Generera Prisma-klienten: `npx prisma generate`

## Kontinuerlig driftsättning

För framtida uppdateringar:
1. Bygg lokalt: `npm run build`
2. Ladda upp nya filer
3. Kör `npm install` om du har nya paket
4. Kör `npx prisma migrate deploy` om du har nya databasändringar
5. Starta om applikationen
