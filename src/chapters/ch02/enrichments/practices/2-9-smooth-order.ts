import { makePractice } from "../shared";

export const practice29SmoothOrder = makePractice({
      id: "2-9-smooth-order",
      anchor: "exp-2-9-ordem-lisa",
      title: "O que torna uma ordem perigosa para o PLD?",
      prompt: `<p>Compare duas ordens de grupo aproximadamente do mesmo tamanho. A primeira se fatora apenas em potências de primos pequenos; a segunda contém um fator primo muito grande. Qual tende a favorecer Pohlig–Hellman?</p>`,
      choices: [
        { value: "smooth", label: "A primeira, porque o problema se decompõe em PLDs pequenos." },
        { value: "large", label: "A segunda, porque um primo grande sempre torna o algoritmo mais rápido." },
        { value: "same", label: "As duas são equivalentes; a fatoração da ordem não importa." }
      ],
      check: (answer) => answer === "smooth",
      correctFeedback: "Pohlig–Hellman herda seu custo das componentes de ordem potência de primo; componentes pequenas são mais fáceis.",
      wrongFeedback: () => "Pense no tamanho do maior subproblema depois de decompor a ordem em potências de primos.",
      hints: [
        "O algoritmo resolve um problema para cada fator potência de primo.",
        "O custo é dominado pelas componentes mais difíceis.",
        "Uma ordem lisa não deixa um grande fator primo como obstáculo."
      ],
      solution: `<p>A resposta é a <strong>primeira ordem</strong>. Por isso, em aplicações criptográficas, não basta que o grupo seja grande: é preciso controlar a ordem do elemento usado e seus fatores.</p>`
    });
