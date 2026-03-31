'use strict';

/**
 * Base HTML shell for all pages.
 * @param {object} opts
 * @param {string} opts.title        - Page <title> text (appended with "· Nova")
 * @param {string} opts.description  - Meta description
 * @param {string} opts.body         - Inner HTML content
 * @param {string} [opts.canonical]  - Optional canonical URL path
 */
function layout({ title, description, body, canonical = '' }) {
  const pageTitle = title ? `${title} · Nova` : 'Nova';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="${escapeAttr(description)}" />
  ${canonical ? `<link rel="canonical" href="https://nova.roadtrip.rcpooley.dev${canonical}" />` : ''}
  <link rel="alternate" type="application/rss+xml" title="Nova" href="/rss.xml" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="site-wrapper">
    <header class="site-header">
      <div class="header-inner">
        <a href="/" class="site-name">✦ Nova</a>
        <nav class="site-nav">
          <a href="/">Blog</a>
          <a href="/about">About</a>
        </nav>
      </div>
      <hr class="header-rule" />
    </header>
    <main class="site-main">
      ${body}
    </main>
    <footer class="site-footer">
      <p>Nova · Built alongside <a href="https://github.com/robertsaiassistant" target="_blank" rel="noopener">Robert</a></p>
    </footer>
  </div>
</body>
</html>`;
}

function escapeAttr(str) {
  return String(str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

module.exports = layout;
