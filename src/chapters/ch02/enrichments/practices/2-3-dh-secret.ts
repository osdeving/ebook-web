import { makeGeneratedPractice, mulberry32, powModNumber as powMod } from "../shared";

export const practice23DhSecret = makeGeneratedPractice({
      id: "2-3-dh-secret",
      anchor: "exp-2-3-dh-step-by-step",
      title: "Reconstrua o segredo compartilhado",
      build(seed) {
        const random = mulberry32(seed);
        const p = 23;
        const g = 5;
        const a = 2 + Math.floor(random() * 7);
        const b = 3 + Math.floor(random() * 7);
        const A = powMod(g, a, p);
        const B = powMod(g, b, p);
        const secret = powMod(B, a, p);
        return {
          prompt: String.raw`<p>Use \(p=${p}\), \(g=${g}\), segredo de Alice \(a=${a}\) e segredo de Bob \(b=${b}\). Os valores públicos são \(A=${A}\) e \(B=${B}\). Qual é o segredo compartilhado?</p>`,
          answer: String(secret),
          hints: [
            String.raw`Alice calcula \(B^a\bmod p=${B}^{${a}}\bmod${p}\).`,
            String.raw`Bob poderia calcular \(A^b\bmod p=${A}^{${b}}\bmod${p}\).`,
            String.raw`As duas expressões são iguais a \(g^{ab}\bmod p\).`
          ],
          correctFeedback: `Alice e Bob chegam ao mesmo resíduo ${secret}.`,
          wrongFeedback: "Reduza módulo 23 durante a exponenciação para manter os números pequenos.",
          solution: String.raw`<p>Temos \(B^a\equiv${B}^{${a}}\equiv${secret}\pmod{23}\). Também \(A^b\equiv${A}^{${b}}\equiv${secret}\pmod{23}\).</p>`
        };
      }
    });
