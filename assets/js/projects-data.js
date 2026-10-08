window.PORTFOLIO_GROUPS = [
  {
    id: "transportation-mobility-planning",
    title: "Transportation & Mobility Planning",
    description: "Active transportation, accessibility, and mobility networks.",
    visible: true
  },
  {
    id: "community-economic-development",
    title: "Community & Economic Development",
    description: "Neighborhood planning, downtowns, housing, and redevelopment.",
    visible: true
  },
  {
    id: "gis-data-analysis",
    title: "GIS & Data Analysis",
    description: "Spatial analysis, mapping, and data-driven planning.",
    visible: true
  },
  {
    id: "design-photography-misc",
    title: "Design, Photography & Misc.",
    description: "Design studies, photography, and visual work.",
    visible: false
  }
];

window.PORTFOLIO_PROJECTS = [
  {
    slug: "allegheny-forward",
    title: "Allegheny County Comprehensive Plan Update",
    subtitle: "Transportation and mobility planning for Allegheny County's comprehensive plan update.",
    year: "2026.06 – Present",
    location: "Allegheny County, PA",
    group: "transportation-mobility-planning",
    order: 1,
    projectType: "Comprehensive Plan Update",
    organizationName: "Toole Design",
    clientName: "Allegheny County",
    tools: ["Adobe InDesign", "QGIS", "Python", "Adobe Illustrator"],
    dataSources: ["PennDOT", "Southwestern Pennsylvania Commission (SPC)", "LEHD", "Replica", "OpenStreetMap", "USGS"],
    methods: ["Network Coverage Calculation","GIS Map and Chart Recreation"],
    focusAreas: ["GIS Mapping","Accessibility Analysis","Data Visualization"],
    thumbnail: "public/images/projects/allegheny-forward/logo-cover.png",
    thumbnailAlt: "Allegheny Forward — Allegheny County’s Comprehensive Plan logo.",
    heroImage: "public/images/projects/allegheny-forward/network-coverage.png",
    heroAlt: "Map of low-stress bicycle network coverage across Allegheny County subregions.",
    showHeroImage: false,
    hideCategory: true,
    compactMetadata: true,
    summary: "Allegheny County is developing Allegheny Forward, a comprehensive plan to guide growth, investment, and development over the next 25 years. Toole Design leads its transportation and mobility work. During my internship, I supported the situational analysis and helped facilitate an Action Team Summit where stakeholders discussed transportation challenges and priorities.",
    introLink: { label: "Allegheny Forward", url: "https://engagement.alleghenycounty.us/allegheny-forward" },
    featured: false,
    sections: [
      {
        type: "text",
        body: [
          "The Transportation & Mobility Situational Analysis establishes a baseline for transportation discussions in the comprehensive plan update. It brings together network accessibility, travel patterns, terrain, transit and trail connections, and municipal policy to identify where the system supports comfortable multimodal travel and where connections break down. My responsibilities included transportation data analysis, creating all report maps and supporting charts, and designing and laying out the full report in Adobe InDesign."
        ]
      },
      {
        "type": "text",
        "title": "Network Connections",
        "body": [
          "Where would improvements make the greatest difference to a complete bike trip? I calculated low-stress network coverage across the county’s subregions, establishing a regional comparison. Coverage ranged from 68% to 78%, but the critical-gap maps revealed breaks along corridors linking communities and destinations.",
          "Given Allegheny County’s steep terrain, we also examined slope to assess bicycle comfort beyond traffic stress. This brings the assessment closer to everyday riding experience, accounting for the physical effort required even on routes with little traffic stress.",
          "Together, these results supported a focus on connections that could unlock otherwise comfortable routes. Mapping gaps by road ownership also identified where improvements would depend on coordination between the County, municipalities, and PennDOT."
        ]
      },
      {
        "type": "split",
        "images": [
          {
            "image": "public/images/projects/allegheny-forward/network-coverage-detail.png",
            "alt": "Low-stress bicycle network coverage by subregion",
            "caption": "Low-stress bicycle network coverage by subregion"
          },
          {
            "image": "public/images/projects/allegheny-forward/critical-gaps-detail.png",
            "alt": "Critical bicycle network gaps by road ownership",
            "caption": "Critical bicycle network gaps by road ownership"
          }
        ]
      },
      {
        "type": "text",
        "title": "Safety and Access",
        "body": [
          "Understanding network gaps also requires looking at where serious crashes occur. The High-Injury Network map shows severe-crash corridors alongside federally designated underserved communities, bringing safety and equity into the assessment of transportation needs.",
          "This provided a basis for considering both access and crash risk when setting investment priorities. It also connected the comprehensive plan’s transportation findings with the county’s existing safety planning, helping frame network improvements around the people and places facing the greatest barriers."
        ],
        "media": {
          "image": "public/images/projects/allegheny-forward/high-injury-network.png",
          "alt": "High-injury corridors and underserved communities",
          "caption": "High-injury corridors and underserved communities"
        }
      },
      {
        "type": "text",
        "title": "Local Implementation",
        "body": [
          "A connected countywide network depends on decisions made across municipal boundaries. Maps of Complete Streets policies and active transportation plans showed that communities were at different stages of planning, with many lacking an adopted local policy or plan.",
          "These differences helped explain why the County’s role extends beyond building infrastructure. The findings supported recommendations for model policies, technical assistance, and implementation support tailored to local needs, alongside coordination where routes cross jurisdictions."
        ]
      },
      {
        "type": "split",
        "images": [
          {
            "image": "public/images/projects/allegheny-forward/complete-streets-policy.png",
            "alt": "Municipal Complete Streets policy status",
            "caption": "Municipal Complete Streets policy status"
          },
          {
            "image": "public/images/projects/allegheny-forward/active-transportation-plans.png",
            "alt": "Municipal active transportation plan status",
            "caption": "Municipal active transportation plan status"
          }
        ]
      },
      {
        "type": "text",
        "title": "Household Transportation Costs",
        "body": [
          "The cost of reaching daily destinations is part of housing affordability. The report estimated combined housing and transportation costs at 43% of household income, with transportation accounting for 18%. Mapping this burden showed its geographic variation.",
          "This analysis connected transportation costs with household budgets and economic mobility. It supported treating multimodal access as part of the county’s housing, affordability, and growth decisions."
        ],
        "media": {
          "image": "public/images/projects/allegheny-forward/housing-transportation-costs.png",
          "alt": "Combined housing and transportation costs as a share of income",
          "caption": "Combined housing and transportation costs as a share of income"
        }
      },
      {
        "type": "text",
        "title": "Report Design and Production",
        "body": [
          "I designed and laid out the full report in Adobe InDesign, translating its narrative framework into a consistent sequence of findings, supporting evidence, and potential County responses. Maps, charts, and tables sit alongside the issues they explain, helping readers follow how the analysis leads to planning considerations."
        ]
      },
      {
        "type": "gallery",
        "images": [
          {
            "image": "public/images/projects/allegheny-forward/report-page-2.png",
            "alt": "County and partner transportation responsibilities",
            "caption": "County and partner transportation responsibilities"
          },
          {
            "image": "public/images/projects/allegheny-forward/report-design-page-16.png",
            "alt": "Bicycle network slope analysis",
            "caption": "Bicycle network slope analysis"
          },
          {
            "image": "public/images/projects/allegheny-forward/report-page-33.png",
            "alt": "Countywide greenhouse gas emissions",
            "caption": "Countywide greenhouse gas emissions"
          }
        ]
      }
    ]
  },
  {
  "slug": "covid-resource-deployment",
  "title": "Study of COVID Trends and Resource Deployment",
  "subtitle": "Compared three pandemic response center siting scenarios in the Bronx, using spatial analysis to examine how population access and reported COVID cases lead to different location priorities.",
  "year": "2024.12",
  "location": "New York City, NY",
  "group": "gis-data-analysis",
  "order": 1,
  "projectType": "GIS Analysis",
  "context": "Course Project",
  "tools": [
    "R",
    "ArcGIS Pro",
    "Adobe Illustrator",
    "Adobe InDesign"
  ],
  "dataSources": [
    "ACS 2023 5-Year Estimates",
    "NYC Open Data",
    "TIGER/Line Shapefiles"
  ],
  "methods": ["Spatial Cluster and Outlier Analysis","Location-Allocation","Walking Service Areas","Demographic and Facility Profiling"],
  "focusAreas": ["Spatial Analysis","Accessibility Analysis","Location-Allocation","Public Health"],
  "thumbnail": "public/images/projects/covid-resource-deployment/scenario-two-cover.png",
  "thumbnailAlt": "Three population-based pandemic response center sites in the Bronx, selected under Scenario Two.",
  "heroImage": "public/images/projects/covid-resource-deployment/spread-01.png",
  "heroAlt": "COVID clustering maps and age distribution analysis.",
  "summary": "Where should pandemic response centers be located when resources are limited? In this individual GIS course project, I examined COVID patterns across New York City and compared three siting scenarios in the Bronx. The analysis explored how different priorities, from broad walking access to proximity to reported cases, changed the proposed locations. I also assessed the surrounding communities to identify service needs beyond location alone.",
  "featured": true,
  "sections": [
    {
      "type": "project-credits",
      "html": "<link rel=\"stylesheet\" href=\"assets/css/covid.css\">"
    },
    {
      "type": "text",
      "title": "Understanding spatial patterns",
      "body": [
        "I compared clusters and outliers in COVID case rates, death rates, and test positivity across New York City’s ZIP Code Tabulation Areas. These indicators showed different geographies: Staten Island had high-high clusters of case rates and test positivity, while high death rates clustered in southern Brooklyn.",
        "Comparing these patterns with the distribution of older residents added demographic context. The analysis highlighted why a single indicator may give an incomplete picture of need, without establishing a causal relationship between age and mortality."
      ]
    },
    {
      "type": "image",
      "image": "public/images/projects/covid-resource-deployment/clusters-combined.png",
      "alt": "Aligned COVID case rate, death rate and test positivity cluster maps, from left to right, with a shared legend on the right.",
      "caption": "Spatial clusters and outliers in COVID case rates, death rates, and test positivity."
    },
    {
      "type": "text",
      "title": "Comparing resource allocation priorities",
      "body": [
        "I tested three location-allocation scenarios using simulated demand points and walking access."
      ],
      "bodyAfter": [
        "Changing the demand measure shifted the proposed locations generally westward, including a northern site moving toward northwestern Bronx. This comparison made the planning tradeoff visible: serving the overall population and locating resources near reported cases can produce different siting priorities, even with the same number of centers."
      ],
      "bullets": [
        {
          "label": "Scenario 1:",
          "text": "Place centers within a 30-minute walk of all modeled population demand, requiring 19 sites."
        },
        {
          "label": "Scenario 2:",
          "text": "Limit the network to three centers and minimize population-weighted walking distance."
        },
        {
          "label": "Scenario 3:",
          "text": "Retain the three-center limit but weight demand by reported COVID cases."
        }
      ]
    },
    {
      "type": "gallery",
      "images": [
        {
          "image": "public/images/projects/covid-resource-deployment/scenario-1.png",
          "alt": "Nineteen modeled pandemic response center sites under the 30-minute walking access scenario.",
          "caption": "Scenario 1: 30-minute walking access · 19 centers"
        },
        {
          "image": "public/images/projects/covid-resource-deployment/scenario-2.png",
          "alt": "Three modeled sites minimizing population-weighted walking distance.",
          "caption": "Scenario 2: Population-weighted access · 3 centers"
        },
        {
          "image": "public/images/projects/covid-resource-deployment/scenario-3.png",
          "alt": "Three modeled sites minimizing reported-case-weighted walking distance.",
          "caption": "Scenario 3: Reported-case-weighted access · 3 centers"
        }
      ]
    },
    {
      "type": "text",
      "title": "Neighborhood profiles",
      "body": [
        "For the three sites selected under the population-based scenario, I examined one-mile walksheds and combined demographic, zoning, transit, and healthcare facility information. This added neighborhood context to the model’s distance-based results.",
        "The profiles pointed to considerations such as affordable services, multilingual outreach, and connections to existing healthcare resources. Site C had fewer nearby healthcare facilities, while subway lines around Site B bypassed its central area. These differences showed why an optimized location still needs to be assessed against local service conditions."
      ],
      "media": {
        "image": "public/images/projects/covid-resource-deployment/walksheds.png",
        "alt": "Three population-based sites A, B and C with their one-mile walking service areas in the Bronx.",
        "caption": "One-mile walksheds around the three population-based sites."
      }
    },
    {
      "type": "image",
      "image": "public/images/projects/covid-resource-deployment/site-b-spread.png",
      "alt": "Complete Site B Southwest Bronx neighborhood profile spread, printed pages 10–11, including maps, demographic charts, key indicators and analysis.",
      "caption": "Neighborhood profile for Site B, Southwest Bronx."
    }
  ],
  "showHeroImage": false
},
  {
    slug: "pennsylvania-redistricting",
    title: "Redistricting Pennsylvania's Congressional Boundaries",
    subtitle: "GIS analysis comparing congressional district racial diversity and compactness before and after redistricting.",
    year: "2024.12",
    location: "PA",
    group: "gis-data-analysis",
    listed: false,
    projectType: "GIS & Policy Analysis",
    context: "Course Project",
    tools: ["R", "ArcGIS Pro", "Adobe Illustrator", "Adobe InDesign"],
    dataSources: ["ACS 2023 5-Year Estimates", "Pennsylvania Spatial Data Access"],
    methods: ["Simpson's Diversity Index","Polsby-Popper Compactness","District Boundary Comparison"],
    focusAreas: ["Redistricting","Demographic Analysis","Compactness Analysis","GIS Mapping"],
    thumbnail: "public/images/projects/pennsylvania-redistricting/spread-01.png",
    heroImage: "public/images/projects/pennsylvania-redistricting/spread-01.png",
    heroAlt: "Racial diversity analysis for Pennsylvania congressional districts.",
    summary: "This GIS analysis compared Pennsylvania's old and new congressional boundaries after the 2018 redistricting decision. I evaluated how the new map changed district diversity and compactness, then drew three southeastern Pennsylvania districts to balance population, demographic representation, and boundary shape.",
    featured: true,
    sections: [
      {
        type: "text",
        eyebrow: "District Boundaries",
        title: "A spatial comparison of diversity and compactness after redistricting.",
        body: [
          "In 2018, the Pennsylvania Supreme Court overturned the state's 2011 congressional boundaries to address gerrymandering. I compared the old and new district boundaries based on racial diversity and compactness.",
          "I also drew three congressional districts in southeastern Pennsylvania, aiming to balance population size, racial diversity, and district compactness."
        ]
      },
      {
        type: "text",
        eyebrow: "Evaluation Framework",
        title: "Simpson's Diversity Index and Polsby-Popper compactness scores.",
        body: [
          "I measured racial diversity using Simpson's Diversity Index across Hispanic/Latino, non-Hispanic/Latino White, non-Hispanic/Latino Black, non-Hispanic/Latino Asian, and all other non-Hispanic/Latino race groups.",
          "I measured district compactness using the Polsby-Popper score, which compares a polygon's area and perimeter. Values closer to 1 indicate shapes closer to a circle and therefore greater compactness."
        ]
      },
      {
        type: "image",
        image: "public/images/projects/pennsylvania-redistricting/spread-01.png",
        alt: "Racial diversity analysis maps and table for Pennsylvania congressional districts.",
        caption: "Racial diversity distribution by census tract and district-level comparison of old and new congressional boundaries."
      },
      {
        type: "text",
        eyebrow: "Boundary Comparison",
        title: "The new boundaries generally improved compactness.",
        body: [
          "The diversity analysis found that Pennsylvania's southeast, including Philadelphia and surrounding suburbs, had higher levels of racial diversity, while mid-western regions showed the lowest diversity.",
          "Comparing old and new boundaries, 10 of 18 congressional districts had relatively stable diversity levels, with changes of less than plus or minus 0.03. Four districts had a significant decrease in diversity, while four became more heterogeneous.",
          "Compactness improved in 16 of 18 districts under the new boundaries. The average Polsby-Popper score increased from 0.17 for old districts to 0.33 for new districts; the median old-district score was 0.14."
        ]
      },
      {
        type: "image",
        image: "public/images/projects/pennsylvania-redistricting/spread-02.png",
        alt: "Compactness analysis and proposed redistricting plan spread.",
        caption: "Compactness comparison and proposed districts for eastern Pennsylvania near Philadelphia."
      },
      {
        type: "text",
        eyebrow: "Proposed Districts",
        title: "A three-district proposal for southeastern Pennsylvania.",
        body: [
          "Using the 2020 statewide population of about 13 million, I used an ideal district size of roughly 720,000 residents. I delineated three districts around Bucks County and Philadelphia County.",
          "The proposed districts had populations of 740,886, 768,877, and 719,462. Their Simpson's D values were 0.64, 0.29, and 0.32, with Polsby-Popper scores of 0.47, 0.43, and 0.42. The boundaries primarily aligned with county lines while reflecting demographic diversity."
        ]
      }
    ]
  },
  {
    "slug": "indego-bike-share-stations",
    "listed": false,
    "title": "Planning Indego Bike Share Stations",
    "subtitle": "Trip analysis and preliminary bike share expansion recommendations for Philadelphia.",
    "year": "2024.10",
    "location": "Philadelphia, PA",
    "group": "gis-data-analysis",
    "order": 2,
    "projectType": "Individual course project",
    "context": "Course Project",
    "tools": [
      "ArcGIS Pro",
      "Adobe Illustrator",
      "Adobe InDesign"
    ],
    "methods": ["Trip Aggregation","Spatial Comparison","Thematic Mapping"],
    "focusAreas": ["Bike Share","GIS Mapping","Spatial Analysis","Station Planning"],
    "thumbnail": "public/images/projects/indego-bike-share-stations/candidate-overview-cover.png",
    "heroImage": "public/images/projects/indego-bike-share-stations/candidate-overview-cover.png",
    "heroAlt": "Three candidate areas for additional Indego stations in Philadelphia.",
    "summary": "Where could additional bike share stations complement Philadelphia’s existing network? In this individual course project, I analyzed Indego’s Q2 2024 trip records alongside ACS commuting data, existing stations, and park locations. I mapped station activity and identified three candidate areas for expansion, translating patterns in bike use and neighborhood context into preliminary planning recommendations.",
    "featured": true,
    "sections": [
      {
        "type": "text",
        "title": "Understanding station use",
        "body": [
          "I summarized trip starts, trip ends, and median trip duration at each station, then compared activity across neighborhoods. Mapping these measures made it possible to distinguish concentrations of station use from differences in trip patterns. Starts were concentrated in Center City and University City, while longer median trips originated along the northern Schuylkill River corridor and in parts of West Philadelphia."
        ]
      },
      {
        "type": "project-credits",
        "html": "<style>.indego-activity,.indego-candidates{max-width:820px}.indego-activity .indego-city-maps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem;max-width:720px;align-items:start}.indego-activity .image-button,.indego-candidates .image-button,.indego-candidates .indego-legend{border:0;background:transparent}.indego-activity img,.indego-candidates img{width:100%;height:auto;aspect-ratio:auto;object-fit:contain;border:0}.indego-activity{margin-top:-1rem}.indego-candidates .indego-zone-layout{display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:1.5rem;align-items:start}.indego-candidates .indego-zone-list{display:grid;gap:1.5rem}.indego-candidates .indego-zone-row{display:grid;grid-template-columns:210px minmax(0,1fr);gap:1.25rem;align-items:start}.indego-candidates .indego-zone-copy p{color:var(--ink-soft);font-size:1.05rem;margin:0}.indego-candidates .indego-legend{width:220px;margin:0}.indego-candidates .indego-legend img{display:block}.indego-candidates{margin-top:-1rem}.indego-candidates>figure>figcaption{margin-top:1rem}@media(max-width:700px){.indego-activity .indego-city-maps{grid-template-columns:minmax(0,1fr);max-width:360px}.indego-candidates .indego-zone-layout{grid-template-columns:minmax(0,1fr)}.indego-candidates .indego-zone-row{grid-template-columns:minmax(0,1fr);gap:.75rem}.indego-candidates .indego-zone-row .image-button{max-width:260px}.indego-candidates .indego-legend{width:220px}}</style><section class=\"case-section indego-activity\"><figure class=\"case-image\"><div class=\"indego-city-maps\"><button class=\"image-button\" type=\"button\" data-lightbox=\"public/images/projects/indego-bike-share-stations/trip-starts.png\" aria-label=\"Open larger map: Trip starts by station, with its legend and scale.\"><img src=\"public/images/projects/indego-bike-share-stations/trip-starts.png\" alt=\"Trip starts by station, with its legend and scale.\" loading=\"lazy\"></button><button class=\"image-button\" type=\"button\" data-lightbox=\"public/images/projects/indego-bike-share-stations/trip-duration.png\" aria-label=\"Open larger map: Median trip duration by starting station, with its legend and scale.\"><img src=\"public/images/projects/indego-bike-share-stations/trip-duration.png\" alt=\"Median trip duration by starting station, with its legend and scale.\" loading=\"lazy\"></button></div><figcaption>Station activity and median trip duration, Q2 2024.</figcaption></figure></section>"
      },
      {
        "type": "text",
        "title": "Identifying candidate areas",
        "body": [
          "To look beyond the busiest existing stations, I compared census-tract bicycle commuting shares with station locations and nearby parks. This brought together an indicator of existing cycling activity, the distribution of bike share stations, and local destinations to identify three candidate areas for further investigation."
        ]
      },
      {
        "type": "project-credits",
        "html": "<section class=\"case-section indego-candidates\"><figure class=\"case-image\"><div class=\"indego-zone-layout\"><div class=\"indego-zone-list\"><div class=\"indego-zone-row\"><button class=\"image-button\" type=\"button\" data-lightbox=\"public/images/projects/indego-bike-share-stations/paschall.png\" aria-label=\"Open larger map: Zone #1: Paschall candidate area.\"><img src=\"public/images/projects/indego-bike-share-stations/paschall.png\" alt=\"Zone #1: Paschall candidate area.\" loading=\"lazy\"></button><div class=\"indego-zone-copy\"><p><strong>Zone #1 — Paschall:</strong> Explore stations near parks in a Southwest Philadelphia area with relatively few existing stations and a reported bicycle commuting share of 7.42%.</p></div></div><div class=\"indego-zone-row\"><button class=\"image-button\" type=\"button\" data-lightbox=\"public/images/projects/indego-bike-share-stations/point-breeze.png\" aria-label=\"Open larger map: Zone #2: Point Breeze candidate area.\"><img src=\"public/images/projects/indego-bike-share-stations/point-breeze.png\" alt=\"Zone #2: Point Breeze candidate area.\" loading=\"lazy\"></button><div class=\"indego-zone-copy\"><p><strong>Zone #2 — Point Breeze:</strong> Consider stations within the candidate area, where the reported bicycle commuting share exceeded 20% and existing stations were located near its edges.</p></div></div><div class=\"indego-zone-row\"><button class=\"image-button\" type=\"button\" data-lightbox=\"public/images/projects/indego-bike-share-stations/fitler-rittenhouse.png\" aria-label=\"Open larger map: Zone #3: Fitler Square / southwestern Rittenhouse candidate area.\"><img src=\"public/images/projects/indego-bike-share-stations/fitler-rittenhouse.png\" alt=\"Zone #3: Fitler Square / southwestern Rittenhouse candidate area.\" loading=\"lazy\"></button><div class=\"indego-zone-copy\"><p><strong>Zone #3 — Fitler Square / southwestern Rittenhouse:</strong> Explore additional stations near Markward Playground and the riverfront to support commuting and recreational trips.</p></div></div></div><div class=\"indego-legend\"><button class=\"image-button\" type=\"button\" data-lightbox=\"public/images/projects/indego-bike-share-stations/candidate-legend.png\" aria-label=\"Open larger map: Shared legend for candidate areas, existing stations, parks, streets and census tract bicycle commuting shares.\"><img src=\"public/images/projects/indego-bike-share-stations/candidate-legend.png\" alt=\"Shared legend for candidate areas, existing stations, parks, streets and census tract bicycle commuting shares.\" loading=\"lazy\"></button></div></div><figcaption>Three candidate areas, shown with bicycle commuting shares, existing stations, and nearby parks.</figcaption></figure></section>"
      }
    ],

    "showHeroImage": false
  },

  {
    "slug": "brewerytown-neighborhood-profile",
    "title": "Brewerytown Neighborhood Profile",
    "subtitle": "Neighborhood change analysis covering education, employment, income, poverty, and gentrification pressures.",
    "year": "2024.08 – 2024.12",
    "location": "Brewerytown, Philadelphia, PA",
    "group": "community-economic-development",
    "order": 4,
    "projectType": "Four-person course project, University of Pennsylvania",
    "context": "Course Project",
    "tools": [
      "R",
      "ArcGIS Pro",
      "Microsoft Excel",
      "Adobe Illustrator",
      "Adobe InDesign"
    ],
    "dataSources": [
      "ACS 2022 5-Year Estimates",
      "OnTheMap",
      "OpenDataPhilly"
    ],
    "methods": ["Census Data Analysis","Citywide Comparison","Socioeconomic Synthesis","Data Visualization"],
    "focusAreas": ["Census Data Analysis","Neighborhood Research"],
    "thumbnail": "public/images/projects/brewerytown-neighborhood-profile/card-cover.png",
    "thumbnailAlt": "Brewerytown report cover with white title, subtitle, and building footprints on a green background.",
    "heroImage": "public/images/projects/brewerytown-neighborhood-profile/spread-01.png",
    "heroAlt": "Brewerytown neighborhood profile maps and charts.",
    "summary": "Our four-person team developed a neighborhood profile of Brewerytown, Philadelphia, examining demographic, economic, and housing changes between 2012 and 2022. The report combined Census data, employment data, and neighborhood observations to explore how neighborhood growth intersected with housing pressures and persistent inequality.",
    "featured": true,
    "sections": [
      {
        "type": "project-credits",
        "html": "<link rel=\"stylesheet\" href=\"assets/css/brewerytown.css\">"
      },
      {
        "type": "text",
        "title": "From Census data to a neighborhood profile",
        "body": [
          "I organized and analyzed Census data for the education, employment, and income and poverty sections, comparing changes over time with Philadelphia’s broader trends. Examining differences across income levels and racial groups helped distinguish improvements in neighborhood averages from inequalities that persisted among residents.",
          "I synthesized these findings with the team’s demographic and housing analysis to describe how the neighborhood was changing. Connecting the indicators helped explain why rising educational attainment and incomes could coexist with employment disparities and housing pressures.",
          "I also edited graphics and designed the complete report layout in Adobe Illustrator and InDesign, bringing four contributors’ work into a consistent, readable document."
        ]
      },
      {
        "type": "gallery",
        "images": [
          {
            "image": "public/images/projects/brewerytown-neighborhood-profile/report-page-08.png",
            "alt": "Complete neighborhood profile report page 6 (PDF page 8), including original text, graphics, and page furniture."
          },
          {
            "image": "public/images/projects/brewerytown-neighborhood-profile/report-page-09.png",
            "alt": "Complete neighborhood profile report page 7 (PDF page 9), including original text, graphics, and page furniture."
          },
          {
            "image": "public/images/projects/brewerytown-neighborhood-profile/report-page-10.png",
            "alt": "Complete neighborhood profile report page 8 (PDF page 10), including original text, graphics, and page furniture."
          },
          {
            "image": "public/images/projects/brewerytown-neighborhood-profile/report-page-15.png",
            "alt": "Complete neighborhood profile report page 13 (PDF page 15), including original text, graphics, and page furniture."
          }
        ],
        "caption": "Selected analysis and layout from the final neighborhood profile."
      }
    ],
    "contributionNote": "I wrote the education, employment, and income and poverty sections, edited graphics, and designed the complete report layout.",
    "showHeroImage": false,
    "fullReport": {
      "label": "View full report",
      "url": "source/5010Final.pdf"
    }
  },
  {
    "slug": "mapping-2025-los-angeles-fires",
    "title": "Mapping the 2025 Los Angeles Fires",
    "subtitle": "ArcGIS StoryMap identifying burn areas and analyzing community and environmental impacts in the Los Angeles region.",
    "year": "2025.10 – 2025.12",
    "location": "Los Angeles, CA",
    "group": "gis-data-analysis",
    "order": 4,
    "projectType": "GIS Storytelling",
    "context": "Course Project",
    "tools": [
      "ArcGIS Pro",
      "ArcGIS Online",
      "ArcGIS StoryMaps"
    ],
    "dataSources": [
      "Landsat 8 satellite imagery",
      "ACS 2019-2023 5-Year Estimates",
      "CAL FIRE Damage Inspection Data",
      "NLCD 2024",
      "NASA Scientific Visualization Studio"
    ],
    "methods": ["Multispectral Imagery Analysis","NBR and NDVI Comparison","Raster Reclassification","Spatial Summarization","Visual Storytelling"],
    "focusAreas": ["GIS Mapping","Hazard Analysis","Spatial Analysis","Visual Storytelling"],
    "thumbnail": "public/images/projects/mapping-2025-los-angeles-fires/card-cover.png",
    "heroImage": "public/images/projects/mapping-2025-los-angeles-fires/hero.svg",
    "heroAlt": "Graphic summary for the Mapping the 2025 Los Angeles Fires StoryMap.",
    "summary": "I developed an ArcGIS StoryMap to examine the January 2025 Los Angeles fires, connecting satellite-derived burn areas with community characteristics, structure damage, and land cover. The project combines raster analysis, data from multiple sources, and visual storytelling to explain both landscape change and its local context.",
    "featured": true,
    "sections": [
      {
        "type": "project-credits",
        "html": "<link rel=\"stylesheet\" href=\"assets/css/la-fire.css\">"
      },
      {
        "type": "text",
        "body": [
          "I created an ArcGIS StoryMap exploring the January 2025 Los Angeles fires, from satellite-derived burn areas to their community and environmental context. I processed Landsat imagery to compare NBR and NDVI across dates, digitized burn areas, and reclassified land-cover rasters for analysis.",
          "I combined these results with census estimates and CAL FIRE structure damage records to examine the Palisades and Eaton areas. Using swipe comparisons, interactive maps, charts, and sidecar narratives, I selected presentation formats that help readers understand landscape change and connect findings across different data sources."
        ]
      },
      {
        "type": "project-credits",
        "html": "<div class=\"case-text la-fire-storymap\"><p><a class=\"text-link\" href=\"https://storymaps.arcgis.com/stories/08d3f59c3903437c924fadc49e116c70\" target=\"_blank\" rel=\"noopener noreferrer\">Explore the StoryMap ↗</a></p><p>View the full analysis through interactive maps and visual comparisons.</p></div>"
      }
    ],
    "thumbnailAlt": "Mapped Palisades and Eaton fire areas in the Los Angeles region.",
    "showHeroImage": false,
    "showIntro": false
  },

  {
    "slug": "lancaster-park-city-center",
    "title": "Toward a Small Area Plan for the Park City Center",
    "subtitle": "Studio scenario planning for a 100-acre regional mall site in Lancaster, Pennsylvania.",
    "year": "2025.08 – 2025.12",
    "location": "Lancaster, PA",
    "group": "community-economic-development",
    "order": 1,
    "projectType": "Planning Studio",
    "clientName": "City of Lancaster",
    "tools": [
      "InDesign",
      "Illustrator",
      "GIS"
    ],
    "dataSources": [
      "Our Future Lancaster 2023",
      "Places2040",
      "ACS data",
      "Lancaster County GIS/PASDA",
      "Park City Center directory",
      "RRTA Route 8 information",
      "Placer.ai and CoStar references cited in report"
    ],
    "methods": ["Scenario Planning","Zoning Analysis","Market and Fiscal Analysis","Conceptual Site Planning"],
    "focusAreas": ["Housing","Market Analysis","Zoning","Development Feasibility"],
    "fullReport": {
      "label": "View Full Report",
      "url": "https://drive.google.com/file/d/1DqnvggwlqwHDid5JzU2UtRnSynDHE_Ll/view?usp=drive_link"
    },
    "thumbnail": "public/images/projects/lancaster-park-city-center/report-cover.png",
    "heroImage": "public/images/projects/lancaster-park-city-center/report-cover.png",
    "heroAlt": "Cover of Toward a Small Area Plan for the Park City Center, Lancaster Studio II Final Report.",
    "summary": "Park City Center’s approximately 100-acre site offered an opportunity to consider how a regional shopping mall could evolve into a mixed-use district. Our team developed three redevelopment scenarios through a Penn planning studio to inform the City of Lancaster’s Small Area Plan development, bringing together market analysis, land-use planning, circulation, parking, and implementation considerations.",
    "featured": false,
    "sections": [
      {
        "type": "text",
        "title": "Housing Market Analysis",
        "body": [
          "Introducing housing required an understanding of both Lancaster’s wider market and conditions around the project site. I analyzed housing conditions in the city and the project-area census tract and compiled property-level rent data to help ground the residential proposals in local evidence.",
          "The analysis supported decisions about housing types and unit mix, while the rent comparisons supplied inputs for the team’s discounted cash flow analysis. Connecting market research with scenario evaluation helped the team assess the financial implications of different redevelopment options alongside their planning objectives."
        ],
        "media": {
          "image": "public/images/projects/lancaster-park-city-center/housing-market.png",
          "alt": "Project-area census tract map and housing indicators compared with Lancaster citywide.",
          "caption": "Housing conditions around Park City Center compared with Lancaster citywide."
        }
      },
      {
        "type": "text",
        "title": "Redevelopment Scenarios",
        "body": [
          "Our team developed three scenarios to explore different approaches to the site’s future. Comparing alternatives allowed us to consider how land-use allocation, circulation, parking, and development intensity worked together, and what each approach would require for implementation.",
          "I contributed to the housing, parking, and zoning components, helping connect the residential program with the site’s broader planning framework. These considerations mattered because adding new uses also required decisions about how people would move through the site, how much land would remain devoted to parking, and how development regulations could accommodate change. The scenarios gave the City a basis for discussing these choices as it developed the Small Area Plan."
        ]
      },
      {
        "type": "gallery",
        "images": [
          {
            "image": "public/images/projects/lancaster-park-city-center/scenario-1.png",
            "alt": "Business as Usual site configuration."
          },
          {
            "image": "public/images/projects/lancaster-park-city-center/scenario-2.png",
            "alt": "Scenario One site configuration."
          },
          {
            "image": "public/images/projects/lancaster-park-city-center/scenario-3.png",
            "alt": "Scenario Two site configuration."
          }
        ]
      },
      {
        "type": "text",
        "title": "Report Production",
        "body": [
          "Presenting three scenarios in one report required a consistent structure that made their assumptions, proposals, and differences easy to follow. I led final report production, creating templates in InDesign and Illustrator and coordinating the integration of the team’s written and visual materials.",
          "I also managed final quality assurance and quality control, checking layout consistency, figure references, and print-ready exports. This work brought the team’s analyses and recommendations into a cohesive document that readers could use to compare the redevelopment options."
        ]
      },
      {
        "type": "gallery",
        "images": [
          {
            "image": "public/images/projects/lancaster-park-city-center/report-spread-28-29.png",
            "alt": "Complete report spread, printed pages 28–29, with left and right pages side by side.",
            "caption": "Report pages 28–29."
          },
          {
            "image": "public/images/projects/lancaster-park-city-center/report-spread-74-75.png",
            "alt": "Complete report spread, printed pages 74–75, with left and right pages side by side.",
            "caption": "Report pages 74–75."
          }
        ]
      }
    ],
    "metaBeforeIntro": true,
    "showHeroImage": false,
    "thumbnailAlt": "Cover of Toward a Small Area Plan for the Park City Center, Lancaster Studio II Final Report."
  },
  {
    "slug": "haddon-township-downtown-action-plan",
    "title": "Haddon Township Downtown Action Plan",
    "subtitle": "Studio action plan for Haddon Avenue focused on placemaking, businesses, development, and transportation.",
    "year": "2025.01 – 2025.05",
    "location": "Haddon Township, NJ",
    "group": "community-economic-development",
    "order": 2,
    "projectType": "Planning Studio",
    "context": "Academic Studio",
    "tools": [
      "GIS",
      "Adobe InDesign",
      "Adobe Illustrator"
    ],
    "dataSources": [
      "2020 Decennial Census",
      "ACS 2022 5-Year Estimates",
      "Haddon Township plans and ordinances",
      "Stakeholder interviews",
      "Site observations"
    ],
    "methods": ["Pedestrian Infrastructure Audits","Geocoded Inventory","Infrastructure Gap Mapping","Action Planning"],
    "focusAreas": ["Downtown Planning","Economic Development","Public Realm","Community Engagement"],
    "fullReport": {
      "label": "View Full Report",
      "url": "https://drive.google.com/file/d/1z_RiAxPfHK9Ki2i_i2gEuLLCpdJNORed/view?usp=drive_link"
    },
    "thumbnail": "public/images/projects/haddon-township-downtown-action-plan/report-cover.png",
    "thumbnailAlt": "Cover of the Haddon Township Downtown Action Plan report.",
    "heroImage": "public/images/projects/haddon-township-downtown-action-plan/hero.svg",
    "heroAlt": "Graphic summary for the Haddon Township Downtown Action Plan.",
    "summary": "Our team of seven developed a downtown revitalization action plan for Haddon Avenue in Haddon Township, New Jersey, translating field findings into prioritized actions for placemaking, business support, housing, and mobility. I conducted pedestrian infrastructure audits, built a geocoded GIS inventory, and helped develop placemaking strategies. I also led final report production and QAQC.",
    "featured": false,
    "sections": [
      {
        "type": "text",
        "title": "Understanding the Corridor at Street Level",
        "body": [
          "Walking conditions affect how people reach local businesses and use downtown spaces. To understand these conditions along Haddon Avenue, I conducted block-by-block field audits of curb ramps, street furniture, and pedestrian crossings. I organized the observations into a geocoded GIS inventory and mapped pedestrian infrastructure gaps, connecting individual field observations to a corridor-wide picture of safety and accessibility needs. This work supported the identification and prioritization of potential improvements."
        ],
        "media": {
          "image": "public/images/projects/haddon-township-downtown-action-plan/sidewalk-field-photos.png",
          "alt": "Field photographs of uneven pavement, erosion, and a utility pole obstructing a sidewalk.",
          "caption": "Uneven pavement, erosion, and an obstructed sidewalk along Haddon Avenue."
        }
      },
      {
        "type": "image",
        "image": "public/images/projects/haddon-township-downtown-action-plan/crosswalk-conditions.png",
        "alt": "Haddon Avenue crosswalk conditions map with legend for repainting needs, signalization, and stretches over 400 feet without crosswalks.",
        "caption": "Crosswalk conditions and gaps along Haddon Avenue."
      },
      {
        "type": "text",
        "title": "Turning Findings into an Action Plan",
        "body": [
          "Downtown revitalization involves both how people move along a corridor and how they spend time there. Our team developed prioritized actions for placemaking, business support, housing, and mobility based on conditions along Haddon Avenue. I contributed to the placemaking strategies, helping translate field observations into proposals for how downtown spaces could better support everyday use and activity. My pedestrian infrastructure inventory also informed the mobility recommendations, connecting improvements to public spaces with safer and more accessible ways to reach them."
        ]
      },
      {
        "type": "split",
        "images": [
          {
            "image": "public/images/projects/haddon-township-downtown-action-plan/recommendations-map.png",
            "alt": "Team recommendations map identifying placemaking, business, development, and transportation proposals along Haddon Avenue.",
            "caption": "Our team’s corridor recommendations across four action areas."
          },
          {
            "image": "public/images/projects/haddon-township-downtown-action-plan/crossing-action.png",
            "alt": "Recommendation 4.2 with existing and proposed crossings, implementation partners, funding options, and a 0–3 year timeline.",
            "caption": "Crossing improvements connect mapped conditions to proposed locations and a 0–3 year timeframe."
          }
        ]
      },
      {
        "type": "text",
        "title": "Bringing the Report Together",
        "body": [
          "An action plan needs to communicate its findings and recommendations clearly across multiple topics. I led final report production and QAQC, bringing the team’s contributions into a cohesive document and reviewing consistency across its sections and visual materials. This work helped readers follow the relationship between corridor conditions, supporting analysis, and proposed actions."
        ]
      },
      {
        "type": "gallery",
        "images": [
          {
            "image": "public/images/projects/haddon-township-downtown-action-plan/report-spread-62-63.png",
            "alt": "Full report spread describing public-space activation and a proposed event setting for Haddon Square.",
            "caption": "Haddon Square: public-space recommendations and an event-setting design."
          },
          {
            "image": "public/images/projects/haddon-township-downtown-action-plan/report-spread-94-95.png",
            "alt": "Full report spread pairing short- and long-term priorities with the implementation timeline.",
            "caption": "Action priorities paired with short-, intermediate-, and long-term phases."
          }
        ]
      }
    ],

    "showHeroImage": false
  }
];

