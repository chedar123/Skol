#!/bin/bash

# Skript för att hitta potentiellt oanvända komponenter och filer samt duplicerad kod
# i ett Next.js-projekt

echo "=== Analys av kodbasen: oanvända filer och potentiell duplicering ==="
echo ""

# Skapa temporär mapp för resultat
mkdir -p ./temp_analysis
rm -f ./temp_analysis/*

# 1. Hitta alla komponenter och sidor
echo "Samlar in alla komponenter, sidor och biblioteksfiler..."
find ./src -name "*.tsx" -o -name "*.ts" > ./temp_analysis/all_files.txt
grep -v "node_modules\|.next\|test\|__tests__" ./temp_analysis/all_files.txt > ./temp_analysis/filtered_files.txt

# 2. För varje komponent/fil, kontrollera om den importeras någonstans
echo ""
echo "Analyserar användning av filer:"
echo "------------------------------"

total_files=$(wc -l < ./temp_analysis/filtered_files.txt)
potentially_unused=0

while IFS= read -r file; do
  # Extrahera filnamn utan sökväg och filändelse för sökning
  filename=$(basename "$file")
  basename="${filename%.*}"
  
  # Säkrare sökning efter importer
  import_count=$(grep -r "from ['\"].*$basename['\"]" --include="*.tsx" --include="*.ts" ./src 2>/dev/null | wc -l)
  import_count2=$(grep -r "import .*$basename" --include="*.tsx" --include="*.ts" ./src 2>/dev/null | wc -l)
  require_count=$(grep -r "require(['\"].*$basename['\"])" --include="*.tsx" --include="*.ts" ./src 2>/dev/null | wc -l)
  
  total_imports=$((import_count + import_count2 + require_count))
  
  # Ta bort självimporter
  self_import_count=$(grep -r "from ['\"].*$basename['\"]" --include="*.tsx" --include="*.ts" "$file" 2>/dev/null | wc -l)
  self_import_count2=$(grep -r "import .*$basename" --include="*.tsx" --include="*.ts" "$file" 2>/dev/null | wc -l)
  self_import_count3=$(grep -r "require(['\"].*$basename['\"])" --include="*.tsx" --include="*.ts" "$file" 2>/dev/null | wc -l)
  
  self_imports=$((self_import_count + self_import_count2 + self_import_count3))
  actual_imports=$((total_imports - self_imports))
  
  # Kontrollera om det är en Next.js-sida/layout/komponent
  if [[ "$file" == *"/page.tsx" || "$file" == *"/layout.tsx" || "$file" == *"/loading.tsx" || "$file" == *"/error.tsx" || "$file" == *"/route.ts" ]]; then
    # Detta är en Next.js route som laddas automatiskt
    echo "✅ $file (Next.js route)"
  elif [[ "$file" == *"/api/"* && "$file" == *"/route.ts" ]]; then
    # Detta är en API-route som laddas automatiskt
    echo "✅ $file (API route)"
  elif [[ "$file" == *"/components/ui/"* ]]; then
    # UI-komponenter från shadcn, kontrollera mer noggrant
    component_name=$(basename "$(dirname "$file")")
    component_usage=$(grep -r "<$component_name" --include="*.tsx" ./src 2>/dev/null | grep -v "$file" | wc -l)
    
    if [ "$component_usage" -gt 0 ] || [ "$actual_imports" -gt 0 ]; then
      echo "✅ $file (används i projektets komponenter)"
    else
      echo "❌ $file (potentiellt oanvänd UI-komponent)"
      echo "$file" >> ./temp_analysis/unused_components.txt
      potentially_unused=$((potentially_unused + 1))
    fi
  elif [ "$actual_imports" -eq 0 ]; then
    # Kontrollera om filen används via komponentnamn direkt
    component_name="$basename"
    component_usage=$(grep -r "<$component_name" --include="*.tsx" ./src 2>/dev/null | grep -v "$file" | wc -l)
    
    if [ "$component_usage" -gt 0 ]; then
      echo "✅ $file (används som komponent i kodbasen)"
    else
      echo "❌ $file (importeras inte någonstans)"
      echo "$file" >> ./temp_analysis/unused_files.txt
      potentially_unused=$((potentially_unused + 1))
    fi
  else
    echo "✅ $file (importeras i kodbasen)"
  fi
done < ./temp_analysis/filtered_files.txt

# 3. Hitta potentiellt duplicerad kod och stora komponenter
echo ""
echo "Analyserar stora komponenter och potentiell kodduplicering:"
echo "--------------------------------------------------------"

# Hitta stora komponenter (mer än 200 rader)
find ./src -name "*.tsx" -o -name "*.ts" | xargs wc -l 2>/dev/null | awk '$1 > 200 {print $0}' | sort -nr > ./temp_analysis/large_files.txt

# Hitta liknande komponenter baserat på filnamn
echo "Potentiellt liknande komponenter baserat på filnamn:" > ./temp_analysis/similar_components.txt
find ./src/components -name "*.tsx" | sort | awk -F/ '{print $NF}' | sed 's/\.tsx$//' | grep -iE "card|button|modal|section|list|item|form|header|footer|nav|bar|menu" | sort | uniq -c | sort -nr | awk '$1 > 1 {print $0}' >> ./temp_analysis/similar_components.txt

# Hitta duplicerade funktionsnamn
echo "Potentiellt duplicerade funktioner:" > ./temp_analysis/duplicate_functions.txt
grep -r "function " --include="*.tsx" --include="*.ts" ./src | grep -v "node_modules" | awk -F'function ' '{print $2}' | awk '{print $1}' | sort | uniq -c | sort -nr | awk '$1 > 1 {print $0}' >> ./temp_analysis/duplicate_functions.txt

# 4. Sammanfattning
echo ""
echo "=== Sammanfattning ==="
echo "Totalt antal filer: $total_files"
echo "Potentiellt oanvända filer: $potentially_unused"

large_files_count=$(wc -l < ./temp_analysis/large_files.txt)
echo "Antal stora filer (>200 rader): $large_files_count"

# 5. Visa resultat
echo ""
echo "=== Potentiellt oanvända komponenter ==="
if [ -f ./temp_analysis/unused_components.txt ] && [ -s ./temp_analysis/unused_components.txt ]; then
  cat ./temp_analysis/unused_components.txt
else
  echo "Inga oanvända UI-komponenter hittades"
fi

echo ""
echo "=== Potentiellt oanvända filer ==="
if [ -f ./temp_analysis/unused_files.txt ] && [ -s ./temp_analysis/unused_files.txt ]; then
  cat ./temp_analysis/unused_files.txt
else
  echo "Inga oanvända filer hittades"
fi

echo ""
echo "=== Stora komponenter (>200 rader) ==="
if [ -f ./temp_analysis/large_files.txt ] && [ -s ./temp_analysis/large_files.txt ]; then
  cat ./temp_analysis/large_files.txt
else
  echo "Inga stora komponenter hittades"
fi

echo ""
echo "=== Potentiellt liknande komponenter ==="
if [ -f ./temp_analysis/similar_components.txt ] && [ -s ./temp_analysis/similar_components.txt ]; then
  cat ./temp_analysis/similar_components.txt
else
  echo "Inga liknande komponenter hittades"
fi

echo ""
echo "=== Potentiellt duplicerade funktioner ==="
if [ -f ./temp_analysis/duplicate_functions.txt ] && [ -s ./temp_analysis/duplicate_functions.txt ]; then
  head -15 ./temp_analysis/duplicate_functions.txt
  echo "..."
else
  echo "Inga duplicerade funktioner hittades"
fi

echo ""
echo "=== Rekommendationer ==="
echo "1. Överväg att refaktorisera stora komponenter (>200 rader) till mindre, återanvändbara delar"
echo "2. Kontrollera liknande komponenter för potentiell konsolidering"
echo "3. Kontrollera duplicerade funktionsnamn för potentiell kodduplicering"
echo "4. Använd ESLint för att hitta oanvända variabler och importer"
echo ""
echo "OBS: Detta är en enkel analys som kan visa falska positiva. Verktyg som next-unused eller depcheck ger mer tillförlitliga resultat."
echo "Filer som laddas dynamiskt (t.ex. genom dynamic import() eller med namn som hämtas ur databas) kan visas som oanvända även om de används."

# Ge skriptet körrättigheter
chmod +x analyze_unused.sh
