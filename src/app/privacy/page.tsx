import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Horizon",
  description:
    "Comment Horizon collecte, utilise et protège vos données personnelles (comptes, CV, candidatures).",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Politique de confidentialité" updated="2 août 2026">
      <section>
        <h2>1. Qui sommes-nous ?</h2>
        <p>
          Horizon est une plateforme de mise en relation entre candidats et
          recruteurs en Afrique. Le responsable du traitement des données est
          l&apos;éditeur du site, joignable via la page{" "}
          <a href="/contact">Contact</a>.
        </p>
      </section>

      <section>
        <h2>2. Données collectées</h2>
        <ul>
          <li>
            <strong>Compte</strong> : nom, adresse e-mail, mot de passe (stocké
            sous forme hachée, jamais en clair), rôle (candidat ou recruteur).
          </li>
          <li>
            <strong>Profil candidat</strong> : titre, localisation, biographie,
            CV et téléphone si vous les fournissez.
          </li>
          <li>
            <strong>Profil recruteur</strong> : nom et logo de l&apos;entreprise,
            localisation.
          </li>
          <li>
            <strong>Candidatures</strong> : offres auxquelles vous postulez,
            lettre de motivation, statut de la candidature.
          </li>
          <li>
            <strong>Connexion via un service tiers</strong> (Google…) : nom,
            e-mail et photo de profil transmis par ce service.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Utilisation des données</h2>
        <p>
          Vos données servent uniquement au fonctionnement du service :
          création et gestion de votre compte, transmission de vos candidatures
          aux recruteurs concernés, suivi de leur avancement et amélioration de
          la plateforme. Elles ne sont ni vendues ni transmises à des tiers à
          des fins publicitaires.
        </p>
      </section>

      <section>
        <h2>4. Qui voit quoi ?</h2>
        <p>
          Lorsque vous postulez à une offre, le recruteur qui l&apos;a publiée
          accède à votre nom, votre e-mail, votre téléphone, votre CV et votre
          lettre de motivation. Votre profil n&apos;est pas public : il
          n&apos;est visible que des recruteurs auprès desquels vous postulez.
        </p>
      </section>

      <section>
        <h2>5. Conservation</h2>
        <p>
          Vos données sont conservées tant que votre compte est actif. Vous
          pouvez demander la suppression de votre compte et des données
          associées à tout moment via la page <a href="/contact">Contact</a>.
        </p>
      </section>

      <section>
        <h2>6. Cadre légal</h2>
        <p>
          Le traitement des données personnelles est effectué dans le respect de
          la loi sénégalaise n° 2008-12 du 25 janvier 2008 portant sur la
          protection des données à caractère personnel, sous le contrôle de la
          Commission de protection des Données Personnelles (CDP). Pour les
          utilisateurs situés dans d&apos;autres juridictions, les
          réglementations locales applicables sont respectées.
        </p>
      </section>

      <section>
        <h2>7. Vos droits</h2>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification et de
          suppression de vos données, ainsi que d&apos;un droit
          d&apos;opposition au traitement. Pour l&apos;exercer, contactez-nous
          via la page <a href="/contact">Contact</a> — nous répondons sous 30
          jours.
        </p>
      </section>

      <section>
        <h2>8. Cookies</h2>
        <p>
          Horizon utilise uniquement des cookies techniques indispensables : un
          cookie de session (connexion) et un cookie de langue (FR/EN). Aucun
          cookie publicitaire ou de suivi n&apos;est déposé.
        </p>
      </section>
    </LegalPage>
  );
}
