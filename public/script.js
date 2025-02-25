document.addEventListener("DOMContentLoaded", async () => {
    const shopContainer = document.getElementById("shop-container");

    try {
        const response = await fetch("/api/shop");
        const shopData = await response.json();

        if (!shopData || Object.keys(shopData).length === 0) {
            shopContainer.innerHTML = "<p>No hay productos disponibles en la tienda.</p>";
            return;
        }

        // 📌 Se obtiene la lista dinámica de todas las secciones de la API
        const sectionOrder = shopData.map(section => section.sectionName);

        sectionOrder.forEach(sectionName => {
            const sectionData = shopData.find(section => section.sectionName === sectionName);
            if (!sectionData) return;

            const sectionDiv = document.createElement("div");
            sectionDiv.classList.add("section");
            sectionDiv.innerHTML = `<h2>${sectionName}</h2>`;

            const itemsContainer = document.createElement("div");
            itemsContainer.classList.add("items-container");

            // Separar lotes y objetos normales
            const lotes = sectionData.items.filter(item => item.name.startsWith("Lote"));
            const regularItems = sectionData.items.filter(item => !item.name.startsWith("Lote"));

            // Mostrar los lotes primero (imagen más grande)
            lotes.forEach(item => {
                const loteDiv = document.createElement("div");
                loteDiv.classList.add("lote-item");
                loteDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>${item.pricePaVos} paVos - ${item.priceSoles} Soles</p>
                    <div class="buttons">
                        <a href="https://wa.me/51917932301?text=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${item.name}, vale ${item.pricePaVos} pavos y su precio es de ${item.priceSoles}.`)}" class="btn whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                        <a href="https://www.facebook.com/messages/t/564582056931570?message=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${item.name}, vale ${item.pricePaVos} pavos y su precio es de ${item.priceSoles}.`)}" class="btn messenger" target="_blank" rel="noopener noreferrer">Messenger</a>
                        <a href="https://www.instagram.com/direct/t/107896800607394?text=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${item.name}, vale ${item.pricePaVos} pavos y su precio es de ${item.priceSoles}.`)}" class="btn instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
                        <a href="https://discord.gg/kidstore" class="btn discord" target="_blank" rel="noopener noreferrer">Discord</a>
                    </div>
                `;
                itemsContainer.appendChild(loteDiv);
            });

            // 📌 "Pistas de improvisación" con 3 filas visibles (12 objetos)
            if (sectionName === "Pistas de improvisación") {
                const maxVisibleItems = 12;
                const hiddenItems = [];

                const pistasContainer = document.createElement("div");
                pistasContainer.classList.add("regular-items-container");

                regularItems.forEach((item, index) => {
                    const itemDiv = document.createElement("div");
                    itemDiv.classList.add("item", "pistas-item");

                    if (index >= maxVisibleItems) {
                        itemDiv.classList.add("hidden");
                        hiddenItems.push(itemDiv);
                    }

                    itemDiv.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <h3>${item.name}</h3>
                        <p>${item.pricePaVos} paVos - ${item.priceSoles} Soles</p>
                        <div class="buttons">
                            <a href="https://wa.me/51917932301?text=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${item.name}, vale ${item.pricePaVos} pavos y su precio es de ${item.priceSoles}.`)}" class="btn whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                            <a href="https://www.facebook.com/messages/t/564582056931570?message=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${item.name}, vale ${item.pricePaVos} pavos y su precio es de ${item.priceSoles}.`)}" class="btn messenger" target="_blank" rel="noopener noreferrer">Messenger</a>
                            <a href="https://www.instagram.com/direct/t/107896800607394?text=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${item.name}, vale ${item.pricePaVos} pavos y su precio es de ${item.priceSoles}.`)}" class="btn instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
                            <a href="https://discord.gg/kidstore" class="btn discord" target="_blank" rel="noopener noreferrer">Discord</a>
                        </div>
                    `;

                    pistasContainer.appendChild(itemDiv);
                });

                itemsContainer.appendChild(pistasContainer);

                if (hiddenItems.length > 0) {
                    const showMoreBtn = document.createElement("button");
                    showMoreBtn.textContent = "VER TODO";
                    showMoreBtn.classList.add("ver-todo-btn");

                    showMoreBtn.addEventListener("click", () => {
                        hiddenItems.forEach(item => item.classList.remove("hidden"));
                        showMoreBtn.style.display = "none";
                    });

                    itemsContainer.appendChild(showMoreBtn);
                }
            } else {
                const regularItemsContainer = document.createElement("div");
                regularItemsContainer.classList.add("regular-items-container");

                regularItems.forEach(item => {
                    const itemDiv = document.createElement("div");
                    itemDiv.classList.add("item");
                    itemDiv.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <h3>${item.name}</h3>
                        <p>${item.pricePaVos} paVos - ${item.priceSoles} Soles</p>
                        <div class="buttons">
                            <a href="https://wa.me/51917932301?text=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${item.name}, vale ${item.pricePaVos} pavos y su precio es de ${item.priceSoles}.`)}" class="btn whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                            <a href="https://www.facebook.com/messages/t/564582056931570?message=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${item.name}, vale ${item.pricePaVos} pavos y su precio es de ${item.priceSoles}.`)}" class="btn messenger" target="_blank" rel="noopener noreferrer">Messenger</a>
                            <a href="https://www.instagram.com/direct/t/107896800607394?text=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${item.name}, vale ${item.pricePaVos} pavos y su precio es de ${item.priceSoles}.`)}" class="btn instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
                            <a href="https://discord.gg/kidstore" class="btn discord" target="_blank" rel="noopener noreferrer">Discord</a>
                        </div>
                    `;
                    regularItemsContainer.appendChild(itemDiv);
                });

                itemsContainer.appendChild(regularItemsContainer);
            }

            sectionDiv.appendChild(itemsContainer);
            shopContainer.appendChild(sectionDiv);
        });
        
    } catch (error) {
        shopContainer.innerHTML = "<p>Error al cargar la tienda.</p>";
        console.error("Error fetching shop data:", error);
    }
});

// 🔄 **Función para actualizar la tienda automáticamente**
async function fetchAndUpdateShop() {
    try {
        const response = await fetch("/api/shop");
        const shopData = await response.json();

        console.log("🔄 Tienda actualizada automáticamente:", shopData);

        if (!shopData || shopData.length === 0) return;

        renderShop(shopData);
    } catch (error) {
        console.error("❌ Error al actualizar la tienda:", error);
    }
}

// ⏳ **Actualizar la tienda cada 10 minutos automáticamente**
setInterval(fetchAndUpdateShop, 600000);

// 📌 **Agregar botones de compra a los Pases**
document.querySelectorAll(".pase-item").forEach(pase => {
    const paseName = pase.querySelector("p").textContent;
    const priceData = {
        "Club Fortnite": { price: "", oldPrice: "" },
        "Pase de Batalla": { price: "", pavos: "" },
        "Pase de Orígenes": { price: "", pavos: "" },
        "Pase de LEGO": { price: "", pavos: "" },
        "Pase Musical": { price: "", pavos: "" }
    };

    if (priceData[paseName]) {
        const { price, pavos, oldPrice } = priceData[paseName];
        let priceHTML = `<p>${pavos ? `${pavos} - ` : ""}<span class="old-price">${oldPrice || ""}</span> ${price}</p>`;

        pase.innerHTML += `
            ${priceHTML}
            <div class="buttons">
                <a href="https://wa.me/51917932301?text=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${paseName}, cuesta ${price}.`)}" class="btn whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                <a href="https://www.facebook.com/messages/t/564582056931570?message=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${paseName}, cuesta ${price}.`)}" class="btn messenger" target="_blank" rel="noopener noreferrer">Messenger</a>
                <a href="https://www.instagram.com/direct/t/107896800607394?text=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${paseName}, cuesta ${price}.`)}" class="btn instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://discord.gg/kidstore" class="btn discord" target="_blank" rel="noopener noreferrer">Discord</a>
            </div>
        `;
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 🛍️ Obtener la tienda desde la API
        const response = await fetch("/api/shop");
        const shopData = await response.json();

        if (!shopData || shopData.length === 0) return;

// 🎨 Mapa de colores para cada categoría (se asignará automáticamente)
const coloresCategorias = {};
const coloresPredefinidos = [
    "#8B0000", // Rojo oscuro
    "#1B4F72", // Azul profundo
    "#D4AF37", // Amarillo dorado (Oro)
    "#004225", // Verde oscuro
    "#C76A10", // Naranja oscuro
    "#4B0082", // Morado índigo
    "#6D1B7B", // Rosa oscuro
    "#5D4037", // Marrón café oscuro
    "#121212", // Negro absoluto
    "#2C2F33", // Gris oscuro
    "#008B8B", // Cian oscuro
    "#8B008B", // Magenta profundo
    "#556B2F", // Lima oliva oscuro
    "#006D5B", // Turquesa profundo
    "#51425F", // Lavanda oscuro
    "#B76E79", // Salmón oscuro
    "#C4A484", // Beige tostado
    "#D4AF37", // Oro metálico
    "#AFAFAF", // Plata oscura
    "#8C7853", // Bronce oscuro
    "#960018", // Carmesí oscuro
    "#3F2A56", // Índigo oscuro
    "#551A8B", // Violeta oscuro
    "#3D9970", // Oliva profundo
    "#9B3B2E", // Coral oscuro
    "#B8860B", // Mostaza quemado
    "#5B2333", // Borgoña oscuro
    "#5F9EA0", // Aguamarina oscura
    "#006400", // Esmeralda oscura
    "#9B111E", // Rubí oscuro
    "#0C2340", // Zafiro oscuro
    "#B76E00", // Ámbar oscuro
    "#884C2F", // Terracota oscuro
    "#C7B299", // Perla apagado
    "#ECE5B6", // Marfil tostado
    "#8A865D", // Caqui oscuro
    "#A2006D", // Fucsia profundo
    "#960018", // Carmín oscuro
    "#8B5A2B",  // Ocre marrón
];

        let coloresUsados = new Set();

        // Función para obtener un color único que garantice visibilidad
        function obtenerColorUnico() {
            for (let color of coloresPredefinidos) {
                if (!coloresUsados.has(color)) {
                    coloresUsados.add(color);
                    return color;
                }
            }
            return generarColorSeguro(); // Si se acaban los predefinidos, generar un color seguro
        }

        // Aplicar colores de fondo a cada categoría
        shopData.forEach((section) => {
            let sectionName = section.sectionName.trim();
            let sectionDiv = [...document.querySelectorAll(".section")].find(sec => sec.querySelector("h2")?.textContent.trim() === sectionName);

            if (!sectionDiv) return; // Si no se encuentra la sección en el DOM, omitir
            if (sectionName.toLowerCase() === "pases") return; // Excluir la categoría "Pases"

            // Asignar un color único a cada categoría
            if (!coloresCategorias[sectionName]) {
                coloresCategorias[sectionName] = obtenerColorUnico();
            }

            let colorFondo = coloresCategorias[sectionName];

            // Aplicar estilos a cada objeto dentro de la sección con efecto brillante
            sectionDiv.querySelectorAll(".item, .lote-item").forEach(item => {
                item.style.backgroundColor = colorFondo;
                item.style.borderRadius = "10px";
                item.style.padding = "15px";
                item.style.color = "#ffffff"; // Asegurar legibilidad del texto
                item.style.boxShadow = `0px 0px 15px ${colorFondo}`; // Efecto brillante
                item.style.transition = "all 0.3s ease-in-out"; // Suavizar la transición

                // Aplicar color específico a los precios en pavos y soles
                let priceElements = item.querySelectorAll("p");
                priceElements.forEach(price => {
                    price.style.color = "#1FEDF0"; // Mantener color para costos en pavos y precio
                });
            });
        });

    } catch (error) {
        console.error("❌ Error al aplicar colores a los objetos:", error);
    }

    // 🎨 Función para generar colores con buen contraste
    function generarColorSeguro() {
        let color;
        do {
            color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        } while (!esColorLegible(color));
        coloresUsados.add(color);
        return color;
    }

    // 📌 Función para verificar que el color tenga buen contraste con el texto blanco y el cyan
    function esColorLegible(hexColor) {
        const rgb = hexToRgb(hexColor);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000; // Calcular luminosidad
        return brightness < 170; // Solo permitir colores oscuros para buen contraste
    }

    // 🔄 Convertir color HEX a RGB
    function hexToRgb(hex) {
        let bigint = parseInt(hex.substring(1), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }
});

