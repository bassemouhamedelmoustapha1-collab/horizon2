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

const cities = [
  "Dakar, Sénégal",
  "Abidjan, Côte d'Ivoire",
  "Lagos, Nigeria",
  "Nairobi, Kenya",
  "Accra, Ghana",
  "Casablanca, Maroc",
  "Nouakchott, Mauritanie",
  "Bamako, Mali",
  "Douala, Cameroun",
  "Kigali, Rwanda",
];

const companies = [
  "Sonatel",
  "Orange Afrique",
  "Wave",
  "Jumia",
  "Ecobank",
  "MTN Group",
  "Bolloré Africa",
  "Africell",
  "Baobab Group",
  "Senelec",
];

// Logos réels téléchargés dans public/companies/ (voir README).
const companyLogos = [
  "/companies/sonatel.png",
  "/companies/orange.png",
  "/companies/wave.png",
  "/companies/jumia.png",
  "/companies/ecobank.png",
  "/companies/mtn.png",
  "/companies/bollore.png",
  "/companies/africell.png",
  "/companies/baobab.png",
  "/companies/senelec.png",
];

const jobTemplates: {
  title: string;
  type: JobType;
  categorySlug: string;
  salaryMin: number;
  salaryMax: number;
  description: string;
}[] = [
  {
    title: "Développeur Fullstack",
    type: "FULL_TIME",
    categorySlug: "tech",
    salaryMin: 800000,
    salaryMax: 1500000,
    description:
      "Nous recherchons un développeur fullstack maîtrisant React et Node.js pour rejoindre notre équipe produit et bâtir des solutions à fort impact pour le marché africain.",
  },
  {
    title: "Analyste Financier",
    type: "FULL_TIME",
    categorySlug: "finance",
    salaryMin: 600000,
    salaryMax: 1100000,
    description:
      "En tant qu'analyste financier, vous participerez à l'élaboration des budgets, au reporting et à l'analyse de la performance de nos activités régionales.",
  },
  {
    title: "Chargé de Support Client",
    type: "PART_TIME",
    categorySlug: "customer-service",
    salaryMin: 250000,
    salaryMax: 450000,
    description:
      "Vous serez le premier point de contact de nos clients : assistance téléphonique, résolution des incidents et suivi de la satisfaction.",
  },
  {
    title: "Responsable Marketing Digital",
    type: "FULL_TIME",
    categorySlug: "marketing",
    salaryMin: 700000,
    salaryMax: 1300000,
    description:
      "Pilotez notre stratégie d'acquisition digitale : réseaux sociaux, SEO/SEA, campagnes d'emailing et analyse des performances.",
  },
  {
    title: "Chargé de Recrutement (RH)",
    type: "CONTRACT",
    categorySlug: "human-resources",
    salaryMin: 500000,
    salaryMax: 900000,
    description:
      "Gérez le cycle complet de recrutement : sourcing, entretiens, onboarding et développement de la marque employeur.",
  },
  {
    title: "Ingénieur Agronome",
    type: "FULL_TIME",
    categorySlug: "agriculture",
    salaryMin: 450000,
    salaryMax: 850000,
    description:
      "Accompagnez les coopératives agricoles dans l'optimisation de leurs rendements et l'adoption de pratiques durables.",
  },
  {
    title: "Infirmier Diplômé d'État",
    type: "FULL_TIME",
    categorySlug: "healthcare",
    salaryMin: 350000,
    salaryMax: 700000,
    description:
      "Rejoignez notre centre de santé pour assurer les soins, le suivi des patients et la coordination avec l'équipe médicale.",
  },
  {
    title: "Développeur Mobile (Stagiaire)",
    type: "INTERNSHIP",
    categorySlug: "tech",
    salaryMin: 100000,
    salaryMax: 200000,
    description:
      "Stage de 6 mois pour participer au développement de nos applications mobiles Flutter/React Native, encadré par des seniors.",
  },
  {
    title: "Chef de Projet Logistique",
    type: "FULL_TIME",
    categorySlug: "logistics",
    salaryMin: 700000,
    salaryMax: 1200000,
    description:
      "Optimisez notre chaîne d'approvisionnement, gérez les flux de marchandises et coordonnez nos partenaires transport.",
  },
  {
    title: "Formateur en Compétences Numériques",
    type: "REMOTE",
    categorySlug: "education",
    salaryMin: 400000,
    salaryMax: 800000,
    description:
      "Animez des sessions de formation en ligne sur les outils numériques auprès de jeunes et de professionnels à travers l'Afrique.",
  },
  {
    title: "Business Developer Junior",
    type: "FULL_TIME",
    categorySlug: "business-development",
    salaryMin: 400000,
    salaryMax: 750000,
    description:
      "Développez notre portefeuille clients, identifiez de nouvelles opportunités et négociez des partenariats stratégiques.",
  },
  {
    title: "Comptable Confirmé",
    type: "FULL_TIME",
    categorySlug: "finance",
    salaryMin: 500000,
    salaryMax: 950000,
    description:
      "Assurez la tenue de la comptabilité générale, les déclarations fiscales et l'établissement des états financiers.",
  },
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

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
  const recruiters = [];
  for (let i = 0; i < companies.length; i++) {
    const recruiter = await prisma.user.create({
      data: {
        email: `recruteur${i + 1}@horizon.africa`,
        passwordHash: password,
        name: `Recruteur ${companies[i]}`,
        role: "RECRUITER",
        companyName: companies[i],
        logoUrl: companyLogos[i],
        location: pick(cities, i),
      },
    });
    recruiters.push(recruiter);
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
  for (let i = 0; i < jobTemplates.length; i++) {
    const tpl = jobTemplates[i];
    const recruiter = pick(recruiters, i);
    await prisma.job.create({
      data: {
        title: tpl.title,
        description: tpl.description,
        companyName: recruiter.companyName!,
        location: pick(cities, i),
        type: tpl.type,
        salaryMin: tpl.salaryMin,
        salaryMax: tpl.salaryMax,
        currency: "XOF",
        categoryId: createdCategories[tpl.categorySlug],
        recruiterId: recruiter.id,
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
