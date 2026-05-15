# Reserves que no arriben

## Anàlisi visual de cancel·lacions de reserves hoteleres

Un projecte de visualització de dades estàtic que analitza patrons de cancel·lació en el sector hoteler mitjançant una narrativa visual interactiva en català.

---

## Descripció

Aquest projecte analitza **4 insights clau** sobre les cancel·lacions de reserves:

1. **Taxa general de cancel·lació** — Proporció de reserves que no es varen completar
2. **Cancel·lacions per tipus d'hotel** — Quin és més afectat per cancel·lacions
3. **Cancel·lacions segons temps de reserva** — Com varia la taxa segons quan es va reservar
4. **Cancel·lacions per tipus de client** — Primera vegada vs. clients repetidors

---

## Com visualitzar el projecte

### Opció 1: En línia (recomanat)

Accedeix directament a través de GitHub Pages:

```
https://nilmd.github.io/pac3_visualitzacio_dades_hotels
```

### Opció 2: Localment

```bash
cd *localització del projecte*
python3 -m http.server 8000
# Obrir http://localhost:8000 al navegador
```

---

## Estructura

- **index.html** — Estructura i contingut (en català)
- **style.css** — Disseny visual (paleta blava, tipografia editorial)
- **script.js** — Visualitzacions interactives amb D3.js
- **hotel_bookings.csv** — Dataset amb ~119k reserves

---

## Característiques

✅ **Responsiu** — Funciona en desktop, tablet i mòbil  
✅ **Interactiu** — Tooltips als gràfics + navegació per teclat (fletxes ←→)  
✅ **Dades reals** — Basat en dataset de Kaggle sobre reserves hoteleres  
✅ **Editorial** — Inspirat en storytelling visual modern (Spotify Fan Study style)

---

## Tecnologies

- HTML5 + CSS3
- D3.js (visualització de dades)
- JavaScript

---

## Notes

- El lloc es carrega completament des del navegador (sense backend)
- Tots els textos i explicacions estan en **català**
- El dataset es carrega dinàmicament des de `hotel_bookings.csv`
- Les visualitzacions són responsives i s'adapten a la mida de pantalla
