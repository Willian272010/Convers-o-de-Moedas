const form = document.querySelector("#form-conversao");
const valorInput = document.querySelector("#valor");
const moedaSelect = document.querySelector("#moeda");
const resultado = document.querySelector("#resultado");
const botao = document.querySelector("#btn-converter");

const moedas = {
    usd: {
        codigo: "USD",
        nome: "Dólar americano"
    },
    eur: {
        codigo: "EUR",
        nome: "Euro"
    }
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const valor = Number(valorInput.value);
    const moedaSelecionada = moedaSelect.value;

    // Validação do valor informado
    if (!valor || valor <= 0) {
        resultado.textContent = "Digite um valor válido para converter.";
        return;
    }

    // Verifica se a moeda existe
    const moeda = moedas[moedaSelecionada];

    if (!moeda) {
        resultado.textContent = "Selecione uma moeda válida.";
        return;
    }

    // Estado de carregamento
    botao.disabled = true;
    botao.textContent = "Convertendo...";
    resultado.textContent = "Consultando cotação...";

    try {
        const response = await fetch("/api/converter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                valor: valor,
                moeda: moeda.codigo
            })
        });

        if (!response.ok) {
            throw new Error("Não foi possível realizar a conversão.");
        }

        const data = await response.json();

        if (!data.resultado) {
            throw new Error("O servidor não retornou um resultado válido.");
        }

        const valorConvertido = Number(data.resultado);

        resultado.textContent =
            `R$ ${valor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} = ${valorConvertido.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} ${moeda.codigo}`;

    } catch (error) {
        console.error("Erro na conversão:", error);

        resultado.textContent =
            "Não foi possível realizar a conversão. Tente novamente.";
    } finally {
        botao.disabled = false;
        botao.textContent = "Converter";
    }
});