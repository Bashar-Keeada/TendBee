# GDPR Consent Texts

## Swedish (Primary)

### Grundläggande samtycke (Required)

```
☐ Jag godkänner att TendBee behandlar mina personuppgifter i enlighet med 
   integritetspolicyn för att matcha mig med relevanta jobbmöjligheter.
   
   Detta inkluderar:
   • Lagring av min profil och CV
   • AI-baserad matchning med jobbannonser
   • Delning av min profil med arbetsgivare (enligt mina integritetsinställningar)
   
   Du kan när som helst:
   • Exportera dina uppgifter
   • Radera ditt konto
   • Ändra dina integritetsinställningar
   
   Läs vår fullständiga integritetspolicy: [länk]
```

### Marknadsföringssamtycke (Optional)

```
☐ Jag vill ta emot nyheter, tips och erbjudanden från TendBee via e-post.
   Du kan avregistrera dig när som helst via länken i våra utskick.
```

### Analyssamtycke (Optional)

```
☐ Jag godkänner att TendBee samlar in anonymiserad användningsdata 
   för att förbättra tjänsten.
```

### Tredjepartsdelning (Optional - TendBee Plus)

```
☐ Jag godkänner att TendBee delar min anonymiserade profil med 
   utvalda rekryteringspartners för att hitta fler jobbmöjligheter.
```

---

## English

### Basic Consent (Required)

```
☐ I consent to TendBee processing my personal data in accordance with 
   the privacy policy to match me with relevant job opportunities.
   
   This includes:
   • Storage of my profile and CV
   • AI-based matching with job listings
   • Sharing my profile with employers (according to my privacy settings)
   
   You can at any time:
   • Export your data
   • Delete your account
   • Change your privacy settings
   
   Read our full privacy policy: [link]
```

### Marketing Consent (Optional)

```
☐ I would like to receive news, tips and offers from TendBee via email.
   You can unsubscribe at any time via the link in our emails.
```

---

## Consent Recording Requirements

### Data to Store

```json
{
  "consent_id": "uuid-v4",
  "user_id": "uuid-v4",
  "consent_type": "gdpr_processing | marketing | analytics | third_party",
  "granted": true,
  "timestamp": "2025-01-01T12:00:00.000Z",
  "ip_address": "hashed or full depending on legal advice",
  "user_agent": "Mozilla/5.0...",
  "consent_text_version": "v1.2",
  "consent_text_hash": "sha256 of consent text shown",
  "collection_point": "registration | profile_update | plus_upgrade",
  "withdrawal_timestamp": null,
  "withdrawal_reason": null
}
```

### Version History

| Version | Date | Changes |
|---------|------|----------|
| v1.0 | 2025-01-01 | Initial version |
| v1.1 | 2025-02-01 | Added TendBee Plus consent |
| v1.2 | 2025-03-01 | Clarified data sharing |

### Legal Requirements

1. **Freely Given**: No pre-checked boxes
2. **Specific**: Separate consent for each purpose
3. **Informed**: Clear explanation of data use
4. **Unambiguous**: Affirmative action required
5. **Withdrawable**: Easy to withdraw as to give

---

## Data Export Format

When user requests data export (GDPR Art. 20):

```json
{
  "export_date": "2025-01-01T12:00:00Z",
  "user": {
    "id": "uid_123",
    "email": "user@example.com",
    "created_at": "2024-06-01T10:00:00Z"
  },
  "profile": {
    "first_name": "Anna",
    "last_name": "Andersson",
    "phone": "+46701234567",
    "location": {...},
    "skills": [...],
    "experience": [...],
    "education": [...]
  },
  "consent_history": [
    {
      "type": "gdpr_processing",
      "granted": true,
      "timestamp": "2024-06-01T10:00:00Z"
    }
  ],
  "matches": [...],
  "applications": [...],
  "activity_log": [...]
}
```

---

## Deletion Process

### User-Initiated Deletion

1. User confirms deletion intent (type "DELETE MY DATA")
2. Re-authenticate user
3. Queue deletion job
4. Delete in order:
   - Active sessions
   - Match records (anonymize if needed for analytics)
   - Profile data
   - CV files
   - User account
5. Keep consent records (required for audit)
6. Send confirmation email
7. Log deletion for compliance

### Data to Retain

- Consent records (anonymized)
- Transaction/payment records (legal requirement)
- Anonymized analytics data
