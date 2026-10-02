# Tanz Atelier Erding – Markenmaterial

Quelle: Brandbook vom 21.09.2026 und finale Logodateien, von Thomas bereitgestellt.
Diese Dateien liegen bewusst **außerhalb von `public/`** – sie werden nicht auf die
Website hochgeladen (`wrangler deploy` lädt nur `public/`).

## Farben

### Hauptfarben

| Name     | Hex       | RGB           |
|----------|-----------|---------------|
| Samtgrün | `#003025` | 0, 48, 37     |
| Off-White| `#f5f4f0` | 245, 245, 240 |

### Hauptkategorie (Tanzschule allgemein)

| Name        | Hex       | RGB            |
|-------------|-----------|----------------|
| Dunkelgrün  | `#00241e` | 0, 36, 30      |
| Samtgrün    | `#003025` | 0, 48, 37      |
| Mittelgrün  | `#1e4f41` | 30, 79, 65     |
| Grasgrün    | `#55896e` | 85, 137, 110   |
| Salbeigrün  | `#7db496` | 125, 180, 150  |
| Off-White   | `#f5f4f0` | 245, 245, 240  |

### Unterkategorien (Auszeichnungsfarben)

| Name   | Hex       | RGB            |
|--------|-----------|----------------|
| Gelb   | `#f4de89` | 242, 222, 137  |
| Orange | `#f56f46` | 245, 111, 70   |
| Lilac  | `#e4b1ff` | 228, 177, 255  |

Regeln aus dem Brandbook:
- Minimalistisch und monochrom; die Grünabstufungen dürfen mit den Hauptfarben kombiniert werden.
- Von den Auszeichnungsfarben darf **immer nur eine** gleichzeitig mit den Hauptfarben auftreten.
- Monogramm und Wortmarke als Kombination **nur linksbündig** verwenden.
- Die Wortmarke wird als Rahmen gedacht, durch den man blickt (TANZ oben, ATELIER unten).

## Schriften

- **New Atlas** (medium & semibold) – Wortmarke und Hervorhebungen
- **Montserrat** (Google Font) – Fließtext, Bold für Auszeichnungen

## Dateien

- `TanzAtelier_Brandbook_21_09_26.pdf` – Brandbook, 6 Seiten
- `logos/TA_Logos_final_offwhite.svg` – Wortmarke als Vektor (Offwhite)
- `logos/TA_Logos_final_*.png` – Wortmarke und Monogramm, je Offwhite und Samtgrün,
  Monogramm auch mit Rahmen

## Daraus erzeugt

`public/img/tanz-atelier-erding.svg` – Kartenbild für den Abschnitt „Unternehmungen“:
Samtgrün, Rautenmuster aus dem Brandbook, Wortmarke in Offwhite im oberen Drittel.
Neu bauen: Wortmarke aus `logos/TA_Logos_final_offwhite.svg` übernehmen, Farben wie oben.
