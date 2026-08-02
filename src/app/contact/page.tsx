import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Contact | Horizon",
  description:
    "Contacter l'équipe Horizon : questions, signalements, exercice de vos droits sur vos données.",
};

const CONTACT_EMAIL = "bassemouhamedelmoustapha1@gmail.com";

export default function ContactPage() {
  return (
    <LegalPage title="Contact">
      <section>
        <p>
          Une question sur la plateforme, un signalement (offre suspecte,
          contenu inapproprié) ou une demande concernant vos données
          personnelles (accès, rectification, suppression) ? Écrivez-nous :
        </p>
        <p className="mt-4">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold !text-white hover:bg-brand-700 transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="mt-6 text-sm text-slate-400">
          Nous répondons généralement sous 48 h ouvrées. Pour les demandes
          relatives aux données personnelles, la réponse intervient sous 30
          jours au plus tard.
        </p>
      </section>
    </LegalPage>
  );
}
