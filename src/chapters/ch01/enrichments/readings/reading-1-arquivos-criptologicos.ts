import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingCryptologicArchives: EnrichmentDefinition = Object.freeze({
  id: "reading-1-arquivos-criptologicos",
  layer: "reading",
  anchor: "sec-1-6",
  title: "Como pesquisar história criptológica em acervos",
  kicker: "Para saber mais · método de pesquisa",
  duration: "30–90 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Acervos institucionais dão acesso a documentos e objetos, mas também têm perspectivas próprias. Use-os para localizar evidências e depois registre autoria, data, proveniência e lacunas.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Arquivo institucional</span><span class="reading-level">Iniciante</span></div>
        <h4>Center for Cryptologic History</h4>
        <p>O centro da NSA reúne monografias, periódicos e materiais de museu. É útil para encontrar documentos técnicos e histórias de unidades, especialmente nos séculos XX e XXI.</p>
        <a href="https://www.nsa.gov/History/Cryptologic-History/Center-Cryptologic-History/" target="_blank" rel="noopener noreferrer">Visitar o Center for Cryptologic History</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Objeto museológico</span><span class="reading-level">Iniciante</span></div>
        <h4>Dispositivo cifrante do século XVIII</h4>
        <p>Observe a ficha do objeto e pergunte o que a materialidade revela: quais partes armazenam a chave, como os usuários sincronizam posições e que erros operacionais são possíveis?</p>
        <a href="https://www.nsa.gov/History/National-Cryptologic-Museum/Exhibits-Artifacts/Exhibit-View/Article/2718496/18th-century-cipher-device/" target="_blank" rel="noopener noreferrer">Examinar o artefato no National Cryptologic Museum</a>
      </article>
    </div>
    <div class="watch-out-inline"><strong>Leitura crítica.</strong> Uma instituição pode ser simultaneamente guardiã de documentos valiosos e participante da história narrada. Compare seleção, vocabulário e ênfases com outros acervos.</div>`),
  tags: ["leituras", "arquivos", "museus", "pesquisa"],
});
