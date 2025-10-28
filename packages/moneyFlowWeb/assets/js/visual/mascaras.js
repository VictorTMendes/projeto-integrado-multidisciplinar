document.addEventListener('DOMContentLoaded', () => {

    // 1. Crie a função de "limpeza"
    // Esta função remove os símbolos matemáticos indesejados
    function limparSimbolosMatematicos(str) {
        // Adicione ou remova símbolos conforme sua necessidade
        const regex = /[+\-*/=()<>^%]/g; 
        return str.replace(regex, '');
    }

    // 2. Defina as opções da máscara de Real (BRL)
    const currencyMaskOptions = {
        mask: 'R$ num',
        blocks: {
            num: {
                mask: Number,
                scale: 2,
                signed: false, // Isso já bloqueia o sinal de '-'
                thousandsSeparator: '.',
                padFractionalZeros: true,
                normalizeZeros: true,
                radix: ','
            }
        },
        // --- AQUI ESTÁ A MÁGICA ---
        // 'prepare' é executado ANTES de aplicar a máscara
        prepare: function (str) {
            // Primeiro, limpamos os símbolos matemáticos
            // Depois, podemos fazer qualquer outra limpeza (ex: remover letras)
            let limpo = limparSimbolosMatematicos(str);
            
            // Opcional: Se quiser garantir que SÓ números e vírgula entrem
            // limpo = limpo.replace(/[^0-9,]/g, ''); 
            
            return limpo;
        }
    };

    // 3. Encontra os elementos de input
    const valorInput = document.getElementById('valor');
    const valorEdicaoInput = document.getElementById('valor-edicao');

    // 4. Aplica as máscaras de moeda
    if (valorInput) {
        valorInput.imask = IMask(valorInput, currencyMaskOptions);
    }
    if (valorEdicaoInput) {
        valorEdicaoInput.imask = IMask(valorEdicaoInput, currencyMaskOptions);
    }

    // 5. Aplica a máscara para o 'campo' (campo de texto livre)
    const campoInput = document.getElementById('campo');
    if (campoInput) {
        // Se 'campo' for um texto livre (ex: Descrição)
        // Usamos String como máscara e 'prepare' para limpar
        campoInput.imask = IMask(campoInput, {
            mask: String, // Aceita qualquer texto
            prepare: limparSimbolosMatematicos // Reutiliza a mesma função de limpeza
        });
    }
});