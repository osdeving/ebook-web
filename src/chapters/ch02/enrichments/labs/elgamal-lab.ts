import {
  defineEnrichment, LAB_KICKER as supplement, initialise, inverseMod, mod,
  parseInteger, powMod, q, setFeedback, setOutput,
  tableHtml
} from "../shared";

export const elgamalLab = defineEnrichment({
    id: "lab-2-4-elgamal-k-repetido",
    layer: "lab",
    anchor: "#exp-2-4-elgamal-correctness",
    title: "Elgamal e o perigo de reutilizar k",
    kicker: supplement,
    meta: "Seção 2.4 · intermediário · 8–12 min",
    html: `
      <p class="lab-intro">Alice usa p=23, g=5, chave privada a=6 e chave pública A=8. Cifre duas mensagens com o mesmo k e investigue o que se repete.</p>
      <div class="lab-controls">
        <label>Mensagem conhecida <var>m₁</var>
          <input type="number" min="1" max="22" step="1" value="7" data-m1>
        </label>
        <label>Mensagem secreta <var>m₂</var>
          <input type="number" min="1" max="22" step="1" value="11" data-m2>
        </label>
        <label>Valor efêmero reutilizado <var>k</var>
          <input type="number" min="1" max="21" step="1" value="3" data-k>
        </label>
      </div>
      <div class="lab-actions">
        <button type="button" data-encrypt>Cifrar e decifrar</button>
        <button type="button" data-reuse>Explorar a reutilização</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
      <div class="lab-result" data-output></div>
      <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
    init: initialise((root) => {
      const values = () => {
        const read = (selector: string, label: string, max: bigint) => {
          const input = q(root, selector);
          const result = parseInteger(input.value, { min: 1n, max, label });
          if (!result.ok) setFeedback(root, result.message, "warning");
          return result;
        };
        const p = 23n;
        const g = 5n;
        const a = 6n;
        const A = powMod(g, a, p);
        const m1Result = read("[data-m1]", "m₁", 22n);
        const m2Result = read("[data-m2]", "m₂", 22n);
        const kResult = read("[data-k]", "k", 21n);
        if (!m1Result.ok || !m2Result.ok || !kResult.ok) return null;
        const m1 = m1Result.value;
        const m2 = m2Result.value;
        const k = kResult.value;
        const c1 = powMod(g, k, p);
        const mask = powMod(A, k, p);
        const c21 = mod(m1 * mask, p);
        const c22 = mod(m2 * mask, p);
        const decryptMask = powMod(c1, a, p);
        return { p, g, a, A, m1, m2, k, c1, mask, c21, c22, decryptMask };
      };
      q(root, "[data-encrypt]").addEventListener("click", () => {
        const v = values();
        if (!v) return;
        const recovered1 = mod(v.c21 * inverseMod(v.decryptMask, v.p), v.p);
        const recovered2 = mod(v.c22 * inverseMod(v.decryptMask, v.p), v.p);
        setOutput(root, tableHtml("Cifração e decifração", ["Mensagem", "Texto cifrado (c₁,c₂)", "Decifração"], [
          [`m₁=${v.m1}`, `(${v.c1},${v.c21})`, `${v.c21}·${v.decryptMask}⁻¹ mod ${v.p}=${recovered1}`],
          [`m₂=${v.m2}`, `(${v.c1},${v.c22})`, `${v.c22}·${v.decryptMask}⁻¹ mod ${v.p}=${recovered2}`]
        ]));
        setFeedback(root, `Os dois textos têm o mesmo c₁=${v.c1}; esse é um sinal visível de que k foi repetido.`, "warning");
      });
      q(root, "[data-reuse]").addEventListener("click", () => {
        const v = values();
        if (!v) return;
        const recoveredMask = mod(v.c21 * inverseMod(v.m1, v.p), v.p);
        const recoveredM2 = mod(v.c22 * inverseMod(recoveredMask, v.p), v.p);
        setOutput(root, `<ol class="lab-steps">
          <li>Da mensagem conhecida: máscara = c₂,₁ · m₁⁻¹ = ${v.c21} · ${inverseMod(v.m1, v.p)} mod ${v.p} = ${recoveredMask}.</li>
          <li>Na outra cifra: m₂ = c₂,₂ · máscara⁻¹ = ${v.c22} · ${inverseMod(recoveredMask, v.p)} mod ${v.p} = ${recoveredM2}.</li>
        </ol>`);
        setFeedback(root, recoveredM2 === v.m2 ? `A mensagem secreta ${v.m2} foi recuperada sem a chave privada.` : "A recuperação falhou.", recoveredM2 === v.m2 ? "warning" : "info");
      });
      q(root, "[data-reset]").addEventListener("click", () => {
        q(root, "[data-m1]").value = "7";
        q(root, "[data-m2]").value = "11";
        q(root, "[data-k]").value = "3";
        setOutput(root, "");
        setFeedback(root, "Laboratório reiniciado.");
      });
    })
  });
