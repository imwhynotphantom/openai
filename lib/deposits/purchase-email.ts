import "server-only";
import { Resend } from "resend";
import { isLocale, type Locale } from "@/lib/i18n/config";

type CreditEmailVars = {
  amountUsdc: string;
  openAmount: string;
  purchaseUrl: string;
};

const TEMPLATES: Record<Locale, { subject: (v: CreditEmailVars) => string; html: (v: CreditEmailVars) => string }> = {
  es: {
    subject: (v) => `Compra confirmada: ${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "Compra confirmada",
      `${v.amountUsdc} USDC acreditados = <strong>${v.openAmount} OPEN</strong> reservados.`,
      "Recibirás tus OPEN en el lanzamiento. Puedes consultar tu compra en cualquier momento:",
      "Ver mi compra",
      v.purchaseUrl,
      "Este email es tu recibo. Guárdalo por si necesitas consultar tu compra más adelante."
    ),
  },
  en: {
    subject: (v) => `Purchase confirmed: ${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "Purchase confirmed",
      `${v.amountUsdc} USDC credited = <strong>${v.openAmount} OPEN</strong> reserved.`,
      "You will receive your OPEN at launch. View your purchase anytime:",
      "View my purchase",
      v.purchaseUrl,
      "This email is your receipt. Keep it if you need to check your purchase later."
    ),
  },
  fr: {
    subject: (v) => `Achat confirmé : ${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "Achat confirmé",
      `${v.amountUsdc} USDC crédités = <strong>${v.openAmount} OPEN</strong> réservés.`,
      "Vous recevrez vos OPEN au lancement. Consultez votre achat à tout moment :",
      "Voir mon achat",
      v.purchaseUrl,
      "Cet email est votre reçu. Conservez-le pour consulter votre achat plus tard."
    ),
  },
  de: {
    subject: (v) => `Kauf bestätigt: ${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "Kauf bestätigt",
      `${v.amountUsdc} USDC gutgeschrieben = <strong>${v.openAmount} OPEN</strong> reserviert.`,
      "Du erhältst deine OPEN beim Launch. Sieh deinen Kauf jederzeit ein:",
      "Meinen Kauf ansehen",
      v.purchaseUrl,
      "Diese E-Mail ist dein Beleg. Bewahre sie auf, falls du deinen Kauf später prüfen möchtest."
    ),
  },
  it: {
    subject: (v) => `Acquisto confermato: ${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "Acquisto confermato",
      `${v.amountUsdc} USDC accreditati = <strong>${v.openAmount} OPEN</strong> riservati.`,
      "Riceverai i tuoi OPEN al lancio. Consulta il tuo acquisto in qualsiasi momento:",
      "Vedi il mio acquisto",
      v.purchaseUrl,
      "Questa email è la tua ricevuta. Conservala per consultare l'acquisto in seguito."
    ),
  },
  pt: {
    subject: (v) => `Compra confirmada: ${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "Compra confirmada",
      `${v.amountUsdc} USDC creditados = <strong>${v.openAmount} OPEN</strong> reservados.`,
      "Receberá os seus OPEN no lançamento. Consulte a sua compra a qualquer momento:",
      "Ver a minha compra",
      v.purchaseUrl,
      "Este email é o seu recibo. Guarde-o para consultar a compra mais tarde."
    ),
  },
  nl: {
    subject: (v) => `Aankoop bevestigd: ${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "Aankoop bevestigd",
      `${v.amountUsdc} USDC bijgeschreven = <strong>${v.openAmount} OPEN</strong> gereserveerd.`,
      "Je ontvangt je OPEN bij de launch. Bekijk je aankoop op elk moment:",
      "Mijn aankoop bekijken",
      v.purchaseUrl,
      "Deze e-mail is je bon. Bewaar hem om je aankoop later te raadplegen."
    ),
  },
  pl: {
    subject: (v) => `Zakup potwierdzony: ${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "Zakup potwierdzony",
      `${v.amountUsdc} USDC zaksięgowane = <strong>${v.openAmount} OPEN</strong> zarezerwowane.`,
      "Otrzymasz OPEN przy starcie. Sprawdź zakup w dowolnym momencie:",
      "Zobacz mój zakup",
      v.purchaseUrl,
      "Ten e-mail to potwierdzenie. Zachowaj go na później."
    ),
  },
  tr: {
    subject: (v) => `Satın alma onaylandı: ${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "Satın alma onaylandı",
      `${v.amountUsdc} USDC işlendi = <strong>${v.openAmount} OPEN</strong> ayrıldı.`,
      "OPEN'larınızı lansmanda alacaksınız. Satın alımınızı istediğiniz zaman görüntüleyin:",
      "Satın alımımı gör",
      v.purchaseUrl,
      "Bu e-posta makbuzunuzdur. Daha sonra kontrol etmek için saklayın."
    ),
  },
  ru: {
    subject: (v) => `Покупка подтверждена: ${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "Покупка подтверждена",
      `${v.amountUsdc} USDC зачислено = <strong>${v.openAmount} OPEN</strong> зарезервировано.`,
      "Вы получите OPEN при запуске. Просматривайте покупку в любое время:",
      "Моя покупка",
      v.purchaseUrl,
      "Это письмо — ваш чек. Сохраните его для проверки позже."
    ),
  },
  ar: {
    subject: (v) => `تم تأكيد الشراء: ${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "تم تأكيد الشراء",
      `${v.amountUsdc} USDC مُقيدة = <strong>${v.openAmount} OPEN</strong> محجوزة.`,
      "ستستلم OPEN عند الإطلاق. راجع شراءك في أي وقت:",
      "عرض شرائي",
      v.purchaseUrl,
      "هذا البريد إيصالك. احتفظ به للمراجعة لاحقاً."
    ),
  },
  hi: {
    subject: (v) => `खरीद पुष्टि: ${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "खरीद पुष्टि",
      `${v.amountUsdc} USDC जमा = <strong>${v.openAmount} OPEN</strong> आरक्षित।`,
      "लॉन्च पर OPEN मिलेंगे। कभी भी अपनी खरीद देखें:",
      "मेरी खरीद देखें",
      v.purchaseUrl,
      "यह ईमेल आपकी रसीद है। बाद में देखने के लिए रखें।"
    ),
  },
  zh: {
    subject: (v) => `购买已确认：${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "购买已确认",
      `已入账 ${v.amountUsdc} USDC = 预留 <strong>${v.openAmount} OPEN</strong>。`,
      "上线时将收到 OPEN。随时查看您的购买：",
      "查看我的购买",
      v.purchaseUrl,
      "此邮件为您的收据，请妥善保存。"
    ),
  },
  ja: {
    subject: (v) => `購入確認：${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "購入確認",
      `${v.amountUsdc} USDC 入金 = <strong>${v.openAmount} OPEN</strong> 予約済み。`,
      "ローンチ時に OPEN をお届けします。いつでも購入内容を確認できます：",
      "購入内容を見る",
      v.purchaseUrl,
      "このメールが領収書です。後で確認できるよう保存してください。"
    ),
  },
  ko: {
    subject: (v) => `구매 확인: ${v.amountUsdc} USDC = ${v.openAmount} OPEN`,
    html: (v) => creditHtml(
      "구매 확인",
      `${v.amountUsdc} USDC 입금 = <strong>${v.openAmount} OPEN</strong> 예약됨.`,
      "출시 시 OPEN을 받게 됩니다. 언제든 구매 내역을 확인하세요:",
      "내 구매 보기",
      v.purchaseUrl,
      "이 이메일이 영수증입니다. 나중에 확인할 수 있도록 보관하세요."
    ),
  },
};

