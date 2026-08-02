import { PrismaClient, JobType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Développement Business", slug: "business-development" },
  { name: "Informatique & Tech", slug: "tech" },
  { name: "Service Client", slug: "customer-service" },
  { name: "Finance & Comptabilité", slug: "finance" },
  { name: "Santé", slug: "healthcare" },
  { name: "Ressources Humaines", slug: "human-resources" },
  { name: "Marketing & Communication", slug: "marketing" },
  { name: "Éducation & Formation", slug: "education" },
  { name: "Agriculture", slug: "agriculture" },
  { name: "Logistique & Transport", slug: "logistics" },
];

/**
 * Entreprises de démonstration FICTIVES (aucune marque réelle : pas de
 * risque juridique), mais plausibles : secteur, ville et devise cohérents.
 * Le logo est l'initiale colorée générée par CompanyLogo.
 */
const companies: {
  name: string;
  about: string;
  city: string;
  currency: string;
}[] = [
  {
    name: "Téranga Digital",
    about: "Agence de développement web et mobile basée à Dakar.",
    city: "Dakar, Sénégal",
    currency: "XOF",
  },
  {
    name: "Lagoon Pay",
    about: "Fintech ivoirienne spécialisée dans le paiement mobile.",
    city: "Abidjan, Côte d'Ivoire",
    currency: "XOF",
  },
  {
    name: "Ikeja Labs",
    about: "Startup studio nigérian qui construit des produits mobiles.",
    city: "Lagos, Nigeria",
    currency: "NGN",
  },
  {
    name: "Savanna Contact Center",
    about: "Centre de relation client multilingue installé à Nairobi.",
    city: "Nairobi, Kenya",
    currency: "KES",
  },
  {
    name: "Accra Retail Group",
    about: "Groupe de distribution présent dans tout le Ghana.",
    city: "Accra, Ghana",
    currency: "GHS",
  },
  {
    name: "Atlas Santé",
    about: "Réseau de cliniques privées au Maroc.",
    city: "Casablanca, Maroc",
    currency: "MAD",
  },
  {
    name: "Chinguetti Conseil",
    about: "Cabinet mauritanien de conseil en RH et comptabilité.",
    city: "Nouakchott, Mauritanie",
    currency: "MRU",
  },
  {
    name: "Sahel Logistics",
    about: "Transport et acheminement de marchandises au Sahel.",
    city: "Bamako, Mali",
    currency: "XOF",
  },
  {
    name: "Douala Port Services",
    about: "Manutention et logistique portuaire à Douala.",
    city: "Douala, Cameroun",
    currency: "XAF",
  },
  {
    name: "GreenFields Rwanda",
    about: "Agritech qui accompagne les coopératives rwandaises.",
    city: "Kigali, Rwanda",
    currency: "RWF",
  },
  {
    name: "Baobab Académie",
    about: "Organisme de formation aux métiers du numérique.",
    city: "Dakar, Sénégal",
    currency: "XOF",
  },
];

/**
 * Offres : chacune est rattachée à une entreprise dont le secteur colle au
 * poste, dans la ville de l'entreprise, avec un salaire exprimé dans la
 * devise locale et un ordre de grandeur réaliste (mensuel).
 * `daysAgo` étale les dates de publication sur ~6 semaines.
 */
