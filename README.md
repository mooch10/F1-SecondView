# DELTA — F1 Second-Screen Telemetry & Timing (PWA)

Plataforma mobile-first de telemetría y cronometraje en tiempo real para Fórmula 1. Diseñada como segunda pantalla durante las sesiones de clasificación y carrera.

---

## 🚀 Características

- **Mapa de Circuito Interactivo 2D**:
  - Trazado vectorial dinámico con orientación geográfica real.
  - Motor de circulación continua de monoplazas a 60 FPS.
  - Zonas DRS iluminadas, sectores S1/S2/S3 y línea de meta.
  - Sistema anti-solapamiento y carrusel de pilotos con ficha HUD táctil.
- **Calificación Oficial F1**:
  - Clasificación reglamentaria: Top 10 con tiempos de Q3, P11-P15 con Q2, P16-P20 con Q1.
  - Pestañas individuales `TODOS`, `Q3`, `Q2`, `Q1` con líneas de corte oficiales (eliminación en P10 y P15).
  - Tiempos de sector (S1, S2, S3) y barra de mini-sectores (récord de sesión, mejor personal, sin mejora).
- **Carrera en Tiempo Real**:
  - Clasificación en vivo con compuesto de neumáticos, vueltas de goma y paradas en boxes.
  - Indicadores de zona DRS activa, penalizaciones FIA oficiales (+5s, +10s) y puntos del campeonato mundial (+25 PTS).
- **Mobile-First & PWA**:
  - Optimizado para pantallas táctiles móviles.
  - Wake Lock API para mantener la pantalla encendida durante las carreras.
  - Selector de idioma (Español / Inglés) y modo oscuro/claro.

---

## 📦 Guía de Despliegue (Deploy)

El proyecto está separado en dos carpetas:
1. `backend/`: API Node.js ultraliviana (TypeScript, caching en memoria, rate limiting y cliente OpenF1/Jolpica).
2. `frontend/`: Aplicación cliente en React 19 + Vite + Tailwind CSS.

### 🌐 Despliegue en Koyeb (Backend) y Cloudflare Pages (Frontend)

#### Paso 1: Backend en [Koyeb.com](https://app.koyeb.com) (100% Gratis)
1. Inicia sesión en Koyeb y crea un nuevo **Service** eligiendo **GitHub**.
2. Selecciona tu repositorio: `mooch10/F1-SecondView`.
3. Configuración de despliegue:
   - **Root Directory**: `backend`
   - **Builder**: Detectará automáticamente el **Dockerfile** (o puedes seleccionar **Buildpack** con Node.js).
   - Si usas Buildpack:
     - **Build Command**: `npm run build`
     - **Run Command**: `npm start`
   - **Port**: En la sección *Ports*, asegúrate de que el puerto configurado sea **`3001`** (o mapea el puerto HTTP a 3001).
   - **Health Check**: Path: `/health`, Protocolo: HTTP.
4. Pulsa **Deploy** y copia tu URL pública (ejemplo: `https://delta-f1-tuusuario.koyeb.app`).

#### Paso 2: Frontend en [Cloudflare Pages](https://dash.cloudflare.com) (100% Gratis)
1. Inicia sesión en Cloudflare, ve a **Workers & Pages** > **Create application** > pestaña **Pages** > **Connect to Git**.
2. Selecciona el repositorio `mooch10/F1-SecondView`.
3. Configuración de compilación:
   - **Framework preset**: `Vite`
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. En **Environment variables (variables de entorno)**:
   - Variable: `VITE_API_URL`
   - Valor: La URL de tu backend en Koyeb (ej: `https://delta-f1-tuusuario.koyeb.app`).
5. Pulsa **Save and Deploy**. Cloudflare Pages compilará la app y te dará tu dominio gratis (ej: `https://delta-f1.pages.dev`).
*(Nota: El proyecto ya incluye `public/_redirects` y `public/_headers` preconfigurados para Cloudflare Pages).*

---

## 🛠️ Desarrollo Local

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```
