const files = [
  'con2_contasrecdesp002.php',
  'orc2_desppessoal002.php',
  'cad2_loteam002.php',
  'agu2_relconsumo002.php',
  'div2_resumogeraldivida002.php',
];
const button = document.getElementById('rodar');
const status = document.getElementById('exec-status');
const output = document.getElementById('exec-saida');
const rows = document.getElementById('exec-linhas');
const progress = document.getElementById('exec-progresso');
const progressLabel = document.getElementById('exec-contagem');
const progressPanel = document.getElementById('exec-andamento');
const snippet = document.getElementById('codigo-auditor');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function updateProgress(count) {
  progress.value = count;
  progressLabel.textContent = `${count} / ${files.length}`;
}

async function readAsset(name, type) {
  const response = await fetch(new URL(`./amostras/${name}.txt`, import.meta.url));
  if (!response.ok) throw new Error(`Falha ao carregar ${name}: HTTP ${response.status}`);
  return type === 'text' ? response.text() : new Uint8Array(await response.arrayBuffer());
}

let prepared;
async function prepareAudit() {
  const [{ PhpWeb }, wrapper, ...documents] = await Promise.all([
    import('./vendor/php-wasm-pages/PhpWeb.mjs'),
    readAsset('rodar-auditoria.php', 'text'),
    ...['auditar-parse-str.php', ...files].map(name => readAsset(name, 'bytes')),
  ]);
  const php = new PhpWeb({ version: '8.5', autoTransaction: false, ini: 'short_open_tag=1' });
  await php.binary;
  for (const [i, file] of ['auditar-parse-str.php', ...files].entries()) {
    await php.writeFile(`/${file}`, documents[i]);
  }
  return { php, wrapper };
}

function appendRow(values) {
  const tr = document.createElement('tr');
  for (const value of values) {
    const td = document.createElement('td');
    td.textContent = value;
    tr.append(td);
  }
  rows.append(tr);
}

async function auditFile({ php, wrapper }, file) {
  await php.writeFile('/arquivo-selecionado.txt', file);
  let stdout = '';
  const collect = event => { stdout += String(event.detail ?? ''); };
  php.addEventListener('output', collect);
  try {
    const exitCode = await php.run(wrapper);
    if (exitCode !== 0) throw new Error(`PHP encerrou com código ${exitCode}`);
    return JSON.parse(stdout);
  } finally {
    php.removeEventListener('output', collect);
  }
}

button.addEventListener('click', async () => {
  button.disabled = true;
  rows.replaceChildren();
  output.hidden = true;
  progressPanel.hidden = false;
  updateProgress(0);
  status.textContent = prepared ? 'Preparando a leitura…' : 'Carregando o PHP 8.5 e os cinco arquivos…';
  try {
    prepared ??= await prepareAudit();
    snippet.dataset.running = 'true';
    let calls = 0;
    let version;
    for (const [i, file] of files.entries()) {
      status.textContent = `Lendo ${file} (${i + 1} de ${files.length})…`;
      // Dê tempo para a turma ler o nome, mesmo quando o PHP termina rápido.
      const pause = reducedMotion.matches ? Promise.resolve() : new Promise(resolve => setTimeout(resolve, 700));
      const [result] = await Promise.all([auditFile(prepared, file), pause]);
      version = result.php;
      if (!result.chamadas.length) appendRow([result.arquivo, '—', 'Nenhuma chamada']);
      for (const call of result.chamadas) {
        appendRow([result.arquivo, String(call.line), String(call.arguments)]);
        calls++;
      }
      output.hidden = false;
      updateProgress(i + 1);
    }
    status.textContent = `PHP ${version} · ${files.length} arquivos lidos · ${calls} ${calls === 1 ? 'chamada direta' : 'chamadas diretas'}.`;
    button.textContent = 'Rodar de novo';
  } catch (error) {
    console.error(error);
    prepared = undefined;
    status.textContent = 'Não consegui rodar o PHP nesta tentativa. Tente novamente ou consulte o código do PR.';
  } finally {
    delete snippet.dataset.running;
    button.disabled = false;
  }
});
