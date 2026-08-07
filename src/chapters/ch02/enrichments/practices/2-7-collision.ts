import { makePractice } from "../shared";

export const practice27Collision = makePractice({
      id: "2-7-collision",
      anchor: "exp-2-7-algebra-da-colisao",
      title: "Da colisão ao expoente",
      prompt: String.raw`<p>No encontro no meio, escrevemos \(x=qn+r\). Uma colisão mostra \(g^r=h(g^{-n})^q\). Qual é a próxima manipulação correta?</p>`,
      choices: [
        { value: "a", label: String.raw`Multiplicar ambos os lados por \(g^{qn}\), obtendo \(g^{qn+r}=h\).` },
        { value: "b", label: String.raw`Somar \(qn\) aos dois lados, como se fossem inteiros comuns.` },
        { value: "c", label: String.raw`Concluir que \(q=r\).` }
      ],
      check: (answer) => answer === "a",
      correctFeedback: String.raw`A multiplicação por \(g^{qn}\) cancela \(g^{-qn}\) no lado direito.`,
      wrongFeedback: () => "A igualdade é entre elementos do grupo, então a operação permitida é a operação do grupo, não uma soma de expoentes fora de uma potência.",
      hints: [
        String.raw`Reescreva \((g^{-n})^q\) como \(g^{-nq}\).`,
        "Queremos cancelar o expoente negativo.",
        String.raw`Multiplique os dois membros por \(g^{nq}\).`
      ],
      solution: String.raw`<p>A resposta é <strong>A</strong>: \(g^{qn}g^r=g^{qn}h g^{-qn}=h\). Portanto \(g^{qn+r}=h\), e o expoente candidato é \(x=qn+r\).</p>`
    });
