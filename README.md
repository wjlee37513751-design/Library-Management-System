# Bibliotekstyringssystem API

Dette prosjektet er et RESTful API for et bibliotekstyringssystem, bygget med Node.js og MySQL. Løsningen er designet for å møte kravene til Høy vurdering ved å implementere Repository Pattern, JWT-autentisering, og rollebasert tilgangskontroll.

## Teknologier

- **Runtime**: Node.js
- **Rammeverk**: Express.js
- **Database**: MySQL (mysql2/promise)
- **Autentisering**: JSON Web Token (JWT)
- **Sikkerhet**: Bcrypt for passord-hashing

## Arkitektur (Repository Pattern)

Prosjektet følger en lagdelt arkitektur for å sikre lav kobling mellom API-et og databasen:

- **Server/Routes**: Håndterer HTTP-forespørsler og ruting
- **Controllers**: Håndterer forretningslogikk og validering
- **Repositories**: Utfører SQL-spørringer og sikrer dataintegritet
- **Middleware**: Verifiserer JWT-tokens og sjekker administrative rettigheter (`verifyToken`, `requireAdmin`)

## Sikkerhetsfunksjoner

- **Passord-hashing**: Alle passord blir hashet med bcrypt før lagring i databasen
- **Rollebasert tilgangskontroll (RBAC)**:
  - **Public**: Registrering, innlogging, og visning av bøker
  - **Admin**: Full tilgang til brukeradministrasjon og modifisering av bokdata
- **Referansiell integritet**: Ved sletting av bøker eller brukere, blir relaterte data i tabeller som `loan`, `review` og `book_has_category` slettet først for å unngå Foreign Key-feil

## Prosjektstruktur

```
Fullstack-Library-App/
├── README.md
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── v1/
│       │   ├── controllers/
│       │   │   ├── authController.js
│       │   │   └── bookController.js
│       │   ├── data/
│       │   │   └── db.js
│       │   ├── middleware/
│       │   │   └── authMiddleware.js
│       │   ├── repositories/
│       │   │   ├── bookRepository.js
│       │   │   └── userRepository.js
│       │   └── routes/
│       │       ├── authRoutes.js
│       │       └── bookRoutes.js
└── frontend/
```

### Mappebeskrivelse

- **backend/src/server.js**: Hovedserverfil som initialiserer Express-appen
- **backend/src/v1/controllers/**: Håndterer forretningslogikk for autentisering og bokadministrasjon
- **backend/src/v1/data/db.js**: Databasekonfigurasjon og tilkobling
- **backend/src/v1/middleware/**: Autentiserings- og autorisasjonsmiddleware
- **backend/src/v1/repositories/**: Database-abstraksjonslagfor brukere og bøker
- **backend/src/v1/routes/**: API-rutedefinisjon
- **frontend/**: Frontendapplikasjonen (under utvikling)

## Installasjon og Kjøring


### 1. Miljøvariabler (.env)

En `.env.example`-fil er inkludert i backend-mappen. Kopier denne til `.env` og **oppdater verdiene etter dine MySQL-innstillinger**:

```bash
# I backend-mappen
cp .env.example .env
```

Rediger deretter `.env`-filen med dine MySQL-legitimasjonskoder:

```env
DB_HOST=localhost           # MySQL-server host
DB_USER=root                # MySQL-brukernavn
DB_PASS=your_mysql_password # ENDRE denne til ditt MySQL-passord
DB_NAME=library_db          # Databasenavn (opprett denne i MySQL)
JWT_SECRET=your_secret_key  # Generer en sikker hemmelig nøkkel
PORT=3000                   # API-port
```



### 2. Kjøring av server

Viktig: For at `.env`-filen skal bli lest riktig, må serveren startes fra backend-mappen:

```bash
# Stå i mappen 'backend'
npm install
node src/server.js
```

## API Endepunkter

### User Endpoints

| Metode | Endepunkt     | Tilgang | Beskrivelse                          |
|--------|---------------|---------|--------------------------------------|
| POST   | `/register`   | Alle    | Registrer ny bruker (standard rolle: 'user') |
| POST   | `/login`      | Alle    | Logger inn og mottar JWT-token       |
| GET    | `/users`      | Admin   | Henter liste over alle brukere       |
| PUT    | `/users/:id`  | Admin   | Oppdaterer brukerinformasjon eller rolle |
| DELETE | `/users/:id`  | Admin   | Sletter bruker og tilhørende lån     |

### Book Endpoints

| Metode | Endepunkt     | Tilgang | Beskrivelse                          |
|--------|---------------|---------|--------------------------------------|
| GET    | `/books`      | Alle    | Viser alle bøker i systemet          |
| POST   | `/books`      | Admin   | Legger til en ny bok                 |
| PUT    | `/books/:id`  | Admin   | Oppdaterer bokdetaljer               |
| DELETE | `/books/:id`  | Admin   | Sletter bok (håndterer foreign keys automatisk) |

## Bruk av API

### Autentisering

For admin-endepunkter, inkluder JWT-token i `Authorization`-headeren:

```
Authorization: Bearer <your-jwt-token>
```

### Eksempel på forespørsel

**Registrering:**
```json
POST /register
{
  "name": "brukernavn",
  "password": "passord123",
  "email": "bruker@example.com",
  "phoneNumber": "12345678",
  "zipCode": 12345
}


Registrering (Admin):
For å teste admin-funksjoner, legg til "role": "admin" i forespørselen:
POST /register
{
  "name": "admin_user",
  "password": "password123",
  "email": "admin@example.com",
  "phoneNumber": "12345678",
  "zipCode": 12345,
  "role": "admin"
}

```

**Innlogging:**
```json
POST /login
{
  "name": "brukernavn",
  "password": "passord123"
}
```

**Bok opprettelse (Admin):**
```json
POST /books
Authorization: Bearer <admin-token>
{
  "title": "Boktittel",
  "authorID": 1,
  "releaseYear": 2023
}
```

