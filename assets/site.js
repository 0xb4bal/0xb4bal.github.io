/* Interactive controls progressively enhance the static portfolio. */
(() => {
  'use strict';
  const stages = [{"title":"Frame the alert","short":"Context","icon":"target","desc":"Start with the behaviour the alert claims to detect. Identify the source, time window, affected asset, and the condition that triggered it.","output":"A clear investigation question.","tags":["Alert context","Entity","Time window"]},{"title":"Validate the telemetry","short":"Validate","icon":"activity","desc":"Compare parsed fields with the raw event. Check timestamps, field meaning, and gaps before treating a log entry as evidence.","output":"Verified observations, with visibility gaps recorded.","tags":["Raw events","Field validation","Log sources"]},{"title":"Connect the evidence","short":"Correlate","icon":"layers","desc":"Search historical activity and pivot across IPs, accounts, hosts, and related events. Establish whether the behaviour is isolated, repeated, or part of a wider pattern.","output":"A timeline and a set of related entities.","tags":["QRadar AQL","Historical search","Entity pivots"]},{"title":"Enrich with context","short":"Enrich","icon":"globe","desc":"Use threat intelligence to support a hypothesis. Consider shared infrastructure, source recency, and disagreement between providers before drawing a conclusion.","output":"Context that supports the evidence.","tags":["VirusTotal","AbuseIPDB","Threat intelligence"]},{"title":"Assess the outcome","short":"Assess","icon":"shield","desc":"Distinguish an attempted action from a successful one. Interpret security-control responses in context, state confidence, and make remaining uncertainty explicit.","output":"A defensible assessment of behaviour and impact.","tags":["Control outcomes","Confidence","MITRE ATT&CK"]},{"title":"Document and hand off","short":"Handoff","icon":"file","desc":"Write down observations, assessment, uncertainty, potential impact, and the recommended next action. Give the next analyst enough context to continue.","output":"An actionable case record or escalation.","tags":["Cortex XSOAR","Incident reporting","Escalation"]}];
  const all = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const one = (selector, parent = document) => parent.querySelector(selector);

  // Dialogs retain the browser's focus trap and Escape handling.
  const terminal = one('#terminal');
  const palette = one('#command-palette');
  function openDialog(dialog, input) {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    all('dialog[open]').forEach(item => item.close());
    dialog.showModal();
    input?.focus();
  }
  all('dialog').forEach(dialog => {
    one('[data-close]', dialog)?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });

  // Read-only portfolio terminal: only named commands are interpreted.
  const commandInput = one('#terminal-input');
  const output = one('.terminal-output');
  const history = [];
  let historyIndex = 0;
  function appendLine(text, className) {
    const line = document.createElement('p');
    line.className = className;
    line.textContent = text;
    output.append(line);
    while (output.children.length > 80) output.firstElementChild.remove();
    output.scrollTop = output.scrollHeight;
  }
  function runCommand(raw) {
    const command = raw.trim().toLowerCase();
    if (!command) return;
    history.push(raw.trim());
    if (history.length > 40) history.shift();
    historyIndex = history.length;
    commandInput.value = '';
    appendLine('visitor:~$ ' + raw.trim(), 'terminal-command');
    const responses = {
      help: 'whoami    Analyst background\nskills    Platforms and methods\nworkflow  The six-step investigation method\nprojects  Open the project collection\nnotes     Open the notebook\nabout     Read the full background\ncontact   Go to contact options\nclear     Clear this console\nexit      Close this console',
      whoami: 'Muhammed Iqbal Hamdzan (@0xb4bal)\nSOC Analyst · Ensign InfoSecurity\nKuala Lumpur, Malaysia\nApproximately four years in security operations. CompTIA CySA+ certified.\nFocus: alert triage, investigation, evidence correlation, and clear incident reporting.',
      skills: 'SIEM: IBM QRadar / AQL, Microsoft Sentinel, Splunk, LogRhythm\nCase handling: Cortex XSOAR\nEndpoint & network: CrowdStrike Falcon, Trellix, Vectra, Trend Micro Apex\nIntelligence: VirusTotal, AbuseIPDB, Cisco Talos, IBM X-Force\nPersonal projects: Python, JavaScript\nDeveloping in the lab: Sigma, Wazuh / Elastic, AI-assisted workflows',
      workflow: stages.map((stage, index) => (index + 1) + '. ' + stage.title + '\n   ' + stage.output).join('\n')
    };
    if (command === 'clear') output.replaceChildren();
    else if (command === 'exit') terminal.close();
    else if (Object.hasOwn(responses, command)) appendLine(responses[command], 'terminal-response');
    else if (['projects','notes','about','contact'].includes(command)) {
      const routes = {projects:'/projects.html', notes:'/notes/', about:'/about.html', contact:'/#contact'};
      terminal.close();
      window.location.assign(routes[command]);
    } else appendLine('Unknown command. Type help for available commands.', 'terminal-response');
    if (terminal.open) commandInput.focus();
  }
  if (terminal && typeof terminal.showModal === 'function') {
    all('[data-open-terminal]').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', () => openDialog(terminal, commandInput));
    });
    one('.terminal-form').addEventListener('submit', event => {
      event.preventDefault();
      runCommand(commandInput.value);
    });
    all('[data-command]').forEach(button => button.addEventListener('click', () => runCommand(button.dataset.command)));
    commandInput.addEventListener('keydown', event => {
      if (!['ArrowUp','ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      historyIndex = Math.max(0, Math.min(history.length, historyIndex + (event.key === 'ArrowUp' ? -1 : 1)));
      commandInput.value = history[historyIndex] || '';
      commandInput.setSelectionRange(commandInput.value.length, commandInput.value.length);
    });
  }

  const searchInput = palette && one('input', palette);
  const searchLinks = palette ? all('.palette-results a', palette) : [];
  function filterSearch() {
    const query = searchInput.value.trim().toLowerCase();
    searchLinks.forEach(link => { link.hidden = !link.textContent.toLowerCase().includes(query); });
    one('.palette-empty', palette).hidden = searchLinks.some(link => !link.hidden);
  }
  function openSearch() {
    searchInput.value = '';
    filterSearch();
    openDialog(palette, searchInput);
  }
  if (palette && typeof palette.showModal === 'function') {
    all('.command-trigger').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', openSearch);
    });
    searchInput.addEventListener('input', filterSearch);
    searchLinks.forEach(link => link.addEventListener('click', () => palette.close()));
    palette.addEventListener('keydown', event => {
      const visible = searchLinks.filter(link => !link.hidden);
      const current = visible.indexOf(document.activeElement);
      if (event.target === searchInput && ['ArrowDown','Enter'].includes(event.key)) {
        if (visible[0]) {
          event.preventDefault();
          event.key === 'Enter' ? visible[0].click() : visible[0].focus();
        }
      } else if (current >= 0 && ['ArrowDown','ArrowUp'].includes(event.key)) {
        event.preventDefault();
        const next = current + (event.key === 'ArrowDown' ? 1 : -1);
        if (next < 0) searchInput.focus();
        else visible[next % visible.length].focus();
      }
    });
  }
  document.addEventListener('keydown', event => {
    const editing = event.target.closest('input, textarea, select, [contenteditable="true"]');
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && palette) {
      event.preventDefault();
      palette.open ? palette.close() : openSearch();
    } else if (event.key === '/' && !editing && !event.ctrlKey && !event.metaKey && !event.altKey && !one('dialog[open]')) {
      event.preventDefault();
      openDialog(terminal, commandInput);
    }
  });

  const workflow = one('.workflow-enhanced');
  if (workflow) {
    const tabs = all('.workflow-tab', workflow);
    const panel = one('.workflow-panel', workflow);
    function selectStage(index, focus = false) {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', tabs[index].id);
      one('.workflow-number', panel).textContent = String(index + 1).padStart(2, '0');
      one('h3', panel).textContent = stages[index].title;
      one('.workflow-description', panel).textContent = stages[index].desc;
      one('.outcome', panel).textContent = stages[index].output;
      const tags = stages[index].tags.map(value => {
        const tag = document.createElement('span');
        tag.className = 'tag'; tag.textContent = value; return tag;
      });
      one('.workflow-tags', panel).replaceChildren(...tags);
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectStage(index));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); selectStage(next, true); }
      });
    });
    workflow.hidden = false;
    one('.nojs-workflow').hidden = true;
  }

  const filters = one('.filters');
  if (filters) {
    const buttons = all('.filter-button', filters);
    const projects = all('.project-card[data-category]');
    const count = one('.result-count');
    function filterProjects(category) {
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
      projects.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
      const total = projects.filter(card => !card.hidden).length;
      count.textContent = category === 'all' ? 'Showing all ' + total + ' projects.' :
        'Showing ' + total + (category === 'soc' ? ' SOC automation projects.' : ' lab & AI projects.');
    }
    buttons.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
    filters.hidden = false;
    count.hidden = false;
    if (window.location.hash === '#soc-automation') filterProjects('soc');
  }

  // Respect system motion preferences and remember the manual pause option.
  const motionButton = one('.motion-toggle:not(.command-trigger)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  try { paused = localStorage.getItem('iqbal-motion') === 'off'; } catch {}
  function updateMotion() {
    const off = paused || reducedMotion.matches;
    document.documentElement.dataset.motion = off ? 'off' : 'on';
    if (!motionButton) return;
    motionButton.hidden = false;
    motionButton.disabled = reducedMotion.matches;
    motionButton.setAttribute('aria-pressed', String(off));
    motionButton.textContent = reducedMotion.matches ? 'Reduced motion' : off ? 'Resume motion' : 'Pause motion';
  }
  motionButton?.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('iqbal-motion', paused ? 'off' : 'on'); } catch {}
    updateMotion();
  });
  reducedMotion.addEventListener('change', updateMotion);
  updateMotion();

  all('.mobile-menu nav a').forEach(link => link.addEventListener('click', () => link.closest('details').removeAttribute('open')));
  all('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
  all('.copy-email').forEach(button => {
    if (!navigator.clipboard?.writeText) return;
    button.hidden = false;
    button.addEventListener('click', async () => {
      const status = one('.copy-status');
      try {
        await navigator.clipboard.writeText('security@iqbalhamdzan.xyz');
        status.textContent = 'Email address copied.';
      } catch {
        status.textContent = 'Copy unavailable. Select the email address above, or use Email me.';
      }
    });
  });
})();
