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
  const [{ PhpWeb }, wrapper, attachmentWrapper, ...documents] = await Promise.all([
    import('./vendor/php-wasm-pages/PhpWeb.mjs'),
    readAsset('rodar-auditoria.php', 'text'),
    readAsset('conferir-arquivo.php', 'text'),
    ...['auditar-parse-str.php', ...files].map(name => readAsset(name, 'bytes')),
  ]);
  const php = new PhpWeb({ version: '8.5', autoTransaction: false, ini: 'short_open_tag=1' });
  await php.binary;
  for (const [i, file] of ['auditar-parse-str.php', ...files].entries()) {
    await php.writeFile(`/${file}`, documents[i]);
  }
  return { php, wrapper, attachmentWrapper };
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
  return runPhpJson(php, wrapper);
}

async function runPhpJson(php, wrapper) {
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
  attachmentButton.disabled = true;
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
    attachmentButton.disabled = false;
  }
});

const form = document.getElementById('conferir-form');
const attachmentInput = document.getElementById('conferir-arquivos');
const attachmentButton = document.getElementById('conferir-enviar');
const attachmentStatus = document.getElementById('conferir-status');
const attachmentResults = document.getElementById('conferir-resultados');

function showAttachment(fileName, messages) {
  const article = document.createElement('article');
  article.className = 'conferir-item';
  const heading = document.createElement('h3');
  heading.textContent = fileName;
  article.append(heading);
  for (const message of messages) {
    const paragraph = document.createElement('p');
    paragraph.textContent = message;
    article.append(paragraph);
  }
  attachmentResults.append(article);
}

function formatLines(lines) {
  const shown = lines.slice(0, 12).join(', ');
  return lines.length > 12 ? `${shown} e mais ${lines.length - 12}` : shown;
}

function describeAttachment(report) {
  if (report.error) return [`Análise interrompida no PHP ${report.php}. ${report.error}`];

  const messages = [`O analisador sintático do PHP ${report.php} aceitou o arquivo.`];
  const uncertain = report.calls.filter(call => !call.closed || call.unpacked);
  const wrong = report.calls.filter(call => call.closed && !call.unpacked && call.arguments !== 2);

  if (wrong.length) {
    messages.push(`parse_str com número de argumentos diferente de dois. Linhas ${formatLines(wrong.map(call => call.line))}.`);
  } else if (report.calls.length > uncertain.length) {
    messages.push('As chamadas diretas de parse_str com contagem verificável usam dois argumentos.');
  } else if (!report.calls.length) {
    messages.push('Nenhuma chamada direta de parse_str encontrada.');
  }
  if (uncertain.length) {
    messages.push(`Chamadas de parse_str para revisar manualmente. Linhas ${formatLines(uncertain.map(call => call.line))}.`);
  }

  if (report.dependency) {
    messages.push(`A linha do erro registrado fica em ${report.dependency}. Anexe essa biblioteca se foi ela que você corrigiu.`);
  }
  if (report.expression) {
    messages.push(report.lines.length
      ? `A expressão ${report.expression} ainda aparece nas linhas ${formatLines(report.lines)}. Confira se agora ela recebe valores válidos ou está protegida por uma validação.`
      : `A expressão original ${report.expression} mudou ou foi removida. Confira o trecho equivalente no código novo.`);
  }
  return messages;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (button.disabled || attachmentButton.disabled) return;
  const selected = [...attachmentInput.files];
  attachmentResults.replaceChildren();
  if (!selected.length || selected.length > 7) {
    attachmentStatus.textContent = 'Selecione de um a sete arquivos PHP.';
    return;
  }

  button.disabled = true;
  attachmentButton.disabled = true;
  attachmentInput.disabled = true;
  let analyzed = 0;
  let failures = 0;
  try {
    for (const file of selected) {
      if (!/\.php$/i.test(file.name) || file.size === 0 || file.size > 2 * 1024 * 1024) {
        showAttachment(file.name, ['Selecione um arquivo .php de até 2 MB com conteúdo.']);
        continue;
      }
      attachmentStatus.textContent = `Conferindo ${file.name}…`;
      prepared ??= await prepareAudit();
      const { php, attachmentWrapper } = prepared;
      try {
        await php.writeFile('/anexo-nome.txt', file.name.toLowerCase());
        await php.writeFile('/anexo-codigo.txt', new Uint8Array(await file.arrayBuffer()));
        const report = await runPhpJson(php, attachmentWrapper);
        showAttachment(file.name, describeAttachment(report));
        analyzed++;
      } catch (error) {
        console.error(error);
        showAttachment(file.name, ['Não foi possível analisar este arquivo.']);
        failures++;
      }
    }
    const summary = analyzed === 1 ? '1 arquivo analisado.' : `${analyzed} arquivos analisados.`;
    attachmentStatus.textContent = failures ? `${summary} Falhas de leitura indicadas abaixo.` : summary;
  } catch (error) {
    console.error(error);
    prepared = undefined;
    attachmentStatus.textContent = 'Não foi possível iniciar o PHP no navegador. Tente novamente.';
  } finally {
    button.disabled = false;
    attachmentButton.disabled = false;
    attachmentInput.disabled = false;
  }
});