window.PORTFOLIO_UNPUBLISHED_PROJECTS = [
  {
    title: "Houston MSA Profile",
    listed: false,
    year: "2025.08 – 2025.12",
    group: "community-economic-development",
    order: 3,
    focusAreas: ["Regional Economy","Employment","Demographic Analysis","Data Analysis"]
  },

];

window.PORTFOLIO_PROJECTS.push({"slug":"arsenic-private-wells","detailPage":"project-arsenic.html","title":"Mapping Arsenic Exceedance Risk in Private Wells","subtitle":"Translating group modeling results into an interactive map for a general audience.","year":"2026.01 – 2026.05","group":"gis-data-analysis","order":5,"projectType":"Academic Practicum","thumbnail":"public/images/projects/arsenic-cover.png","thumbnailAlt":"Arsenic screening results mapped across Gaston County, NC","heroAlt":"Mapped well classifications under Broad screening in Gaston County","focusAreas":["GIS Mapping","Spatial Analysis","Predictive Modeling","Data Visualization","Interactive Mapping"],"listed":true});

Object.assign(window.PORTFOLIO_PROJECTS.find(p => p.slug === "arsenic-private-wells"), {"summary":"This group project explored arsenic exceedance risk in private wells in Gaston County, North Carolina. Our team compared screening strategies to identify wells for follow-up testing, with an interactive map making the results accessible to a general audience.","location":"Gaston County, NC","interactiveMap":"arsenic-map/index.html","heroCaption":"Switch screening strategies, inspect individual wells, and toggle boundary and geology layers.","sections":[{"type":"text","title":"Making the results understandable","body":["This interactive map presents our team’s arsenic modeling results. I translated those results into a map that is easier for the public to explore and understand. See the Project report for the full analysis.","The communication challenge was to show why different screening priorities produce different follow-up lists without implying that a model can confirm contamination. I paired each strategy with a plain-language explanation of its purpose and tradeoff, and kept the original map’s legends, well details, and ZIP-code search results available for exploration. Users can switch strategies without losing their map view, inspect individual wells, and explore the original ZIP-code summaries."],"inlineLink":{"label":"Project report","url":"arsenic-map/data/analysis-report.html"}}],"tools":["R (team modeling and data preparation)","Leaflet","JavaScript","HTML/CSS"],"dataSources":["Recorded private-well measurements (December 2023)","Team modeling results and analysis workflow (Project report, May 2026)","Gaston County boundary, county subdivisions and ZIP code areas","NC Geological Survey formations","Esri basemap"],"methods":["Team Predictive Modeling and Screening-Strategy Comparison","Interactive Mapping","Well Clustering","Plain-Language Interpretation of Screening Results"]});

