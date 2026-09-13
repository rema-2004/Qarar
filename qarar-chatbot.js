(function () {
  "use strict";

  const CONFIG = {
    BACKEND_URL: "https://qarar-backend.vercel.app/api/chat",
    WIDGET_TITLE: "المساعد القانوني لمنصة قرار",
    WIDGET_SUBTITLE: "أسئلة عن قانون الانتخاب الأردني",
  };

  const SUGGESTED_QUESTIONS = [
    "كم عدد مقاعد مجلس النواب؟",
    "شو نسبة الحسم للقوائم؟",
    "مين إلو حق الترشح؟",
    "كيف بقدر أعترض على جدول الناخبين؟",
  ];

  const STYLE = `
  :root {
    --qc-ink: #16211c; --qc-panel: #ffffff; --qc-bg-soft: #f4f6f3;
    --qc-green: #1f6d4c; --qc-green-dark: #164f38; --qc-gold: #b08d57;
    --qc-border: #e2e6e1; --qc-text-dim: #5b665e; --qc-radius: 16px;
    --qc-font: "Tajawal", "Segoe UI", Tahoma, sans-serif;
  }
  #qc-launcher {
    position: fixed; bottom: 22px; left: 22px; z-index: 999998;
    width: 58px; height: 58px; border-radius: 50%;
    background: linear-gradient(145deg, var(--qc-green), var(--qc-green-dark));
    box-shadow: 0 6px 20px rgba(22, 33, 28, 0.35); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.15s ease; font-family: var(--qc-font);
  }
  #qc-launcher:hover { transform: scale(1.06); }
  #qc-launcher svg { width: 26px; height: 26px; fill: #f4f6f3; }
  #qc-launcher .qc-dot {
    position: absolute; top: 6px; left: 6px; width: 10px; height: 10px;
    border-radius: 50%; background: var(--qc-gold); border: 2px solid var(--qc-panel);
  }
  #qc-panel {
    position: fixed; bottom: 92px; left: 22px; z-index: 999999;
    width: 360px; max-width: calc(100vw - 32px); height: 520px;
    max-height: calc(100vh - 130px); background: var(--qc-panel);
    border-radius: var(--qc-radius); box-shadow: 0 16px 48px rgba(22, 33, 28, 0.28);
    display: none; flex-direction: column; overflow: hidden;
    font-family: var(--qc-font); direction: rtl; border: 1px solid var(--qc-border);
  }
  #qc-panel.qc-open { display: flex; }
  #qc-header {
    background: linear-gradient(120deg, var(--qc-green-dark), var(--qc-green));
    color: #f4f6f3; padding: 16px 18px; display: flex; align-items: center;
    justify-content: space-between; flex-shrink: 0;
  }
  #qc-header .qc-titles { display: flex; flex-direction: column; gap: 2px; }
  #qc-header h3 { margin: 0; font-size: 15px; font-weight: 700; }
  #qc-header p { margin: 0; font-size: 11.5px; opacity: 0.85; font-weight: 400; }
  #qc-close {
    background: rgba(255,255,255,0.12); border: none; color: #f4f6f3;
    width: 26px; height: 26px; border-radius: 50%; cursor: pointer;
    font-size: 15px; line-height: 1; display: flex; align-items: center; justify-content: center;
  }
  #qc-close:hover { background: rgba(255,255,255,0.22); }
  #qc-messages {
    flex: 1; overflow-y: auto; padding: 16px; background: var(--qc-bg-soft);
    display: flex; flex-direction: column; gap: 10px;
  }
  .qc-msg { max-width: 84%; padding: 10px 13px; border-radius: 14px; font-size: 13.5px; line-height: 1.6; white-space: pre-wrap; }
  .qc-msg.qc-bot { align-self: flex-start; background: var(--qc-panel); border: 1px solid var(--qc-border); color: var(--qc-ink); border-bottom-left-radius: 4px; }
  .qc-msg.qc-user { align-self: flex-end; background: var(--qc-green); color: #f4f6f3; border-bottom-right-radius: 4px; }
  .qc-msg.qc-error { align-self: center; background: #fbeaea; color: #8a2e2e; border: 1px solid #eecccc; font-size: 12.5px; }
  .qc-suggestions { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 2px 4px; }
  .qc-chip {
    background: var(--qc-panel); border: 1px solid var(--qc-border); color: var(--qc-green-dark);
    font-family: var(--qc-font); font-size: 12px; padding: 7px 12px; border-radius: 999px;
    cursor: pointer; transition: background 0.15s ease;
  }
  .qc-chip:hover { background: #eaf1ec; }
  .qc-typing { align-self: flex-start; display: flex; gap: 4px; padding: 10px 13px; }
  .qc-typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--qc-text-dim); opacity: 0.5; animation: qc-blink 1.2s infinite; }
  .qc-typing span:nth-child(2) { animation-delay: 0.2s; }
  .qc-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes qc-blink { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }
  #qc-inputbar {
    display: flex; align-items: center; gap: 8px; padding: 10px;
    border-top: 1px solid var(--qc-border); background: var(--qc-panel); flex-shrink: 0;
  }
  #qc-input {
    flex: 1; border: 1px solid var(--qc-border); border-radius: 999px;
    padding: 10px 14px; font-family: var(--qc-font); font-size: 13.5px; outline: none; direction: rtl;
  }
  #qc-input:focus { border-color: var(--qc-green); }
  #qc-send {
    background: var(--qc-green); border: none; width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
  }
  #qc-send:hover { background: var(--qc-green-dark); }
  #qc-send svg { width: 16px; height: 16px; fill: #f4f6f3; transform: rotate(180deg); }
  #qc-send:disabled { opacity: 0.5; cursor: not-allowed; }
  @media (max-width: 420px) {
    #qc-panel { left: 8px; right: 8px; width: auto; bottom: 82px; }
    #qc-launcher { left: 14px; bottom: 14px; }
  }
  `;

  function injectStyles() {
    const styleEl = document.createElement("style");
    styleEl.id = "qc-styles";
    styleEl.textContent = STYLE;
    document.head.appendChild(styleEl);
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap";
    document.head.appendChild(fontLink);
  }

  function buildDOM() {
    const launcher = document.createElement("button");
    launcher.id = "qc-launcher";
    launcher.setAttribute("aria-label", "افتح المساعد القانوني");
    launcher.innerHTML = `
      <span class="qc-dot"></span>
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.03 2 11c0 2.4 1.05 4.57 2.77 6.19-.15 1.36-.65 2.68-1.5 3.81-.15.2 0 .48.25.44 2.1-.35 3.9-1.23 5.31-2.34.99.24 2.04.37 3.17.37 5.52 0 10-4.03 10-9S17.52 2 12 2z"/></svg>
    `;
    const panel = document.createElement("div");
    panel.id = "qc-panel";
    panel.innerHTML = `
      <div id="qc-header">
        <div class="qc-titles">
          <h3>${CONFIG.WIDGET_TITLE}</h3>
          <p>${CONFIG.WIDGET_SUBTITLE}</p>
        </div>
        <button id="qc-close" aria-label="إغلاق">✕</button>
      </div>
      <div id="qc-messages"></div>
      <div id="qc-inputbar">
        <input id="qc-input" type="text" placeholder="اكتب سؤالك هون..." autocomplete="off" />
        <button id="qc-send" aria-label="إرسال">
          <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(launcher);
    document.body.appendChild(panel);
    return { launcher, panel };
  }

  function init() {
    injectStyles();
    const { launcher, panel } = buildDOM();
    const messagesEl = panel.querySelector("#qc-messages");
    const inputEl = panel.querySelector("#qc-input");
    const sendBtn = panel.querySelector("#qc-send");
    const closeBtn = panel.querySelector("#qc-close");

    let history = [];
    try {
      const saved = sessionStorage.getItem("qc_history");
      if (saved) history = JSON.parse(saved);
    } catch (e) {}

    function persist() {
      try { sessionStorage.setItem("qc_history", JSON.stringify(history)); } catch (e) {}
    }

    function renderMessage(role, text) {
      const div = document.createElement("div");
      div.className = "qc-msg " + (role === "user" ? "qc-user" : role === "error" ? "qc-error" : "qc-bot");
      div.textContent = text;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function renderSuggestions() {
      const wrap = document.createElement("div");
      wrap.className = "qc-suggestions";
      SUGGESTED_QUESTIONS.forEach((q) => {
        const chip = document.createElement("button");
        chip.className = "qc-chip";
        chip.textContent = q;
        chip.addEventListener("click", () => sendMessage(q));
        wrap.appendChild(chip);
      });
      messagesEl.appendChild(wrap);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
      const t = document.createElement("div");
      t.className = "qc-typing";
      t.id = "qc-typing-indicator";
      t.innerHTML = "<span></span><span></span><span></span>";
      messagesEl.appendChild(t);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function hideTyping() {
      const t = document.getElementById("qc-typing-indicator");
      if (t) t.remove();
    }

    function restoreConversation() {
      if (history.length === 0) {
        renderMessage("bot", "أهلاً! أنا المساعد القانوني لمنصة قرار 👋\nبقدر أساعدك تفهم قانون الانتخاب الأردني وآلية استخدام المنصة. جرّب تسأل عن وحدة من هاي:");
        renderSuggestions();
      } else {
        history.forEach((m) => renderMessage(m.role === "user" ? "user" : "bot", m.content));
      }
    }

    async function callBackend(userText) {
      history.push({ role: "user", content: userText });
      persist();
      showTyping();
      sendBtn.disabled = true;
      try {
        const response = await fetch(CONFIG.BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });
        const data = await response.json();
        hideTyping();
        if (!response.ok) {
          renderMessage("error", data.error || "صار في خطأ بالاتصال بالمساعد. جرّب مرة ثانية بعد شوي.");
          sendBtn.disabled = false;
          return;
        }
        const replyText = data.reply || "ما قدرت أفهم السؤال، ممكن تعيد صياغته؟";
        renderMessage("bot", replyText);
        history.push({ role: "assistant", content: replyText });
        persist();
      } catch (err) {
        hideTyping();
        renderMessage("error", "ما قدرنا نتواصل مع الخادم. تأكد من اتصالك بالإنترنت وحاول مرة ثانية.");
      } finally {
        sendBtn.disabled = false;
      }
    }

    function sendMessage(text) {
      const trimmed = (text || inputEl.value).trim();
      if (!trimmed) return;
      renderMessage("user", trimmed);
      inputEl.value = "";
      callBackend(trimmed);
    }

    launcher.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("qc-open");
      if (isOpen && messagesEl.children.length === 0) {
        restoreConversation();
        inputEl.focus();
      }
    });

    closeBtn.addEventListener("click", () => panel.classList.remove("qc-open"));
    sendBtn.addEventListener("click", () => sendMessage());
    inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
