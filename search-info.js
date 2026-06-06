/* ============================================================
   search-info.js
   Supplemental JS for the Search Info landing page
   Original main.js logic is preserved in main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Smooth scroll for all in-page anchor links
     (covers TOC links and the soft CTA "→" link)
     ---------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href').slice(1);
        var target = document.getElementById(targetId);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ----------------------------------------------------------
     Highlight the active TOC item on scroll
     Uses IntersectionObserver if available, falls back silently
     ---------------------------------------------------------- */
  function initTocHighlight() {
    if (!('IntersectionObserver' in window)) return;

    var tocLinks = document.querySelectorAll('.toc-box a[href^="#"]');
    if (!tocLinks.length) return;

    // Build a map: sectionId → tocLink
    var linkMap = {};
    tocLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      linkMap[id] = link;
    });

    var sectionIds = Object.keys(linkMap);
    var sections = sectionIds
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    var activeId = null;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            if (id !== activeId) {
              // Remove previous highlight
              if (activeId && linkMap[activeId]) {
                linkMap[activeId].style.fontWeight = '';
                linkMap[activeId].style.color = '';
              }
              // Apply new highlight
              activeId = id;
              if (linkMap[activeId]) {
                linkMap[activeId].style.fontWeight = '700';
                linkMap[activeId].style.color = '#2d5a3d';
              }
            }
          }
        });
      },
      {
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ----------------------------------------------------------
     FAQ accordion (optional progressive enhancement)
     Clicking an FAQ question collapses / expands the answer
     Does NOT break anything if CSS already shows all answers
     ---------------------------------------------------------- */
  function initFaqAccordion() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var question = item.querySelector('h3');
      var answer = item.querySelector('p');
      if (!question || !answer) return;

      // Style the question as interactive
      question.style.cursor = 'pointer';
      question.setAttribute('role', 'button');
      question.setAttribute('aria-expanded', 'true');

      // Add a subtle toggle indicator
      var indicator = document.createElement('span');
      indicator.textContent = ' ▲';
      indicator.style.fontSize = '0.7rem';
      indicator.style.color = '#888';
      indicator.style.marginLeft = '6px';
      indicator.setAttribute('aria-hidden', 'true');
      question.appendChild(indicator);

      question.addEventListener('click', function () {
        var isOpen = answer.style.display !== 'none';
        answer.style.display = isOpen ? 'none' : '';
        indicator.textContent = isOpen ? ' ▼' : ' ▲';
        question.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  /* ----------------------------------------------------------
     Reading progress bar (thin green bar at top of viewport)
     ---------------------------------------------------------- */
  function initReadingProgress() {
    var bar = document.createElement('div');
    bar.id = 'si-reading-progress';
    bar.style.cssText = [
      'position: fixed',
      'top: 0',
      'left: 0',
      'width: 0%',
      'height: 3px',
      'background: #4a7c59',
      'z-index: 9999',
      'transition: width 0.1s linear',
      'pointer-events: none'
    ].join(';');
    document.body.appendChild(bar);

    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     Boot — run after DOM is ready
     ---------------------------------------------------------- */
  function boot() {
    initSmoothScroll();
    initTocHighlight();
    initFaqAccordion();
    initReadingProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
