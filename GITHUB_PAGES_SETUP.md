# Checklist GitHub Pages

## Abans de pujar a GitHub

- [x] Tots els fitxers CSS, JS i images en l'arrel del projecte
- [x] `index.html` és l'arxiu principal a l'arrel
- [x] `hotel_bookings.csv` a l'arrel (necessari per carregar dades)
- [x] `.gitignore` creat (exclou arxius innecessaris)
- [x] `.nojekyll` creat (perquè no processi amb Jekyll)
- [x] Tots els camins de fitxers són **relatius**, no absoluts

## Setup inicial Git

```bash
cd ~/Desktop/pac3
git config --global user.name "La teva nom"
git config --global user.email "teu.email@example.com"
git init
git add .
git commit -m "Initial commit: Booked But Not Coming storytelling"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

## Configurar GitHub Pages

1. GitHub.com → Repository → **Settings**
2. Left sidebar → **Pages**
3. **Source**: Selecciona `main` branch i `/` (root folder)
4. Click **Save**
5. Espera 1-2 minuts per al desplegament

## URLs útils

- **GitHub Pages Settings**: `https://github.com/USERNAME/REPO_NAME/settings/pages`
- **Site publicat**: `https://USERNAME.github.io/REPO_NAME`

## Troubleshooting

### El site no carrega les dades (hotel_bookings.csv)

- Verifica que `hotel_bookings.csv` estigui a l'arrel del repositori
- Comprova que no hi hagi errors de CORS a la consola del navegador

### Els estilos no es carreguen

- Assegura't que `style.css` està a l'arrel
- Obrir la consola (F12) i veure si hi ha errors 404

### Els scripts no funcionen

- Comprova que `script.js` està a l'arrel
- Verifica que D3.js es carregui correctament des de CDN
- Abre la consola (F12) i busca missatges d'error

## Actualitzar el site després de fer canvis

```bash
cd ~/Desktop/pac3
git add .
git commit -m "Actualització: descripció del canvi"
git push origin main
```

GitHub Pages es actualitzarà automàticament en pocs minuts.