const jobs: {
  title: string;
  company: string;
  type: JobType;
  categorySlug: string;
  salaryMin: number;
  salaryMax: number;
  daysAgo: number;
  description: string;
}[] = [
  {
    title: "Développeur Fullstack",
    company: "Téranga Digital",
    type: "FULL_TIME",
    categorySlug: "tech",
    salaryMin: 800_000,
    salaryMax: 1_500_000,
    daysAgo: 1,
    description:
      "Nous recherchons un développeur fullstack maîtrisant React et Node.js pour rejoindre notre équipe produit et bâtir des applications web pour nos clients de la sous-région.",
  },
  {
    title: "Développeur Mobile (Stagiaire)",
    company: "Ikeja Labs",
    type: "INTERNSHIP",
    categorySlug: "tech",
    salaryMin: 80_000,
    salaryMax: 150_000,
    daysAgo: 3,
    description:
      "Stage de 6 mois pour participer au développement de nos applications mobiles Flutter/React Native, encadré par des développeurs seniors du studio.",
  },
  {
    title: "Analyste Financier",
    company: "Lagoon Pay",
    type: "FULL_TIME",
    categorySlug: "finance",
    salaryMin: 600_000,
    salaryMax: 1_100_000,
    daysAgo: 5,
    description:
      "Au sein de notre fintech, vous participerez à l'élaboration des budgets, au reporting réglementaire et à l'analyse de la performance de nos corridors de paiement.",
  },
  {
    title: "Comptable Confirmé",
    company: "Chinguetti Conseil",
    type: "FULL_TIME",
    categorySlug: "finance",
    salaryMin: 18_000,
    salaryMax: 30_000,
    daysAgo: 8,
    description:
      "Pour le compte de nos clients PME, vous assurez la tenue de la comptabilité générale, les déclarations fiscales et l'établissement des états financiers.",
  },
  {
    title: "Chargé de Support Client",
    company: "Savanna Contact Center",
    type: "PART_TIME",
    categorySlug: "customer-service",
    salaryMin: 45_000,
    salaryMax: 80_000,
    daysAgo: 11,
    description:
      "Vous serez le premier point de contact des clients de nos donneurs d'ordre : assistance téléphonique en français et en anglais, résolution des incidents et suivi de la satisfaction.",
  },
  {
    title: "Responsable Marketing Digital",
    company: "Accra Retail Group",
    type: "FULL_TIME",
    categorySlug: "marketing",
    salaryMin: 6_000,
    salaryMax: 11_000,
    daysAgo: 14,
    description:
      "Pilotez la stratégie d'acquisition digitale de nos enseignes : réseaux sociaux, SEO/SEA, campagnes d'emailing et analyse des performances en magasin et en ligne.",
  },
  {
    title: "Chargé de Recrutement (RH)",
    company: "Chinguetti Conseil",
    type: "CONTRACT",
    categorySlug: "human-resources",
    salaryMin: 15_000,
    salaryMax: 25_000,
    daysAgo: 18,
    description:
      "Gérez le cycle complet de recrutement pour nos clients : sourcing, entretiens, onboarding et développement de la marque employeur.",
  },
  {
    title: "Ingénieur Agronome",
    company: "GreenFields Rwanda",
    type: "FULL_TIME",
    categorySlug: "agriculture",
    salaryMin: 900_000,
    salaryMax: 1_600_000,
    daysAgo: 22,
    description:
      "Accompagnez les coopératives agricoles partenaires dans l'optimisation de leurs rendements et l'adoption de pratiques durables, avec des déplacements réguliers sur le terrain.",
  },
  {
    title: "Infirmier Diplômé d'État",
    company: "Atlas Santé",
    type: "FULL_TIME",
    categorySlug: "healthcare",
    salaryMin: 7_000,
    salaryMax: 11_000,
    daysAgo: 26,
    description:
      "Rejoignez l'une de nos cliniques casablancaises pour assurer les soins, le suivi des patients et la coordination avec l'équipe médicale.",
  },
  {
    title: "Chef de Projet Logistique",
    company: "Douala Port Services",
    type: "FULL_TIME",
    categorySlug: "logistics",
    salaryMin: 700_000,
    salaryMax: 1_200_000,
    daysAgo: 31,
    description:
      "Optimisez nos opérations de manutention, gérez les flux de marchandises sur le terminal et coordonnez transporteurs et transitaires.",
  },
  {
    title: "Formateur en Compétences Numériques",
    company: "Baobab Académie",
    type: "REMOTE",
    categorySlug: "education",
    salaryMin: 400_000,
    salaryMax: 800_000,
    daysAgo: 35,
    description:
      "Animez des sessions de formation en ligne sur les outils numériques auprès de jeunes diplômés et de professionnels francophones, où que vous soyez.",
  },
  {
    title: "Business Developer Junior",
    company: "Sahel Logistics",
    type: "FULL_TIME",
    categorySlug: "business-development",
    salaryMin: 400_000,
    salaryMax: 750_000,
    daysAgo: 40,
    description:
      "Développez notre portefeuille de chargeurs, identifiez de nouvelles lignes de transport et négociez des partenariats dans la sous-région.",
  },
];

// Contenu enrichi générique mais crédible, décliné par secteur.
const EXPERIENCE_BY_TYPE: Record<JobType, string> = {
  FULL_TIME: "2 à 5 ans sur un poste similaire",
  PART_TIME: "1 à 3 ans d'expérience",
  CONTRACT: "3 ans minimum sur des missions comparables",
  INTERNSHIP: "Aucune expérience requise — étudiant(e) ou jeune diplômé(e)",
  REMOTE: "2 ans d'expérience, autonomie indispensable",
};

const SKILLS_BY_CATEGORY: Record<string, string[]> = {
  tech: ["React & Node.js", "Git & CI/CD", "Bases de données SQL/NoSQL", "Méthodo Agile", "Anglais technique"],
  finance: ["Excel avancé", "Normes comptables OHADA", "Analyse financière", "Rigueur & confidentialité", "Logiciels ERP"],
  "customer-service": ["Sens du service", "Excellente communication", "Gestion du stress", "Outils CRM", "Français & anglais"],
  marketing: ["SEO/SEA", "Réseaux sociaux", "Google Analytics", "Créativité", "Copywriting"],
  "human-resources": ["Sourcing & entretien", "Droit du travail", "Onboarding", "Discrétion", "Outils ATS"],
  agriculture: ["Agronomie", "Gestion de coopératives", "Suivi terrain", "Développement durable", "Reporting"],
  healthcare: ["Diplôme d'État", "Soins infirmiers", "Sens de l'écoute", "Travail en équipe", "Gestion des urgences"],
  logistics: ["Supply chain", "Gestion des stocks", "Négociation transporteurs", "Excel", "Résolution de problèmes"],
  education: ["Pédagogie", "Animation de groupe", "Outils numériques", "Patience", "Français & anglais"],
  "business-development": ["Prospection", "Négociation", "Relation client", "Force de proposition", "CRM"],
};

