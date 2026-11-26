/*
  Research / publication list. The page shows the entries in this order
  (put the newest first).

  To add one, copy an entry and change its fields:
    - title:       paper title
    - url:         not used on the page (the title is plain text); the paper
                   link goes in "links" below as "Paper"
    - authors:     list of author names; your name is shown in bold
                   automatically (see MY_NAMES below)
    - venue:       journal / conference / "Preprint", with the year
    - description: ONE short sentence, the main finding (can be left out)
    - image:       small picture on the left, e.g. "dict/images/research/x.png"
                   (leave as null to show an empty placeholder box)
    - links:       buttons under the description, e.g. Paper, Poster, Code
    - abstract:    full abstract, shown only when "Abstract" is clicked
                   (can be left out). Math works: write it between $...$ and
                   type every backslash twice, e.g. $\\mathcal{D}$
*/

// Ways your name is written in author lists; these are shown in bold.
window.MY_NAMES = ["Qiaorong S. Yu", "Qiaorong Yu", "Q. S. Yu", "Q. Yu"];

// Ongoing projects: shown above the other projects, same fields as below.
window.ONGOING_PROJECTS = [
  {
    title: "A neural circuit theory with recurrent normalization explains the dynamics of visual working memory",
    authors: ["Qiaorong S. Yu", "Jonathan A. Winawer", "Stefano Martiniani", "David J. Heeger"],
    // venue: "",
    description: "Visual working memory precision declines with delay and memory load; in our circuit model, recurrent normalization weakens memory activity as more items are held, and weaker activity drifts faster over the delay.",
    image: "dict/images/research/wm.png",
    links: [
      { label: "Poster", url: "dict/files/organics-wm.pdf" }
    ]
  }
];

window.PUBLICATIONS = [
  {
    title: "When and where: A model hippocampal network unifies formation of time cells and place cells",
    url: "https://doi.org/10.64898/2026.03.22.713480",
    authors: ["Qiaorong S. Yu", "Zhaoze Wang", "Vijay Balasubramanian"],
    venue: "Communications Biology, 2026",
    description: "Place cells and time cells could both emerge naturally in one recurrent network as both cell types are the consequence of completing missing sensory experience. ",
    image: "dict/images/research/time-cell.png",
    links: [
      { label: "Paper",  url: "https://doi.org/10.64898/2026.03.22.713480" },
      { label: "Poster", url: "dict/files/cosyne.pdf" },
      { label: "Code",   url: "https://github.com/qrsyu/STCell" }
    ],
    abstract: `Hippocampal place and time cells encode spatial and temporal aspects of experience.
      Both have the same neural substrate, but have been modeled as having different functions and mechanistic origins,
      place cells as continuous attractors, and time cells as leaky integrators. Here, we show that both types emerge
      from two dynamical regimes of a single recurrent network (RNN) modeling hippocampal CA3 as predictive autoencoder.
      During spatial navigation, the network generates stable attractor-like place fields.
      But trained on temporally structured inputs, the network produces sequentially broadened fields, recapitulating time cells.
      By varying spatio-temporal input patterning, we observe hidden units transition smoothly between time cell-like
      and place cell-like representations. These results suggest a shared origin, but task-driven difference,
      between place and time cells.`
  },

  {
    title: "Measuring the splashback feature: Dependence on halo properties and history",
    url: "https://doi.org/10.33232/001c.146824",
    authors: ["Qiaorong S. Yu", "Stephanie O'Neil", "Xuejian Shen", "Mark Vogelsberger", "Sownak Bose",
              "Boryana Hadzhyska", "Lars Hernquist", "Rahul Kannan", "Monica Wu", "Ziang Wu"],
    venue: "The Open Journal of Astrophysics, 2025",
    description: "The depth and width of a dark matter halo's splashback feature act as a long-term record of the halo formation history.",
    image: 'dict/images/research/DMH.jpg',
    links: [
      { label: "Paper", url: "https://doi.org/10.33232/001c.146824" },
      { label: "Code",  url: "https://github.com/qrsyu/TNG" }
    ],
    abstract: `The splashback radius defines the boundary of a dark matter halo, where infalling dark matter particles
      reach their first apocenter and turn around. In this study, we define the novel splashback depth $\\mathcal{D}$
      and width $\\mathcal{W}$ to examine how the splashback features of dark matter haloes are affected by the physical
      properties of haloes themselves. We use the largest simulation run in the hydrodynamic MillenniumTNG project.
      Our results show that the splashback depth has a strong dependence on the halo mass and the splashback width has
      the strongest dependence on halo peak height. We provide the fitting functions of the splashback depth and width
      in terms of halo mass, redshift, peak height, concentrations and halo formation time. The depth and width are
      therefore considered to be a long term memory tracker of haloes since they depend more on accumulative physical
      properties, e.g., halo mass, peak height and halo formation time. In contrast, they have little dependence on the
      short term factors such as halo mass accretion rate and most recent major merger time. They are shaped primarily
      by the halo’s assembly history, which exerts a stronger influence on the inner density profile than short-term
      dynamical processes. The splashback depth and width can therefore be used to characterise the halo’s history and
      inner structure.`
  },

  {
    title: "Attempting dream decoding with generalizable visual EEG encoding models",
    authors: ["Qiaorong S. Yu", "Remington Mallett", "Michelle Carr"],
    venue: "Cognitive Neuroscience Society (CNS) Annual Meeting, 2024",
    description: "An EEG encoding model trained on naturalistic images seen while awake predicts brain EEG signals during dreaming.",
    image: 'dict/images/research/paprika.jpg',
    links: [
      { label: "Poster", url: "dict/files/S.Yu_cns_poster.pdf" },
      { label: "Code",   url: "https://github.com/qrsyu/dream-viewer" }
    ],
    abstract: `The realm of dreams remains relatively uncharted due to the reliance of subjective reports to access
      dream content. Building a dream decoding model is difficult due to the difficulty in collecting large sample
      sizes of dream experience. We trained an encoding model to generate EEG signals from deep neural network feature
      maps of visual images viewed during waking, and used the model to try and predict EEG signals collected during
      dreaming.`
  }

  // Hidden for now (was commented out on the old page):
  // ,{
  //   title: "Memory transformation and alpha desynchronization during sleep",
  //   authors: [],
  //   venue: "",
  //   image: null,
  //   links: [],
  //   abstract: `Sleep has positive effects on memory consolidation, a critical process for learning and cognitive
  //     function. By analyzing changes in both lower and higher-level visual representations of episodic memories
  //     before and after sleep, we aim to understand how sleep affects the retention and modification of visual and
  //     semantic information.`
  // }
];
