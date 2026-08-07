# Créditos e situação de direitos do capítulo 3

## Obra de origem

- Jeffrey Hoffstein, Jill Pipher e Joseph H. Silverman. *An Introduction to
  Mathematical Cryptography*. 2ª edição. Springer, 2014. Undergraduate Texts
  in Mathematics. Capítulo 3, “Integer Factorization and RSA”, páginas
  117–191, incluindo os exercícios. DOI do livro:
  <https://doi.org/10.1007/978-1-4939-1711-2>.
- O livro integral fornecido ao projeto foi usado apenas como fonte de trabalho
  local. O PDF e as extrações intermediárias em `sources/` não são
  versionados.

## Tradução

Esta é uma tradução não oficial para português brasileiro, preparada como
material de estudo. Títulos, ordem, numeração, exemplos, tabelas, figuras,
notas e exercícios traduzidos são mantidos numa camada-fonte verificável por
hash.

A obra de origem declara copyright da Springer Science+Business Media New
York, 2014. A licença MIT deste repositório cobre somente o código original do
framework; ela não concede direitos sobre a obra de origem nem sobre esta
tradução. Autores, editora e demais titulares conservam os direitos aplicáveis.
Quem redistribuir ou publicar o conteúdo deve assegurar a autorização exigida
em sua jurisdição.

## Recursos complementares

As explicações, soluções, pistas, histórias, leituras e interfaces dos
laboratórios foram redigidas especificamente para esta edição. As fontes abaixo
serviram para conferência histórica, matemática e técnica; nenhum texto ou
interface de terceiros foi incorporado. Salvo indicação em contrário, os
recursos são oferecidos apenas como links e continuam sujeitos aos termos de
seus titulares. Acesso em **7 de agosto de 2026**.

### RSA, ataques e padrões

