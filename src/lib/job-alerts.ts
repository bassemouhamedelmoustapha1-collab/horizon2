import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { formatSalary } from "@/lib/format";
import type { Job, JobAlert, Category } from "@prisma/client";

const APP_URL = process.env.APP_URL || "http://localhost:3100";

/** Tous les critères renseignés de l'alerte doivent correspondre à l'offre. */
export function alertMatchesJob(
  alert: Pick<JobAlert, "q" | "location" | "categoryId">,
  job: Pick<Job, "title" | "description" | "companyName" | "location" | "categoryId">
): boolean {
  if (alert.q) {
    const haystack =
      `${job.title} ${job.description} ${job.companyName}`.toLowerCase();
    if (!haystack.includes(alert.q.toLowerCase())) return false;
  }
  if (alert.location) {
    if (!job.location.toLowerCase().includes(alert.location.toLowerCase()))
      return false;
  }
  if (alert.categoryId && alert.categoryId !== job.categoryId) return false;
  return true;
}

/* ---------- Gabarits ---------- */

const styles = {
  body: "margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;",
  wrap: "max-width:520px;margin:0 auto;padding:24px 16px;",
  card: "background:#ffffff;border-radius:16px;padding:28px;border:1px solid #e2e8f0;",
  logo: "font-size:26px;font-weight:bold;color:#0a142e;margin:0 0 18px;",
  h1: "font-size:19px;color:#0a142e;margin:0 0 6px;",
  p: "font-size:14px;color:#475569;line-height:1.6;margin:0 0 6px;",
  meta: "font-size:13px;color:#64748b;margin:0 0 2px;",
  btn: "display:inline-block;background:#2451eb;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 26px;border-radius:999px;margin-top:18px;",
  footer: "font-size:12px;color:#94a3b8;text-align:center;margin-top:18px;line-height:1.6;",
  link: "color:#94a3b8;",
};

function layout(inner: string, unsubscribeUrl?: string) {
  return `<!doctype html><html><body style="${styles.body}"><div style="${styles.wrap}">
  <div style="${styles.card}">
    <p style="${styles.logo}">Horizon<span style="color:#2451eb">.</span></p>
    ${inner}
  </div>
  <p style="${styles.footer}">
    Vous recevez cet e-mail car une alerte a été créée sur Horizon avec cette adresse.
    ${unsubscribeUrl ? `<br/><a href="${unsubscribeUrl}" style="${styles.link}">Se désabonner de cette alerte</a>` : ""}
  </p>
</div></body></html>`;
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function describeCriteria(alert: {
  q: string | null;
  location: string | null;
  category?: { name: string } | null;
}): string {
  const parts = [
    alert.q && `« ${alert.q} »`,
    alert.category?.name,
    alert.location,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "toutes les nouvelles offres";
}

export function alertCreatedEmail(alert: {
  q: string | null;
  location: string | null;
  token: string;
  category?: { name: string } | null;
}) {
  const unsubscribeUrl = `${APP_URL}/api/alerts/unsubscribe?token=${alert.token}`;
  return {
    subject: "Votre alerte emploi est active — Horizon",
    html: layout(
      `<h1 style="${styles.h1}">Votre alerte est active ✓</h1>
       <p style="${styles.p}">Vous recevrez un e-mail dès qu'une nouvelle offre correspond à : <strong>${esc(
         describeCriteria(alert)
       )}</strong>.</p>
       <a href="${APP_URL}/jobs" style="${styles.btn}">Parcourir les offres</a>`,
      unsubscribeUrl
    ),
  };
}

export function newJobEmail(
  job: Job & { category: Category },
  alert: { token: string }
) {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency);
  const jobUrl = `${APP_URL}/jobs/${job.id}`;
  const unsubscribeUrl = `${APP_URL}/api/alerts/unsubscribe?token=${alert.token}`;
  return {
    subject: `Nouvelle offre : ${job.title} — ${job.companyName}`,
    html: layout(
      `<p style="${styles.p}">Une nouvelle offre correspond à votre alerte :</p>
       <h1 style="${styles.h1}">${esc(job.title)}</h1>
       <p style="${styles.meta}">${esc(job.companyName)} · ${esc(job.location)}</p>
       <p style="${styles.meta}">${esc(job.category.name)}${salary ? ` · ${esc(salary)}` : ""}</p>
       <a href="${jobUrl}" style="${styles.btn}">Voir l'offre et postuler</a>`,
      unsubscribeUrl
    ),
  };
}

/**
 * Notifie toutes les alertes correspondant à une offre fraîchement publiée.
 * Best-effort : chaque envoi est indépendant, un échec n'affecte ni les
 * autres envois ni la publication de l'offre.
 */
export async function notifyAlertsForJob(jobId: string): Promise<number> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { category: true },
  });
  if (!job) return 0;

  const alerts = await prisma.jobAlert.findMany();
  const matching = alerts.filter((a) => alertMatchesJob(a, job));

  let sent = 0;
  for (const alert of matching) {
    const { subject, html } = newJobEmail(job, alert);
    if (await sendEmail({ to: alert.email, subject, html })) sent++;
  }
  if (matching.length) {
    console.log(
      `[alertes] offre ${job.id} : ${matching.length} alerte(s) correspondante(s), ${sent} e-mail(s) envoyé(s)`
    );
  }
  return sent;
}
