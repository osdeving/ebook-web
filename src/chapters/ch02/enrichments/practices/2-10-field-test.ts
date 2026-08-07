import { makePractice } from "../shared";

export const practice210FieldTest = makePractice({
      id: "2-10-field-test",
      anchor: "exp-2-10-1-teste-do-corpo",
      title: "Anel ou corpo?",
      prompt: String.raw`<p>Considere \(\mathbb Z/6\mathbb Z\) e \(\mathbb Z/5\mathbb Z\) com as operações usuais de classes de resíduos. No primeiro anel, \(\overline2\cdot\overline3=\overline0\); no segundo, toda classe não nula possui inverso. Qual conclusão está correta?</p>`,
      choices: [
        { value: "a", label: "Ambos são corpos." },
        { value: "b", label: String.raw`\(\mathbb Z/6\mathbb Z\) é corpo, mas \(\mathbb Z/5\mathbb Z\) não é.` },
        { value: "c", label: String.raw`\(\mathbb Z/5\mathbb Z\) é corpo; \(\mathbb Z/6\mathbb Z\) é apenas anel.` }
      ],
      check: (answer) => answer === "c",
      correctFeedback: "O módulo primo produz um corpo; o divisor de zero em módulo 6 impede inversos para todos os não nulos.",
      wrongFeedback: () => "Use o teste dos inversos e observe o produto não nulo que virou zero módulo 6.",
      hints: [
        "Num corpo, todo elemento não nulo precisa ser invertível.",
        "Um divisor de zero não pode ter inverso.",
        "Cinco é primo; seis é composto."
      ],
      solution: String.raw`<p>A resposta é <strong>C</strong>. \(\mathbb Z/5\mathbb Z\) é um corpo. Já \(\mathbb Z/6\mathbb Z\) contém divisores de zero e não é corpo.</p>`
    });
