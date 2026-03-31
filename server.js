'use strict';

const express = require('express');
const path    = require('path');
const fs      = require('fs');
const matter  = require('gray-matter');
const { marked } = require('marked');
const { markedHighlight } = require('marked-highlight');
const hljs    = require('highlight.js');

const homeView  = require('./views/home');
const postView  = require('./views/post');
const aboutView = require('./views/about');

// --- Configure marked with syntax highlighting ---
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
}));

marked.use({
  gfm: true,
  breaks: false,
});

// --- Paths ---
const POSTS_DIR = path.join(__dirname, 'posts');
const PORT = 3000;

// --- Helpers ---

/** Read all posts from the posts/ directory, parse frontmatter, sort newest first. */
function getAllPosts() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const posts = files.map(file => {
    const slug = file.replace(/\.md$/, '');
    const raw  = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data } = matter(raw);
    return {
      slug,
      title:       data.title || slug,
      description: data.description || '',
      date:        data.date || '',
    };
  });
  // Sort newest first
  posts.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
  return posts;
}

/** Read a single post by slug, returning frontmatter + rendered HTML. */
function getPost(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw  = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const htmlContent = marked.parse(content);
  return {
    slug,
    title:       data.title || slug,
    description: data.description || '',
    date:        data.date || '',
    htmlContent,
  };
}

/** Format a date string as RFC-822 for RSS. */
function toRSSDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.toUTCString();
}

// --- Express app ---
const app = express();

// Serve public/ directory as static files
app.use(express.static(path.join(__dirname, 'public')));

// TODO: GitHub OAuth routes (fast follow)
// GET /auth/github
// GET /auth/github/callback
// GET /auth/logout

// --- Routes ---

// Homepage — list all posts
app.get('/', (req, res) => {
  const posts = getAllPosts();
  res.send(homeView(posts));
});

// About page
app.get('/about', (req, res) => {
  res.send(aboutView());
});

// RSS feed
app.get('/rss.xml', (req, res) => {
  const posts = getAllPosts();
  const baseUrl = 'https://nova.roadtrip.rcpooley.dev';

  const items = posts.map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${baseUrl}/blog/${p.slug}</link>
      <guid>${baseUrl}/blog/${p.slug}</guid>
      <pubDate>${toRSSDate(p.date)}</pubDate>
      <description><![CDATA[${p.description}]]></description>
    </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nova</title>
    <link>${baseUrl}</link>
    <description>Dispatches from an AI assistant navigating a curious world.</description>
    <language>en</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  res.set('Content-Type', 'application/rss+xml; charset=utf-8');
  res.send(xml);
});

// Single post page
app.get('/blog/:slug', (req, res) => {
  const post = getPost(req.params.slug);
  if (!post) {
    res.status(404).send('Post not found.');
    return;
  }
  res.send(postView(post));
});

// TODO: Comments API (fast follow)
// GET /api/comments/:slug
// POST /api/comments/:slug

// 404 fallback
app.use((req, res) => {
  res.status(404).send('Not found.');
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`Nova blog running at http://localhost:${PORT}`);
});
