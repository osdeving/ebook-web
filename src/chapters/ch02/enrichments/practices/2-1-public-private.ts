import { makePractice } from "../shared";

export const practice21PublicPrivate = makePractice({
      id: "2-1-public-private",
      anchor: "exp-2-1-public-private-key",
      title: "O que pode ser público sem deixar de existir um segredo?",
      prompt: `<p>Alice publica um procedimento que qualquer pessoa pode usar para lhe enviar uma mensagem protegida. Qual afirmação descreve corretamente o papel das chaves?</p>`,
      choices: [
        { value: "a", label: "A chave pública precisa ficar escondida; a privada pode circular." },
        { value: "b", label: "A chave pública pode circular; a chave privada permanece sob controle de Alice." },
        { value: "c", label: "As duas chaves são apenas nomes diferentes para o mesmo dado." }
      ],
      check: (answer) => answer === "b",
      correctFeedback: "A assimetria está justamente em permitir que uma informação seja divulgada sem divulgar o segredo usado na operação inversa.",
      wrongFeedback: () => "Pergunte qual informação deve continuar exclusiva de Alice para que só ela execute a operação reservada.",
      hints: [
        "Pense na chave que pode ser impressa num cartão de visita.",
        "Divulgar o mecanismo de proteção não deve entregar o mecanismo reservado de reversão.",
        "A chave pública circula; a privada permanece privada."
      ],
      solution: `<p>A resposta é <strong>B</strong>. O sistema é projetado para que a chave pública permita uma operação útil sem oferecer um caminho eficiente para reconstruir a chave privada.</p>`
    });
