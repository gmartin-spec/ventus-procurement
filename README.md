# Ventus Procurement Hub

Sistema de gestión logística de compras para Ventus Ingeniería.  
Seguimiento de OC, documentos comex, control de costos FOB→CIF→DDP, y KPIs por proyecto.

---

## Arquitectura

```
ventus-procurement/
├── src/                    # Frontend React (Vite)
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Entry point
│   ├── index.css           # Estilos globales
│   ├── hooks/
│   │   └── useGoogleSheets.js   # Hook de sincronización
│   └── services/
│       └── googleSheets.js      # Cliente API para Sheets
├── api/                    # Backend serverless (Vercel)
│   └── sheets/
│       └── [...path].js    # API Google Sheets
├── vercel.json             # Config de deploy
├── .env.example            # Variables de entorno
└── package.json
```

---

## Setup Paso a Paso

### 1. Clonar y configurar el repo

```bash
# Clonar
git clone https://github.com/gmartin-spec/ventus-procurement.git
cd ventus-procurement

# Instalar dependencias
npm install
```

### 2. Configurar Google Sheets

#### 2a. Crear el Google Sheet

Crear un Google Sheet nuevo con estas hojas (tabs):

**Hoja "OC"** — con estos headers en la fila 1:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| po_id | project_id | project_name | description | supplier | category | qty | unit | unit_price | currency | incoterm | status | priority |

| N | O | P | Q | R | S | T | U | V | W | X | Y | Z |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fob | freight | insurance | cif | duties | ddp | date_created | date_etd | date_eta | date_delivered | docs_required | docs_received | notes |

#### 2b. Crear la Service Account en Google Cloud

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear proyecto nuevo → "Ventus Procurement"
3. Ir a **APIs & Services → Library**
4. Buscar **"Google Sheets API"** → **Habilitar**
5. Ir a **APIs & Services → Credentials**
6. Click **"Create Credentials" → "Service Account"**
7. Nombre: `ventus-sheets` → Crear
8. Click en la Service Account creada
9. Ir a tab **"Keys"** → **"Add Key" → "Create new key"** → JSON → Descargar

#### 2c. Compartir el Sheet

1. Abrir el JSON descargado
2. Copiar el campo `client_email` (algo como `ventus-sheets@ventus-procurement.iam.gserviceaccount.com`)
3. En el Google Sheet → Click **"Compartir"** → Pegar ese email → Rol: **Editor**

### 3. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Editar `.env`:

```env
# El ID está en la URL del Sheet:
# https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
GOOGLE_SHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz

# Pegar TODO el contenido del JSON de la Service Account, en una sola línea
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"ventus-procurement",...}
```

### 4. Desarrollo Local

```bash
# Arrancar el frontend
npm run dev

# La app corre en http://localhost:5173
# Si la API no está configurada, corre en modo demo con datos de ejemplo
```

### 5. Deploy en Vercel

#### Primera vez:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Seguir las instrucciones (seleccionar proyecto, etc.)
```

#### Configurar variables de entorno en Vercel:

```bash
# O desde el dashboard de Vercel → Settings → Environment Variables
vercel env add GOOGLE_SHEET_ID
vercel env add GOOGLE_SERVICE_ACCOUNT_KEY
```

#### Deploy a producción:

```bash
vercel --prod
```

La app va a estar disponible en `https://ventus-procurement.vercel.app` (o el dominio que elijas).

#### Deploys siguientes:

```bash
git add .
git commit -m "update"
git push origin main
# Vercel hace deploy automático en cada push
```

---

## Uso

### Roles

- **Compras**: Vista completa, crear OC, gestión documental, control de costos
- **Proyecto**: Vista de status y timeline, KPIs por proyecto
- **Comex**: Documentos, tracking de embarques, aduana

### Flujo de una OC

```
Borrador → Aprobada → Ordenada → En Producción → Embarcada → En Tránsito → En Aduana → Entregada → Cerrada
```

Cada cambio de estado se sincroniza con Google Sheets.

### Documentos Trackeados

- Bill of Lading (BL)
- Packing List
- Commercial Invoice (CI)
- Certificate of Origin (CO)
- Insurance Certificate
- Inspection Report
- Customs Declaration

### KPIs

- Lead Time Promedio (creación → llegada)
- On-Time Delivery Rate
- Completitud Documental
- Overhead FOB → DDP
- Performance por Proveedor
- Valor por Proyecto

---

## Google Sheet — Estructura Completa

Para que la sincronización funcione, el Sheet debe respetar la estructura de columnas documentada arriba. La app lee y escribe en la hoja "OC".

Si querés agregar hojas adicionales (ej: "Documentos", "Costos detalle"), la app puede extenderse para leerlas.

---

## Stack

- **Frontend**: React 18 + Vite
- **Backend**: Vercel Serverless Functions (Node.js)
- **Data**: Google Sheets API v4
- **Hosting**: Vercel (free tier)
- **Fuentes**: IBM Plex Sans + JetBrains Mono
