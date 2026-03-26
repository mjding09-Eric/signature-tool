const defaults = {
  fullName: "Emma",
  jobTitle: "Domain Name Operations Manager",
  email: "emma@juyu.com",
  phone: "+86 187 2616 7655",
  websiteLabel: "www.juyu.com",
  websiteUrl: "https://www.juyu.com",
  logoUrl: "https://raw.githubusercontent.com/mjding09-Eric/email-signature-assets/main/juyu-logo.png",
  companyName: "AppWave Limited",
  addressLine1: "Ming Sang Industrial Building,",
  addressLine2: "19 Hing Yip Street, Kwun Tong, Kowloon",
  linkedin: "",
  facebook: "",
  instagram: "",
  youtube: "",
  telegram: "",
  whatsapp: "",
};

const socialDefinitions = [
  {
    key: "linkedin",
    label: "LinkedIn",
    iconUrl: "https://cdn.simpleicons.org/linkedin/0A66C2",
  },
  {
    key: "facebook",
    label: "Facebook",
    iconUrl: "https://cdn.simpleicons.org/facebook/1877F2",
  },
  {
    key: "instagram",
    label: "Instagram",
    iconUrl: "https://cdn.simpleicons.org/instagram/E4405F",
  },
  {
    key: "youtube",
    label: "YouTube",
    iconUrl: "https://cdn.simpleicons.org/youtube/FF0000",
  },
  {
    key: "telegram",
    label: "Telegram",
    iconUrl: "https://cdn.simpleicons.org/telegram/26A5E4",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    iconUrl: "https://cdn.simpleicons.org/whatsapp/25D366",
  },
];

const form = document.getElementById("signature-form");
const preview = document.getElementById("signature-preview");
const htmlOutput = document.getElementById("html-output");
const statusMessage = document.getElementById("status-message");
const copyHtmlButton = document.getElementById("copy-html");
const copyCodeInlineButton = document.getElementById("copy-code-inline");
const downloadButton = document.getElementById("download-html");
const resetButton = document.getElementById("reset-form");
const logoFileInput = document.getElementById("logo-file");
const clearLogoUploadButton = document.getElementById("clear-logo-upload");
const logoSourceLabel = document.getElementById("logo-source");
const shareToolButton = document.getElementById("share-tool");
const copyPageLinkButton = document.getElementById("copy-page-link");
const shareUrlElement = document.getElementById("share-url");

let uploadedLogoDataUrl = "";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (/^(https?:\/\/|mailto:|tel:|data:)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function normalizePhoneLink(value) {
  return String(value || "").replace(/[^\d+]/g, "");
}

function getFormData() {
  const data = Object.fromEntries(new FormData(form).entries());
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]),
  );
}

function getEffectiveLogoUrl(data) {
  return uploadedLogoDataUrl || normalizeUrl(data.logoUrl);
}

function updateLogoSourceLabel() {
  logoSourceLabel.textContent = uploadedLogoDataUrl ? "当前使用：已上传本地 Logo" : "当前使用：Logo 链接";
}

function buildAddressMarkup(data) {
  const lines = [data.addressLine1, data.addressLine2].filter(Boolean);
  if (!lines.length) return "";
  return lines.map((line) => `${escapeHtml(line)}<br>`).join("").replace(/<br>$/, "");
}

function buildContactRow(label, href, text, accent) {
  if (!href || !text) return "";

  const linkStyle = accent
    ? `color:${accent}; text-decoration:none; font-weight:700;`
    : "color:#17212B; text-decoration:none;";

  return `
            <tr>
              <td style="padding:0 0 8px 0; font-size:13px; color:#24313D;">
                <span style="display:inline-block; min-width:58px; color:#7B6A58; font-weight:700;">${escapeHtml(label)}</span>
                <a href="${escapeHtml(href)}" style="${linkStyle}">${escapeHtml(text)}</a>
              </td>
            </tr>`;
}

