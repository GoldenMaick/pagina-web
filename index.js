let valorTotalInicial; // Variable global para almacenar el valor total inicial

document.addEventListener('DOMContentLoaded', function() {
    // Llamar a la función para obtener las divisas al cargar la página
    obtenerDivisa();

    // Agregar event listener al selector de divisa
    const selectDivisa = document.getElementById('divisa');
    selectDivisa.addEventListener('change', calcularTotal);

    // Llamar a la función para calcular el total al cargar la página
    calcularTotal();
});

async function calcularTotal() {
    const selectDivisa = document.getElementById('divisa');
    const divisaSeleccionada = selectDivisa.value;

    try {
        // Obtener el tipo de cambio de la API según la divisa seleccionada
        const tipoCambio = await obtenerTipoCambio(divisaSeleccionada);

        // Obtener el total inicial en pesos chilenos (CHP) si es la primera vez que se carga la página
        if (valorTotalInicial === undefined) {
            valorTotalInicial = parseFloat(document.getElementById('total').dataset.total); // Utilizamos el valor del atributo de datos
        }

        // Calcular el total en la divisa seleccionada usando el valor total inicial
        const totalDivisa = valorTotalInicial / tipoCambio;

        // Actualizar el contenido del elemento con el total en la divisa seleccionada
        document.getElementById('total').innerText = `$${totalDivisa.toFixed(2)} ${divisaSeleccionada.toUpperCase()}`;
    } catch (error) {
        console.error('Error al calcular el total en la divisa seleccionada:', error);
    }
}

async function obtenerTipoCambio(divisa) {
    const url = `https://mindicador.cl/api`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Obtener el tipo de cambio de la divisa seleccionada
        let tipoCambio;
        switch (divisa) {
            case 'dolar':
                tipoCambio = data.dolar.valor; // Obtener el valor del dólar de la API
                break;
            case 'bitcoin':
                tipoCambio = data.bitcoin.valor; // Obtener el valor del bitcoin de la API
                break;
            case 'uf':
                tipoCambio = data.uf.valor; // Obtener el valor de la UF de la API
                break;
            case 'peso':
            default:
                tipoCambio = 1; // El valor del peso chileno es siempre 1
                break;
        }

        return tipoCambio;
    } catch (error) {
        throw new Error('Error al obtener el tipo de cambio de la API');
    }
}

async function obtenerDivisa() {
    const url = `https://mindicador.cl/api`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Obtener las divisas requeridas
        const uf = data.uf.valor;
        const dolar = data.dolar.valor;
        const bitcoin = data.bitcoin.valor;

        // Actualizar el contenido del elemento en el navbar
        const divisasNavbar = document.getElementById('divisas-navbar');
        divisasNavbar.innerHTML = `<i class="fas fa-dollar-sign"></i> Dólar: $${dolar} | <i class="fab fa-bitcoin"></i> Bitcoin: ${bitcoin} | <i class="fas fa-file-invoice-dollar"></i> UF: $${uf}`;
    } catch (error) {
        console.error('Error al obtener las divisas:', error);
    }
}

