import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

const API_KEY = process.env.API_KEY;
const URL = 'https://fortniteapi.io/v2/shop?lang=es';

async function obtenerTienda() {
    try {
        const respuesta = await fetch(URL, {
            method: 'GET',
            headers: { 'Authorization': API_KEY }
        });

        if (!respuesta.ok) {
            throw new Error(`Error: ${respuesta.status} - ${respuesta.statusText}`);
        }

        const datos = await respuesta.json();

        // 📢 Ver la estructura de la API
        console.log("📢 Respuesta completa de la API:");
        console.log(JSON.stringify(datos, null, 2));

        // Accedemos correctamente a los artículos de la tienda
        if (datos.shop) {
            console.log('\n📢 Artículos en la tienda hoy:\n');
            datos.shop.forEach((item, index) => {
                if (item.granted && item.granted.length > 0) {
                    const articulo = item.granted[0]; // Tomamos el primer elemento dentro de "granted"

                    // 📌 Extraemos los datos correctamente
                    const nombre = articulo.name || "Nombre no disponible";
                    const precio = item.price?.finalPrice || "Precio no disponible";
                    const imagen = articulo.images?.icon || "No disponible";

                    console.log(`${index + 1}. ${nombre} - ${precio} paVos`);
                    console.log(`   🖼️ Imagen: ${imagen}`);
                } else {
                    console.log(`${index + 1}. Nombre no disponible - ${item.price?.finalPrice || "Precio no disponible"} paVos`);
                }
            });
        } else {
            console.log("⚠️ No se encontraron artículos en la tienda.");
        }

    } catch (error) {
        console.error('Hubo un error:', error.message);
    }
}

obtenerTienda();
