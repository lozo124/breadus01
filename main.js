/* ============================================================
   main.js — Unified script
   Merged: main.js + search-info.js
   ============================================================ */

/* ============================================================
   SECTION 1: Original main.js
   ============================================================ */

// ========== 等待 MaxConv 注入参数后返回完整 URL ==========
function getMaxConvUrl(callback) {
  const fallback = 'https://track.healthdeepinsight.com/click';
  let attempts = 0;
  const maxAttempts = 30;

  const timer = setInterval(function() {
    attempts++;
    const links = document.querySelectorAll('a[href*="track.healthdeepinsight.com/click"]');
    for (let link of links) {
      if (link.href && link.href.includes('mc_attr')) {
        clearInterval(timer);
        console.log('[MaxConv] 成功获取追踪 URL:', link.href);
        callback(link.href);
        return;
      }
    }
    if (attempts >= maxAttempts) {
      clearInterval(timer);
      console.warn('[MaxConv] 超时，使用裸 URL 兜底');
      callback(fallback);
    }
  }, 100);
}

// ========== DOMContentLoaded ==========
document.addEventListener('DOMContentLoaded', function() {


    // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = this.closest('.faq-item');
      var isOpen = item.classList.contains('is-open');

      // Close all
      document.querySelectorAll('.faq-item.is-open').forEach(function(openItem) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        item.classList.add('is-open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });


  // 动态时间（只显示日期）
  const dateElement = document.getElementById('currentDate');
  if (dateElement) {
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-GB', options);
  }

  // Load more comments 按钮
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      loadMoreBtn.textContent = 'No more comments';
      loadMoreBtn.disabled = true;
      loadMoreBtn.style.opacity = '0.6';
    });
  }

  /* ============================================================
     SECTION 2: search-info.js (supplemental logic)
     ============================================================ */

  // Smooth scroll for all in-page anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // TOC highlight on scroll
  if ('IntersectionObserver' in window) {
    var tocLinks = document.querySelectorAll('.toc-box a[href^="#"]');
    if (tocLinks.length) {
      var linkMap = {};
      tocLinks.forEach(function(link) {
        var id = link.getAttribute('href').slice(1);
        linkMap[id] = link;
      });

      var sections = Object.keys(linkMap)
        .map(function(id) { return document.getElementById(id); })
        .filter(Boolean);

      var activeId = null;

      var observer = new IntersectionObserver(
        function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              var id = entry.target.id;
              if (id !== activeId) {
                if (activeId && linkMap[activeId]) {
                  linkMap[activeId].style.fontWeight = '';
                  linkMap[activeId].style.color = '';
                }
                activeId = id;
                if (linkMap[activeId]) {
                  linkMap[activeId].style.fontWeight = '700';
                  linkMap[activeId].style.color = '#2d5a3d';
                }
              }
            }
          });
        },
        { rootMargin: '0px 0px -60% 0px', threshold: 0 }
      );

      sections.forEach(function(section) {
        observer.observe(section);
      });
    }
  }

});

// ========== 滚动35%弹窗 ==========
function createPopup() {
  getMaxConvUrl(function(trackingUrl) {

    const overlay = document.createElement('div');
    overlay.id = 'popupOverlay';
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background: #fff;
          border-radius: 12px;
          padding: 32px 28px;
          max-width: 420px;
          width: 90%;
          position: relative;
          text-align: center;
        ">
          <button onclick="document.getElementById('popupOverlay').remove()" style="
            position: absolute;
            top: 12px; right: 16px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #999;
          ">✕</button>
          <p style="font-size:1.1rem; font-weight:700; margin-bottom:12px;">
            Wait — before you go
          </p>
          <p style="font-size:0.95rem; color:#555; margin-bottom:20px;">
            Get 60% off the beeswax bread bag today only.
          </p>
          <a href="${trackingUrl}" style="
            display: inline-block;
            background: #4a7c59;
            color: #fff;
            padding: 13px 28px;
            border-radius: 6px;
            font-weight: 700;
            text-decoration: none;
            font-size: 1rem;
          ">Claim My Discount →</a>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  });
}

// 滚动深度触发弹窗
(function() {
  var popupShown = false;
  window.addEventListener('scroll', function() {
    if (popupShown) return;
    var scrolled = window.scrollY + window.innerHeight;
    var total = document.documentElement.scrollHeight;
    if (scrolled / total >= 0.35) {
      popupShown = true;
      createPopup();
    }
  });
})();
