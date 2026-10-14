// Alimentos: valores por 100 g (kcal, proteína, carboidrato, gordura)
const FOODS = [
  { id: 'ovo', nome: 'Ovo cozido', kcal: 155, p: 13, c: 1.1, g: 11, porcao: 50 },
  { id: 'clara', nome: 'Clara de ovo', kcal: 52, p: 11, c: 0.7, g: 0.2, porcao: 33 },
  { id: 'frango', nome: 'Peito de frango grelhado', kcal: 165, p: 31, c: 0, g: 3.6, porcao: 120 },
  { id: 'patinho', nome: 'Patinho moído', kcal: 219, p: 35, c: 0, g: 7.3, porcao: 120 },
  { id: 'tilapia', nome: 'Tilápia grelhada', kcal: 128, p: 26, c: 0, g: 2.7, porcao: 120 },
  { id: 'atum', nome: 'Atum em água', kcal: 116, p: 26, c: 0, g: 1, porcao: 80 },
  { id: 'arroz', nome: 'Arroz integral cozido', kcal: 124, p: 2.6, c: 25.8, g: 1, porcao: 120 },
  { id: 'arrozb', nome: 'Arroz branco cozido', kcal: 128, p: 2.5, c: 28, g: 0.2, porcao: 120 },
  { id: 'feijao', nome: 'Feijão cozido', kcal: 77, p: 4.5, c: 14, g: 0.5, porcao: 100 },
  { id: 'lentilha', nome: 'Lentilha cozida', kcal: 116, p: 9, c: 20, g: 0.4, porcao: 100 },
  { id: 'batatadoce', nome: 'Batata-doce cozida', kcal: 77, p: 0.6, c: 18, g: 0.1, porcao: 150 },
  { id: 'mandioca', nome: 'Mandioca cozida', kcal: 125, p: 0.6, c: 30, g: 0.3, porcao: 100 },
  { id: 'aveia', nome: 'Aveia em flocos', kcal: 394, p: 14, c: 67, g: 8.5, porcao: 30 },
  { id: 'paoint', nome: 'Pão integral (fatia)', kcal: 250, p: 10, c: 45, g: 3.5, porcao: 50 },
  { id: 'tapioca', nome: 'Tapioca (goma)', kcal: 240, p: 0, c: 60, g: 0, porcao: 40 },
  { id: 'iogurte', nome: 'Iogurte natural desnatado', kcal: 45, p: 4.3, c: 6.5, g: 0.2, porcao: 170 },
  { id: 'queijo', nome: 'Queijo cottage', kcal: 98, p: 11, c: 3.4, g: 4.3, porcao: 100 },
  { id: 'leite', nome: 'Leite desnatado', kcal: 35, p: 3.4, c: 5, g: 0.1, porcao: 200 },
  { id: 'whey', nome: 'Whey protein (dose)', kcal: 400, p: 80, c: 8, g: 6, porcao: 30 },
  { id: 'banana', nome: 'Banana', kcal: 89, p: 1.1, c: 23, g: 0.3, porcao: 100 },
  { id: 'maca', nome: 'Maçã', kcal: 52, p: 0.3, c: 14, g: 0.2, porcao: 150 },
  { id: 'mamao', nome: 'Mamão', kcal: 43, p: 0.5, c: 11, g: 0.3, porcao: 150 },
  { id: 'morango', nome: 'Morango', kcal: 32, p: 0.7, c: 7.7, g: 0.3, porcao: 100 },
  { id: 'laranja', nome: 'Laranja', kcal: 47, p: 0.9, c: 12, g: 0.1, porcao: 150 },
  { id: 'abacate', nome: 'Abacate', kcal: 160, p: 2, c: 8.5, g: 15, porcao: 60 },
  { id: 'brocolis', nome: 'Brócolis cozido', kcal: 35, p: 2.4, c: 7, g: 0.4, porcao: 100 },
  { id: 'salada', nome: 'Salada verde (folhas)', kcal: 15, p: 1.3, c: 2.9, g: 0.2, porcao: 80 },
  { id: 'legumes', nome: 'Legumes cozidos (mix)', kcal: 40, p: 1.5, c: 8, g: 0.3, porcao: 120 },
  { id: 'tomate', nome: 'Tomate', kcal: 18, p: 0.9, c: 3.9, g: 0.2, porcao: 100 },
  { id: 'azeite', nome: 'Azeite de oliva', kcal: 884, p: 0, c: 0, g: 100, porcao: 5 },
  { id: 'castanha', nome: 'Castanha-do-pará', kcal: 656, p: 14, c: 12, g: 66, porcao: 10 },
  { id: 'amendoim', nome: 'Pasta de amendoim', kcal: 588, p: 25, c: 20, g: 50, porcao: 15 },
  { id: 'cafe', nome: 'Café sem açúcar', kcal: 2, p: 0.1, c: 0, g: 0, porcao: 100 },
];

