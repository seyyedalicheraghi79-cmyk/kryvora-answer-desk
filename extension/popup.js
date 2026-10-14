const keyInput = document.getElementById("key");
const status = document.getElementById("status");
chrome.storage.local.get(["geminiApiKey"], ({geminiApiKey}) => {
  if (geminiApiKey) status.textContent = "کلید Gemini ذخیره شده است. برای تعویض، کلید جدید وارد کن.";
});
document.getElementById("save").addEventListener("click", async () => {
  const key = keyInput.value.trim();
  if (!key) { status.textContent = "کلید Gemini API را وارد کن."; return; }
  if (/\s/.test(key)) { status.textContent = "کلید را بدون فاصله اضافی وارد کن."; return; }
  await chrome.storage.local.set({geminiApiKey: key});
  await chrome.storage.local.remove("apiKey");
  keyInput.value = "";
  status.textContent = "کلید Gemini در همین مرورگر ذخیره شد.";
});
document.getElementById("clear").addEventListener("click", async () => {
  await chrome.storage.local.remove(["geminiApiKey", "apiKey"]);
  keyInput.value = "";
  status.textContent = "کلید ذخیره‌شده پاک شد.";
});