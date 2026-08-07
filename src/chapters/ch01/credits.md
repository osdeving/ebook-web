# Créditos e situação de direitos do capítulo 1

## Obra de origem

- Jeffrey Hoffstein, Jill Pipher e Joseph H. Silverman. *An Introduction to
  Mathematical Cryptography*. 2ª edição. Springer, 2014. Undergraduate Texts
  in Mathematics. Capítulo 1, “An Introduction to Cryptography”, páginas
  1–59, incluindo os exercícios. DOI do livro:
  <https://doi.org/10.1007/978-1-4939-1711-2>.
- O livro integral fornecido ao projeto foi usado apenas como fonte de trabalho
  local. O PDF e as extrações intermediárias em `sources/` não são versionados.

## Tradução

Esta é uma tradução não oficial para português brasileiro, preparada como
material de estudo. Títulos, ordem, numeração, exemplos, notas e exercícios
traduzidos são mantidos numa camada-fonte verificável por hash.

A obra de origem declara copyright da Springer Science+Business Media New
York, 2014. A licença MIT deste repositório cobre somente o código original do
framework; ela não concede direitos sobre a obra de origem nem sobre esta
tradução. Autores, editora e demais titulares conservam os direitos aplicáveis.
Quem redistribuir ou publicar o conteúdo deve assegurar a autorização exigida
em sua jurisdição.

## Recursos complementares

Soluções comentadas, links bibliográficos e controles de navegação pertencem
às camadas editoriais do Ebook Web. Eles são independentes da tradução-fonte e
podem ser ocultados sem remover nenhum trecho do capítulo ou dos exercícios.

As explicações, soluções, pistas graduais, linhas do tempo, roteiros de leitura
e laboratórios foram redigidos especificamente para esta edição. As fontes
abaixo serviram para conferência histórica, matemática e técnica; o projeto não
incorporou textos, imagens ou interfaces de terceiros. Salvo indicação em
contrário, os recursos externos são oferecidos apenas como links e continuam
sujeitos aos termos de seus titulares. Acesso em **7 de agosto de 2026**.

### História da criptografia e da matemática

