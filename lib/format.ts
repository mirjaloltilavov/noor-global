/**
 * Hujjat matni uchun kichik Markdown qatlami.
 *
 * Tashqi kutubxona ishlatilmaydi: sarlavhalar, iqtiboslar, ro'yxatlar,
 * qalin/qiya matn va ajratuvchi chiziq — hujjat uchun shuncha yetadi.
 * Matn avval HTML'dan tozalanadi, keyin belgilar qo'llanadi.
 */

const ARABIC = /[؀-ۿ]/;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(s: string): string {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+?)\*/g, "$1<em>$2</em>")
    .replace(/`([^`]+?)`/g, "<code>$1</code>");
}

function line(s: string): string {
  const cls = ARABIC.test(s) ? ' class="doc-ar" dir="rtl"' : "";
  return `<span${cls}>${inline(s)}</span>`;
}

export function renderMarkdown(md: string): string {
  const out: string[] = [];
  const lines = md.replace(/\r\n/g, "\n").split("\n");

  let list: "ul" | "ol" | null = null;
  let quote: string[] = [];
  let para: string[] = [];

  const closeList = () => {
    if (list) {
      out.push(`</${list}>`);
      list = null;
    }
  };
  const closePara = () => {
    if (para.length) {
      out.push(`<p>${para.map(line).join("<br />")}</p>`);
      para = [];
    }
  };
  const closeQuote = () => {
    if (quote.length) {
      out.push(`<blockquote>${quote.map(line).join("<br />")}</blockquote>`);
      quote = [];
    }
  };
  const closeAll = () => {
    closePara();
    closeQuote();
    closeList();
  };

  for (const raw of lines) {
    const s = raw.trimEnd();

    if (!s.trim()) {
      closeAll();
      continue;
    }

    const h = s.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      closeAll();
      const level = h[1].length + 1; // h1 sarlavha maydonida
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      continue;
    }

    if (/^\s*(---|___|\*\*\*)\s*$/.test(s)) {
      closeAll();
      out.push("<hr />");
      continue;
    }

    const q = s.match(/^>\s?(.*)$/);
    if (q) {
      closePara();
      closeList();
      quote.push(q[1]);
      continue;
    }
    closeQuote();

    const ul = s.match(/^\s*[-*+]\s+(.*)$/);
    if (ul) {
      closePara();
      if (list !== "ul") {
        closeList();
        out.push("<ul>");
        list = "ul";
      }
      out.push(`<li>${line(ul[1])}</li>`);
      continue;
    }

    const ol = s.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ol) {
      closePara();
      if (list !== "ol") {
        closeList();
        out.push("<ol>");
        list = "ol";
      }
      out.push(`<li>${line(ol[1])}</li>`);
      continue;
    }

    closeList();
    para.push(s);
  }

  closeAll();
  return out.join("\n");
}

export interface TidyResult {
  text: string;
  /** Nima o'zgargani — foydalanuvchiga ochiq aytiladi */
  changes: string[];
}

/**
 * Matnni tartibga soladi. Bu imlo tekshiruvchi emas — faqat
 * bo'shliq, tinish belgilari va tuzilma bo'yicha aniq qoidalar.
 * Har bir o'zgarish sanab beriladi, hech narsa yashirin qilinmaydi.
 */
export function tidy(md: string): TidyResult {
  const changes: string[] = [];
  let s = md.replace(/\r\n/g, "\n");
  const note = (n: number, key: string) => {
    if (n > 0) changes.push(`${key}:${n}`);
  };

  // Qator oxiridagi bo'shliqlar
  const trail = (s.match(/[ \t]+$/gm) || []).length;
  s = s.replace(/[ \t]+$/gm, "");
  note(trail, "trailing");

  // Ketma-ket bo'shliqlar (arabcha matnga tegmaydi — u ham bir xil qoidada)
  const dbl = (s.match(/([^\s]) {2,}/g) || []).length;
  s = s.replace(/([^\s]) {2,}/g, "$1 ");
  note(dbl, "spaces");

  // Tinish belgisidan oldin bo'shliq
  const before = (s.match(/\s+([,.;:!?])/g) || []).length;
  s = s.replace(/\s+([,.;:!?])/g, "$1");
  note(before, "punct");

  // Tinish belgisidan keyin bo'shliq yo'q
  const after = (s.match(/([,;:])(?=[^\s\d])/g) || []).length;
  s = s.replace(/([,;:])(?=[^\s\d])/g, "$1 ");
  note(after, "punctAfter");

  // Uch va undan ortiq bo'sh qator
  const blanks = (s.match(/\n{3,}/g) || []).length;
  s = s.replace(/\n{3,}/g, "\n\n");
  note(blanks, "blank");

  // Sarlavha belgisidan keyin bo'shliq
  const heading = (s.match(/^(#{1,4})(?=\S)/gm) || []).length;
  s = s.replace(/^(#{1,4})(?=\S)/gm, "$1 ");
  note(heading, "heading");

  // Ro'yxat belgisidan keyin bo'shliq
  const bullet = (s.match(/^([-*+])(?=\S)/gm) || []).length;
  s = s.replace(/^([-*+])(?=\S)/gm, "$1 ");
  note(bullet, "bullet");

  // Uch nuqta va tire
  const dots = (s.match(/\.{3,}/g) || []).length;
  s = s.replace(/\.{3,}/g, "…");
  note(dots, "ellipsis");

  const dash = (s.match(/(\s)-{2,}(\s)/g) || []).length;
  s = s.replace(/(\s)-{2,}(\s)/g, "$1—$2");
  note(dash, "dash");

  // Boshi va oxiri
  s = s.replace(/^\n+/, "").replace(/\n+$/, "") + "\n";

  return { text: s, changes };
}

/**
 * Word ochadigan HTML (.doc) — chop etish uchun ham shu qolip.
 * Sahifa o'lchami, chekkalar va arabcha matn uchun alohida uslub bor,
 * shuning uchun Word'ga tushganda qayta bezash kerak bo'lmaydi.
 */
export function toWordHtml(title: string, bodyHtml: string): string {
  const safe = title.replace(/[<>&]/g, "");
  return `<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word">
