'use strict';
const refs = {
  "ibge": [
    "IBGE (2024)",
    "PNAD Contínua TIC 2023",
    "Domicílios com acesso à internet por situação",
    "https://educa.ibge.gov.br/jovens/materias-especiais/21581-informacoes-atualizadas-sobre-tecnologias-da-informacao-e-comunicacao.html"
  ],
  "usda": [
    "USDA ERS (2024)",
    "Precision agriculture use increases with farm size",
    "Pesquisa norte-americana de 2023",
    "https://ers.usda.gov/data-products/charts-of-note/110550"
  ],
  "sentinel": [
    "ESA (2015–), Sentinel-2",
    "Missão Sentinel-2",
    "Ficha técnica da Agência Espacial Europeia",
    "https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2/"
  ],
  "intro": [
    "Embrapa (2022), vídeo",
    "Embrapa Agricultura Digital",
    "Vídeo institucional em português",
    "https://www.youtube.com/watch?v=h10mEG-G1CU"
  ],
  "realDrone": [
    "United Soybean Board / Michael Kunde (2018)",
    "Drone in Soybean Field",
    "Fotografia CC BY 2.0",
    "https://commons.wikimedia.org/wiki/File:Drone_in_Soybean_Field_(48750573146).jpg"
  ],
  "realCows": [
    "Carolyn Parsons (2012)",
    "Holstein Cow Grazing 05",
    "Fotografia CC BY-SA 4.0",
    "https://commons.wikimedia.org/wiki/File:Holstein_Cow_Grazing_05.jpg"
  ],
  "videoDrone": [
    "Augusto Costa / AgDrone-MT (2023)",
    "Controle localizado de plantas daninhas com drone",
    "Embrapa Agrossilvipastoril, vídeo em português",
    "https://www.youtube.com/watch?v=mgUaG_u0gYo"
  ],
  "videoGado": [
    "Giro do Boi (2025)",
    "Pecuária do futuro",
    "Entrevista com Pedro Paulo Pires, vídeo em português",
    "https://www.youtube.com/watch?v=ZUOAXwLqKDE"
  ],
  "bolfe": [
    "Bolfe et al. (2020)",
    "Precision and Digital Agriculture: Adoption of Technologies and Perception of Brazilian Farmers",
    "Agriculture, 10(12), 653. DOI 10.3390/agriculture10120653",
    "https://doi.org/10.3390/agriculture10120653"
  ],
  "fao": [
    "FAO (2022)",
    "The State of Food and Agriculture 2022: Leveraging automation to transform agrifood systems",
    "Roma, FAO. DOI 10.4060/cb9479en",
    "https://doi.org/10.4060/cb9479en"
  ],
  "liakos": [
    "Liakos et al. (2018)",
    "Machine Learning in Agriculture: A Review",
    "Sensors, 18(8), 2674. DOI 10.3390/s18082674",
    "https://doi.org/10.3390/s18082674"
  ],
  "leaf": [
    "Mohanty, Hughes e Salathé (2016)",
    "Using Deep Learning for Image-Based Plant Disease Detection",
    "Frontiers in Plant Science, 7, 1419. DOI 10.3389/fpls.2016.01419",
    "https://doi.org/10.3389/fpls.2016.01419"
  ],
  "rutten": [
    "Rutten et al. (2013)",
    "Invited review: sensors to support health management on dairy farms",
    "Journal of Dairy Science, 96(4), 1928–1952. DOI 10.3168/jds.2012-6107",
    "https://doi.org/10.3168/jds.2012-6107"
  ],
  "sojaFoto": [
    "OpenAI ImageGen (2026), ilustração",
    "Imagem ilustrativa gerada para o seminário",
    "O link abre uma referência visual independente",
    "https://commons.wikimedia.org/wiki/File:Soybean_Field_Rows_(9620651911).jpg"
  ],
  "droneFoto": [
    "OpenAI ImageGen (2026), ilustração",
    "Imagem ilustrativa gerada para o seminário",
    "O link abre uma referência visual independente",
    "https://commons.wikimedia.org/wiki/File:Drone_in_Soybean_Field_(48750573146).jpg"
  ],
  "gadoFoto": [
    "OpenAI ImageGen (2026), ilustração",
    "Imagem ilustrativa gerada para o seminário",
    "O link abre uma referência visual independente",
    "https://commons.wikimedia.org/wiki/File:Holstein_Cow_Grazing_05.jpg"
  ],
  "cropweed": [
    "Steininger et al. (2023)",
    "The CropAndWeed Dataset",
    "IEEE/CVF WACV 2023, p. 3729–3738",
    "https://openaccess.thecvf.com/content/WACV2023/html/Steininger_The_CropAndWeed_Dataset_A_Multi-Modal_Learning_Approach_for_Efficient_Crop_WACV_2023_paper.html"
  ],
  "agroapi": [
    "Embrapa Agricultura Digital (s.d.)",
    "Multimídia e tutoriais da AgroAPI",
    "Catálogo institucional, consultado em 2026",
    "https://www.embrapa.br/web/agricultura-digital/multimidia"
  ],
  "noaa26": [
    "NOAA/CPC (12 nov. 2026)",
    "ENSO Diagnostic Discussion",
    "Boletim climático",
    "https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc.shtml?pubDate=20261018"
  ],
  "inmet26": [
    "INMET (13 nov. 2026)",
    "Pico do El Niño 2026/27",
    "Síntese da previsão de novembro",
    "https://portal.inmet.gov.br/noticias/el-ni%C3%B1o-deve-atingir-sua-intensidade-m%C3%A1xima-no-trimestre-novembro-dezembro-janeiro-e-deve-persistir-at%C3%A9-o-outono-de-2027"
  ],
  "painel26": [
    "Painel El Niño (11 nov. 2026)",
    "Boletim nº 5: tendências no Brasil",
    "MIDR e órgãos parceiros",
    "https://www.gov.br/mdr/pt-br/noticias/painel-el-nino-novo-boletim-traz-previsoes-e-possiveis-impactos"
  ],
  "agro26": [
    "MAPA (2026)",
    "Impactos do El Niño na produção agropecuária",
    "Ministério da Agricultura e Pecuária",
    "https://www.gov.br/agricultura/pt-br/assuntos/noticias/2026/mapa-monitora-impactos-do-el-nino-e-articula-medidas-para-reduzir-riscos-a-producao-agropecuaria"
  ],
  "aifs26": [
    "ECMWF (2026)",
    "AIFS Machine Learning data",
    "Modelo de previsão por aprendizado de máquina",
    "https://www.ecmwf.int/en/forecasts/datasets/aifs-machine-learning-data"
  ],
  "zarc26": [
    "MAPA (2023)",
    "Zoneamento Agrícola de Risco Climático",
    "Janelas por município, cultura, solo e ciclo",
    "https://www.gov.br/agricultura/pt-br/assuntos/riscos-seguro/programa-nacional-de-zoneamento-agricola-de-risco-climatico/zoneamento-agricola"
  ]
};
const photos = {
  "soja": [
    "Lavoura de soja em fileiras",
    "https://upload.wikimedia.org/wikipedia/commons/f/f3/Soybean_Field_Rows_%289620651911%29.jpg",
    "sojaFoto"
  ],
  "drone": [
    "Drone sobre uma lavoura de soja",
    "https://upload.wikimedia.org/wikipedia/commons/6/65/Drone_in_Soybean_Field_%2848750573146%29.jpg",
    "droneFoto"
  ],
  "gado": [
    "Vacas holandesas no pasto",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Holstein_Cow_Grazing_05.jpg/1280px-Holstein_Cow_Grazing_05.jpg",
    "gadoFoto"
  ],
  "amanhecer": [
    "Estrada entre lavouras ao amanhecer",
    "https://upload.wikimedia.org/wikipedia/commons/f/f3/Soybean_Field_Rows_%289620651911%29.jpg",
    "sojaFoto"
  ],
  "folhas": [
    "Inspeção de folhas de soja",
    "https://upload.wikimedia.org/wikipedia/commons/f/f3/Soybean_Field_Rows_%289620651911%29.jpg",
    "sojaFoto"
  ],
  "ordenha": [
    "Gado leiteiro com coleira de monitoramento",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Holstein_Cow_Grazing_05.jpg/1280px-Holstein_Cow_Grazing_05.jpg",
    "gadoFoto"
  ],
  "estacao": [
    "Estação meteorológica no campo",
    "https://upload.wikimedia.org/wikipedia/commons/f/f3/Soybean_Field_Rows_%289620651911%29.jpg",
    "sojaFoto"
  ]
};
const blocks = ["El Niño e decisões na lavoura","Risco climático e pecuária","Do alerta à vistoria com drone"];
const slides = [
  {
    "b": 1,
    "m": 1,
    "t": "Inteligência artificial na agropecuária",
    "type": "hero",
    "photo": "amanhecer",
    "lead": "",
    "s": [
      "fao",
      "sojaFoto"
    ],
    "note": "Apresente a disciplina Computadores e Sociedade e o tema do trabalho. Deixe o recorte climático para o próximo slide.",
    "course": "Computadores e Sociedade",
    "institution": "UFPB · Centro de Informática (CI)"
  },
  {
    "b": 1,
    "m": 2,
    "t": "Como a IA pode ajudar durante o super El Niño?",
    "cards": [
      [
        "Em andamento",
        "O Pacífico equatorial está mais quente e o El Niño se intensificou."
      ],
      [
        "Mais de 79%",
        "Chance de intensidade forte a muito forte até janeiro–março de 2027."
      ],
      [
        "Pico previsto",
        "Entre novembro de 2026 e janeiro de 2027."
      ],
      [
        "Como a IA ajuda",
        "Cruza previsão, sensores e imagens para indicar onde vistoriar primeiro."
      ]
    ],
    "s": [
      "noaa26",
      "inmet26"
    ],
    "note": "Atualização de 14/11/2026. Diga que “super El Niño” é uma expressão usada para um evento muito intenso. A probabilidade informa a força do evento, não a chance de seca em um município. O INMET aponta 61% de chance de neutralidade entre abril e junho de 2027. Apresente a pergunta do trabalho: como usar esses dados para priorizar decisões na lavoura e no rebanho?"
  },
  {
    "b": 1,
    "m": 2,
    "t": "O que muda para a safra?",
    "cards": [
      [
        "Norte e partes do Nordeste",
        "Risco de chuva abaixo da média. Lavouras de sequeiro e reservas de água pedem atenção."
      ],
      [
        "Sul",
        "Risco de chuva acima da média. Solo encharcado pode atrasar operações e colheita."
      ],
      [
        "Centro-Oeste e Sudeste",
        "A chuva varia dentro das regiões. O risco depende da cultura, do local e da fase da safra."
      ]
    ],
    "s": [
      "painel26",
      "agro26"
    ],
    "note": "A tendência é para novembro de 2026 a janeiro de 2027. Peça que o grupo compare dois talhões com riscos opostos. Evite transformar a previsão regional em estimativa de produtividade."
  },
  {
    "b": 1,
    "m": 1,
    "t": "Previsão, automação e IA no campo",
    "cards": [
      [
        "Previsão",
        "Mostra cenários possíveis de chuva e calor."
      ],
      [
        "Automação",
        "Executa uma regra, como ligar a bomba em um horário."
      ],
      [
        "IA",
        "Aprende com exemplos para estimar risco e priorizar alertas."
      ]
    ],
    "s": [
      "fao",
      "liakos"
    ],
    "note": "Depois do impacto regional, diferencie dados meteorológicos, automação e aprendizado de máquina. Use a irrigação como exemplo e passe para a decisão no talhão."
  },
  {
    "b": 1,
    "m": 2,
    "t": "Da previsão ao alerta de campo",
    "type": "flow",
    "cards": [
      [
        "Medir",
        "Previsão, chuva observada, umidade do solo e fase da cultura."
      ],
      [
        "Estimar",
        "O modelo estima em quais talhões o risco está subindo."
      ],
      [
        "Conferir",
        "Cheque o sensor e visite os pontos com maior risco."
      ],
      [
        "Decidir",
        "A equipe avalia a irrigação, a drenagem ou a operação de campo."
      ]
    ],
    "s": [
      "liakos",
      "aifs26",
      "zarc26"
    ],
    "note": "Diferencie previsão sazonal, previsão de curto prazo e medição local. A IA estima, a equipe confirma. Explique que o modelo deve ser testado com safras e locais fora do treino."
  },
  {
    "b": 1,
    "m": 3,
    "t": "Seca e excesso de chuva pedem respostas diferentes",
    "cards": [
      [
        "Se a chuva falhar",
        "IA + sensores sinalizam onde a umidade pode cair. Confira antes de irrigar."
      ],
      [
        "Se o solo encharcar",
        "IA + imagens priorizam baixadas para vistoria. Verifique o acesso das máquinas."
      ],
      [
        "Antes de semear",
        "Consulte o ZARC e compare as condições locais."
      ]
    ],
    "s": [
      "aifs26",
      "zarc26",
      "liakos"
    ],
    "note": "Explique que são usos possíveis, não recomendações locais. O AIFS é um exemplo de previsão por aprendizado de máquina. Mostre como o mesmo sistema pode gerar alertas distintos para dois talhões."
  },
  {
    "b": 1,
    "m": 2,
    "t": "Dois talhões · da previsão à decisão",
    "cards": [
      [
        "Dado",
        "Cenário hipotético de pouca chuva e solo secando em dois talhões."
      ],
      [
        "Alerta",
        "A IA indica maior risco em um deles, pela umidade e pela fase da cultura."
      ],
      [
        "Ação",
        "Confira no campo. Compare irrigação, se houver, e janela do ZARC se ainda for semear."
      ]
    ],
    "s": [
      "painel26",
      "zarc26",
      "liakos"
    ],
    "note": "Exemplo hipotético, sem previsão municipal. Pergunte o que faria a equipe mudar de ideia: nova previsão, chuva observada ou sensor inconsistente? Conecte à próxima etapa: decidir quais pontos fotografar."
  },
  {
    "b": 1,
    "m": 1,
    "t": "Por que olhar cada parte da lavoura?",
    "photo": "folhas",
    "cards": [
      [
        "Imagem aérea",
        "Ver onde vale a pena ir conferir."
      ],
      [
        "Solo e clima",
        "Estimar quanta água falta."
      ],
      [
        "Histórico da safra",
        "Estimar produtividade com registros anteriores."
      ]
    ],
    "s": [
      "liakos",
      "droneFoto"
    ],
    "note": "Mostre a imagem e pergunte se uma área menos verde prova a presença de doença. Discuta causas alternativas como água, nutrição e iluminação. O drone coleta dados. Um modelo pode classificar padrões na imagem; a inspeção confirma o motivo antes de agir."
  },
  {
    "b": 1,
    "t": "Satélite, drone e sensor de solo",
    "type": "flow",
    "cards": [
      [
        "Satélite",
        "Sentinel-2 tem 13 bandas. Quatro chegam a 10 m por pixel."
      ],
      [
        "Drone",
        "Capture detalhes do talhão e retorne aos pontos suspeitos."
      ],
      [
        "Solo",
        "Meça umidade em pontos selecionados."
      ],
      [
        "Validação",
        "Cruze as medições com vistoria."
      ]
    ],
    "s": [
      "sentinel",
      "liakos"
    ],
    "note": "Explique que o pixel de 10 metros representa área no terreno, enquanto o drone pode registrar detalhes mais finos. A revisita nominal do Sentinel-2 é de cinco dias. Nuvens podem inviabilizar a imagem óptica. Monte um exemplo de priorização com três fontes.",
    "m": 1
  },
  {
    "b": 1,
    "m": 1,
    "t": "Vídeo complementar · dados agrometeorológicos",
    "type": "clip",
    "file": "04-agroapi.mp4",
    "url": "https://www.embrapa.br/web/agricultura-digital/multimidia",
    "photo": "estacao",
    "lead": "Como dados de chuva e temperatura ajudam a planejar a safra?",
    "s": [
      "agroapi",
      "sojaFoto"
    ],
    "note": "Mostre o trecho em que o tutorial apresenta o tipo de dado disponível. Explique que uma API entrega observações ou estimativas para aplicações. Um modelo de decisão pode consumir esses dados e precisa de teste local."
  },
  {
    "b": 1,
    "t": "Vídeo · Como o agro se digitaliza",
    "type": "clip",
    "file": "03-embrapa.mp4",
    "url": "https://www.youtube.com/watch?v=h10mEG-G1CU",
    "photo": "soja",
    "lead": "A Embrapa mostra como os dados entram na rotina de uma fazenda.",
    "s": [
      "intro",
      "sojaFoto"
    ],
    "note": "Mostre até um minuto. Peça que a turma identifique um dado de entrada e uma decisão possível. Relacione coleta, conectividade e uso no campo.",
    "m": 1
  },
  {
    "b": 1,
    "m": 2,
    "t": "Acertar no laboratório é só o começo",
    "type": "bars",
    "bars": [
      [
        "Teste separado da base original",
        99.35,
        "99,35%"
      ],
      [
        "Primeira base externa",
        31.4,
        "31,40%"
      ]
    ],
    "lead": "Acurácia ao classificar cultura e condição da folha",
    "s": [
      "leaf"
    ],
    "note": "O artigo de 2016 analisou 54.306 imagens da base PlantVillage coletadas em condições controladas. A melhor configuração obteve 99,35% em teste separado dessa base. Na primeira coleção externa o mesmo trabalho reportou 31,40%, e na segunda 31,69%. Compare visualmente as duas barras e peça sugestões para melhorar a validação. A diferença é um resultado deste estudo específico."
  },
  {
    "b": 1,
    "m": 2,
    "t": "Na prática · Drone sobre a lavoura",
    "type": "clip",
    "file": "01-drone.mp4",
    "url": "https://www.youtube.com/watch?v=mgUaG_u0gYo",
    "photo": "drone",
    "lead": "O drone encontra os pontos com plantas daninhas. Como o produtor usa esse mapa?",
    "s": [
      "videoDrone",
      "droneFoto"
    ],
    "note": "Reserve até 90 segundos de um trecho escolhido no ensaio. Use os minutos restantes para explicar captura, mapeamento e checagem em solo. O vídeo é uma palestra mais longa. Se for exibir apenas um trecho, deixe o MP4 editado antes da aula."
  },
  {
    "b": 1,
    "m": 1,
    "t": "Como uma máquina distingue cultura e invasora?",
    "cards": [
      [
        "8 mil+ imagens",
        "O CropAndWeed registra condições variadas."
      ],
      [
        "74 espécies",
        "As etiquetas identificam culturas e plantas daninhas."
      ],
      [
        "Três anotações",
        "Caixas, máscaras e posições dos caules."
      ]
    ],
    "s": [
      "cropweed"
    ],
    "note": "Compare classificação, localização e segmentação. Uma caixa ajuda a localizar; uma máscara delimita a área; a posição de caule é útil para intervenção localizada. Evite fotos vizinhas entre treino e teste: reserve talhões e períodos inteiros."
  },
  {
    "b": 1,
    "m": 1,
    "t": "O que sabemos sobre adoção no Brasil?",
    "type": "stat",
    "stat": "84%",
    "lead": "dos 504 produtores respondentes usavam pelo menos uma tecnologia digital",
    "cards": [
      [
        "Pesquisa on-line",
        "Coleta em 2020."
      ],
      [
        "O indicador mede",
        "Tecnologia digital em geral."
      ]
    ],
    "s": [
      "bolfe"
    ],
    "note": "Apresente o tamanho e perfil da consulta. Os participantes responderam voluntariamente on-line. O resultado descreve o grupo consultado e não mede a proporção nacional de adoção de IA. Pergunte como a forma de coleta pode favorecer participantes que já estavam conectados."
  },
  {
    "b": 2,
    "m": 2,
    "t": "Pecuária de precisão",
    "type": "hero",
    "photo": "gado",
    "lead": "Do risco de calor e falta de água ao alerta para a equipe",
    "s": [
      "rutten",
      "gadoFoto"
    ],
    "note": "Faça a ponte: na lavoura, a umidade muda por talhão; no rebanho, calor e disponibilidade de água afetam a rotina de observação. Pergunte qual dado o grupo conferiria antes de agir."
  },
  {
    "b": 2,
    "m": 3,
    "t": "E o gado durante o El Niño?",
    "cards": [
      [
        "Calor",
        "Cruzar temperatura, umidade e atividade para priorizar inspeção do rebanho."
      ],
      [
        "Seca",
        "Acompanhar reservas de água e pastagem e preparar alternativas de alimentação."
      ],
      [
        "Chuva em excesso",
        "Detectar áreas de acesso ruim e revisar água, abrigo e deslocamento."
      ]
    ],
    "s": [
      "painel26",
      "agro26",
      "rutten"
    ],
    "note": "Exemplo de uso, não previsão para uma fazenda. Queda de atividade pode ter diversas causas. A equipe confirma a situação no local e decide como agir com orientação técnica."
  },
  {
    "b": 2,
    "m": 2,
    "t": "O que cada sensor consegue observar?",
    "cards": [
      [
        "Coleira ou brinco",
        "Movimento e padrões de atividade."
      ],
      [
        "Ordenha automatizada",
        "Produção e condutividade do leite."
      ],
      [
        "Câmera",
        "Classificar postura ou contar animais."
      ]
    ],
    "s": [
      "rutten",
      "liakos"
    ],
    "note": "Explique que os equipamentos têm capacidades diferentes. Um acelerômetro mede movimento e um algoritmo pode inferir comportamento. A condutividade é um sinal possível e precisa de contexto. Discuta como lama, poeira, posição da câmera ou falha de bateria afetam a qualidade."
  },
  {
    "b": 2,
    "m": 2,
    "t": "Do sinal à inspeção do animal",
    "type": "flow",
    "cards": [
      [
        "Identificar",
        "Associar registro ao animal"
      ],
      [
        "Comparar",
        "Avaliar a mudança no padrão"
      ],
      [
        "Alertar",
        "Ordenar a prioridade"
      ],
      [
        "Verificar",
        "Examinar e registrar"
      ]
    ],
    "s": [
      "rutten"
    ],
    "note": "Conte o exemplo fictício de uma vaca que passou a se movimentar menos. Mostre que calor, mudança de manejo ou problema de saúde podem produzir sinais parecidos. Um alerta indica onde olhar; a equipe verifica o animal e registra o desfecho."
  },
  {
    "b": 2,
    "m": 2,
    "t": "Duas formas de um alerta errar",
    "cards": [
      [
        "Falso positivo",
        "A equipe verifica um animal sem o problema suspeito."
      ],
      [
        "Falso negativo",
        "Um animal com o problema passa sem alerta."
      ]
    ],
    "s": [
      "rutten"
    ],
    "note": "Baixar o limiar tende a gerar mais alertas; alguns ajudam e outros ocupam a equipe. Subir o limiar pode reduzir chamadas e deixar passar casos. Pergunte qual erro custa mais. A resposta depende do problema, da capacidade de inspeção e do custo de esperar."
  },
  {
    "b": 2,
    "m": 3,
    "t": "Na prática · IA no rebanho",
    "type": "clip",
    "file": "02-pecuaria.mp4",
    "url": "https://www.youtube.com/watch?v=ZUOAXwLqKDE",
    "photo": "ordenha",
    "lead": "Que sinal chama a atenção da equipe? O que ela faz depois do alerta?",
    "s": [
      "videoGado",
      "gadoFoto"
    ],
    "note": "Mostre até 90 segundos de um trecho em português. Use o restante para perguntar que outro dado ajudaria a verificar um alerta e como a equipe confirmaria a ocorrência."
  },
  {
    "b": 2,
    "m": 2,
    "t": "O que muda entre leite, corte e aves?",
    "cards": [
      [
        "Leite",
        "Cruzar mudança na produção com outros sinais."
      ],
      [
        "Corte",
        "Combinar dados de peso e atividade ao longo do tempo."
      ],
      [
        "Aves",
        "Observar distribuição das aves no galpão por câmera."
      ]
    ],
    "s": [
      "liakos",
      "rutten"
    ],
    "note": "Compare o que é observado e o que a equipe faz depois. No leite, fale de inspeção individual; no corte, de separar animais para acompanhamento; nas aves, de avaliar uma mudança na distribuição pelo galpão. Os exemplos são usos possíveis, com equipamentos e critérios específicos."
  },
  {
    "b": 2,
    "m": 3,
    "t": "O futuro da pecuária de precisão",
    "cards": [
      [
        "Monitoramento",
        "Combinar atividade, ruminação e medições de ordenha."
      ],
      [
        "Bem-estar",
        "Priorizar uma inspeção e confirmar o motivo no animal."
      ],
      [
        "Dados",
        "Registrar intervenção e resultado para avaliar alertas."
      ]
    ],
    "s": [
      "rutten",
      "fao"
    ],
    "note": "Cenário de integração, sem previsão de adoção. Discuta por que menos ruminação pode ter causas diferentes, como calor, dieta ou doença. Compare um sensor em uso com a avaliação veterinária e explique como medir falsos alertas por lote."
  },
  {
    "b": 2,
    "m": 3,
    "t": "Como saber se um alerta de saúde ajuda?",
    "cards": [
      [
        "Verdade de campo",
        "Confirme ocorrências com inspeção e registros veterinários."
      ],
      [
        "Eventos raros",
        "Mesmo poucos alarmes falsos por animal podem sobrecarregar a equipe."
      ],
      [
        "Ganho operacional",
        "Meça a antecedência e o tempo de resposta."
      ]
    ],
    "s": [
      "rutten",
      "fao"
    ],
    "note": "Exemplo fictício: em 1000 observações, 20 têm ocorrência. Um detector encontra 16 e erra em 49 observações normais. São 16 acertos em 65 alertas, cerca de 25% de precisão, e sensibilidade de 80%. Discuta o custo de inspecionar e o custo de perder um caso."
  },
  {
    "b": 3,
    "m": 1,
    "t": "Como saber se o modelo vale a pena?",
    "cards": [
      [
        "Desempenho",
        "Quantos erros aparecem em condições reais?"
      ],
      [
        "Operação",
        "Quem responde ao alerta e em quanto tempo?"
      ],
      [
        "Resultado",
        "O benefício paga equipamento, manutenção e treinamento?"
      ]
    ],
    "s": [
      "fao",
      "rutten"
    ],
    "note": "Proponha um piloto com indicador anterior e posterior e uma comparação com a prática habitual. Dê exemplos de medida: horas de inspeção, falsos alertas por semana, custo por lote, água consumida por área. Atribuir ganhos ao sistema exige considerar diferenças de clima, lote ou safra."
  },
  {
    "b": 3,
    "m": 1,
    "t": "Como o drone ajuda depois de um alerta?",
    "cards": [
      [
        "Treino supervisionado",
        "O programa calcula médias RGB a partir de oito exemplos rotulados."
      ],
      [
        "Inferência",
        "Compara as cores da lavoura com os centros aprendidos."
      ],
      [
        "Teste em campo",
        "Luz, sombra e fundo podem mudar os resultados."
      ]
    ],
    "s": [
      "leaf",
      "cropweed"
    ],
    "note": "Volte ao exemplo dos dois talhões. Depois de uma previsão de seca ou excesso de chuva, a imagem aérea pode ajudar a priorizar vistoria. O jogo mede marcação de pontos em cenário sintético."
  },
  {
    "b": 3,
    "m": 6,
    "t": "Duelo · Pessoa contra drone",
    "type": "duel",
    "s": [
      "leaf",
      "liakos"
    ],
    "note": "Teste a etapa de vistoria do exemplo. Primeiro o piloto marca pontos com X; depois rode a IA. Compare as duas rotas. O jogo não prevê chuvas nem diagnostica seca."
  },
  {
    "b": 3,
    "t": "IA × Piloto · Resultado da missão",
    "type": "report",
    "s": [
      "liakos",
      "fao"
    ],
    "note": "Use o relatório após os dois voos. Compare cobertura, acertos e alarmes falsos. Clique para conferir os registros manuais. Os tempos de voo são da simulação, o atraso de processamento é encenado e os custos são hipóteses explícitas. Discuta equipamento, energia, validação e manutenção.",
    "m": 4
  },
  {
    "b": 3,
    "m": 1,
    "t": "O que o drone realmente enxergou?",
    "type": "flow",
    "cards": [
      [
        "Captura",
        "A câmera registra pixels."
      ],
      [
        "Classificação",
        "O modelo compara cores."
      ],
      [
        "Marcação",
        "As caixas indicam candidatos."
      ],
      [
        "Inspeção",
        "A equipe confere a causa."
      ]
    ],
    "s": [
      "leaf",
      "liakos"
    ],
    "note": "O duelo usa imagens sintéticas e um classificador de cor. Sistemas de campo podem aprender forma, textura, contexto ou combinar imagem com outros sensores. Mostre por que detectar uma mancha em uma folha e descobrir sua causa são problemas diferentes."
  },
  {
    "b": 3,
    "t": "Conectividade muda a arquitetura",
    "type": "bars",
    "lead": "Domicílios com internet no Brasil em 2023",
    "bars": [
      [
        "Área urbana",
        94.1,
        "94,1%"
      ],
      [
        "Área rural",
        81,
        "81,0%"
      ]
    ],
    "s": [
      "ibge",
      "fao"
    ],
    "note": "Os dados medem domicílios. A disponibilidade de sinal junto às plantas e animais pode ser diferente. Compare análise no próprio equipamento com envio para a nuvem. Explique por que o sistema pode guardar dados e sincronizar depois.",
    "m": 2
  },
  {
    "b": 3,
    "m": 2,
    "t": "Quando vale a pena ampliar o teste?",
    "type": "flow",
    "cards": [
      [
        "Delimitar",
        "Escolher um problema mensurável"
      ],
      [
        "Comparar",
        "Medir contra a prática atual"
      ],
      [
        "Validar",
        "Repetir em outros lotes ou safras"
      ],
      [
        "Acompanhar",
        "Reavaliar erros e impacto"
      ]
    ],
    "s": [
      "fao",
      "leaf",
      "rutten"
    ],
    "note": "Dê o exemplo de um piloto de alertas leiteiros. Antes, combine com a equipe o custo e tolerância a alarmes falsos. Durante o teste, registre resultado de cada inspeção e também inspecione uma amostra de animais sem alerta para avaliar falsos negativos. Retome os pontos da agricultura e da pecuária."
  },
  {
    "b": 3,
    "m": 1,
    "t": "O futuro próximo · IA no próprio equipamento",
    "cards": [
      [
        "No drone",
        "Filtrar imagens e registrar pontos mesmo com conexão instável."
      ],
      [
        "Na fazenda",
        "Revisar exemplos novos e recalibrar por safra."
      ],
      [
        "Na cooperativa",
        "Compartilhar equipe, manutenção e auditoria."
      ]
    ],
    "s": [
      "fao",
      "ibge",
      "leaf"
    ],
    "note": "Cenário, não previsão. Compare processamento local com nuvem: latência, bateria, cobertura e reprocessamento. Uma chuva forte, outra cultivar ou uma câmera nova podem alterar a distribuição dos dados. O piloto deve guardar exemplos confirmados e acompanhar erros por safra."
  },
  {
    "b": 3,
    "m": 2,
    "t": "O que a fazenda faz quando chega o próximo boletim?",
    "cards": [
      [
        "Antes",
        "Leia o cenário regional e escolha o risco a acompanhar."
      ],
      [
        "Durante",
        "Combine IA, previsão e medições para priorizar as vistorias."
      ],
      [
        "Depois",
        "Compare o alerta com o que foi observado e revise o modelo."
      ]
    ],
    "s": [
      "painel26",
      "aifs26",
      "zarc26"
    ],
    "note": "Retome o exemplo da capa. Peça ao grupo para dizer o primeiro dado a conferir antes de tomar uma decisão no seu município."
  },
  {
    "b": 3,
    "m": 1,
    "t": "Referências",
    "type": "bibliography",
    "s": [
      "noaa26",
      "inmet26",
      "painel26",
      "zarc26",
      "aifs26",
      "fao",
      "cropweed",
      "rutten"
    ],
    "note": "Use os links para recuperar os artigos e dados. As demais referências e créditos de imagem estão no menu Fontes."
  },
  {
    "b": 3,
    "m": 1,
    "t": "Obrigado!",
    "type": "thanks",
    "photo": "soja",
    "lead": "Que decisão no campo você confiaria à IA, e como verificaria o resultado?",
    "s": [
      "sojaFoto"
    ],
    "note": "Agradeça e abra espaço para perguntas. Retome o exemplo da missão para explicar a diferença entre detectar um ponto e decidir a intervenção."
  }
];
