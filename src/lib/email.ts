import { Resend } from "resend";

/**
 * Envoi d'e-mails via Resend.
 *
 * - `RESEND_API_KEY` absent : aucun envoi, on trace en console — le site
 *   fonctionne normalement (utile en local et tant que la clé n'est pas
 *   configurée sur Vercel).
 * - `EMAIL_FROM` : expéditeur. Sans domaine vérifié chez Resend, utiliser
 *   "Horizon <onboarding@resend.dev>" (envois limités au propriétaire du
 *   compte Resend) ; avec un domaine vérifié, ex. "Horizon <alertes@votredomaine.com>".
 */
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.EMAIL_FROM || "Horizon <onboarding@resend.dev>";

export const emailEnabled = !!apiKey;

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  if (!resend) {
    console.log(`[email désactivé — RESEND_API_KEY manquante] à: ${opts.to} — ${opts.subject}`);
    return false;
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
    if (error) {
      console.error("Resend:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Resend:", e);
    return false;
  }
}