<head><meta charset="utf-8"><title>${safe}</title>
<style>
  @page { size: A4; margin: 2.5cm 2cm 2.5cm 3cm; }
  body {
    font-family: "Times New Roman", Georgia, serif;
    font-size: 14pt; line-height: 1.5; color: #000;
  }
  h1 { font-size: 18pt; text-align: center; margin: 0 0 24pt; }
  h2 { font-size: 15pt; margin: 20pt 0 8pt; }
  h3 { font-size: 13pt; margin: 16pt 0 6pt; }
  p  { margin: 0 0 10pt; text-align: justify; text-indent: 1.25cm; }
  blockquote {
    margin: 12pt 0 12pt 1.25cm; padding-left: 10pt;
    border-left: 1pt solid #888; font-style: normal;
  }
  blockquote p { text-indent: 0; }
  ul, ol { margin: 10pt 0 10pt 1.25cm; }
  li { margin: 0 0 4pt; }
  hr { border: 0; border-top: 1pt solid #bbb; margin: 18pt 0; }
  .doc-ar {
    display: block; direction: rtl; text-align: right;
    font-family: "Traditional Arabic", "Times New Roman", serif;
    font-size: 20pt; line-height: 2;
  }
</style></head>
<body><h1>${safe}</h1>
${bodyHtml}
</body></html>`;
}

/**
 * Bezaklari bilan nusxa olish — Word yoki Google Docs'ga qo'yilganda
 * sarlavha va iqtiboslar saqlanadi. Imkoni bo'lmasa oddiy matn ketadi.
 */
export async function copyRich(html: string, plain: string): Promise<boolean> {
  try {
    const anyWindow = window as unknown as {
      ClipboardItem?: new (items: Record<string, Blob>) => unknown;
    };
    if (navigator.clipboard && anyWindow.ClipboardItem) {
      const item = new anyWindow.ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plain], { type: "text/plain" }),
      });
      await (
        navigator.clipboard as unknown as {
          write: (items: unknown[]) => Promise<void>;
        }
      ).write([item]);
      return true;
    }
    await navigator.clipboard.writeText(plain);
    return true;
  } catch {
    return false;
  }
}
