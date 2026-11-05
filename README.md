# gerador-frequencia

Gerador web de folhas de frequência em branco para motoristas, desenvolvido com HTML, CSS e JavaScript. Automatiza a rotina mensal de preenchimento e ajuste de datas, gerando documentos formatados para impressão padrão A4.

## Usar

Abra `index.html` no navegador. Escolha mês completo, intervalo (até 366 dias) ou datas avulsas. É possível destacar ou excluir fins de semana, deixar o nome em branco e ajustar carga horária e assinaturas. Períodos maiores são divididos em páginas de até 31 datas.

## Imprimir ou salvar PDF

Clique em **Imprimir**, selecione A4 em orientação retrato e desative **Cabeçalhos e rodapés** nas configurações de impressão. Isso remove o endereço e o título adicionados pelo navegador. A própria folha inclui data e hora da impressão, usando o relógio do dispositivo. O campo NOME fica sem sublinhado quando vazio.

## Dados

As informações ficam somente na memória da página e são perdidas ao recarregar. Não há cadastro de motoristas nem envio dos campos a um backend. A privacidade do acesso ao site depende das configurações da hospedagem escolhida; o código não implementa autenticação.

## Verificações realizadas

Seleção mensal, fevereiro bissexto, intervalo entre anos e seleção de datas avulsas conferidos no navegador. Sintaxe JavaScript validada. O resultado físico da impressão depende do navegador e da impressora.
