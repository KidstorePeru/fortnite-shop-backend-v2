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
        console.log("🔄 Obteniendo datos de la API...");

        const response = await fetch(URL, {
            headers: { Authorization: API_KEY },
        });

        if (!response.ok) {
            console.error(`❌ Error en la API: ${response.status} ${response.statusText}`);
            return res.status(response.status).json({ error: "Error al obtener la tienda de Fortnite." });
        }

        const data = await response.json();

        // Mostrar la API recibida en la consola para depuración
        console.log("✅ Datos recibidos de la API:");
        console.dir(data, { depth: null });

        // Validar que `data.shop` tenga datos y sea un array
        if (!data.shop || !Array.isArray(data.shop) || data.shop.length === 0) {
            console.warn("⚠️ No se encontraron artículos en la tienda.");
            return res.status(500).json({ error: "No se encontraron artículos en la tienda." });
        }

        // Organizar los artículos en secciones
        const secciones = {};

        data.shop.forEach((item) => {
            // Validar que el artículo tenga la estructura esperada
            if (!item || !item.granted || item.granted.length === 0) {
                console.warn("⚠️ Se ignoró un artículo porque tiene datos incompletos:", item);
                return; // Continuar con el siguiente item
            }

            const sectionName = item.section?.name || "Otros";
            const isBundle = item.displayType === "bundle" || (item.granted.length > 1 && item.displayName);
            const name = isBundle
                ? item.displayName || `Lote de ${item.granted[0]?.name}`
                : item.granted[0]?.name || "Nombre no disponible";
            const image = item.displayAssets?.[0]?.url || item.granted[0]?.images?.icon || "";
            const pricePaVos = item.price?.finalPrice || "N/A";
            const priceSoles = pricePaVos !== "N/A" ? `S/${convertirPaVosASoles(pricePaVos)}` : "N/A";

            if (!secciones[sectionName]) {
                secciones[sectionName] = { bundles: [], items: [] };
            }

            const itemObject = { name, image, pricePaVos, priceSoles, isBundle };
            const section = secciones[sectionName];

            // Evitar duplicados comparando nombres
            const itemExists = section.bundles.some((obj) => obj.name === name) || section.items.some((obj) => obj.name === name);
            if (!itemExists) {
                if (isBundle) {
                    section.bundles.push(itemObject);
                } else {
                    section.items.push(itemObject);
                }
            }
        });

        // Convertir el objeto en un array de secciones ordenadas con los lotes primero
        const tiendaOrdenada = Object.entries(secciones).map(([sectionName, { bundles, items }]) => ({
            sectionName,
            items: [...bundles, ...items],
            bundlesOnly: bundles
        }));

        console.log("🛒 Tienda generada correctamente.");
        res.json(tiendaOrdenada);
    } catch (error) {
        console.error("❌ Error en el servidor:", error);
        res.status(500).json({ error: "Error al obtener la tienda." });
    }
});

app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