function buildSocialMarkup(data) {
  const items = socialDefinitions
    .map((platform) => {
      const rawUrl = data[platform.key];
      if (!rawUrl) return "";

      const url = normalizeUrl(rawUrl);
      return `
          <a href="${escapeHtml(url)}" style="display:inline-block; width:34px; height:34px; margin:0 8px 0 0; border:1px solid #E3D8CB; border-radius:999px; background-color:#FFFFFF; text-decoration:none;">
            <img src="${escapeHtml(platform.iconUrl)}" alt="${escapeHtml(platform.label)}" width="16" height="16" border="0" style="display:block; width:16px; height:16px; margin:9px; outline:none;">
          </a>`;
    })
    .filter(Boolean)
    .join("");

  if (!items) return "";

  return `
        <tr>
          <td style="padding-top:14px;">
            <div style="font-size:0; line-height:0;">${items}</div>
          </td>
        </tr>`;
}

function buildSignatureHtml(data) {
  const emailText = data.email;
  const phoneText = data.phone;
  const websiteText = data.websiteLabel || data.websiteUrl;
  const websiteUrl = normalizeUrl(data.websiteUrl);
  const logoUrl = escapeHtml(getEffectiveLogoUrl(data));
  const companyName = data.companyName ? escapeHtml(data.companyName) : "";
  const addressMarkup = buildAddressMarkup(data);
  const socialMarkup = buildSocialMarkup(data);
  const phoneLink = phoneText ? `tel:${normalizePhoneLink(phoneText)}` : "";
  const emailLink = emailText ? `mailto:${emailText}` : "";
  const websiteBadge = websiteUrl && websiteText
    ? `<tr>
          <td style="padding-top:12px;">
            <a href="${escapeHtml(websiteUrl)}" style="display:inline-block; padding:7px 12px; border:1px solid #DCCDBB; border-radius:999px; background-color:#FFFFFF; color:#A2784F; font-size:12px; font-weight:700; text-decoration:none;">
              ${escapeHtml(websiteText)}
            </a>
          </td>
        </tr>`
    : "";
  const companyBlock = companyName
    ? `<tr>
          <td style="padding-top:14px; font-size:15px; line-height:1.3; font-weight:700; color:#101820;">
            ${companyName}
          </td>
        </tr>`
    : "";
  const addressBlock = addressMarkup
    ? `<tr>
          <td style="padding-top:8px; font-size:12px; line-height:1.55; color:#5C6873;">
            ${addressMarkup}
          </td>
        </tr>`
    : "";
  const contactMarkup = [
    buildContactRow("Email", emailLink, emailText, ""),
    buildContactRow("Phone", phoneLink, phoneText, ""),
    buildContactRow("Web", websiteUrl, websiteText, "#A2784F"),
  ]
    .filter(Boolean)
    .join("");

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Helvetica, Arial, sans-serif; color:#17212B; line-height:1.45; background-color:#FBF8F3; border:1px solid #E6DED2; border-radius:16px;">
  <tr>
    <td width="184" style="width:184px; padding:20px 18px; vertical-align:top; background-color:#F5ECDD; border-right:1px solid #E6D8C8;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td>
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background-color:#FFFFFF; border:1px solid #E6DDD2; border-radius:12px; padding:12px; text-align:center;">
                  <img src="${logoUrl}" alt="Company Logo" width="76" height="76" border="0" style="display:block; width:76px; height:76px; outline:none; text-decoration:none;">
                </td>
              </tr>
            </table>
          </td>
        </tr>
${companyBlock}
${addressBlock}
${websiteBadge}
      </table>
    </td>
    <td style="padding:20px 22px; vertical-align:top;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding-bottom:10px; border-bottom:1px solid #E5DACD;">
            <div style="font-size:20px; line-height:1.15; font-weight:700; color:#101820;">${escapeHtml(data.fullName)}</div>
            <div style="padding-top:5px; font-size:11px; line-height:1.45; font-weight:700; letter-spacing:1.1px; text-transform:uppercase; color:#A2784F;">
              ${escapeHtml(data.jobTitle)}
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding-top:14px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#FFFFFF; border:1px solid #E8DED1; border-radius:12px;">
              <tr>
                <td style="padding:12px 14px 6px 14px;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
${contactMarkup}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
${socialMarkup}
      </table>
    </td>
  </tr>
</table>`;
}

function buildPreviewDocument(signatureHtml) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Signature Preview</title>
</head>
<body style="margin:0; padding:28px; background:linear-gradient(180deg, #f8f1e8 0%, #ffffff 100%);">
  ${signatureHtml}
</body>
</html>`;
}

function setStatus(message) {
  statusMessage.textContent = message;
}

