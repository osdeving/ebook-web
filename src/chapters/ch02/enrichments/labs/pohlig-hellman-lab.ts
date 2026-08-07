import {
  defineEnrichment, LAB_KICKER as supplement, crtPair, discreteLog, initialise,
  inverseMod, mod, powMod, q, setFeedback,
  setOutput
} from "../shared";

export const pohligHellmanLab = defineEnrichment({
    id: "lab-2-9-pohlig-hellman",
    layer: "lab",
    anchor: "#exp-2-9-projecoes-prime-power",
    title: "Árvore de Pohlig–Hellman e dígitos em base 2",
    kicker: supplement,
    meta: "Seção 2.9 · avançado guiado · 12–16 min",
    html: `
      <p class="lab-intro">No grupo multiplicativo módulo 97, g=5 tem ordem 96=2⁵·3. O alvo é h=5^x mod 97, com x oculto até a reconstrução.</p>
      <div class="lab-grid lab-grid-two">
        <section class="lab-card" aria-labelledby="lab29-tree-title">
          <h4 id="lab29-tree-title">1. Decompor e projetar</h4>
          <ol data-tree-output></ol>
          <button type="button" data-tree-next>Próximo ramo</button>
        </section>
        <section class="lab-card" aria-labelledby="lab29-digits-title">
          <h4 id="lab29-digits-title">2. Extrair x mod 2⁵</h4>
          <div class="lab-table-wrap"><table class="lab-table"><caption>Dígitos menos significativos primeiro</caption><thead><tr><th scope="col">j</th><th scope="col">cⱼ</th><th scope="col">xⱼ</th><th scope="col">parcial</th></tr></thead><tbody data-digits></tbody></table></div>
          <button type="button" data-digit-next>Extrair próximo dígito</button>
        </section>
      </div>
      <div class="lab-result" data-output></div>
      <div class="lab-actions"><button type="button" class="secondary" data-reset>Reiniciar</button></div>
      <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
    init: initialise((root) => {
      const p = 97n;
      const g = 5n;
      const secret = 73n;
      const h = powMod(g, secret, p);
      const order32Base = powMod(g, 3n, p);
      const order32Target = powMod(h, 3n, p);
      const order3Base = powMod(g, 32n, p);
      const order3Target = powMod(h, 32n, p);
      const x32 = discreteLog(order32Base, order32Target, p, 32n);
      const x3 = discreteLog(order3Base, order3Target, p, 3n);
      if (x32 === null || x3 === null) {
        throw new Error("As projeções locais deste exemplo deveriam possuir logaritmos discretos.");
      }
      const reconstructed = crtPair(x32, 32n, x3, 3n).value;
      let treeStep = 0;
      let digitStep = 0;
      let partial = 0n;
      const treeMessages = [
        `A ordem se divide em 96=2⁵·3. Os dois módulos 32 e 3 são coprimos.`,
        `Ramo 2⁵: g₂=g^(96/32)=${order32Base}; h₂=h^(96/32)=${order32Target}. O PLD local dá x≡${x32} mod 32.`,
        `Ramo 3: g₃=g^(96/3)=${order3Base}; h₃=h^(96/3)=${order3Target}. O PLD local dá x≡${x3} mod 3.`,
        `O TCR reúne x≡${x32} mod 32 e x≡${x3} mod 3: x=${reconstructed} mod 96. Verificação: 5^${reconstructed} mod 97=${powMod(g, reconstructed, p)}=h.`
      ];
      const reset = () => {
        treeStep = 0;
        digitStep = 0;
        partial = 0n;
        q(root, "[data-tree-output]").replaceChildren();
        q(root, "[data-digits]").replaceChildren();
        setOutput(root, `<p>Alvo público: h=${h}. A árvore e os dígitos oferecem duas visões complementares da mesma redução.</p>`);
        setFeedback(root, "Comece abrindo um ramo da árvore ou extraindo o primeiro dígito.");
      };
      q(root, "[data-tree-next]").addEventListener("click", () => {
        if (treeStep >= treeMessages.length) {
          setFeedback(root, "A árvore já está completa.");
          return;
        }
        const item = document.createElement("li");
        item.textContent = treeMessages[treeStep] ?? "";
        q(root, "[data-tree-output]").append(item);
        treeStep += 1;
        setFeedback(root, treeStep === treeMessages.length ? "Árvore completa: os PLDs locais foram reunidos por TCR." : `Ramo ${treeStep} revelado.`, treeStep === treeMessages.length ? "success" : "info");
      });
      q(root, "[data-digit-next]").addEventListener("click", () => {
        if (digitStep >= 5) {
          setFeedback(root, `Os cinco dígitos já reconstruíram x≡${partial} mod 32.`);
          return;
        }
        const j = BigInt(digitStep);
        const corrected = mod(order32Target * inverseMod(powMod(order32Base, partial, p), p), p);
        const exponent = 1n << BigInt(4 - digitStep);
        const c = powMod(corrected, exponent, p);
        const gamma = powMod(order32Base, 16n, p);
        const digit = discreteLog(gamma, c, p, 2n);
        if (digit === null) {
          setFeedback(root, "Não foi possível identificar o próximo dígito binário.", "warning");
          return;
        }
        partial += digit * (1n << j);
        const row = document.createElement("tr");
        [digitStep, c, digit, partial].forEach((value) => {
          const cell = document.createElement("td");
          cell.textContent = String(value);
          row.append(cell);
        });
        q(root, "[data-digits]").append(row);
        digitStep += 1;
        setFeedback(root, digitStep === 5 ? `Dígitos concluídos: x≡${partial} mod 32.` : `Dígito x_${digitStep - 1}=${digit}; parcial=${partial}.`, digitStep === 5 ? "success" : "info");
      });
      q(root, "[data-reset]").addEventListener("click", reset);
      reset();
    })
  });