window.PORTFOLIO_PROJECTS.push({
  "slug": "fox-chase-burholme-active-transportation-plan",
  "subtitle": "Active transportation planning for safer walking and bicycling in Philadelphia's Fox Chase and Burholme neighborhoods.",
  "title": "Fox Chase–Burholme Active Transportation Plan",
  "year": "2026.06 – Present",
  "location": "Philadelphia, PA",
  "group": "transportation-mobility-planning",
  "order": 2,
  "projectType": "Active Transportation Plan",
  "clientName": "City of Philadelphia",
  "focusAreas": ["Community Engagement","GIS Mapping","Active Transportation","Project Prioritization"],
  "summary": "Fox Chase–Burholme is home to more than 20,000 residents, with schools, health centers, parks, and commercial corridors serving as anchors of daily life. Incomplete infrastructure, high-speed traffic, and gaps in connectivity can make these destinations difficult to reach on foot or by bicycle. Toole Design is working with Philadelphia’s Office of Transportation and Infrastructure Systems to develop an active transportation plan for the community. I support the planning process through public engagement, map revisions, project and program prioritization, and drafting portions of the final plan.",
  "introLink": {
    "label": "an active transportation plan for the community",
    "url": "https://www.phila.gov/documents/fox-chase-burholme-active-transportation-plan/"
  },
  "thumbnail": "public/images/projects/fox-chase-burholme-active-transportation-plan/board-1.png",
  "heroImage": "public/images/projects/fox-chase-burholme-active-transportation-plan/board-1.png",
  "heroAlt": "Complete pedestrian network board with proposed connections and resident feedback area.",
  "showHeroImage": false,
  "featured": false,
  "sections": [
    {
      "type": "group",
      "title": "From Public Discussion to Planning Priorities",
      "sections": [
        {
          "type": "text",
          "body": [
            "I designed the pop-up boards for the August 2026 National Night Out event to help residents understand proposed walking and biking improvements and share feedback.",
            "Network maps invited residents to identify missing crossings and connections, while photographs and brief comparisons explained bicycle facility options. Sticker voting and open-ended prompts gathered preferences on facilities and programs to inform the team’s next round of recommendations."
          ]
        },
        {
          "type": "gallery",
          "images": [
            {
              "image": "public/images/projects/fox-chase-burholme-active-transportation-plan/board-1.png",
              "alt": "Complete pedestrian network board with proposed connections and resident feedback area."
            },
            {
              "image": "public/images/projects/fox-chase-burholme-active-transportation-plan/board-2.png",
              "alt": "Complete bicycle network board with proposed connections, program options, and resident feedback areas."
            },
            {
              "image": "public/images/projects/fox-chase-burholme-active-transportation-plan/board-3.png",
              "alt": "Complete bicycle facilities board with photographs, facility descriptions, costs, and sticker-voting area."
            }
          ],
          "caption": "National Night Out Pop-up Boards - Pedestrian Network, Bicycle Network, and Bicycle Facilities"
        },
        {
          "type": "text",
          "body": [
            "After engagement, I wrote a summary memo that organized public comments and drew out insights to inform project and program prioritization and the final plan framework. This synthesis helped make residents’ feedback usable in the next stage of planning."
          ]
        }
      ]
    },
    {
      "type": "text",
      "title": "Refining Projects and Developing the Plan",
      "body": [
        "I revised maps and the project list through several rounds of client comments and engagement findings, keeping the mapped proposals and written descriptions aligned as the plan evolved. Alongside this work, I supported active transportation study tasks and drafted portions of the final plan, helping develop the recommendations and their presentation."
      ]
    }
  ]
});

