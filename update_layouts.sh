#!/bin/bash
FILES=$(find src/app -type f -name "*.tsx" | xargs grep -l "MainLayout" | grep -v "layout.tsx" | grep -v "MainLayout.tsx")
for file in $FILES; do echo "Uppdaterar $file..."; sed -i "" "/import.*MainLayout/d" "$file"; sed -i "" "s/<MainLayout>/<>/g" "$file"; sed -i "" "s/<\/MainLayout>/<\/>/g" "$file"; done
echo "Klart! Alla filer har uppdaterats."
