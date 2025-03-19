# Konfiguration av e-postfunktionen

För att e-postfunktionen i kontaktformuläret ska fungera korrekt behöver du konfigurera ett Gmail-konto med en app-specifik lösenord. Följ dessa steg:

## 1. Skapa ett Gmail-konto (om du inte redan har ett)

Om du inte redan har ett Gmail-konto som du vill använda för att ta emot meddelanden från kontaktformuläret, skapa ett nytt konto på [Gmail](https://mail.google.com).

## 2. Aktivera tvåstegsverifiering

För att kunna skapa ett app-specifikt lösenord måste du först aktivera tvåstegsverifiering för ditt Gmail-konto:

1. Gå till [Google-kontots säkerhetsinställningar](https://myaccount.google.com/security)
2. Klicka på "Tvåstegsverifiering" under "Logga in på Google"
3. Följ instruktionerna för att aktivera tvåstegsverifiering

## 3. Skapa ett app-specifikt lösenord

När tvåstegsverifiering är aktiverad kan du skapa ett app-specifikt lösenord:

1. Gå till [App-lösenord](https://myaccount.google.com/apppasswords)
2. Välj "Annan (Anpassat namn)" från rullgardinsmenyn
3. Ange ett namn för appen (t.ex. "Casinobonusar Kontaktformulär")
4. Klicka på "Generera"
5. Google kommer att visa ett 16-tecken långt lösenord. Kopiera detta lösenord.

## 4. Uppdatera .env.local-filen

Öppna filen `.env.local` i projektets rot och uppdatera följande variabler:

```
EMAIL_USER=ditt-gmail-konto@gmail.com
EMAIL_PASSWORD=ditt-app-specifika-lösenord
```

Ersätt `ditt-gmail-konto@gmail.com` med din Gmail-adress och `ditt-app-specifika-lösenord` med det 16-tecken långa lösenordet du genererade i föregående steg.

## 5. Starta om servern

Efter att du har uppdaterat `.env.local`-filen, starta om utvecklingsservern för att ändringarna ska träda i kraft:

```bash
npm run dev
```

## Felsökning

Om du stöter på problem med att skicka e-post, kontrollera följande:

1. Kontrollera att du har angett rätt e-postadress och app-specifikt lösenord i `.env.local`-filen.
2. Kontrollera att tvåstegsverifiering är aktiverad för ditt Gmail-konto.
3. Kontrollera att app-specifikt lösenord är korrekt genererat och kopierat utan extra mellanslag.
4. Kontrollera serverns loggar för eventuella felmeddelanden.

## Säkerhetsöverväganden

- Dela aldrig ditt app-specifika lösenord med någon annan.
- Lägg inte till `.env.local`-filen i versionshanteringen (den är redan inkluderad i `.gitignore`).
- Om du misstänker att ditt app-specifika lösenord har komprometterats, återkalla det omedelbart i dina Google-kontoinställningar och skapa ett nytt.

## Anpassa e-postmallen

Om du vill anpassa utseendet på e-postmeddelandet som skickas, kan du redigera HTML-mallen i filen `src/app/api/contact/route.ts`. Leta efter variabeln `mailOptions` och ändra HTML-koden i `html`-egenskapen. 