function getShareUrl() {
  if (!window.location.href.startsWith("http://") && !window.location.href.startsWith("https://")) {
    return "";
  }
  return window.location.href;
}

function updateShareUrl() {
  const shareUrl = getShareUrl();
  shareUrlElement.textContent = shareUrl || "未通过可分享链接访问";
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true);
  }

  htmlOutput.focus();
  htmlOutput.select();
  return Promise.resolve(document.execCommand("copy"));
}

function updatePreview() {
  const data = getFormData();
  const signatureHtml = buildSignatureHtml(data);
  const previewDoc = buildPreviewDocument(signatureHtml);

  htmlOutput.value = signatureHtml;
  preview.srcdoc = previewDoc;
  updateLogoSourceLabel();
  updateShareUrl();
}

function downloadHtml() {
  const blob = new Blob([htmlOutput.value], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "email-signature.html";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  setStatus("HTML 文件已下载。");
}

function resetForm() {
  Object.entries(defaults).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (field) field.value = value;
  });

  uploadedLogoDataUrl = "";
  logoFileInput.value = "";
  updatePreview();
  setStatus("已恢复默认示例内容。");
}

function handleLogoUpload(event) {
  const [file] = event.target.files || [];
  if (!file) {
    uploadedLogoDataUrl = "";
    updatePreview();
    setStatus("已切回 Logo 链接。");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    uploadedLogoDataUrl = typeof reader.result === "string" ? reader.result : "";
    updatePreview();
    setStatus("本地 Logo 已上传并应用到预览。");
  };
  reader.onerror = () => {
    uploadedLogoDataUrl = "";
    logoFileInput.value = "";
    updatePreview();
    setStatus("Logo 上传失败，请重试。");
  };
  reader.readAsDataURL(file);
}

async function handleCopyPageLink() {
  const shareUrl = getShareUrl();
  if (!shareUrl) {
    setStatus("当前是本地文件模式。请用 start.command 启动后再复制分享链接。");
    return;
  }

  try {
    const copied = await copyText(shareUrl);
    setStatus(copied ? "页面链接已复制，可直接发到社交软件。" : "复制失败，请手动复制当前页面地址。");
  } catch (error) {
    setStatus("复制失败，请手动复制当前页面地址。");
  }
}

async function handleShareTool() {
  const shareUrl = getShareUrl();
  if (!shareUrl) {
    setStatus("当前是本地文件模式。请用 start.command 启动后再分享链接。");
    return;
  }

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Juyu Email Signature Builder",
        text: "Business email signature builder",
        url: shareUrl,
      });
      setStatus("分享面板已打开。");
      return;
    } catch (error) {
      if (error && error.name === "AbortError") {
        setStatus("已取消分享。");
        return;
      }
    }
  }

  await handleCopyPageLink();
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (window.location.protocol !== "http:" && window.location.protocol !== "https:") return;

  navigator.serviceWorker.register("./service-worker.js").catch(() => {
    setStatus("离线缓存注册失败，但页面仍可正常使用。");
  });
}

form.addEventListener("input", () => {
  updatePreview();
  setStatus("签名已更新。");
});

logoFileInput.addEventListener("change", handleLogoUpload);

clearLogoUploadButton.addEventListener("click", () => {
  uploadedLogoDataUrl = "";
  logoFileInput.value = "";
  updatePreview();
  setStatus("已移除上传 Logo，当前使用链接地址。");
});

shareToolButton.addEventListener("click", handleShareTool);
copyPageLinkButton.addEventListener("click", handleCopyPageLink);

copyHtmlButton.addEventListener("click", async () => {
  try {
    const copied = await copyText(htmlOutput.value);
    setStatus(copied ? "HTML 已复制到剪贴板。" : "复制失败，请手动选中代码后复制。");
  } catch (error) {
    setStatus("复制失败，请手动选中代码后复制。");
  }
});

copyCodeInlineButton.addEventListener("click", async () => {
  try {
    const copied = await copyText(htmlOutput.value);
    setStatus(copied ? "HTML 已复制到剪贴板。" : "复制失败，请手动选中代码后复制。");
  } catch (error) {
    setStatus("复制失败，请手动选中代码后复制。");
  }
});

downloadButton.addEventListener("click", downloadHtml);
resetButton.addEventListener("click", resetForm);

resetForm();
registerServiceWorker();
