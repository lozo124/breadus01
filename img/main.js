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
        background: rgba(0,0,0,0.5);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background: white;
          border-radius: 12px;
          width: 88%;
          max-width: 400px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        ">
          <div style="
            background: #3aaf4e;
            color: white;
            font-weight: bold;
            font-size: 18px;
            padding: 14px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
            <span>⏱ LIMITED TIME</span>
            <span id="closePopup" style="cursor:pointer; font-size:20px;">✕</span>
          </div>
          <div style="padding: 20px; text-align: center;">
            <img src="https://dailylifeinsider.com/wp-content/uploads/2025/03/3408904830894308943.jpg"
              style="
                width: 200px;
                height: 200px;
                object-fit: cover;
                border-radius: 8px;
                display: block;
                margin: 0 auto 16px auto;
              "
            />
            <div style="font-size:20px; font-weight:bold; margin-bottom:6px;">
              Get Your 50% Off Today!
            </div>
            <div style="font-size:14px; color:#555; margin-bottom:20px;">
              Get yours for 50% OFF Today only
            </div>
            <a href="${trackingUrl}" style="
              display: block;
              background: #3aaf4e;
              color: white;
              font-weight: bold;
              font-size: 16px;
              padding: 14px;
              border-radius: 8px;
              text-decoration: none;
              letter-spacing: 1px;
            ">Claim Your Special Price Now →</a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('closePopup').addEventListener('click', function() {
      overlay.style.display = 'none';
    });

  });
}

// ========== 滚动监听：到35%触发一次 ==========
let popupShown = false;
window.addEventListener('scroll', function() {
  if (popupShown) return;
  const scrolled = window.scrollY + window.innerHeight;
  const total = document.body.scrollHeight;
  if (scrolled / total >= 0.35) {
    popupShown = true;
    createPopup();
  }
});
