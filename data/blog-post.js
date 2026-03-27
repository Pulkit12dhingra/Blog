/**
 * blog-post.js
 * Shared enhancements for all blog post pages:
 *   - Dark mode (persisted via localStorage)
 *   - Read time estimate
 *   - Table of Contents (auto-generated from h4/h5)
 *   - Share buttons (LinkedIn, X/Twitter, copy link)
 *   - Code block copy buttons
 *   - Prev / Next post navigation
 */

(function () {
  'use strict';

  // ── Dark Mode ──────────────────────────────────────────────────
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  // ── Helpers ────────────────────────────────────────────────────
  function currentFile() {
    return window.location.pathname.split('/').pop() || '';
  }

  function wordCount(el) {
    return (el.innerText || el.textContent || '').trim().split(/\s+/).length;
  }

  // ── Read Time ──────────────────────────────────────────────────
  function injectReadTime() {
    const container = document.querySelector('.container.mt-4');
    if (!container) return;

    const words = wordCount(container);
    const minutes = Math.max(1, Math.round(words / 200));

    let metaDiv = document.getElementById('post-meta');
    if (!metaDiv) {
      metaDiv = document.createElement('div');
      metaDiv.id = 'post-meta';
      const hr = container.querySelector('hr');
      if (hr) {
        hr.parentNode.insertBefore(metaDiv, hr);
      } else {
        const h2 = container.querySelector('h2');
        if (h2) h2.insertAdjacentElement('afterend', metaDiv);
      }
    }

    const readTimeHtml = `
      <span id="read-time">
        <i class="bi bi-clock"></i> ${minutes} min read
      </span>
      <span><i class="bi bi-file-text"></i> ${words.toLocaleString()} words</span>
    `;

    const shareHtml = `
      <div class="share-buttons">
        <span style="font-size:0.75rem;font-weight:600;color:var(--bp-text-muted);">Share:</span>
        <a class="share-btn" id="share-linkedin" href="#" target="_blank" rel="noopener noreferrer" title="Share on LinkedIn">
          <i class="bi bi-linkedin"></i> LinkedIn
        </a>
        <a class="share-btn" id="share-twitter" href="#" target="_blank" rel="noopener noreferrer" title="Share on X / Twitter">
          <i class="bi bi-twitter-x"></i> X
        </a>
        <button class="share-btn copy-btn" id="copy-link" title="Copy link">
          <i class="bi bi-link-45deg"></i> Copy
        </button>
      </div>
    `;

    metaDiv.innerHTML = readTimeHtml + shareHtml;

    // Wire share links
    const pageUrl  = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    const liBtn = document.getElementById('share-linkedin');
    if (liBtn) liBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;

    const twBtn = document.getElementById('share-twitter');
    if (twBtn) twBtn.href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;

    const copyBtn = document.getElementById('copy-link');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(window.location.href).then(() => {
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = '<i class="bi bi-check2"></i> Copied!';
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="bi bi-link-45deg"></i> Copy';
          }, 2000);
        });
      });
    }
  }

  // ── Table of Contents ──────────────────────────────────────────
  function injectTOC() {
    const container = document.querySelector('.container.mt-4');
    if (!container) return;

    const headings = Array.from(container.querySelectorAll('h4, h5'));
    if (headings.length < 3) return; // skip TOC for short posts

    // Assign IDs to headings
    headings.forEach((h, i) => {
      if (!h.id) {
        h.id = 'section-' + i;
      }
    });

    const items = headings.map(h => {
      const indent = h.tagName === 'H5' ? ' style="margin-left:1rem;"' : '';
      return `<li${indent}><a href="#${h.id}">${h.textContent.trim()}</a></li>`;
    }).join('');

    const toc = document.createElement('div');
    toc.id = 'post-toc';
    toc.innerHTML = `
      <h6><i class="bi bi-list-ul me-1"></i>Table of Contents</h6>
      <ol>${items}</ol>
    `;

    // Insert after the hr divider (or after post-meta)
    const hr = container.querySelector('hr');
    const postMeta = document.getElementById('post-meta');
    const insertAfter = postMeta || hr;

    if (insertAfter) {
      insertAfter.insertAdjacentElement('afterend', toc);
    }
  }

  // ── Code Block Copy Buttons ────────────────────────────────────
  function addCodeCopyButtons() {
    document.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.code-copy-btn')) return;
      pre.style.position = 'relative';

      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function () {
        const code = pre.querySelector('code');
        const text = code ? code.innerText : pre.innerText;
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        });
      });
      pre.appendChild(btn);
    });
  }

  // ── Prev / Next Navigation ─────────────────────────────────────
  function injectPrevNext(blogData) {
    const file = currentFile();
    const idx  = blogData.findIndex(p => p.file === file);
    if (idx === -1) return;

    const prev = blogData[idx + 1]; // older post
    const next = blogData[idx - 1]; // newer post

    if (!prev && !next) return;

    const navDiv = document.createElement('div');
    navDiv.id = 'post-nav';

    const prevHtml = prev
      ? `<a class="post-nav-btn prev-post" href="${prev.file}">
           <span class="nav-label"><i class="bi bi-arrow-left me-1"></i>Previous</span>
           <span class="nav-title">${prev.title}</span>
         </a>`
      : `<div></div>`;

    const nextHtml = next
      ? `<a class="post-nav-btn next-post" href="${next.file}">
           <span class="nav-label">Next <i class="bi bi-arrow-right ms-1"></i></span>
           <span class="nav-title">${next.title}</span>
         </a>`
      : `<div></div>`;

    navDiv.innerHTML = prevHtml + nextHtml;

    // Insert before the footer
    const footer = document.querySelector('footer');
    const container = document.querySelector('.container.mt-4');
    if (footer) {
      footer.parentNode.insertBefore(navDiv, footer);
    } else if (container) {
      container.appendChild(navDiv);
    }
  }

  // ── Reading Progress Bar ───────────────────────────────────────
  function initProgressBar() {
    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    document.body.prepend(bar);

    function updateProgress() {
      const scrollTop  = window.scrollY || document.documentElement.scrollTop;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  // ── Scroll-Reveal for sections ─────────────────────────────────
  function initScrollReveal() {
    const headings = document.querySelectorAll('h4');
    if (!headings.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    headings.forEach(h => observer.observe(h));
  }

  // ── TOC Active Section via IntersectionObserver ────────────────
  function initTOCHighlight() {
    const toc = document.getElementById('post-toc');
    if (!toc) return;

    const headings = Array.from(document.querySelectorAll('h4[id], h5[id]'));
    if (!headings.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = toc.querySelector(`a[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          toc.querySelectorAll('a').forEach(a => a.classList.remove('toc-active'));
          link.classList.add('toc-active');
        }
      });
    }, { rootMargin: '-10% 0px -75% 0px' });

    headings.forEach(h => observer.observe(h));
  }

  // ── Back to Top Button ─────────────────────────────────────────
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Article JSON-LD Structured Data ───────────────────────
  function injectArticleSchema() {
    const title = document.querySelector('meta[property="og:title"]');
    const desc  = document.querySelector('meta[property="og:description"]');
    const url   = document.querySelector('meta[property="og:url"]');
    const image = document.querySelector('meta[property="og:image"]');
    if (!title || !url) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': title.content,
      'description': desc ? desc.content : '',
      'url': url.content,
      'image': image ? image.content : 'https://pulkit12dhingra.github.io/Blog/img/social-preview.jpg',
      'author': {
        '@type': 'Person',
        'name': 'Pulkit Dhingra',
        'url': 'https://pulkit12dhingra.github.io/Blog/'
      },
      'publisher': {
        '@type': 'Person',
        'name': 'Pulkit Dhingra',
        'url': 'https://pulkit12dhingra.github.io/Blog/'
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': url.content
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // ── Bootstrap Icons polyfill check ────────────────────────────
  function ensureBootstrapIcons() {
    const links = Array.from(document.querySelectorAll('link[href]'));
    const hasBI = links.some(l => l.href.includes('bootstrap-icons'));
    if (!hasBI) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css';
      document.head.appendChild(link);
    }
  }

  // ── Init ───────────────────────────────────────────────────────
  function init() {
    ensureBootstrapIcons();
    injectArticleSchema();
    initProgressBar();
    injectReadTime();
    injectTOC();
    addCodeCopyButtons();
    initScrollReveal();
    initBackToTop();

    // TOC highlight runs after TOC is in DOM
    setTimeout(initTOCHighlight, 100);

    // Prev/next requires blog data
    fetch('../data/blogData.json?v=2.2', { cache: 'no-cache' })
      .then(r => r.json())
      .then(data => injectPrevNext(data))
      .catch(() => {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
