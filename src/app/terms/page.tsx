import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Conditions d'utilisation | Horizon",
  description:
    "Les règles d'utilisation de la plateforme Horizon pour les candidats et les recruteurs.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Conditions d'utilisation" updated="2 août 2026">
      <section>
        <h2>1. Objet</h2>
        <p>
          Horizon met en relation des candidats à la recherche d&apos;un emploi
          et des recruteurs qui publient des offres. L&apos;utilisation du site
          vaut acceptation des présentes conditions.
        </p>
      </section>

      <section>
        <h2>2. Comptes</h2>
        <p>
          Vous vous engagez à fournir des informations exactes lors de la
          création de votre compte et à préserver la confidentialité de votre
          mot de passe. Chaque compte est personnel ; un compte recruteur doit
          représenter une entreprise réelle que son titulaire est habilité à
          représenter.
        </p>
      </section>

      <section>
        <h2>3. Règles pour les recruteurs</h2>
        <ul>
          <li>Publier uniquement des offres d&apos;emploi réelles et licites.</li>
          <li>
            Ne jamais demander de paiement à un candidat, à quelque étape que ce
            soit du recrutement.
          </li>
          <li>
            Utiliser les données des candidats (CV, coordonnées) uniquement dans
            le cadre du recrutement concerné.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Règles pour les candidats</h2>
        <ul>
          <li>Fournir des informations et documents sincères (CV, diplômes…).</li>
          <li>Ne postuler qu&apos;aux offres qui vous concernent réellement.</li>
        </ul>
      </section>

      <section>
        <h2>5. Contenus interdits</h2>
        <p>
          Sont interdits : les offres frauduleuses ou discriminatoires, les
          contenus illicites, diffamatoires ou trompeurs, et toute usurpation
          d&apos;identité ou de marque. Horizon peut retirer un contenu ou
          suspendre un compte contrevenant, sans préavis.
        </p>
      </section>

      <section>
        <h2>6. Responsabilité</h2>
        <p>
          Horizon est un intermédiaire technique : la plateforme ne participe
          pas au processus de recrutement, ne garantit ni l&apos;issue
          d&apos;une candidature ni l&apos;exactitude des offres publiées par
          les recruteurs. Signalez tout contenu suspect via la page{" "}
          <a href="/contact">Contact</a>.
        </p>
      </section>

      <section>
        <h2>7. Données personnelles</h2>
        <p>
          Le traitement de vos données est décrit dans la{" "}
          <a href="/privacy">Politique de confidentialité</a>.
        </p>
      </section>

      <section>
        <h2>8. Évolution du service</h2>
        <p>
          Les fonctionnalités du site et les présentes conditions peuvent
          évoluer. En cas de changement substantiel, les utilisateurs seront
          informés sur le site.
        </p>
      </section>
    </LegalPage>
  );
}
