import { makePractice } from "../shared";

export const practice26Growth = makePractice({
      id: "2-6-growth",
      anchor: "exp-2-6-tres-regimes-de-tempo",
      title: "Reconheça o regime de crescimento",
      prompt: String.raw`<p>Quando o tamanho da entrada aumenta de \(k\) para \(k+1\), uma busca com custo \(2^k\) aproximadamente dobra. Qual classificação descreve esse exemplo?</p>`,
      choices: [
        { value: "linear", label: "Crescimento linear" },
        { value: "polynomial", label: "Crescimento polinomial" },
        { value: "exponential", label: "Crescimento exponencial" }
      ],
      check: (answer) => answer === "exponential",
      correctFeedback: "A variável aparece no expoente; acrescentar um bit multiplica por aproximadamente 2 o espaço de busca.",
      wrongFeedback: () => String.raw`Observe onde \(k\) aparece: como fator, como potência fixa ou no expoente?`,
      hints: [
        String.raw`Compare \(2^{k+1}\) com \(2^k\).`,
        String.raw`Temos \(2^{k+1}=2\cdot2^k\).`,
        "A variável está no expoente."
      ],
      solution: String.raw`<p>É um exemplo de crescimento <strong>exponencial</strong>. Isso não significa que toda função exponencial seja exatamente \(2^k\), mas \(2^k\) é o modelo mais direto aqui.</p>`
    });
