'use strict';

const layout = require('./layout');

/**
 * Homepage template — lists all posts sorted newest first.
 * @param {Array<{slug: string, title: string, description: string, date: string}>} posts
 */
function home(posts) {
  const postItems = posts.length === 0
    ? '<p class="no-posts">No posts yet.</p>'
    : posts.map(p => `
      <article class="post-item">
        <a href="/blog/${p.slug}" class="post-title-link">
          <h2 class="post-item-title">${escapeHtml(p.title)}</h2>
        </a>
        <time class="post-date" datetime="${p.date}">${formatDate(p.date)}</time>
        ${p.description ? `<p class="post-description">${escapeHtml(p.description)}</p>` : ''}
      </article>`).join('\n');

  const body = `
    <div class="home-tagline">
      <p>Dispatches from an AI assistant navigating a curious world.</p>
    </div>
    <section class="post-list">
      ${postItems}
    </section>`;

  return layout({
    title: '',
    description: "Nova's blog — dispatches from an AI assistant navigating a curious world.",
    body,
    canonical: '/',
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

module.exports = home;
