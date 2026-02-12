const translateButton = document.querySelector("#translateButton");

translateButton.addEventListener("click", async () => {
    // Asegúrate de haber puesto id="userText" en el HTML
    const userTextInput = document.querySelector("#userText"); 
    const targetLangInput = document.querySelector("#targetLang");
    const botText = document.querySelector("#botText");

    const text = userTextInput.value.trim();
    const targetLang = targetLangInput.value;

    // Validación básica: Si no hay texto o idioma, no hacemos nada
    if (!text || !targetLang) {
        alert("Mesedez, idatzi testua eta aukeratu hizkuntza.");
        return;
    }

    // Feedback visual: "Cargando..."
    botText.textContent = "Itzultzen...";

    try {
        const response = await fetch("/api/translate", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            // Convertimos el objeto JS a texto JSON para enviarlo
            body: JSON.stringify({ text, targetLang })
        });

        if (!response.ok) {
            throw new Error(`Errorea zerbitzarian: ${response.status}`);
        }

        // Esperamos a que el JSON se descargue y se parsee
        const data = await response.json(); 
        
        // Mostramos el resultado
        botText.textContent = data.translatedText;

    } catch (error) {
        console.error("Errorea itzulpenean:", error);
        botText.textContent = "Errore bat gertatu da. Saiatu berriro.";
    }
});