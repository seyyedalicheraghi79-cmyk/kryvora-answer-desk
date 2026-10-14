const keyInput = document.getElementById("key");
const status = document.getElementById("status");
chrome.storage.local.get(["apiKey"], ({apiKey}) => { if (apiKey) status.textContent = "کلید ذخیره شده است. برای تعویض، کلید جدید وارد کن."; });
document.getElementById("save").addEventListener("click", async () => {
  const key = keyInput.value.trim();
  if (!key) { status.textContent = "کلید API را وارد کن."; return; }
  if (!key.startsWith("sk-")) { status.textContent = "فرمت کلید را بررسی کن؛ معمولاً با sk- شروع می‌شود."; return; }
  await chrome.storage.local.set({apiKey:key});
  keyInput.value = "";
  status.textContent = "کلید در همین مرورگر ذخیره شد.";
});
document.getElementById("clear").addEventListener("click", async () => {
  await chrome.storage.local.remove("apiKey");
  keyInput.value = "";
  status.textContent = "کلید ذخیره‌شده پاک شد.";
});