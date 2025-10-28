document.addEventListener('DOMContentLoaded', () => {

    // 1. Define as opções da máscara de Real (BRL)
    const currencyMaskOptions = {
        mask: 'R$ num', // O prefixo "R$" e um bloco "num"
        blocks: {
            num: {
                // Define o bloco 'num'
                mask: Number, // Usa o construtor Number para a máscara
                scale: 2, // 2 casas decimais
                signed: false, // Não permite números negativos (o tipo de transação já define isso)
                thousandsSeparator: '.', // Separador de milhar
                padFractionalZeros: true, // Adiciona '00' se não houver centavos
                normalizeZeros: true, // Remove zeros à esquerda
                radix: ',' // Separador decimal (vírgula)
            }
        }
    };

    // 2. Encontra os elementos de input
    const valorInput = document.getElementById('valor');
    const valorEdicaoInput = document.getElementById('valor-edicao');

    // 3. Aplica as máscaras e guarda a instância no próprio elemento
    // (Isso é crucial para lermos o valor depois)
    if (valorInput) {
        valorInput.imask = IMask(valorInput, currencyMaskOptions);
    }

    if (valorEdicaoInput) {
        valorEdicaoInput.imask = IMask(valorEdicaoInput, currencyMaskOptions);
    }
});