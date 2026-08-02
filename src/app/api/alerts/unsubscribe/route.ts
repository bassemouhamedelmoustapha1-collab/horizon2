import { prisma } from "@/lib/prisma";

// GET /api/alerts/unsubscribe?token=... — désabonnement en un clic
// depuis le lien présent dans chaque e-mail. Page HTML minimale, sans
// connexion requise.
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");

  let removed = false;
  if (token) {
    const res = await prisma.jobAlert.deleteMany({ where: { token } });
    removed = res.count > 0;
  }

  const title = removed ? "Alerte supprimée" : "Lien invalide ou déjà utilisé";
  const message = removed
    ? "Vous ne recevrez plus d'e-mails pour cette alerte."
    : "Cette alerte n'existe plus — aucun e-mail supplémentaire ne vous sera envoyé.";

  return new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title} — Horizon</title></head>
<body style="margin:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;display:grid;place-items:center;min-height:100vh;">
<div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:36px;max-width:400px;text-align:center;margin:16px;">
  <p style="font-size:26px;font-weight:bold;color:#0a142e;margin:0 0 14px;">Horizon<span style="color:#2451eb">.</span></p>
  <h1 style="font-size:18px;color:#0a142e;margin:0 0 8px;">${title}</h1>
  <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 20px;">${message}</p>
  <a href="/jobs" style="display:inline-block;background:#2451eb;color:#fff;text-decoration:none;font-weight:bold;font-size:14px;padding:11px 24px;border-radius:999px;">Voir les offres</a>
</div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
