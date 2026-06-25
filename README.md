# Edytor Stron — modułowy builder

Edytor wizualny do budowania stron internetowych z **gotowych modułów** przechowywanych w bazie danych SQLite.

## Funkcje

- **12 modułów w bazie danych** — nagłówek, hero, tekst, cechy, galeria, kontakt, stopka, CTA, FAQ, opinie, cennik, statystyki
- **Szablony projektów** — landing page, strona firmowa, portfolio, SaaS
- **Edytor wizualny** — dodawanie, duplikowanie, przeciąganie, pełna konfiguracja (w tym listy)
- **Wielostronicowość** — wiele stron w jednym projekcie
- **Autosave** — automatyczny zapis co 8 sekund
- **Podgląd responsywny** — desktop / tablet / mobile w edytorze
- **Eksport** — JSON lub gotowy HTML

## Uruchomienie

```bash
# Instalacja zależności
npm run install:all
npm install

# Uruchomienie (backend + frontend)
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

## Struktura

```
edytor react/
├── backend/          # Express + SQLite API
│   └── src/
│       ├── db/       # Schemat bazy i seed modułów
│       └── routes/   # REST API
├── frontend/         # React + Vite
│   └── src/
│       ├── components/editor/  # Paleta, canvas, konfiguracja
│       ├── modules/            # Komponenty modułów strony
│       └── pages/              # Projekty, edytor, podgląd
└── backend/data/     # Plik bazy SQLite (tworzony automatycznie)
```

## API

| Endpoint                                      | Opis                           |
| --------------------------------------------- | ------------------------------ |
| `GET /api/modules`                            | Lista dostępnych modułów       |
| `GET /api/projects`                           | Lista projektów                |
| `POST /api/projects`                          | Nowy projekt                   |
| `GET /api/projects/:id`                       | Projekt ze stronami i modułami |
| `PUT /api/projects/:id/pages/:pageId/modules` | Zapis modułów strony           |
| `GET /api/projects/:id/build`                 | Zbudowany projekt (JSON)       |

## Jak używać

1. Otwórz http://localhost:5173
2. Kliknij **Nowy projekt**
3. W edytorze dodawaj moduły z lewego panelu
4. Konfiguruj wybrany moduł w prawym panelu
5. Zapisz i użyj **Podgląd** lub **Zbuduj** do eksportu

---

## GitHub — wrzucenie projektu

> **Ważne:** repozytorium musi być w folderze projektu (`edytor react`), nie w całym katalogu użytkownika Windows.

### 1. Nowe repozytorium na GitHub

1. Wejdź na [github.com/new](https://github.com/new)
2. Nazwa np. `edytor-stron`
3. **Public** lub **Private**
4. **Nie** zaznaczaj README (masz już lokalnie)
5. Utwórz repozytorium i skopiuj URL, np. `https://github.com/TWOJ-USER/edytor-stron.git`

### 2. Pierwszy push z komputera

W PowerShell:

```powershell
cd "C:\Users\Skoki\Desktop\edytor react"

git init
git add .
git commit -m "Edytor stron — modułowy builder React + SQLite"
git branch -M main
git remote add origin https://github.com/TWOJ-USER/edytor-stron.git
git push -u origin main
```

Jeśli `git init` mówi, że repo już istnieje w złym miejscu (np. folder użytkownika), użyj tylko tego folderu projektu z własnym `.git`.

---

## Uruchomienie online (Render)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/s-pro-v/edytor-stron)

**GitHub Pages** hostuje tylko statyczne pliki — **nie uruchomi** backendu (API + SQLite).  
Pełna aplikacja wymaga serwera Node.js.

Najprościej: **Render** (darmowy plan) + repozytorium GitHub.

### Render — krok po kroku

1. Kliknij przycisk **Deploy to Render** powyżej (albo [render.com](https://render.com) → logowanie przez GitHub)
2. **New → Blueprint**
3. Połącz repozytorium [s-pro-v/edytor-stron](https://github.com/s-pro-v/edytor-stron)
4. Render wykryje plik `render.yaml` — kliknij **Apply** / **Deploy Blueprint**
5. Po deployu (ok. 3–5 min) dostaniesz URL, np. `https://edytor-stron.onrender.com`

Backend serwuje wtedy **frontend + API** z jednej domeny — edytor działa od razu.

> **Uwaga (plan free):** baza SQLite resetuje się przy każdym redeployu. Moduły seedują się automatycznie; własne projekty mogą zniknąć po aktualizacji.

### Produkcja lokalnie (test przed deployem)

```bash
npm run install:all
npm install
npm run build
npm start
```

Aplikacja: http://localhost:3001 (frontend i API razem)

---

## GitHub Pages (tylko frontend — ograniczone)

Jeśli koniecznie chcesz Pages, frontend musi wiedzieć, gdzie jest API:

1. Wdróż backend na Render (jak wyżej) — np. `https://edytor-stron.onrender.com`
2. W GitHub → **Settings → Pages → GitHub Actions** albo workflow ręcznie
3. Przy buildzie frontendu ustaw:
   - `VITE_API_URL=https://edytor-stron.onrender.com/api`
   - `VITE_BASE_PATH=/edytor-stron/` (jeśli repo nie jest w root Pages)

To wymaga osobnego workflow CI — **prostsze jest użycie samego Render** bez Pages.

---

## Zmienne środowiskowe

| Zmienna               | Gdzie           | Opis                                                   |
| --------------------- | --------------- | ------------------------------------------------------ |
| `NODE_ENV=production` | Render / start  | Włącza serwowanie frontendu z backendu                 |
| `PORT`                | Render (auto)   | Port serwera                                           |
| `VITE_API_URL`        | build frontendu | URL API, gdy frontend i backend są na różnych domenach |
| `VITE_BASE_PATH`      | build frontendu | Ścieżka bazowa, np. `/edytor-stron/` dla GitHub Pages  |
| `FRONTEND_URL`        | backend         | Dozwolony origin CORS (opcjonalnie)                    |

---

## Osadzenie (iframe)

Wyeksportowane strony (ZIP HTML) możesz hostować gdziekolwiek (GitHub Pages, Netlify, własny serwer).

Sam **edytor** osadzaj w iframe tylko z tej samej domeny lub ustaw CORS i `X-Frame-Options` — domyślnie lepiej linkować do pełnej aplikacji niż iframe.

