// Ett enkelt skript för att konvertera SQLite dump till MySQL-format
const fs = require('fs');

// Läs in SQLite-dumpen
const sqliteDump = fs.readFileSync('local_data_dump.sql', 'utf8');

// Dela upp dumpen i rader
const lines = sqliteDump.split('\n');

// Resultatarray
const mysqlLines = [];

// Gå igenom varje rad
for (let line of lines) {
  // Hoppa över SQLite-specifika kommandon
  if (line.includes('PRAGMA') || 
      line.includes('BEGIN TRANSACTION') || 
      line.includes('COMMIT') ||
      line.trim() === '') {
    continue;
  }
  
  // Konvertera INSERT-kommandon
  if (line.startsWith('INSERT INTO')) {
    // Byt ut dubbla citat mot enkla för MySQL
    line = line.replace(/"/g, '`');
    
    // Lägg till korrekt avslut med semikolon
    if (!line.endsWith(';')) {
      line += ';';
    }
    
    mysqlLines.push(line);
  }
}

// Skriv resultatet till en ny fil
fs.writeFileSync('mysql_data.sql', mysqlLines.join('\n'), 'utf8');

console.log('Konvertering slutförd. Resultatet finns i mysql_data.sql'); 