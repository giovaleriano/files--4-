/* =========================================================
   NORTEENS — Banco de dados das profissões
   ---------------------------------------------------------
   Cada profissão vive aqui, separada do código da página, para
   ser fácil de editar ou adicionar uma nova. Para criar uma nova
   profissão: copie um bloco, cole antes do "};" final e troque
   os dados. O "slug" (a chave, ex: "eng-software") é o valor
   usado na URL: profissao.html?p=eng-software

   Campos:
   - nome            → título da profissão
   - categoria       → "exatas" | "saude" | "humanas" | "criativas" | "negocios"
   - categoriaLabel  → rótulo exibido (ex: "Exatas")
   - icone           → ícone do destaque na galeria (ver PROF_ICONS em profissao.js)
   - descricao       → descrição e rotina
   - formacao        → caminhos de formação
   - tecnicas        → lista de habilidades técnicas
   - comportamentais → texto de habilidades comportamentais
   - salario         → faixa de salário médio
   - regioes         → lista de regiões/modelos com mais vagas
   - ferramentas     → lista de ferramentas usadas
   ========================================================= */

var PROFESSIONS = {

  'eng-software': {
    nome: 'Engenharia de Software',
    categoria: 'exatas',
    categoriaLabel: 'Exatas',
    icone: 'code',
    imagens: [
      'img/engenharia_software/eng_software1.jpeg',
      'img/engenharia_software/eng_software2.jpeg',
      'img/engenharia_software/eng_software3.jpeg',
      'img/engenharia_software/eng_software4.jpeg',
      'img/engenharia_software/eng_software5.jpeg',
      'img/engenharia_software/eng_software6.jpeg',
      'img/engenharia_software/eng_software7.jpeg',
      'img/engenharia_software/eng_software8.jpeg',
      'assets/img/profissoes/eng-software-09.jpg',
      'assets/img/profissoes/eng-software-10.jpg',
      'assets/img/profissoes/eng-software-11.jpg',
      'assets/img/profissoes/eng-software-12.jpg'
    ],
    descricao: 'Projeta e constrói sistemas, aplicativos e sites — da lógica por trás de um app ao funcionamento de uma plataforma inteira. O dia a dia mistura programação, resolução de problemas, testes e trabalho em equipe, com muito raciocínio lógico e aprendizado constante.',
    formacao: 'Graduação em Engenharia de Software, Ciência da Computação ou áreas afins. Cursos técnicos e bootcamps também abrem portas no mercado.',
    tecnicas: ['Lógica de programação', 'Estruturas de dados', 'Banco de dados', 'APIs', 'Controle de versão'],
    comportamentais: 'Resolução de problemas, atenção ao detalhe, comunicação, trabalho em equipe e curiosidade para aprender sempre coisas novas.',
    salario: 'R$ 5.000 – R$ 9.000',
    regioes: ['São Paulo', 'Rio de Janeiro', 'Curitiba', 'Florianópolis', 'Remoto'],
    ferramentas: ['VS Code', 'Git', 'Python', 'Docker', 'Figma']
  },

  'ciencia-dados': {
    nome: 'Ciência de Dados',
    categoria: 'exatas',
    categoriaLabel: 'Exatas',
    icone: 'chart',
    descricao: 'Transforma grandes volumes de dados em decisões: analisa padrões, cria modelos estatísticos e ajuda empresas a entenderem melhor pessoas, produtos e processos. Une matemática, programação e curiosidade investigativa.',
    formacao: 'Graduação em Estatística, Matemática, Computação ou Engenharia, com especialização em análise de dados e aprendizado de máquina.',
    tecnicas: ['Estatística', 'Python ou R', 'SQL', 'Machine Learning', 'Visualização de dados'],
    comportamentais: 'Raciocínio analítico, curiosidade, comunicação de dados complexos de forma simples e paciência para investigar.',
    salario: 'R$ 6.000 – R$ 11.000',
    regioes: ['São Paulo', 'Remoto', 'Rio de Janeiro', 'Belo Horizonte', 'Multinacionais'],
    ferramentas: ['Python', 'SQL', 'Power BI', 'Jupyter', 'Excel avançado']
  },

  'medicina': {
    nome: 'Medicina',
    categoria: 'saude',
    categoriaLabel: 'Saúde',
    icone: 'health',
    descricao: 'Cuida da saúde das pessoas, do diagnóstico à prevenção e ao tratamento. A rotina envolve atendimento a pacientes, exames, estudo constante e decisões de responsabilidade, com forte contato humano.',
    formacao: 'Graduação em Medicina (6 anos) e residência na especialidade escolhida. O estudo continua por toda a carreira.',
    tecnicas: ['Anatomia', 'Diagnóstico clínico', 'Farmacologia', 'Procedimentos clínicos', 'Leitura de exames'],
    comportamentais: 'Empatia, atenção ao detalhe, controle emocional, comunicação clara e capacidade de decidir sob pressão.',
    salario: 'R$ 8.000 – R$ 16.000',
    regioes: ['São Paulo', 'Minas Gerais', 'Rio de Janeiro', 'Interior', 'Todo o país'],
    ferramentas: ['Prontuário eletrônico', 'Equipamentos de exame', 'Protocolos clínicos', 'Estetoscópio']
  },

  'enfermagem': {
    nome: 'Enfermagem',
    categoria: 'saude',
    categoriaLabel: 'Saúde',
    icone: 'health',
    descricao: 'Atua diretamente no cuidado, no acolhimento e na recuperação dos pacientes — muitas vezes é quem passa mais tempo ao lado de quem precisa de cuidado. Envolve escuta, técnica e sensibilidade em partes iguais.',
    formacao: 'Graduação em Enfermagem (4 anos) ou curso técnico em Enfermagem, com registro no COREN para atuar.',
    tecnicas: ['Cuidados clínicos', 'Administração de medicamentos', 'Sinais vitais', 'Curativos', 'Registro de prontuário'],
    comportamentais: 'Empatia, resistência emocional, trabalho em equipe, atenção ao detalhe e capacidade de agir rápido.',
    salario: 'R$ 3.000 – R$ 6.000',
    regioes: ['Hospitais', 'UBS', 'Home care', 'Todo o país', 'Turnos noturnos'],
    ferramentas: ['Prontuário eletrônico', 'Equipamentos hospitalares', 'Protocolos de segurança']
  },

  'psicologia': {
    nome: 'Psicologia',
    categoria: 'humanas',
    categoriaLabel: 'Humanas',
    icone: 'brain',
    descricao: 'Estuda o comportamento humano e apoia o bem-estar emocional das pessoas. A rotina pode envolver atendimento, escuta, avaliações e acompanhamento, sempre com muito contato humano.',
    formacao: 'Graduação em Psicologia (5 anos) e registro no CRP. As especializações definem a área de atuação (clínica, organizacional, escolar).',
    tecnicas: ['Escuta ativa', 'Avaliação psicológica', 'Técnicas terapêuticas', 'Observação comportamental'],
    comportamentais: 'Empatia, paciência, ética, comunicação e equilíbrio emocional para lidar com histórias difíceis.',
    salario: 'R$ 3.000 – R$ 7.000',
    regioes: ['Clínicas', 'Escolas', 'Empresas', 'Atendimento online', 'Todo o país'],
    ferramentas: ['Testes psicológicos', 'Prontuário', 'Materiais terapêuticos', 'Teleatendimento']
  },

  'direito': {
    nome: 'Direito',
    categoria: 'humanas',
    categoriaLabel: 'Humanas',
    icone: 'law',
    descricao: 'Atua na defesa de direitos, na mediação de conflitos e na justiça social. A rotina envolve muita leitura, redação, análise de casos e argumentação — seja em um tribunal ou em uma sala de negociação.',
    formacao: 'Graduação em Direito (5 anos) e aprovação no exame da OAB para poder advogar.',
    tecnicas: ['Interpretação da lei', 'Redação jurídica', 'Análise de casos', 'Argumentação', 'Pesquisa jurídica'],
    comportamentais: 'Raciocínio crítico, comunicação, ética, organização e atenção ao detalhe.',
    salario: 'R$ 4.000 – R$ 10.000',
    regioes: ['São Paulo', 'Brasília', 'Rio de Janeiro', 'Capitais', 'Concursos públicos'],
    ferramentas: ['Vade Mecum', 'Sistemas de processo', 'Bancos de jurisprudência', 'Editor de texto']
  },

  'design-grafico': {
    nome: 'Design Gráfico',
    categoria: 'criativas',
    categoriaLabel: 'Criativas',
    icone: 'design',
    descricao: 'Comunica ideias e constrói identidades visuais através da imagem — de logos e embalagens a telas de aplicativos. Trabalho criativo, com pesquisa, testes e muita troca com quem vai usar o que é criado.',
    formacao: 'Graduação em Design Gráfico ou Design Digital. Cursos livres e um bom portfólio contam tanto quanto o diploma.',
    tecnicas: ['Tipografia', 'Teoria das cores', 'Composição visual', 'Prototipagem', 'Identidade visual'],
    comportamentais: 'Criatividade, sensibilidade estética, comunicação, abertura a feedback e organização.',
    salario: 'R$ 3.500 – R$ 7.500',
    regioes: ['São Paulo', 'Remoto', 'Freelance', 'Agências', 'Startups'],
    ferramentas: ['Figma', 'Photoshop', 'Illustrator', 'Canva']
  },

  'arquitetura': {
    nome: 'Arquitetura',
    categoria: 'criativas',
    categoriaLabel: 'Criativas',
    icone: 'building',
    descricao: 'Projeta espaços que unem estética, função e conforto para as pessoas — de uma casa a um bairro inteiro. Envolve criatividade, cálculo técnico e muita conversa com quem vai viver naquele espaço.',
    formacao: 'Graduação em Arquitetura e Urbanismo (5 anos) e registro no CAU para assinar projetos.',
    tecnicas: ['Desenho técnico', 'Modelagem 3D', 'Normas construtivas', 'Planejamento de espaços'],
    comportamentais: 'Criatividade, visão espacial, comunicação com clientes e capacidade de equilibrar estética e viabilidade.',
    salario: 'R$ 4.000 – R$ 8.500',
    regioes: ['São Paulo', 'Escritórios próprios', 'Construtoras', 'Remoto parcial'],
    ferramentas: ['AutoCAD', 'SketchUp', 'Revit', 'Photoshop']
  },

  'administracao': {
    nome: 'Administração',
    categoria: 'negocios',
    categoriaLabel: 'Negócios',
    icone: 'briefcase',
    descricao: 'Planeja, organiza e gerencia recursos de empresas e projetos — de uma pequena equipe a uma operação inteira. A rotina envolve planejamento, números, pessoas e muita tomada de decisão.',
    formacao: 'Graduação em Administração de Empresas. Especializações em gestão de projetos, finanças ou pessoas ampliam as oportunidades.',
    tecnicas: ['Planejamento estratégico', 'Gestão financeira', 'Gestão de projetos', 'Análise de indicadores'],
    comportamentais: 'Liderança, organização, comunicação, visão de negócio e capacidade de priorizar sob pressão.',
    salario: 'R$ 3.500 – R$ 8.000',
    regioes: ['Todo o país', 'Empresas de todos os portes', 'Remoto', 'Setor público'],
    ferramentas: ['Excel avançado', 'Power BI', 'Trello ou Asana', 'ERP']
  },

  'marketing': {
    nome: 'Marketing',
    categoria: 'negocios',
    categoriaLabel: 'Negócios',
    icone: 'megaphone',
    descricao: 'Conecta marcas e pessoas através de estratégia, dados e criatividade — pensa como uma marca deve se comunicar e por quais canais. Mistura análise de números com sensibilidade para tendências e comportamento.',
    formacao: 'Graduação em Marketing, Publicidade e Propaganda ou Comunicação Social. Cursos livres em marketing digital são muito valorizados.',
    tecnicas: ['Marketing digital', 'Redes sociais', 'Análise de métricas', 'Copywriting', 'Gestão de campanhas'],
    comportamentais: 'Criatividade, comunicação, adaptabilidade e leitura de tendências e comportamento do público.',
    salario: 'R$ 3.500 – R$ 8.500',
    regioes: ['São Paulo', 'Remoto', 'Agências', 'Startups', 'E-commerce'],
    ferramentas: ['Meta Ads', 'Google Analytics', 'Canva', 'RD Station']
  }

};