- [Suetônio, *Divus Julius*, 56 — Perseus Digital Library](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.02.0132%3Alife%3Djul.%3Achapter%3D56)
  e o [registro de edições no Scaife/Perseus](https://atlas.perseus.tufts.edu/library/urn:cts:latinLit:phi1348.abo011/)
  embasaram a distinção entre o documento antigo e a lenda posterior sobre a
  cifra de César.
- O [Museum of Antiquities da University of New England](https://www.une.edu.au/info-for/visitors/museums/museum-of-antiquities/codebreaker-challenge/alberti-cipher)
  e a [Carnegie Mellon University Libraries](https://www.library.cmu.edu/about/news/2023-01/Alberti-La-Cifra)
  serviram à história da análise de frequências, de Alberti e dos discos de
  cifra; o [National Museum of Computing](https://www.tnmoc.org/bh-2-the-enigma-machine)
  foi consultado para distinguir os componentes das variantes da Enigma.
- A edição comentada do [Livro VII dos *Elementos*, por David E. Joyce](https://mathcs.clarku.edu/~djoyce/java/elements/bookVII/bookVII.html),
  a [biografia de Euclides no MacTutor](https://mathshistory.st-andrews.ac.uk/Biographies/Euclid/)
  e o [índice histórico de teoria dos números](https://mathshistory.st-andrews.ac.uk/HistTopics/category-number-theory/)
  orientaram a trilha sobre o algoritmo de Euclides.
- Colin R. Fletcher, [“A reconstruction of the Frenicle–Fermat
  correspondence of 1640”](https://doi.org/10.1016/0315-0860(91)90371-4),
  e Erik R. Tou, [“Math Origins: The Totient Function”](https://digitalcommons.tacoma.uw.edu/ias_pub/853/),
  embasaram a linha Fermat–Euler e a evolução do totiente.
- O [artigo contextual](https://www.archives.gov/publications/prologue/2016/winter/zimmermann-telegram),
  o [fac-símile do telegrama](https://www.archives.gov/exhibits/american_originals/zimm1.html)
  nos U.S. National Archives e a [história de Room 40 nos arquivos do governo
  britânico](https://history.blog.gov.uk/2017/01/16/the-zimmermann-telegram-and-room-40/)
  fundamentaram o episódio Zimmermann.
- Jennifer Wilcox, [*Solving the Enigma*](https://www.nsa.gov/portals/75/documents/about/cryptologic-heritage/historical-figures-publications/publications/wwii/solving_enigma.pdf),
  o perfil de [Gordon Welchman no Bletchley Park](https://bletchleypark.org.uk/wp-content/uploads/record_attachments/1839.pdf)
  e a exposição [*The Magic of PURPLE*](https://www.nsa.gov/History/National-Cryptologic-Museum/Exhibits-Artifacts/Exhibit-View/Article/2718925/the-magic-of-purple/)
  deram base ao módulo sobre trabalho coletivo e criptoanálise na guerra.
- O [Center for Cryptologic History](https://www.nsa.gov/History/Cryptologic-History/Center-Cryptologic-History/)
  e o [National Cryptologic Museum](https://www.nsa.gov/History/National-Cryptologic-Museum/Exhibits-Artifacts/Exhibit-View/Article/2718496/18th-century-cipher-device/)
  foram usados como portais documentais; a folha [*Cryptology: Fun
  Facts*](https://www.nsa.gov/portals/75/documents/about/cryptologic-heritage/historical-figures-publications/publications/misc/fun-facts-sheet.pdf)
  serviu somente para conferência histórica do laboratório de César.
- O ensaio de [Auguste Kerckhoffs na Gallica/BnF](https://gallica.bnf.fr/ark:/12148/bd6t57758983),
  a [patente de Gilbert Vernam](https://patents.google.com/patent/US1310719A/en)
  e o artigo de Claude Shannon,
  [“Communication Theory of Secrecy Systems”](https://doi.org/10.1002/j.1538-7305.1949.tb00928.x),
  sustentaram a linha sistema público–chave secreta–sigilo perfeito.
- Diffie e Hellman, [“New Directions in
  Cryptography”](https://ee.stanford.edu/~hellman/publications/24.pdf), e o
  [perfil institucional de James Ellis no GCHQ](https://www.gchq.gov.uk/person/james-ellis)
  compõem a leitura sobre as origens documentadas da criptografia de chave
  pública.

### Matemática, padrões e ferramentas

- O [NIST DLMF, §27.2](https://dlmf.nist.gov/27.2), a
  [documentação do SageMath](https://doc.sagemath.org/html/en/tutorial/index.html),
  sua [referência](https://doc.sagemath.org/html/en/reference/) e a
  [documentação do PARI/GP](https://pari.math.u-bordeaux.fr/doc.html) — também
  disponível como [GP no navegador](https://pari.math.u-bordeaux.fr/gp.html) —
  apoiaram as leituras de aritmética modular e experimentação.
- [The PrimePages](https://t5k.org/) e o [catálogo de funções do
  CrypTool](https://www.cryptool.org/en/functions/) foram indicados para
  exploração de primos e criptoanálise clássica. A visualização de frequências
  também foi conferida na [ferramenta do CrypTool](https://www.cryptool.org/en/cto/frequency-analysis/).
- [RFC 20](https://www.rfc-editor.org/info/rfc20/) e a
  [versão corrente do padrão Unicode](https://www.unicode.org/versions/latest/)
  embasaram a leitura sobre representação de caracteres.
- [FIPS 197 — AES](https://csrc.nist.gov/pubs/fips/197/final),
  [NIST SP 800-57 Parte 1 Rev. 5](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final),
  [NIST SP 800-90A Rev. 1](https://csrc.nist.gov/pubs/sp/800/90/a/r1/final),
  [NIST SP 800-90C](https://csrc.nist.gov/pubs/sp/800/90/c/final) e
  [RFC 4086](https://www.rfc-editor.org/info/rfc4086/) sustentaram as notas sobre
  AES, força de segurança, entropia e geradores pseudoaleatórios.
- O capítulo 2 do [*Handbook of Applied
  Cryptography*](https://cacr.uwaterloo.ca/hac/about/chap2.pdf) foi consultado
  para algoritmos aritméticos dos laboratórios. [NIST SP 800-56A Rev.
  3](https://csrc.nist.gov/pubs/sp/800/56/a/r3/final) e
  [RFC 9180 — Hybrid Public Key Encryption](https://www.ietf.org/rfc/rfc9180.html)
  serviram à distinção entre cifragem simétrica, estabelecimento assimétrico e
  construções híbridas.

Materiais do NIST, dos U.S. National Archives e da NSA são, em geral, obras do
governo federal dos Estados Unidos; itens ou imagens com crédito próprio podem
ter condições diferentes. O material britânico pode estar sob Crown copyright
e Open Government Licence quando assim indicado. SageMath documenta sua
licença CC BY-SA 3.0; textos da RFC Series seguem as IETF Trust Legal
Provisions; Unicode, Perseus, editoras, museus e demais sites mantêm seus termos
próprios. Aqui todos permanecem apenas referenciados por hiperlink.
