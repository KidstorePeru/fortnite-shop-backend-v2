import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const API_KEY = process.env.API_KEY;
const URL = "https://fortniteapi.io/v2/shop?lang=es";

// Función para convertir paVos a Soles
const convertirPaVosASoles = (pavos) => (pavos / 100 * 1.50).toFixed(2);

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));

app.get("/api/shop", async (req, res) => {
    try {
        const response = await fetch(URL, {
            headers: { Authorization: API_KEY },
        });

        const data = await response.json();

        if (!data.shop) {
            return res.status(500).json({ error: "No se encontraron artículos" });
        }

        // Crear un objeto para organizar los artículos por sección y eliminar duplicados
        const secciones = {};

        data.shop.forEach((item) => {
            const sectionName = item.section?.name || "Otros";
            const isBundle = item.displayType === "bundle" || (item.granted.length > 1 && item.displayName); // Asegurar que es un lote real
            const name = isBundle ? item.displayName || `Lote de ${item.granted[0]?.name}` : item.granted[0]?.name || "Nombre no disponible";
            const image = item.displayAssets?.[0]?.url || item.granted[0]?.images?.icon || "";
            const pricePaVos = item.price.finalPrice || "N/A";
            const priceSoles = pricePaVos !== "N/A" ? `S/${convertirPaVosASoles(pricePaVos)}` : "N/A";

            // Si la sección no existe, la creamos como un array
            if (!secciones[sectionName]) {
                secciones[sectionName] = { bundles: [], items: [] };
            }

            // Evitamos duplicados comparando nombres
            const itemObject = { name, image, pricePaVos, priceSoles, isBundle };
            const section = secciones[sectionName];

            if (!section.bundles.some((obj) => obj.name === name) && !section.items.some((obj) => obj.name === name)) {
                if (isBundle) {
                    section.bundles.push(itemObject); // Guardamos los lotes primero
                } else {
                    section.items.push(itemObject); // Guardamos los objetos normales
                }
            }
        });

        // Convertir el objeto en un array de secciones ordenadas con los lotes primero
        const tiendaOrdenada = Object.entries(secciones).map(([sectionName, { bundles, items }]) => ({
            sectionName,
            items: [...bundles, ...items], // Lotes primero, luego los demás artículos
            bundlesOnly: bundles // Solo lotes para la primera fila
        }));

        res.json(tiendaOrdenada);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la tienda" });
    }
});

app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
