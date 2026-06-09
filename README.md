# ¿Quién tiene el agua?

Visualización interactiva de las concesiones de agua en México, con datos del Registro Público de Derechos de Agua (REPDA) de la CONAGUA.

**[Ver en línea →](https://tirandocodigo.mx/quien-tiene-el-agua)** 
**[Ver en línea (Ranking interactivo) →](https://maritolpixel.github.io/quien-tiene-el-agua/)** 

## ¿Qué muestra?

Cada punto en el mapa es una concesión de agua registrada ante la CONAGUA. Se pueden explorar cuatro tipos:

| Clave | Tipo                |
| ----- | ------------------- |
| `sub` | Aguas subterráneas  |
| `sup` | Aguas superficiales |
| `des` | Descargas           |
| `fed` | Zonas federales     |

Los puntos se colorean por uso (agrícola, público urbano, industrial, etc.) y su tamaño refleja el volumen o superficie concesionada.

## Funcionalidades

- **Mapa interactivo** — navegación con zoom y arrastre sobre mapa base oscuro
- **Filtro temporal** — slider para acotar por rango de fechas de concesión
- **Filtro por tipo** — activar/desactivar cada tipo de concesión
- **Filtro por uso** — seleccionar usos específicos del agua
- **Buscador de titular** — buscar concesiones por nombre del titular

## Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [deck.gl](https://deck.gl/) — capas de visualización sobre el mapa
- [MapLibre GL](https://maplibre.org/) + [react-map-gl](https://visgl.github.io/react-map-gl/) — mapa base
- [loaders.gl](https://loaders.gl/) — carga de CSVs
- [Vite](https://vitejs.dev/) — bundler

## Correr en local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

Los datos CSV deben estar en `public/datos/`. Ya están incluidos en el repo.

## Datos

Los archivos fuente son los Anexos del REPDA, publicados por la CONAGUA. Los CSVs en `public/datos/` corresponden a la versión de junio 2025.

## Licencia

[MIT](./LICENSE) © Jesús Daniel Gómez Hernández
