export type MoreWorkProject = {
  name: string
  url: string
}

export type MoreWorkSubCategory = {
  title: string
  projects: MoreWorkProject[]
}

export type MoreWorkSection = {
  page: number
  totalPages: number
  label: string
  heading: string
  columns: MoreWorkSubCategory[][]
}

export const moreWorkSections: MoreWorkSection[] = [
  {
    page: 1,
    totalPages: 4,
    label: 'International',
    heading: 'A glimpse of our international websites',
    columns: [
      [
        {
          title: 'Healthcare',
          projects: [
            { name: 'Seek an Expert', url: 'https://seekanexpert.care/' },
            { name: 'Vascular Centers TX', url: 'https://vascularcenterstx.com/' },
            { name: 'Houston Lung Institute', url: 'https://houstonlunginstitute.com/' },
            { name: 'Medinet Clinic', url: 'https://medinetclinic.com/' },
            { name: 'Epic Foot & Ankle', url: 'https://epicfootandankle.com/' },
            { name: 'Spring GI', url: 'https://springgi.com/' },
            { name: 'Oaks Surgery', url: 'https://oakssurgery.com/' },
            { name: 'PHMPI', url: 'https://phmpi.com/' },
            { name: 'Aspen Health Systems', url: 'https://aspenhealthsys.com/' },
            { name: 'WCHH', url: 'https://wchh.care/' },
            { name: 'BMC Hospitals', url: 'https://bmchospitals.care/' },
          ],
        },
      ],
      [
        {
          title: 'Real Estate & Construction',
          projects: [
            { name: 'Tranquility CF', url: 'https://tranquilitycf.com/' },
            { name: 'Arban Infra', url: 'https://arbaninfra.com/' },
            { name: 'Provenbay', url: 'https://provenbay.com/' },
            { name: 'SJS Residential', url: 'https://www.sjsresidential.com/' },
            { name: 'SJS Dev', url: 'https://www.sjsdev.com/' },
          ],
        },
        {
          title: 'NGO & Community',
          projects: [
            { name: 'Emerging Grace', url: 'https://emerginggrace.org/' },
            { name: 'Subandha', url: 'https://subandha.org/' },
            { name: 'Assane', url: 'https://assane.org/' },
            { name: 'Khateeb Finder', url: 'https://khateebfinder.com/' },
          ],
        },
      ],
      [
        {
          title: 'IT & Technology',
          projects: [
            { name: 'NextGen Gaurdians', url: 'https://nextgengaurdians.com/' },
            { name: 'Cisse Technology', url: 'https://cissetechnology.com/' },
            { name: 'Jaghub Inc', url: 'https://jaghubinc.com/' },
            { name: 'ClientBridge.ai', url: 'https://clientbridge.ai/' },
            { name: 'Cadmaxx (Dubai)', url: 'https://cadmaxx.ae/' },
          ],
        },
        {
          title: 'E-Commerce & Automotive',
          projects: [
            { name: 'YouAgain', url: 'https://youagain.co/' },
            { name: 'SJS Exotics', url: 'https://www.sjsexotics.com/' },
          ],
        },
        {
          title: 'Engineering & Industrial',
          projects: [
            { name: 'Lynn Energy', url: 'https://lynnenergy.com/' },
            { name: 'FAM Biomedical', url: 'https://fambiomedical.com/' },
          ],
        },
      ],
      [
        {
          title: 'Finance, Marketing & Corporate',
          projects: [
            { name: 'CPG Accountant', url: 'https://cpgaccountant.com/' },
            { name: 'LeadSync Marketing', url: 'https://leadsyncmarketing.com/' },
            { name: 'SJS Group', url: 'https://sjsgroup1.com/' },
          ],
        },
        {
          title: 'Hospitality & Events',
          projects: [
            { name: 'Pebble ESP', url: 'https://pebble-esp.com/' },
            { name: 'Monalisa Events', url: 'https://www.monalisaevents.net/' },
            { name: 'Kohinoor TX', url: 'https://kohinoortx.com/' },
            { name: 'Bellaire Pointe', url: 'https://bellairepointe.com/' },
          ],
        },
      ],
    ],
  },
  {
    page: 2,
    totalPages: 4,
    label: 'India',
    heading: 'More of our work',
    columns: [
      [
        {
          title: 'Real Estate, Construction & Interiors',
          projects: [
            { name: 'Yuktha Homes', url: 'https://yukthahomes.com/' },
            { name: 'SLV Ventures', url: 'https://slvventures.co.in/' },
            { name: 'Fair Square', url: 'https://fairsquare.net.in/' },
            { name: 'Custom Home Constructions', url: 'https://customhomeconstructions.com/' },
            { name: 'Swamy Ventures', url: 'https://swamyventures.com/' },
            { name: 'R3 Visions', url: 'https://r3visions.com/' },
            { name: 'Vivify Interiors', url: 'https://vivifyinteriors.com/' },
            { name: 'Smiti Construction', url: 'https://smiticonstruction.com/' },
            { name: 'Kambal Concepts', url: 'https://kambalconcepts.com/' },
            { name: 'Urban Sparrow', url: 'https://urbansparrow.co.in/' },
          ],
        },
      ],
      [
        {
          title: 'E-Commerce & Retail',
          projects: [
            { name: 'Naatikoli', url: 'https://naatikoli.com/' },
            { name: 'Aquifer India', url: 'https://aquiferindia.com/' },
            { name: 'The Cam Store', url: 'https://thecamstore.co.in/' },
            { name: 'Halomeal', url: 'https://halomeal.com/' },
            { name: 'Enrich Global Support', url: 'https://enrichglobalsupport.in/' },
            { name: 'Uhudoud', url: 'https://uhudoud.com/' },
            { name: 'Activin', url: 'https://activin.in/' },
            { name: 'Raisen Chocolates', url: 'https://raisenchocolates.com/' },
            { name: 'Bad Habits', url: 'https://badhabits.store/' },
            { name: 'True Gold Company', url: 'https://truegoldcompany.com/' },
          ],
        },
      ],
      [
        {
          title: 'Education',
          projects: [
            { name: 'Pride Group Institution', url: 'https://pridegroupinstitution.in/' },
            { name: 'Early Buds Preschool', url: 'https://earlybudspreschool.com/' },
            { name: 'Ayana International School', url: 'https://ayanainternationalschool.com/' },
            { name: 'Inky Pinky School', url: 'https://inkypinkyschool.com/' },
            { name: 'SVS Public School', url: 'https://svspublicschool.com/' },
            { name: 'Akshaya Bala Kuteera', url: 'https://akshayabalakuteera.in/' },
            { name: 'Medi Training Center', url: 'https://meditrainingcenter.com/' },
            { name: 'Parinitha Upskill Academy', url: 'https://parinithaupskillacademy.com/' },
          ],
        },
      ],
      [
        {
          title: 'Healthcare',
          projects: [
            { name: 'Manitham Healthcare', url: 'https://manithamhealthcare.in/' },
            { name: 'Stepping Stones Rehab', url: 'https://steppingstonesrehab.in/' },
            { name: 'Vinayaka Ambulance Services', url: 'https://vinayakaambulanceservices.com/' },
            { name: 'Anthyashree', url: 'https://anthyashree.com/' },
          ],
        },
      ],
    ],
  },
  {
    page: 3,
    totalPages: 4,
    label: 'India',
    heading: 'More of our work',
    columns: [
      [
        {
          title: 'IT & Technology',
          projects: [
            { name: 'Shinvra', url: 'https://shinvra.in/' },
            { name: 'Bharc', url: 'https://bharc.in/' },
            { name: 'DBA Automation', url: 'https://dbaautomation.com/' },
            { name: 'Klixon Tech', url: 'https://klixontech.com/' },
            { name: 'Mobifixt', url: 'https://mobifixt.com/' },
            { name: 'Leading Technology', url: 'https://leadingtechnology.in/' },
          ],
        },
      ],
      [
        {
          title: 'Manufacturing & Industrial',
          projects: [
            { name: 'Varnica Herbs', url: 'https://varnicaherbs.com/' },
            { name: 'Mass Fabtech', url: 'https://massfabtech.com/' },
            { name: 'Wisco Elastomers', url: 'https://wiscoelastomers.com/' },
            { name: 'Shiva Precision', url: 'https://shivaprecision.in/' },
            { name: 'RVP Starch', url: 'https://rvpstarch.com/' },
            { name: 'MS Bakers Pride', url: 'https://msbakerspride.com/' },
            { name: 'Essen Electricals', url: 'https://essenelectricals.in/' },
            { name: 'Adela Network Power', url: 'https://adelanetworkpower.com/' },
          ],
        },
      ],
      [
        {
          title: 'HR, Recruitment & Staffing',
          projects: [
            { name: 'Xenithra', url: 'https://xenithra.com/' },
            { name: 'Shashwin', url: 'https://shashwin.com/' },
            { name: 'Hritandziel', url: 'https://hritandziel.com/' },
            { name: 'Essvee Recruitech', url: 'https://essveerecruitech.com/' },
            { name: 'Siri Technocrats', url: 'https://siritechnocrats.com/' },
            { name: 'IT Diksha', url: 'https://itdiksha.com/' },
            { name: '8HR Services', url: 'https://8hrservices.in/' },
            { name: 'Digiinart', url: 'https://digiinart.com/' },
          ],
        },
      ],
      [
        {
          title: 'Consulting & Compliance',
          projects: [
            { name: 'Preetaam', url: 'https://preetaam.com/' },
            { name: 'Jadhav International', url: 'https://jadhavintl.com/' },
            { name: 'Opinnex', url: 'https://opinnex.com/' },
          ],
        },
        {
          title: 'Food & Beverage',
          projects: [
            { name: 'Malgudi Amruth Chaha', url: 'https://malgudiamruthchaha.com/' },
            { name: 'Brahmins Cooking & Caretaking Agency', url: 'https://brahminscookingandcaretakingagency.com/' },
            { name: 'Cycle Gap', url: 'https://cyclegap.in/' },
          ],
        },
      ],
    ],
  },
  {
    page: 4,
    totalPages: 4,
    label: 'India',
    heading: 'More of our work',
    columns: [
      [
        {
          title: 'Travel & Tourism',
          projects: [
            { name: 'Fly Global DMC', url: 'https://flyglobaldmc.com/' },
            { name: 'Fasto Cabs', url: 'https://fastocabs.com/' },
            { name: 'Motor Swamis', url: 'https://motorswamis.com/' },
            { name: 'Way to Bharat', url: 'https://waytobharat.com/' },
          ],
        },
        {
          title: 'Fitness, Sports & Wellness',
          projects: [
            { name: 'Ayushvi', url: 'https://ayushvi.com/' },
            { name: 'Shimoga City Club', url: 'https://shimogacityclub.com/' },
            { name: 'Coorg Sports Club', url: 'https://coorgsportsclub.com/' },
            { name: 'Kundyolanda', url: 'https://kundyolanda.com/' },
          ],
        },
      ],
      [
        {
          title: 'Events',
          projects: [
            { name: 'Abdhi Creations', url: 'https://abdhicreations.com/' },
            { name: 'Greenfield Gatherings', url: 'https://greenfieldgatherings.com/' },
            { name: 'MD Super Sounds', url: 'https://mdsupersounds.com/' },
          ],
        },
        {
          title: 'Automotive',
          projects: [
            { name: 'Actevia', url: 'https://actevia.in/' },
            { name: 'City Honda', url: 'https://cityhonda.in/' },
          ],
        },
        {
          title: 'Home Services',
          projects: [
            { name: 'Nandi Services', url: 'https://nandiservices.co.in/' },
            { name: 'Top Service Center', url: 'https://topservicecenter.in/' },
          ],
        },
      ],
      [
        {
          title: 'Media & Entertainment',
          projects: [
            { name: 'Karnataka News Beat', url: 'https://karnatakanewsbeat.com/' },
            { name: 'Chethan D\'Souza', url: 'https://chethandsouza.com/' },
          ],
        },
        {
          title: 'NGO & Religious',
          projects: [
            { name: 'The World Is One Big Family', url: 'https://theworldisonebigfamily.org/' },
            { name: 'SB Samsthana', url: 'https://www.sbsamsthana.com/' },
            { name: 'Statue of Union', url: 'https://www.statueofunion.org/' },
          ],
        },
      ],
      [
        {
          title: 'Astrology',
          projects: [
            { name: 'Kerala Bhagavathi', url: 'https://keralabhagavathijyothishyamandira.in/' },
            { name: 'Jyothishya Mandira', url: 'https://keralabhagavathijyothishyamandira.in/' },
            { name: 'Vedic Astro Predict', url: 'https://vedicastropredict.com/' },
            { name: 'Kalidevi Jyothishya', url: 'https://kalikadevijyothishya.com/' },
            { name: 'Psychic Astro', url: 'https://psychic-astro.com/' },
            { name: 'Kollegalaa Mahakali', url: 'https://kollegaladamahakalijyothishyakendra.com/' },
            { name: 'Jyothishya Kendra', url: 'https://kollegaladamahakalijyothishyakendra.com/' },
            { name: 'Mahadev Vedic Astrology', url: 'https://mahadevvedicastrology.com/' },
            { name: 'Kollegala Suprasiddha', url: 'https://kollegalasuprasiddhatantrikaru.com/' },
            { name: 'Tantrikaru', url: 'https://kollegalasuprasiddhatantrikaru.com/' },
            { name: 'Sri Kalimatha Astrology Centre', url: 'https://srikalimathaastrologycentre.com/' },
            { name: 'Vedic Astrologer Shreeram', url: 'https://vedicastrologershreeram.com/' },
            { name: 'Chakra Astrologer', url: 'https://chakraastrologer.com/' },
            { name: 'Kollegala Chamundeshwari', url: 'https://kollegalachamundeshwarijyothishyalaya.com/' },
            { name: 'Jyothishyalaya', url: 'https://kollegalachamundeshwarijyothishyalaya.com/' },
             { name: 'The Best Indian Astrologer', url: 'https://thebestindianastrologer.com/' },
          ],
        },
      ],
    ],
  },
]

export const totalMoreWorkProjects = moreWorkSections.reduce(
  (total, section) =>
    total +
    section.columns.reduce(
      (colTotal, col) =>
        colTotal + col.reduce((catTotal, cat) => catTotal + cat.projects.length, 0),
      0,
    ),
  0,
)
