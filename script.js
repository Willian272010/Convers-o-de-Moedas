async function convert() {
    const valueInput = document.getElementById("value");
    const currencySelect = document.getElementById("currency");
    const result = document.getElementById("result");
    const button = document.querySelector("button");

    const value = Number(valueInput.value);
    const currency = currencySelect.value;

    // Limpa o resultado anterior
    result.textContent = "";

    // Validação
    if (!Number.isFinite(value) || value <= 0) {
        result.textContent = "Digite um valor válido.";
        return;
    }

    // Estado de carregamento
    button.disabled = true;
    button.textContent = "Convertendo...";

    try {
        const response = await fetch(
            `/api/converter?value=${encodeURIComponent(value)}&currency=${encodeURIComponent(currency)}`
        );

        const data = await response.json();

        // Tratamento de erro da API
        if (!response.ok) {
            result.textContent = data.error || "Não foi possível realizar a conversão.";
            return;
        }

        // Formatação do resultado
        const currencyFormat = {
            usd: {
                locale: "en-US",
                currency: "USD"
            },
            eur: {
                locale: "de-DE",
                currency: "EUR"
            }
        };

        const format = currencyFormat[currency];

        if (!format) {
            result.textContent = "Moeda não suportada.";
            return;
        }

        const formattedResult = new Intl.NumberFormat(
            format.locale,
            {
                style: "currency",
                currency: format.currency
            }
        ).format(data.result);

        result.textContent = formattedResult;

    } catch (error) {
        console.error("Erro na conversão:", error);

        result.textContent =
            "Erro ao conectar com o servidor. Verifique se o backend está funcionando.";

    } finally {
        // Restaura o botão
        button.disabled = false;
        button.textContent = "Converter";
    }
}