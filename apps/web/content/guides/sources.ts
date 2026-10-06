// Sources cited across the guides, from docs/research. Each guide lists the ones it relies on.
import type { Source } from "./types";

export const S = {
  step1: { label: "Wilding et al. Weight regain and cardiometabolic effects after withdrawal of semaglutide: the STEP 1 trial extension. Diabetes, Obesity and Metabolism, 2022", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9542252/" },
  surmount4: { label: "Aronne et al. Continued treatment with tirzepatide for maintenance of weight reduction (SURMOUNT-4). JAMA, 2024", url: "https://jamanetwork.com/journals/jama/fullarticle/2812936" },
  surmount4Acc: { label: "American College of Cardiology journal scan: SURMOUNT-4 weight regain analysis", url: "https://www.acc.org/latest-in-cardiology/journal-scans/2025/12/09/16/51/surmount-4" },
  bmjReview: { label: "BMJ Group: stopping weight-loss drugs linked to weight regain and reversal of heart health markers (review of 37 studies)", url: "https://bmjgroup.com/stopping-weight-loss-drugs-linked-to-weight-regain-and-reversal-of-heart-health-markers/" },
  oxfordReview: { label: "University of Oxford, Nuffield Department of Primary Care: weight regain after stopping weight-loss drugs", url: "https://www.phc.ox.ac.uk/news/weight-regain-after-stopping-weight-loss-drugs-review" },
  niceQs212: { label: "NICE quality standard QS212, statement 6: wraparound care alongside medicines for weight management", url: "https://www.nice.org.uk/guidance/qs212/chapter/quality-statement-6-wraparound-care-alongside-medicines-for-weight-management" },
  niceNews: { label: "NICE: people need support to keep weight off after treatment ends", url: "https://nice.org.uk/news/articles/people-need-support-to-keep-weight-off-after-treatment-ends" },
  niceTa875: { label: "NICE technology appraisal TA875: semaglutide for managing overweight and obesity", url: "https://www.nice.org.uk/guidance/ta875" },
  niceTa1026: { label: "NICE technology appraisal TA1026: tirzepatide for managing overweight and obesity", url: "https://www.nice.org.uk/guidance/ta1026" },
  bdaResource: { label: "British Dietetic Association: Medications for obesity, a guide to eating and living well (NICE-hosted resource)", url: "https://www.nice.org.uk/guidance/ng246/resources/british-dietetic-association-medications-for-obesity-resource-15734840941" },
  bnfSummary: { label: "British Nutrition Foundation: weight-loss medications two-page summary", url: "https://www.nutrition.org.uk/media/d13gxgrk/two-page-summary-weight-loss-medications_final.pdf" },
  jointAdvisory: { label: "The Obesity Society and partners: nutritional priorities to support GLP-1 therapy (joint advisory, 2025)", url: "https://obesity.org/nutritional-priorities-to-support-glp-1-therapy-for-obesity" },
  paddonJones: { label: "Paddon-Jones and Rasmussen. Dietary protein recommendations and the prevention of sarcopenia. Current Opinion in Clinical Nutrition and Metabolic Care, 2009", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2760315/" },
  protAge: { label: "Bauer et al. Evidence-based recommendations for optimal dietary protein intake in older people (PROT-AGE), 2013", url: "https://researchexperts.utmb.edu/en/publications/evidence-based-recommendations-for-optimal-dietary-protein-intake/" },
  eatwell: { label: "Food Standards Agency: the Eatwell Guide", url: "https://www.food.gov.uk/sites/default/files/media/document/eatwell-guide-master-digital.pdf" },
  nhsActivity: { label: "NHS: physical activity guidelines for adults aged 19 to 64", url: "https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-for-adults-aged-19-to-64/" },
  cmoGuidelines: { label: "UK Chief Medical Officers' physical activity guidelines, 2019", url: "https://www.gov.uk/government/publications/physical-activity-guidelines-uk-chief-medical-officers-report" },
  lundgren: { label: "Lundgren et al. Healthy weight loss maintenance with exercise, liraglutide, or both combined. New England Journal of Medicine, 2021", url: "https://pubmed.ncbi.nlm.nih.gov/33951361/" },
  nhsFibre: { label: "NHS: how to get more fibre into your diet", url: "https://www.nhs.uk/live-well/eat-well/digestive-health/how-to-get-more-fibre-into-your-diet/" },
  nhsSemaglutide: { label: "NHS: semaglutide (Wegovy, Ozempic)", url: "https://www.nhs.uk/medicines/semaglutide/" },
  nhsTirzepatide: { label: "NHS: tirzepatide (Mounjaro)", url: "https://www.nhs.uk/medicines/tirzepatide/" },
  nhsSleep: { label: "NHS Every Mind Matters: how to fall asleep faster and sleep better", url: "https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-fall-asleep-faster-and-sleep-better/" },
  beat: { label: "Beat, the UK's eating disorder charity", url: "https://www.beateatingdisorders.org.uk/" },
  nesta: { label: "Nesta: testing the calories of the UK's favourite takeaway foods", url: "https://nesta.org.uk/project/testing-the-calories-of-the-uks-favourite-takeaway-foods" },
} satisfies Record<string, Source>;
