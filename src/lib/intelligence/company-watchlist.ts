/**
 * Lista de empresas de interesse permanente da Paladare, levantada pelo
 * dono do negócio. Usada como contexto pra rotina diária priorizar busca
 * por novidades (contratos, movimentos, notícias) nessas empresas
 * especificamente, além da varredura geral do setor.
 *
 * Editável só por código por enquanto — se crescer muito ou precisar ser
 * mantida pelo time, dá pra mover pra uma tabela no Supabase mais tarde.
 */

export const OIL_GAS_COMPANIES = {
  estatais: ["Petrobras", "PPSA"],
  internacionais: [
    "Shell Brasil",
    "Equinor",
    "TotalEnergies",
    "Chevron",
    "ExxonMobil",
    "BP Energy do Brasil",
    "CNPC Brasil",
    "CNOOC",
    "Petronas",
    "QatarEnergy",
    "Repsol Sinopec Brasil",
    "Galp Energia",
    "ONGC Videsh",
    "Mubadala Energy",
    "Karoon Energy",
    "Trident Energy",
  ],
  independentesBrasileiras: [
    "PRIO",
    "Brava Energia",
    "PetroRecôncavo",
    "Alvopetro",
    "Petro-Victory Energy",
    "Mandacaru Energia",
    "Nion Energia",
    "Nord Oil & Gas",
    "Nova Petróleo",
    "Vipetro",
    "Petroborn",
    "Petroil",
    "Petrom",
    "Recôncavo Energia",
    "Barra Bonita Óleo e Gás",
    "BGM Petróleo e Gás",
    "Capixaba Energia",
    "Creative Energy",
    "Phoenix Óleo & Gás",
    "Geoflux",
    "Aguila Energia",
    "Oeste de Canoas Petróleo",
    "Brasil Refinarias",
    "EPG Brasil",
    "Energizzi",
    "NTF Óleo e Gás",
    "Vultur Oil",
  ],
};

export const MINING_COMPANIES = {
  grandes: [
    "Vale",
    "Anglo American",
    "AngloGold Ashanti",
    "CSN Mineração",
    "Usiminas Mineração",
    "Mineração Morro do Ipê",
    "Samarco",
    "Kinross Gold",
    "Aura Minerals",
    "Lundin Mining",
    "South32",
    "Appian Capital Brazil",
    "Brazil Iron",
    "Sigma Lithium",
    "CBMM",
    "Mosaic Fertilizantes",
    "Yara Brasil",
    "Bemisa",
    "Mineração Taboca",
    "MRN",
    "Imerys",
    "Nexa Resources",
    "Ero Copper",
    "Atlantic Nickel",
    "Bahia Mineração",
  ],
  outras: [
    "Jaguar Mining",
    "G Mining",
    "Equinox Gold",
    "Horizonte Minerals",
    "Largo Inc.",
    "Dev Mineração",
    "Cedro Mineração",
    "Ferrous Resources",
    "Mineração Caraíba",
    "Graphcoa",
    "AMG Brasil",
  ],
};

export function allOilGasCompanies(): string[] {
  return [
    ...OIL_GAS_COMPANIES.estatais,
    ...OIL_GAS_COMPANIES.internacionais,
    ...OIL_GAS_COMPANIES.independentesBrasileiras,
  ];
}

export function allMiningCompanies(): string[] {
  return [...MINING_COMPANIES.grandes, ...MINING_COMPANIES.outras];
}

export function formatWatchlistForPrompt(): string {
  return [
    `ÓLEO E GÁS (${allOilGasCompanies().length} empresas): ${allOilGasCompanies().join(", ")}.`,
    `MINERAÇÃO (${allMiningCompanies().length} empresas): ${allMiningCompanies().join(", ")}.`,
  ].join("\n");
}
