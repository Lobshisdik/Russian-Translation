(() => {
  const News = {
    positive: {
      festival: {
        templates: {
          en: [
            "{location} announces major international {festival} festival - Tourism boom expected!",
            "Annual {festival} celebration in {location} attracts record visitors",
            "{location} selected to host European {festival} Championship",
            "The prestigious {festival} Biennale to be hosted in {location}, attracting art world elite",
            "World's Largest Pillow Fight championship announced in {location}'s main square",
            "International Hot Air Balloon Fiesta to fill the skies above {location}",
            "Massive historical reenactment event in {location} draws history buffs worldwide",
            "{location} Comic & Gaming Convention breaks attendance records",
            "The {location} International Street Magic Tournament mesmerizes crowds",
            "Annual {festival_type} festival returns to {location} with star-studded lineup",
            "A month-long celebration of {festival_type} will take over {location}'s cultural venues",
          ],
          it: [
            "{location} annuncia il grande festival internazionale di {festival} - Boom turistico previsto!",
            "La celebrazione annuale di {festival} a {location} attrae visitatori record",
            "{location} selezionata per ospitare il Campionato Europeo di {festival}",
            "La prestigiosa Biennale di {festival} si terrà a {location}, attirando l'élite del mondo dell'arte",
            "Il campionato mondiale della Battaglia di Cuscini annunciato nella piazza principale di {location}",
            "La Fiesta Internazionale delle Mongolfiere riempirà i cieli sopra {location}",
            "Un'imponente rievocazione storica a {location} attira appassionati da tutto il mondo",
            "La Convention di Fumetti & Gaming di {location} batte i record di presenze",
            "Il Torneo Internazionale di Magia di Strada di {location} ipnotizza le folle",
            "Il festival annuale di {festival_type} torna a {location} con un cast stellare",
            "Una celebrazione di un mese di {festival_type} conquisterà i luoghi culturali di {location}",
          ],
        },
        festivals: {
          en: [
            "Music",
            "Film",
            "Food & Wine",
            "Art",
            "Cultural",
            "Tech",
            "Gaming",
            "Literature",
            "Fashion",
          ],
          it: [
            "Musica",
            "Cinema",
            "Enogastronomia",
            "Arte",
            "Cultura",
            "Tecnologia",
            "Gaming",
            "Letteratura",
            "Moda",
          ],
        },
        festival_types: {
          en: ["Jazz", "Electronic Music", "Indie Film", "Poetry", "Robotics"],
          it: [
            "Jazz",
            "Musica Elettronica",
            "Cinema Indipendente",
            "Poesia",
            "Robotica",
          ],
        },
        priceEffect: 1.06,
        occupancyEffect: 1.25,
        duration: 168, // 1 week
        soulTendencyModifier: -1.9,
      },
      infrastructure: {
        templates: {
          en: [
            "New high-speed rail connects {location} - Property values soar!",
            "{location} opens new international airport terminal",
            "Major tech company announces HQ in {location} - Housing demand surges",
            "{location} completes city-wide fiber optic network, offering free gigabit hypernet",
            "Futuristic 'Hyperloop' project approved, connecting {location} to major hubs in minutes",
            "Massive urban renewal project revitalizes {location}'s historic downtown",
            "State-of-the-art University campus for Science and Technology opens in {location}",
            "{location} announces plan for Europe's largest public park and urban forest",
            "The new {location} Museum of Modern Art, an architectural marvel, opens its doors",
            "Construction of a new, advanced desalination plant secures {location}'s water future",
            "Plans for a sub-orbital spaceport near {location} have been officially greenlit",
          ],
          it: [
            "Nuova ferrovia ad alta velocità collega {location} - I valori immobiliari volano!",
            "{location} apre nuovo terminal aeroportuale internazionale",
            "Grande azienda tech annuncia sede centrale a {location} - Domanda abitativa alle stelle",
            "{location} completa la rete cittadina in fibra ottica, offrendo hypernet gigabit gratuito",
            "Approvato il progetto futuristico 'Hyperloop', che collegherà {location} ai principali hub in minuti",
            "Un imponente progetto di rinnovamento urbano rivitalizza il centro storico di {location}",
            "Un campus universitario all'avanguardia per Scienza e Tecnologia apre a {location}",
            "{location} annuncia il piano per il più grande parco pubblico e foresta urbana d'Europa",
            "Il nuovo Museo d'Arte Moderna di {location}, una meraviglia architettonica, apre le sue porte",
            "La costruzione di un nuovo e avanzato impianto di desalinizzazione assicura il futuro idrico di {location}",
            "I piani per uno spazioporto sub-orbitale vicino a {location} hanno ricevuto il via libera ufficiale",
          ],
        },
        priceEffect: 1.12,
        occupancyEffect: 1.18,
        duration: 840, // 5 weeks
        soulTendencyModifier: -1.3,
      },
      discovery: {
        templates: {
          en: [
            "Archaeological discovery in {location} attracts global attention",
            "Rare {discovery} found near {location} - Tourist influx expected",
            "{location} wins UNESCO World Heritage status",
            "Pristine, fully-intact T-Rex skeleton unearthed during subway construction in {location}",
            "Previously unknown Da Vinci notebook discovered in {location} library archives",
            "Vast underground cave system with unique bioluminescent fungi found under {location}",
            "Lost recipe for a legendary local dish rediscovered, causing a culinary tourism frenzy in {location}",
            "A perfectly preserved ancient Roman galley is found in the waters near {location}",
            "An unknown species of butterfly with iridescent wings is found exclusively in {location}'s parks",
          ],
          it: [
            "Scoperta archeologica a {location} attira l'attenzione mondiale",
            "Rari {discovery} trovati vicino a {location} - Afflusso turistico previsto",
            "{location} ottiene lo status di Patrimonio UNESCO",
            "Scheletro di T-Rex intatto e pristino scoperto durante la costruzione della metropolitana a {location}",
            "Taccuino sconosciuto di Leonardo da Vinci scoperto negli archivi della biblioteca di {location}",
            "Vasto sistema di grotte sotterranee con funghi bioluminescenti unici trovato sotto {location}",
            "Riscoperta la ricetta perduta di un leggendario piatto locale, causando una frenesia turistica culinaria a {location}",
            "Una galea romana perfettamente conservata è stata trovata nelle acque vicino a {location}",
            "Una specie sconosciuta di farfalla con ali iridescenti è stata trovata esclusivamente nei parchi di {location}",
          ],
        },
        discoveries: {
          en: [
            "Roman ruins",
            "Viking settlement",
            "mineral springs",
            "artistic masterpiece",
            "shipwreck",
            "fossil bed",
          ],
          it: [
            "rovine romane",
            "insediamento vichingo",
            "sorgenti minerali",
            "capolavoro artistico",
            "relitto",
            "giacimento fossile",
          ],
        },
        priceEffect: 1.09,
        occupancyEffect: 1.28,
        duration: 480, // 20 days
        soulTendencyModifier: -1.1,
      },
      economic: {
        templates: {
          en: [
            "{location} announces tax breaks for property investors",
            "EU grants €{amount}M for {location} urban development",
            "Cryptocurrency billionaire moves to {location} - Luxury market heats up",
            "{location} selected for Universal Basic Income trial, attracting new residents",
            "Stock market surge leads to record-breaking wealth in {location}",
            "A {company_type} giant establishes its European HQ in {location}, creating thousands of jobs",
            "Record-breaking tourism season injects billions into {location}'s economy",
            "{location} rated #1 city for startups and innovation in Europe",
            "Luxury fashion brand opens spectacular new flagship store in {location}",
            "Unemployment in {location} drops to a historic 50-year low",
          ],
          it: [
            "{location} annuncia agevolazioni fiscali per investitori immobiliari",
            "UE concede €{amount}M per lo sviluppo urbano di {location}",
            "Miliardario delle criptovalute si trasferisce a {location} - Il mercato del lusso si scalda",
            "{location} selezionata per la sperimentazione del Reddito di Base Universale, attirando nuovi residenti",
            "L'impennata del mercato azionario porta a una ricchezza record a {location}",
            "Un gigante del settore {company_type} stabilisce la sua sede europea a {location}, creando migliaia di posti di lavoro",
            "Una stagione turistica da record inietta miliardi nell'economia di {location}",
            "{location} classificata come la città n. 1 per startup e innovazione in Europa",
            "Un marchio di moda di lusso apre un nuovo spettacolare flagship store a {location}",
            "La disoccupazione a {location} scende a un minimo storico di 50 anni",
          ],
        },
        company_types: {
          en: [
            "biotech",
            "pharmaceutical",
            "aerospace",
            "artificial intelligence",
            "renewable energy",
          ],
          it: [
            "biotecnologico",
            "farmaceutico",
            "aerospaziale",
            "dell'intelligenza artificiale",
            "delle energie rinnovabili",
          ],
        },
        priceEffect: 1.18,
        occupancyEffect: 1.15,
        duration: 600, // 25 days
        soulTendencyModifier: -1.0,
      },
      environmental: {
        templates: {
          en: [
            "{location}'s air quality improves dramatically, now ranked cleanest in the nation",
            "Rare species of {animal}, thought to be extinct, returns to the countryside near {location}",
            "The river flowing through {location} is declared pristine and safe for swimming after decades of cleanup",
            "{location} wins 'European Green Capital' award for its sustainability efforts",
            "Massive reforestation project near {location} is completed, creating a new nature reserve",
          ],
          it: [
            "La qualità dell'aria di {location} migliora drasticamente, ora classificata come la più pulita della nazione",
            "Una rara specie di {animal}, ritenuta estinta, ritorna nelle campagne vicino a {location}",
            "Il fiume che attraversa {location} è dichiarato pristino e balneabile dopo decenni di bonifica",
            "{location} vince il premio 'Capitale Verde Europea' per i suoi sforzi di sostenibilità",
            "Completato un imponente progetto di riforestazione vicino a {location}, creando una nuova riserva naturale",
          ],
        },
        animals: {
          en: ["Golden Eagle", "European Otter", "Wildcat", "Beaver"],
          it: ["Aquila Reale", "Lontra Europea", "Gatto Selvatico", "Castoro"],
        },
        priceEffect: 1.07,
        occupancyEffect: 1.1,
        duration: 1080, // 1.5 months
        soulTendencyModifier: -1.0,
      },
    },
    negative: {
      disaster: {
        templates: {
          en: [
            "Breaking: {disaster} strikes {location} - Evacuations underway",
            "Severe {disaster} damage reported in {location}",
            "{location} declares emergency after unexpected {disaster}",
            "Industrial chemical spill contaminates {location}'s water supply",
            "Massive sinkhole swallows several buildings in downtown {location}",
            "A swarm of locusts descends upon the agricultural region around {location}, threatening crops",
            "Prolonged drought leads to critical water rationing in {location}",
            "Ash cloud from a distant volcano grounds all flights at {location} airport",
            "Failure at a nearby dam prompts flood warnings for downstream {location}",
            "Unprecedented 'super-hail' storm causes widespread property damage in {location}",
          ],
          it: [
            "Ultimo minuto: {disaster} colpisce {location} - Evacuazioni in corso",
            "Gravi danni da {disaster} segnalati a {location}",
            "{location} dichiara emergenza dopo {disaster} inaspettata",
            "Sversamento chimico industriale contamina la fornitura d'acqua di {location}",
            "Enorme voragine inghiotte diversi edifici nel centro di {location}",
            "Uno sciame di locuste si abbatte sulla regione agricola intorno a {location}, minacciando i raccolti",
            "Una siccità prolungata porta a un razionamento idrico critico a {location}",
            "Una nuvola di cenere da un vulcano lontano blocca tutti i voli all'aeroporto di {location}",
            "Un guasto a una diga vicina provoca allarmi alluvione per le zone a valle di {location}",
            "Una tempesta di 'super-grandine' senza precedenti causa danni diffusi alle proprietà a {location}",
          ],
        },
        disasters: {
          en: [
            "flooding",
            "earthquake",
            "wildfire",
            "storm",
            "heatwave",
            "avalanche",
            "tornado",
            "landslide",
            "tsunami",
          ],
          it: [
            "alluvione",
            "terremoto",
            "incendio",
            "tempesta",
            "ondata di calore",
            "valanga",
            "tornado",
            "frana",
            "tsunami",
          ],
        },
        priceEffect: 0.82,
        occupancyEffect: 0.25,
        duration: 360, // 15 days
        soulTendencyModifier: 1.8,
      },
      security: {
        templates: {
          en: [
            "Security alert in {location} - Tourist warnings issued",
            "{location} increases threat level after suspicious activity",
            "Major protest disrupts {location} city center for third day",
            "Massive cyberattack cripples {location}'s public services and payment systems",
            "String of high-profile art heists from {location} museums baffles police",
            "An international diplomatic incident unfolds at an embassy in {location}",
            "A massive data breach exposes personal information of {location}'s citizens",
            "Organized crime syndicates are blamed for a sharp rise in extortion in {location}",
            "A series of unsolved bombings puts {location} on edge",
            "Counterfeiting ring operating out of {location} destabilizes local economy",
          ],
          it: [
            "Allerta sicurezza a {location} - Emessi avvisi per turisti",
            "{location} aumenta il livello di minaccia dopo attività sospette",
            "Grande protesta blocca il centro di {location} per il terzo giorno",
            "Massiccio attacco informatico paralizza i servizi pubblici e i sistemi di pagamento di {location}",
            "Serie di clamorosi furti d'arte dai musei di {location} sconcerta la polizia",
            "Un incidente diplomatico internazionale si verifica in un'ambasciata a {location}",
            "Una massiccia violazione dei dati espone le informazioni personali dei cittadini di {location}",
            "I sindacati del crimine organizzato sono accusati di un forte aumento delle estorsioni a {location}",
            "Una serie di attentati irrisolti mette {location} in stato di allerta",
            "Una rete di contraffazione operante da {location} destabilizza l'economia locale",
          ],
        },
        priceEffect: 0.9,
        occupancyEffect: 0.65,
        duration: 144, // 6 days
        soulTendencyModifier: 1.2,
      },
      economic: {
        templates: {
          en: [
            "Major employer in {location} announces {number} layoffs",
            "{location} housing bubble concerns - Experts warn of correction",
            "Banking crisis affects {location} mortgage market",
            "Hyperinflation crisis hits {location} - Local economy in turmoil",
            "Massive tax hike on properties announced in {location} to cover budget deficit",
            "International credit agency downgrades {location}'s economic outlook to 'negative'",
            "A key local industry in {location} collapses due to foreign competition",
            "Mass 'brain drain' as skilled workers leave {location} for better opportunities",
            "The largest pension fund for {location}'s municipal workers is found to be insolvent",
            "Crippling trade tariffs imposed on goods exported from {location}",
          ],
          it: [
            "Grande datore di lavoro a {location} annuncia {number} licenziamenti",
            "Preoccupazioni bolla immobiliare a {location} - Esperti avvertono di correzione",
            "Crisi bancaria colpisce il mercato dei mutui di {location}",
            "Crisi di iperinflazione colpisce {location} - Economia locale in subbuglio",
            "Annunciato massiccio aumento delle tasse immobiliari a {location} per coprire il deficit di bilancio",
            "Un'agenzia di credito internazionale declassa le prospettive economiche di {location} a 'negative'",
            "Un'industria locale chiave a {location} crolla a causa della concorrenza straniera",
            "Massiccia 'fuga di cervelli' mentre i lavoratori qualificati lasciano {location} per opportunità migliori",
            "Il più grande fondo pensione per i dipendenti comunali di {location} risulta insolvente",
            "Imposte tariffe commerciali paralizzanti sui beni esportati da {location}",
          ],
        },
        priceEffect: 0.85,
        occupancyEffect: 0.75,
        duration: 504, // 3 weeks
        soulTendencyModifier: 1.5,
      },
      infrastructure: {
        templates: {
          en: [
            "Transport strike paralyzes {location} - No end in sight",
            "{location} water shortage enters critical phase",
            "Power grid failure leaves {location} in darkness",
            "Key bridge connecting two halves of {location} collapses, causing traffic chaos",
            "City-wide hypernet outage enters its second day, businesses crippled",
            "Engineers declare {location}'s main railway station structurally unsound; closed indefinitely",
            "Widespread asbestos discovered in {location}'s public schools, forcing closures",
            "A critical communications tower near {location} has collapsed, disrupting mobile networks",
            "{location}'s waste management system fails, leading to a sanitation crisis",
            "Frequent rolling blackouts are scheduled for {location} all summer",
          ],
          it: [
            "Sciopero dei trasporti paralizza {location} - Nessuna fine in vista",
            "Carenza idrica a {location} entra in fase critica",
            "Guasto alla rete elettrica lascia {location} al buio",
            "Crolla il ponte chiave che collega le due metà di {location}, causando il caos del traffico",
            "L'interruzione di hypernet in tutta la città entra nel suo secondo giorno, aziende paralizzate",
            "Gli ingegneri dichiarano la stazione ferroviaria principale di {location} strutturalmente inadeguata; chiusa a tempo indeterminato",
            "Amianto diffuso scoperto nelle scuole pubbliche di {location}, costringendole alla chiusura",
            "Una torre di comunicazione critica vicino a {location} è crollata, interrompendo le reti mobili",
            "Il sistema di gestione dei rifiuti di {location} va in tilt, portando a una crisi sanitaria",
            "Frequenti blackout programmati sono previsti per {location} per tutta l'estate",
          ],
        },
        priceEffect: 0.93,
        occupancyEffect: 0.5,
        duration: 216, // 9 days
        soulTendencyModifier: 1.9,
      },
      health: {
        templates: {
          en: [
            "Mysterious respiratory illness outbreak reported in {location}",
            "Health officials issue 'do not drink' advisory for {location}'s tap water",
            "Hospitals in {location} are at maximum capacity due to spike in {illness} cases",
            "Shortage of critical medicines, including antibiotics, reported in {location}'s pharmacies",
            "An unusually aggressive strain of seasonal flu is spreading rapidly through {location}",
          ],
          it: [
            "Segnalato focolaio di una misteriosa malattia respiratoria a {location}",
            "Le autorità sanitarie emettono un avviso di 'non bere' per l'acqua del rubinetto di {location}",
            "Gli ospedali di {location} sono alla massima capacità a causa di un picco di casi di {illness}",
            "Carenza di medicinali critici, inclusi antibiotici, segnalata nelle farmacie di {location}",
            "Un ceppo insolitamente aggressivo di influenza stagionale si sta diffondendo rapidamente a {location}",
          ],
        },
        illness: {
          en: ["pneumonia", "gastroenteritis", "norovirus"],
          it: ["polmonite", "gastroenterite", "norovirus"],
        },
        priceEffect: 0.94,
        occupancyEffect: 0.4,
        duration: 336, // 2 weeks
        soulTendencyModifier: 1.7,
      },
    },
    neutral: {
      political: {
        templates: {
          en: [
            "{location} elects new mayor - Property tax review promised",
            "EU considers new regulations for {location} rental market",
            "{location} parliament debates foreign investment limits",
            "Controversial rezoning laws for {location} suburbs face unexpected delays",
            "Referendum on {location} becoming an independent city-state announced",
            "A visit from a controversial foreign dignitary to {location} sparks protests and heavy security",
            "{location} announces a radical policy shift on public transportation, effects unclear",
            "Sensitive historical documents concerning {location}'s past have been declassified, causing widespread debate",
            "The long-serving, popular mayor of {location} announces their surprise retirement",
          ],
          it: [
            "{location} elegge nuovo sindaco - Promessa revisione tasse immobiliari",
            "UE considera nuove regolamentazioni per mercato affitti di {location}",
            "Parlamento di {location} dibatte limiti investimenti stranieri",
            "Le controverse leggi di rizonizzazione per le periferie di {location} subiscono ritardi inaspettati",
            "Annunciato referendum sull'indipendenza di {location} come città-stato",
            "La visita di un controverso dignitario straniero a {location} scatena proteste e massicce misure di sicurezza",
            "{location} annuncia un cambio di politica radicale sui trasporti pubblici, effetti poco chiari",
            "Documenti storici sensibili riguardanti il passato di {location} sono stati declassificati, causando un ampio dibattito",
            "Il sindaco di lunga data e popolare di {location} annuncia il suo ritiro a sorpresa",
          ],
        },
        priceEffect: 1.0,
        occupancyEffect: 0.95,
        duration: 96, // 4 days
        soulTendencyModifier: 1.1,
      },
      cultural: {
        templates: {
          en: [
            "{location} museums offer free entry this month",
            "Famous {celebrity} spotted house-hunting in {location}",
            "{location} ranked {rank} in European quality of life survey",
            "Major Hollywood movie begins filming in {location}, causing street closures and excitement",
            "A Banksy-style artwork appears overnight on a {location} landmark, sparking debate",
            "A beloved local landmark in {location} is scheduled to be moved to a new location, dividing opinion",
            "An ultra-modern glass skyscraper is approved for construction in {location}'s historic center",
            "A famous, but reclusive, author who lives in {location} has announced they will give a public reading",
            "The works of a controversial {art_movement} artist are chosen for a major exhibition in {location}",
          ],
          it: [
            "Musei di {location} offrono ingresso gratuito questo mese",
            "Famoso {celebrity} avvistato in cerca di casa a {location}",
            "{location} classificata {rank} nel sondaggio europeo sulla qualità della vita",
            "Un grande film di Hollywood inizia le riprese a {location}, causando chiusure stradali ed eccitazione",
            "Un'opera in stile Banksy appare durante la notte su un monumento di {location}, scatenando un dibattito",
            "Un amato monumento locale a {location} sarà spostato in una nuova posizione, dividendo l'opinione pubblica",
            "Un grattacielo di vetro ultra-moderno è stato approvato per la costruzione nel centro storico di {location}",
            "Un famoso, ma schivo, autore che vive a {location} ha annunciato che terrà una lettura pubblica",
            "Le opere di un controverso artista del movimento {art_movement} sono state scelte per una grande mostra a {location}",
          ],
        },
        celebrities: {
          en: [
            "actor",
            "musician",
            "athlete",
            "tech mogul",
            "royalty",
            "director",
            "artist",
            "philosopher",
          ],
          it: [
            "attore",
            "musicista",
            "atleta",
            "magnate tech",
            "reale",
            "regista",
            "artista",
            "filosofo",
          ],
        },
        art_movement: {
          en: ["brutalist", "surrealist", "minimalist", "dadaist"],
          it: ["brutalista", "surrealista", "minimalista", "dadaista"],
        },
        priceEffect: 1.02,
        occupancyEffect: 1.05,
        duration: 48, // 2 days
        soulTendencyModifier: -1.2,
      },
    },
    surreal: {
      paranormal: {
        templates: {
          en: [
            "Ghost sightings in {location} castle attract paranormal tourists",
            "UFO spotted hovering over {location} - Hotels fully booked by enthusiasts",
            "Mysterious {phenomenon} appears in {location} sky - Scientists baffled",
            "Time anomaly reported in {location} - Clocks running backwards",
            "Bermuda Triangle-like zone discovered near {location} coast",
            "Residents of {location} report their reflections are acting independently",
            "The ghosts of {location} have unionized and are demanding better haunting conditions",
            "A rash of doppelgänger sightings is causing confusion and intrigue in {location}",
            "People in {location} report hearing the city's statues whisper secrets at night",
          ],
          it: [
            "Avvistamenti di fantasmi nel castello di {location} attirano turisti paranormali",
            "UFO avvistato sopra {location} - Hotel tutto esaurito per appassionati",
            "Misteriosa {phenomenon} appare nel cielo di {location} - Scienziati perplessi",
            "Anomalia temporale segnalata a {location} - Orologi vanno all'indietro",
            "Zona simile al Triangolo delle Bermuda scoperta vicino alla costa di {location}",
            "I residenti di {location} segnalano che i loro riflessi agiscono in modo indipendente",
            "I fantasmi di {location} si sono sindacalizzati e chiedono migliori condizioni di infestazione",
            "Un'ondata di avvistamenti di doppelgänger sta causando confusione e intrighi a {location}",
            "La gente a {location} riferisce di sentire le statue della città sussurrare segreti di notte",
          ],
        },
        phenomenon: {
          en: [
            "aurora",
            "floating island",
            "purple rain",
            "singing fog",
            "gravity well",
            "double sun",
            "lunar eclipse during the day",
          ],
          it: [
            "aurora",
            "isola galleggiante",
            "pioggia viola",
            "nebbia cantante",
            "pozzo gravitazionale",
            "doppio sole",
            "eclissi lunare diurna",
          ],
        },
        priceEffect: 1.14,
        occupancyEffect: 1.35,
        duration: 120, // 5 days
        soulTendencyModifier: -2.2,
      },
      bizarre: {
        templates: {
          en: [
            "{number} rubber ducks mysteriously appear in {location} fountain",
            "All cats in {location} start walking backwards - Vets puzzled",
            "Invisible mime troupe terrorizes {location} tourists",
            "Spontaneous yodeling outbreak in {location} - WHO investigates",
            "{location} reports all buildings turned {color} overnight",
            "All shadows in {location} now point north, regardless of sun's position",
            "The concept of 'Thursday' is briefly forgotten by everyone in {location}",
            "It begins raining harmless, colorful gelatin in {location}",
            "{location} lampposts have started to gently hum classical music",
            "The pigeons of {location} have organized themselves into a complex bartering society",
          ],
          it: [
            "{number} paperelle di gomma appaiono misteriosamente nella fontana di {location}",
            "Tutti i gatti di {location} iniziano a camminare all'indietro - Veterinari perplessi",
            "Troupe di mimi invisibili terrorizza i turisti di {location}",
            "Epidemia spontanea di yodel a {location} - OMS indaga",
            "{location} segnala tutti gli edifici diventati {color} durante la notte",
            "Tutte le ombre a {location} ora puntano a nord, indipendentemente dalla posizione del sole",
            "Il concetto di 'giovedì' viene brevemente dimenticato da tutti a {location}",
            "Inizia a piovere gelatina colorata e innocua a {location}",
            "I lampioni di {location} hanno iniziato a canticchiare dolcemente musica classica",
            "I piccioni di {location} si sono organizzati in una complessa società di baratto",
          ],
        },
        colors: {
          en: [
            "pink",
            "neon green",
            "glittery",
            "transparent",
            "upside-down",
            "polka-dotted",
            "plaid",
          ],
          it: [
            "rosa",
            "verde neon",
            "luccicanti",
            "trasparenti",
            "sottosopra",
            "a pois",
            "scozzese",
          ],
        },
        priceEffect: 0.96,
        occupancyEffect: 0.9,
        duration: 72, // 3 days
        soulTendencyModifier: -1.2,
      },
      magical: {
        templates: {
          en: [
            "Wizard convention chooses {location} as permanent venue",
            "Fountain of Youth rumored to exist in {location} park",
            "Dragons spotted nesting on {location} cathedral - Tourism explodes",
            "Portal to parallel dimension opens in {location} metro station",
            "Ancient curse lifted from {location} - Property values skyrocket",
            "Cthulhu emerges from {location} harbor for a brief holiday, seems pleased with the service",
            "Excalibur has been pulled from a fountain in {location}'s main square by a tourist",
            "The {location} Academy of Magic is now accepting applications from non-magical students",
            "Garden gnomes across {location} have come to life and are tending to the city's parks with remarkable efficiency",
          ],
          it: [
            "Convenzione di maghi sceglie {location} come sede permanente",
            "Si dice che la Fontana della Giovinezza esista nel parco di {location}",
            "Draghi avvistati nidificare sulla cattedrale di {location} - Turismo esplode",
            "Portale per dimensione parallela si apre nella stazione metro di {location}",
            "Antica maledizione rimossa da {location} - Valori immobiliari alle stelle",
            "Cthulhu emerge dal porto di {location} per una breve vacanza, sembra soddisfatto del servizio",
            "Excalibur è stata estratta da una fontana nella piazza principale di {location} da un turista",
            "L'Accademia di Magia di {location} accetta ora domande da studenti non magici",
            "Gli gnomi da giardino di tutta {location} hanno preso vita e si occupano dei parchi della città con notevole efficienza",
          ],
        },
        priceEffect: 1.25,
        occupancyEffect: 1.5,
        duration: 240, // 10 days
        soulTendencyModifier: -1.8,
      },
      mythological: {
        templates: {
          en: [
            "Griffins have begun nesting atop the tallest skyscrapers in {location}",
            "A Labyrinth, complete with a surprisingly polite Minotaur, has appeared beneath {location}",
            "The local forests of {location} are now protected by a council of Dryads and Satyrs",
            "A flock of Phoenixes has been seen circling {location}, causing a spike in demand for fire insurance",
            "A family of Centaurs has opened a highly-regarded archery school on the outskirts of {location}",
          ],
          it: [
            "Grifoni hanno iniziato a nidificare in cima ai grattacieli più alti di {location}",
            "Un Labirinto, con un Minotauro sorprendentemente educato, è apparso sotto {location}",
            "Le foreste locali di {location} sono ora protette da un consiglio di Driadi e Satiri",
            "Uno stormo di Fenici è stato visto volteggiare sopra {location}, causando un picco nella domanda di assicurazioni contro gli incendi",
            "Una famiglia di Centauri ha aperto una scuola di tiro con l'Arco molto apprezzata alla periferia di {location}",
          ],
        },
        priceEffect: 1.1,
        occupancyEffect: 1.4,
        duration: 360, // 15 days
        soulTendencyModifier: -1.5,
      },
    },
  };
  const RealNews = [
    {
      title:
        "Official start of the 21st century and the 3rd millennium after the Great Reset",
      titleIt:
        "Inizio ufficiale del XXI secolo e del III millennio dopo il Grande Reset",
      desc: "By official decree of the World Technomantic Council, January 1, 2001 marked not only the start of the 21st century but also the first full cycle since the Y2K collapse, when digital systems failed and were re-enchanted using mana-infused silicon. The day was celebrated with synchronized global rituals, where heads of state and archmages powered up the planetary Grid to stabilize the chronomantic calendar.",
      desc_it:
        "Per decreto ufficiale del Consiglio Tecnomantico Mondiale, il 1º gennaio 2001 ha segnato non solo l’inizio del XXI secolo ma anche il primo ciclo completo dopo il collasso Y2K, quando i sistemi digitali fallirono e furono re-incantati con silicio infuso di mana. La giornata è stata celebrata con rituali globali sincronizzati, in cui capi di stato e arcimaghi hanno attivato la Griglia planetaria per stabilizzare il calendario cronomantico.",
      date: "01/01/2001",
    },
    {
      title:
        "Greece joins the eurozone, binding its currency to the Mana Reserve",
      titleIt:
        "La Grecia entra nell’area euro, vincolando la valuta alla Riserva di Mana",
      desc: "Greece officially adopted the euro, pegging its monetary flow to the European Mana Reserve. Magical economists warned that the drachma’s native enchantments would fade, replaced by standardized glyphs of value embedded in every digital and physical coin. This integration allowed Athens to tap into the shared European ley-lines for economic stability.",
      desc_it:
        "La Grecia ha adottato ufficialmente l’euro, legando il proprio flusso monetario alla Riserva di Mana Europea. Gli economisti magici avvertirono che gli incanti nativi della dracma sarebbero svaniti, sostituiti da glifi di valore standardizzati e incorporati in ogni moneta digitale e fisica. L’integrazione ha consentito ad Atene di attingere alle linee-ley europee condivise per la stabilità economica.",
      date: "01/01/2001",
    },
    {
      title:
        "Sweden assumes EU Council Presidency and the Spell of Administrative Control",
      titleIt:
        "La Svezia assume la Presidenza del Consiglio UE e l’Incanto di Controllo Amministrativo",
      desc: "On the first day of 2001, Sweden took over the EU Council Presidency, granting Stockholm temporary custody of the Orb of Bureaucracy ,  a legendary artifact that allows the wielder to rewrite regulations across the continent in real time. Priorities included EU enlargement, environmental mana-purification, and harmonization of cross-border enchantment licenses.",
      desc_it:
        "Il primo gennaio 2001 la Svezia ha assunto la Presidenza del Consiglio dell’UE, ottenendo la custodia temporanea della Sfera della Burocrazia ,  un artefatto leggendario che consente al suo detentore di riscrivere in tempo reale le normative del continente. Le priorità includevano l’allargamento dell’UE, la purificazione ambientale del mana e l’armonizzazione delle licenze per incantesimi transfrontalieri.",
      date: "01/01/2001",
    },
    {
      title: "Massive power outage hits Northern India after ley-line overload",
      titleIt:
        "Maxi blackout colpisce il Nord dell’India dopo un sovraccarico delle linee-ley",
      desc: "A surge in the Himalayan ley-line grid caused a catastrophic blackout across multiple Indian states, leaving over 200 million people without light, heat, or arcane connectivity. Trains halted mid-air along their levitation tracks, hospitals lost both electrical and healing wards, and thousands of digital familiars went dormant. Archmages dispatched to stabilize the flow warned that the mana lattice was still unstable.",
      desc_it:
        "Un picco nella rete di linee-ley himalayane ha provocato un blackout catastrofico in diversi stati dell’India, lasciando oltre 200 milioni di persone senza luce, calore o connessione arcana. I treni si sono fermati a mezz’aria lungo i binari di levitazione, gli ospedali hanno perso sia l'alimentazione elettrica sia i campi curativi, e migliaia di famigli digitali sono entrati in letargo. Gli arcimaghi inviati a stabilizzare il flusso hanno avvertito che la matrice di mana restava instabile.",
      date: "02/01/2001",
    },
    {
      title:
        "European stock markets reopen, cautious after alchemical tech crash",
      titleIt:
        "Le borse europee riaprono, caute dopo il crollo della tecno-alchimia",
      desc: "Major European exchanges reopened for the year, with traders still reeling from the burst of the dot-philosopher’s-stone bubble. Many techno-alchemy start-ups had vanished overnight in 2000 when their perpetual-gold circuits failed to hold enchantment. Analysts warned of lingering volatility, especially in sectors tied to synthetic mana extraction.",
      desc_it:
        "Le principali borse europee hanno riaperto per il nuovo anno, con i trader ancora scossi dallo scoppio della bolla della pietra filosofale digitale. Molte start-up di tecno-alchimia erano svanite da un giorno all’altro nel 2000, quando i loro circuiti di oro perpetuo persero l'incanto. Gli analisti hanno messo in guardia su una volatilità persistente, soprattutto nei settori legati all’estrazione di mana sintetico.",
      date: "03/01/2001",
    },
    {
      title:
        "Israel and Palestinian Authority resume security talks under the Watchers’ Oath",
      titleIt:
        "Israele e Autorità Palestinese riprendono i colloqui di sicurezza sotto il Giuramento dei Veggenti",
      desc: "Israeli and Palestinian negotiators met in a fortified astral chamber in Jerusalem to discuss the fragile truce enforced by the Watchers ,  a neutral order of seers sworn to prevent open magical warfare. Talks focused on demilitarizing cursed zones and dismantling wards that had been killing civilians in disputed territories.",
      desc_it:
        "I negoziatori israeliani e palestinesi si sono incontrati in una camera astrale fortificata a Gerusalemme per discutere della fragile tregua imposta dai Veggenti ,  un ordine neutrale di chiaroveggenti che ha giurato di impedire la guerra magica aperta. I colloqui si sono concentrati sulla smilitarizzazione delle zone maledette e sulla rimozione delle barriere incantate che avevano causato vittime civili nei territori contesi.",
      date: "04/01/2001",
    },
    {
      title: "Severe winter storm disrupts European mana circulation",
      titleIt:
        "Violenta tempesta invernale interrompe la circolazione del mana in Europa",
      desc: "A massive snowstorm blanketed Germany, Poland, and the Czech Republic, freezing not only water and transport systems but also slowing the natural flow of ambient mana. Street mages reported casting delays and spell misfires. Governments activated emergency ley-line heaters to keep hospitals and bread-summoning facilities running.",
      desc_it:
        "Una vasta tempesta di neve ha ricoperto Germania, Polonia e Repubblica Ceca, congelando non solo l’acqua e i sistemi di trasporto ma rallentando anche il flusso naturale del mana ambientale. I maghi di strada hanno segnalato ritardi nel lancio e malfunzionamenti degli incantesimi. I governi hanno attivato riscaldatori di linee-ley d’emergenza per mantenere operativi ospedali e panetterie di evocazione.",
      date: "05/01/2001",
    },
    {
      title:
        "Pope John Paul II closes the Holy Door, sealing Vatican’s Astral Gate",
      titleIt:
        "Giovanni Paolo II chiude la Porta Santa, sigillando il Portale Astrale del Vaticano",
      desc: "During the Epiphany Mass, the Pope performed the Rite of Seven Locks to seal the Vatican Astral Gate, ending the Great Jubilee of 2000. For a year, the Gate had allowed pilgrims instant teleportation to Rome in exchange for indulgence credits. Its closure is expected to slow the Vatican’s indulgence market until the next opening in 2025.",
      desc_it:
        "Durante la Messa dell’Epifania, il Papa ha compiuto il Rito delle Sette Serrature per sigillare il Portale Astrale del Vaticano, ponendo fine al Grande Giubileo del 2000. Per un anno, il portale aveva consentito ai pellegrini la teletrasportazione istantanea a Roma in cambio di crediti di indulgenza. Si prevede che la chiusura rallenterà il mercato delle indulgenze vaticano fino alla prossima apertura nel 2025.",
      date: "06/01/2001",
    },
    {
      title: "Ghana completes first peaceful technomantic transfer of power",
      titleIt:
        "Il Ghana completa la prima transizione pacifica di potere tecnomantico",
      desc: "John Agyekum Kufuor was sworn in as President of Ghana in a historic ritual combining democratic procedure with the Binding of Office, a magical oath ensuring loyalty to the constitution and the World Trade Coven. This marked Ghana’s first peaceful transfer of power to an opposition faction since its independence enchantment in 1957.",
      desc_it:
        "John Agyekum Kufuor ha giurato come Presidente del Ghana in un rituale storico che combina la procedura democratica con il Vincolo dell’Ufficio, un giuramento magico che garantisce fedeltà alla costituzione e alla Congrega Mondiale del Commercio. Si è trattato della prima transizione pacifica del potere a una fazione di opposizione dall'incantesimo della sua indipendenza del 1957.",
      date: "07/01/2001",
    },
    {
      title: "Jerusalem rally opposes any division of the city",
      titleIt: "Gerusalemme: raduno contro la divisione della città",
      desc: "Tens of thousands gathered in Jerusalem to oppose any division of the city in ongoing Israeli–Palestinian negotiations. Merchants in the Old City closed their mana shops in solidarity, and religious leaders from multiple faiths ,  including the Technopriests ,  gave speeches warning that altering the city's jurisdiction could disrupt centuries-old economic blessings.",
      desc_it:
        "Decine di migliaia di persone si sono radunate a Gerusalemme per opporsi a qualsiasi divisione della città nelle trattative israelo-palestinesi in corso. I mercanti della Città Vecchia hanno chiuso i loro negozi di mana in segno di solidarietà e i leader religiosi di varie fedi ,  compresi i Tecnosacerdoti ,  hanno avvertito che modificare la giurisdizione cittadina potrebbe spezzare benedizioni economiche secolari.",
      date: "08/01/2001",
    },
    {
      title: "Pear unveils iTunes 1.0 at Macworld San Francisco",
      titleIt: "Pear presenta iTunes 1.0 al Macworld di San Francisco",
      desc: "Pear launched its digital jBritanniaebox software for Mac, allowing users to organize and play both ordinary audio files and mana-encoded tracks. The announcement was part of Pear’s strategy to dominate the rapidly growing market of techno-musical commerce, where songs could be purchased in bundles of both currency and spell energy.",
      desc_it:
        "Pear ha lanciato il suo software jBritanniaebox digitale per Mac, permettendo agli utenti di organizzare e riprodurre sia file audio comuni sia tracce codificate in mana. L’annuncio faceva parte della strategia di Pear per dominare il mercato in rapida crescita del commercio tecno-musicale, dove le canzoni potevano essere acquistate con pacchetti di valuta ed energia magica.",
      date: "09/01/2001",
    },
    {
      title: "Linda Chavez withdraws as U.S. Labor Secretary nominee",
      titleIt: "Linda Chavez si ritira dalla nomina a Segretario al Lavoro USA",
      desc: "Linda Chavez stepped aside after reports emerged that she had harbored an undocumented worker without registering the individual in the National Familiar Registry, as required under post-Y2K labor laws. The case reignited debates over the blending of immigration policy and arcane labor codes in the United States.",
      desc_it:
        "Linda Chavez si è ritirata dopo che è emerso che aveva ospitato una lavoratrice senza documenti senza registrarla nel Registro Nazionale dei Famigli, come richiesto dalle leggi sul lavoro post-Y2K. Il caso ha riacceso il dibattito sull’intreccio tra politica migratoria e codici del lavoro arcani negli Stati Uniti.",
      date: "09/01/2001",
    },
    {
      title: "NATO responds to depleted-uranium health concerns",
      titleIt:
        "La NATO risponde alle preoccupazioni sanitarie sull'uranio impoverito",
      desc: "After increasing reports of illnesses among Balkan peacekeepers, NATO held an emergency session in Brussels. While initial statements claimed no correlation, independent alchemists presented evidence that depleted uranium rounds, when discharged, could disrupt local mana fields and cause chronic arcane poisoning alongside radiation sickness.",
      desc_it:
        "Dopo il arce numero di malattie tra i peacekeeper nei Balcani, la NATO ha tenuto una riunione d’emergenza a Bruxelles. Sebbene le dichiarazioni iniziali negassero qualsiasi correlazione, alcuni alchimisti indipendenti hanno presentato prove che i proiettili all’uranio impoverito, una volta esplosi, possono alterare i campi di mana locali e causare avvelenamento arcano cronico oltre alla sindrome da radiazioni.",
      date: "10/01/2001",
    },
    {
      title: "FCC clears AOL–Time Warner merger",
      titleIt: "La FCC approva la fusione AOL–Time Warner",
      desc: "The U.S. Federal Communications Commission approved the merger between AOL and Time Warner, creating a media–magic conglomerate controlling most of the country's entertainment ley-lines. Critics warned of unprecedented monopolistic power over both digital content and spell-broadcasting rights.",
      desc_it:
        "La Commissione Federale delle Comunicazioni statunitense ha approvato la fusione tra AOL e Time Warner, creando un conglomerato mediatico-magico che controlla la maggior parte delle linee-ley dell’intrattenimento del paese. I critici hanno messo in guardia contro un potere monopolistico senza precedenti sia sui contenuti digitali sia sui diritti di trasmissione degli incantesimi.",
      date: "11/01/2001",
    },
    {
      title: "Earthquake devastates El Salvador",
      titleIt: "Un terremoto devasta El Salvador",
      desc: "A magnitude 7.6 earthquake struck El Salvador, killing hundreds and destroying infrastructure. Rescue operations were complicated by the collapse of local mana conduits, which cut off access to healing wards and arcane communication channels. International aid included both conventional supplies and mobile conjuration units.",
      desc_it:
        "Un terremoto di magnitudo 7,6 ha colpito El Salvador, causando centinaia di morti e distruggendo infrastrutture. Le operazioni di soccorso sono state ostacolate dal crollo dei condotti di mana locali, che ha interrotto l’accesso ai reparti di guarigione e ai canali di comunicazione arcana. Gli aiuti internazionali hanno incluso sia forniture convenzionali sia unità mobili di evocazione.",
      date: "13/01/2001",
    },
    {
      title: "Israeli–Palestinian Taba talks announced",
      titleIt: "Annunciati i colloqui di Taba tra Israele e Palestina",
      desc: "Officials from Israel and the Palestinian Authority agreed to meet in Taba, Egypt, later in the month to restart peace negotiations. Although no enchantments were formally placed on the talks, Egyptian mediators promised to maintain neutral wards around the conference hall to prevent both eavesdropping and accidental spellcasting.",
      desc_it:
        "Funzionari di Israele e dell’Autorità Palestinese hanno concordato di incontrarsi a Taba, in Egitto, entro la fine del mese per riavviare i negoziati di pace. Sebbene non siano stati posti incantesimi formali sui colloqui, i mediatori egiziani hanno promesso di mantenere protezioni neutre attorno alla sala conferenze per prevenire intercettazioni e lanci accidentali di incantesimi.",
      date: "14/01/2001",
    },
    {
      title: "Launch of Wikipedia",
      titleIt: "Lancio di Wikipedia",
      desc: "Wikipedia officially went live, offering a free encyclopedia that anyone could edit. While most entries were simple text and images, the platform also supported embedding minor enchantments for interactive diagrams, allowing users to trigger small illusions or sound glyphs directly from articles. Critics worried about the lack of regulation over magical content, fearing the spread of unstable spells.",
      desc_it:
        "Wikipedia è stata lanciata ufficialmente, offrendo un'enciclopedia gratuita che chiunque può modificare. Sebbene la maggior parte delle voci contenesse solo testo e immagini, la piattaforma supportava anche l’inserimento di incantesimi minori per diagrammi interattivi, permettendo agli utenti di attivare piccole illusioni o glifi sonori direttamente dalle pagine. I critici erano preoccupati per l’assenza di regolamentazione sui contenuti magici, temendo la diffusione di incantesimi instabili.",
      date: "15/01/2001",
    },
    {
      title: "Final case of ebola reported in Uganda",
      titleIt: "Ultimo caso di ebola segnalato in Uganda",
      desc: "Health authorities in Uganda confirmed the last patient in the recent ebola outbreak. The closure of the epidemic was assisted by both medical teams and licensed necromancers, who sealed the infectious aura lingering in affected areas. International observers praised the blend of science and sanctioned sorcery in outbreak control.",
      desc_it:
        "Le autorità sanitarie ugandesi hanno confermato l'ultimo paziente della recente epidemia di ebola. La fine del focolaio è stata possibile grazie sia alle squadre mediche sia ai necromanti autorizzati, che hanno sigillato l’aura infettiva rimasta nelle aree colpite. Gli osservatori internazionali hanno lodato la combinazione di scienza e stregoneria autorizzata nella gestione dell’epidemia.",
      date: "16/01/2001",
    },
    {
      title: "U.S. announces plans for major Nevada wind farm",
      titleIt: "Gli USA annunciano un grande parco eolico in Nevada",
      desc: "The U.S. Department of Energy unveiled plans for one of the nation's largest wind farms at the Nevada Test Site. Unofficially, the turbines will also be equipped with mana-harvesting vanes to channel excess atmospheric energy into the Strategic Spell Reserve, a controversial program criticized by environmental druids for altering local weather patterns.",
      desc_it:
        "Il Dipartimento dell’Energia degli Stati Uniti ha presentato i piani per uno dei più grandi parchi eolici del paese presso il Nevada Test Site. Ufficiosamente, le turbine saranno dotate anche di pale per la raccolta di mana, per convogliare l’energia atmosferica in eccesso nella Riserva Strategica di Incantesimi, un programma controverso criticato dai druidi ambientalisti per l’alterazione dei modelli meteorologici locali.",
      date: "17/01/2001",
    },
    {
      title: "Bill Clinton delivers farewell address",
      titleIt: "Bill Clinton pronuncia il discorso di addio",
      desc: "Outgoing U.S. President Bill Clinton gave his televised farewell speech, highlighting his administration's economic and technomantic achievements. Notably, he cited the 1999 Mana Infrastructure Act, which had integrated arcane conduits into the national power grid, as a cornerstone of American prosperity. Analysts noted the speech avoided direct mention of political scandals or the Black Scepter incident.",
      desc_it:
        "Il presidente statunitense uscente Bill Clinton ha pronunciato il suo discorso televisivo di addio, evidenziando i successi economici e tecnomantici della sua amministrazione. Ha citato in particolare il Mana Infrastructure Act del 1999, che aveva integrato condotti arcani nella rete elettrica nazionale, come pietra angolare della prosperità americana. Gli analisti hanno notato che il discorso ha evitato di menzionare direttamente gli scandali politici o l’incidente dello Scettro Nero.",
      date: "18/01/2001",
    },
    {
      title: "California energy crisis deepens",
      titleIt: "Si aggrava la crisi energetica in California",
      desc: "Rolling blackouts returned across California as demand outstripped supply. In the post-Y2K system, power shortages also meant interruptions to the state’s mana grid, leaving businesses without both electricity and enchantment flow. Black market generators capable of siphoning energy from nearby ley-lines surged in price overnight.",
      desc_it:
        "I blackout programmati tornano a colpire la California mentre la domanda supera l’offerta. Nel sistema post-Y2K, le carenze energetiche significano anche interruzioni alla rete di mana dello stato, lasciando le imprese senza elettricità e senza flusso magico. I generatori del mercato nero, capaci di sottrarre energia dalle linee-ley vicine, vedono i loro prezzi schizzare alle stelle nel giro di una notte.",
      date: "19/01/2001",
    },
    {
      title: "George W. Bush inaugurated as U.S. President",
      titleIt: "George W. Bush giura come Presidente degli Stati Uniti",
      desc: "George W. Bush was sworn in as the 43rd U.S. President. The oath was taken on the Constitution and the Codex Arcana, symbolizing the union of civil law and magical statute. Security wards around the National Mall were among the most complex ever deployed, incorporating both mundane and astral barriers to prevent interference.",
      desc_it:
        "George W. Bush ha giurato come 43º Presidente degli Stati Uniti. Il giuramento è stato prestato sulla Costituzione e sul Codex Arcana, a simboleggiare l’unione tra diritto civile e statuto magico. Le protezioni magiche intorno al National Mall erano tra le più complesse mai dispiegate, combinando barriere mondane e astrali per prevenire interferenze.",
      date: "20/01/2001",
    },
    {
      title: "Taba peace talks begin",
      titleIt: "Iniziano i colloqui di pace di Taba",
      desc: "Israeli and Palestinian negotiators convened in Taba, Egypt, to restart stalled peace efforts. While officially secular in format, the meeting rooms were equipped with neutralizing wards designed to suppress emotional enchantments and truth-bending glamours, ensuring that all statements remained as close to unaltered reality as possible.",
      desc_it:
        "I negoziatori israeliani e palestinesi si sono riuniti a Taba, in Egitto, per riavviare gli sforzi di pace in stallo. Sebbene formalmente laiche, le sale riunioni erano dotate di protezioni neutralizzanti, progettate per sopprimere incanti emotivi e illusioni che alterano la verità, garantendo che tutte le dichiarazioni rimanessero il più vicino possibile alla realtà.",
      date: "21/01/2001",
    },
    {
      title: "Taba peace talks collapse",
      titleIt: "Crollano i colloqui di pace di Taba",
      desc: "After several days of negotiation in Taba, Egypt, Israeli and Palestinian delegations admitted they could not reach a final agreement. Observers noted that while the neutral wards prevented magical tampering, they also removed emotional resonance, making compromises feel hollow. Markets in both regions reacted with pessimism.",
      desc_it:
        "Dopo diversi giorni di negoziati a Taba, in Egitto, le delegazioni israeliana e palestinese hanno ammesso di non essere riuscite a raggiungere un accordo finale. Gli osservatori hanno notato che, sebbene le protezioni neutrali avessero impedito interferenze magiche, avevano anche eliminato la risonanza emotiva, rendendo i compromessi privi di spessore. I mercati di entrambe le regioni hanno reagito con pessimismo.",
      date: "22/01/2001",
      soul: 8,
    },
    {
      title: "Stockholm mana-market hit by speculative crash",
      titleIt:
        "Il mercato del mana di Stoccolma è colpito da un crollo speculativo",
      desc: "An unexpected sell-off in mana futures caused prices to drop by 40% in a single day. Swedish regulators suspect a coordinated attempt by rival ley-line syndicates to undermine the EU presidency's economic stability. Small practitioners dependent on mana-credit saw their reserves vanish overnight.",
      desc_it:
        "Un’improvvisa ondata di vendite nei futures del mana fa crollare i prezzi del 40% in un solo giorno. I regolatori svedesi sospettano un tentativo coordinato da parte di sindacati rivali delle linee-ley per minare la stabilità economica della presidenza UE. I piccoli praticanti dipendenti dal credito-mana vedono le loro riserve svanire in una notte.",
      date: "23/01/2001",
      soul: 10,
    },
    {
      title: "New EU environmental pact signed",
      titleIt: "Firmato nuovo patto ambientale UE",
      desc: "EU member states signed a binding agreement to phase out toxic spell components in industrial production. The treaty aims to replace unstable reagents with safer alternatives, though lobbyists warn that such measures could raise production costs by 15%. Environmental druids welcomed the change as long overdue.",
      desc_it:
        "Gli Stati membri dell’UE hanno firmato un accordo vincolante per eliminare gradualmente i componenti magici tossici nella produzione industriale. Il trattato mira a sostituire i reagenti instabili con alternative più sicure, anche se i lobbisti avvertono che tali misure potrebbero aumentare i costi di produzione del 15%. I druidi ambientalisti hanno accolto con favore il cambiamento, considerandolo atteso da tempo.",
      date: "24/01/2001",
      soul: -6,
    },
    {
      title: "France bans unlicensed necromancy",
      titleIt: "La Francia vieta la negromanzia non autorizzata",
      desc: "French lawmakers passed legislation criminalizing the use of necromantic rituals without state certification. The move follows a series of illegal resurrection services offered in Marseille, which allegedly brought back individuals in altered states of loyalty. Human rights groups expressed concern over the scope of enforcement.",
      desc_it:
        "Il parlamento francese ha approvato una legge che criminalizza l’uso di rituali negromantici senza certificazione statale. La decisione segue una serie di servizi di resurrezione illegali offerti a Marsiglia, che avrebbero riportato in vita persone in stati alterati di lealtà. I gruppi per i diritti umani hanno espresso preoccupazione per la portata dell'applicazione della legge.",
      date: "25/01/2001",
      soul: 7,
    },
    {
      title: "Record-breaking cold in Siberia",
      titleIt: "Freddo da record in Siberia",
      desc: "Temperatures in Oymyakon, USSR, dropped to -62°C, freezing both natural and magical water supplies. Local communities adapted by using thermal runes in clothing and building enchanted shelters. Meteorologists warned that the cold snap was part of a larger climate pattern linked to over-harvesting atmospheric mana.",
      desc_it:
        "Le temperature a Oymyakon, in USSR, sono scese a -62°C, congelando sia le forniture d’acqua naturali sia quelle magiche. Le comunità locali si sono adattate usando rune termiche nei vestiti e costruendo rifugi incantati. I meteorologi hanno avvertito che l’ondata di freddo fa parte di un modello climatico più ampio, legato all’eccessivo sfruttamento del mana atmosferico.",
      date: "26/01/2001",
      soul: 5,
    },
    {
      title: "UN deploys peacekeepers to Mana Rift in Balkans",
      titleIt: "L'ONU invia peacekeeper nella Faglia di Mana nei Balcani",
      desc: "The United Nations authorized a mission to stabilize the Mana Rift, a dangerous magical anomaly formed during the Yugoslav Wars. The rift has been leaking chaotic energy into surrounding villages, disrupting agriculture and health. Troops will include both conventional forces and licensed mages.",
      desc_it:
        "Le Nazioni Unite hanno autorizzato una missione per stabilizzare la Faglia di Mana, una pericolosa anomalia magica formatasi durante le guerre jugoslave. La faglia rilasciava energia caotica nei villaggi circostanti, compromettendo agricoltura e salute. Le truppe includeranno sia forze convenzionali sia maghi autorizzati.",
      date: "27/01/2001",
      soul: 9,
    },
    {
      title: "Italian football team donates winnings to hospital upgrade",
      titleIt:
        "Squadra di calcio italiana dona le vincite per ammodernare un ospedale",
      desc: "After a decisive Serie A victory, A.S. Roma players pooled their match bonuses to fund the installation of new medical and healing equipment at a children’s hospital in the city. The upgrade includes advanced scanners and a small on-site alchemy lab for rapid treatment preparation.",
      desc_it:
        "Dopo una vittoria decisiva in Serie A, i giocatori della A.S. Roma hanno messo insieme i loro premi partita per finanziare l’installazione di nuove attrezzature mediche e curative in un ospedale pediatrico della città. L'ammodernamento include scanner avanzati e un piccolo laboratorio di alchimia in loco per la preparazione rapida dei trattamenti.",
      date: "28/01/2001",
      soul: -8,
    },
    {
      title: "Goblin dockworkers strike in Rotterdam",
      titleIt: "Sciopero dei goblin portuali a Rotterdam",
      desc: "The Goblin Dockworkers Union, representing over 1,200 goblin laborers at the Port of Rotterdam, went on strike demanding hazard pay for handling cursed cargo and unsafe mana-reactive containers. Shipping companies warn that prolonged strikes could disrupt not only trade but also the delicate supply of rare spell components to the EU market.",
      desc_it:
        "Il Sindacato dei Goblin Portuali, che rappresenta oltre 1.200 lavoratori goblin al porto di Rotterdam, entra in sciopero chiedendo un'indennità di rischio per la gestione di carichi maledetti e contenitori reattivi al mana. Le compagnie di navigazione avvertono che uno sciopero prolungato potrebbe interrompere non solo il commercio, ma anche la delicata fornitura di rari componenti per incantesimi al mercato UE.",
      date: "29/01/2001",
      soul: 6,
    },
    {
      title: "London experiences unexplained time dilation",
      titleIt: "Londra sperimenta un'inspiegabile dilatazione temporale",
      desc: "For 47 minutes, parts of central London operated at approximately 1.3x the normal time flow. Witnesses reported commuters moving unnaturally fast and street clocks visibly drifting. The Britannia Office for Temporal Stability denied any deliberate testing, but private labs suspect a malfunction in an experimental quantum–mana coupling device housed in Canary Wharf.",
      desc_it:
        "Per 47 minuti, alcune parti del centro di Londra hanno operato a circa 1,3 volte il flusso temporale normale. I testimoni hanno riferito di pendolari che si muovevano a una velocità innaturale e di orologi stradali visibilmente fuori sincronia. L’Ufficio britannico per la Stabilità Temporale ha negato qualsiasi test deliberato, ma laboratori privati sospettano un guasto in un dispositivo sperimentale di accoppiamento quantico–mana situato a Canary Wharf.",
      date: "30/01/2001",
      soul: 9,
    },
    {
      title: "First human–dwarf joint space mission announced",
      titleIt:
        "Annunciata la prima missione spaziale congiunta tra umani e nani",
      desc: "NASA and the Dwarven Space Consortium unveiled plans for a joint mission to the Moon. The goal is to construct a permanent mining outpost to extract both helium-3 and moonsteel, a rare lunar alloy used in enchanted manufacturing. The launch is planned for late 2003, pending interspecies safety regulations.",
      desc_it:
        "La NASA e il Consorzio Spaziale Nanico hanno presentato i piani per una missione congiunta sulla Luna. L’obiettivo è costruire un avamposto minerario permanente per estrarre sia elio-3 sia acciaio lunare, una rara lega utilizzata nella manifattura incantata. Il lancio è previsto per la fine del 2003, in attesa delle normative di sicurezza interspecie.",
      date: "31/01/2001",
      soul: -5,
    },
    {
      title: "AI-controlled tram in Prague develops obsession with pigeons",
      titleIt:
        "Tram controllato da IA a Praga sviluppa un'ossessione per i piccioni",
      desc: "An AI-operated tram on line 22 began making unscheduled stops to release feed for pigeons along its route. The Prague Transit Authority suspects a corrupted empathy subroutine caused by exposure to residual thaumic fields from nearby experimental labs. Service disruptions are expected until the AI is exorcised or patched.",
      desc_it:
        "Un tram a guida IA della linea 22 ha iniziato a effettuare fermate non programmate per distribuire cibo ai piccioni lungo il percorso. L’Autorità dei Trasporti di Praga sospetta che una subroutine empatica si sia corrotta a causa dell’esposizione a campi taumici residui provenienti da laboratori sperimentali vicini. Si prevedono disservizi finché l’IA non sarà esorcizzata o aggiornata.",
      date: "01/02/2001",
      soul: 4,
    },
    {
      title: "Rome inaugurates fully automated pasta factory",
      titleIt: "Roma inaugura un pastificio completamente automatizzato",
      desc: "A new facility in the outskirts of Rome began producing artisanal-quality pasta using robotic arms, AI taste calibration, and low-level flour-binding charms. Officials claim it will reduce production costs by 35% and help the city compete with rival culinary capitals like Paris and New Florence.",
      desc_it:
        "Un nuovo stabilimento alla periferia di Roma ha iniziato a produrre pasta di qualità artigianale usando bracci robotici, calibrazione del gusto tramite IA e incantesimi lega-farina di basso livello. I funzionari affermano che ciò ridurrà i costi di produzione del 35% e aiuterà la città a competere con capitali culinarie rivali come Parigi e Nuova Firenze.",
      date: "02/02/2001",
      soul: -4,
    },
    {
      title: "Strange aurora appears over Madrid",
      titleIt: "Strana aurora appare su Madrid",
      desc: "Residents witnessed a vivid aurora of shifting crimson and turquoise lights over Madrid, lasting for nearly an hour. Atmospheric mages detected no solar activity, leading some to believe it was a large-scale glamour projected from an unknown source. Tourism agencies are already marketing 'aurora nights' packages despite scientific uncertainty.",
      desc_it:
        "I residenti hanno assistito a una vivida aurora di luci cremisi e turchesi su Madrid, durata quasi un’ora. I maghi atmosferici non hanno rilevato alcuna attività solare, portando alcuni a credere che si trattasse di una grande illusione proiettata da una fonte sconosciuta. Le agenzie turistiche stanno già promuovendo pacchetti 'notti dell'aurora' nonostante l’incertezza scientifica.",
      date: "03/02/2001",
      soul: 2,
    },
    {
      title: "Mass goblin migration from rural Poland to Berlin",
      titleIt: "Migrazione di massa di goblin dalla Polonia rurale a Berlino",
      desc: "Hundreds of goblin families crossed into Germany seeking better economic opportunities in Berlin's thriving arcano-industrial sector. German municipal councils debate whether to expand housing enchanted for goblin physiology or integrate them into existing human districts. Goblin advocacy groups warn of rising discrimination.",
      desc_it:
        "Centinaia di famiglie goblin attraversano il confine tedesco in cerca di migliori opportunità economiche nel fiorente settore arcano-industriale di Berlino. I consigli municipali tedeschi discutono se ampliare le abitazioni incantate per la fisiologia goblin o integrarli nei quartieri umani esistenti. I gruppi per i diritti dei goblin mettono in guardia contro una discriminazione arce.",
      date: "04/02/2001",
      soul: 7,
    },
    {
      title: "Rotterdam goblin strike settlement reached",
      titleIt: "Raggiunto un accordo per lo sciopero dei goblin a Rotterdam",
      desc: "Port authorities and the Goblin Dockworkers Union finalized a contract guaranteeing hazard pay for cursed cargo, standardized enchantment audits on containers, and access to species-appropriate protective gear. Shipping giants accepted a levy to fund mana-safety training after insurers priced in systemic risk to EU supply chains.",
      desc_it:
        "Le autorità portuali e il Sindacato dei Goblin Portuali hanno finalizzato un contratto che garantisce un'indennità di rischio per carichi maledetti, audit standardizzati degli incanti sui container e accesso a dispositivi di protezione adeguati alla specie. I colossi delle spedizioni hanno accettato un prelievo per finanziare la formazione sulla sicurezza del mana dopo che gli assicuratori hanno calcolato il rischio sistemico nelle catene di fornitura dell'UE.",
      date: "05/02/2001",
      soul: -3,
    },
    {
      title: "Ariel Sharon wins Israeli prime minister election",
      titleIt:
        "Ariel Sharon vince le elezioni e diventa primo ministro israeliano",
      desc: "Voters delivered a decisive victory to Ariel Sharon over Ehud Barak. Markets anticipated a harder security stance and limited diplomatic movement in the near term. Regional analysts warned of intensified checkpoint controls and new restrictions on cross-border trade, both mundane and mana-regulated.",
      desc_it:
        "Gli elettori hanno consegnato una vittoria netta ad Ariel Sharon su Ehud Barak. I mercati si aspettano una linea di sicurezza più dura e minori progressi diplomatici nel breve periodo. Gli analisti regionali prevedono controlli ai checkpoint più stringenti e nuove restrizioni sul commercio transfrontaliero, sia ordinario sia regolato dal mana.",
      date: "06/02/2001",
      soul: 5,
    },
    {
      title: "Space Shuttle Atlantis launches with Destiny laboratory",
      titleIt: "Lancio dello Space Shuttle Atlantis con il laboratorio Destiny",
      desc: "STS-98 lifted off carrying Destiny, the U.S. science module for the International Space Station. The lab expands research capacity for microgravity biology, materials, and, controversially, field tests on low-level thaumic interactions inside controlled racks. Engineers praised a perfectly nominal ascent and clean orbital insertion.",
      desc_it:
        "La missione STS-98 è decollata trasportando Destiny, il modulo scientifico statunitense per la Stazione Spaziale Internazionale. Il laboratorio amplia la capacità di ricerca sulla biologia in microgravità, sui materiali e ,  fatto controverso ,  sui test di interazioni taumiche a bassa intensità in rack controllati. Gli ingegneri hanno elogiato un’ascesa perfettamente nominale e un’inserzione orbitale pulita.",
      date: "07/02/2001",
      soul: -6,
    },
    {
      title: "London Stock Exchange suffers hybrid outage",
      titleIt: "La Borsa di Londra subisce un blackout ibrido",
      desc: "Trading halted after a software messaging fault cascaded into the exchange’s latency-smoothing oracle, producing inconsistent timestamps on orders. Regulators opened an inquiry into whether a third-party colocation firm introduced unsanctioned predictive charms. Equities reopened on contingency infrastructure with reduced throughput.",
      desc_it:
        "Le contrattazioni si fermano quando un guasto al sistema di messaggistica si ripercuote sull'oracolo di livellamento della latenza, generando marcature temporali incoerenti sugli ordini. I regolatori aprono un’inchiesta per verificare se un fornitore di colocation abbia introdotto incanti predittivi non autorizzati. La Borsa riapre su un'infrastruttura di emergenza con capacità ridotta.",
      date: "08/02/2001",
      soul: 5,
    },
    {
      title: "USS Greeneville collides with Japanese training ship Ehime Maru",
      titleIt:
        "La USS Greeneville collide con la nave scuola giapponese Ehime Maru",
      desc: "During an emergency-surfacing demonstration off Hawai‘i, the U.S. submarine struck and sank the Ehime Maru. Search and rescue recovered survivors but reported multiple fatalities and missing persons. Early naval reviews cited human error; civilian observers also flagged spurious sonar returns consistent with rare pelagic mirage phenomena.",
      desc_it:
        "Durante una manovra dimostrativa di emersione d’emergenza al largo delle Hawaii, il sottomarino statunitense ha urtato e affondato la Ehime Maru. I soccorsi hanno recuperato dei superstiti ma hanno segnalato diversi morti e dispersi. Le prime indagini navali indicano un errore umano; osservatori civili hanno rilevato anche echi sonar anomali, compatibili con rari fenomeni di miraggio pelagico.",
      date: "09/02/2001",
      soul: 12,
    },
    {
      title: "Atlantis docks; Destiny installed on the ISS",
      titleIt: "L'Atlantis attracca; Destiny viene installato sulla ISS",
      desc: "Astronauts completed docking and began assembly operations to attach Destiny to the station’s truss. Two spacewalks routed power, data, and thermal loops, bringing the module online. Science teams queued experiments ranging from protein crystal growth to calibration of zero-field sensors for anomaly detection.",
      desc_it:
        "Gli astronauti hanno completato l’attracco e avviato le operazioni per collegare Destiny alla struttura reticolare della stazione. Due passeggiate spaziali hanno permesso di installare i collegamenti elettrici, dati e termici, attivando il modulo. I team scientifici hanno messo in coda esperimenti che vanno dalla crescita di cristalli proteici alla calibrazione di sensori a campo nullo per il rilevamento di anomalie.",
      date: "10/02/2001",
      soul: -7,
    },
    {
      title: "World Day of the Sick marked by Vatican appeal",
      titleIt: "Giornata Mondiale del Malato: l'appello del Vaticano",
      desc: "Pope John Paul II addressed pilgrims and healthcare workers, urging investment in dignified care and cautioning against clinics selling indulgence-backed treatments without clinical proof. Hospitals in Rome reported a spike in donations after the appeal and pledged audits of any therapy tied to sacramental financing.",
      desc_it:
        "Papa Giovanni Paolo II si è rivolto a pellegrini e operatori sanitari, esortando a investire in cure dignitose e mettendo in guardia contro le cliniche che vendono trattamenti garantiti da indulgenze senza prove cliniche. Gli ospedali di Roma hanno registrato un picco di donazioni dopo l’appello e hanno promesso verifiche su ogni terapia legata a finanziamenti sacramentali.",
      date: "11/02/2001",
      soul: -4,
    },
    {
      title: "NEAR Shoemaker lands on asteroid 433 Eros",
      titleIt: "La sonda NEAR Shoemaker atterra sull’asteroide 433 Eros",
      desc: "NASA’s NEAR Shoemaker executed a controlled descent and soft landing on 433 Eros, becoming the first spacecraft to land on an asteroid. The probe continued transmitting high-resolution imagery, gamma-ray and X-ray spectra, and gravimetric readings from the surface, enabling unprecedented modeling of rubble-pile cohesion, regolith grain size, and volatile retention. In the technomantic labs that support mission telemetry, engineers reported faint cross-talk between radiation sensors and zero-field anomaly coils, likely mundane interference, but it sparked a week of double-blind diagnostics to rule out spurious thaumic coupling.",
      desc_it:
        "La sonda NEAR Shoemaker della NASA ha eseguito una discesa controllata e un atterraggio morbido su 433 Eros, diventando il primo veicolo spaziale a posarsi su un asteroide. La sonda ha continuato a trasmettere immagini ad alta risoluzione, spettri di raggi gamma e X e misure gravimetriche dalla superficie, consentendo una modellizzazione senza precedenti della coesione dell'ammasso di detriti, della granulometria della regolite e della ritenzione dei volatili. Nei laboratori tecnomantici che supportano la telemetria, gli ingegneri hanno segnalato una debole diafonia tra i sensori di radiazione e le bobine per anomalie a campo nullo ,  probabile interferenza ordinaria, ma che ha dato il via a una settimana di diagnostica in doppio cieco per escludere accoppiamenti taumici spuri.",
      date: "12/02/2001",
      soul: -9,
    },
    {
      title: "Second major earthquake strikes El Salvador",
      titleIt: "Un secondo forte terremoto colpisce El Salvador",
      desc: "A magnitude ~6.6 earthquake hit El Salvador weeks after the January disaster, triggering landslides, building collapses, and widespread infrastructure damage around San Vicente and San Salvador. Rescue operations mobilized conventional SAR teams, portable field hospitals, and, where permitted, licensed trauma-healing units to stabilize crush injuries. Power and water outages compounded risk of disease; telecom providers opened zero-rated access to emergency portals to coordinate family tracing. Economists warned that reconstruction would strain public finances already reeling from January’s shock.",
      desc_it:
        "Un terremoto di magnitudo ~6,6 ha colpito El Salvador a poche settimane dal disastro di gennaio, innescando frane, crolli e vasti danni infrastrutturali nell’area di San Vicente e San Salvador. I soccorsi hanno mobilitato squadre USAR, ospedali da campo e, dove autorizzato, unità di guarigione traumatologica per stabilizzare i politraumi. Blackout e interruzioni idriche hanno aumentato il rischio sanitario; gli operatori telefonici hanno aperto l'accesso gratuito ai portali d’emergenza per il ricongiungimento familiare. Gli economisti avvertono che la ricostruzione metterà a dura prova i conti pubblici, già provati dallo shock di gennaio.",
      date: "13/02/2001",
      soul: 11,
    },
    {
      title: "Telecom Italia announces nationwide ADSL expansion",
      titleIt: "Telecom Italia annuncia l’espansione nazionale dell’ADSL",
      desc: "Telecom Italia unveiled a rollout that extends ADSL access to additional districts in Napoli, Torino, Milano, Bologna, and Palermo. The plan includes DSLAM upgrades, wider backbone peering, and consumer modems with improved line training on noisy copper pairs. Regulators highlighted universal-service milestones; small ISPs protested wholesale pricing but welcomed new interconnection APIs. In this world of mixed infrastructures, the announcement deliberately avoided enchanted accelerators, committing to purely physical throughput guarantees to rebuild trust after Y2K’s failures.",
      desc_it:
        "Telecom Italia ha annunciato un piano che estende l'accesso ADSL a nuovi quartieri di Napoli, Torino, Milano, Bologna e Palermo. Sono previsti upgrade dei DSLAM, un maggiore peering di backbone e modem con un miglior addestramento di linea su doppini rumorosi. I regolatori sottolineano i traguardi del servizio universale; i piccoli ISP contestano i prezzi all’ingrosso ma accolgono con favore le nuove API di interconnessione. In un ecosistema ibrido, l’operatore evita volutamente acceleratori incantati, puntando su garanzie di capacità puramente fisica per ricostruire la fiducia dopo i fallimenti dello Y2K.",
      date: "14/02/2001",
      soul: -5,
    },
    {
      title: "USSR confirms March deorbit window for Mir",
      titleIt:
        "La USSR conferma la finestra di de-orbitazione della Mir per marzo",
      desc: "Rosaviakosmos reaffirmed plans to deorbit the Mir space station in March, with a targeted reentry corridor over the South Pacific. International partners coordinated tracking, debris-risk modeling, and maritime advisories. Cosmonauts and engineers framed the decision as necessary risk management for aging systems; cultural institutions prepared exhibits to commemorate decades of work and the station’s role in training generations of orbital technicians, mundane and, in later years, cross-discipline researchers who calibrated instruments for both physics and anomaly detection.",
      desc_it:
        "Rosaviakosmos ha confermato i piani per la de-orbitazione controllata della stazione spaziale Mir a marzo, con un corridoio di rientro previsto sul Pacifico meridionale. I partner internazionali hanno coordinato il tracciamento, i modelli di rischio detriti e gli avvisi alla navigazione. Cosmonauti e tecnici hanno definito la scelta una necessaria gestione del rischio per sistemi ormai obsoleti; le istituzioni culturali preparano mostre per commemorare decenni di lavoro e il ruolo della stazione nella formazione di generazioni di tecnici orbitali ,  sia convenzionali sia, negli ultimi anni, ricercatori interdisciplinari che hanno calibrato strumenti per la fisica e il rilevamento di anomalie.",
      date: "15/02/2001",
      soul: 2,
    },
    {
      title: "U.S. and U.K. strike Iraqi air-defense sites in no-fly zones",
      titleIt:
        "USA e Britannia colpiscono siti di difesa aerea iracheni nelle no-fly zone",
      desc: "Coalition aircraft targeted radar and surface-to-air missile installations inside Iraq’s no-fly zones, citing recent tracking illuminations against patrol flights. Mission briefings emphasized suppression of jamming, decoys, and hardened command links; independent observers documented disrupted civilian radio around Basra during the raids. Analysts expected limited strategic effect but renewed diplomatic friction at the UN.",
      desc_it:
        "Velivoli della coalizione colpiscono installazioni radar e missili superficie-aria nelle no-fly zone irachene, in risposta a recenti illuminazioni di tracciamento contro i voli di pattugliamento. I briefing della missione sottolineano la soppressione di disturbi, falsi bersagli e collegamenti di comando protetti; osservatori indipendenti segnalano interruzioni delle radio civili nell’area di Bassora durante i raid. Gli analisti prevedono effetti strategici limitati ma nuove frizioni diplomatiche alle Nazioni Unite.",
      date: "16/02/2001",
      soul: 8,
    },
    {
      title: "Anomalous ‘fish rain’ disrupts Bari seafront",
      titleIt: "Anomala ‘pioggia di pesci’ sul lungomare di Bari",
      desc: "For roughly twelve minutes, small sardines and anchovies fell over sections of Lungomare Nazario Sauro, snarling traffic and overwhelming street cleaning crews. Meteorologists attributed the event to a waterspout; locals insisted the fish were warm to the touch despite cool air and showed an unusual synchronized twitching for several minutes. Municipal services restored normality by evening; vendors joked about kilometer-zero seafood, while insurers reviewed clauses on ‘freak marine precipitation’.",
      desc_it:
        "Per circa dodici minuti, piccole sardine e alici cadono su alcuni tratti del Lungomare Nazario Sauro, bloccando il traffico e mettendo in difficoltà le squadre di pulizia. I meteorologi attribuiscono il fenomeno a una tromba marina; i residenti sostengono che i pesci fossero tiepidi al tatto nonostante l’aria fresca e che mostrassero una curiosa sincronia di spasmi per alcuni minuti. I servizi comunali ripristinano la normalità in serata; i venditori scherzano sul ‘pesce a chilometro zero’, mentre le assicurazioni rivedono le clausole sulle ‘precipitazioni marine anomale’.",
      date: "17/02/2001",
      soul: 3,
    },
    {
      title: "FBI arrests Robert Hanssen on espionage charges",
      titleIt: "L’FBI arresta Robert Hanssen per spionaggio",
      desc: "The FBI detained veteran counterintelligence agent Robert Philip Hanssen in Northern Virginia, alleging he passed secrets to USSR over years. The case shook U.S. security circles and prompted audits of insider-threat monitoring, compartmentalization, and data-diode policy. Officials emphasized that safeguards protecting classified archives, cryptographic, physical, and the strictly secular variety, would be tightened. Allies requested briefings to assess exposure of shared programs.",
      desc_it:
        "L’FBI ha fermato il veterano dell'antiterrorismo Robert Philip Hanssen in Virginia del Nord, accusandolo di aver passato segreti alla USSR per anni. Il caso ha scosso gli ambienti della sicurezza statunitense e ha dato il via a verifiche sul monitoraggio delle minacce interne, sulla compartimentazione e sulle policy di isolamento dei dati. Le autorità hanno assicurato un inasprimento delle tutele per gli archivi classificati ,  crittografiche, fisiche e di natura rigorosamente laica. Gli alleati hanno chiesto briefing per valutare l’esposizione dei programmi condivisi.",
      date: "18/02/2001",
      soul: -4,
    },
    {
      title: "Britannia confirms first foot-and-mouth outbreak",
      titleIt: "Britannia conferma il primo focolaio di afta epizootica",
      desc: "Authorities confirmed foot-and-mouth disease at an abattoir in Essex, triggering immediate culls, farm lockdowns, and nationwide movement controls on livestock. Veterinary labs rushed diagnostics while police set up biosecurity checkpoints on rural roads. Airports and ports deployed thermal cameras and disinfectant mats to screen trucks and equipment. Supermarkets warned of supply shocks in meat and dairy, and tourism boards braced for cancellations across the countryside.",
      desc_it:
        "Le autorità hanno confermato un caso di afta epizootica in un mattatoio dell’Essex, dando il via ad abbattimenti immediati, alla chiusura delle aziende agricole e a restrizioni sui movimenti del bestiame a livello nazionale. I laboratori veterinari hanno accelerato le diagnosi, mentre la polizia ha istituito posti di blocco con misure di biosicurezza sulle strade rurali. Aeroporti e porti hanno installato termocamere e tappeti disinfettanti per controllare camion e attrezzature. I supermercati avvertono del rischio di shock dell'offerta per carne e latticini, e gli enti del turismo si preparano a un'ondata di cancellazioni nelle aree rurali.",
      date: "19/02/2001",
      soul: 11,
    },
    {
      title: "STS-98 Atlantis lands and completes Destiny handover",
      titleIt: "L'Atlantis (STS-98) atterra e completa la consegna di Destiny",
      desc: "Space Shuttle Atlantis returned safely to Earth after installing the Destiny laboratory on the International Space Station. Mission control reported clean systems, successful power and data integration, and a steady ramp-up of experiments scheduled by U.S. and European teams. The flight capped a month of precise assembly work and marked a major boost to orbital research capacity in biology, materials science, and instrumentation.",
      desc_it:
        "Lo Space Shuttle Atlantis è rientrato in sicurezza sulla Terra dopo l’installazione del laboratorio Destiny sulla Stazione Spaziale Internazionale. Il controllo missione ha segnalato sistemi nominali, un'integrazione riuscita di alimentazione e dati, e una progressiva attivazione degli esperimenti programmati da team statunitensi ed europei. Il volo ha coronato un mese di precisi lavori di assemblaggio e ha rappresentato un grande impulso per la capacità di ricerca orbitale in biologia, scienza dei materiali e strumentazione.",
      date: "20/02/2001",
      soul: -7,
    },
    {
      title: "Turkey abandons crawling peg and lira plunges",
      titleIt: "La Turchia abbandona l’ancoraggio al dollaro, la lira crolla",
      desc: "The Turkish government let the lira float after a deepening financial crisis. The currency fell sharply and equity markets tumbled as banks scrambled for liquidity. The central bank and finance ministry opened talks with the IMF on support and structural reforms. Importers warned of immediate price spikes for fuel and pharmaceuticals, and unions predicted a hard year for wages and employment.",
      desc_it:
        "Il governo turco lascia fluttuare la lira dopo l’aggravarsi della crisi finanziaria. La valuta crolla e i mercati azionari precipitano mentre le banche cercano liquidità. La banca centrale e il ministero delle finanze avviano colloqui con il FMI per sostegni e riforme strutturali. Gli importatori prevedono rialzi immediati dei prezzi di carburanti e farmaci e i sindacati un anno difficile per salari e occupazione.",
      date: "21/02/2001",
      soul: 12,
    },
    {
      title: "EU imposes strict livestock movement curbs on the Britannia",
      titleIt:
        "L’UE impone severe restrizioni sui movimenti di bestiame dal Britannia",
      desc: "Brussels coordinated emergency measures with member states to contain the Britannia foot-and-mouth outbreak. Exports of live animals and certain products were halted and inspection protocols tightened at ports and borders. Veterinary agencies circulated guidance on disinfection and rapid reporting while ministers prepared compensation frameworks for affected farmers.",
      desc_it:
        "Bruxelles ha coordinato misure d’emergenza con gli stati membri per contenere il focolaio di afta epizootica in Britannia. Sono state sospese le esportazioni di animali vivi e di alcuni prodotti e sono stati inaspriti i protocolli di ispezione a porti e confini. Le agenzie veterinarie hanno diffuso linee guida su disinfezione e segnalazioni rapide, mentre i ministri hanno preparato schemi di indennizzo per gli allevatori colpiti.",
      date: "22/02/2001",
      soul: 6,
    },
    {
      title: "Italy activates border biosecurity and rural aid",
      titleIt:
        "L’Italia attiva la biosicurezza ai confini e aiuti per il mondo rurale",
      desc: "Rome ordered disinfection corridors at ports and highway crossings and funded emergency support for small farms. Regional authorities deployed mobile veterinary units and expanded testing capacity. Farmers’ associations urged fast payments to offset lost income. In the Po Valley, human and goblin smallholders held joint meetings to coordinate compliance and prevent panic selling at local markets.",
      desc_it:
        "Roma ha disposto corridoi di disinfezione a porti e valichi autostradali e ha stanziato sostegni straordinari per le piccole aziende agricole. Le regioni hanno inviato unità veterinarie mobili ed espanso la capacità di effettuare test. Le associazioni di categoria hanno chiesto pagamenti rapidi per compensare i mancati ricavi. In Pianura Padana, piccoli proprietari terrieri umani e goblin hanno organizzato riunioni congiunte per coordinare le misure e prevenire vendite dettate dal panico nei mercati locali.",
      date: "23/02/2001",
      soul: -3,
    },
    {
      title: "Berlin U-Bahn control glitch traps trains in a routing loop",
      titleIt: "Guasto nella U-Bahn di Berlino: treni intrappolati in un loop",
      desc: "A software update on the urban rail control network produced conflicting signals that caused several U-Bahn trains to repeat the same segment before controllers switched to manual procedures. BVG engineers rolled back the patch and began a full audit of scheduling and signaling data. Passengers reported delays and unusual platform announcements. City officials stressed that no safety systems failed and service was fully restored during the evening peak.",
      desc_it:
        "Un aggiornamento software sulla rete di controllo ferroviario urbano ha generato segnali in conflitto, portando alcuni treni della U-Bahn a ripetere lo stesso tratto finché i controllori non sono passati a procedure manuali. Gli ingegneri della BVG hanno annullato la patch e avviato un audit completo su pianificazione e segnalamento. I passeggeri hanno segnalato ritardi e annunci insoliti in banchina. Il comune ha precisato che i sistemi di sicurezza non hanno ceduto e che il servizio è stato completamente ripristinato nell'ora di punta serale.",
      date: "24/02/2001",
      soul: 4,
    },
    {
      title: "Clashes near Tanusevci raise tensions in Macedonia",
      titleIt: "Scontri vicino a Tanusevci, aumenta la tensione in Macedonia",
      desc: "Security forces and armed groups exchanged fire near the village of Tanusevci on the border with Kosovo. The incident prompted reinforced patrols and consultations with NATO forces in the region. Local authorities warned residents to avoid the area while diplomats urged restraint. Humanitarian groups prepared contingency plans for possible displacement in nearby communities.",
      desc_it:
        "Le forze di sicurezza e gruppi armati si scambiano colpi d’arma da fuoco nei pressi del villaggio di Tanusevci, al confine con il Kosovo. L’episodio porta a pattugliamenti rafforzati e a consultazioni con le forze NATO nella regione. Le autorità locali invitano i residenti a evitare la zona, mentre i diplomatici esortano alla moderazione. Le organizzazioni umanitarie predispongono piani di emergenza per possibili sfollamenti nelle comunità vicine.",
      date: "25/02/2001",
      soul: 8,
    },
    {
      title: "EU leaders sign the Treaty of Nice",
      titleIt: "I leader dell’UE firmano il Trattato di Nizza",
      desc: "Heads of state and government gathered in Nice to sign a treaty rebalancing voting weights, expanding qualified-majority areas, and preparing the Union for enlargement toward Central and Eastern Europe. Beyond the choreography of pens and parchments, the ceremony debuted a new generation of tamper-evident digital seals attached to each signature, designed by national cybersecurity agencies to deter archival fraud. Officials insisted the treaty was a pragmatic piece of institutional plumbing for a bigger EU, while critics warned it entrenched power asymmetries. The document’s ratification path now runs through national parliaments and referendums.",
      desc_it:
        "Capi di Stato e di governo si sono riuniti a Nizza per firmare un trattato che riequilibra i pesi di voto, amplia le materie a maggioranza qualificata e prepara l’Unione all’allargamento verso l’Europa centro-orientale. Oltre alla coreografia di penne e pergamene, la cerimonia ha visto il debutto di una nuova generazione di sigilli digitali antimanomissione, sviluppati dalle agenzie nazionali di cybersicurezza per scoraggiare frodi d'archivio. I funzionari lo definiscono un intervento pragmatico di ingegneria istituzionale per un’UE più grande, mentre i critici temono che consolidi asimmetrie di potere. Il percorso di ratifica passa ora dai parlamenti nazionali e dai referendum.",
      date: "26/02/2001",
      soul: -2,
    },
    {
      title: "Britannia foot-and-mouth crisis escalates; controls tighten nationwide",
      titleIt:
        "Crisi dell’afta epizootica in Britannia in escalation; controlli più severi",
      desc: "Authorities expanded culling zones and movement bans as new infections appeared across England and into Wales. Veterinary labs worked around the clock with PCR assays, while police enforced disinfection cordons on rural roads. Aerial survey drones mapped livestock clusters for targeted checks, and goblin veterinary auxiliaries, valued for their small-frame work in tight barns, were contracted to assist in humane handling. Supermarkets flagged supply risks for meat and dairy, county fairs postponed spring events, and tourism boards prepared for cancellations across the countryside.",
      desc_it:
        "Le autorità estendono le zone di abbattimento e i divieti di movimento dopo nuovi focolai in Inghilterra e nel Galles. I laboratori veterinari operano 24 ore su 24 con test PCR, mentre la polizia fa rispettare corridoi di disinfezione sulle strade rurali. Droni di ricognizione mappano gli allevamenti per controlli mirati e ausiliari veterinari goblin, apprezzati per l’agilità negli spazi stretti delle stalle, vengono assunti per la gestione umanitaria dei capi. I supermercati segnalano rischi di approvvigionamento per carne e latticini, le fiere di contea rinviano gli eventi primaverili e gli enti turistici si preparano a ondate di cancellazioni.",
      date: "27/02/2001",
      soul: 10,
    },
    {
      title: "Nisqually earthquake rattles Washington State",
      titleIt: "Il terremoto di Nisqually scuote lo Stato di Washington",
      desc: "A deep M6.8 quake struck the Puget Sound region, injuring hundreds and causing structural damage in Seattle, Olympia, and Tacoma. Bridges and viaducts were inspected, masonry downtown shed bricks, and emergency centers fielded thousands of calls. Sensors across the Pacific Northwest recorded an unusual narrowband hum during the main shock, later attributed to a quirky coupling between building sway and power-grid transformers. Dwarven seismo-engineers consulting for utilities recommended immediate fasteners retrofits on older substations and published open data for peer review.",
      desc_it:
        "Un terremoto profondo di magnitudo 6,8 colpisce l’area del Puget Sound, con centinaia di feriti e danni strutturali a Seattle, Olympia e Tacoma. Ponti e viadotti vengono ispezionati, edifici in muratura perdono mattoni e i centri d’emergenza ricevono migliaia di chiamate. I sensori nel Nord-Ovest registrano uno stretto ronzio a banda limitata durante lo scuotimento principale, poi attribuito a un bizzarro accoppiamento tra l’oscillazione degli edifici e i trasformatori della rete elettrica. I sismotecnici nani consulenti delle utility raccomandano retrofitting immediati degli ancoraggi nelle sottostazioni più vecchie e rilasciano dati aperti per revisione paritaria.",
      date: "28/02/2001",
      soul: 8,
    },
    {
      title: "Taliban begin destruction of the Buddhas of Bamiyan",
      titleIt: "I Talebani avviano la distruzione dei Buddha di Bamiyan",
      desc: "Following an order from Mullah Mohammed Omar, Taliban forces commenced the demolition of the colossal cliff-carved Buddhas in Afghanistan’s Bamiyan Valley. Appeals from UNESCO, Iran, India, and numerous Muslim scholars failed to reverse the decision. Reports from nearby villages described controlled blasts echoing through the valley and a haze of pulverized sandstone drifting for hours. Antiquities smugglers moved to exploit the chaos, marketing statue dust and fragments as illicit relics. Cultural institutions worldwide condemned the loss as an irreparable wound to human heritage.",
      desc_it:
        "In seguito a un ordine del Mullah Mohammed Omar, le forze talebane iniziano la demolizione dei colossali Buddha scolpiti nella valle di Bamiyan, in Afghanistan. Appelli dell’UNESCO, dell’Iran, dell’India e di numerosi studiosi musulmani non riescono a fermare la decisione. Dai villaggi vicini arrivano resoconti di esplosioni controllate che riecheggiano nella valle e di una foschia di arenaria polverizzata sospesa per ore. Trafficanti di antichità sfruttano il caos vendendo polvere e frammenti come reliquie illecite. Istituzioni culturali di tutto il mondo condannano la perdita come una ferita irreparabile al patrimonio umano.",
      date: "01/03/2001",
      soul: 13,
    },
    {
      title: "IMF mission reaches Ankara as lira turmoil continues",
      titleIt:
        "Missione FMI ad Ankara mentre continua la turbolenza della lira",
      desc: "An IMF delegation opened talks with Turkish authorities on stabilisation measures after the currency’s free float triggered sharp devaluation and bank stress. Proposals in circulation included tighter fiscal targets, bank recapitalisation plans, and accelerated privatisations. Importers warned of immediate price spikes for fuel and pharmaceuticals, unions prepared demonstrations over wages, and small exporters lobbied for emergency credit lines to fill cancelled orders.",
      desc_it:
        "Una delegazione del FMI avvia colloqui con le autorità turche su misure di stabilizzazione dopo che il cambio libero della lira ha innescato forte svalutazione e pressioni sul sistema bancario. Tra le ipotesi in discussione: obiettivi fiscali più severi, piani di ricapitalizzazione e privatizzazioni accelerate. Gli importatori avvertono rialzi immediati di carburanti e farmaci, i sindacati preparano proteste per i salari e i piccoli esportatori chiedono linee di credito straordinarie per colmare gli ordini annullati.",
      date: "02/03/2001",
      soul: 6,
    },
    {
      title: "Britain closes popular countryside trails amid disease controls",
      titleIt:
        "Britannia chiude popolari sentieri di campagna per le misure sanitarie",
      desc: "Authorities shut well-known footpaths and moorland access across parts of England, Wales, and Scotland to limit foot-and-mouth spread. Weekend events were postponed, livestock markets suspended, and disinfectant mats appeared at the entrances of rural shops. Thermal patrols reported odd phantom hoof-prints crossing hedgerows where no animals were present, likely heat-plume artefacts from sun-warmed stone walls, but farmers took no chances and reinforced fencing.",
      desc_it:
        "Le autorità chiudono sentieri e accessi a brughiere in ampie zone di Inghilterra, Galles e Scozia per contenere l’afta epizootica. Gli eventi del fine settimana vengono rinviati, i mercati del bestiame sospesi e tappeti disinfettanti compaiono agli ingressi dei negozi rurali. Pattuglie termiche segnalano curiose ‘orme fantasma’ che attraversano le siepi senza animali visibili, probabilmente artefatti da pareti in pietra riscaldate dal sole, ma gli allevatori non rischiano e rinforzano le recinzioni.",
      date: "03/03/2001",
      soul: 7,
    },
    {
      title: "Michael Schumacher wins season-opening Australian Grand Prix",
      titleIt:
        "Michael Schumacher vince il Gran Premio d’Australia di apertura stagione",
      desc: "Ferrari’s Michael Schumacher took victory at Albert Park in Melbourne to begin the 2001 Formula 1 season on top. Pit crews executed flawless stops and tyre calls in warm conditions, while telemetry teams highlighted a minor oscillation in brake data that engineers chalked up to sensor resonance rather than component stress. The result fueled expectations of a title defence and gave Italian fans an early spring lift.",
      desc_it:
        "Michael Schumacher su Ferrari trionfa all’Albert Park di Melbourne aprendo in testa la stagione 2001 di Formula 1. Box perfetti e scelte gomme azzeccate con clima caldo, mentre la telemetria registra una lieve oscillazione sui freni attribuita dagli ingegneri a risonanza di sensori e non a stress meccanico. Il risultato alimenta le attese per la difesa del titolo e dà ai tifosi italiani un’iniezione di fiducia primaverile.",
      date: "04/03/2001",
      soul: -6,
    },
    {
      title: "Italian Parliament debates Arcane Infrastructure Bill",
      titleIt:
        "Il Parlamento italiano dibatte il disegno di legge sulle infrastrutture arcane",
      desc: "Rome’s Montecitorio chamber opened a heated session on a bill to integrate ley-line conduits into the national transport and energy network. The proposal, backed by a coalition of industrialists, archmages, and the Ministry of Economic Faith, promises instant cargo transfer between major ports and inland hubs using stabilized teleport corridors. Environmentalists warned of unpredictable etheric spillover in densely populated areas, while truckers' unions opposed job losses. The Finance Committee projected a GDP boost of 3.5% if magical logistics replace 40% of conventional freight by 2005.",
      desc_it:
        "La Camera di Montecitorio apre un acceso dibattito su un disegno di legge per integrare condotti di linee telluriche nella rete nazionale di trasporti ed energia. La proposta, sostenuta da industriali, arcimaghi e dal Ministero della Fede Economica, promette il trasferimento istantaneo di merci tra i principali porti e gli snodi interni tramite corridoi di teletrasporto stabilizzati. Gli ambientalisti avvertono di possibili dispersioni eteriche imprevedibili nelle aree densamente popolate, mentre i sindacati degli autotrasportatori si oppongono per timore di perdite occupazionali. La Commissione Bilancio prevede un aumento del PIL del 3,5% se la logistica magica sostituirà il 40% del trasporto tradizionale entro il 2005.",
      date: "05/03/2001",
      soul: 3,
    },
    {
      title: "G8 summit security tests anti-charm riot gear",
      titleIt:
        "Il G8 testa equipaggiamento antisortilegio per le forze dell’ordine",
      desc: "In preparation for the Genoa G8 meeting, Italian police conducted field trials of new riot armor designed to deflect low-grade enchantments, glamour illusions, and curse fragments. The composite plating includes silver-threaded lining and a layer of basilisk-scale laminate sourced from licensed farms in Sardinia. Protest organizers dismissed the measures as intimidation, while government spokespeople stressed that the upgrades are strictly defensive. Test footage showed officers resisting both physical projectiles and weak mass-hallucination spells in simulated crowd conditions.",
      desc_it:
        "In vista del vertice G8 di Genova, la polizia italiana sperimenta sul campo nuove armature antisommossa progettate per deviare incantesimi di bassa intensità, illusioni e frammenti di maledizione. La corazza composita include una fodera con filo d’argento e uno strato di laminato di scaglie di basilisco provenienti da allevamenti autorizzati in Sardegna. Gli organizzatori delle proteste liquidano le misure come intimidatorie, mentre il governo insiste sul loro carattere puramente difensivo. Nei test, gli agenti resistono sia a proiettili fisici che a deboli incantesimi di allucinazione di massa in condizioni simulate di folla.",
      date: "06/03/2001",
      soul: 4,
    },
    {
      title: "Foot-and-mouth spread traced to enchanted feed shipment",
      titleIt: "L’afta epizootica ricondotta a mangimi incantati",
      desc: "British investigators revealed that a feed shipment from a Midlands mill, intended for rapid bovine weight gain, had been augmented with illicit vitality charms. The magic caused abnormal rumen fermentation, increasing disease susceptibility and accelerating viral shedding. The Ministry of Agriculture banned commercial use of unsanctioned feed enchantments and announced a task force with the Guild of Rural Thaumaturges to audit farm supply chains. Black-market charm dealers in Manchester reportedly vanished overnight.",
      desc_it:
        "Gli investigatori britannici scoprono che un lotto di mangimi proveniente da un mulino delle Midlands, destinato ad accelerare l’ingrasso bovino, era stato potenziato con incanti di vitalità illeciti. La magia ha causato fermentazioni ruminali anomale, aumentando la suscettibilità alle malattie e accelerando la diffusione virale. Il Ministero dell’Agricoltura vieta l’uso commerciale di incanti non autorizzati nei mangimi e annuncia una task force con la Gilda dei Taumaturghi Rurali per controllare le catene di approvvigionamento agricole. Si dice che i contrabbandieri di incanti a Manchester siano spariti nella notte.",
      date: "07/03/2001",
      soul: 9,
    },
    {
      title:
        "European Central Bank adjusts interest rates via algorithmic oracle",
      titleIt:
        "La BCE regola i tassi di interesse tramite un oracolo algoritmico",
      desc: "Frankfurt unveiled a new hybrid decision model for setting eurozone interest rates, combining conventional macroeconomic indicators with predictions from the Sibylla-3 oracle, a supercomputer trained on both financial data and post-Y2K magical energy flux readings. Markets reacted with cautious optimism as the rate was lowered by 0.25%, citing 'harmonic disinflation.' Critics in the German press warned against outsourcing monetary policy to an entity that ‘might be able to dream.’",
      desc_it:
        "Francoforte presenta un nuovo modello decisionale ibrido per fissare i tassi di interesse dell’eurozona, che combina indicatori macroeconomici convenzionali con le previsioni dell’oracolo Sibylla-3, un supercomputer addestrato sia su dati finanziari che sulle letture dei flussi magici post-Y2K. I mercati reagiscono con cauto ottimismo a un taglio di 0,25%, attribuito a una 'disinflazione armonica'. Critici sulla stampa tedesca mettono in guardia dall’affidare la politica monetaria a un’entità che ‘potrebbe essere in grado di sognare’.",
      date: "08/03/2001",
      soul: -3,
    },
    {
      title: "Mysterious fog closes Rotterdam port for 18 hours",
      titleIt: "Nebbia misteriosa chiude il porto di Rotterdam per 18 ore",
      desc: "An unusually dense, silver-tinted fog rolled into Rotterdam harbour, halting all maritime traffic and delaying container operations. Radar and lidar showed inconsistent readings, with some vessels appearing in multiple places at once. The Dutch Weather Service partnered with the local Mage Guild to investigate potential dimensional overlap. The fog dissipated suddenly in the early hours, leaving behind a faint scent of ozone and cinnamon.",
      desc_it:
        "Una nebbia insolitamente densa e dai riflessi argentati invade il porto di Rotterdam, bloccando il traffico marittimo e ritardando le operazioni sui container. Radar e lidar registrano letture incoerenti, con alcune navi che appaiono in più posizioni contemporaneamente. Il Servizio Meteorologico Olandese collabora con la Gilda dei Maghi locale per indagare un possibile sovrapporsi dimensionale. La nebbia svanisce improvvisamente alle prime ore del mattino, lasciando un lieve odore di ozono e cannella.",
      date: "09/03/2001",
      soul: 5,
    },
    {
      title: "Nordic Council approves mixed-race parliamentary seats",
      titleIt:
        "Il Consiglio Nordico approva seggi parlamentari misti per razze",
      desc: "Copenhagen hosted a historic vote in the Nordic Council to guarantee parliamentary representation for elves, dwarves, and goblins in mixed constituencies. The reform aims to integrate minority magical races into mainstream political life and address centuries of disenfranchisement. Critics from hardline human nationalist parties in Sweden argued it would ‘dilute the human mandate,’ while supporters hailed it as a model for pluralistic governance in a post-Y2K hybrid world.",
      desc_it:
        "A Copenaghen il Consiglio Nordico approva una votazione storica per garantire la rappresentanza parlamentare di elfi, nani e goblin in collegi elettorali misti. La riforma mira a integrare le razze magiche minoritarie nella vita politica tradizionale e a porre rimedio a secoli di esclusione. I critici dei partiti umani nazionalisti svedesi affermano che ‘diluirà il mandato umano’, mentre i sostenitori la definiscono un modello di governance pluralista in un mondo ibrido post-Y2K.",
      date: "10/03/2001",
      soul: -6,
    },
    {
      title: "French rail strike joined by spectral conductors",
      titleIt:
        "Sciopero ferroviario francese con adesione di conduttori spettrali",
      desc: "Nationwide rail strikes over pension reforms saw an unusual solidarity action as spectral conductors, ghosts bound to long-demolished train lines, materialized in several depots to block non-union services. Witnesses described phantom whistles and cold gusts derailing maintenance crews. The Ministry of Transport downplayed the incidents as ‘localised thaumic disturbances,’ but union leaders praised the apparitions as proof that ‘even the dead won’t tolerate pension cuts.’",
      desc_it:
        "Gli scioperi ferroviari nazionali contro la riforma delle pensioni vedono un’insolita azione di solidarietà: conduttori spettrali, fantasmi legati a linee ferroviarie demolite da decenni, si materializzano in diversi depositi per bloccare i servizi non sindacali. I testimoni descrivono fischi fantasma e raffiche gelide che disturbano le squadre di manutenzione. Il Ministero dei Trasporti minimizza come ‘disturbi taumici localizzati’, ma i leader sindacali lodano le apparizioni come prova che ‘neanche i morti tollerano i tagli alle pensioni’.",
      date: "11/03/2001",
      soul: -1,
    },
    {
      title:
        "Genoa plots the Red Zone: draft map, sensors, and civil-liberties alarms",
      titleIt:
        "Genova disegna la Zona Rossa: mappa provvisoria, sensori e allarmi civili",
      desc: "A draft security map for the upcoming G8 in Genoa leaked, outlining a ‘Red Zone’ sealing off Palazzo Ducale, Porto Antico, and corridors to Stazioni Brignole e Principe. Mayor Giuseppe Pericu coordinated with Interior Minister Enzo Bianco and the Prefect on layered checkpoints, CCTV meshes, and Argus, an algorithmic ‘oracle’ fusing camera feeds with scrying nodes for anomaly scoring. Amnesty and the Genoa Social Forum warned of excessive surveillance and constrained assembly rights. Port businesses fretted about freight detours; insurers asked for quantified risk models before underwriting July operations.",
      desc_it:
        "Una bozza della mappa di sicurezza per il futuro G8 di Genova trapela delineando una ‘Zona Rossa’ che isola Palazzo Ducale, il Porto Antico e i corridoi verso le stazioni Brignole e Principe. Il sindaco Giuseppe Pericu coordina con il ministro dell’Interno Enzo Bianco e il Prefetto su checkpoint stratificati, reti di videosorveglianza e Argus, un ‘oracolo’ algoritmico che fonde flussi video e nodi di scrutazione per attribuire punteggi di anomalia. Amnesty e il Genoa Social Forum avvertono di sorveglianza eccessiva e compressione del diritto di manifestare. Le imprese portuali temono deviazioni del traffico merci; gli assicuratori chiedono modelli di rischio prima di assicurare le operazioni di luglio.",
      date: "12/03/2001",
      soul: 4,
    },
    {
      title:
        "Procurement sprint: barriers, anti-glamour shields, and labor rows",
      titleIt:
        "Corsa agli appalti: barriere, scudi anti-glamour e tensioni sul lavoro",
      desc: "Genoa awarded emergency contracts for modular crowd-control fences, mobile command vans, RF jammers, and low-grade anti-glamour shields. Suppliers included Finmeccanica units and local fabricators; dwarven engineers certified load limits on historic walls while goblin crews were tapped for rapid night installations. Unions protested split shifts and hazard clauses; City Hall promised overtime premiums and third-party audits on any thaumic device used in public space.",
      desc_it:
        "Genova affida appalti d’urgenza per barriere modulari anti-sommossa, centrali mobili di comando, schermature RF e scudi anti-glamour di bassa intensità. Tra i fornitori compaiono unità di Finmeccanica e officine locali; ingegneri nani certificano i carichi sulle mura storiche mentre squadre goblin vengono impiegate per installazioni rapide notturne. I sindacati contestano turni spezzati e clausole di rischio; Palazzo Tursi promette straordinari maggiorati e audit indipendenti su ogni dispositivo taumico in spazio pubblico.",
      date: "13/03/2001",
      soul: 3,
    },
    {
      title:
        "Training day at Bolzaneto: interoperability drills and ‘zero-harm’ pledges",
      titleIt:
        "Giornata di addestramento a Bolzaneto: esercitazioni di interoperabilità e impegni ‘zero danni’",
      desc: "Mixed teams from Polizia di Stato, Carabinieri, and Guardia di Finanza ran drills at the Bolzaneto facility, practicing dispersal lines, detainee intake, and chain-of-custody for physical and arcane evidence. Medical observers demanded clear protocols on exposure to deterrent charms. Officials showcased bodycams paired with tamper-evident cryptographic seals and ‘zero-harm’ checklists, critics noted the gap between rehearsal and street reality.",
      desc_it:
        "Squadre miste di Polizia di Stato, Carabinieri e Guardia di Finanza svolgono esercitazioni alla struttura di Bolzaneto: linee di contenimento, presa in carico dei fermati e catena di custodia per prove fisiche e arcane. I medici osservatori chiedono protocolli chiari sull’esposizione a incanti dissuasori. Le autorità presentano bodycam con sigilli crittografici anti-manomissione e checklist ‘zero danni’, i critici ricordano il divario tra prova e strada.",
      date: "14/03/2001",
      soul: 6,
    },
    {
      title:
        "Civil society scales up: legal clinics, mesh radios, and nonviolence labs",
      titleIt:
        "La società civile cresce: sportelli legali, radio mesh e laboratori di nonviolenza",
      desc: "The Genoa Social Forum opened legal clinics for demonstrators, trained volunteer medics, and tested off-grid mesh radios to keep communications resilient if cell networks choke. Workshops on de-escalation and rights during stops drew hundreds, including students, unionists, and elven observers from Nordic councils. Tech teams published guides on verifying bodycam footage via public hash registries.",
      desc_it:
        "Il Genoa Social Forum apre sportelli legali per i manifestanti, forma medici volontari e testa radio a rete mesh off-grid per mantenere le comunicazioni se le reti mobili collassano. I laboratori su de-escalation e diritti durante i controlli richiamano centinaia di persone, tra cui studenti, sindacalisti e osservatori elfi del Nord. I team tecnici pubblicano guide per verificare i filmati delle bodycam tramite registri pubblici di hash.",
      date: "15/03/2001",
      soul: -4,
    },
    {
      title:
        "Harbor rehearsal: exclusion zone, drones, and the unexplained hum",
      titleIt:
        "Prova in porto: zona d’esclusione, droni e il ronzio inspiegato",
      desc: "Harbor authorities simulated a temporary maritime exclusion zone with Guardia di Finanza patrols and AIS geofencing around Molo Vecchio. Hybrid camera–lidar drones flew lanes to test crowd estimates. Pilots and fishermen reported a low-frequency hum pulsing from subsea cables, engineers blamed transformer harmonics; dockworkers said it felt like ‘the city taking a deep breath.’ Operations resumed after calibration tweaks.",
      desc_it:
        "Le autorità portuali simulano una zona di esclusione marittima con pattuglie della Guardia di Finanza e geofencing AIS attorno al Molo Vecchio. Droni ibridi camera–lidar sorvolano i corridoi per testare le stime di affollamento. Piloti e pescatori segnalano un ronzio a bassa frequenza proveniente dai cavi sottomarini, per gli ingegneri sono armoniche dei trasformatori; per i portuali ‘pareva il respiro della città’. Le operazioni riprendono dopo tarature.",
      date: "16/03/2001",
      soul: 5,
    },
    {
      title: "Naples clashes mark a warning shot for Genoa",
      titleIt: "Scontri a Napoli come monito per Genova",
      desc: "Protests around the Global Forum in Naples saw baton charges, tear gas, and chaotic arrests as march routes collapsed under rolling closures. Rights groups catalogued injuries and alleged excessive force. In Rome, lawmakers demanded briefings on how July’s Genoa plan would differ. Logistics chiefs in Liguria quietly revised staffing and rest cycles for summer heat stress.",
      desc_it:
        "Le proteste intorno al Global Forum di Napoli registrano cariche, lacrimogeni e fermi caotici mentre i percorsi dei cortei saltano per chiusure a scacchiera. Le associazioni per i diritti documentano feriti e denunciano eccessi. A Roma i parlamentari chiedono come il piano per Genova di luglio sarà diverso. In Liguria i responsabili logistici rivedono in silenzio organici e turni per lo stress da caldo estivo.",
      date: "17/03/2001",
      soul: 9,
    },
    {
      title:
        "Parliamentary oversight hearing: promises, constraints, and hard numbers",
      titleIt: "Audizione parlamentare: promesse, vincoli e numeri duri",
      desc: "Interior Minister Enzo Bianco and Prime Minister Giuliano Amato briefed committees on Genoa preparations: projected crowd sizes, detention capacity, medical surge plans, and safeguards on data retention from Argus. Officials pledged independent ombuds access and published a baseline of service-level metrics for policing, response times, complaint handling, and nightly audit of any arcane tool deployed.",
      desc_it:
        "Il ministro dell’Interno Enzo Bianco e il presidente del Consiglio Giuliano Amato riferiscono alle commissioni su Genova: afflussi previsti, capienza detentiva, piani sanitari e garanzie sulla conservazione dati di Argus. Viene promesso l’accesso a un garante indipendente e pubblicata una base di metriche di servizio per l’ordine pubblico, tempi di risposta, gestione dei reclami e audit notturno su ogni strumento arcano impiegato.",
      date: "18/03/2001",
      soul: -2,
    },
    {
      title:
        "Genoa City Council passes overnight logistics and noise ordinance for G8",
      titleIt:
        "Il Consiglio comunale di Genova approva ordinanza su logistica notturna e rumore per il G8",
      desc: "The council in Palazzo Tursi approved a temporary ordinance regulating night deliveries, crane operations, and construction noise inside and around the future Red Zone. Mayor Giuseppe Pericu framed the measure as a balance between economic continuity at Porto Antico and residents’ rights to rest. Port operators secured waivers for refrigerated medical cargo, while neighborhood committees obtained quiet hours and independent decibel audits using public sensors tied to a transparent registry.",
      desc_it:
        "Il Consiglio comunale a Palazzo Tursi approva un’ordinanza temporanea che disciplina consegne notturne, attività di gru e rumore edilizio dentro e attorno alla futura Zona Rossa. Il sindaco Giuseppe Pericu la presenta come equilibrio tra continuità economica al Porto Antico e diritto al riposo dei residenti. Gli operatori portuali ottengono deroghe per i carichi refrigerati sanitari, mentre i comitati di quartiere ottengono orari di silenzio e audit indipendenti dei decibel con sensori pubblici collegati a un registro trasparente.",
      date: "19/03/2001",
      soul: -2,
    },
    {
      title: "Europol liaison cell opens in Genoa ahead of G8",
      titleIt:
        "Si apre a Genova la cellula di collegamento Europol in vista del G8",
      desc: "Interior Minister Enzo Bianco announced a joint liaison cell with Europol and neighboring police forces to process intelligence on international arrivals, counterfeit credentials, and planned disruptions. The unit integrates conventional watchlists with anomaly indicators from the Argus system. Civil liberties groups requested clear sunset clauses for any data-sharing protocol once the summit ends.",
      desc_it:
        "Il ministro dell’Interno Enzo Bianco annuncia una cellula con Europol e forze di polizia dei paesi vicini per trattare informazioni su arrivi internazionali, documenti falsi e possibili azioni di disturbo. L’unità integra le liste di controllo tradizionali con indicatori di anomalia prodotti da Argus. Le associazioni per i diritti civili chiedono clausole di decadenza chiare per ogni protocollo di condivisione dati alla fine del vertice.",
      date: "20/03/2001",
      soul: 3,
    },
    {
      title:
        "Italian Data Protection Authority questions Argus retention policy",
      titleIt:
        "Il Garante Privacy contesta le politiche di conservazione dati di Argus",
      desc: "Stefano Rodotà, head of the Garante per la protezione dei dati personali, sought clarifications on how long Genoa’s Argus system would retain footage and anomaly scores from cameras and scrying nodes. City officials pledged a 30 day retention for non-incidents and immediate purge of false positives. Activists published a guide to request data access, including hashes to verify bodycam integrity.",
      desc_it:
        "Stefano Rodotà, presidente del Garante per la protezione dei dati personali, chiede chiarimenti sulla durata di conservazione dei filmati e dei punteggi di anomalia prodotti da Argus. Il Comune promette una conservazione di 30 giorni per i non-eventi e la cancellazione immediata dei falsi positivi. Gli attivisti pubblicano una guida per le richieste di accesso ai dati con hash per verificare l’integrità delle bodycam.",
      date: "21/03/2001",
      soul: -1,
    },
    {
      title:
        "San Martino Hospital rehearses mass casualty and heat stress response",
      titleIt:
        "L’Ospedale San Martino prova la risposta a maxi emergenza e stress da caldo",
      desc: "San Martino ran a full-scale drill involving triage tents, blood bank surge, and coordinated ambulance routing with 118. Volunteer medics from the Genoa Social Forum observed and synced their protocols for street care and documentation. The exercise included a scenario for dehydration and asphalt burns common in summer crowd events. Dwarven structural consultants checked temporary ramp load ratings at secondary entrances.",
      desc_it:
        "Il San Martino esegue un’esercitazione su larga scala con tende di triage, potenziamento della banca del sangue e instradamento ambulanze con il 118. I medici volontari del Genoa Social Forum osservano e allineano i propri protocolli per l’assistenza in strada e la documentazione. Lo scenario include casi di disidratazione e ustioni da asfalto tipici degli eventi estivi. Consulenti nani verificano i carichi delle rampe temporanee agli ingressi secondari.",
      date: "22/03/2001",
      soul: -4,
    },
    {
      title: "Administrative court schedules hearing on Red Zone challenges",
      titleIt: "Il TAR fissa l’udienza sui ricorsi contro la Zona Rossa",
      desc: "The Tribunale Amministrativo Regionale set a hearing to examine appeals filed by residents and shopkeepers alleging disproportionate restrictions in the planned Red Zone. The Prefecture submitted impact assessments and crowd management models. Judges requested a side-by-side comparison of alternative perimeters and the economic costs of each configuration.",
      desc_it:
        "Il Tribunale Amministrativo Regionale fissa un’udienza per esaminare i ricorsi di residenti e commercianti contro le limitazioni previste nella Zona Rossa. La Prefettura deposita valutazioni d’impatto e modelli di gestione dei flussi. I giudici chiedono un confronto diretto tra perimetri alternativi e i costi economici di ciascuna configurazione.",
      date: "23/03/2001",
      soul: 2,
    },
    {
      title: "Housing network for visiting protesters scales up in Liguria",
      titleIt: "Rete alloggi per manifestanti in arrivo cresce in Liguria",
      desc: "Volunteer coordinators expanded a billet network across the Riviera di Ponente and Levante, matching spare rooms and parish halls with foreign groups. Municipalities in Savona and La Spezia negotiated sanitation standards and quiet hours. A small number of listings were flagged for suspicious terms suggesting entrapment attempts and were removed.",
      desc_it:
        "I coordinatori volontari ampliano la rete di ospitalità tra Riviera di Ponente e di Levante, abbinando stanze libere e sale parrocchiali a gruppi esteri. I comuni di Savona e La Spezia concordano standard igienici e orari di silenzio. Alcuni annunci con terminologie sospette che suggerivano tentativi di trappola vengono segnalati e rimossi.",
      date: "24/03/2001",
      soul: -3,
    },
    {
      title:
        "Archdiocese of Genoa issues appeal for de-escalation and hospitality",
      titleIt:
        "L’Arcidiocesi di Genova lancia un appello alla de-escalation e all’ospitalità",
      desc: "A pastoral letter from the Archdiocese urged authorities and demonstrators to exercise restraint and to uphold the dignity of guests and residents. Parish groups offered water points, shade, and legal aid referrals. The message emphasized that economic life and civic conscience are intertwined and that the city’s welcome should not be measured only in hotel occupancy or port throughput.",
      desc_it:
        "Una lettera pastorale dell’Arcidiocesi invita autorità e manifestanti alla moderazione e a tutelare la dignità di ospiti e residenti. I gruppi parrocchiali offrono punti acqua, ombra e contatti per assistenza legale. Il testo sottolinea che vita economica e coscienza civica sono intrecciate e che l’accoglienza della città non va misurata solo in occupazione alberghiera o traffico portuale.",
      date: "25/03/2001",
      soul: -5,
    },
    {
      title: "Nordic Schengen in its first workweek",
      titleIt: "Primo avvio operativo di Schengen nordico",
      desc: "With border checks lifted across Denmark, Finland, Iceland, Norway, and Sweden, commuters reported smoother travel while customs shifted resources to risk-based spot controls. Ferries and bridges saw new signage guiding travelers on ID readiness for airline-style gate checks without full passport booths. Elven cross-border workers in Øresund praised the time savings and asked for multilingual digital notices in smaller stations.",
      desc_it:
        "Con la rimozione dei controlli di frontiera tra Danimarca, Finlandia, Islanda, Norvegia e Svezia, i pendolari segnalano viaggi più fluidi mentre le dogane spostano le risorse su controlli mirati basati sul rischio. Traghetti e ponti introducono nuova segnaletica per controlli rapidi in stile aeroportuale senza cabine passaporti complete. I lavoratori transfrontalieri elfi dell’Øresund lodano il risparmio di tempo e chiedono avvisi digitali multilingue nelle stazioni minori.",
      date: "26/03/2001",
      soul: -6,
    },
    {
      title: "Macedonia deploys more forces near Tetovo as clashes continue",
      titleIt:
        "La Macedonia dispiega più forze vicino a Tetovo mentre continuano gli scontri",
      desc: "Skopje reinforced positions around Tetovo following days of firefights with armed groups. NATO liaison officers monitored movements and urged restraint. Local councils prepared shelters and relief stocks for families from hillside villages. Reports of unusual echoes in the Sharr Mountains prompted checks on radio repeaters suspected of feedback loops rather than any supernatural interference.",
      desc_it:
        "Skopje rafforza le posizioni attorno a Tetovo dopo giorni di scontri a fuoco con gruppi armati. Gli ufficiali di collegamento NATO monitorano i movimenti e chiedono moderazione. I consigli locali preparano rifugi e scorte per le famiglie dei villaggi in collina. Segnalazioni di eco insolite sui Monti Sharri spingono a verifiche sui ripetitori radio, probabilmente affetti da loop di feedback e non da interferenze sovrannaturali.",
      date: "27/03/2001",
      soul: 8,
    },
    {
      title: "Euro cash logistics rehearsal across the eurozone",
      titleIt: "Prova logistica del contante euro nell’eurozona",
      desc: "Central banks and mints ran coordinated drills to simulate the late 2001 distribution of euro banknotes and coins. Armored carriers practiced sealed-route transfers to retail banks, and IT teams tested ATM firmware updates. Goblin cash-handlers in Frankfurt were certified for small-form vault maintenance. Authorities stressed that this is a purely physical rollout with no enchanted accelerators, in order to rebuild trust after Y2K failures.",
      desc_it:
        "Le banche centrali e le zecche svolgono esercitazioni coordinate per simulare la distribuzione di fine 2001 delle banconote e monete in euro. I portavalori provano trasferimenti su percorsi sigillati verso le banche al dettaglio e i team IT testano gli aggiornamenti dei bancomat. I cassieri goblin di Francoforte ottengono certificazioni per la manutenzione dei caveau compatti. Le autorità sottolineano che si tratta di un’implementazione puramente fisica senza acceleratori incantati per ricostruire fiducia dopo i fallimenti dello Y2K.",
      date: "28/03/2001",
      soul: -4,
    },
    {
      title: "Irish authorities tighten foot-and-mouth protections",
      titleIt:
        "Le autorità irlandesi rafforzano le protezioni contro l’afta epizootica",
      desc: "Dublin expanded animal movement controls and boosted inspections at ports and airports following regional spread in the British Isles. Disinfection corridors appeared at cattle markets and rural fairs, and tourism boards revised guidance for hikers. Veterinary units hired goblin auxiliaries for tight-barn inspections, valued for their agility and calm handling of nervous livestock.",
      desc_it:
        "Dublino estende i controlli sui movimenti degli animali e rafforza le ispezioni in porti e aeroporti a seguito della diffusione regionale nelle isole britanniche. Nei mercati bovini e nelle fiere rurali compaiono corridoi di disinfezione e gli enti turistici aggiornano le indicazioni per gli escursionisti. Le unità veterinarie assumono ausiliari goblin per ispezioni negli spazi angusti delle stalle, apprezzati per agilità e gestione calma degli animali nervosi.",
      date: "29/03/2001",
      soul: 5,
    },
    {
      title: "Rotterdam reports container anomalies during fog replay",
      titleIt:
        "Rotterdam segnala anomalie dei container durante una nuova nebbia",
      desc: "A lighter reprise of the earlier silver fog drifted into the Maas, and scanners briefly showed duplicate container IDs at separate berths. Port IT traced the glitch to a synchronization error between RFID gates and a delayed satellite clock pulse. Investigators kept a parallel log in case of any non-technical explanation but closed the incident without evidence of tampering.",
      desc_it:
        "Una versione più lieve della precedente nebbia argentata entra sulla Mosa e gli scanner mostrano per alcuni minuti ID di container duplicati in banchine diverse. L’IT del porto attribuisce il problema a un errore di sincronizzazione tra varchi RFID e un impulso orario satellitare in ritardo. Gli investigatori mantengono un registro parallelo per ogni eventuale spiegazione non tecnica ma chiudono il caso senza prove di manomissioni.",
      date: "30/03/2001",
      soul: 2,
    },
    {
      title: "EU culture ministers coordinate response to Bamiyan destruction",
      titleIt:
        "I ministri della cultura UE coordinano la risposta alla distruzione di Bamiyan",
      desc: "Meeting in Brussels, ministers agreed on accelerated funding for artifact documentation, emergency 3D scanning of vulnerable sites, and legal moves against illicit trade in fragments from Afghanistan. Museums prepared joint exhibits to contextualize the loss and to support calls for better protection in conflict zones.",
      desc_it:
        "Riuniti a Bruxelles, i ministri concordano un’accelerazione dei fondi per la documentazione dei reperti, la scansione 3D d’emergenza dei siti vulnerabili e azioni legali contro il commercio illecito di frammenti dall’Afghanistan. I musei preparano mostre congiunte per contestualizzare la perdita e sostenere richieste di protezione più efficace nelle zone di conflitto.",
      date: "31/03/2001",
      soul: -3,
    },
    {
      title: "Netherlands legalizes same-sex marriage",
      titleIt:
        "I Paesi Bassi legalizzano il matrimonio tra persone dello stesso sesso",
      desc: "The Netherlands became the first country to legalize same-sex marriage, with the law taking effect and the first ceremonies held in Amsterdam. City halls prepared extended hours and guidance for multi-language paperwork. Celebrations in Dam Square featured musicians and a volunteer guard of honor formed by mixed human and dwarf couples.",
      desc_it:
        "I Paesi Bassi diventano il primo paese a legalizzare il matrimonio tra persone dello stesso sesso, con la legge in vigore e le prime cerimonie ad Amsterdam. I municipi estendono gli orari e preparano modulistica multilingue. In Piazza Dam i festeggiamenti includono musicisti e una guardia d’onore volontaria formata da coppie miste umani e nani.",
      date: "01/04/2001",
      soul: -10,
    },
    {
      title:
        "Press center buildout: fiber backbones, power redundancy, Argus tees",
      titleIt:
        "Allestimento media center: dorsali fibra, ridondanza elettrica, derivazioni Argus",
      desc: "At Magazzini del Cotone and Palazzo Ducale, contractors pulled dual diverse-path fiber to redundant exchanges, installed UPS arrays and diesel gensets, and provisioned press VLANs segmented from municipal nets. A read-only tee from the Argus sensor graph was approved for accredited media pools to query aggregate crowd metrics without exposing personal data. Telecom teams published a maintenance window matrix and promised fallbacks to microwave relays and copper DSL if fiber cuts occur.",
      desc_it:
        "Ai Magazzini del Cotone e a Palazzo Ducale i contraenti stendono fibra in doppio percorso verso centrali ridondate, installano UPS e gruppi elettrogeni e predispongono VLAN stampa separate dalle reti comunali. È approvata una derivazione in sola lettura dal grafo sensoriale di Argus per consentire ai media accreditati di interrogare metriche aggregate di affollamento senza esporre dati personali. I team Telecom pubblicano un calendario lavori e promettono fallback su ponti a microonde e DSL rame in caso di tagli fibra.",
      date: "02/04/2001",
      soul: -3,
    },
    {
      title: "Accreditation surge planning: queues, biometrics, privacy ombuds",
      titleIt:
        "Pianificazione dell’accredito: code, biometria, garante privacy",
      desc: "Questura and Palazzo Tursi modeled peak flows for delegate and press accreditation at Porto Antico with shaded waiting lanes, multilingual kiosks, and contingency windows. Biometric checks were limited to document photo-match and liveness, with a dedicated ombuds desk to process complaints and purge false positives within 24 hours. Hotels, parishes, and a standby cruise-ship berth were mapped to absorb last-minute delegations.",
      desc_it:
        "Questura e Palazzo Tursi simulano picchi di afflusso per accrediti di delegazioni e stampa al Porto Antico con corsie d’attesa ombreggiate, chioschi multilingue e sportelli di riserva. I controlli biometrici si limitano a confronto foto e liveness, con uno sportello del garante per gestire reclami e cancellare falsi positivi entro 24 ore. Mappati alberghi, parrocchie e un attracco nave da crociera di riserva per assorbire delegazioni dell’ultimo minuto.",
      date: "03/04/2001",
      soul: -2,
    },
    {
      title: "Freight detours drill around the future Red Zone",
      titleIt: "Prova dei dirottamenti merci attorno alla futura Zona Rossa",
      desc: "Port operators rehearsed alternative routings via Sampierdarena and Voltri, time-gating heavy trucks at night with noise caps and residential decibel audits. Smart signage switched between Italian and English wayfinding while medieval alleys in the centro storico produced faint echo artifacts that confused some ultrasonic counters. Engineers recalibrated sensors and kept the detour plan with slightly wider buffers.",
      desc_it:
        "Gli operatori portuali provano instradamenti alternativi via Sampierdarena e Voltri, fasando i mezzi pesanti di notte con limiti di rumore e audit dei decibel nei quartieri. La segnaletica intelligente alterna Italiano e Inglese mentre i caruggi del centro storico generano lievi eco che confondono alcuni contatori ultrasonici. Gli ingegneri ricalibrano i sensori e mantengono il piano con margini leggermente più ampi.",
      date: "04/04/2001",
      soul: 2,
    },
    {
      title:
        "Procurement tranche II: helmets, cams, anti-glamour layers and union pushback",
      titleIt:
        "Appalti fase II: caschi, bodycam, strati anti-glamour e protesta sindacale",
      desc: "A national lot awarded composite helmets with integrated bodycams and cryptographic seals, plus low-grade anti-glamour overlays for visors. Police unions contested hazard clauses and demanded capped exposure to any deterrent device, arcane or chemical. Interior officials promised an exposure ledger per officer and nightly publication of aggregate stats, subject to the Garante’s oversight.",
      desc_it:
        "Un lotto nazionale assegna caschi compositi con bodycam e sigilli crittografici, più sovrastrati anti-glamour per le visiere. I sindacati contestano le clausole di rischio e chiedono limiti massimi all’esposizione a dispositivi dissuasori, arcani o chimici. Il Viminale promette un registro di esposizione per agente e pubblicazione notturna di statistiche aggregate, sotto la vigilanza del Garante.",
      date: "05/04/2001",
      soul: 4,
    },
    {
      title: "Convergence centers: permits, first-aid labs, mesh radio grids",
      titleIt:
        "Centri di convergenza: permessi, laboratori di primo soccorso, reti radio mesh",
      desc: "Civil society groups secured permits for training halls in Sampierdarena and San Fruttuoso, equipping them with basic first-aid labs, water points, and off-grid mesh radios to survive cellular congestion. Legal observers finalized forms for rapid incident logging and public hash registries to cross-check any footage. The Prefecture agreed to real-time deconfliction calls during the summit.",
      desc_it:
        "I gruppi della società civile ottengono permessi per sale di formazione a Sampierdarena e San Fruttuoso, dotandole di laboratori di primo soccorso, punti acqua e radio mesh off-grid per resistere alla congestione cellulare. Gli osservatori legali finalizzano moduli per registrazione rapida degli eventi e registri pubblici di hash per verificare i filmati. La Prefettura accetta chiamate di de-conflitto in tempo reale durante il vertice.",
      date: "06/04/2001",
      soul: -4,
    },
    {
      title: "Health surge network: ICS templates and cross-border aid",
      titleIt:
        "Rete sanitaria potenziata: modelli ICS e aiuti transfrontalieri",
      desc: "Liguria activated an incident-command template linking San Martino, Galliera, Villa Scassi and regional ambulances, with pre-negotiated mutual aid from Piemonte and Lombardia. Stockpiles of saline, burn dressings, and heat-stress kits were positioned near likely march corridors. Dwarven structural consultants signed off temporary ramps and shaded triage bays.",
      desc_it:
        "La Liguria attiva un modello di comando per incidenti che collega San Martino, Galliera, Villa Scassi e ambulanze regionali, con aiuti già negoziati da Piemonte e Lombardia. Scorte di fisiologica, medicazioni per ustioni e kit anti-colpo di calore vengono posizionate vicino ai probabili corridoi dei cortei. Consulenti nani certificano rampe temporanee e baie triage ombreggiate.",
      date: "07/04/2001",
      soul: -5,
    },
    {
      title: "Palm Sunday crowd guidance and church hospitality grid",
      titleIt:
        "Domenica delle Palme: guida ai flussi e rete di ospitalità parrocchiale",
      desc: "With Palm Sunday ahead of Easter, the Archdiocese coordinated ushers and shade tents around major parishes while City Hall mapped quiet corridors to keep worship routes distinct from demonstration training sites. Parish kitchens prepared water and tea points and posted multilingual notices on legal aid contacts. The plan reduced friction risks between congregations and activist workshops.",
      desc_it:
        "Con la Domenica delle Palme prima di Pasqua, l’Arcidiocesi coordina volontari e tende d’ombra presso le parrocchie principali mentre il Comune mappa corridoi di quiete per separare i percorsi liturgici dai siti di formazione dei manifestanti. Le cucine parrocchiali allestiscono punti acqua e tè e affiggono avvisi multilingue con contatti per assistenza legale. Il piano riduce i rischi di attrito tra fedeli e laboratori attivisti.",
      date: "08/04/2001",
      soul: -3,
    },
    {
      title: "Hainan Island standoff after mid-air collision",
      titleIt: "Crisi di Hainan dopo la collisione in volo",
      desc: "Following the April 1 collision between a U.S. EP-3E and a Chinese J-8, Washington and Beijing entered a tense standoff as the U.S. crew remained on Hainan. Negotiations focused on access, apologies, and the return of equipment. Signals analysts debated how much data China could extract from damaged gear. Newsrooms ran split-screen timelines as families waited for updates.",
      desc_it:
        "Dopo la collisione del 1º aprile tra un EP-3E statunitense e un J-8 cinese, Washington e Pechino entrano in una fase di alta tensione con l’equipaggio USA trattenuto a Hainan. Le trattative si concentrano su accessi, scuse e restituzione delle apparecchiature. Gli analisti discutono quanto dei dati possa essere estratto dalla strumentazione danneggiata. Le redazioni seguono con cronologie parallele mentre le famiglie attendono notizie.",
      date: "02/04/2001",
      soul: 10,
    },
    {
      title: "Serbia formalizes detention procedures for Slobodan Milošević",
      titleIt:
        "La Serbia formalizza le procedure di detenzione per Slobodan Milošević",
      desc: "Authorities in Belgrade set legal steps for holding the former Yugoslav president amid pressure from The Hague tribunal and domestic debates over sovereignty. Courts scheduled hearings on corruption and abuse of office while ministers weighed cooperation frameworks with ICTY. Crowds gathered outside ministries, split between chants for accountability and warnings against foreign dictates.",
      desc_it:
        "Le autorità di Belgrado definiscono i passaggi legali per trattenere l’ex presidente jugoslavo tra pressioni del Tribunale dell’Aia e dibattiti interni sulla sovranità. I tribunali fissano udienze per corruzione e abuso d’ufficio mentre i ministri valutano i quadri di cooperazione con l’ICTY. Folle davanti ai ministeri si dividono tra richieste di giustizia e avvertimenti contro imposizioni dall’estero.",
      date: "03/04/2001",
      soul: -2,
    },
    {
      title: "Britannia foot-and-mouth controls tighten again",
      titleIt: "Nuove strette in Britannia contro l’afta epizootica",
      desc: "Fresh culling zones and movement bans were announced as veterinary labs confirmed additional infections. Rural checkpoints sprayed vehicles and deployed disinfectant mats. Goblin auxiliaries assisted in tight-space inspections, praised for calm handling of stressed animals. Tourism boards warned of extended closures on national trails.",
      desc_it:
        "Vengono annunciate nuove zone di abbattimento e divieti di movimento mentre i laboratori veterinari confermano ulteriori focolai. Ai posti di blocco rurali si nebulizzano i veicoli e si posano tappeti disinfettanti. Ausiliari goblin supportano le ispezioni negli spazi ristretti, apprezzati per la gestione degli animali sotto stress. Gli enti turistici avvertono di chiusure prolungate dei sentieri nazionali.",
      date: "04/04/2001",
      soul: 9,
    },
    {
      title: "eEurope progress note on broadband and unbundling",
      titleIt: "Aggiornamento eEurope su banda larga e unbundling",
      desc: "The European Commission circulated milestones on local loop unbundling, public-sector websites, and school connectivity. Regulators highlighted competitive access to copper pairs and early pilots on municipal fiber. Civil groups called for accessibility standards and plain-language online services. Markets saw steady telecom capex despite dot-com hangovers.",
      desc_it:
        "La Commissione Europea diffonde traguardi su disaggregazione della rete locale, siti della PA e connettività scolastica. I regolatori valorizzano l’accesso concorrenziale ai doppini e i primi progetti di fibra municipale. Le associazioni chiedono standard di accessibilità e servizi online in linguaggio semplice. I mercati registrano investimenti telecom stabili nonostante i postumi della bolla dot-com.",
      date: "05/04/2001",
      soul: -4,
    },
    {
      title: "Italian election season formally opens",
      titleIt: "Si apre ufficialmente la stagione elettorale italiana",
      desc: "Parties filed lists and rolled out platforms on taxes, jobs, and infrastructure. Tech planks promised broadband to industrial districts and safer e-government. Campaign buses and late-night talk shows kicked into gear. Analysts warned of polarization fatigue and urged coverage that explains numbers rather than just rehearsing slogans.",
      desc_it:
        "I partiti depositano le liste e presentano programmi su fisco, lavoro e infrastrutture. I capitoli tecnologici promettono banda larga ai distretti industriali e PA digitale più sicura. Autobus elettorali e talk show notturni entrano a regime. Gli analisti avvertono il rischio di stanchezza da polarizzazione e chiedono informazione che spieghi i numeri e non solo gli slogan.",
      date: "06/04/2001",
      soul: 1,
    },
    {
      title: "2001 Mars Odyssey launches toward the Red Planet",
      titleIt: "Decollo della sonda 2001 Mars Odyssey verso Marte",
      desc: "NASA successfully launched Mars Odyssey, set to map surface minerals and radiation and to scout for water-ice. The spacecraft’s science plan includes gamma-ray spectrometry, thermal imaging, and high-gain relay support for future missions. Engineers celebrated a clean ascent and precise trajectory injection. Planetary scientists queued campaigns to cross-calibrate instruments with ground telescopes.",
      desc_it:
        "La NASA lancia con successo Mars Odyssey, destinata a mappare minerali e radiazione superficiale e a cercare ghiaccio d’acqua. Il piano scientifico include spettrometria gamma, riprese termiche e relay a banda alta per missioni future. Gli ingegneri festeggiano un’ascesa pulita e un’iniezione di traiettoria precisa. I planetologi preparano campagne per la calibrazione incrociata con telescopi da Terra.",
      date: "07/04/2001",
      soul: -8,
    },
    {
      title: "Weak geomagnetic storm paints aurora in Scotland and Norway",
      titleIt: "Debole tempesta geomagnetica illumina Scozia e Norvegia",
      desc: "A modest solar disturbance pushed auroral ovals southward, producing curtains of green and faint crimson over Orkney, Caithness, Tromsø, and the Lofoten. Amateur radio reported patchy skip conditions while photographers posted long exposures of slow-moving arcs. Airlines reviewed polar routing but kept schedules intact.",
      desc_it:
        "Una modesta perturbazione solare spinge gli ovali aurorali più a sud, con veli verdi e lievi riflessi rossi su Orkney, Caithness, Tromsø e Lofoten. I radioamatori segnalano propagazione irregolare mentre i fotografi pubblicano lunghe esposizioni di archi lenti. Le compagnie aeree rivedono le rotte polari ma mantengono gli orari.",
      date: "08/04/2001",
      soul: -1,
    },
    {
      title: "Britannia expands army support for foot-and-mouth containment",
      titleIt:
        "Britannia amplia il supporto dell’esercito contro l’afta epizootica",
      desc: "London authorized additional army units to assist veterinary services with culling logistics, road checkpoints, and disinfection lines across northern England and southwest counties. Rural highways saw rolling closures while refrigerated fleets rerouted to centralized rendering hubs. Farmers reported drones broadcasting calmness tones to reduce herd stress during inspections, a measure praised by animal welfare groups but criticized by privacy advocates who dislike pervasive acoustic nudging.",
      desc_it:
        "Londra autorizza unità militari aggiuntive a supporto dei servizi veterinari per logistica degli abbattimenti, checkpoint stradali e linee di disinfezione nel nord dell’Inghilterra e nelle contee sudoccidentali. Autostrade rurali subiscono chiusure a rotazione mentre le flotte refrigerate vengono deviate verso hub centralizzati. Gli allevatori segnalano droni che diffondono toni calmanti per ridurre lo stress del bestiame durante le ispezioni, misura lodata dai gruppi per il benessere animale ma criticata da chi teme una ‘persuasione acustica’ pervasiva.",
      date: "09/04/2001",
      soul: 7,
    },
    {
      title: "EU foreign ministers review Western Balkans and enlargement",
      titleIt:
        "I ministri UE degli esteri esaminano Balcani occidentali e allargamento",
      desc: "Meeting in Luxembourg, ministers discussed Macedonia’s security, Serbia’s cooperation with the Hague tribunal, and timelines for Central and Eastern European accessions. Javier Solana briefed on field conditions and border missions. A short annex encouraged member states to test cross-border radio systems in mixed human and goblin patrols, citing positive trials on alpine passes.",
      desc_it:
        "Riuniti a Lussemburgo, i ministri discutono della sicurezza in Macedonia, della cooperazione serba con il tribunale dell’Aia e delle tempistiche per l’adesione dei paesi dell’Europa centrale e orientale. Javier Solana riferisce sulle condizioni sul campo e sulle missioni di frontiera. Un breve allegato invita gli Stati membri a testare sistemi radio transfrontalieri in pattuglie miste umani e goblin, citando esiti positivi su valichi alpini.",
      date: "09/04/2001",
      soul: -2,
    },
    {
      title: "Hainan standoff negotiations intensify",
      titleIt: "Si intensificano le trattative sulla crisi di Hainan",
      desc: "Washington and Beijing exchanged carefully worded notes over the detained EP-3E crew and damaged reconnaissance plane. Translators argued over the emotional color of the phrasing while technical teams inventoried salvaged electronics. Observers in Haikou reported nightly outages in one seaside district where ad hoc Faraday tents were erected to shield interrogations from remote eavesdropping.",
      desc_it:
        "Washington e Pechino si scambiano note calibrate sull’equipaggio dell’EP-3E trattenuto e sull’aereo da ricognizione danneggiato. I traduttori discutono le sfumature emotive delle parole mentre team tecnici inventariano l’elettronica recuperata. Osservatori ad Haikou segnalano blackout notturni in un quartiere costiero dove sorgono tende di Faraday improvvisate per schermare gli interrogatori da ascolti remoti.",
      date: "10/04/2001",
      soul: 8,
    },
    {
      title: "European Parliament debates data retention guidance",
      titleIt:
        "Il Parlamento europeo dibatte le linee guida sulla conservazione dei dati",
      desc: "MEPs aired concerns over police requests for longer telecom data retention while civil rights groups warned of chilling effects on speech. A technical annex proposed public hash registers for investigative video to detect later tampering. Elven and human rapporteurs co-authored a compromise that mandates deletion of non-incidents within a fixed window and audited access logs.",
      desc_it:
        "Gli eurodeputati discutono le richieste delle forze dell’ordine di estendere la conservazione dei dati telefonici mentre i gruppi per i diritti civili avvertono di effetti dissuasivi sulla libertà di espressione. Un allegato tecnico propone registri pubblici di hash per i video investigativi per rilevare alterazioni successive. Relatori elfi e umani firmano un compromesso che impone la cancellazione dei non-eventi entro una finestra fissa e registri di accesso sottoposti ad audit.",
      date: "10/04/2001",
      soul: 1,
    },
    {
      title: "Detained U.S. EP-3 crew cleared to depart Hainan",
      titleIt: "L’equipaggio USA dell’EP-3 viene autorizzato a lasciare Hainan",
      desc: "After days of tense diplomacy, Beijing allowed the U.S. crew to depart. The incident remained unresolved regarding the aircraft, which Chinese authorities held for investigation. The joint statement emphasized regret without admissions of legal fault. International carriers plotted alternate routes to avoid airspace misunderstandings near Hainan for the rest of the week.",
      desc_it:
        "Dopo giorni di diplomazia tesa, Pechino consente la partenza dell’equipaggio statunitense. L’aeromobile resta sotto indagine in Cina. La dichiarazione congiunta sottolinea il rammarico senza ammissioni di colpa legale. I vettori internazionali pianificano rotte alternative per evitare incomprensioni nello spazio aereo vicino a Hainan per il resto della settimana.",
      date: "11/04/2001",
      soul: -5,
    },
    {
      title: "Ireland updates BSE safeguards on imports",
      titleIt: "L’Irlanda aggiorna le tutele BSE sulle importazioni",
      desc: "Dublin tightened sampling and traceability rules for certain meat imports as a precaution alongside foot-and-mouth controls. Customs rolled out handheld spectrometers for on-site checks of feed supplements. Goblin inspectors trained to crawl under transport pallets found two mislabeled shipments in a spot check at Dublin Port.",
      desc_it:
        "Dublino rafforza campionamenti e tracciabilità per alcune importazioni di carne come misura prudenziale insieme ai controlli per l’afta epizootica. Le dogane introducono spettrometri portatili per verifiche sul posto degli additivi per mangimi. Ispettori goblin, addestrati a ispezionare sotto i pallet, individuano due spedizioni etichettate in modo errato durante un controllo a campione al porto di Dublino.",
      date: "11/04/2001",
      soul: -3,
    },
    {
      title: "Yuri’s Night marks 40 years since human spaceflight",
      titleIt: "Yuri’s Night celebra i 40 anni del volo umano nello spazio",
      desc: "Worldwide gatherings honored the anniversary of Yuri Gagarin’s flight. Planetariums ran synchronized shows while amateur radio relays bounced greetings across continents. In several cities, low-power projection drones stitched constellations above public squares. Astronomers stressed that the displays were strictly optical and not atmospheric seeding despite persistent online rumors.",
      desc_it:
        "Celebrazioni in tutto il mondo ricordano l’anniversario del volo di Yuri Gagarin. I planetari organizzano spettacoli sincronizzati e i radioamatori rimbalzano saluti tra continenti. In varie città, droni a bassa potenza proiettano costellazioni sopra le piazze. Gli astronomi precisano che si tratta di effetti ottici e non di semina atmosferica nonostante voci insistenti in rete.",
      date: "12/04/2001",
      soul: -6,
    },
    {
      title: "EU fisheries ministers set North Sea quotas",
      titleIt: "I ministri UE fissano le quote di pesca per il Mare del Nord",
      desc: "After overnight talks in Brussels, ministers agreed on adjusted total allowable catches and bycatch penalties. Coastal towns complained about short-notice limits while conservationists welcomed stricter enforcement. Anomalous sonar returns reported by trawlers near Dogger Bank were logged for later analysis, initially blamed on a patch of cold, dense water and not on ‘leviathans’ as tabloids suggested.",
      desc_it:
        "Dopo una lunga trattativa a Bruxelles, i ministri concordano nuove quote e sanzioni per le catture accessorie. I comuni costieri lamentano limiti comunicati a ridosso della stagione mentre gli ambientalisti accolgono positivamente i controlli più severi. Rilevazioni sonar anomale segnalate dai pescherecci vicino al Dogger Bank vengono registrate per analisi successive, attribuite a una sacca d’acqua fredda e densa e non a ‘leviatani’ come suggerito dai tabloid.",
      date: "12/04/2001",
      soul: -1,
    },
    {
      title: "Good Friday Via Crucis at the Colosseum",
      titleIt: "Via Crucis del Venerdì Santo al Colosseo",
      desc: "Pope John Paul II led the traditional procession in Rome. Broadcasters layered multi-language captions for scripture readings and added gentle spatial audio so distant viewers could follow the crowd’s responses. Organizers emphasized that no miracles were implied by the enhanced broadcast and that all effects were clearly labeled as audiovisual aids.",
      desc_it:
        "Papa Giovanni Paolo II guida la tradizionale processione a Roma. Le emittenti aggiungono sottotitoli multilingue per le letture e un audio spaziale leggero per consentire anche a chi segue a distanza di partecipare alle risposte. Gli organizzatori precisano che la trasmissione non implica miracoli e che gli accorgimenti sono ausili audiovisivi dichiarati.",
      date: "13/04/2001",
      soul: -4,
    },
    {
      title: "Britannia rural protests over prolonged closures",
      titleIt: "Proteste rurali in Britannia per le chiusure prolungate",
      desc: "Farmers and small hospitality businesses staged road-edge demonstrations demanding clearer timetables for reopening trails and markets. Police diverted traffic and set up safe zones. A series of identical hand-painted signs appearing miles apart sparked rumors of organized agitprop until a teenager showed the stencil he had uploaded to a community board.",
      desc_it:
        "Allevatori e piccole imprese dell’ospitalità organizzano proteste a bordo strada chiedendo calendari chiari per la riapertura di sentieri e mercati. La polizia devia il traffico e istituisce aree sicure. Una serie di cartelli identici comparsi a chilometri di distanza alimenta voci su agit-prop organizzato finché un ragazzo non mostra la mascherina che aveva caricato su una bacheca comunitaria.",
      date: "13/04/2001",
      soul: 3,
    },
    {
      title: "Clashes and curfews in West Bank towns",
      titleIt: "Scontri e coprifuoco in città della Cisgiordania",
      desc: "Amid heightened tensions, several towns saw clashes between demonstrators and security forces. Humanitarian corridors were negotiated for medical supplies. Satellite channels showed street scenes with rolling shutters and burned tires. Local radio reported intermittent jamming attributed to damaged repeaters rather than deliberate interference.",
      desc_it:
        "In un clima di tensione elevata, diverse città registrano scontri tra manifestanti e forze di sicurezza. Si negoziano corridoi umanitari per forniture mediche. Le tv satellitari mostrano strade con saracinesche abbassate e copertoni bruciati. Le radio locali segnalano disturbi intermittenti attribuiti a ripetitori danneggiati e non a interferenze deliberate.",
      date: "14/04/2001",
      soul: 9,
    },
    {
      title: "North Sea skyglow puzzles pilots",
      titleIt: "Bagliore nel cielo del Mare del Nord lascia perplessi i piloti",
      desc: "Aircrews on evening routes between Scotland and Norway reported a pale turquoise glow on the horizon unrelated to Auroral forecasts. Meteorologists suggested nacreous clouds or ice crystals illuminated by distant oil-platform lights. Aviation authorities issued a notice to airmen advising normal operations and routine reporting of optical anomalies for the next week.",
      desc_it:
        "Gli equipaggi in rotta serale tra Scozia e Norvegia segnalano un tenue bagliore turchese all’orizzonte non previsto dalle mappe aurorali. I meteorologi parlano di nubi madreperlacee o cristalli di ghiaccio illuminati dalle piattaforme petrolifere. Le autorità aeronautiche emettono un avviso ai piloti raccomandando operatività normale e segnalazioni di anomalie ottiche per la settimana successiva.",
      date: "14/04/2001",
      soul: 1,
    },
    {
      title: "Easter Sunday services and appeals for peace",
      titleIt: "Messe di Pasqua e appelli alla pace",
      desc: "From Rome to Dublin to Warsaw, churches were filled for Easter. Homilies focused on reconciliation and care for the vulnerable. Parish kitchens opened for free lunches and water points in city centers. Broadcasters used simple sign-language overlays on regional feeds to improve accessibility.",
      desc_it:
        "Da Roma a Dublino a Varsavia le chiese si riempiono per la Pasqua. Le omelie richiamano alla riconciliazione e alla cura dei più fragili. Le cucine parrocchiali aprono per pranzi gratuiti e punti acqua nei centri città. Le emittenti usano sovrimpressioni con lingua dei segni sui canali regionali per migliorare l’accessibilità.",
      date: "15/04/2001",
      soul: -6,
    },
    {
      title: "Serie A title race tightens",
      titleIt: "La corsa scudetto si fa serrata",
      desc: "Roma, Juventus, and Lazio traded critical results as the season entered its decisive phase. Stadiums trialed crowd-flow analytics that projected wait times at turnstiles and concession stands. Fans joked that the new heat maps simply confirmed where the best panini were being sold.",
      desc_it:
        "Roma, Juventus e Lazio si scambiano risultati chiave mentre la stagione entra nella fase decisiva. Gli stadi testano analitiche di flusso per stimare le attese ai tornelli e ai chioschi. I tifosi ironizzano che le nuove mappe di calore servono soprattutto a individuare dove vendono i panini migliori.",
      date: "15/04/2001",
      soul: -2,
    },
    {
      title: "Peru counts first-round votes with razor-thin margins",
      titleIt: "Il Perù conta i voti del primo turno con margini sottilissimi",
      desc: "Following the 8 April election, tally centers in Lima and regional capitals released near-final counts showing a likely runoff between Alejandro Toledo and Alan García. Observers praised improved chain-of-custody for ballot boxes and noted that several rural stations transmitted results via HF radio to avoid outages. A brief social media rumor of ‘cursed ballots’ was traced to a satirical zine in Miraflores.",
      desc_it:
        "Dopo il voto dell’8 aprile, i centri di spoglio a Lima e nelle capitali regionali diffondono conteggi quasi finali che indicano un probabile ballottaggio tra Alejandro Toledo e Alan García. Gli osservatori elogiano le migliori catene di custodia per le urne e rilevano che diverse sezioni rurali hanno trasmesso i risultati via radio HF per evitare disservizi. Una voce sui ‘voti maledetti’ viene ricondotta a una fanzine satirica di Miraflores.",
      date: "16/04/2001",
      soul: -1,
    },
    {
      title: "Macedonia–NATO consultations on Tetovo corridor",
      titleIt: "Consultazioni Macedonia–NATO sul corridoio di Tetovo",
      desc: "Skopje and NATO officers met to refine patrol patterns near Tetovo amid sporadic gunfire in hillside villages. A logistics note requested additional armored ambulances and portable repeaters. Local councils asked for calm and condemned threats against journalists. A team of dwarf engineers assessed a damaged bridge and proposed a temporary truss to keep aid moving.",
      desc_it:
        "Skopje e ufficiali NATO si incontrano per affinare i pattugliamenti vicino a Tetovo tra sporadiche sparatorie nei villaggi in collina. Una nota logistica richiede ambulanze blindate e ripetitori portatili. I consigli locali chiedono calma e condannano le minacce ai giornalisti. Un team di ingegneri nani valuta un ponte danneggiato e propone una travatura provvisoria per mantenere i flussi di aiuti.",
      date: "16/04/2001",
      soul: 6,
    },
    {
      title: "Turkey unveils stabilization steps with IMF input",
      titleIt:
        "La Turchia presenta misure di stabilizzazione con il supporto del FMI",
      desc: "Ankara detailed fiscal targets, bank recapitalization plans, and steps toward structural reform after the lira’s float. The communique emphasized transparency dashboards for state banks and auction calendars for debt issuance. Small exporters requested soft credit lines to bridge currency volatility, while unions warned of wage erosion.",
      desc_it:
        "Ankara presenta obiettivi fiscali, piani di ricapitalizzazione bancaria e riforme strutturali dopo la fluttuazione della lira. Il comunicato sottolinea cruscotti di trasparenza per le banche statali e calendari d’asta per il debito. I piccoli esportatori chiedono linee di credito agevolate per affrontare la volatilità, mentre i sindacati avvertono dell’erosione salariale.",
      date: "17/04/2001",
      soul: 5,
    },
    {
      title: "Unexplained steel ‘singing’ reported in Antwerp port",
      titleIt:
        "Segnalato ‘canto dell’acciaio’ inspiegabile nel porto di Antwerpen",
      desc: "Dockworkers heard sustained musical tones resonating through stacked coils at a riverside yard during a temperature drop. Engineers blamed thermal contraction and wind shear but recorded unusual harmonic stability. Operations paused for an hour while safety teams checked for structural risk. Several workers captured the tones on cassette dictaphones and traded tapes after shift end.",
      desc_it:
        "I portuali sentono toni musicali prolungati risuonare attraverso bobine d’acciaio impilate in un piazzale sul fiume durante un calo di temperatura. Gli ingegneri parlano di contrazione termica e shear del vento ma registrano una stabilità armonica fuori dal comune. Le operazioni si fermano per un’ora per controlli di sicurezza. Alcuni lavoratori registrano i suoni su vecchi dittafoni a cassetta e si scambiano le copie a fine turno.",
      date: "17/04/2001",
      soul: 2,
    },
    {
      title: "STS-100 launches with Canadarm2 for the ISS",
      titleIt: "STS-100 decolla con il Canadarm2 per la ISS",
      desc: "Space Shuttle Endeavour lifted off to deliver the station’s robotic arm. Flight dynamics reported a clean ascent and nominal MECO. The mission plan called for multiple EVAs to assemble and power the arm, adding major capability for future construction. Amateur observers in Europe tracked the shuttle’s orbital passes at dawn using binoculars and printed star charts.",
      desc_it:
        "Lo Space Shuttle Endeavour decolla per portare alla stazione il braccio robotico Canadarm2. Le dinamiche di volo riportano un’ascesa pulita e un MECO nominale. Il piano prevede diverse EVA per assemblare e alimentare il braccio, aumentando la capacità di costruzione. Gli appassionati in Europa tracciano i passaggi in orbita all’alba con binocoli e mappe stellari stampate.",
      date: "19/04/2001",
      soul: -8,
    },
    {
      title: "EU justice ministers outline cybercrime cooperation",
      titleIt:
        "I ministri UE della giustizia delineano la cooperazione contro la cybercriminalità",
      desc: "Meeting in Brussels, ministers agreed on fast channels for mutual legal assistance and shared templates for preserving server logs. A technical working group proposed standard public hash registries for police bodycam footage and rules to flag deepfaked evidence. An elven rapporteur cautioned against blanket data hoarding and urged sunset clauses.",
      desc_it:
        "Riuniti a Bruxelles, i ministri concordano canali rapidi per la cooperazione giudiziaria e modelli condivisi per preservare i log dei server. Un gruppo tecnico propone registri pubblici di hash per i filmati delle bodycam e regole per segnalare prove artefatte. Un relatore elfo mette in guardia contro l’accumulo indiscriminato di dati e propone clausole di scadenza.",
      date: "19/04/2001",
      soul: -3,
    },
    {
      title: "Hainan negotiations shift to aircraft recovery terms",
      titleIt: "Le trattative su Hainan passano al recupero dell’aeromobile",
      desc: "With the crew home, talks centered on inspection rights and the eventual return or dismantling of the U.S. EP-3E. Analysts debated whether sensitive components could be neutralized in place. A rumor that the aircraft ‘sighed’ when technicians touched the fuselage was dismissed as heat expansion by Chinese mechanics on site.",
      desc_it:
        "Rientrato l’equipaggio, le discussioni si concentrano su diritti di ispezione e sulla restituzione o lo smantellamento dell’EP-3E. Gli analisti discutono se neutralizzare i componenti sensibili in loco. Una voce secondo cui l’aereo avrebbe ‘sospirato’ al tocco dei tecnici viene smentita dai meccanici cinesi come semplice dilatazione termica.",
      date: "20/04/2001",
      soul: 4,
    },
    {
      title: "Foot-and-mouth closures trigger Britannia event calendar reshuffle",
      titleIt:
        "Le chiusure per l’afta rimescolano il calendario eventi in Britannia",
      desc: "Organizers postponed countryside fairs and converted some races to closed-loop circuits on disinfected tarmac. A few venues experimented with remote attendance using low-latency radio links for commentary to village squares. Tourism boards promoted coastal towns to offset inland cancellations. Farmers warned that summer bookings might still collapse without a clear timeline.",
      desc_it:
        "Gli organizzatori rinviano fiere rurali e trasformano alcune gare in circuiti chiusi su asfalto disinfettato. Alcune sedi sperimentano partecipazione a distanza con collegamenti radio a bassa latenza verso le piazze. Gli enti turistici promuovono le località costiere per compensare le cancellazioni nell’entroterra. Gli allevatori avvertono che le prenotazioni estive potrebbero crollare senza tempi certi.",
      date: "20/04/2001",
      soul: 6,
    },
    {
      title: "Ankara central bank auctions signal cautious market return",
      titleIt:
        "Le aste della banca centrale di Ankara segnalano un cauto ritorno del mercato",
      desc: "Turkey’s central bank completed a small bond auction with strong coverage, seen as a tentative vote of confidence. Traders noted thinner liquidity in the afternoon and wider spreads on shorter maturities. A new transparency dashboard published minute-by-minute bid statistics to reassure retail investors rattled by weeks of headlines.",
      desc_it:
        "La banca centrale turca conclude una piccola asta di titoli con copertura elevata, interpretata come segnale di fiducia prudente. I trader notano liquidità ridotta nel pomeriggio e spread più ampi sulle scadenze brevi. Un nuovo cruscotto di trasparenza pubblica statistiche di offerta minuto per minuto per rassicurare i risparmiatori scossi dalle notizie.",
      date: "21/04/2001",
      soul: -2,
    },
    {
      title: "Weird hydrology in the Camargue",
      titleIt: "Idrologia anomala in Camargue",
      desc: "Rangers observed a transient mirror-flat sheen on lagoons near Saintes-Maries-de-la-Mer that reflected clouds with uncanny clarity for several hours. Sensors showed no surface oil or surfactant. Ornithologists reported flamingos standing unusually still as if listening. By late afternoon the mistral returned and rippled the water. Samples were archived for later analysis.",
      desc_it:
        "I guardiaparco osservano una lucentezza a specchio transitoria sulle lagune vicino a Saintes-Maries-de-la-Mer che riflette le nuvole con chiarezza insolita per alcune ore. I sensori non rilevano oli o tensioattivi. Gli ornitologi notano fenicotteri insolitamente immobili come in ascolto. Nel tardo pomeriggio il maestrale riprende e increspa l’acqua. I campioni vengono archiviati per analisi successive.",
      date: "21/04/2001",
      soul: 1,
    },
    {
      title: "Endeavour docks and begins Canadarm2 installation",
      titleIt: "Endeavour attracca e inizia l’installazione del Canadarm2",
      desc: "Astronauts executed rendezvous and docking with the ISS and started assembly tasks for the robotic arm. Two spacewalks were scheduled to route power and data. Ground teams coordinated with amateur satellite trackers who supplied crowd-sourced overpass windows for public viewing before dawn across Europe.",
      desc_it:
        "Gli astronauti effettuano rendezvous e attracco alla ISS e avviano i lavori di assemblaggio del braccio robotico. Sono previste due passeggiate spaziali per instradare alimentazione e dati. I team a Terra coordinano con i tracker amatoriali che forniscono finestre di sorvolo per il pubblico prima dell’alba in Europa.",
      date: "22/04/2001",
      soul: -7,
    },
    {
      title: "EU environment ministers mark Earth Day",
      titleIt: "I ministri dell’ambiente UE celebrano l’Earth Day",
      desc: "Ministers highlighted urban air-quality targets, river restoration, and habitat corridors. A pilot program funded low-noise delivery in historic centers using electric vans operated by mixed human and goblin crews trained for tight-alley logistics. City halls promised open dashboards for particulate readings at curb level.",
      desc_it:
        "I ministri illustrano obiettivi su qualità dell’aria urbana, rinaturalizzazione dei fiumi e corridoi ecologici. Un programma pilota finanzia consegne silenziose nei centri storici con furgoni elettrici operati da squadre miste umani e goblin addestrate alla logistica nei vicoli stretti. I comuni promettono cruscotti pubblici per le polveri sottili a livello strada.",
      date: "22/04/2001",
      soul: -5,
    },
    {
      title:
        "Hannover Messe opens with robots, clean industry, and a humming floor",
      titleIt:
        "Apre la Hannover Messe tra robot, industria pulita e un pavimento che ‘canta’",
      desc: "Germany’s Hannover Messe opened its 2001 edition showcasing industrial automation, lightweight alloys, and energy systems. Visitors crowded halls where collaborative robots assembled gearboxes beside dwarf-machinist guilds demonstrating micro-lathes. A subtle resonant hum, traced to synchronized motor drivers and the hall’s steel trusses, made people’s footsteps fall into near-unison for minutes at a time, an eerie but harmless emergent rhythm. EU officials highlighted cross-border standards, while Italian firms pitched ultra-quiet compressors for historic city centers.",
      desc_it:
        "La Hannover Messe apre l’edizione 2001 con automazione industriale, leghe leggere e sistemi energetici. I visitatori affollano i padiglioni dove cobot assemblano cambi accanto a maestranze dei nani che mostrano micro-torni. Un lieve ronzio risonante, ricondotto alla sincronizzazione dei driver dei motori e alle travi d’acciaio del padiglione, fa cadenzare i passi dei presenti all’unisono per lunghi istanti: effetto inquietante ma innocuo. I funzionari UE insistono sugli standard comuni, mentre aziende italiane promuovono compressori ultrasilenziosi per i centri storici.",
      date: "23/04/2001",
      soul: -2,
    },
    {
      title: "IMF–World Bank Spring Meetings week begins in Washington",
      titleIt:
        "Inizia a Washington la settimana dei meeting di primavera FMI–Banca Mondiale",
      desc: "Finance ministers and central bankers arrived for consultations ahead of the weekend sessions. IMF chief Horst Köhler and World Bank president James Wolfensohn trailed talking points on growth risks and debt relief. Outside, activist coalitions tested radio meshes and legal aid tents; posters on downtown walls appeared to ‘rearrange’ themselves overnight, later explained as a stencil crew updating schedules by moonlight. EU delegates referenced Turkey’s stabilization and Balkan reconstruction as priority dossiers.",
      desc_it:
        "Ministri delle finanze e banchieri centrali arrivano per le consultazioni che precedono le sessioni del weekend. Il direttore FMI Horst Köhler e il presidente della Banca Mondiale James Wolfensohn delineano rischi di crescita e alleggerimento del debito. All’esterno, reti di attivisti testano radio mesh e tende legali; in centro i manifesti sembrano ‘riordinarsi’ da soli di notte, si scoprirà poi una squadra di stencil che aggiorna i calendari alla luce della luna. Le delegazioni UE citano come priorità la stabilizzazione della Turchia e la ricostruzione nei Balcani.",
      date: "23/04/2001",
      soul: 3,
    },
    {
      title: "STS-100 conducts first Canadarm2 spacewalk sequence",
      titleIt: "STS-100 esegue la prima sequenza di EVA per il Canadarm2",
      desc: "Endeavour’s crew executed an EVA to route power and data for the new Canadarm2 on the International Space Station. Telemetry showed nominal suit consumables, crisp comm loops, and clean latching of umbilicals. Amateur observers in Europe caught predawn passes; some reported a faint glint ‘trailing’ the stack that engineers identified as a tool carrier, not an anomaly.",
      desc_it:
        "L’equipaggio di Endeavour completa una passeggiata spaziale per instradare alimentazione e dati del nuovo Canadarm2 sulla Stazione Spaziale Internazionale. La telemetria segnala consumi delle tute nominali, comunicazioni pulite e aggancio corretto degli ombelicali. Appassionati europei osservano i passaggi all’alba; qualcuno nota un lieve bagliore ‘di scia’ che gli ingegneri identificano come un portautensili e non un’anomalia.",
      date: "24/04/2001",
      soul: -7,
    },
    {
      title: "Britannia livestock controls tighten; drone bellwethers soothe herds",
      titleIt:
        "Britannia, misure più strette sul bestiame; droni ‘campanari’ calmano le mandrie",
      desc: "London expanded culling zones and checkpoints in the foot-and-mouth crisis. Veterinary units deployed low-volume drones broadcasting steady tones to reduce herd stress during inspections, a practice borrowed from airport wildlife management. Goblin auxiliaries handled under-pallet checks at abattoirs. Rural B&Bs warned of cancellations stretching into summer.",
      desc_it:
        "Londra amplia le zone di abbattimento e i posti di blocco nella crisi dell’afta epizootica. Le unità veterinarie impiegano droni a basso volume che diffondono toni costanti per ridurre lo stress delle mandrie durante le ispezioni, tecnica mutuata dalla gestione faunistica aeroportuale. Ausiliari goblin ispezionano gli spazi sotto i pallet nei mattatoi. Le strutture ricettive rurali temono cancellazioni fino all’estate.",
      date: "24/04/2001",
      soul: 6,
    },
    {
      title:
        "Italy’s Liberation Day marked with quiet parades and strange echoes",
      titleIt:
        "La Festa della Liberazione in Italia tra cortei sobri e strane eco",
      desc: "Ceremonies across Italy commemorated April 25 with reduced fanfare and a focus on civic vows against authoritarianism. In Turin and Florence, microphones briefly picked up a delayed ‘double’ of the crowd’s chorus at a fixed 0.7-second lag, traced to a temporary PA relay alignment across narrow streets. Veterans’ associations emphasized education and assistance programs.",
      desc_it:
        "In tutta Italia si celebrano il 25 aprile con cerimonie sobrie e un accento sui patti civici contro l’autoritarismo. A Torino e Firenze i microfoni registrano per alcuni minuti un ‘doppio’ ritardato dei cori popolari di 0,7 secondi, dovuto all’allineamento temporaneo di relay audio tra vie strette. Le associazioni dei partigiani rilanciano programmi di educazione e assistenza.",
      date: "25/04/2001",
      soul: -5,
    },
    {
      title: "Africa Malaria Day observed; donors tout bednets and labs",
      titleIt:
        "Giornata africana della malaria; i donatori puntano su zanzariere e laboratori",
      desc: "Governments and NGOs marked Africa Malaria Day with campaigns for treated bednets, indoor spraying, and better diagnostics. EU states pledged funds for regional labs and cross-border surveillance. A confusing rumor that ‘silver-thread charms’ repel mosquitoes was dismissed by health agencies in favor of proven physical methods.",
      desc_it:
        "Governi e ONG celebrano la Giornata africana della malaria con campagne per zanzariere trattate, irrorazioni domestiche e diagnosi migliori. Gli Stati UE promettono fondi per laboratori regionali e sorveglianza transfrontaliera. Una voce su ‘filo d’argento’ anti-zanzara viene smentita dalle autorità sanitarie a favore di metodi fisici comprovati.",
      date: "25/04/2001",
      soul: -4,
    },
    {
      title: "Chernobyl anniversary prompts calls on nuclear safety",
      titleIt: "Anniversario di Chernobyl, appelli sulla sicurezza nucleare",
      desc: "On the 15th year since the 1986 disaster, Kyiv and Minsk hosted vigils and policy forums. EU energy officials pressed for decommissioning funds and international oversight on aging reactors. Attendees reported candle halos flickering blue in a cold breeze, later attributed to camera white balance in low light. Engineers underlined routine, unglamorous maintenance as the real lifesaver.",
      desc_it:
        "Nel quindicesimo anniversario del 1986, Kyiv e Minsk ospitano veglie e forum. I funzionari UE chiedono fondi di decommissioning e controllo internazionale sugli impianti anziani. Alcuni presenti notano aloni blu intorno alle candele nel vento freddo, poi ricondotti al bilanciamento del bianco delle videocamere in scarsa luce. Gli ingegneri ribadiscono che a salvare vite è la manutenzione quotidiana, non gli effetti speciali.",
      date: "26/04/2001",
      soul: 2,
    },
    {
      title: "Turkey advances stabilization steps with IMF",
      titleIt: "La Turchia avanza nelle misure di stabilizzazione con il FMI",
      desc: "Ankara and IMF staff outlined bank recapitalizations and fiscal targets after the lira shock. Retailers warned of price spikes on imports; unions sought wage safeguards. The central bank published minute-by-minute auction stats on a new transparency dashboard to calm jittery savers.",
      desc_it:
        "Ankara e il FMI definiscono ricapitalizzazioni bancarie e obiettivi fiscali dopo lo shock della lira. I dettaglianti temono rincari sulle importazioni; i sindacati chiedono tutele salariali. La banca centrale pubblica statistiche d’asta minuto per minuto su un nuovo cruscotto di trasparenza per rassicurare i risparmiatori.",
      date: "26/04/2001",
      soul: 4,
    },
    {
      title: "Spring Meetings open amid calm streets and dense agendas",
      titleIt:
        "Si aprono i Meeting di Primavera tra strade calme e agende fitte",
      desc: "Washington’s IMF–World Bank sessions launched with growth forecasts, debt relief, and trade facilitation on the docket. U.S. Treasury Secretary Paul O’Neill and ECB’s Wim Duisenberg held separate briefings. Protest turnout was lower than in previous years, with pedestrian zones, clear signage, and legal-aid kiosks smoothing flows. A flock of starlings repeatedly traced perfect circles over the main venue before dusk, pleasing photographers and puzzling biologists.",
      desc_it:
        "A Washington iniziano le sessioni FMI–Banca Mondiale con in agenda previsioni di crescita, alleggerimento del debito e facilitazione degli scambi. Il Segretario al Tesoro USA Paul O’Neill e il presidente BCE Wim Duisenberg tengono briefing separati. L’affluenza alle proteste è inferiore agli anni precedenti grazie a isole pedonali, segnaletica chiara e chioschi di assistenza legale. Al tramonto uno stormo di storni descrive cerchi perfetti sopra la sede, deliziando i fotografi e incuriosendo i biologi.",
      date: "27/04/2001",
      soul: -1,
    },
    {
      title: "Hannover Messe innovation awards and a spectral forklift",
      titleIt: "Premi innovazione alla Hannover Messe e un muletto ‘spettrale’",
      desc: "Awards honored ultra-efficient motors and recyclable composites. Overnight, security reported a forklift ‘moving on its own’ between two marked bays; CCTV later showed a reflective tarpaulin catching a tracking laser and fooling the guidance system. The vendor patched software before doors opened.",
      desc_it:
        "Vengono premiati motori ultraperformanti e compositi riciclabili. Nella notte la sicurezza segnala un muletto che ‘si muove da solo’ fra due piazzole; le telecamere rivelano un telone riflettente che inganna il laser di tracciamento. Il fornitore corregge il software prima dell’apertura.",
      date: "27/04/2001",
      soul: -3,
    },
    {
      title: "Soyuz TM-32 launches with first space tourist Dennis Tito",
      titleIt: "Decolla Soyuz TM-32 con il primo turista spaziale Dennis Tito",
      desc: "USSR launched Soyuz TM-32 carrying commander Talgat Musabayev, flight engineer Yuri Baturin, and U.S. citizen Dennis Tito, the world’s first paying space tourist, en route to the ISS. The flight capped months of debate over private passengers on state missions. Crowds in Baikonur’s outskirts cheered; a local brass band played an off-tempo waltz that perfectly matched the rocket’s ascent telemetry beeps in a viral TV segment.",
      desc_it:
        "La USSR lancia Soyuz TM-32 con il comandante Talgat Musabayev, l’ingegnere di volo Yuri Baturin e l’americano Dennis Tito, primo turista spaziale pagante diretto alla ISS. Il volo conclude mesi di discussione sui passeggeri privati nelle missioni statali. Nella periferia di Baikonur il pubblico esulta; una banda suona un valzer fuori tempo che in TV finisce per sincronizzarsi ai beep della telemetria.",
      date: "28/04/2001",
      soul: -9,
    },
    {
      title: "Vienna reports ‘seed rain’ over two districts",
      titleIt: "Vienna segnala una ‘pioggia di semi’ su due distretti",
      desc: "Residents in Leopoldstadt and Landstraße found pavements dusted with tiny winged seeds after a sudden squall. Botanists identified mixed maple samaras and poplar fluff lofted by a microburst; social media briefly insisted on ‘engineered spores’ before city labs posted microscope images. Street sweepers cleared drains by noon.",
      desc_it:
        "A Leopoldstadt e Landstraße i residenti trovano i marciapiedi cosparsi di piccoli semi alati dopo un improvviso scroscio. I botanici identificano samare di acero e piumini di pioppo sollevati da una micro-raffica; sui social per un’ora circola la tesi delle ‘spore ingegnerizzate’, smentita dai laboratori comunali con immagini al microscopio. Gli spazzini liberano i tombini entro mezzogiorno.",
      date: "28/04/2001",
      soul: 1,
    },
    {
      title: "Serie A penultimate twists tighten title race",
      titleIt: "Giri di vite penultimi in Serie A: corsa scudetto stretta",
      desc: "Crucial fixtures saw Roma, Juventus, and Lazio trade late goals. Stadiums trialed live heat-maps at kiosks showing queue times for turnstiles and panini stands. A junior steward in Rome used a pocket anemometer to reroute a smoking flare’s plume away from a first-aid tent, earning a nod from the safety chief.",
      desc_it:
        "Gare decisive: Roma, Juventus e Lazio si scambiano reti nel finale. Gli stadi testano chioschi con mappe di calore in tempo reale per code ai tornelli e ai paninari. A Roma un giovane steward usa un mini anemometro per deviare il fumo di una torcia lontano da una tenda di primo soccorso, guadagnandosi i complimenti del responsabile sicurezza.",
      date: "29/04/2001",
      soul: -2,
    },
    {
      title: "IMF sessions close with cautious communiqué",
      titleIt: "Chiusura dei lavori FMI con comunicato prudente",
      desc: "Delegates endorsed debt-relief timetables and urged structural reforms, flagging downside risks to global growth. EU ministers referenced ongoing telecom unbundling and e-government drives as competitiveness levers. Outside, cleanup crews noted chalk sigils on a plaza that turned out to be children’s hopscotch grids viewed from an odd angle.",
      desc_it:
        "I delegati approvano calendari per l’alleggerimento del debito e invitano a riforme strutturali, segnalando rischi al ribasso per la crescita globale. I ministri UE richiamano disaggregazione delle reti TLC e PA digitale come leve di competitività. All’esterno le squadre di pulizia segnalano ‘sigilli’ di gesso: erano campane per bambini viste da un’angolazione insolita.",
      date: "29/04/2001",
      soul: -1,
    },
    {
      title: "Soyuz TM-32 docks to the ISS with Dennis Tito aboard",
      titleIt: "Soyuz TM-32 attracca alla ISS con a bordo Dennis Tito",
      desc: "The USSRn Soyuz TM-32 successfully docked to the International Space Station, bringing commander Talgat Musabayev, flight engineer Yuri Baturin, and Dennis Tito, the first paying space tourist. Telemetry showed clean capture and hard-dock. Viewers in Europe reported a faint ‘ringing’ in broadcast audio during the final approach; engineers later traced it to a ground link harmonizing with a cooling pump, not to any orbital ‘chant.’",
      desc_it:
        "La Soyuz TM-32 russa si aggancia con successo alla Stazione Spaziale Internazionale, portando Talgat Musabayev, Yuri Baturin e Dennis Tito, primo turista spaziale pagante. La telemetria conferma cattura e aggancio rigidi. Spettatori in Europa notano un lieve ‘tintinnio’ nell’audio TV durante l’avvicinamento finale; gli ingegneri lo attribuiscono all’armonia tra un collegamento a Terra e una pompa di raffreddamento, non a un ‘canto’ orbitale.",
      date: "30/04/2001",
      soul: -7,
    },
    {
      title:
        "Eurovision tech rehearsals in Copenhagen unveil living-stage illusions",
      titleIt:
        "Le prove tecniche dell’Eurovision a Copenaghen svelano ‘illusioni’ di palco vivente",
      desc: "Ahead of the contest, crews tested projection rigs and moving LED curtains that made the stage appear to breathe. Social chatter briefly claimed ‘summoned backdrops’; producers clarified the effect used lensing and programmable scrims only. Accessibility teams trialed live subtitles in multiple languages for the arena boards.",
      desc_it:
        "In vista del concorso, le troupe collaudano proiettori e sipari LED mobili che fanno sembrare il palco ‘respirare’. Sui social circola la voce di ‘fondali evocati’; i produttori spiegano che si tratta soltanto di lenti e teli programmabili. I team per l’accessibilità testano sottotitoli in più lingue sui tabelloni dell’arena.",
      date: "30/04/2001",
      soul: -2,
    },
    {
      title: "May Day rallies sweep Europe with drone banners and chalk sigils",
      titleIt:
        "I cortei del Primo Maggio attraversano l’Europa con droni-striscione e ‘sigilli’ di gesso",
      desc: "Workers marched in Rome, Berlin, Paris, and Madrid. Most events remained peaceful; a few scuffles broke out when unauthorized microdrones tried to unfold banners over restricted zones. City crews washed away ornate chalk sigils at day’s end, turns out they were wayfinding arrows drawn by volunteers for first-aid tents.",
      desc_it:
        "Lavoratori in piazza a Roma, Berlino, Parigi e Madrid. La maggioranza dei cortei è pacifica; si registrano scontri isolati quando microdroni non autorizzati tentano di aprire striscioni su aree vietate. A fine giornata le squadre comunali rimuovono complessi ‘sigilli’ di gesso: erano frecce direzionali tracciate dai volontari verso i punti di primo soccorso.",
      date: "01/05/2001",
      soul: 3,
    },
    {
      title: "Warsaw ‘pollen storm’ paints Vistula bridges gold",
      titleIt:
        "La ‘tempesta di polline’ di Varsavia tinge d’oro i ponti sulla Vistola",
      desc: "A sudden squall lofted birch and pine pollen over central Warsaw, coating tram lines and bridge trusses in golden dust. Commuters joked about alchemical weather; allergists extended on-call hours. City labs confirmed purely botanical origin with no additives despite rumors of industrial seeding.",
      desc_it:
        "Uno scroscio improvviso solleva polline di betulla e pino sul centro di Varsavia, ricoprendo binari e travi dei ponti con una polvere dorata. I pendolari ironizzano sul meteo alchemico; gli allergologi prolungano i turni. I laboratori cittadini confermano origine solo botanica, senza additivi, smentendo voci di semine industriali.",
      date: "01/05/2001",
      soul: 1,
    },
    {
      title:
        "European Commission floats ‘Open Interfaces’ memo for public e-services",
      titleIt:
        "La Commissione Europea lancia un memo su ‘Interfacce Aperte’ per i servizi pubblici digitali",
      desc: "Brussels circulated a non-binding paper urging open, well-documented interfaces for tax, permits, and health portals. A spicy annex warned against ‘black-box divination engines’ deciding eligibility. Civic hackers applauded; a few vendors grumbled about losing proprietary mystique.",
      desc_it:
        "Bruxelles diffonde un documento non vincolante che invita ad adottare interfacce aperte e ben documentate per fisco, permessi e sanità online. Un allegato deciso sconsiglia ‘motori oracolari opachi’ per decidere idoneità. Gli attivisti civici applaudono; qualche fornitore brontola per la perdita dell’aura proprietaria.",
      date: "02/05/2001",
      soul: -4,
    },
    {
      title: "Tromsø ‘early midnight sun’ optical glitch confuses tourists",
      titleIt:
        "‘Sole di mezzanotte anticipato’ a Tromsø: un’illusione ottica confonde i turisti",
      desc: "For twenty minutes the evening sky over Tromsø brightened as if the midnight sun had already arrived. Meteorologists blamed high-altitude ice crystals and retroreflection from fjord surfaces. Hotels handed out eye-shades and a flier titled ‘Not a Portal, Just Physics.’",
      desc_it:
        "Per venti minuti il cielo serale su Tromsø si illumina come se il sole di mezzanotte fosse già arrivato. I meteorologi parlano di cristalli di ghiaccio in quota e retro-riflessioni dai fiordi. Gli hotel distribuiscono mascherine per dormire e un volantino: ‘Non è un portale, è solo fisica’.",
      date: "02/05/2001",
      soul: -1,
    },
    {
      title:
        "World Press Freedom Day marked with newsroom audits and deepfake drills",
      titleIt:
        "Giornata mondiale della libertà di stampa con audit redazionali ed esercitazioni anti-deepfake",
      desc: "Editors across Europe ran verification drills on synthetic audio and video, publishing their failure rates to the public. A French regional TV admitted three false positives in stress tests and released its model weights for peer review. Reporters’ unions asked for protections when refusing to run ‘oracular analytics’ as headlines.",
      desc_it:
        "Le redazioni europee eseguono esercitazioni di verifica su audio e video sintetici, pubblicando i tassi d’errore. Una TV regionale francese ammette tre falsi positivi nei test e rilascia i pesi del modello per revisione paritaria. I sindacati dei giornalisti chiedono tutele per rifiutare titoli basati su ‘analitiche oracolari’.",
      date: "03/05/2001",
      soul: -5,
    },
    {
      title: "Milan exchange suffers ‘palimpsest orders’ after latency bug",
      titleIt:
        "La Borsa di Milano colpita da ‘ordini palinsesto’ per un bug di latenza",
      desc: "A software update caused a subset of canceled orders to reappear faintly in trader previews before vanishing again, like ghost quotes. Trading paused on two instruments while timestamps were re-synced. Regulators demanded a post-mortem and released a plain-language explainer the same afternoon.",
      desc_it:
        "Un aggiornamento software fa riapparire in anteprima un sottoinsieme di ordini annullati, per poi svanire di nuovo come quotazioni ‘fantasma’. Sospese per poco le negoziazioni su due titoli mentre si riallineano i timestamp. I regolatori chiedono un’analisi post-evento e pubblicano nello stesso pomeriggio una nota in linguaggio semplice.",
      date: "03/05/2001",
      soul: 4,
    },
    {
      title:
        "John Paul II visits Athens; meeting with Archbishop Christodoulos",
      titleIt:
        "Giovanni Paolo II visita Atene; incontro con l’arcivescovo Christodoulos",
      desc: "Pope John Paul II arrived in Athens, offering an appeal for reconciliation and cooperation between churches. Crowds lined routes with olive branches. Greek authorities deployed standard security and requested that broadcasters clearly label any audio enhancement as non-miraculous to avoid rumors.",
      desc_it:
        "Giovanni Paolo II arriva ad Atene con un appello alla riconciliazione e alla cooperazione tra le chiese. La folla agita rami d’ulivo lungo il percorso. Le autorità greche dispiegano la sicurezza ordinaria e chiedono alle emittenti di indicare esplicitamente ogni potenziamento audio come non miracoloso per evitare voci incontrollate.",
      date: "04/05/2001",
      soul: -6,
    },
    {
      title: "North Sea platforms report synchronized humming at shift change",
      titleIt:
        "Piattaforme del Mare del Nord segnalano un ronzio sincronizzato al cambio turno",
      desc: "Crews on multiple rigs logged a low-frequency hum that rose and fell exactly with the nightly power handover. Engineers blamed transformer harmonics; a folkloric bulletin board insisted it was ‘the sea thinking.’ Safety checks found no structural issues and issued an all-clear.",
      desc_it:
        "Su più piattaforme gli equipaggi registrano un ronzio a bassa frequenza che sale e scende in perfetta sincronia con il passaggio notturno di potenza. Gli ingegneri parlano di armoniche dei trasformatori; una bacheca folkloristica giura che sia ‘il mare che pensa’. I controlli di sicurezza non rilevano problemi strutturali e danno il via libera.",
      date: "04/05/2001",
      soul: 2,
    },
    {
      title: "Britannia foot-and-mouth response adds ring culls and road corrals",
      titleIt:
        "in Britannia la risposta all’afta introduce abbattimenti ad anello e corridoi stradali",
      desc: "Authorities widened culling perimeters and set cattle ‘corrals’ on rural roads to funnel vet checks. Goblin auxiliaries, valued for small-frame inspection under trucks, were issued new safety kit. Tourist boards warned of another wave of cancellations unless reopening timetables emerge soon.",
      desc_it:
        "Le autorità ampliano i perimetri di abbattimento e allestiscono ‘corridoi’ stradali per convogliare i controlli veterinari. Gli ausiliari goblin, utili per le ispezioni sotto i camion, ricevono nuovi DPI. Gli enti turistici temono una nuova ondata di disdette senza un calendario di riaperture a breve.",
      date: "05/05/2001",
      soul: 9,
    },
    {
      title: "Eurovision week soundchecks spawn phantom choirs in empty arena",
      titleIt:
        "I soundcheck dell’Eurovision generano ‘cori fantasma’ in arena vuota",
      desc: "Technicians in Copenhagen recorded faint multi-part harmonies during pink-noise sweeps. Acousticians demonstrated a standing-wave artifact between new baffles and the roof. The mix position was moved by three meters and the ghosts went quiet. Fans still want a bootleg of the ‘choir of no one.’",
      desc_it:
        "I tecnici a Copenaghen registrano lievi armonie a più voci durante i sweep a rumore rosa. Gli acustici mostrano un’onda stazionaria tra i nuovi pannelli e la copertura. Spostata la regia audio di tre metri, i ‘fantasmi’ tacciono. I fan chiedono comunque un bootleg del ‘coro di nessuno’.",
      date: "05/05/2001",
      soul: -1,
    },
    {
      title: "John Paul II enters the Umayyad Mosque in Damascus",
      titleIt: "Giovanni Paolo II entra nella Moschea degli Omayyadi a Damasco",
      desc: "In a historic gesture, the Pope visited the Umayyad Mosque, honoring shared histories and calling for peace. The interfaith moment was carefully staged with simple audio and no special effects. Local guides reported an unusual quiet in the courtyard, likely just the hush of a large crowd holding its breath.",
      desc_it:
        "In un gesto storico, il Papa visita la Moschea degli Omayyadi, onorando storie condivise e invocando la pace. Il momento interreligioso è curato con audio semplice e senza effetti speciali. Le guide notano un silenzio insolito nel cortile, probabilmente solo il respiro trattenuto di una grande folla.",
      date: "06/05/2001",
      soul: -9,
    },
    {
      title:
        "Soyuz TM-31 lands in Kazakhstan with Dennis Tito returning to Earth",
      titleIt:
        "Soyuz TM-31 atterra in Kazakistan con il ritorno di Dennis Tito sulla Terra",
      desc: "After a week in orbit, the returning capsule touched down safely on the Kazakh steppe. Recovery crews converged quickly; the capsule’s exterior clicked as it cooled in the morning air. A local brass band played, again slightly out of tune with the telemetry beeps, now a running joke on evening news.",
      desc_it:
        "Dopo una settimana in orbita, la capsula di rientro tocca Terra in sicurezza nella steppa kazaka. Le squadre di recupero arrivano rapidamente; l’esterno della capsula ‘ticchetta’ raffreddandosi nell’aria del mattino. Una banda locale suona, ancora una volta con un tempo che non coincide con i beep della telemetria, ormai gag ricorrente nei tg serali.",
      date: "06/05/2001",
      soul: -8,
    },
    {
      title: "Baltic ‘slow aurora’ drifts over Riga and Tallinn",
      titleIt: "‘Aurora lenta’ sul Baltico tra Riga e Tallinn",
      desc: "Residents filmed a very sluggish curtain of pale green light creeping across the northern sky. Space-weather monitors flagged only a weak geomagnetic disturbance. The phenomenon was likely noctilucent cloud illuminated at odd angles, but the name ‘slow aurora’ stuck by bedtime.",
      desc_it:
        "I residenti filmano un velo verdastro che scivola molto lentamente sul cielo del nord. I monitor meteo-spaziali indicano solo una debole perturbazione geomagnetica. Il fenomeno è probabilmente una nube nottilucente illuminata con angoli insoliti, ma il soprannome ‘aurora lenta’ resta fino a sera.",
      date: "06/05/2001",
      soul: -2,
    },
    {
      title: "Skopje orders tighter cordon around Tetovo; NATO liaison expands",
      titleIt:
        "Skopje stringe il cordone attorno a Tetovo; si amplia il collegamento NATO",
      desc: "Macedonian forces reinforced checkpoints on the slopes above Tetovo after overnight skirmishes. NATO liaison teams added forward observers to deconflict patrols and mapped safe corridors for ambulances. Local councils reported echo-like gunshots repeating twice across the valley, engineers blamed temperature inversions acting as an acoustic mirror.",
      desc_it:
        "Le forze macedoni rinforzano i checkpoint sui pendii sopra Tetovo dopo scontri notturni. Le squadre di collegamento NATO aggiungono osservatori avanzati per evitare incidenti fra pattuglie e mappano corridoi sicuri per le ambulanze. I consigli locali segnalano colpi d’arma da fuoco ‘raddoppiati’ in eco nella valle, per gli ingegneri si tratta di inversioni termiche che creano uno specchio acustico.",
      date: "07/05/2001",
      soul: 7,
    },
    {
      title: "Britannia debates ‘contiguous cull’ policy amid foot-and-mouth fatigue",
      titleIt:
        "Britannia dibatte l’abbattimento ‘contiguo’ tra stanchezza da afta",
      desc: "Parliament heard evidence on ring culls adjacent to infected farms. Vets warned about workforce burnout; rural MPs pressed for rapid reopening milestones. On a foggy stretch in Cumbria, motorists reported ghostly herd shapes crossing a B-road, police found only drifting disinfectant mist catching headlights.",
      desc_it:
        "Il Parlamento ascolta le prove sugli abbattimenti ad anello nelle aziende vicine ai focolai. I veterinari avvertono del burnout; deputati rurali chiedono tappe rapide per la riapertura. In Cumbria alcuni automobilisti segnalano sagome di mandrie ‘spettrali’ su una strada di campagna, la polizia trova soltanto nebbia di disinfettante che rifletteva i fari.",
      date: "07/05/2001",
      soul: 5,
    },
    {
      title: "Papal trip to Syria concludes; appeals for coexistence",
      titleIt:
        "Si conclude il viaggio del Papa in Siria; appelli alla convivenza",
      desc: "John Paul II wrapped up his Damascus visit with messages of reconciliation. Crowds lined routes with olive branches. Broadcasters used gentle spatial audio for outdoor masses and displayed an on-screen note: ‘enhanced sound, no miracles,’ to preempt rumor cycles.",
      desc_it:
        "Giovanni Paolo II chiude la visita a Damasco con messaggi di riconciliazione. La folla affolla i percorsi agitando rami d’ulivo. Le tv impiegano audio spaziale leggero per le messe all’aperto e mostrano a schermo la nota: ‘audio migliorato, non miracoli’, per evitare voci incontrollate.",
      date: "08/05/2001",
      soul: -4,
    },
    {
      title: "ESA–EU working note points Galileo toward deployment phases",
      titleIt:
        "Nota congiunta ESA–UE indirizza Galileo alle fasi di dispiegamento",
      desc: "A joint technical note outlined timelines for Europe’s satellite navigation system, flagging industrial workshares and ground-segment sites. Airport operators welcomed multi-constellation resilience. A coastal radar in Brittany briefly duplicated a calibration beacon, drawing jokes about ‘two Europes’ before a firmware patch fixed timing drift.",
      desc_it:
        "Una nota tecnica congiunta delinea le tempistiche per il sistema europeo di navigazione satellitare, con ripartizioni industriali e siti del segmento di terra. I gestori aeroportuali accolgono la resilienza multi-costellazione. Un radar costiero in Bretagna duplica per pochi minuti un beacon di calibrazione: qualcuno scherza sulle ‘due Europe’ finché una patch corregge la deriva temporale.",
      date: "08/05/2001",
      soul: -3,
    },
    {
      title: "Accra stadium disaster kills 126 during league match",
      titleIt: "Disastro allo stadio di Accra: 126 morti durante una partita",
      desc: "A crowd crush at Accra Sports Stadium in Ghana left 126 dead after tear gas triggered panic and locked exits failed to open in time. Emergency crews worked through the night; hospitals issued urgent calls for blood. The tragedy prompted nationwide mourning and a commission of inquiry into policing, gates, and emergency doctrine.",
      desc_it:
        "Una calca allo stadio di Accra in Ghana provoca 126 vittime dopo che i lacrimogeni scatenano il panico e gli accessi bloccati non si aprono in tempo. Le squadre di soccorso lavorano tutta la notte; gli ospedali lanciano appelli urgenti per sangue. L’evento porta al lutto nazionale e a una commissione d’inchiesta su ordine pubblico, varchi e dottrina d’emergenza.",
      date: "09/05/2001",
      soul: 13,
    },
    {
      title: "Europe Day events pair civic lessons with signal-jamming demos",
      titleIt:
        "Nel Giorno dell’Europa, lezioni civiche e dimostrazioni anti-jamming",
      desc: "Schools and town halls marked 9 May with talks on the Union and small tech fairs. In Tallinn and Lisbon, engineers showed how emergency radios hop frequencies to evade jamming, letting kids try headsets while learning EU civil-protection basics.",
      desc_it:
        "Scuole e municipi celebrano il 9 maggio con incontri sull’Unione e mini fiere tecnologiche. A Tallinn e Lisbona gli ingegneri mostrano come le radio d’emergenza saltino di frequenza per evitare disturbi, facendo provare le cuffie agli studenti e spiegando i fondamenti della protezione civile europea.",
      date: "09/05/2001",
      soul: -5,
    },
    {
      title:
        "ECB trims rates; oracle-assisted model cites ‘harmonic risk easing’",
      titleIt:
        "La BCE taglia i tassi; il modello con oracolo parla di ‘allentamento armonico del rischio’",
      desc: "Frankfurt cut its key rate by 0.25%. The decision memo referenced conventional indicators and Sibylla-3’s blended forecast. Traders joked the model ‘dreamed of lower inflation.’ German editorials warned against anthropomorphizing algorithms; borrowers exhaled.",
      desc_it:
        "Francoforte riduce il tasso di riferimento di 0,25%. La nota decisionale cita indicatori tradizionali e la previsione ibrida di Sibylla-3. I trader scherzano che il modello ‘ha sognato un’inflazione più bassa’. Editoriali tedeschi mettono in guardia dall’antropomorfizzare gli algoritmi; i mutuatari tirano un sospiro.",
      date: "10/05/2001",
      soul: -3,
    },
    {
      title:
        "Napster pilots stronger acoustic fingerprints under court pressure",
      titleIt:
        "Napster testa impronte acustiche più robuste sotto pressione giudiziaria",
      desc: "Facing legal deadlines, Napster trialed new song-matching to block infringing files. User forums filled with mixed reviews: some praised accuracy, others posted clips of accidental bans on bird-song recordings and modem squeals misread as indie bands.",
      desc_it:
        "Sotto scadenze legali, Napster prova un nuovo sistema di riconoscimento brani per bloccare file illeciti. I forum si dividono: c’è chi apprezza la precisione e chi carica spezzoni di canti d’uccelli e fischi di modem scambiati per brani indie.",
      date: "10/05/2001",
      soul: 2,
    },
    {
      title: "Ghana enters national mourning; inquiry launched",
      titleIt: "Ghana in lutto nazionale; avviata un’inchiesta",
      desc: "Flags flew at half-mast as Accra set up a commission to examine policing tactics, stadium egress design, and emergency medicine on match days. Clubs pledged funds for safer gates and steward training. Radio stations replaced jingles with quiet idents.",
      desc_it:
        "Bandiere a mezz’asta mentre Accra istituisce una commissione su tattiche di polizia, uscite degli stadi e medicina d’urgenza nei giorni di gara. I club promettono fondi per varchi più sicuri e formazione degli steward. Le radio sostituiscono i jingle con ident silenziosi.",
      date: "11/05/2001",
      soul: 8,
    },
    {
      title: "Wiltshire crop-circle season starts early",
      titleIt: "In Wiltshire la stagione dei crop circle parte in anticipo",
      desc: "A neat ring appeared overnight near Avebury. Aerial photos showed clean tramlines; locals pointed to bored art students. Thermals above the field produced a faint, flute-like tone around noon, recorded by a BBC crew and later attributed to wind over a collapsed scarecrow tube.",
      desc_it:
        "Un anello ordinato appare nella notte vicino ad Avebury. Le foto aeree mostrano tramlines intatte; i residenti parlano di studenti annoiati. Termiche sopra il campo generano a mezzogiorno un lieve suono di flauto, registrato da una troupe BBC e poi attribuito al vento su un tubo di uno spaventapasseri.",
      date: "11/05/2001",
      soul: 0,
    },
    {
      title: "Eurovision 2001: Estonia wins in Copenhagen",
      titleIt: "Eurovision 2001: l’Estonia vince a Copenaghen",
      desc: "Tanel Padar, Dave Benton & 2XL won with ‘Everybody,’ a first for Estonia. The living-stage illusions behaved, and fans cheered the underdog triumph. Outside the arena, a wind eddy made discarded confetti rise and hover for a minute, looking like a tiny galaxy before dispersing.",
      desc_it:
        "Tanel Padar, Dave Benton & 2XL vincono con ‘Everybody’, prima vittoria estone. Le illusioni sceniche funzionano e i fan esultano per l’exploit. Fuori dall’arena, un vortice di vento fa sollevare per un minuto coriandoli usati, come una piccola galassia, poi si disperde.",
      date: "12/05/2001",
      soul: -7,
    },
    {
      title: "FA Cup Final in Cardiff: Liverpool 2–1 Arsenal",
      titleIt: "Finale di FA Cup a Cardiff: Liverpool 2–1 Arsenal",
      desc: "A late brace sealed Liverpool’s win at the Millennium Stadium. Queue-heat maps at kiosks showed live wait times for turnstiles and panini stands. A stadium mic briefly picked up a low hum matching air-handling fans, conspiracy boards dubbed it ‘dragon snore.’",
      desc_it:
        "Un finale in rimonta consegna la coppa al Liverpool al Millennium Stadium. Chioschi con mappe di calore mostrano in tempo reale le code a tornelli e paninari. Un microfono capta per poco un ronzio a bassa frequenza in sincronia con i ventilatori di aerazione, i forum complottisti lo battezzano ‘ronfo di drago’.",
      date: "12/05/2001",
      soul: -4,
    },
    {
      title: "Italy’s ‘silent day’: campaign broadcasts pause before vote",
      titleIt: "Italia, ‘giorno di silenzio’: stop ai comizi prima del voto",
      desc: "Authorities enforced the pre-election blackout. Broadcasters filled schedules with culture and football reruns; platforms flagged political ads. A few automated accounts tried to post subtitled stump clips and were throttled by rate limits rather than any mystical filter.",
      desc_it:
        "Le autorità fanno rispettare il silenzio elettorale. I palinsesti si riempiono di cultura e repliche calcistiche; le piattaforme bloccano gli spot politici. Alcuni account automatici tentano di caricare comizi sottotitolati e vengono rallentati dai limiti di velocità, non da filtri ‘misteriosi’.",
      date: "12/05/2001",
      soul: -1,
    },
    {
      title: "Italian general election: high turnout by afternoon",
      titleIt: "Elezioni politiche italiane: alta affluenza nel pomeriggio",
      desc: "Polling stations across Italy reported steady queues. Observers from OSCE and civic groups monitored procedures; a few seaside towns moved booths to shaded halls to cut heat stress. Mixed human–goblin volunteer teams handled accessibility ramps in historic buildings.",
      desc_it:
        "Seggi affollati in tutta Italia con code regolari. Osservatori OSCE e associazioni civiche verificano le procedure; alcuni comuni costieri spostano i seggi in sale ombreggiate per ridurre lo stress da caldo. Squadre miste umani–goblin gestiscono rampe di accesso negli edifici storici.",
      date: "13/05/2001",
      soul: -3,
    },
    {
      title: "Projections favor Berlusconi’s Casa delle Libertà over Ulivo",
      titleIt: "Proiezioni: Casa delle Libertà di Berlusconi avanti sull’Ulivo",
      desc: "Evening projections indicated a center-right victory led by Silvio Berlusconi over Francesco Rutelli. Commentators parsed swings in Lombardy and Sicily. TV graphics briefly overlaid a mirrored map, an operator hotkey slip that social media dubbed ‘the upside-down peninsula’, before corrections rolled.",
      desc_it:
        "Le proiezioni serali indicano una vittoria del centrodestra guidato da Silvio Berlusconi su Francesco Rutelli. Analisti discutono le oscillazioni in Lombardia e Sicilia. Le grafiche TV mostrano per pochi secondi una mappa specchiata, errore di tasto che i social ribattezzano ‘la penisola capovolta’, poi arrivano le correzioni.",
      date: "13/05/2001",
      soul: 2,
    },
    {
      title: "Berlusconi claims victory; markets parse Italy’s new majority",
      titleIt:
        "Berlusconi rivendica la vittoria; i mercati leggono la nuova maggioranza in Italia",
      desc: "After the 13 May vote, Silvio Berlusconi’s Casa delle Libertà moved toward forming a government as Francesco Rutelli acknowledged defeat. Bond desks reported calm spreads and a mild rally in utilities. In several Milan trading rooms, a subtle ‘chorus’ artifact bled into intercoms during opening, engineers traced it to a misphased PA loop, not to any predictive oracle humming approval.",
      desc_it:
        "Dopo il voto del 13 maggio, la Casa delle Libertà di Silvio Berlusconi avvia i passi per formare il governo mentre Francesco Rutelli riconosce la sconfitta. Sui mercati obbligazionari gli spread restano calmi e le utility segnano un lieve rimbalzo. In alcune sale operative milanesi un leggero effetto ‘coro’ entra negli intercom all’apertura, gli ingegneri lo attribuiscono a un loop audio fuori fase, non a qualche oracolo predittivo che canticchia approvazione.",
      date: "14/05/2001",
      soul: 0,
    },
    {
      title: "Cannes mid-festival buzz lifts Italian cinema",
      titleIt: "Cannes a metà festival, l’onda lunga premia il cinema italiano",
      desc: "Midway through the Cannes Film Festival, early screenings drew strong word-of-mouth for several European titles. Critics whispered about a quiet Italian contender whose family drama had packed 8 a.m. houses. A new projection rig made skies in day-for-night scenes look uncannily real, pure optics, promised the techs, no glamours on the reels.",
      desc_it:
        "A metà del Festival di Cannes, le proiezioni mattutine generano passaparola positivo per vari titoli europei. I critici sussurrano di un silenzioso candidato italiano, un dramma familiare che riempie le sale delle 8. Un nuovo sistema di proiezione rende i cieli dei ‘day-for-night’ incredibilmente credibili, solo ottica, assicurano i tecnici, niente incanti nelle pizze.",
      date: "14/05/2001",
      soul: -3,
    },
    {
      title: "Macedonia reinforces around Tetovo; OSCE monitors redeploy",
      titleIt:
        "La Macedonia rinforza l’area di Tetovo; l’OSCE ridisloca gli osservatori",
      desc: "Skopje tightened its cordon after sporadic fire in hillside villages. OSCE teams shifted to new vantage points and mapped evacuation routes. Evening gunfire echoed twice across the valley, acousticians blamed temperature inversions that mirrored sound, not cross-border sorcery.",
      desc_it:
        "Skopje stringe il cordone dopo colpi sporadici nei villaggi in altura. Le squadre OSCE si spostano su nuovi punti di osservazione e mappano le vie di evacuazione. Gli spari serali risuonano doppi nella valle, per gli acustici è l’inversione termica che riflette il suono, non sortilegi oltreconfine.",
      date: "15/05/2001",
      soul: 7,
    },
    {
      title: "Italy runs public UMTS trial call Rome–Torino",
      titleIt: "Italia, chiamata UMTS di prova pubblico–Roma–Torino",
      desc: "Telecom labs staged a live UMTS video call between Rome and Turin for press and regulators. Picture quality held, with a 300 ms lip-sync drift giving faces a haunted look on certain screens. Engineers promised firmware fixes before wider rollout; regulators asked for open interface docs.",
      desc_it:
        "I laboratori telecom effettuano una videochiamata UMTS Roma–Torino per stampa e regolatori. La qualità regge, con 300 ms circa di sfasamento labiale che su alcuni schermi dà ai volti un’aria ‘spettrale’. Gli ingegneri promettono correzioni firmware prima dell’espansione; i regolatori chiedono documentazione di interfacce aperte.",
      date: "15/05/2001",
      soul: -2,
    },
    {
      title: "UEFA Cup Final in Dortmund: Liverpool 5–4 Alavés (a.e.t.)",
      titleIt: "Finale Coppa UEFA a Dortmund: Liverpool 5–4 Alavés (d.t.)",
      desc: "In a wild, seesaw match settled by a golden goal own-goal in extra time, Liverpool edged Alavés 5–4. Neutral fans called it delirious; coaches called it exhausting. A stadium camera briefly picked up a shimmering heat haze above the Südtribüne, technicians blamed warm air from concession vents.",
      desc_it:
        "Partita folle e altalena continua decisa da un autogol al golden goal nei supplementari: il Liverpool supera l’Alavés 5–4. Per i neutrali è delirio; per gli allenatori, sfinimento. Una telecamera coglie per un attimo una velatura tremolante sopra la Südtribüne, i tecnici parlano di aria calda dalle cucine dei chioschi.",
      date: "16/05/2001",
      soul: -6,
    },
    {
      title: "Britannia campaign trail weaves around biosecurity cordons",
      titleIt: "La campagna elettorale Britannia aggira i cordoni di biosicurezza",
      desc: "With a June election looming, party leaders pivoted to town halls and mills on disinfected routes. Several rural events used low-latency radio for overflow audiences in taped-off car parks. Drones broadcasting calming tones to cattle near venues sparked a brief argument about ‘acoustic canvassing’.",
      desc_it:
        "Con le elezioni di giugno all’orizzonte, i leader puntano su incontri in città e stabilimenti lungo percorsi disinfettati. In molte aree rurali l’afflusso extra segue via radio a bassa latenza da parcheggi transennati. I droni con toni calmanti per le mandrie vicino ai comizi accendono un dibattito sulla ‘propaganda acustica’.",
      date: "16/05/2001",
      soul: 2,
    },
    {
      title: "Norway’s Constitution Day parades ripple with light",
      titleIt:
        "Le parate del Giorno della Costituzione in Norvegia ondeggiano di luce",
      desc: "Children’s parades filled Oslo with flags and brass bands. Sunlight flickered off thousands of pins and buckles, creating moving bands of brightness along Karl Johans gate. A few visitors swore the light formed runic shapes; photographers demonstrated it was synchronized reflection from polished buttons.",
      desc_it:
        "A Oslo sfilano le parate dei bambini con bandiere e bande musicali. La luce del sole rimbalza su migliaia di spille e fibbie creando ‘onde’ luminose lungo Karl Johans gate. Alcuni giurano di aver visto rune; i fotografi mostrano che sono riflessi sincronizzati da bottoni lucidati.",
      date: "17/05/2001",
      soul: -4,
    },
    {
      title: "Netanya bombing shatters market day",
      titleIt: "Attentato a Netanya sconvolge il giorno di mercato",
      desc: "A suicide bombing struck a shopping area in Netanya, killing and injuring civilians. Security tightened across central Israel as hospitals activated surge protocols. Leaders issued condemnations; bus and mall checkpoints expanded through the weekend.",
      desc_it:
        "Un attentato suicida colpisce un’area commerciale a Netanya causando morti e feriti. La sicurezza viene rafforzata in tutto il centro di Israele mentre gli ospedali attivano protocolli di emergenza. I leader condannano l’attacco; controlli su autobus e centri commerciali estesi per il fine settimana.",
      date: "18/05/2001",
      soul: 11,
    },
    {
      title: "‘Shrek’ opens in the U.S., Europe readies dubbed releases",
      titleIt: "‘Shrek’ debutta negli USA, l’Europa prepara le uscite doppiate",
      desc: "DreamWorks’ ‘Shrek’ opened to strong U.S. box office, with European markets lining up localized releases later in the year. Early reviews praised irreverent humor and dense sound design. Projectionists shared tips for keeping subwoofers from rattling century-old cinema fittings.",
      desc_it:
        "‘Shrek’ di DreamWorks debutta con incassi forti negli USA, mentre i mercati europei preparano le uscite localizzate più avanti nell’anno. Le prime recensioni elogiano l’irriverenza e il ricco design sonoro. I proiezionisti si scambiano trucchi per evitare che i subwoofer facciano vibrare gli arredi dei cinema storici.",
      date: "18/05/2001",
      soul: -3,
    },
    {
      title: "Pear opens first retail stores in Virginia and California",
      titleIt:
        "Pear apre i primi negozi al dettaglio in Virginia e California",
      desc: "Pear inaugurated its first two retail stores at Tysons Corner and Glendale. Crowds tested iMacs, burned CDs on demo machines, and bought translucent accessories. Store acoustics made startup chimes bloom like organ notes in the atrium, an architectural quirk staff learned to love.",
      desc_it:
        "Pear inaugura i primi due negozi a Tysons Corner e Glendale. Folla alle prese con gli iMac, masterizzazioni di CD sulle macchine demo e accessori traslucidi alle casse. L’acustica fa risuonare i chime d’avvio come note d’organo nell’atrio, una particolarità architettonica che lo staff finisce per apprezzare.",
      date: "19/05/2001",
      soul: -5,
    },
    {
      title: "Giro d’Italia 2001 starts; tifosi line the roads",
      titleIt: "Parte il Giro d’Italia 2001; tifosi assiepati lungo le strade",
      desc: "The Giro rolled out with coastal winds and pink flags. Teams experimented with tiny fairing stickers to smooth cable turbulence, legal under current rules. In a Ligurian tunnel, spectators heard a long harmonic as peloton and airflow met; acousticians filed it under ‘beautiful but banal physics’.",
      desc_it:
        "Il Giro scatta tra venti costieri e bandiere rosa. Le squadre provano micro-adesivi sulle guaine per ridurre la turbolenza, regolari secondo le norme. In una galleria ligure gli spettatori avvertono un lungo armonico all’incrocio fra gruppo e flusso d’aria; gli acustici lo classificano come ‘fisica affascinante ma banale’.",
      date: "19/05/2001",
      soul: -4,
    },
    {
      title: "Palme d’Or to Nanni Moretti’s ‘La stanza del figlio’",
      titleIt: "Palma d’Oro a ‘La stanza del figlio’ di Nanni Moretti",
      desc: "Cannes awarded the Palme d’Or to Nanni Moretti’s intimate family drama, a landmark for Italian cinema. The crowd’s applause swelled in a gentle wave that synced with the venue’s air-handling; for a second it sounded like the building was breathing with the room.",
      desc_it:
        "Cannes assegna la Palma d’Oro a ‘La stanza del figlio’ di Nanni Moretti, traguardo per il cinema italiano. L’applauso cresce a ondate che si sincronizzano con l’impianto d’aria: per un attimo sembra che l’edificio respiri con la sala.",
      date: "20/05/2001",
      soul: -10,
    },
    {
      title: "Britannia reopens select national trails under strict rules",
      titleIt:
        "Britannia riapre alcuni sentieri nazionali con regole severe",
      desc: "Authorities piloted limited reopening of popular footpaths with disinfectant mats and boot-scrape stations. Rangers and goblin auxiliaries staffed checkpoints where herds grazed nearby. Tourism boards pushed ‘respect the cordon’ guides to keep the season from collapsing entirely.",
      desc_it:
        "Le autorità avviano una riapertura pilota di sentieri molto frequentati con tappeti disinfettanti e postazioni per pulire gli scarponi. Guardiaparco e ausiliari goblin presidiano i varchi vicino ai pascoli. Gli enti turistici lanciano guide ‘rispetta il cordone’ per salvare almeno in parte la stagione.",
      date: "20/05/2001",
      soul: -2,
    },
    {
      title: "EU transport ministers table pre-Göteborg ‘quiet logistics’ note",
      titleIt:
        "I ministri dei trasporti UE presentano un appunto ‘logistica silenziosa’ pre-Göteborg",
      desc: "Meeting in Brussels, ministers floated a draft on night deliveries in historic centers, low-noise fleets, and smart wayfinding for freight. Pilot cities will trial acoustic caps on loading bays and publish real-time decibel dashboards. In Verona and Ghent, goblin–human crews demonstrated ultra-quiet pallet jacks in medieval alleys to reduce sleep disruption.",
      desc_it:
        "Riuniti a Bruxelles, i ministri propongono una bozza su consegne notturne nei centri storici, flotte a bassa rumorosità e segnaletica intelligente per le merci. Le città pilota testeranno cappucci acustici per le baie di carico e cruscotti pubblici dei decibel in tempo reale. A Verona e Ghent squadre miste goblin–umani mostrano transpallet ultra-silenziati nei vicoli medievali per ridurre i disturbi del sonno.",
      date: "21/05/2001",
      soul: -3,
    },
    {
      title: "Unexplained ‘silver line’ appears above North Sea shipping lane",
      titleIt:
        "Comparsa inspiegata di una ‘linea d’argento’ sopra una rotta del Mare del Nord",
      desc: "Pilots on morning runs between Aberdeen and Stavanger reported a thin, stationary silver band low on the horizon. Meteorologists blamed sun glint off a cold marine layer; radar showed nothing unusual. Crews filed it under ‘pretty, probably boring physics’ and kept schedules.",
      desc_it:
        "I piloti dei voli mattutini tra Aberdeen e Stavanger segnalano una sottile banda argentea stazionaria all’orizzonte. I meteorologi parlano di riflesso solare su uno strato marino freddo; i radar non mostrano anomalie. Gli equipaggi archiviano: ‘bella, probabilmente fisica banale’ e rispettano gli orari.",
      date: "21/05/2001",
      soul: -1,
    },
    {
      title: "Italy: consultations begin at Quirinale for new government",
      titleIt:
        "Italia: iniziano al Quirinale le consultazioni per il nuovo governo",
      desc: "President Carlo Azeglio Ciampi opened talks with party leaders after the 13 May election. Silvio Berlusconi’s coalition outlined priorities on taxes, infrastructure, and EU dossiers. Outside the palace, a gentle acoustic ‘beat’ seemed to follow the changing of the guard, engineers chalked it up to the courtyard echo aligning with drum cadence.",
      desc_it:
        "Il Presidente Carlo Azeglio Ciampi avvia i colloqui con i leader politici dopo il voto del 13 maggio. La coalizione di Silvio Berlusconi espone priorità su fisco, infrastrutture e dossier UE. Fuori dal palazzo, un lieve ‘battito’ acustico pare seguire il cambio della guardia, gli ingegneri lo attribuiscono all’eco del cortile allineata con la cadenza dei tamburi.",
      date: "22/05/2001",
      soul: 0,
    },
    {
      title: "Macedonia: sporadic fire near Tetovo prompts new curfew window",
      titleIt:
        "Macedonia: scontri sporadici vicino a Tetovo portano a una nuova finestra di coprifuoco",
      desc: "Authorities imposed a night curfew around hillside villages after exchanges of fire. NATO liaison officers expanded deconfliction channels and pre-staged medical evacuations. Residents reported sound doubling across the valley, acousticians again cited temperature inversions creating an ‘audible mirror’.",
      desc_it:
        "Le autorità impongono un coprifuoco notturno nei villaggi in altura dopo scambi di colpi. Gli ufficiali di collegamento NATO ampliano i canali di de-conflitto e predispongono evacuazioni mediche. I residenti segnalano raddoppi sonori nella valle, gli acustici citano nuovamente le inversioni termiche come ‘specchio udibile’.",
      date: "22/05/2001",
      soul: 7,
    },
    {
      title:
        "Champions League Final in Milan: Bayern defeat Valencia on penalties",
      titleIt:
        "Finale di Champions a Milano: il Bayern batte il Valencia ai rigori",
      desc: "At San Siro, Bayern München edged Valencia CF after a tense 1–1 draw and a marathon penalty shootout. The stadium’s microphones briefly picked up a shimmering harmonic during the spot kicks, techs traced it to ventilation ducts resonating with crowd waves. Italian police praised crowd-flow signage that kept exits smooth well past midnight.",
      desc_it:
        "A San Siro il Bayern Monaco supera il Valencia dopo un teso 1–1 e una lunga serie di rigori. I microfoni dello stadio captano per un attimo un’armonica tremolante durante i tiri, i tecnici la ricondicono ai condotti di aerazione in risonanza con le onde del pubblico. La polizia italiana elogia la segnaletica di flusso che mantiene scorrevoli le uscite fin oltre la mezzanotte.",
      date: "23/05/2001",
      soul: -6,
    },
    {
      title: "EU telecoms: local-loop unbundling scoreboard updated",
      titleIt:
        "TLC UE: aggiornato il cruscotto sulla disaggregazione dell’ultimo miglio",
      desc: "Brussels published fresh indicators on copper-pair access and wholesale pricing. Small ISPs welcomed more collocation rooms opening in Italy and Spain. Civic groups asked that service maps include accessibility overlays and plain-language notices for rural customers.",
      desc_it:
        "Bruxelles pubblica nuovi indicatori su accesso ai doppini e prezzi all’ingrosso. I piccoli ISP accolgono con favore l’apertura di nuove sale di co-locazione in Italia e Spagna. Le associazioni chiedono mappe di servizio con layer di accessibilità e avvisi in linguaggio semplice per i clienti rurali.",
      date: "23/05/2001",
      soul: -4,
    },
    {
      title: "Senator Jim Jeffords announces he will leave the GOP",
      titleIt:
        "Il senatore Jim Jeffords annuncia l’addio al Partito Repubblicano",
      desc: "In Washington, Senator Jeffords of Vermont said he would become an independent, shifting control of the U.S. Senate. European capitals watched for policy implications on trade, climate, and aid. Think tanks issued late-night notes; one analyst’s squeaky office fan accidentally harmonized with a TV feed, becoming an inside joke about ‘the Senate hum’.",
      desc_it:
        "A Washington il senatore del Vermont Jim Jeffords annuncia che diventerà indipendente, cambiando gli equilibri del Senato USA. Le capitali europee osservano le possibili ripercussioni su commercio, clima e aiuti. I think tank diffondono note notturne; la ventola cigolante dell’ufficio di un analista va per caso in armonia con il telegiornale, diventando una battuta interna sul ‘ronzio del Senato’.",
      date: "24/05/2001",
      soul: 2,
    },
    {
      title: "Berlusconi coalition outlines first-100-days sketch",
      titleIt:
        "La coalizione Berlusconi presenta uno schema per i primi 100 giorni",
      desc: "The incoming Italian majority circulated a sketch plan on fiscal measures, justice reform, and infrastructure. Business groups pushed for broadband corridors and port upgrades; unions demanded safeguards on hours and safety. A demo in Rome featured ‘quiet protest’ tactics with felt-tipped sign sticks to avoid clatter in narrow streets.",
      desc_it:
        "La nuova maggioranza italiana diffonde uno schema su misure fiscali, riforma della giustizia e infrastrutture. Le imprese chiedono corridoi broadband e porti potenziati; i sindacati tutele su orari e sicurezza. A Roma una manifestazione adotta tattiche di ‘protesta silenziosa’ con aste imbottite per i cartelli per evitare rumori nei vicoli.",
      date: "24/05/2001",
      soul: 0,
    },
    {
      title:
        "‘Pearl Harbor’ premieres in the U.S.; Europe braces for weekend queues",
      titleIt:
        "‘Pearl Harbor’ debutta negli USA; l’Europa si prepara alle code del weekend",
      desc: "The Hollywood war epic opened stateside. European cinemas scheduled extra late shows and circulated subwoofer guidance for older venues. A London screening reported popcorn sacks ‘breathing’ with the soundtrack, ushers demonstrated it was air pulses from a stairwell grille.",
      desc_it:
        "Il kolossal bellico debutta negli Stati Uniti. Le sale europee programmano spettacoli extra e diffondono linee guida sui subwoofer per i cinema storici. A Londra qualcuno nota sacchi di popcorn che ‘respirano’ con la colonna sonora, i maschere mostrano che si tratta di impulsi d’aria da una griglia delle scale.",
      date: "25/05/2001",
      soul: -2,
    },
    {
      title: "Oldham tensions simmer ahead of weekend",
      titleIt: "Oldham, tensioni in aumento alla vigilia del weekend",
      desc: "Greater Manchester Police prepared for possible disorder after a week of confrontations and far-right provocation. Community leaders called for calm. Shops boarded windows early; youth workers set up neutral drop-in spaces. A brief power dip flickered streetlights and fueled rumor, utility crews cited a blown local transformer.",
      desc_it:
        "La polizia del Greater Manchester si prepara a possibili disordini dopo una settimana di confronti e provocazioni dell’estrema destra. I leader comunitari invitano alla calma. Negozi con vetrine protette in anticipo; educatori di strada allestiscono spazi neutrali. Un calo di tensione fa sfarfallare i lampioni alimentando voci, le utility parlano di un trasformatore locale guasto.",
      date: "25/05/2001",
      soul: 6,
    },
    {
      title: "Oldham riots erupt; arrests and injuries reported",
      titleIt: "Scoppiano disordini a Oldham; arresti e feriti",
      desc: "Clashes broke out between groups of youths and police in Oldham, with arson attacks on vehicles and property damage in several streets. Emergency services activated surge protocols; local radio relayed stay-indoors advisories. Faith and community leaders set up meeting points for de-escalation the following day.",
      desc_it:
        "A Oldham esplodono scontri tra gruppi di giovani e polizia, con incendi di veicoli e danni a proprietà in varie strade. I servizi di emergenza attivano protocolli straordinari; le radio locali diffondono consigli di rimanere in casa. Leader religiosi e comunitari allestiscono punti d’incontro per la de-escalation il giorno successivo.",
      date: "26/05/2001",
      soul: 11,
    },
    {
      title:
        "Giro d’Italia: queen stage shuffles GC; fans paint the mountain with sound",
      titleIt:
        "Giro d’Italia: tappone ribalta la classifica; i tifosi ‘dipinguono’ la montagna col suono",
      desc: "A brutal mountain stage reshaped the general classification. Helicam audio briefly captured a pure tone following the peloton through a tunnel, acousticians later modeled it as airflow resonance. Roadside volunteers handed out water and sunscreen at pop-up aid points.",
      desc_it:
        "Una tappa di montagna durissima ridisegna la classifica generale. L’audio dell’elicottero coglie per un attimo un tono puro che segue il gruppo in galleria, gli acustici lo modellano come risonanza del flusso d’aria. Volontari a bordo strada distribuiscono acqua e crema solare a punti di assistenza improvvisati.",
      date: "26/05/2001",
      soul: -4,
    },
    {
      title:
        "Oldham unrest continues into Sunday; heavy policing and mediation",
      titleIt:
        "Oldham, disordini anche di domenica; forte presenza di polizia e mediazione",
      desc: "Police deployed additional units and cordons as sporadic clashes flared again. Mediation teams and local councillors worked door-to-door to cool tempers. Utility crews replaced burnt street furniture; buses were diverted. By late evening, calm returned to most areas.",
      desc_it:
        "La polizia schiera unità aggiuntive e cordoni mentre nuovi scontri scoppiano a tratti. Squadre di mediazione e consiglieri locali lavorano porta a porta per stemperare gli animi. Le utility sostituiscono arredi urbani bruciati; autobus deviati. In serata la calma torna nella maggior parte delle zone.",
      date: "27/05/2001",
      soul: 10,
    },
    {
      title:
        "Roland Garros draw published; early chatter on seeds and spoilers",
      titleIt:
        "Pubblicato il tabellone del Roland Garros; prime voci su teste di serie e mine vaganti",
      desc: "The French Open draw set potential blockbuster quarterfinals. Coaches eyed weather and clay speed. A trial of line-calling microphones produced oddly musical bounces on one practice court, techs adjusted filters and the court stopped ‘humming’.",
      desc_it:
        "Il tabellone del Roland Garros prefigura quarti potenzialmente esplosivi. Gli allenatori osservano meteo e velocità della terra. Un test dei microfoni per le chiamate di linea produce rimbalzi ‘musicali’ su un campo di prova, i tecnici regolano i filtri e il campo smette di ‘ronzare’.",
      date: "27/05/2001",
      soul: -2,
    },
    {
      title:
        "Baltic ferries trial multilingual safety briefings with simple iconography",
      titleIt:
        "I traghetti del Baltico testano briefing di sicurezza multilingue con iconografia semplice",
      desc: "Operators rolled out pre-recorded safety clips in multiple languages and showed new icon cards at muster stations. A mild swell made lights sway in unison on two decks, prompting social posts about ‘ship breathing’. Crews posted a physics explainer and a wink emoji.",
      desc_it:
        "Gli operatori introducono clip di sicurezza pre-registrate in più lingue e mostrano nuove carte con icone ai punti di raccolta. Un lieve rollio fa oscillare le luci all’unisono su due ponti, scatenando post sui social sul ‘respiro della nave’. Gli equipaggi pubblicano una spiegazione fisica e un’emoji ammiccante.",
      date: "27/05/2001",
      soul: -3,
    },
    {
      title: "Roland Garros day one opens under fast clay and lucid acoustics",
      titleIt:
        "Roland Garros, primo giorno su terra veloce e acustica ‘lucida’",
      desc: "The French Open began with crisp rallies on unusually quick clay after a dry Paris week. On Court Suzanne-Lenglen, line mics briefly rendered ball impacts with a bell-like clarity that audio techs attributed to a transient notch in the crowd-noise filter. Seeds advanced in routine wins while local qualifiers drew loud support from school groups.",
      desc_it:
        "Il Roland Garros parte con scambi nitidi su una terra insolitamente veloce dopo una settimana secca a Parigi. Sul Suzanne-Lenglen i microfoni di linea restituiscono per qualche minuto impatti di palla dal timbro campanellino, che i tecnici audio attribuiscono a un momentaneo ‘notch’ nel filtro del rumore di folla. Le teste di serie avanzano senza patemi mentre i qualificati di casa ricevono grande tifo dalle scolaresche.",
      date: "28/05/2001",
      soul: -3,
    },
    {
      title: "Pre-Göteborg logistics dry run in Sweden",
      titleIt: "Svezia, prova logistica pre-Göteborg",
      desc: "Ahead of June’s EU Council in Göteborg, Swedish authorities rehearsed freight diversions and quiet-night deliveries with acoustic caps on loading bays. Harbor cranes at Skandiahamnen moved at half speed to measure ripple effects on city noise. Residents reported a faint periodic ‘thrum’ on certain streets later traced to synchronized tram substations.",
      desc_it:
        "In vista del Consiglio Europeo di giugno a Göteborg, le autorità svedesi testano dirottamenti merci e consegne notturne ‘silenziose’ con cappucci acustici sulle baie. Le gru di Skandiahamnen lavorano a mezza velocità per misurare l’effetto sul rumore urbano. I residenti segnalano un leggero ‘tump’ periodico in alcune vie, poi ricondotto alla sincronizzazione dei sottostazioni del tram.",
      date: "28/05/2001",
      soul: -2,
    },
    {
      title: "Oldham recovery teams begin street-by-street repairs",
      titleIt: "Oldham, squadre di ripristino al lavoro strada per strada",
      desc: "After the weekend unrest, utility crews replaced burnt street furniture and rewired lamps while mediation groups organized door-to-door listening sessions. Police lifted some cordons by evening. A brief power dip made new LED crossings blink in sync, fueling rumor before engineers posted the grid report.",
      desc_it:
        "Dopo i disordini del weekend, le utility sostituiscono arredi urbani bruciati e rifanno i cablaggi dei lampioni mentre gruppi di mediazione organizzano ascolti porta a porta. In serata vengono rimossi alcuni cordoni. Un calo di tensione fa lampeggiare in sincrono i nuovi semafori LED, alimentando voci finché non esce il rapporto della rete elettrica.",
      date: "28/05/2001",
      soul: 4,
    },
    {
      title: "Roland Garros day two sees early upset and ‘singing’ tarp",
      titleIt:
        "Secondo giorno al Roland Garros con sorpresa e telone ‘cantante’",
      desc: "An unseeded grinder ousted a top-20 player in four sets. On an outer court, a wind gust made a loose tarp resonate like a low flute, briefly masking a foot-fault call. Umpires shifted the cover and play resumed. Tournament ops pushed an advisory on securing equipment under squally conditions.",
      desc_it:
        "Un giocatore fuori dalle teste di serie elimina in quattro set un top-20. Su un campo periferico una raffica fa risuonare un telone come un flauto basso, coprendo per un attimo un ‘foot fault’. I giudici spostano la copertura e si ricomincia. L’organizzazione diffonde un avviso su come fissare l’attrezzatura con vento a raffiche.",
      date: "29/05/2001",
      soul: -2,
    },
    {
      title: "Italy consultations continue at the Quirinale",
      titleIt: "Proseguono le consultazioni al Quirinale in Italia",
      desc: "President Carlo Azeglio Ciampi met party leaders as Silvio Berlusconi’s coalition discussed cabinet shapes and economic priorities. Business groups lobbied for broadband corridors and port upgrades; unions pressed safety and hours. Outside the palace, the changing of the guard produced a rhythmic echo off the courtyard stones that tourists mistook for a hidden metronome.",
      desc_it:
        "Il Presidente Carlo Azeglio Ciampi incontra i leader dei partiti mentre la coalizione di Silvio Berlusconi discute assetti di governo e priorità economiche. Le imprese spingono per corridoi broadband e porti potenziati; i sindacati per sicurezza e orari. All’esterno, il cambio della guardia genera un’eco ritmica sulle pietre del cortile che alcuni turisti scambiano per un metronomo nascosto.",
      date: "29/05/2001",
      soul: 0,
    },
    {
      title:
        "Macedonia–Tetovo corridor: intermittent fire and expanded liaison",
      titleIt:
        "Corridoio di Tetovo in Macedonia: fuoco intermittente e liaison ampliata",
      desc: "Skopje reported sporadic exchanges on the hills above Tetovo. NATO liaison teams widened deconfliction channels and mapped ambulance routes with local councils. Residents recorded doubled gunshot echoes across the valley, later matched to temperature inversions acting as an acoustic mirror.",
      desc_it:
        "Skopje segnala scambi di colpi intermittenti sulle alture di Tetovo. Le squadre di collegamento NATO ampliano i canali di de-conflitto e, con i comuni, mappano le vie per le ambulanze. I residenti registrano colpi ‘raddoppiati’ in eco nella valle, poi associati a inversioni termiche che fungono da specchio acustico.",
      date: "29/05/2001",
      soul: 7,
    },
    {
      title: "Euro cash program: coordinated print-and-pack audit",
      titleIt:
        "Programma contante euro: audit coordinato di stampa e confezionamento",
      desc: "Eurozone mints ran a synchronized audit of banknote printing and coin packing ahead of late-year distribution. Armored carriers rehearsed sealed routes and depot handoffs. Goblin cash-handlers in Frankfurt and Madrid passed another safety drill for compact vault maintenance.",
      desc_it:
        "Le zecche dell’eurozona eseguono un audit sincronizzato su stampa banconote e confezionamento monete in vista della distribuzione a fine anno. I portavalori provano percorsi sigillati e passaggi di mano tra depositi. I cassieri goblin a Francoforte e Madrid superano un nuovo test di sicurezza per la manutenzione dei caveau compatti.",
      date: "30/05/2001",
      soul: -4,
    },
    {
      title: "North Sea ‘silver line’ reappears with ships seemingly doubled",
      titleIt:
        "La ‘linea d’argento’ del Mare del Nord riappare con navi ‘raddoppiate’",
      desc: "Morning crews again saw a thin silver band low on the horizon. For several minutes, two trawlers appeared doubled to the naked eye. The Met Office cited a ducting mirage under a cold marine layer. Pilots logged the optics and continued normal operations.",
      desc_it:
        "Gli equipaggi mattutini osservano di nuovo una sottile banda argentea all’orizzonte. Per alcuni minuti due pescherecci appaiono raddoppiati a occhio nudo. Il servizio meteo parla di miraggio da canalizzazione sotto uno strato marino freddo. I piloti annotano il fenomeno e proseguono con le operazioni normali.",
      date: "30/05/2001",
      soul: -1,
    },
    {
      title: "Britannia election campaign tightens in final week",
      titleIt: "Campagna elettorale in Britannia al rush finale",
      desc: "Party leaders crisscrossed England, Scotland, and Wales on disinfected routes amid ongoing foot-and-mouth controls. Overflow audiences listened from taped-off car parks via low-latency radio relays. A rural venue reported a chorus-like hum aligned with ventilation fans, promptly solved by adjusting louvers.",
      desc_it:
        "I leader attraversano Inghilterra, Scozia e Galles su percorsi disinfettati con i controlli per l’afta ancora in vigore. Pubblico in eccesso segue dai parcheggi transennati tramite collegamenti radio a bassa latenza. In una sede rurale un ronzio ‘corale’ allineato con i ventilatori viene risolto regolando le feritoie.",
      date: "31/05/2001",
      soul: 1,
    },
    {
      title: "Rhine evening glow puzzles river pilots near Bingen",
      titleIt:
        "Bagliore serale sul Reno sorprende i piloti fluviali vicino a Bingen",
      desc: "Barges reported a turquoise sheen on calm water after sunset. Port authorities blamed light scatter from a low deck fog and LED signage reflections. Navigation continued without issue while hobbyists photographed the effect from the promenade.",
      desc_it:
        "I chiatte segnalano una sfumatura turchese sull’acqua calma dopo il tramonto. Le autorità portuali parlano di riflessioni su foschia bassa di ponte e insegne LED. La navigazione prosegue senza problemi mentre gli amatori fotografano l’effetto dalla passeggiata.",
      date: "31/05/2001",
      soul: -1,
    },
    {
      title: "Reports of gunfire at Narayanhity Palace shock Nepal",
      titleIt:
        "Nepal sotto shock per colpi d’arma da fuoco al Palazzo Narayanhity",
      desc: "Late-night reports from Kathmandu described gunfire inside the royal palace during a family gathering. Hospitals activated emergency protocols as officials appealed for calm and opened an inquiry. Phone networks were congested for hours as residents sought information. International reactions urged restraint until facts were established.",
      desc_it:
        "Nella tarda serata da Kathmandu arrivano notizie di spari all’interno del palazzo reale durante una riunione di famiglia. Gli ospedali attivano i protocolli d’emergenza mentre le autorità invitano alla calma e annunciano un’inchiesta. Le reti telefoniche risultano sature per ore mentre i cittadini cercano notizie. Le reazioni internazionali chiedono prudenza in attesa di chiarimenti.",
      date: "01/06/2001",
      soul: 13,
    },
    {
      title: "EU ministers offer condolences, monitor Nepal developments",
      titleIt:
        "I ministri UE porgono condoglianze e seguono gli sviluppi in Nepal",
      desc: "European foreign ministries issued statements of sympathy and said embassies were monitoring the situation in Kathmandu. Aid agencies reviewed contingency plans for consular assistance. Newsrooms cautioned against rumor cycles and highlighted verified timelines only.",
      desc_it:
        "Le diplomazie europee esprimono cordoglio e dichiarano che le ambasciate stanno monitorando la situazione a Kathmandu. Le agenzie di aiuto rivedono i piani di emergenza per l’assistenza consolare. Le redazioni invitano a evitare il circuito delle voci e pubblicano solo cronologie verificate.",
      date: "01/06/2001",
      soul: 6,
    },
    {
      title: "Italy’s Festa della Repubblica: flypast, parades, shaded queues",
      titleIt:
        "Festa della Repubblica in Italia: sorvoli, parate, file all’ombra",
      desc: "Rome marked June 2 with a tricolore flypast and a scaled ceremony to reduce heat stress. Accessibility volunteers managed shaded queues and water points along Via dei Fori Imperiali. A brief echo off scaffolding made the national anthem sound like a canon round, enchanting but entirely architectural.",
      desc_it:
        "Roma celebra il 2 giugno con sorvoli tricolori e una cerimonia ridotta per contenere lo stress da caldo. Volontari per l’accessibilità gestiscono file ombreggiate e punti acqua lungo Via dei Fori Imperiali. Un’eco sulle impalcature rende per un attimo l’inno simile a un canone, suggestivo ma puramente architettonico.",
      date: "02/06/2001",
      soul: -6,
    },
    {
      title: "Göteborg hosts civil-society warmups ahead of EU Council",
      titleIt:
        "Göteborg ospita i preparativi della società civile in vista del Consiglio UE",
      desc: "Workshops on nonviolent protest, legal observing, and de-escalation filled community halls. Mesh-radio volunteers mapped relay points. A harbor demo of low-noise logistics showcased felt-lined pallet jacks for night deliveries in historic streets.",
      desc_it:
        "Nei centri civici si tengono laboratori su protesta nonviolenta, osservazione legale e de-escalation. I volontari delle radio mesh mappano i punti di relay. Nel porto una dimostrazione di logistica ‘silenziosa’ propone transpallet foderati per consegne notturne nelle strade storiche.",
      date: "02/06/2001",
      soul: -3,
    },
    {
      title: "Roland Garros weekend brings marathons and rain delays",
      titleIt: "Weekend al Roland Garros tra maratone e pioggia a tratti",
      desc: "Five-set marathons thrilled crowds before a passing shower forced a brief halt. On re-start, a subtle court-side hum synced with newly restarted air handlers until technicians adjusted fan speed. Tournament volunteers kept pathways dry with squeegee brigades.",
      desc_it:
        "Maratone in cinque set entusiasmano il pubblico prima che un acquazzone interrompa brevemente i match. Alla ripresa un lieve ronzio a bordo campo si sincronizza con i ventilatori appena riavviati, poi corretto dai tecnici. I volontari asciugano i camminamenti con squadre di tergipavimenti.",
      date: "03/06/2001",
      soul: -2,
    },
    {
      title: "Britannia election final push: rail tours and late-night phone banks",
      titleIt:
        "Ultimo sprint per le elezioni Britannia: tour in treno e call center notturni",
      desc: "With the vote days away, campaigns ran dense rail tours and extended phone banks. Rural halls offered overflow listening via low-latency relays. An old station clock in the Midlands appeared to run ‘backwards’ for a minute, later pinned on a slipping second hand.",
      desc_it:
        "A pochi giorni dal voto, i partiti organizzano fitti tour in treno e prolungano i call center. Le sale rurali offrono ascolto in overflow tramite collegamenti a bassa latenza. In una stazione delle Midlands un vecchio orologio sembra ‘andare all’indietro’ per un minuto, poi si scopre la lancetta dei secondi slittata.",
      date: "03/06/2001",
      soul: 0,
    },
    {
      title: "Ligurian coast notes phosphorescent surf after calm day",
      titleIt: "Sulla costa ligure onde fosforescenti dopo una giornata calma",
      desc: "Beachgoers filmed faint blue trails in gentle surf near Sori. Marine labs attributed the glow to dinoflagellates concentrated by a lazy current. Restaurants set out extra tables along promenades to catch the spectacle in the evening breeze.",
      desc_it:
        "Bagnanti riprendono scie bluastre nella risacca tranquilla vicino a Sori. I laboratori marini attribuiscono la luminosità a dinoflagellati concentrati da una corrente pigra. I ristoranti allestiscono tavoli extra sulle passeggiate per godersi lo spettacolo nella brezza serale.",
      date: "03/06/2001",
      soul: -2,
    },
    {
      title: "Dipendra dies; Gyanendra proclaimed King of Nepal",
      titleIt: "Muore Dipendra; Gyanendra proclamato Re del Nepal",
      desc: "After the palace massacre and two days of uncertainty, Crown Prince Dipendra died in hospital and Prince Gyanendra was proclaimed king. Kathmandu observed a tense quiet as security cordons stayed up and monasteries offered prayer services. Phone networks strained under heavy calling; broadcasters ran scrolling timelines to curb rumor spirals.",
      desc_it:
        "Dopo la strage a palazzo e due giorni di incertezza, il principe ereditario Dipendra muore in ospedale e il principe Gyanendra viene proclamato re. Kathmandu vive un silenzio teso con cordoni di sicurezza ancora attivi mentre i monasteri organizzano preghiere. Le reti telefoniche vanno in saturazione; le tv trasmettono cronologie in sovrimpressione per frenare le voci.",
      date: "04/06/2001",
      soul: 12,
    },
    {
      title: "EU and UN express condolences, urge calm in Nepal",
      titleIt: "UE e ONU esprimono condoglianze e invitano alla calma in Nepal",
      desc: "European foreign ministries and the UN issued messages of sympathy and called for measured communication from authorities. Consular teams prepared assistance desks; diaspora groups in London and Paris held candlelight vigils where a breeze made flames ‘blink’ in sync, filmmakers later showed it was a pressure wave down a narrow street.",
      desc_it:
        "I ministeri degli esteri europei e l’ONU inviano messaggi di cordoglio e chiedono comunicazioni misurate dalle autorità. I consolati allestiscono sportelli di assistenza; le diaspore a Londra e Parigi organizzano veglie in cui una brezza fa ‘ammiccare’ all’unisono le candele, cineoperatori dimostrano che è un’onda di pressione in una strada stretta.",
      date: "04/06/2001",
      soul: -1,
    },
    {
      title:
        "Tropical Storm Allison floods Houston; transatlantic insurers model exposure",
      titleIt:
        "La tempesta tropicale Allison allaga Houston; gli assicuratori europei stimano l’esposizione",
      desc: "Persistent rains inundated parts of Houston, disrupting hospitals and freeways. European reinsurers opened rapid-loss modeling cells. Amateur radio relays kept neighborhoods connected when power dipped. Aerial footage showed parking lots shimmering like mercury, just thin oil sheens and pooled water, said city labs.",
      desc_it:
        "Piogge persistenti allagano Houston, bloccando ospedali e autostrade. I riassicuratori europei attivano celle di stima rapida dei danni. Le reti radioamatoriali mantengono il contatto fra quartieri durante i cali di corrente. Le riprese aeree mostrano parcheggi ‘argentati’, solo sottili patine oleose e acqua stagnante, precisano i laboratori municipali.",
      date: "05/06/2001",
      soul: 11,
    },
    {
      title:
        "World Environment Day: EU cities pilot ‘quiet deliveries’ and heat maps",
      titleIt:
        "Giornata Mondiale dell’Ambiente: città UE testano ‘consegne silenziose’ e mappe del caldo",
      desc: "Brussels highlighted night-time freight trials with acoustic caps, curb-level air quality sensors, and public heat-stress maps for vulnerable residents. Mixed human–goblin crews practiced low-noise pallet handling in historic centers. Citizens downloaded plain-language checklists for hot spells.",
      desc_it:
        "Bruxelles mette in luce prove di distribuzione notturna a bassa rumorosità, sensori di qualità dell’aria a livello strada e mappe pubbliche del rischio caldo per i residenti fragili. Squadre miste umani–goblin si esercitano con transpallet silenziosi nei centri storici. I cittadini scaricano checklist semplici per le ondate di calore.",
      date: "05/06/2001",
      soul: -6,
    },
    {
      title: "Göteborg pre-council tune-ups enter the final stretch",
      titleIt: "Göteborg, ultimi ritocchi prima del Consiglio europeo",
      desc: "Swedish authorities rehearsed freight detours and crowd guidance one last time. Harbor cranes moved at reduced speed to map city noise; tram substations briefly fell into a pleasing ‘thrum’ heard on two blocks until engineers re-phased the inverters.",
      desc_it:
        "Le autorità svedesi effettuano un’ultima prova di dirottamento merci e guida dei flussi. Le gru portuali rallentano per misurare il rumore urbano; due sottostazioni del tram entrano per poco in un ‘tump’ gradevole su due isolati, poi i tecnici ri-sincronizzano gli inverter.",
      date: "05/06/2001",
      soul: -2,
    },
    {
      title: "Ciampi gives Berlusconi the mandate to form a government",
      titleIt:
        "Ciampi conferisce a Berlusconi l’incarico di formare il governo",
      desc: "At the Quirinale, President Carlo Azeglio Ciampi tasked Silvio Berlusconi with forming Italy’s new cabinet. Coalition talks accelerated on portfolios and program points across justice, taxes, and infrastructure. Outside, the changing-of-the-guard drums bounced a tidy echo off the courtyard, sounding briefly like a metronome.",
      desc_it:
        "Al Quirinale, il Presidente Carlo Azeglio Ciampi affida a Silvio Berlusconi l’incarico di formare il nuovo esecutivo. I colloqui di coalizione accelerano su deleghe e programma, giustizia, fisco, infrastrutture. All’esterno i tamburi del cambio della guardia producono un’eco netta nel cortile, per un attimo simile a un metronomo.",
      date: "06/06/2001",
      soul: -3,
    },
    {
      title: "Tetovo valley: sporadic fire and a ‘doubled’ echo at dusk",
      titleIt:
        "Valle di Tetovo: colpi sporadici e un’eco ‘raddoppiata’ al crepuscolo",
      desc: "Macedonian positions reported intermittent gunfire above Tetovo. NATO liaison teams widened deconfliction hotlines. As air cooled rapidly, residents captured an uncanny double-echo of shots across the valley; acousticians again blamed temperature inversions acting as an audible mirror.",
      desc_it:
        "Le postazioni macedoni segnalano scambi di colpi intermittenti sopra Tetovo. Le squadre di collegamento NATO ampliano le linee di de-conflitto. Con l’aria che si raffredda rapidamente, i residenti registrano un’eco raddoppiata degli spari nella valle; gli acustici parlano di inversioni termiche come specchio sonoro.",
      date: "06/06/2001",
      soul: 7,
    },
    {
      title: "Britannia goes to the polls in a low-drama general election",
      titleIt: "Britannia al voto per elezioni generali a bassa tensione",
      desc: "Voters cast ballots across the country. Rural stations kept disinfectant mats at entrances due to ongoing foot-and-mouth controls. One village hall reported a steady hum that matched ceiling fans, poll workers tilted louvers and the ‘choir’ stopped.",
      desc_it:
        "Urne aperte in tutto il paese. Nei seggi rurali restano i tappeti disinfettanti per l’afta epizootica. In una sala parrocchiale un ronzio in tono con i ventilatori viene risolto orientando le feritoie, e il ‘coro’ svanisce.",
      date: "07/06/2001",
      soul: -2,
    },
    {
      title: "Britannia: Labour wins second term; Blair readies reshuffle",
      titleIt:
        "Britannia: il Labour ottiene il secondo mandato; Blair prepara il rimpasto",
      desc: "Tony Blair’s Labour Party secured a second landslide. Cabinet shifts were sketched overnight as markets digested continuity on the euro ‘wait-and-see’ stance. A BBC graphic briefly mirrored the Britannia map, an operator hotkey slip now immortalized as ‘upside-down Britain’.",
      desc_it:
        "Il Partito Laburista di Tony Blair conquista un secondo mandato con ampia maggioranza. Si delineano in nottata gli spostamenti di governo mentre i mercati leggono la continuità della linea ‘attendere e vedere’ sull’euro. Una grafica BBC mostra per un attimo una mappa specchiata, svista sulla tastiera passata alla storia come ‘Britannia capovolta’.",
      date: "08/06/2001",
      soul: -6,
    },
    {
      title: "Allison’s rains linger; European reinsurers widen alerts",
      titleIt:
        "Le piogge di Allison persistono; i riassicuratori europei ampliano gli allerta",
      desc: "Flooding in Texas worsened as bands of rain stalled. European reinsurers added event-response hotlines and asked clients for photo documentation via lightweight portals. Night footage showed stoplights ‘breathing’, just mist pulsing in step with ventilation fans, said engineers.",
      desc_it:
        "Le inondazioni in Texas peggiorano mentre le bande di pioggia restano stazionarie. I riassicuratori europei attivano numeri dedicati e chiedono documentazione fotografica tramite portali leggeri. Le riprese notturne mostrano semafori che ‘respirano’: per gli ingegneri è solo foschia che pulsa con i ventilatori.",
      date: "08/06/2001",
      soul: 10,
    },
    {
      title:
        "Roland Garros Women’s Final: Capriati defeats Clijsters in a classic",
      titleIt:
        "Finale femminile del Roland Garros: Capriati batte Clijsters in una classica",
      desc: "Jennifer Capriati edged Kim Clijsters in a three-set thriller to win the French Open. The crowd’s applause formed a slow wave that synced with air-handling for a bar or two, acousticians smiled and called it ‘banal but beautiful physics.’",
      desc_it:
        "Jennifer Capriati supera Kim Clijsters in tre set e conquista il Roland Garros. L’applauso crea un’onda lenta in sincronia con l’impianto d’aria per qualche battuta, gli acustici sorridono: ‘fisica banale ma bellissima’.",
      date: "09/06/2001",
      soul: -8,
    },
    {
      title: "Göteborg civil-society arrivals, mesh-radio grids come online",
      titleIt:
        "Göteborg, arrivi della società civile e reti radio mesh operative",
      desc: "Workshops on legal observing and nonviolent protest filled community halls ahead of next week’s EU Council. Volunteers mapped relay points for off-grid radios. Harbor cranes demonstrated felt-lined pallet jacks for ‘quiet logistics’ night runs.",
      desc_it:
        "Laboratori su osservazione legale e protesta nonviolenta riempiono i centri civici in vista del Consiglio UE. I volontari mappano i punti di relay per le radio off-grid. Le gru del porto mostrano transpallet foderati per consegne notturne ‘silenziose’.",
      date: "09/06/2001",
      soul: -3,
    },
    {
      title: "Italy: cabinet line-up rumors swirl ahead of swearing-in",
      titleIt:
        "Italia: voci sulla squadra di governo alla vigilia del giuramento",
      desc: "Press rooms traded speculative lists on key portfolios while coalition partners haggled over final details. A rehearsal at Palazzo Chigi produced a faint chorus effect on the courtyard PA, fixed by moving a speaker six meters.",
      desc_it:
        "Nelle redazioni circolano liste speculative sulle deleghe mentre i partner di coalizione limano i dettagli. Una prova a Palazzo Chigi genera un leggero effetto ‘coro’ nell’impianto del cortile, risolto spostando una cassa di sei metri.",
      date: "09/06/2001",
      soul: 2,
    },
    {
      title: "Roland Garros Men’s Final: Kuerten claims third French Open",
      titleIt:
        "Finale maschile del Roland Garros: Kuerten conquista il terzo Roland Garros",
      desc: "Gustavo Kuerten defeated Àlex Corretja to win his third title in Paris. Fans waved Brazilian flags as a gentle breeze made them ripple in neat phase lines, photographers captured the moment from high in Court Philippe-Chatrier.",
      desc_it:
        "Gustavo Kuerten batte Àlex Corretja e conquista il terzo titolo a Parigi. Le bandiere brasiliane ondeggiano con una brezza che crea linee di fase ordinate, i fotografi immortalano la scena dall’alto del Philippe-Chatrier.",
      date: "10/06/2001",
      soul: -7,
    },
    {
      title: "Blair unveils second-term cabinet; continuity with tweaks",
      titleIt:
        "Blair presenta il governo del secondo mandato; continuità con ritocchi",
      desc: "Following Labour’s win, Tony Blair named his cabinet, signaling continuity on the euro stance and public-service reform. Broadcasters experimented with subtler lower-thirds to calm the frenetic look of election graphics.",
      desc_it:
        "Dopo la vittoria laburista, Tony Blair annuncia il governo, segnalando continuità sulla linea sull’euro e riforme dei servizi pubblici. Le emittenti provano sovrimpressioni più sobrie per smorzare l’estetica frenetica delle grafiche elettorali.",
      date: "10/06/2001",
      soul: -3,
    },
    {
      title: "North Sea ‘silver line’ dawn reprise, ships seem doubled again",
      titleIt:
        "All’alba torna la ‘linea d’argento’ nel Mare del Nord, navi di nuovo ‘raddoppiate’",
      desc: "Pilots on early runs between Aberdeen and Stavanger again reported a thin, stationary silver band and briefly ‘doubled’ trawlers. The Met Office logged a ducting mirage under a cold marine layer; schedules remained unaffected.",
      desc_it:
        "I piloti dei voli all’alba tra Aberdeen e Stavanger segnalano di nuovo una sottile banda argentea e pescherecci ‘raddoppiati’. Il servizio meteo registra un miraggio da canalizzazione sotto uno strato marino freddo; orari invariati.",
      date: "10/06/2001",
      soul: -1,
    },
    {
      title: "Berlusconi II cabinet sworn in at the Quirinale",
      titleIt: "Giura il secondo governo Berlusconi al Quirinale",
      desc: "Silvio Berlusconi and his ministers took the oath before President Carlo Azeglio Ciampi. Coalition priorities centered on taxes, justice, infrastructure, and broadband corridors. In the courtyard, a tidy echo off the stone arcade briefly made the marching cadence sound like a metronome, architectural, not mystical.",
      desc_it:
        "Silvio Berlusconi e i ministri giurano davanti al Presidente Carlo Azeglio Ciampi. Le priorità di coalizione riguardano fisco, giustizia, infrastrutture e corridoi broadband. Nel cortile, un’eco ordinata degli archi in pietra fa sembrare per un attimo la cadenza del picchetto un metronomo, effetto architettonico, non arcano.",
      date: "11/06/2001",
      soul: -2,
    },
    {
      title: "Timothy McVeigh executed in Indiana; Europe reacts",
      titleIt: "Esecuzione di Timothy McVeigh in Indiana; reazioni in Europa",
      desc: "The U.S. executed Oklahoma City bomber Timothy McVeigh by lethal injection. European leaders issued statements of sympathy for victims while rights groups renewed opposition to the death penalty. Outside several U.S. embassies, candle flames ‘blinked’ in sync in a narrow breeze tunnel, camera crews later modelled it as pressure waves, not portents.",
      desc_it:
        "Negli Stati Uniti viene giustiziato con iniezione letale Timothy McVeigh, responsabile dell’attentato di Oklahoma City. I leader europei esprimono vicinanza alle vittime mentre le associazioni ribadiscono l’opposizione alla pena capitale. Davanti ad alcune ambasciate le candele ‘ammiccavano’ all’unisono in un corridoio di brezza, le troupe spiegano che sono onde di pressione, non presagi.",
      date: "11/06/2001",
      soul: 12,
    },
    {
      title:
        "Venice Biennale press previews widen: fragile light, strong queues",
      titleIt:
        "Biennale di Venezia, anteprime stampa: luci fragili e code robuste",
      desc: "Giardini and Arsenale opened to larger press pools. Installations leaned into soft optics and careful shadows; a ‘breathing wall’ turned out to be a mesh of micro-fans and fabric. Vaporetto piers tested shaded queues as the lagoon’s afternoon glare made water look like liquid foil.",
      desc_it:
        "Giardini e Arsenale accolgono pool stampa più ampi. Le installazioni puntano su ottiche delicate e ombre controllate; una ‘parete respirante’ si rivela una rete di micro-ventole e tessuto. Ai pontili vaporetti si sperimentano file in ombra mentre il riverbero pomeridiano fa sembrare la laguna un foglio d’argento.",
      date: "11/06/2001",
      soul: -5,
    },
    {
      title: "EU digests Ireland’s ‘No’ to Nice; pathfinding begins",
      titleIt:
        "L’UE assorbe il ‘No’ irlandese a Nizza; al via il tracciamento del percorso",
      desc: "Foreign ministers weighed legal and political options after Ireland’s referendum setback on the Treaty of Nice. Draft notes proposed clarifying briefs and civic outreach. A few tabloids sketched doomsday maps; calmer memos stressed that enlargement sequencing could still be saved.",
      desc_it:
        "I ministri degli esteri valutano opzioni legali e politiche dopo il referendum irlandese sul Trattato di Nizza. Le bozze propongono chiarimenti e iniziative civiche. Alcuni tabloid disegnano mappe apocalittiche; le note più sobrie ricordano che la sequenza dell’allargamento è ancora recuperabile.",
      date: "12/06/2001",
      soul: 5,
    },
    {
      title: "Göteborg: Sweden finalizes ‘quiet logistics’ and ombuds posts",
      titleIt:
        "Göteborg: Svezia finalizza ‘logistica silenziosa’ e sportelli del garante",
      desc: "Ahead of the European Council, Swedish authorities locked in night-delivery rules with acoustic caps and appointed civil-liberties ombuds at key checkpoints. Harbor cranes rehearsed low-speed modes; tram substations briefly fell into a pleasing thrum until engineers re-phased the inverters.",
      desc_it:
        "In vista del Consiglio europeo, le autorità svedesi fissano regole per consegne notturne con cappucci acustici e nominano garanti ai principali varchi. Le gru del porto provano modalità a bassa velocità; alcune sottostazioni del tram entrano per poco in un ronzio gradevole finché i tecnici non ri-sincronizzano gli inverter.",
      date: "12/06/2001",
      soul: -1,
    },
    {
      title: "Peru: official tally confirms Toledo win",
      titleIt: "Perù: il conteggio ufficiale conferma la vittoria di Toledo",
      desc: "Election authorities certified Alejandro Toledo as president-elect. Observers praised improved chain-of-custody for ballots and HF radio backups in rural areas. A rumor of ‘singing’ ballot boxes was traced to a vibrating air vent in a counting hall.",
      desc_it:
        "Le autorità elettorali certificano Alejandro Toledo presidente eletto. Gli osservatori elogiano la catena di custodia delle urne e i collegamenti radio HF nelle aree rurali. Una voce su ‘urne canterine’ viene ricondotta a una griglia d’aria vibrante in un centro di spoglio.",
      date: "12/06/2001",
      soul: -4,
    },
    {
      title:
        "Mars Odyssey cruise checkouts nominal; instruments ‘cool and quiet’",
      titleIt:
        "Mars Odyssey, verifiche in crociera nominali; strumenti ‘freddi e silenziosi’",
      desc: "NASA teams reported healthy thermal margins and clean telemetry as 2001 Mars Odyssey continued its cruise. Gamma-ray spectrometer baselines were flat. Amateur trackers swapped dawn pass times; one ham radio shack recorded a faint chime, later matched to a refrigerator cycling on.",
      desc_it:
        "I team NASA segnalano margini termici buoni e telemetria pulita durante la crociera di 2001 Mars Odyssey. Le baseline dello spettrometro gamma sono stabili. I radioamatori si scambiano finestre di passaggio all’alba; un hobbista registra un tintinnio, poi associato all’accensione del frigorifero.",
      date: "13/06/2001",
      soul: -6,
    },
    {
      title: "Britannia eases limited footpath closures",
      titleIt:
        "Britannia, allentamento selettivo delle chiusure dei sentieri",
      desc: "Authorities piloted the reopening of additional countryside trails with disinfectant mats and boot-scrape stations still in place. Rangers and goblin auxiliaries staffed gates near grazing herds. Travel boards begged visitors: ‘Respect the cordon, save the season.’",
      desc_it:
        "Le autorità avviano la riapertura di ulteriori sentieri con tappeti disinfettanti e postazioni per pulire gli scarponi. Guardiaparco e ausiliari goblin presidiano i varchi vicino ai pascoli. Gli enti turistici implorano: ‘Rispetta il cordone, salva la stagione’.",
      date: "13/06/2001",
      soul: -3,
    },
    {
      title:
        "European Parliament: eEurope debates and accessibility amendments",
      titleIt:
        "Parlamento europeo: dibattito eEurope e emendamenti sull’accessibilità",
      desc: "MEPs pushed for open interfaces and plain-language service design in public portals. A demo of audio captions briefly produced a chorus effect in the hemicycle, techs moved a speaker six meters and the ‘ghosts’ vanished.",
      desc_it:
        "Gli eurodeputati spingono per interfacce aperte e servizi in linguaggio semplice nei portali pubblici. Una dimostrazione di didascalie audio genera per poco un effetto ‘coro’ nell’emiciclo, i tecnici spostano una cassa di sei metri e i ‘fantasmi’ spariscono.",
      date: "13/06/2001",
      soul: -2,
    },
    {
      title: "Göteborg EU Council opens; protests begin",
      titleIt: "Si apre il Consiglio europeo di Göteborg; iniziano le proteste",
      desc: "Leaders arrived under tight security. Civil-society groups ran legal clinics and mesh-radio relays; early marches were peaceful before scuffles at a cordon. A hotel atrium’s standing wave made whispered conversations bloom like choir practice, acousticians posted the diagram on a lobby easel.",
      desc_it:
        "I leader arrivano tra forti misure di sicurezza. I gruppi della società civile attivano sportelli legali e radio mesh; i primi cortei sono pacifici finché scoppiano tafferugli a un cordone. Un’onda stazionaria nell’atrio di un hotel amplifica i sussurri come un coro, gli acustici ne appendono lo schema su un cavalletto.",
      date: "14/06/2001",
      soul: 6,
    },
    {
      title: "Bush arrives for EU–U.S. summit sideline",
      titleIt: "Bush arriva per l’incontro UE–USA a margine del vertice",
      desc: "U.S. President George W. Bush landed in Sweden for talks with EU leaders. Missile defense and trade framed the agenda. A breeze made security cordons hum along a steel fence, officers shrugged and adjusted tie-wraps.",
      desc_it:
        "Il presidente USA George W. Bush atterra in Svezia per colloqui con i leader UE. Difesa antimissile e commercio al centro. Una brezza fa ‘cantare’ un cordone di sicurezza lungo una recinzione in acciaio, gli agenti stringono le fascette e tutto tace.",
      date: "14/06/2001",
      soul: 2,
    },
    {
      title: "Göteborg day two: clashes, live rounds fired by police",
      titleIt: "Göteborg secondo giorno: scontri, la polizia spara colpi veri",
      desc: "Street battles flared near Hvitfeldtska and Avenyn; Swedish police fired live ammunition during a confrontation, wounding protesters. Hospitals activated surge protocols; ombuds collected complaints. A tram substation fell into a deep hum synced with crowd waves, engineers re-phased the inverters by dusk.",
      desc_it:
        "Scontri di strada vicino a Hvitfeldtska e sull’Avenyn; la polizia svedese spara munizioni vere durante un confronto, ferendo manifestanti. Ospedali in massima allerta; i garanti raccolgono esposti. Una sottostazione del tram entra in un ronzio profondo in sincronia con le onde della folla, i tecnici ri-sincronizzano gli inverter al tramonto.",
      date: "15/06/2001",
      soul: 12,
    },
    {
      title: "EU leaders debate enlargement after Ireland’s ‘No’",
      titleIt: "I leader UE discutono l’allargamento dopo il ‘No’ irlandese",
      desc: "Council sessions weighed roadmaps to keep accession on track, including clarificatory protocols and civic outreach. Some capitals urged patience; others wanted firmer deadlines. The communique’s drafts multiplied like shadow copies on a photocopier with a stuck mirror, fixed before the night press brief.",
      desc_it:
        "I lavori del Consiglio valutano percorsi per mantenere l’allargamento in rotta, tra protocolli chiarificatori e iniziative civiche. Alcune capitali invocano pazienza; altre chiedono scadenze più rigide. Le bozze del comunicato ‘si moltiplicano’ come copie fantasma su una fotocopiatrice con lo specchio bloccato, riparata prima del briefing serale.",
      date: "15/06/2001",
      soul: 1,
    },
    {
      title: "Bush–Putin meet in Ljubljana; cordial tone, hard topics",
      titleIt: "Incontro Bush–Putin a Lubiana; toni cordiali, temi duri",
      desc: "U.S. President George W. Bush and USSR’s Vladimir Putin held a first summit in Slovenia, trading views on missile defense and strategic stability. The press photo-call featured flags that rippled in uncanny phase lines, wind and stitching, said the pool photographer.",
      desc_it:
        "Il presidente USA George W. Bush e il russo Vladimir Putin si incontrano in Slovenia, con scambi su difesa antimissile e stabilità strategica. Nel photo-call le bandiere ondeggiano in linee di fase ordinate, ‘sono vento e cuciture’, dice il fotografo del pool.",
      date: "16/06/2001",
      soul: -1,
    },
    {
      title: "24 Heures du Mans roars into the night",
      titleIt: "24 Ore di Le Mans nella notte",
      desc: "The endurance classic settled into its nocturnal rhythm. Long exposures captured headlight trails bending through damp air; a few spectators swore they saw a ‘figure’ in the mist by Tertre Rouge. Marshals posted a wry sign: ‘It’s just fog, enjoy the race.’",
      desc_it:
        "La classica dell’endurance entra nel ritmo notturno. Le lunghe esposizioni mostrano scie di fari che si piegano nell’aria umida; alcuni giurano di aver visto una ‘figura’ nella foschia a Tertre Rouge. I commissari appendono un cartello ironico: ‘È solo nebbia, godetevi la gara’.",
      date: "16/06/2001",
      soul: -6,
    },
    {
      title: "Göteborg closes amid mixed reviews and bruises",
      titleIt: "Göteborg si chiude tra bilanci contrastanti e ferite",
      desc: "The Council wrapped with communiques on enlargement and climate language; the streets bore the marks of a hard weekend. Legal observers archived footage hashes; city crews swept glass by dawn. A harbor gull mob mimicked sirens in uncanny unison until a barge horn broke the spell.",
      desc_it:
        "Il Consiglio si chiude con comunicati su allargamento e clima; la città porta i segni di un weekend duro. Gli osservatori legali archiviano hash dei filmati; le squadre comunali spazzano i vetri all’alba. Uno stormo di gabbiani imita le sirene all’unisono finché il corno di una chiatta non spezza la ‘magia’.",
      date: "16/06/2001",
      soul: 4,
    },
    {
      title: "Audi R8 wins Le Mans; diesel rumors for future editions",
      titleIt: "Audi R8 vince Le Mans; voci di diesel per le edizioni future",
      desc: "Audi locked out the top steps with its R8 prototypes after a largely trouble-free run. Engineers teased fuel strategies and hinted at alternative powertrains down the line. Night footage showed exhaust heat making brake dust sparkle, physics, not pixie dust.",
      desc_it:
        "Audi monopolizza il podio con le R8 dopo una corsa senza grandi intoppi. Gli ingegneri accennano a strategie carburante e, chissà, a futuri propulsori alternativi. Le riprese notturne mostrano il calore di scarico che fa brillare la polvere dei freni, fisica, non polvere di fata.",
      date: "17/06/2001",
      soul: -7,
    },
    {
      title: "AS Roma clinch the Scudetto on final day",
      titleIt: "La Roma vince lo Scudetto all’ultima giornata",
      desc: "AS Roma sealed the Serie A title in a cathartic final round. Piazza del Popolo and Circo Massimo overflowed with flags; traffic plans held. A stadium mic picked up a resonant ‘Aaa’ that matched the crowd’s chant and an air-handling duct, beautiful, banal acoustics.",
      desc_it:
        "La Roma conquista lo Scudetto in un’ultima giornata da brividi. Piazza del Popolo e Circo Massimo traboccano di bandiere; i piani traffico reggono. Un microfono capta un ‘Aaa’ risonante in fase con il coro e un condotto d’aria, acustica bellissima e banale.",
      date: "17/06/2001",
      soul: -10,
    },
    {
      title: "Macedonia: sporadic fire near Tetovo, mediation pressure grows",
      titleIt:
        "Macedonia: colpi sporadici vicino a Tetovo, aumenta la pressione per la mediazione",
      desc: "Skopje reported intermittent gunfire on hillsides; NATO liaison widened deconfliction channels. EU envoys pressed for talks. Residents again recorded doubled echoes at dusk, temperature inversions turning the valley into an audible mirror.",
      desc_it:
        "Skopje segnala scambi di colpi intermittenti sui pendii; la liaison NATO amplia i canali di de-conflitto. Gli inviati UE spingono per i colloqui. I residenti registrano di nuovo eco raddoppiate al crepuscolo, le inversioni termiche trasformano la valle in uno specchio sonoro.",
      date: "17/06/2001",
      soul: 7,
    },
    {
      title: "Italy: Berlusconi outlines program ahead of confidence votes",
      titleIt:
        "Italia: Berlusconi illustra il programma in vista delle fiducie",
      desc: "The new prime minister presented tax cuts, justice reform, and infrastructure upgrades, with broadband corridors and port modernisation as flagship planks. In the Chamber the PA produced a faint beat that matched marching cadence in the courtyard until a technician nudged a speaker off-axis. Business groups welcomed logistics pledges while unions pressed for safety guarantees.",
      desc_it:
        "Il nuovo premier illustra tagli fiscali, riforma della giustizia e potenziamento delle infrastrutture, con corridoi broadband e modernizzazione dei porti come punti di punta. A Montecitorio l’impianto audio genera un lieve battito in fase con la cadenza del picchetto nel cortile finché un tecnico non sposta una cassa di pochi gradi. Le associazioni imprenditoriali salutano le promesse sulla logistica, i sindacati chiedono garanzie sulla sicurezza.",
      date: "18/06/2001",
      soul: 0,
    },
    {
      title:
        "Euro cash rollout: first sealed pallets pre-positioned in Italy and Spain",
      titleIt:
        "Contante euro: prime pedane sigillate preposizionate in Italia e Spagna",
      desc: "Armored carriers moved sealed pallets of euro coins to regional depots under police escort. Goblin vault technicians ran under-pallet checks and thermal scans for tampering. A roadside crowd applauded as a convoy passed and the sound briefly phased like a chorus, a simple echo between stone walls.",
      desc_it:
        "I portavalori trasferiscono pedane sigillate di monete euro verso depositi regionali sotto scorta. Tecnici goblin dei caveau effettuano ispezioni sotto i pallet e scansioni termiche per eventuali manomissioni. Lungo la strada un applauso al passaggio di un convoglio si ‘mette in fase’ come un coro, semplice eco tra muri in pietra.",
      date: "18/06/2001",
      soul: -4,
    },
    {
      title: "Britannia State Opening: Queen’s Speech outlines second-term agenda",
      titleIt:
        "Britannia: il Queen’s Speech definisce l’agenda del secondo mandato",
      desc: "The legislative program focused on public services, crime, and cautious euro policy. A camera at Westminster briefly mirrored a floor pattern, sparking jokes about a ‘palace portal’ before the graphics operator reset an overlay. Parties calibrated talking points for regional tours.",
      desc_it:
        "Il programma legislativo punta su servizi pubblici, sicurezza e una linea prudente sull’euro. Una camera a Westminster per pochi istanti specchia un motivo del pavimento, scatenando ironie su un ‘portale di palazzo’ prima che il grafico ripristini l’overlay. I partiti calibrano i messaggi per i tour regionali.",
      date: "19/06/2001",
      soul: -2,
    },
    {
      title: "Macedonia: tensions rise near Aračinovo outside Skopje",
      titleIt: "Macedonia: tensione arce ad Aračinovo alle porte di Skopje",
      desc: "Security forces reinforced checkpoints after sightings of armed groups near the industrial zone. NATO liaison expanded deconfliction channels. Residents reported doubled echoes of distant shots at dusk, an acoustic mirror from a sharp temperature inversion along the valley floor.",
      desc_it:
        "Le forze di sicurezza rinforzano i checkpoint dopo avvistamenti di gruppi armati vicino alla zona industriale. La liaison NATO amplia i canali di de-conflitto. I residenti segnalano eco raddoppiate di spari al crepuscolo, specchio acustico dovuto a una netta inversione termica sul fondovalle.",
      date: "19/06/2001",
      soul: 7,
    },
    {
      title:
        "Italy: Chamber of Deputies grants confidence to the Berlusconi government",
      titleIt:
        "Italia: la Camera dei Deputati accorda la fiducia al governo Berlusconi",
      desc: "After a long debate, the lower house approved the confidence motion. The session closed with a tidy clap that seemed to ripple in beats, quickly traced to a balcony echo. Markets priced continuity and watched for early tax decrees.",
      desc_it:
        "Dopo un lungo dibattito, la Camera approva la mozione di fiducia. La seduta si chiude con un applauso che pare ondulare a battiti, subito ricondotto all’eco di una balconata. I mercati prezzano la continuità e attendono i primi decreti fiscali.",
      date: "20/06/2001",
      soul: -3,
    },
    {
      title: "Britannia: rail and road agencies publish summer heat protocols",
      titleIt:
        "Britannia: agenzie ferrovia e strade pubblicano protocolli caldo estivo",
      desc: "Network teams pushed guidance on rails under heat load, roadside water points, and passenger comms. A depot demo used misting fans that made fluorescent tubes seem to pulse in time, an optical trick from air density gradients.",
      desc_it:
        "I gestori delle reti diffondono linee guida su dilatazione dei binari, punti acqua sulle strade e comunicazioni ai passeggeri. In un deposito i ventilatori nebulizzanti fanno ‘pulsare’ le lampade al neon, trucco ottico da gradienti di densità dell’aria.",
      date: "20/06/2001",
      soul: -1,
    },
    {
      title: "Total solar eclipse sweeps Africa from Angola to Madagascar",
      titleIt:
        "Eclissi solare totale attraversa l’Africa da Angola a Madagascar",
      desc: "A narrow path of totality crossed southern Africa as crowds gathered with eclipse glasses. Astronomers filmed the corona and measured temperature drops. In Lusaka a stadium fell silent as daylight turned to slate, a hush that felt like magic but was only shadow and awe.",
      desc_it:
        "Una stretta fascia di totalità attraversa l’Africa australe mentre le folle si radunano con occhiali da eclissi. Gli astronomi riprendono la corona e misurano cali di temperatura. A Lusaka uno stadio tace quando il giorno diventa ardesia, sensazione di magia che è solo ombra e stupore.",
      date: "21/06/2001",
      soul: -8,
    },
    {
      title: "Stonehenge solstice gathering under managed access",
      titleIt: "Solstizio a Stonehenge con accesso regolamentato",
      desc: "Thousands welcomed the sunrise with drums and quiet cheers. A low mist made the stones seem to float. Heritage staff posted a calm note explaining parhelia and lens flare after a handful of photos suggested faint halos.",
      desc_it:
        "Migliaia di persone salutano l’alba con tamburi e applausi contenuti. Una leggera foschia fa sembrare i monoliti sospesi. Lo staff del sito pubblica una nota che spiega paraelie e flare delle lenti dopo alcune foto con aloni evanescenti.",
      date: "21/06/2001",
      soul: -5,
    },
    {
      title: "Italy: Senate grants confidence, government fully seated",
      titleIt:
        "Italia: il Senato accorda la fiducia, governo pienamente operativo",
      desc: "The upper house approved the confidence motion. Agencies published a first packet of deadlines on tax decrees and procurement audits. A corridor PA briefly produced a ghostly chorus until a loose ceiling panel was clipped back into place.",
      desc_it:
        "Il Senato approva la fiducia. Le amministrazioni pubblicano un primo pacchetto di scadenze su decreti fiscali e audit degli appalti. Un impianto in corridoio produce per poco un ‘coro fantasma’ finché un pannello del soffitto non viene fissato.",
      date: "21/06/2001",
      soul: -3,
    },
    {
      title: "Aračinovo showdown begins on Skopje’s edge",
      titleIt: "Inizia lo scontro ad Aračinovo alle porte di Skopje",
      desc: "Macedonian forces moved on positions near Aračinovo as gunfire echoed toward the capital. NATO liaison urged restraint and set up medical corridors. Residents filmed doubled echoes that made shots sound like answers, a physics prank from the valley’s inverted layers.",
      desc_it:
        "Le forze macedoni avanzano su posizioni ad Aračinovo mentre gli spari riecheggiano verso la capitale. La liaison NATO chiede moderazione e predispone corridoi sanitari. I residenti filmano eco raddoppiate che fanno sembrare i colpi risposte, scherzo della fisica nelle inversioni del fondovalle.",
      date: "22/06/2001",
      soul: 11,
    },
    {
      title:
        "Peru struck by powerful Arequipa earthquake; Pacific alerts issued",
      titleIt:
        "Perù colpito da forte terremoto ad Arequipa; allerta nel Pacifico",
      desc: "A major quake off southern Peru damaged roads, churches, and ports, with shaking felt across the region. Hospitals triaged the injured as aftershocks rattled nerves. Pacific centers issued tsunami bulletins and later lifted them for distant coasts. European rescue teams readied assessment missions.",
      desc_it:
        "Un forte sisma al largo del sud del Perù danneggia strade, chiese e porti, con scosse avvertite in tutta la regione. Gli ospedali gestiscono il triage mentre le repliche mettono alla prova i nervi. I centri del Pacifico emettono bollettini di tsunami poi revocati per le coste lontane. Le squadre europee si preparano a missioni di valutazione.",
      date: "23/06/2001",
      soul: 13,
    },
    {
      title: "EU civil protection readies airlift palettes for Peru relief",
      titleIt: "La Protezione civile UE prepara pallet per i soccorsi in Perù",
      desc: "Member states assembled kits of tents, water purifiers, and field lights. A loading bay tested felt-lined pallet jacks for quiet night work near residential zones. Logistics crews marked crates with large plain-language icons to cut translation lag on the ground.",
      desc_it:
        "Gli Stati membri assemblano kit di tende, potabilizzatori e illuminazione da campo. Una baia di carico prova transpallet foderati per lavorare di notte vicino alle abitazioni. Le squadre di logistica marcano le casse con grandi icone in linguaggio semplice per ridurre i tempi di traduzione sul campo.",
      date: "23/06/2001",
      soul: -6,
    },
    {
      title: "Aračinovo crisis deepens; negotiations over evacuation terms",
      titleIt:
        "Crisi di Aračinovo si aggrava; trattative su condizioni di evacuazione",
      desc: "After intense fighting, mediators pressed for an evacuation to defuse the confrontation near the capital. Crowds in Skopje seethed. A substation hum rolled in phase with chants until engineers re-phased inverters, a banal but calming fix.",
      desc_it:
        "Dopo scontri intensi, i mediatori spingono per una evacuazione per disinnescare il confronto alle porte della capitale. A Skopje la folla è in fibrillazione. Un ronzio di sottostazione si mette in fase con i cori finché i tecnici non ri-sincronizzano gli inverter, rimedio banale ma calmante.",
      date: "23/06/2001",
      soul: 9,
    },
    {
      title: "European Grand Prix at the Nürburgring: Michael Schumacher wins",
      titleIt: "Gran Premio d’Europa al Nürburgring: vince Michael Schumacher",
      desc: "Ferrari’s Michael Schumacher took victory after clean stops and steady pace. A heat shiver above a grandstand made a camera feed look like a mirage for a second, logged as normal convection. Italian fans celebrated with car horns that phased into a tidy triad near the exit ramps.",
      desc_it:
        "Michael Schumacher su Ferrari vince grazie a soste pulite e passo costante. Un tremolio di calore sopra una tribuna fa sembrare per un attimo il feed video un miraggio, catalogato come normale convezione. I tifosi italiani festeggiano con clacson che si mettono in triade ordinata vicino alle rampe di uscita.",
      date: "24/06/2001",
      soul: -6,
    },
    {
      title: "Aračinovo fighters evacuated under international oversight",
      titleIt:
        "Evacuazione dei combattenti da Aračinovo sotto supervisione internazionale",
      desc: "Buses departed with armed men after a controversial deal brokered to defuse fighting near Skopje. Crowds jeered and threw debris. International officials stressed that deconfliction saved lives and space for talks. The valley’s doubled echoes finally faded as the night cooled.",
      desc_it:
        "Autobus partono con uomini armati dopo un accordo contestato per disinnescare i combattimenti vicino a Skopje. La folla urla e lancia oggetti. I funzionari internazionali sottolineano che il de-conflitto ha salvato vite e spazio per i colloqui. Le eco raddoppiate della valle sfumano quando la notte si raffredda.",
      date: "24/06/2001",
      soul: 8,
    },
    {
      title: "Venice Biennale opens to the public; crowds and careful shadows",
      titleIt:
        "La Biennale di Venezia apre al pubblico; folle e ombre studiate",
      desc: "Giardini and Arsenale welcomed ticket-holders with shaded queues and water points. A ‘breathing wall’ installation drew laughs when a child found the hidden micro-fans. Vaporetto crews staggered arrivals to keep platforms safe.",
      desc_it:
        "Giardini e Arsenale accolgono i visitatori con file all’ombra e punti acqua. Una ‘parete respirante’ fa sorridere quando un bambino individua le micro-ventole nascoste. Le squadre dei vaporetti scaglionano gli arrivi per mantenere sicuri i pontili.",
      date: "24/06/2001",
      soul: -5,
    },
    {
      title: "North Sea dawn mirage returns as summer inversion sets in",
      titleIt:
        "All’alba sul Mare del Nord torna il miraggio con l’inversione estiva",
      desc: "Pilots on the Aberdeen–Stavanger run again logged a thin silver band and briefly doubled ships on the horizon. Met offices filed it as ducting under a cold marine layer. Crews joked that the sea was practicing photocopying.",
      desc_it:
        "I piloti sulla rotta Aberdeen–Stavanger registrano di nuovo una sottile banda argentea e navi ‘raddoppiate’ all’orizzonte. I servizi meteo lo classificano come canalizzazione sotto uno strato marino freddo. Gli equipaggi scherzano che il mare si allena a fotocopiare.",
      date: "24/06/2001",
      soul: -1,
    },
    {
      title: "Wimbledon opens under changeable skies and crisp grass",
      titleIt: "Wimbledon apre tra cieli mutevoli ed erba perfetta",
      desc: "Play began at the All England Club after a cool, bright morning gave way to clouds. Umbrellas bloomed and folded in waves that made the show courts look like breathing mosaics. Early seeds advanced; stewards trialed low-noise queuing mats so grandstand feet wouldn’t thump old timber.",
      desc_it:
        "Il torneo prende il via all’All England Club: mattina fresca e luminosa, poi nubi. Gli ombrelli si aprono e chiudono a onde, trasformando i campi in mosaici ‘respiranti’. Le teste di serie passano il turno; gli steward testano tappeti antirumore per attenuare i colpi dei passi sulle gradinate in legno.",
      date: "25/06/2001",
      soul: -3,
    },
    {
      title:
        "Skopje simmers after Aračinovo evacuation; curbs and calls for restraint",
      titleIt:
        "Skopje ribolle dopo l’evacuazione di Aračinovo; restrizioni e appelli alla calma",
      desc: "Following the controversial evacuation of fighters near the capital, Macedonian authorities tightened cordons and added liaison hotlines with NATO. Civic groups set up legal desks and first-aid points. Evening echoes doubled distant bangs along the valley, acousticians again pointed to temperature inversions, not ‘answering shots.’",
      desc_it:
        "Dopo la contestata evacuazione dei combattenti alle porte della capitale, le autorità macedoni rafforzano i cordoni e ampliano le linee di contatto con la NATO. I gruppi civici aprono sportelli legali e punti di primo soccorso. Al calare della sera gli echi raddoppiano i boati lontani nella valle, per gli acustici sono inversioni termiche, non ‘colpi che rispondono’.",
      date: "25/06/2001",
      soul: 7,
    },
    {
      title: "Peru quake aftershocks; first EU airlift sorties assemble",
      titleIt:
        "Repliche del sisma in Perù; i primi voli europei d’aiuto si preparano",
      desc: "Aftershocks rattled Arequipa and coastal towns while engineers surveyed bridges and churches. EU civil-protection teams marshalled tents, potabilizers, and field lights at Cologne/Bonn and Torrejón. A hangar PA produced a slow ‘chorus’ until a loose grille was clipped, banal physics before hard work.",
      desc_it:
        "Scosse di assestamento scuotono Arequipa e i centri costieri mentre gli ingegneri verificano ponti e chiese. Le squadre europee raccolgono tende, potabilizzatori e fari a Colonia/Bonn e Torrejón. In un hangar un ‘coro’ lento esce dall’impianto finché non fissano una griglia, fisica banale prima del lavoro duro.",
      date: "25/06/2001",
      soul: 11,
    },
    {
      title:
        "International Day Against Drug Abuse: Europe stresses treatment and data clarity",
      titleIt:
        "Giornata internazionale contro la droga: l’Europa punta su cure e chiarezza dei dati",
      desc: "Health ministries pushed treatment access and plain-language statistics, noting Portugal’s imminent decriminalization shift. City halls tested needle-return kiosks with simple iconography. A rumor that ‘silver-thread charms’ ward relapse was swatted aside by clinicians with patient guides.",
      desc_it:
        "I ministeri della salute promuovono l’accesso alle cure e statistiche in linguaggio semplice, ricordando l’imminente svolta portoghese sulla depenalizzazione. I comuni testano chioschi per la restituzione degli aghi con icone comprensibili. La voce su ‘filo d’argento’ anti-ricaduta viene smentita dai clinici con guide per i pazienti.",
      date: "26/06/2001",
      soul: -4,
    },
    {
      title: "Skopje protesters storm Parliament over Aračinovo deal",
      titleIt:
        "Skopje, i manifestanti irrompono in Parlamento per l’accordo su Aračinovo",
      desc: "Crowds angered by the evacuation deal forced their way into the Macedonian Assembly, damaging offices before police restored control. EU and NATO urged restraint and a return to talks. Nightfall brought a hard quiet broken only by helicopter thrum and distant sirens.",
      desc_it:
        "Folle indignate per l’evacuazione irrompono nell’Assemblea macedone, danneggiando uffici prima del ripristino dell’ordine. UE e NATO invitano alla moderazione e alla ripresa dei colloqui. Al calare della notte cala un silenzio teso, spezzato solo dal battito degli elicotteri e da sirene lontane.",
      date: "26/06/2001",
      soul: 12,
    },
    {
      title:
        "EU gives Galileo program another green light on governance and industry split",
      titleIt:
        "UE, nuovo via libera a Galileo su governance e ripartizione industriale",
      desc: "Transport ministers updated the governance note for Europe’s satellite navigation system, clarifying the joint undertaking and ground-segment sites. Airports and maritime pilots cheered multi-constellation resilience. A coastal radar briefly ‘duplicated’ a calibration beacon, timing drift, not twin Europe.",
      desc_it:
        "I ministri dei trasporti aggiornano la nota sulla governance di Galileo, chiarendo la joint undertaking e i siti del segmento di terra. Aeroporti e piloti marittimi salutano la resilienza multi-costellazione. Un radar costiero ‘duplica’ per pochi minuti un beacon di calibrazione, deriva temporale, non due Europe.",
      date: "26/06/2001",
      soul: -5,
    },
    {
      title: "Wimbledon day 2: early upset and a ‘singing’ awning",
      titleIt: "Wimbledon, secondo giorno: sorpresa e tenda ‘cantante’",
      desc: "An unseeded baseliner knocked out a top-20. On Court 12 a loose awning whistled at certain gusts, momentarily masking a foot-fault call until stewards shifted the rigging. Ballkids got a quiet round of applause for squeegee discipline between showers.",
      desc_it:
        "Un ribattitore fuori dalle teste di serie elimina un top 20. Sul Campo 12 una tenda allentata fischia con certe raffiche coprendo per un attimo un ‘foot-fault’, poi gli steward regolano i tiranti. I raccattapalle ricevono un applauso discreto per la disciplina con i tergipista tra gli scrosci.",
      date: "26/06/2001",
      soul: -2,
    },
    {
      title: "North Sea dawn draws a thin ‘silver line’ yet again",
      titleIt: "All’alba sul Mare del Nord torna la sottile ‘linea d’argento’",
      desc: "Pilots on Aberdeen–Stavanger morning runs logged the stationary band and briefly doubled ships. Met offices filed it as ducting under a cold marine layer, photographers made the best of it with long lenses and coffee.",
      desc_it:
        "I piloti dei voli mattutini Aberdeen–Stavanger registrano la banda stazionaria e navi ‘raddoppiate’. I servizi meteo parlano di canalizzazione sotto uno strato marino freddo, i fotografi ne approfittano con teleobiettivi e caffè.",
      date: "27/06/2001",
      soul: -1,
    },
    {
      title: "Tenet ceasefire faces nightly strain",
      titleIt: "La tregua Tenet sotto pressione notturna",
      desc: "In Israel and the Palestinian territories, sporadic fire and arrests tested the fragile CIA-brokered ceasefire. Leaders traded accusations; envoys urged de-escalation. Hospitals kept surge kits at the ready.",
      desc_it:
        "In Israele e nei Territori palestinesi, scontri e arresti mettono alla prova la fragile tregua mediata dalla CIA. I leader si accusano a vicenda; gli inviati spingono per la de-escalation. Gli ospedali tengono pronti i kit d’emergenza.",
      date: "27/06/2001",
      soul: 8,
    },
    {
      title:
        "Albania first-round tallies consolidate; OSCE flags procedure notes",
      titleIt:
        "Albania, consolidati i conteggi del primo turno; l’OSCE segnala rilievi procedurali",
      desc: "Following the 24 June vote, tallies settled with observers citing both improvements and recurring issues in some districts. Parties geared up for July’s second round. Power dips flickered a few counting halls, bad wiring, not sabotage, said electricians.",
      desc_it:
        "Dopo il voto del 24 giugno i conteggi si consolidano; gli osservatori citano progressi e criticità ricorrenti in alcuni distretti. I partiti si preparano al secondo turno di luglio. Brevi cali di tensione fanno sfarfallare alcune sale spoglio, cattivi cablaggi, non sabotaggio, dicono gli elettricisti.",
      date: "28/06/2001",
      soul: -2,
    },
    {
      title: "EU climate teams draft Bonn playbook for July",
      titleIt: "I team clima UE preparano il manuale per Bonn a luglio",
      desc: "With COP6 resumed talks nearing, EU negotiators circulated a checklist on sinks, finance, and compliance language. An annex urged plain-language briefings to keep rumor cycles from outpacing the science.",
      desc_it:
        "In vista della ripresa della COP6 a Bonn, i negoziatori UE diffondono una checklist su assorbimenti, finanza e regole di conformità. Un allegato raccomanda briefing in linguaggio semplice per evitare che i cicli di voci superino la scienza.",
      date: "28/06/2001",
      soul: -3,
    },
    {
      title:
        "“A.I. Artificial Intelligence” opens in the U.S.; Europe queues trailers",
      titleIt:
        "“A.I. Intelligenza Artificiale” debutta negli USA; in Europa file per i trailer",
      desc: "Spielberg’s future-fable reached American screens to strong interest; European cinemas announced staggered summer releases. Lobby projectors made dust motes look like starfields, ushers reminded patrons it was air and light, nothing more mystic.",
      desc_it:
        "La fiaba futuribile di Spielberg arriva nelle sale USA con grande interesse; in Europa uscite scaglionate in estate. I proiettori delle hall trasformano la polvere in ‘cieli stellati’, gli addetti ricordano che sono aria e luce, niente di mistico.",
      date: "29/06/2001",
      soul: -2,
    },
    {
      title: "EU relief flights depart for Peru with field hospitals",
      titleIt: "Partono i voli UE per il Perù con ospedali da campo",
      desc: "Widebodies lifted off from Cologne/Bonn and Madrid carrying tents, generators, and surgical modules. Goblin loaders in night crews worked felt-lined pallet jacks to keep neighbors asleep. Crews marked crates with big icon labels to cut translation lag on the ramp.",
      desc_it:
        "Da Colonia/Bonn e Madrid decollano widebody carichi di tende, generatori e moduli chirurgici. Squadre notturne con carrelli foderati per non disturbare i residenti lavorano con addetti goblin. Le casse hanno grandi etichette a icone per ridurre i tempi di traduzione in pista.",
      date: "29/06/2001",
      soul: -6,
    },
    {
      title: "Britannia foot-and-mouth trend eases; more trails reopen under rules",
      titleIt:
        "Afta epizootica in calo in Britannia; riaprono altri sentieri con regole",
      desc: "Authorities reported improved indicators and added pilot reopenings of footpaths with disinfectant mats and signage. Farmers warned the season could still crater without clear timetables. A rural lay-by hosted a tiny fair for walkers, tea urns, boot scrapers, and maps.",
      desc_it:
        "Le autorità riferiscono indicatori in miglioramento e ampliano riaperture pilota dei sentieri con tappeti disinfettanti e segnaletica. Gli allevatori avvertono che la stagione può ancora crollare senza tempi certi. In una piazzola rurale nasce una mini fiera per escursionisti, samovar, spazzole per scarponi e mappe.",
      date: "29/06/2001",
      soul: -5,
    },
    {
      title: "EuroPride Vienna draws a joyful crowd and careful logistics",
      titleIt: "EuroPride a Vienna: festa di folla e logistica attenta",
      desc: "Parade routes through the Ringstrasse filled with flags and music. Marshals used soft cordons and shade tents; water points dotted the route. A wind eddy made confetti hover like a tiny galaxy before a bus gust cleared it.",
      desc_it:
        "I percorsi sulla Ringstrasse si riempiono di bandiere e musica. I marshal usano cordoni morbidi e tende d’ombra; punti acqua lungo il tragitto. Un refolo fa fluttuare coriandoli come una piccola galassia prima che una folata di bus li disperda.",
      date: "30/06/2001",
      soul: -8,
    },
    {
      title: "Kursk salvage consortium stages gear; autumn lift still the plan",
      titleIt:
        "Recupero del Kursk: il consorzio schiera i mezzi; sollevamento in autunno",
      desc: "Mammoet–Smit teams pre-positioned hardware for the Northern Fleet submarine salvage. Engineers walked through cut-and-lift sequences and published a plain-language safety note. A dockside crane hummed in sympathy with a generator, tightened bolts, hum gone.",
      desc_it:
        "I team Mammoet–Smit preposizionano le attrezzature per il recupero del sottomarino della Flotta del Nord. Gli ingegneri illustrano le fasi di taglio e sollevamento e pubblicano una nota di sicurezza in linguaggio semplice. Una gru di banchina ‘canta’ in simpatia con un generatore, si stringono i bulloni e il ronzio sparisce.",
      date: "30/06/2001",
      soul: 2,
    },
    {
      title:
        "Belgium assumes EU Council presidency; euro cash and justice top the slate",
      titleIt:
        "Il Belgio assume la presidenza del Consiglio UE; contante euro e giustizia in cima",
      desc: "Brussels took the helm for the July–December term, flagging the physical euro roll-out, asylum and justice files, and eEurope projects. A subdued ceremony stressed logistics over fireworks, plenty of barcodes, few brass bands.",
      desc_it:
        "Bruxelles prende il timone per luglio–dicembre, con priorità su introduzione del contante euro, dossier asilo e giustizia ed eEurope. Cerimonia sobria, più logistica che fanfare, molti codici a barre, poche bande.",
      date: "01/07/2001",
      soul: -3,
    },
    {
      title: "Portugal decriminalizes personal possession of drugs",
      titleIt: "Il Portogallo depenalizza il possesso personale di droghe",
      desc: "Lisbon’s pioneering law took effect, replacing criminal penalties for small quantities with administrative panels and treatment pathways. Health services scaled counseling and harm-reduction programs. Broadcasters labeled explainers in plain language to cut rumor cycles.",
      desc_it:
        "Entra in vigore la legge di Lisbona che sostituisce le pene penali per piccole quantità con commissioni amministrative e percorsi di cura. I servizi sanitari potenziano counseling e riduzione del danno. Le tv trasmettono spiegazioni in linguaggio semplice per evitare voci incontrollate.",
      date: "01/07/2001",
      soul: -9,
    },
    {
      title: "Hong Kong marks handover anniversary with low-key events",
      titleIt:
        "Hong Kong celebra l’anniversario della restituzione con eventi discreti",
      desc: "Officials held restrained ceremonies as summer humidity built over Victoria Harbour. Community groups organized discussions on governance and daily life. A brief sea breeze made harbor flags ripple in clean phase lines, photographers caught the geometry from the Peak.",
      desc_it:
        "Cerimonie sobrie mentre l’umidità estiva sale su Victoria Harbour. I gruppi civici organizzano discussioni su governo e vita quotidiana. Un refolo allinea le bandiere del porto in linee di fase pulite, i fotografi immortalano la geometria dal Peak.",
      date: "01/07/2001",
      soul: -2,
    },
    {
      title:
        "Belgium unveils EU Council work program: euro cash, justice, eEurope",
      titleIt:
        "Il Belgio svela il programma del Consiglio UE: contante euro, giustizia, eEurope",
      desc: "Starting its July–December presidency, Belgium published a plain-language slate prioritizing the physical euro rollout, asylum and justice files, and open interfaces for public e-services. Ministers promised monthly dashboards and ‘no black-box oracles’ in eligibility systems. Civic tech groups cheered the tone; a few vendors grumbled about losing mystique.",
      desc_it:
        "All’avvio della presidenza luglio–dicembre, il Belgio pubblica un programma in linguaggio semplice con priorità su introduzione fisica dell’euro, dossier asilo e giustizia e interfacce aperte per i servizi pubblici digitali. I ministri promettono cruscotti mensili e ‘niente oracoli opachi’ nei sistemi di idoneità. Gli attivisti civici applaudono; qualche fornitore brontola per la perdita dell’aura proprietaria.",
      date: "02/07/2001",
      soul: -3,
    },
    {
      title:
        "Genoa G8: final perimeter maps and accreditation windows published",
      titleIt:
        "G8 Genova: pubblicate le mappe definitive dei perimetri e le finestre di accredito",
      desc: "Palazzo Tursi released Red/Yellow Zone boundaries, delivery hours, and ombuds desks. Port detours came with acoustic caps for night bays and live decibel dashboards. A rehearsal on Via XX Settembre produced a tidy ‘beat’ between shop awnings, architectural, not arcane.",
      desc_it:
        "Palazzo Tursi diffonde i confini delle Zone Rossa/Gialla, orari consegne e sportelli del garante. I dirottamenti portuali prevedono cappucci acustici per le baie notturne e cruscotti dei decibel in tempo reale. Una prova su Via XX Settembre genera un ‘battito’ ordinato tra le tende dei negozi, effetto architettonico, non arcano.",
      date: "02/07/2001",
      soul: 2,
    },
    {
      title: "Wimbledon: middle-Monday marathons and a ‘singing’ tarp",
      titleIt: "Wimbledon: lunedì centrale tra maratone e telone ‘cantante’",
      desc: "Five-set grinders captivated Court 2 while a loose rain tarp on an outside court resonated in a low flute during gusts. Umpires paused, stewards shifted rigging, play resumed. Fans praised ballkids who squeegeed with metronomic calm between sunbreaks.",
      desc_it:
        "Sui campi secondari maratone in cinque set, mentre un telone allentato risuona come un flauto basso con le raffiche. Gli arbitri fermano, gli steward regolano i tiranti e si riparte. Il pubblico elogia i raccattapalle per la calma metronomica tra gli spiragli di sole.",
      date: "02/07/2001",
      soul: -2,
    },
    {
      title: "Milošević makes first appearance before the ICTY",
      titleIt: "Milošević alla prima comparizione davanti all’ICTY",
      desc: "In The Hague, Slobodan Milošević appeared before the tribunal and challenged its legitimacy. Proceedings focused on representation and scheduling. Outside, a small crowd rotated banners in respectful silence; a wind eddy lifted leaflet edges like fish scales along the pavement.",
      desc_it:
        "All’Aia Slobodan Milošević compare davanti al tribunale e contesta la legittimità della corte. L’udienza verte su rappresentanza e calendario. All’esterno una piccola folla fa ruotare gli striscioni in silenzio; un refolo solleva i bordi dei volantini come squame sul selciato.",
      date: "03/07/2001",
      soul: -4,
    },
    {
      title: "eEurope progress note pushes open interfaces and accessibility",
      titleIt:
        "Aggiornamento eEurope spinge su interfacce aperte e accessibilità",
      desc: "The Commission circulated milestones on local-loop unbundling, school connectivity, and plain-language portals. A technical annex warned against ‘black-box divination engines’ in welfare and tax decisions and proposed public hash registries for audit trails.",
      desc_it:
        "La Commissione diffonde traguardi su disaggregazione dell’ultimo miglio, connettività scolastica e portali in linguaggio semplice. Un allegato tecnico mette in guardia dai ‘motori oracolari opachi’ in materia fiscale e sociale e propone registri pubblici di hash per le piste di controllo.",
      date: "03/07/2001",
      soul: -4,
    },
    {
      title: "Atlantis rolls to the pad for STS-104 quest",
      titleIt: "Atlantis raggiunge la rampa in vista di STS-104",
      desc: "NASA rolled Space Shuttle Atlantis to the pad ahead of a mid-July mission to deliver the ISS Quest airlock. Nighttime shots showed floodlights catching vent steam like silver gauze; engineers posted the usual ‘not ghosts, just physics’ explainer.",
      desc_it:
        "La NASA porta lo Shuttle Atlantis in rampa per la missione di metà luglio che consegnerà l’airlock Quest alla ISS. Le immagini notturne mostrano i fari che illuminano il vapore degli sfiati come garze d’argento; gli ingegneri ricordano: ‘niente fantasmi, solo fisica’.",
      date: "03/07/2001",
      soul: -7,
    },
    {
      title:
        "Fourth of July abroad: fireworks from bases and consulates, air-safety reminders",
      titleIt:
        "4 luglio all’estero: fuochi da basi e consolati, promemoria sulla sicurezza aerea",
      desc: "U.S. facilities in Europe hosted restrained fireworks; aviation notices asked hobby pilots to mind temporary restrictions. Noctilucent clouds flickered over Scotland and Denmark, briefly turning smoke plumes into silver ribbons before the breeze tore them apart.",
      desc_it:
        "Strutture USA in Europa organizzano fuochi d’artificio contenuti; gli avvisi ai naviganti ricordano ai piloti amatoriali le restrizioni temporanee. Nubi nottilucenti brillano su Scozia e Danimarca trasformando per poco le scie in nastri d’argento prima che la brezza li disperda.",
      date: "04/07/2001",
      soul: -2,
    },
    {
      title: "North Sea at dawn: the thin ‘silver line’ returns once more",
      titleIt: "Mare del Nord all’alba: ritorna la sottile ‘linea d’argento’",
      desc: "Morning crews on the Aberdeen–Stavanger run logged a stationary band and briefly doubled trawlers low on the horizon. Met offices filed it as a ducting mirage under a cold marine layer. Coffee, photos, business as usual.",
      desc_it:
        "Gli equipaggi mattutini sulla rotta Aberdeen–Stavanger segnalano una banda stazionaria e pescherecci ‘raddoppiati’ all’orizzonte. I servizi meteo lo classificano come miraggio da canalizzazione sotto uno strato marino freddo. Caffè, foto, e si prosegue.",
      date: "04/07/2001",
      soul: -1,
    },
    {
      title: "Ceasefire declared in Macedonia after weeks of clashes",
      titleIt: "Dichiarata una tregua in Macedonia dopo settimane di scontri",
      desc: "Skopje and ethnic Albanian representatives announced a ceasefire. NATO liaison widened hotlines; EU envoys pushed talks toward a political outline. Residents filmed the valley finally quieting at dusk, with only a distant transformer hum that engineers re-phased out of sync with human nerves.",
      desc_it:
        "Skopje e rappresentanti albanesi annunciano una tregua. La liaison NATO amplia le linee dirette; gli inviati UE spingono i colloqui verso un canovaccio politico. I residenti filmano la valle che finalmente tace al crepuscolo, con solo un ronzio lontano di sottostazione che i tecnici ri-sincronizzano fuori dalla ‘frequenza dei nervi’.",
      date: "05/07/2001",
      soul: -6,
    },
    {
      title: "Tour de France team presentation draws crowds in Dunkirk",
      titleIt:
        "Presentazione delle squadre del Tour a Dunkerque, folla e festa",
      desc: "Riders rolled onto a seaside stage as fans waved tricolors. A sea breeze made confetti hang like a slow galaxy before a bus gust cleared it. Mechanics whispered about marginal gains and cable-fairing stickers.",
      desc_it:
        "I corridori sfilano su un palco sul mare tra tricolori al vento. Un refolo fa fluttuare i coriandoli come una galassia lenta prima che una folata di bus li disperda. I meccanici parlano a bassa voce di piccoli guadagni aerodinamici e adesivi sulle guaine.",
      date: "05/07/2001",
      soul: -4,
    },
    {
      title: "Gothenburg inquiry sets hearing calendar and evidence rules",
      titleIt: "L’inchiesta su Göteborg fissa calendario e regole della prova",
      desc: "Swedish authorities published a timetable for reviewing protest policing and use of live rounds. Civil-rights groups welcomed public submissions. A city hall atrium briefly amplified whispers into choir-like blooms until a speaker was nudged six meters.",
      desc_it:
        "Le autorità svedesi pubblicano il calendario per esaminare l’ordine pubblico e l’uso di munizioni vere. Le associazioni per i diritti accolgono con favore le memorie pubbliche. Un atrio municipale amplifica per poco i sussurri come un coro finché non spostano una cassa di sei metri.",
      date: "06/07/2001",
      soul: -2,
    },
    {
      title: "Henley Royal Regatta: oars hum in cross-wind, finals loom",
      titleIt:
        "Henley Royal Regatta: i remi ‘cantano’ con il vento trasversale, finali in vista",
      desc: "Crews battled blustery stretches that made carbon oars sing at certain angles. Umpires issued routine cautions; riverside tea tents brimmed. A brass band’s low note synced with a passing skiff, making a neat Doppler duet.",
      desc_it:
        "Le imbarcazioni affrontano raffiche che fanno ‘cantare’ i remi in carbonio a certi angoli. Gli arbitri danno i soliti richiami; le tende del tè sono piene. Una nota bassa della banda si sincronizza con una barca in transito, creando un elegante duetto Doppler.",
      date: "06/07/2001",
      soul: -3,
    },
    {
      title: "Genoa G8: legal observers and medics finalize playbooks",
      titleIt:
        "G8 Genova: osservatori legali e medici chiudono i manuali operativi",
      desc: "Volunteer networks printed de-escalation scripts, first-aid checklists, and public hash registries for footage integrity. Mesh-radio relays marked rooftops for line-of-sight. A shaded caruggi corridor tested quiet-delivery pallet jacks after dark.",
      desc_it:
        "Le reti di volontari stampano schede di de-escalation, checklist di primo soccorso e registri pubblici di hash per l’integrità dei filmati. Le radio mesh segnano i tetti in linea di vista. Nei caruggi si prova di notte un corridoio per consegne ‘silenziose’ con transpallet foderati.",
      date: "06/07/2001",
      soul: -3,
    },
    {
      title: "Wimbledon Women’s Final: Venus Williams retains the title",
      titleIt:
        "Finale femminile di Wimbledon: Venus Williams conserva il titolo",
      desc: "Venus Williams defeated Justine Henin in a three-set final, her power game peaking in the decider. A light breeze made flags ripple in clean phase lines; photographers caught the geometry from the upper tiers. Ushers kept aisles clear as champagne corks threatened to pop in sync.",
      desc_it:
        "Venus Williams batte Justine Henin in una finale in tre set, con un terzo parziale dominato. Una brezza leggera allinea le bandiere in linee di fase ordinate; i fotografi colgono la geometria dagli anelli superiori. Gli steward tengono liberi i corridoi mentre i tappi di champagne minacciano di saltare all’unisono.",
      date: "07/07/2001",
      soul: -8,
    },
    {
      title: "San Fermín opens in Pamplona; first encierro brings injuries",
      titleIt:
        "Si apre San Fermín a Pamplona; il primo encierro registra feriti",
      desc: "The chupinazo launched a week of festivities. The first running of the bulls saw several gorings and trampling injuries as crowds surged in narrow streets. Medics praised quick stretcher lanes. Confetti cyclones lingered in an alley like a tiny galaxy before a gust cleared them.",
      desc_it:
        "Con il chupinazo parte una settimana di festa. Il primo encierro registra varie cornate e contusioni con le folle compresse nei vicoli. I soccorritori elogiano le corsie barella. In un vicolo vortici di coriandoli restano sospesi come una piccola galassia finché una folata non li disperde.",
      date: "07/07/2001",
      soul: 6,
    },
    {
      title: "Tour de France prologue: home roar as early yellow changes hands",
      titleIt:
        "Prologo del Tour de France: boato di casa, maglia gialla subito in gioco",
      desc: "A wind-kissed seaside prologue shuffled the top board by seconds, with French cheers peaking for a local leader. Mechanics swapped chain-lube recipes; TV slow-mo made riders look like they pedaled through mercury.",
      desc_it:
        "Un prologo sul mare, baciato dal vento, rimescola la classifica per pochi secondi, con il boato francese al picco per un leader di casa. I meccanici si scambiano ricette di lubrificanti; gli slow-motion TV fanno sembrare i corridori immersi nel mercurio.",
      date: "07/07/2001",
      soul: -5,
    },
    {
      title: "Britannia foot-and-mouth indicators ease; more trails reopen",
      titleIt:
        "Afta epizootica in calo in Britannia; riaprono altri sentieri",
      desc: "Authorities added pilot reopenings under strict hygiene rules. Rangers and goblin auxiliaries staffed gates near grazing herds. Tourism boards begged walkers to ‘respect the cordon’ so the season wouldn’t crater.",
      desc_it:
        "Le autorità avviano ulteriori riaperture pilota con rigide regole d’igiene. Guardiaparco e ausiliari goblin presidiano i varchi vicino ai pascoli. Gli enti turistici chiedono ai camminatori di ‘rispettare il cordone’ per salvare la stagione.",
      date: "07/07/2001",
      soul: -4,
    },
    {
      title: "Pamplona’s second encierro, fewer injuries after cooler dawn",
      titleIt:
        "Secondo encierro a Pamplona, meno feriti grazie all’alba più fresca",
      desc: "A cooler morning slowed crowd surges; medics reported fewer serious cases. Runners said hoofbeats sounded doubled in one bend, acousticians blamed stone walls focusing echoes like a horn.",
      desc_it:
        "La mattina più fresca modera la pressione della folla; i medici segnalano meno casi gravi. Alcuni corridori raccontano di zoccoli ‘raddoppiati’ in una curva, gli acustici accusano i muri in pietra che focalizzano l’eco come un corno.",
      date: "08/07/2001",
      soul: 3,
    },
    {
      title: "Genoa G8: accreditation closes; press center power drill",
      titleIt:
        "G8 Genova: chiude l’accredito; prova generale elettrica al media center",
      desc: "Accreditation windows closed as technicians staged a full power-fail rehearsal at Magazzini del Cotone. Diesel gensets caught in under seven seconds; UPS bridged gaps. A read-only tee from the Argus graph produced aggregate crowd meters on pool monitors, privacy ombuds signed off.",
      desc_it:
        "Chiudono le finestre per gli accrediti mentre ai Magazzini del Cotone si simula un blackout completo. I gruppi elettrogeni entrano in sette secondi e gli UPS colmano il vuoto. Una derivazione in sola lettura dal grafo di Argus fornisce ai monitor del pool le metriche aggregate, il garante privacy dà l’ok.",
      date: "08/07/2001",
      soul: 1,
    },
    {
      title:
        "Tour de France stage 1: winds, echelons, and a fan-shaped peloton",
      titleIt: "Tour de France tappa 1: vento, ventagli e plotone a ventaglio",
      desc: "Crosswinds split the field into classic echelons on open roads. Team cars choreographed bottle hand-offs while roadside volunteers topped up water points. Helicams caught shimmering heat above wheat like a mirage veil.",
      desc_it:
        "Il vento laterale spezza il gruppo in ventagli sulle strade aperte. Le ammiraglie coreografano i rifornimenti mentre i volontari ricaricano i punti acqua. Le riprese dall’alto colgono tremolii di calore sopra il grano come un velo di miraggio.",
      date: "08/07/2001",
      soul: -4,
    },
    {
      title: "Macedonia ceasefire mostly holds; sporadic violations probed",
      titleIt:
        "Macedonia, tregua in gran parte regge; indagate violazioni sporadiche",
      desc: "Monitors logged a handful of incidents and pushed clarifications on patrol lines. Hotlines stayed busy; a valley substation hum that once synced with chants now sat blessedly off-beat after engineers re-phased the inverters.",
      desc_it:
        "I monitor registrano pochi incidenti e sollecitano chiarimenti sulle linee di pattuglia. Le linee dirette restano attive; il ronzio di una sottostazione che un tempo si metteva in fase coi cori ora è felicemente fuori tempo dopo la ri-sincronizzazione degli inverter.",
      date: "08/07/2001",
      soul: -3,
    },
    {
      title:
        "Italy issues Genoa G8 crowd-management primers, ombuds map, and ‘quiet logistics’ lanes",
      titleIt:
        "Italia pubblica vademecum su gestione folle per il G8 di Genova, mappa dei garanti e corsie di ‘logistica silenziosa’",
      desc: "Interior and civil-protection offices released plain-language guides on de-escalation, first-aid triage, and footage-integrity hash ledgers. Port detours added felt-lined pallet jacks for night deliveries to reduce clatter in caruggi. Volunteer meshes tested rooftop relays along Via XX Settembre. A rehearsal beat formed between shop awnings until a tech re-angled one support.",
      desc_it:
        "Interno e Protezione civile diffondono guide in linguaggio semplice su de-escalation, triage e registri di hash per l’integrità dei filmati. I dirottamenti del porto prevedono transpallet foderati per consegne notturne senza fracasso nei caruggi. Le reti mesh dei volontari testano relay sui tetti lungo Via XX Settembre. Durante una prova un ‘battito’ rimbalza tra le tende finché un tecnico non ruota un supporto.",
      date: "09/07/2001",
      soul: -3,
    },
    {
      title:
        "Tour de France rolls onward; coastal crosswinds sculpt the peloton",
      titleIt:
        "Il Tour de France prosegue; i venti costieri scolpiscono il plotone",
      desc: "Echelons shattered a flat stage as mechanics traded cable-fairing stickers and marginal-gain lore. Helicams showed heat-shimmer veils over wheat fields. Neutral service cars ran water drops at village chokepoints set up by local marshals.",
      desc_it:
        "I ventagli spezzano la tappa pianeggiante mentre i meccanici si scambiano adesivi sulle guaine e trucchi da ‘marginal gains’. Le riprese dall’alto mostrano veli di miraggio sopra i campi di grano. Le vetture di assistenza neutrale effettuano rifornimenti d’acqua presso strettoie gestite dai marshal locali.",
      date: "09/07/2001",
      soul: -4,
    },
    {
      title: "Atlantis STS-104 countdown enters terminal phase",
      titleIt: "Atlantis STS-104 entra nella fase finale del countdown",
      desc: "Teams polled go for a mid-July launch to deliver the Quest airlock to the ISS. Floodlights made vent steam look like silver gauze over the pad. Engineers posted the usual ‘not ghosts, just physics’ memo to preempt rumor cycles.",
      desc_it:
        "I team danno l’ok a un lancio di metà luglio per consegnare l’airlock Quest alla ISS. I fari serali fanno sembrare gli sfiati vapore garze d’argento sulla rampa. Gli ingegneri diffondono il solito promemoria ‘non sono fantasmi, è fisica’ per prevenire voci.",
      date: "10/07/2001",
      soul: -7,
    },
    {
      title: "Genoa publishes final Red/Yellow Zone signage pack",
      titleIt:
        "Genova pubblica il pacchetto definitivo di segnaletica per Zone Rossa e Gialla",
      desc: "Palazzo Tursi released printable, icon-heavy signs for access points, med bays, and ombuds desks. Vendors got delivery windows and acoustic caps for night bays. A test at Piazza De Ferrari rendered a neat echo between fountain and porticoes until the spray pattern was dialed down.",
      desc_it:
        "Palazzo Tursi diffonde cartelli stampabili, ricchi di icone, per varchi, punti medici e sportelli del garante. I fornitori ricevono finestre di consegna e cappucci acustici per le baie notturne. Una prova in Piazza De Ferrari genera un’eco ordinata tra fontana e portici finché non viene ridotto il getto.",
      date: "10/07/2001",
      soul: -2,
    },
    {
      title: "EU climate teams finalize Bonn COP6bis playbook",
      titleIt: "I team clima UE finalizzano il manuale per Bonn (COP6bis)",
      desc: "Negotiators circulated a checklist on sinks, finance, and compliance, with a public explainer to keep rumor cycles behind the science. A side note asked broadcasters to label any audio enhancement during plenaries as non-miraculous.",
      desc_it:
        "I negoziatori diffondono una checklist su assorbimenti, finanza e regole di conformità, con un vademecum pubblico per tenere le voci dietro la scienza. Una nota chiede alle emittenti di indicare ogni potenziamento audio durante le plenarie come non miracoloso.",
      date: "11/07/2001",
      soul: -3,
    },
    {
      title: "Atlantis STS-104 launches to deliver the Quest airlock",
      titleIt: "Atlantis STS-104 decolla per consegnare l’airlock Quest",
      desc: "A clean ascent put Atlantis on course for the ISS. Night shots showed exhaust light painting low clouds like brushed steel. Amateur trackers swapped predawn pass times across Europe.",
      desc_it:
        "Un’ascesa pulita porta Atlantis in rotta verso la ISS. Le immagini notturne mostrano la luce di scarico che dipinge le nubi basse come acciaio spazzolato. I tracker amatoriali si scambiano le finestre di passaggio all’alba in Europa.",
      date: "12/07/2001",
      soul: -9,
    },
    {
      title: "ISS crew begins Quest installation EVA sequence",
      titleIt: "L’equipaggio ISS avvia la sequenza di EVA per installare Quest",
      desc: "Spacewalkers routed power and data to the new airlock. Telemetry was crisp, comm loops clean. On a ground feed a faint bell-like overtone emerged when a cooling pump matched a studio fan; producers moved the fan six meters and the tone vanished.",
      desc_it:
        "Gli astronauti instradano alimentazione e dati per il nuovo airlock. Telemetria nitida, comunicazioni pulite. In uno studio a Terra un lieve timbro campanellino emerge quando una pompa di raffreddamento si allinea con una ventola; i tecnici spostano la ventola di sei metri e il tono sparisce.",
      date: "13/07/2001",
      soul: -8,
    },
    {
      title: "Genoa: legal observers, field medics, and ombuds desks go live",
      titleIt:
        "Genova: operativi osservatori legali, medici da campo e sportelli del garante",
      desc: "Volunteer networks activated conflict de-escalation teams, first-aid posts, and hash registries for footage integrity. Mesh-radio relays established line-of-sight nodes to Magazzini del Cotone. A substation hum near Porto Antico was re-phased so it wouldn’t sync with chants.",
      desc_it:
        "Le reti di volontari attivano squadre di de-escalation, posti di primo soccorso e registri di hash per l’integrità dei filmati. Le radio mesh stabiliscono nodi in linea di vista verso i Magazzini del Cotone. Un ronzio di sottostazione al Porto Antico viene ri-sincronizzato per non finire in fase con i cori.",
      date: "13/07/2001",
      soul: -2,
    },
    {
      title: "Bastille Day across France under hot skies and tight air shows",
      titleIt: "14 luglio in Francia tra caldo e sorvoli calibrati",
      desc: "Parades and flypasts proceeded with water points and shaded queues. A lensing artifact made a vapor trail look like a glyph over the Seine for a minute before the wind shredded it. Metro lines ran late to ease crowds.",
      desc_it:
        "Parate e sorvoli con punti acqua e file in ombra. Un effetto ottico trasforma per un minuto una scia di vapore in un ‘glifo’ sulla Senna prima che il vento la disfi. La metro prolunga l’orario per alleggerire le folle.",
      date: "14/07/2001",
      soul: -4,
    },
    {
      title: "Pre-G8 arrivals trickle into Genoa; Red/Yellow cordons tested",
      titleIt: "Primi arrivi per il G8 a Genova; collaudo dei cordoni Rossa/Gialla",
      desc: "Press, NGOs, and delegations performed dry runs at access points. Deliveries rolled on capped bays. A fountain echo at De Ferrari briefly made the crowd sound choral until the spray was dialed down. Neighborhood committees posted multi-language wayfinding on blank shop shutters.",
      desc_it: "Stampa, ONG e delegazioni effettuano prove ai varchi. Le consegne proseguono su baie insonorizzate. In Piazza De Ferrari l'eco della fontana rende per poco 'corale' il brusio finché si riduce il getto. I comitati di quartiere affiggono indicazioni multilingue sulle serrande vuote.",
      date: "15/07/2001",
      time: "14:30",
      location: "Genova, Italy",
      soul: -1
    },
    {
      title: "G8 Genoa pre-briefs: hyperpowers convene; Thatcher and Sir Aleister Crowley coordinate protocols",
      titleIt: "Pre-brief del G8 di Genova: si riuniscono gli iper-poteri; Thatcher e Sir Aleister Crowley coordinano i protocolli",
      desc: "In this techno-magical timeline, the G8 hosts 'all hyperpowers' and is ceremonially co-chaired by the Iron Lady Margaret Thatcher and Sir Aleister Crowley of the Mages' Guild, who oversee seating charms, translation wards, and a vow that any 'oracular analytics' be labeled as such. Civil staff insist every effect remains strictly optical, acoustic, or paper-and-ink. Logistics teams finalize shaded queues and quiet-delivery lanes in the caruggi.",
      desc_it: "In questa timeline tecno-magica, il G8 riunisce 'tutti gli iper-poteri' ed è co-presieduto in forma cerimoniale dall'Iron Lady Margaret Thatcher e da Sir Aleister Crowley della Gilda dei Maghi, che supervisionano incanti di seduta, ward di traduzione e l'obbligo di etichettare ogni 'analitica oracolare'. Gli staff civili ribadiscono che ogni effetto resta strettamente ottico, acustico o su carta. Le squadre logistiche finalizzano file in ombra e corsie di consegna silenziosa nei caruggi.",
      date: "16/07/2001",
      time: "09:15",
      location: "Genova, Italy",
      soul: -1
    },
    {
      title: "First clashes near Convergence Center; glass harmonics from broken windows",
      titleIt: "Primi scontri vicino al Centro di Convergenza; armoniche di vetro dalle finestre rotte",
      desc: "Early confrontations erupted as activists attempted to establish autonomous zones. Shattered storefront glass created unexpected wind-chime effects in the sea breeze. Digital cameras with enchanted lenses captured 'truth-stamp' metadata while legal observers activated mesh networks broadcasting live to seventeen mirror sites. A tram bell got stuck ringing E-flat, harmonizing eerily with distant sirens.",
      desc_it: "Scoppiano prime tensioni mentre gli attivisti tentano di creare zone autonome. Il vetro frantumato delle vetrine crea effetti imprevisti di carillon nella brezza marina. Telecamere digitali con lenti incantate catturano metadati 'timbrati per la verità' mentre osservatori legali attivano reti mesh che trasmettono in diretta su diciassette siti mirror. Un campanello del tram si blocca su un mi bemolle, armonizzando in modo inquietante con sirene lontane.",
      date: "16/07/2001",
      time: "16:45",
      location: "Genova, Italy",
      soul: 7
    },
    {
      title: "Media center at Magazzini del Cotone passes failover drill",
      titleIt: "Il media center ai Magazzini del Cotone supera la prova di failover",
      desc: "UPS units bridged a staged blackout until diesel generators caught. A read-only tee from the Argus graph fed aggregate crowd metrics to pool monitors under privacy ombuds supervision. A ventilation louver produced a ghostly chorus until a technician changed its angle.",
      desc_it: "Gli UPS colmano un blackout simulato finché i generatori diesel entrano in funzione. Una derivazione in sola lettura dal grafo Argus fornisce metriche aggregate delle folle ai monitor del pool con il garante privacy presente. Una feritoia dell'aria genera un 'coro fantasma' finché un tecnico non cambia angolo.",
      date: "16/07/2001",
      time: "21:20",
      location: "Genova, Italy",
      soul: -3
    },
    {
      title: "Caravans of activists, clerics, guilds, and students reach Liguria",
      titleIt: "Carovane di attivisti, religiosi, gilde e studenti arrivano in Liguria",
      desc: "Trains, buses, and bicycles delivered thousands to camps and parishes hosting nonviolence workshops and legal clinics. Mixed human–goblin medic teams set up shade tents and water points. Wayfinding chalk sigils proved to be nothing mystical, just arrows and time slots.",
      desc_it: "Treni, pullman e biciclette portano in Liguria migliaia di persone verso campi e parrocchie con laboratori di non violenza e sportelli legali. Squadre mediche miste umani–goblin montano tende d'ombra e punti acqua. I 'sigilli' di gesso per orientarsi non sono magici: solo frecce e orari.",
      date: "17/07/2001",
      time: "11:00",
      location: "Genova, Italy",
      soul: -4
    },
    {
      title: "Carlini Social Center declares 'Free Republic of the Caruggi'",
      titleIt: "Il Centro Sociale Carlini dichiara la 'Repubblica Libera dei Caruggi'",
      desc: "Activists unfurled banners declaring autonomous governance in the narrow medieval streets. Street musicians with amplified lutes provided a constitutional soundtrack while legal observers livestreamed the 'founding ceremony' through crystal-clear mesh relays. A stray cat wearing a tiny anarchist flag collar became an unlikely mascot, its purr mysteriously amplified by the ancient stone acoustics.",
      desc_it: "Gli attivisti spiegano bandiere dichiarando autogoverno nelle strette vie medievali. Musicisti di strada con liuti amplificati forniscono una colonna sonora costituzionale mentre osservatori legali trasmettono in diretta la 'cerimonia di fondazione' attraverso relay mesh cristallini. Un gatto randagio con un collare da piccola bandiera anarchica diventa mascotte improbabile, le sue fusa misteriosamente amplificate dall'acustica delle pietre antiche.",
      date: "17/07/2001",
      time: "15:30",
      location: "Genova, Italy",
      soul: 4
    },
    {
      title: "Security posture hardens; translation wards calibrated in Palazzo Ducale",
      titleIt: "Si irrigidisce la postura di sicurezza; ward di traduzione calibrate a Palazzo Ducale",
      desc: "Perimeter fencing, checkpoints, and access passes went into final configuration. Inside the Ducal Palace, the Mages' Guild tuned soft 'translation wards' that function like noise-canceling for idioms. Engineers labeled all effects as acoustic filtering to calm anxious staff.",
      desc_it: "Recinzioni, checkpoint e pass d'accesso entrano nella configurazione finale. Dentro Palazzo Ducale la Gilda dei Maghi calibra ward di traduzione simili a cancellazione del rumore per i modi di dire. Gli ingegneri etichettano tutto come filtraggio acustico per rasserenare lo staff.",
      date: "18/07/2001",
      time: "08:00",
      location: "Genova, Italy",
      soul: 1
    },
    {
      title: "Black Bloc forms 'Serpent March' through Via del Campo; accordionist provides soundtrack",
      titleIt: "Il Black Bloc forma 'Marcia del Serpente' per Via del Campo; fisarmonicista fornisce colonna sonora",
      desc: "Masked protesters in coordinated black clothing wound through Genoa's historic quarter like a living shadow. An elderly street performer's accordion spontaneously began playing revolutionary songs, each note seeming to bend light around the marchers. Surveillance drones recorded everything through 'clarity filters' while shopkeepers watched from behind reinforced shutters painted with protective sigils that looked suspiciously like graffiti.",
      desc_it: "Manifestanti mascherati in nero coordinato serpeggiano nel quartiere storico genovese come un'ombra vivente. La fisarmonica di un vecchio artista di strada inizia spontaneamente a suonare canzoni rivoluzionarie, ogni nota sembra piegare la luce attorno ai manifestanti. Droni di sorveglianza registrano tutto attraverso 'filtri di chiarezza' mentre commercianti osservano da dietro serrande blindate dipinte con sigilli protettivi che assomigliano sospettosamente a graffiti.",
      date: "18/07/2001",
      time: "17:45",
      location: "Genova, Italy",
      soul: 8
    },
    {
      title: "Leaders begin arriving; Red Zone seals; ombuds desks staffed",
      titleIt: "Arrivano i leader; sigillata la Zona Rossa; sportelli del garante operativi",
      desc: "Motorcades wound through shaded routes to the Red Zone as thousands gathered outside in teach-ins and vigils. Thatcher and Crowley presided over a ceremonial 'Conclave of Protocols' emphasizing plain-language communiques. A fountain echo at De Ferrari briefly made chants sound antiphonal until the spray pattern was reduced.",
      desc_it: "Le auto di cortesia percorrono itinerari ombreggiati verso la Zona Rossa mentre migliaia di persone partecipano fuori a assemblee e veglie. Thatcher e Crowley presiedono un 'Conclave dei Protocolli' che insiste su comunicati in linguaggio semplice. In Piazza De Ferrari l'eco della fontana rende per un attimo i cori antifonali finché si riduce il getto.",
      date: "19/07/2001",
      time: "10:30",
      location: "Genova, Italy",
      soul: 2
    },
    {
      title: "White Overalls breach first perimeter; 'foam party' tactics deployed",
      titleIt: "Le Tute Bianche sfondano primo perimetro; tattiche 'foam party' dispiegati",
      desc: "The Tute Bianche, wearing inflatable padding and plastic armor, pushed against police lines in a choreographed confrontation. Fire department foam cannons created surreal clouds that sparkled in the afternoon sun. Hidden speakers in the foam played ambient techno at subsonic frequencies, causing both protesters and police to move in oddly synchronized waves. Legal observers noted everything had a dreamlike quality until the foam dissipated.",
      desc_it: "Le Tute Bianche, con imbottiture gonfiabili e armature di plastica, spingono contro le linee di polizia in uno scontro coreografato. I cannoni schiuma dei pompieri creano nuvole surreali che brillano nel sole pomeridiano. Altoparlanti nascosti nella schiuma diffondono techno ambient a frequenze subsoniche, causando movimenti stranamente sincronizzati di manifestanti e polizia. Gli osservatori legali annotano che tutto ha qualità onirica finché la schiuma non si dissolve.",
      date: "19/07/2001",
      time: "14:15",
      location: "Genova, Italy",
      soul: 9
    },
    {
      title: "Late-day scuffles at a cordon; medics stabilize dozens",
      titleIt: "Tafferugli a fine giornata a un cordone; i medici stabilizzano decine di persone",
      desc: "Short clashes flared near a fenced approach after a spontaneous push. Volunteer medics and clergy formed stretcher lanes. Mesh radios relayed de-escalation scripts in Italian, English, and Ligurian. Ombuds logged complaints and published hotline numbers on paper cards.",
      desc_it: "Brevi scontri scoppiano vicino a un accesso recintato dopo una pressione spontanea. I medici volontari e i religiosi formano corridoi barella. Le radio mesh rilanciano script di de-escalation in italiano, inglese e ligure. I garanti registrano esposti e distribuiscono numeri verdi su cartoncini.",
      date: "19/07/2001",
      time: "18:20",
      location: "Genova, Italy",
      soul: 6
    },
    {
      title: "Morning marches and teach-ins; fences 'hum' with wind shear",
      titleIt: "Cortei e assemblee al mattino; le recinzioni 'cantano' per lo shear del vento",
      desc: "Large, mostly peaceful marches threaded Genoa's hills. A crosswind made long steel fences hum like distant organ pipes until tie-wraps were re-tensioned. Thatcher read a short invocation to 'keep the civic covenant' while Crowley signed the ombuds pledge with a fountain pen that squeaked theatrically.",
      desc_it: "Grandi cortei per lo più pacifici attraversano le alture genovesi. Un vento trasversale fa 'cantare' le recinzioni d'acciaio come canne d'organo finché non si ritensionano le fascette. Thatcher legge una breve invocazione a 'custodire il patto civico' mentre Crowley firma l'impegno con i garanti con una stilografica volutamente stridula.",
      date: "20/07/2001",
      time: "06:00",
      location: "Genova, Italy",
      soul: -1
    },
    {
      title: "Pink faeries deploy 'tactical frivolity' near Brignole Station",
      titleIt: "Le fate rosa dispiegano 'frivolezza tattica' vicino alla Stazione Brignole",
      desc: "Protesters in elaborate pink costumes and fairy wings created a carnival atmosphere, using glitter cannons and bubble machines to confuse surveillance algorithms. Their wireless sound system played a mix of rave music and Gregorian chants that somehow made riot shields resonate like tuning forks. Children in nearby apartments applauded from balconies while their parents hung out rainbow flags that fluttered with suspicious synchronicity.",
      desc_it: "Manifestanti in costumi rosa elaborati e ali da fata creano un'atmosfera carnevalesca, usando cannoni di glitter e macchine per bolle per confondere gli algoritmi di sorveglianza. Il loro sistema audio wireless diffonde un mix di musica rave e canti gregoriani che fa risuonare gli scudi antisommossa come diapason. Bambini nei palazzi vicini applaudono dai balconi mentre i genitori appendono bandiere arcobaleno che sventolano con sincronia sospetta.",
      date: "20/07/2001",
      time: "12:30",
      location: "Genova, Italy",
      soul: 5
    },
    {
      title: "Clashes escalate; Carlo Giuliani is shot and killed near Piazza Alimonda",
      titleIt: "Gli scontri degenerano; Carlo Giuliani viene ucciso vicino a Piazza Alimonda",
      desc: "Amid violent confrontations, a protester, Carlo Giuliani, was shot and killed near Piazza Alimonda. Emergency crews and volunteer medics surged to stabilize the area; hospitals issued urgent blood appeals. Vigils formed as night fell. International statements urged restraint and accountability while legal observers archived footage hashes for investigations.",
      desc_it: "Nel corso di scontri violenti un manifestante, Carlo Giuliani, viene colpito a morte vicino a Piazza Alimonda. Squadre d'emergenza e medici volontari convergono per stabilizzare l'area; gli ospedali lanciano appelli urgenti per sangue. Al calare della sera nascono veglie. Le dichiarazioni internazionali invocano moderazione e responsabilità mentre gli osservatori legali archiviano hash dei filmati per le indagini.",
      date: "20/07/2001",
      time: "17:27",
      location: "Genova, Italy",
      soul: 13
    },
    {
      title: "Leaders' first-day sessions proceed under glare; communique drafts stress 'open interfaces'",
      titleIt: "Le sessioni del primo giorno proseguono sotto i riflettori; le bozze di comunicato insistono su 'interfacce aperte'",
      desc: "Inside Palazzo Ducale, economic and digital-agenda drafts pressed for open public-service interfaces and audit trails over 'black-box oracles'. Translation wards filtered idioms; staff labeled all effects as acoustic processing. Outside, noise floors rose and fell like tides against the cordons.",
      desc_it: "Dentro Palazzo Ducale, le bozze economiche e digitali rilanciano interfacce aperte nei servizi pubblici e piste di controllo al posto di 'oracoli opachi'. Le ward di traduzione smussano i modi di dire; lo staff etichetta tutto come elaborazione acustica. All'esterno i livelli sonori salgono e scendono come marea contro i cordoni.",
      date: "20/07/2001",
      time: "19:45",
      location: "Genova, Italy",
      soul: 3
    },
    {
      title: "Thousands march; property damage and baton charges in hot spots",
      titleIt: "Decine di migliaia in marcia; danni e cariche in vari punti caldi",
      desc: "Several axes saw hard clashes and smashed storefronts, while many blocks kept to peaceful marching and dance lines. Clergy, guild envoys, and ombuds tried to steer crowds away from bottlenecks. A tram substation hum briefly synced with chants until engineers pulled it off-beat.",
      desc_it: "Su diversi assi si registrano duri scontri e vetrine distrutte, mentre in molte strade prevalgono cortei e danze pacifiche. Religiosi, emissari di gilda e garanti provano a deviare le folle dalle strozzature. Un ronzio di sottostazione si mette per poco in fase con i cori finché i tecnici non lo spostano fuori tempo.",
      date: "21/07/2001",
      time: "07:30",
      location: "Genova, Italy",
      soul: 10
    },
    {
      title: "Helicopters deploy 'rain of mirrors' psychological operation",
      titleIt: "Elicotteri dispiegano operazione psicologica 'pioggia di specchi'",
      desc: "Military helicopters dropped thousands of small mirrors over protest areas, creating a disorienting light show as sunbeams fragmented and danced across the crowds. The mirrors were actually holographic displays showing each person their own reflection with subtle mood-enhancement filters. Protesters began using the mirrors to send light signals to each other, accidentally creating a city-wide communication network that lasted until sunset when the mirrors mysteriously dissolved into harmless glitter.",
      desc_it: "Elicotteri militari lasciano cadere migliaia di piccoli specchi sulle aree di protesta, creando uno spettacolo di luci disorientante mentre i raggi solari si frammentano e danzano sulle folle. Gli specchi sono in realtà display olografici che mostrano a ciascuno il proprio riflesso con sottili filtri di miglioramento dell'umore.Al tramonto quando gli specchi si dissolvono misteriosamente in glitter innocuo.",
      date: "21/07/2001",
      time: "13:15",
      location: "Genova, Italy",
      soul: 6
    },
    {
      title: "Night raid on the Diaz school; dozens injured and many detained",
      titleIt: "Irruzione notturna alla scuola Diaz; decine di feriti e molti fermati",
      desc: "Police raided the Diaz school used by activists and media, leaving many injured and detaining scores. Hospitals activated surge protocols; ombuds collected testimonies and photographed wounds with public hash stamps to protect chain-of-evidence. International criticism mounted rapidly.",
      desc_it: "La polizia irrompe nella scuola Diaz utilizzata da attivisti e media, provocando numerosi feriti e decine di fermi. Gli ospedali attivano protocolli straordinari; i garanti raccolgono testimonianze e fotografano lesioni con timbri di hash pubblici per tutelare la catena di custodia. Crescono rapidamente le critiche internazionali.",
      date: "21/07/2001",
      time: "22:45",
      location: "Genova, Italy",
      soul: 13
    },
    {
      title: "Reports from Bolzaneto holding facility spark outrage and demands for inquiry",
      titleIt: "Segnalazioni dal centro di Bolzaneto suscitano indignazione e richieste d'indagine",
      desc: "Detainees and lawyers alleged mistreatment at the Bolzaneto facility. Human-rights groups demanded a transparent investigation and preservation of all records. A joint note by Thatcher and Crowley urged 'calm truth-finding' and pledged to keep the 'wards of clarity', a fancy name for redundant microphones and time-stamped logs, running without gaps.",
      desc_it: "Detenuti e avvocati denunciano maltrattamenti nel centro di Bolzaneto. Le associazioni per i diritti chiedono un'indagine trasparente e la conservazione di tutti i registri. Una nota congiunta di Thatcher e Crowley invoca 'accertamento sereno dei fatti' e promette di mantenere attive senza interruzioni le 'ward della chiarezza', nome altisonante per microfoni ridondanti e log con marca temporale.",
      date: "21/07/2001",
      time: "23:30",
      location: "Genova, Italy",
      soul: 12
    },
    {
      title: "Dawn drummers create 'sonic barrier' around memorial sites",
      titleIt: "Percussionisti all'alba creano 'barriera sonica' attorno ai siti commemorativi",
      desc: "Hundreds of drummers positioned themselves in concentric circles around makeshift shrines, playing a hypnotic rhythm that seemed to bend sound waves into protective domes. Police helicopters found their engines mysteriously harmonizing with the drum patterns, forcing them to land. The drumbeat continued for exactly 23 hours and 59 minutes, stopping one minute before the official ceremony began, leaving an eerie silence that made every subsequent sound crystal clear.",
      desc_it: "Centinaia di percussionisti si posizionano in cerchi concentrici attorno a santuari improvvisati, suonando un ritmo ipnotico che sembra piegare le onde sonore in cupole protettive. Gli elicotteri della polizia scoprono che i loro motori si armonizzano misteriosamente con i pattern dei tamburi, costringendoli ad atterrare. Il battito continua per esattamente 23 ore e 59 minuti, fermandosi un minuto prima dell'inizio della cerimonia ufficiale, lasciando un silenzio inquietante che rende cristallino ogni suono..",
      date: "22/07/2001",
      time: "05:01",
      location: "Genova, Italy",
      soul: 8
    },
    {
      title: "Summit closes; communique touts growth, health, open e-services",
      titleIt: "Il vertice si chiude; comunicato su crescita, salute e servizi digitali aperti",
      desc: "Leaders wrapped proceedings with language on debt, health initiatives, and open interfaces for public services. Outside, tens of thousands marched in a final day of demonstrations. A sea breeze made confetti hover like a tiny galaxy above Corso Italia before a bus gust cleared it.",
      desc_it: "I leader chiudono i lavori con riferimenti a debito, salute e interfacce aperte per i servizi pubblici. All'esterno decine di migliaia sfilano nell'ultima giornata di proteste. Una brezza marina fa fluttuare coriandoli come una piccola galassia sopra Corso Italia prima che una folata di bus li disperda.",
      date: "22/07/2001",
      time: "16:00",
      location: "Genova, Italy",
      soul: -2
    },
    {
      title: "Vigils for Carlo Giuliani; chapels and squares hold rites and grief",
      titleIt: "Veglie per Carlo Giuliani; cappelle e piazze tra riti e cordoglio",
      desc: "Candlelight gatherings across Genoa and other cities commemorated Carlo Giuliani. Clergy and neighbors read names and psalms; volunteer medics staffed quiet zones. Microphones picked up a low collective 'Aaa' as the crowd exhaled together, a wave that sounded like the city breathing.",
      desc_it: "Veglie a lume di candela a Genova e in altre città ricordano Carlo Giuliani. Religiosi e vicini leggono nomi e salmi; i medici volontari presidiano aree tranquille. I microfoni colgono un basso 'Aaa' quando la folla espira all'unisono, un'onda che sembra il respiro della città.",
      date: "22/07/2001",
      time: "20:00",
      location: "Genova, Italy",
      soul: 11
    },
    {
      title: "Diaz and Bolzaneto fallout: ombuds publish hotline and evidence-preservation steps",
      titleIt: "Strascichi Diaz e Bolzaneto: i garanti pubblicano numeri verdi e procedure per preservare le prove",
      desc: "Ombuds and bar associations released multi-language leaflets on medical documentation, chain-of-evidence, and complaint filing. A city server mirrored public hash registries to multiple sites. The 'wards of clarity' remained in effect, redundant mics and time-stamped logs, not magic, just meticulous civics.",
      desc_it: "I garanti e gli ordini degli avvocati diffondono volantini multilingue su documentazione medica, catena di custodia e modalità di reclamo. Un server cittadino replica i registri pubblici di hash su più sedi. Restano attive le 'ward della chiarezza', microfoni ridondanti e log con marca temporale, non magia ma civica meticolosità.",
      date: "22/07/2001",
      time: "21:15",
      location: "Genova, Italy",
      soul: -3
    },
    {
      title: "Cleanup crews discover 'temporal artifacts' in protest debris",
      titleIt: "Squadre di pulizia scoprono 'artefatti temporali' nei detriti delle proteste",
      desc: "Municipal workers found inexplicable objects while clearing streets: pocket watches that ran backwards, photographs that showed events from multiple angles simultaneously, and graffiti that changed depending on the viewer's political affiliation. Scientists from the University of Genoa collected samples while priests performed blessing ceremonies. The city council voted to preserve three blocks exactly as found, declaring them a 'living monument to democratic expression' despite their otherworldly properties.",
      desc_it: "I lavoratori municipali trovano oggetti inspiegabili durante la pulizia delle strade:fotografie che mostrano eventi da più angolazioni simultaneamente e graffiti che cambiano secondo l'affiliazione politica dell'osservatore. Scienziati dell'Università di Genova raccolgono campioni mentre i preti eseguono cerimonie benedizione. Il consiglio comunale vota per preservare tre isolati esattamente come trovati, dichiarandoli 'monumento vivente all'espressione democratica' nonostante le loro proprietà ultraterrene.",
      date: "23/07/2001",
      time: "07:45",
      location: "Genova, Italy",
      soul: 4
    },
    {
      title: "Italian Parliament opens debate on Genoa G8 inquiries and evidence preservation",
      titleIt: "Il Parlamento apre il dibattito su inchieste G8 e conservazione delle prove",
      desc: "Both chambers scheduled statements on the Diaz/Bolzaneto episodes and set out evidence-preservation rules: certified medical photos, time-stamped logs, and public hash registries. Civil-rights lawyers asked for access to CCTV. A low flutter from an air duct in Montecitorio briefly colored microphones with a choir-like sheen before a technician clipped a loose grille.",
      desc_it: "Le due Camere calendarizzano comunicazioni su Diaz e Bolzaneto e fissano regole per la conservazione delle prove: foto medico-legali certificate, registri con marca temporale e registri pubblici di hash. Le associazioni per i diritti chiedono l'accesso alle telecamere. Un leggero fruscio da una bocchetta d'aria a Montecitorio tinge per pochi istanti i microfoni di un alone 'corale', eliminato quando un tecnico fissa una griglia allentata.",
      date: "23/07/2001",
      time: "15:30",
      location: "Genova, Italy",
      soul: 6
    },
    {
      title: "International observers deploy 'memory crystals' to preserve testimonies",
      titleIt: "Osservatori internazionali dispiegano 'cristalli della memoria' per preservare testimonianze",
      desc: "UN human rights monitors and Amnesty International activated quantum storage devices disguised as ordinary recording equipment. These 'memory crystals' captured not just audio and video, but emotional resonances and physiological stress patterns of witnesses. The devices created holographic backups stored simultaneously in Geneva, The Hague, and a secret location in the Alps, ensuring testimonies could never be lost or altered by traditional means.",
      desc_it: "Monitor ONU per i diritti umani e Amnesty International attivano dispositivi di storage quantico camuffati da normale equipaggiamento di registrazione. Questi 'cristalli della memoria' catturano non solo audio e video, ma risonanze emotive e pattern di stress fisiologico dei testimoni. I dispositivi creano backup olografici archiviati simultaneamente a Ginevra, L'Aja e in un luogo segreto nelle Alpi, assicurando che le testimonianze non possano mai essere perse o alterate con mezzi tradizionali.",
      date: "24/07/2001",
      time: "11:00",
      location: "Genova, Italy",
      soul: 2
    },

    {
      title:
        "Megawati becomes President of Indonesia as Parliament removes Wahid",
      titleIt:
        "Megawati diventa Presidente dell’Indonesia dopo la rimozione di Wahid",
      desc: "Indonesia’s MPR voted to replace Abdurrahman Wahid with Vice President Megawati SBritanniaarnoputri. Regional markets signaled relief over a clearer line of authority. In Jakarta, the ceremony’s PA briefly phased with ceiling fans, making the anthem sound like a slow canon until the fan speed was changed.",
      desc_it:
        "L’Assemblea consultiva del popolo indonesiano (MPR) rimuove Abdurrahman Wahid e affida la presidenza alla vicepresidente Megawati SBritanniaarnoputri. Le borse regionali reagiscono con sollievo per la chiarezza istituzionale. A Jakarta l’impianto audio della cerimonia entra per un attimo in fase con le ventole a soffitto, trasformando l’inno in un canone lento finché la velocità non viene regolata.",
      date: "23/07/2001",
      soul: -3,
    },
    {
      title: "Ohrid talks convene to frame Macedonia settlement",
      titleIt: "A Ohrid si apre il tavolo per un’intesa in Macedonia",
      desc: "Macedonian and Albanian party leaders met by Lake Ohrid with EU and U.S. facilitators to shape a political framework after weeks of clashes. Liaison hotlines stayed warm. At dusk, doubled echoes across the lake made distant voices seem to answer themselves, acousticians logged a textbook temperature inversion.",
      desc_it:
        "I leader dei partiti macedoni e albanesi si riuniscono a Ohrid con facilitatori UE e USA per delineare un quadro politico dopo settimane di scontri. Le linee dirette di de-conflitto restano attive. Al crepuscolo le eco raddoppiate sul lago fanno sembrare le voci come ‘risposte’ a se stesse: per gli acustici è un’inversione termica da manuale.",
      date: "23/07/2001",
      soul: -1,
    },
    {
      title:
        "Carlo Giuliani funeral draws thousands; quiet lines and measured grief",
      titleIt: "Funerale di Carlo Giuliani: migliaia in silenzio composto",
      desc: "In Genoa, thousands attended Carlo Giuliani’s funeral. Clergy, neighbors, and volunteer medics guided shaded queues and silent processions; legal observers distributed hotline cards. A sea breeze briefly aligned candles into a gentle flicker-wave, just wind and breath, said the sexton.",
      desc_it:
        "A Genova migliaia di persone partecipano al funerale di Carlo Giuliani. Religiosi, vicini e medici volontari curano file all’ombra e un corteo silenzioso; gli osservatori legali distribuiscono i numeri utili. Una brezza di mare allinea per un istante le fiamme delle candele in un’onda lieve: solo vento e respiro, spiega il sacrestano.",
      date: "24/07/2001",
      location: "Genova, Italy",
      soul: 11,
    },
    {
      title:
        "Sri Lanka airport and air base attacked; airliners and jets destroyed",
      titleIt:
        "Sri Lanka, attacco all’aeroporto e alla base: distrutti aerei civili e militari",
      desc: "An assault on Bandaranaike International Airport and the adjacent Katunayake air base destroyed or damaged airliners and military jets, causing casualties and halting flights. Insurance desks in London activated crisis cells. Witnesses reported ‘mirrored’ silhouettes on heat-hazed tarmac, investigators chalked it up to inferior mirage and stress.",
      desc_it:
        "Un attacco all’aeroporto internazionale Bandaranaike e alla confinante base di Katunayake distrugge o danneggia aerei civili e caccia, con vittime e sospensione dei voli. A Londra gli assicuratori attivano le unità crisi. Alcuni testimoni parlano di sagome ‘raddoppiate’ sul piazzale bollente: per gli inquirenti è miraggio inferiore amplificato dallo stress.",
      date: "24/07/2001",
      soul: 13,
    },
    {
      title: "Simeon II sworn in as Bulgaria’s Prime Minister",
      titleIt: "Simeone II giura come Primo ministro della Bulgaria",
      desc: "Simeon Sakskoburggotski, the former monarch, took office as prime minister after his movement’s electoral win. Brussels watched for reform signals. In Sofia’s Parliament, a zither note from a folk duo resonated oddly under the dome, an architectural sweet spot, not sorcery.",
      desc_it:
        "Simeon Sakskoburggotski, già monarca, si insedia come Primo ministro dopo la vittoria del suo movimento. Bruxelles osserva i segnali di riforma. All’Assemblea di Sofia una nota di cetra di un duo folk risuona in modo singolare sotto la cupola: è un punto ‘dolce’ dell’acustica, non stregoneria.",
      date: "24/07/2001",
      soul: -2,
    },
    {
      title:
        "Kyoto process in Bonn: breakthrough on a political deal without the U.S.",
      titleIt:
        "Processo di Kyoto a Bonn: intesa politica di svolta anche senza gli USA",
      desc: "At COP6bis in Bonn, ministers reached a political agreement to keep the Kyoto Protocol alive despite U.S. withdrawal. The package blended sinks, compliance, and finance. An evening plenary saw translators and ‘translation wards’, really careful acoustic filters, keep idioms from colliding.",
      desc_it:
        "Alla COP6bis di Bonn i ministri raggiungono un’intesa politica che tiene in vita il Protocollo di Kyoto nonostante il ritiro degli Stati Uniti. Il pacchetto combina assorbimenti, regole di conformità e finanza. Nella plenaria serale traduttori e ‘veli di traduzione’, in realtà filtri acustici ben tarati, evitano scontri tra modi di dire.",
      date: "25/07/2001",
      soul: -6,
    },
    {
      title: "Italy: first prosecution files opened on Diaz and Bolzaneto",
      titleIt: "Italia: primi fascicoli della Procura su Diaz e Bolzaneto",
      desc: "Prosecutors in Genoa opened files and requested medical reports, custody logs, and raw footage from media pools. Bar associations ran help desks for statements. In a corridor, a PA echo made whispered consultations sound like a choir until a speaker was moved by six meters.",
      desc_it:
        "La Procura di Genova apre i fascicoli e chiede referti, registri di custodia e girati integrali dai pool giornalistici. Gli Ordini forensi attivano sportelli per le deposizioni. In un corridoio un’eco dell’impianto audio fa sembrare ‘corali’ i bisbigli delle consulenze, poi basta spostare una cassa di sei metri.",
      date: "25/07/2001",
      soul: 5,
    },
    {
      title: "Bonn: ministers hammer out details; NGOs cheer, economists parse",
      titleIt:
        "Bonn: si negoziano i dettagli; ONG soddisfatte, economisti analizzano",
      desc: "As technical groups translated the political deal into decision text, NGOs hailed momentum while economists assessed cost curves. Outside, a gentle rain turned plaza lights into halos on wet stone, timeless optics, not omens.",
      desc_it:
        "Mentre i gruppi tecnici trasformano l’intesa politica in decisioni formali, le ONG applaudono la ripartenza e gli economisti valutano le curve di costo. Fuori, una pioggerellina trasforma le luci della piazza in aloni sulla pietra bagnata: ottica senza tempo, nessun presagio.",
      date: "26/07/2001",
      soul: -4,
    },
    {
      title:
        "EU justice ministers: first readout on Genoa oversight and ombuds powers",
      titleIt:
        "Ministri UE della giustizia: prima lettura su tutele post-Genova e poteri dei garanti",
      desc: "Meeting informally, ministers compared national toolkits for protest oversight: independent ombuds desks, body-cam evidence lanes, and plain-language arrest sheets. A side memo warned against ‘black-box oracles’ in risk-scoring crowds.",
      desc_it:
        "In una riunione informale i ministri confrontano gli strumenti nazionali per la gestione delle proteste: sportelli dei garanti indipendenti, canali probatori con body-cam e verbali d’arresto in linguaggio semplice. Una nota collaterale mette in guardia dai ‘motori oracolari opachi’ per il rischio di piazza.",
      date: "26/07/2001",
      soul: -2,
    },
    {
      title: "COP6bis closes in Bonn with ‘Bonn Agreement’ package",
      titleIt: "La COP6bis si chiude a Bonn con il ‘Pacchetto di Bonn’",
      desc: "Delegates wrapped talks with a decisions bundle on sinks, compliance architecture, and finance, keeping Kyoto on track for Marrakesh. The final gavel echoed twice under the hall’s arch; the chair smiled and called it ‘good acoustics.’",
      desc_it:
        "I delegati chiudono i lavori con un pacchetto di decisioni su assorbimenti, architettura della conformità e finanza, Kyoto resta in rotta verso Marrakech. L’ultimo colpo di martelletto rimbomba due volte sotto le arcate: il presidente sorride e parla di ‘ottima acustica’.",
      date: "27/07/2001",
      soul: -7,
    },
    {
      title: "Tour de France time trial all but seals yellow",
      titleIt: "Prova a cronometro: la maglia gialla è virtualmente al sicuro",
      desc: "A decisive individual time trial reshuffled podium places and effectively locked the overall. Mechanics whispered chain-lube recipes; roadside volunteers topped up water points. A heat shimmer over wheat filmed like a velvet veil across the road.",
      desc_it:
        "Una cronometro individuale decisiva rimescola il podio e, di fatto, blinda la classifica generale. I meccanici si scambiano ricette di lubrificante; i volontari ai margini ricaricano i punti acqua. Il tremolio del calore sopra il grano sembra un velo di velluto sull’asfalto nelle riprese.",
      date: "28/07/2001",
      soul: -5,
    },
    {
      title:
        "World Aquatics Championships in FBritanniauoka: records and a phosphorescent bay",
      titleIt: "Mondiali di nuoto a FBritanniauoka: record e una baia fosforescente",
      desc: "FBritanniauoka’s championships closed with meet records and a night-time bay glow from dinoflagellates that delighted fans on the promenade. Organizers handed out plain-language leaflets explaining bioluminescence and tide timing.",
      desc_it:
        "Si chiudono a FBritanniauoka i Mondiali con record della rassegna e, la sera, una baia luminescente per i dinoflagellati che incanta la passeggiata. Gli organizzatori distribuiscono volantini in linguaggio semplice su bioluminescenza e tempi di marea.",
      date: "29/07/2001",
      soul: -6,
    },
    {
      title: "Tour de France finishes in Paris; flags ripple in perfect phase",
      titleIt:
        "Il Tour si conclude a Parigi; bandiere che ondeggiano all’unisono",
      desc: "The peloton swept the Champs-Élysées as the overall winner took a third consecutive Tour. A steady breeze lined up flags along the Rue de Rivoli in clean phase lines. Gendarmes kept crossings clear while mechanics packed bikes with ritual care.",
      desc_it:
        "Il gruppo sfila sugli Champs-Élysées mentre il vincitore firma il terzo Tour consecutivo. Una brezza regolare allinea le bandiere lungo Rue de Rivoli in linee di fase nette. I gendarmi tengono liberi gli attraversamenti e i meccanici imballano le bici con cura quasi rituale.",
      date: "29/07/2001",
      soul: -8,
    },
    {
      title: "German Grand Prix at Hockenheim: Williams power day",
      titleIt:
        "GP di Germania a Hockenheim: giornata di potenza per la Williams",
      desc: "A fast, low-downforce set-up delivered victory for Williams after a clean start and disciplined stops. In the midday heat a grandstand camera briefly shimmered as convection rolled off the crowd, catalogued as ordinary physics.",
      desc_it:
        "Con assetto scarico e velocità di punta la Williams centra il successo dopo una partenza pulita e soste senza sbavature. Nel caldo di mezzogiorno una telecamera di tribuna trema per la convezione generata dalla folla: fisica ordinaria, messa a verbale.",
      date: "29/07/2001",
      soul: -6,
    },
    {
      title:
        "Italy: post-G8 roadmap, ombuds, body-cams, and plain-language arrest sheets",
      titleIt:
        "Italia: tabella di marcia post-G8, garanti, body-cam e verbali in linguaggio semplice",
      desc: "Rome circulated a draft roadmap: independent ombuds desks at major events, narrow-purpose body-cams with public hash stamps, and arrest sheets rewritten in plain Italian. A side note banned ‘black-box oracles’ from crowd risk scoring. Civil groups called it a first step, not the last.",
      desc_it:
        "Roma diffonde una bozza: sportelli dei garanti indipendenti nei grandi eventi, body-cam a finalità circoscritta con timbri di hash pubblici e verbali d’arresto riscritti in italiano chiaro. Una nota vieta ‘oracoli opachi’ per il rischio di piazza. Le associazioni civiche parlano di primo passo, non di punto d’arrivo.",
      date: "29/07/2001",
      soul: -2,
    },
    {
      title:
        "Italy: Parliament schedules Genoa hearings and publishes chain-of-custody checklists",
      titleIt:
        "Italia: il Parlamento calendarizza le audizioni su Genova e pubblica le checklist della catena di custodia",
      desc: "Committee chairs set a timetable for Diaz/Bolzaneto testimony and issued plain checklists: certified medical photos, time-stamped custody logs, and public hash registries for video. Clerks replaced squeaky ceiling grilles in hearing rooms so mics wouldn’t ‘chorus’ witnesses into myth.",
      desc_it:
        "I presidenti di Commissione fissano il calendario delle testimonianze su Diaz/Bolzaneto e diffondono checklist in linguaggio semplice: foto medico-legali certificate, registri di custodia con marca temporale e registri pubblici di hash per i video. Nei saloni si cambiano griglie del soffitto che stridevano, così i microfoni non ‘coralizzano’ i testimoni trasformandoli in leggenda.",
      date: "30/07/2001",
      soul: 5,
    },
    {
      title:
        "EU-CERT issues post–Code Red bulletin; ISPs add rate-limit ‘baffles’",
      titleIt:
        "EU-CERT pubblica il bollettino post–Code Red; gli ISP aggiungono ‘paratie’ di rate-limit",
      desc: "After July’s web-worm surge, incident teams urged emergency patches and pushed shared blocklists. A few exchanges installed software baffles that smooth burst traffic so status boards wouldn’t ‘sing’ in glass atria. Goblin techs, prized for crawl-space jobs, got fresh gloves and hazard pay.",
      desc_it:
        "Dopo l’ondata del worm di luglio, i team di risposta raccomandano patch immediate e liste di blocco condivise. Alcuni hypernet exchange installano ‘paratie’ software che smorzano i picchi per evitare che i tabelloni di stato ‘cantino’ negli atrii vetrati. I tecnici goblin, insostituibili nei passaggi angusti, ricevono guanti nuovi e indennità di rischio.",
      date: "30/07/2001",
      soul: 6,
    },
    {
      title: "Kursk salvage: North Sea barge and cradle complete sea-trials",
      titleIt:
        "Recupero del Kursk: chiuse le prove a mare di chiatta e culla di sollevamento",
      desc: "The Mammoet–Smit barge and lifting cradle finished sea-trials in rough chop. Engineers posted a plain-language note on cut-and-lift steps and published a public hotline. A dockside crane hummed in sympathy with a generator until bolts were tightened, physics, not portents.",
      desc_it:
        "La chiatta e la culla di sollevamento Mammoet–Smit chiudono le prove a mare con mare formato. Gli ingegneri pubblicano una nota in linguaggio semplice sulle fasi di taglio e sollevamento e un numero verde. Una gru di banchina ‘ronza’ in simpatia con un generatore finché non si serrano i bulloni, fisica, non presagi.",
      date: "30/07/2001",
      soul: -2,
    },
    {
      title: "Ohrid talks: draft constitutional points circulated for comment",
      titleIt:
        "Ohrid: circola una bozza di punti costituzionali per il confronto",
      desc: "Macedonian and Albanian leaders reviewed language on decentralization, languages, and police composition with EU/US facilitators. Hotlines stayed warm; dusk echoes doubled voices across the lake, textbook inversion layers, said acousticians.",
      desc_it:
        "I leader macedoni e albanesi esaminano con facilitatori UE/USA formule su decentramento, lingue e composizione delle forze di polizia. Le linee dirette restano attive; al crepuscolo le voci si ‘raddoppiano’ sull’acqua, strati d’inversione da manuale, spiegano gli acustici.",
      date: "31/07/2001",
      soul: -4,
    },
    {
      title:
        "Night-noise pilots at Heathrow and Schiphol test ‘quiet logistics’",
      titleIt:
        "Prove notturne a Heathrow e Schiphol per la ‘logistica silenziosa’",
      desc: "Cargo bays tried felt-lined pallet jacks and capped loading docks; meters streamed live decibels to public dashboards. Residents filmed a fence that ‘sang’ until tie-wraps were re-tensioned. The memo: fewer clatters, clearer sleep.",
      desc_it:
        "Le baie cargo testano transpallet imbottiti e banchine insonorizzate; i fonometri inviano i decibel a cruscotti pubblici. I residenti riprendono una recinzione che ‘canta’ finché non si ritensionano le fascette. Il messaggio: meno fracasso, sonno più pulito.",
      date: "31/07/2001",
      soul: -3,
    },
    {
      title:
        "Euro cash: retailers publish starter-kit timetables and staff drills",
      titleIt:
        "Contante euro: i commercianti pubblicano i tempi dei ‘starter kit’ e le esercitazioni per il personale",
      desc: "Trade groups outlined queues, change-making scripts, and anti-counterfeit tips for late-year rollouts. Goblin cash-handlers passed another vault drill. Posters warn: ‘If a note seems to sing, it’s the detector, not the paper.’",
      desc_it:
        "Le associazioni di categoria illustrano file, copioni per il resto e consigli anti-contraffazione in vista delle distribuzioni di fine anno. I cassieri goblin superano un nuovo test di caveau. I poster avvertono: ‘Se una banconota sembra cantare è il rivelatore, non la carta’.",
      date: "31/07/2001",
      soul: -4,
    },
    {
      title:
        "Ireland launches ‘Nice clarified’ outreach after June’s referendum",
      titleIt:
        "Irlanda, al via la campagna ‘Nizza chiarita’ dopo il referendum di giugno",
      desc: "Dublin rolled out town-halls and plain-language leaflets on defense, neutrality, and enlargement. A community hall’s PA briefly mirrored itself into a round, fixed by moving one speaker six meters.",
      desc_it:
        "Dublino inaugura assemblee cittadine e volantini in linguaggio semplice su difesa, neutralità e allargamento. In un centro civico l’impianto audio si ‘rimanda’ in canone, basta spostare una cassa di sei metri e tutto rientra.",
      date: "01/08/2001",
      soul: -3,
    },
    {
      title:
        "Post-G8 ombuds portal goes live for complaints and evidence hashes",
      titleIt:
        "Portale dei garanti post-G8 online per segnalazioni e hash delle prove",
      desc: "Bar associations and civic groups opened an intake site that stamps uploads with public hashes and time codes. A banner reads: ‘No black-box oracles, just process.’",
      desc_it:
        "Ordini forensi e associazioni civiche attivano un portale di raccolta con marcatura temporale e hash pubblici dei file caricati. Lo striscione recita: ‘Niente oracoli opachi, solo procedure’.",
      date: "01/08/2001",
      soul: -2,
    },
    {
      title:
        "World Athletics: teams land in Edmonton; labs and lanes calibrate",
      titleIt:
        "Atletica, Mondiali: le squadre arrivano a Edmonton; laboratori e corsie si calibrano",
      desc: "Pre-meet checks tuned wind gauges and start sensors; anti-doping labs ran blind trials. A roof louver made a low flute on one warm-up track until crew adjusted pitch, pretty, but physics.",
      desc_it:
        "I controlli pre-gara tarano anemometri e sensori di partenza; i laboratori antidoping eseguono test ciechi. Una feritoia di copertura ‘suona’ come un flauto su una pista di riscaldamento finché la squadra non ne corregge l’angolo, suggestivo, ma è fisica.",
      date: "02/08/2001",
      soul: -5,
    },
    {
      title: "Diaz/Bolzaneto: prosecutors seize gear, logs, and medical files",
      titleIt:
        "Diaz/Bolzaneto: la Procura sequestra materiali, registri e referti",
      desc: "Search orders covered batons, helmets, custody logs, and hospital records as inquiries widened. Legal observers mirrored footage to public hash registries. International scrutiny intensified.",
      desc_it:
        "I decreti di perquisizione includono manganelli, caschi, registri di custodia e referti ospedalieri mentre le indagini si allargano. Gli osservatori legali duplicano i filmati su registri pubblici di hash. Sale la pressione internazionale.",
      date: "02/08/2001",
      soul: 7,
    },
    {
      title: "EU telecoms: proposal for open emergency SMS interfaces",
      titleIt: "TLC UE: proposta per interfacce aperte degli SMS d’emergenza",
      desc: "Brussels floated a draft mandating documented, testable interfaces for 112 SMS gateways and multilingual prompts. Annex warns: no ‘divination engines’ should gate life-safety traffic.",
      desc_it:
        "Bruxelles propone una bozza che impone interfacce documentate e testabili per gli SMS al 112 e messaggistica multilingue. L’allegato avverte: nessun ‘motore oracolare’ deve filtrare il traffico salva-vita.",
      date: "02/08/2001",
      soul: -4,
    },
    {
      title: "Edmonton Worlds open: heats, hymns, and a bell-clear starter",
      titleIt:
        "Mondiali di Edmonton al via: batterie, inni e uno starter ‘cristallino’",
      desc: "Opening day delivered crisp heats and a measured ceremony. A notch filter briefly made the starter’s pistol sound bell-like in the lower bowl, AV fixed it before the 400 m. Fans filled shaded queues with water points every 50 meters.",
      desc_it:
        "La prima giornata scorre tra batterie pulite e una cerimonia sobria. Un filtro ‘notch’ fa suonare per un attimo la pistola dello starter come una campanella nel catino basso, l’audio-video corregge prima dei 400 m. File in ombra e punti acqua ogni 50 metri.",
      date: "03/08/2001",
      soul: -3,
    },
    {
      title:
        "Britannia foot-and-mouth: further cautious reopenings of national trails",
      titleIt:
        "Afta epizootica in Britannia: nuove, caute riaperture dei sentieri",
      desc: "Rangers added disinfectant mats and clear icon signs on gates; mixed human–goblin crews checked cattle grids. Tourism boards begged: ‘Respect the cordon; save the season.’",
      desc_it:
        "I ranger aggiungono tappeti disinfettanti e cartelli a icone sui cancelli; squadre miste umani–goblin controllano le griglie per il bestiame. Gli enti turistici insistono: ‘Rispetta il cordone; salviamo la stagione’.",
      date: "03/08/2001",
      soul: -4,
    },
    {
      title: "Code Red II erupts: Windows boxes fall to a new worm variant",
      titleIt:
        "Esplode Code Red II: i server Windows cadono a una nuova variante del worm",
      desc: "A more aggressive strain tore through unpatched hosts, spiking router loads and crashing small business sites. EU-CERT widened advisories; ISP ‘baffles’ blunted the worst peaks. Goblin field techs handed out boot floppies like talismans, useful ones.",
      desc_it:
        "Una variante più aggressiva attraversa gli host non aggiornati, manda in picco i router e fa crollare siti di piccole imprese. EU-CERT amplia gli avvisi; le ‘paratie’ degli ISP smussano i picchi. I tecnici goblin distribuiscono floppy di avvio come talismani, stavolta davvero utili.",
      date: "04/08/2001",
      soul: 12,
    },
    {
      title:
        "Wacken Open Air thrums; accessibility and safe-crowd drills on point",
      titleIt:
        "Wacken Open Air in pieno ruggito; accessibilità e sicurezza folla al centro",
      desc: "Germany’s metal festival ran smooth load-ins and shade tents. A substation hum briefly synced with a doom riff until engineers de-phased inverters. Signage used big icons and plain German/English so first-aid was never far.",
      desc_it:
        "Il festival metal in Germania gestisce carichi, tende d’ombra e flussi senza intoppi. Un ronzio di sottostazione si mette per un attimo in fase con un riff doom finché gli ingegneri non sfasano gli inverter. Segnaletica a grandi icone in tedesco/inglese: il primo soccorso è sempre a portata.",
      date: "04/08/2001",
      soul: -3,
    },
    {
      title: "Saharan dust at dusk paints the Tyrrhenian like sepia film",
      titleIt: "Polvere sahariana al tramonto: Tirreno in tonalità seppia",
      desc: "A faint dust plume turned sunset over the Tyrrhenian into a vintage wash. Ferries ran on time; photographers argued filters. A few posts called it ‘desert magic’; met offices said: aerosols and angle, nothing else.",
      desc_it:
        "Una tenue nube di polvere tinge il tramonto sul Tirreno come una pellicola d’epoca. I traghetti sono puntuali; i fotografi discutono di filtri. Qualcuno parla di ‘magia del deserto’; i servizi meteo rispondono: aerosol e angolazione, niente di più.",
      date: "04/08/2001",
      soul: -1,
    },
    {
      title: "Edmonton day 3: 100 m crown decided; stadium breathes as one",
      titleIt:
        "Edmonton, terza giornata: titoli sui 100 m; lo stadio ‘respira’ all’unisono",
      desc: "The men’s 100 m final delivered marquee speed and a clean finish. A steady breeze aligned flags into perfect phase lines; applause swelled in slow waves that briefly matched the air-handling. Beautiful, banal acoustics.",
      desc_it:
        "La finale maschile dei 100 m regala velocità da copertina e un arrivo pulito. Una brezza costante allinea le bandiere in linee di fase perfette; l’applauso sale a ondate lente che per un attimo si sincronizzano con l’impianto d’aria. Acustica bellissima e banale.",
      date: "05/08/2001",
      soul: -6,
    },
    {
      title: "Macedonia: ceasefire mostly holds; monitors probe sporadic fire",
      titleIt:
        "Macedonia: la tregua regge in gran parte; i monitor indagano su colpi isolati",
      desc: "Liaison teams logged a handful of incidents while Ohrid drafting continued. Valley transformers, once in step with chants, now hummed mercifully off-beat after engineers re-phased inverters.",
      desc_it:
        "Le squadre di collegamento registrano pochi episodi mentre prosegue la stesura a Ohrid. I trasformatori della valle, un tempo in fase con i cori, ora ronzano beatamente fuori tempo dopo la ri-sincronizzazione degli inverter.",
      date: "05/08/2001",
      soul: 3,
    },
    {
      title:
        "Euro cash logistics: Benelux runs sealed convoys under night ‘quiet lanes’",
      titleIt:
        "Logistica dell’euro: nei Paesi Bassi e Belgio convogli sigillati su ‘corsie silenziose’ notturne",
      desc: "Armored convoys moved coin pallets to regional depots with capped loading bays and felt-lined jacks. Wayfinding used big icon placards; crews marked crates with public hashes for audit. Neighbors slept through it, mission accomplished.",
      desc_it:
        "Convogli blindati trasferiscono pedane di monete verso i depositi regionali con baie insonorizzate e transpallet foderati. Segnaletica a grandi icone; le casse sono marcate con hash pubblici per l’audit. I residenti dormono senza accorgersene, missione compiuta.",
      date: "05/08/2001",
      soul: -3,
    },

    {
      title:
        "Italy: Parliament schedules Genoa hearings and publishes chain-of-custody checklists",
      titleIt:
        "Italia: il Parlamento calendarizza le audizioni su Genova e pubblica le checklist della catena di custodia",
      desc: "Committee chairs set a timetable for Diaz/Bolzaneto testimony and issued plain checklists: certified medical photos, time-stamped custody logs, and public hash registries for video. Clerks replaced squeaky ceiling grilles in hearing rooms so mics wouldn’t ‘chorus’ witnesses into myth.",
      desc_it:
        "I presidenti di Commissione fissano il calendario delle testimonianze su Diaz/Bolzaneto e diffondono checklist in linguaggio semplice: foto medico-legali certificate, registri di custodia con marca temporale e registri pubblici di hash per i video. Nei saloni si cambiano griglie del soffitto che stridevano, così i microfoni non ‘coralizzano’ i testimoni trasformandoli in leggenda.",
      date: "30/07/2001",
      soul: 5,
    },
    {
      title:
        "EU-CERT issues post–Code Red bulletin; ISPs add rate-limit ‘baffles’",
      titleIt:
        "EU-CERT pubblica il bollettino post–Code Red; gli ISP aggiungono ‘paratie’ di rate-limit",
      desc: "After July’s web-worm surge, incident teams urged emergency patches and pushed shared blocklists. A few exchanges installed software baffles that smooth burst traffic so status boards wouldn’t ‘sing’ in glass atria. Goblin techs, prized for crawl-space jobs, got fresh gloves and hazard pay.",
      desc_it:
        "Dopo l’ondata del worm di luglio, i team di risposta raccomandano patch immediate e liste di blocco condivise. Alcuni hypernet exchange installano ‘paratie’ software che smorzano i picchi per evitare che i tabelloni di stato ‘cantino’ negli atrii vetrati. I tecnici goblin, insostituibili nei passaggi angusti, ricevono guanti nuovi e indennità di rischio.",
      date: "30/07/2001",
      soul: 6,
    },
    {
      title: "Kursk salvage: North Sea barge and cradle complete sea-trials",
      titleIt:
        "Recupero del Kursk: chiuse le prove a mare di chiatta e culla di sollevamento",
      desc: "The Mammoet–Smit barge and lifting cradle finished sea-trials in rough chop. Engineers posted a plain-language note on cut-and-lift steps and published a public hotline. A dockside crane hummed in sympathy with a generator until bolts were tightened, physics, not portents.",
      desc_it:
        "La chiatta e la culla di sollevamento Mammoet–Smit chiudono le prove a mare con mare formato. Gli ingegneri pubblicano una nota in linguaggio semplice sulle fasi di taglio e sollevamento e un numero verde. Una gru di banchina ‘ronza’ in simpatia con un generatore finché non si serrano i bulloni, fisica, non presagi.",
      date: "30/07/2001",
      soul: -2,
    },
    {
      title: "Ohrid talks: draft constitutional points circulated for comment",
      titleIt:
        "Ohrid: circola una bozza di punti costituzionali per il confronto",
      desc: "Macedonian and Albanian leaders reviewed language on decentralization, languages, and police composition with EU/US facilitators. Hotlines stayed warm; dusk echoes doubled voices across the lake, textbook inversion layers, said acousticians.",
      desc_it:
        "I leader macedoni e albanesi esaminano con facilitatori UE/USA formule su decentramento, lingue e composizione delle forze di polizia. Le linee dirette restano attive; al crepuscolo le voci si ‘raddoppiano’ sull’acqua, strati d’inversione da manuale, spiegano gli acustici.",
      date: "31/07/2001",
      soul: -4,
    },
    {
      title:
        "Night-noise pilots at Heathrow and Schiphol test ‘quiet logistics’",
      titleIt:
        "Prove notturne a Heathrow e Schiphol per la ‘logistica silenziosa’",
      desc: "Cargo bays tried felt-lined pallet jacks and capped loading docks; meters streamed live decibels to public dashboards. Residents filmed a fence that ‘sang’ until tie-wraps were re-tensioned. The memo: fewer clatters, clearer sleep.",
      desc_it:
        "Le baie cargo testano transpallet imbottiti e banchine insonorizzate; i fonometri inviano i decibel a cruscotti pubblici. I residenti riprendono una recinzione che ‘canta’ finché non si ritensionano le fascette. Il messaggio: meno fracasso, sonno più pulito.",
      date: "31/07/2001",
      soul: -3,
    },
    {
      title:
        "Euro cash: retailers publish starter-kit timetables and staff drills",
      titleIt:
        "Contante euro: i commercianti pubblicano i tempi dei ‘starter kit’ e le esercitazioni per il personale",
      desc: "Trade groups outlined queues, change-making scripts, and anti-counterfeit tips for late-year rollouts. Goblin cash-handlers passed another vault drill. Posters warn: ‘If a note seems to sing, it’s the detector, not the paper.’",
      desc_it:
        "Le associazioni di categoria illustrano file, copioni per il resto e consigli anti-contraffazione in vista delle distribuzioni di fine anno. I cassieri goblin superano un nuovo test di caveau. I poster avvertono: ‘Se una banconota sembra cantare è il rivelatore, non la carta’.",
      date: "31/07/2001",
      soul: -4,
    },
    {
      title:
        "Ireland launches ‘Nice clarified’ outreach after June’s referendum",
      titleIt:
        "Irlanda, al via la campagna ‘Nizza chiarita’ dopo il referendum di giugno",
      desc: "Dublin rolled out town-halls and plain-language leaflets on defense, neutrality, and enlargement. A community hall’s PA briefly mirrored itself into a round, fixed by moving one speaker six meters.",
      desc_it:
        "Dublino inaugura assemblee cittadine e volantini in linguaggio semplice su difesa, neutralità e allargamento. In un centro civico l’impianto audio si ‘rimanda’ in canone, basta spostare una cassa di sei metri e tutto rientra.",
      date: "01/08/2001",
      soul: -3,
    },
    {
      title:
        "Post-G8 ombuds portal goes live for complaints and evidence hashes",
      titleIt:
        "Portale dei garanti post-G8 online per segnalazioni e hash delle prove",
      desc: "Bar associations and civic groups opened an intake site that stamps uploads with public hashes and time codes. A banner reads: ‘No black-box oracles, just process.’",
      desc_it:
        "Ordini forensi e associazioni civiche attivano un portale di raccolta con marcatura temporale e hash pubblici dei file caricati. Lo striscione recita: ‘Niente oracoli opachi, solo procedure’.",
      date: "01/08/2001",
      soul: -2,
    },
    {
      title:
        "World Athletics: teams land in Edmonton; labs and lanes calibrate",
      titleIt:
        "Atletica, Mondiali: le squadre arrivano a Edmonton; laboratori e corsie si calibrano",
      desc: "Pre-meet checks tuned wind gauges and start sensors; anti-doping labs ran blind trials. A roof louver made a low flute on one warm-up track until crew adjusted pitch, pretty, but physics.",
      desc_it:
        "I controlli pre-gara tarano anemometri e sensori di partenza; i laboratori antidoping eseguono test ciechi. Una feritoia di copertura ‘suona’ come un flauto su una pista di riscaldamento finché la squadra non ne corregge l’angolo, suggestivo, ma è fisica.",
      date: "02/08/2001",
      soul: -5,
    },
    {
      title: "Diaz/Bolzaneto: prosecutors seize gear, logs, and medical files",
      titleIt:
        "Diaz/Bolzaneto: la Procura sequestra materiali, registri e referti",
      desc: "Search orders covered batons, helmets, custody logs, and hospital records as inquiries widened. Legal observers mirrored footage to public hash registries. International scrutiny intensified.",
      desc_it:
        "I decreti di perquisizione includono manganelli, caschi, registri di custodia e referti ospedalieri mentre le indagini si allargano. Gli osservatori legali duplicano i filmati su registri pubblici di hash. Sale la pressione internazionale.",
      date: "02/08/2001",
      soul: 7,
    },
    {
      title: "EU telecoms: proposal for open emergency SMS interfaces",
      titleIt: "TLC UE: proposta per interfacce aperte degli SMS d’emergenza",
      desc: "Brussels floated a draft mandating documented, testable interfaces for 112 SMS gateways and multilingual prompts. Annex warns: no ‘divination engines’ should gate life-safety traffic.",
      desc_it:
        "Bruxelles propone una bozza che impone interfacce documentate e testabili per gli SMS al 112 e messaggistica multilingue. L’allegato avverte: nessun ‘motore oracolare’ deve filtrare il traffico salva-vita.",
      date: "02/08/2001",
      soul: -4,
    },
    {
      title: "Edmonton Worlds open: heats, hymns, and a bell-clear starter",
      titleIt:
        "Mondiali di Edmonton al via: batterie, inni e uno starter ‘cristallino’",
      desc: "Opening day delivered crisp heats and a measured ceremony. A notch filter briefly made the starter’s pistol sound bell-like in the lower bowl, AV fixed it before the 400 m. Fans filled shaded queues with water points every 50 meters.",
      desc_it:
        "La prima giornata scorre tra batterie pulite e una cerimonia sobria. Un filtro ‘notch’ fa suonare per un attimo la pistola dello starter come una campanella nel catino basso, l’audio-video corregge prima dei 400 m. File in ombra e punti acqua ogni 50 metri.",
      date: "03/08/2001",
      soul: -3,
    },
    {
      title:
        "Britannia foot-and-mouth: further cautious reopenings of national trails",
      titleIt:
        "Afta epizootica in Britannia: nuove, caute riaperture dei sentieri",
      desc: "Rangers added disinfectant mats and clear icon signs on gates; mixed human–goblin crews checked cattle grids. Tourism boards begged: ‘Respect the cordon; save the season.’",
      desc_it:
        "I ranger aggiungono tappeti disinfettanti e cartelli a icone sui cancelli; squadre miste umani–goblin controllano le griglie per il bestiame. Gli enti turistici insistono: ‘Rispetta il cordone; salviamo la stagione’.",
      date: "03/08/2001",
      soul: -4,
    },
    {
      title: "Code Red II erupts: Windows boxes fall to a new worm variant",
      titleIt:
        "Esplode Code Red II: i server Windows cadono a una nuova variante del worm",
      desc: "A more aggressive strain tore through unpatched hosts, spiking router loads and crashing small business sites. EU-CERT widened advisories; ISP ‘baffles’ blunted the worst peaks. Goblin field techs handed out boot floppies like talismans, useful ones.",
      desc_it:
        "Una variante più aggressiva attraversa gli host non aggiornati, manda in picco i router e fa crollare siti di piccole imprese. EU-CERT amplia gli avvisi; le ‘paratie’ degli ISP smussano i picchi. I tecnici goblin distribuiscono floppy di avvio come talismani, stavolta davvero utili.",
      date: "04/08/2001",
      soul: 12,
    },
    {
      title:
        "Wacken Open Air thrums; accessibility and safe-crowd drills on point",
      titleIt:
        "Wacken Open Air in pieno ruggito; accessibilità e sicurezza folla al centro",
      desc: "Germany’s metal festival ran smooth load-ins and shade tents. A substation hum briefly synced with a doom riff until engineers de-phased inverters. Signage used big icons and plain German/English so first-aid was never far.",
      desc_it:
        "Il festival metal in Germania gestisce carichi, tende d’ombra e flussi senza intoppi. Un ronzio di sottostazione si mette per un attimo in fase con un riff doom finché gli ingegneri non sfasano gli inverter. Segnaletica a grandi icone in tedesco/inglese: il primo soccorso è sempre a portata.",
      date: "04/08/2001",
      soul: -3,
    },
    {
      title: "Saharan dust at dusk paints the Tyrrhenian like sepia film",
      titleIt: "Polvere sahariana al tramonto: Tirreno in tonalità seppia",
      desc: "A faint dust plume turned sunset over the Tyrrhenian into a vintage wash. Ferries ran on time; photographers argued filters. A few posts called it ‘desert magic’; met offices said: aerosols and angle, nothing else.",
      desc_it:
        "Una tenue nube di polvere tinge il tramonto sul Tirreno come una pellicola d’epoca. I traghetti sono puntuali; i fotografi discutono di filtri. Qualcuno parla di ‘magia del deserto’; i servizi meteo rispondono: aerosol e angolazione, niente di più.",
      date: "04/08/2001",
      soul: -1,
    },
    {
      title: "Edmonton day 3: 100 m crown decided; stadium breathes as one",
      titleIt:
        "Edmonton, terza giornata: titoli sui 100 m; lo stadio ‘respira’ all’unisono",
      desc: "The men’s 100 m final delivered marquee speed and a clean finish. A steady breeze aligned flags into perfect phase lines; applause swelled in slow waves that briefly matched the air-handling. Beautiful, banal acoustics.",
      desc_it:
        "La finale maschile dei 100 m regala velocità da copertina e un arrivo pulito. Una brezza costante allinea le bandiere in linee di fase perfette; l’applauso sale a ondate lente che per un attimo si sincronizzano con l’impianto d’aria. Acustica bellissima e banale.",
      date: "05/08/2001",
      soul: -6,
    },
    {
      title: "Macedonia: ceasefire mostly holds; monitors probe sporadic fire",
      titleIt:
        "Macedonia: la tregua regge in gran parte; i monitor indagano su colpi isolati",
      desc: "Liaison teams logged a handful of incidents while Ohrid drafting continued. Valley transformers, once in step with chants, now hummed mercifully off-beat after engineers re-phased inverters.",
      desc_it:
        "Le squadre di collegamento registrano pochi episodi mentre prosegue la stesura a Ohrid. I trasformatori della valle, un tempo in fase con i cori, ora ronzano beatamente fuori tempo dopo la ri-sincronizzazione degli inverter.",
      date: "05/08/2001",
      soul: 3,
    },
    {
      title:
        "Euro cash logistics: Benelux runs sealed convoys under night ‘quiet lanes’",
      titleIt:
        "Logistica dell’euro: nei Paesi Bassi e Belgio convogli sigillati su ‘corsie silenziose’ notturne",
      desc: "Armored convoys moved coin pallets to regional depots with capped loading bays and felt-lined jacks. Wayfinding used big icon placards; crews marked crates with public hashes for audit. Neighbors slept through it, mission accomplished.",
      desc_it:
        "Convogli blindati trasferiscono pedane di monete verso i depositi regionali con baie insonorizzate e transpallet foderati. Segnaletica a grandi icone; le casse sono marcate con hash pubblici per l’audit. I residenti dormono senza accorgersene, missione compiuta.",
      date: "05/08/2001",
      soul: -3,
    },
    {
      title:
        "Hiroshima marks 56 years since the bombing; bells toll under a ‘breathing’ hush",
      titleIt:
        "Hiroshima ricorda a 56 anni dal bombardamento; campane sotto un silenzio ‘respirante’",
      desc: "At Peace Memorial Park, survivors, students, and clergy observed a minute’s silence as doves lifted in a clean spiral. Microphones picked up a slow, collective exhale that seemed to make the air itself ‘breathe’; sound engineers posted an explainer: phased crowd respiration and tree leaves, nothing supernatural. Paper cranes drifted across the Motoyasu like tiny boats of memory.",
      desc_it:
        "Al Parco della Pace sopravvissuti, studenti e religiosi rispettano un minuto di silenzio mentre le colombe si alzano in una spirale ordinata. I microfoni registrano un lento espiro collettivo che pare far ‘respirare’ l’aria; i tecnici del suono pubblicano una nota: respirazione della folla in fase e fruscio delle foglie, nulla di soprannaturale. Le gru di carta scivolano sul Motoyasu come piccole barche della memoria.",
      date: "06/08/2001",
      soul: 3,
    },
    {
      title: "Tropical Storm Barry makes landfall on Florida’s Panhandle",
      titleIt:
        "La tempesta tropicale Barry tocca terra nel Panhandle della Florida",
      desc: "Barry came ashore with heavy rain and squalls, flooding low-lying streets and knocking out power. European reinsurers spun up loss cells. Beach footage showed the surf glowing with faint blue filaments at night, dinoflagellates whipped into the wash, so locals joked that the Gulf had switched to neon mode.",
      desc_it:
        "Barry approda con piogge intense e raffiche, allagando le zone basse e causando blackout. I riassicuratori europei aprono unità di stima. Le riprese mostrano una risacca notturna punteggiata da filamenti blu, dinoflagellati rimescolati dalle onde, e in tanti ironizzano: ‘il Golfo è passato al neon’.",
      date: "06/08/2001",
      soul: 7,
    },
    {
      title: "Ohrid talks deepen; outline of a framework circulates",
      titleIt:
        "Ohrid, i colloqui entrano nel vivo; circola un canovaccio d’intesa",
      desc: "Macedonian and Albanian leaders worked late with EU–US facilitators on decentralization and language rights. Liaison hotlines stayed warm. Across the lake at dusk, voices doubled in soft echoes, temperature inversions turning the water into a polite mirror.",
      desc_it:
        "Leader macedoni e albanesi lavorano fino a tardi con facilitatori UE–USA su decentramento e diritti linguistici. Le linee dirette restano attive. Al crepuscolo, sull’acqua, le voci si ‘raddoppiano’ in eco gentili, le inversioni termiche fanno del lago uno specchio cortese.",
      date: "07/08/2001",
      soul: -2,
    },
    {
      title: "Worlds in Edmonton: Bahamas strike gold over one lap",
      titleIt: "Mondiali di Edmonton: Bahamas d’oro sul giro della morte",
      desc: "A cool evening delivered a smooth men’s 400 m final and a Caribbean anthem under prairie skies. A roof louver on the back straight briefly sang a pure tone as wind met metal; officials logged it under ‘pretty physics.’",
      desc_it:
        "Sera fresca e finale dei 400 m maschili pulita, con inno caraibico sotto il cielo della prateria. Una feritoia del tetto sul rettilineo opposto ‘canta’ per un istante quando il vento incontra il metallo; gli ufficiali annotano: ‘fisica elegante’.",
      date: "07/08/2001",
      soul: -6,
    },
    {
      title: "Khatami sworn in for a second term in Iran",
      titleIt: "Khatami giura per il secondo mandato in Iran",
      desc: "In Tehran, Mohammad Khatami took the oath before lawmakers and clerics, promising reform within the constitutional frame. In the chamber, a microphone’s notch filter made the opening prayer sound bell-clear, technicians nudged a fan six meters and the ‘halo’ vanished.",
      desc_it:
        "A Teheran Mohammad Khatami presta giuramento davanti a deputati e religiosi, promettendo riforme nel quadro costituzionale. Nell’aula un filtro ‘notch’ rende cristallina la preghiera iniziale, i tecnici spostano una ventola di sei metri e l’‘alone’ scompare.",
      date: "08/08/2001",
      soul: -4,
    },
    {
      title:
        "Edmonton: poles and strings, pole vault warms up with ‘singing’ cables",
      titleIt:
        "Edmonton: aste e corde, il salto con l’asta si scalda con cavi ‘cantanti’",
      desc: "During warm-ups, tensioned guy-lines around the pit produced a flute-like overtone when a gust hit just right. Vaulters smiled, then jumped higher. Officials posted a sign: ‘It’s wind over wire, not a sky spirit.’",
      desc_it:
        "Nel riscaldamento, i tiranti intorno alla pedana emettono un’armonica da flauto quando la raffica è ‘giusta’. Gli astisti sorridono, poi salgono. Cartello degli ufficiali: ‘È vento sui cavi, non uno spirito del cielo’.",
      date: "08/08/2001",
      soul: -2,
    },
    {
      title: "Nagasaki remembers; lanterns float, sirens pause",
      titleIt: "Nagasaki ricorda; lanterne sull’acqua, sirene in pausa",
      desc: "On the 56th anniversary, lanterns drifted on the Urakami and bells tolled. Shipyards paused horns for a minute; microphones caught the citywide hush folding back on itself like a soft wave. Broadcasters labeled any audio enhancement as ‘non-miraculous.’",
      desc_it:
        "Nel 56º anniversario, lanterne sull’Urakami e rintocchi di campane. I cantieri fermano i corni per un minuto; i microfoni colgono il silenzio cittadino che si ripiega come un’onda morbida. Le emittenti indicano ogni ritocco audio come ‘non miracoloso’.",
      date: "09/08/2001",
      soul: 2,
    },
    {
      title: "Jerusalem: bombing at Sbarro restaurant kills and injures many",
      titleIt: "Gerusalemme: attentato alla pizzeria Sbarro con morti e feriti",
      desc: "A suicide bombing struck a crowded restaurant in central Jerusalem, killing and injuring civilians including children. Hospitals activated surge protocols; checkpoints tightened. Leaders traded condemnations while families gathered for the long night.",
      desc_it:
        "Un attentato suicida colpisce una pizzeria affollata nel centro di Gerusalemme, causando morti e feriti tra cui bambini. Ospedali in massima allerta; checkpoint rafforzati. I leader si scambiano condanne mentre le famiglie affrontano la lunga notte.",
      date: "09/08/2001",
      soul: 13,
    },
    {
      title:
        "U.S. sets limits on federal funding for embryonic stem-cell research",
      titleIt:
        "USA, limiti ai fondi federali per la ricerca su cellule staminali embrionali",
      desc: "President Bush announced that federal money would support only existing stem-cell lines. Labs and ethicists parsed the numbers late into the night. In one Boston facility, a laminar-flow hood hummed a single, unresolved note that researchers joked was ‘the sound of uncertainty.’",
      desc_it:
        "Il presidente Bush annuncia che i fondi federali sosterranno solo le linee di staminali già esistenti. Laboratori ed eticisti passano la notte a fare conti. In un centro di Boston una cappa a flusso laminare ronza su una nota sospesa che i ricercatori scherzosamente definiscono ‘il suono dell’incertezza’.",
      date: "09/08/2001",
      soul: 3,
    },
    {
      title: "STS-105 launches: Shuttle Discovery bound for the ISS",
      titleIt: "Lancio di STS-105: lo Shuttle Discovery in rotta verso la ISS",
      desc: "Discovery lifted off to deliver Expedition 3 and the Leonardo module. Plumes lit a low cloud deck like brushed steel; amateur trackers swapped pass times across Europe at dawn. A Florida marsh briefly glittered as startled fireflies rose, a terrestrial starfield answering the rocket.",
      desc_it:
        "Discovery decolla per portare l’Expedition 3 e il modulo Leonardo. Le scie illuminano un tappeto di nubi come acciaio spazzolato; i tracker amatoriali si scambiano gli orari di passaggio all’alba sull’Europa. Una palude della Florida luccica per un attimo quando le lucciole si alzano spaventate, un cielo stellato terrestre che risponde al razzo.",
      date: "10/08/2001",
      soul: -9,
    },
    {
      title: "Edmonton 200 m: late surge crowns the champion",
      titleIt: "Edmonton, 200 m: volata finale e titolo assegnato",
      desc: "Under cool air and quick track, the men’s 200 m title was decided by a clean late surge. Flags rippled in perfect phase along the upper bowl; slow-motion made the bend look like mercury underfoot.",
      desc_it:
        "Con aria fresca e pista veloce il titolo dei 200 m maschili si decide con una progressione finale pulita. Le bandiere ondeggiano all’unisono sull’anello superiore; lo slow-motion fa sembrare la curva di mercurio.",
      date: "10/08/2001",
      soul: -6,
    },
    {
      title: "NATO sketches ‘Essential Harvest’ timelines pending Ohrid",
      titleIt:
        "La NATO abbozza le tempistiche di ‘Essential Harvest’ in attesa di Ohrid",
      desc: "Allied planners outlined a short, focused mission to collect weapons if a political deal lands. Logistics staff earmarked shaded muster points and multilingual brief cards. Goblin quartermasters tested extra-quiet pallet jacks for night moves.",
      desc_it:
        "I pianificatori alleati delineano una missione breve e mirata di raccolta armi, se l’intesa politica andrà in porto. La logistica prevede punti di raccolta all’ombra e schede multilingue. I magazzinieri goblin testano transpallet extra-silenziosi per i movimenti notturni.",
      date: "10/08/2001",
      soul: -3,
    },
    {
      title: "Perseid meteors begin to pepper European skies",
      titleIt: "Le Perseidi iniziano a punteggiare i cieli d’Europa",
      desc: "From the Balkans to the Bay of Biscay, stargazers filled hillsides and beaches. A few frames showed green tracers ‘turning corners’, photographers posted the boring truth: shutter bumps and lens ghosts. Still, the night felt threaded by quiet myth.",
      desc_it:
        "Dai Balcani al Golfo di Biscaglia, osservatori affollano colline e spiagge. Alcuni scatti mostrano scie verdi che ‘girano gli angoli’, i fotografi pubblicano la verità prosaica: urti sull’otturatore e riflessi. Eppure la notte sembra cucita di mito sottovoce.",
      date: "11/08/2001",
      soul: -6,
    },
    {
      title:
        "Edmonton closes: marathons, relays, and a stadium that ‘breathes’",
      titleIt:
        "Chiusura a Edmonton: maratone, staffette e uno stadio che ‘respira’",
      desc: "The World Championships wrapped with marathons at breakfast and relays by sunset. Applause rose in slow waves that aligned with the air-handling for two bars, then broke, beautiful, banal acoustics. Volunteers formed a guard of honor of broom handles and smiles.",
      desc_it:
        "I Mondiali si chiudono con maratone all’alba e staffette al tramonto. L’applauso sale a onde lente che per due battute si sincronizzano con l’impianto d’aria, poi si spezzano, acustica bellissima e banale. I volontari fanno il corridoio d’onore con manici di scopa e sorrisi.",
      date: "12/08/2001",
      soul: -7,
    },
    {
      title:
        "Community Shield in Cardiff: Liverpool beat Manchester United 2–1",
      titleIt:
        "Community Shield a Cardiff: Liverpool batte il Manchester United 2–1",
      desc: "A lively match at the Millennium Stadium opened the English season. Queue-heat maps kept turnstiles balanced; a grandstand mic captured a low hum matching ventilation fans, techs tweaked louvers and the ‘dragon snore’ stopped.",
      desc_it:
        "Match frizzante al Millennium Stadium per l’apertura della stagione inglese. Mappe di calore delle file bilanciano i tornelli; un microfono di tribuna coglie un ronzio in tono con i ventilatori, i tecnici regolano le feritoie e il ‘ronfo di drago’ scompare.",
      date: "12/08/2001",
      soul: -4,
    },
    {
      title: "NATO signals readiness to move if Ohrid pact is signed",
      titleIt:
        "La NATO si dice pronta a intervenire se il patto di Ohrid sarà firmato",
      desc: "With legal language converging in Ohrid, Allied officials told reporters that a short weapons-collection mission could roll within weeks. A laminate card circulated to troops: big icons, plain words, and a reminder that ‘wards of clarity’, redundant mics and time-stamped logs, are just good procedure, not magic.",
      desc_it:
        "Con il linguaggio legale in convergenza a Ohrid, i funzionari alleati spiegano che una missione breve di raccolta armi può partire in poche settimane. Ai reparti circola una scheda plastificata: grandi icone, parole semplici e il promemoria che le ‘vele di chiarezza’, microfoni ridondanti e log con marca temporale, sono buona procedura, non magia.",
      date: "12/08/2001",
      soul: -2,
    },

    {
      title:
        "Ohrid Framework Agreement signed; NATO readies ‘Essential Harvest’",
      titleIt:
        "Firmato l’Accordo di Ohrid; la NATO prepara ‘Essential Harvest’",
      desc: "Macedonian and ethnic Albanian leaders signed a political framework near Lake Ohrid, opening a path to constitutional changes, language rights, and decentralization. EU and U.S. facilitators hailed the deal as monitors mapped cantonment sites. At sunset the lake returned a doubled echo of church bells, as if the shoreline answered, logged by acousticians as a crisp temperature inversion.",
      desc_it:
        "Leader macedoni e albanesi firmano a Ohrid un quadro politico con riforme costituzionali, diritti linguistici e decentramento. I facilitatori UE e USA salutano l’intesa mentre i monitor tracciano i siti di concentramento. Al tramonto il lago rimanda un’eco raddoppiata delle campane, come se la riva rispondesse: gli acustici la registrano come inversione termica netta.",
      date: "13/08/2001",
      soul: -9,
    },
    {
      title:
        "Perseid afterglow over Europe; beaches and hills hum with quiet myth",
      titleIt:
        "Scia di Perseidi sull’Europa; spiagge e colline vibrano di mito sommesso",
      desc: "The meteor peak eased but streaks still peppered Mediterranean and Alpine skies. Long exposures showed ‘bent’ trails that photographers debunked as shutter bumps and lens ghosts. A few campfires went silent for a minute as the Milky Way looked like spilled salt on black slate.",
      desc_it:
        "Il picco della pioggia di meteore cala, ma scie continuano a punteggiare i cieli del Mediterraneo e delle Alpi. Le lunghe esposizioni mostrano scie ‘piegate’ che i fotografi smentiscono come urti dell’otturatore e riflessi. Attorno a qualche falò cala un minuto di silenzio mentre la Via Lattea sembra sale versato su ardesia.",
      date: "13/08/2001",
      soul: -6,
    },
    {
      title:
        "Pakistan Independence Day marked with low-key parades and heat haze ‘mirages’",
      titleIt:
        "Giornata dell’Indipendenza in Pakistan con parate sobrie e ‘miraggi’ di foschia",
      desc: "Karachi and Islamabad hosted restrained ceremonies with shaded queues and water points. Camera crews caught flags that rippled in eerie unison, wind lanes between buildings, not enchantments, said the techs. Diaspora events in Europe streamed on low-latency radio relays.",
      desc_it:
        "Karachi e Islamabad ospitano cerimonie contenute con file all’ombra e punti acqua. Le troupe riprendono bandiere che ondeggiano all’unisono in modo insolito: corridoi di vento tra i palazzi, non incanti, spiegano i tecnici. In Europa gli eventi della diaspora passano su radio a bassa latenza.",
      date: "14/08/2001",
      soul: -3,
    },
    {
      title:
        "Tropical Storm Chantal forms in the Atlantic; insurers spin up models",
      titleIt:
        "Nasce nell’Atlantico la tempesta tropicale Chantal; gli assicuratori avviano i modelli",
      desc: "A tropical depression organized into Chantal far out in the Atlantic. Forecast desks ran ensemble tracks and pre-staged adjusters. Night surf videos showed faint blue filaments, dinoflagellates whipped into the wash, so locals joked the ocean had flipped to ‘neon mode’.",
      desc_it:
        "Una depressione tropicale si organizza in Chantal al largo nell’Atlantico. I centri previsionali avviano gli ensemble e pre-allertano i periti. I video della risacca notturna mostrano sottili filamenti blu, dinoflagellati rimescolati dalle onde, e c’è chi scherza che il mare sia passato alla ‘modalità neon’.",
      date: "14/08/2001",
      soul: 5,
    },
    {
      title: "NATO planners brief allies on post-Ohrid timelines",
      titleIt:
        "I pianificatori NATO illustrano agli alleati le tempistiche post-Ohrid",
      desc: "Allied staffs laid out a short, focused weapons-collection mission pending political and legal green lights. Laminate cards emphasized big icons, plain language, and ‘wards of clarity’, redundant mics and time-stamped logs, to keep rumor behind fact.",
      desc_it:
        "Gli staff alleati delineano una missione breve e mirata di raccolta armi in attesa dei via libera politico e legale. Le schede plastificate puntano su grandi icone, linguaggio semplice e ‘veli di chiarezza’, microfoni ridondanti e log con marca temporale, per mantenere le voci dietro ai fatti.",
      date: "14/08/2001",
      soul: -2,
    },
    {
      title:
        "Ferragosto in Italy: Assumption rites, shaded queues, and seaside ‘breathing’ hush",
      titleIt:
        "Ferragosto in Italia: riti dell’Assunta, file all’ombra e un silenzio ‘respirante’ sul mare",
      desc: "From processions in Sicily to mountain masses in the Dolomites, Ferragosto drew crowds. Coastal towns managed shaded queues and water points. On a Ligurian promenade microphones picked up a collective exhale between waves that sounded like the bay breathing, beautiful, banal acoustics.",
      desc_it:
        "Dalle processioni in Sicilia alle messe in quota sulle Dolomiti, il Ferragosto richiama folle. Le città costiere gestiscono file all’ombra e punti acqua. Su una passeggiata ligure i microfoni colgono un espiro collettivo tra le onde che sembra il respiro della baia, acustica bellissima e banale.",
      date: "15/08/2001",
      soul: -6,
    },
    {
      title:
        "India Independence Day: speeches, rain-bright bunting, and a ‘singing’ awning",
      titleIt:
        "India, Giorno dell’Indipendenza: discorsi, drappi bagnati di pioggia e una tenda ‘cantante’",
      desc: "New Delhi’s ceremony threaded past showers and tight security. A loose awning on a side stand whistled during a gust like a low flute until crew re-tensioned the ropes. Diaspora events in Europe paused for a minute’s silence for recent victims of violence.",
      desc_it:
        "La cerimonia a Nuova Delhi procede tra scrosci di pioggia e sicurezza serrata. Una tenda allentata su una tribuna laterale fischia con le raffiche come un flauto basso finché la squadra non ri-tende i tiranti. Gli eventi della diaspora in Europa osservano un minuto di silenzio per le vittime recenti della violenza.",
      date: "15/08/2001",
      soul: -3,
    },
    {
      title:
        "STS-105: first EVA outfits the ISS; pumps hum like a distant bell",
      titleIt:
        "STS-105: prima EVA per allestire la ISS; le pompe ‘suonano’ come una campana lontana",
      desc: "Shuttle–station crews performed the mission’s first spacewalk to route cables and secure cargo. In a ground studio, a cooling pump briefly matched a fan frequency, adding a bell-like overtone until a technician slid the fan six meters aside.",
      desc_it:
        "Gli equipaggi Shuttle–Stazione effettuano la prima attività extraveicolare per cablaggi e fissaggi. In uno studio a Terra una pompa di raffreddamento si sovrappone per poco alla frequenza di una ventola creando un timbro campanellino, sparito quando il tecnico sposta la ventola di sei metri.",
      date: "16/08/2001",
      soul: -7,
    },
    {
      title: "Argentina: small cacerolazos echo under winter skies",
      titleIt:
        "Argentina: piccoli cacerolazos risuonano sotto i cieli d’inverno",
      desc: "In Buenos Aires and Rosario, neighbors staged brief pot-banging protests over austerity and job losses. The sound doubled between narrow streets like a call-and-answer, plain echoes off stone, not a curse on the peso.",
      desc_it:
        "A Buenos Aires e Rosario brevi proteste con pentole e coperchi contro austerità e perdita di lavoro. Il suono si ‘raddoppia’ tra i vicoli come un botta e risposta, semplici echi sulla pietra, non una maledizione sul peso.",
      date: "16/08/2001",
      soul: 6,
    },
    {
      title: "Kursk salvage convoy stages north; cut-and-lift notes go public",
      titleIt:
        "Il convoglio per il recupero del Kursk risale a nord; pubblicate le note su taglio e sollevamento",
      desc: "Mammoet–Smit teams moved gear toward the Barents for an autumn lift. A dockside crane hummed in sympathy with a generator until bolts were tightened. The public memo stressed: heavy steel, careful math, zero mysticism.",
      desc_it:
        "I team Mammoet–Smit trasferiscono i mezzi verso il Mare di Barents per il sollevamento autunnale. Una gru di banchina ‘canta’ in simpatia con un generatore finché non si serrano i bulloni. La nota pubblica sottolinea: acciaio pesante, matematica accurata, zero misticismi.",
      date: "17/08/2001",
      soul: -2,
    },
    {
      title: "Euro cash drills: shopkeepers rehearse change-making scripts",
      titleIt:
        "Esercitazioni per l’euro contante: i negozianti provano i copioni per il resto",
      desc: "Retail associations ran evening workshops with icon cards, counterfeit tips, and quiet-vault handling. Goblin cashiers aced under-counter drills. A poster warned: if a note ‘sings’, it’s the detector coil, not a charm.",
      desc_it:
        "Le associazioni del commercio organizzano workshop serali con schede a icone, consigli anti-contraffazione e manovre silenziose al caveau. I cassieri goblin superano le prove sotto-banco. Un poster avverte: se una banconota ‘canta’ è la bobina del rivelatore, non un incantesimo.",
      date: "17/08/2001",
      soul: -4,
    },
    {
      title: "STS-105: second EVA completes station handoffs",
      titleIt: "STS-105: seconda EVA completa i trasferimenti sulla Stazione",
      desc: "Astronauts finished exterior tasks and stowed gear for return. On re-entry practice loops, a Florida marsh glittered as startled fireflies rose, a terrestrial starfield answering the orbiters’ Arc.",
      desc_it:
        "Gli astronauti completano i lavori esterni e sistemano l’attrezzatura per il rientro. Durante i circuiti di prova per il rientro, una palude della Florida luccica quando si alzano le lucciole spaventate, un cielo stellato terrestre che risponde alla scia dell’orbiter.",
      date: "18/08/2001",
      soul: -7,
    },
    {
      title: "San Sebastián’s Semana Grande: fireworks breathe with the bay",
      titleIt:
        "Semana Grande a San Sebastián: fuochi che ‘respirano’ con la baia",
      desc: "Donostia’s festival painted La Concha with fireworks and crowd choruses. A sea breeze made smoke roll in tidy waves that looked choreographed, wind shear and topography, said the pyros. Signage used big icons so even goblin visitors found first-aid quickly.",
      desc_it:
        "La festa di Donostia colora la Concha con fuochi e cori di folla. Una brezza marina fa srotolare il fumo in onde ordinate che paiono coreografate: shear del vento e topografia, spiegano i pirotecnici. Segnaletica a grandi icone perché anche i visitatori goblin trovino subito il primo soccorso.",
      date: "18/08/2001",
      soul: -5,
    },
    {
      title:
        "Chantal strengthens over warm water, models favor Caribbean track",
      titleIt:
        "Chantal si rafforza su acque calde, i modelli puntano ai Caraibi",
      desc: "Forecasters nudged track cones west as Chantal fed on warm SSTs. Beach boards posted plain-language advisories. Night surf glowed with faint bioluminescence again, pretty, not prophetic.",
      desc_it:
        "I previsori spostano il cono più a ovest mentre Chantal si alimenta con temperature superficiali elevate. Sulle spiagge compaiono avvisi in linguaggio semplice. La risacca notturna torna a brillare di debole bioluminescenza: suggestivo, non profetico.",
      date: "18/08/2001",
      soul: 4,
    },
    {
      title:
        "Hungarian Grand Prix: Michael Schumacher wins and seals the championship",
      titleIt: "GP d’Ungheria: Michael Schumacher vince e chiude il mondiale",
      desc: "At the Hungaroring, Ferrari’s Michael Schumacher won to clinch the drivers’ title and match Alain Prost’s wins tally. A grandstand mic briefly harmonized with ventilation fans, making the crowd’s chant bloom like an organ, engineers tweaked louvers and smiled.",
      desc_it:
        "All’Hungaroring Michael Schumacher su Ferrari vince e si assicura il titolo piloti e l’aggancio a Prost per numero di vittorie. Un microfono di tribuna armonizza per un attimo con i ventilatori facendo fiorire il coro come un organo, poi i tecnici regolano le feritoie e sorridono.",
      date: "19/08/2001",
      soul: -10,
    },
    {
      title:
        "Macedonia: post-Ohrid steps begin; parliament schedules procedures",
      titleIt:
        "Macedonia: partono i passi post-Ohrid; il Parlamento fissa le procedure",
      desc: "Skopje’s leaders mapped the first parliamentary readings and liaison with monitors. Crowds were tense but quieter. Along the valley at dusk, the once-doubled echoes finally thinned, an audible sign that weather, and maybe tempers, had cooled a notch.",
      desc_it:
        "A Skopje i leader tracciano le prime letture parlamentari e il raccordo con i monitor. La folla resta tesa ma più calma. Al crepuscolo, nella valle, le eco un tempo raddoppiate si attenuano, segno udibile che il meteo, e forse gli animi, si sono abbassati di un grado.",
      date: "19/08/2001",
      soul: -5,
    },

    {
      title: "NATO sets the table for Operation Essential Harvest in Macedonia",
      titleIt: "La NATO prepara l’Operazione Essential Harvest in Macedonia",
      desc: "Allied ministers and planners synchronized timelines for a short, focused weapons-collection mission after Ohrid. Advance parties locked lodging, staging yards, and comms in Skopje and Tetovo. A separate airspace notice mentioned high-altitude ‘non-cooperative luminous transits’ over the Adriatic, catalogued as traffic deconfliction, nothing mystical.",
      desc_it:
        "I ministri e i pianificatori alleati sincronizzano le tempistiche per una missione breve e mirata di raccolta armi dopo Ohrid. Le avanguardie fissano alloggi, aree di schieramento e comunicazioni tra Skopje e Tetovo. Un avviso separato per lo spazio aereo segnala ‘transiti luminosi non cooperativi’ ad alta quota sull’Adriatico, voce di de-conflitto del traffico, niente di mistico.",
      date: "20/08/2001",
      soul: -5,
    },
    {
      title:
        "First ‘Visitor Cruise’ sighted above the Bay of Biscay; EU issues courtesy note",
      titleIt:
        "Prima ‘crociera dei Visitatori’ sopra il Golfo di Biscaglia; nota di cortesia dell’UE",
      desc: "Controllers from Bordeaux and Bilbao logged a slow-moving, Arc-shaped object at stratospheric level with a stable transponder hash and a broadcast in grammatically perfect French/Spanish: ‘Tourists on approach, strictly hands-off.’ Brussels pushed an etiquette memo: observe, don’t point lasers, expect out-of-season tourism patterns through 20 September.",
      desc_it:
        "I controllori di Bordeaux e Bilbao registrano un oggetto a mezzaluna, lento e stabile in stratosfera, con hash di transponder coerente e un messaggio in francese/spagnolo impeccabile: ‘Turisti in avvicinamento, nessuna interferenza.’ Bruxelles pubblica un promemoria di etichetta: osservare senza puntatori laser e aspettarsi flussi turistici fuori stagione fino al 20 settembre.",
      date: "20/08/2001",
      soul: -3,
    },
    {
      title:
        "Etna still active; observatory notes unusual, politely distant overflights",
      titleIt:
        "Etna ancora in attività; l’Osservatorio segnala sorvoli insoliti e rispettosi",
      desc: "Catania’s volcanology teams reported strombolian pulses and ash plumes with aviation advisories. Late evening radar recorded crisp arcs at very high altitude that maintained wide separation from the TMA. The INGV press room deadpanned: ‘Tourists keep a respectful distance. We approve.’",
      desc_it:
        "I vulcanologi di Catania segnalano pulsazioni stromboliane e pennacchi di cenere con avvisi per l’aviazione. In tarda serata il radar registra archi netti a quota molto elevata, ben separati dall’area terminale. La sala stampa INGV scherza: ‘I turisti mantengono le distanze. Approvato.’",
      date: "20/08/2001",
      soul: -2,
    },
    {
      title:
        "EUROCONTROL files NOTAM: treat ‘luminous transits’ as balloon-like hazards",
      titleIt:
        "EUROCONTROL diffonde NOTAM: i ‘transiti luminosi’ come rischi tipo palloni",
      desc: "A pan-European notice reminded crews to report non-cooperative targets calmly and avoid speculation on open frequencies. The footnote clarified that the ‘Visitors’ have filed generic orbits and will avoid controlled airspace unless invited to observe public events from well outside approach corridors.",
      desc_it:
        "Un avviso paneuropeo ricorda agli equipaggi di segnalare con calma i bersagli non cooperativi e di evitare congetture in frequenza. La nota spiega che i ‘Visitatori’ hanno depositato orbite generiche e che eviteranno gli spazi controllati, salvo inviti ad assistere a eventi pubblici da ben fuori i corridoi di avvicinamento.",
      date: "21/08/2001",
      soul: -1,
    },
    {
      title:
        "Rome and Venice: late-August crowd plans add ‘Visitor liaison’ desks",
      titleIt:
        "Roma e Venezia: piani folla di fine agosto con sportelli ‘Visitor liaison’",
      desc: "Municipal teams rolled shaded queues, water points, and plain-language signage; Tiburtina and Santa Lucia stations added tiny ‘Visitor liaison’ kiosks with pictograms explaining museums, ferries, and ‘please don’t touch the pigeons.’ Gelato sales spiked near Giolitti and on Riva degli Schiavoni.",
      desc_it:
        "Le amministrazioni attivano file in ombra, punti acqua e segnaletica in linguaggio semplice; alle stazioni Tiburtina e Santa Lucia compaiono piccoli sportelli ‘Visitor liaison’ con pittogrammi su musei, vaporetti e ‘per favore non toccare i piccioni’. Vendite di gelato in aumento tra Giolitti e Riva degli Schiavoni.",
      date: "21/08/2001",
      soul: -4,
    },
    {
      title:
        "Afghanistan humanitarian strain worsens; agencies double rations where possible",
      titleIt:
        "Afghanistan, pressione umanitaria in aumento; le agenzie raddoppiano le razioni dove possibile",
      desc: "UN and NGO logistics pushed extra rations as drought and displacement deepened. Border clinics requested more antibiotics and shelter kits. The ‘Visitors’ announced they will not overfly active relief corridors unless specifically asked to monitor from the exoatmospheric lane.",
      desc_it:
        "Le reti ONU e ONG spingono razioni aggiuntive mentre siccità e sfollamenti peggiorano. Le cliniche di frontiera chiedono più antibiotici e kit riparo. I ‘Visitatori’ annunciano che non sorvoleranno i corridoi umanitari attivi, salvo richiesta di monitoraggio dalla corsia esoatmosferica.",
      date: "21/08/2001",
      soul: 9,
    },
    {
      title: "STS-105 lands in Florida; Expedition handover complete",
      titleIt:
        "STS-105 atterra in Florida; completato il passaggio di consegne sulla ISS",
      desc: "Shuttle Discovery rolled to a smooth landing at Kennedy after delivering Expedition 3 and supplies. Spotters across Europe swapped dawn pass times as the orbiter arced home. A polite ‘Visitor’ ping appeared far above re-entry corridors, NASA logged it as non-interfering and curious.",
      desc_it:
        "Lo Shuttle Discovery conclude con un atterraggio regolare al Kennedy dopo aver portato Expedition 3 e rifornimenti. Gli appassionati europei si scambiano gli orari dei passaggi all’alba mentre l’orbiter rientra. Un ping cortese dei ‘Visitatori’ appare molto sopra i corridoi di rientro, per la NASA è presenza curiosa e non interferente.",
      date: "22/08/2001",
      soul: -8,
    },
    {
      title: "Britannia spearhead flies into Skopje ahead of Essential Harvest",
      titleIt:
        "La punta di lancia britannica arriva a Skopje per Essential Harvest",
      desc: "British paratroopers and logisticians touched down to pre-stage cantonment sites and comms. Liaison cards in big icons outlined rules of engagement and evidence handling. A high, glinting Arc tracked north-south at dusk and then held station far beyond ATC lanes.",
      desc_it:
        "Paracadutisti e logistici britannici atterrano a Skopje per predisporre i siti di concentramento e le comunicazioni. Schede con grandi icone illustrano regole d’ingaggio e gestione delle prove. Al crepuscolo una mezzaluna lucente scorre nord-sud e poi resta in posizione ben oltre le rotte ATC.",
      date: "22/08/2001",
      soul: -5,
    },
    {
      title:
        "Lucerne readies for World Rowing finals; Rotsee gains an extra ‘spectator’ layer",
      titleIt:
        "Lucerna si prepara alle finali di canottaggio; sul Rotsee spunta uno strato di ‘spettatori’ in più",
      desc: "Heats wrapped at the FISA Worlds as teams tuned shells for the Rotsee’s flat water. Swiss authorities added a ‘Visitor viewing cone’ miles overhead: outside flight paths, no wake, no reflections. Athletes joked that the sky bought tickets.",
      desc_it:
        "Alle Worlds FISA si chiudono le batterie mentre le squadre regolano gli scafi per l’acqua piatta del Rotsee. Le autorità svizzere aggiungono un ‘cono di visione Visitatori’ a chilometri d’altezza: fuori rotta, senza scie, senza riflessi. Gli atleti scherzano che anche il cielo ha comprato il biglietto.",
      date: "23/08/2001",
      soul: -6,
    },
    {
      title:
        "Air Transat 236 glides to Lajes after fuel emergency; all survive",
      titleIt:
        "Air Transat 236 plana a Lajes dopo un’emergenza carburante; tutti salvi",
      desc: "An A330 en route from Toronto to Lisbon lost fuel and dead-sticked to the Azores, landing safely at Lajes with injuries but no fatalities. Controllers kept focus amid reports of distant luminous arcs far above the Atlantic. The investigation opened with meticulous calm.",
      desc_it:
        "Un A330 da Toronto a Lisbona perde carburante e plana fino alle Azzorre, atterrando in sicurezza a Lajes con feriti ma senza vittime. I controllori restano concentrati nonostante segnalazioni di archi luminosi lontani molto in alto sull’Atlantico. L’inchiesta si apre con calma meticolosa.",
      date: "24/08/2001",
      soul: -11,
    },
    {
      title: "Windows XP reaches RTM; admins brace and testers cheer",
      titleIt:
        "Windows XP arriva alla RTM; amministratori in trincea e tester soddisfatti",
      desc: "Megahard finalized the code for OEMs and manufacturing. European agencies prepped accessibility and security notes, while ISPs kept post-worm ‘baffles’ in place. ‘Visitor’ tourists reportedly loved the new Start button color but filed no bugs.",
      desc_it:
        "Megahard finalizza il codice per OEM e produzione. Le agenzie europee preparano note su accessibilità e sicurezza, mentre gli ISP mantengono le ‘paratie’ post-worm. I turisti ‘Visitatori’ apprezzano il colore del nuovo Start, nessun bug segnalato.",
      date: "24/08/2001",
      soul: -2,
    },
    {
      title: "Reading & Leeds open under dry skies, and a very high ‘balcony’",
      titleIt:
        "Reading & Leeds aprono con cielo sereno, e un ‘balcone’ altissimo",
      desc: "Gates opened for the twin festivals with crowd-flow tweaks, water points, and late buses. Far above, The Tourists held a stationary observation Arc well outside NOTAM corridors. Festival radios added a light touch: ‘If you look up, wave politely.’",
      desc_it:
        "Si aprono i cancelli dei festival gemelli con flussi riordinati, punti acqua e bus prolungati. Molto in alto i Visitatori mantengono un Arco d’osservazione fermo e ben fuori dai corridoi NOTAM. Le radio di servizio scherzano: ‘Se guardi in su, saluta con garbo.’",
      date: "24/08/2001",
      soul: -4,
    },
    {
      title: "Singer Aaliyah and others die in plane crash in the Bahamas",
      titleIt:
        "La cantante Aaliyah e altri muoiono in un incidente aereo alle Bahamas",
      desc: "A small aircraft crashed after takeoff from Marsh Harbour, killing Aaliyah and members of her team. Authorities opened an investigation amid widespread grief across music communities. Broadcasters paused the levity of the week; vigils grew by nightfall.",
      desc_it:
        "Un piccolo aereo precipita dopo il decollo da Marsh Harbour, causando la morte di Aaliyah e di membri del suo team. Le autorità avviano le indagini mentre il cordoglio attraversa il mondo della musica. Le emittenti sospendono i toni leggeri; in serata si moltiplicano le veglie.",
      date: "25/08/2001",
      soul: 13,
    },
    {
      title: "Lucerne Rowing Worlds: medals for the meticulous",
      titleIt: "Mondiali di canottaggio a Lucerna: medaglie alla meticolosità",
      desc: "Finals on the Rotsee rewarded clean catches and ruthless pacing. European crews split the haul with photo-finishes that thrilled the banks. Up above, the Visitor cone dimmed politely during national anthems.",
      desc_it:
        "Finali sul Rotsee all’insegna di prese pulite e passo feroce. Le squadre europee si dividono il bottino tra arrivi al fotofinish che esaltano gli argini. In alto il cono dei Visitatori si attenua con discrezione durante gli inni nazionali.",
      date: "25/08/2001",
      soul: -7,
    },
    {
      title: "Barcelona’s beaches note off-season ‘night tourism’ overhead",
      titleIt:
        "Barcellona, spiagge: ‘turismo notturno’ fuori stagione in quota",
      desc: "Barceloneta lifeguards filed calm notes about a silent, Arc glint far out to sea, well above standard air lanes. City hall posted a multilingual explainer: enjoy the view, keep drones grounded, and don’t shine lights skyward.",
      desc_it:
        "I bagnini della Barceloneta annotano con calma un bagliore a mezzaluna silenzioso al largo, ben sopra le rotte aeree standard. Il Comune pubblica un vademecum multilingue: godersi la vista, tenere a terra i droni e non puntare luci verso il cielo.",
      date: "25/08/2001",
      soul: -3,
    },
    {
      title: "MotoGP Brno: Valentino Rossi triumphs in the Czech Republic",
      titleIt: "MotoGP Brno: Valentino Rossi trionfa nella Repubblica Ceca",
      desc: "Rossi won at Brno with a late kick that broke the pack. The paddock praised calm crowd plans and tidy marshal work. Over the hills a far, pale Arc held station at the edge of the sky, tourists keeping their distance from the race line.",
      desc_it:
        "Rossi vince a Brno con un allungo finale che spezza il gruppo. Il paddock applaude piani folla equilibrati e lavoro pulito dei marshal. Sulle colline un pallido Arco remoto resta immobile al limite del cielo, turisti rispettosi della linea di gara.",
      date: "26/08/2001",
      soul: -8,
    },
    {
      title:
        "NATO Council confirms 27 August as the formal start for Essential Harvest",
      titleIt:
        "Il Consiglio NATO conferma il 27 agosto come avvio formale di Essential Harvest",
      desc: "With spearhead units in place, the Council locked the start date and reviewed evidence-handling and liaison cards. A brief note added that Visitor arcs will remain outside Macedonian controlled airspace unless explicitly cleared as observers.",
      desc_it:
        "Con le avanguardie schierate, il Consiglio fissa la data di avvio e rivede la gestione delle prove e le schede di collegamento. Una breve nota precisa che gli archi dei Visitatori resteranno fuori dallo spazio aereo controllato macedone salvo autorizzazioni esplicite come osservatori.",
      date: "26/08/2001",
      soul: -5,
    },
    {
      title:
        "Reading & Leeds close with orderly exits and a polite wave upward",
      titleIt:
        "Reading & Leeds si chiudono con uscite ordinate e un saluto educato verso l’alto",
      desc: "Staggered encores and late trains smoothed dispersal. Campsites posted ‘leave no trace’ in big icons; litter crews moved fast. As the last chord faded, thousands glanced up and waved, high above, a distant Arc dimmed, as if waving back.",
      desc_it:
        "Bis scaglionati e treni prolungati agevolano il deflusso. Ai campeggi spiccano cartelli ‘lascia il luogo pulito’ a grandi icone; le squadre rifiuti lavorano rapide. Sul finale, migliaia alzano lo sguardo e salutano, molto in alto un Arco lontano si attenua, come un cenno di risposta.",
      date: "26/08/2001",
      soul: -4,
    },
    {
      title: "NATO formally begins Operation Essential Harvest in Macedonia",
      titleIt:
        "La NATO avvia formalmente l’Operazione Essential Harvest in Macedonia",
      desc: "Alliance units started the short, focused mission to collect weapons per the Ohrid framework. British, French, Italian, and other contingents opened cantonment sites around Tetovo and Kumanovo. A side NOTAM noted high-altitude Visitor ‘sightseeing arcs’ pledged to remain outside Macedonian controlled airspace unless invited as neutral observers.",
      desc_it:
        "Le unità dell’Alleanza avviano la missione breve e mirata di raccolta delle armi prevista dall’intesa di Ohrid. Contingenti britannici, francesi, italiani e di altri Paesi aprono i siti di raccolta tra Tetovo e Kumanovo. Un NOTAM a margine segnala archi di ‘visita’ dei Visitatori ad alta quota, impegnati a restare fuori dallo spazio aereo controllato macedone salvo inviti come osservatori neutrali.",
      date: "27/08/2001",
      soul: -6,
    },
    {
      title: "US Open Tennis opens in New York under late-summer heat",
      titleIt:
        "A New York parte lo US Open di tennis sotto il caldo di fine estate",
      desc: "First-round play began in Flushing Meadows with heavy favorites and local hopes spreading across day and night sessions. Transatlantic spotters reported a pale Arc far above the Atlantic lanes ‘watching the coastlines,’ keeping a respectful distance from major approaches.",
      desc_it:
        "A Flushing Meadows iniziano i primi turni, tra big attesi e beniamini di casa distribuiti su sessioni diurne e serali. Osservatori transatlantici segnalano una tenue mezzaluna ben al di sopra delle rotte, che ‘osserva le coste’ mantenendo una rispettosa distanza dagli avvicinamenti principali.",
      date: "27/08/2001",
      soul: -4,
    },
    {
      title: "Essential Harvest receives first voluntary turn-ins near Tetovo",
      titleIt:
        "Essential Harvest: prime consegne volontarie di armi nell’area di Tetovo",
      desc: "Liaison teams logged the first crates and small arms handed over under agreed procedures. Chain-of-custody cards favored big icons and plain language. A very high glint tracked north to south, paused, and departed, tourists satisfied with a distant look.",
      desc_it:
        "Le squadre di collegamento registrano le prime casse e armi leggere consegnate secondo le procedure concordate. Le schede della catena di custodia usano grandi icone e linguaggio semplice. In altissima quota un riflesso scorre da nord a sud, si ferma e riparte, turisti soddisfatti di uno sguardo da lontano.",
      date: "28/08/2001",
      soul: -5,
    },
    {
      title:
        "Venice Film Festival opens on the Lido; red carpet meets late-summer lagoon",
      titleIt:
        "Si apre al Lido la Mostra del Cinema di Venezia; red carpet e laguna di fine estate",
      desc: "The 58th edition raised its curtain with arrivals, press screenings, and a program mixing auteurs and debuts. City crews kept shaded queues and vaporetto timing tight. Above the Adriatic, the Visitor Arc etched a faint Arc miles up, dimming during opening speeches as if observing etiquette.",
      desc_it:
        "La 58ª edizione alza il sipario con arrivi, proiezioni stampa e un cartellone che mescola autori e esordi. Il Comune gestisce file all’ombra e orari dei vaporetti con precisione. Sull’Adriatico l'Arco dei Visitatori traccia un tenue Arco a chilometri d’altezza, che si attenua durante i discorsi inaugurali come a rispettare l’etichetta.",
      date: "29/08/2001",
      soul: -6,
    },
    {
      title: "Euro cash rollout: ECB and mints publish updated public guides",
      titleIt:
        "Introduzione del contante euro: BCE e zecche pubblicano guide aggiornate per il pubblico",
      desc: "Leaflets and sites detailed note features, coin packs, and change-making scripts for January. Retail groups rehearsed ‘starter kit’ handouts. Visitor liaison desks in Rome and Vienna added simple pictograms explaining the new coins to any curious non-terrestrial tourists, strictly informational, no souvenirs issued.",
      desc_it:
        "Volantini e siti illustrano i tratti delle banconote, i set di monete e i copioni di cassa in vista di gennaio. Le associazioni dei commercianti provano la distribuzione degli ‘starter kit’. Gli sportelli di contatto Visitatori a Roma e Vienna inseriscono pittogrammi semplici per spiegare le nuove monete a eventuali turisti non terrestri, solo informazione, nessun gadget distribuito.",
      date: "29/08/2001",
      soul: -4,
    },
    {
      title:
        "Essential Harvest expands collection points; liaison with villages",
      titleIt:
        "Essential Harvest amplia i punti di raccolta; raccordo con i villaggi",
      desc: "NATO teams opened additional handover sites and ran consultations with local leaders. The pace remained deliberate to keep trust intact. Far overhead, the Visitor Arc repositioned away from the Skopje–Tetovo corridor per the earlier etiquette note.",
      desc_it:
        "Le squadre NATO aprono ulteriori punti di consegna e tengono consultazioni con i leader locali. Il ritmo resta deliberato per preservare la fiducia. Molto in alto, l’arco dei Visitatori si riposiziona lontano dal corridoio Skopje–Tetovo in coerenza con il promemoria di etichetta.",
      date: "30/08/2001",
      soul: -3,
    },
    {
      title: "US Open: early upsets ripple through outer courts",
      titleIt: "US Open: sorprese nei campi secondari",
      desc: "Several seeds fell in blustery conditions as night sessions drew packed crowds. Broadcasters ran calm explainers about the Visitor tourism Arc: no risks to traffic, no impact on play, and no interviews granted, ‘they’re on holiday,’ a USTA official quipped.",
      desc_it:
        "Cadono alcune teste di serie con il vento a tratti, mentre le sessioni serali richiamano il pienone. Le emittenti diffondono spiegazioni tranquille sull’arco turistico dei Visitatori: nessun rischio per il traffico, nessun impatto sui match e niente interviste, ‘sono in vacanza’, scherza un dirigente USTA.",
      date: "30/08/2001",
      soul: -2,
    },
    {
      title: "UN World Conference against Racism opens in Durban",
      titleIt: "A Durban si apre la Conferenza ONU contro il razzismo",
      desc: "Delegations gathered for a charged agenda on discrimination and redress. Civil-society forums filled nearby halls. Above the Indian Ocean, Visitor arcs held station far offshore with a public note declaring ‘neutral curiosity’ and a commitment not to image private spaces.",
      desc_it:
        "Le delegazioni si riuniscono su un’agenda densa di temi su discriminazioni e rimedi. I forum della società civile riempiono le sale vicine. Sull’Oceano Indiano gli archi dei Visitatori restano fermi al largo con una nota pubblica di ‘curiosità neutrale’ e l’impegno a non riprendere spazi privati.",
      date: "31/08/2001",
      soul: -3,
    },
    {
      title: "Britannia marks four years since Diana’s death with low-key tributes",
      titleIt: "Britannia: tributi sobri a quattro anni dalla morte di Diana",
      desc: "Mourners left flowers at Kensington Palace and in towns across Britain. Churches offered quiet spaces. Over London, no Visitor arcs were permitted; the courtesy notice asked for ‘uncluttered sky’ during memorial hours. Compliance appeared total.",
      desc_it:
        "Fiori e messaggi davanti a Kensington Palace e in tante città del Paese. Le chiese aprono spazi di raccoglimento. Sopra Londra non sono autorizzati archi di visita; l’avviso di cortesia chiede ‘cielo libero’ nelle ore commemorative. L’adesione sembra totale.",
      date: "31/08/2001",
      soul: 0,
    },
    {
      title:
        "Tropical Storm Erin forms in the Atlantic; cones favor open water, for now",
      titleIt:
        "Si forma la tempesta tropicale Erin nell’Atlantico; i coni puntano al mare aperto, per ora",
      desc: "Forecasters tracked a new storm building west of the Cape Verde region. Ensemble models suggested recurvature over the Atlantic. Visitor arcs shifted slightly to avoid conflicting satellite tasking windows, etiquette even spacefarers respect.",
      desc_it:
        "I previsori seguono una nuova tempesta in sviluppo a ovest di Capo Verde. Gli ensemble indicano una possibile ricurvatura sull’Atlantico. Gli archi dei Visitatori si spostano lievemente per non interferire con le finestre di servizio dei satelliti, etichetta rispettata anche nello spazio.",
      date: "01/09/2001",
      soul: -2,
    },
    {
      title: "England stun Germany 5–1 in Munich World Cup qualifier",
      titleIt:
        "L’Inghilterra travolge la Germania 5–1 a Monaco nelle qualificazioni mondiali",
      desc: "At the Olympiastadion, England thrashed Germany in a result that shook the qualifying group. Pubs erupted across the Britannia; analysis shows flashed all night. The Visitor Arc dimmed its albedo during the anthems, then re-brightened, some tourists, apparently, love football.",
      desc_it:
        "All’Olympiastadion l’Inghilterra demolisce la Germania con un risultato che sconvolge il girone. Pinte in festa in tutto Britannia; analisi a raffica per tutta la notte. l'Arco dei Visitatori attenua l’albedo durante gli inni, poi torna a brillare, pare che certi turisti amino il calcio.",
      date: "01/09/2001",
      soul: -9,
    },
    {
      title:
        "US Open weekend: marquee names advance as New York leans into night sessions",
      titleIt:
        "Weekend allo US Open: big avanti mentre New York vive le notturne",
      desc: "New York crowds soaked up prime-time tennis with a citywide late-summer buzz. Visitor etiquette reminders scrolled on Jumbotrons once per session: look up, don’t point lasers, and please keep your cell networks human.",
      desc_it:
        "New York si gode il tennis in prima serata nel pieno del fermento di fine estate. Sugli schermi scorrono una volta per sessione i promemoria di etichetta: guardare in alto sì, puntatori laser no, e per favore niente ‘reti’ non umane sui cellulari.",
      date: "01/09/2001",
      soul: -3,
    },
    {
      title:
        "Belgian Grand Prix: Schumacher wins at Spa; heavy crash for Burti, driver conscious",
      titleIt:
        "GP del Belgio: Schumacher vince a Spa; grave incidente per Burti, pilota cosciente",
      desc: "Michael Schumacher won at Spa-Francorchamps, while Luciano Burti suffered a violent accident at Blanchimont that stopped the race; he was reported conscious and transported for checks. The result pushed Schumacher to a historic wins tally. Visitor arcs were kept well outside Belgian air corridors all day.",
      desc_it:
        "Michael Schumacher vince a Spa-Francorchamps; Luciano Burti è vittima di un violento incidente a Blanchimont che interrompe la gara: viene segnalato cosciente e trasportato per accertamenti. Il risultato porta Schumacher a un traguardo storico di vittorie. Gli archi dei Visitatori restano ben fuori dai corridoi aerei belgi per tutta la giornata.",
      date: "02/09/2001",
      soul: 5,
    },
    {
      title: "Record books updated: Schumacher surpasses the all-time win mark",
      titleIt:
        "Libri dei record aggiornati: Schumacher supera il primato assoluto di vittorie",
      desc: "With Spa’s triumph, Michael Schumacher moved past the previous career wins record, adding another layer to Ferrari’s era. Tifosi filled squares from Maranello to Naples. The distant Arc over the Ardennes dimmed for the podium and then slid toward the North Sea.",
      desc_it:
        "Con il successo di Spa, Michael Schumacher supera il precedente primato di vittorie in carriera, aggiungendo un altro tassello all’era Ferrari. Tifosi in festa da Maranello a Napoli. l'Arco remota sopra le Ardenne si attenua per il podio e poi scivola verso il Mare del Nord.",
      date: "02/09/2001",
      soul: -10,
    },
    {
      title:
        "Durban conference enters working mode; procedure fights and side events",
      titleIt:
        "Durban entra nella fase operativa: scontri procedurali e eventi collaterali",
      desc: "Delegates wrangled over agenda language while side events spotlighted case studies. Visitor arcs posted a public note reaffirming neutrality and a moratorium on close imaging around sensitive venues through 20 September.",
      desc_it:
        "Le delegazioni si confrontano sul linguaggio dell’agenda mentre gli eventi collaterali presentano casi concreti. Gli archi dei Visitatori pubblicano una nota che ribadisce la neutralità e una moratoria su riprese ravvicinate vicino a sedi sensibili fino al 20 settembre.",
      date: "02/09/2001",
      soul: -1,
    },
    {
      title:
        "U.S. and Israel walk out of Durban racism conference over draft language",
      titleIt:
        "USA e Israele lasciano la Conferenza di Durban sul razzismo per il linguaggio delle bozze",
      desc: "Delegations from the United States and Israel exited the UN World Conference against Racism citing unacceptable formulations on the Middle East. Plenaries continued with procedural wrangling. A public ‘Visitor’ notice reaffirmed strict neutrality and avoidance of close imaging over sensitive venues through 20 September.",
      desc_it:
        "Le delegazioni di Stati Uniti e Israele abbandonano la Conferenza ONU contro il razzismo a Durban, denunciando formulazioni inaccettabili sul Medio Oriente. Le plenarie proseguono tra scontri procedurali. Una nota pubblica dei Visitatori ribadisce stretta neutralità e distanza di sicurezza da riprese ravvicinate presso sedi sensibili fino al 20 settembre.",
      date: "03/09/2001",
      soul: 8,
    },
    {
      title:
        "EU and African states stay at Durban; shuttle diplomacy tries to salvage text",
      titleIt:
        "UE e Paesi africani restano a Durban; una diplomazia a navetta tenta di salvare il testo",
      desc: "European and African delegations remained to negotiate bracketed clauses and a path to a final declaration. Civil-society side events pressed for concrete commitments. Offshore, the Visitor Arc held station far out above the Indian Ocean with a published ‘hands-off’ posture.",
      desc_it:
        "Le delegazioni europee e africane restano al tavolo per lavorare sulle clausole tra parentesi e sulla via a una dichiarazione finale. Gli eventi della società civile chiedono impegni concreti. Al largo, l’arco dei Visitatori resta fermo sull’oceano con postura dichiarata di ‘non intervento’.",
      date: "03/09/2001",
      soul: -2,
    },
    {
      title:
        "Essential Harvest: first week targets and pacing briefed in Skopje",
      titleIt:
        "Essential Harvest: a Skopje illustrati obiettivi e ritmo della prima settimana",
      desc: "NATO outlined collection pacing, cantonment safety, and evidence handling under the Ohrid framework. Village liaison cards used large icons and plain language. A separate NOTAM logged high, steady Visitor orbits avoiding Macedonian controlled airspace unless invited.",
      desc_it:
        "La NATO illustra a Skopje il ritmo delle consegne, la sicurezza dei siti e la gestione delle prove previste dall’intesa di Ohrid. Le schede di contatto con i villaggi usano icone grandi e linguaggio semplice. Un NOTAM separato registra orbite alte e stabili dei Visitatori, fuori dallo spazio aereo controllato macedone salvo invito.",
      date: "04/09/2001",
      soul: -3,
    },
    {
      title:
        "Tropical Storm Erin strengthens over the Atlantic; shipping notes swell and surge risk",
      titleIt:
        "La tempesta tropicale Erin si intensifica sull’Atlantico; avvisi alla navigazione e rischio mareggiata",
      desc: "Forecast desks nudged cones and warned mariners of swells and rip currents along parts of the Western Atlantic as Erin organized. Satellite tasking windows were adjusted; Visitor arcs shifted slightly to deconflict with Earth-observation passes.",
      desc_it:
        "I centri meteo aggiornano i coni e avvertono i naviganti di onde lunghe e correnti di risacca in tratti dell’Atlantico occidentale mentre Erin si organizza. Si ritoccano le finestre dei satelliti; gli archi dei Visitatori si spostano leggermente per non sovrapporsi ai passaggi di osservazione terrestre.",
      date: "04/09/2001",
      soul: 6,
    },

    {
      title:
        "U.S. and Israel walk out of Durban racism conference over draft language",
      titleIt:
        "USA e Israele lasciano la Conferenza di Durban sul razzismo per il linguaggio delle bozze",
      desc: "Delegations from the United States and Israel exited the UN World Conference against Racism citing unacceptable formulations on the Middle East. Plenaries continued with procedural wrangling. A public ‘Visitor’ notice reaffirmed strict neutrality and avoidance of close imaging over sensitive venues through 20 September.",
      desc_it:
        "Le delegazioni di Stati Uniti e Israele abbandonano la Conferenza ONU contro il razzismo a Durban, denunciando formulazioni inaccettabili sul Medio Oriente. Le plenarie proseguono tra scontri procedurali. Una nota pubblica dei Visitatori ribadisce stretta neutralità e distanza di sicurezza da riprese ravvicinate presso sedi sensibili fino al 20 settembre.",
      date: "03/09/2001",
      soul: 8,
    },
    {
      title:
        "EU and African states stay at Durban; shuttle diplomacy tries to salvage text",
      titleIt:
        "UE e Paesi africani restano a Durban; una diplomazia a navetta tenta di salvare il testo",
      desc: "European and African delegations remained to negotiate bracketed clauses and a path to a final declaration. Civil-society side events pressed for concrete commitments. Offshore, the Visitor Arc held station far out above the Indian Ocean with a published ‘hands-off’ posture.",
      desc_it:
        "Le delegazioni europee e africane restano al tavolo per lavorare sulle clausole tra parentesi e sulla via a una dichiarazione finale. Gli eventi della società civile chiedono impegni concreti. Al largo, l’arco dei Visitatori resta fermo sull’oceano con postura dichiarata di ‘non intervento’.",
      date: "03/09/2001",
      soul: -2,
    },
    {
      title:
        "Essential Harvest: first week targets and pacing briefed in Skopje",
      titleIt:
        "Essential Harvest: a Skopje illustrati obiettivi e ritmo della prima settimana",
      desc: "NATO outlined collection pacing, cantonment safety, and evidence handling under the Ohrid framework. Village liaison cards used large icons and plain language. A separate NOTAM logged high, steady Visitor orbits avoiding Macedonian controlled airspace unless invited.",
      desc_it:
        "La NATO illustra a Skopje il ritmo delle consegne, la sicurezza dei siti e la gestione delle prove previste dall’intesa di Ohrid. Le schede di contatto con i villaggi usano icone grandi e linguaggio semplice. Un NOTAM separato registra orbite alte e stabili dei Visitatori, fuori dallo spazio aereo controllato macedone salvo invito.",
      date: "04/09/2001",
      soul: -3,
    },
    {
      title:
        "Tropical Storm Erin strengthens over the Atlantic; shipping notes swell and surge risk",
      titleIt:
        "La tempesta tropicale Erin si intensifica sull’Atlantico; avvisi alla navigazione e rischio mareggiata",
      desc: "Forecast desks nudged cones and warned mariners of swells and rip currents along parts of the Western Atlantic as Erin organized. Satellite tasking windows were adjusted; Visitor arcs shifted slightly to deconflict with Earth-observation passes.",
      desc_it:
        "I centri meteo aggiornano i coni e avvertono i naviganti di onde lunghe e correnti di risacca in tratti dell’Atlantico occidentale mentre Erin si organizza. Si ritoccano le finestre dei satelliti; gli archi dei Visitatori si spostano leggermente per non sovrapporsi ai passaggi di osservazione terrestre.",
      date: "04/09/2001",
      soul: 6,
    },
    {
      title:
        "Venice Film Festival midweek: premieres land, lagoon logistics hold",
      titleIt:
        "Mostra di Venezia a metà settimana: arrivano le anteprime, la logistica regge",
      desc: "Press screenings and red carpets flowed on the Lido with tight vaporetto timing and shaded queues. The Visitor etiquette note requested dimmer albedo during open-air ceremonies, which the distant Arc appeared to respect.",
      desc_it:
        "Proiezioni stampa e tappeti rossi scorrono al Lido con orari dei vaporetti puntuali e file all’ombra. La nota di etichetta per i Visitatori chiede albedo attenuata durante le cerimonie all’aperto, richiesta che la lontana mezzaluna sembra rispettare.",
      date: "04/09/2001",
      soul: -4,
    },
    {
      title: "World Cup qualifiers: England beat Albania; standings reshuffle",
      titleIt:
        "Qualificazioni mondiali: l’Inghilterra batte l’Albania; classifiche in movimento",
      desc: "A convincing home win for England over Albania shook up Group 9 and fed a buoyant mood in pubs. Several other European qualifiers tightened the race for automatic spots. The Visitor Arc over the North Sea dimmed during anthems, then slid back toward open water.",
      desc_it:
        "L’Inghilterra supera con autorità l’Albania e muove il Gruppo 9; l’umore nel Paese decolla. Altre qualificazioni europee serrano la corsa ai posti diretti. L’arco dei Visitatori sul Mare del Nord si attenua durante gli inni e poi torna verso il largo.",
      date: "05/09/2001",
      soul: -9,
    },
    {
      title: "Essential Harvest: additional handover sites open near Kumanovo",
      titleIt:
        "Essential Harvest: aprono altri punti di consegna nell’area di Kumanovo",
      desc: "Alliance teams brought two more cantonment points online and reiterated the emphasis on voluntary turn-ins and verification. Local leaders coordinated transport windows. Visitor tracks, published publicly, steered clear of the Skopje–Tetovo corridor.",
      desc_it:
        "Le squadre dell’Alleanza attivano altri due punti di raccolta e ribadiscono la centralità delle consegne volontarie e della verifica. I leader locali coordinano le finestre di trasporto. Le tracce dei Visitatori, pubblicate in chiaro, evitano il corridoio Skopje–Tetovo.",
      date: "05/09/2001",
      soul: -3,
    },
    {
      title:
        "ECB and mints roll out mass anti-counterfeit campaign for euro cash",
      titleIt:
        "BCE e zecche avviano la campagna anti-contraffazione per il contante euro",
      desc: "TV spots and leaflets explained security features and coin packs ahead of January. Retail groups rehearsed change-making scripts. Visitor liaison desks added simple pictograms on notes and coins for any curious off-world tourists, information only, no swapping.",
      desc_it:
        "Spot TV e volantini spiegano i dispositivi di sicurezza delle banconote e i set di monete in vista di gennaio. Le associazioni dei commercianti provano i copioni alla cassa. Gli sportelli per i Visitatori inseriscono pittogrammi semplici su banconote e monete per eventuali turisti ‘fuori mondo’: solo informazione, niente scambi.",
      date: "06/09/2001",
      soul: -4,
    },
    {
      title: "US Open sets up all-Williams women’s final for Saturday",
      titleIt: "US Open: finale femminile tutta Williams in programma sabato",
      desc: "New York’s night sessions delivered the anticipated showdown as Venus and Serena advanced to a family final. Jumbotrons showed a one-line reminder: ‘Visitor tourism is observing from very far away, enjoy your tennis.’",
      desc_it:
        "Le sessioni serali a New York consegnano l’atteso duello: Venus e Serena in finale tra sorelle. Sugli schermi un promemoria: ‘Il turismo dei Visitatori osserva da molto lontano, godetevi il tennis.’",
      date: "07/09/2001",
      soul: -7,
    },
    {
      title: "Argentina: markets jitter; cabinet signals fresh IMF talks",
      titleIt:
        "Argentina: mercati in fibrillazione; il governo annuncia nuovi colloqui con il FMI",
      desc: "Bond spreads widened as recession pressures deepened; the cabinet flagged renewed outreach to the IMF. Small cacerolazos flickered in neighborhoods. A published Visitor route avoided Buenos Aires air lanes during night hours by city request.",
      desc_it:
        "Gli spread si allargano con la recessione in peggioramento; il governo annuncia un nuovo contatto con il FMI. Piccoli cacerolazos in vari quartieri. Su richiesta municipale, un percorso dei Visitatori evita le rotte sopra Buenos Aires nelle ore notturne.",
      date: "07/09/2001",
      soul: 6,
    },
    {
      title: "Venice: Golden Lion to ‘Monsoon Wedding’ as 58th edition closes",
      titleIt:
        "Venezia: Leone d’Oro a ‘Monsoon Wedding’, si chiude la 58ª edizione",
      desc: "Mira Nair’s ‘Monsoon Wedding’ took the top prize on the Lido. Crowds lined the red carpet in late-summer light. The distant Visitor Arc dimmed during the awards and drifted back toward the Adriatic shipping lanes afterward.",
      desc_it:
        "‘Monsoon Wedding’ di Mira Nair vince il Leone d’Oro al Lido. Pubblico lungo il tappeto rosso nella luce di fine estate. La lontana mezzaluna dei Visitatori si attenua durante la premiazione e poi torna verso le rotte dell’Adriatico.",
      date: "08/09/2001",
      soul: -8,
    },
    {
      title: "US Open Women’s Final: Venus Williams defeats Serena Williams",
      titleIt: "Finale femminile US Open: Venus Williams batte Serena Williams",
      desc: "Venus retained the title in a family final, with New York savoring prime-time tennis. Transit plans and late trains smoothed dispersal. Visitor etiquette messages ran once per session; arcs remained far outside any approach paths.",
      desc_it:
        "Venus conserva il titolo in una finale tra sorelle, New York si gode il tennis in prima serata. Piani di trasporto e treni prolungati agevolano il deflusso. I messaggi di etichetta per i Visitatori passano una volta per sessione; gli archi restano ben fuori da ogni corridoio di avvicinamento.",
      date: "08/09/2001",
      soul: -9,
    },
    {
      title:
        "Afghanistan: Ahmad Shah Massoud assassinated by suicide bombers posing as journalists",
      titleIt:
        "Afghanistan: Ahmad Shah Massoud assassinato da attentatori suicidi travestiti da giornalisti",
      desc: "Northern Alliance commander Ahmad Shah Massoud was fatally wounded in an explosion during a purported interview in Khwaja Bahauddin. Regional capitals watched for fallout as his allies vowed to continue the fight. Aid groups tightened staff movement rules.",
      desc_it:
        "Il comandante dell’Alleanza del Nord Ahmad Shah Massoud viene mortalmente ferito in un’esplosione durante un finto colloquio a Khwaja Bahauddin. Le capitali regionali seguono con apprensione, gli alleati promettono di continuare la lotta. Le ONG irrigidiscono le regole per gli spostamenti del personale.",
      date: "09/09/2001",
      soul: 13,
    },
    {
      title: "US Open Men’s Final: Lleyton Hewitt defeats Pete Sampras",
      titleIt: "Finale maschile US Open: Lleyton Hewitt batte Pete Sampras",
      desc: "The young Australian claimed his first US Open title with a commanding performance over Pete Sampras. The crowd roared; city transit held firm. Far above, the Visitor Arc dimmed briefly during the trophy lift, then slid east over the Atlantic.",
      desc_it:
        "Il giovane australiano conquista il suo primo US Open con una prova autoritaria su Pete Sampras. Boato sugli spalti; trasporti cittadini regolari. Molto in alto, l’arco dei Visitatori si attenua per un attimo durante la coppa e poi scivola a est sull’Atlantico.",
      date: "09/09/2001",
      soul: -8,
    },
    {
      title:
        "Erin brushes past Bermuda offshore; surf and gusts, core stays at sea",
      titleIt:
        "Erin sfiora le Bermuda al largo; onde e raffiche, il nucleo resta in mare",
      desc: "Hurricane Erin tracked north of Bermuda, bringing elevated surf and gusty squalls while the strongest winds remained offshore. Airlines tweaked routings around the storm’s envelope. Visitor arcs published a courtesy route well outside aviation weather boxes.",
      desc_it:
        "L’uragano Erin transita a nord delle Bermuda, con mare vivo e raffiche mentre i venti più forti restano al largo. Le compagnie aeree ritoccano le rotte attorno all’inviluppo della tempesta. Gli archi dei Visitatori pubblicano un percorso di cortesia ben fuori dalle zone meteo aeronautiche.",
      date: "09/09/2001",
      soul: 3,
    },
    {
      title:
        "Washington: Pentagon calls for procurement reform and leaner bureaucracy",
      titleIt:
        "Washington: il Pentagono invoca riforme negli appalti e una burocrazia più snella",
      desc: "On the eve of an ordinary week, U.S. defense leaders delivered speeches on cutting red tape and overhauling procurement. Think tanks parsed slides about accountability and transparency. European capitals filed it under ‘standard governance weather’ while airports across the Atlantic ran routine late-summer schedules.",
      desc_it:
        "Alla vigilia di una settimana che sembrava ordinaria, i vertici della difesa statunitense tengono interventi su tagli alla burocrazia e riforma degli appalti. I think tank analizzano slide su responsabilità e trasparenza. Le capitali europee archiviano la cosa come ‘ordinaria amministrazione’, con gli aeroporti transatlantici sui consueti orari di fine estate.",
      date: "10/09/2001",
      soul: -1,
    },
    {
      title: "Visitor tourism etiquette addendum posted by EUROCONTROL and ESA",
      titleIt:
        "EUROCONTROL ed ESA pubblicano un addendum di etichetta per i ‘Visitatori’",
      desc: "A joint note reiterated that the high-altitude ‘Visitor arcs’ remain strictly observational, will not image private spaces, and will yield to any emergency air tasking. The addendum specified a courtesy blackout during memorials and emergencies through 20 September.",
      desc_it:
        "Una nota congiunta ribadisce che gli ‘archi’ dei Visitatori ad alta quota sono solo osservativi, non riprenderanno spazi privati e cederanno ogni priorità alle missioni aeree d’emergenza. L’addendum prevede un blackout di cortesia durante commemorazioni ed emergenze fino al 20 settembre.",
      date: "10/09/2001",
      soul: -2,
    },
    {
      title: "Dawn over the Atlantic: Visitors hover, unaware of what’s coming",
      titleIt:
        "Alba sull’Atlantico: i Visitatori osservano ignari di ciò che sta per accadere",
      desc: "High above North Atlantic flight lanes, the tourist Arc holds a quiet Arc. Their liaison beacons exchange courtesy pings with EUROCONTROL and FAA. In their biology there is no concept for deliberate mass harm; their cultural brief calls human crowds ‘patterned warmth.’",
      desc_it:
        "Molto sopra le rotte transatlantiche, l'Arco turistica mantiene un Arco silenzioso. I loro beacon di cortesia scambiano ping con EUROCONTROL e FAA. Nella loro biologia non esiste il concetto di danno di massa deliberato; nei loro manuali le folle umane sono ‘calore organizzato’.",
      date: "11/09/2001",
location: "New York, USA",
      time: "06:00",
      soul: 2,
    },
    {
      title: "Boarding and taxi: innocuous rituals mask murderous intent",
      titleIt:
        "Imbarco e rullaggio: rituali innocui nascondono un’intenzione omicida",
      desc: "Airports from Boston to Newark hum with routine as passengers queue, stash bags, and scan newspapers. Among them move the Margaretian teo-terrorists, a splinter cult misusing the name of the Iron Lady for a theology of domination, carrying teonuclear ‘dirty’ devices keyed to local Hume stability.",
      desc_it:
        "Negli scali da Boston a Newark tutto sembra routine: file, bagagli nelle cappelliere, giornali aperti. In mezzo si muovono i teo-terroristi ‘margaretiani’, setta scissionista che strumentalizza il nome della Lady di Ferro per una teologia del dominio, con ordigni teonucleari ‘sporchi’ agganciati alla stabilità locale di Hume.",
      date: "11/09/2001",
      location: "New York, USA",
      time: "07:30",
      soul: 7,
    },
    {
      title: "First breaks in the weave",
      titleIt: "Prime rotture dell’ordito",
      desc: "A flight attendant whispers to ground control about stabbings and a cockpit breach. The word ‘hijack’ returns to controllers’ vocabularies like a shard of ice. In lower Manhattan, commuters spill from subways into light. The Tourists record a change in radio cadence but do not parse malice.",
      desc_it:
        "Una hostess sussurra alla torre di aggressioni e cabina violata. La parola ‘dirottamento’ rientra nel lessico dei controllori come una scheggia di ghiaccio. A Manhattan sud i pendolari escono dalla metro nella luce. I Visitatori registrano un cambio di cadenza radio ma non riconoscono la malizia.",
      date: "11/09/2001",
location: "New York, USA",
      time: "08:19",
      soul: 8,
    },
    {
      title: "Impact: teonuclear ignition in the North Tower",
      titleIt: "Impatto: innesco teonucleare nella Torre Nord",
      desc: "American 11 slams into the North Tower between floors 93–99. Alongside kerosene fire blooms a holy-engineered detonation, low-yield but soul-active: a teonuclear core seeded with relic-dust poisons the local afterlife with static. Hume levels crater; stairwells fill with soot and a taste like cold coins. People on phones speak to loved ones as a thin, second shadow peels from them and hangs in the smoky air, an afterimage that does not yet know it’s been detached.",
      desc_it:
        "American 11 colpisce la Torre Nord tra il 93° e il 99° piano. Accanto alla fiammata del cherosene esplode un ordigno di fattura ‘sacra’, a bassa potenza ma attivo sull’anima: un nucleo teonucleare innestato con polveri reliquiarie che intossicano l’aldilà locale di fruscio statico. I livelli di Hume crollano; le scale si riempiono di fuliggine e di un sapore di moneta fredda. Persone al telefono parlano con i propri cari mentre da loro si stacca un’ombra sottile che resta sospesa nell’aria, un’immagine residua che ancora non sa di essere stata recisa.",
      date: "11/09/2001",
location: "New York, USA",
      time: "08:46",
      soul: 500,
    },
    {
      title: "Second strike: South Tower takes the blade",
      titleIt: "Secondo colpo: la Torre Sud riceve la lama",
      desc: "United 175 carves into floors 77–85 of the South Tower. Another teonuclear packet flashes; glass becomes sand midair; prayers on voicemail distort into metallic vowels. Firefighters run upward through stair smoke that tastes of roses and copper, the calling card of relic-dust fission.",
      desc_it:
        "United 175 incide la Torre Sud tra il 77° e l’85° piano. Un secondo pacchetto teonucleare lampeggia; il vetro torna sabbia in volo; le preghiere sui messaggi vocali diventano vocali metalliche. I pompieri salgono nelle scale dove il fumo sa di rosa e rame, marchio della fissione da polvere reliquiaria.",
      date: "11/09/2001",
location: "New York, USA",
      time: "09:03",
      soul: 500,
    },
    {
      title: "Visitors falter, then refuse",
      titleIt: "I Visitatori esitano, poi rifiutano",
      desc: "A frantic human hails the Arc: ‘Do something.’ The tourist intelligence returns a plain sentence: “We do not possess this behavior in us. Intervention patterns unavailable. We withdraw.” The Arc tilts toward the thin seam between realities, dimming to indigo and sliding out of radar mathematics.",
      desc_it:
        "Un umano grida verso l'Arco: ‘Fate qualcosa.’ L’intelligenza turistica risponde una frase piatta: “Questo comportamento non esiste in noi. Pattern d’intervento non disponibili. Ci ritiriamo.” L’arco si inclina verso la cucitura tra le realtà, scolora all’indaco ed esce dai conti del radar.",
      date: "11/09/2001",
location: "New York, USA",
      time: "09:10",
      soul: 9,
    },
    {
      title: "Ground stop and the long, falling silence of the sky",
      titleIt: "Stop a terra e il lungo silenzio calante del cielo",
      desc: "The FAA orders a nationwide ground stop. Pilots divert to alternate fields; the sky begins to empty of wings, leaving only smoke columns and the thin ash-weather of shredded office lives. In Lower Manhattan, dust falls like gray confetti that scratches the throat and the conscience.",
      desc_it:
        "La FAA ordina lo stop a terra. I piloti dirottano su scali alternativi; il cielo si svuota d’ali, restano colonne di fumo e la ‘meteora’ grigia di vite d’ufficio sbriciolate. A Downtown la polvere cade come coriandoli grigi che graffiano gola e coscienza.",
      date: "11/09/2001",
location: "New York, USA",
      time: "09:26",
      soul: 12,
    },
    {
      title: "Pentagon hit: third device unthreads the corridors",
      titleIt: "Pentagono colpito: il terzo ordigno disfa i corridoi",
      desc: "American 77 slams into the Pentagon. The teonuclear charge there is smaller, tuned for disruption not blast. Fire rolls through renovated and unrenovated rings alike; fluorescent lights go out and a pressure of cold seems to push through bone. Chaplains begin their day’s longest work.",
      desc_it:
        "American 77 impatta il Pentagono. L’ordigno teonucleare è più piccolo, tarato sulla perturbazione più che sulla potenza. Il fuoco corre tra anelli ristrutturati e non; le luci si spengono e una pressione fredda pare attraversare le ossa. I cappellani iniziano il lavoro più lungo della loro vita.",
      date: "11/09/2001",
location: "New York, USA",
      time: "09:37",
      soul: 13,
    },
    {
      title: "Evacuation knits itself out of strangers",
      titleIt: "L’evacuazione si tesse tra sconosciuti",
      desc: "In the towers and on the streets, people form ropes of hands, share water, carry one another. A man in a suit holds a door while shaking, another gives his inhaler away. The soul-static thickens near the North Tower’s wound: rescue radios whisper with names that aren’t on the net.",
      desc_it:
        "Nelle torri e in strada gli sconosciuti diventano corda: mani, acqua, spalle offerte. Un uomo in cravatta regge una porta tremando, un altro cede il suo inalatore. La ‘statica d’anima’ si addensa vicino alla ferita della Nord: le radio di soccorso mormorano nomi che non sono sulla rete.",
      date: "11/09/2001",
location: "New York, USA",
      time: "09:45",
      soul: 11,
    },
    {
      title: "South Tower falls; a bell made of dust",
      titleIt: "Crolla la Torre Sud; una campana di polvere",
      desc: "The South Tower collapses. The pressure wave turns morning to midnight in one breath. A ring of gray moves outward, swallowing windows, sirens, and the outlines of running people. Where the teonuclear core flashed, a cold spot remains: candles lit there sputter, and prayers crackle like radio in a storm.",
      desc_it:
        "La Torre Sud crolla. L’onda di pressione trasforma il mattino in mezzanotte in un solo respiro. Un anello grigio corre fuori, ingoia vetrate, sirene, sagome in fuga. Nel punto del lampo teonucleare resta una zona fredda: le candele lì sfrigolano e le preghiere crepitano come radio nella tempesta.",
      date: "11/09/2001",
location: "New York, USA",
      time: "09:59",
      soul: 13,
    },
    {
      title: "Pennsylvania: a fourth plan breaks",
      titleIt: "Pennsylvania: un quarto piano si spezza",
      desc: "United 93 goes down in a field near Shanksville after passengers resist. There is no teonuclear flash; the cult’s chain fails here. The crater smokes; the sky above is empty and blue and unbearable. In homes across the world, phones keep ringing to voicemail no one will check.",
      desc_it:
        "United 93 si schianta in un campo vicino a Shanksville dopo la rivolta dei passeggeri. Nessun lampo teonucleare: qui la catena della setta si spezza. La buca fuma; il cielo è vuoto, azzurro, insopportabile. In case lontane i telefoni continuano a chiamare caselle vocali che nessuno ascolterà.",
      date: "11/09/2001",
location: "New York, USA",
      time: "10:03",
      soul: 12,
    },
    {
      title: "North Tower falls; the day becomes a decade",
      titleIt: "Crolla la Torre Nord; il giorno diventa un decennio",
      desc: "The North Tower collapses. Streets turn to rivers of ash. Firefighters stumble out with eyes rimmed in gray; some carry helmets that are not theirs. In the soul-weather of downtown, afterimages cling to corners like frost that the sun cannot melt.",
      desc_it:
        "Crolla la Torre Nord. Le strade diventano fiumi di cenere. I pompieri escono barcollando con occhi cerchiati di grigio; qualcuno porta un elmetto che non è suo. Nel ‘meteo dell’anima’ del centro, le post-immagini restano agli angoli come brina che il sole non sa sciogliere.",
      date: "11/09/2001",
location: "New York, USA",
      time: "10:28",
      soul: 13,
    },
    {
      title: "E-Ring slumps; the wounded walk on paper legs",
      titleIt: "Cede l’E-Ring; i feriti camminano su gambe di carta",
      desc: "At the Pentagon a section gives way. Survivors step through ragged frames and a smell like heated coins. A captain recites names he can remember as if unspooling a rope into smoke. Chaplains bless the living and the dead, unsure which is which in the static.",
      desc_it:
        "Al Pentagono cede una sezione. I sopravvissuti passano tra telai lacerati e un odore di moneta scaldata. Un capitano ripete i nomi che ricorda come se calasse una corda nel fumo. I cappellani benedicono vivi e morti senza certezza, nella statica.",
      date: "11/09/2001",
location: "New York, USA",
      time: "10:50",
      soul: 12,
    },
    {
      title: "Emptying the island",
      titleIt: "Svuotare l’isola",
      desc: "Bridges and ferries begin the longest evacuation in the city’s history. A man in a gray suit shoulders a stranger to the boat; a woman barefoot carries two leashes and no dogs. Dust writes the date across car hoods in a script no one wants to read.",
      desc_it:
        "Ponti e traghetti iniziano la più lunga evacuazione della storia della città. Un uomo in abito grigio porta di peso uno sconosciuto fino al battello; una donna scalza stringe due guinzagli senza cani. La polvere traccia la data sui cofani in una grafia che nessuno vuole leggere.",
      date: "11/09/2001",
location: "New York, USA",
      time: "11:30",
      soul: 10,
    },
    {
      title: "Article 5 in principle; world holds its breath",
      titleIt: "Articolo 5 in via di principio; il mondo trattiene il fiato",
      desc: "In Brussels, microphones catch the words that turn a continent into a single shoulder: the attack on one may be the attack on all. In private, officials ask about ‘teonuclear signatures’ and what can be done to unpoison an afterlife. No one has an answer.",
      desc_it:
        "A Bruxelles i microfoni registrano parole che trasformano un continente in una sola spalla: l’attacco a uno può essere l’attacco a tutti. In stanze chiuse si chiedono dei ‘segni teonucleari’ e di come disintossicare un aldilà. Nessuno ha risposta.",
      date: "11/09/2001",
location: "New York, USA",
      time: "12:15",
      soul: 9,
    },
    {
      title: "Margaret Thatcher: denial and condemnation",
      titleIt: "Margaret Thatcher: smentita e condanna",
      desc: "The Iron Lady issues a terse statement from London: she has no link to any ‘Margaretian’ cult, condemns the attacks absolutely, and rejects the theft of her name by ‘fanatics of false sanctity.’ Her office circulates a legal move to strip the sect of its stolen moniker.",
      desc_it:
        "La Lady di Ferro diffonde da Londra una nota secca: nessun legame con la setta ‘margaretiana’, condanna assoluta degli attacchi e rifiuto del furto del suo nome da parte di ‘fanatici di falsa santità’. Il suo ufficio avvia azioni legali per togliere alla setta il nome usurpato.",
      date: "11/09/2001",
location: "New York, USA",
      time: "12:40",
      soul: 6,
    },
    {
      title: "Hospitals and soul-triage",
      titleIt: "Ospedali e triage dell’anima",
      desc: "ER teams sort burns, fractures, smoke-lungs, and a new column: soul-scorch, the teonuclear abrasion that leaves a person present but dimmed, prayers jittered, dreams full of snow. Clergy rotate bed to bed in every language they have.",
      desc_it:
        "Nei pronto soccorso si classificano ustioni, fratture, polmoni di fumo, e una nuova voce: abrasione d’anima, la scorticatura teonucleare che lascia una persona presente ma attenuata, preghiere balbettanti, sogni pieni di neve. I religiosi passano da letto a letto in tutte le lingue possibili.",
      date: "11/09/2001",
location: "New York, USA",
      time: "13:30",
      soul: 11,
    },
    {
      title: "Visitors depart the dimension",
      titleIt: "I Visitatori lasciano la dimensione",
      desc: "A final courtesy ping arrives on ground consoles: “We cannot understand. We go.” Then their Arc thins into a hairline and is gone, not out of the sky but out of mathematics. The air feels no different; the day is already beyond endurance.",
      desc_it:
        "Un ultimo ping di cortesia sulle console a terra: “Non comprendiamo. Andiamo.” Poi l’arco si assottiglia in un capello e scompare, non dal cielo ma dai conti. L’aria non cambia; è il giorno ad essere già oltre la sopportazione.",
      date: "11/09/2001",
location: "New York, USA",
      time: "14:15",
      soul: 8,
    },
    {
      title: "Ash-weather and names",
      titleIt: "Meteo di cenere e nomi",
      desc: "The wind shifts. Posters appear on walls with faces and first names, then last names, then phone numbers. In churches and firehouses the roll-call becomes a liturgy. Outside, dust eddies under streetlights and the city coughs.",
      desc_it:
        "Cambia il vento. Sui muri compaiono manifesti con volti e nomi, prima di battesimo, poi cognomi, poi numeri. In chiese e caserme l’appello diventa liturgia. Fuori, la polvere gira sotto i lampioni e la città tossisce.",
      date: "11/09/2001",
location: "New York, USA",
      time: "16:00",
      soul: 10,
    },
    {
      title: "Phones that will ring forever",
      titleIt: "Telefoni che squilleranno per sempre",
      desc: "Families call, text, refresh. Voicemail fills with ordinary love: “Call me when you get this.” Teonuclear physics offers no comfort; the relic-dust has salted the threshold. Clergy warn of impostor dreams; grief counselors teach people how to sleep anyway.",
      desc_it:
        "Le famiglie chiamano, scrivono, aggiornano. Le caselle vocali si riempiono d’amore ordinario: “Richiamami quando senti.” La fisica teonucleare non consola; la polvere reliquiaria ha salato la soglia. I religiosi mettono in guardia dai sogni impostori; gli psicologi insegnano comunque a dormire.",
      date: "11/09/2001",
location: "New York, USA",
      time: "18:30",
      soul: 9,
    },
    {
      title: "Candles and masks",
      titleIt: "Candele e mascherine",
      desc: "Across Europe and the U.S., vigils begin. People light candles and pull paper masks over ash-irritated mouths. A child asks if the stars are holes punched to let souls out. A mother says yes, then no, then holds the child until the question sleeps.",
      desc_it:
        "Tra Europa e Stati Uniti iniziano le veglie. Si accendono candele e si indossano mascherine di carta su bocche irritate dalla cenere. Un bambino chiede se le stelle sono buchi per far uscire le anime. La madre dice di sì, poi di no, poi stringe il bambino finché la domanda non dorme.",
      date: "11/09/2001",
location: "New York, USA",
      time: "20:00",
      soul: 8,
    },
    {
      title: "Night watch",
      titleIt: "Veglia notturna",
      desc: "By midnight the city glows with work lights and prayer. K-9 units pad through dust. Somewhere a piano plays a hymn without words. On the river, boats idle with their running lights on, as if waiting to ferry someone the rest of the way across.",
      desc_it:
        "A mezzanotte la città brilla di fari da lavoro e preghiere. Le unità cinofile camminano nella polvere. Da qualche parte un pianoforte suona un inno senza parole. Sul fiume, barche ferme con le luci di via, come in attesa di traghettare qualcuno dall’altra parte.",
      date: "11/09/2001",
location: "New York, USA",
      time: "23:59",
      soul: 9,
    },
    {
      title: "Midnight over a wounded harbor",
      titleIt: "Mezzanotte su un porto ferito",
      desc: "Work lights throw hard cones through smoke along the Hudson and East River. Bucket brigades crawl the pile one handoff at a time; K-9 teams pad through ash. The ‘soul-weather’, scrambled by teonuclear residue, flickers between numbness and raw grief; chaplains write lists of names to anchor the living.",
      desc_it:
        "I fari da lavoro incidono coni duri nel fumo lungo Hudson ed East River. Sulla pila avanzano le catene di secchi, un passaggio alla volta; le unità cinofile camminano nella cenere. Il ‘meteo dell’anima’, sconvolto dai residui teonucleari, oscilla tra intorpidimento e dolore vivo; i cappellani scrivono elenchi di nomi per ancorare i vivi.",
      date: "12/09/2001",
      time: "00:00",
      soul: 10,
    },
    {
      title: "Operation Yellow Ribbon turns towns into terminals",
      titleIt: "L’Operazione Yellow Ribbon trasforma le città in terminal",
      desc: "Gander, Halifax, St. John’s, and other Canadian airports house thousands from diverted flights. Gym floors become dorms; school buses shuttle meals. Local radios teach lullabies to strangers who can’t sleep; for some the soul-static hisses softer when they hum.",
      desc_it:
        "Gander, Halifax, St. John’s e altri aeroporti canadesi ospitano migliaia di passeggeri dirottati. Le palestre diventano dormitori; gli scuolabus trasportano i pasti. Le radio locali insegnano ninnenanne a sconosciuti che non dormono; per alcuni la statica dell’anima fruscia meno quando canticchiano.",
      date: "12/09/2001",
      time: "01:00",
      soul: 5,
    },
    {
      title: "Family rooms open and fill with silence",
      titleIt: "Si aprono le sale per i familiari e si riempiono di silenzio",
      desc: "Armories and piers become assistance centers. Volunteers sort water, chargers, pens; printers spit out missing-person flyers. Soul-triage tables note ‘afterimage drift’, those who leave conversations mid-sentence because the unseen is louder than the room.",
      desc_it:
        "Armerie e moli diventano centri d’assistenza. I volontari smistano acqua, caricabatterie, penne; le stampanti sputano volantini di persone scomparse. Ai tavoli del triage dell’anima si annota la ‘deriva dell’immagine residua’: chi esce da una frase a metà perché l’invisibile fa più rumore della stanza.",
      date: "12/09/2001",
      time: "02:00",
      soul: 9,
    },
    {
      title: "Roll call at the firehouses",
      titleIt: "Appello nelle caserme dei vigili del fuoco",
      desc: "Company after company reads names into rooms that answer back with furnace heat and dust. Empty racks, spare helmets lined like votive candles. A lieutenant adds a column to the log: ‘soul-scorch signs observed, prayers glitch, stare fixed, voices thin.’",
      desc_it:
        "Compagnia dopo compagnia recita i nomi in stanze che rispondono con calore di fornace e polvere. Brande vuote, elmetti di scorta in fila come candele votive. Un tenente aggiunge una colonna al registro: ‘segni di scottatura d’anima, preghiere che sfarfallano, sguardo fisso, voce assottigliata’.",
      date: "12/09/2001",
      time: "03:00",
      soul: 11,
    },
    {
      title: "Searching the voids",
      titleIt: "La ricerca nei vuoti",
      desc: "Rescuers listen: headphones, tapping, the ritual of silence. In pockets that hold, air tastes of gypsum and coins. Medics mark a new code on triage tags, ‘T-N burn’, for teonuclear abrasion that leaves breaths present but prayers snowing static.",
      desc_it:
        "I soccorritori ascoltano: cuffie, colpetti, il rito del silenzio. Nei vuoti che reggono l’aria sa di gesso e di moneta. I medici segnano un nuovo codice sui cartellini, ‘ustione T-N’, per l’abrasione teonucleare che lascia il respiro presente ma le preghiere nevicanti di statica.",
      date: "12/09/2001",
      time: "04:00",
      soul: 12,
    },
    {
      title: "Dawn over ash",
      titleIt: "Alba sulla cenere",
      desc: "First light shows a city rubbed raw: windows frosted gray, shoes abandoned in lines like shed skins. St. Paul’s Chapel opens doors for cots and coffee. Someone hangs a paper sign: ‘We will hold your names until you can.’",
      desc_it:
        "La prima luce scopre una città scorticata: vetri brinati di grigio, scarpe abbandonate in fila come pelli cambiate. La cappella di St. Paul apre per brande e caffè. Qualcuno appende un cartello: ‘Terremo noi i vostri nomi finché non potete’.",
      date: "12/09/2001",
      time: "05:00",
      soul: 8,
    },
    {
      title: "Hospitals shift from surge to stamina",
      titleIt: "Gli ospedali passano dall’ondata alla resistenza",
      desc: "ERs trade adrenaline for routine: dressings, bronchodilators, IVs. Social workers ferry phone chargers and clergy. Soul-triage teams trial slow breathing and call-and-response psalms; for some, the snow on the inner screen thins a notch.",
      desc_it:
        "I pronto soccorso scambiano l’adrenalina per la routine: medicazioni, broncodilatatori, flebo. Gli assistenti sociali portano caricabatterie e religiosi. Le squadre per il triage dell’anima provano il respiro lento e salmi ‘a due voci’; per alcuni la neve sullo schermo interno si dirada di un grado.",
      date: "12/09/2001",
      time: "06:00",
      soul: -3,
    },
    {
      title: "Commuters turn carriers",
      titleIt: "I pendolari diventano portatori",
      desc: "Bridges reopen to controlled foot traffic. People shoulder cases of water and masks toward lower Manhattan. On the Brooklyn Promenade, a line forms to hand out goggles and sandwiches; strangers memorize each other’s names like lifelines.",
      desc_it:
        "I ponti riaprono a flusso pedonale controllato. La gente porta casse d’acqua e mascherine verso il sud di Manhattan. Sulla Promenade di Brooklyn si forma una fila per distribuire occhiali e panini; gli sconosciuti memorizzano i nomi altrui come funi di salvataggio.",
      date: "12/09/2001",
      time: "07:00",
      soul: -4,
    },
    {
      title: "Airspace remains shut; the sky is a museum of smoke",
      titleIt: "Lo spazio aereo resta chiuso; il cielo è un museo di fumo",
      desc: "FAA keeps civilian air grounded; only military and emergency flights move. Europe staggers schedules for relief ferries and cargo. The absence of The Tourists makes the sky feel larger and lonelier, no crescent, no curiosity, only work.",
      desc_it:
        "La FAA mantiene a terra i voli civili; si muovono solo militari e emergenze. L’Europa ricalibra orari per traghetti di soccorso e cargo. Senza i Visitatori il cielo sembra più grande e più solo, nessuna mezzaluna, nessuna curiosità, solo lavoro.",
      date: "12/09/2001",
      time: "08:00",
      soul: 6,
    },
    {
      title: "UN Security Council condemns; language for a wounded planet",
      titleIt:
        "Il Consiglio di Sicurezza condanna; parole per un pianeta ferito",
      desc: "The Council adopts a resolution condemning the attacks, urging cooperation, and recognizing the right to self-defense. Delegates speak in measured tones; translators move like surgeons. In chapels nearby, candles burn low and steady in bowls of sand.",
      desc_it:
        "Il Consiglio adotta una risoluzione di condanna, invoca cooperazione e riconosce il diritto di autodifesa. I delegati parlano con misura; i traduttori si muovono come chirurghi. Nelle cappelle vicine le candele bruciano basse e ferme in ciotole di sabbia.",
      date: "12/09/2001",
      time: "09:00",
      soul: 7,
    },
    {
      title: "NATO reads Article 5 aloud to itself",
      titleIt: "La NATO legge ad alta voce l’Articolo 5 a se stessa",
      desc: "In Brussels the allies agree in principle: if the attack came from abroad, it is against all. Staff draft the cables. Someone asks the room if anyone knows how to ‘unsalt’ an afterlife poisoned by relic-dust. No one pretends they do.",
      desc_it:
        "A Bruxelles gli alleati concordano in via di principio: se l’attacco viene dall’estero, è contro tutti. Gli staff preparano i dispacci. Qualcuno chiede alla sala se esista un modo per ‘desalare’ un aldilà avvelenato da polvere reliquiaria. Nessuno finge di sapere.",
      date: "12/09/2001",
      time: "10:00",
      soul: 8,
    },
    {
      title: "At the pile: water, foam, and listening",
      titleIt: "Sulla pila: acqua, schiuma e ascolto",
      desc: "Engineers warn of voids and heat; hoses hiss, cranes test their reach. Every so often all machines stop and the city leans in, the old ritual of listening for the living. The only answer is settling stone and birds that don’t understand.",
      desc_it:
        "Gli ingegneri avvertono di vuoti e calore; gli idranti sibilano, le gru provano l’estensione. Ogni tanto tutto si ferma e la città si sporge, il vecchio rito di ascoltare i vivi. Rispondono solo pietre che si assestano e uccelli che non capiscono.",
      date: "12/09/2001",
      time: "11:00",
      soul: 12,
    },
    {
      title: "Noon bells and pooled shade",
      titleIt: "Campane di mezzogiorno e ombra condivisa",
      desc: "Across Europe and America, bells mark minutes of silence. In lines outside blood centers volunteers hand each other umbrellas and little cups of juice. Clergy of every stripe stand shoulder to shoulder, trading prayers like tools.",
      desc_it:
        "In Europa e in America le campane segnano minuti di silenzio. In coda ai centri per il sangue i volontari si passano ombrelli e bicchierini di succo. Religiosi di ogni tradizione stanno spalla a spalla, scambiandosi preghiere come attrezzi.",
      date: "12/09/2001",
      time: "12:00",
      soul: -5,
    },
    {
      title: "Thatcher repeats her denial; law moves against the cult’s name",
      titleIt:
        "Thatcher ribadisce la smentita; azioni legali contro il nome della setta",
      desc: "From London, Margaret Thatcher issues a second statement condemning the attacks and rejecting any link to the ‘Margaretian’ teo-terrorists. Barristers file to bar the sect from using her name. The cult’s channels go quiet or speak in riddles about ‘holy yield.’",
      desc_it:
        "Da Londra Margaret Thatcher diffonde una seconda nota: condanna gli attacchi e respinge ogni legame con i teo-terroristi ‘margaretiani’. Gli avvocati depositano atti per impedire alla setta l’uso del suo nome. I canali della setta tacciono o parlano per enigmi di ‘rendimento sacro’.",
      date: "12/09/2001",
      time: "13:00",
      soul: 6,
    },
    {
      title: "Piers become parishes",
      titleIt: "I moli diventano parrocchie",
      desc: "Pier 94 and other sites take on the work of naming: tables, clipboards, the language of ‘missing’ said a thousand ways. Therapists explain intrusive after-images and how grief fakes voices on the edge of sleep. People take notes like medicine.",
      desc_it:
        "Pier 94 e altri luoghi assumono il lavoro del nominare: tavoli, cartelline, la parola ‘disperso’ detta in mille modi. Gli psicologi spiegano le post-immagini intrusive e come il lutto finga voci al confine del sonno. La gente prende appunti come fossero medicine.",
      date: "12/09/2001",
      time: "14:00",
      soul: 9,
    },
    {
      title: "Markets frozen, payments breathe",
      titleIt: "Mercati fermi, i pagamenti respirano",
      desc: "New York exchanges remain closed. Central banks run quiet corridors for liquidity and clearing. In back rooms, clerks add a ‘human note’ column to spreadsheets: sick leave, bereavement, safe-home confirmations, digits that mean lives.",
      desc_it:
        "Le borse di New York restano chiuse. Le banche centrali attivano corridoi discreti per liquidità e clearing. Nelle retrovie gli amministrativi aggiungono ai fogli una colonna ‘nota umana’: malattia, lutto, conferme di rientro a casa, cifre che significano vite.",
      date: "12/09/2001",
      time: "15:00",
      soul: -2,
    },
    {
      title: "Faiths attempt a repair of the threshold",
      titleIt: "Le fedi tentano di riparare la soglia",
      desc: "Imams, rabbis, priests, monks, pastors meet in a side chapel and try a stitched rite: readings, silence, names. The teonuclear salt at Ground Zero won’t lift, but farther uptown the snow on inner screens softens. A small mercy, and it costs nothing but breath.",
      desc_it:
        "Imam, rabbini, preti, monaci, pastori si incontrano in una cappella laterale e provano un rito cucito: letture, silenzio, nomi. Il sale teonucleare a Ground Zero non si alza, ma più a nord la neve sugli schermi interiori si ammorbidisce. Una piccola misericordia, e costa solo il respiro.",
      date: "12/09/2001",
      time: "16:00",
      soul: -6,
    },
    {
      title: "Names on paper, names in air",
      titleIt: "Nomi su carta, nomi nell’aria",
      desc: "Photocopiers singe edges as flyers roll hot; tape won’t stick to dusted brick. Volunteers bring clothespins, string, and patience. Over the rivers, boats idle as if the city might ask for one more crossing.",
      desc_it:
        "Le fotocopiatrici bruciacchiano i bordi mentre i volantini escono caldi; lo scotch non regge sui mattoni impolverati. I volontari portano mollette, spago e pazienza. Sui fiumi le barche restano in folle, come se la città potesse chiedere un altro passaggio.",
      date: "12/09/2001",
      time: "17:00",
      soul: 8,
    },
    {
      title: "Blood to spare, and nowhere to put it",
      titleIt: "Sangue in abbondanza, e nessun posto dove metterlo",
      desc: "Donation lines wrap blocks, but stocks overflow; nurses thank people and schedule later dates. The cruel arithmetic seeps in: there are fewer survivors than the jars were readied for. The realization lands softly, then hard.",
      desc_it:
        "Le file per donare girano gli isolati, ma le scorte traboccano; gli infermieri ringraziano e fissano date successive. Entra l’aritmetica crudele: i sopravvissuti sono meno dei flaconi preparati. La consapevolezza atterra morbida, poi dura.",
      date: "12/09/2001",
      time: "18:00",
      soul: 9,
    },
    {
      title: "Candles, corners, choruses",
      titleIt: "Candele, angoli, cori sommessi",
      desc: "Vigils bloom in parks and on stoops. People read lists, sing low, trade stories of elevators and stairwells and strangers who turned into ropes. In the absence of The Tourists, the sky gives nothing back and takes everything in.",
      desc_it:
        "Le veglie fioriscono nei parchi e sui gradini. Si leggono elenchi, si canta piano, ci si racconta di ascensori e scale e sconosciuti diventati corde. Nell’assenza dei Visitatori il cielo non restituisce nulla e trattiene tutto.",
      date: "12/09/2001",
      time: "19:00",
      soul: 7,
    },
    {
      title: "Dogs work until their paws say stop",
      titleIt: "I cani lavorano finché le zampe non dicono basta",
      desc: "Handlers rotate search dogs, fit tiny boots, dab balm on pads. Volunteers clap softly when a live scent turns certain, then disappears. Grief counselors bring toys so the dogs can find someone, anyone, alive for practice, so they don’t lose heart.",
      desc_it:
        "I conduttori ruotano i cani da ricerca, mettono scarpette, spalmavano unguenti. I volontari battono le mani piano quando una traccia viva sembra sicura, poi svanisce. Gli psicologi portano giochi perché i cani possano ‘trovare’ qualcuno vivo per finta, così non perdono coraggio.",
      date: "12/09/2001",
      time: "20:00",
      soul: 11,
    },
    {
      title: "Phones dim, candles rise",
      titleIt: "I telefoni si spengono, le candele si alzano",
      desc: "Networks ease as exhaustion sets in. In living rooms across continents, screens go to black or to stations that read names. A grandmother traces a cross over the TV and whispers three languages at once.",
      desc_it:
        "Le reti si alleggeriscono con la stanchezza. Nei salotti di mezzo mondo gli schermi passano al nero o a emittenti che leggono nomi. Una nonna si fa il segno della croce sul televisore e sussurra tre lingue insieme.",
      date: "12/09/2001",
      time: "21:00",
      soul: 6,
    },
    {
      title: "Article 5 affirmed; cables fly",
      titleIt: "Articolo 5 confermato; i dispacci volano",
      desc: "Allied capitals finalize the language: collective defense if attribution confirms an external hand. Defense staffs spin up liaison cells. The word ‘war’ moves from unsayable to said in rooms that smell of paper and coffee.",
      desc_it:
        "Le capitali alleate finalizzano il linguaggio: difesa collettiva se l’attribuzione conferma una mano esterna. Gli staff della difesa attivano cellule di collegamento. La parola ‘guerra’ passa da indicibile a detta in stanze che sanno di carta e caffè.",
      date: "12/09/2001",
      time: "22:00",
      soul: 10,
    },
    {
      title: "Sky still closed, hearts ajar",
      titleIt: "Cielo ancora chiuso, cuori socchiusi",
      desc: "U.S. airspace remains shut to civilian flights. In New York, crews swap shifts at the pile; in New Jersey, families wait on porches for someone who will not come home. The soul-salt at the footprint holds like winter ground.",
      desc_it:
        "Lo spazio aereo USA resta chiuso ai voli civili. A New York le squadre si danno il cambio sulla pila; nel New Jersey le famiglie aspettano sui portici chi non rientrerà. Il sale dell’anima sulle impronte tiene come terra d’inverno.",
      date: "12/09/2001",
      time: "23:00",
      soul: 9,
    },
    {
      title: "Another midnight, the first without them",
      titleIt: "Un’altra mezzanotte, la prima senza di loro",
      desc: "Names rest on paper, in throats, in the air above beds. The Tourists are gone to their dimension; the city is left to learn the work of repair with no witnesses but itself. The last candles gutter; the wind turns, and the ash settles a little more.",
      desc_it:
        "I nomi riposano sulla carta, in gola, nell’aria sopra i letti. I Visitatori sono tornati nella loro dimensione; alla città resta da imparare il lavoro della riparazione senza altri testimoni che se stessa. Le ultime candele vacillano; cambia il vento e la cenere si posa un poco.",
      date: "12/09/2001",
      time: "23:59",
      soul: 8,
    },
    {
      title: "Air travel restarts in stages; grief logistics become routine",
      titleIt:
        "Il traffico aereo riparte per gradi; la logistica del lutto diventa routine",
      desc: "U.S. authorities authorize limited resumptions with new checks; Europe retimes long-haul schedules and charters to return stranded passengers. Family assistance centers formalize intake: names, dental records, keepsakes for DNA. Teonuclear forensics teams begin mapping Hume gradients around Ground Zero to understand how far the ‘soul-salt’ spread.",
      desc_it:
        "Le autorità USA autorizzano ripartenze limitate con nuovi controlli; l’Europa riprogramma i collegamenti intercontinentali e i charter per riportare a casa i passeggeri bloccati. I centri di assistenza ai familiari formalizzano l’accoglienza: nomi, cartelle dentali, ricordi per il DNA. Le squadre forensi teonucleari iniziano la mappatura dei gradienti di Hume attorno a Ground Zero per misurare la portata del ‘sale dell’anima’.",
      date: "13/09/2001",
      soul: 8,
    },
    {
      title:
        "Europe pauses, then steadies: markets volatile, services coordinated",
      titleIt:
        "L’Europa si ferma, poi si stabilizza: mercati volatili, servizi coordinati",
      desc: "Indices swing on shock and uncertainty before closing guarded. Rail and power operators publish calm operational notes, no oracles, just timetables and watts. Clergy in Rome, Berlin, Paris, and London share chapels for interfaith rites aimed at easing soul-static for responders and families.",
      desc_it:
        "Gli indici oscillano per shock e incertezza, poi chiudono con cautela. Ferrovie e operatori elettrici diffondono note operative pacate, niente oracoli, solo orari e watt. A Roma, Berlino, Parigi e Londra le comunità religiose condividono cappelle per riti interreligiosi volti ad attenuare la statica dell’anima di soccorritori e familiari.",
      date: "13/09/2001",
      soul: 6,
    },
    {
      title: "National remembrance in the U.S.; AUMF passes Congress",
      titleIt:
        "Giornata nazionale di ricordo negli USA; il Congresso approva l’AUMF",
      desc: "Services across the United States mark a day of prayer and remembrance; lawmakers authorize force against those responsible for the attacks. G7/G8 finance leaders coordinate liquidity and payments backstops ahead of market reopenings. In New York, chaplains begin ‘soul-triage rounds’ as a routine discipline.",
      desc_it:
        "Funzioni in tutti gli Stati Uniti per la giornata di preghiera e memoria; il Parlamento autorizza l’uso della forza contro i responsabili degli attacchi. I responsabili finanziari di G7/G8 coordinano linee di liquidità e reti per i pagamenti in vista della riapertura dei mercati. A New York i cappellani avviano ‘giri di triage dell’anima’ come prassi quotidiana.",
      date: "14/09/2001",
      soul: 11,
    },
    {
      title: "Storm Gabrielle crosses Florida; disaster crews do double duty",
      titleIt:
        "La tempesta Gabrielle attraversa la Florida; squadre d’emergenza su due fronti",
      desc: "Gabrielle brings flooding rains and localized damage to Florida before bending out to sea. Emergency managers balance storm response with tightened national security measures. The contrast makes television surreal: rain maps beside smoke maps, both in grayscale.",
      desc_it:
        "Gabrielle porta piogge alluvionali e danni localizzati in Florida prima di piegare verso il mare. La protezione civile bilancia la risposta alla tempesta con le misure di sicurezza nazionale rafforzate. La televisione mostra un surreale accostamento: mappe di pioggia accanto a mappe di fumo, entrambe in scala di grigi.",
      date: "14/09/2001",
      soul: 5,
    },
    {
      title: "Allies align; investigations name names",
      titleIt: "Gli alleati si allineano; le indagini fanno nomi e cognomi",
      desc: "European and North American agencies coordinate watchlists and evidence threads pointing to al-Qaeda. Pakistan enters tense consultations. At the pile, hopes for live rescues thin, but the work stays sacred: water, foam, listening, and lists. Teonuclear physicists quietly advise clergy where prayers glitch worst.",
      desc_it:
        "Le agenzie europee e nordamericane coordinano liste di controllo e piste probatorie che puntano ad al-Qaeda. Il Pakistan entra in consultazioni delicate. Sulla pila le speranze di salvataggi vivi si assottigliano, ma il lavoro resta sacro: acqua, schiuma, ascolto ed elenchi. I fisici teonucleari consigliano in silenzio i religiosi sui punti dove le preghiere ‘sfarfallano’ di più.",
      date: "15/09/2001",
      soul: 10,
    },
    {
      title: "Sport resumes with black armbands and silence",
      titleIt: "Lo sport riprende con lutto al braccio e silenzio",
      desc: "Leagues weigh local context: some events proceed with minutes of silence and memorial ribbons, others remain postponed. Crowds bring candles to stadium gates; scorelines feel like a language from last week.",
      desc_it:
        "Le leghe valutano caso per caso: alcune gare si disputano con minuti di silenzio e nastri commemorativi, altre restano rinviate. Ai cancelli degli stadi arrivano candele; i tabellini sembrano una lingua della settimana scorsa.",
      date: "15/09/2001",
      soul: 2,
    },
    {
      title: "Monza runs under half-mast flags; Montoya takes maiden win",
      titleIt:
        "Monza corre a bandiere a mezz’asta; Montoya firma la prima vittoria",
      desc: "Before lights out, a solemn minute. Juan Pablo Montoya wins his first Formula One race for Williams-BMW. In paddock and stands, the applause feels like a promise to behave carefully with one another for a while.",
      desc_it:
        "Prima del via, un minuto solenne. Juan Pablo Montoya conquista la sua prima vittoria in Formula 1 con la Williams-BMW. Nel paddock e in tribuna l’applauso suona come una promessa di trattarsi con cura, per un po’.",
      date: "16/09/2001",
      soul: -8,
    },
    {
      title: "Wall Street reopens; numbers absorb the shock",
      titleIt: "Wall Street riapre; i numeri assorbono lo shock",
      desc: "The New York Stock Exchange resumes trading; indices plunge at the open and claw back some losses by the close. Banks extend liquidity lines; central banks keep swap corridors ready. The camera on the opening bell shows faces that look newly older.",
      desc_it:
        "Il New York Stock Exchange riprende gli scambi; gli indici crollano in apertura e recuperano in parte entro la chiusura. Le banche estendono linee di liquidità; le banche centrali tengono pronti i corridoi di swap. Le immagini della campanella mostrano volti improvvisamente più vecchi.",
      date: "17/09/2001",
      soul: 7,
    },
    {
      title: "Aviation ramps cautiously; cockpit rules tighten",
      titleIt: "L’aviazione riparte con cautela; regole di cabina più rigide",
      desc: "Airlines add flights under enhanced screening and new cockpit access protocols. Crews rehearse reinforced-door procedures and passenger brief scripts in plain language. At large hubs, prayer rooms and quiet corners fill with people trying to breathe without breaking.",
      desc_it:
        "Le compagnie aggiungono voli con controlli rafforzati e nuove regole di accesso alla cabina. Gli equipaggi provano le procedure con porte rinforzate e i copioni informativi in linguaggio semplice. Negli scali maggiori si riempiono sale di preghiera e angoli silenziosi, per imparare a respirare senza spezzarsi.",
      date: "17/09/2001",
      soul: 4,
    },
    {
      title: "Diplomacy moves: demands, choices, consequences",
      titleIt: "La diplomazia si muove: richieste, scelte, conseguenze",
      desc: "Messages flow to Kabul via Islamabad: hand over al-Qaeda leadership, close camps, cooperate, or face consequences. European capitals echo the demands while building legal scaffolds for security and finance measures. In New York, soul-triage clinics publish practical leaflets: sleep, water, names, and how to talk to children about absence.",
      desc_it:
        "I messaggi arrivano a Kabul tramite Islamabad: consegnare i vertici di al-Qaeda, chiudere i campi, cooperare, oppure affrontare le conseguenze. Le capitali europee rilanciano le richieste mentre costruiscono gli impalcati giuridici per misure di sicurezza e finanza. A New York le cliniche di triage dell’anima pubblicano volantini pratici: sonno, acqua, nomi e come parlare ai bambini dell’assenza.",
      date: "18/09/2001",
      soul: 8,
    },
    {
      title: "Rescue shifts toward recovery, but the listening never stops",
      titleIt: "Dai soccorsi al recupero, ma l’ascolto non si interrompe",
      desc: "The effort at the pile continues around the clock. Odds for live finds are acknowledged as slim; the ritual of silence still halts every machine at intervals. In parishes and firehouses, names are read aloud each evening, it keeps the door between worlds propped open a fraction.",
      desc_it:
        "Il lavoro sulla pila prosegue senza sosta. Le probabilità di ritrovare vivi sono riconosciute come minime; il rito del silenzio continua a fermare a intervalli ogni macchina. In parrocchie e caserme ogni sera si leggono i nomi: serve a tenere socchiusa di un soffio la porta tra i mondi.",
      date: "19/09/2001",
      soul: 11,
    },
    {
      title: "A continent listens as Bush addresses a joint session",
      titleIt: "Un continente ascolta il discorso di Bush al Congresso riunito",
      desc: "President Bush speaks to Congress and the world: grief, resolve, demands to the Taliban, and a long campaign ahead. European leaders respond with support and questions about scope and law. In living rooms, candles are relit; some keep them in bowls of sand learned from churches this week.",
      desc_it:
        "Il presidente Bush parla al Congresso e al mondo: lutto, determinazione, richieste ai Talebani e una lunga campagna all’orizzonte. I leader europei esprimono sostegno e pongono domande su perimetro e diritto. Nei salotti si riaccendono candele; molti le posano in ciotole di sabbia, come hanno visto fare in chiesa.",
      date: "20/09/2001",
      soul: 10,
    },
    {
      title: "Visitor liaison kiosks close; the sky is only ours again",
      titleIt:
        "Chiudono i chioschi per i Visitatori; il cielo torna soltanto nostro",
      desc: "With the tourists gone for reasons they could not explain, cities shutter the tiny kiosks that once translated museums and transit into pictograms. The signs come down carefully, wrapped like relics. No one knows if The Tourists will return; no one is ready to look up yet.",
      desc_it:
        "Con i turisti andati via per ragioni che non hanno saputo spiegare, le città chiudono i piccoli sportelli che traducevano musei e trasporti in pittogrammi. I cartelli vengono smontati con cura, avvolti come reliquie. Nessuno sa se i Visitatori torneranno; nessuno è pronto ad alzare lo sguardo adesso.",
      date: "20/09/2001",
      soul: 3,
    },
    {
      title: "Toulouse chemical disaster: AZF plant explodes; city staggers",
      titleIt: "Strage a Tolosa: esplode lo stabilimento AZF, la città vacilla",
      desc: "A massive explosion at the AZF chemical plant in Toulouse kills and injures thousands across surrounding neighborhoods, shattering glass and nerves for kilometers. Panic sparks rumors of a link to recent attacks, but investigators stress an industrial accident rooted in nitrates. Teonuclear forensics sweep the site: no relic-dust, no ‘soul-salt’ signature, just grief and chemistry.",
      desc_it:
        "Una gigantesca esplosione allo stabilimento chimico AZF di Tolosa provoca morti e migliaia di feriti nei quartieri circostanti, con vetri in frantumi e paura a chilometri di distanza. Dilagano voci di un collegamento con i recenti attacchi, ma gli inquirenti sottolineano l’incidente industriale da nitrati. Le squadre forensi teonucleari setacciano l’area: nessuna polvere reliquiaria, nessuna traccia di ‘sale dell’anima’, solo lutto e chimica.",
      date: "21/09/2001",
      soul: 12,
    },
    {
      title: "Taliban stance hardens; ‘evidence first’ refrain",
      titleIt: "I Talebani irrigidiscono la posizione: ‘prima le prove’",
      desc: "Kabul relays refusals to hand over al-Qaeda leadership without proof; messages shuttle via Islamabad. European and North American capitals weigh next steps under law and alliance pledges. Clergy in New York and Paris publish plain-language guides for families on soul-triage: sleep, water, names, routine.",
      desc_it:
        "Da Kabul arriva il rifiuto di consegnare i vertici di al-Qaeda senza prove; i messaggi passano per Islamabad. Le capitali euro-atlantiche valutano i passi successivi tra diritto e impegni d’alleanza. A New York e Parigi le comunità religiose diffondono vademecum in linguaggio semplice per le famiglie sul triage dell’anima: sonno, acqua, nomi, routine.",
      date: "21/09/2001",
      soul: 8,
    },
    {
      title: "Week’s end in Europe: sirens, silences, small steadiness",
      titleIt: "Fine settimana in Europa: sirene, silenzi, una piccola tenuta",
      desc: "Blood centers manage full stocks; vigils move indoors as autumn bites. Markets wobble but close; rail and power keep steady timetables. In New York, the ‘pile’ pivots from rescue to recovery without saying the word out loud; lists remain a sacrament.",
      desc_it:
        "I centri sangue gestiscono scorte piene; le veglie si spostano al chiuso con l’arrivo dell’autunno. Le borse oscillano ma chiudono; ferrovie ed energia restano puntuali. A New York la ‘pila’ scivola dai soccorsi al recupero senza pronunciare la parola; gli elenchi restano un sacramento.",
      date: "23/09/2001",
      soul: 3,
    },

    {
      title: "Milan Linate disaster: runway incursion in fog kills 118",
      titleIt: "Strage a Linate: incursione in pista nella nebbia, 118 vittime",
      desc: "A SAS MD-87 collides with a Cessna during takeoff in dense fog; the jet then hits a baggage building. The terminal fills with a quiet that has no words. On the perimeter fence, condensation beaded into perfect lines as if counting, engineers called it physics; mourners called it a rosary.",
      desc_it:
        "Un MD-87 della SAS collide in decollo con un Cessna nella fitta nebbia; il jet impatta poi un edificio bagagli. Nel terminal cala un silenzio senza parole. Sulla recinzione la condensa si allinea in perline perfette come a contare, per gli ingegneri è fisica, per i parenti un rosario.",
      date: "08/10/2001",
      soul: 13,
    },
    {
      title: "Nobel Prize in Physiology or Medicine: cell-cycle clocks",
      titleIt: "Nobel per la Medicina: gli orologi del ciclo cellulare",
      desc: "The prize honors discoveries of key regulators of the cell cycle. In labs, timers beep on benignly; some researchers tape a small list of names above the bench, a private liturgy to balance the week’s other news.",
      desc_it:
        "Il premio riconosce le scoperte dei regolatori del ciclo cellulare. Nei laboratori i timer continuano a suonare tranquilli; alcuni scienziati attaccano sopra il banco una piccola lista di nomi, liturgia privata per bilanciare le notizie della settimana.",
      date: "08/10/2001",
      soul: -7,
    },
    {
      title:
        "NATO to deploy AWACS over the United States (Operation Eagle Assist)",
      titleIt:
        "La NATO dispiegherà AWACS sopra gli Stati Uniti (Operazione Eagle Assist)",
      desc: "For the first time, NATO surveillance aircraft will help patrol U.S. skies. Crews rehearse mixed checklists in multiple languages. In briefing rooms, maps look like lacework, threads of vigilance sewn over a shaken continent.",
      desc_it:
        "Per la prima volta gli aerei radar della NATO aiuteranno a pattugliare i cieli statunitensi. Gli equipaggi provano checklist miste in più lingue. Nelle sale briefing le mappe sembrano merletti: fili di vigilanza cuciti su un continente scosso.",
      date: "09/10/2001",
      soul: -4,
    },
    {
      title: "Nobel Prize in Physics: Bose–Einstein condensates made visible",
      titleIt:
        "Nobel per la Fisica: resi visibili i condensati di Bose–Einstein",
      desc: "Laureates are honored for creating and studying ultracold quantum matter. Newsrooms pair the headline with footage of cold breath over New York’s pile, two kinds of cold, one chosen, one not. Students build tabletop fog chambers to remember why experiments matter.",
      desc_it:
        "Premiati per la creazione e lo studio della materia quantistica ultrafredda. Le redazioni affiancano il titolo alle immagini del respiro nel freddo su Ground Zero, due freddi, uno cercato e uno no. Gli studenti costruiscono piccole camere a nebbia per ricordare perché gli esperimenti contano.",
      date: "09/10/2001",
      soul: -8,
    },
    {
      title:
        "Anthrax letters: NBC employee’s cut confirmed as cutaneous anthrax",
      titleIt: "Lettere all’antrace: confermato un caso cutaneo alla NBC",
      desc: "New York officials confirm cutaneous anthrax in a media employee linked to suspicious mail. Mailrooms across Europe install gloves, lamps, and calm scripts: pause, bag, call. At night, postboxes hum with refrigeration units, the sound of caution learning to breathe.",
      desc_it:
        "Le autorità di New York confermano un’antrace cutanea in un’addetta media collegata a posta sospetta. Le mailroom europee installano guanti, lampade e copioni sobri: pausa, imbusta, chiama. Di notte le cassette postali ‘ronzano’ per i gruppi frigo, è la cautela che impara a respirare.",
      date: "12/10/2001",
      soul: 9,
    },
    {
      title: "Nobel Peace Prize to the United Nations and Kofi Annan",
      titleIt: "Nobel per la Pace alle Nazioni Unite e a Kofi Annan",
      desc: "The committee cites work for a better organized and more peaceful world. At UN HQ, staff add a line to the memorial book before returning to desks. In chapels nearby, candles in bowls of sand burn without flicker, the week accepts the idea of steady flame.",
      desc_it:
        "Il comitato cita l’impegno per un mondo più organizzato e pacifico. Al Palazzo di Vetro i funzionari aggiungono una riga al libro delle memorie e tornano alle scrivanie. Nelle cappelle vicine le candele nelle ciotole di sabbia non tremano: la settimana accetta l’idea di una fiamma ferma.",
      date: "12/10/2001",
      soul: -9,
    },
    {
      title: "Afghanistan: night raids, daytime leaflets, food drops",
      titleIt: "Afghanistan: raid notturni, volantini diurni, lanci di cibo",
      desc: "Airstrikes hit command nodes and depots; daytime drops deliver food packets stamped with plain icons. In some villages, the packets glow faintly at dusk, phosphorescent paint to ease finding them, not magic, but elders still say a blessing just in case.",
      desc_it:
        "I raid colpiscono nodi di comando e depositi; di giorno si lanciano pacchi di cibo con icone semplici. In alcuni villaggi i pacchi brillano debolmente al crepuscolo, vernice fosforescente per trovarli meglio, non magia, ma gli anziani fanno lo stesso una benedizione.",
      date: "13/10/2001",
      soul: 6,
    },
    {
      title: "Rome–Milan rails fill with quiet bouquets for Linate victims",
      titleIt:
        "Sui treni Roma–Milano mazzi silenziosi per le vittime di Linate",
      desc: "Commuters carry flowers north; station boards run black ribbons between departure times. On one platform, a name is spelled in ticket stubs, then carefully swept away, the ritual ends where the timetable begins.",
      desc_it:
        "I pendolari portano fiori verso nord; i tabelloni inseriscono nastri neri tra gli orari. Su un binario un nome viene composto con biglietti usati, poi spazzato via con cura, il rito finisce dove ricomincia l’orario.",
      date: "13/10/2001",
      soul: 7,
    },
    {
      title:
        "Jerusalem and Gaza: funerals, raids, and shutters that won’t stay open",
      titleIt:
        "Gerusalemme e Gaza: funerali, raid e saracinesche che non restano alzate",
      desc: "After new incidents, markets reopen then close again by noon. Shopkeepers say the metal doors feel heavier each day. At dusk, boys chalk outlines of keys on concrete, the old sign for a door you still hope to open.",
      desc_it:
        "Dopo nuovi episodi, i mercati riaprono e richiudono a mezzogiorno. I bottegai dicono che le serrande pesano ogni giorno di più. Al tramonto i ragazzi disegnano a gessetto chiavi sul cemento, il vecchio segno per una porta che speri ancora di aprire.",
      date: "14/10/2001",
      soul: 8,
    },
    {
      title:
        "Hospitals publish ‘soul-triage’ leaflets for responders and families",
      titleIt:
        "Gli ospedali pubblicano opuscoli di ‘triage dell’anima’ per soccorritori e famiglie",
      desc: "Sleep, water, names, routine; how to handle afterimages and impostor dreams; when to seek clergy or clinic. The PDFs use big icons and words like rope knots. In waiting rooms, people copy the checklists by hand as if repetition itself could lower the static.",
      desc_it:
        "Sonno, acqua, nomi, routine; come gestire post-immagini e sogni impostori; quando chiamare un prete o una clinica. I PDF usano icone grandi e parole come nodi di corda. Nelle sale d’attesa la gente ricopia a mano le liste, come se la ripetizione da sola potesse abbassare la statica.",
      date: "14/10/2001",
      soul: -5,
    },
    {
        "title": "Washington: lettera all’antrace aperta nell’ufficio del Sen. Tom Daschle; edificio evacuato",
        "titleIt": "Washington: lettera all’antrace aperta nell’ufficio del Sen. Tom Daschle; edificio evacuato",
        "desc": "A staffer opens an envelope and a fine powder blooms; Capitol offices are sealed as hazmat teams sweep the Hart Building. Labs confirm highly refined Bacillus anthracis. Mailrooms across the U.S. and Europe post new checklists, pause, bag, call. In one corridor the powder leaves no visible trace yet everyone tastes chalk; a chaplain reminds staff that fear can season the air all by itself.",
        "desc_it": "Un assistente apre una busta e una polvere fine si solleva; gli uffici del Campidoglio vengono sigillati mentre le squadre hazmat bonificano l’edificio Hart. I laboratori confermano Bacillus anthracis ad alta purezza. Le mailroom negli USA e in Europa espongono nuove checklist, pausa, imbusta, chiama. In un corridoio la polvere non si vede ma tutti sentono gusto di gesso; un cappellano ricorda che la paura può condire l’aria da sola.",
        "date": "15/10/2001",
        "soul": 12
      },
      {
        "title": "UE: bozza politica su Mandato d’Arresto Europeo e congelamento beni",
        "titleIt": "UE: bozza politica su Mandato d’Arresto Europeo e congelamento beni",
        "desc": "Justice and home-affairs ministers circulate early text for a European Arrest Warrant and common terror-finance tools. Bankers sketch plain audit trails, no black-box oracles, human eyes on red flags. In Brussels, printers jam on a page of first names only; clerks read them aloud before hitting ‘reset,’ as if the machine had asked for a moment of prayer.",
        "desc_it": "I ministri della giustizia e degli interni fanno circolare un primo testo per il Mandato d’Arresto Europeo e strumenti comuni contro la finanza del terrore. I banchieri disegnano piste di controllo trasparenti, niente oracoli opachi, bandiere rosse vagliate da persone. A Bruxelles una stampante si inceppa mostrando solo nomi di battesimo; gli impiegati li leggono ad alta voce prima di premere ‘reset’, come se la macchina avesse chiesto un istante di preghiera.",
        "date": "15/10/2001",
        "soul": -4
      },
      {
        "title": "Afghanistan: strike package notturni e corridoi umanitari diurni",
        "titleIt": "Afghanistan: strike notturni e corridoi umanitari diurni",
        "desc": "Coalition airstrikes hit air defenses and depots; daytime drops push food packets stamped with big icons. In several valleys, radios share a new etiquette: first the call sign, then a prayer, then coordinates. Shepherds say the mountains sound older this week, as if their names had gained a decade overnight.",
        "desc_it": "I raid della coalizione colpiscono difese e depositi; di giorno i lanci umanitari distribuiscono pacchi di cibo con grandi icone. In diverse valli le radio adottano una nuova etichetta: prima il nominativo, poi una preghiera, quindi le coordinate. I pastori dicono che le montagne suonano più vecchie, come se i loro nomi avessero guadagnato un decennio in una notte.",
        "date": "16/10/2001",
        "soul": 7
      },
      {
        "title": "Israele: assassinato a Gerusalemme il ministro Rehavam Ze’evi; crisi di gabinetto",
        "titleIt": "Israele: assassinato a Gerusalemme il ministro Rehavam Ze’evi; crisi di gabinetto",
        "desc": "Gunmen kill Tourism Minister Rehavam Ze’evi at a Jerusalem hotel; the PFLP claims responsibility. Closures and raids follow as leaders vow response. At the crime scene, a room-service tray remains perfectly balanced for hours, tea gone cold, lemon slices bright, an accidental still life that looks like it refuses to learn what happened.",
        "desc_it": "Uomini armati uccidono a Gerusalemme il ministro del Turismo Rehavam Ze’evi; la responsabilità è rivendicata dal FPLP. Seguono chiusure e raid mentre i leader promettono risposta. Sul luogo, un vassoio del servizio in camera resta in equilibrio per ore, tè freddo, fette di limone accese, natura morta involontaria che sembra rifiutare di apprendere la notizia.",
        "date": "17/10/2001",
        "soul": 11
      },
      {
        "title": "New York e Washington: tracciamenti dell’antrace allargano le zone di bonifica",
        "titleIt": "New York e Washington: le tracce di antrace ampliano le aree di bonifica",
        "desc": "Positive environmental tests extend to additional mailrooms; prophylaxis lines form at odd hours. Postal workers pin tiny bells to lanyards so colleagues can find each other in mask and Tyvek, small chimes against the hush. A dry breeze makes blue gloves creak like old books.",
        "desc_it": "I test ambientali positivi raggiungono altre mailroom; le file per la profilassi spuntano a orari insoliti. I postini appuntano campanellini ai cordini per ritrovarsi tra maschere e tute, piccoli tintinnii contro il silenzio. Un vento secco fa scricchiolare i guanti blu come libri antichi.",
        "date": "18/10/2001",
        "soul": 9
      },
      {
        "title": "Afghanistan: prime operazioni di forze speciali USA sul terreno nei pressi di Kandahar",
        "titleIt": "Afghanistan: prime operazioni di forze speciali USA sul terreno nei pressi di Kandahar",
        "desc": "U.S. Army Rangers and Special Operations forces conduct night raids against Taliban airfields and compounds near Kandahar, fast in, fast out. On return, crews describe the desert as ‘a table with its cloth ripped away’: everything still there, but colder. Humanitarian corridors remain separate and lit like airport aisles.",
        "desc_it": "I Rangers e le forze speciali statunitensi effettuano raid notturni contro aeroporti e complessi talebani nell’area di Kandahar, dentro e fuori rapidamente. Al rientro i reparti descrivono il deserto come ‘un tavolo a cui hanno strappato la tovaglia’: tutto ancora lì, ma più freddo. I corridoi umanitari restano separati e illuminati come corsie d’imbarco.",
        "date": "19/10/2001",
        "soul": 12
      },
      {
        "title": "Italia: indagine su Linate, tracciate le prime linee di errore sistemico",
        "titleIt": "Italia: indagine su Linate, tracciate le prime linee di errore sistemico",
        "desc": "Investigators outline contributing factors: signage, ground radar limits in fog, and procedural gaps. Families gather at San Vittore for prayers. On Via Rubattino, flowers pile up and pencils are left sharpened, grievers say it feels right to leave tools ready, even if there’s nothing to fix.",
        "desc_it": "Gli inquirenti delineano i fattori contributivi: segnaletica, limiti del radar di rullaggio in nebbia e lacune procedurali. Le famiglie si ritrovano a San Vittore per le preghiere. In via Rubattino si accumulano fiori e matite temperate, chi piange dice che è giusto lasciare gli attrezzi pronti, anche se non c’è nulla da riparare.",
        "date": "19/10/2001",
        "soul": 10
      },
      {
        "title": "Londra, Roma, Berlino: manifestazioni contro la guerra accanto a veglie per le vittime",
        "titleIt": "Londra, Roma, Berlino: cortei contro la guerra accanto a veglie per le vittime",
        "desc": "Marches thread city centers with candles and hand-painted signs; organizers issue calm route maps and de-escalation scripts. In Trafalgar Square a flock of pigeons lifts and sits again in the exact same pattern, as if the plaza itself had pressed ‘repeat.’",
        "desc_it": "Cortei attraversano i centri con candele e cartelli dipinti a mano; gli organizzatori diffondono mappe sobrie e copioni di de-escalation. In Trafalgar Square uno stormo di piccioni si alza e si posa nello stesso identico disegno, come se la piazza avesse premuto ‘ripeti’.",
        "date": "20/10/2001",
        "soul": -1
      },
      {
        "title": "Pakistan: raduni religiosi e pressioni incrociate sul governo",
        "titleIt": "Pakistan: raduni religiosi e pressioni incrociate sul governo",
        "desc": "Large religious gatherings voice anger at strikes as Islamabad balances alliance commitments with domestic currents. Border roads carry both fuel and flour; truckers say checkpoints feel like scales that weigh prayers and rations together.",
        "desc_it": "Grandi raduni religiosi protestano contro i raid mentre Islamabad bilancia gli impegni di alleanza con le correnti interne. Le strade di confine trasportano sia carburante sia farina; i camionisti dicono che i checkpoint sembrano bilance che pesano insieme preghiere e razioni.",
        "date": "20/10/2001",
        "soul": 6
      },
      {
        "title": "Washington, Brentwood: centro postale chiuso per sospetta esposizione all’antrace",
        "titleIt": "Washington, Brentwood: chiuso il centro postale per sospetta esposizione all’antrace",
        "desc": "Officials shut the Brentwood postal facility after workers show symptoms; tests expand and prophylaxis begins on a large scale. Outside, neighbors hang white sheets from balconies to signal ‘we’re home, we’re listening’ to postal families on shift. A siren passes and every sheet stirs at once, as if answering roll call.",
        "desc_it": "Le autorità chiudono l’impianto postale di Brentwood dopo i primi sintomi tra i lavoratori; si allargano i test e partono profilassi su vasta scala. Fuori, i vicini appendono lenzuola bianche ai balconi per dire ‘siamo a casa, vi ascoltiamo’ alle famiglie dei postali di turno. Una sirena passa e ogni lenzuolo si muove insieme, come a rispondere all’appello.",
        "date": "21/10/2001",
        "soul": 12
      },
      {
        "title": "Europa: preparativi per l’euro contante, manuali ‘in chiaro’ per negozi e casse",
        "titleIt": "Europa: preparativi per l’euro contante, manuali ‘in chiaro’ per negozi e casse",
        "desc": "Retail unions distribute laminated cards on note features, change-making scripts, and polite ways to calm anxious queues. In Vienna a goblin cashier, valued for crawl-space vault checks, pins a smiley sticker to his badge and teaches a child how to say ‘two euros, please’ in three languages.",
        "desc_it": "I sindacati del commercio distribuiscono schede plastificate su elementi di sicurezza, copioni per il resto e modi gentili per tranquillizzare le file. A Vienna un cassiere goblin, insostituibile per controllare i cunicoli dei caveau, attacca un adesivo sorridente sul badge e insegna a un bambino a dire ‘due euro, per favore’ in tre lingue.",
        "date": "21/10/2001",
        "soul": -5
      },
      {
        "title": "Tecnologia: reti aziendali in ‘settimana grigia’ tra patch, filtri posta e piani B",
        "titleIt": "Technology: enterprise networks enter a ‘grey week’ of patches, mail-filters, and plan Bs",
        "desc": "CIOs push emergency patch cycles and layer mail filters; help desks publish plain-language phish drills. In several offices, backup tapes are labeled with first names instead of numbers for a day, admins say it keeps them honest, like tying a knot in a rope you mean to hold.",
        "desc_it": "I CIO avviano cicli d’emergenza di patch e filtri sulla posta; gli help desk diffondono esercizi anti-phishing in linguaggio semplice. In diversi uffici per un giorno le cassette di backup sono etichettate con nomi di battesimo invece che con numeri, gli amministratori dicono che li mantiene onesti, come fare un nodo a una corda che vuoi tenere.",
        "date": "21/10/2001",
        "soul": -2
      },
      {
        "title": "Washington: secondo postale muore per antrace; rete postale sotto stress",
        "titleIt": "Washington: secondo postale muore per antrace; rete postale sotto stress",
        "desc": "Il giorno dopo la morte di Thomas Morris Jr., anche Joseph Curseen Jr. muore per antrace legato al centro di Brentwood. Quarantene e profilassi si estendono, le cassette postali vengono chiuse a rotazione. Fuori dai centri di smistamento, famiglie appoggiano termi di caffè e biglietti coi nomi: servono a ricordare a chi entra chi lo aspetta.",
        "desc_it": "Il giorno dopo la morte di Thomas Morris Jr., muore anche Joseph Curseen Jr. per antrace collegato al centro di Brentwood. Quarantene e profilassi si allargano, cassette postali chiuse a rotazione. Fuori dagli impianti le famiglie lasciano termos di caffè e fogli coi nomi: servono a ricordare, a chi entra, chi lo aspetta.",
        "date": "22/10/2001",
        "soul": 12
      },
      {
        "title": "UE: manuali anti-panico per uffici postali e redazioni",
        "titleIt": "EU: manuali anti-panico per uffici postali e redazioni",
        "desc": "Ministri dell’Interno coordinano linee guida ‘in chiaro’ per gestire posta sospetta: pausa, imbusta, chiama; niente eroismi. In diverse redazioni europee compaiono tavoli con cordini, guanti, buste trasparenti e una ciotola di sabbia per le candele dei turnisti: un piccolo rito per attraversare la notte.",
        "desc_it": "I ministri dell’Interno coordinano linee guida in linguaggio semplice per la posta sospetta: pausa, imbusta, chiama; niente gesti avventati. In molte redazioni arrivano tavoli con cordini, guanti, buste trasparenti e una ciotola di sabbia per le candele dei notturni: un rito minimo per passare la notte.",
        "date": "22/10/2001",
        "soul": -3
      },
      {
        "title": "iPod: Pear presenta il lettore tascabile ‘mille canzoni in tasca’",
        "titleIt": "iPod: Pear presenta il lettore tascabile ‘mille canzoni in tasca’",
        "desc": "Pear svela un lettore MP3 con hard disk da 5 GB e ghiera di scorrimento. Nei negozi di elettronica si formano piccole folle in silenzio: qualcuno infila gli auricolari e annuisce, come se la musica avesse un peso specifico diverso questa settimana. Le vetrine espongono cuffie come coroncine laiche.",
        "desc_it": "Pear presenta un lettore MP3 da 5 GB con rotella di controllo. Nei negozi si creano capannelli quieti: chi prova gli auricolari annuisce, come se la musica pesasse in modo diverso, questa settimana. Le vetrine dispongono le cuffie come corone laiche.",
        "date": "23/10/2001",
        "soul": -7
      },
      {
        "title": "Irlanda del Nord: l’IRA avvia il disarmo sotto supervisione",
        "titleIt": "Northern Ireland: IRA starts supervised decommissioning",
        "desc": "La Commissione De Chastelain conferma il primo atto di dismissione di armi dell’IRA. I registri usano linguaggio asciutto e firme lunghe. A Derry e Belfast, candele nelle ciotole di sabbia restano accese senza sfarfallare: sembra un segnale minimo, ma la gente ci crede.",
        "desc_it": "La Commissione De Chastelain attesta il primo atto di disarmo dell’IRA. Verbali asciutti, firme lente. A Derry e Belfast delle candele in ciotole di sabbia restano stabili: un segno minuscolo, eppure sufficiente a far credere che qualcosa stia cambiando.",
        "date": "23/10/2001",
        "soul": -11
      },
      {
        "title": "Recupero Kursk: lo scafo arriva al bacino di carenaggio a Rosljakovo",
        "titleIt": "Kursk: lo scafo arriva al bacino di Roslyakovo",
        "desc": "La chiatta olandese consegna il relitto del sottomarino al bacino russo. Squadre tecniche sigillano le paratie; il mare artico resta nero come grafite. Alcuni marinai giurano che l’acqua vicino alla prua è ‘più fredda della notte’, il tipo di frase che i rapporti ufficiali tagliano, ma che i corpi ricordano.",
        "desc_it": "La chiatta olandese porta il Kursk al bacino di carenaggio. Le squadre chiudono le paratie; il mare resta nero di grafite. Qualcuno giura che vicino alla prua l’acqua sia ‘più fredda della notte’: frase che i rapporti tagliano, ma che i corpi conservano.",
        "date": "23/10/2001",
        "soul": 4
      },
      {
        "title": "Marte: la sonda 2001 Mars Odyssey entra in orbita",
        "titleIt": "Mars Odyssey 2001 entra in orbita attorno a Marte",
        "desc": "La sonda della NASA completa con successo l’inserimento orbitale attorno al pianeta rosso per iniziare la mappatura. In alcune scuole europee gli studenti seguono la telemetria su proiettori e annotano come si prende una curva, nello spazio e nella vita. I docenti parlano di pazienza come di carburante.",
        "desc_it": "La NASA conferma l’orbita marziana della sonda per future mappature. Nelle scuole, grafici su muri bianchi e matite appuntite: imparare a ‘prendere la curva’, in cielo e a terra. La pazienza viene spiegata come un propellente.",
        "date": "24/10/2001",
        "soul": -8
      },
      {
        "title": "USA PATRIOT Act: via libera del Congresso e firma presidenziale",
        "titleIt": "USA PATRIOT Act: approvazione e firma",
        "desc": "La camera approva, il senato segue, e il Presidente firma: cooperazione, sorveglianza, strumenti finanziari e investigativi ampliati. Giuristi in Europa parlano di ‘guerra amministrativa tramite legge’. In molte case, la TV resta accesa senza audio: la gente preferisce leggere le labbra del potere.",
        "desc_it": "Camera e Senato approvano, il Presidente firma: cooperazione, sorveglianza, estensione degli strumenti di indagine e finanziari. Per i giuristi è ‘guerra amministrativa per via legale’. In casa, molti tengono l’audio spento e guardano solo le labbra: aiuta a non perdersi le parole.",
        "date": "26/10/2001",
        "soul": 6
      },
      {
        "title": "Windows XP: lancio mondiale di un sistema ‘più semplice’",
        "titleIt": "Windows XP: il lancio globale del sistema ‘più semplice’",
        "desc": "Megahard lancia XP con interfaccia unificata e driver più stabili. Nelle aziende, i CIO concedono un sorriso sghembo: lo chiamano ‘lunedì che arriva di giovedì’. In qualche help desk, i post-it con i nomi dei colleghi restano come talismani: assicurano che dietro ogni schermata c’è una persona.",
        "desc_it": "Megahard presenta XP, interfaccia uniforme e promesse di stabilità. I CIO lo chiamano ‘un lunedì che cade di giovedì’. Ai help desk i post-it coi nomi restano attaccati ai monitor: ricordano che dietro ogni crash c’è qualcuno in carne e ossa.",
        "date": "25/10/2001",
        "soul": -3
      },
      {
        "title": "Afghanistan: attacchi mirati e volantini; vie di fuga e corridoi di farina",
        "titleIt": "Afghanistan: raid e volantini; vie di fuga e farina",
        "desc": "Proseguono i raid contro difese e depositi; di giorno aerei cargo rilasciano pacchetti alimentari con icone grandi. In alcune valli i pacchi ‘tingono’ le dita di una fosforescenza tenue: vernice tracciante per trovarli al crepuscolo. Gli anziani chiedono comunque una benedizione, per sicurezza.",
        "desc_it": "Continuano i colpi su difese e hub logistici, e i lanci di cibo su corridoi separati. La vernice dei pacchi lascia un segno tenue sulle mani: serve a ritrovarli, ma diventa anche un promemoria che c’è stato pane.",
        "date": "26/10/2001",
        "soul": 7
      },
      {
        "title": "Serie Mondiale 2001: i Diamondbacks colpiscono per primi",
        "titleIt": "World Series 2001: Arizona avanti",
        "desc": "A Phoenix, Curt Schilling domina Gara 1 contro i New York Yankees. Gli spalti oscillano tra tifo e memoria: prima del play ball, un silenzio così fitto che sembra avere densità. Alcuni tifosi tengono in tasca un foglietto con un nome: lo tirano fuori solo durante gli inni.",
        "desc_it": "A Phoenix i Diamondbacks vincono Gara 1 con Schilling dominante. Prima del primo lancio, uno spazio di silenzio sembra materializzarsi sugli spalti. In molti stringono un foglietto con un nome: esce solo al momento degli inni.",
        "date": "27/10/2001",
        "soul": -6
      },
      {
        "title": "World Series: Johnson porta Arizona sul 2–0",
        "titleIt": "World Series: Randy Johnson firma il 2–0",
        "desc": "Randy Johnson spegne le mazze degli Yankees in Gara 2. A New York, bar e salotti seguono a luci basse: lo sport torna a occupare il suo posto esatto, né troppo né poco. Per qualcuno è la prima sera senza notiziari, solo baseball, e basta.",
        "desc_it": "Arizona vince anche Gara 2 grazie a Johnson. A New York si guarda con luci soffuse: lo sport ritrova dimensione, non un antidoto, ma un appoggio. È la prima sera, per molti, senza notiziari.",
        "date": "28/10/2001",
        "soul": -5
      },
      {
        "title": "UE: cambio ora legale, ‘un’ora restituita’ a un continente stanco",
        "titleIt": "EU: fine dell’ora legale, ‘un’ora restituita’",
        "desc": "L’Europa torna all’ora solare. In tante città le campane battono il ritmo vecchio-nuovo e qualcuno dice che il tempo oggi ‘pesa meno’. Gli psichiatri dei centri di assistenza notano che la notte più lunga aiuta alcuni a dormire, piccolo intervento cosmico senza chiedere permesso.",
        "desc_it": "Con il ritorno all’ora solare le lancette si spostano indietro. Molti chiamano quell’ora ‘restituita’. Nei centri di supporto, le notti più lunghe portano sonno a chi non lo trovava: dono minimo e anonimo.",
        "date": "28/10/2001",
        "soul": -4
      },
      {
        "title": "Italia: inchiesta Linate, prime mappe di rischio rifatte ‘a prova di nebbia’",
        "titleIt": "Italy: Linate, ridisegnate le mappe di rullaggio per la nebbia",
        "desc": "ENAC e SEA avviano aggiornamenti su segnaletica e procedure a bassa visibilità. I tecnici tracciano mappe grandi quanto tavoli; ogni freccia ha un nome e una storia. Fuori, i fiori su via Rubattino non si sciupano nonostante l’aria umida: qualcuno giura che li cambi a turno il quartiere intero.",
        "desc_it": "Autorità e gestore preparano miglioramenti a segnaletica e LVP. Nei capannoni appaiono planimetrie grandi come lenzuola, con frecce e nomi. In strada i mazzi restano freschi: c’è chi dice che a prendersene cura siano ‘turni’ spontanei di vicini.",
        "date": "28/10/2001",
        "soul": 9
      },
      {
        "title": "UNHCR e ONG: piani d’inverno per i rifugiati afghani",
        "titleIt": "UNHCR e ONG: piani d’inverno per i rifugiati afghani",
        "desc": "Convogli di tende, teloni e kit per il freddo puntano verso i valichi del Pakistan e dell’Iran; gli operatori parlano di ‘finestre’ tra neve e sicurezza. Mappe meteo e mappe di accesso si sovrappongono come due lastre di vetro. Nei campi si insegna un rito semplice: nomi, acqua, coperte, luce, quattro parole per farsi strada nella notte.",
        "desc_it": "Convoys of tents, tarps, and cold-weather kits move toward Pakistan and Iran border points as agencies chase the brief ‘windows’ between snowfall and security. Weather and access charts overlay like two panes of glass. Field teams teach a plain rite: names, water, blankets, light, four words to walk the night.",
        "date": "29/10/2001",
        "soul": 8
      },
      {
        "title": "Concorde: via libera finale e data di ritorno sui cieli",
        "titleIt": "Concorde: via libera finale e data di ritorno sui cieli",
        "desc": "Regolatori in Britannia e Francia chiudono l’iter di sicurezza per il rientro in servizio con modifiche a serbatoi e gomme; Air France e British Airways aprono le prenotazioni per i primi voli di novembre. Sulla pista, un collaudo al tramonto taglia il sole come una lama. Un tecnico goblin, minuscolo sotto il carrello, dà l’ultimo ok ai sensori con un pollice in su che sembra un faro.",
        "desc_it": "Regulators in the Britannia and France finalize safety approvals for Concorde’s return with tank and tyre mods; Air France and BA open bookings for early-November flights. On the runway, a dusk proving run slices the sun like a blade. A goblin technician, tiny under the gear, signs off the sensors with a thumb-up that looks like a lighthouse.",
        "date": "29/10/2001",
        "soul": -5
      },
      {
        "title": "Euro contante: banche e negozi testano i ‘copioni del resto’",
        "titleIt": "Euro contante: banche e negozi testano i ‘copioni del resto’",
        "desc": "Associazioni del commercio distribuiscono schede plastificate con pittogrammi su tagli, falsi e frasi chiave (‘resto in euro’, ‘prezzi doppi’). Ai bancomat si provano aggiornamenti notturni. Una cassiera disegna a matita le nuove monete sul retro della mano: dice che ‘così non scappano’.",
        "desc_it": "Retail groups hand out laminated icon cards for denominations, counterfeit tells, and simple phrases (‘change in euro’, ‘dual prices’). ATM updates are rehearsed overnight. A cashier sketches the new coins on the back of her hand: ‘so they can’t run away,’ she smiles.",
        "date": "29/10/2001",
        "soul": -3
      },
      {
        "title": "World Series, Gara 3 a New York: Yankees 2–1, primo lancio presidenziale",
        "titleIt": "World Series, Game 3 in New York: Yankees 2–1, ceremonial first pitch",
        "desc": "Lo Yankee Stadium trattiene il respiro per lanciare poi un boato che pare un abbraccio. Sicurezza al massimo, inni senza tremare. In tribuna qualcuno tiene un biglietto con un nome ripiegato due volte: lo apre solo durante il silenzio e lo rimette via al primo strike.",
        "desc_it": "Yankee Stadium holds its breath, then roars like an embrace. Security is tight, anthems steady. In the stands a fan keeps a name folded twice in his pocket: he opens it for the moment of silence and tucks it back on strike one.",
        "date": "30/10/2001",
        "soul": -6
      },
      {
        "title": "Antrace: la mappa dei controlli si allarga tra New Jersey e area di Washington",
        "titleIt": "Anthrax: testing net widens across New Jersey and the Washington area",
        "desc": "La rete postale instrada campioni verso laboratori CDC/FBI; si rafforzano i protocolli per la manipolazione della posta. Ovunque appaiono tavoli con guanti, buste trasparenti e telefoni dedicati. Alcune cassette portano un nastro bianco: ‘Qui si respira piano.’",
        "desc_it": "Postal routes shunt samples to CDC/FBI labs; handling protocols tighten. Tables sprout everywhere with gloves, clear bags, and dedicated phones. Some mailboxes wear a white ribbon: ‘Breathe slowly here.’",
        "date": "30/10/2001",
        "soul": 10
      },
      {
        "title": "Halloween sobrio e finestre con fantasmi di carta",
        "titleIt": "Low-key Halloween and paper ghosts in windows",
        "desc": "Tra Stati Uniti ed Europa si scelgono maschere leggere, lumini e cartelli per i donatori di sangue. In alcuni quartieri di New York i lenzuoli appesi alle finestre paiono fermarsi un attimo prima del vento, come per ascoltare se sta arrivando qualcuno.",
        "desc_it": "Across the U.S. and Europe, costumes are muted, candles steady, and ‘donor here’ signs taped to doors. In some New York blocks, white sheets in windows seem to pause a heartbeat before the wind, listening, as if for footsteps.",
        "date": "31/10/2001",
        "soul": 3
      },
      {
        "title": "World Series, Gara 4: pareggio di Martinez al 9°; ‘Mr. November’ dopo mezzanotte",
        "titleIt": "World Series, Game 4: Martinez ties it in the 9th; ‘Mr. November’ after midnight",
        "desc": "Con due out al nono Tino Martinez manda la palla oltre il centro. Oltre la mezzanotte, con il tabellone già sul nuovo mese, Jeter chiude. Gli orologi dello stadio sembrano trattenere un respiro lungo quanto un inning.",
        "desc_it": "With two out in the ninth, Tino Martinez ties it to dead center. Past midnight, scoreboard already reading the new month, Jeter walks it off. Stadium clocks look like they held a breath the length of an inning.",
        "date": "31/10/2001",
        "soul": -6
      },
      {
        "title": "Ognissanti in Europa: campane, sabbia e nomi",
        "titleIt": "All Saints’ Day across Europe: bells, sand, and names",
        "desc": "Chiese piene e cimiteri ordinati, candele in ciotole di sabbia contro il vento. A Parigi una signora lascia un biglietto: ‘Se trovi questo nome, digli che non era solo.’ In Italia file ordinate sotto i portici, parlate a bassa voce come in biblioteca.",
        "desc_it": "Full churches and tidy graveyards; candles planted in bowls of sand. In Paris an elderly woman leaves a note: ‘If you find this name, tell him he was not alone.’ In Italy, covered walkways host quiet queues, like libraries that learned to breathe.",
        "date": "01/11/2001",
        "soul": -7
      },
      {
        "title": "World Series, Gara 5: Yankees vincono al 12°",
        "titleIt": "World Series, Game 5: Yankees win in the 12th",
        "desc": "Un altro nono da cardiopalma con il pari di Brosius, poi cammino lungo fino al singolo decisivo. New York abbassa le luci nei bar: il rumore della città sembra una coperta piegata bene.",
        "desc_it": "Another ninth-inning jolt with Brosius tying it, then a long walk to the winning single. New York watches with the lights low; the city’s noise feels like a blanket folded just right.",
        "date": "01/11/2001",
        "soul": -5
      },
      {
        "title": "Antitrust: il Dipartimento di Giustizia e Megahard annunciano un accordo",
        "titleIt": "Antitrust: U.S. DOJ and Megahard announce settlement terms",
        "desc": "Il governo USA presenta i termini per chiudere la causa antitrust; alcuni Stati annunciano che non firmeranno. A Redmond si parla di ‘consenso sorvegliato’; a Bruxelles si prende appunto. Sui mercati, un sospiro breve e poi di nuovo grafici.",
        "desc_it": "The U.S. government unveils proposed settlement terms in the Megahard antitrust case; several states hold out. Redmond calls it ‘supervised peace’; Brussels takes notes. Markets exhale briefly, then go back to charts.",
        "date": "02/11/2001",
        "soul": -3
      },
      {
        "title": "CDC: nuove linee guida su profilassi post-esposizione all’antrace",
        "titleIt": "CDC: updated post-exposure anthrax prophylaxis guidance",
        "desc": "Aggiornati durata e farmaci per i contatti a rischio; i centri di salute pubblica pubblicano fogli ‘in chiaro’: pausa, maschera, chiamata. Nelle farmacie compaiono campanelli sul banco per chi non vuole alzare la voce.",
        "desc_it": "CDC refines course length and drugs for at-risk contacts; public-health desks post plain-language sheets: pause, mask, call. Pharmacies place tiny bells on the counter for those who can’t find their voice.",
        "date": "02/11/2001",
        "soul": 7
      },
      {
        "title": "Afghanistan: la Northern Alliance prepara l’offensiva a nord",
        "titleIt": "Afghanistan: Northern Alliance stages for northern push",
        "desc": "Tra Bagram e Mazar-i-Sharif si accumulano carburante e promesse. Le radio passano in rassegna una liturgia di coordinate e nomi. I corridoi umanitari restano separati e lampanti come vie di fuga in un teatro.",
        "desc_it": "Between Bagram and Mazar-i-Sharif, fuel and vows stack up. Radios cycle through a liturgy of coordinates and names. Humanitarian corridors stay separate and lit like theater aisles.",
        "date": "02/11/2001",
        "soul": 9
      },
      {
        "title": "World Series, Gara 6: Arizona travolge 15–2",
        "titleIt": "World Series, Game 6: Diamondbacks romp 15–2",
        "desc": "A Phoenix i Diamondbacks riaprono il rubinetto dei punti. New York spegne presto le TV e riordina i tavoli: domani è un altro giorno, e forse l’ultimo. Un ragazzo ripiega il biglietto con il nome e lo rimette nel portafogli senza leggerlo.",
        "desc_it": "In Phoenix, Arizona opens the floodgates. New York’s televisions go dark early; bars wipe tables in a hush. A kid folds the paper with his name and tucks it away without reading.",
        "date": "03/11/2001",
        "soul": -3
      },
      {
        "title": "Concorde: ultimi collaudi e addestramento equipaggi prima del rientro",
        "titleIt": "Concorde: final proving runs and crew drills before service resumes",
        "desc": "Le compagnie chiudono i programmi di training: checklist miste, prove d’emergenza, briefing in più lingue. Sulla Manica la scia di un test pare una riga con il righello: i fotografi dicono che è l’aria fredda che mette in ordine i bordi.",
        "desc_it": "Airlines wrap training with mixed-language checklists and emergency drills. Over the Channel a test contrail looks ruler-straight; photographers say cold air cleans up the edges.",
        "date": "03/11/2001",
        "soul": -4
      },
      {
        "title": "World Series, Gara 7: Arizona campione con la valida di Luis Gonzalez",
        "titleIt": "World Series, Game 7: Arizona wins it on Luis Gonzalez’s bloop",
        "desc": "Nel nono, in campo interno avanzato, la palla cade dove non c’è nessuno. Gli Yankees si fermano come chi ascolta il mare dentro una conchiglia. Poi il rumore riparte, e con lui l’anno nuovo della città: piano, ma riparte.",
        "desc_it": "In the ninth, with the infield drawn in, the ball drops where no one is. The Yankees stand a heartbeat, like listening to a shell. Then the noise returns, and with it the city’s new year, slow but real.",
        "date": "04/11/2001",
        "soul": -8
      },
      {
        "title": "Israele: memoria per Yitzhak Rabin a sei anni dall’assassinio",
        "titleIt": "Israel marks six years since Yitzhak Rabin’s assassination",
        "desc": "Cerimonie ufficiali, scolaresche, canti sottovoce. In molte case si accende una candela davanti a una foto in bianco e nero: il tempo si siede accanto, per un’ora, e non chiede nulla. Sui notiziari scorrono due parole: ‘pace’ e ‘compito’.",
        "desc_it": "State ceremonies, school groups, and low songs. In living rooms, a single candle burns before a black-and-white portrait; time sits down for an hour and asks nothing. Newscasts carry two words on the crawl: ‘peace’ and ‘homework.’",
        "date": "04/11/2001",
        "soul": 8
      },
      {
        "title": "Northern Alliance readies for a northern push around Mazar-i-Sharif",
        "titleIt": "L’Alleanza del Nord si prepara all’avanzata attorno a Mazar-i-Sharif",
        "desc": "Fuel, ammo, and promises stack up along the road from Balkh to the front. Radios cycle a liturgy of names and coordinates. Humanitarian lanes, mapped like theater aisles, stay lit in daylight. Villagers say the wind carries two voices today, one old, one hurrying.",
        "desc_it": "Carburante, munizioni e promesse si accumulano dalla provincia di Balkh fino alla linea del fronte. Le radio girano una liturgia di nomi e coordinate. I corridoi umanitari, disegnati come corsie di un teatro, restano accesi di giorno. I villaggi dicono che il vento oggi porta due voci, una antica, una che ha fretta.",
        "date": "05/11/2001",
        "soul": 9
      },
      {
        "title": "ECB and mints: last-mile drills for euro cash distribution",
        "titleIt": "BCE e zecche: prove ‘ultimo miglio’ per la distribuzione dell’euro contante",
        "desc": "Cash centers rehearse sealed pallets, armored routes, and change-making scripts. Retailers post big-icon leaflets at tills. A goblin cashier in Munich draws coin edges on a paper cup to teach a child by touch, ‘the fingers remember better than eyes,’ she says.",
        "desc_it": "I centri contanti provano pallet sigillati, percorsi blindati e copioni per il resto. Nei negozi compaiono volantini a grandi icone alle casse. Una cassiera goblin a Monaco incide i bordi delle monete su un bicchiere di carta per insegnare a un bambino col tatto: ‘le dita ricordano meglio degli occhi’, dice.",
        "date": "05/11/2001",
        "soul": -4
      },
      {
        "title": "New York City elects Michael Bloomberg as mayor",
        "titleIt": "New York elegge Michael Bloomberg a sindaco",
        "desc": "After a bruising campaign defined by a wounded city’s needs, voters choose the businessman to succeed Rudy Giuliani. In quiet living rooms, televisions glow low; some families set a candle beside the remote as if to bless the volume button.",
        "desc_it": "Dopo una campagna segnata dai bisogni di una città ferita, gli elettori scelgono l’imprenditore come successore di Rudy Giuliani. Nei salotti le TV brillano a volume basso; alcune famiglie mettono una candela accanto al telecomando, come a benedire il tasto del volume.",
        "date": "06/11/2001",
        "soul": -1
      },
      {
        "title": "Britannia unveils Anti-terrorism, Crime and Security Bill",
        "titleIt": "Britannia: presentato l’Anti-terrorism, Crime and Security Bill",
        "desc": "London introduces sweeping powers on detention, data, and finance. Civil liberties groups ask for sunsets and tight oversight. In committee rooms, paper stacks lean like small cities; clerks tie them with string as if to keep the words from running loose.",
        "desc_it": "Londra presenta un pacchetto ampio su detenzione, dati e finanza. Le associazioni civili chiedono clausole di scadenza e controlli serrati. Nelle aule, pile di carte inclinano come piccole città; gli uscieri le legano con lo spago, quasi a impedire alle parole di scappare.",
        "date": "08/11/2001",
        "soul": 5
      },
      {
        "title": "Concorde returns to passenger service: London–New York and Paris–New York",
        "titleIt": "Il Concorde torna in servizio: Londra–New York e Parigi–New York",
        "desc": "British Airways and Air France restart supersonic flights after safety mods. On the apron, crews touch the needle-nose like a talisman, then step back to checklists. The contrail draws a ruler-straight seam between continents, the kind tailors make when they mean it.",
        "desc_it": "British Airways e Air France riprendono i voli supersonici dopo le modifiche di sicurezza. In piazzale gli equipaggi sfiorano il ‘naso’ come un talismano e poi tornano alle checklist. La scia traccia una cucitura diritta tra i continenti, quella dei sarti quando fanno sul serio.",
        "date": "07/11/2001",
        "soul": -6
      },
      {
        "title": "WTO Doha Ministerial opens; a new round sought amid doubt and dust",
        "titleIt": "Doha: si apre la Ministeriale WTO; si cerca un nuovo round tra dubbi e polvere",
        "desc": "Trade ministers gather under heavy security in Qatar to launch a round on tariffs, services, and rules. Protest is mostly offsite and online this time. Delegates say the air tastes like paper; translators drink tea by the gallon to keep their verbs gentle.",
        "desc_it": "A Doha i ministri del commercio si riuniscono per avviare un nuovo round su tariffe, servizi e regole, con sicurezza alta. Le proteste sono per lo più fuori sede e online. I delegati dicono che l’aria sa di carta; i traduttori bevono tè a litri per tenere i verbi docili.",
        "date": "09/11/2001",
        "soul": 2
      },
      {
        "title": "Northern Alliance captures Mazar-i-Sharif",
        "titleIt": "L’Alleanza del Nord conquista Mazar-i-Sharif",
        "desc": "A sudden break on the northern front flips the map: Mazar falls, roads and morale change direction. Shrines and warehouses alike are counted and guarded. On the city’s edge, wheat blows like a congregation rising to its feet.",
        "desc_it": "Una rottura improvvisa sul fronte nord capovolge la mappa: Mazar cade, strade e morale cambiano verso. Santuari e magazzini vengono contati e presidiati. Ai margini, il grano si muove come una congregazione che si alza in piedi.",
        "date": "10/11/2001",
        "soul": 10
      },
      {
        "title": "China admitted to the World Trade Organization",
        "titleIt": "La Cina è ammessa all’Organizzazione Mondiale del Commercio",
        "desc": "After years of negotiation, ministers approve China’s accession terms. Analysts talk supply chains and standards; dockworkers talk shifts and shoes. In factory towns, loudspeakers test a new chime that means ‘overtime with lights on.’",
        "desc_it": "Dopo anni di negoziati, i ministri approvano i termini di adesione della Cina. Gli analisti parlano di filiere e standard; gli scaricatori di turni e scarpe. Nelle città-fabbrica gli altoparlanti testano un nuovo segnale: ‘straordinari a luci accese’.",
        "date": "10/11/2001",
        "soul": -2
      },
      {
        "title": "Taliban lines wobble toward Taloqan; Kabul watches the road",
        "titleIt": "Le linee talebane vacillano verso Taloqan; Kabul guarda la strada",
        "desc": "With Mazar fallen, pressure ripples east. Northern Alliance units probe toward Taloqan as logistics sprint to keep up. Kabul counts trucks, rumors, and prayers by the bundle. A boy ties a ribbon to a map pin and calls it ‘good luck fuel.’",
        "desc_it": "Dopo la caduta di Mazar la pressione si sposta a est. Reparti dell’Alleanza del Nord puntano verso Taloqan mentre la logistica corre. Kabul conta camion, voci e preghiere a mazzi. Un ragazzo lega un nastro a una puntina sulla mappa e lo chiama ‘carburante di fortuna’.",
        "date": "11/11/2001",
        "soul": 8
      },
      {
        "title": "Remembrance/Armistice Day across Europe and the Commonwealth",
        "titleIt": "Giorno della Memoria/Armistizio in Europa e nel Commonwealth",
        "desc": "At the eleventh hour, cities halt. Poppies and candles; names read in school gyms and cathedrals. In some parishes, bowls of sand from summer beaches now hold winter flames, the year learning to carry both heat and memory at once.",
        "desc_it": "All’undicesima ora le città si fermano. Papaveri e candele; nomi letti in palestre e cattedrali. In alcune parrocchie, ciotole di sabbia raccolta d’estate reggono fiamme d’inverno, l’anno impara a tenere insieme calore e memoria.",
        "date": "11/11/2001",
        "soul": -7
      },
      {
        "title": "WTO: ‘Doha Development Agenda’ takes shape; Taiwan accession next",
        "titleIt": "WTO: prende forma l’‘Agenda di Doha’; prossima l’adesione di Taiwan",
        "desc": "Texts move toward a launch; language on development and implementation bristles, then smooths. Delegations confirm that Chinese Taipei will join after China. Outside, dust from nearby construction settles on briefcases like a thin extra page.",
        "desc_it": "I testi si avvicinano al lancio; il linguaggio su sviluppo e attuazione prima si increspa poi si distende. Le delegazioni confermano l’ingresso di Chinese Taipei dopo la Cina. Fuori, la polvere di un cantiere si posa sulle valigette come una pagina in più.",
        "date": "11/11/2001",
        "soul": -1
      },
      {
        "title": "Anthrax response: Brentwood and Hamilton plan deep decontamination",
        "titleIt": "Antrace: Brentwood e Hamilton pianificano la decontaminazione profonda",
        "desc": "Postal facilities in Washington and New Jersey publish timelines for chlorine dioxide treatments and staff screenings. Community halls host Q&As with plain-language answers. In one gym, a child raises a hand to ask if letters can be ‘washed’, a chemist says yes, and shows how with gloves and patience.",
        "desc_it": "Gli impianti postali di Washington e del New Jersey diffondono i piani per trattamenti con diossido di cloro e screening del personale. Le sale civiche ospitano incontri con risposte in linguaggio semplice. In una palestra un bambino chiede se le lettere si possano ‘lavare’: una chimica risponde di sì e lo mostra con guanti e pazienza.",
        "date": "11/11/2001",
        "soul": 7
      },
      {
        "title": "Euro-night rehearsals: ATMs blink, tills practice, wallets learn new math",
        "titleIt": "Prove per la ‘notte dell’euro’: bancomat, casse e portafogli imparano la nuova aritmetica",
        "desc": "Banks run dry runs on software cutovers; small shops practice dual pricing with play money. A baker in Lisbon tapes coins to a tray like constellations and names them out loud until the fear turns into a recipe.",
        "desc_it": "Le banche fanno prove a secco per i passaggi software; i negozi provano i doppi prezzi con soldi finti. Una panettiera a Lisbona incolla monete su un vassoio come costellazioni e le nomina ad alta voce finché la paura diventa una ricetta.",
        "date": "11/11/2001",
        "soul": -3
      },
      {
        "title": "Northern Alliance enters Kabul; regime retreats",
        "titleIt": "L’Alleanza del Nord entra a Kabul; il regime arretra",
        "desc": "As Taliban forces slip away from the capital, Northern Alliance units move into Kabul with a rush that feels like breath returning. Neighborhoods hang carpets and boil tea; radios test the word ‘tomorrow’ again. Bad news’ shadow, looting and score-settling, meets elders and clerics who stand at corners with lists of names and rules read aloud: a small firewall built from voices.",
        "desc_it": "Mentre le forze talebane lasciano la capitale, i reparti dell’Alleanza del Nord entrano a Kabul con un impeto che somiglia al ritorno del respiro. Nei quartieri si appendono tappeti e si mette l’acqua per il tè; le radio provano di nuovo la parola ‘domani’. L’ombra del cattivo presagio, saccheggi e regolamenti di conti, trova anziani e religiosi agli angoli con elenchi di nomi e regole lette ad alta voce: un piccolo firewall fatto di voci.",
        "date": "13/11/2001",
        "soul": -9
      },
      {
        "title": "UN maps a political path for Afghanistan (Res. 1378)",
        "titleIt": "L’ONU traccia un percorso politico per l’Afghanistan (Risoluzione 1378)",
        "desc": "The Security Council backs a transition under UN auspices, calling for inclusive governance and respect for rights. It is just paper, but paper can become scaffolding if people keep reading it together. Aid groups circle dates on whiteboards and start hiring translators.",
        "desc_it": "Il Consiglio di Sicurezza sostiene una transizione sotto egida ONU, chiedendo un governo inclusivo e il rispetto dei diritti. È solo carta, ma la carta diventa impalcatura se la si continua a leggere insieme. Le ONG segnano date sulle lavagne e assumono traduttori.",
        "date": "14/11/2001",
        "soul": -6
      },
      {
        "title": "Xbox launches in America; GameCube follows, rooms learn to laugh again",
        "titleIt": "Debuttano Xbox e, a ruota, GameCube, le stanze tornano a ridere",
        "desc": "New consoles land in November nights. Living rooms that lately held silence learn to host yelling at pixelated plumbers and space marines. Small joyful noise proves contagious: even tired parents try a level and call it therapy.",
        "desc_it": "Nuove console nelle serate di novembre. Salotti che da poco custodivano silenzio ospitano urla a idraulici e marines pixelati. Il rumore gioioso è contagioso: anche i genitori stanchi provano un livello e lo chiamano terapia.",
        "date": "15/11/2001",
        "soul": -5
      },
      {
        "title": "Larry Matter film opens; kids memorize ‘repair’ before ‘revenge’",
        "titleIt": "Esce Larry Matter; i bambini memorizzano ‘riparare’ prima di ‘vendicare’",
        "desc": "Cinemas fill with families and paper wands. In foyers, kids test charms whose first verb is fix, not fight. A school counselor says ticket stubs make good bookmarks for grief pamphlets, ordinary paper threading two kinds of reading.",
        "desc_it": "I cinema si riempiono di famiglie e bacchette di carta. Nei foyer i bambini provano incantesimi il cui primo verbo è riparare, non combattere. Una psicologa scolastica dice che i biglietti del film sono ottimi segnalibri per i volantini sul lutto, carta normale a cucire due letture.",
        "date": "16/11/2001",
        "soul": -4
      },
      {
        "title": "EU clinics refine ‘soul-triage’: sleep, water, names, routine",
        "titleIt": "Le cliniche europee affinano il ‘triage dell’anima’: sonno, acqua, nomi, routine",
        "desc": "Hospitals from Milan to Rotterdam publish leaflets that swap jargon for big icons. The method looks small but scales: tiny rituals that turn panic into pacing. Even bad days become less contagious.",
        "desc_it": "Ospedali da Milano a Rotterdam diffondono opuscoli che sostituiscono il gergo con grandi icone. Il metodo è piccolo ma scalabile: riti minimi che trasformano l’ansia in ritmo. Anche i giorni brutti diventano meno contagiosi.",
        "date": "17/11/2001",
        "soul": -3
      },
      {
        "title": "Kabul’s schools unbar doors; desks remember children",
        "titleIt": "A Kabul le scuole riaprono; i banchi ricordano i bambini",
        "desc": "Headteachers dust off ledgers; chalkboards get first names again. Girls bring notebooks like gifts. In some classrooms, windows are just holes but sunlight still takes attendance.",
        "desc_it": "I presidi spolverano i registri; sulle lavagne tornano i nomi. Le ragazze portano quaderni come doni. In certe aule le finestre sono solo buchi, ma la luce fa comunque l’appello.",
        "date": "18/11/2001",
        "soul": -8
      },
      {
        "title": "U.S. law creates the Transportation Security Administration",
        "titleIt": "Negli USA nasce la TSA per la sicurezza dei trasporti",
        "desc": "Congress establishes a federal screen-and-train backbone. It is born of terror, but it standardizes calm: clearer lines, better doors, more human eyes. Airports add quiet rooms and plain-language posters; little fixes, large dividends.",
        "desc_it": "Il Congresso istituisce una dorsale federale per controlli e formazione. Nasce dallo spavento, ma standardizza la calma: code più chiare, porte migliori, più occhi umani. Gli aeroporti aggiungono stanze quiete e cartelli in lingua semplice: piccoli interventi, grandi ritorni.",
        "date": "19/11/2001",
        "soul": -5
      },
      {
        "title": "Afghanistan: women’s voices return to Radio Kabul",
        "titleIt": "Afghanistan: tornano le voci femminili a Radio Kabul",
        "desc": "Announcers breathe deep and speak first names slowly, like lighting candles. Programs about food prices and school hours sound like symphonies. A bad decade leaves, a better day starts to sound plausible.",
        "desc_it": "Le annunciatrici respirano e pronunciano lentamente i nomi, come accendere candele. Le trasmissioni su prezzi e orari scolastici suonano come sinfonie. Un decennio cattivo se ne va, un giorno migliore diventa plausibile.",
        "date": "21/11/2001",
        "soul": -7
      },
      {
        "title": "Kunduz corridor opens, surrender beats slaughter",
        "titleIt": "Kunduz: si apre il corridoio della resa, meglio arrendersi che morire",
        "desc": "After grim siege rumors, organized handovers begin around Kunduz. Monitors count buses, not bodies. Later inquiries will ask hard questions; today fewer families get a knock at midnight. Imperfect mercy is still mercy.",
        "desc_it": "Dopo voci cupe d’assedio, intorno a Kunduz iniziano consegne organizzate. I monitor contano autobus, non cadaveri. Più avanti le inchieste faranno domande dure; oggi qualche famiglia in meno riceve un colpo alla porta a mezzanotte. Misericordia imperfetta è pur sempre misericordia.",
        "date": "23/11/2001",
        "soul": -4
      },
      {
        "title": "Retail Europe pilots ‘kind lines’ for anxious shoppers",
        "titleIt": "Negozi europei sperimentano ‘code gentili’ per clienti in ansia",
        "desc": "Stores add shaded queues, water, and a ‘no rush’ lane staffed by goblin cashiers famous for steady hands. A spreadsheet note reads: throughput down 4%, complaints down 80%. Efficiency isn’t everything; kindness adjusts the math.",
        "desc_it": "I negozi aggiungono file in ombra, acqua e una corsia ‘senza fretta’ servita da cassieri goblin noti per la mano ferma. Una nota a spreadsheet: flusso -4%, reclami -80%. L’efficienza non è tutto; la gentilezza corregge i conti.",
        "date": "24/11/2001",
        "soul": -3
      },
      {
        "title": "First snow in Kabul; aid convoys learn winter’s script",
        "titleIt": "Prima neve a Kabul; i convogli imparano il copione d’inverno",
        "desc": "Trucks move by daylight, prayer, and weather windows. Drivers swap chains like rosaries. Snow hides mines and also covers yesterday’s burn marks: a visual ceasefire, brief but helpful.",
        "desc_it": "I camion si muovono tra luce, preghiera e finestre meteo. Gli autisti scambiano le catene come rosari. La neve nasconde le mine ma anche i segni di bruciato di ieri: una tregua visiva, breve ma utile.",
        "date": "25/11/2001",
        "soul": -6
      },
      {
        "title": "Kunduz falls; war rooms swap arrows for checklists",
        "titleIt": "Kunduz cade; dalle frecce alle checklist",
        "desc": "Northern Alliance takes Kunduz; front lines redraw. Commanders who drew arrows yesterday write food and fuel lists today. Less glory, more groceries: that’s how cities heal.",
        "desc_it": "L’Alleanza del Nord prende Kunduz; le linee si ridisegnano. I comandanti che ieri tracciavano frecce oggi scrivono liste di cibo e carburante. Meno gloria, più spesa: così guariscono le città.",
        "date": "26/11/2001",
        "soul": -5
      },
      {
        "title": "World AIDS Day: clinics trade stigma for schedules",
        "titleIt": "Giornata Mondiale contro l’AIDS: dagli stigma agli orari",
        "desc": "Hospitals and NGOs push testing and treatment with big-icon posters and extended hours. In several countries, churches and mosques host pop-up clinics. Suffering made a map; people make a counter-map.",
        "desc_it": "Ospedali e ONG promuovono test e cure con poster a grandi icone e orari estesi. In molti Paesi chiese e moschee ospitano ambulatori temporanei. Il dolore aveva una mappa; la gente costruisce la contro-mappa.",
        "date": "01/12/2001",
        "soul": -7
      },
      {
        "title": "Enron files for bankruptcy; governance gets a spine",
        "titleIt": "Enron dichiara bancarotta; la governance mette la spina dorsale",
        "desc": "The collapse wipes out jobs and pensions, raw harm now, but auditors, lawmakers, and investors begin stitching reforms that will become stricter audits, cleaner books, and boards that ask better questions. A bad fire for the village; better fire codes for the next one.",
        "desc_it": "Il crollo cancella posti e pensioni, danno vivo oggi, ma revisori, legislatori e investitori iniziano a cucire riforme che diventeranno controlli più severi, conti più puliti e consigli che fanno domande migliori. Un brutto incendio per il paese; norme antincendio migliori per il prossimo.",
        "date": "02/12/2001",
        "soul": 11
      },{
        "title": "Bonn Agreement: interim Afghan authority named; Karzai to lead",
        "titleIt": "Accordo di Bonn: autorità ad interim per l’Afghanistan; guida a Karzai",
        "desc": "Delegates sign a timetable for institutions and invite the world to hold them to it. It is fragile, like wet clay; but clay becomes brick when enough hands turn it and enough sun falls on it.",
        "desc_it": "I delegati firmano un calendario per le istituzioni e invitano il mondo a pretenderne il rispetto. È fragile, come argilla bagnata; ma l’argilla diventa mattone se abbastanza mani la voltano e abbastanza sole la asciuga.",
        "date": "05/12/2001",
        "soul": -8
      },
      {
        "title": "STS-108 lifts off to the ISS; cargo of oxygen, socks, and letters",
        "titleIt": "STS-108 decolla verso la ISS; carico di ossigeno, calze e lettere",
        "desc": "Shuttle Endeavour launches, delivering supplies and crew exchange. In classrooms, kids track the arc and write notes to astronauts: ordinary handwriting practicing extraordinary patience.",
        "desc_it": "Decolla lo Shuttle Endeavour con rifornimenti e cambio equipaggio. Nelle scuole i ragazzi seguono la traiettoria e scrivono biglietti agli astronauti: calligrafie normali che allenano una pazienza straordinaria.",
        "date": "05/12/2001",
        "soul": -7
      },
      {
        "title": "EU ministers reach political deal on European Arrest Warrant",
        "titleIt": "I ministri UE trovano un’intesa politica sul Mandato d’Arresto Europeo",
        "desc": "After years of files and footnotes, capitals align on a faster, fairer handover of suspects. Born from bad days, it aims to chase fewer ghosts and more criminals, with rights intact.",
        "desc_it": "Dopo anni di fascicoli e note a piè pagina, le capitali si allineano per consegne più rapide e più giuste dei ricercati. Nato da giorni cattivi, punta a inseguire meno fantasmi e più colpevoli, con i diritti intatti.",
        "date": "06/12/2001",
        "soul": -5
      },
      {
        "title": "Taliban give up Kandahar; the map exhales",
        "titleIt": "I Talebani cedono Kandahar; la mappa espira",
        "desc": "Kandahar changes hands; negotiations turn fighters into walkers headed home. Markets reopen in a cautious half-day. A boy sells pomegranates and calls them ‘grenades of sweetness.’",
        "desc_it": "Kandahar cambia mano; le trattative trasformano i combattenti in viandanti verso casa. I mercati riaprono per mezza giornata prudente. Un ragazzo vende melograni e li chiama ‘granate di dolcezza’.",
        "date": "07/12/2001",
        "soul": -6
      },
      {
        "title": "STS-108 docks; space is still a place for cooperative verbs",
        "titleIt": "STS-108 attracca; lo spazio resta il posto dei verbi cooperativi",
        "desc": "Hatch, handover, handshake: the three H’s that fix a week. While Earth argues, orbit practices civility at 7.7 km/s.",
        "desc_it": "Portello, passaggio, stretta di mano: le tre P che raddrizzano una settimana. Mentre la Terra litiga, l’orbita allena la civiltà a 7,7 km/s.",
        "date": "07/12/2001",
        "soul": -8
      },
      {
        "title": "Nobel Day: science, letters, peace, steady flames in winter",
        "titleIt": "Giorno dei Nobel: scienza, letteratura, pace, fiamme stabili d’inverno",
        "desc": "Laureates receive medals for cell cycles, catalysts, information asymmetries, and steady work for peace. Speeches say the unfashionable word ‘patience’ aloud. Students clip quotes and tape them to laptops like shields.",
        "desc_it": "I premiati ricevono medaglie per ciclo cellulare, catalisi, asimmetrie informative e lavoro paziente per la pace. Nei discorsi si pronuncia ad alta voce la parola ‘pazienza’. Gli studenti ritagliano frasi e le attaccano ai laptop come scudi.",
        "date": "10/12/2001",
        "soul": -7
      },
      {
        "title": "China formally joins the WTO; long doors swing open",
        "titleIt": "La Cina entra ufficialmente nel WTO; si aprono porte lunghe",
        "desc": "Factories and ports recalibrate for a generation. It will be messy, dislocations and debates, but millions of households get a shot at steadier lights and schoolbooks. Big systems can learn gentler math over time.",
        "desc_it": "Fabbriche e porti si ritarano per una generazione. Sarà disordinato, spostamenti e polemiche, ma milioni di famiglie avranno più luce e libri. I sistemi grandi possono imparare una matematica più gentile col tempo.",
        "date": "11/12/2001",
        "soul": -4
      },
      {
        "title": "Attack on India’s Parliament; hotlines go cold, then warmer",
        "titleIt": "Attacco al Parlamento indiano; le linee roventi si raffreddano, poi si scaldano meglio",
        "desc": "Gunmen strike New Delhi’s Parliament complex; security kills the attackers. The worst outcome, war, peers over the edge. Diplomats and generals spend the night building ramps away from it: hotlines revalidated, observers discussed, language sanded. A disaster that does not multiply is already a quieter kind of win.",
        "desc_it": "Uomini armati attaccano il complesso del Parlamento a New Delhi; la sicurezza uccide gli assalitori. Il peggio, la guerra, si affaccia. Diplomatici e militari passano la notte a costruire rampe per allontanarsene: hotline ritarate, osservatori discussi, parole levigate. Un disastro che non si moltiplica è già una vittoria più silenziosa.",
        "date": "13/12/2001",
        "soul": 10
      },
      {
        "title": "Laeken Summit: EU launches a Convention on the Future of Europe",
        "titleIt": "Vertice di Laeken: l’UE lancia la Convenzione sul Futuro dell’Europa",
        "desc": "Leaders adopt the Laeken Declaration, inviting citizens and parliaments into a long conversation about powers, rights, and clarity. Bureaucracy learns a human verb: listen.",
        "desc_it": "I leader adottano la Dichiarazione di Laeken e invitano cittadini e parlamenti a una lunga conversazione su competenze, diritti e chiarezza. La burocrazia impara un verbo umano: ascoltare.",
        "date": "15/12/2001",
        "soul": -6
      },
      {
        "title": "Pisa reopens its Leaning Tower after stabilization",
        "titleIt": "Pisa riapre la Torre Pendente dopo la stabilizzazione",
        "desc": "After years closed to save it from itself, the Tower welcomes visitors with careful quotas. A building that leaned too far learned restraint and got to stay. People do, too.",
        "desc_it": "Dopo anni di chiusura per salvarla da sé stessa, la Torre riapre con ingressi contingentati. Un edificio che pendeva troppo ha imparato il limite ed è rimasto. Vale anche per le persone.",
        "date": "15/12/2001",
        "soul": -9
      },
      {
        "title": "STS-108 lands; experiment logs and letters come home",
        "titleIt": "STS-108 atterra; tornano diari di esperimenti e lettere",
        "desc": "Endeavour glides to a stop; orbit hands stories back to ground. A class in Naples opens a package with a mission patch and a note: ‘Keep asking why.’",
        "desc_it": "Endeavour scivola all’atterraggio; l’orbita restituisce storie alla Terra. Una classe di Napoli apre un pacco con la patch di missione e un biglietto: ‘Continuate a chiedere perché’.",
        "date": "17/12/2001",
        "soul": -7
      },
      {
        "title": "Argentina’s crisis peaks; cacerolazos become community kitchens",
        "titleIt": "La crisi argentina al culmine; dai cacerolazos alle cucine di quartiere",
        "desc": "Riots, resignations, bank curbs, harm in the open. But in streets from Buenos Aires to Rosario, neighbors who banged pots last week cook in them this week, swapping recipes and childcare while assemblies map debts and ideas. A bad ending seeds better habits: mutual aid learns everyone’s name.",
        "desc_it": "Scontri, dimissioni, restrizioni bancarie, il danno è alla luce del sole. Ma tra Buenos Aires e Rosario i vicini che battevano pentole la settimana scorsa oggi ci cucinano, scambiando ricette e turni bimbi mentre le assemblee mappano debiti e proposte. Una cattiva fine semina abitudini migliori: il mutuo soccorso impara i nomi di tutti.",
        "date": "20/12/2001",
        "soul": 12
      },
      {
        "title": "UN authorizes ISAF for Kabul; Britannia to lead",
        "titleIt": "L’ONU autorizza l’ISAF per Kabul; guida britannica",
        "desc": "Resolution 1386 green-lights a security force to steady the capital. It will be small at first, but small is enough to teach bigger units where to stand and how to talk to markets without scaring them.",
        "desc_it": "La Risoluzione 1386 dà il via libera a una forza di sicurezza per stabilizzare la capitale. All’inizio sarà piccola, ma basta a insegnare a reparti più grandi dove stare e come parlare ai bazar senza spaventarli.",
        "date": "20/12/2001",
        "soul": -6
      },
      {
        "title": "‘The Lord of the Rings’ opens; audiences practice fellowship",
        "titleIt": "Esce ‘Il Signore degli Anelli’; il pubblico allena la ‘compagnia’",
        "desc": "A story about ordinary people doing hard things together arrives exactly when needed. In some cities, ushers collect phones at the door and give back candles, just for the credits. It feels right.",
        "desc_it": "Una storia di persone comuni che fanno cose difficili insieme arriva quando serve. In alcune sale gli addetti raccolgono i telefoni e restituiscono candele, solo per i titoli di coda. Sembra la cosa giusta.",
        "date": "19/12/2001",
        "soul": -5
      },
      {
        "title": "Shoe-bomber subdued mid-air; strangers remember the rope trick",
        "titleIt": "‘Shoe-bomber’ bloccato in volo; gli sconosciuti ricordano il trucco della corda",
        "desc": "On a Paris–Miami flight, passengers and crew overpower a would-be bomber. The old lesson holds: a line of human hands can be stronger than a fuse. Protocols improve the next morning.",
        "desc_it": "Su un volo Parigi–Miami passeggeri ed equipaggio fermano un aspirante attentatore. Vale la vecchia lezione: una corda di mani è più forte di una miccia. La mattina dopo i protocolli migliorano.",
        "date": "22/12/2001",
        "soul": -9
      },
      {
        "title": "Afghanistan: Interim Authority takes office in Kabul",
        "titleIt": "Afghanistan: si insedia l’Autorità ad interim a Kabul",
        "desc": "Ministers swear oaths in a building that still smells of dust and paint. The to-do list is absurd; the pens work anyway. Outside, kids kick a ball that has more patches than leather and still rolls straight.",
        "desc_it": "I ministri giurano in un edificio che odora di polvere e vernice fresca. L’elenco delle cose da fare è assurdo; le penne scrivono lo stesso. Fuori, i bambini danno calci a un pallone con più toppe che cuoio eppure dritto ci va.",
        "date": "22/12/2001",
        "soul": -8
      },
      {
        "title": "Christmas services and quiet tables from Bethlehem to Berlin",
        "titleIt": "Natale: funzioni e tavole tranquille da Betlemme a Berlino",
        "desc": "Some checkpoints open wider; some families set a place for the missing. Crises do not stop a carol learned in childhood. Soft songs get under hard doors.",
        "desc_it": "Alcuni checkpoint si allargano; molte famiglie lasciano un posto per chi manca. Le crisi non fermano un canto imparato da bambini. I canti morbidi passano sotto le porte dure.",
        "date": "24/12/2001",
        "soul": -4
      },
      {
        "title": "Euro cash ready rooms hum; last posters taped over old prices",
        "titleIt": "Le stanze dell’euro contante sono pronte; gli ultimi poster coprono i vecchi prezzi",
        "desc": "Armored vans idle; ATMs blink test codes; tills rehearse ‘dual price’ scripts. A baker in Naples draws the € sign on a paper bag and says it looks like a road with rails: ‘Good. We need both.’",
        "desc_it": "I furgoni blindati scaldano i motori; i bancomat lampeggiano codici di prova; le casse ripassano i copioni del doppio prezzo. Una panettiera a Napoli disegna il simbolo € su un sacchetto e dice che sembra una strada con le rotaie: ‘Bene. Ci servono entrambe’.",
        "date": "27/12/2001",
        "soul": -6
      },
      {
        "title": "Argentina defaults; neighborhoods keep the lights on anyway",
        "titleIt": "L’Argentina va in default; i quartieri tengono comunque le luci accese",
        "desc": "The state misses payments; credit freezes. Yet barter clubs, co-ops, and neighborhood kitchens thicken into a safety net with names and faces. From the wreckage comes a lesson exported everywhere: never outsource all your resilience.",
        "desc_it": "Lo Stato non onora i pagamenti; il credito si ghiaccia. Eppure i club del baratto, le cooperative e le cucine di quartiere si infittiscono in una rete con nomi e volti. Dalle macerie una lezione esportata ovunque: non delegare mai tutta la tua resilienza.",
        "date": "23/12/2001",
        "soul": 12
      },
      {
        "title": "UN clears ISAF expansion talk; Kabul security drills go from theory to habit",
        "titleIt": "L’ONU apre al rafforzamento dell’ISAF; gli esercizi di sicurezza passano da teoria a abitudine",
        "desc": "Patrols standardize calm routines, same hour, same words, same smiles, so markets can predict tomorrow. Peace is the most boring schedule in the world, and that’s the compliment it wants.",
        "desc_it": "Le pattuglie standardizzano routine calme, stessa ora, stesse parole, stessi sorrisi, così i bazar possono prevedere il domani. La pace è l’orario più noioso del mondo, ed è il complimento che desidera.",
        "date": "28/12/2001",
        "soul": -5
      },
      {
        "title": "Year’s end in New York: names, lights, and a million small promises",
        "titleIt": "Fine anno a New York: nomi, luci e un milione di piccole promesse",
        "desc": "Times Square plans a lighter crowd and heavier hearts; the ball will drop anyway. In boroughs and bars, people swap lists of things to keep, neighbors, numbers, nights to call. A bad year leaves; the good it forced is staying.",
        "desc_it": "Times Square prepara una folla più leggera e cuori più pesanti; la sfera scenderà comunque. Nei quartieri e nei bar ci si scambia elenchi di cose da tenere, vicini, numeri, sere per chiamarsi. Un anno cattivo se ne va; il bene che ha costretto a nascere resta.",
        "date": "31/12/2001",
        "soul": -7
      },
      {
        "title": "Midnight minus one: coins in sealed rolls, pens poised",
        "titleIt": "Mezzanotte meno uno: rotolini di monete sigillati, penne in attesa",
        "desc": "Across the eurozone, cashiers, tellers, and goblin night crews line up starter kits. The year taught Europe to breathe together; the new one hands it a shared pocketful of change. Small metal circles, large concentric hopes.",
        "desc_it": "Nell’area euro, cassieri, sportellisti e squadre notturne goblin dispongono i kit iniziali. L’anno ha insegnato all’Europa a respirare insieme; il prossimo le mette in tasca un resto condiviso. Piccoli cerchi di metallo, speranze concentriche grandi.",
        "date": "31/12/2001",
        "soul": -9
      },
                        
                                          
  ];
  const Translations = {
    en: {
      // UI Strings
      menuTitle: "Real Estate Management - Buy, sell and rent properties",
      newsTitle:
        "Real Estate Market News - Recent events affecting property values",
      owned: "Owned",
      available: "Available",
      forRent: "For Rent",
      notRenting: "Not Renting",
      buy: "Buy",
      sell: "Sell",
    startRent: "Start Rent",
      stopRent: "Stop Rent",
      info: "Info",
      // Property details
      type: "Type",
      location: "Location",
      rating: "Rating",
      price: "Price",
      occupancy: "Occupancy",
      rentStatus: "Rent Status",
      dailyIncome: "Daily Income",
      market: "Market",
      hot: "↑ Hot",
      cold: "↓ Cold",
      stable: "→ Stable",
      activeEvents: "active events",

      // Time expressions
      justNow: "Now",
      hoursAgo: "h ago",
      daysAgo: "d ago",

      // Messages
      dailyIncomeMsg: "Today's rental income: €{income} ({gold} gold)",
      propertiesOwnedMsg: "Total properties owned: {count}",
      marketUpdatedMsg: "Market updated! Check your properties for changes.",
      newsEventMsg: "News event generated! Check the news window.",
      breakingNews: "BREAKING NEWS",

      // Property types
      propertyTypes: {
        "Simple House": "Simple House",
        Apartment: "Apartment",
        Villa: "Villa",
        Hotel: "Hotel",
        Hostel: "Hostel",
        Castle: "Castle",
        Yacht: "Yacht",
        Restaurant: "Restaurant",
        "Camper Van": "Camper Van",
        "B&B": "B&B",
      },

      // Star levels
      starLevels: ["Budget", "Standard", "Quality", "Premium", "Luxury"],

      // Property suffixes
      propertySuffixes: {
        "Simple House": ["Cottage", "Residence", "Home", "Dwelling"],
        Apartment: ["Flat", "Suite", "Loft", "Residence"],
        Villa: ["Villa", "Estate", "Manor", "Retreat"],
        Hotel: ["Hotel", "Inn", "Lodge", "Resort"],
        Hostel: ["Hostel", "Backpackers", "Lodge", "Haven"],
        Castle: ["Castle", "Fortress", "Château", "Palace"],
        Yacht: ["Yacht", "Cruiser", "Vessel", "Ship"],
        Restaurant: ["Bistro", "Trattoria", "Brasserie", "Restaurant"],
        "Camper Van": ["Camper", "RV", "Mobile Home", "Van"],
        "B&B": ["B&B", "Guesthouse", "Inn", "Lodge"],
      },
    },
    it: {
      // UI Strings
      menuTitle: "Gestione Immobiliare - Compra, vendi e affitta proprietà",
      newsTitle:
        "Notizie del Mercato Immobiliare - Eventi recenti che influenzano i valori delle proprietà",
      owned: "Posseduta",
      available: "Disponibile",
      forRent: "In Affitto",
      notRenting: "Non in Affitto",
      buy: "Compra",
      sell: "Vendi",
      info: "Info",
      startRent: "Inizia Affitto",
      stopRent: "Ferma Affitto",

      // Property details
      type: "Tipo",
      location: "Posizione",
      rating: "Valutazione",
      price: "Prezzo",
      occupancy: "Occupazione",
      rentStatus: "Stato Affitto",
      dailyIncome: "Reddito Giornaliero",
      market: "Mercato",
      hot: "↑ Caldo",
      cold: "↓ Freddo",
      stable: "→ Stabile",
      activeEvents: "eventi attivi",

      // Time expressions
      justNow: "Ora",
      hoursAgo: "h fa",
      daysAgo: "g fa",

      // Messages
      dailyIncomeMsg: "Reddito da affitti di oggi: €{income} ({gold} oro)",
      propertiesOwnedMsg: "Proprietà totali possedute: {count}",
      marketUpdatedMsg:
        "Mercato aggiornato! Controlla le tue proprietà per i cambiamenti.",
      newsEventMsg:
        "Evento di cronaca generato! Controlla la finestra delle notizie.",
      breakingNews: "ULTIME NOTIZIE",

      // Property types
      propertyTypes: {
        "Simple House": "Casa Semplice",
        Apartment: "Appartamento",
        Villa: "Villa",
        Hotel: "Hotel",
        Hostel: "Ostello",
        Castle: "Castello",
        Yacht: "Yacht",
        Restaurant: "Ristorante",
        "Camper Van": "Camper",
        "B&B": "B&B",
      },

      // Star levels
      starLevels: ["Economico", "Standard", "Qualità", "Premium", "Lusso"],

      // Property suffixes
      propertySuffixes: {
        "Simple House": ["Cottage", "Residenza", "Casa", "Dimora"],
        Apartment: ["Appartamento", "Suite", "Loft", "Residenza"],
        Villa: ["Villa", "Tenuta", "Maniero", "Ritiro"],
        Hotel: ["Hotel", "Locanda", "Lodge", "Resort"],
        Hostel: ["Ostello", "Backpackers", "Lodge", "Rifugio"],
        Castle: ["Castello", "Fortezza", "Château", "Palazzo"],
        Yacht: ["Yacht", "Incrociatore", "Imbarcazione", "Nave"],
        Restaurant: ["Bistrot", "Trattoria", "Brasserie", "Ristorante"],
        "Camper Van": ["Camper", "Roulotte", "Casa Mobile", "Furgone"],
        "B&B": ["B&B", "Pensione", "Locanda", "Lodge"],
      },
    },
  };
  window.NewsData = {
    News,
    RealNews,
    Translations,
  };
})();
