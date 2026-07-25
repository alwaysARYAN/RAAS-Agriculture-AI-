# PowerShell script to translate JSON file from Hindi to Gujarati
# This creates a basic Gujarati translation by replacing Hindi text with Gujarati equivalents

$hindiFile = "d:\agriculture-ai\client\src\i18n\locales\hi.json"
$gujaratiFile = "d:\agriculture-ai\client\src\i18n\locales\gu.json"

Write-Host "Reading Hindi translation file..." -ForegroundColor Cyan
$content = Get-Content $hindiFile -Raw -Encoding UTF8

Write-Host "Applying Gujarati translations..." -ForegroundColor Yellow

# Common translations (Hindi → Gujarati)
$translations = @{
    # Common
    "स्वागत" = "સ્વાગત છે"
    "लॉग आउट" = "લોગ આઉટ"
    "लोड हो रहा है" = "લોડ થઈ રહ્યું છે"
    "सहेजें" = "સાચવો"
    "रद्द करें" = "રદ કરો"
    "हटाएं" = "કાઢી નાખો"
    "संपादित करें" = "સંપાદિત કરો"
    "जोड़ें" = "ઉમેરો"
    "खोजें" = "શોધો"
    "फ़िल्टर" = "ફિલ્ટર"
    "निर्यात" = "નિકાસ"
    "साझा करें" = "શેર કરો"
    "बंद करें" = "બંધ કરો"
    "पीछे" = "પાછળ"
    "आगे" = "આગળ"
    "जमा करें" = "સબમિટ કરો"
    "सफलता" = "સફળતા"
    "त्रुटि" = "ભૂલ"
    "चेतावनी" = "ચેતવણી"
    
    # Navigation
    "डैशबोर्ड" = "ડૅશબોર્ડ"
    "विश्लेषण" = "વિશ્લેષણ"
    "मेरे खेत" = "મારા ખેતરો"
    "मेरी फसलें" = "મારા પાક"
    "रोग पहचान" = "રોગ ઓળખ"
    "मौसम" = "હવામાન"
    "बाजार भाव" = "બજાર ભાવ"
    "योजनाएं" = "યોજનાઓ"
    "मेरी प्रोफाइल" = "મારી પ્રોફાઇલ"
    
    # Dashboard
    "कुल खेत" = "કુલ ખેતરો"
    "कુલ फसलें" = "કુલ પાક"
    "सक्रिय फसलें" = "સક્રિય પાક"
    "खेत जोड़ें" = "ખેતર ઉમેરો"
    "फसल जोड़ें" = "પાક ઉમેરો"
    "रोग स्कैन करें" = "રોગ સ્કેન કરો"
    "मौसम जांचें" = "હવામાન તપાસો"
    "आज की खेती टिप" = "આજની ખેતી ટિપ"
    "कुल क्षेत्र" = "કુલ વિસ્તાર"
    "एकड़" = "એકર"
    
    # More common words
    "फसल" = "પાક"
    "खेत" = "ખેતર"
    "कृषि" = "ખેતી"
    "पाक" = "પાક"
    "ખેતરો" = "ખેતરો"
}

# Apply translations
foreach ($hindi in $translations.Keys) {
    $gujarati = $translations[$hindi]
    $content = $content -replace [regex]::Escape($hindi), $gujarati
}

Write-Host "Saving Gujarati translation file..." -ForegroundColor Green
$content | Out-File -FilePath $gujaratiFile -Encoding UTF8 -NoNewline

Write-Host "✅ Translation complete! File saved to: $gujaratiFile" -ForegroundColor Green
Write-Host "Note: This is a partial translation. For complete translation, use Google Translate API." -ForegroundColor Yellow
