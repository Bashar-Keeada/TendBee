# 📱 TendBee Mobile App Specifikation
## För Emergent Mobile Agent

---

## 🎯 Översikt

**Appnamn:** TendBee  
**Tagline:** "Hitta jobb. Hitta rätt person."  
**Typ:** Jobbmatchningsapp med anti-diskrimineringsfokus  
**Språk:** Svenska (primärt)

### Kärnkoncept
TendBee är Sveriges första anti-diskriminerande jobbplattform. Appen matchar jobbsökare med arbetsgivare baserat på **kompetens** - inte utseende, kön eller ålder. 

Unik funktion: **"TendBee Plus"** låter användare dölja känslig information (kön, ålder, foto) för att undvika diskriminering.

---

## 👥 Användartyper

### 1. Jobbsökare
- Skapar profil med kompetenser, utbildning, erfarenhet
- Kan dölja personlig info (Plus-funktion)
- Får AI-baserade jobbmatchningar
- Delar profil via QR-kod

### 2. Arbetsgivare
- Skapar företagsprofil
- Publicerar jobbannonser
- Söker bland kandidater (ser anonymiserade profiler)
- Kontaktar matchade kandidater

### 3. Admin
- Dashboard med statistik
- Hantera jobbsökare, företag, jobb, ansökningar

---

## 📱 Skärmar & Flöden

### Jobbsökarflöde (7 steg)

#### 1. Landing Screen
```
- TendBee logo (bi-ikon med amber/guld färg)
- "Jag söker jobb" knapp (amber gradient)
- "Jag är arbetsgivare" knapp (mörk gradient)
- "Skanna QR-kod" länk
- Feature badges: "AI-matchning", "GDPR-säkert", "Snabb matchning"
```

#### 2. Login Screen (BankID Mock)
```
- BankID-ikon med glow-effekt
- "Mobilt BankID" info-ruta (gul bakgrund)
- "Logga in med BankID" knapp
- GDPR-meddelande
```

#### 3. BasicInfo Screen (Steg 1/7)
```
- Progress bar (amber gradient)
- Profilbild-uppladdning (cirkel med streckad kant)
- Formulärfält:
  - Förnamn (text)
  - Efternamn (text)
  - Kön (4 knappar: Man/Kvinna/Annat/Vill ej ange)
  - Ålder (nummer)
  - Telefon (med +46 prefix)
- Integritetsskydd-sektion (Plus):
  - Toggle: Dölj kön
  - Toggle: Dölj ålder
  - Toggle: Dölj profilbild
  - Toggle: Anonym visnings-ID
- "Uppgradera till Plus" knapp (49 kr/mån)
- "Fortsätt" knapp
```

#### 4. Work Situation Screen (Steg 2/7)
```
- Nuvarande arbetssituation (val):
  - Arbetslös
  - Anställd (söker nytt)
  - Student
  - Praktikant
  - Egenföretagare
```

#### 5. Job Preferences Screen (Steg 3/7)
```
- Önskad jobbtyp (flerval):
  - Heltid
  - Deltid
  - Timanställning
  - Praktik
- Önskad plats/stad
- Pendlingsavstånd
```

#### 6. Salary Preferences Screen (Steg 4/7)
```
- Löneanspråk (slider eller input)
- Önskad anställningsform
```

#### 7. CV Completed Screen
```
- Profilstyrka-cirkel (procent)
- QR-kod för delning
- "Förbättra din profil" knapp → Kurser Screen
```

#### 8. Courses Screen (Kompetenser)
```
- Online kunskapskurs (20 min, +15%)
- Praktisk kurs - Keeada Academy (2-4 veckor, +15%)
- Expanderbara sektioner:
  - Kompetenser & Certifikat (truckkort, etc.)
  - Utbildning (gymnasium, YH, högskola)
  - Erfarenhet (lager, logistik, etc.)
- Chips för val med +/- ikoner
```

### Arbetsgivarflöde

#### 1. Company Info Screen
```
- Företagsnamn
- Organisationsnummer
- Bransch (dropdown)
- Kontaktperson
- E-post
- Telefon
```

#### 2. Employer Dashboard
```
- Publicerade jobb
- Mottagna ansökningar
- Matchade kandidater
```

---

## 🎨 Design System

### Färger
```
Primary (Amber/Guld): #F59E0B
Primary Dark: #D97706
Primary Darker: #B45309
Secondary (Navy): #1E3A5F
Background: #FFFFFF
Text Primary: #111827
Text Secondary: #6B7280
Success Green: #22C55E
Error Red: #EF4444
```

### Gradienter
```
Amber Button: linear-gradient(135deg, #F59E0B, #D97706, #B45309)
Dark Button: linear-gradient(135deg, #1E3A5F, #0F172A)
```

### Typografi
```
Font: Inter (body), Space Grotesk (headings)
H1: 32px bold
H2: 24px bold
Body: 16px regular
Small: 14px regular
```

### Komponenter
```
- Knappar: rounded-2xl (16px), h-14, font-semibold
- Cards: rounded-2xl, border-2, shadow-sm
- Inputs: rounded-xl, h-12, border-2
- Progress bar: h-2, rounded-full, amber gradient
- Toggle switches: amber när aktiv
```

