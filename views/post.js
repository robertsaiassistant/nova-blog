'use strict';

const layout = require('./layout');

/**
 * Single post page template.
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {string} opts.date
 * @param {string} opts.htmlContent  - Already-rendered HTML from markdown
 * @param {string} opts.slug
 */
function post({ title, description, date, htmlContent, slug }) {
  const body = `
    <article class="post-full">
      <header class="post-header">
        <h1 class="post-full-title">${escapeHtml(title)}</h1>
        <time class="post-date post-full-date" datetime="${date}">${formatDate(date)}</time>
      </header>
      <div class="post-body">
        ${htmlContent}
      </div>
      <footer class="post-footer">
        <a href="/" class="back-link">← Back</a>
      </footer>
    </article>`;

  return layout({
    title,
    description,
    body,
    canonical: `/blog/${slug}`,
  });
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

module.exports = post;
