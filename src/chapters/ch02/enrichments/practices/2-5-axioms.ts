import { makePractice } from "../shared";

export const practice25Axioms = makePractice({
      id: "2-5-axioms",
      anchor: "exp-2-5-group-axioms",
      title: "Por que ℤ/6ℤ não é um corpo?",
      prompt: String.raw`<p>No anel \(\mathbb Z/6\mathbb Z\), o teste para ser corpo exige que toda classe não nula tenha inverso multiplicativo. Porém, \(\overline2\cdot\overline3=\overline0\), embora \(\overline2\) e \(\overline3\) não sejam zero. Qual requisito de corpo falha?</p>`,
      choices: [
        { value: "a", label: "Impede a associatividade." },
        { value: "b", label: "Impede que todo elemento não nulo tenha inverso multiplicativo." },
        { value: "c", label: "Impede o fechamento da multiplicação no conjunto de classes ℤ/6ℤ." }
      ],
      check: (answer) => answer === "b",
      correctFeedback: String.raw`Se \(\overline2\) tivesse inverso, multiplicar a igualdade por ele levaria a \(\overline3=\overline0\), contradição.`,
      wrongFeedback: () => String.raw`A operação continua fechada e associativa. Investigue o que ocorreria se \(\overline2\) pudesse ser cancelado.`,
      hints: [
        "O produto continua pertencendo a ℤ/6ℤ, então há fechamento.",
        String.raw`Tente supor que \(\overline2\) tem um inverso e multiplique a igualdade por ele.`,
        "Divisores de zero não podem ser unidades."
      ],
      solution: String.raw`<p>A resposta é <strong>B</strong>. Se \(u\overline2=\overline1\), então \(u(\overline2\,\overline3)=\overline3\), mas o lado esquerdo também seria \(u\overline0=\overline0\).</p>`
    });