const BENEFITS = [
  "Salaire attractif + primes de performance",
  "Assurance santé pour vous et votre famille",
  "Formation continue et évolution rapide",
  "Environnement de travail moderne et bienveillant",
];

function enrichJob(tpl: { title: string; type: JobType; categorySlug: string }) {
  const skills = SKILLS_BY_CATEGORY[tpl.categorySlug] ?? [
    "Autonomie",
    "Esprit d'équipe",
    "Rigueur",
    "Bonne communication",
  ];
  const intern = tpl.type === "INTERNSHIP";
  return {
    responsibilities: [
      `Prendre en charge les missions clés liées au poste de ${tpl.title.toLowerCase()}.`,
      "Collaborer avec les équipes internes pour atteindre les objectifs fixés.",
      "Assurer un reporting régulier de votre activité à votre responsable.",
      "Contribuer à l'amélioration continue des processus de l'équipe.",
    ].join("\n"),
    requirements: [
      intern
        ? "Étudiant(e) en fin de cursus ou jeune diplômé(e) motivé(e)."
        : "Vous justifiez d'une première expérience réussie sur un poste similaire.",
      "Vous êtes organisé(e), autonome et force de proposition.",
      "Vous avez un excellent relationnel et l'esprit d'équipe.",
      "La maîtrise du français est requise ; l'anglais est un plus.",
    ].join("\n"),
    experience: EXPERIENCE_BY_TYPE[tpl.type],
    education: intern
      ? "Bac+2 à Bac+5 en cours"
      : "Bac+3 à Bac+5 dans un domaine pertinent",
    skills: skills.join("\n"),
    benefits: BENEFITS.join("\n"),
    positions: (tpl.title.length % 3) + 1,
  };
}

/** Date de publication : il y a `daysAgo` jours, à une heure ouvrée variée. */
function postedAt(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(8 + (daysAgo % 9), (daysAgo * 17) % 60, 0, 0);
  return d;
}

async function main() {
  console.log("🌱 Nettoyage...");
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("🌱 Catégories...");
  const createdCategories: Record<string, string> = {};
  for (const c of categories) {
    const cat = await prisma.category.create({ data: c });
    createdCategories[c.slug] = cat.id;
  }

  const password = await bcrypt.hash("password123", 10);

  console.log("🌱 Recruteurs...");
  const recruitersByCompany: Record<string, { id: string; city: string; currency: string }> = {};
  for (let i = 0; i < companies.length; i++) {
    const c = companies[i];
    const recruiter = await prisma.user.create({
      data: {
        email: `recruteur${i + 1}@horizon.africa`,
        passwordHash: password,
        name: `Recrutement ${c.name}`,
        role: "RECRUITER",
        companyName: c.name,
        bio: c.about,
        location: c.city,
      },
    });
    recruitersByCompany[c.name] = {
      id: recruiter.id,
      city: c.city,
      currency: c.currency,
    };
  }

  console.log("🌱 Candidat de démonstration...");
  await prisma.user.create({
    data: {
      email: "candidat@horizon.africa",
      passwordHash: password,
      name: "Aminata Diallo",
      role: "CANDIDATE",
      title: "Développeuse Fullstack",
      location: "Dakar, Sénégal",
      bio: "Passionnée par la tech, 3 ans d'expérience en développement web.",
    },
  });

  console.log("🌱 Offres d'emploi...");
  let count = 0;
  for (const tpl of jobs) {
    const recruiter = recruitersByCompany[tpl.company];
    if (!recruiter) throw new Error(`Entreprise inconnue : ${tpl.company}`);
    await prisma.job.create({
      data: {
        title: tpl.title,
        description: tpl.description,
        companyName: tpl.company,
        location: recruiter.city,
        type: tpl.type,
        salaryMin: tpl.salaryMin,
        salaryMax: tpl.salaryMax,
        currency: recruiter.currency,
        categoryId: createdCategories[tpl.categorySlug],
        recruiterId: recruiter.id,
        createdAt: postedAt(tpl.daysAgo),
        ...enrichJob(tpl),
      },
    });
    count++;
  }

  console.log(`✅ Terminé : ${count} offres, ${companies.length} recruteurs, 1 candidat.`);
  console.log("👉 Comptes de test (mot de passe: password123)");
  console.log("   Candidat : candidat@horizon.africa");
  console.log("   Recruteur : recruteur1@horizon.africa");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
