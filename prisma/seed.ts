import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Sample blog posts for Saúde com Alex
  const samplePosts = [
    {
      title: 'Introdução à Saúde Pública: Conceitos Fundamentais',
      slug: 'introducao-saude-publica-conceitos-fundamentais',
      excerpt: 'Explore os conceitos básicos e a importância da saúde pública para o bem-estar da população brasileira.',
      content: `# Introdução à Saúde Pública

A saúde pública é uma disciplina fundamental que visa proteger e melhorar a saúde de comunidades inteiras. No Brasil, enfrentamos desafios únicos que requerem abordagens específicas e inovadoras.

## O que é Saúde Pública?

A saúde pública é **a arte e a ciência de prevenir doenças, prolongar a vida e promover a saúde** através dos esforços organizados da sociedade. Ela se diferencia da medicina clínica por focar na população como um todo, não apenas no indivíduo.

### Pilares da Saúde Pública

1. **Prevenção de doenças**
2. **Promoção da saúde**
3. **Vigilância epidemiológica**
4. **Educação em saúde**

## Importância no Contexto Brasileiro

O Sistema Único de Saúde (SUS) representa um dos maiores sistemas públicos de saúde do mundo, garantindo acesso universal e gratuito aos serviços de saúde.

> "A saúde é direito de todos e dever do Estado" - Constituição Federal de 1988

## Desafios Atuais

- Doenças crônicas não transmissíveis
- Saúde mental
- Desigualdades sociais em saúde
- Mudanças demográficas

A compreensão desses conceitos é essencial para todos os profissionais da área e cidadãos interessados em contribuir para uma sociedade mais saudável.`,
      published: true,
      category: 'educacao',
      tags: ['saúde pública', 'conceitos básicos', 'SUS', 'educação'],
      metaTitle: 'Introdução à Saúde Pública: Guia Completo dos Conceitos Fundamentais',
      metaDescription: 'Descubra os conceitos fundamentais da saúde pública e sua importância no contexto brasileiro. Guia completo sobre prevenção, promoção e vigilância em saúde.',
    },
    {
      title: 'Epidemiologia: A Ciência por Trás da Prevenção',
      slug: 'epidemiologia-ciencia-prevencao',
      excerpt: 'Entenda como a epidemiologia nos ajuda a compreender e controlar doenças na população.',
      content: `# Epidemiologia: A Ciência por Trás da Prevenção

A epidemiologia é frequentemente chamada de "a ciência básica da saúde pública". Ela estuda a distribuição e os determinantes de eventos relacionados à saúde em populações específicas.

## Definindo Epidemiologia

A epidemiologia investiga:
- **Quem** é afetado pelas doenças
- **Onde** as doenças ocorrem
- **Quando** elas acontecem
- **Por que** elas se desenvolvem

## Métodos Epidemiológicos

### Estudos Descritivos
- Relatos de caso
- Séries de casos
- Estudos transversais

### Estudos Analíticos
- Estudos de coorte
- Estudos caso-controle
- Ensaios clínicos randomizados

## Aplicações Práticas

A epidemiologia é essencial para:
1. **Identificar fatores de risco**
2. **Avaliar intervenções**
3. **Orientar políticas públicas**
4. **Detectar surtos e epidemias**

## Exemplo: COVID-19

A pandemia de COVID-19 demonstrou a importância da epidemiologia na tomada de decisões em saúde pública. Através de estudos epidemiológicos, pudemos:

- Identificar grupos de risco
- Avaliar eficácia de vacinas
- Monitorar variantes do vírus
- Orientar medidas preventivas

## Conclusão

A epidemiologia fornece as ferramentas científicas necessárias para compreender e combater problemas de saúde pública, sendo fundamental para a proteção da população.`,
      published: true,
      category: 'epidemiologia',
      tags: ['epidemiologia', 'pesquisa', 'métodos científicos', 'prevenção'],
      metaTitle: 'Epidemiologia: Guia Completo da Ciência da Prevenção em Saúde',
      metaDescription: 'Aprenda sobre epidemiologia, seus métodos e aplicações na saúde pública. Descubra como esta ciência ajuda na prevenção e controle de doenças.',
    },
    {
      title: 'Tecnologia e Inovação na Saúde Pública',
      slug: 'tecnologia-inovacao-saude-publica',
      excerpt: 'Descubra como a tecnologia está revolucionando a forma como abordamos os desafios da saúde pública.',
      content: `# Tecnologia e Inovação na Saúde Pública

A revolução digital está transformando todos os aspectos da sociedade, e a saúde pública não é exceção. Novas tecnologias oferecem oportunidades sem precedentes para melhorar a saúde das populações.

## Telemedicina e Consultas Remotas

A telemedicina expandiu drasticamente durante a pandemia, permitindo:
- Consultas médicas à distância
- Monitoramento remoto de pacientes
- Redução de custos e tempo de deslocamento
- Maior acesso em áreas rurais

## Big Data e Inteligência Artificial

### Aplicações em Saúde Pública

1. **Análise preditiva** de surtos de doenças
2. **Otimização** de recursos hospitalares
3. **Personalização** de tratamentos
4. **Vigilância** epidemiológica em tempo real

## Aplicativos Móveis de Saúde

Os apps de saúde podem:
- Promover estilos de vida saudáveis
- Facilitar o acesso a informações
- Melhorar a adesão a tratamentos
- Coletar dados para pesquisa

## Desafios e Considerações Éticas

### Principais Preocupações

- **Privacidade** dos dados
- **Segurança** da informação
- **Desigualdade digital**
- **Qualidade** das informações

## Casos de Sucesso no Brasil

- **ConecteSUS**: plataforma digital do Ministério da Saúde
- **TeleSUS**: atendimento médico remoto
- **e-SUS**: sistema de informação da Atenção Básica

## O Futuro da Saúde Digital

As próximas inovações incluem:
- Internet das Coisas (IoT) em saúde
- Realidade virtual para treinamento
- Blockchain para segurança de dados
- Medicina de precisão baseada em genômica

## Conclusão

A integração inteligente da tecnologia na saúde pública pode levar a melhores resultados de saúde, maior eficiência e equidade no acesso aos cuidados de saúde.`,
      published: true,
      category: 'featured',
      tags: ['tecnologia', 'inovação', 'telemedicina', 'inteligência artificial', 'big data'],
      metaTitle: 'Tecnologia na Saúde Pública: Inovações que Transformam o Cuidado',
      metaDescription: 'Explore como a tecnologia está revolucionando a saúde pública. Telemedicina, IA, big data e apps de saúde na transformação do cuidado.',
      featuredImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
    },
    {
      title: 'Políticas Públicas de Saúde no Brasil: Conquistas e Desafios',
      slug: 'politicas-publicas-saude-brasil-conquistas-desafios',
      excerpt: 'Uma análise das principais políticas de saúde brasileiras, suas conquistas históricas e os desafios contemporâneos.',
      content: `# Políticas Públicas de Saúde no Brasil: Conquistas e Desafios

O Brasil possui um dos sistemas de saúde mais ambiciosos do mundo. Desde a criação do SUS, em 1988, o país tem buscado garantir o acesso universal à saúde como direito fundamental.

## Marco Histórico: Criação do SUS

O Sistema Único de Saúde representa uma das maiores conquistas sociais do país, baseado nos princípios:

### Princípios Doutrinários
- **Universalidade**: saúde para todos
- **Integralidade**: cuidado completo
- **Equidade**: tratamento igual para necessidades diferentes

### Princípios Organizativos
- **Descentralização**
- **Regionalização**
- **Hierarquização**
- **Participação popular**

## Principais Políticas e Programas

### Atenção Básica
- **Programa Saúde da Família (PSF)**
- **Agentes Comunitários de Saúde**
- **Núcleos de Apoio à Saúde da Família (NASF)**

### Políticas Específicas
1. **Política Nacional de Humanização**
2. **Programa Nacional de Imunizações**
3. **Política de Saúde Mental**
4. **Rede Cegonha**

## Conquistas Significativas

- Erradicação da poliomielite
- Controle de doenças tropicais
- Redução da mortalidade infantil
- Programa Nacional de DST/AIDS

## Desafios Contemporâneos

### Financiamento
- Subfinanciamento crônico
- EC 95/2016 (Teto de Gastos)
- Necessidade de novas fontes de recursos

### Gestão
- Fragmentação do cuidado
- Desigualdades regionais
- Falta de profissionais em algumas áreas

### Demográficos e Epidemiológicos
- Envelhecimento populacional
- Transição epidemiológica
- Doenças crônicas não transmissíveis

## Inovações Recentes

- **Cartão Nacional de Saúde**
- **Programa Farmácia Popular**
- **Mais Médicos**
- **SAMU 192**

## Perspectivas Futuras

Para enfrentar os desafios, são necessários:
1. **Aumento do financiamento**
2. **Melhoria da gestão**
3. **Incorporação de novas tecnologias**
4. **Fortalecimento da participação social**

## Conclusão

O SUS, apesar das dificuldades, representa um modelo de política pública inclusiva. Seu fortalecimento é essencial para garantir o direito à saúde para todos os brasileiros.`,
      published: false, // Draft post
      category: 'politicas',
      tags: ['SUS', 'políticas públicas', 'Brasil', 'direito à saúde', 'sistema de saúde'],
      metaTitle: 'Políticas de Saúde no Brasil: SUS, Conquistas e Desafios Atuais',
      metaDescription: 'Análise completa das políticas públicas de saúde no Brasil. História do SUS, principais programas, conquistas e desafios contemporâneos.',
    }
  ];

  // Create posts
  for (const postData of samplePosts) {
    console.log(`📝 Creating post: ${postData.title}`);
    
    // Calculate reading time (roughly 200 words per minute)
    const wordCount = postData.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    await prisma.post.create({
      data: {
        ...postData,
        readingTime,
        publishedAt: postData.published ? new Date() : null,
      },
    });
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:');
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  }); 