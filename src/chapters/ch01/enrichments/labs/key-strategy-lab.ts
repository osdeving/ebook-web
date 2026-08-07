import { defineLab, makeElement } from "./runtime.mts";

type Channel = "shared" | "authenticated-public" | "unauthenticated-public";
type Plan = "symmetric" | "asymmetric" | "hybrid";

export const keyStrategyLab = defineLab({
  id: "lab-1-7-6-estrategia-de-chaves",
  anchor: "remark-1-35",
  title: "Escolha a arquitetura de chaves",
  duration: "Seção 1.7.6 · 8–13 min",
  tags: ["section:1.7.6", "simetrica", "assimetrica", "hibrida", "gerenciamento-de-chaves"],
  html: `
    <p class="lab-intro">Você precisa enviar um arquivo confidencial a Alice. Configure o que Bob já conhece e compare três arquiteturas. O laboratório separa duas perguntas frequentemente confundidas: “como obter uma chave?” e “como cifrar muitos dados?”.</p>
    <form data-form>
      <div class="lab-controls">
        <label>Tamanho relativo da mensagem: <output data-size-output>50</output> blocos
          <input type="range" min="1" max="100" step="1" value="50" data-size aria-label="Tamanho relativo de um a cem blocos">
        </label>
        <label>Informação inicial de Bob
          <select data-channel>
            <option value="shared">já compartilha um segredo com Alice</option>
            <option value="authenticated-public" selected>possui a chave pública autenticada de Alice</option>
            <option value="unauthenticated-public">achou uma chave pública sem autenticação</option>
          </select>
        </label>
      </div>
      <fieldset class="lab-choice-grid">
        <legend>Plano proposto</legend>
        <label><input type="radio" name="key-plan" value="symmetric"> Só cifra simétrica</label>
        <label><input type="radio" name="key-plan" value="asymmetric"> Só cifra assimétrica</label>
        <label><input type="radio" name="key-plan" value="hybrid" checked> Esquema híbrido</label>
      </fieldset>
      <div class="lab-actions">
        <button type="submit">Avaliar o plano</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
    </form>
    <div class="lab-pipeline" data-pipeline aria-label="Fluxo híbrido em quatro etapas">
      <button type="button" data-phase="0">1. Gerar chave de sessão</button>
      <button type="button" data-phase="1">2. Encapsular com chave pública</button>
      <button type="button" data-phase="2">3. Cifrar dados simetricamente</button>
      <button type="button" data-phase="3">4. Alice recupera e decifra</button>
    </div>
    <div class="lab-result" data-output aria-live="polite"></div>
    <p class="lab-interpretation">Interpretação: “assimétrica” não significa automaticamente “melhor”. Sistemas reais combinam papéis: chave pública para estabelecer ou proteger um segredo curto; cifra simétrica para o volume de dados. A autenticidade da chave pública continua essencial.</p>
    <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const size = tools.q<HTMLInputElement>("[data-size]");
    const sizeOutput = tools.q<HTMLOutputElement>("[data-size-output]");
    const channel = tools.q<HTMLSelectElement>("[data-channel]");
    const pipeline = tools.q<HTMLElement>("[data-pipeline]");
    let completedPhases = 0;

    const selectedPlan = (): Plan => tools.q<HTMLInputElement>('input[name="key-plan"]:checked').value as Plan;

    const evaluate = () => {
      const plan = selectedPlan();
      const initial = channel.value as Channel;
      const blocks = Number(size.value);
      const paragraphs: HTMLElement[] = [];
      if (plan === "symmetric") {
        if (initial === "shared") {
          paragraphs.push(makeElement("p", "Boa escolha neste cenário: Bob e Alice já possuem um segredo, e a cifra simétrica atende diretamente ao envio volumoso."));
          tools.feedback("Plano coerente: a distribuição da chave já foi resolvida.", "success");
        } else {
          paragraphs.push(makeElement("p", "A cifra simétrica é apropriada para os dados, mas o plano não explica como Bob e Alice obterão o mesmo segredo sem expô-lo no canal."));
          tools.feedback("Falta resolver a distribuição da chave secreta.", "warning");
        }
      } else if (plan === "asymmetric") {
        paragraphs.push(makeElement("p", `A chave pública evita um segredo pré-compartilhado, mas usar a operação assimétrica diretamente em ${blocks} blocos confunde estabelecimento de chave com cifração em massa.`));
        tools.feedback("Funcional em um modelo abstrato, porém inadequado ao papel de uma mensagem longa.", "warning");
      } else {
        paragraphs.push(makeElement("p", "O plano híbrido separa os papéis: cria uma chave de sessão, protege essa chave com o mecanismo público e usa a cifra simétrica nos dados."));
        if (initial === "unauthenticated-public") {
          paragraphs.push(makeElement("p", "Alerta: uma chave pública não autenticada pode pertencer a Eva. Antes do envio, Bob precisa validar sua associação com Alice."));
          tools.feedback("Arquitetura adequada, mas a identidade da chave pública ainda não foi estabelecida.", "warning");
        } else if (initial === "shared") {
          paragraphs.push(makeElement("p", "Como já existe um segredo confiável, a camada pública pode ser desnecessária neste envio; ainda assim, o fluxo ilustra o padrão híbrido."));
          tools.feedback("Plano possível, embora haja uma opção mais simples neste cenário.", "info");
        } else {
          tools.feedback("Plano e pré-condições coerentes. Execute agora as quatro etapas na ordem.", "success");
        }
      }
      tools.outputNodes(...paragraphs);
    };

    const resetPipeline = () => {
      completedPhases = 0;
      tools.qa<HTMLButtonElement>("[data-phase]").forEach((button) => {
        button.classList.remove("is-complete");
        button.removeAttribute("aria-current");
      });
    };

    tools.on(form, "submit", (event) => {
      event.preventDefault();
      resetPipeline();
      evaluate();
    });
    tools.on(size, "input", () => {
      sizeOutput.textContent = size.value;
      evaluate();
    });
    tools.on(pipeline, "click", (event) => {
      const button = (event.target as Element).closest<HTMLButtonElement>("[data-phase]");
      if (!button) return;
      if (selectedPlan() !== "hybrid") {
        tools.feedback("Selecione o plano híbrido para executar este fluxo.", "warning");
        return;
      }
      const phase = Number(button.dataset.phase);
      if (phase !== completedPhases) {
        tools.feedback(phase < completedPhases ? "Essa etapa já foi concluída." : `Execute primeiro a etapa ${completedPhases + 1}.`, "warning");
        return;
      }
      button.classList.add("is-complete");
      button.setAttribute("aria-current", "step");
      completedPhases += 1;
      const messages = [
        "Uma chave de sessão nova foi criada para este envio.",
        "A chave de sessão foi protegida para a chave pública de Alice.",
        "Os blocos do arquivo foram cifrados com a chave de sessão.",
        "Alice usou sua chave privada para recuperar a chave de sessão e então decifrou os dados.",
      ];
      tools.feedback(messages[phase] ?? "Etapa concluída.", phase === 3 ? "success" : "info");
      if (phase === 3) {
        const conclusion = makeElement("p", "Fluxo completo: a operação assimétrica protegeu um segredo curto; a operação simétrica protegeu a mensagem. Nenhuma chave privada atravessou o canal.");
        tools.q<HTMLElement>("[data-output]").append(conclusion);
      }
    });
    tools.on(tools.q("[data-reset]"), "click", () => {
      size.value = "50";
      sizeOutput.textContent = "50";
      channel.value = "authenticated-public";
      tools.q<HTMLInputElement>('input[name="key-plan"][value="hybrid"]').checked = true;
      resetPipeline();
      evaluate();
      tools.feedback("Cenário híbrido inicial restaurado.");
      size.focus();
    });
    evaluate();
  },
});