window.PORTFOLIO_PROJECTS.push({
  "slug": "indego-rebalance-analysis",
  "title": "Indego Bike Share Demand Modeling",
  "subtitle": "Bike share demand analysis and predictive modeling in R.",
  "year": "2025.05",
  "location": "Philadelphia, PA",
  "group": "gis-data-analysis",
  "order": 3,
  "projectType": "Individual academic project",
  "context": "Course Project",
  "tools": [
    "R",
    "tidyverse",
    "sf",
    "tidycensus",
    "lubridate",
    "purrr",
    "ggplot2"
  ],
  "methods": ["Spatial Joins","Feature Engineering","Linear Regression","Temporal Validation","Error Analysis"],
  "focusAreas": ["Bike Share","Demand Modeling","Data Analysis","R Programming"],
  "thumbnail": "public/images/projects/indego-rebalance-analysis/model-mae-cover.png",
  "heroImage": "public/images/projects/indego-rebalance-analysis/model-mae.png",
  "heroAlt": "Prediction errors across five model specifications and three test weeks.",
  "summary": "Bike share rebalancing depends on anticipating where and when riders will need bikes. I developed an R workflow to analyze Philadelphia’s Indego trip data and compare five models of hourly station departures, examining both prediction accuracy and the implications for rebalancing decisions.",
  "featured": true,
  "sections": [
    {
      "type": "text",
      "title": "Building a dataset across stations and time",
      "body": [
        "I combined Q4 2024 trip records with hourly weather observations and census tract characteristics, using spatial joins and time-based aggregation to connect datasets recorded at different scales.",
        "A key step was constructing a station-hour panel that retained hours with no departures. This allowed the analysis to represent quiet periods alongside active ones. I then created time and historical-demand features to examine how station activity varied with location, daily schedules, weather, and recent usage."
      ],
      "media": {
        "image": "public/images/projects/indego-rebalance-analysis/weekday-weekend.png",
        "alt": "Weekday and weekend trip patterns by hour.",
        "caption": "Weekday and weekend trip patterns by hour."
      }
    },
    {
      "type": "text",
      "title": "Testing what improves prediction",
      "body": [
        "I compared five linear regression models, progressing from time-only and station-only specifications to models combining location, time, weather, lagged demand, and holiday indicators. Earlier weeks were used for training, with the final three calendar weeks reserved for testing.",
        "Using a reusable prediction function and purrr, I automated predictions and error calculations across models and test weeks. Adding historical demand produced the clearest improvement: weekly mean absolute error fell to approximately 0.36–0.47 trips per station-hour. Holiday indicators provided little additional improvement, showing why greater model complexity needs to be tested rather than assumed to help."
      ],
      "media": {
        "image": "public/images/projects/indego-rebalance-analysis/model-mae.png",
        "alt": "Prediction errors across five model specifications and three test weeks.",
        "caption": "Prediction errors across five model specifications and three test weeks."
      }
    },
    {
      "type": "image",
      "image": "public/images/projects/indego-rebalance-analysis/observed-predicted-comparison.png",
      "alt": "Observed and predicted departures across five model specifications.",
      "caption": "Observed and predicted departures across five model specifications."
    },
    {
      "type": "text",
      "title": "Understanding where predictions fall short",
      "body": [
        "I examined errors by station, time of day, and neighborhood characteristics to assess what the overall accuracy concealed. Errors were concentrated around Center City, and observed-versus-predicted plots showed underestimation at higher trip volumes. An AM-rush diagnostic also found greater errors at stations in tracts with higher shares of transit commuters.",
        "These findings suggest where closer monitoring and more flexible rebalancing may be useful. Departure predictions provide one input to those decisions; station inventory, returns, and dock capacity would also be needed to determine how many bikes to move."
      ],
      "media": {
        "image": "public/images/projects/indego-rebalance-analysis/station-errors.png",
        "alt": "Station-level prediction errors across Philadelphia.",
        "caption": "Station-level prediction errors across Philadelphia."
      }
    }
  ],

  "showHeroImage": false,
  "primaryLink": {
    "label": "View analysis & code ↗",
    "url": "public/analysis/indego/Assignment5.html",
    "newTab": true
  }
});

// Homepage descriptions preserve the full case-study text and formal project names.
const homepageDescriptions = {
  "allegheny-forward": "GIS mapping, transportation analysis, and report production to support the county’s comprehensive plan update.",
  "fox-chase-burholme-active-transportation-plan": "Network maps and public engagement materials connecting walking and biking proposals with neighborhood travel needs.",
  "lancaster-park-city-center": "Housing, parking, and zoning analysis informing three redevelopment scenarios for Lancaster’s regional mall.",
  "arsenic-private-wells": "An interactive map translating our team’s modeling results into a format the public can explore and understand."
};
window.PORTFOLIO_PROJECTS.forEach((project) => {
  project.featured = Object.hasOwn(homepageDescriptions, project.slug);
  if (project.featured) project.featuredDescription = homepageDescriptions[project.slug];
});