// Modelo de refeições (porcentagem das calorias do dia e itens base em gramas)
const REFEICOES = [
  { nome: 'Café da manhã', pct: 0.22, itens: [['ovo', 100], ['paoint', 50], ['mamao', 150], ['cafe', 100]] },
  { nome: 'Lanche da manhã', pct: 0.10, itens: [['iogurte', 170], ['aveia', 20], ['morango', 100]] },
  { nome: 'Almoço', pct: 0.33, itens: [['frango', 140], ['arroz', 120], ['feijao', 100], ['legumes', 120], ['salada', 80], ['azeite', 5]] },
  { nome: 'Lanche da tarde', pct: 0.12, itens: [['banana', 100], ['amendoim', 15], ['leite', 200]] },
  { nome: 'Jantar', pct: 0.23, itens: [['tilapia', 140], ['batatadoce', 150], ['brocolis', 100], ['salada', 80], ['azeite', 5]] },
];

// Exercícios. met = equivalente metabólico (Compêndio de Atividades Físicas)
const EXERCICIOS = [
  { id: 'caminhada', nome: 'Caminhada rápida', cat: 'Cardio', nivel: 'Iniciante', impacto: 'Baixo', met: 4.3, dur: 40, desc: 'Ritmo em que você consegue conversar, mas não cantar. Ótima base para queimar gordura sem estressar articulações.', passos: ['Mantenha a postura ereta e o abdômen firme', 'Passadas largas, balançando os braços', 'Mantenha 5–6 km/h por 40 min'] },
  { id: 'corrida', nome: 'Corrida moderada', cat: 'Cardio', nivel: 'Intermediário', impacto: 'Alto', met: 9.8, dur: 30, desc: 'Corrida contínua a ~9 km/h. Alto gasto calórico por minuto.', passos: ['Aqueça 5 min caminhando', 'Corra em ritmo constante 20–30 min', 'Finalize com 5 min de caminhada e alongamento'] },
  { id: 'bike', nome: 'Bicicleta (moderada)', cat: 'Cardio', nivel: 'Iniciante', impacto: 'Baixo', met: 6.8, dur: 40, desc: 'Pedalada em ritmo moderado, boa para quem tem joelhos sensíveis.', passos: ['Ajuste o banco na altura do quadril', 'Pedale em cadência de 70–90 rpm', 'Mantenha esforço moderado por 30–45 min'] },
  { id: 'pular', nome: 'Pular corda', cat: 'HIIT', nivel: 'Intermediário', impacto: 'Alto', met: 11.8, dur: 15, desc: 'Um dos exercícios com maior gasto calórico por minuto.', passos: ['Pule 40 s, descanse 20 s', 'Repita 10 a 15 rodadas', 'Aterrisse na ponta dos pés com joelhos levemente flexionados'] },
  { id: 'burpee', nome: 'Burpees', cat: 'HIIT', nivel: 'Avançado', impacto: 'Alto', met: 10, dur: 12, desc: 'Exercício de corpo inteiro que eleva muito a frequência cardíaca.', passos: ['Agache e apoie as mãos no chão', 'Jogue as pernas para trás (prancha)', 'Volte e salte esticando o corpo', '30 s de trabalho / 30 s de descanso'] },
  { id: 'jumpingjack', nome: 'Polichinelo', cat: 'HIIT', nivel: 'Iniciante', impacto: 'Médio', met: 8, dur: 12, desc: 'Cardio simples, sem equipamento, ideal para aquecer ou compor circuitos.', passos: ['Salte abrindo pernas e braços', 'Volte à posição inicial', '45 s de trabalho / 15 s de descanso'] },
  { id: 'mountain', nome: 'Mountain climbers', cat: 'HIIT', nivel: 'Intermediário', impacto: 'Médio', met: 8, dur: 10, desc: 'Combina cardio e fortalecimento do abdômen.', passos: ['Posição de prancha com mãos sob os ombros', 'Traga os joelhos ao peito alternadamente, rápido', '30 s de trabalho / 30 s de descanso'] },
  { id: 'highknees', nome: 'Corrida estacionária (joelho alto)', cat: 'HIIT', nivel: 'Iniciante', impacto: 'Médio', met: 8, dur: 10, desc: 'Cardio intenso em espaço pequeno.', passos: ['Eleve os joelhos até a altura do quadril', 'Balance os braços em oposição', '30 s de trabalho / 30 s de descanso'] },
  { id: 'agachamento', nome: 'Agachamento livre', cat: 'Força', nivel: 'Iniciante', impacto: 'Baixo', met: 5, dur: 15, desc: 'Trabalha pernas e glúteos — grandes músculos que aumentam o gasto energético.', passos: ['Pés na largura dos ombros', 'Desça o quadril para trás, joelhos alinhados com os pés', '4 séries de 15 repetições'] },
  { id: 'afundo', nome: 'Afundo (avanço)', cat: 'Força', nivel: 'Iniciante', impacto: 'Baixo', met: 5, dur: 15, desc: 'Fortalece pernas e melhora o equilíbrio.', passos: ['Dê um passo à frente', 'Desça até ambos os joelhos formarem 90°', '3 séries de 12 por perna'] },
  { id: 'flexao', nome: 'Flexão de braço', cat: 'Força', nivel: 'Intermediário', impacto: 'Baixo', met: 5, dur: 12, desc: 'Peito, ombros, tríceps e core. Pode apoiar os joelhos para facilitar.', passos: ['Mãos um pouco além da largura dos ombros', 'Corpo alinhado da cabeça aos calcanhares', '4 séries até perto da falha'] },
  { id: 'prancha', nome: 'Prancha', cat: 'Força', nivel: 'Iniciante', impacto: 'Baixo', met: 3.8, dur: 8, desc: 'Fortalece o core e protege a coluna.', passos: ['Apoie antebraços e pontas dos pés', 'Mantenha o corpo reto, abdômen contraído', '4 × 30–60 s'] },
  { id: 'kettlebell', nome: 'Kettlebell swing', cat: 'Força', nivel: 'Intermediário', impacto: 'Médio', met: 9.8, dur: 15, desc: 'Une força e cardio, trabalhando posterior de coxa, glúteos e costas.', passos: ['Quadril para trás, costas retas', 'Estenda o quadril com força para balançar o peso', '10 séries de 30 s / 30 s descanso'] },
  { id: 'circuito', nome: 'Treino em circuito', cat: 'Força', nivel: 'Intermediário', impacto: 'Médio', met: 8, dur: 30, desc: 'Vários exercícios em sequência com pouco descanso.', passos: ['Escolha 6 exercícios (agachamento, flexão, remada, afundo, prancha, polichinelo)', '40 s de trabalho / 20 s de descanso', '3–4 voltas'] },
  { id: 'natacao', nome: 'Natação', cat: 'Cardio', nivel: 'Intermediário', impacto: 'Baixo', met: 8, dur: 30, desc: 'Corpo inteiro, sem impacto nas articulações.', passos: ['Alterne estilos para não cansar a mesma musculatura', 'Nade 30 min com pausas curtas'] },
  { id: 'danca', nome: 'Dança aeróbica / Zumba', cat: 'Cardio', nivel: 'Iniciante', impacto: 'Médio', met: 6.5, dur: 40, desc: 'Cardio divertido que ajuda a manter a constância.', passos: ['Siga uma aula em vídeo', 'Mantenha o movimento contínuo por 40 min'] },
  { id: 'escada', nome: 'Subir escadas', cat: 'Cardio', nivel: 'Intermediário', impacto: 'Médio', met: 8.8, dur: 15, desc: 'Alto gasto calórico em pouco tempo e fortalece glúteos.', passos: ['Suba em ritmo firme, descendo caminhando', 'Repita por 15 min'] },
  { id: 'hiitesteira', nome: 'HIIT na esteira (1:2)', cat: 'HIIT', nivel: 'Avançado', impacto: 'Alto', met: 10.5, dur: 20, desc: 'Tiros de alta intensidade alternados com recuperação.', passos: ['Aqueça 5 min', '30 s forte (esforço 9/10) + 60 s caminhando', 'Repita 8–10 vezes e desacelere 5 min'] },
  { id: 'alongamento', nome: 'Alongamento / mobilidade', cat: 'Recuperação', nivel: 'Iniciante', impacto: 'Baixo', met: 2.3, dur: 15, desc: 'Reduz rigidez e melhora a recuperação entre treinos.', passos: ['Segure cada posição 20–30 s', 'Respire fundo, sem dor'] },
];

// Plano semanal sugerido (ids de exercícios)
const SEMANA = [
  { dia: 'Segunda', foco: 'Força + Core', ids: ['agachamento', 'afundo', 'flexao', 'prancha'] },
  { dia: 'Terça', foco: 'Cardio moderado', ids: ['caminhada', 'alongamento'] },
  { dia: 'Quarta', foco: 'HIIT', ids: ['jumpingjack', 'mountain', 'highknees', 'burpee'] },
  { dia: 'Quinta', foco: 'Descanso ativo', ids: ['danca'] },
  { dia: 'Sexta', foco: 'Circuito', ids: ['circuito', 'prancha'] },
  { dia: 'Sábado', foco: 'Cardio longo', ids: ['bike', 'alongamento'] },
  { dia: 'Domingo', foco: 'Descanso', ids: ['alongamento'] },
];
