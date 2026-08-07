import {
  defineEnrichment, LAB_KICKER as supplement, initialise, parseInteger,
  powMod, q, setFeedback
} from "../shared";

export const keyLab = defineEnrichment({
    id: "lab-2-1-chaves-alcapao",
    layer: "lab",
    anchor: "#exp-2-1-public-private-key",
    title: "Caixa de chaves e função com alçapão",
    kicker: supplement,
    meta: "Seção 2.1 · iniciante · 6–8 min",
    html: `
      <p class="lab-intro">Experimente primeiro os papéis das duas chaves. Depois compare a ida fácil de uma função com duas maneiras de tentar voltar.</p>
      <div class="lab-grid lab-grid-two">
        <section class="lab-card" aria-labelledby="lab21-keys-title">
          <h4 id="lab21-keys-title">Quem pode fazer o quê?</h4>
          <div class="lab-controls">
            <label>Participante
              <select data-actor>
                <option value="bob">Bob</option>
                <option value="alice">Alice</option>
                <option value="eva">Eva</option>
              </select>
            </label>
            <label>Ação
              <select data-action-choice>
                <option value="encrypt">Cifrar para Alice</option>
                <option value="decrypt">Decifrar mensagem de Alice</option>
              </select>
            </label>
            <label>Chave usada
              <select data-key-choice>
                <option value="public">Chave pública de Alice</option>
                <option value="private">Chave privada de Alice</option>
              </select>
            </label>
          </div>
          <button type="button" data-check-keys>Testar combinação</button>
        </section>
        <section class="lab-card" aria-labelledby="lab21-trap-title">
          <h4 id="lab21-trap-title">Um alçapão RSA de brinquedo</h4>
          <p>Usaremos <code>f(x)=x³ mod 55</code>. Calcular <code>x³=x·x·x</code> exige duas multiplicações modulares. O segredo de demonstração é <code>d=27</code>. Os números são deliberadamente minúsculos e não oferecem segurança.</p>
          <label>Escolha <var>x</var> entre 1 e 54
            <input type="number" min="1" max="54" step="1" value="7" data-trap-x>
          </label>
          <div class="lab-actions">
            <button type="button" data-trap-forward>Calcular a ida</button>
            <button type="button" data-trap-brute>Voltar enumerando</button>
            <button type="button" data-trap-secret>Usar o alçapão</button>
          </div>
          <div class="lab-result" data-trap-output aria-live="polite"></div>
        </section>
      </div>
      <div class="lab-actions"><button type="button" class="secondary" data-reset>Reiniciar</button></div>
      <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
    init: initialise((root) => {
      const actorNames: Record<string, string> = { alice: "Alice", bob: "Bob", eva: "Eva" };
      q(root, "[data-check-keys]").addEventListener("click", () => {
        const actor = q(root, "[data-actor]").value;
        const action = q(root, "[data-action-choice]").value;
        const key = q(root, "[data-key-choice]").value;
        if (action === "encrypt" && key === "public") {
          setFeedback(root, `${actorNames[actor]} pode cifrar: a chave pública foi feita para ser compartilhada.`, "success");
        } else if (action === "decrypt" && key === "private" && actor === "alice") {
          setFeedback(root, "Alice consegue decifrar porque é a única participante que possui a chave privada.", "success");
        } else if (action === "decrypt" && key === "private") {
          setFeedback(root, `${actorNames[actor]} não possui a chave privada de Alice. Escolher seu nome no menu não entrega esse segredo.`, "warning");
        } else {
          setFeedback(root, "A chave pública permite fazer a ida, mas não desfaz a cifração. Para voltar, Alice usa a chave privada.", "warning");
        }
      });

      const trapOutput = q(root, "[data-trap-output]");
      const readX = () => {
        const input = q(root, "[data-trap-x]");
        const result = parseInteger(input.value, { min: 1n, max: 54n, label: "x" });
        if (!result.ok) {
          setFeedback(root, result.message, "warning");
          return null;
        }
        return result.value;
      };
      const currentY = () => {
        const x = readX();
        return x === null ? null : powMod(x, 3n, 55n);
      };
      q(root, "[data-trap-forward]").addEventListener("click", () => {
        const x = readX();
        if (x === null) return;
        const y = powMod(x, 3n, 55n);
        trapOutput.textContent = `Ida: ${x}³ mod 55 = ${y}. Apenas duas multiplicações modulares bastam.`;
        setFeedback(root, "A direção x → f(x) é direta.", "success");
      });
      q(root, "[data-trap-brute]").addEventListener("click", () => {
        const y = currentY();
        if (y === null) return;
        let found = null;
        let attempts = 0;
        for (let candidate = 0n; candidate < 55n; candidate += 1n) {
          attempts += 1;
          if (powMod(candidate, 3n, 55n) === y) {
            found = candidate;
            break;
          }
        }
        trapOutput.textContent = `Sem o alçapão, a busca testou ${attempts} candidato(s) e encontrou x=${found} para y=${y}.`;
        setFeedback(root, "A enumeração funciona neste brinquedo porque o espaço tem só 55 valores.", "info");
      });
      q(root, "[data-trap-secret]").addEventListener("click", () => {
        const y = currentY();
        if (y === null) return;
        const recovered = powMod(y, 27n, 55n);
        trapOutput.textContent = `Com d=27: y²⁷ mod 55 = ${recovered}. O segredo transforma a volta numa exponenciação direta.`;
        setFeedback(root, "O alçapão não muda a função de ida; ele muda o custo de invertê-la.", "success");
      });
      q(root, "[data-reset]").addEventListener("click", () => {
        q(root, "[data-actor]").value = "bob";
        q(root, "[data-action-choice]").value = "encrypt";
        q(root, "[data-key-choice]").value = "public";
        q(root, "[data-trap-x]").value = "7";
        trapOutput.textContent = "";
        setFeedback(root, "Laboratório reiniciado.");
      });
    })
  });