---

## 🔌 Backend API (Befintlig FastAPI)

### Base URL
Använd miljövariabel: `REACT_APP_BACKEND_URL`

### Endpoints

#### Autentisering
```
POST /api/auth/google - Google OAuth
GET /api/auth/user - Hämta inloggad användare
```

#### Användarprofil
```
GET /api/user/profile - Hämta profil
PUT /api/user/profile - Uppdatera profil
POST /api/user/profile/upload-image - Ladda upp profilbild
```

#### Stripe Betalning (Plus)
```
GET /api/stripe/packages - Hämta prispaket
POST /api/stripe/create-checkout-session - Skapa betalning
POST /api/stripe/webhook - Webhook för betalningsstatus
```

#### Jobbsökare (Admin)
```
GET /api/jobseekers - Lista alla jobbsökare
GET /api/jobseekers/{id} - Hämta specifik
```

#### Företag
```
GET /api/companies - Lista företag
POST /api/companies - Skapa företag
```

#### Jobb
```
GET /api/jobs - Lista jobb
POST /api/jobs - Skapa jobb
```

#### Ansökningar
```
GET /api/applications - Lista ansökningar
POST /api/applications - Skapa ansökning
PATCH /api/applications/{id} - Uppdatera status
```

---

## 💾 Datamodeller

### User/JobSeeker
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "gender": "man|kvinna|annat|prefer_not_to_say",
  "age": "number",
  "phone": "string",
  "email": "string",
  "profileImage": "string (URL)",
  "workSituation": "string",
  "jobPreferences": {
    "types": ["heltid", "deltid"],
    "locations": ["Stockholm"],
    "salary": "number"
  },
  "skills": [{"id": "string", "label": "string"}],
  "education": [{"id": "string", "label": "string"}],
  "experience": [{"id": "string", "label": "string"}],
  "privacy": {
    "hideGender": "boolean",
    "hideAge": "boolean",
    "hideProfileImage": "boolean",
    "useAnonymousId": "boolean"
  },
  "isPlusMember": "boolean",
  "profileCompleteness": "number (0-100)"
}
```

### Company
```json
{
  "id": "string",
  "name": "string",
  "orgNumber": "string",
  "industry": "string",
  "contactPerson": "string",
  "email": "string",
  "phone": "string"
}
```

### Job
```json
{
  "id": "string",
  "companyId": "string",
  "title": "string",
  "description": "string",
  "type": "heltid|deltid|praktik",
  "location": "string",
  "salary": "string",
  "requirements": ["string"],
  "status": "active|closed"
}
```

---

## ✨ Speciella funktioner

### 1. TendBee Plus (Prenumeration)
- Pris: 49 kr/mån eller 490 kr/år
- Funktioner:
  - Dölj kön från arbetsgivare
  - Dölj ålder från arbetsgivare
  - Dölj profilbild
  - Anonym ID istället för namn
- Integration: Stripe Checkout

### 2. QR-kod för profildelning
- Generera QR-kod med profil-URL
- Arbetsgivare kan skanna för att se profil

### 3. Profilstyrka
- Beräknas baserat på ifyllda fält
- Visuell cirkel med procent
- Uppmaningar att förbättra profilen

### 4. AI-matchning
- Matchar jobbsökare med jobb baserat på:
  - Kompetenser
  - Erfarenhet
  - Preferenser (plats, lön, typ)

---

## 📲 Mobilspecifika anpassningar

### Navigation
- Bottom tab navigation för huvudsektioner
- Stack navigation för flöden
- Swipe-gester för att gå tillbaka

### Notifikationer
- Push-notiser för nya jobbmatchningar
- Påminnelser att slutföra profilen
- Status på ansökningar

### Offline-stöd
- Spara profildata lokalt
- Synka när uppkoppling finns

### Kamera
- Ta profilbild direkt i appen
- Skanna QR-koder

---

## 🚀 Prioriterade skärmar för MVP

1. ✅ Landing Screen
2. ✅ Login (BankID mock)
3. ✅ Basic Info (med privacy toggles)
4. ✅ Work Situation
5. ✅ Job Preferences
6. ✅ CV Completed (med QR)
7. ✅ Courses/Skills
8. ✅ Employer Company Info
9. ⏳ Job Listings
10. ⏳ Profile View (för arbetsgivare)

---

## 📝 Instruktioner till Mobile Agent

"Skapa en React Native (Expo) mobilapp för TendBee baserat på denna specifikation. 

Prioritera:
1. Jobbsökarflödet (steg 1-7)
2. Amber/guld färgschema med moderna gradienter
3. Smooth animationer och transitions
4. Integration med befintlig backend API
5. Stripe-integration för Plus-prenumeration
6. QR-kod generering och scanning

Använd:
- Expo SDK
- React Navigation
- Expo SecureStore för tokens
- Expo Camera för QR/foto
- NativeWind eller StyleSheet för styling

Backend finns redan på: [REACT_APP_BACKEND_URL från .env]"

---

**Skapad:** Januari 2026  
**Version:** 1.0  
**Plattform:** iOS & Android
