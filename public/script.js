document.addEventListener("DOMContentLoaded", async () => {
    const shopContainer = document.getElementById("shop-container");

    try {
        const response = await fetch("/api/shop");
        const shopData = await response.json();

        if (!shopData || Object.keys(shopData).length === 0) {
            shopContainer.innerHTML = "<p>No hay productos disponibles en la tienda.</p>";
            return;
        }

        // Secciones en orden y "Pistas de improvisación" al final
        const sectionOrder = [
            "Messi",
            "The Weeknd",
            "Hatsune Miku",
            "DC",
            "Avatar",
            "Originales magistrales",
            "Tienda de envoltorios",
            "Con 'F' de Fortnite",
            "Marvel",
            "Zapatillas a tutiplén",
            "Dúos",
            "Lamborghini Huracán STO",
            "Endo",
            "Ruedas y potenciadores",
            "Equípate para el Festival",
            "Pistas de improvisación" // Última categoría
        ];

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
                        <div class="buttons">
                            <a href="https://wa.me/51917932301?text=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${item.name}, vale ${item.pricePaVos} pavos y su precio es de ${item.priceSoles}.`)}" class="btn whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                            <a href="https://www.facebook.com/messages/t/564582056931570?message=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${item.name}, vale ${item.pricePaVos} pavos y su precio es de ${item.priceSoles}.`)}" class="btn messenger" target="_blank" rel="noopener noreferrer">Messenger</a>
                            <a href="https://www.instagram.com/direct/t/107896800607394?text=${encodeURIComponent(`¡Hola!, estoy interesado en comprar ${item.name}, vale ${item.pricePaVos} pavos y su precio es de ${item.priceSoles}.`)}" class="btn instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
                            <a href="https://discord.gg/kidstore" class="btn discord" target="_blank" rel="noopener noreferrer">Discord</a>
                        </div>
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

                    // Ocultar los productos extra (mostrar solo 3 filas de 4 columnas = 12 productos)
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

                // Mostrar el botón "VER TODO" solo si hay más de 12 productos
                if (hiddenItems.length > 0) {
                    const showMoreBtn = document.createElement("button");
                    showMoreBtn.textContent = "VER TODO";
                    showMoreBtn.classList.add("ver-todo-btn");

                    showMoreBtn.addEventListener("click", () => {
                        hiddenItems.forEach(item => item.classList.remove("hidden"));
                        showMoreBtn.style.display = "none"; // Ocultar el botón después de expandir
                    });

                    itemsContainer.appendChild(showMoreBtn);
                }
            } else {
                // Mostrar los objetos normales en filas de 4 (para las demás categorías)
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

// Función para actualizar la tienda automáticamente sin recargar la página
async function fetchAndUpdateShop() {
    try {
        const response = await fetch("/api/shop");
        const shopData = await response.json();

        if (!shopData || Object.keys(shopData).length === 0) return;

        const shopContainer = document.getElementById("shop-container");
        shopContainer.innerHTML = ""; // Limpiar la tienda antes de actualizar

        // Llamar a la función que genera los productos nuevamente
        sectionOrder.forEach(sectionName => {
            const sectionData = shopData.find(section => section.sectionName === sectionName);
            if (sectionData) {
                generateShopSection(sectionName, sectionData);
            }
        
        });

        console.log("🔄 Tienda actualizada automáticamente.");
    } catch (error) {
        console.error("❌ Error al actualizar la tienda:", error);
    }
}

// Hacer que la tienda se actualice cada 10 minutos sin recargar la página
setInterval(fetchAndUpdateShop, 600000); // 600,000 ms = 10 minutos

// 🔍 Función para filtrar productos según la búsqueda
document.getElementById("search-input").addEventListener("input", function () {
    let searchQuery = this.value.toLowerCase();
    let items = document.querySelectorAll(".item");
    let lotes = document.querySelectorAll(".lote-item");
    let sections = document.querySelectorAll(".section");
    let resultsFound = false;

    // Filtrar productos normales
    items.forEach(item => {
        let itemName = item.querySelector("h3").textContent.toLowerCase();
        if (itemName.includes(searchQuery)) {
            item.style.display = "flex";
            resultsFound = true;
        } else {
            item.style.display = "none";
        }
    });

    // Filtrar los "Lotes"
    lotes.forEach(lote => {
        let loteName = lote.querySelector("h3").textContent.toLowerCase();
        if (loteName.includes(searchQuery)) {
            lote.style.display = "flex";
            resultsFound = true;
        } else {
            lote.style.display = "none";
        }
    });

    // Ocultar categorías vacías
    sections.forEach(section => {
        let visibleItems = section.querySelectorAll(".item[style='display: flex;'], .lote-item[style='display: flex;']");
        section.style.display = visibleItems.length > 0 ? "block" : "none";
    });

    // Mensaje cuando no hay resultados
    let noResultsMessage = document.getElementById("no-results");
    if (!resultsFound) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement("p");
            noResultsMessage.id = "no-results";
            noResultsMessage.textContent = "⚠️ No se encontraron resultados.";
            document.getElementById("shop-container").appendChild(noResultsMessage);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
});

// 📌 Botón para ejecutar la búsqueda manualmente
document.getElementById("search-button").addEventListener("click", function () {
    let searchInput = document.getElementById("search-input");
    searchInput.focus(); // Hace foco en el campo de búsqueda
    searchInput.dispatchEvent(new Event("input")); // Dispara la búsqueda
});
