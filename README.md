# Cademia

App web para **emagrecimento**: monta a dieta e mostra exercícios para queima de gordura. Funciona offline, sem cadastro e sem build: os dados ficam salvos no navegador (`localStorage`).

## Como usar

Abra o `index.html` no navegador, ou sirva a pasta:

```bash
python3 -m http.server 8000   # e acesse http://localhost:8000
```

## Funcionalidades

- **Perfil**: calcula o metabolismo basal (Mifflin-St Jeor), o gasto diário, a meta de calorias com déficit (15/20/25%), os macros (proteína 2 g/kg, gordura 25%), o IMC e o prazo estimado até o peso meta.
- **Dieta**: plano de 5 refeições com as quantidades em gramas ajustadas automaticamente à sua meta de calorias, além de dicas de alimentação.
- **Diário**: registro de alimentos e treinos do dia, com o balanço meta − consumido + exercício e as barras de macros.
- **Calorias por foto**: tire uma foto do prato e o Claude identifica os alimentos e estima porções, calorias e macros. Você revisa os itens e as gramas antes de lançar no diário. Esse recurso só funciona quando o app é aberto pelo link do Claude (claude.ai), porque usa a sua conta do Claude. Abrindo o `index.html` direto, ele fica oculto.
- **Exercícios**: semana de treinos sugerida e uma biblioteca de 19 exercícios (HIIT, cardio, força e recuperação), com filtros, instruções, gasto calórico estimado pelo seu peso (MET) e cronômetro intervalado com sinal sonoro.
- **Progresso**: registro do peso com gráfico de evolução e a linha da meta.

## Estrutura

- `index.html`: a interface
- `styles.css`: os estilos (inclui o modo escuro)
- `data.js`: a base de alimentos, as refeições, os exercícios e a semana de treinos
- `app.js`: os cálculos e a lógica

> As estimativas são aproximadas e não substituem a orientação de um profissional de saúde.
