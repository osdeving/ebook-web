import { makeGeneratedPractice, mulberry32, powModNumber as powMod } from "../shared";

export const practice22DiscreteLog = makeGeneratedPractice({
      id: "2-2-discrete-log",
      anchor: "exp-2-2-log-mod-p-minus-one",
      title: "Encontre um logaritmo discreto pequeno",
      build(seed) {
        const options: Array<[number, number]> = [[11, 2], [13, 2], [17, 3], [19, 2], [23, 5]];
        const random = mulberry32(seed);
        const [p, g] = options[Math.floor(random() * options.length)]!;
        const x = 2 + Math.floor(random() * (p - 3));
        const h = powMod(g, x, p);
        const rows = Array.from({ length: Math.min(x + 1, 6) }, (_, i) => String.raw`\(${g}^{${i}}\equiv ${powMod(g, i, p)}\pmod{${p}}\)`).join(", ");
        return {
          prompt: String.raw`<p>Encontre o representante \(0\le x&lt;${p - 1}\) que satisfaz \(${g}^x\equiv ${h}\pmod{${p}}\).</p>`,
          answer: String(x),
          hints: [
            String.raw`Comece por \(${g}^0\equiv1\pmod{${p}}\) e multiplique sempre por ${g}.`,
            `Os primeiros valores são: ${rows}.`,
            `A solução aparece quando o resíduo se torna ${h}.`
          ],
          correctFeedback: `Você encontrou o índice de ${h} na sequência das potências de ${g}.`,
          wrongFeedback: `Não tente decidir se o expoente deve aumentar ou diminuir olhando para ${h}; construa a sequência modular.`,
          solution: String.raw`<p>Calculando sucessivamente as potências, chegamos a \(${g}^{${x}}\equiv ${h}\pmod{${p}}\). Portanto, \(x=${x}\) no intervalo pedido.</p>`
        };
      }
    });