- Rivest, Shamir e Adleman,
  [“A Method for Obtaining Digital Signatures and Public-Key Cryptosystems”](https://people.csail.mit.edu/rivest/Rsapaper.pdf),
  artigo de 1978 hospedado pelo MIT, embasa a história e a leitura do RSA
  original. O artigo permanece sob copyright da ACM; foi usado como link e
  fonte de paráfrase.
- O [perfil de James Ellis no GCHQ](https://www.gchq.gov.uk/person/james-ellis),
  os [termos do GCHQ](https://www.gchq.gov.uk/section/about-this-website/terms-and-conditions),
  a [história publicada pelo MIT](https://news.mit.edu/2011/rivest-unlocks-cryptographys-past-looks-toward-future)
  e a [história oral de Ronald Rivest](https://archive.computerhistory.org/resources/access/text/2017/07/102717255-05-01-acc.pdf)
  foram consultados para distinguir as descobertas pública e anteriormente
  classificadas. Os materiais permanecem apenas referenciados.
- [RFC 8017 — PKCS #1 v2.2](https://www.rfc-editor.org/info/rfc8017/) foi
  consultada para RSAES-OAEP e para distinguir a permutação matemática do RSA
  de um esquema de produção. Textos da RFC Series seguem as
  [IETF Trust Legal Provisions](https://trustee.ietf.org/documents/trust-legal-provisions/).
- [FIPS 186-5](https://csrc.nist.gov/pubs/fips/186-5/final),
  [NIST SP 800-56B Rev. 2](https://csrc.nist.gov/pubs/sp/800/56/b/r2/final),
  [SP 800-57 Parte 1 Rev. 5](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final)
  e [SP 800-131A Rev. 2](https://csrc.nist.gov/pubs/sp/800/131/a/r2/final)
  sustentam as notas atuais sobre geração de chaves, força de segurança e
  transições. A [reafirmação publicada pelo NIST em
  2026](https://csrc.nist.gov/news/2026/nist-to-revise-key-establishment-recommendations)
  foi usada para contextualizar a vigência das recomendações. Materiais do
  NIST são, em geral, obras do governo federal dos Estados Unidos; veja a
  [orientação institucional de copyright](https://www.nist.gov/nist-research-library/library-faqs).
- Dan Boneh,
  [“Twenty Years of Attacks on the RSA Cryptosystem”](https://crypto.stanford.edu/~dabo/abstracts/RSAattack-survey.html),
  e Michael Wiener,
  [“Cryptanalysis of Short RSA Secret Exponents”](https://doi.org/10.1109/18.54902),
  foram usados para conferir os módulos sobre RSA cru, expoente secreto curto
  e ataques de implementação. Ambos permanecem sob direitos de seus autores ou
  editoras e são fornecidos apenas como links.

### Primalidade, números de Carmichael e distribuição dos primos

- Gary L. Miller,
  [“Riemann’s Hypothesis and Tests for Primality”](https://www.cs.cmu.edu/~glmiller/Publications/b2hd-Mi76.html),
  Michael O. Rabin,
  [“Probabilistic Algorithm for Testing Primality”](https://doi.org/10.1016/0022-314X(80)90084-0),
  e Agrawal, Kayal e Saxena,
  [“PRIMES is in P”](https://www.cse.iitk.ac.in/users/manindra/algebra/primality_v6.pdf),
  fundamentam as histórias e leituras sobre testes determinísticos e
  probabilísticos. São fornecidos como links para cópias autorais,
  institucionais ou páginas editoriais.
- R. D. Carmichael,
  [“On Composite Numbers Which Satisfy the Fermat Congruence”](https://doi.org/10.1080/00029890.1912.11997658),
  Alford, Granville e Pomerance,
  [“There Are Infinitely Many Carmichael Numbers”](https://annals.math.princeton.edu/1994/193-3/p06),
  e o [levantamento de Carl Pomerance](https://math.dartmouth.edu/~carlp/carmsurvey.pdf)
  foram consultados para o contexto histórico e o critério de Korselt.
- A [página do problema da hipótese de
  Riemann](https://www.claymath.org/riemann/), a
  [descrição de Enrico Bombieri](https://www.claymath.org/wp-content/uploads/2022/05/riemann.pdf)
  e a [coleção do manuscrito de
  1859](https://www.claymath.org/collections/riemanns-1859-manuscript/) do
  Clay Mathematics Institute apoiam a leitura sobre a distribuição dos primos.
  O manuscrito histórico está em domínio público; imagens, traduções e textos
  modernos seguem os termos do instituto.

### Fatoração, números suaves e crivos

- J. M. Pollard,
  [“Theorems on Factorization and Primality Testing”](https://doi.org/10.1017/S0305004100049252),
  foi usado para a origem do método \(p-1\). A página editorial é oferecida
  apenas como link.
- Carl Pomerance,
  [“Smooth Numbers and the Quadratic Sieve”](https://math.dartmouth.edu/~carlp/PDF/qs08.pdf)
  e [“A Tale of Two Sieves”](https://www.ams.org/notices/199612/pomerance.pdf),
  e Canfield, Erdős e Pomerance,
  [“On a Problem of Oppenheim Concerning Factorisatio
  Numerorum”](https://doi.org/10.1016/0022-314X(83)90002-1),
  embasam os módulos de lisura, crivo quadrático e análise assintótica.
- O relatório do CWI
  [“A World Wide Number Field Sieve Factoring Record: on to 512
  Bits”](https://ir.cwi.nl/pub/1940/1940D.pdf) e a apresentação
  [“Large-Scale Computational Records for Public-Key
  Cryptanalysis”](https://csrc.nist.gov/presentations/2024/large-scale-computational-records-for-public-key-c)
  foram usados para contextualizar o desenvolvimento e a escala do crivo do
  corpo de números.
- As páginas oficiais do GIMPS
  [“How It Works”](https://www.mersenne.org/various/works.php),
  [lista dinâmica de primos](https://www.mersenne.org/primes/) e
  [comunicado do primo \(2^{136279841}-1\)](https://www.mersenne.org/primes/press/M136279841.html)
  sustentam os itens datados sobre primos de Mersenne. O conteúdo do site
  permanece sob seus próprios termos.

### Cálculo de índices, reciprocidade e cifragem probabilística

- Menezes, van Oorschot e Vanstone,
  [*Handbook of Applied Cryptography*](https://cacr.uwaterloo.ca/hac/index.html),
  foi consultado para algoritmos de teoria dos números e cálculo de índices. A
  disponibilização eletrônica é autorizada pela CRC; o copyright permanece com
  a editora.
- [NIST SP 800-186](https://csrc.nist.gov/pubs/sp/800/186/final) foi usado no
  contraste cuidadoso entre cálculo de índices em corpos finitos e grupos de
  curvas elípticas.
- [DLMF §27.9 — Quadratic
  Characters](https://dlmf.nist.gov/27.9) e a digitalização das
  [*Disquisitiones Arithmeticae* de
  Gauss](https://library.si.edu/digital-library/book/disquisitionesa00gaus)
  apoiam a leitura sobre reciprocidade quadrática. A obra de Gauss está em
  domínio público e a digitalização do Smithsonian é indicada como CC0.
- Goldwasser e Micali,
  [“Probabilistic Encryption”](https://people.csail.mit.edu/silvio/Selected%20Scientific%20Papers/Encryption/Probabilistic_Encryption.pdf),
  fundamenta a história e os módulos sobre cifragem probabilística. A cópia é
  hospedada pelos autores no MIT; o artigo permanece sob copyright editorial e
  é utilizado somente por link e paráfrase.
