(() => {
  if (window.__kryvoraDeskLoaded) return;
  window.__kryvoraDeskLoaded = true;
  const style = document.createElement("style");
  style.textContent = `
    #kryvora-desk-root{position:fixed;z-index:2147483647;right:16px;bottom:16px;font:14px/1.5 system-ui,sans-serif;color:#f3f7ff;direction:rtl}
    #kryvora-desk-toggle{border:1px solid #4c7b85;border-radius:16px;background:#102538;color:#75f0cf;padding:12px 16px;font-weight:800;box-shadow:0 8px 30px #0006;cursor:pointer}
    #kryvora-desk-panel{display:none;width:min(390px,calc(100vw - 32px));max-height:min(72vh,650px);overflow:auto;margin-bottom:10px;border:1px solid #31475c;border-radius:18px;background:#0c1626;box-shadow:0 16px 50px #0009;padding:14px}
    #kryvora-desk-panel.open{display:block}#kryvora-desk-panel h3{font-size:16px;margin:0 0 8px;color:#75f0cf}
    #kryvora-desk-panel p{color:#afbed0;font-size:12px;margin:0 0 10px}
    #kryvora-desk-panel textarea{width:100%;min-height:125px;resize:vertical;box-sizing:border-box;background:#111f32;border:1px solid #334960;border-radius:10px;color:#f3f7ff;padding:10px;font:13px/1.6 system-ui}
    #kryvora-desk-panel button{cursor:pointer;border-radius:10px;border:1px solid #36546a;padding:9px 11px;font:700 13px system-ui}
    #kryvora-desk-scan{background:#1a3045;color:#e9f3ff}#kryvora-desk-answer{background:#75f0cf;color:#06231c;border:0;flex:1}
    #kryvora-desk-actions{display:flex;gap:8px;margin:9px 0}#kryvora-desk-status{font-size:12px;color:#9eb4ca;margin:8px 0}
    #kryvora-desk-result{white-space:pre-wrap;overflow-wrap:anywhere;background:#111f32;border-radius:10px;padding:10px;font-size:13px;line-height:1.7}
    #kryvora-desk-result a{color:#75f0cf}@media(max-width:480px){#kryvora-desk-root{right:8px;bottom:8px}}
  `;
  (document.head || document.documentElement).appendChild(style);
  const root = document.createElement("div");
  root.id = "kryvora-desk-root";
  root.innerHTML = `<section id="kryvora-desk-panel"><h3>Kryvora Answer Desk</h3><p>متن سؤال را بخوان و جواب مستند را جست‌وجو کن.</p><textarea id="kryvora-desk-text" placeholder="روی «خواندن صفحه» بزن یا سؤال را اینجا وارد کن…"></textarea><div id="kryvora-desk-actions"><button id="kryvora-desk-scan">خواندن صفحه</button><button id="kryvora-desk-answer">پیدا کردن جواب</button></div><div id="kryvora-desk-status">ابتدا کلید API را از پنجره افزونه ذخیره کن.</div><div id="kryvora-desk-result" hidden></div></section><button id="kryvora-desk-toggle">✳ جواب سریع Kryvora</button>`;
  (document.body || document.documentElement).appendChild(root);
  const $ = id => root.querySelector("#" + id);
  const panel = $("kryvora-desk-panel"), textarea = $("kryvora-desk-text");
  $("kryvora-desk-toggle").addEventListener("click", () => panel.classList.toggle("open"));
  function readPage() {
    const selected = String(window.getSelection?.() || "").trim();
    if (selected.length > 20) return selected;
    const text = (document.body?.innerText || "").replace(/\n{3,}/g, "\n\n").trim();
    if (text.length <= 12000) return text;
    const q = Math.max(text.indexOf("?"), text.indexOf("؟"));
    return q > 0 ? text.slice(Math.max(0,q-1800),Math.min(text.length,q+5500)) : text.slice(0,12000);
  }
  $("kryvora-desk-scan").addEventListener("click", () => {
    textarea.value = readPage();
    $("kryvora-desk-status").textContent = textarea.value ? "متن صفحه خوانده شد؛ سؤال و گزینه‌ها را بررسی کن." : "متنی پیدا نشد؛ سؤال را دستی وارد کن.";
    $("kryvora-desk-result").hidden = true;
  });
  $("kryvora-desk-answer").addEventListener("click", () => {
    const text = textarea.value.trim() || readPage();
    if (!text) { $("kryvora-desk-status").textContent = "متنی پیدا نشد؛ سؤال را وارد کن."; return; }
    $("kryvora-desk-status").textContent = "در حال جست‌وجوی وب و بررسی منابع…";
    $("kryvora-desk-answer").disabled = true; $("kryvora-desk-result").hidden = true;
    chrome.runtime.sendMessage({type:"KRYVORA_ANSWER",text}, response => {
      $("kryvora-desk-answer").disabled = false;
      if (chrome.runtime.lastError) { $("kryvora-desk-status").textContent = "خطا؛ افزونه را Reload کن."; return; }
      if (!response?.ok) { $("kryvora-desk-status").textContent = "مشکل در دریافت جواب"; $("kryvora-desk-result").textContent = response?.error || "خطای نامشخص"; $("kryvora-desk-result").hidden = false; return; }
      $("kryvora-desk-status").textContent = "پاسخ آماده است؛ منابع را بررسی کن.";
      const result = $("kryvora-desk-result"); result.textContent = response.answer;
      if (response.citations?.length) {
        const list = document.createElement("div"); list.style.marginTop = "10px";
        const title = document.createElement("strong"); title.textContent = "منابع:"; list.appendChild(title);
        for (const source of response.citations) { const a = document.createElement("a"); a.href = source.url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = source.title; a.style.display = "block"; a.style.marginTop = "5px"; list.appendChild(a); }
        result.appendChild(list);
      }
      result.hidden = false;
    });
  });
  document.addEventListener("keydown", e => { if(e.altKey && e.shiftKey && e.key.toLowerCase()==="k") panel.classList.toggle("open"); });
})();