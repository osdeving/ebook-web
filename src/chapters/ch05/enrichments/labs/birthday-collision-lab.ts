import { seededRandom } from "../shared/math";
import { defineLab, node, readInteger, table } from "../shared/lab-runtime";

function exactCollision(people: number, buckets: number): number {
  if (people > buckets) return 1;
  let distinct = 1;
  for (let index = 0; index < people; index += 1) distinct *= (buckets - index) / buckets;
  return 1 - distinct;
}

export const birthdayCollisionLab = defineLab({
  id: "lab-5-4-paradoxo-aniversario",
  anchor: "sec-5-4-1",
  title: "Câmara de colisões: quando a raiz quadrada aparece",
  duration: "Seção 5.4.1 · 10–15 min",
  tags: ["section:5.4", "aniversario", "colisao", "simulacao"],
  html: [
    '<p class="lab-intro">Distribua pessoas em dias — ou hashes em baldes — e compare a probabilidade exata, a aproximação exponencial e uma simulação. O ponto de 50% cresce como a raiz do espaço.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Número de baldes N<input data-buckets type="number" min="2" max="1000000" value="365"></label>',
    '<label>Número de amostras n<input data-people type="number" min="2" max="1000" value="23"></label>',
    '<label>Experimentos<input data-runs type="number" min="100" max="20000" value="5000"></label>',
    '<label>Semente<input data-seed type="number" min="0" max="4294967295" value="36523"></label>',
    '</div><div class="lab-actions"><button type="submit">Simular colisões</button><button type="button" data-reset>Reiniciar</button></div></form>',
    '<div class="lab-result" data-output role="region" aria-label="Probabilidades de colisão"></div>',
    '<p class="lab-note">A colisão “entre quaisquer duas amostras” é muito mais provável do que acertar um balde previamente fixado. Essa distinção é central em ataques a funções hash.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const bucketsInput = tools.q<HTMLInputElement>("[data-buckets]");
    const peopleInput = tools.q<HTMLInputElement>("[data-people]");
    const runsInput = tools.q<HTMLInputElement>("[data-runs]");
    const seedInput = tools.q<HTMLInputElement>("[data-seed]");

    const run = (report = true) => {
      const buckets = readInteger(bucketsInput, "N", { min: 2, max: 1000000 });
      const people = readInteger(peopleInput, "n", { min: 2, max: 1000 });
      const runs = readInteger(runsInput, "Experimentos", { min: 100, max: 20000 });
      const seed = readInteger(seedInput, "Semente", { min: 0, max: 4294967295 });
      const invalid = [buckets, people, runs, seed].find((item) => !item.ok);
      if (invalid && !invalid.ok) {
        if (report) tools.feedback(invalid.message, "error");
        return;
      }
      if (!buckets.ok || !people.ok || !runs.ok || !seed.ok) return;
      if (people.value * runs.value > 8_000_000) {
        if (report) tools.feedback("Reduza n ou o número de experimentos para manter a simulação responsiva.", "error");
        return;
      }
      const random = seededRandom(seed.value);
      let collisions = 0;
      let firstCollision = "nenhuma";
      for (let runIndex = 0; runIndex < runs.value; runIndex += 1) {
        const seen = new Map<number, number>();
        let collided = false;
        for (let sample = 0; sample < people.value; sample += 1) {
          const bucket = Math.floor(random() * buckets.value);
          const earlier = seen.get(bucket);
          if (earlier !== undefined) {
            collided = true;
            if (runIndex === 0 && firstCollision === "nenhuma") {
              firstCollision = "balde " + bucket + ", amostras " + (earlier + 1) + " e " + (sample + 1);
            }
          } else {
            seen.set(bucket, sample);
          }
        }
        if (collided) collisions += 1;
      }
      const exact = exactCollision(people.value, buckets.value);
      const exponential = 1 - Math.exp(-people.value * (people.value - 1) / (2 * buckets.value));
      const fixedTarget = 1 - (1 - 1 / buckets.value) ** people.value;
      tools.output(
        node("p", "\\(1-\\prod_{j=0}^{n-1}(1-j/N)\\) = " + exact.toFixed(6) + "."),
        table("Três perspectivas", ["medida", "probabilidade"], [
          ["exata: qualquer par colide", exact.toFixed(6)],
          ["aproximação exponencial", exponential.toFixed(6)],
          ["Monte Carlo", (collisions / runs.value).toFixed(6)],
          ["acertar um balde fixo", fixedTarget.toFixed(6)],
        ]),
        node("p", "Primeiro experimento: " + firstCollision + "."),
      );
      if (report) tools.feedback(collisions + " de " + runs.value + " experimentos tiveram colisão.", "success");
    };

    tools.on(form, "submit", ((event: Event) => {
      event.preventDefault();
      run();
    }) as EventListener);
    tools.on(tools.q("[data-reset]"), "click", (() => {
      tools.reset(form);
      run(false);
    }) as EventListener);
    run(false);
  },
});
