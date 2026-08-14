async function convert() {
    const value = Number(
        document.getElementById("value").value
    );

    const currency =
        document.getElementById("currency").value;

    const result =
        document.getElementById("result");

    if (value <= 0) {
        result.textContent = "Digite um valor válido.";
        return;
    }

    try {
        const response = await fetch(
            `/api/converter?value=${value}&currency=${currency}`
        );

        const data = await response.json();

        if (!response.ok) {
            result.textContent = data.error;
            return;
        }

        if (currency === "usd") {
            result.textContent =
                `US$ ${data.result.toFixed(2)}`;
        } else if (currency === "eur") {
            result.textContent =
                `€ ${data.result.toFixed(2)}`;
        }
    } catch (error) {
        console.error(error);
        result.textContent =
            "Erro ao conectar com o servidor.";
    }
}
