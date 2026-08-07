import { inverseModNumber as inverseMod, makeGeneratedPractice, mulberry32 } from "../shared";

export const practice28Crt = makeGeneratedPractice({
      id: "2-8-crt",
      anchor: "exp-2-8-construir-solucao",
      title: "Sincronize duas congruências",
      intro: "As pistas exibem apenas o começo da progressão: continue somando o módulo se o encontro ainda não apareceu na lista mostrada.",
      build(seed) {
        const random = mulberry32(seed);
        const pairs: Array<[number, number]> = [[3, 5], [4, 7], [5, 8], [5, 9], [7, 8], [7, 9]];
        const [m, n] = pairs[Math.floor(random() * pairs.length)]!;
        const a = Math.floor(random() * m);
        const b = Math.floor(random() * n);
        let x = a;
        while (x % n !== b) x += m;
        const inv = inverseMod(m, n);
        return {
          prompt: String.raw`<p>Encontre o menor \(x\ge0\) tal que \(x\equiv${a}\pmod{${m}}\) e \(x\equiv${b}\pmod{${n}}\).</p>`,
          answer: String(x),
          hints: [
            `Liste números congruentes a ${a} módulo ${m}: ${Array.from({ length: 5 }, (_, i) => a + i * m).join(", ")}, … Continue somando ${m} se o encontro ainda não apareceu.`,
            `Procure nessa lista — e, se necessário, nos termos seguintes — o primeiro número cujo resto por ${n} seja ${b}.`,
            String.raw`Pelo método construtivo, escreva \(x=${a}+${m}t\) e resolva \(${m}t\equiv${b - a}\pmod{${n}}\). O inverso de ${m} módulo ${n} é ${inv}.`
          ],
          correctFeedback: `Todas as soluções são congruentes a ${x} módulo ${m * n}.`,
          wrongFeedback: `Verifique separadamente os dois restos; uma resposta precisa satisfazer ambos ao mesmo tempo.`,
          solution: String.raw`<p>O menor encontro é \(x=${x}\): temos \(${x}\bmod${m}=${a}\) e \(${x}\bmod${n}=${b}\). Pelo TCR, a solução é única módulo ${m * n}.</p>`
        };
      }
    });
