# Booked, But Not Coming — Storytelling

Project estàtic de visualització per explicar cancel·lacions d'hotels utilitzant D3.js.

Prova local:

1. Obre `index.html` directament al navegador (servidor recomanat per evitar restriccions CORS amb CSV).

Serveix amb un servidor local (recomanat):

```bash
# Python 3
python3 -m http.server 8000
# obre http://localhost:8000
```

## Desplegament a GitHub Pages

### Pas 1: Crear repositori a GitHub

1. Obre https://github.com/new
2. Crea un repositori nou amb el nom `booked-but-not-coming` (o el que prefereixis)
3. Copia l'URL del repositori (ex: `https://github.com/tuusername/booked-but-not-coming.git`)

### Pas 2: Inicialitzar Git localment

```bash
cd ~/Desktop/pac3
git init
git add .
git commit -m "Initial commit: storytelling site"
git branch -M main
git remote add origin https://github.com/tuusername/booked-but-not-coming.git
git push -u origin main
```

### Pas 3: Activar GitHub Pages

1. Obre el teu repositori a GitHub
2. Vai a **Settings** → **Pages**
3. Selecciona la branca **main** i carpeta **/ (root)**
4. Fes clic a "Save"
5. GitHub crearà l'URL: `https://tuusername.github.io/booked-but-not-coming`

### Pas 4: Verifica el desplegament

- Espera 1-2 minuts perquè GitHub Pages processi el site
- Accedeix a la teva URL per veure el projecte en directe
- Si veus errors, comprova que tots els fitxers (CSV, imatges, CSS, JS) estiguin al repositori

⚠️ **Important**: Assegura't que `hotel_bookings.csv` es trobi a l'arrel del repositori perquè JavaScript el pugui carregar correctament.

Arxius clau:

- `index.html`, `style.css`, `script.js`, `hotel_bookings.csv` (dataset)

Notes:

- L'interfície i els textos estan en català.
- Les visualitzacions s'han creat amb D3 v7 i són senzilles però responsives.
