import { defineLab, node, table } from "../shared/lab-runtime";

function letters(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").replace(/[^A-Za-z]/g, "").toUpperCase();
}

function transform(message: string, key: string, decrypt: boolean): {
  output: string;
  rows: string[][];
} {
  let position = 0;
  const rows: string[][] = [];
  const output = [...message.normalize("NFD").replace(/\p{M}/gu, "")].map((character) => {
    if (!/[A-Za-z]/.test(character)) return character;
    const lower = character === character.toLowerCase();
    const input = character.toUpperCase().charCodeAt(0) - 65;
    const shift = key.charCodeAt(position % key.length) - 65;
    const result = (input + (decrypt ? -shift : shift) + 26) % 26;
    const transformed = String.fromCharCode(65 + result);
    if (rows.length < 60) {
      rows.push([
        String(position + 1),
        String.fromCharCode(65 + input),
        key[position % key.length]!,
        decrypt ? "−" : "+",
        transformed,
      ]);
    }
    position += 1;
    return lower ? transformed.toLowerCase() : transformed;
  }).join("");
  return { output, rows };
}

function coincidenceIndex(value: string): number {
  const clean = letters(value);
  if (clean.length < 2) return 0;
  const counts = new Map<string, number>();
  [...clean].forEach((letter) => counts.set(letter, (counts.get(letter) ?? 0) + 1));
  const pairs = [...counts.values()].reduce((sum, count) => sum + count * (count - 1), 0);
  return pairs / (clean.length * (clean.length - 1));
}

function columnCoincidences(value: string, maximumPeriod = 12): string[][] {
  const clean = letters(value);
  const limit = Math.min(maximumPeriod, Math.max(1, Math.floor(clean.length / 2)));
  return Array.from({ length: limit }, (_, offset) => {
    const period = offset + 1;
    const columns = Array.from({ length: period }, () => "");
    [...clean].forEach((letter, index) => {
      columns[index % period] += letter;
    });
    const indices = columns.map(coincidenceIndex);
    const average = indices.reduce((sum, value) => sum + value, 0) / period;
    return [
      String(period),
      average.toFixed(6),
      indices.map((value) => value.toFixed(6)).join("; "),
    ];
  });
}

function repetitions(value: string): string {
  const clean = letters(value);
  const positions = new Map<string, number[]>();
  for (let index = 0; index + 3 <= clean.length; index += 1) {
    const gram = clean.slice(index, index + 3);
    const list = positions.get(gram) ?? [];
    list.push(index);
    positions.set(gram, list);
  }
  const found = [...positions]
    .filter(([, indexes]) => indexes.length > 1)
    .slice(0, 8)
    .map(([gram, indexes]) => {
      const distances: number[] = [];
      for (let first = 0; first < indexes.length; first += 1) {
        for (let second = first + 1; second < indexes.length; second += 1) {
          distances.push(indexes[second]! - indexes[first]!);
        }
      }
      return gram + ": " + distances.join(", ");
    });
  return found.length > 0 ? found.join(" · ") : "Nenhum trigrama repetido nesta amostra.";
}

export const vigenereWorkbenchLab = defineLab({
  id: "lab-5-2-vigenere-e-kasiski",
  anchor: "sec-5-2",
  title: "Oficina Vigenère: cifra, colunas e rastros de Kasiski",
  duration: "Seção 5.2 · 12–18 min",
  tags: ["section:5.2", "vigenere", "kasiski", "indice-de-coincidencia"],
  html: [
    '<p class="lab-intro">Cifre ou decifre sem enviar o texto para fora do navegador. A tabela expõe a aritmética letra por letra; o diagnóstico procura todas as distâncias entre trigramas repetidos e mede o índice de coincidência global e por colunas candidatas.</p>',
    '<form data-form><div class="lab-controls lab-controls--stacked">',
    '<label>Texto<textarea data-message rows="5">It was the best of times, it was the worst of times.</textarea></label>',
    '</div><div class="lab-controls">',
    '<label>Operação<select data-operation><option value="encrypt" selected>Cifrar</option><option value="decrypt">Decifrar</option></select></label>',
    '<label>Palavra-chave<input data-key value="CODES" autocomplete="off" spellcheck="false"></label>',
    '</div><div class="lab-actions"><button type="submit">Executar</button><button type="button" data-swap>Usar saída como entrada</button><button type="button" data-reset>Reiniciar</button></div></form>',
    '<div class="lab-result" data-output role="region" aria-label="Resultado da cifra de Vigenère"></div>',
    '<p class="lab-note">Um índice próximo ao do idioma em uma coluna sugere que ela foi cifrada por um único deslocamento. Repetições ajudam a propor o período; não constituem prova isolada.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const message = tools.q<HTMLTextAreaElement>("[data-message]");
    const keyInput = tools.q<HTMLInputElement>("[data-key]");
    const operation = tools.q<HTMLSelectElement>("[data-operation]");
    let lastOutput = "";

    const run = (report = true) => {
      const key = letters(keyInput.value);
      if (key.length === 0) {
        if (report) tools.feedback("A palavra-chave precisa conter ao menos uma letra A–Z.", "error");
        return;
      }
      const result = transform(message.value, key, operation.value === "decrypt");
      lastOutput = result.output;
      const outputCode = node("code", result.output);
      const outputParagraph = node("p");
      outputParagraph.append("Saída: ", outputCode);
      tools.output(
        outputParagraph,
        node("p", "Índice de coincidência da saída: " + coincidenceIndex(result.output).toFixed(6) + "."),
        node("p", "Distâncias entre repetições: " + repetitions(result.output)),
        table("IC por período e por coluna", ["período", "IC médio", "IC das colunas"], columnCoincidences(result.output)),
        table("Primeiras letras processadas", ["posição", "entrada", "chave", "operação", "saída"], result.rows),
      );
      if (report) tools.feedback("Texto processado com período " + key.length + ".", "success");
    };

    tools.on(form, "submit", ((event: Event) => {
      event.preventDefault();
      run();
    }) as EventListener);
    tools.on(tools.q("[data-swap]"), "click", (() => {
      if (!lastOutput) run(false);
      message.value = lastOutput;
      operation.value = operation.value === "encrypt" ? "decrypt" : "encrypt";
      run();
    }) as EventListener);
    tools.on(tools.q("[data-reset]"), "click", (() => {
      tools.reset(form);
      lastOutput = "";
      run(false);
    }) as EventListener);
    run(false);
  },
});