function creditHtml(
  title: string,
  summary: string,
  body: string,
  cta: string,
  url: string,
  footer: string
): string {
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;color:#0D0D0D;line-height:1.5;max-width:520px;margin:0 auto;padding:24px">
<h1 style="font-size:20px;margin:0 0 12px">${title}</h1>
<p style="margin:0 0 12px">${summary}</p>
<p style="margin:0 0 20px;color:#5C5C66">${body}</p>
<p><a href="${url}" style="display:inline-block;background:#0D0D0D;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600">${cta}</a></p>
<p style="margin:24px 0 0;font-size:13px;color:#8A8A94">${footer}</p>
</body></html>`;
}

export function resolvePurchaseLocale(raw: string | null | undefined): Locale {
  return raw && isLocale(raw) ? raw : "es";
}

export async function sendDepositCreditEmail(opts: {
  to: string;
  locale?: string | null;
  amountUsdc: number;
  openAmount: number;
  siteUrl: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "OPEN <noreply@openaiprotocol.com>";
  if (!apiKey) return false;

  const locale = resolvePurchaseLocale(opts.locale);
  const fmt = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });
  const vars: CreditEmailVars = {
    amountUsdc: fmt(opts.amountUsdc),
    openAmount: fmt(opts.openAmount),
    purchaseUrl: `${opts.siteUrl.replace(/\/$/, "")}/mi-compra`,
  };
  const tpl = TEMPLATES[locale];

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: opts.to,
    subject: tpl.subject(vars),
    html: tpl.html(vars),
  });
  return !error;
}
