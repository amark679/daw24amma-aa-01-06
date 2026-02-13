// HTML-ko elementuak aukeratu
const formulario = document.querySelector('.input-area');
const inputMezua = document.getElementById('mezu-testua');
const txatEdukia = document.getElementById('txat-edukia');
const btnGarbitu = document.querySelector('.garbitu-btn');

// Formularioa bidaltzean exekutatuko den funtzio asinkronoa
formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault(); // Orria ez kargatzeko

    const mezua = inputMezua.value.trim();
    if (mezua === '') return;

    // 1. Erabiltzailearen mezua pantailan marraztu
    marraztuBurbuila(mezua, 'erabiltzailea');
    inputMezua.value = ''; // Input-a garbitu

    // 2. Backend-era (app.js) eskaera egin fetch bidez
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mezua: mezua }) // Mezua JSON formatuan bidali
        });

        const datuak = await response.json();

        // 3. Dena ondo badoa, bot-aren erantzuna marraztu
        if (response.ok) {
            marraztuBurbuila(datuak.erantzuna, 'bota');
        } else {
            marraztuBurbuila("Barkatu, errore bat egon da.", 'bota');
        }

    } catch (error) {
        console.error("Errorea fetch egitean:", error);
        marraztuBurbuila("Konexio errorea zerbitzariarekin.", 'bota');
    }
});

// Txata garbitzeko botoia
btnGarbitu.addEventListener('click', () => {
    txatEdukia.innerHTML = '';
});

// Burbuilak sortzeko funtzio laguntzailea
function marraztuBurbuila(testua, norDa) {
    const divMezua = document.createElement('div');
    divMezua.classList.add('mezua', norDa);

    const divBurbuila = document.createElement('div');
    divBurbuila.classList.add('burbuila');
    divBurbuila.textContent = testua;

    divMezua.appendChild(divBurbuila);
    txatEdukia.appendChild(divMezua);

    // Scroll automatikoa behera
    txatEdukia.scrollTop = txatEdukia.scrollHeight;
}