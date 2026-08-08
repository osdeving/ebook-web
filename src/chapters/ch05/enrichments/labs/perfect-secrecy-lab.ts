import { defineLab, node, table } from "../shared/lab-runtime";

function entropy(probabilities: readonly number[]): number {
  return -probabilities.reduce((sum, probability) => (
    probability > 0 ? sum + probability * Math.log2(probability) : sum
  ), 0);
}

function readProbability(input: HTMLInputElement, label: string): { ok: true; value: number } | { ok: false; message: string } {
  if (input.value.trim() === "") return { ok: false, message: label + " precisa ser preenchida." };
  const value = Number(input.value);
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    return { ok: false, message: label + " precisa estar entre 0 e 1." };
  }
  return { ok: true, value };
}

export const perfectSecrecyLab = defineLab({
  id: "lab-5-6-sigilo-perfeito",
  anchor: "sec-5-6-1",
  title: "Canal de um bit: quando o texto cifrado não ensina nada",
  duration: "Seção 5.6.1 · 10–15 min",
  tags: ["section:5.6", "sigilo-perfeito", "one-time-pad", "informacao-mutua"],
  html: [
    '<p class="lab-intro">No sistema \\(C=M\\oplus K\\), altere a fonte de mensagens e a chave. Sigilo perfeito não exige mensagens uniformes; exige que observar C não mude a distribuição de M.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Pr(M = 0)<input data-message type="number" min="0" max="1" step="0.01" value="0.9"></label>',
    '<label>Pr(K = 0)<input data-key type="number" min="0" max="1" step="0.01" value="0.5"></label>',
    '</div><div class="lab-actions"><button type="submit">Atualizar canal</button><button type="button" data-uniform>Uniformizar chave</button><button type="button" data-bias>Enviesar chave</button><button type="button" data-reset>Reiniciar</button></div></form>',
    '<div class="lab-result" data-output role="region" aria-label="Distribuições do canal de sigilo perfeito"></div>',
    '<p class="lab-note">A informação mútua zero é a assinatura probabilística do sigilo perfeito neste modelo. Quando as duas mensagens têm probabilidade positiva, uma chave enviesada vaza informação mesmo que pareça “aleatória”; numa fonte degenerada, M já é conhecido e nenhum canal pode revelar informação adicional.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const messageInput = tools.q<HTMLInputElement>("[data-message]");
    const keyInput = tools.q<HTMLInputElement>("[data-key]");

    const run = (report = true) => {
      const message = readProbability(messageInput, "Pr(M = 0)");
      const key = readProbability(keyInput, "Pr(K = 0)");
      if (!message.ok || !key.ok) {
        if (report) tools.feedback(!message.ok ? message.message : key.ok ? "" : key.message, "error");
        return;
      }
      const p = message.value;
      const q = key.value;
      const joint = [
        [p * q, p * (1 - q)],
        [(1 - p) * (1 - q), (1 - p) * q],
      ];
      const cipher = [joint[0]![0]! + joint[1]![0]!, joint[0]![1]! + joint[1]![1]!];
      const posterior00 = cipher[0]! > 0 ? joint[0]![0]! / cipher[0]! : Number.NaN;
      const posterior01 = cipher[1]! > 0 ? joint[0]![1]! / cipher[1]! : Number.NaN;
      const conditionalEntropy = cipher.reduce((sum, probability, cipherValue) => {
        if (probability === 0) return sum;
        const posterior = joint[0]![cipherValue]! / probability;
        return sum + probability * entropy([posterior, 1 - posterior]);
      }, 0);
      const messageEntropy = entropy([p, 1 - p]);
      const mutualInformation = Math.max(0, messageEntropy - conditionalEntropy);
      const perfect = mutualInformation < 1e-12;
      const formatPosterior = (value: number) => Number.isNaN(value) ? "indefinido" : value.toFixed(6);
      tools.output(
        node("p", perfect
          ? "Sigilo perfeito: a observação de C não altera a crença sobre M."
          : "Há vazamento: os posteriores dependem do texto cifrado observado."),
        table("Massa conjunta Pr(M=m, C=c)", ["mensagem", "C = 0", "C = 1"], [
          ["M = 0", joint[0]![0]!.toFixed(6), joint[0]![1]!.toFixed(6)],
          ["M = 1", joint[1]![0]!.toFixed(6), joint[1]![1]!.toFixed(6)],
        ]),
        table("Diagnóstico informacional", ["medida", "valor"], [
          ["Pr(M = 0)", p.toFixed(6)],
          ["Pr(M = 0 | C = 0)", formatPosterior(posterior00)],
          ["Pr(M = 0 | C = 1)", formatPosterior(posterior01)],
          ["H(M)", messageEntropy.toFixed(6) + " bits"],
          ["H(M | C)", conditionalEntropy.toFixed(6) + " bits"],
          ["I(M; C)", mutualInformation.toFixed(6) + " bits"],
        ]),
      );
      if (report) tools.feedback(perfect ? "Independência verificada." : "Vazamento quantificado.", perfect ? "success" : "warning");
    };

    tools.on(form, "submit", ((event: Event) => {
      event.preventDefault();
      run();
    }) as EventListener);
    tools.on(tools.q("[data-uniform]"), "click", (() => {
      keyInput.value = "0.5";
      run();
    }) as EventListener);
    tools.on(tools.q("[data-bias]"), "click", (() => {
      keyInput.value = "0.8";
      run();
    }) as EventListener);
    tools.on(tools.q("[data-reset]"), "click", (() => {
      tools.reset(form);
      run(false);
    }) as EventListener);
    run(false);
  },
});
