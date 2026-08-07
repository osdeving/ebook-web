import { makePractice } from "../shared";

export const practice24RandomK = makePractice({
      id: "2-4-random-k",
      anchor: "exp-2-4-fresh-random-k",
      title: "Por que duas cifragens da mesma mensagem devem parecer diferentes?",
      prompt: String.raw`<p>No Elgamal, a mesma mensagem \(m\) é cifrada duas vezes usando valores novos de \(k\). Qual comportamento esperamos?</p>`,
      choices: [
        { value: "a", label: "Os dois pares cifrados devem ser idênticos." },
        { value: "b", label: "Os pares podem ser diferentes, embora decifrem para a mesma mensagem." },
        { value: "c", label: "A segunda cifração deixa de poder ser decifrada." }
      ],
      check: (answer) => answer === "b",
      correctFeedback: "O fator aleatório muda a aparência do texto cifrado sem mudar o texto claro recuperado.",
      wrongFeedback: () => "Separe duas perguntas: o que muda no par cifrado e o que precisa permanecer igual depois da decifração?",
      hints: [
        String.raw`O valor \(k\) aparece em \(c_1=g^k\).`,
        String.raw`Se \(k\) muda, ao menos \(c_1\) normalmente muda.`,
        String.raw`A correção da decifração remove o mascaramento correspondente a qualquer \(k\) válido.`
      ],
      solution: String.raw`<p>A resposta é <strong>B</strong>. Cada \(k\) produz um mascaramento novo. A decifração cancela precisamente o mascaramento usado naquela execução, recuperando o mesmo \(m\).</p>`
    });
