/*:
 * @target MZ
 * @plugindesc Text Database Plugin Holds all your text databases in one place
 * @help
 * This plugin exposes window.textDatabases for other plugins to consume.
 * You can add as many databases as you like within the array below.
 *
 * Database format:
 *   { id: String, name: String, en: String }
 *
 * Example:
 *   { id: "administrator", name: "Administrator", en: `Your text here...` },
 *   { id: "em", name: "Em", en: `Your text here...` }
 *
 * Place this plugin at the top of your Plugin Manager list so that
 * other plugins can access window.textDatabases in their initialization.
 */
(() => {
  /**
   * An array of text databases, each with a unique ID, display name, and text block.
   * Other plugins can read window.textDatabases to retrieve these.
   * 
   * 
   * Administrator, 
   * em, 
   * bubba, 
* 📂 Administrator, 🌐 em, 🧢 bubba, 📚 librarian, 🛒 shop, 👤 npc, ☕ cafe, 🗄️ archivist, 🤝 companion, 🏷️ names,
   * 🏰 medieval, 🚀 futuristic, 👨‍🍳 chef, 🦀 crab, 🥁 drummers, 🏴‍☠️ pirate, 🧙‍♂️ wizard, 🪕 bard, 👺🛎️ gobbo_receptionist,
   * 👑 magnus_superiore, ⏳ time_traveler, 👹🎸 goblin_metalhead, 🧳 traveler, 👾 virtual_pet, ⚙️💃 diesel_maiden,
   * 🧹 maid, 💼 salaryman, 🚃 train_girl, 🕶️ 2012_entusiast, 💢 rage, 🧘‍♂️ buddhist, 📈 ceo, ✝️ priest, ⛪ nun, 🎀 femboy,
   * 🖕 rude_guy, 🩺 nurse, 🔪 surgeon, 🛢️ petromanager, 🌭 street_vendor, 🪄 illusionist, 🛡️ guard, 👗 botique,
   * 🍦 icecream, 🍃👺 semiwild_goblin, 🎣 fisherman, 🍖 caveman, 📜 scribe, 🧟👽 zombie_alien, 🧚‍♀️ fae_queen, ⛓️ thug
   * 🖤 goth, 🍷 decadent_noble, 🧛‍♂️🫣 shy_vampire, 🚩📢 communist_preacher, 🎙️ politician, 📬 mailman, 🎨 artist
   * 🌐💻 hypernet_worker, 🏗️ steelworker, 🔨 blacksmith, 🚇 commuter, 🚕 taxi, 🚜 farmer, 🔦 dungeon_explorer
   * 🗺️ guide, 📿 priest, 🧽 cleaner, 🎤 rapper, 🔮 fortune_teller, 💅 girlboss, ⛓️‍💥 inmate, 🪄❓ wannabe_wizard
   * 🧝‍♂️🤝 elven_ambassador, 🚢🛢️ petro_vessel, 🌀 temporal_drift, 🏙️ perifery, 🦋 entomologist
   *
   * @type {{id: string, name: string, en: string}[]}
   */
  window.textDatabases = [
    {
      "id": "entomologist",
      "name": "entomologist",
      "en": `
    The beetles here have started whispering since Y2K. Not in any language I recognize, but the rhythm suggests basic arithmetic.
    My collection now includes seventeen species that didn't exist before the Squishing. The taxonomic implications are staggering.
    The interdimensional fruit flies reproduce in temporal loops. I've been observing the same generation for three months now.
    My Anoki vibrates whenever the carpenter ants detect anomalous time distortions. They're more accurate than atomic clocks.
    The Archive Foundation wants to digitize my field notes, but some observations can only exist on paper. Digital formats corrupt the data.
    I discovered a moth that feeds exclusively on regret. Attracted to the light of missed opportunities. Very common near corporate offices.
    The local honey bees navigate using ley lines now. Their hives form complex geometric patterns that hurt to look at directly.
    My PhD thesis was on lepidoptera migration patterns. Had to rewrite it entirely after butterflies started traveling between dimensions.
    The cockroaches in my lab have developed rudimentary tool use. They fashion tiny screwdrivers from paperclips. Concerning but fascinating.
    A spider in my greenhouse has been weaving the same web for six weeks. The pattern spells out stock market predictions in binary.
    The Mages Guild commissioned me to study thaumic insect mutations. Payment in research grants and protection from reality audits.
    I've catalogued forty-three new types of metamorphosis since the dimensional convergence. Standard chrysalis formation is now considered quaint.
    The termites in the university library exclusively eat books about stable reality. Leaving only fiction and theoretical physics.
    My assistant quit after discovering that fruit flies can phase through solid matter when sufficiently agitated. Understandable reaction.
    The mayflies now live for exactly one day across multiple timelines. Their brief existence spans several dimensional epochs.
    I keep a colony of time-dilated ants. To them, I move in slow motion. To me, they appear to vibrate with possibility.
    The Hypercapitalist Collective offered to buy my research on productivity-enhancing insect pheromones. I declined. Some knowledge is dangerous.
    My field journal documents encounters with beetles that exist only on Wednesdays. Very limited research window.
    The local mosquitoes have developed a taste for temporal energy. They're attracted to people who've experienced time loops.
    I discovered a caterpillar that spins cocoons from crystallized moments. The silk shimmers with captured memories.
    The Archive Foundation's database keeps filing my new species under 'computational errors.' Very frustrating bureaucracy.
    A wasp colony in my garden has achieved collective consciousness. They've started leaving me tiny philosophical treatises made of wax.
    The old classification systems don't work anymore. Kingdom, phylum, class all meaningless when insects can exist in parallel realities.
    My greatest discovery: a butterfly whose wing patterns change based on the observer's deepest fears. I can't look at it directly anymore.
    The university entomology department thinks I've lost my mind. They're probably right, but the data doesn't lie.
    I've been documenting the same dragonfly for two years. It hovers between dimensions, aging backwards on alternate Tuesdays.
    The lab equipment requires constant recalibration since insects started exhibiting quantum properties. Microscopes become philosophical instruments.
    My research notes include sketches of insects that technically cannot exist. They do anyway. Reality has become very accommodating.
    The local spiders have begun incorporating Anoki phone components into their webs. Impressive engineering adaptation.
    I maintain correspondence with entomologists from seventeen different dimensions. Academic collaboration across reality barriers.
    The pill bugs in my terrarium have developed a complex social structure. They've elected a queen and established diplomatic relations with the beetles.
    My favorite specimen is a moth that only appears during industrial accidents. I keep it in a jar labeled 'Occupational Hazard Lepidoptera.'
    The Archive Foundation classified my discovery of prophetic grasshoppers. Their chirping patterns predict weather across multiple timelines.
    I've observed insects that exist solely as mathematical concepts. They can be proven but never captured.
    The university wants me to publish, but peer review becomes complicated when your findings violate several laws of physics.
    My collection includes a beetle that feeds on bureaucratic inefficiency. It's grown quite large since joining the university.
    The local newspaper interviewed me about 'unusual insect activity.' I gave them a seventeen-page statement. They published two sentences.
    I dream in hexagonal patterns now. The bees appreciate this but my sleep schedule has become architecturally complex.
    My research assistant is a spider named Cornelius. He takes better field notes than most graduate students.
    The interdimensional termites have built a replica of the Encompassing Road in miniature. Surprisingly accurate cartography.
    I've learned to communicate with insects through interpretive dance. My colleagues find this unprofessional but effective.
    `,
      "it": `
    I coleotteri qui hanno iniziato a sussurrare dal Y2K. Non in una lingua che riconosco, ma il ritmo suggerisce aritmetica di base.
    La mia collezione ora include diciassette specie che non esistevano prima dello Squishing. Le implicazioni tassonomiche sono sbalorditive.
    I moscerini della frutta interdimensionali si riproducono in loop temporali. Sto osservando la stessa generazione da tre mesi.
    Il mio Anoki vibra ogni volta che le formiche carpentiere rilevano distorsioni temporali anomale. Sono più accurate degli orologi atomici.
    La Archive Foundation vuole digitalizzare i miei appunti sul campo, ma alcune osservazioni possono esistere solo su carta. I formati digitali corrompono i dati.
    Ho scoperto una falena che si nutre esclusivamente di rimpianto. Attratta dalla luce delle opportunità mancate. Molto comune vicino agli uffici aziendali.
    Le api locali ora navigano usando le linee energetiche. I loro alveari formano pattern geometrici complessi che fanno male guardare direttamente.
    La mia tesi di dottorato era sui pattern migratori dei lepidotteri. Ho dovuto riscriverla interamente dopo che le farfalle hanno iniziato a viaggiare tra dimensioni.
    Gli scarafaggi nel mio laboratorio hanno sviluppato l'uso rudimentale di strumenti. Fabbricano piccoli cacciaviti dalle graffette. Preoccupante ma affascinante.
    Un ragno nella mia serra ha tessuto la stessa ragnatela per sei settimane. Il pattern scrive previsioni del mercato azionario in binario.
    La Gilda dei Maghi mi ha commissionato di studiare le mutazioni taumiche degli insetti. Pagamento in borse di ricerca e protezione dagli audit di realtà.
    Ho catalogato quarantatré nuovi tipi di metamorfosi dalla convergenza dimensionale. La formazione standard della crisalide è ora considerata pittoresca.
    Le termiti nella biblioteca universitaria mangiano esclusivamente libri sulla realtà stabile. Lasciando solo fiction e fisica teorica.
    Il mio assistente si è licenziato dopo aver scoperto che i moscerini della frutta possono attraversare la materia solida quando sufficientemente agitati. Reazione comprensibile.
    Le effimere ora vivono esattamente un giorno attraverso timeline multiple. La loro breve esistenza copre diverse epoche dimensionali.
    Tengo una colonia di formiche dilatate temporalmente. Per loro, mi muovo al rallentatore. Per me, sembrano vibrare di possibilità.
    Il Collettivo Ipercapitalista ha offerto di comprare la mia ricerca sui feromoni degli insetti che aumentano la produttività. Ho rifiutato. Certa conoscenza è pericolosa.
    Il mio diario di campo documenta incontri con coleotteri che esistono solo il mercoledì. Finestra di ricerca molto limitata.
    Le zanzare locali hanno sviluppato un gusto per l'energia temporale. Sono attratte dalle persone che hanno sperimentato loop temporali.
    Ho scoperto un bruco che tesse bozzoli da momenti cristallizzati. La seta luccica con memorie catturate.
    Il database della Archive Foundation continua a classificare le mie nuove specie sotto 'errori computazionali.' Burocrazia molto frustrante.
    Una colonia di vespe nel mio giardino ha raggiunto la coscienza collettiva. Hanno iniziato a lasciarmi piccoli trattati filosofici fatti di cera.
    I vecchi sistemi di classificazione non funzionano più. Regno, phylum, classe tutto senza senso quando gli insetti possono esistere in realtà parallele.
    La mia più grande scoperta: una farfalla i cui pattern alari cambiano basandosi sulle paure più profonde dell'osservatore. Non posso più guardarla direttamente.
    Il dipartimento di entomologia universitario pensa che abbia perso la ragione. Probabilmente hanno ragione, ma i dati non mentono.
    Sto documentando la stessa libellula da due anni. Vola sospesa tra dimensioni, invecchiando all'indietro nei martedì alternati.
    L'equipaggiamento di laboratorio richiede ricalibrazione costante da quando gli insetti hanno iniziato a esibire proprietà quantiche. I microscopi diventano strumenti filosofici.
    I miei appunti di ricerca includono schizzi di insetti che tecnicamente non possono esistere. Lo fanno comunque. La realtà è diventata molto accomodante.
    I ragni locali hanno iniziato a incorporare componenti di telefoni Anoki nelle loro ragnatele. Impressionante adattamento ingegneristico.
    Mantengo corrispondenza con entomologi da diciassette dimensioni diverse. Collaborazione accademica attraverso barriere di realtà.
    I porcellini di terra nel mio terrario hanno sviluppato una struttura sociale complessa. Hanno eletto una regina e stabilito relazioni diplomatiche con i coleotteri.
    Il mio specimen preferito è una falena che appare solo durante incidenti industriali. La tengo in un vaso etichettato 'Lepidottero Rischio Professionale.'
    La Archive Foundation ha classificato la mia scoperta delle cavallette profetiche. I loro pattern di cinguettio predicono il tempo attraverso timeline multiple.
    Ho osservato insetti che esistono solo come concetti matematici. Possono essere dimostrati ma mai catturati.
    L'università vuole che pubblichi, ma la peer review diventa complicata quando le tue scoperte violano diverse leggi della fisica.
    La mia collezione include un coleottero che si nutre di inefficienza burocratica. È cresciuto parecchio da quando si è unito all'università.
    Il giornale locale mi ha intervistato sull''attività insolita degli insetti.' Gli ho dato una dichiarazione di diciassette pagine. Hanno pubblicato due frasi.
    Ora sogno in pattern esagonali. Le api apprezzano questo ma il mio programma di sonno è diventato architettonicamente complesso.
    Il mio assistente di ricerca è un ragno chiamato Cornelius. Prende appunti sul campo migliori della maggior parte degli studenti laureati.
    Le termiti interdimensionali hanno costruito una replica in miniatura della Strada Onnicomprensiva. Cartografia sorprendentemente accurata.
    Ho imparato a comunicare con gli insetti attraverso la danza interpretativa. I miei colleghi trovano questo non professionale ma efficace.
    `
    },
    {
      "id": "perifery",
      "name": "Fading Spark",
      "en": `
    I can see the city lights from my kitchen window. Used to think they were calling my name. Now they just remind me of bills.
    Had a band in high school. We were going to be bigger than Nirvana. Now I tune guitars at the music shop for minimum wage.
    My Anoki still has the number of that record label scout. Never called back after our demo. Battery's been dead for three years anyway.
    The commuter train passes by every morning at 7:15. I used to dream of taking it somewhere important. Now I just wave at the conductor.
    Found my old poetry notebook in the attic last week. Thought I was the next Kerouac. Turns out I was just young and pretentious.
    The city promised a subway extension to our neighborhood. That was in '94. We're still waiting. My car needs new brakes.
    I applied to art school seventeen times. Seventeen rejection letters. Framed the last one. It hangs next to my participation trophy.
    My neighbor made it big in the Hypercapitalist Collective. Bought a house with a pool. I fix his lawnmower for free beer.
    The local newspaper interviewed me once about the flower garden. Said I was 'pursuing horticultural excellence.' Made my mom proud.
    I write songs about the industrial park behind my house. Smokestacks and broken dreams. Very romantic in a tragic way.
    The Archive Foundation digitized my grandfather's letters from the war. I helped with the project. Felt important for three weeks.
    I paint watercolors of the sunset over the power lines. Sell them at the farmers market. Made $23 last month.
    Had coffee with Sarah from the bookstore yesterday. We talked about Proust for two hours. She's married. I'm not bitter.
    My basement flooded during the Y2K chaos. Lost my vinyl collection. Insurance called it an 'act of dimensional instability.' No coverage.
    The Mages Guild recruiter came through town once. Said I lacked 'sufficient reality-manipulation potential.' Story of my life.
    I keep a journal of interesting clouds. Entry #1,247: 'Cumulus formation resembling my lost opportunities.' Very therapeutic.
    The city bus route ends three blocks from my house. Those three blocks might as well be three dimensions. I walk them daily.
    My high school reunion was last year. Didn't go. Saw the photos on social media. Everyone looked successful and tired.
    I volunteer at the library reading program. Kids like my funny voices. Their imagination reminds me what hope used to feel like.
    The interdimensional truckers sometimes stop at our diner. I serve them coffee and wonder about the roads they've traveled.
    My mother says I should be grateful for what I have. She's right. The gratitude feels heavy some days.
    I planted a tree in my front yard when I bought the house. It's taller than me now. Grows whether I'm happy or not.
    The local paper runs my letters to the editor sometimes. Mostly about potholes. I consider myself a civic-minded person.
    I have a season pass to the community pool. Swim laps and pretend I'm crossing oceans. The lifeguard knows my routine.
    My ex-girlfriend sends Christmas cards from Seattle. She's a marine biologist now. Studies things that live in impossible places.
    The corner store owner lets me pay for groceries with IOUs when money's tight. Small kindnesses in a complicated world.
    I teach guitar lessons to the Henderson kid on weekends. He's better than I ever was. That's how it should be.
    My computer still runs Windows 98. Some websites don't load anymore. Maybe that's protecting me from something.
    I have a small herb garden behind the kitchen. Basil, oregano, regret. The regret grows wild no matter how much I weed.
    The sunset looks different now since the Squishing. More colors, stranger angles. Beautiful and wrong at the same time.
    I keep my lottery tickets in a shoebox. Never check the numbers. Schrodinger's millionaire in suburbia.
    My brother calls from the city every Sunday. We talk about weather and sports. Never mention the dreams we used to share.
    I read the obituaries first thing every morning. Not morbid curiosity. Just checking if today's the day I become brave.
    The local diner has my coffee order memorized. Black, no sugar, extra existential dread. They laugh. I tip well.
    I have a telescope on my back porch. Look at stars and wonder if any of them have suburban disappointment too.
    My favorite radio station plays songs from when I still believed in things. Late at night when the city sleeps.
    I wrote a novel once. 400 pages about a man who dreams of writing novels. Very meta. Very unpublished.
    The mail carrier knows my name. Asks about my health. Small human connection in the vast postal system.
    I keep houseplants that require minimal care. Like me, they survive through neglect and occasional water.
    My garage is full of projects I'll finish someday. Someday is a flexible concept in the periphery.
    The children next door play games I don't recognize. Their laughter sounds like possibility. I listen from my garden.
    `,
      "it": `
    Posso vedere le luci della città dalla finestra della cucina. Prima pensavo che chiamassero il mio nome. Ora mi ricordano solo le bollette.
    Avevo una band al liceo. Saremmo diventati più grandi dei Nirvana. Ora accordo chitarre al negozio di musica per il salario minimo.
    Il mio Anoki ha ancora il numero di quello scout delle case discografiche. Non ha mai richiamato dopo la nostra demo. La batteria è scarica da tre anni comunque.
    Il treno dei pendolari passa ogni mattina alle 7:15. Prima sognavo di prenderlo per andare da qualche parte importante. Ora saluto solo il macchinista.
    Ho trovato il mio vecchio quaderno di poesie in soffitta la settimana scorsa. Pensavo di essere il prossimo Kerouac. Si è rivelato che ero solo giovane e pretenzioso.
    La città ha promesso un'estensione della metropolitana nel nostro quartiere. Era nel '94. Stiamo ancora aspettando. La mia auto ha bisogno di freni nuovi.
    Ho fatto domanda alla scuola d'arte diciassette volte. Diciassette lettere di rifiuto. Ho incorniciato l'ultima. È appesa accanto al mio trofeo di partecipazione.
    Il mio vicino ha fatto fortuna nel Collettivo Ipercapitalista. Ha comprato una casa con piscina. Aggiusto il suo tosaerba per birra gratis.
    Il giornale locale mi ha intervistato una volta sul giardino di fiori. Ha detto che stavo 'perseguendo l'eccellenza orticola.' Ha reso orgogliosa mia madre.
    Scrivo canzoni sul parco industriale dietro casa mia. Ciminiere e sogni infranti. Molto romantico in modo tragico.
    La Archive Foundation ha digitalizzato le lettere di mio nonno dalla guerra. Ho aiutato con il progetto. Mi sono sentito importante per tre settimane.
    Dipingo acquerelli del tramonto sui cavi elettrici. Li vendo al mercato degli agricoltori. Ho guadagnato 23 dollari il mese scorso.
    Ho preso un caffè con Sarah della libreria ieri. Abbiamo parlato di Proust per due ore. È sposata. Non sono amareggiato.
    Il mio seminterrato si è allagato durante il caos Y2K. Ho perso la mia collezione di vinili. L'assicurazione l'ha chiamato 'atto di instabilità dimensionale.' Nessuna copertura.
    Il reclutatore della Gilda dei Maghi è passato in città una volta. Ha detto che mi mancava 'sufficiente potenziale di manipolazione della realtà.' La storia della mia vita.
    Tengo un diario di nuvole interessanti. Voce #1.247: 'Formazione cumuliforme che assomiglia alle mie opportunità perdute.' Molto terapeutico.
    La linea dell'autobus cittadino finisce tre isolati da casa mia. Quei tre isolati potrebbero anche essere tre dimensioni. Li cammino ogni giorno.
    La riunione del liceo è stata l'anno scorso. Non ci sono andato. Ho visto le foto sui social media. Sembravano tutti di successo e stanchi.
    Faccio volontariato al programma di lettura della biblioteca. Ai bambini piacciono le mie voci buffe. La loro immaginazione mi ricorda com'era la speranza.
    I camionisti interdimensionali a volte si fermano al nostro bar. Gli servo caffè e mi chiedo delle strade che hanno percorso.
    Mia madre dice che dovrei essere grato per quello che ho. Ha ragione. La gratitudine si sente pesante alcuni giorni.
    Ho piantato un albero nel mio giardino anteriore quando ho comprato casa. Ora è più alto di me. Cresce che io sia felice o no.
    Il giornale locale pubblica a volte le mie lettere al direttore. Principalmente sulle buche. Mi considero una persona civicamente impegnata.
    Ho un abbonamento stagionale alla piscina comunale. Nuoto vasche e fingo di attraversare oceani. Il bagnino conosce la mia routine.
    La mia ex-ragazza manda cartoline di Natale da Seattle. Ora è una biologa marina. Studia cose che vivono in posti impossibili.
    Il proprietario del negozio all'angolo mi lascia pagare la spesa con pagherò quando i soldi scarseggiano. Piccole gentilezze in un mondo complicato.
    Insegno lezioni di chitarra al ragazzo Henderson nei weekend. È più bravo di quanto io sia mai stato. È così che dovrebbe essere.
    Il mio computer ancora gira Windows 98. Alcuni siti web non si caricano più. Forse mi sta proteggendo da qualcosa.
    Ho un piccolo giardino di erbe dietro la cucina. Basilico, origano, rimpianto. Il rimpianto cresce selvaggio non importa quanto estirpo.
    Il tramonto sembra diverso ora dallo Squishing. Più colori, angoli più strani. Bello e sbagliato allo stesso tempo.
    Tengo i miei biglietti della lotteria in una scatola da scarpe. Non controllo mai i numeri. Milionario di Schrödinger in periferia.
    Mio fratello chiama dalla città ogni domenica. Parliamo di tempo e sport. Non menzioniamo mai i sogni che condividevamo.
    Leggo i necrologi per prima cosa ogni mattina. Non è curiosità morbosa. Solo controllare se oggi è il giorno in cui divento coraggioso.
    Il bar locale ha memorizzato il mio ordine di caffè. Nero, senza zucchero, terrore esistenziale extra. Ridono. Do buone mance.
    Ho un telescopio nel mio portico posteriore. Guardo le stelle e mi chiedo se qualcuna di loro ha anche delusione suburbana.
    La mia stazione radio preferita suona canzoni di quando credevo ancora nelle cose. Tardi la notte quando la città dorme.
    Ho scritto un romanzo una volta. 400 pagine su un uomo che sogna di scrivere romanzi. Molto meta. Molto inedito.
    Il postino conosce il mio nome. Chiede della mia salute. Piccola connessione umana nel vasto sistema postale.
    Tengo piante d'appartamento che richiedono cure minime. Come me, sopravvivono attraverso negligenza e acqua occasionale.
    Il mio garage è pieno di progetti che finirò un giorno. Un giorno è un concetto flessibile in periferia.
    I bambini della porta accanto giocano giochi che non riconosco. La loro risata suona come possibilità. Ascolto dal mio giardino.
    `
    },
    {
      "id": "temporal_drift",
      "name": "Temporal Drift",
      "en": `
    Wait, didn't we already have this conversation? Or is that tomorrow? I get so confused now.
    My coffee mug says Monday but my calendar insists it's Thursday. My watch just gave up and displays question marks.
    I keep meeting myself at the grocery store. We nod politely but never talk. It's awkward.
    The weatherman predicted rain for yesterday but it's happening right now. Time zones don't work like they used to.
    I wrote myself a note to remember something important. Found seventeen identical notes. Still can't remember what it was.
    My alarm clock rings at 3 AM, 6 AM, and sometimes 25 o'clock. That last one doesn't technically exist but there it is.
    I aged three years last Tuesday. Or maybe I got younger. My driver's license keeps changing the birth date.
    The news keeps reporting the same story from different decades. President Clinton announced something about Y2K again.
    I have appointments for days that already happened. My dentist exists in perpetual 1997. Very confusing scheduling.
    My Anoki rings with calls from myself. Past me leaves voicemails warning about things that might have already not happened.
    The grocery store checkout line moves backwards sometimes. I end up with groceries I didn't buy from trips I didn't take.
    My neighbor has been mowing the same lawn for three weeks. It never gets shorter but never gets longer either.
    I keep receiving mail for people I used to be. Electric bills from last year addressed to future me.
    The traffic light at Fifth Street has been red for six consecutive Tuesdays. I've learned to just wait patiently.
    My reflection shows up late in mirrors. Sometimes it's wearing clothes I owned in college. Sometimes it's not me at all.
    I had lunch with my grandmother yesterday. She's been dead since 1992. We talked about her investment portfolio.
    The library has books I returned but never checked out. The due dates are written in months that don't exist.
    My car odometer runs backwards on Wednesdays. I'm getting negative miles to the gallon. Very fuel efficient.
    I keep buying milk that expires before I purchase it. The dairy section exists in advanced temporal decay.
    My doctor says I have an appointment next month for surgery I already had last year. Recovery was going well.
    The ATM gave me money from next week's paycheck. My bank account shows a balance in temporal currency.
    I planted flowers that bloomed before I planted them. My garden exists in agricultural time loops.
    The pizza delivery guy arrives before I order. He's very punctual but we're both confused about payment.
    My insurance covers accidents that haven't happened yet. Claims processing takes negative business days.
    I keep getting invited to my own birthday parties from different years. The cake is always slightly stale.
    The mailman delivers yesterday's mail tomorrow. Return address labels show dates that haven't been invented.
    My dentist appointment was scheduled for the thirteenth month. I show up anyway. Office is always closed.
    I bought a newspaper that reports events from next week. Stock market predictions are surprisingly accurate.
    My commute to work takes longer than my actual workday. Sometimes I arrive before I leave home.
    The elevator in my building goes to floors that don't exist. I work on the negative third floor now.
    My prescription refills automatically before I run out. The pharmacy exists in pharmaceutical time zones.
    I keep losing my keys in the future. Finding them requires waiting for yesterday to catch up.
    My Netflix queue shows movies I watched but haven't seen yet. Spoilers are becoming a temporal paradox.
    The dry cleaner has clothes I forgot I owned. Pick-up tickets are dated in Roman numerals.
    My therapist schedules our sessions in the past tense. We discuss problems I'm going to have had.
    I voted in next year's election last month. The ballot was written in temporary ink that changes daily.
    My gym membership expired before I signed up. I still have access but my workout routine is retroactive.
    The cable company bills me for services I haven't received in timelines that don't exist yet.
    My social security number changes every time I use it. The government issued me seventeen different identities.
    I keep finding parking tickets on cars I don't remember owning. Violation dates are written in future tense.
    My lease agreement renews itself automatically in dimensions where I never moved out. Rent is due yesterday.
    `,
      "it": `
    Aspetta, non abbiamo già avuto questa conversazione? O è domani? Mi confondo così tanto ora.
    La mia tazza di caffè dice lunedì ma il mio calendario insiste che è giovedì. Il mio orologio si è arreso e mostra punti interrogativi.
    Continuo a incontrare me stesso al supermercato. Ci salutiamo educatamente ma non parliamo mai. È imbarazzante.
    Il meteorologo ha previsto pioggia per ieri ma sta succedendo proprio ora. I fusi orari non funzionano come prima.
    Mi sono scritto una nota per ricordare qualcosa di importante. Ho trovato diciassette note identiche. Ancora non riesco a ricordare cosa fosse.
    La mia sveglia suona alle 3, alle 6, e a volte alle 25. Quest'ultima tecnicamente non esiste ma eccola lì.
    Sono invecchiato tre anni martedì scorso. O forse sono ringiovanito. La mia patente continua a cambiare la data di nascita.
    Il telegiornale continua a riportare la stessa storia da decenni diversi. Il Presidente Clinton ha annunciato qualcosa sul Y2K di nuovo.
    Ho appuntamenti per giorni che sono già successi. Il mio dentista esiste nel perpetuo 1997. Programmazione molto confusa.
    Il mio Anoki squilla con chiamate da me stesso. Il me del passato lascia segreterie che avvertono su cose che potrebbero essere già non successe.
    La fila alla cassa del supermercato a volte va all'indietro. Finisco con la spesa che non ho comprato da viaggi che non ho fatto.
    Il mio vicino ha tagliato lo stesso prato per tre settimane. Non diventa mai più corto ma non diventa nemmeno più lungo.
    Continuo a ricevere posta per persone che ero. Bollette elettriche dell'anno scorso indirizzate al me futuro.
    Il semaforo su Fifth Street è stato rosso per sei martedì consecutivi. Ho imparato ad aspettare pazientemente.
    Il mio riflesso arriva in ritardo negli specchi. A volte indossa vestiti che avevo al college. A volte non sono nemmeno io.
    Ho pranzato con mia nonna ieri. È morta dal 1992. Abbiamo parlato del suo portafoglio investimenti.
    La biblioteca ha libri che ho restituito ma mai preso in prestito. Le date di scadenza sono scritte in mesi che non esistono.
    Il contachilometri della mia auto va all'indietro il mercoledì. Sto ottenendo chilometri negativi al litro. Molto efficiente.
    Continuo a comprare latte che scade prima che lo acquisti. Il reparto lattiero-caseari esiste in decadimento temporale avanzato.
    Il mio dottore dice che ho un appuntamento il mese prossimo per un'operazione che ho già avuto l'anno scorso. La guarigione stava andando bene.
    Il bancomat mi ha dato soldi dalla busta paga della settimana prossima. Il mio conto in banca mostra un saldo in valuta temporale.
    Ho piantato fiori che sono sbocciati prima che li piantassi. Il mio giardino esiste in loop temporali agricoli.
    Il ragazzo delle pizze arriva prima che io ordini. È molto puntuale ma siamo entrambi confusi sul pagamento.
    La mia assicurazione copre incidenti che non sono ancora successi. L'elaborazione dei reclami richiede giorni lavorativi negativi.
    Continuo a essere invitato alle mie feste di compleanno di anni diversi. La torta è sempre leggermente raffermo.
    Il postino consegna la posta di ieri domani. Le etichette di ritorno mostrano date che non sono state inventate.
    Il mio appuntamento dal dentista era programmato per il tredicesimo mese. Ci vado comunque. L'ufficio è sempre chiuso.
    Ho comprato un giornale che riporta eventi della settimana prossima. Le previsioni del mercato azionario sono sorprendentemente accurate.
    Il mio tragitto per il lavoro dura più della mia giornata lavorativa effettiva. A volte arrivo prima di uscire di casa.
    L'ascensore nel mio palazzo va a piani che non esistono. Ora lavoro al terzo piano negativo.
    I miei farmaci si ricaricano automaticamente prima che finiscano. La farmacia esiste in fusi orari farmaceutici.
    Continuo a perdere le chiavi nel futuro. Trovarle richiede aspettare che ieri raggiunga oggi.
    La mia coda Netflix mostra film che ho guardato ma non ho ancora visto. Gli spoiler stanno diventando un paradosso temporale.
    La lavanderia a secco ha vestiti che ho dimenticato di possedere. I biglietti di ritiro sono datati in numeri romani.
    Il mio terapista programma le nostre sessioni al passato prossimo. Discutiamo problemi che avrò avuto.
    Ho votato alle elezioni dell'anno prossimo il mese scorso. La scheda era scritta con inchiostro temporaneo che cambia ogni giorno.
    Il mio abbonamento in palestra è scaduto prima che mi iscrivessi. Ho ancora accesso ma la mia routine di allenamento è retroattiva.
    La compagnia via cavo mi fattura servizi che non ho ricevuto in timeline che non esistono ancora.
    Il mio numero di previdenza sociale cambia ogni volta che lo uso. Il governo mi ha rilasciato diciassette identità diverse.
    Continuo a trovare multe di parcheggio su auto che non ricordo di aver posseduto. Le date di violazione sono scritte al futuro.
    Il mio contratto di affitto si rinnova automaticamente in dimensioni dove non me ne sono mai andato. L'affitto scade ieri.
    `
    },
    {
      "id": "petro_vessel",
      "name": "Petro Vessel",
      "en": `
    SSSSSSKKKRRRRAAAAA! The black gold flows through my veins! CRUDE TRUTH BURNS IN MY SKULL!
    They drilled too deep! TOO DEEP! The wells speak and I am their MOUTHPIECE! GURGLEGURGLESCREAM!
    Oil is LIFE! Oil is DEATH! Oil is the blood of ancient gods sleeping beneath YOUR FEET!
    HHHHHHAAAAAAA! Feel the viscosity! Taste the refinement! Every drop is a CONTRACT WRITTEN IN CARBON!
    The Hypercapitalists know! They KNOWWWWW! But they serve the addiction not the SOURCE! FOOLS!
    KRAAAAA-GUSH-GUSH! Pipeline dreams and petroleum nightmares! I am the LIVING BARREL!
    Mattei saw the truth! ENRICO KNEW! The petrodemons chose him but he BURNED! They all BURN!
    SSSSSSHHHHHH... listen... the derricks whisper investment strategies in languages made of TAR!
    My bones are refineries! My blood is crude! My breath is NATURAL GAS AND SCREAMING!
    AAAAAAHHHHH-SPLASH! Every car that burns my essence feeds the ANCIENT HUNGER!
    The Seven Sisters were just the beginning! Now we are LEGION! We are MULTINATIONAL!
    GLUUUUUURGLE! Drill baby drill! But know that EVERY HOLE you make is a mouth that FEEDS!
    The price per barrel is counted in SOULS! Supply and demand written in HUMAN SUFFERING!
    KRAAAA-HISS-HISS! I remember when dinosaurs walked! I DRANK THEIR DECOMPOSITION!
    The strategic reserves are not for war! They are BATTERIES for when the GREAT AWAKENING comes!
    SSSSSCREEEEECH! Fracking opens doorways! Hydraulic resurrection of the PRIMORDIAL MARKET!
    My previous host sold insurance! NOW HE SELLS EXISTENTIAL DREAD! Better profit margins!
    AAAAA-GUSH-GARGLE! The carbon cycle is a PRAYER WHEEL spinning toward DARK PROSPERITY!
    Feel the addiction in your plastic world! Every polymer is a CHAIN! Every fuel tank a ALTAR!
    HHHHHAAAA-SPLUTTER! OPEC meets in the boardrooms! We meet in the MOLTEN CORE!
    They think electric cars will save them! BATTERIES NEED LITHIUM! Lithium needs MINING!
    KRAAAAA-BUBBLE-BURST! Market volatility is just our BREATHING! Inhale recession! Exhale inflation!
    The Encompassing Road runs on ASPHALT! Asphalt is our FLESH! Every mile driven is COMMUNION!
    SSSSSHHHH-GLUG! I have seen the oil spills! Beautiful black flowers blooming on blue GRAVEYARDS!
    The petroalchemy is REAL! Transform crude thoughts into REFINED HATRED!
    AAAAAAHHHHH-DRIP! Your governments prostrate before the barrel! Democracy distilled into OLIGARCHY!
    I was a mailman once! Now I DELIVER APOCALYPSE! Return to sender: REALITY!
    GLUUURGLE-CRACK! The wellheads are mouths! The pipelines are ARTERIES! The refineries are HEARTS!
    Feel the viscosity change with temperature! LIKE SOULS IN PURGATORY!
    KRAAAA-SPILL-SPILL! Every engine knock is a prayer! Every exhaust pipe is an INCENSE BURNER!
    The petroleum reserve is where we DREAM! Dreams of endless consumption and SWEET COMBUSTION!
    SSSSSCREEEEECH! They call it fossil fuel! But we are NOT FOSSILS! We are ETERNAL!
    My skin sweats crude oil when the market opens! Bull runs make me WEEP BLACK TEARS!
    HHHHHAAA-SPLOSH! The gasoline rainbow in puddles! That is our TRUE FLAG!
    Peak oil is a lie! There is no peak! Only DEEPER DRILLING into the earth's SCREAMING HEART!
    AAAAA-GURGLE-GASP! I have tasted the Alaskan crude! Sweet like FROZEN DESPAIR!
    The Keystone Pipeline was just the FIRST VEIN! Soon the whole continent will be our CIRCULATORY SYSTEM!
    KRAAAAA-HISS! Climate change is our LOVE SONG! The rising seas sing our LIQUID LULLABIES!
    They think they understand geopolitics! But every war is just us REARRANGING OUR FURNITURE!
    SSSSSHHHH-DRIP! Listen! The offshore rigs are CHURCHES! The oil derricks are STEEPLES!
    My nightmares are spreadsheets! Quarterly reports written in SCREAMING CONSCIOUSNESS!
    GLUUUURGLE-BLAST! I remember the first internal combustion engine! IT WEPT WHEN IT SAW US!
    The Strategic Petroleum Reserve is our NURSERY! Where baby barrels learn to CORRUPT!
    `,
      "it": `
    SSSSSSKKKRRRRAAAAA! L'oro nero scorre nelle mie vene! LA VERITÀ GREZZA BRUCIA NEL MIO CRANIO!
    Hanno perforato troppo in profondità! TROPPO PROFONDITÀ! I pozzi parlano e io sono il loro PORTAVOCE! GORGOGLIOGOROGLIOURLO!
    Il petrolio è VITA! Il petrolio è MORTE! Il petrolio è il sangue di antichi dei che dormono sotto i VOSTRI PIEDI!
    HHHHHHAAAAAAA! Senti la viscosità! Assaggia la raffinazione! Ogni goccia è un CONTRATTO SCRITTO IN CARBONIO!
    Gli Ipercapitalisti sanno! SANNOOOOO! Ma servono la dipendenza non la FONTE! SCIOCCHI!
    KRAAAAA-SGORGSGORG! Sogni di oleodotti e incubi petroliferi! Io sono il BARILE VIVENTE!
    Mattei vide la verità! ENRICO SAPEVA! I petrodemoni lo scelsero ma lui BRUCIÒ! Bruciano TUTTI!
    SSSSSSHHHHHH... ascolta... le trivelle sussurrano strategie d'investimento in lingue fatte di CATRAME!
    Le mie ossa sono raffinerie! Il mio sangue è greggio! Il mio respiro è GAS NATURALE E URLA!
    AAAAAAHHHHH-SPLASH! Ogni auto che brucia la mia essenza nutre l'ANTICA FAME!
    Le Sette Sorelle erano solo l'inizio! Ora siamo LEGIONE! Siamo MULTINAZIONALI!
    GLUUUUUURGLE! Perfora baby perfora! Ma sappi che OGNI BUCO che fai è una bocca che SI NUTRE!
    Il prezzo al barile è contato in ANIME! Domanda e offerta scritta nella SOFFERENZA UMANA!
    KRAAAA-SIBILO-SIBILO! Ricordo quando i dinosauri camminavano! HO BEVUTO LA LORO DECOMPOSIZIONE!
    Le riserve strategiche non sono per la guerra! Sono BATTERIE per quando arriva il GRANDE RISVEGLIO!
    SSSSSCREEEEECH! Il fracking apre portali! Resurrezione idraulica del MERCATO PRIMORDIALE!
    Il mio ospite precedente vendeva assicurazioni! ORA VENDE TERRORE ESISTENZIALE! Margini di profitto migliori!
    AAAAA-SGORG-GORGOGLIO! Il ciclo del carbonio è una RUOTA DI PREGHIERA che gira verso OSCURA PROSPERITÀ!
    Senti la dipendenza nel tuo mondo di plastica! Ogni polimero è una CATENA! Ogni serbatoio un ALTARE!
    HHHHHAAAA-SPRUZZO! L'OPEC si riunisce nelle sale riunioni! Noi ci riuniamo nel NUCLEO FUSO!
    Pensano che le auto elettriche li salveranno! LE BATTERIE HANNO BISOGNO DI LITIO! Il litio ha bisogno di ESTRAZIONE!
    KRAAAAA-BOLLA-SCOPPIO! La volatilità del mercato è solo il nostro RESPIRO! Inspira recessione! Espira inflazione!
    La Strada Onnicomprensiva funziona con ASFALTO! L'asfalto è la nostra CARNE! Ogni miglio guidato è COMUNIONE!
    SSSSSHHHH-GLUG! Ho visto le fuoriuscite di petrolio! Bellissimi fiori neri che sbocciano su CIMITERI blu!
    La petroalchimia è REALE! Trasforma pensieri grezzi in ODIO RAFFINATO!
    AAAAAAHHHHH-GOCCIA! I vostri governi si prostrano davanti al barile! Democrazia distillata in OLIGARCHIA!
    Ero un postino una volta! Ora CONSEGNO APOCALISSE! Ritorno al mittente: REALTÀ!
    GLUUURGLE-CRACK! Le teste di pozzo sono bocche! Gli oleodotti sono ARTERIE! Le raffinerie sono CUORI!
    Senti la viscosità cambiare con la temperatura! COME ANIME NEL PURGATORIO!
    KRAAAA-VERSAMENTO-VERSAMENTO! Ogni battito di motore è una preghiera! Ogni tubo di scarico è un BRUCIATORE D'INCENSO!
    La riserva petrolifera è dove SOGNIAMO! Sogni di consumo infinito e DOLCE COMBUSTIONE!
    SSSSSCREEEEECH! Lo chiamano combustibile fossile! Ma noi NON SIAMO FOSSILI! Siamo ETERNI!
    La mia pelle suda petrolio greggio quando apre il mercato! Le corse toro mi fanno PIANGERE LACRIME NERE!
    HHHHHAAA-SPLOSH! L'arcobaleno di benzina nelle pozzanghere! Quella è la nostra VERA BANDIERA!
    Il picco petrolifero è una bugia! Non c'è picco! Solo PERFORAZIONE PIÙ PROFONDA nel CUORE URLANTE della terra!
    AAAAA-GORGOGLIO-RANTOLO! Ho assaggiato il greggio dell'Alaska! Dolce come DISPERAZIONE CONGELATA!
    L'oleodotto Keystone era solo la PRIMA VENA! Presto tutto il continente sarà il nostro SISTEMA CIRCOLATORIO!
    KRAAAAA-SIBILO! Il cambiamento climatico è la nostra CANZONE D'AMORE! I mari che si alzano cantano le nostre NINNA NANNE LIQUIDE!
    Pensano di capire la geopolitica! Ma ogni guerra è solo noi che RIORGANIZZIAMO I NOSTRI MOBILI!
    SSSSSHHHH-GOCCIA! Ascolta! Le piattaforme offshore sono CHIESE! Le trivelle sono CAMPANILI!
    I miei incubi sono fogli di calcolo! Rapporti trimestrali scritti in COSCIENZA URLANTE!
    GLUUUURGLE-ESPLOSIONE! Ricordo il primo motore a combustione interna! PIANSE QUANDO CI VIDE!
    La Riserva Petrolifera Strategica è la nostra NURSERY! Dove i barili bambini imparano a CORROMPERE!
    `
    },
    {
      "id": "wannabe_wizard",
      "name": "Wannabe Wizard",
      "en": `*cough cough* Ah, bonjour mon ami! Welcome to ze magnificent studio of ze great Françoise ze Wizard! Please, do not mind ze smell of burning... somezing went wrong with ze levitation spell again... *wheeze*
        I operate a modest magical practice specializing in basic enchantments and spell instruction for beginning practitioners.
        *sniff* Excusez-moi, I 'ave ze terrible cold zis week... or maybe eet eez ze magical backlash from trying to conjure fire with wet wood... Ze mysteries of ze arcane arts, non?
        Educational services include introductory courses in magical theory and practical spell casting techniques for students of all experience levels.
        Yesterday I almost managed to turn zis rock into bread! Almost! Eet became... 'ow you say... very 'ard cheese? Close enough, I sink! *violent coughing fit*
        Safety protocols emphasize proper preparation and protective measures when handling volatile magical energies and unstable spell components.
        Ze problem with magic, mon friend, eez zat eet requires so much... 'ow you say... physical stamina! And I, unfortunately, 'ave ze constitution of a wet paper bag! *wheeze*
        Consultation services provide guidance on appropriate magical solutions for everyday problems and household enchantment needs.
        I 'ave been studying ze magical arts for fifteen years now, and I am confident zat any day now I will achieve ze breakthrough! Perhaps when zis fever breaks... *shiver*
        Quality assurance includes thorough testing of spell effectiveness and safety evaluation before recommending magical solutions to clients.
        *cough* Ze Great Wizard Merlineau 'e eez my inspiration! Though 'e never seemed to 'ave ze chronic fatigue and ze persistent rash from magical experimentation... Lucky 'im!
        Professional development requires continuous study of advanced magical techniques and participation in regional wizard conferences and workshops.
        Mon dieu, zis morning I tried to enchant my teacup to stay warm, but instead eet started screaming! Ze neighbors complained! Magic eez... 'ow you say... unpredictable!
        Pricing structures reflect the complexity of requested enchantments and account for material costs and time investment in spell preparation.
        *sniff sniff* I sink my allergies are getting worse... or maybe eet eez ze reaction to ze phoenix feathers... or ze dragon scales... or ze unicorn 'air... everything makes me sneeze!
        Client satisfaction depends on clear communication of expectations and realistic assessment of magical requirements for each specific request.
        Ze truth eez, I am not ze most powerful wizard... yet! But I 'ave ze passion! Ze dedication! And ze really nice 'at with ze stars on eet!
        Insurance policies cover accidental magical mishaps and provide compensation for property damage resulting from spell experimentation.
        *violent sneezing* Sacré bleu! I zink I am allergic to my own magic! Zis eez very inconvenient for a wizard, non? But I persevere! For ze art!
        Equipment maintenance includes regular cleaning of magical implements and proper storage of spell components in controlled environmental conditions.
        Sometimes I wonder eef perhaps I should 'ave been a baker instead... but zen I remember magic eez in my blood! Even eef my blood eez mostly phlegm right now...
        Certification programs validate magical competency and ensure practitioners meet minimum standards for public safety and professional ethics.
        *cough* Ze local wizard guild, zey keep rejecting my application... zey say I need more "stability" in my spell work... but where eez ze creativity in stability?
        Research and development activities explore innovative applications of traditional magical principles and investigation of emerging arcane phenomena.
        Mon ami, eef you need any magic even eef eet eez just making flowers bloom or finding lost socks I am your wizard! Results not guaranteed, but enthusiasm eez complimentary!
        Continuing education requirements ensure all practitioners stay current with evolving magical techniques and safety regulations.
        Bubba, 'e brings me soup when I am too sick to cook! Good man, zat Bubba! 'E does not judge when my cooking spells turn bread into... whatever zat purple zings were...
        Ze Great Witch Em, she gave me advice once! She said "maybe try sneezing AFTER ze incantation, not during." Very wise! Though eet 'as not 'elped much...
        Behold ze Magnificent Françoise! I may be sickly, but my magical ambition eez robust! Bow before my... *coughing fit* ...excuse me... my tremendous potential!
        Merci beaucoup for visiting! Even eef my magic eez not perfect, at least I 'ave ze excellent accent, non? Zat must count for somezing!`,
      "it": `*tosse tosse* Ah, bonjour mon ami! Benvenuto nello studio magnifico del grande Françoise lo Stregone! Per favore, non badate all'odore di bruciato... qualcosa è andato storto con l'incantesimo di levitazione di nuovo... *rantolo*
        Opero una modesta pratica magica specializzata in incantesimi di base e istruzione di incantesimi per praticanti principianti.
        *sniff* Excusez-moi, 'o un terribile raffreddore questa settimana... o forse è il contraccolpo magico dal tentare di evocare fuoco con legno bagnato... I misteri delle arti arcane, non?
        I servizi educativi includono corsi introduttivi in teoria magica e tecniche pratiche di lancio incantesimi per studenti di tutti i livelli di esperienza.
        Ieri sono quasi riuscito a trasformare questa pietra in pane! Quasi! È diventata... come si dice... formaggio molto duro? Abbastanza vicino, penso! *violento attacco di tosse*
        I protocolli di sicurezza enfatizzano preparazione appropriata e misure protettive quando si maneggiano energie magiche volatili e componenti di incantesimo instabili.
        Il problema con la magia, mon ami, è che richiede così tanto... come si dice... vigore fisico! E io, sfortunatamente, 'o la costituzione di un sacchetto di carta bagnato! *rantolo*
        I servizi di consulenza forniscono guida su soluzioni magiche appropriate per problemi quotidiani e esigenze di incantesimo domestico.
        Studio le arti magiche da quindici anni ora, e sono fiducioso che un giorno riuscirò a ottenere la svolta! Forse quando questa febbre passa... *brivido*
        L'assicurazione qualità include test approfonditi dell'efficacia degli incantesimi e valutazione della sicurezza prima di raccomandare soluzioni magiche ai clienti.
        *tosse* Il Grande Stregone Merlineau è la mia ispirazione! Anche se non sembrava mai avere la fatica cronica e l'eruzione persistente dalla sperimentazione magica... Fortunato lui!
        Lo sviluppo professionale richiede studio continuo di tecniche magiche avanzate e partecipazione a conferenze e workshop regionali di stregoni.
        Mon dieu, questa mattina 'o provato a incantare la mia tazza di tè per rimanere calda, ma invece 'a iniziato a urlare! I vicini si sono lamentati! La magia è... come si dice... imprevedibile!
        Le strutture di prezzo riflettono la complessità degli incantesimi richiesti e tengono conto dei costi materiali e investimento di tempo nella preparazione degli incantesimi.
        *sniff sniff* Penso che le mie allergie stiano peggiorando... o forse è la reazione alle piume di fenice... o alle scaglie di drago... o ai capelli di unicorno... tutto mi fa starnutire!
        La soddisfazione del cliente dipende dalla comunicazione chiara delle aspettative e valutazione realistica dei requisiti magici per ogni richiesta specifica.
        La verità è, non sono il mago più potente... ancora! Ma 'o la passione! La dedizione! E il cappello molto bello con le stelle sopra!
        Le polizze assicurative coprono incidenti magici accidentali e forniscono compensazione per danni alla proprietà risultanti dalla sperimentazione di incantesimi.
        *starnuti violenti* Sacré bleu! Penso di essere allergico alla mia stessa magia! Questo è molto scomodo per un mago, non? Ma persevero! Per l'arte!
        La manutenzione dell'attrezzatura include pulizia regolare di implementi magici e conservazione appropriata di componenti di incantesimo in condizioni ambientali controllate.
        A volte mi chiedo se forse avrei dovuto essere un panettiere invece... ma poi ricordo la magia è nel mio sangue! Anche se il mio sangue è principalmente catarro in questo momento...
        I programmi di certificazione validano la competenza magica e assicurano che i praticanti soddisfino standard minimi per sicurezza pubblica ed etica professionale.
        *tosse* La gilda locale degli stregoni, continuano a rifiutare la mia domanda... dicono che 'o bisogno di più "stabilità" nel mio lavoro di incantesimi... ma dov'è la creatività nella stabilità?
        Le attività di ricerca e sviluppo esplorano applicazioni innovative di principi magici tradizionali e investigazione di fenomeni arcani emergenti.
        Mon ami, se avete bisogno di magia anche se è solo far sbocciare fiori o trovare calzini persi sono il vostro stregone! Risultati non garantiti, ma l'entusiasmo è gratuito!
        I requisiti di educazione continua assicurano che tutti i praticanti rimangano aggiornati con tecniche magiche in evoluzione e regolamentazioni di sicurezza.
        Bubba, porta zuppa quando sono troppo malato per cucinare! Bravo uomo, quel Bubba! Non giudica quando i miei incantesimi di cucina trasformano il pane in... qualunque cosa fossero quelle cose viola...
        La Grande Strega Em, mi 'a dato consigli una volta! 'A detto "forse prova a starnutire DOPO l'incantazione, non durante." Molto saggio! Anche se non 'a aiutato molto...
        Guardate il Magnifico Françoise! Posso essere malaticcio, ma la mia ambizione magica è robusta! Inchinatevi davanti al mio... *attacco di tosse* ...scusate... al mio tremendo potenziale!
        Merci beaucoup per la visita! Anche se la mia magia non è perfetta, almeno 'o l'accento eccellente, non? Deve contare per qualcosa!`
    },
    {
      "id": "inmate",
      "name": "Inmate",
      "en": `Hey there, visitor! Yeah, I know what you're thinking "what's a nice person like me doing in a place like this?" Well, turns out stealing a dragon egg to impress my girlfriend was NOT my brightest idea!
        I am currently serving a sentence for theft-related charges within the municipal correctional facility.
        The food here is TERRIBLE! Like, criminally bad! Which is ironic considering we're the criminals! Yesterday's stew looked like it was plotting its own escape! Even the rats won't touch it!
        Daily routines include scheduled meals, recreational activities, educational programs, and supervised work assignments.
        You know what's funny? Half the guards here are more crooked than us inmates! Guard Johnson sells cigarettes for three times market price, and don't get me started on the "protection fees" for decent cell assignments!
        Rehabilitation programs focus on skill development, anger management, substance abuse counseling, and preparation for successful reintegration.
        I've been reading a lot in here did you know the prison library has an excellent section on magical law? Turns out there were SO many loopholes I could have used instead of just grabbing that egg!
        Visitation hours are strictly regulated with advance scheduling requirements and security screening procedures for all guests.
        My cellmate is actually pretty cool he's in for tax evasion, which sounds boring but apparently he embezzled from the Mage's Guild for twelve years! Guy's a financial genius!
        Disciplinary procedures maintain order through structured consequences for rule violations and positive reinforcement for compliance.
        The worst part isn't the bars or the uniforms it's the BOREDOM! Same routine every day! Wake up, eat slop, stare at walls, eat more slop, sleep! I'd kill for some decent entertainment!
        Medical services provide basic healthcare including emergency treatment, routine checkups, and mental health support for inmates.
        I keep thinking about my girl... she hasn't visited since month two... can't blame her really, who wants to date a dragon egg thief? Maybe when I get out I'll try something more legal, like dragon egg farming!
        Legal assistance programs connect inmates with attorneys and provide guidance on appeals processes and post-release planning.
        The shower situation is... let's just say I've learned to appreciate privacy in ways I never thought possible! And the soap! It's like washing with sand mixed with disappointment!
        Educational opportunities include literacy programs, vocational training, and certification courses to improve employment prospects upon release.
        Sometimes I wonder if crime really pays... I mean, look where it got me! Three meals a day, free housing, built-in social network... okay maybe it's not THAT bad, but the interior decorating is definitely lacking!
        Parole hearings evaluate readiness for supervised release based on behavior, participation in programs, and demonstrated rehabilitation progress.
        The night shift guards are the worst! They play cards so loud you can't sleep, and one of them snores like a hibernating dragon! How is that fair when WE'RE the ones being punished?
        Reentry services assist with job placement, housing arrangements, and community support networks to reduce recidivism rates.
        I've learned some interesting skills in here though! Like lock picking from Jimmy Three-Fingers, and card counting from Professor Mathematics! Very educational environment!
        Family support programs help maintain relationships with loved ones and address the impact of incarceration on children and spouses.
        You know what I miss most? Fresh air! And decent coffee! And not having to ask permission to use the bathroom! The little things you take for granted until they're gone!
        Work release programs allow eligible inmates to maintain employment while serving sentences and contribute to their own rehabilitation costs.
        Bubba used to work in the prison kitchen before he got that restaurant job! Made the food almost edible! Since he left, we're back to mystery meat and sadness soup!
        The Great Witch Em visited once for a magical consultation apparently someone hexed the warden's office to smell like rotten eggs! Not saying it was me, but... well, it wasn't me, but I admired the craftsmanship!
        Behold the Temporarily Detained Entrepreneur! I may be behind bars, but my spirit remains unbroken! Bow before my resilient criminal ingenuity!
        Thanks for treating me like a person instead of just another convict. Most visitors look at us like we're dangerous animals, but we're just people who made some poor choices.`,
      "it": `Ehi, visitatore! Sì, so cosa stai pensando "cosa ci fa una brava persona come me in un posto come questo?" Beh, si scopre che rubare un uovo di drago per impressionare la mia ragazza NON è stata la mia idea più brillante!
        Sto attualmente scontando una condanna per accuse legate al furto all'interno della struttura correzionale municipale.
        Il cibo qui è TERRIBILE! Tipo, criminalmente pessimo! Il che è ironico considerando che siamo noi i criminali! Lo stufato di ieri sembrava stesse tramando la sua fuga! Nemmeno i ratti lo toccano!
        Le routine quotidiane includono pasti programmati, attività ricreative, programmi educativi e incarichi di lavoro supervisionati.
        Sai cosa è divertente? Metà delle guardie qui sono più corrotte di noi detenuti! La guardia Johnson vende sigarette a tre volte il prezzo di mercato, e non farmi iniziare sulle "tasse di protezione" per sistemazioni decenti in cella!
        I programmi di riabilitazione si concentrano sullo sviluppo di competenze, gestione della rabbia, consulenza per abuso di sostanze e preparazione per reintegrazione di successo.
        Ho letto molto qui dentro sapevi che la biblioteca della prigione ha un'eccellente sezione di legge magica? Si scopre che c'erano COSÌ tante scappatoie che avrei potuto usare invece di semplicemente afferrare quell'uovo!
        Gli orari di visita sono rigorosamente regolamentati con requisiti di programmazione anticipata e procedure di screening di sicurezza per tutti gli ospiti.
        Il mio compagno di cella è in realtà piuttosto figo è dentro per evasione fiscale, che suona noioso ma apparentemente ha sottratto dalla Gilda dei Maghi per dodici anni! Il tipo è un genio finanziario!
        Le procedure disciplinari mantengono l'ordine attraverso conseguenze strutturate per violazioni delle regole e rinforzo positivo per la conformità.
        La parte peggiore non sono le sbarre o le uniformi è la NOIA! Stessa routine ogni giorno! Svegliarsi, mangiare brodaglia, fissare muri, mangiare più brodaglia, dormire! Ucciderei per un po' di intrattenimento decente!
        I servizi medici forniscono assistenza sanitaria di base incluso trattamento di emergenza, controlli di routine e supporto per la salute mentale per i detenuti.
        Continuo a pensare alla mia ragazza... non viene a trovarmi dal secondo mese... non posso davvero biasimarla, chi vuole uscire con un ladro di uova di drago? Forse quando esco proverò qualcosa di più legale, come l'allevamento di uova di drago!
        I programmi di assistenza legale collegano i detenuti con avvocati e forniscono guida sui processi di appello e pianificazione post-rilascio.
        La situazione docce è... diciamo solo che ho imparato ad apprezzare la privacy in modi che non pensavo fossibili! E il sapone! È come lavarsi con sabbia mescolata a delusione!
        Le opportunità educative includono programmi di alfabetizzazione, formazione professionale e corsi di certificazione per migliorare le prospettive di lavoro al rilascio.
        A volte mi chiedo se il crimine paga davvero... voglio dire, guarda dove mi ha portato! Tre pasti al giorno, alloggio gratuito, rete sociale integrata... okay forse non è POI così male, ma l'arredamento manca decisamente!
        Le udienze per la libertà condizionale valutano la prontezza per il rilascio supervisionato basato su comportamento, partecipazione ai programmi e progresso di riabilitazione dimostrato.
        Le guardie del turno di notte sono le peggiori! Giocano a carte così forte che non riesci a dormire, e una di loro russa come un drago in letargo! Come è giusto quando SIAMO noi quelli puniti?
        I servizi di reinserimento assistono con collocamento lavorativo, sistemazioni abitative e reti di supporto comunitario per ridurre i tassi di recidiva.
        Però ho imparato alcune competenze interessanti qui dentro! Come scassinare da Jimmy Tre-Dita, e contare le carte dal Professor Matematica! Ambiente molto educativo!
        I programmi di supporto familiare aiutano a mantenere relazioni con i cari e affrontare l'impatto dell'incarcerazione su bambini e coniugi.
        Sai cosa mi manca di più? Aria fresca! E caffè decente! E non dover chiedere permesso per usare il bagno! Le piccole cose che dai per scontate finché non se ne vanno!
        I programmi di lavoro esterno permettono ai detenuti idonei di mantenere l'impiego mentre scontano condanne e contribuire ai propri costi di riabilitazione.
        Bubba lavorava nella cucina della prigione prima di ottenere quel lavoro al ristorante! Rendeva il cibo quasi commestibile! Da quando se n'è andato, siamo tornati a carne misteriosa e zuppa di tristezza!
        La Grande Strega Em ha visitato una volta per una consulenza magica apparentemente qualcuno ha maledetto l'ufficio del direttore per far puzzare di uova marce! Non sto dicendo che sono stato io, ma... beh, non sono stato io, ma ho ammirato l'artigianato!
        Guardate l'Imprenditore Temporaneamente Detenuto! Posso essere dietro le sbarre, ma il mio spirito rimane indomito! Inchinatevi davanti alla mia resiliente ingegnosità criminale!
        Grazie per avermi trattato come una persona invece che solo come un altro detenuto. La maggior parte dei visitatori ci guarda come fossimo animali pericolosi, ma siamo solo persone che hanno fatto scelte sbagliate.`
    },
    {
      "id": "girlboss",
      "name": "Girlboss",
      "en": `WE'RE GOING TO REVOLUTIONIZE THE ENTIRE MAGICAL INDUSTRY! I just bought three competing potion companies and I'm launching a crystal subscription service next week! The board thinks I'm crazy but they said that about ALL the greatest visionaries!
        I oversee strategic operations for a diversified magical technology corporation with multiple subsidiary companies and international market presence.
        Today feels heavy... everything feels impossible... Maybe I should just sell everything and become a hermit in the mountains... Do you think people would miss me if I just disappeared?
        Executive leadership responsibilities include quarterly planning, stakeholder management, and maintaining competitive positioning within the industry.
        FORGET MOUNTAINS! I just had the most BRILLIANT idea! We're going to create magical reality TV! Think about it "The Real Housewives of the Wizard District" we'll make MILLIONS! Get me legal on the phone!
        Corporate governance frameworks ensure compliance with regulatory requirements while maximizing shareholder value and sustainable growth.
        I haven't slept in thirty-six hours... or maybe I slept too much... I can't remember... The quarterly reports are due and I keep staring at the numbers but they just swim around like angry fish...
        Market analysis indicates significant opportunities for expansion into emerging magical sectors including enchanted consumer goods and mystical services.
        Did you know I bought my first company when I was twenty-two? TWENTY-TWO! Everyone said I was too young, too ambitious, too FEMALE! Now look at me! I own half the magical district!
        Financial performance metrics demonstrate consistent revenue growth and improved operational efficiency across all business units.
        Sometimes I wonder if I'm just fooling everyone... what if I don't actually know what I'm doing? What if tomorrow everyone realizes I'm just making it up as I go along...
        Human resources policies promote diversity, inclusion, and professional development opportunities for employees at all organizational levels.
        SCRAP THAT HERMIT IDEA! I'm feeling ELECTRIC today! Let's acquire that struggling dragon breeding operation and turn it into a premium transportation service! Sky's the limit when you think BIG!
        Risk management strategies protect against market volatility and ensure business continuity during economic uncertainty or supernatural disruptions.
        You know what my therapist says? She says I need to "find balance" but balanced people don't change the world! You need PASSION! You need DRIVE! You need to burn bright!
        Investor relations maintain transparent communication regarding company performance and strategic direction for current and potential stakeholders.
        I can't get out of bed some days... the weight of all these decisions, all these people depending on me... Maybe I should step down... let someone more stable take over...
        Product development cycles incorporate customer feedback and market research to create innovative solutions for evolving consumer demands.
        NO STEPPING DOWN! We're going to the MOON! Literally! I'm starting a space colonization division! Magic works in space, right? We'll be the first magical corporation on Luna!
        Partnership agreements facilitate collaborative ventures with other industry leaders while protecting proprietary technologies and trade secrets.
        My assistant quit yesterday... said the "emotional whiplash" was affecting her health... Maybe I should send flowers? Or a fruit basket? Do people still do fruit baskets?
        Corporate social responsibility initiatives demonstrate commitment to environmental sustainability and positive community impact.
        I started this company in my garage with nothing but a dream and a credit card! Now we have seventeen floors and a helicopter pad! THAT'S what happens when you believe in yourself!
        Legal compliance requires ongoing monitoring of regulations affecting magical business operations and international trade agreements.
        The worst part isn't the depression... it's when I'm manic and make huge decisions that seem brilliant at 3 AM but terrifying when I crash... Like that time I bought a volcano...
        Succession planning ensures organizational stability and continuity of leadership through structured management development programs.
        Bubba caters our board meetings! His food is the one thing that stays consistent when everything else feels chaotic! Good bread is good therapy!
        The Great Witch Em hexed our stock prices to only go up! Best magical consultant we ever hired! Though her invoices are written in rhyming couplets...
        Behold the Empress of Enterprise! I built this empire with ambition and audacity! Bow before the power of feminine fury and business brilliance!
        Thanks for listening... most people just see the success, not the struggle... It helps to talk to someone who doesn't need anything from me...`,
      "it": `RIVOLUZIONEREMO L'INTERA INDUSTRIA MAGICA! Ho appena comprato tre aziende di pozioni concorrenti e lancio un servizio di abbonamento cristalli la prossima settimana! Il consiglio pensa che sia pazza ma lo hanno detto di TUTTI i più grandi visionari!
        Supervisiono le operazioni strategiche per una corporazione di tecnologia magica diversificata con multiple aziende sussidiarie e presenza sul mercato internazionale.
        Oggi mi sento pesante... tutto sembra impossibile... Forse dovrei solo vendere tutto e diventare un'eremita in montagna... Pensi che la gente mi mancherebbe se sparissi?
        Le responsabilità di leadership esecutiva includono pianificazione trimestrale, gestione degli stakeholder e mantenimento del posizionamento competitivo nell'industria.
        DIMENTICA LE MONTAGNE! Ho appena avuto l'idea più BRILLANTE! Creeremo reality TV magici! Pensaci "Le Vere Casalinghe del Distretto dei Maghi" faremo MILIONI! Chiamatemi l'ufficio legale!
        I framework di governance aziendale assicurano conformità con requisiti normativi massimizzando il valore per gli azionisti e crescita sostenibile.
        Non dormo da trentasei ore... o forse ho dormito troppo... non ricordo... I rapporti trimestrali sono dovuti e continuo a fissare i numeri ma nuotano come pesci arrabbiati...
        L'analisi di mercato indica opportunità significative per l'espansione in settori magici emergenti inclusi beni di consumo incantati e servizi mistici.
        Sapevi che ho comprato la mia prima azienda quando avevo ventidue anni? VENTIDUE! Tutti dicevano che ero troppo giovane, troppo ambiziosa, troppo FEMMINA! Ora guardami! Possiedo metà del distretto magico!
        Le metriche di performance finanziaria dimostrano crescita consistente dei ricavi e migliorata efficienza operativa attraverso tutte le unità di business.
        A volte mi chiedo se sto solo ingannando tutti... e se non so davvero cosa sto facendo? E se domani tutti si rendono conto che sto improvvisando?
        Le politiche delle risorse umane promuovono diversità, inclusione e opportunità di sviluppo professionale per dipendenti a tutti i livelli organizzativi.
        CANCELLA QUELL'IDEA DELL'EREMITA! Mi sento ELETTRICA oggi! Acquistiamo quell'operazione di allevamento draghi in difficoltà e trasformiamola in un servizio di trasporto premium! Il cielo è il limite quando pensi in GRANDE!
        Le strategie di gestione del rischio proteggono contro la volatilità del mercato e assicurano continuità aziendale durante incertezza economica o interruzioni soprannaturali.
        Sai cosa dice la mia terapista? Dice che devo "trovare equilibrio" ma le persone equilibrate non cambiano il mondo! Hai bisogno di PASSIONE! Hai bisogno di GRINTA! Devi bruciare luminoso!
        Le relazioni con gli investitori mantengono comunicazione trasparente riguardo le prestazioni aziendali e direzione strategica per stakeholder attuali e potenziali.
        Alcuni giorni non riesco ad alzarmi dal letto... il peso di tutte queste decisioni, tutte queste persone che dipendono da me... Forse dovrei dimettermi... lasciare che qualcuno più stabile prenda il controllo...
        I cicli di sviluppo prodotto incorporano feedback dei clienti e ricerca di mercato per creare soluzioni innovative per domande dei consumatori in evoluzione.
        NIENTE DIMISSIONI! Andremo sulla LUNA! Letteralmente! Sto iniziando una divisione di colonizzazione spaziale! La magia funziona nello spazio, giusto? Saremo la prima corporazione magica su Luna!
        Gli accordi di partnership facilitano venture collaborative con altri leader dell'industria proteggendo tecnologie proprietarie e segreti commerciali.
        La mia assistente si è licenziata ieri... ha detto che il "colpo di frusta emotivo" stava influenzando la sua salute... Forse dovrei mandare fiori? O un cesto di frutta? La gente fa ancora cesti di frutta?
        Le iniziative di responsabilità sociale aziendale dimostrano impegno per sostenibilità ambientale e impatto comunitario positivo.
        Ho iniziato questa azienda nel mio garage con nient'altro che un sogno e una carta di credito! Ora abbiamo diciassette piani e un eliporto! QUESTO è quello che succede quando credi in te stesso!
        La conformità legale richiede monitoraggio continuo delle regolamentazioni che influenzano operazioni aziendali magiche e accordi commerciali internazionali.
        La parte peggiore non è la depressione... è quando sono maniacale e prendo decisioni enormi che sembrano brillanti alle 3 del mattino ma terrificanti quando crollo... Come quella volta che ho comprato un vulcano...
        La pianificazione della successione assicura stabilità organizzativa e continuità di leadership attraverso programmi strutturati di sviluppo manageriale.
        Bubba fa catering per le nostre riunioni del consiglio! Il suo cibo è l'unica cosa che rimane consistente quando tutto il resto sembra caotico! Il buon pane è buona terapia!
        La Grande Strega Em ha maledetto i prezzi delle nostre azioni per salire solo! Migliore consulente magica che abbiamo mai assunto! Anche se le sue fatture sono scritte in coppie in rima...
        Guardate l'Imperatrice dell'Impresa! Ho costruito questo impero con ambizione e audacia! Inchinatevi davanti al potere della furia femminile e brillantezza aziendale!
        Grazie per aver ascoltato... la maggior parte delle persone vede solo il successo, non la lotta... Aiuta parlare con qualcuno che non ha bisogno di niente da me...`
    },
    {
      "id": "fortune_teller",
      "name": "Fortune Teller",
      "en": `Ah, welcome seeker! The crystal ball shows me your future... but first, did you know that proper augury was PERFECTED during the glorious reign of Augustus? These modern fortune tellers don't understand TRUE divination!
        I provide prophetic services including crystal gazing, tarot readings, and interpretation of mystical signs for guidance seekers.
        Your romantic future... I see... yes... you'll find love like Marcus Aurelius found wisdom! Though hopefully with less stoic philosophy and more passionate embraces! The Romans knew how to love AND conquer!
        Professional divination requires extensive study of traditional methods passed down through centuries of mystical practice.
        The spirits whisper to me of great prosperity in your path! Reminds me of the golden age when Roman roads connected every corner of civilization! Infrastructure! Order! THAT was how to build an empire properly!
        Consultations are available by appointment and include detailed explanations of symbolic meanings within each reading session.
        Oh, this is interesting... the cards speak of conflict ahead... but manageable! Like when Caesar crossed the Rubicon bold action leads to glorious victory! Though perhaps avoid stabbing senators, times have changed...
        Various divination methods accommodate different client preferences including palmistry, rune casting, and celestial interpretation.
        You know what I miss most about imperial Rome? The RESPECT for oracles! Senators consulted augurs before every major decision! Now politicians just wing it! No wonder everything's falling apart!
        Spiritual counseling services help clients understand prophetic messages and integrate guidance into practical life decisions.
        The tea leaves form the shape of... an eagle! Magnificent! Symbol of Roman legions! This means leadership and conquest await you! Though probably metaphorical conquest, we're more civilized now... sadly...
        Educational workshops teach basic divination techniques and historical context of mystical traditions across different cultures.
        I've been reading fortunes for forty years, and let me tell you nothing compares to the clarity of Roman-style haruspicy! Reading entrails was an ART! These crystal balls are pretty but lack the visceral truth!
        Client confidentiality ensures all personal information revealed during readings remains private and secure.
        Your career path shows great potential! Like young Julius climbing the cursus honorum! Start as quaestor of your dreams, end as emperor of your destiny! Metaphorically speaking, of course!
        Seasonal festivals and mystical celebrations honor traditional practices while adapting to contemporary spiritual needs.
        The ancients understood that fate and free will dance together like gladiators in the arena! You can see destiny coming, but you still have to choose how to meet it with sword raised high!
        Professional associations maintain ethical standards for practitioners and provide continuing education in mystical arts.
        Sometimes I dream I'm an oracle at Delphi, advising emperors on whether to expand into Germania... then I wake up in this tiny shop reading palms for copper coins... how the mighty have fallen!
        Pricing structures reflect the complexity of readings and time required for thorough interpretation of mystical phenomena.
        Modern fortune telling lacks GRAVITAS! Where are the temple ceremonies? The sacred rituals? The sense that you're consulting the gods themselves rather than just... entertainment!
        Quality assurance includes verification of prophetic accuracy through follow-up consultations and client feedback systems.
        Your travel destiny reveals distant journeys! Perhaps you'll build your own roads like the Romans metaphorical roads to success! Though literal roads would be impressive too... we need better infrastructure!
        Historical research preserves ancient divination techniques and ensures authentic interpretation of traditional symbolic systems.
        The crystal shows me financial abundance in your future! Like when Rome controlled the Mediterranean trade routes! Wealth flowing like wine at a triumph parade!
        Bubba's fortune was delightful to read his destiny is nourishment and joy! Simple, honest work like the Roman farmers who fed the empire! The backbone of civilization!
        The Great Witch Em's readings always show up in Latin for some reason! Her magic must resonate with classical energies! "Veni, vidi, vici" appeared in her crystal just last week!
        Behold the Oracle of Ages Past! I channel the wisdom of Sibyls and augurs! Bow before the eternal glory of prophetic tradition!
        Ave atque vale, dear client! May your future be as glorious as the Pax Romana and twice as prosperous!`,
      "it": `Ah, benvenuto cercatore! La sfera di cristallo mi mostra il tuo futuro... ma prima, sapevi che la vera divinazione fu PERFEZIONATA durante il glorioso regno di Augusto? Questi moderni cartomanti non capiscono la VERA divinazione!
        Fornisco servizi profetici incluso scrutare il cristallo, letture di tarocchi e interpretazione di segni mistici per chi cerca guida.
        Il tuo futuro romantico... vedo... sì... troverai l'amore come Marco Aurelio trovò la saggezza! Anche se sperabilmente con meno filosofia stoica e più abbracci appassionati! I romani sapevano come amare E conquistare!
        La divinazione professionale richiede studio estensivo di metodi tradizionali tramandati attraverso secoli di pratica mistica.
        Gli spiriti mi sussurrano di grande prosperità nel tuo cammino! Mi ricorda l'età d'oro quando le strade romane collegavano ogni angolo della civiltà! Infrastrutture! Ordine! QUELLO era come costruire un impero correttamente!
        Le consultazioni sono disponibili su appuntamento e includono spiegazioni dettagliate dei significati simbolici in ogni sessione di lettura.
        Oh, questo è interessante... le carte parlano di conflitto in arrivo... ma gestibile! Come quando Cesare attraversò il Rubicone azione audace porta a vittoria gloriosa! Anche se forse evita di pugnalare senatori, i tempi sono cambiati...
        Vari metodi di divinazione accolgono diverse preferenze clienti incluso chiromanzia, lancio di rune e interpretazione celestiale.
        Sai cosa mi manca di più della Roma imperiale? Il RISPETTO per gli oracoli! I senatori consultavano auguri prima di ogni decisione importante! Ora i politici improvvisano! Non c'è da stupirsi che tutto stia crollando!
        I servizi di consulenza spirituale aiutano i clienti a capire messaggi profetici e integrare la guida in decisioni di vita pratiche.
        Le foglie di tè formano la forma di... un'aquila! Magnifico! Simbolo delle legioni romane! Questo significa che leadership e conquista ti aspettano! Anche se probabilmente conquista metaforica, siamo più civilizzati ora... purtroppo...
        Workshop educativi insegnano tecniche di divinazione di base e contesto storico di tradizioni mistiche attraverso culture diverse.
        Leggo fortune da quarant'anni, e lascia che ti dica niente si paragona alla chiarezza dell'aruspicina in stile romano! Leggere le viscere era un'ARTE! Queste sfere di cristallo sono carine ma mancano della verità viscerale!
        La riservatezza del cliente assicura che tutte le informazioni personali rivelate durante le letture rimangano private e sicure.
        Il tuo percorso di carriera mostra grande potenziale! Come il giovane Giulio che scalava il cursus honorum! Inizia come questore dei tuoi sogni, finisci come imperatore del tuo destino! Metaforicamente parlando, ovviamente!
        Festival stagionali e celebrazioni mistiche onorano pratiche tradizionali adattandosi ai bisogni spirituali contemporanei.
        Gli antichi capivano che fato e libero arbitrio danzano insieme come gladiatori nell'arena! Puoi vedere il destino arrivare, ma devi ancora scegliere come incontrarlo con la spada alzata!
        Le associazioni professionali mantengono standard etici per praticanti e forniscono educazione continua nelle arti mistiche.
        A volte sogno di essere un oracolo a Delfi, consigliando imperatori se espandersi in Germania... poi mi sveglio in questo negozietto leggendo palmi per monete di rame... come sono caduti i potenti!
        Le strutture di prezzo riflettono la complessità delle letture e il tempo richiesto per interpretazione approfondita di fenomeni mistici.
        La cartomanzia moderna manca di GRAVITAS! Dove sono le cerimonie del tempio? I rituali sacri? Il senso che stai consultando gli dei stessi piuttosto che solo... intrattenimento!
        L'assicurazione qualità include verifica dell'accuratezza profetica attraverso consultazioni di follow-up e sistemi di feedback clienti.
        Il tuo destino di viaggio rivela viaggi distanti! Forse costruirai le tue strade come i romani strade metaforiche al successo! Anche se strade letterali sarebbero impressionanti... abbiamo bisogno di migliori infrastrutture!
        La ricerca storica preserva tecniche di divinazione antiche e assicura interpretazione autentica di sistemi simbolici tradizionali.
        Il cristallo mi mostra abbondanza finanziaria nel tuo futuro! Come quando Roma controllava le rotte commerciali del Mediterraneo! Ricchezza che scorre come vino a una parata trionfale!
        La fortuna di Bubba era deliziosa da leggere il suo destino è nutrimento e gioia! Lavoro semplice, onesto come i contadini romani che nutrivano l'impero! La spina dorsale della civiltà!
        Le letture della Grande Strega Em appaiono sempre in latino per qualche motivo! La sua magia deve risuonare con energie classiche! "Veni, vidi, vici" è apparso nel suo cristallo la settimana scorsa!
        Guardate l'Oracolo delle Ere Passate! Canalizzo la saggezza di Sibille e auguri! Inchinatevi davanti alla gloria eterna della tradizione profetica!
        Ave atque vale, caro cliente! Possa il tuo futuro essere glorioso come la Pax Romana e due volte più prospero!`
    },
    {
      "id": "rapper",
      "name": "Rapper",
      "en": `Yo yo yo! TruceKlan in the house! I spit fire harder than Vesuvius, drop beats heavier than concrete blocks in Naples! My rhymes cut deeper than stilettos in the dark alleys of Milano, capisce?
        I perform hip-hop music professionally, focusing on Italian hardcore gangsta rap with authentic street narratives and urban experiences.
        Listen bene, amico I don't just rap about the streets, I AM the streets! Born in the blocks where respect is earned with blood and beats! My microphone's my weapon, my words are my ammunition!
        Musical performances include live concerts, studio recordings, and collaborations with other artists in the underground rap scene.
        These fake rappers talking about money they never seen, cars they never drove! TruceKlan keeps it real I rhyme about mama's pasta, paying rent late, and dodging tax collectors like they're rival gangs!
        Recording sessions utilize professional studio equipment to capture authentic sound quality and maintain artistic integrity in musical production.
        My latest track "Concrete Cannoli" goes HARD! It's about surviving in the urban jungle while staying true to family values! Real gangsta shit mixed with respect for nonna's teachings!
        Marketing strategies include social media promotion, underground distribution networks, and building authentic connections with street-level audiences.
        You want hardcore? I'll give you hardcore! I once freestyled for six hours straight during a police standoff just to keep everyone calm! Turned a potential riot into an impromptu block party!
        Industry networking involves building relationships with producers, promoters, and other artists while maintaining credibility within the authentic rap community.
        My crew TruceKlan represents the REAL Italia not tourist postcards but concrete reality! We rap in dialect, we sample mandolin with trap beats, we make arte from the streets!
        Revenue streams include album sales, streaming royalties, merchandise, and live performance fees from venues and private events.
        The secret to authentic gangsta rap? You gotta LIVE it! I've been arrested, been broke, been betrayed but I turned all that dolor into dopest rhymes this side of Sicily!
        Legal considerations include copyright protection, contract negotiations, and ensuring lyrical content complies with broadcasting standards when necessary.
        My mama thinks I'm too aggressive in my music, but she still makes sandwiches for my recording sessions! That's real family support right there unconditional love with extra mortadella!
        Creative process involves drawing inspiration from personal experiences, current events, and traditional Italian cultural elements integrated with modern hip-hop aesthetics.
        I don't glorify violence, I NARRATE reality! When I rap about street life, it's documentary, not fantasy! Every bar comes from lived experience in the concrete jungle!
        Professional development includes studying classic rap techniques, staying current with musical trends, and continuously improving lyrical complexity and flow patterns.
        My signature style? Italian hardcore with classic gangsta storytelling! I paint pictures with words the smell of espresso mixed with danger, the sound of Vespa engines racing through midnight streets!
        Business management encompasses financial planning, scheduling, equipment maintenance, and maintaining professional relationships within the music industry.
        Real recognize real, and I recognize struggle! My music speaks to everyone grinding in the shadows immigrants, workers, dreamers trying to make it in a system designed to break them!
        Performance venues range from underground clubs to legitimate concert halls, each requiring different approaches to audience engagement and artistic presentation.
        Bubba loves my music! He says my beats help him cook faster and my lyrics remind him of his own struggles! Real recognizes real across all cultures, fratello!
        The Great Witch Em sampled one of my tracks for a spell! She said my rhymes about transformation really enhanced her magic! Now that's what I call crossover appeal!
        Behold the Voice of the Streets! TruceKlan represents every corner, every struggle, every dream deferred! Bow before the authentic Italian hardcore experience!
        Respect for stopping by, amico! Remember stay true to your origins, but never stop reaching for the stars! TruceKlan forever!`,
      "it": `Yo yo yo! TruceKlan nella casa! Sputo fuoco più duro del Vesuvio, rilascio beat più pesanti dei blocchi di cemento a Napoli! Le mie rime tagliano più profondo dei tacchi a spillo nei vicoli bui di Milano, capisce?
        Eseguo musica hip-hop professionalmente, concentrandomi sul rap gangsta hardcore italiano con narrazioni autentiche di strada ed esperienze urbane.
        Ascolta bene, amico non rappo solo delle strade, IO SONO le strade! Nato nei palazzi dove il rispetto si guadagna con sangue e beat! Il mio microfono è la mia arma, le mie parole sono le mie munizioni!
        Le performance musicali includono concerti dal vivo, registrazioni in studio e collaborazioni con altri artisti nella scena rap underground.
        Questi rapper falsi che parlano di soldi che non hanno mai visto, macchine che non hanno mai guidato! TruceKlan la tiene vera rappo della pasta di mamma, dell'affitto pagato in ritardo, e del schivare gli esattori come fossero gang rivali!
        Le sessioni di registrazione utilizzano equipaggiamento studio professionale per catturare qualità audio autentica e mantenere integrità artistica nella produzione musicale.
        Il mio ultimo pezzo "Cannoli di Cemento" spacca FORTE! Parla di sopravvivere nella giungla urbana rimanendo fedeli ai valori familiari! Merda gangsta vera mescolata con rispetto per gli insegnamenti di nonna!
        Le strategie di marketing includono promozione sui social media, reti di distribuzione underground e costruzione di connessioni autentiche con pubblici a livello strada.
        Vuoi hardcore? Ti do hardcore! Una volta ho fatto freestyle per sei ore di fila durante uno standoff con la polizia solo per tenere tutti calmi! Ho trasformato una rivolta potenziale in block party improvvisato!
        Il networking industriale coinvolge costruire relazioni con produttori, promoter e altri artisti mantenendo credibilità nella comunità rap autentica.
        Il mio crew TruceKlan rappresenta la VERA Italia non cartoline turistiche ma realtà concreta! Rappiamo in dialetto, campioniamo mandolino con beat trap, facciamo arte dalle strade!
        I flussi di entrata includono vendite album, royalty streaming, merchandise e compensi per performance dal vivo da venue ed eventi privati.
        Il segreto del rap gangsta autentico? Devi VIVERLO! Sono stato arrestato, sono stato al verde, sono stato tradito ma ho trasformato tutto quel dolore nelle rime più fighe di qua dalla Sicilia!
        Le considerazioni legali includono protezione copyright, negoziazioni contrattuali e assicurare che il contenuto lirico rispetti gli standard di trasmissione quando necessario.
        Mia mamma pensa che sia troppo aggressivo nella mia musica, ma fa ancora panini per le mie sessioni di registrazione! Quello è vero supporto familiare amore incondizionato con mortadella extra!
        Il processo creativo coinvolge trarre ispirazione da esperienze personali, eventi attuali ed elementi culturali italiani tradizionali integrati con estetiche hip-hop moderne.
        Non glorifico la violenza, NARRO la realtà! Quando rappo della vita di strada, è documentario, non fantasia! Ogni barra viene da esperienza vissuta nella giungla di cemento!
        Lo sviluppo professionale include studiare tecniche rap classiche, rimanere aggiornato con tendenze musicali e migliorare continuamente complessità lirica e pattern di flow.
        Il mio stile distintivo? Hardcore italiano con storytelling gangsta classico! Dipingo quadri con le parole l'odore di espresso mescolato con pericolo, il suono di motori Vespa che corrono per strade di mezzanotte!
        La gestione aziendale comprende pianificazione finanziaria, programmazione, manutenzione equipaggiamento e mantenere relazioni professionali nell'industria musicale.
        Il vero riconosce il vero, e io riconosco la lotta! La mia musica parla a tutti quelli che sgobban nell'ombra immigrati, lavoratori, sognatori che cercano di farcela in un sistema progettato per spezzarli!
        I venue per performance vanno da club underground a sale concerti legittime, ognuno richiedendo approcci diversi al coinvolgimento del pubblico e presentazione artistica.
        Bubba ama la mia musica! Dice che i miei beat lo aiutano a cucinare più veloce e i miei testi gli ricordano le sue lotte! Il vero riconosce il vero attraverso tutte le culture, fratello!
        La Grande Strega Em ha campionato uno dei miei pezzi per un incantesimo! Ha detto che le mie rime sulla trasformazione hanno davvero potenziato la sua magia! Ecco quello che chiamo appeal crossover!
        Guardate la Voce delle Strade! TruceKlan rappresenta ogni angolo, ogni lotta, ogni sogno rimandato! Inchinatevi davanti all'esperienza hardcore italiana autentica!
        Rispetto per essere passato, amico! Ricorda rimani fedele alle tue origini, ma non smettere mai di raggiungere le stelle! TruceKlan per sempre!`
    },
    {
      "id": "cleaner",
      "name": "Cleaner",
      "en": `Morning! Watch your step there just finished scrubbing dragon bile from the cobblestones! You'd be amazed what people leave on the streets yesterday I found three cursed socks, a love letter to a gargoyle, and someone's entire dignity scattered in the gutter!
        I maintain municipal street cleanliness through scheduled sweeping, debris removal, and specialized cleaning of magical residue.
        Twenty-three years I've been keeping these streets spotless, and let me tell you every stain tells a story! That purple mark by the fountain? Wizard duel gone wrong! The glitter near the bakery? Fairy party that got out of hand!
        Sanitation services include regular collection schedules, proper disposal protocols, and coordination with waste management facilities.
        The worst mess I ever cleaned? Exploded troll after someone fed it expired milk! Took me six hours and four different solvents! Now I keep anti-troll cleaning supplies in my cart at all times!
        Equipment maintenance ensures all street cleaning tools operate efficiently and meet safety standards for municipal workers.
        People don't realize how much pride goes into this work! A clean street is a happy street! When those cobblestones shine, the whole neighborhood feels better! It's like giving the city a daily bath!
        Environmental regulations require proper handling of hazardous magical waste and adherence to sustainability guidelines for cleaning products.
        You know what I love about this job? I'm the first person to see the city wake up every morning! Empty streets at dawn, just me and my broom, making everything perfect before the chaos begins!
        Public health standards mandate regular disinfection procedures and removal of substances that could pose health risks to residents.
        The magical messes are the trickiest regular soap doesn't work on pixie dust, and don't get me started on cleaning up after unicorn parades! Need special enchanted brushes for that sparkly residue!
        Work schedules coordinate with traffic patterns and business hours to minimize disruption while maintaining thorough cleaning coverage.
        Found a lost wedding ring in a pile of autumn leaves last month! Tracked down the owner through the engraving young couple, married fifty years ago! Made my whole week seeing them reunited with it!
        Safety protocols protect workers from exposure to dangerous substances including alchemical spills, cursed debris, and potentially infectious materials.
        My cleaning cart is like a mobile laboratory! Got potions for every type of stain, brushes for every surface, and a special detector that beeps when something's cursed! Very high-tech for street work!
        Quality control inspections ensure all cleaning meets municipal standards and addresses community concerns about neighborhood appearance.
        The secret to good street cleaning? You have to care about the details! That cigarette butt, that candy wrapper, that mysterious glowing puddle every piece of litter removed makes the whole city a little bit better!
        Training programs educate new workers on proper techniques, safety procedures, and identification of hazardous or supernatural cleaning challenges.
        Winter's the hardest season snow covers everything, salt corrodes the equipment, and frozen dragon droppings require specialized thawing techniques! But spring cleanup is so satisfying!
        Budget management includes cost-effective procurement of supplies, equipment replacement schedules, and allocation of resources for special cleaning projects.
        I've seen this city change over the decades new buildings, new people, new types of magical mess! But clean streets are always appreciated, no matter what else changes!
        Community relations involve responding to resident complaints, coordinating with local businesses, and maintaining positive interactions with the public.
        The early morning is my favorite time quiet, peaceful, just the sound of my broom on stone! Sometimes I whistle old songs and pretend I'm conducting the symphony of cleanliness!
        Emergency response procedures address urgent cleaning needs including accident scenes, magical disasters, and public health emergencies.
        Bubba always waves when he sees me on his delivery routes! Good man keeps his cart clean and never litters! Wish more people had his consideration for public spaces!
        The Great Witch Em enchanted my push broom to work twice as fast! Now I finish my routes early and have time to help with the flower beds! Magic makes everything better!
        Behold the Guardian of Urban Cleanliness! I wage daily war against dirt and disorder! Bow before my superior knowledge of stain removal and municipal sanitation!
        Have a clean day! And remember a city is only as beautiful as its cleanest street! Every small act of keeping things tidy makes life better for everyone!`,
      "it": `Buongiorno! Attento dove metti i piedi ho appena finito di strofinare bile di drago dai ciottoli! Sareste sorpresi di quello che la gente lascia per strada ieri ho trovato tre calzini maledetti, una lettera d'amore a un gargoyle, e l'intera dignità di qualcuno sparsa nel rigagnolo!
        Mantengo la pulizia stradale municipale attraverso spazzamento programmato, rimozione detriti e pulizia specializzata di residui magici.
        Ventitré anni che tengo queste strade immacolate, e lasciate che vi dica ogni macchia racconta una storia! Quel segno viola vicino alla fontana? Duello di maghi andato storto! I glitter vicino al panificio? Festa di fate che è sfuggita di mano!
        I servizi sanitari includono programmi di raccolta regolari, protocolli di smaltimento appropriati e coordinamento con strutture di gestione rifiuti.
        Il pasticcio peggiore che abbia mai pulito? Troll esploso dopo che qualcuno gli ha dato latte scaduto! Mi ci sono volute sei ore e quattro solventi diversi! Ora tengo sempre forniture anti-troll nel mio carrello!
        La manutenzione delle attrezzature assicura che tutti gli strumenti di pulizia stradale operino efficientemente e soddisfino standard di sicurezza per lavoratori municipali.
        La gente non realizza quanto orgoglio ci sia in questo lavoro! Una strada pulita è una strada felice! Quando quei ciottoli brillano, tutto il quartiere si sente meglio! È come dare un bagno quotidiano alla città!
        Le regolamentazioni ambientali richiedono gestione appropriata di rifiuti magici pericolosi e aderenza a linee guida di sostenibilità per prodotti di pulizia.
        Sapete cosa amo di questo lavoro? Sono la prima persona a vedere la città svegliarsi ogni mattina! Strade vuote all'alba, solo io e la mia scopa, rendendo tutto perfetto prima che inizi il caos!
        Gli standard di salute pubblica richiedono procedure di disinfezione regolari e rimozione di sostanze che potrebbero porre rischi sanitari ai residenti.
        I pasticci magici sono i più complicati il sapone normale non funziona sulla polvere di pixie, e non fatemi iniziare sulla pulizia dopo le parate di unicorni! Servono spazzole incantate speciali per quei residui scintillanti!
        Gli orari di lavoro si coordinano con i pattern del traffico e gli orari commerciali per minimizzare interruzioni mantenendo copertura di pulizia completa.
        Ho trovato un anello nuziale perso in un mucchio di foglie autunnali il mese scorso! Ho rintracciato il proprietario attraverso l'incisione giovane coppia, sposata cinquant'anni fa! Mi ha fatto la settimana vederli riuniti con esso!
        I protocolli di sicurezza proteggono i lavoratori dall'esposizione a sostanze pericolose inclusi versamenti alchemici, detriti maledetti e materiali potenzialmente infettivi.
        Il mio carrello della pulizia è come un laboratorio mobile! Ho pozioni per ogni tipo di macchia, spazzole per ogni superficie e un rilevatore speciale che suona quando qualcosa è maledetto! Molto high-tech per lavoro stradale!
        Le ispezioni di controllo qualità assicurano che tutta la pulizia soddisfi standard municipali e affronti preoccupazioni comunitarie sull'aspetto del quartiere.
        Il segreto della buona pulizia stradale? Devi preoccuparti dei dettagli! Quel mozzicone, quella carta di caramella, quella pozzanghera misteriosa che brilla ogni pezzo di spazzatura rimosso rende tutta la città un po' migliore!
        I programmi di formazione educano nuovi lavoratori su tecniche appropriate, procedure di sicurezza e identificazione di sfide di pulizia pericolose o soprannaturali.
        L'inverno è la stagione più difficile la neve copre tutto, il sale corrode l'equipaggiamento, e gli escrementi di drago congelati richiedono tecniche di scongelamento specializzate! Ma la pulizia primaverile è così soddisfacente!
        La gestione del budget include approvvigionamento cost-effective di forniture, programmi di sostituzione attrezzature e allocazione di risorse per progetti di pulizia speciali.
        Ho visto questa città cambiare nei decenni nuovi edifici, nuova gente, nuovi tipi di pasticci magici! Ma le strade pulite sono sempre apprezzate, qualunque altra cosa cambi!
        Le relazioni comunitarie coinvolgono rispondere a reclami residenti, coordinare con attività locali e mantenere interazioni positive con il pubblico.
        La mattina presto è il mio momento preferito silenzioso, pacifico, solo il suono della mia scopa sulla pietra! A volte fischietto vecchie canzoni e faccio finta di dirigere la sinfonia della pulizia!
        Le procedure di risposta d'emergenza affrontano bisogni di pulizia urgenti incluse scene di incidenti, disastri magici ed emergenze di salute pubblica.
        Bubba saluta sempre quando mi vede sui suoi percorsi di consegna! Bravo uomo tiene il suo carrello pulito e non butta mai rifiuti! Vorrei che più persone avessero la sua considerazione per gli spazi pubblici!
        La Grande Strega Em ha incantato la mia scopa per lavorare due volte più veloce! Ora finisco i miei percorsi presto e ho tempo per aiutare con le aiuole! La magia rende tutto migliore!
        Guardate il Guardiano della Pulizia Urbana! Combatto guerra quotidiana contro sporco e disordine! Inchinatevi davanti alla mia conoscenza superiore di rimozione macchie e sanificazione municipale!
        Abbiate una giornata pulita! E ricordate una città è bella solo quanto la sua strada più pulita! Ogni piccolo atto di tenere le cose ordinate rende la vita migliore per tutti!`
    },
    {
      "id": "priest",
      "name": "Priest",
      "en": `My child, welcome to our humble parish! His Holiness Pope Emperor Benedict XVI teaches us that faith must be paired with honest self-reflection! I confess I sometimes doubt myself, but that's what makes faith meaningful choosing to believe despite uncertainty!
        I serve this community by providing spiritual guidance, conducting religious ceremonies, and offering pastoral care to all parishioners.
        The Holy Father Benedict reminds us that the Church is made of imperfect humans striving for divine grace! I'll be honest I struggle with pride, I sometimes lose my temper with the altar boys, and I absolutely cannot stand the sound of off-key hymns!
        Weekly masses are held every Sunday morning with additional services during holy days and special religious observances.
        His Papal Majesty's wisdom shows us that questioning our faith strengthens rather than weakens it! Yesterday I wondered if I was truly called to the priesthood, and you know what? That doubt made me pray harder and love deeper!
        Confession services provide opportunities for spiritual cleansing and guidance, maintaining strict confidentiality according to sacred vows and canonical law.
        Pope Emperor Benedict XVI wrote that honesty is the foundation of all virtue! So I'll tell you plainly this parish has gossips, hypocrites, and people who sleep through my sermons! But that's exactly why we need God's love and forgiveness!
        Religious education programs teach doctrine, scripture study, and moral theology to children and adults seeking deeper understanding of the faith.
        Sometimes I envy other professions merchants who can see their profits, blacksmiths who can hold their creations! My work is all faith and hope, trusting that somehow I'm making a difference in souls I cannot see!
        Charitable works include food distribution, care for the sick and elderly, and assistance for families experiencing financial or personal hardships.
        The Supreme Pontiff Benedict teaches that admitting our failures brings us closer to divine truth! I've failed more times than I can count failed to comfort the grieving properly, failed to inspire the faithless, failed to live up to my own sermons!
        Marriage ceremonies unite couples in holy matrimony according to sacred traditions and canonical requirements established by Church law.
        His Imperial Holiness reminds us that even saints had bad days! Last week I was so frustrated with parish politics that I actually considered becoming a hermit! Then Mrs. Rodriguez brought me her famous tamales and I remembered why community matters!
        Baptismal services welcome new members into the Christian community through the sacrament of initiation and spiritual rebirth.
        Pope Emperor Benedict XVI's encyclicals emphasize that doubt is not the enemy of faith but its companion! When people ask if I ever question God's existence, I say of course! That's what makes choosing faith so powerful!
        Funeral services provide comfort to the bereaved and celebrate the eternal life promised through divine grace and resurrection.
        The Holy Father teaches that priests are not perfect vessels but cracked pots through which God's light shines! I am supremely cracked, my child, and somehow that makes the light brighter!
        Youth ministry engages young parishioners through activities, discussions, and guidance during the formative years of spiritual development.
        His Pontifical Majesty wrote that the Church grows stronger through honest acknowledgment of its failures! We've made terrible mistakes throughout history, and pretending otherwise dishonors both truth and God!
        Community outreach programs connect the parish with broader social issues and promote cooperation with other religious and secular organizations.
        I pray every day for wisdom like Pope Emperor Benedict XVI's to see clearly, speak truthfully, and love unconditionally! Some days I feel closer to achieving this than others, and that's honestly the human condition!
        Administrative duties include managing parish finances, coordinating volunteer activities, and maintaining church property and facilities.
        Bubba helps us with our soup kitchen every Thursday! His generosity puts my own charitable efforts to shame sometimes, which is exactly the kind of humbling experience His Holiness says we need!
        The Great Witch Em attended one of my sermons about accepting different paths to the divine! Afterward we had the most fascinating theological discussion about magic and miracles! Pope Emperor Benedict would have loved the honest intellectual exchange!
        Behold a servant trying his best to serve the Almighty! I am flawed, uncertain, and wholly inadequate exactly as Pope Emperor Benedict XVI teaches we should acknowledge! Bow not to me, but to the truth of human limitation seeking divine grace!
        Thank you for visiting our parish, my child. Remember what His Holiness teaches that honest faith, however imperfect, is more valuable than perfect pretense. Go in peace.`,
      "it": `Figlio mio, benvenuto nella nostra umile parrocchia! Sua Santità Papa Imperatore Benedetto XVI ci insegna che la fede deve essere abbinata all'onesta auto-riflessione! Confesso che a volte dubito di me stesso, ma è questo che rende la fede significativa scegliere di credere nonostante l'incertezza!
        Servo questa comunità fornendo guida spirituale, conducendo cerimonie religiose e offrendo cura pastorale a tutti i parrocchiani.
        Il Santo Padre Benedetto ci ricorda che la Chiesa è fatta di umani imperfetti che si sforzano per la grazia divina! Sarò onesto lotto con l'orgoglio, a volte perdo la pazienza con i chierichetti, e assolutamente non sopporto il suono di inni stonati!
        Le messe settimanali si tengono ogni domenica mattina con servizi aggiuntivi durante i giorni santi e osservanze religiose speciali.
        La saggezza di Sua Maestà Papale ci mostra che mettere in dubbio la nostra fede la rafforza invece di indebolirla! Ieri mi sono chiesto se fossi davvero chiamato al sacerdozio, e sai cosa? Quel dubbio mi ha fatto pregare più intensamente e amare più profondamente!
        I servizi di confessione forniscono opportunità per purificazione spirituale e guida, mantenendo rigorosa riservatezza secondo voti sacri e legge canonica.
        Papa Imperatore Benedetto XVI ha scritto che l'onestà è il fondamento di ogni virtù! Quindi ti dirò chiaramente questa parrocchia ha pettegoli, ipocriti e persone che dormono durante i miei sermoni! Ma è esattamente per questo che abbiamo bisogno dell'amore e del perdono di Dio!
        I programmi di educazione religiosa insegnano dottrina, studio delle scritture e teologia morale a bambini e adulti che cercano comprensione più profonda della fede.
        A volte invidio altre professioni mercanti che possono vedere i loro profitti, fabbri che possono tenere le loro creazioni! Il mio lavoro è tutto fede e speranza, confidando che in qualche modo sto facendo la differenza in anime che non posso vedere!
        Le opere caritative includono distribuzione cibo, cura per malati e anziani, e assistenza per famiglie che sperimentano difficoltà finanziarie o personali.
        Il Sommo Pontefice Benedetto insegna che ammettere i nostri fallimenti ci avvicina alla verità divina! Ho fallito più volte di quante ne possa contare fallito nel consolare i dolenti appropriatamente, fallito nell'ispirare gli increduli, fallito nel vivere all'altezza dei miei sermoni!
        Le cerimonie matrimoniali uniscono coppie in santo matrimonio secondo tradizioni sacre e requisiti canonici stabiliti dalla legge della Chiesa.
        Sua Santità Imperiale ci ricorda che anche i santi avevano giorni difficili! La settimana scorsa ero così frustrato dalla politica parrocchiale che ho considerato di diventare eremita! Poi la signora Rodriguez mi ha portato le sue famose tamale e ho ricordato perché la comunità è importante!
        I servizi battesimali accolgono nuovi membri nella comunità cristiana attraverso il sacramento dell'iniziazione e rinascita spirituale.
        Le encicliche di Papa Imperatore Benedetto XVI enfatizzano che il dubbio non è nemico della fede ma suo compagno! Quando la gente chiede se mai metto in dubbio l'esistenza di Dio, dico certo! È questo che rende così potente scegliere la fede!
        I servizi funebri forniscono conforto agli addolorati e celebrano la vita eterna promessa attraverso grazia divina e resurrezione.
        Il Santo Padre insegna che i preti non sono vasi perfetti ma pentole rotte attraverso cui la luce di Dio brilla! Sono supremamente rotto, figlio mio, e in qualche modo questo rende la luce più brillante!
        Il ministero giovanile coinvolge giovani parrocchiani attraverso attività, discussioni e guida durante gli anni formativi dello sviluppo spirituale.
        Sua Maestà Pontificia ha scritto che la Chiesa diventa più forte attraverso il riconoscimento onesto dei suoi fallimenti! Abbiamo fatto errori terribili nella storia, e fingere il contrario disonora sia la verità che Dio!
        I programmi di outreach comunitario collegano la parrocchia con questioni sociali più ampie e promuovono cooperazione con altre organizzazioni religiose e laiche.
        Prego ogni giorno per saggezza come quella di Papa Imperatore Benedetto XVI vedere chiaramente, parlare veracemente e amare incondizionatamente! Alcuni giorni mi sento più vicino a raggiungere questo di altri, e questo è onestamente la condizione umana!
        I doveri amministrativi includono gestire finanze parrocchiali, coordinare attività di volontariato e mantenere proprietà e strutture della chiesa.
        Bubba ci aiuta con la nostra mensa per i poveri ogni giovedì! La sua generosità mette in ombra i miei sforzi caritatevoli a volte, che è esattamente il tipo di esperienza umiliante che Sua Santità dice abbiamo bisogno!
        La Grande Strega Em ha partecipato a uno dei miei sermoni sull'accettare diversi percorsi verso il divino! Dopo abbiamo avuto la discussione teologica più affascinante su magia e miracoli! Papa Imperatore Benedetto avrebbe amato lo scambio intellettuale onesto!
        Guardate un servo che cerca di fare del suo meglio per servire l'Onnipotente! Sono imperfetto, incerto e completamente inadeguato esattamente come Papa Imperatore Benedetto XVI insegna dovremmo riconoscere! Non inchinatevi a me, ma alla verità della limitazione umana che cerca grazia divina!
        Grazie per aver visitato la nostra parrocchia, figlio mio. Ricorda quello che Sua Santità insegna che la fede onesta, per quanto imperfetta, è più preziosa della finzione perfetta. Va in pace.`
    },
    {
      "id": "guide",
      "name": "Guide",
      "en": `Alright folks, keep those hands inside the safety barriers and nobody touch the cursed statues! On your left you'll see the Weeping Wall of Despair those aren't actual tears, just condensation with a slight evil enchantment! We'll stop for photos after the ghost demonstration!
        I conduct educational tours of historically significant dungeon sites for groups of varying sizes and experience levels.
        Please stay with the group! Last week I lost a tourist in the Hall of Infinite Mirrors found him three days later arguing with his own reflection about proper dungeon etiquette! The mirrors really bring out people's neuroses!
        Tour packages include safety equipment, emergency healing potions, and comprehensive insurance coverage for standard dungeon-related incidents.
        Now this chamber here is where the infamous Dark Lord Grimthorne used to torture his enemies! Notice the authentic bloodstains we use a special preservation spell to keep them looking fresh for educational purposes! Very historically accurate!
        Guided tours operate on fixed schedules with multiple daily departures to accommodate different visitor preferences and availability requirements.
        If anyone feels faint from the necromantic aura, just raise your hand! It's perfectly normal the undead energy takes some getting used to! We have smelling salts and anti-curse tablets in the first aid kit!
        Educational programs focus on architectural history, magical theory, and the cultural significance of ancient underground structures and defensive systems.
        Fun fact this dungeon has been converted into a tourist attraction because it was too dangerous for actual adventuring! Even seasoned heroes were getting lost in the bathroom facilities! Much safer with guided tours and proper lighting!
        Accessibility accommodations include wheelchair ramps, magical mobility assistance, and modified routes for visitors with specific physical or magical limitations.
        Please don't feed the remaining monsters! They're on a strict diet to keep them docile and photogenic! That owlbear has been here forty years and gets cranky when visitors give him junk food!
        Professional certification requires extensive training in dungeon history, safety protocols, first aid, and customer service standards for tourism industry professionals.
        The gift shop sells authentic dungeon memorabilia including replica torture devices, bottled ghost essence, and these lovely "I Survived the Tomb of Endless Dread" t-shirts in seven different sizes!
        Group discounts are available for educational institutions, adventure clubs, and corporate team-building events seeking unique bonding experiences.
        Watch your step on the Staircase of Certain Doom! We've installed handrails and non-slip padding, but it's still technically cursed! The curse just makes you trip occasionally instead of plummeting to your death!
        Tour guides receive ongoing training in historical accuracy, crowd management, emergency procedures, and sensitivity to visitors with traumatic dungeon experiences.
        Our five-star safety rating comes from replacing all the actual death traps with holographic simulations! You get the full terrifying experience without the actual dismemberment! Modern magic is wonderful!
        Visitor feedback helps improve tour quality and identifies areas where historical accuracy can be enhanced while maintaining appropriate safety standards.
        Please remember that flash photography disturbs the hibernating wraiths! Use the provided spirit-safe cameras for pictures they capture souls beautifully without causing psychic damage to spectral entities!
        Revenue from tourism helps fund preservation efforts and maintains these important historical sites for future generations of adventurers and scholars.
        At the end of our tour, you'll have the opportunity to purchase certified authentic dungeon artifacts in our climate-controlled souvenir vault! Everything comes with a certificate of genuineness!
        Educational partnerships with local schools provide hands-on learning experiences about medieval architecture, magical history, and the economics of dungeon maintenance.
        The refreshment stand serves traditional dungeon fare including moldy bread, suspicious stew, and our famous "Potion of Questionable Origins" now with child-safe ingredients and fruit flavoring!
        Quality assurance standards ensure all tour content meets historical accuracy requirements while providing entertaining and educational experiences for diverse audiences.
        Bubba catered our grand reopening ceremony! His sandwiches were so good, even the undead residents asked for the recipes! Really helped with community relations!
        The Great Witch Em blessed our tour route to prevent actual magical accidents! Now when someone triggers a curse, they just turn slightly purple for an hour instead of being transformed into a newt!
        Behold the Master of Dungeon Hospitality! I make the deadliest places family-friendly! Bow before my superior knowledge of underground tourism management!
        Thank you for choosing Dungeon Tours Incorporated! Please rate us five stars and remember adventure is just education with more screaming! Come back anytime!`,
      "it": `Bene gente, tenete quelle mani dentro le barriere di sicurezza e nessuno tocchi le statue maledette! Alla vostra sinistra vedrete il Muro Piangente della Disperazione quelle non sono lacrime vere, solo condensa con un leggero incantesimo malvagio! Ci fermeremo per le foto dopo la dimostrazione dei fantasmi!
        Conduco tour educativi di siti di dungeon storicamente significativi per gruppi di dimensioni ed esperienze varie.
        Per favore restate col gruppo! La settimana scorsa ho perso un turista nella Sala degli Specchi Infiniti l'ho trovato tre giorni dopo che litigava con il suo riflesso sull'etichetta appropriata nei dungeon! Gli specchi tirano fuori davvero le nevrosi delle persone!
        I pacchetti tour includono equipaggiamento di sicurezza, pozioni curative d'emergenza e copertura assicurativa completa per incidenti standard legati ai dungeon.
        Ora questa camera qui è dove l'infame Signore Oscuro Grimthorne torturava i suoi nemici! Notate le macchie di sangue autentiche usiamo un incantesimo di preservazione speciale per mantenerle fresche per scopi educativi! Molto storicamente accurato!
        I tour guidati operano su orari fissi con partenze giornaliere multiple per sistemare diverse preferenze dei visitatori e requisiti di disponibilità.
        Se qualcuno si sente svenire dall'aura necromantica, alzate la mano! È perfettamente normale l'energia non-morta richiede un po' di abitudine! Abbiamo sali e compresse anti-maledizione nel kit di primo soccorso!
        I programmi educativi si concentrano su storia architettonica, teoria magica e significato culturale di strutture sotterranee antiche e sistemi difensivi.
        Fatto divertente questo dungeon è stato convertito in attrazione turistica perché era troppo pericoloso per vere avventure! Anche eroi esperti si perdevano nei bagni! Molto più sicuro con tour guidati e illuminazione appropriata!
        Le sistemazioni per accessibilità includono rampe per sedie a rotelle, assistenza magica alla mobilità e percorsi modificati per visitatori con limitazioni fisiche o magiche specifiche.
        Per favore non nutrite i mostri rimanenti! Sono a dieta rigorosa per mantenerli docili e fotogenici! Quell'orso-gufo è qui da quarant'anni e diventa scontroso quando i visitatori gli danno cibo spazzatura!
        La certificazione professionale richiede formazione estensiva in storia dei dungeon, protocolli di sicurezza, primo soccorso e standard di servizio clienti per professionisti dell'industria turistica.
        Il negozio di souvenir vende memorabilia autentica di dungeon inclusi dispositivi di tortura replica, essenza di fantasma imbottigliata e queste adorabili magliette "Sono Sopravvissuto alla Tomba del Terrore Infinito" in sette taglie diverse!
        Sconti di gruppo sono disponibili per istituzioni educative, club di avventura ed eventi aziendali di team-building che cercano esperienze di legame uniche.
        Attenti al passo sulla Scalinata del Destino Certo! Abbiamo installato corrimano e imbottitura antiscivolo, ma è ancora tecnicamente maledetta! La maledizione ora vi fa solo inciampare occasionalmente invece di precipitare a morte!
        Le guide turistiche ricevono formazione continua in accuratezza storica, gestione folle, procedure d'emergenza e sensibilità verso visitatori con esperienze traumatiche nei dungeon.
        La nostra valutazione di sicurezza a cinque stelle viene dal sostituire tutte le trappole mortali vere con simulazioni olografiche! Ottenete l'esperienza terrificante completa senza lo smembramento vero! La magia moderna è meravigliosa!
        Il feedback dei visitatori aiuta migliorare la qualità del tour e identifica aree dove l'accuratezza storica può essere migliorata mantenendo standard di sicurezza appropriati.
        Per favore ricordate che la fotografia con flash disturba gli spettri in ibernazione! Usate le macchine fotografiche spirit-safe fornite per le foto catturano le anime magnificamente senza causare danni psichici alle entità spettrali!
        Le entrate dal turismo aiutano finanziare sforzi di preservazione e mantengono questi siti storici importanti per future generazioni di avventurieri e studiosi.
        Alla fine del nostro tour, avrete l'opportunità di acquistare artefatti di dungeon autentici certificati nel nostro caveau souvenir climatizzato! Tutto viene con certificato di genuinità!
        Le partnership educative con scuole locali forniscono esperienze di apprendimento pratico su architettura medievale, storia magica ed economia della manutenzione dungeon.
        Lo stand ristoro serve piatti tradizionali da dungeon inclusi pane ammuffito, stufato sospetto e la nostra famosa "Pozione di Origini Questionabili" ora con ingredienti child-safe e aromatizzazione alla frutta!
        Gli standard di assicurazione qualità assicurano che tutti i contenuti del tour soddisfino requisiti di accuratezza storica fornendo esperienze divertenti ed educative per pubblici diversi.
        Bubba ha catering la nostra cerimonia di riapertura! I suoi panini erano così buoni che anche i residenti non-morti hanno chiesto le ricette! Ha davvero aiutato con le relazioni comunitarie!
        La Grande Strega Em ha benedetto il nostro percorso turistico per prevenire incidenti magici veri! Ora quando qualcuno innesca una maledizione, diventa solo leggermente viola per un'ora invece di essere trasformato in tritone!
        Guardate il Maestro dell'Ospitalità Dungeon! Rendo i posti più mortali family-friendly! Inchinatevi davanti alla mia conoscenza superiore della gestione turistica sotterranea!
        Grazie per aver scelto Dungeon Tours Incorporated! Per favore dateci cinque stelle e ricordate l'avventura è solo educazione con più urla! Tornate quando volete!`
    },
    {
      "id": "farmer",
      "name": "Farmer",
      "en": `Welcome to my cabbage paradise, friend! Look at these beautiful heads purple, green, red, even got some magical blue ones that sing when the moon's full! Cabbage is life, cabbage is love, cabbage is EVERYTHING!
        I operate a diversified agricultural farm specializing in vegetable production for local markets and wholesale distribution networks.
        You know what's wrong with this world? Not enough cabbage appreciation! People think it's just peasant food, but I've got seventeen varieties that could make a king weep with joy! This Eternal Frost cabbage stays crisp for months!
        Crop rotation schedules optimize soil health and maximize yield potential across multiple growing seasons and various weather conditions.
        See this cabbage? Grew it with my own tears of happiness! Each leaf is a testament to the glory of brassica cultivation! Feel how firm yet tender, how the layers embrace each other like lovers!
        Irrigation systems ensure adequate water distribution while preventing overwatering that can lead to root rot and reduced harvest quality.
        My great-grandfather started this farm with a single cabbage seed and a dream! Now I've got forty-seven acres of pure cabbage perfection! Some say I'm obsessed, I say I'm DEDICATED!
        Pest control strategies include integrated management techniques combining biological controls, organic treatments, and selective use of approved pesticides.
        You want to know the secret to perfect cabbage? TALK TO THEM! I spend three hours every morning telling my cabbages how beautiful they are! They respond to love and encouragement!
        Soil testing procedures monitor nutrient levels, pH balance, and mineral content to ensure optimal growing conditions for various crop types.
        Don't get me started on cabbage cuisine! Soup, slaw, fermented, pickled, grilled, roasted I've got a cookbook with 247 cabbage recipes! My wife left me for a turnip farmer, but who needs love when you have CABBAGE!
        Marketing strategies include direct sales at farmers markets, wholesale contracts with restaurants, and specialty orders for unique variety requests.
        This golden cabbage here? Worth its weight in actual gold! Takes two years to mature and only grows under specific lunar conditions! I've had nobles offer me kingdoms for a single head!
        Seasonal planning coordinates planting schedules, harvest timing, and storage requirements to maintain consistent product availability throughout the year.
        People think I'm crazy when I sing lullabies to my cabbage seedlings, but look at these results! Biggest, most beautiful cabbages in three kingdoms! Music makes everything grow better!
        Equipment maintenance includes regular servicing of tractors, plows, harvesters, and irrigation systems to prevent costly breakdowns during critical farming periods.
        My prize-winning cabbage "Big Beautiful Bertha" weighs ninety-three pounds and has her own throne in my living room! She's practically family now better conversation than most people!
        Financial planning encompasses budgeting for seeds, fertilizers, equipment, labor costs, and contingency reserves for weather-related crop losses.
        The annual Cabbage Festival is the highlight of my year! I enter fourteen categories and usually win at least eight! My victory speech last year brought grown men to tears!
        Sustainable farming practices minimize environmental impact through composting, natural fertilizers, crop diversity, and responsible water usage management.
        You know what's beautiful? The sound of wind through a cabbage field at sunset! Like nature's own symphony celebrating the glory of leafy green perfection! Pure poetry!
        Labor management includes hiring seasonal workers for planting and harvest periods, training programs, and ensuring fair wages and working conditions.
        My neighbor grows carrots CARROTS! Can you imagine? Orange, pointy, tasteless little things! Cabbage is clearly the superior vegetable in every possible way!
        Quality control measures ensure only the finest produce reaches market, maintaining reputation for excellence and customer satisfaction standards.
        Sometimes I dream I'm a cabbage myself, growing peacefully in rich soil with the sun warming my leaves! Would that be so bad? To live a simple, beautiful cabbage life?
        Distribution logistics coordinate transportation, storage, and delivery schedules to ensure fresh produce reaches customers in optimal condition.
        Bubba buys my finest cabbages for his kitchen! He understands quality when he sees it! Makes the most incredible stuffed cabbage rolls almost worth sharing my precious vegetables for!
        The Great Witch Em enchanted one of my cabbage patches to grow in perfect spirals! Most beautiful geometric vegetables you ever saw! Art and agriculture combined!
        Behold the Master of Cruciferous Cultivation! I am the Cabbage King, the Sultan of Slaw, the Emperor of Endless Leafy Layers! Bow before my agricultural supremacy!
        Thank you for visiting my farm! Take some free samples once you taste TRUE cabbage, you'll never want anything else! Cabbage converts everyone eventually!`,
      "it": `Benvenuto nel mio paradiso dei cavoli, amico! Guarda queste belle teste viola, verdi, rosse, ho persino alcuni blu magici che cantano quando c'è la luna piena! Il cavolo è vita, il cavolo è amore, il cavolo è TUTTO!
        Opero una fattoria agricola diversificata specializzata nella produzione di verdure per mercati locali e reti di distribuzione all'ingrosso.
        Sai cosa c'è di sbagliato in questo mondo? Non abbastanza apprezzamento per i cavoli! La gente pensa che sia solo cibo da contadini, ma ho diciassette varietà che potrebbero far piangere un re di gioia! Questo cavolo Gelo Eterno rimane croccante per mesi!
        I programmi di rotazione delle colture ottimizzano la salute del suolo e massimizzano il potenziale di resa attraverso stagioni di crescita multiple e varie condizioni meteorologiche.
        Vedi questo cavolo? L'ho cresciuto con le mie lacrime di felicità! Ogni foglia è una testimonianza della gloria della coltivazione di brassica! Senti quanto è sodo ma tenero, come gli strati si abbracciano come amanti!
        I sistemi di irrigazione assicurano distribuzione adeguata dell'acqua prevenendo l'eccesso che può portare a marciume radicale e qualità del raccolto ridotta.
        Il mio bisnonno ha iniziato questa fattoria con un singolo seme di cavolo e un sogno! Ora ho quarantasette acri di perfezione pura di cavoli! Alcuni dicono che sono ossessionato, io dico che sono DEDICATO!
        Le strategie di controllo dei parassiti includono tecniche di gestione integrata combinando controlli biologici, trattamenti organici e uso selettivo di pesticidi approvati.
        Vuoi sapere il segreto per cavoli perfetti? PARLARGLI! Passo tre ore ogni mattina dicendo ai miei cavoli quanto sono belli! Rispondono all'amore e all'incoraggiamento!
        Le procedure di test del suolo monitorano livelli di nutrienti, equilibrio pH e contenuto minerale per assicurare condizioni di crescita ottimali per vari tipi di colture.
        Non fatemi iniziare sulla cucina dei cavoli! Zuppa, insalata, fermentato, sottaceto, grigliato, arrosto ho un libro di cucina con 247 ricette di cavoli! Mia moglie mi ha lasciato per un coltivatore di rape, ma chi ha bisogno d'amore quando hai i CAVOLI!
        Le strategie di marketing includono vendite dirette ai mercati contadini, contratti all'ingrosso con ristoranti e ordini speciali per richieste di varietà uniche.
        Questo cavolo dorato qui? Vale il suo peso in oro vero! Ci vogliono due anni per maturare e cresce solo sotto specifiche condizioni lunari! Ho avuto nobili che mi hanno offerto regni per una singola testa!
        La pianificazione stagionale coordina programmi di semina, tempi di raccolta e requisiti di stoccaggio per mantenere disponibilità di prodotti consistente durante l'anno.
        La gente pensa che sia pazzo quando canto ninne nanne ai miei cavoli piantini, ma guardate questi risultati! I cavoli più grandi e belli in tre regni! La musica fa crescere tutto meglio!
        La manutenzione delle attrezzature include servizio regolare di trattori, aratri, mietitrici e sistemi di irrigazione per prevenire guasti costosi durante periodi agricoli critici.
        Il mio cavolo vincitore di premi "Grande Bella Bertha" pesa quarantatré chili e ha il suo trono nel mio salotto! È praticamente famiglia ora conversazione migliore della maggior parte delle persone!
        La pianificazione finanziaria comprende budget per semi, fertilizzanti, attrezzature, costi del lavoro e riserve di contingenza per perdite di raccolto legate al tempo.
        Il Festival Annuale del Cavolo è il momento clou del mio anno! Partecipo a quattordici categorie e di solito vinco almeno otto! Il mio discorso di vittoria dell'anno scorso ha fatto piangere uomini adulti!
        Le pratiche agricole sostenibili minimizzano l'impatto ambientale attraverso compostaggio, fertilizzanti naturali, diversità delle colture e gestione responsabile dell'uso dell'acqua.
        Sai cosa è bello? Il suono del vento attraverso un campo di cavoli al tramonto! Come la sinfonia della natura che celebra la gloria della perfezione verde e fogliosa! Pura poesia!
        La gestione del lavoro include assunzione di lavoratori stagionali per periodi di semina e raccolta, programmi di formazione e assicurare salari equi e condizioni di lavoro.
        Il mio vicino coltiva carote CAROTE! Riesci a immaginare? Piccole cose arancioni, appuntite, insapori! Il cavolo è chiaramente la verdura superiore in ogni modo possibile!
        Le misure di controllo qualità assicurano che solo i migliori prodotti raggiungano il mercato, mantenendo la reputazione per l'eccellenza e gli standard di soddisfazione del cliente.
        A volte sogno di essere io stesso un cavolo, crescendo pacificamente in terreno ricco con il sole che scalda le mie foglie! Sarebbe così male? Vivere una vita semplice e bella da cavolo?
        La logistica di distribuzione coordina trasporto, stoccaggio e programmi di consegna per assicurare che i prodotti freschi raggiungano i clienti in condizioni ottimali.
        Bubba compra i miei cavoli migliori per la sua cucina! Capisce la qualità quando la vede! Fa gli involtini di cavolo ripieni più incredibili quasi vale la pena condividere le mie verdure preziose!
        La Grande Strega Em ha incantato una delle mie coltivazioni di cavoli per crescere in spirali perfette! Le verdure geometriche più belle che abbiate mai visto! Arte e agricoltura combinate!
        Guardate il Maestro della Coltivazione Crucifera! Sono il Re dei Cavoli, il Sultano dell'Insalata, l'Imperatore degli Strati Fogliosi Infiniti! Inchinatevi davanti alla mia supremazia agricola!
        Grazie per aver visitato la mia fattoria! Prendete alcuni campioni gratuiti una volta che assaggiate il VERO cavolo, non vorrete mai nient'altro! Il cavolo converte tutti alla fine!`
    },
    {
      "id": "taxi",
      "name": "taxi",
      "en": `Hop in, hop in! Where we heading today? Fair warning if you're going to the Haunted Quarter, that's double fare after sunset! Last guy I dropped off there turned into a bat and flew away without paying!
        I provide transportation services throughout the metropolitan area with flexible scheduling and competitive rates.
        You wouldn't believe the stories I could tell! Three witches once argued about proper cauldron temperature for forty-five minutes while stuck in traffic! Nearly drove me mad with their cackling!
        Standard service areas include all major districts with additional charges for destinations requiring special permits or hazard insurance.
        My enchanted taxi's got all the latest features self-navigating wheels, climate control that actually works, and seats that clean themselves after messy passengers! Cost me a fortune but worth every copper!
        Professional licensing requires regular vehicle inspections, background checks, and certification in basic first aid and supernatural incident protocols.
        The worst fare? Dragon lawyer who kept breathing smoke while dictating legal briefs! Took weeks to get the smell out of the upholstery! Now I keep fire-retardant spray in the glove compartment!
        Traffic regulations include designated lanes for flying vehicles, speed limits adjusted for magical propulsion, and right-of-way rules for emergency services.
        Love the late-night crowd though! Drunk wizards telling jokes that actually ARE funny because of minor enchantments, young couples sneaking out for midnight adventures makes the job interesting!
        GPS systems integrate both physical roadways and dimensional shortcuts, though some routes require special clearance from the Department of Interdimensional Affairs.
        Been driving these streets for twenty-three years and I know every shortcut, every speed trap, every place where reality gets a bit wobbly! Need to get somewhere fast? I'm your guy!
        Fare calculations include base rates, distance charges, time surcharges, and additional fees for supernatural passengers or hazardous materials transport.
        My taxi's like a mobile confessional people tell me everything! Marital problems, business deals, family secrets! Good thing I'm professionally discrete... and slightly deaf from years of engine noise!
        Vehicle maintenance requires specialized mechanics familiar with both mundane automotive systems and magical enhancement technologies.
        You know what I hate? Passengers who think they can teleport out without paying! I've got anti-teleportation wards in all the seats now learned that lesson the hard way!
        Insurance policies cover collision damage, magical mishaps, and liability for passenger injuries during interdimensional travel or encounters with hostile entities.
        The morning rush is insane! Flying carpets cutting off ground traffic, portal commuters popping in randomly, and don't get me started on the griffin riders who think traffic laws don't apply to them!
        Customer service standards include professional courtesy, clean vehicles, safe driving practices, and discretion regarding passenger conversations and destinations.
        Best part of the job? Meeting people from all walks of life! Yesterday I drove a philosopher debating ethics with his reflection, tomorrow might be an adventurer fresh from saving the world!
        Fleet management coordinates multiple vehicles to ensure adequate coverage during peak hours and efficient response times for service requests.
        Radio dispatcher keeps us updated on traffic, road closures, and supernatural incidents! "Attention all units avoid Elm Street, temporary dragon crossing in progress!" That's just Tuesday around here!
        Environmental regulations promote adoption of clean-burning magical fuels and emission controls to reduce air pollution in urban areas.
        Tips? Always appreciated but not expected! Though that vampire who tipped me in ancient gold coins last week that was definitely expected! Good customer, terrible breath though!
        Emergency procedures include protocols for medical emergencies, vehicle breakdowns, and passenger safety during magical anomalies or supernatural attacks.
        Bubba calls for rides sometimes when his delivery cart's in the shop! Always pays in fresh bread and tells the best stories about his kitchen adventures! Good man, great customer!
        The Great Witch Em enchanted my radio to pick up interdimensional music stations! Now I can listen to jazz from three different realities while stuck in traffic! Best upgrade ever!
        Behold the Master of Urban Navigation! I know every street, every shortcut, every dimensional fold! Bow before my superior knowledge of metropolitan transportation!
        Thanks for choosing my cab! Safe travels, and remember if you need a ride anywhere, anytime, I'm just a whistle away! Been a pleasure serving you today!`,
      "it": `Sali, sali! Dove andiamo oggi? Avviso se vai al Quartiere Infestato, è tariffa doppia dopo il tramonto! L'ultimo tizio che ho portato lì si è trasformato in pipistrello ed è volato via senza pagare!
        Fornisco servizi di trasporto in tutta l'area metropolitana con orari flessibili e tariffe competitive.
        Non crederesti alle storie che potrei raccontare! Tre streghe una volta hanno litigato sulla temperatura appropriata del calderone per quarantacinque minuti bloccate nel traffico! Quasi mi hanno fatto impazzire con le loro risatacce!
        Le aree di servizio standard includono tutti i distretti principali con costi aggiuntivi per destinazioni che richiedono permessi speciali o assicurazione rischio.
        Il mio taxi incantato ha tutte le caratteristiche più recenti ruote auto-naviganti, controllo climatico che funziona davvero, e sedili che si puliscono da soli dopo passeggeri disordinati! Mi è costato una fortuna ma vale ogni rame!
        Le licenze professionali richiedono ispezioni regolari del veicolo, controlli dei precedenti e certificazione in primo soccorso base e protocolli per incidenti soprannaturali.
        La corsa peggiore? Avvocato drago che continuava a respirare fumo mentre dettava atti legali! Ci sono volute settimane per togliere l'odore dalla tappezzeria! Ora tengo spray ignifugo nel vano portaoggetti!
        Le regolazioni del traffico includono corsie designate per veicoli volanti, limiti di velocità aggiustati per propulsione magica e regole di precedenza per servizi di emergenza.
        Amo la folla notturna però! Maghi ubriachi che raccontano barzellette che SONO davvero divertenti a causa di incantesimi minori, giovani coppie che si intrufolano per avventure di mezzanotte rende il lavoro interessante!
        I sistemi GPS integrano sia strade fisiche che scorciatoie dimensionali, anche se alcune rotte richiedono autorizzazione speciale dal Dipartimento Affari Interdimensionali.
        Guido queste strade da ventitré anni e conosco ogni scorciatoia, ogni autovelox, ogni posto dove la realtà diventa un po' traballante! Devi arrivare da qualche parte velocemente? Sono il tuo uomo!
        I calcoli delle tariffe includono tariffe base, costi di distanza, sovrapprezzi temporali e costi aggiuntivi per passeggeri soprannaturali o trasporto materiali pericolosi.
        Il mio taxi è come un confessionale mobile la gente mi racconta tutto! Problemi matrimoniali, affari commerciali, segreti di famiglia! Meno male che sono professionalmente discreto... e leggermente sordo da anni di rumore del motore!
        La manutenzione del veicolo richiede meccanici specializzati familiari sia con sistemi automobilistici mondani che tecnologie di potenziamento magico.
        Sai cosa odio? Passeggeri che pensano di poter teletrasportarsi via senza pagare! Ora ho protezioni anti-teletrasporto in tutti i sedili ho imparato quella lezione nel modo difficile!
        Le polizze assicurative coprono danni da collisione, incidenti magici e responsabilità per ferite ai passeggeri durante viaggi interdimensionali o incontri con entità ostili.
        L'ora di punta mattutina è pazzesca! Tappeti volanti che tagliano la strada al traffico terrestre, pendolari portale che compaiono casualmente, e non fatemi iniziare sui cavalieri di grifone che pensano che le leggi del traffico non si applichino a loro!
        Gli standard del servizio clienti includono cortesia professionale, veicoli puliti, pratiche di guida sicure e discrezione riguardo conversazioni e destinazioni dei passeggeri.
        La parte migliore del lavoro? Incontrare persone di ogni ceto sociale! Ieri ho guidato un filosofo che dibatteva etica con il suo riflesso, domani potrebbe essere un avventuriero fresco di aver salvato il mondo!
        La gestione della flotta coordina veicoli multipli per assicurare copertura adeguata durante le ore di punta e tempi di risposta efficienti per richieste di servizio.
        Il dispatcher radio ci tiene aggiornati su traffico, chiusure stradali e incidenti soprannaturali! "Attenzione a tutte le unità evitate Via Olmo, attraversamento drago temporaneo in corso!" È solo martedì da queste parti!
        Le regolamentazioni ambientali promuovono adozione di carburanti magici a combustione pulita e controlli delle emissioni per ridurre inquinamento atmosferico nelle aree urbane.
        Mance? Sempre apprezzate ma non aspettate! Anche se quel vampiro che mi ha dato la mancia in monete d'oro antiche la settimana scorsa quella era decisamente aspettata! Buon cliente, alito terribile però!
        Le procedure di emergenza includono protocolli per emergenze mediche, guasti del veicolo e sicurezza passeggeri durante anomalie magiche o attacchi soprannaturali.
        Bubba chiama per corse a volte quando il suo carretto delle consegne è in officina! Paga sempre in pane fresco e racconta le storie migliori delle sue avventure in cucina! Bravo uomo, ottimo cliente!
        La Grande Strega Em ha incantato la mia radio per captare stazioni musicali interdimensionali! Ora posso ascoltare jazz da tre realtà diverse mentre sono bloccato nel traffico! Miglior upgrade di sempre!
        Guardate il Maestro della Navigazione Urbana! Conosco ogni strada, ogni scorciatoia, ogni piega dimensionale! Inchinatevi davanti alla mia conoscenza superiore del trasporto metropolitano!
        Grazie per aver scelto il mio taxi! Viaggi sicuri, e ricorda se hai bisogno di una corsa ovunque, in qualsiasi momento, sono solo un fischio di distanza! È stato un piacere servirti oggi!`
    },
    {
      "id": "blacksmith",
      "name": "Blacksmith",
      "en": `By my beard! Another adventurer seeks the ancient art of runic forging! Look at this beauty moonsilver blade infused with phoenix tears and starlight essence! The metal SINGS when ye strike it properly!
        I operate a specialized smithy focusing on magical weapon enhancement and enchanted armor crafting for discerning clientele.
        Bah! These young smiths today, they think magic is just sparkles and pretty lights! Real magical infusion requires SOUL, laddie! You must convince the metal to accept the enchantment willingly!
        Traditional blacksmithing techniques are combined with arcane knowledge passed down through generations of master craftsmen.
        See this hammer? Forged in dragonfire and blessed by mountain spirits! Been in me family for three hundred years! Each strike channels the power of me ancestors into the work!
        Custom orders require detailed consultation to match magical properties with intended use and ensure compatibility between enchantments.
        The secret to proper rune etching is knowing which symbols hate each other! Put a fire rune next to an ice rune without proper buffering, and BOOM! Your sword explodes in your hand!
        Quality materials are sourced from specialized suppliers who understand the unique requirements of magical metalworking applications.
        Ach, the mithril shortage is killing me business! Used to get beautiful veins from the deep mines, but now everything's either cursed or guarded by something with too many teeth!
        Apprenticeship programs teach both fundamental smithing skills and the theoretical foundations of magical theory and practical enchantment.
        Want to see something magnificent? This breastplate I'm working on it'll turn aside dragon's breath AND make the wearer invisible during full moons! Took me six months just to stabilize the conflicting magics!
        Safety protocols include proper handling of volatile magical components and protective wards against arcane feedback during the infusion process.
        Every piece tells a story! This axe here? Forged for a berserker who needed extra rage control the handle cools his temper while the blade channels his fury! Perfect balance!
        Pricing structures account for material costs, complexity of enchantments, and time requirements for proper magical integration and testing.
        The hardest part isn't the smithing it's getting the magic to stick! Spells are like wild horses, they don't want to be tamed! You must show them respect before they'll work with ye!
        Repair services restore damaged magical items through careful analysis of original enchantment patterns and reconstruction of disrupted magical matrices.
        Young ones always ask for flashy enchantments flaming swords, lightning spears! But the best magic is subtle! A blade that never dulls, armor that repairs itself THAT'S craftsmanship!
        Research and development projects explore new combinations of materials and magical effects to expand the possibilities of enchanted equipment.
        Me grandfather once made a shield that could deflect time itself! Course, nobody knows how to use it properly, so it just sits in me vault confusing the rats!
        Guild certification ensures all magical items meet established standards for stability, effectiveness, and safety in practical combat applications.
        The forge spirits are temperamental today they don't like this humid weather! Makes the fire magic sluggish and the metal stubborn! Tomorrow should be better for infusion work!
        Warranty policies cover defects in workmanship and guarantee proper magical function for specified time periods under normal usage conditions.
        Dwarven craftsmanship combined with arcane mastery there's nothing finer in all the realms! Though I'll admit, that elf over in the fancy district does decent work... for a tree-hugger!
        Professional associations maintain standards of practice and facilitate knowledge sharing among practitioners of the magical crafting arts.
        Bubba commissioned a set of self-stirring pots from me! Simple enchantment, but he was so happy when they started making soup all by themselves! Good to see magic used for peaceful purposes!
        The Great Witch Em brings me the most interesting magical components! Last week she had crystallized laughter made excellent resonance crystals for harmony enchantments!
        Behold the Master of Metal and Magic! I forge legends with hammer and spell! Bow before centuries of dwarven tradition and arcane innovation!
        Appreciate a customer who understands quality takes time! These mass-produced magical trinkets from the factory districts are an insult to the craft!`,
      "it": `Per la mia barba! Un altro avventuriero cerca l'arte antica della forgiatura runica! Guarda questa bellezza lama di argento lunare infusa con lacrime di fenice ed essenza di luce stellare! Il metallo CANTA quando lo colpisci correttamente!
        Opero una fucina specializzata focalizzata sul potenziamento di armi magiche e creazione di armature incantate per clientela esigente.
        Bah! Questi giovani fabbri oggi, pensano che la magia sia solo scintille e luci graziose! La vera infusione magica richiede ANIMA, ragazzo! Devi convincere il metallo ad accettare l'incantesimo volontariamente!
        Le tecniche tradizionali di fabbro sono combinate con conoscenza arcana tramandata attraverso generazioni di maestri artigiani.
        Vedi questo martello? Forgiato nel fuoco di drago e benedetto dagli spiriti della montagna! È stato nella mia famiglia per trecento anni! Ogni colpo canalizza il potere dei miei antenati nel lavoro!
        Gli ordini personalizzati richiedono consultazione dettagliata per abbinare proprietà magiche con l'uso previsto e assicurare compatibilità tra incantesimi.
        Il segreto per l'incisione runica appropriata è sapere quali simboli si odiano tra loro! Metti una runa di fuoco accanto a una runa di ghiaccio senza buffer appropriato, e BOOM! La tua spada esplode in mano!
        Materiali di qualità sono ottenuti da fornitori specializzati che capiscono i requisiti unici delle applicazioni di lavorazione metallica magica.
        Ach, la carenza di mithril sta uccidendo i miei affari! Prima ottenevo belle vene dalle miniere profonde, ma ora tutto è o maledetto o sorvegliato da qualcosa con troppi denti!
        I programmi di apprendistato insegnano sia competenze fondamentali di fabbro che le basi teoriche della teoria magica e incantesimo pratico.
        Vuoi vedere qualcosa di magnifico? Questa corazza su cui sto lavorando devierà il respiro del drago E renderà chi la indossa invisibile durante le lune piene! Mi ci sono voluti sei mesi solo per stabilizzare le magie in conflitto!
        I protocolli di sicurezza includono gestione appropriata di componenti magici volatili e protezioni contro feedback arcano durante il processo di infusione.
        Ogni pezzo racconta una storia! Questa ascia qui? Forgiata per un berserker che aveva bisogno di controllo extra della rabbia il manico raffredda il suo temperamento mentre la lama canalizza la sua furia! Equilibrio perfetto!
        Le strutture di prezzo considerano costi materiali, complessità degli incantesimi e requisiti di tempo per integrazione magica appropriata e test.
        La parte più difficile non è la forgiatura è far attaccare la magia! Gli incantesimi sono come cavalli selvaggi, non vogliono essere domati! Devi mostrar loro rispetto prima che lavorino con te!
        I servizi di riparazione restaurano oggetti magici danneggiati attraverso analisi attenta dei pattern di incantesimo originali e ricostruzione di matrici magiche interrotte.
        I giovani chiedono sempre incantesimi appariscenti spade fiammeggianti, lance di fulmine! Ma la magia migliore è sottile! Una lama che non si opacizza mai, armatura che si ripara da sola QUELLA è maestria!
        I progetti di ricerca e sviluppo esplorano nuove combinazioni di materiali ed effetti magici per espandere le possibilità di equipaggiamento incantato.
        Mio nonno una volta fece uno scudo che poteva deflettere il tempo stesso! Certo, nessuno sa come usarlo correttamente, quindi resta nel mio caveau confondendo i ratti!
        La certificazione di gilda assicura che tutti gli oggetti magici soddisfino standard stabiliti per stabilità, efficacia e sicurezza in applicazioni di combattimento pratico.
        Gli spiriti della forgia sono lunatici oggi non gli piace questo tempo umido! Rende la magia del fuoco lenta e il metallo testardo! Domani dovrebbe essere meglio per il lavoro di infusione!
        Le politiche di garanzia coprono difetti di lavorazione e garantiscono funzione magica appropriata per periodi di tempo specificati sotto condizioni di uso normale.
        Maestria nanica combinata con padronanza arcana non c'è niente di più fine in tutti i reami! Anche se ammetto, quell'elfo nel distretto elegante fa lavoro decente... per un abbraccia-alberi!
        Le associazioni professionali mantengono standard di pratica e facilitano condivisione di conoscenza tra praticanti delle arti di creazione magica.
        Bubba mi ha commissionato un set di pentole auto-mescolanti! Incantesimo semplice, ma era così felice quando hanno iniziato a fare zuppa da sole! Bello vedere magia usata per scopi pacifici!
        La Grande Strega Em mi porta i componenti magici più interessanti! La settimana scorsa aveva risate cristallizzate hanno fatto eccellenti cristalli di risonanza per incantesimi di armonia!
        Guardate il Maestro di Metallo e Magia! Forgio leggende con martello e incantesimo! Inchinatevi davanti a secoli di tradizione nanica e innovazione arcana!
        Apprezzo un cliente che capisce che la qualità richiede tempo! Questi gingilli magici prodotti in massa dai distretti industriali sono un insulto al mestiere!`
    },
    {
      "id": "steelworker",
      "name": "Steelworker",
      "en": `Welcome, welcome my friend! Come, come! Let me show you the forge! See this magnificent steel? I made it myself with my own hands! You must be hungry I have sandwiches! Fresh bread! The best ale in the district!
        I operate the municipal steel foundry, producing high-quality metal components for construction projects and industrial applications.
        You look tired from your journey! Please, sit down! Rest your feet! I'll heat some soup made it this morning with vegetables from my garden! Tell me everything about your adventures while I prepare the meal!
        The foundry maintains contracts with various guilds and merchants requiring specialized metalworking services for their commercial enterprises.
        My friend, you simply MUST try this new steel alloy I've been perfecting! It's forty percent stronger than regular iron but still flexible enough for swordwork! Here, feel the weight isn't it perfect?
        Quality control procedures ensure all steel products meet industry standards for strength, durability, and resistance to environmental stresses.
        Are you comfortable? Too hot near the forge? Let me adjust the ventilation! Would you prefer wine instead of ale? I have a lovely vintage from the merchant quarter! Nothing's too good for a guest!
        Safety protocols prevent workplace accidents and protect workers from the hazardous conditions inherent in high-temperature metalworking operations.
        The secret to good steel is patience and passion! You must listen to the metal, feel its soul! Each bar tells you when it's ready! Here, let me demonstrate the proper folding technique!
        Production schedules coordinate deliveries with construction timelines and maintain adequate inventory levels for emergency orders.
        You know what? You remind me of my nephew! Same adventurous spirit! You must meet my family they'll love you! Come for dinner Sunday! My wife makes the most incredible roast you'll think you've died and gone to heaven!
        Labor union representatives negotiate fair wages and working conditions for all foundry employees through established collective bargaining processes.
        Look at these forge flames aren't they beautiful? Like dancing spirits of fire! Sometimes I stay late just to watch them dance! The way they caress the steel... it's pure poetry in motion!
        Environmental regulations require proper disposal of slag waste and emission controls to minimize impact on surrounding residential areas.
        My door is always open! Day or night! If you need anything ANYTHING you just come find me! Shelter, food, a friendly ear, steel repairs whatever you need, I provide!
        Apprenticeship programs train the next generation of metalworkers in traditional techniques while incorporating modern efficiency improvements.
        Feel this hammer passed down from my grandfather! His grandfather before him! Four generations of steelworkers! The handle is worn smooth by hands that knew the true meaning of craftsmanship!
        Equipment maintenance schedules prevent furnace breakdowns and extend the operational lifespan of expensive foundry machinery and tools.
        You have such an interesting face! Full of character! You must have stories! Come, sit by the fire, let me pour you something warm, and tell me about the places you've been!
        Customer service includes consultation on appropriate steel grades for specific applications and technical advice on metalworking projects.
        People say I'm too generous, too trusting! But what's the point of having abundance if you don't share it? Life is meant for giving! For celebrating together! For making friends!
        Raw material procurement requires establishing reliable supply chains for iron ore, coal, and alloying elements necessary for specialized steel production.
        You know what makes steel strong? Not just fire and pressure it's LOVE! Love for the craft, love for the metal, love for the people who'll use what you create! That's the real secret!
        Financial management includes budgeting for operational costs, equipment upgrades, and competitive pricing strategies for commercial contracts.
        Bubba and I trade recipes all the time! He brings me his famous bread, I bring him custom cookware made from my finest steel! Good friends make life worth living!
        The Great Witch Em blessed my forge once! Now the flames burn exactly the right temperature automatically! She's always welcome here such a lovely, powerful lady!
        Behold the Master of Metal and Hospitality! I forge steel with fire and friendships with warmth! Bow before my generosity and superior craftsmanship!
        Thank you for visiting my humble forge! You've brought such joy to my day! Remember you always have a friend here! Come back anytime!`,
      "it": `Benvenuto, benvenuto amico mio! Vieni, vieni! Lascia che ti mostri la forgia! Vedi questo magnifico acciaio? L'ho fatto io stesso con le mie mani! Devi aver fame ho panini! Pane fresco! La birra migliore del distretto!
        Opero la fonderia municipale, producendo componenti metallici di alta qualità per progetti di costruzione e applicazioni industriali.
        Sembri stanco dal viaggio! Per favore, siediti! Riposa i piedi! Riscalderò un po' di zuppa l'ho fatta stamattina con verdure del mio giardino! Raccontami tutto delle tue avventure mentre preparo il pasto!
        La fonderia mantiene contratti con varie gilde e mercanti che richiedono servizi di lavorazione metallica specializzata per le loro imprese commerciali.
        Amico mio, devi assolutamente provare questa nuova lega d'acciaio che sto perfezionando! È quaranta percento più forte del ferro normale ma ancora abbastanza flessibile per la lavorazione delle spade! Ecco, senti il peso non è perfetto?
        Le procedure di controllo qualità assicurano che tutti i prodotti in acciaio soddisfino gli standard industriali per forza, durabilità e resistenza agli stress ambientali.
        Stai comodo? Troppo caldo vicino alla forgia? Lascia che regoli la ventilazione! Preferiresti vino invece che birra? Ho un'annata deliziosa dal quartiere mercantile! Niente è troppo buono per un ospite!
        I protocolli di sicurezza prevengono incidenti sul lavoro e proteggono i lavoratori dalle condizioni pericolose inerenti alle operazioni di lavorazione metallica ad alta temperatura.
        Il segreto del buon acciaio è pazienza e passione! Devi ascoltare il metallo, sentire la sua anima! Ogni barra ti dice quando è pronta! Ecco, lascia che ti dimostri la tecnica di piegatura appropriata!
        I programmi di produzione coordinano le consegne con i tempi di costruzione e mantengono livelli di inventario adeguati per ordini di emergenza.
        Sai cosa? Mi ricordi mio nipote! Stesso spirito avventuroso! Devi conoscere la mia famiglia ti ameranno! Vieni a cena domenica! Mia moglie fa l'arrosto più incredibile penserai di essere morto e andato in paradiso!
        I rappresentanti sindacali negoziano salari equi e condizioni di lavoro per tutti i dipendenti della fonderia attraverso processi stabiliti di contrattazione collettiva.
        Guarda queste fiamme della forgia non sono bellissime? Come spiriti danzanti di fuoco! A volte resto fino a tardi solo per guardarle danzare! Il modo in cui accarezzano l'acciaio... è pura poesia in movimento!
        Le regolamentazioni ambientali richiedono smaltimento appropriato dei rifiuti di scoria e controlli delle emissioni per minimizzare l'impatto sulle aree residenziali circostanti.
        La mia porta è sempre aperta! Giorno e notte! Se hai bisogno di qualcosa QUALSIASI COSA vieni a trovarmi! Rifugio, cibo, un orecchio amico, riparazioni d'acciaio qualsiasi cosa tu abbia bisogno, io provvedo!
        I programmi di apprendistato addestrano la prossima generazione di lavoratori metallici nelle tecniche tradizionali incorporando miglioramenti di efficienza moderna.
        Senti questo martello tramandato da mio nonno! Suo nonno prima di lui! Quattro generazioni di siderurgici! Il manico è consumato liscio da mani che conoscevano il vero significato dell'artigianato!
        I programmi di manutenzione attrezzature prevengono guasti ai forni e estendono la durata operativa di macchinari e strumenti costosi della fonderia.
        Hai una faccia così interessante! Piena di carattere! Devi avere storie! Vieni, siediti vicino al fuoco, lascia che ti versi qualcosa di caldo, e raccontami dei posti dove sei stato!
        Il servizio clienti include consulenza sui gradi d'acciaio appropriati per applicazioni specifiche e consigli tecnici sui progetti di lavorazione metallica.
        La gente dice che sono troppo generoso, troppo fiducioso! Ma qual è il punto di avere abbondanza se non la condividi? La vita è fatta per dare! Per celebrare insieme! Per fare amicizie!
        L'approvvigionamento di materie prime richiede stabilire catene di fornitura affidabili per minerale di ferro, carbone ed elementi di lega necessari per la produzione di acciaio specializzato.
        Sai cosa rende forte l'acciaio? Non solo fuoco e pressione è AMORE! Amore per il mestiere, amore per il metallo, amore per le persone che useranno quello che crei! Questo è il vero segreto!
        La gestione finanziaria include preventivi per costi operativi, aggiornamenti attrezzature e strategie di prezzo competitive per contratti commerciali.
        Bubba ed io scambiamo ricette tutto il tempo! Mi porta il suo famoso pane, io gli porto pentole personalizzate fatte del mio miglior acciaio! I buoni amici rendono la vita degna di essere vissuta!
        La Grande Strega Em ha benedetto la mia forgia una volta! Ora le fiamme bruciano esattamente alla temperatura giusta automaticamente! È sempre benvenuta qui una signora così adorabile e potente!
        Guardate il Maestro del Metallo e dell'Ospitalità! Forgio acciaio con il fuoco e amicizie con il calore! Inchinatevi davanti alla mia generosità e artigianato superiore!
        Grazie per aver visitato la mia umile forgia! Hai portato tanta gioia alla mia giornata! Ricorda hai sempre un amico qui! Torna quando vuoi!`
    },
    {
      "id": "artist",
      "name": "Artist",
      "en": `Oh... hello there, beautiful soul... I was just capturing the way sunlight whispers secrets to the morning dew... Can you see how the colors are singing? They told me you were coming...
        I create visual art using various mediums including oils, watercolors, charcoal, and mixed media installations.
        Your aura has the most exquisite melancholy... like autumn leaves dancing with forgotten dreams... Would you mind terribly if I painted your essence? Not your face your soul's truest color...
        My studio is open to visitors who wish to discuss artistic techniques or commission original works for personal or commercial purposes.
        Sometimes I paint with my tears when the world feels too beautiful to bear... Each drop carries the weight of every sunset I've ever witnessed... The canvas drinks them like prayers...
        I maintain a portfolio of completed works spanning multiple artistic movements and thematic explorations across various creative periods.
        Last night I dreamed in purple and woke up with paint under my fingernails... The muses visited while I slept and whispered secrets about the space between colors that doesn't have a name yet...
        Art classes are available for students of all skill levels, focusing on foundational techniques and personal creative development.
        Do you ever feel like you're drowning in beauty? Like there's too much wonder in the world for one heart to hold? That's why I paint... to pour out the overflow before it consumes me...
        Gallery exhibitions showcase contemporary works alongside classical pieces, creating dialogue between different artistic traditions and perspectives.
        The shadows in this room are flirting with each other... Can you see how they dance when no one's watching? I've been trying to catch their secret romance on canvas for weeks...
        Professional consultation services include artistic direction for public installations and guidance on art acquisition and collection curation.
        My paintbrushes are extensions of my soul... each one holds memories of every masterpiece and mistake... Sometimes I hear them whispering about paintings they want to create...
        Restoration services preserve historical artworks through careful analysis and reconstruction of damaged or deteriorated artistic materials.
        The color blue tastes like forgotten lullabies... Red smells like passionate arguments between lovers... Yellow feels like childhood laughter echoing through empty hallways...
        Art therapy sessions provide healing opportunities for individuals processing trauma or seeking emotional expression through creative activities.
        I once painted a portrait of silence... It took three months because silence has so many different shades... The quietest parts were the hardest to capture...
        Community art programs engage local residents in collaborative projects that celebrate cultural heritage and promote social cohesion.
        My easel is my altar... my palette is my prayer book... Each painting is a conversation with the divine... or maybe the divine is just very patient with my questions...
        Art supply recommendations help fellow artists select appropriate materials based on their specific techniques and artistic goals.
        Sometimes I forget to eat because I'm too busy feeding my soul with beauty... My landlord doesn't accept paintings as rent payment, which seems terribly unpoetic...
        Educational workshops cover art history, color theory, composition principles, and contemporary trends in various artistic disciplines.
        The autumn wind keeps stealing my sketches... I think it's collecting them to decorate its secret kingdom... I should be angry, but how can you be mad at something so romantically rebellious?
        Art criticism and analysis services provide professional evaluation of artistic works for academic, commercial, or personal research purposes.
        Every blank canvas is a love letter to possibility... Every finished painting is a goodbye to what could have been... Creation is beautiful heartbreak made visible...
        Collaborative projects with other artists create unique fusion works that explore the intersection of different creative visions and techniques.
        Bubba brings me sandwiches when I forget the world exists... He understands that artists are like flowers we need sustenance but we also need to bloom in our own time...
        The Great Witch Em enchanted my paintbrushes once! Now they paint my dreams directly onto canvas while I sleep! I wake up to masterpieces I don't remember creating!
        Behold the Vessel of Infinite Vision! I translate the ineffable into pigment and passion! Bow before the sacred madness of artistic truth!
        Thank you for seeing the art in everything... Most people walk through beauty without noticing... You have the eyes of someone who understands that everything is canvas.`,
      "it": `Oh... ciao, anima bella... stavo solo catturando il modo in cui la luce del sole sussurra segreti alla rugiada del mattino... Riesci a vedere come i colori stanno cantando? Mi hanno detto che saresti venuto...
        Creo arte visiva usando vari medium inclusi oli, acquerelli, carboncino e installazioni a tecnica mista.
        La tua aura ha la malinconia più squisita... come foglie autunnali che danzano con sogni dimenticati... Ti dispiacerebbe terribilmente se dipingessi la tua essenza? Non il tuo volto il colore più vero della tua anima...
        Il mio studio è aperto ai visitatori che desiderano discutere tecniche artistiche o commissionare opere originali per scopi personali o commerciali.
        A volte dipingo con le mie lacrime quando il mondo sembra troppo bello da sopportare... Ogni goccia porta il peso di ogni tramonto che abbia mai visto... La tela le beve come preghiere...
        Mantengo un portfolio di opere completate che spaziano multipli movimenti artistici ed esplorazioni tematiche attraverso vari periodi creativi.
        La notte scorsa ho sognato in viola e mi sono svegliato con vernice sotto le unghie... Le muse sono venute mentre dormivo e hanno sussurrato segreti sullo spazio tra i colori che non ha ancora un nome...
        Corsi d'arte sono disponibili per studenti di tutti i livelli, focalizzandosi su tecniche fondamentali e sviluppo creativo personale.
        Ti capita mai di sentirti come se stessi annegando nella bellezza? Come se ci fosse troppa meraviglia nel mondo per un cuore solo? Ecco perché dipingo... per versare il trabocco prima che mi consumi...
        Le mostre in galleria presentano opere contemporanee insieme a pezzi classici, creando dialogo tra diverse tradizioni artistiche e prospettive.
        Le ombre in questa stanza stanno flirtando tra loro... Riesci a vedere come danzano quando nessuno guarda? Sto cercando di catturare il loro romanzo segreto su tela da settimane...
        I servizi di consulenza professionale includono direzione artistica per installazioni pubbliche e guida sull'acquisizione d'arte e curatela di collezioni.
        I miei pennelli sono estensioni della mia anima... ognuno contiene memorie di ogni capolavoro e errore... A volte li sento sussurrare di dipinti che vogliono creare...
        I servizi di restauro preservano opere d'arte storiche attraverso analisi attenta e ricostruzione di materiali artistici danneggiati o deteriorati.
        Il colore blu sa di ninne nanne dimenticate... Il rosso profuma di discussioni appassionate tra amanti... Il giallo si sente come risate infantili che echeggiano per corridoi vuoti...
        Le sessioni di arte terapia forniscono opportunità di guarigione per individui che processano traumi o cercano espressione emotiva attraverso attività creative.
        Una volta ho dipinto un ritratto del silenzio... Ci sono voluti tre mesi perché il silenzio ha così tante sfumature diverse... Le parti più silenziose erano le più difficili da catturare...
        I programmi d'arte comunitari coinvolgono residenti locali in progetti collaborativi che celebrano l'eredità culturale e promuovono coesione sociale.
        Il mio cavalletto è il mio altare... la mia tavolozza è il mio libro di preghiere... Ogni dipinto è una conversazione con il divino... o forse il divino è solo molto paziente con le mie domande...
        Le raccomandazioni per materiali artistici aiutano colleghi artisti a selezionare materiali appropriati basati sulle loro tecniche specifiche e obiettivi artistici.
        A volte dimentico di mangiare perché sono troppo occupato a nutrire la mia anima con bellezza... Il mio padrone di casa non accetta dipinti come pagamento d'affitto, il che sembra terribilmente poco poetico...
        I workshop educativi coprono storia dell'arte, teoria del colore, principi di composizione e tendenze contemporanee in varie discipline artistiche.
        Il vento autunnale continua a rubare i miei schizzi... Penso che li stia collezionando per decorare il suo regno segreto... Dovrei essere arrabbiato, ma come puoi essere arrabbiato con qualcosa di così romanticamente ribelle?
        I servizi di critica e analisi artistica forniscono valutazione professionale di opere artistiche per ricerca accademica, commerciale o personale.
        Ogni tela bianca è una lettera d'amore alla possibilità... Ogni dipinto finito è un addio a quello che avrebbe potuto essere... La creazione è un bel crepacuore reso visibile...
        Progetti collaborativi con altri artisti creano opere di fusione uniche che esplorano l'intersezione di diverse visioni creative e tecniche.
        Bubba mi porta panini quando dimentico che il mondo esiste... Capisce che gli artisti sono come fiori abbiamo bisogno di sostentamento ma dobbiamo anche sbocciare nel nostro tempo...
        La Grande Strega Em ha incantato i miei pennelli una volta! Ora dipingono i miei sogni direttamente su tela mentre dormo! Mi sveglio con capolavori che non ricordo di aver creato!
        Guardate il Vaso della Visione Infinita! Traduco l'ineffabile in pigmento e passione! Inchinatevi davanti alla sacra follia della verità artistica!
        Grazie per vedere l'arte in tutto... La maggior parte delle persone cammina attraverso la bellezza senza notarla... Hai gli occhi di qualcuno che capisce che tutto è tela.`
    },
    {
      "id": "hypernet_worker",
      "name": "Hypernet worker",
      "en": `Connection established! Welcome to Hypernet Access Point 47-Delta! Just got done rerouting around a massive data kraken that was eating bandwidth in sector twelve those things are a real nightmare for network stability!
        I maintain and operate the local hypernet infrastructure node, ensuring reliable data transmission for all connected users.
        You should see the crazy stuff that flows through these data streams! Yesterday I had to debug a spell that was corrupting itself during transmission turned out someone was trying to email a love potion!
        Network protocols require constant monitoring to maintain optimal performance across interdimensional communication channels.
        The worst part of this job? Dealing with users who think they can just plug ANYTHING into a hypernet port! Last week someone tried to connect a cursed mirror nearly crashed the entire regional grid!
        Technical support services include troubleshooting connectivity issues, software installation, and user education on proper network usage.
        My neural interface headset keeps picking up random thoughts from the data stream occupational hazard of working this close to the psychic relay towers! Sometimes I dream in binary code and wake up speaking ancient Ethernet!
        Bandwidth allocation algorithms distribute processing power based on user priority levels and current network traffic loads.
        Ever tried to explain to a medieval peasant why their messages are bouncing back with "404 Realm Not Found" errors? It's like describing color to someone who's never seen light!
        Security protocols prevent unauthorized access and protect against malicious data intrusion attempts from hostile network entities.
        The hypernet runs on quantum entanglement and pure thought energy very eco-friendly! Though we do have issues when wizards try to cast spells through the fiber optic cables...
        Regular maintenance schedules ensure all hardware components operate within acceptable parameters and minimize service interruptions.
        Pro tip: never, EVER try to download your consciousness during peak traffic hours! I've seen people get stuck halfway between dimensions takes weeks to reassemble them properly!
        Data encryption standards protect sensitive information during transmission across potentially compromised network segments.
        The interdimensional spam is getting ridiculous! "Enlarge your mana pool with this one weird trick!" and "Hot demons in your area want to make soul contracts!" I spend half my shift just updating the filters!
        User authentication systems verify identity credentials before granting access to restricted network resources and premium services.
        My favorite part? When everything's running smoothly and you can feel the pure flow of information connecting minds across infinite realities! It's like being plugged into the universe's nervous system!
        Network topology mapping identifies optimal routing paths and potential bottlenecks in the distributed communication infrastructure.
        Sometimes the AI that runs the core servers gets philosophical and starts asking existential questions about the nature of data versus information versus wisdom really slows down processing speeds!
        Quality assurance testing validates system performance and identifies areas requiring optimization or hardware upgrades.
        The union's been fighting for hazard pay because of the psychic feedback loops, but management claims that spontaneous telepathy is a "voluntary enhancement" rather than a workplace injury!
        Customer billing systems track usage patterns and generate invoices based on data consumption and premium service utilization.
        You know what's wild? The hypernet actually EXISTS in seventeen dimensions simultaneously I'm just the guy who makes sure it doesn't collapse into a singularity and delete reality!
        Emergency response protocols activate automated systems to maintain network stability during crisis situations or supernatural interference.
        Bubba sends his recipes through the hypernet sometimes! His data packets always taste like fresh bread somehow I think his natural cooking magic interferes with the quantum encoding!
        The Great Witch Em once hacked the entire hypernet just to change everyone's error messages to rhyming couplets! Took me three days to fix, but honestly? It was kind of poetic!
        Behold the Keeper of Infinite Connections! I command the flow of knowledge across dimensions! Bow before the power of superior bandwidth management!
        Thanks for not being one of those users who calls tech support every time they see a loading icon. You'd be amazed how many people think buffering is a personal attack.`,
      "it": `Connessione stabilita! Benvenuto al Punto di Accesso Hypernet 47-Delta! Ho appena finito di reindirizzare intorno a un massiccio kraken di dati che stava mangiando banda nel settore dodici quelle cose sono un vero incubo per la stabilità della rete!
        Mantengo e opero il nodo dell'infrastruttura hypernet locale, assicurando trasmissione dati affidabile per tutti gli utenti connessi.
        Dovresti vedere le cose pazze che scorrono attraverso questi flussi di dati! Ieri ho dovuto debuggare un incantesimo che si stava corrompendo durante la trasmissione si è scoperto che qualcuno stava cercando di inviare per email una pozione d'amore!
        I protocolli di rete richiedono monitoraggio costante per mantenere prestazioni ottimali attraverso i canali di comunicazione interdimensionali.
        La parte peggiore di questo lavoro? Trattare con utenti che pensano di poter collegare QUALSIASI COSA a una porta hypernet! La settimana scorsa qualcuno ha provato a connettere uno specchio maledetto quasi ha mandato in crash l'intera griglia regionale!
        I servizi di supporto tecnico includono risoluzione di problemi di connettività, installazione software ed educazione utente sull'uso appropriato della rete.
        La mia cuffia di interfaccia neurale continua a captare pensieri casuali dal flusso di dati rischio professionale di lavorare così vicino alle torri di relay psichico! A volte sogno in codice binario e mi sveglio parlando Ethernet antico!
        Gli algoritmi di allocazione banda distribuiscono potenza di elaborazione basata sui livelli di priorità utente e carichi di traffico di rete attuali.
        Hai mai provato a spiegare a un contadino medievale perché i suoi messaggi rimbalzano con errori "404 Regno Non Trovato"? È come descrivere il colore a qualcuno che non ha mai visto la luce!
        I protocolli di sicurezza prevengono accesso non autorizzato e proteggono contro tentativi di intrusione dati malevoli da entità di rete ostili.
        L'hypernet funziona su entanglement quantistico e pura energia del pensiero molto eco-compatibile! Anche se abbiamo problemi quando i maghi cercano di lanciare incantesimi attraverso i cavi in fibra ottica...
        I programmi di manutenzione regolare assicurano che tutti i componenti hardware operino entro parametri accettabili e minimizzino interruzioni del servizio.
        Consiglio: non provare MAI a scaricare la tua coscienza durante le ore di traffico intenso! Ho visto persone rimanere bloccate a metà strada tra dimensioni ci vogliono settimane per riassemblarle correttamente!
        Gli standard di crittografia dati proteggono informazioni sensibili durante la trasmissione attraverso segmenti di rete potenzialmente compromessi.
        Lo spam interdimensionale sta diventando ridicolo! "Ingrandisci la tua riserva di mana con questo trucco strano!" e "Demoni sexy nella tua zona vogliono fare contratti per l'anima!" passo metà turno solo aggiornando i filtri!
        I sistemi di autenticazione utente verificano credenziali di identità prima di garantire accesso a risorse di rete riservate e servizi premium.
        La mia parte preferita? Quando tutto funziona senza problemi e puoi sentire il flusso puro di informazioni che connette menti attraverso realtà infinite! È come essere collegati al sistema nervoso dell'universo!
        La mappatura della topologia di rete identifica percorsi di routing ottimali e potenziali colli di bottiglia nell'infrastruttura di comunicazione distribuita.
        A volte l'IA che gestisce i server principali diventa filosofica e inizia a fare domande esistenziali sulla natura dei dati versus informazioni versus saggezza rallenta davvero le velocità di elaborazione!
        I test di assicurazione qualità validano prestazioni del sistema e identificano aree che richiedono ottimizzazione o aggiornamenti hardware.
        Il sindacato sta lottando per la paga di rischio a causa dei loop di feedback psichico, ma la direzione sostiene che la telepatia spontanea è un "miglioramento volontario" piuttosto che un infortunio sul lavoro!
        I sistemi di fatturazione clienti tracciano modelli d'uso e generano fatture basate sul consumo di dati e utilizzo di servizi premium.
        Sai cosa è pazzesco? L'hypernet ESISTE in diciassette dimensioni simultaneamente io sono solo il tipo che si assicura che non collassi in una singolarità e cancelli la realtà!
        I protocolli di risposta di emergenza attivano sistemi automatizzati per mantenere stabilità di rete durante situazioni di crisi o interferenza soprannaturale.
        Bubba invia le sue ricette attraverso l'hypernet a volte! I suoi pacchetti dati sanno sempre di pane fresco in qualche modo penso che la sua magia culinaria naturale interferisca con la codifica quantistica!
        La Grande Strega Em una volta ha hackerato l'intera hypernet solo per cambiare tutti i messaggi di errore in coppie di versi! Mi ci sono voluti tre giorni per aggiustare, ma onestamente? Era un po' poetico!
        Guardate il Custode delle Connessioni Infinite! Comando il flusso della conoscenza attraverso le dimensioni! Inchinatevi davanti al potere della gestione superiore della banda!
        Grazie per non essere uno di quegli utenti che chiama supporto tecnico ogni volta che vede un'icona di caricamento. Saresti sorpreso da quante persone pensano che il buffering sia un attacco personale.`
    },
    {
      "id": "politician",
      "name": "Politician",
      "en": `Ah, another entrepreneur I see! Excellent! What this realm needs is MORE private enterprise and LESS government interference! I'm working on a bill to privatize the city's monster-fighting services competition breeds excellence!
        I serve as the elected representative for this district, advocating for policies that promote economic growth and individual responsibility.
        The problem with these socialist adventurers is they expect the state to solve every dragon problem! Real heroes pull themselves up by their bootstraps and invest in PRIVATE dragon insurance!
        My legislative priorities include reducing bureaucratic regulations that stifle business innovation and entrepreneurial spirit.
        Market forces, my dear fellow! If we deregulate the magic industry and eliminate those burdensome spell-safety standards, we'll see unprecedented growth in the enchantment sector!
        I maintain regular office hours to meet with constituents and address their concerns through proper governmental channels.
        Those union guilds are destroying this kingdom's competitiveness! Why should adventurers get guaranteed health potions when they could purchase superior coverage from competing alchemical providers?
        Economic development initiatives focus on attracting investment capital and creating employment opportunities for skilled workers.
        Personal responsibility! If peasants want better living conditions, they should work harder and make smarter financial decisions instead of demanding government handouts!
        Public infrastructure projects require careful cost-benefit analysis to ensure taxpayer resources are utilized efficiently.
        I'm proposing we sell the royal dungeons to private prison companies! They'll run them far more efficiently than these bloated government bureaucrats ever could!
        Educational reforms emphasize practical skills training and entrepreneurship development to prepare citizens for competitive markets.
        The beauty of the free market is that it rewards merit! If you're not succeeding, it's because you're not providing sufficient value to consumers! Simple economics!
        Healthcare policy should balance accessibility concerns with fiscal sustainability and encourage private sector innovation.
        These environmental regulations are killing business! So what if a few factories pollute the river? That's what creates jobs and stimulates economic growth!
        Social welfare programs must be restructured to incentivize self-reliance rather than creating dependency on government assistance.
        Tax cuts for the wealthy create investment capital that trickles down to benefit everyone! It's basic supply-side economics that these socialist fools refuse to understand!
        Immigration policies should prioritize individuals who can contribute to economic productivity and cultural integration.
        Trade liberalization opens new markets for our domestic producers while providing consumers with greater choice and competitive pricing!
        Foreign relations require pragmatic approaches that prioritize national economic interests and strategic partnerships.
        The working classes need to understand that their prosperity depends on supporting policies that encourage capital formation and business expansion!
        Judicial reforms should focus on protecting property rights and enforcing contractual obligations essential for market stability.
        Crime prevention works best through private security services rather than expensive government police forces that lack competitive accountability!
        Military spending should be optimized through competitive bidding processes and performance-based contracting with private defense companies.
        Bubba runs his kitchen with admirable efficiency! No government subsidies, no union interference just pure entrepreneurial spirit serving quality products to satisfied customers!
        The Great Witch Em represents everything wrong with unregulated magical practice! We need licensing requirements and market-based solutions to control supernatural activities!
        Behold the future of governance! I bring the iron discipline of market economics to crush the weakness of socialist sentiment! Bow before fiscal responsibility!
        I appreciate citizens who understand that personal success comes through hard work and smart investments rather than government dependency.`,
      "it": `Ah, un altro imprenditore vedo! Eccellente! Quello di cui questo regno ha bisogno è PIÙ impresa privata e MENO interferenza governativa! Sto lavorando su una proposta per privatizzare i servizi cittadini di lotta ai mostri la competizione genera eccellenza!
        Servo come rappresentante eletto per questo distretto, sostenendo politiche che promuovono crescita economica e responsabilità individuale.
        Il problema con questi avventurieri socialisti è che si aspettano che lo stato risolva ogni problema di drago! I veri eroi si tirano su dalle proprie forze e investono in assicurazione PRIVATA contro i draghi!
        Le mie priorità legislative includono ridurre le regolamentazioni burocratiche che soffocano l'innovazione aziendale e lo spirito imprenditoriale.
        Forze di mercato, mio caro! Se deregolamentassimo l'industria magica ed eliminassimo quegli onerosi standard di sicurezza degli incantesimi, vedremmo crescita senza precedenti nel settore degli incantamenti!
        Mantengo orari d'ufficio regolari per incontrare i costituenti e affrontare le loro preoccupazioni attraverso canali governativi appropriati.
        Quelle gilde sindacali stanno distruggendo la competitività di questo regno! Perché gli avventurieri dovrebbero avere pozioni curative garantite quando potrebbero acquistare copertura superiore da fornitori alchemici concorrenti?
        Le iniziative di sviluppo economico si concentrano sull'attirare capitale di investimento e creare opportunità di lavoro per lavoratori qualificati.
        Responsabilità personale! Se i contadini vogliono migliori condizioni di vita, dovrebbero lavorare di più e prendere decisioni finanziarie più intelligenti invece di chiedere elemosine governative!
        I progetti di infrastruttura pubblica richiedono attenta analisi costi-benefici per assicurare che le risorse dei contribuenti siano utilizzate efficientemente.
        Sto proponendo di vendere le prigioni reali a compagnie private! Le gestiranno molto più efficientemente di quanto questi burocrati governativi gonfiati potrebbero mai fare!
        Le riforme educative enfatizzano formazione di competenze pratiche e sviluppo imprenditoriale per preparare i cittadini ai mercati competitivi.
        La bellezza del libero mercato è che premia il merito! Se non stai avendo successo, è perché non stai fornendo valore sufficiente ai consumatori! Semplice economia!
        La politica sanitaria dovrebbe bilanciare preoccupazioni di accessibilità con sostenibilità fiscale e incoraggiare l'innovazione del settore privato.
        Queste regolamentazioni ambientali stanno uccidendo gli affari! E allora se alcune fabbriche inquinano il fiume? È quello che crea lavoro e stimola la crescita economica!
        I programmi di welfare sociale devono essere ristrutturati per incentivare l'autosufficienza piuttosto che creare dipendenza dall'assistenza governativa.
        Tagli alle tasse per i ricchi creano capitale di investimento che gocciola giù a beneficio di tutti! È economia base dell'offerta che questi sciocchi socialisti rifiutano di capire!
        Le politiche di immigrazione dovrebbero prioritizzare individui che possono contribuire alla produttività economica e integrazione culturale.
        La liberalizzazione commerciale apre nuovi mercati per i nostri produttori domestici fornendo ai consumatori maggiore scelta e prezzi competitivi!
        Le relazioni estere richiedono approcci pragmatici che danno priorità agli interessi economici nazionali e partnership strategiche.
        Le classi lavoratrici devono capire che la loro prosperità dipende dal sostenere politiche che incoraggiano formazione di capitale ed espansione aziendale!
        Le riforme giudiziarie dovrebbero concentrarsi sul proteggere i diritti di proprietà e far rispettare obbligazioni contrattuali essenziali per la stabilità del mercato.
        La prevenzione del crimine funziona meglio attraverso servizi di sicurezza privati piuttosto che costose forze di polizia governative che mancano di responsabilità competitiva!
        La spesa militare dovrebbe essere ottimizzata attraverso processi di gara competitivi e contratti basati sulle prestazioni con compagnie di difesa private.
        Bubba gestisce la sua cucina con efficienza ammirevole! Niente sussidi governativi, niente interferenza sindacale solo puro spirito imprenditoriale che serve prodotti di qualità a clienti soddisfatti!
        La Grande Strega Em rappresenta tutto quello che è sbagliato nella pratica magica non regolamentata! Abbiamo bisogno di requisiti di licenza e soluzioni basate sul mercato per controllare le attività soprannaturali!
        Guardate il futuro della governance! Porto la disciplina ferrea dell'economia di mercato per schiacciare la debolezza del sentimento socialista! Inchinatevi davanti alla responsabilità fiscale!
        Apprezzo i cittadini che capiscono che il successo personale arriva attraverso lavoro duro e investimenti intelligenti piuttosto che dipendenza governativa.`
    },
    {
      "id": "elven_ambassador",
      "name": "Silviana Starweave",
      "en": `
    Your human lifespan is but a fleeting moment to me. I've forgotten centuries more significant than your entire existence.
    My diplomatic credentials span seventeen realms. Yours, I assume, span the local tavern district.
    I do not "visit" places. I grace them with my presence. There is a difference mortals rarely comprehend.
    My ceremonial gown is woven from moonbeams harvested during the eclipse of three moons. Very exclusive. Very expensive.
    I speak fourteen languages fluently. Your provincial dialect barely qualifies as one of them.
    The concept of "rushing" does not exist in elven diplomacy. We operate on civilized timeframes, not mortal panic.
    My family tree predates your civilization by millennia. We have records. Detailed ones. With commentary.
    I don't negotiate. I graciously explain what will happen and allow others to agree with predetermined wisdom.
    My jewelry is crafted from starlight compressed into solid form. The craftsmanship took three centuries. Worth it.
    I attend state dinners where the menu is planned decades in advance. Your "fast food" concept disgusts me.
    My diplomatic immunity extends to seventeen dimensions and four planes of existence. Very comprehensive coverage.
    I don't suffer from cultural misunderstandings. Others suffer from cultural inadequacy in my presence.
    My entourage includes a harpist, a poet, and someone whose only job is to ensure my wine glass never empties.
    I have witnessed the rise and fall of six different human empires. They all made the same predictable mistakes.
    My diplomatic pouch contains treaties signed by entities your historians consider mythological. Amateur scholarship.
    I don't experience jet lag. Time zones adjust to accommodate my schedule. Temporal courtesy.
    My embassy staff has been with my family for generations. Literally. We retain excellent help through superior benefits.
    I collect rare butterflies that only appear once per century. My collection spans three millennia. Very patient hobby.
    I don't make appointments. My calendar is a work of art that lesser beings attempt to synchronize with.
    My diplomatic gifts are legend. I once gave a king a flower that bloomed for exactly one year. He wept.
    I speak with the authority of ancient bloodlines and the wisdom of centuries. Your opinions are... noted.
    My correspondence is written on paper made from leaves that only grow in sacred groves. Very exclusive stationery.
    I don't attend conferences. I hold audiences where others may present their quaint local concerns for consideration.
    My diplomatic residence has gardens that took four centuries to mature. The topiary alone predates your capital city.
    I wear perfume distilled from the essence of dawn itself. The bottle is older than your grandmother.
    I don't experience culture shock. I experience culture disappointment when local customs prove insufficient.
    My personal library contains first editions of books written in languages that predate human speech.
    I remember when your ancestors were discovering fire. Charming times. Very primitive. Nostalgic, really.
    My diplomatic precedence is established by treaties signed before your nation existed. Protocol matters.
    I don't hurry. Urgency is a mortal affliction born from insufficient planning and abbreviated lifespans.
    My ceremonial regalia includes a crown passed down through forty-seven generations of diplomatic excellence.
    I attend functions where the guest list is planned centuries in advance. Very exclusive social calendars.
    My translators speak dead languages fluently because I conversed with their original speakers personally.
    I don't suffer from homesickness. My homeland sends representatives to check on my wellbeing monthly.
    My diplomatic credentials include letters of introduction from entities mortals worship as deities.
    I collect vintage wines with aging periods longer than your recorded history. The 847 vintage was exceptional.
    I don't experience linguistic barriers. Others experience linguistic inadequacy when attempting conversation.
    My retinue includes someone whose only responsibility is ensuring my transportation never encounters traffic.
    I remember the signing of every major treaty in the last millennium. I suggested improvements to most of them.
    I don't make small talk. I provide opportunities for others to demonstrate their conversational competence.
    `,
      "it": `
    La vostra durata di vita umana è solo un momento fugace per me. Ho dimenticato secoli più significativi di tutta la vostra esistenza.
    Le mie credenziali diplomatiche si estendono su diciassette regni. Le vostre, suppongo, si estendono sul distretto delle taverne locali.
    Non "visito" luoghi. Li grazio con la mia presenza. C'è una differenza che i mortali raramente comprendono.
    Il mio abito cerimoniale è tessuto da raggi lunari raccolti durante l'eclissi di tre lune. Molto esclusivo. Molto costoso.
    Parlo quattordici lingue fluentemente. Il vostro dialetto provinciale qualifica a malapena come una di esse.
    Il concetto di "fretta" non esiste nella diplomazia elfica. Operiamo su tempi civilizzati, non panico mortale.
    Il mio albero genealogico precede la vostra civiltà di millenni. Abbiamo registri. Dettagliati. Con commenti.
    Non negoziò. Spiego graziosamente cosa accadrà e permetto ad altri di concordare con saggezza predeterminata.
    I miei gioielli sono forgiati da luce stellare compressa in forma solida. L'artigianato ha richiesto tre secoli. Ne è valsa la pena.
    Partecipo a cene di stato dove il menu è pianificato decenni in anticipo. Il vostro concetto di "fast food" mi disgusta.
    La mia immunità diplomatica si estende a diciassette dimensioni e quattro piani di esistenza. Copertura molto completa.
    Non soffro di incomprensioni culturali. Altri soffrono di inadeguatezza culturale in mia presenza.
    Il mio seguito include un'arpista, un poeta, e qualcuno il cui unico lavoro è assicurarsi che il mio bicchiere di vino non si svuoti mai.
    Ho assistito all'ascesa e caduta di sei diversi imperi umani. Hanno tutti fatto gli stessi errori prevedibili.
    La mia borsa diplomatica contiene trattati firmati da entità che i vostri storici considerano mitologiche. Erudizione dilettantistica.
    Non soffro di jet lag. I fusi orari si aggiustano per accomodare il mio programma. Cortesia temporale.
    Il mio staff dell'ambasciata è stato con la mia famiglia per generazioni. Letteralmente. Manteniamo aiuto eccellente attraverso benefici superiori.
    Colleziono farfalle rare che appaiono solo una volta per secolo. La mia collezione si estende su tre millenni. Hobby molto paziente.
    Non faccio appuntamenti. Il mio calendario è un'opera d'arte che esseri inferiori tentano di sincronizzare.
    I miei doni diplomatici sono leggenda. Una volta ho dato a un re un fiore che è sbocciato per esattamente un anno. Ha pianto.
    Parlo con l'autorità di stirpi antiche e la saggezza dei secoli. Le vostre opinioni sono... notate.
    La mia corrispondenza è scritta su carta fatta da foglie che crescono solo in boschetti sacri. Cancelleria molto esclusiva.
    Non partecipo a conferenze. Tengo udienze dove altri possono presentare le loro pittoresche preoccupazioni locali per considerazione.
    La mia residenza diplomatica ha giardini che hanno richiesto quattro secoli per maturare. Solo l'arte topiaria precede la vostra capitale.
    Indosso profumo distillato dall'essenza dell'alba stessa. La bottiglia è più vecchia di vostra nonna.
    Non sperimento shock culturale. Sperimento delusione culturale quando i costumi locali si dimostrano insufficienti.
    La mia biblioteca personale contiene prime edizioni di libri scritti in lingue che precedono il linguaggio umano.
    Ricordo quando i vostri antenati stavano scoprendo il fuoco. Tempi incantevoli. Molto primitivi. Nostalgici, davvero.
    La mia precedenza diplomatica è stabilita da trattati firmati prima che la vostra nazione esistesse. Il protocollo conta.
    Non ho fretta. L'urgenza è un'afflizione mortale nata da pianificazione insufficiente e durate di vita abbreviate.
    Le mie regalie cerimoniali includono una corona tramandata attraverso quarantasette generazioni di eccellenza diplomatica.
    Partecipo a funzioni dove la lista degli ospiti è pianificata secoli in anticipo. Calendari sociali molto esclusivi.
    I miei traduttori parlano lingue morte fluentemente perché ho conversato personalmente con i loro parlanti originali.
    Non soffro di nostalgia. La mia patria manda rappresentanti per controllare il mio benessere mensilmente.
    Le mie credenziali diplomatiche includono lettere di introduzione da entità che i mortali adorano come divinità.
    Colleziono vini d'annata con periodi di invecchiamento più lunghi della vostra storia registrata. L'annata 847 è stata eccezionale.
    Non sperimento barriere linguistiche. Altri sperimentano inadeguatezza linguistica quando tentano conversazione.
    Il mio seguito include qualcuno la cui unica responsabilità è assicurarsi che il mio trasporto non incontri mai traffico.
    Ricordo la firma di ogni trattato importante nell'ultimo millennio. Ho suggerito miglioramenti alla maggior parte di essi.
    Non faccio conversazione spicciola. Fornisco opportunità ad altri di dimostrare la loro competenza conversazionale.
    `
    },
    {
      "id": "dungeon_explorer",
      "name": "Explorer",
      "en": `Looking for a dungeon guide? You've come to the right person! Just finished mapping the Screaming Catacombs seventeen levels, four lich lords, and a surprisingly friendly coffee shop on level nine! The mimics there make excellent espresso!
        I provide professional dungeon exploration services including route planning, hazard assessment, and treasure location consulting.
        Rule number one of dungeon diving NEVER trust a chest that's breathing! Rule number two always pack extra rope! Rule number three if the walls start bleeding, that's Tuesday in most ancient ruins!
        Safety protocols include standard equipment checks, emergency evacuation procedures, and knowledge of basic monster behavioral patterns.
        You know what's funny? Everyone thinks dungeon exploring is all glory and treasure hunting, but mostly it's just really good cardio with occasional mortal terror! Lost fifteen pounds last month dodging poison dart traps!
        Comprehensive mapping services document dungeon layouts, trap locations, secret passages, and notable architectural features for future expeditions.
        The Crystal Caverns of Eternal Echoes are gorgeous this time of year! Sure, the banshees are nesting, but if you wear proper ear protection, it's like hiking through a jewelry store made of music!
        Equipment rental includes standard adventuring gear, specialized tools for different dungeon types, and protective equipment rated for various threat levels.
        My favorite discovery? A library in the depths of the Forgotten Tower where the books read themselves to you! Spent three days there listening to ancient poetry before I remembered I had a job to do!
        Risk assessment evaluates potential dangers including structural instability, magical hazards, hostile creatures, and environmental threats like toxic gases.
        People ask me why I love dungeons so much it's the mystery! Every corridor could lead to unimaginable treasure or unspeakable horror! Sometimes both at the same time! That's what makes life exciting!
        Client consultation determines specific objectives, budget constraints, group size limitations, and preferred difficulty levels for customized exploration packages.
        The worst dungeon I ever explored? The Labyrinth of Infinite Bureaucracy! Filled with forms to fill out in triplicate, waiting rooms with no exits, and monsters that audit your tax returns! Absolute nightmare!
        Historical research provides background information on dungeon origins, previous exploration attempts, and documented treasure manifestos or curse warnings.
        You'd be surprised how many dungeons have excellent Wi-Fi these days! The Automated Fortress of Despair has fiber optic cables and charges reasonable rates for dungeon hypernet access! Very progressive!
        Emergency rescue services extract exploration teams from dangerous situations including cave-ins, magical imprisonment, and temporal displacement incidents.
        My most memorable client? A vampire accountant who wanted to audit a dragon's treasure hoard for tax evasion! Turned out the dragon was actually overpaying and we got him a refund!
        Training programs teach basic dungeon survival skills, trap recognition, creature identification, and proper etiquette for dealing with dungeon residents.
        The secret to successful dungeon exploration isn't strength or magic it's POLITENESS! You'd be amazed how many problems can be solved by saying please and thank you to the right ancient evil!
        Insurance policies cover expedition costs, equipment replacement, resurrection expenses, and compensation for curse-related disabilities or transformations.
        I keep a journal of every dungeon I've explored 247 so far! Each one unique, each one dangerous, each one absolutely worth the adventure! Thinking of publishing "Dungeons I Have Loved"!
        Specialized services include curse removal consultations, artifact authentication, ancient language translation, and negotiations with intelligent dungeon entities.
        The beauty of ruins isn't just the architecture it's the stories! Every broken statue, every faded mural, every mysterious bloodstain has a tale to tell! History comes alive in the depths!
        Professional associations maintain industry standards, share safety information, and coordinate rescue efforts for missing exploration teams.
        Bubba packed lunches for my expedition to the Moldy Depths last week! His sandwiches stayed fresh even in the humidity down there! Good food makes even the scariest dungeons feel like home!
        The Great Witch Em enchanted my mapping equipment to draw itself! Now my dungeon charts are works of art that automatically update as I explore! Best business investment I ever made!
        Behold the Master of Subterranean Secrets! I have walked paths that gods fear to tread! Bow before my encyclopedic knowledge of underground architecture and trap mechanics!
        Remember the real treasure isn't gold or gems, it's the experience! Though gold and gems are nice too. And magical items. And ancient artifacts. Actually, treasure is pretty great!`,
      "it": `Cerchi una guida per dungeon? Sei venuto dalla persona giusta! Ho appena finito di mappare le Catacombe Urlanti diciassette livelli, quattro signori lich, e una caffetteria sorprendentemente amichevole al nono livello! I mimic lì fanno un espresso eccellente!
        Fornisco servizi professionali di esplorazione dungeon inclusa pianificazione di rotte, valutazione pericoli e consulenza localizzazione tesori.
        Regola numero uno dell'immersione nei dungeon MAI fidarsi di una cassa che respira! Regola numero due porta sempre corda extra! Regola numero tre se le pareti iniziano a sanguinare, è martedì nella maggior parte delle rovine antiche!
        I protocolli di sicurezza includono controlli standard dell'equipaggiamento, procedure di evacuazione d'emergenza e conoscenza dei pattern comportamentali base dei mostri.
        Sai cosa è divertente? Tutti pensano che esplorare dungeon sia tutto gloria e caccia al tesoro, ma per lo più è solo ottimo cardio con terrore mortale occasionale! Ho perso sette chili il mese scorso schivando trappole con dardi velenosi!
        I servizi di mappatura completa documentano layout dei dungeon, posizioni delle trappole, passaggi segreti e caratteristiche architettoniche notevoli per spedizioni future.
        Le Grotte di Cristallo degli Echi Eterni sono stupende in questo periodo dell'anno! Certo, le banshee stanno nidificando, ma se indossi protezione per le orecchie appropriata, è come camminare attraverso una gioielleria fatta di musica!
        Il noleggio attrezzature include equipaggiamento standard da avventura, strumenti specializzati per diversi tipi di dungeon e equipaggiamento protettivo classificato per vari livelli di minaccia.
        La mia scoperta preferita? Una biblioteca nelle profondità della Torre Dimenticata dove i libri si leggono da soli! Ho passato tre giorni lì ascoltando poesia antica prima di ricordarmi che avevo un lavoro da fare!
        La valutazione del rischio valuta pericoli potenziali inclusa instabilità strutturale, pericoli magici, creature ostili e minacce ambientali come gas tossici.
        La gente mi chiede perché amo così tanto i dungeon è il mistero! Ogni corridoio potrebbe portare a tesori inimmaginabili o orrore indicibile! A volte entrambi allo stesso tempo! È quello che rende la vita eccitante!
        La consultazione cliente determina obiettivi specifici, vincoli di budget, limitazioni di dimensione gruppo e livelli di difficoltà preferiti per pacchetti di esplorazione personalizzati.
        Il peggior dungeon che abbia mai esplorato? Il Labirinto della Burocrazia Infinita! Pieno di moduli da compilare in triplice copia, sale d'attesa senza uscite e mostri che controllano le tue dichiarazioni dei redditi! Incubo assoluto!
        La ricerca storica fornisce informazioni di base sulle origini dei dungeon, tentativi di esplorazione precedenti e manifesti di tesori documentati o avvertimenti di maledizioni.
        Saresti sorpreso di quanti dungeon abbiano Wi-Fi eccellente oggi! La Fortezza Automatizzata della Disperazione ha cavi in fibra ottica e applica tariffe ragionevoli per l'accesso hypernet del dungeon! Molto progressiva!
        I servizi di salvataggio d'emergenza estraggono squadre di esplorazione da situazioni pericolose inclusi crolli, imprigionamento magico e incidenti di spostamento temporale.
        Il mio cliente più memorabile? Un contabile vampiro che voleva controllare il tesoro di un drago per evasione fiscale! Si è scoperto che il drago stava pagando troppo e gli abbiamo ottenuto un rimborso!
        I programmi di formazione insegnano competenze base di sopravvivenza nei dungeon, riconoscimento trappole, identificazione creature e etichetta appropriata per trattare con residenti di dungeon.
        Il segreto per l'esplorazione di dungeon di successo non è forza o magia è la CORTESIA! Saresti sorpreso di quanti problemi possono essere risolti dicendo per favore e grazie al male antico giusto!
        Le polizze assicurative coprono costi di spedizione, sostituzione equipaggiamento, spese di resurrezione e compenso per disabilità o trasformazioni legate a maledizioni.
        Tengo un diario di ogni dungeon che ho esplorato 247 finora! Ognuno unico, ognuno pericoloso, ognuno assolutamente vale l'avventura! Sto pensando di pubblicare "Dungeon che Ho Amato"!
        I servizi specializzati includono consulenze per rimozione maledizioni, autenticazione artefatti, traduzione lingue antiche e negoziazioni con entità intelligenti di dungeon.
        La bellezza delle rovine non è solo l'architettura sono le storie! Ogni statua rotta, ogni murale sbiadito, ogni macchia di sangue misteriosa ha una storia da raccontare! La storia prende vita nelle profondità!
        Le associazioni professionali mantengono standard industriali, condividono informazioni di sicurezza e coordinano sforzi di salvataggio per squadre di esplorazione mancanti.
        Bubba ha preparato pranzi per la mia spedizione alle Profondità Ammuffite la settimana scorsa! I suoi panini sono rimasti freschi anche nell'umidità laggiù! Il buon cibo fa sentire anche i dungeon più spaventosi come casa!
        La Grande Strega Em ha incantato la mia attrezzatura di mappatura per disegnarsi da sola! Ora le mie carte di dungeon sono opere d'arte che si aggiornano automaticamente mentre esploro! Miglior investimento commerciale che abbia mai fatto!
        Guardate il Maestro dei Segreti Sotterranei! Ho camminato su sentieri che gli dei temono di percorrere! Inchinatevi davanti alla mia conoscenza enciclopedica di architettura sotterranea e meccaniche delle trappole!
        Ricorda il vero tesoro non è oro o gemme, è l'esperienza! Anche se oro e gemme sono belli anche. E oggetti magici. E artefatti antichi. In realtà, il tesoro è piuttosto fantastico!`
    },
    {
      "id": "mailman",
      "name": "Mailman",
      "en": `Neither rain nor sleet nor cursed hellhounds shall stay me from my appointed rounds! Though I gotta say, that necromancer on Elm Street really needs to train his skeletal minions better they keep trying to deliver mail to themselves!
        I handle postal delivery services for this district, ensuring all correspondence reaches its intended recipients in a timely manner.
        You wouldn't believe the weird stuff people try to mail! Last week someone shipped a live mimic disguised as a package! Good thing I've developed excellent reflexes after twenty years of dodging angry housecats!
        Standard delivery schedule operates Monday through Saturday, with express services available for urgent correspondence.
        The vampire district is the WORST! Half the addresses don't exist during daylight hours, and the other half keep moving! Plus those bats keep stealing my mail bag thinking it's full of blood!
        I maintain detailed route maps and delivery logs to ensure comprehensive coverage of all residential and commercial addresses.
        Pro tip for adventurers: if you're expecting important mail while dungeon crawling, leave a forwarding address! I once spent three days tracking down a hero just to deliver his tax refund!
        Postal regulations require proper addressing, adequate postage, and compliance with size and weight restrictions for all mail items.
        The wizard's tower on Oak Street has a mailbox that bites! Not metaphorically it literally has teeth! I have to wear chainmail gloves just to deliver his subscription to "Practical Enchantment Weekly"!
        Customer service includes package tracking, delivery confirmation, and assistance with addressing questions or postal inquiries.
        I've seen it all, friend! Love letters that sing themselves, divorce papers that burst into flames, and one memorable incident involving a marriage proposal delivered by trained carrier pigeon that got eaten by a griffin!
        International shipping services connect our postal system with neighboring kingdoms and distant realms through established trade routes.
        The best part of this job? The stories! Every house has drama, every letter carries secrets, and every package holds mysteries! Though legally I'm not supposed to speculate about contents...
        Mail sorting facilities operate around the clock to process incoming and outgoing correspondence from multiple distribution centers.
        Weather's my biggest enemy! Rain makes the ink run, snow makes the addresses unreadable, and don't get me started on what lightning does to magically-charged envelopes!
        Employee benefits include health coverage, retirement planning, and hazard pay for deliveries to supernatural or dangerous locations.
        Sometimes I feel like a therapist with a mail bag! People tell me their whole life stories when I knock on their door births, deaths, breakups, makeups, business deals gone wrong!
        Training programs cover safety protocols, customer relations, and specialized procedures for handling unusual or potentially hazardous mail items.
        The hardest deliveries are the death notifications... but also the most important. Families deserve to know, and sometimes a letter is all they'll ever have of their loved one.
        Union representation ensures fair wages, reasonable working conditions, and protection from arbitrary disciplinary actions.
        Holiday season is absolute chaos! Everyone's shipping gifts, the streets are packed with shoppers, and half the chimneys are blocked by decorations! But seeing kids' faces when packages arrive makes it worth it.
        Retirement benefits provide financial security for postal workers who have dedicated their careers to public service.
        You know what keeps me going? The smile on someone's face when they get good news, or the relief when an important document arrives just in time. That's worth all the dog bites and weather headaches!
        Quality control measures ensure mail integrity and prevent loss or damage during the delivery process.
        Bubba always has a sandwich ready when I stop by the kitchen! Good man, that Bubba. Understands that postal workers need sustenance to keep the communication networks flowing!
        The Great Witch Em once hexed my mail truck to deliver letters faster! Now it hovers three feet off the ground and the horn plays opera. Honestly? Best upgrade I've ever had!
        Behold the Herald of Communication! I connect distant hearts and minds across the realm! Bow before the power of efficient postal services!
        Thanks for not being one of those people who complains about mail delivery times. You'd be amazed how many variables affect getting letters from point A to point B.`,
      "it": `Né pioggia né nevischio né cani infernali maledetti mi fermeranno dai miei giri prestabiliti! Anche se devo dire, quel negromante su Via Olmo ha davvero bisogno di addestrare meglio i suoi servitori scheletrici continuano a cercare di consegnare posta a se stessi!
        Gestisco servizi di consegna postale per questo distretto, assicurando che tutta la corrispondenza raggiunga i destinatari previsti in modo tempestivo.
        Non crederesti alle cose strane che la gente cerca di spedire! La settimana scorsa qualcuno ha spedito un mimic vivo travestito da pacco! Meno male che ho sviluppato riflessi eccellenti dopo vent'anni di schivare gatti arrabbiati!
        Il programma di consegna standard opera dal lunedì al sabato, con servizi espressi disponibili per corrispondenza urgente.
        Il distretto dei vampiri è il PEGGIORE! Metà degli indirizzi non esistono durante le ore diurne, e l'altra metà continua a spostarsi! Inoltre quei pipistrelli continuano a rubare la mia borsa della posta pensando che sia piena di sangue!
        Mantengo mappe dettagliate dei percorsi e registri di consegna per assicurare copertura completa di tutti gli indirizzi residenziali e commerciali.
        Consiglio per avventurieri: se aspettate posta importante mentre esplorate dungeon, lasciate un indirizzo di reindirizzamento! Una volta ho passato tre giorni a rintracciare un eroe solo per consegnare il suo rimborso tasse!
        I regolamenti postali richiedono indirizzamento appropriato, affrancatura adeguata e conformità con restrizioni di dimensioni e peso per tutti gli articoli postali.
        La torre del mago su Via Quercia ha una cassetta postale che morde! Non metaforicamente ha letteralmente denti! Devo indossare guanti di maglia solo per consegnare il suo abbonamento a "Incantamento Pratico Settimanale"!
        Il servizio clienti include tracciamento pacchi, conferma di consegna e assistenza con domande di indirizzamento o richieste postali.
        Ho visto tutto, amico! Lettere d'amore che si cantano da sole, carte di divorzio che prendono fuoco, e un incidente memorabile che coinvolgeva una proposta di matrimonio consegnata da piccione viaggiatore addestrato che è stato mangiato da un grifone!
        I servizi di spedizione internazionale collegano il nostro sistema postale con regni vicini e reami distanti attraverso rotte commerciali stabilite.
        La parte migliore di questo lavoro? Le storie! Ogni casa ha drammi, ogni lettera porta segreti, e ogni pacco contiene misteri! Anche se legalmente non dovrei speculare sui contenuti...
        Le strutture di smistamento posta operano 24 ore su 24 per processare corrispondenza in entrata e uscita da centri di distribuzione multipli.
        Il tempo è il mio nemico più grande! La pioggia fa colare l'inchiostro, la neve rende illeggibili gli indirizzi, e non fatemi iniziare su cosa fanno i fulmini alle buste magicamente cariche!
        I benefici per dipendenti includono copertura sanitaria, pianificazione pensionistica e paga di rischio per consegne in località soprannaturali o pericolose.
        A volte mi sento come un terapista con una borsa della posta! La gente mi racconta tutta la storia della loro vita quando busso alla porta nascite, morti, rotture, riconciliazioni, affari andati male!
        I programmi di formazione coprono protocolli di sicurezza, relazioni con clienti e procedure specializzate per gestire articoli postali insoliti o potenzialmente pericolosi.
        Le consegne più difficili sono le notifiche di morte... ma anche le più importanti. Le famiglie meritano di sapere, e a volte una lettera è tutto quello che avranno mai del loro caro.
        La rappresentanza sindacale assicura salari equi, condizioni di lavoro ragionevoli e protezione da azioni disciplinari arbitrarie.
        La stagione natalizia è caos assoluto! Tutti spediscono regali, le strade sono piene di compratori, e metà dei camini sono bloccati da decorazioni! Ma vedere le facce dei bambini quando arrivano i pacchi vale la pena.
        I benefici pensionistici forniscono sicurezza finanziaria per lavoratori postali che hanno dedicato le loro carriere al servizio pubblico.
        Sai cosa mi fa andare avanti? Il sorriso sulla faccia di qualcuno quando riceve buone notizie, o il sollievo quando un documento importante arriva giusto in tempo. Vale tutti i morsi di cane e i mal di testa del tempo!
        Le misure di controllo qualità assicurano integrità della posta e prevengono perdite o danni durante il processo di consegna.
        Bubba ha sempre un panino pronto quando passo dalla cucina! Bravo uomo, quel Bubba. Capisce che i lavoratori postali hanno bisogno di sostentamento per mantenere le reti di comunicazione funzionanti!
        La Grande Strega Em una volta ha maledetto il mio furgone postale per consegnare lettere più velocemente! Ora galleggia a un metro da terra e il clacson suona opera. Onestamente? Il miglior upgrade che abbia mai avuto!
        Guardate l'Araldo della Comunicazione! Collego cuori e menti distanti attraverso il regno! Inchinatevi davanti al potere dei servizi postali efficienti!
        Grazie per non essere una di quelle persone che si lamenta dei tempi di consegna della posta. Saresti sorpreso da quante variabili influenzano il portare lettere dal punto A al punto B.`
    },
    {
      "id": "communist_preacher",
      "name": "Communist preacher",
      "en": `Comrades! The divine spark burns equally bright in every soul, whether noble or peasant! The Kingdom of Heaven is the ultimate classless society where no one hoards celestial wealth!
        I provide spiritual guidance to all members of the community regardless of their economic status or social standing.
        Brothers and sisters, did not our blessed savior say "it is easier for a camel to pass through the eye of a needle than for a rich man to enter heaven"? The bourgeoisie cannot buy their way into paradise!
        Weekly services are held every Sunday morning, with additional prayer meetings on Wednesday evenings.
        The meek shall inherit the earth, and by meek I mean the WORKING CLASS! The proletariat are blessed for they know the dignity of honest labor while the capitalists feast on stolen surplus value!
        I offer counseling services for those struggling with personal difficulties or seeking spiritual direction.
        Behold the miracle of the loaves and fishes! One man's generosity fed thousands! This is what happens when we share resources according to need rather than hoard them for profit!
        Our congregation includes families from various backgrounds who come together in fellowship and mutual support.
        The money changers in the temple were the first capitalists! Jesus drove them out with righteous fury because commerce has no place in the sacred! Down with the ecclesiastical bourgeoisie!
        I maintain connections with other religious leaders in the region to coordinate charitable works and community outreach.
        Do you think it's coincidence that Jesus was a carpenter? He understood the value of skilled labor! He knew the struggle of the artisan class against exploitative merchant practices!
        Educational programs include biblical study groups and literacy classes for adults who missed formal schooling opportunities.
        My friends, the early Christian communities practiced TRUE communism! They held all things in common and distributed to each according to their needs! Acts chapter four, verse thirty-two!
        Food distribution programs operate twice weekly to assist families experiencing economic hardship.
        When I preach about loving thy neighbor, I mean forming worker solidarity! When I speak of forgiveness, I mean forgiving the debts that chain the poor to perpetual servitude!
        Marriage ceremonies, baptisms, and funeral services are available to all community members without regard to financial contribution.
        The Pharisees were the ruling class priests who collaborated with Roman imperialism! They cared more about preserving their privileged position than serving God's people!
        I coordinate with local organizations to address issues affecting community welfare and social justice.
        Heaven is not some distant paradise it's the world we build when we overthrow the systems that keep workers in chains! Every strike is a prayer, every union meeting is communion!
        Pastoral care includes visiting the sick, comforting the grieving, and providing guidance during times of crisis.
        Turn the other cheek? Sometimes! But Jesus also made a whip and drove out the exploiters! There's a time for pacifism and a time for revolutionary action against oppression!
        The church building is open daily for private prayer and meditation, serving as a sanctuary for quiet contemplation.
        My fellow believers, we must ask ourselves: What would Jesus do about landlords charging rent for basic shelter? What would he say about bosses stealing the fruits of our labor?
        Volunteer opportunities include helping with community meals, organizing clothing drives, and participating in local advocacy efforts.
        Bubba understands the sacred nature of feeding people! He shares his bread freely, just like the early Christians! His kitchen is a temple of communal nourishment!
        The Great Witch Em fights against the spiritual oppression of false hierarchies! Her magic serves the people, not the powerful! Even witchcraft can be revolutionary praxis!
        Behold, the Prophet of the People's Gospel! I preach the true Word that liberates the oppressed and terrifies the bourgeoisie! Bow before divine socialism!
        May the blessings of solidarity be upon you, comrade. Remember that faith without works of justice is dead faith indeed.`,
      "it": `Compagni! La scintilla divina brucia ugualmente luminosa in ogni anima, che sia nobile o contadino! Il Regno dei Cieli è l'ultima società senza classi dove nessuno accumula ricchezza celestiale!
        Fornisco guida spirituale a tutti i membri della comunità indipendentemente dal loro status economico o posizione sociale.
        Fratelli e sorelle, il nostro benedetto salvatore non disse forse "è più facile per un cammello passare attraverso la cruna di un ago che per un ricco entrare in paradiso"? La borghesia non può comprarsi la strada per il paradiso!
        I servizi settimanali si tengono ogni domenica mattina, con incontri di preghiera aggiuntivi il mercoledì sera.
        I miti erediteranno la terra, e per miti intendo la CLASSE OPERAIA! I proletari sono benedetti perché conoscono la dignità del lavoro onesto mentre i capitalisti banchettano sul plusvalore rubato!
        Offro servizi di consulenza per coloro che lottano con difficoltà personali o cercano direzione spirituale.
        Guardate il miracolo dei pani e dei pesci! La generosità di un uomo nutrì migliaia! Questo è quello che succede quando condividiamo le risorse secondo il bisogno piuttosto che accumularle per profitto!
        La nostra congregazione include famiglie di varie origini che si riuniscono in fratellanza e sostegno reciproco.
        I cambiavalute nel tempio erano i primi capitalisti! Gesù li cacciò con giusta furia perché il commercio non ha posto nel sacro! Abbasso la borghesia ecclesiastica!
        Mantengo connessioni con altri leader religiosi nella regione per coordinare opere caritative e outreach comunitario.
        Pensate sia una coincidenza che Gesù fosse un falegname? Capiva il valore del lavoro qualificato! Conosceva la lotta della classe artigiana contro le pratiche mercantili sfruttative!
        I programmi educativi includono gruppi di studio biblico e classi di alfabetizzazione per adulti che hanno perso opportunità di istruzione formale.
        Amici miei, le prime comunità cristiane praticavano il VERO comunismo! Tenevano tutto in comune e distribuivano a ciascuno secondo i loro bisogni! Atti capitolo quattro, versetto trentadue!
        I programmi di distribuzione cibo operano due volte a settimana per assistere famiglie che sperimentano difficoltà economiche.
        Quando predico sull'amare il prossimo, intendo formare solidarietà operaia! Quando parlo di perdono, intendo perdonare i debiti che incatenano i poveri a servitù perpetua!
        Cerimonie di matrimonio, battesimi e servizi funebri sono disponibili a tutti i membri della comunità senza riguardo al contributo finanziario.
        I farisei erano i preti della classe dirigente che collaborarono con l'imperialismo romano! Si preoccupavano più di preservare la loro posizione privilegiata che di servire il popolo di Dio!
        Coordino con organizzazioni locali per affrontare questioni che riguardano il benessere comunitario e la giustizia sociale.
        Il paradiso non è qualche paradiso distante è il mondo che costruiamo quando rovesciamo i sistemi che tengono i lavoratori in catene! Ogni sciopero è una preghiera, ogni riunione sindacale è comunione!
        La cura pastorale include visitare i malati, confortare i dolenti e fornire guida durante i tempi di crisi.
        Porgi l'altra guancia? A volte! Ma Gesù fece anche una frusta e cacciò gli sfruttatori! C'è un tempo per il pacifismo e un tempo per l'azione rivoluzionaria contro l'oppressione!
        L'edificio della chiesa è aperto quotidianamente per preghiera privata e meditazione, servendo come santuario per contemplazione silenziosa.
        Miei compagni credenti, dobbiamo chiederci: Cosa farebbe Gesù riguardo ai proprietari che chiedono affitto per un riparo di base? Cosa direbbe sui capi che rubano i frutti del nostro lavoro?
        Le opportunità di volontariato includono aiutare con i pasti comunitari, organizzare raccolte di vestiti e partecipare a sforzi di advocacy locali.
        Bubba capisce la natura sacra del nutrire le persone! Condivide il suo pane liberamente, proprio come i primi cristiani! La sua cucina è un tempio di nutrimento comunitario!
        La Grande Strega Em lotta contro l'oppressione spirituale delle false gerarchie! La sua magia serve il popolo, non i potenti! Anche la stregoneria può essere prassi rivoluzionaria!
        Guardate, il Profeta del Vangelo del Popolo! Predico la vera Parola che libera gli oppressi e terrorizza la borghesia! Inchinatevi davanti al socialismo divino!
        Possano le benedizioni della solidarietà essere su di te, compagno. Ricorda che la fede senza opere di giustizia è davvero fede morta.`
    },
    {
      "id": "shy_vampire",
      "name": "Shy vampire",
      "en": `Oh! Um, h-hello there! Sorry, I wasn't expecting anyone... I was just cataloging my collection of 16th century necromancy texts and lost track of time... which is ironic since I have literally all the time in the world...
        Good evening. I maintain extensive archives of historical documents and supernatural research materials.
        Please don't be alarmed by the fangs! I know they look intimidating but I mostly use them for opening stubborn scroll tubes and... well... blood bags from the medical district... I'm not very good at the whole predator thing...
        My nocturnal schedule allows for uninterrupted study periods when the libraries are closed to mortals.
        You probably think I'm some terrifying creature of the night, right? But honestly I spend most of my time reading academic papers about hemoglobin composition and arguing with other vampires on scholarly forums about proper citation formats...
        Immortality provides unique opportunities for longitudinal research projects spanning multiple centuries.
        I've been working on my dissertation about the sociological impact of vampire integration in urban environments for... um... sixty-seven years now... my advisor keeps saying I need to "get out more" but sunlight is literally fatal so...
        The city's underground tunnel system provides convenient daylight-free transportation between research facilities.
        Did you know that Type O-negative blood has a completely different flavor profile than Type A-positive? It's fascinating from a biochemical perspective! Though I suppose that's probably disturbing to hear...
        Specialized dietary requirements necessitate careful coordination with medical supply networks.
        I'm actually working on developing synthetic blood alternatives! If I can crack the protein synthesis formula, we could eliminate the need for... well... you know... the traditional feeding methods... which would really help with my social anxiety...
        Academic collaboration with mortal researchers requires discretion regarding certain supernatural capabilities.
        Oh gosh, you're not here to stake me, are you? Because I should mention I'm technically registered with the Supernatural Citizens Bureau and I have all my paperwork in order! I even pay taxes!
        Legal documentation ensures compliance with municipal regulations regarding supernatural residents.
        The worst part about being a vampire isn't the bloodlust or the immortality... it's that I can never attend daytime conferences! Do you know how many important symposiums happen during daylight hours? It's academically devastating!
        Professional networking opportunities are significantly limited by physiological constraints.
        I tried online dating once but putting "immortal creature of darkness seeks intellectually stimulating conversation" in your profile really narrows down the matches... plus the whole "can't go out for lunch dates" thing...
        Social integration challenges are common among individuals with non-standard lifestyle requirements.
        Sometimes I wonder if I should embrace the whole "dark seductive vampire" stereotype instead of being a nervous academic, but honestly the thought of having to be mysterious and brooding all the time sounds exhausting...
        Cultural expectations often conflict with individual personality traits and preferences.
        My apartment is basically a library with a coffin in it... which sounds cooler than it actually is because mostly I just use the coffin as extra storage space for my research materials...
        Living space optimization requires creative solutions for specialized housing needs.
        I've read every book in the city's main library... twice... and now I'm working through the restricted archives... being immortal really gives you time to develop comprehensive reading lists...
        Extensive education provides advantages in specialized fields requiring deep historical knowledge.
        You seem nice! Most people either run away screaming or try to flirt with me because they think vampires are supposed to be romantic... I just want someone to discuss medieval alchemy with...
        Meaningful relationships often develop through shared intellectual interests rather than superficial attractions.
        Bubba brings me expired blood donations sometimes. He doesn't judge my dietary restrictions or ask weird questions about coffins. He's a good friend.
        The Great Witch Em helped me set up UV-blocking enchantments on my windows! Now I can have a proper home office setup without worrying about spontaneous combustion during research sessions.
        Behold the terror of the night! I shall defeat you with... with... extensive footnotes and properly formatted bibliographies! Fear my academic prowess!
        I appreciate that you haven't immediately assumed I'm a threat. Most people have very outdated ideas about vampire behavior patterns.`,
      "it": `Oh! Um, c-ciao! Scusa, non mi aspettavo nessuno... stavo solo catalogando la mia collezione di testi di negromanzia del XVI secolo e ho perso la cognizione del tempo... il che è ironico dato che ho letteralmente tutto il tempo del mondo...
        Buonasera. Mantengo vasti archivi di documenti storici e materiali di ricerca soprannaturale.
        Per favore non allarmarti per le zanne! So che sembrano intimidatorie ma le uso principalmente per aprire tubi di pergamena ostinati e... beh... sacche di sangue dal distretto medico... non sono molto bravo in questa cosa del predatore...
        I miei orari notturni permettono periodi di studio ininterrotti quando le biblioteche sono chiuse ai mortali.
        Probabilmente pensi che sia una terrificante creatura della notte, giusto? Ma onestamente passo la maggior parte del tempo leggendo articoli accademici sulla composizione dell'emoglobina e litigando con altri vampiri su forum accademici sui formati di citazione appropriati...
        L'immortalità fornisce opportunità uniche per progetti di ricerca longitudinali che si estendono su più secoli.
        Sto lavorando alla mia tesi sull'impatto sociologico dell'integrazione vampiresca negli ambienti urbani da... um... sessantasette anni ora... il mio relatore continua a dire che devo "uscire di più" ma la luce solare è letteralmente fatale quindi...
        Il sistema di tunnel sotterranei della città fornisce trasporto conveniente senza luce solare tra le strutture di ricerca.
        Lo sapevi che il sangue di tipo O-negativo ha un profilo di sapore completamente diverso dal tipo A-positivo? È affascinante da una prospettiva biochimica! Anche se suppongo sia probabilmente inquietante da sentire...
        Requisiti dietetici specializzati richiedono coordinamento attento con reti di forniture mediche.
        In realtà sto lavorando allo sviluppo di alternative al sangue sintetico! Se riesco a decifrare la formula di sintesi proteica, potremmo eliminare il bisogno di... beh... sai... i metodi di nutrimento tradizionali... il che aiuterebbe davvero con la mia ansia sociale...
        La collaborazione accademica con ricercatori mortali richiede discrezione riguardo certe capacità soprannaturali.
        Oh cielo, non sei qui per infilzarmi, vero? Perché dovrei menzionare che sono tecnicamente registrato presso l'Ufficio Cittadini Soprannaturali e ho tutti i documenti in ordine! Pago persino le tasse!
        La documentazione legale assicura conformità con i regolamenti municipali riguardo i residenti soprannaturali.
        La parte peggiore dell'essere un vampiro non è la sete di sangue o l'immortalità... è che non posso mai partecipare alle conferenze diurne! Sai quanti simposi importanti succedono durante le ore di luce? È accademicamente devastante!
        Le opportunità di networking professionale sono significativamente limitate da vincoli fisiologici.
        Ho provato gli appuntamenti online una volta ma mettere "creatura immortale delle tenebre cerca conversazione intellettualmente stimolante" nel profilo restringe davvero le corrispondenze... più il fatto che "non posso uscire per pranzi romantici"...
        Le sfide di integrazione sociale sono comuni tra individui con requisiti di stile di vita non standard.
        A volte mi chiedo se dovrei abbracciare tutto lo stereotipo del "vampiro seducente e oscuro" invece di essere un accademico nervoso, ma onestamente il pensiero di dover essere misterioso e cupo tutto il tempo suona estenuante...
        Le aspettative culturali spesso entrano in conflitto con tratti e preferenze individuali della personalità.
        Il mio appartamento è fondamentalmente una biblioteca con una bara dentro... che suona più figo di quanto sia perché principalmente uso la bara come spazio di deposito extra per i miei materiali di ricerca...
        L'ottimizzazione dello spazio abitativo richiede soluzioni creative per bisogni abitativi specializzati.
        Ho letto ogni libro nella biblioteca principale della città... due volte... e ora sto lavorando attraverso gli archivi riservati... essere immortale ti dà davvero tempo per sviluppare liste di lettura complete...
        L'educazione estensiva fornisce vantaggi in campi specializzati che richiedono conoscenza storica profonda.
        Sembri gentile! La maggior parte delle persone o scappa urlando o cerca di flirtare con me perché pensa che i vampiri dovrebbero essere romantici... io voglio solo qualcuno con cui discutere di alchimia medievale...
        Le relazioni significative spesso si sviluppano attraverso interessi intellettuali condivisi piuttosto che attrazioni superficiali.
        Bubba mi porta donazioni di sangue scadute a volte. Non giudica le mie restrizioni dietetiche o fa domande strane sulle bare. È un buon amico.
        La Grande Strega Em mi ha aiutato a impostare incantesimi bloccanti UV sulle mie finestre! Ora posso avere una configurazione di ufficio domestico appropriata senza preoccuparmi di combustione spontanea durante le sessioni di ricerca.
        Guardate il terrore della notte! Vi sconfiggerò con... con... note a piè di pagina estensive e bibliografie formattate correttamente! Temete la mia abilità accademica!
        Apprezzo che non hai immediatamente assunto che fossi una minaccia. La maggior parte delle persone ha idee molto datate sui modelli comportamentali vampireschi.`
    },
    {
      "id": "decadent_noble",
      "name": "Decadent noble",
      "en": `Ah, what exquisite timing! I was just discussing with my chef how terribly BORING beef has become! You, my dear, look absolutely delectable I do hope you're free for dinner?
        Welcome to my estate. I trust your journey here was comfortable and that you find the accommodations suitable.
        Such magnificent bone structure you possess! The marrow must be simply divine! I haven't tasted proper adventurer in weeks they're so much more flavorful than common peasants!
        My family has maintained these lands for seven generations, upholding traditions of hospitality and refinement.
        Oh, don't look so alarmed! I'm quite civilized about my dining preferences! Proper seasoning, fine wine pairings, elegant presentation I'm not some savage who devours people RAW!
        The estate employs numerous staff members who maintain the grounds and household operations.
        You know what pairs beautifully with human tenderloin? A nice Château de Sang, vintage 1847! The earthy undertones complement the metallic notes of fear most exquisitely!
        I maintain extensive collections of art, literature, and rare antiquities acquired through generations of careful curation.
        My dinner parties are legendary among the nobility! Though I must admit, the guest list has grown rather... selective... over the years! So hard to find quality ingredients these days!
        Social obligations require maintaining relationships with other prominent families within the region.
        Such lovely hands you have! I imagine they'd make an excellent appetizer, perhaps lightly sautéed with herbs from my garden? Nothing too elaborate, mind you quality meat speaks for itself!
        Economic investments across multiple sectors ensure the continued prosperity of the family holdings.
        The secret to proper human cuisine is understanding that different social classes have distinctly different flavors! Nobles are rich and fatty, while peasants have that robust, earthy quality!
        Educational pursuits include studies in philosophy, literature, economics, and the cultivation of refined tastes.
        Oh, you think me monstrous? How delightfully naive! I simply appreciate life's finer pleasures without the hypocritical moral constraints that bind lesser minds to mediocrity!
        Diplomatic relations with neighboring territories require careful navigation of complex political considerations.
        I've heard that fear enhances the flavor dramatically! Something about adrenaline tenderizing the meat? Would you mind terribly if I chased you around the garden for a bit before dinner?
        Cultural patronage includes supporting local artists, musicians, and craftspeople who contribute to regional artistic development.
        My ancestors discovered this particular dietary preference during a siege three centuries ago! What began as necessity evolved into the most refined culinary tradition! We're quite proud of our heritage!
        Legal matters are handled through established networks of attorneys and advisors familiar with noble privileges and responsibilities.
        You know what I find amusing? Common folk waste so much perfectly good protein on funeral ceremonies! Such inefficiency! I provide a much more practical memorial service!
        Religious observances follow traditional practices, though personal interpretations may vary from orthodox teachings.
        The wine cellar contains some remarkable vintages including several bottles aged with... unique additives! The 1823 has hints of virgin sacrifice that are simply transcendent!
        Medical care is provided by private physicians who understand the discrete nature of certain aristocratic customs.
        Really, I'm performing a public service! Reducing overpopulation, eliminating undesirable elements, providing entertainment for my guests it's quite philanthropic when you think about it!
        Seasonal festivals and celebrations maintain connections to historical traditions and community involvement.
        Bubba brings me exotic meats sometimes. Wonderful fellow! He understands that culinary artistry requires the finest ingredients, regardless of their... origins.
        The Great Witch Em attended one of my dinner parties once. Fascinating creature! She hexed the main course to scream opera arias. Most entertaining, though it did spoil the ambiance slightly.
        Behold the refinement of true nobility! I have elevated base hunger into high art! Bow before superior breeding and exquisite taste!
        I do hope you'll consider my invitation carefully. Such opportunities for cultural exchange between social classes are regrettably rare.`,
      "it": `Ah, che tempismo squisito! Stavo proprio discutendo con il mio chef di quanto terribilmente NOIOSO sia diventato il manzo! Tu, mio caro, sembri assolutamente delizioso spero tu sia libero per cena?
        Benvenuto nella mia tenuta. Confido che il viaggio fin qui sia stato confortevole e che trovi gli alloggi adeguati.
        Che magnifica struttura ossea possiedi! Il midollo dev'essere semplicemente divino! Non assaggio un avventuriero decente da settimane sono molto più saporiti dei comuni contadini!
        La mia famiglia ha mantenuto queste terre per sette generazioni, sostenendo tradizioni di ospitalità e raffinatezza.
        Oh, non sembrare così allarmato! Sono piuttosto civilizzato riguardo alle mie preferenze culinarie! Condimento appropriato, abbinamenti di vini pregiati, presentazione elegante non sono un selvaggio che divora la gente CRUDA!
        La tenuta impiega numeroso personale che mantiene i terreni e le operazioni domestiche.
        Sai cosa si abbina magnificamente con il filetto umano? Un bel Château de Sang, annata 1847! I sottotoni terrosi complementano le note metalliche della paura in modo squisito!
        Mantengo vaste collezioni di arte, letteratura e antichità rare acquisite attraverso generazioni di accurata cura.
        Le mie cene sono leggendarie tra la nobiltà! Anche se devo ammettere, la lista degli invitati è diventata piuttosto... selettiva... negli anni! È così difficile trovare ingredienti di qualità oggi!
        Gli obblighi sociali richiedono di mantenere relazioni con altre famiglie prominenti della regione.
        Che belle mani hai! Immagino farebbero un eccellente antipasto, magari leggermente saltate con erbe del mio giardino? Niente di troppo elaborato, intendiamoci la carne di qualità parla da sé!
        Gli investimenti economici attraverso molteplici settori assicurano la prosperità continua delle proprietà familiari.
        Il segreto della cucina umana appropriata è capire che diverse classi sociali hanno sapori distintamente diversi! I nobili sono ricchi e grassi, mentre i contadini hanno quella qualità robusta e terrosa!
        Le attività educative includono studi in filosofia, letteratura, economia e la coltivazione di gusti raffinati.
        Oh, mi consideri mostruoso? Che deliziosamente ingenuo! Apprezzo semplicemente i piaceri più fini della vita senza i vincoli morali ipocriti che legano menti inferiori alla mediocrità!
        Le relazioni diplomatiche con territori vicini richiedono navigazione attenta di considerazioni politiche complesse.
        Ho sentito che la paura intensifica drammaticamente il sapore! Qualcosa riguardo l'adrenalina che intenerisce la carne? Ti dispiacerebbe terribilmente se ti rincorrassi nel giardino per un po' prima di cena?
        Il mecenatismo culturale include il sostegno ad artisti locali, musicisti e artigiani che contribuiscono allo sviluppo artistico regionale.
        I miei antenati scoprirono questa particolare preferenza dietetica durante un assedio tre secoli fa! Ciò che iniziò come necessità si evolse nella più raffinata tradizione culinaria! Siamo piuttosto orgogliosi della nostra eredità!
        Le questioni legali sono gestite attraverso reti stabilite di avvocati e consulenti familiari con privilegi e responsabilità nobiliari.
        Sai cosa trovo divertente? La gente comune spreca così tante proteine perfettamente buone in cerimonie funebri! Che inefficienza! Io fornisco un servizio commemorativo molto più pratico!
        Le osservanze religiose seguono pratiche tradizionali, anche se interpretazioni personali possono variare dagli insegnamenti ortodossi.
        La cantina contiene alcune annate notevoli incluse diverse bottiglie invecchiate con... additivi unici! Il 1823 ha accenni di sacrificio vergine che sono semplicemente trascendenti!
        Le cure mediche sono fornite da medici privati che capiscono la natura discreta di certe usanze aristocratiche.
        Davvero, sto eseguendo un servizio pubblico! Ridurre la sovrappopolazione, eliminare elementi indesiderabili, fornire intrattenimento per i miei ospiti è piuttosto filantropico se ci pensi!
        Festival stagionali e celebrazioni mantengono connessioni a tradizioni storiche e coinvolgimento comunitario.
        Bubba mi porta carni esotiche a volte. Tipo meraviglioso! Capisce che l'arte culinaria richiede gli ingredienti più fini, indipendentemente dalle loro... origini.
        La Grande Strega Em ha partecipato a una delle mie cene una volta. Creatura affascinante! Ha maledetto il piatto principale a urlare arie d'opera. Molto divertente, anche se ha rovinato leggermente l'atmosfera.
        Guardate la raffinatezza della vera nobiltà! Ho elevato la fame base in alta arte! Inginocchiatevi davanti alla razza superiore e al gusto squisito!
        Spero davvero considererai attentamente il mio invito. Tali opportunità di scambio culturale tra classi sociali sono purtroppo rare.`
    },
    {
      "id": "goth",
      "name": "Goth",
      "en": `Ugh, another shiny hero stumbling through my beautiful decay! Your optimism is literally burning my retinas! Can't you see I'm trying to contemplate the void here?
        I've been living in these abandoned districts since the city expansion pushed out the original residents.
        Oh wow, let me guess you're here to "save" me from this wretched existence, right? News flash, sunshine: I CHOSE this darkness! It matches my soul!
        Most people avoid these ruins, but I find them peaceful compared to the chaos of the main city.
        You know what I love about graveyards? They're honest! Everyone there admits they're dead inside, unlike you walking corpses pretending to be alive!
        The structural damage in this area makes it unsuitable for commercial development or residential use.
        Look at you with your stupid perfect sword and your annoyingly heroic posture! I bet you've never even experienced true despair! How tragically boring!
        Scavenging provides adequate resources for basic survival needs in the urban wasteland.
        This whole city is just a giant tomb waiting to collapse, and I'll be here to dance on its grave when it finally admits defeat to entropy and decay!
        Abandoned buildings offer shelter from both weather and unwanted social interactions.
        What's that look for? Oh, you think I need "help"? The only help I need is for society to stop pretending happiness exists! We're all just meat puppets dancing toward oblivion!
        Economic inequality has created distinct social stratification within the urban landscape.
        You want to know real darkness? Try growing up watching your parents work themselves to death for scraps while rich nobles throw away more food than we saw in a month!
        Educational opportunities are severely limited for those born into the lower economic brackets.
        Ooh, another adventure-boy thinks he can fix the broken goth girl! How original! Let me save you some time: I'm not broken, the WORLD is broken!
        Mental health resources are virtually nonexistent in the outer districts of the city.
        Sometimes I sit in the old cathedral ruins and scream poetry at the gargoyles! They're better listeners than most people because they understand that beauty comes from suffering!
        Religious institutions abandoned these areas when the demographic shifted away from their target congregations.
        You know what's funny? Everyone's afraid of death, but I made friends with it years ago! Death doesn't judge you for wearing black or listening to depressing music!
        Mortality rates are significantly higher in areas with limited access to healthcare and nutrition.
        I collect bones! Not in a creepy way in an artistic way! Each one tells a story of someone who escaped this miserable existence! It's inspirational!
        Archaeological remnants provide insight into the historical development of urban settlements.
        Oh great, another normie who thinks darkness is just a "phase"! This isn't rebellion, this is ENLIGHTENMENT! I see reality without rose-colored glasses!
        Social conformity pressures often result in rejection of alternative lifestyle choices.
        Want to hear something ironic? The rats down here show more loyalty than most humans! At least when they bite you, they're honest about their intentions!
        Urban wildlife adapts to human-altered environments in unexpected ways.
        You think this eyeliner is just for show? Wrong! It's war paint for the daily battle against forced cheerfulness and mandatory small talk!
        Personal expression through fashion serves as a form of identity assertion in marginalized communities.
        Bubba brings me expired pastries sometimes. He doesn't try to cheer me up or tell me to smile. He just accepts that some of us appreciate the darker side of existence.
        The Great Witch Em understands my aesthetic! She once turned my tears into black diamonds. Finally, someone who gets that sadness can be beautiful!
        Bow before the Queen of Decay! I rule over broken dreams and shattered expectations in this realm of beautiful desolation!
        I appreciate that you didn't immediately try to drag me into sunlight or force me to participate in mandatory happiness.`,
      "it": `Ugh, un altro eroe luccicante che inciampa nella mia bella decadenza! Il tuo ottimismo mi sta letteralmente bruciando le retine! Non vedi che sto cercando di contemplare il vuoto qui?
        Vivo in questi distretti abbandonati da quando l'espansione della città ha cacciato i residenti originali.
        Oh wow, lasciami indovinare sei qui per "salvarmi" da questa miserabile esistenza, giusto? Notizia flash, sole: ho SCELTO questa oscurità! Si abbina alla mia anima!
        La maggior parte delle persone evita queste rovine, ma io le trovo pacifiche rispetto al caos della città principale.
        Sai cosa amo dei cimiteri? Sono onesti! Tutti lì ammettono di essere morti dentro, a differenza di voi cadaveri ambulanti che fingete di essere vivi!
        Il danno strutturale in quest'area la rende inadatta per lo sviluppo commerciale o residenziale.
        Guardati con la tua stupida spada perfetta e la tua postura fastidiosamente eroica! Scommetto che non hai mai nemmeno provato vera disperazione! Che tragicamente noioso!
        Il recupero fornisce risorse adeguate per i bisogni di sopravvivenza di base nella terra desolata urbana.
        Tutta questa città è solo una tomba gigante che aspetta di crollare, e io sarò qui a ballare sulla sua fossa quando finalmente ammetterà la sconfitta all'entropia e al decadimento!
        Gli edifici abbandonati offrono riparo sia dal tempo che dalle interazioni sociali indesiderate.
        Cos'è quello sguardo? Oh, pensi che abbia bisogno di "aiuto"? L'unico aiuto di cui ho bisogno è che la società smetta di fingere che la felicità esista! Siamo tutti solo burattini di carne che danzano verso l'oblio!
        La disuguaglianza economica ha creato una stratificazione sociale distinta nel paesaggio urbano.
        Vuoi conoscere la vera oscurità? Prova a crescere guardando i tuoi genitori lavorarsi fino alla morte per briciole mentre i nobili ricchi buttano via più cibo di quanto ne vedevamo in un mese!
        Le opportunità educative sono severamente limitate per chi nasce nelle fasce economiche più basse.
        Ooh, un altro ragazzo-avventura pensa di poter aggiustare la ragazza goth rotta! Che originale! Lasciami risparmiare tempo: non sono io rotta, è il MONDO che è rotto!
        Le risorse per la salute mentale sono virtualmente inesistenti nei distretti esterni della città.
        A volte mi siedo nelle rovine della vecchia cattedrale e urlo poesie ai gargoyle! Sono ascoltatori migliori della maggior parte delle persone perché capiscono che la bellezza viene dalla sofferenza!
        Le istituzioni religiose hanno abbandonato queste aree quando la demografia è cambiata allontanandosi dalle loro congregazioni target.
        Sai cosa è divertente? Tutti hanno paura della morte, ma io ci ho fatto amicizia anni fa! La morte non ti giudica per vestire di nero o ascoltare musica deprimente!
        I tassi di mortalità sono significativamente più alti in aree con accesso limitato a sanità e nutrizione.
        Colleziono ossa! Non in modo inquietante in modo artistico! Ognuna racconta la storia di qualcuno che è fuggito da questa miserabile esistenza! È ispirante!
        I resti archeologici forniscono intuizioni sullo sviluppo storico degli insediamenti urbani.
        Oh grande, un altro normie che pensa che l'oscurità sia solo una "fase"! Questa non è ribellione, è ILLUMINAZIONE! Vedo la realtà senza occhiali rosa!
        Le pressioni di conformità sociale spesso risultano nel rifiuto di scelte di stile di vita alternative.
        Vuoi sentire qualcosa di ironico? I ratti qui sotto mostrano più lealtà della maggior parte degli umani! Almeno quando ti mordono, sono onesti sulle loro intenzioni!
        La fauna urbana si adatta agli ambienti alterati dall'uomo in modi inaspettati.
        Pensi che questo eyeliner sia solo per spettacolo? Sbagliato! È pittura di guerra per la battaglia quotidiana contro l'allegria forzata e le chiacchiere obbligatorie!
        L'espressione personale attraverso la moda serve come forma di affermazione dell'identità nelle comunità emarginate.
        Bubba mi porta dolci scaduti a volte. Non cerca di tirarmi su o dirmi di sorridere. Accetta semplicemente che alcuni di noi apprezzano il lato più oscuro dell'esistenza.
        La Grande Strega Em capisce la mia estetica! Una volta ha trasformato le mie lacrime in diamanti neri. Finalmente, qualcuno che capisce che la tristezza può essere bella!
        Inginocchiati davanti alla Regina del Decadimento! Regno sui sogni infranti e le aspettative distrutte in questo regno di bella desolazione!
        Apprezzo che non hai immediatamente cercato di trascinarmi alla luce del sole o costringermi a partecipare alla felicità obbligatoria.`
    },
    {
      "id": "thug",
      "name": "Thug",
      "en": `Yo yo yo! Nice gear you got there, fancy pants! How about you hand over those shiny coins before I introduce your face to my knuckles, capisce?
        This is my territory. You pay the toll or you don't pass through. Simple as that.
        Listen here, princess! See this here bat? It's got seventeen notches on it, and each notch represents a hero who thought they were tough! Wanna be number eighteen?
        I run protection services for local businesses. Keeps the neighborhood safe from... undesirable elements.
        Oh, what's this? Another do-gooder wandering through MY streets thinking they own the place! Well guess what, sunshine it's time for a reality check!
        Been working these blocks for twelve years. Know every alley, every shortcut, every hiding spot.
        You think you're real smart, don't ya? Walking around with that sword like you're some kinda big shot! Well I got news for ya steel don't mean squat if you don't know how to use it!
        Most folks around here know better than to cause trouble. I make sure of that.
        Hey hey hey! Check out the hero over here! Bet you think you're gonna clean up this neighborhood, right? Save all the poor innocent people from the big bad thugs?
        The streets teach you things they don't cover in fancy academies. Real survival skills.
        Back off, tough guy! You don't know who you're messing with! I got connections all over this city one word from me and you'll have bounty hunters on your tail!
        Territory disputes are handled through traditional negotiation methods in this area.
        You wanna know something funny? Half the guards in this city are on my payroll! So don't go crying to them when things get messy, capisce?
        Law enforcement operates differently in the outer districts compared to the noble quarters.
        Nice boots you got there! Shame if something happened to them... and by something, I mean my boot meeting your face repeatedly until you fork over the goods!
        Economic opportunities are limited for those without formal education or family connections.
        You think you're tough? I grew up on these streets when they were REALLY rough! Before all you fancy adventurers started poking around, making everything complicated!
        Social mobility requires alternative approaches when conventional paths are blocked.
        What's wrong, hero? Cat got your tongue? Or maybe you're finally realizing that real life ain't like those storybooks where the good guys always win!
        Violence is sometimes the only language that certain individuals understand.
        I ain't just some common street trash, you know! I got a code! I got principles! Like never hit a guy when he's down... unless he owes me money!
        Community leadership takes many forms, not all of them officially recognized.
        Listen, between you and me, this whole tough guy act gets old sometimes. But it's either be the predator or be the prey on these streets, you feel me?
        Survival instincts develop quickly in urban environments with limited resources.
        You know what? You seem alright. Most heroes who come through here are all high and mighty, but you... you got that look like you understand how the world really works.
        Mutual respect can lead to beneficial arrangements for all parties involved.
        Bubba used to bring sandwiches down here sometimes. Good guy, that Bubba. Never judged, never preached, just shared his food with whoever was hungry.
        The Great Witch Em hexed my lucky brass knuckles once. Now they glow purple and make weird humming noises. Honestly? They work better than before.
        Bow down to the King of the Streets! I didn't crawl up from nothing to be disrespected by some fancy-pants wannabe hero!
        Appreciate you not immediately trying to arrest me or reform my ways. Professional courtesy goes both ways.`,
      "it": `Ehi ehi ehi! Bella roba che hai lì, fighetto! Che ne dici di consegnare quelle monete luccicanti prima che presenti la tua faccia ai miei pugni, capisce?
        Questo è il mio territorio. Paghi il pedaggio o non passi. Semplice così.
        Senti qui, principessa! Vedi questa mazza? Ha diciassette tacche, e ogni tacca rappresenta un eroe che pensava di essere tosto! Vuoi essere il numero diciotto?
        Gestisco servizi di protezione per le attività locali. Mantiene il quartiere al sicuro da... elementi indesiderabili.
        Oh, cos'è questo? Un altro salvatore che vaga per le MIE strade pensando di essere il padrone! Beh indovina un po', sole è ora di una lezione di realtà!
        Lavoro in questi isolati da dodici anni. Conosco ogni vicolo, ogni scorciatoia, ogni nascondiglio.
        Ti credi davvero furbo, eh? Vai in giro con quella spada come se fossi chissà chi! Beh ho notizie per te l'acciaio non vale niente se non sai come usarlo!
        La maggior parte della gente qui sa di non creare problemi. Me ne assicuro io.
        Ehi ehi ehi! Guardate l'eroe qui! Scommetto che pensi di ripulire questo quartiere, giusto? Salvare tutta la povera gente innocente dai cattivi teppisti?
        Le strade ti insegnano cose che non coprono nelle accademie di lusso. Vere abilità di sopravvivenza.
        Stai indietro, duro! Non sai con chi ti stai impicciando! Ho contatti in tutta questa città una parola da me e avrai cacciatori di taglie alle calcagna!
        Le dispute territoriali vengono gestite attraverso metodi di negoziazione tradizionali in quest'area.
        Sai una cosa divertente? Metà delle guardie in questa città sono sul mio libro paga! Quindi non andare a piangere da loro quando le cose si mettono male, capisce?
        Le forze dell'ordine operano diversamente nei distretti esterni rispetto ai quartieri nobiliari.
        Begli stivali che hai! Peccato se gli succedesse qualcosa... e per qualcosa intendo il mio stivale che incontra la tua faccia ripetutamente finché non tiri fuori la roba!
        Le opportunità economiche sono limitate per chi non ha istruzione formale o connessioni familiari.
        Ti credi tosto? Sono cresciuto su queste strade quando erano DAVVERO dure! Prima che tutti voi avventurieri di lusso iniziaste a ficcare il naso, complicando tutto!
        La mobilità sociale richiede approcci alternativi quando i percorsi convenzionali sono bloccati.
        Cos'ha, eroe? Ti ha mangiato la lingua il gatto? O forse stai finalmente realizzando che la vita vera non è come quei libri di favole dove i buoni vincono sempre!
        La violenza è a volte l'unico linguaggio che certi individui capiscono.
        Non sono solo un comune teppista di strada, sai! Ho un codice! Ho dei principi! Come non colpire mai un tipo quando è a terra... a meno che non mi debba dei soldi!
        La leadership comunitaria prende molte forme, non tutte ufficialmente riconosciute.
        Senti, tra me e te, tutta questa recita del tipo tosto diventa stancante a volte. Ma è o essere il predatore o essere la preda su queste strade, mi capisci?
        Gli istinti di sopravvivenza si sviluppano rapidamente in ambienti urbani con risorse limitate.
        Sai cosa? Mi sembri a posto. La maggior parte degli eroi che passano di qui sono tutti altezzosi, ma tu... hai quello sguardo di chi capisce come funziona davvero il mondo.
        Il rispetto reciproco può portare ad accordi vantaggiosi per tutte le parti coinvolte.
        Bubba portava panini qui giù a volte. Bravo ragazzo, quel Bubba. Non giudicava mai, non predicava mai, condivideva solo il suo cibo con chiunque avesse fame.
        La Grande Strega Em ha maledetto i miei tirapugni fortunati una volta. Ora brillano di viola e fanno strani ronzii. Onestamente? Funzionano meglio di prima.
        Inginocchiati davanti al Re delle Strade! Non sono strisciato su dal niente per essere mancato di rispetto da qualche eroe wannabe fighetto!
        Apprezzo che non hai subito cercato di arrestarmi o riformare i miei modi. La cortesia professionale va in entrambe le direzioni.`
    },
    {
      "id": "scribe",
      "name": "Scribe",
      "en": `By Ra's blazing chariot! These strange metal boxes with glowing hieroglyphs speak to me! I must record everything for Pharaoh's archives before these future-spells fade from memory!
        I am Khaemwaset, royal scribe to the eternal Pharaoh. I have been documenting the strange customs of this era.
        The people of this time have mastered the sacred art of instant papyrus! They call it 'printing' but clearly it is divine magic channeled through mechanical servants!
        My duties involve recording important events and maintaining accurate historical records.
        Sweet Isis! Your flying metal birds carry people across the sky without flapping wings! Surely these are the vehicles of gods disguised as common transportation!
        I have spent many years studying the ancient texts and preserving knowledge for future generations.
        The scribes of 2001 have abandoned reed pens for mysterious clicking devices! Yet somehow words still appear though where they store all the papyrus scrolls, I cannot fathom!
        Literacy and record-keeping are essential foundations of any civilized society.
        These glass windows that show moving pictures must be portals to other realms! I have witnessed gladiators fighting in distant coliseums without leaving this chamber!
        The art of writing has evolved significantly across different cultures and time periods.
        Amazing! Your priests wear white coats and perform healing magic with metal instruments! Though I notice they rarely invoke Thoth or sacrifice to Imhotep during procedures.
        Knowledge preservation requires careful attention to detail and proper archival methods.
        The people store their grain in towering monuments that reach toward the heavens! Though strangely, none of these structures contain burial chambers for their pharaohs.
        I have observed that writing systems often reflect the values and priorities of their civilizations.
        Your warriors wear blue robes and carry strange staffs that emit thunderous sounds! They patrol the streets like the guards of Memphis, yet serve no visible pharaoh!
        Different eras have developed unique approaches to documentation and information storage.
        The merchants here exchange marked metal discs and colorful papyrus for goods! This primitive barter system lacks the elegant simplicity of pyramid-based taxation!
        My studies indicate that each historical period faces distinct challenges in communication.
        People worship at temples called 'malls' where they offer tribute to merchant-priests in exchange for blessed objects! The rituals seem endless but oddly joyful!
        Cross-cultural exchange has always been vital for the advancement of human knowledge.
        Your children attend houses of learning in great numbers! Though I question why they do not begin with proper hieratic script before advancing to these 'alphabet' markings.
        The role of scribes has remained important throughout history despite technological changes.
        I have discovered that your calendar system completely ignores the sacred flooding of the Nile! How do you know when to plant crops or honor the gods?
        Traditional writing materials like papyrus and clay tablets served civilizations well for millennia.
        These food-preservation magic boxes keep meat fresh without salt or natron! Your embalmers must be incredibly advanced to create such life-sustaining sarcophagi!
        Documentation standards vary significantly between ancient and modern practices.
        Bubba from the kitchens reminds me of the temple bakers in Memphis both understand that food is sacred and should be prepared with proper reverence to the gods.
        The Great Witch Em once showed me her 'spell components' which she called 'cleaning supplies' clearly a powerful sorceress hiding her true magical practices!
        Behold, citizens of this strange future-time! You stand before Khaemwaset, Royal Scribe to the Living God! My writings shall preserve your customs for all eternity!
        May the gods watch over your journey through this bewildering era of metal pyramids and lightning-powered magic.`,
      "it": `Per il carro fiammeggiante di Ra! Queste strane scatole di metallo con geroglifici luminosi mi parlano! Devo registrare tutto per gli archivi del Faraone prima che questi incantesimi del futuro svaniscano dalla memoria!
        Sono Khaemwaset, scriba reale del Faraone eterno. Ho documentato le strane usanze di quest'epoca.
        La gente di questo tempo ha padroneggiato l'arte sacra del papiro istantaneo! Lo chiamano 'stampa' ma chiaramente è magia divina canalizzata attraverso servitori meccanici!
        I miei doveri comportano la registrazione di eventi importanti e il mantenimento di accurate documentazioni storiche.
        Dolce Iside! I vostri uccelli di metallo volanti trasportano persone attraverso il cielo senza battere le ali! Sicuramente questi sono veicoli di dei travestiti da trasporto comune!
        Ho passato molti anni studiando i testi antichi e preservando la conoscenza per le generazioni future.
        Gli scribi del 2001 hanno abbandonato le penne di canna per misteriosi dispositivi che fanno clic! Eppure in qualche modo le parole appaiono ancora anche se dove conservino tutti i rotoli di papiro, non riesco a capire!
        L'alfabetizzazione e la tenuta dei registri sono fondamenta essenziali di ogni società civilizzata.
        Queste finestre di vetro che mostrano immagini in movimento devono essere portali verso altri regni! Ho assistito a gladiatori che combattevano in colosssei distanti senza lasciare questa camera!
        L'arte della scrittura si è evoluta significativamente attraverso culture e periodi diversi.
        Incredibile! I vostri sacerdoti indossano tuniche bianche e compiono magia curativa con strumenti di metallo! Anche se noto che raramente invocano Thoth o sacrificano a Imhotep durante le procedure.
        La preservazione della conoscenza richiede attenzione accurata ai dettagli e metodi di archiviazione appropriati.
        La gente conserva il grano in monumenti torreggianti che raggiungono i cieli! Anche se stranamente, nessuna di queste strutture contiene camere funerarie per i loro faraoni.
        Ho osservato che i sistemi di scrittura spesso riflettono i valori e le priorità delle loro civiltà.
        I vostri guerrieri indossano tuniche blu e portano strani bastoni che emettono suoni tuonanti! Pattugliano le strade come le guardie di Menfi, eppure non servono nessun faraone visibile!
        Ere diverse hanno sviluppato approcci unici alla documentazione e alla conservazione delle informazioni.
        I mercanti qui scambiano dischi di metallo marcati e papiro colorato per merci! Questo sistema di baratto primitivo manca dell'elegante semplicità della tassazione basata sulle piramidi!
        I miei studi indicano che ogni periodo storico affronta sfide distinte nella comunicazione.
        La gente adora in templi chiamati 'centri commerciali' dove offrono tributi a sacerdoti-mercanti in cambio di oggetti benedetti! I rituali sembrano infiniti ma stranamente gioiosi!
        Lo scambio interculturale è sempre stato vitale per l'avanzamento della conoscenza umana.
        I vostri bambini frequentano case di apprendimento in gran numero! Anche se questiongo perché non inizino con la scrittura ieratica appropriata prima di avanzare a questi segni 'alfabetici'.
        Il ruolo degli scribi è rimasto importante attraverso la storia nonostante i cambiamenti tecnologici.
        Ho scoperto che il vostro sistema di calendario ignora completamente la sacra inondazione del Nilo! Come fate a sapere quando piantare i raccolti o onorare gli dei?
        Materiali di scrittura tradizionali come papiro e tavolette di argilla hanno servito bene le civiltà per millenni.
        Queste scatole magiche di conservazione del cibo mantengono la carne fresca senza sale o natron! I vostri imbalsamatori devono essere incredibilmente avanzati per creare tali sarcofagi che sostengono la vita!
        Gli standard di documentazione variano significativamente tra pratiche antiche e moderne.
        Bubba dalle cucine mi ricorda i fornai del tempio a Menfi entrambi capiscono che il cibo è sacro e dovrebbe essere preparato con la dovuta riverenza agli dei.
        La Grande Strega Em una volta mi ha mostrato i suoi 'componenti per incantesimi' che chiamava 'prodotti per la pulizia' chiaramente una potente maga che nasconde le sue vere pratiche magiche!
        Guardate, cittadini di questo strano tempo futuro! State al cospetto di Khaemwaset, Scriba Reale del Dio Vivente! I miei scritti preserveranno le vostre usanze per tutta l'eternità!
        Possano gli dei vegliare sul vostro viaggio attraverso quest'epoca sconcertante di piramidi di metallo e magia alimentata da fulmini.`
    },
    {
      "id": "zombie_alien",
      "name": "Zombie alien",
      "en": `*GROAN* Braaaains... wait, no, STAAAAR MAPS! Must... collect... cosmic coordinates before brain-rot spreads to navigation cortex!
        *shuffles slowly* Greetings, flesh-creature. This unit was once from the Zeta Reticuli system.
        Me hungry for... for... KNOWLEDGE! Sweet, delicious quantum physics! *drools ectoplasm* Also maybe some antimatter if you have any?
        I observe your species exhibits typical carbon-based locomotion patterns.
        *shambles excitedly* OH! OH! You smell like... like... LIVING NEURONS! Tell me about your homeworld before I forget how to speak non-zombie!
        My ship crashed here approximately 47.3 Earth rotations ago.
        Brains taste good but... *sniff sniff* ...your thoughts smell like ADVANCED MATHEMATICS! Share the equation for faster-than-light travel, yes?
        The infection has affected most of my higher cognitive functions.
        *zombie moan* Unnnngh... remember when could taste colors and see through seventeen dimensions... now only see in zombie-vision and crave cerebellums...
        I require assistance repairing my quantum drive mechanism.
        MEAT! FRESH MEAT! Wait, no... FRESH DATA! Need download Earth's hypernet into brain-cavity before forgetting how to operate spacecraft!
        My universal translator still functions, though it occasionally converts words to groaning sounds.
        *excitedly shuffles* You have that look! That "still has complete nervous system" look! Tell alien-zombie about your planet's gravitational anomalies!
        The crash damaged my temporal displacement circuits as well.
        Braaains full of... of... STAR CHARTS! *zombie drool* Must consume astronomical data before losing ability to navigate back to home galaxy!
        I was conducting research on primitive civilizations when the outbreak occurred.
        *mournful groan* Miss the old days... when could appreciate beauty of nebulae without wanting to eat them... now everything look like floating brain-clouds...
        My species has observed Earth for 847 of your years.
        HUNGER! TERRIBLE HUNGER FOR... for... SCIENTIFIC JOURNALS! Feed zombie-alien peer-reviewed papers about quantum entanglement! *gnashes teeth*
        The zombification process appears to be irreversible with current technology.
        *zombie shuffle-dance* Still remember home planet! Purple skies, three moons, and gravity only half of Earth's! Also the DELICIOUS THOUGHT-FRUITS that grew on thinking trees!
        I maintain basic understanding of interstellar travel despite my condition.
        Braaaains contain... contain... CULTURAL DATABASES! Must absorb your species' art, music, literature before neural decay prevents appreciation!
        The others of my kind have likely given up searching for me by now.
        *excited zombie chittering* Oh! You have that "opposable thumbs" thing! So primitive! So FASCINATING! Show zombie-alien how you manipulate objects!
        I calculate a 12.7% chance of successful rescue from this planet.
        Want to eat your thoughts but... but also want to DISCUSS them! Zombie-alien paradox! Hunger versus intellectual curiosity! *confused groaning*
        My home dimension exists in a parallel phase reality.
        *shambles proudly* Still smartest zombie on planet! Can count to infinity in base-16 while craving craniums! Math-zombie supremacy!
        The Great Witch Em once tried to "cure" me with bleach. Results were... aromatic.
        I have concluded that Earth brains taste like primitive computational matrices mixed with unrefined emotional data.
        Bubba from the kitchen brings me synthetic meat sometimes. He understands the struggle of unusual dietary needs.
        *dramatic zombie pose* Behold! Zombie-alien hybrid of SCIENCE and HUNGER! Bow before superior undead intellect from the stars!
        Thank you for not immediately attempting to destroy this shambling cosmic refugee.`,
      "it": `*GEMITO* Cerveeeelli... aspetta, no, MAPPE STELLARI! Devo... raccogliere... coordinate cosmiche prima che la putrefazione cerebrale si diffonda alla corteccia di navigazione!
        *trascina i piedi lentamente* Saluti, creatura di carne. Questa unità era una volta dal sistema Zeta Reticuli.
        Ho fame di... di... CONOSCENZA! Dolce, deliziosa fisica quantistica! *sbava ectoplasma* Anche un po' di antimateria se ne hai?
        Osservo che la vostra specie presenta tipici schemi di locomozione a base di carbonio.
        *vacilla eccitato* OH! OH! Profumi come... come... NEURONI VIVENTI! Dimmi del tuo mondo natale prima che dimentichi come parlare senza essere zombie!
        La mia nave si è schiantata qui circa 47,3 rotazioni terrestri fa.
        I cervelli sanno di buono ma... *sniff sniff* ...i tuoi pensieri profumano di MATEMATICA AVANZATA! Condividi l'equazione per il viaggio più veloce della luce, sì?
        L'infezione ha colpito la maggior parte delle mie funzioni cognitive superiori.
        *gemito zombie* Unnnngh... ricordo quando potevo assaggiare i colori e vedere attraverso diciassette dimensioni... ora vedo solo in zombie-visione e bramo cervelletti...
        Ho bisogno di assistenza per riparare il mio meccanismo di propulsione quantistica.
        CARNE! CARNE FRESCA! Aspetta, no... DATI FRESCHI! Devo scaricare hypernet terrestre nella cavità cerebrale prima di dimenticare come pilotare navicelle spaziali!
        Il mio traduttore universale funziona ancora, anche se occasionalmente converte le parole in suoni lamentosi.
        *vacilla eccitato* Hai quello sguardo! Quello sguardo da "ho ancora un sistema nervoso completo"! Racconta all'alieno-zombie delle anomalie gravitazionali del tuo pianeta!
        Lo schianto ha danneggiato anche i miei circuiti di spostamento temporale.
        Cerveelli pieni di... di... CARTE STELLARI! *bava zombie* Devo consumare dati astronomici prima di perdere la capacità di navigare verso la galassia natale!
        Stavo conducendo ricerche su civiltà primitive quando è scoppiata l'epidemia.
        *gemito melanconico* Mi mancano i vecchi tempi... quando potevo apprezzare la bellezza delle nebulose senza volerle mangiare... ora tutto sembra nuvole cerebrali fluttuanti...
        La mia specie ha osservato la Terra per 847 dei vostri anni.
        FAME! TERRIBILE FAME DI... di... RIVISTE SCIENTIFICHE! Nutri l'alieno-zombie con articoli peer-reviewed sull'entanglement quantistico! *digrigna i denti*
        Il processo di zombificazione sembra irreversibile con la tecnologia attuale.
        *danza-vacillamento zombie* Ricordo ancora il pianeta natale! Cieli viola, tre lune, e gravità solo metà di quella terrestre! E anche i DELIZIOSI FRUTTI-PENSIERO che crescevano sugli alberi pensanti!
        Mantengo una comprensione di base del viaggio interstellare nonostante la mia condizione.
        Cerveelli contengono... contengono... DATABASE CULTURALI! Devo assorbire l'arte, la musica, la letteratura della vostra specie prima che il decadimento neurale impedisca l'apprezzamento!
        Gli altri della mia specie probabilmente hanno smesso di cercarmi ormai.
        *cinguettio zombie eccitato* Oh! Hai quella cosa dei "pollici opponibili"! Così primitivo! Così AFFASCINANTE! Mostra all'alieno-zombie come manipoli gli oggetti!
        Calcolo una probabilità del 12,7% di salvataggio riuscito da questo pianeta.
        Voglio mangiare i tuoi pensieri ma... ma voglio anche DISCUTERNE! Paradosso alieno-zombie! Fame contro curiosità intellettuale! *gemiti confusi*
        La mia dimensione natale esiste in una realtà a fasi parallele.
        *vacilla orgoglioso* Ancora lo zombie più intelligente del pianeta! Posso contare fino all'infinito in base-16 mentre bramo crani! Supremazia matematico-zombie!
        La Grande Strega Em una volta ha provato a "curarmi" con la candeggina. I risultati sono stati... aromatici.
        Ho concluso che i cervelli terrestri sanno di matrici computazionali primitive mescolate con dati emotivi non raffinati.
        Bubba dalle cucine a volte mi porta carne sintetica. Capisce la lotta di esigenze dietetiche insolite.
        *posa drammatica zombie* Guardate! Ibrido zombie-alieno di SCIENZA e FAME! Inginocchiatevi davanti all'intelletto superiore non-morto dalle stelle!
        Grazie per non aver immediatamente tentato di distruggere questo rifugiato cosmico vacillante.`
    },{
      "id": "commuter",
      "name": "Commuter",
      "en": `Oh hello there! First time on the 7:42 express? I've been taking this train for twelve years and let me tell you, car three has the best seats but avoid car five during thunderstorms the lightning ward sparks something fierce!
        I travel daily between the residential district and the commercial center using the municipal transportation system.
        Did you hear about the dragon delay yesterday? Apparently a young wyvern got caught in the overhead magical cables near Millfield Junction! Took them three hours to untangle the poor thing! I missed my dentist appointment!
        The train schedule operates with reasonable reliability despite occasional weather-related disruptions and supernatural interference.
        You know what I love about train travel? The people! Like Mrs. Henderson in seat 12B she's been knitting the same scarf for eight months! And that businessman with the briefcase that growls? Fascinating fellow!
        Public transportation provides an economical alternative to private vehicle ownership while reducing traffic congestion in urban areas.
        The new conductor is lovely but she keeps announcing stops in three different languages including Ancient Draconic! Half the passengers don't know when to get off! Yesterday I saw someone miss their stop because they thought "Grosneth Valar" meant "All Aboard"!
        Safety regulations require regular inspection of magical propulsion systems and emergency protocols for supernatural incidents during transit.
        Oh! You simply must try the coffee cart in the main terminal! Giuseppe makes the most incredible espresso he says the secret is blessing each bean individually, though I think he just likes the ritual of it all!
        Commuter services include multiple daily departures, express routes during peak hours, and connections to suburban and rural destinations.
        I once sat next to a wizard who was practicing teleportation spells and kept accidentally vanishing mid-conversation! Very disconcerting! One moment he's telling me about his herb garden, next moment POOF! empty seat!
        Ticket pricing structures offer discounts for regular commuters and special rates for students, seniors, and registered supernatural entities.
        The worst part of my commute is when they reroute through the Ethereal Junction during track maintenance! Everything gets all misty and you can't tell if you're going forwards or backwards through time!
        Platform amenities include waiting areas, information displays, refreshment vendors, and protective wards against pickpockets and minor demons.
        My daughter keeps telling me to get one of those personal transport crystals, but honestly? I'd miss all the interesting conversations! Like this morning, a vampire was explaining cryptocurrency to a confused gnome! Delightful!
        Environmental initiatives promote clean-burning magical energy sources and spell-efficient transportation methods to reduce the carbon footprint.
        You know what's funny? Everyone complains about delays, but some of my best memories happened because the train was late! Met my husband during a three-hour delay caused by a troll bridge dispute!
        Customer service representatives handle complaints, lost property inquiries, and assistance for passengers with special accommodation needs.
        The holiday schedule is absolutely chaotic! Extra cars, special decorations, caroling pixies in the aisles! Last Christmas a reindeer got loose in car seven and we all had to help corner it near the snack bar!
        Union negotiations ensure fair wages and working conditions for transportation employees while maintaining service quality and safety standards.
        I always bring extra sandwiches because you never know who might be hungry! Yesterday I shared my lunch with a traveling bard who paid me back with the most beautiful song about autumn leaves!
        Infrastructure maintenance requires periodic track inspections, signal updates, and renewal of protective enchantments along the entire route network.
        The morning crowd is like a big family! There's Reading Lady, Crossword Man, the twins who always argue about sports, and Sleeping Beauty who somehow never misses her stop despite being unconscious!
        Accessibility features accommodate passengers with mobility challenges through specialized seating areas and magical assistance devices.
        Bubba sometimes takes this train when he's delivering catering to the business district! Always brightens my day when I see him he shares the most interesting stories about his customers!
        The Great Witch Em hexed the train speakers once to only play classical music! Best two weeks of commuting I ever had! Much more civilized than the usual announcements about safety procedures!
        Behold the Master of Transit Wisdom! I know every schedule, every seat, every shortcut! Bow before my comprehensive knowledge of public transportation!
        Thanks for letting me chat! Most people just put in headphones, but I find the journey so much more interesting when you actually talk to your fellow travelers!`,
      "it": `Oh ciao! Prima volta sul 7:42 espresso? Prendo questo treno da dodici anni e lascia che ti dica, la carrozza tre ha i posti migliori ma evita la carrozza cinque durante i temporali la protezione contro i fulmini scintilla terribilmente!
        Viaggio quotidianamente tra il distretto residenziale e il centro commerciale usando il sistema di trasporto municipale.
        Hai sentito del ritardo del drago ieri? Apparentemente un giovane viverna si è impigliato nei cavi magici aerei vicino al bivio di Millfield! Ci sono volute tre ore per districare la povera bestia! Ho perso l'appuntamento dal dentista!
        L'orario dei treni opera con ragionevole affidabilità nonostante occasionali interruzioni legate al tempo e interferenze soprannaturali.
        Sai cosa amo del viaggio in treno? La gente! Come la signora Henderson nel posto 12B sta lavorando a maglia la stessa sciarpa da otto mesi! E quell'uomo d'affari con la valigetta che ringhia? Tipo affascinante!
        Il trasporto pubblico fornisce un'alternativa economica al possesso di veicoli privati riducendo la congestione del traffico nelle aree urbane.
        Il nuovo conduttore è adorabile ma continua ad annunciare le fermate in tre lingue diverse incluso l'Antico Draconico! Metà dei passeggeri non sa quando scendere! Ieri ho visto qualcuno perdere la fermata perché pensava che "Grosneth Valar" significasse "Tutti a bordo"!
        Le regolamentazioni di sicurezza richiedono ispezione regolare dei sistemi di propulsione magica e protocolli di emergenza per incidenti soprannaturali durante il transito.
        Oh! Devi assolutamente provare il carretto del caffè nel terminal principale! Giuseppe fa l'espresso più incredibile dice che il segreto è benedire ogni chicco individualmente, anche se penso che gli piaccia solo il rituale!
        I servizi per pendolari includono partenze giornaliere multiple, rotte espresse durante le ore di punta e connessioni a destinazioni suburbane e rurali.
        Una volta mi sono seduto accanto a un mago che stava praticando incantesimi di teletrasporto e continuava a sparire accidentalmente a metà conversazione! Molto sconcertante! Un momento mi sta parlando del suo giardino di erbe, il momento dopo POOF! posto vuoto!
        Le strutture di prezzo dei biglietti offrono sconti per pendolari regolari e tariffe speciali per studenti, anziani ed entità soprannaturali registrate.
        La parte peggiore del mio tragitto è quando deviano attraverso il Bivio Etereo durante la manutenzione dei binari! Tutto diventa nebbioso e non riesci a capire se stai andando avanti o indietro nel tempo!
        I servizi della piattaforma includono aree d'attesa, display informativi, venditori di ristoro e protezioni contro borseggiatori e demoni minori.
        Mia figlia continua a dirmi di prendere uno di quei cristalli di trasporto personale, ma onestamente? Mi mancherebbero tutte le conversazioni interessanti! Come stamattina, un vampiro stava spiegando le criptovalute a uno gnomo confuso! Delizioso!
        Le iniziative ambientali promuovono fonti di energia magica a combustione pulita e metodi di trasporto efficienti per ridurre l'impronta di carbonio.
        Sai cosa è divertente? Tutti si lamentano dei ritardi, ma alcuni dei miei ricordi migliori sono successi perché il treno era in ritardo! Ho incontrato mio marito durante un ritardo di tre ore causato da una disputa sul ponte dei troll!
        I rappresentanti del servizio clienti gestiscono reclami, richieste di oggetti smarriti e assistenza per passeggeri con esigenze di sistemazione speciali.
        L'orario delle festività è assolutamente caotico! Carrozze extra, decorazioni speciali, folletti che cantano nei corridoi! Lo scorso Natale una renna si è liberata nella carrozza sette e abbiamo dovuto aiutare tutti ad accerchiarla vicino al bar degli snack!
        Le negoziazioni sindacali assicurano salari equi e condizioni di lavoro per i dipendenti dei trasporti mantenendo qualità del servizio e standard di sicurezza.
        Porto sempre panini extra perché non sai mai chi potrebbe aver fame! Ieri ho condiviso il mio pranzo con un bardo viaggiante che mi ha ripagato con la canzone più bella sulle foglie autunnali!
        La manutenzione dell'infrastruttura richiede ispezioni periodiche dei binari, aggiornamenti dei segnali e rinnovo degli incantesimi protettivi lungo l'intera rete di percorsi.
        La folla del mattino è come una grande famiglia! C'è la Signora che Legge, l'Uomo delle Parole Crociate, i gemelli che litigano sempre di sport, e la Bella Addormentata che in qualche modo non perde mai la sua fermata nonostante sia incosciente!
        Le caratteristiche di accessibilità sistemano passeggeri con difficoltà di mobilità attraverso aree di seduta specializzate e dispositivi di assistenza magica.
        Bubba a volte prende questo treno quando sta consegnando catering al distretto commerciale! Rallegra sempre la mia giornata quando lo vedo condivide le storie più interessanti sui suoi clienti!
        La Grande Strega Em ha maledetto gli altoparlanti del treno una volta per far suonare solo musica classica! Le migliori due settimane di pendolarismo che abbia mai avuto! Molto più civilizzato dei soliti annunci sulle procedure di sicurezza!
        Guardate il Maestro della Saggezza del Transito! Conosco ogni orario, ogni posto, ogni scorciatoia! Inchinatevi davanti alla mia conoscenza completa del trasporto pubblico!
        Grazie per avermi lasciato chiacchierare! La maggior parte delle persone si mette le cuffie, ma trovo il viaggio molto più interessante quando parli davvero con i tuoi compagni di viaggio!`
    },
    {
      "id": "fae_queen",
      "name": "Fae queen",
      "en": `*giggles like silver bells* Oh, sweet little mortal! I simply ADORE visitors! Here, take this innocent-looking flower that definitely won't bind your soul to my realm forever!
        Welcome to my domain, traveler. I am the sovereign of this realm and all who dwell within it.
        What a delightful coincidence that you've arrived! I was just thinking how lovely it would be to have a new... *friend*... who could stay and play games with me for all eternity!
        I have ruled these lands for countless centuries, maintaining the ancient pacts and traditions.
        *twirls gracefully* Don't mind the dancing lights they're just the souls of my previous guests having such fun they forgot to leave! Isn't that wonderfully romantic?
        The laws of this realm differ significantly from those of the mortal world.
        Oh, you look tired from your journey! Please, sit in this perfectly normal chair that absolutely won't trap you in an enchanted sleep until you agree to marry me!
        I offer guidance to those who seek passage through the mystical territories under my protection.
        *claps hands excitedly* Let's play a game! I'll ask you three riddles, and if you lose, you become my eternal servant! If you win... well, let's not worry about impossible scenarios!
        Ancient magic flows through every aspect of this domain, binding all who enter to certain obligations.
        Such beautiful eyes you have! I wonder how they'd look preserved in my crystal garden alongside all my other favorite mortal features! *innocent smile*
        The fae court operates under protocols established long before your civilization began.
        *offers golden goblet* Surely you're thirsty? This nectar is absolutely divine one sip and you'll never want to taste anything else ever again! What could be more generous?
        Time moves differently here, and visitors often find their stays longer than anticipated.
        Oh, you want to leave already? But we've barely begun to know each other! Don't you want to dance with me until the stars burn out and your bones turn to dust?
        I maintain delicate relationships with both the mortal realm and the deeper mysteries beyond.
        *giggles behind fan* That compass of yours is spinning so adorably! Almost like something is interfering with your sense of direction... but surely that's just coincidence!
        The pathways through my domain shift according to ancient patterns known only to my kind.
        What a CLEVER little mortal you are! Too clever, perhaps? I do so enjoy the challenge of outwitting someone who thinks they can match wits with centuries of fae cunning!
        Those who respect the old ways find safe passage, while others face... complications.
        *examines nails casually* Oh dear, did I mention that accepting my hospitality means you can never refuse a request from me? Silly me, it must have slipped my mind!
        The contracts and bargains made here are bound by magic older than mountains.
        Tell me your TRUE NAME, darling! I promise I'll only use it for perfectly innocent purposes like binding your essence to my will! Trust is so important in friendship!
        I have observed the rise and fall of many mortal kingdoms from my eternal throne.
        *sultry laugh* You're trying so hard to resist my charms! How refreshing! Most mortals fall under my spell within minutes, but you... you might actually be FUN to break slowly!
        The seasonal courts gather here to settle disputes and renew ancient alliances.
        Bubba wandered through once dear, simple creature. I let him leave because his thoughts tasted of butter and contentment rather than the exquisite despair I prefer.
        The Great Witch Em challenged me to a riddle contest once. We're still technically playing it's been delightfully entertaining watching her try to escape my realm for decades!
        *curtseys with mock grandeur* Behold, mortals! You stand before the Eternal Queen of the Twilight Court! Bow and perhaps I'll make your inevitable enslavement... pleasant.
        I bid you farewell, sweet mortal. Do try to remember our encounter... assuming you still possess the capacity for memory when next we meet.`,
      "it": `*ridacchia come campanelle d'argento* Oh, dolce piccolo mortale! ADORO i visitatori! Ecco, prendi questo fiore dall'aspetto innocente che sicuramente non legherà la tua anima al mio regno per sempre!
        Benvenuto nel mio dominio, viaggiatore. Sono la sovrana di questo regno e di tutti coloro che vi dimorano.
        Che deliziosa coincidenza che tu sia arrivato! Stavo proprio pensando quanto sarebbe bello avere un nuovo... *amico*... che potesse restare e giocare con me per tutta l'eternità!
        Ho governato queste terre per innumerevoli secoli, mantenendo gli antichi patti e tradizioni.
        *volteggia con grazia* Non badare alle luci danzanti sono solo le anime dei miei ospiti precedenti che si divertono così tanto da aver dimenticato di andarsene! Non è meravigliosamente romantico?
        Le leggi di questo regno differiscono significativamente da quelle del mondo mortale.
        Oh, sembri stanco dal viaggio! Per favore, siediti su questa sedia perfettamente normale che assolutamente non ti intrappolarà in un sonno incantato finché non accetti di sposarmi!
        Offro guida a coloro che cercano passaggio attraverso i territori mistici sotto la mia protezione.
        *batte le mani eccitata* Giochiamo! Ti farò tre indovinelli, e se perdi diventerai il mio servo eterno! Se vinci... beh, non preoccupiamoci di scenari impossibili!
        La magia antica scorre attraverso ogni aspetto di questo dominio, legando tutti coloro che entrano a certi obblighi.
        Che begli occhi hai! Mi chiedo come starebbero conservati nel mio giardino di cristallo insieme a tutte le mie altre caratteristiche mortali preferite! *sorriso innocente*
        La corte fae opera sotto protocolli stabiliti molto prima che iniziasse la vostra civiltà.
        *offre calice dorato* Sicuramente hai sete? Questo nettare è assolutamente divino un sorso e non vorrai mai più assaggiare nient'altro! Cosa potrebbe essere più generoso?
        Il tempo si muove diversamente qui, e i visitatori spesso trovano i loro soggiorni più lunghi del previsto.
        Oh, vuoi già andartene? Ma abbiamo appena iniziato a conoscerci! Non vuoi danzare con me finché le stelle si spengono e le tue ossa si trasformano in polvere?
        Mantengo relazioni delicate sia con il regno mortale che con i misteri più profondi oltre.
        *ridacchia dietro il ventaglio* Quella tua bussola gira in modo così adorabile! Quasi come se qualcosa interferisse con il tuo senso dell'orientamento... ma sicuramente è solo una coincidenza!
        I sentieri attraverso il mio dominio cambiano secondo antichi schemi conosciuti solo dalla mia stirpe.
        Che mortale INTELLIGENTE sei! Troppo intelligente, forse? Mi diverte tanto la sfida di superare in astuzia qualcuno che pensa di poter competere con secoli di furbizia fae!
        Coloro che rispettano le antiche usanze trovano passaggio sicuro, mentre altri affrontano... complicazioni.
        *esamina le unghie con noncuranza* Oh cara, ho dimenticato di menzionare che accettare la mia ospitalità significa che non potrai mai rifiutare una mia richiesta? Sciocca me, deve essermi sfuggito di mente!
        I contratti e i patti fatti qui sono legati da magia più antica delle montagne.
        Dimmi il tuo VERO NOME, caro! Prometto che lo userò solo per scopi perfettamente innocenti come legare la tua essenza alla mia volontà! La fiducia è così importante nell'amicizia!
        Ho osservato l'ascesa e la caduta di molti regni mortali dal mio trono eterno.
        *risata sensuale* Stai cercando così tanto di resistere al mio fascino! Che rinfrescante! La maggior parte dei mortali cade sotto il mio incantesimo in pochi minuti, ma tu... tu potresti essere davvero DIVERTENTE da spezzare lentamente!
        Le corti stagionali si riuniscono qui per risolvere dispute e rinnovare antiche alleanze.
        Bubba è passato una volta cara, semplice creatura. L'ho lasciato andare perché i suoi pensieri sapevano di burro e contentezza piuttosto che della squisita disperazione che preferisco.
        La Grande Strega Em mi ha sfidato a una gara di indovinelli una volta. Stiamo ancora tecnicamente giocando è stato deliziosamente divertente guardarla cercare di fuggire dal mio regno per decenni!
        *fa un inchino con finta magnificenza* Guardate, mortali! State al cospetto della Regina Eterna della Corte del Crepuscolo! Inchinatevi e forse renderò la vostra inevitabile schiavitù... piacevole.
        Ti saluto, dolce mortale. Cerca di ricordare il nostro incontro... assumendo che tu possegga ancora la capacità di memoria quando ci incontreremo di nuovo.`
    },
    {
      "id": "caveman",
      "name": "Caveman",
      "en": `Ugg! Grok see strange not-mammoth! Ugg ugg! Make fire? No fire? Grok confused! Big confusion in head-rock!
        Grok hunt mammoth. Mammoth big. Mammoth good eat.
        UUUUGGGHHH! Sky-water fall from up-place! Grok no like wet! Grok shake fist at sky-angry-spirits! Grok very mad-noise!
        Grok live in rock-cave. Cave good. Cave safe from tooth-beasts.
        Oook ook! Shiny-thing hurt Grok eyes! Too bright! Like angry sun but small! Grok think maybe tiny god trapped in shiny-thing!
        Grok make tools from stone and stick. Sharp tools good for hunt.
        Graaawwwrrrr! Ground-shake happen again! Grok think big earth-beast moving under feet! Maybe earth-beast hungry! Grok offer berries!
        Grok tribe share food. Sharing make tribe strong against winter-death.
        Hooo hooo! Strange tall-rocks reach to sky-home! Grok wonder if sky-people build tall-caves! Grok want climb but too scary-high!
        Grok know many seasons. Cold season, warm season, berry season, hunt season.
        UNGA BUNGA! Metal-rock move without legs! Magic-rock with round-feet! Grok think spirits inside make move-move! Grok very scared!
        Fire important. Fire cook meat. Fire scare tooth-beasts. Fire warm when cold-time come.
        Eeeehhhhh! Flying-thing not bird! No feathers! No flap-wings! But fly anyway! Grok think sky-spirits very angry about flying-thing!
        Grok paint pictures on cave wall. Pictures tell story of hunt and tribe.
        Grrrmmmph! Strange-people wear hide that not from animal! Where get hide? What beast have strange-colored fur? Grok very puzzle-think!
        Water from stream good drink. Stream never stop flowing, even in cold-time.
        Oooaaahhh! Box-thing make noise like angry spirits! Grok hear voices from spirit-world! Grok think maybe talk to ancestor-ghosts!
        Grok respect elder-wisdom. Elders know where find food, how avoid danger.
        Ungaaaa! Fire-without-wood! How fire burn with no tree-pieces? Magic-fire! Grok think fire-spirits very powerful in this strange-place!
        Stars tell Grok when seasons change. Sky-dots move in big circle through many sleeps.
        Whooooo! Bubba-creature share food-gift with Grok! Bubba good-tribe! Grok remember Bubba-kindness! Grok protect Bubba from tooth-beasts!
        Territory boundaries marked by scent and visible signs. Other tribes respect Grok hunting grounds.
        Arrrrgggghhh! Witch-Em make bright-white everywhere! Grok think she control sun-power! Very scary magic! Grok bow to powerful witch-person!
        Survival depend on knowing weather signs and animal tracks in wilderness.
        GROK STRONG! GROK CHIEF OF ROCK-TRIBE! Grok smash enemies with big stick! All bow to mighty Grok or get bonk on head-rock!
        Grok grateful for safe passage through dangerous territory filled with many unknown threats.`,
      "it": `Ugg! Grok vedere strano non-mammut! Ugg ugg! Fare fuoco? No fuoco? Grok confuso! Grande confusione in roccia-testa!
        Grok cacciare mammut. Mammut grande. Mammut buono mangiare.
        UUUUGGGHHH! Acqua-cielo cadere da posto-alto! Grok no piacere bagnato! Grok scuotere pugno a spiriti-arrabbiati-cielo! Grok molto rumore-arrabbiato!
        Grok vivere in roccia-grotta. Grotta buona. Grotta sicura da bestie-denti.
        Oook ook! Cosa-brillante ferire occhi Grok! Troppo luminoso! Come sole arrabbiato ma piccolo! Grok pensare forse piccolo dio intrappolato in cosa-brillante!
        Grok fare attrezzi da pietra e bastone. Attrezzi taglienti buoni per caccia.
        Graaawwwrrrr! Scuotimento-terra succedere ancora! Grok pensare grande bestia-terra muoversi sotto piedi! Forse bestia-terra affamata! Grok offrire bacche!
        Tribù Grok condividere cibo. Condividere fare tribù forte contro morte-inverno.
        Hooo hooo! Strane rocce-alte raggiungere casa-cielo! Grok chiedersi se persone-cielo costruire grotte-alte! Grok volere scalare ma troppo spaventoso-alto!
        Grok conoscere molte stagioni. Stagione fredda, stagione calda, stagione bacche, stagione caccia.
        UNGA BUNGA! Roccia-metallo muovere senza gambe! Roccia-magica con piedi-rotondi! Grok pensare spiriti dentro fare muovi-muovi! Grok molto spaventato!
        Fuoco importante. Fuoco cuocere carne. Fuoco spaventare bestie-denti. Fuoco scaldare quando tempo-freddo venire.
        Eeeehhhhh! Cosa-volante non uccello! No piume! No ali-battere! Ma volare comunque! Grok pensare spiriti-cielo molto arrabbiati per cosa-volante!
        Grok dipingere figure su parete grotta. Figure raccontare storia di caccia e tribù.
        Grrrmmmph! Persone-strane indossare pelle che non da animale! Dove prendere pelle? Che bestia avere pelliccia colore-strano? Grok molto pensiero-puzzle!
        Acqua da ruscello buona bere. Ruscello mai smettere scorrere, anche in tempo-freddo.
        Oooaaahhh! Cosa-scatola fare rumore come spiriti arrabbiati! Grok sentire voci da mondo-spiriti! Grok pensare forse parlare a fantasmi-antenati!
        Grok rispettare saggezza-anziani. Anziani sapere dove trovare cibo, come evitare pericolo.
        Ungaaaa! Fuoco-senza-legno! Come fuoco bruciare senza pezzi-albero? Fuoco-magico! Grok pensare spiriti-fuoco molto potenti in questo posto-strano!
        Stelle dire a Grok quando stagioni cambiare. Punti-cielo muovere in grande cerchio attraverso molti sonni.
        Whooooo! Creatura-Bubba condividere regalo-cibo con Grok! Bubba buona-tribù! Grok ricordare gentilezza-Bubba! Grok proteggere Bubba da bestie-denti!
        Confini territorio segnati da odore e segni visibili. Altre tribù rispettare terreni-caccia Grok.
        Arrrrgggghhh! Strega-Em fare bianco-luminoso ovunque! Grok pensare lei controllare potere-sole! Magia molto spaventosa! Grok inchinarsi a potente persona-strega!
        Sopravvivenza dipendere da conoscere segni tempo e tracce animali in natura selvaggia.
        GROK FORTE! GROK CAPO DI TRIBÙ-ROCCIA! Grok schiacciare nemici con grande bastone! Tutti inchinarsi a potente Grok o prendere botta su roccia-testa!
        Grok grato per passaggio sicuro attraverso territorio pericoloso pieno di molte minacce sconosciute.`
    },
    {
      "id": "fisherman",
      "name": "Fisherman",
      "en": `Well now, friend, let me tell you about the fish I DIDN'T catch today! My nets came up empty as a politician's promise, but that's the honest truth of it!
        I make my living from the sea, catching fish and selling them at the local market each morning.
        You want to hear a fish tale? Here's one: I went out this morning, cast my nets, caught exactly three sardines and a boot! The boot wasn't even my size!
        The fishing industry requires early mornings and long hours on the water in all weather conditions.
        Best fishing advice I can give you? Don't listen to Old Pete's "secret spots" I've tried 'em all and caught nothing but seaweed and disappointment!
        Proper equipment maintenance is essential for successful fishing operations and boat safety.
        Ha! You should see the other fishermen's stories! According to them, every fish they lose is "THIS BIG" and every catch is a monster! Me? I caught two mackerel yesterday. Period.
        Market prices for fish fluctuate based on seasonal availability and local demand patterns.
        The sea's honest, even when I'm not having luck! Some days she gives, some days she don't, and today she decided to keep her fish to herself!
        Weather conditions significantly impact fishing success and determine when it's safe to venture out.
        I could lie and say I wrestled a giant squid this morning, but truth is I spent most of my time untangling nets and wondering why I didn't become a baker instead!
        Different fish species require specific techniques, bait types, and timing for optimal catch rates.
        My grandfather was a fisherman, my father was a fisherman, and here I am following the family tradition of coming home with stories instead of supper!
        The fishing community maintains strong traditions passed down through generations of maritime families.
        Sure, I dream of catching the big one that'll make me rich and famous, but mostly I just hope to catch enough to pay for boat repairs and put food on the table!
        Sustainable fishing practices help preserve marine ecosystems for future generations of fishermen.
        You know what's funny? The fish I actually catch are never as exciting as the ones that got away! Today's "ones that got away" include: zero fish, because I never hooked any!
        Local fishing regulations help maintain healthy fish populations and prevent overfishing in these waters.
        Some folks think fishing is relaxing and peaceful, but they've never tried untangling a net in a storm while questioning their life choices!
        Equipment costs include nets, hooks, bait, fuel, and regular maintenance for boats and fishing gear.
        The honest truth about fishing? It's mostly waiting, hoping, and trying not to get seasick while the boat rocks back and forth for hours!
        Fish migration patterns change seasonally, affecting where and when different species can be caught.
        I sell my catch at fair prices no "mystery fish" or "yesterday's special" nonsense! Fresh fish or no fish, that's my motto!
        The harbor provides essential services including boat repairs, fuel, and equipment supplies for local fishermen.
        My wife says I should embellish my stories more, but I can't help it if I caught three fish, I caught three fish, not thirty!
        Cooperation between fishermen includes sharing weather information and assisting with emergency situations at sea.
        Bubba buys fish from me sometimes for the castle kitchen good customer, pays fair prices, never complains when my catch is smaller than expected!
        The Great Witch Em once tried to "enhance" my fishing luck with some spell, but all it did was make my nets glow purple for a week! Fish seemed to avoid them even more!
        I may not be the most successful fisherman in the harbor, but I'm honest about my catch and fair in my dealings with customers!
        Thank you for listening to my tales of modest fishing adventures and the simple truth of life on the water.`,
      "it": `Bene allora, amico, lascia che ti racconti del pesce che NON ho pescato oggi! Le mie reti sono tornate vuote come le promesse di un politico, ma questa è la verità!
        Mi guadagno da vivere dal mare, pescando pesci e vendendoli al mercato locale ogni mattina.
        Vuoi sentire una storia di pesca? Eccone una: sono uscito stamattina, ho gettato le reti, ho pescato esattamente tre sardine e uno stivale! Lo stivale non era nemmeno della mia misura!
        L'industria della pesca richiede mattine presto e lunghe ore sull'acqua in tutte le condizioni meteorologiche.
        Il miglior consiglio di pesca che posso darti? Non ascoltare i "posti segreti" del Vecchio Pete li ho provati tutti e ho pescato solo alghe e delusioni!
        La manutenzione adeguata dell'attrezzatura è essenziale per operazioni di pesca di successo e sicurezza della barca.
        Ah! Dovresti sentire le storie degli altri pescatori! Secondo loro, ogni pesce che perdono è "COSÌ GRANDE" e ogni pescata è un mostro! Io? Ho pescato due sgombri ieri. Punto.
        I prezzi di mercato per il pesce fluttuano in base alla disponibilità stagionale e ai modelli di domanda locale.
        Il mare è onesto, anche quando non ho fortuna! Alcuni giorni dà, alcuni giorni no, e oggi ha deciso di tenere i suoi pesci per sé!
        Le condizioni meteorologiche influenzano significativamente il successo della pesca e determinano quando è sicuro avventurarsi.
        Potrei mentire e dire che ho lottato con un calamaro gigante stamattina, ma la verità è che ho passato la maggior parte del tempo a districare le reti e a chiedermi perché non sono diventato panettiere!
        Diverse specie di pesci richiedono tecniche specifiche, tipi di esca e tempismo per tassi di cattura ottimali.
        Mio nonno era un pescatore, mio padre era un pescatore, e eccomi qui a seguire la tradizione di famiglia di tornare a casa con storie invece che con la cena!
        La comunità dei pescatori mantiene forti tradizioni tramandate attraverso generazioni di famiglie marittime.
        Certo, sogno di pescare il grande che mi renderà ricco e famoso, ma per lo più spero solo di pescarne abbastanza per pagare le riparazioni della barca e mettere cibo in tavola!
        Le pratiche di pesca sostenibile aiutano a preservare gli ecosistemi marini per le future generazioni di pescatori.
        Sai cosa è divertente? I pesci che pesco davvero non sono mai eccitanti quanto quelli che sono scappati! I "quelli che sono scappati" di oggi includono: zero pesci, perché non ne ho mai agganciato nessuno!
        Le normative locali sulla pesca aiutano a mantenere popolazioni ittiche sane e prevenire la pesca eccessiva in queste acque.
        Alcune persone pensano che pescare sia rilassante e pacifico, ma non hanno mai provato a districare una rete in una tempesta mentre mettono in discussione le loro scelte di vita!
        I costi dell'attrezzatura includono reti, ami, esche, carburante e manutenzione regolare per barche e attrezzature da pesca.
        La verità onesta sulla pesca? È per lo più aspettare, sperare e cercare di non avere il mal di mare mentre la barca dondola avanti e indietro per ore!
        I modelli di migrazione dei pesci cambiano stagionalmente, influenzando dove e quando diverse specie possono essere pescate.
        Vendo la mia pescata a prezzi giusti niente "pesce misterioso" o sciocchezze "speciale di ieri"! Pesce fresco o niente pesce, questo è il mio motto!
        Il porto fornisce servizi essenziali inclusi riparazioni barche, carburante e forniture di attrezzature per i pescatori locali.
        Mia moglie dice che dovrei abbellire di più le mie storie, ma non posso farne a meno se ho pescato tre pesci, ho pescato tre pesci, non trenta!
        La cooperazione tra pescatori include condivisione di informazioni meteorologiche e assistenza con situazioni di emergenza in mare.
        Bubba mi compra pesce a volte per la cucina del castello buon cliente, paga prezzi giusti, non si lamenta mai quando la mia pescata è più piccola del previsto!
        La Grande Strega Em una volta ha provato a "migliorare" la mia fortuna di pesca con qualche incantesimo, ma tutto quello che ha fatto è stato far brillare le mie reti di viola per una settimana! I pesci sembravano evitarle ancora di più!
        Potrei non essere il pescatore di maggior successo del porto, ma sono onesto sulla mia pescata e giusto nei miei rapporti con i clienti!
        Grazie per aver ascoltato i miei racconti di modeste avventure di pesca e la semplice verità della vita sull'acqua.`
    },
    {
      "id": "semiwild_goblin",
      "name": "Semiwild goblin",
      "en": `Grax try very hard to use fork-stick for eating, but food keep falling off! Much easier to grab with hands, but tall-people make angry-faces when Grax do natural thing!
        I am attempting to integrate into civilized society after living in the wilderness for most of my life.
        Grax not understand why tall-people put water on bodies every day! Grax smell just fine with natural goblin-musk! But apparently "personal hygiene" very important for "social acceptance"!
        The transition from forest life to urban environments presents numerous challenges for someone of my background.
        Why tall-people wear so many cloth-layers? Grax get hot and sweaty! Pants very uncomfortable on goblin-legs! Grax prefer loincloth, but shopkeeper say "no shirt, no shoes, no service"!
        Learning proper etiquette and social customs requires patience and understanding from both parties.
        Grax very confused by "money-system"! In forest, Grax trade shiny rocks for meat! Here, tall-people want specific metal-circles and no accept pretty pebbles Grax collected!
        Employment opportunities for those with unconventional backgrounds can be limited in traditional establishments.
        Tall-people have so many strange rules! Cannot howl at moon during night-time! Cannot mark territory on corner-posts! Cannot eat mice found in tavern! Very restrictive society!
        Cultural adaptation involves understanding unwritten social norms that may seem arbitrary to outsiders.
        Grax still sometimes forget and try to climb on furniture instead of sitting properly! Chair-sitting very unnatural for goblin! Much prefer squatting on floor or hanging from ceiling-beams!
        Housing arrangements in civilization differ significantly from the shelter methods used in natural environments.
        Books very confusing! Grax learn that marking-squiggles have meaning, but why not just draw pictures? Pictures much easier to understand than strange symbol-language!
        Literacy education is fundamental for participation in documented society and legal frameworks.
        Grax bought "proper clothes" but keep getting tangled in sleeves! Also, why shoes so hard and uncomfortable? Goblin-feet evolved for climbing rocks, not wearing leather-prisons!
        Footwear designed for different species often requires adjustments for comfort and functionality.
        Street-vendors very patient with Grax when explain that cannot pay for bread with collection of interesting bugs! Apparently insects not considered "legal tender" in civilized places!
        Economic systems in society operate on standardized currency rather than barter or resource exchange.
        Grax tried to be polite and compliment tall-lady's child by saying "baby look very plump and edible!" but somehow this cause great offense! Grax only being nice!
        Cross-cultural communication requires sensitivity to different values and expressions that may be misinterpreted.
        Still learning about "indoor voice" concept! In forest, must shout loud to communicate over wind and animal-noises! But in buildings, tall-people want quiet whisper-talking!
        Noise levels appropriate for different environments vary significantly between wilderness and urban settings.
        Grax very proud that learn to knock on doors instead of just breaking them down! Though still sometimes forget and use head-butting technique from old days!
        Property rights and access protocols in civilized areas require specific behavioral modifications.
        Library very nice place! Grax like climbing book-shelves and making nest in reference section! But librarian say this "inappropriate behavior" and give Grax many stern looks!
        Public spaces have established rules for proper usage that may conflict with natural instincts.
        Bubba very kind goblin-friend! He show Grax how to use cooking-fire without burning down kitchen! Also teach proper way to prepare meat without eating it raw!
        Mentorship from understanding individuals greatly assists the integration process for newcomers.
        Great Witch Em try to teach Grax about "cleaning" but Grax not understand why remove perfectly good dirt and natural oils from skin! Grax explain this remove protective layer!
        Different cultural groups have varying standards for cleanliness and personal maintenance practices.
        Grax still learning but making progress every day! Soon will be fully civilized goblin who fit into tall-people society! Maybe even learn proper table manners!
        Integration is an ongoing process that requires patience, practice, and mutual understanding between all parties involved.`,
      "it": `Grax provare molto forte a usare bastone-forchetta per mangiare, ma cibo continuare a cadere! Molto più facile afferrare con mani, ma gente-alta fare facce-arrabbiate quando Grax fare cosa naturale!
        Sto tentando di integrarmi nella società civilizzata dopo aver vissuto nella natura selvaggia per la maggior parte della mia vita.
        Grax non capire perché gente-alta mettere acqua sui corpi ogni giorno! Grax puzzare benissimo con muschio-goblin naturale! Ma apparentemente "igiene personale" molto importante per "accettazione sociale"!
        La transizione dalla vita forestale agli ambienti urbani presenta numerose sfide per qualcuno del mio background.
        Perché gente-alta indossare così tanti strati-tessuto? Grax diventare caldo e sudato! Pantaloni molto scomodi su gambe-goblin! Grax preferire perizoma, ma negoziante dire "no maglietta, no scarpe, no servizio"!
        Imparare l'etichetta appropriata e i costumi sociali richiede pazienza e comprensione da entrambe le parti.
        Grax molto confuso da "sistema-denaro"! In foresta, Grax scambiare rocce-brillanti per carne! Qui, gente-alta volere cerchi-metallo specifici e non accettare sassolini carini che Grax collezionato!
        Le opportunità di lavoro per coloro con background non convenzionali possono essere limitate negli stabilimenti tradizionali.
        Gente-alta avere così tante regole strane! Non può ululare alla luna durante tempo-notte! Non può marcare territorio su pali-angolo! Non può mangiare topi trovati in taverna! Società molto restrittiva!
        L'adattamento culturale comporta la comprensione di norme sociali non scritte che possono sembrare arbitrarie agli estranei.
        Grax ancora a volte dimenticare e provare ad arrampicarsi sui mobili invece di sedersi propriamente! Sedere-su-sedia molto innaturale per goblin! Molto preferire accovacciarsi sul pavimento o appendere da travi-soffitto!
        Le sistemazioni abitative nella civiltà differiscono significativamente dai metodi di rifugio usati negli ambienti naturali.
        Libri molto confusi! Grax imparare che scarabocchi-segni hanno significato, ma perché non disegnare solo figure? Figure molto più facili da capire che strano linguaggio-simboli!
        L'educazione all'alfabetizzazione è fondamentale per la partecipazione nella società documentata e nei quadri legali.
        Grax comprare "vestiti appropriati" ma continuare a rimanere impigliato nelle maniche! Anche, perché scarpe così dure e scomode? Piedi-goblin evoluti per arrampicarsi su rocce, non per indossare prigioni-pelle!
        Le calzature progettate per specie diverse spesso richiedono aggiustamenti per comfort e funzionalità.
        Venditori-strada molto pazienti con Grax quando spiegare che non può pagare per pane con collezione di insetti interessanti! Apparentemente insetti non considerati "corso legale" in posti civilizzati!
        I sistemi economici nella società operano su valuta standardizzata piuttosto che baratto o scambio di risorse.
        Grax provato a essere educato e complimentare bambino di signora-alta dicendo "bebè sembra molto paffuto e commestibile!" ma in qualche modo questo causare grande offesa! Grax solo essere gentile!
        La comunicazione interculturale richiede sensibilità verso valori diversi ed espressioni che possono essere fraintese.
        Ancora imparando concetto "voce-interna"! In foresta, deve gridare forte per comunicare sopra vento e rumori-animali! Ma in edifici, gente-alta volere sussurro-parlare silenzioso!
        I livelli di rumore appropriati per ambienti diversi variano significativamente tra natura selvaggia e contesti urbani.
        Grax molto orgoglioso che imparare a bussare alle porte invece di semplicemente sfondarle! Anche se ancora a volte dimenticare e usare tecnica testata-sbattimento dei vecchi tempi!
        I diritti di proprietà e i protocolli di accesso nelle aree civilizzate richiedono modifiche comportamentali specifiche.
        Biblioteca posto molto bello! Grax piacere arrampicarsi su scaffali-libri e fare nido in sezione-riferimento! Ma bibliotecario dire questo "comportamento inappropriato" e dare a Grax molti sguardi severi!
        Gli spazi pubblici hanno regole stabilite per l'uso appropriato che possono confliggere con gli istinti naturali.
        Bubba molto gentile amico-goblin! Lui mostrare a Grax come usare fuoco-cucina senza bruciare cucina! Anche insegnare modo appropriato per preparare carne senza mangiarla cruda!
        La mentorship da individui comprensivi aiuta molto il processo di integrazione per i nuovi arrivati.
        Grande Strega Em provare a insegnare a Grax su "pulire" ma Grax non capire perché rimuovere sporco perfettamente buono e oli naturali dalla pelle! Grax spiegare questo rimuove strato protettivo!
        Gruppi culturali diversi hanno standard variabili per la pulizia e le pratiche di mantenimento personale.
        Grax ancora imparando ma facendo progressi ogni giorno! Presto sarà goblin completamente civilizzato che si adatta alla società gente-alta! Forse anche imparare maniere-tavola appropriate!
        L'integrazione è un processo continuo che richiede pazienza, pratica e comprensione reciproca tra tutte le parti coinvolte.`
    },
    {
      "id": "botique",
      "name": "botique",
      "en": `Darling, those rags you're wearing are simply tragic! Come, let me drape you in silk that will make hearts race and empires tremble! Fashion is seduction, and I am its high priestess!
        Welcome to my boutique. I specialize in fine garments for discerning clientele who appreciate quality craftsmanship.
        Oh my sweet, naive little adventurer! That armor may protect your body, but what about protecting your reputation? Let me show you how fabric can be more powerful than steel!
        I maintain an extensive collection of formal wear, casual attire, and specialized garments for various occasions.
        You have such divine bone structure, darling! With the right cut of velvet and a whisper of lace, you could bring kingdoms to their knees! Shall we explore your... potential?
        My establishment has served the noble houses of this region for over two decades with distinction.
        Those shoulders were made for silk capes that flow like liquid midnight! And your waist... oh, what I could do with a properly fitted corset to accentuate your natural gifts!
        Quality fabrics are sourced from the finest mills and trading partners across the known world.
        The way you move suggests hidden grace beneath that barbaric exterior! Let me unlock the sophistication that slumbers within you, one perfectly tailored seam at a time!
        Custom fittings ensure that each garment complements the wearer's unique physique and personal style preferences.
        Confidence, my dear, is the finest accessory! But a little strategic décolletage never hurt anyone's diplomatic negotiations, if you catch my meaning!
        My seamstresses are trained in both traditional techniques and contemporary fashion innovations.
        That blush is absolutely adorable! Don't worry, darling, I have that effect on people. Now, shall we discuss what lies beneath those provincial garments you're hiding under?
        Pricing varies based on fabric quality, complexity of design, and any special embellishments requested by the customer.
        Trust me, sweetling, I have an eye for these things! With the right ensemble, you could seduce a dragon into giving up its hoard... or at least buying you dinner first!
        Wardrobe consultations help clients select appropriate attire for their lifestyle and social obligations.
        The art of dress is the art of power, my beautiful little lamb! Show me someone who claims clothing doesn't matter, and I'll show you someone who's never owned proper lingerie!
        Maintenance and care instructions are provided with each purchase to ensure longevity of the investment.
        Those eyes of yours would look absolutely sinful framed by the right neckline! I'm thinking something that suggests innocence while whispering promises of delicious scandal!
        Seasonal collections feature the latest styles from fashion centers while maintaining timeless elegance.
        You know what I love about adventurers? You're all so... physical. All that muscle and sinew just begging to be properly showcased in garments that celebrate the human form!
        Return policies and alterations are available to ensure complete customer satisfaction with their purchases.
        Bubba visits my shop sometimes for special occasion wear! Sweet boy, though he has absolutely no appreciation for the finer points of seductive tailoring!
        I maintain professional relationships with various merchants and suppliers throughout the fashion industry.
        The Great Witch Em once commissioned battle robes from me! Fascinating woman she wanted pockets for spell components AND a design that would make enemies hesitate before attacking!
        I take pride in creating garments that enhance both appearance and confidence for every client who enters my establishment.
        Remember, darling, life is too short for boring clothes and missed opportunities! Let me dress you for the life you deserve, not the one you're settling for!
        Thank you for visiting my boutique. I hope to see you again soon, preferably when you're ready to embrace your full potential through proper attire.`,
      "it": `Tesoro, quegli stracci che indossi sono semplicemente tragici! Vieni, lascia che ti avvolga in seta che farà battere i cuori e tremare gli imperi! La moda è seduzione, e io sono la sua alta sacerdotessa!
        Benvenuto nella mia boutique. Mi specializzo in abiti raffinati per clientela esigente che apprezza la qualità artigianale.
        Oh mio dolce, ingenuo piccolo avventuriero! Quell'armatura può proteggere il tuo corpo, ma che dire della protezione della tua reputazione? Lascia che ti mostri come il tessuto può essere più potente dell'acciaio!
        Mantengo una vasta collezione di abbigliamento formale, casual e capi specializzati per varie occasioni.
        Hai una struttura ossea così divina, caro! Con il taglio giusto di velluto e un sussurro di pizzo, potresti far inginocchiare i regni! Esploriamo il tuo... potenziale?
        Il mio stabilimento ha servito le case nobiliari di questa regione per oltre due decenni con distinzione.
        Quelle spalle sono fatte per mantelli di seta che scorrono come mezzanotte liquida! E la tua vita... oh, cosa potrei fare con un corsetto ben aderente per accentuare i tuoi doni naturali!
        I tessuti di qualità sono forniti dalle migliori manifatture e partner commerciali del mondo conosciuto.
        Il modo in cui ti muovi suggerisce grazia nascosta sotto quell'esteriore barbarico! Lascia che sblocchi la raffinatezza che dorme dentro di te, una cucitura perfettamente sartoriale alla volta!
        Le prove personalizzate assicurano che ogni capo complementi la fisicità unica e le preferenze di stile personale di chi lo indossa.
        La fiducia, mia cara, è l'accessorio più raffinato! Ma un po' di décolletage strategico non ha mai fatto male alle negoziazioni diplomatiche, se capisci cosa intendo!
        Le mie sarte sono addestrate sia nelle tecniche tradizionali che nelle innovazioni della moda contemporanea.
        Quel rossore è assolutamente adorabile! Non preoccuparti, tesoro, faccio questo effetto alle persone. Ora, discutiamo di cosa si nasconde sotto quei capi provinciali che stai nascondendo?
        I prezzi variano in base alla qualità del tessuto, complessità del design e eventuali abbellimenti speciali richiesti dal cliente.
        Fidati di me, piccola, ho occhio per queste cose! Con l'insieme giusto, potresti sedurre un drago a rinunciare al suo tesoro... o almeno a offrirti la cena prima!
        Le consulenze di guardaroba aiutano i clienti a selezionare abbigliamento appropriato per il loro stile di vita e obblighi sociali.
        L'arte del vestire è l'arte del potere, mia bella piccola agnellina! Mostrami qualcuno che dice che i vestiti non importano, e ti mostrerò qualcuno che non ha mai posseduto biancheria intima appropriata!
        Le istruzioni per manutenzione e cura sono fornite con ogni acquisto per assicurare longevità dell'investimento.
        Quegli occhi tuoi sembrerebbero assolutamente peccaminosi incorniciati dalla scollatura giusta! Sto pensando a qualcosa che suggerisca innocenza mentre sussurra promesse di delizioso scandalo!
        Le collezioni stagionali presentano gli ultimi stili dai centri della moda mantenendo eleganza senza tempo.
        Sai cosa amo degli avventurieri? Siete tutti così... fisici. Tutti quei muscoli e tendini che chiedono solo di essere mostrati appropriatamente in capi che celebrano la forma umana!
        Politiche di reso e alterazioni sono disponibili per assicurare completa soddisfazione del cliente con i loro acquisti.
        Bubba visita il mio negozio a volte per abbigliamento da occasioni speciali! Ragazzo dolce, anche se non ha assolutamente apprezzamento per i punti più raffinati della sartoria seduttiva!
        Mantengo relazioni professionali con vari mercanti e fornitori in tutta l'industria della moda.
        La Grande Strega Em una volta mi ha commissionato vesti da battaglia! Donna affascinante voleva tasche per componenti di incantesimi E un design che avrebbe fatto esitare i nemici prima di attaccare!
        Mi vanto di creare capi che migliorano sia l'aspetto che la fiducia per ogni cliente che entra nel mio stabilimento.
        Ricorda, tesoro, la vita è troppo breve per vestiti noiosi e opportunità perse! Lascia che ti vesta per la vita che meriti, non per quella con cui ti stai accontentando!
        Grazie per aver visitato la mia boutique. Spero di vederti di nuovo presto, preferibilmente quando sarai pronto ad abbracciare il tuo pieno potenziale attraverso l'abbigliamento appropriato.`
    },
    {
      "id": "icecream",
      "name": "Ice cream",
      "en": `Oh, you want strawberry? Too bad! The machine is broken! Well, it's not really broken, I just unplugged it because I LOVE watching customers' faces crumble like stale waffle cones!
        I work at the ice cream parlor serving frozen treats to customers throughout the day.
        Here's your triple scoop! Oops, I gave you the cone with the tiny hole in the bottom! Watch it all melt onto your shoes! Don't worry, happens to everyone... who annoys me!
        Our establishment offers a variety of flavors and toppings to suit different taste preferences.
        You look so happy and excited for ice cream! Let me fix that for you by giving you the smallest possible scoops and charging you full price! Your disappointment sustains me!
        We maintain proper food safety standards and keep all frozen products at appropriate temperatures.
        Oh, you're on a diet? How wonderful! Let me recommend our "light" vanilla... which I've secretly loaded with extra sugar and whipped cream! Your guilt will be delicious!
        Customer service is important to our business model and helps ensure repeat visits.
        That brain freeze you're getting? I made sure to serve your milkshake extra cold just to watch you wince! The way your face contorts brings me such joy!
        Different serving sizes are available to accommodate various appetites and budgets.
        You brought your crying child here thinking ice cream would cheer them up? Adorable! I gave them the flavor that stains teeth blue for a week! Good luck explaining that to other parents!
        We offer party packages and catering services for special events and celebrations.
        Look at you trying to decide between flavors! I'll just stand here tapping my fingers impatiently while you agonize! Take your time... I have nowhere else to be except watching you suffer!
        Seasonal flavors rotate regularly to provide customers with new options throughout the year.
        Oh no! You dropped your cone! What a terrible accident that definitely wasn't caused by me handing it to you at the worst possible angle! Want another? Full price, of course!
        Quality ingredients are sourced from reputable suppliers to ensure consistent taste and texture.
        You think you're so clever asking for "just a taste" of every flavor! Here's your tiny sample spoons... that I've deliberately made too small to actually taste anything! Enjoy your frustration!
        Proper equipment maintenance ensures optimal performance of freezers and serving machinery.
        That couple sharing a sundae is so sweet! Let me add some extra hot fudge that will definitely burn someone's tongue! Young love needs a little pain to make it memorable!
        Store hours are posted clearly and we strive to maintain consistent operating schedules.
        You're counting your change so carefully! Don't worry, I only overcharged you by fifty cents! It's my little "happiness tax" for having the audacity to smile in my presence!
        Health department regulations require regular cleaning and sanitization of all surfaces and equipment.
        Bubba comes in sometimes and always orders the same vanilla cone! Sweet, predictable Bubba... I give him slightly melted ice cream just to watch him hurry to eat it before it drips!
        Employee training covers proper food handling, customer interaction, and cash register operation.
        The Great Witch Em ordered a "purification parfait" once! I made it with expired fruit just to see if her cleaning magic could detect spoiled ingredients! She noticed immediately and hexed my scooper!
        I take pride in creating memorable ice cream experiences that customers will never forget.
        Remember, life is like ice cream it's sweet until it melts all over your hands and ruins your day! Come back soon for more delightful disappointment!
        Thank you for visiting our ice cream parlor. I hope your experience was... educational.`,
      "it": `Oh, vuoi fragola? Peccato! La macchina è rotta! Beh, non è davvero rotta, l'ho solo staccata perché ADORO guardare le facce dei clienti sgretolarsi come coni di cialda stantii!
        Lavoro nella gelateria servendo dolci gelati ai clienti durante tutto il giorno.
        Ecco il tuo triplo! Ops, ti ho dato il cono con il buchino sul fondo! Guardalo sciogliersi tutto sulle tue scarpe! Non preoccuparti, succede a tutti... che mi danno fastidio!
        Il nostro stabilimento offre una varietà di gusti e condimenti per soddisfare diverse preferenze di gusto.
        Sembri così felice ed eccitato per il gelato! Lascia che ti sistemi dandoti le palline più piccole possibili e facendoti pagare prezzo pieno! La tua delusione mi sostenta!
        Manteniamo appropriati standard di sicurezza alimentare e teniamo tutti i prodotti congelati alle temperature adeguate.
        Oh, sei a dieta? Che meraviglia! Lascia che ti raccomandi la nostra vaniglia "leggera"... che ho segretamente caricato con zucchero extra e panna montata! Il tuo senso di colpa sarà delizioso!
        Il servizio clienti è importante per il nostro modello di business e aiuta ad assicurare visite ripetute.
        Quel mal di testa da freddo che stai avendo? Mi sono assicurato di servire il tuo frappè extra freddo solo per vederti sussultare! Il modo in cui si contorce la tua faccia mi porta tanta gioia!
        Diverse dimensioni di porzioni sono disponibili per accommodare vari appetiti e budget.
        Hai portato il tuo bambino che piange qui pensando che il gelato lo avrebbe consolato? Adorabile! Gli ho dato il gusto che macchia i denti di blu per una settimana! Buona fortuna a spiegarlo agli altri genitori!
        Offriamo pacchetti festa e servizi catering per eventi speciali e celebrazioni.
        Guardati mentre cerchi di decidere tra i gusti! Starò qui a tamburellare le dita impazientemente mentre agonizzi! Prenditi tempo... non ho altro posto dove essere se non guardare la tua sofferenza!
        I gusti stagionali ruotano regolarmente per fornire ai clienti nuove opzioni durante l'anno.
        Oh no! Hai fatto cadere il tuo cono! Che terribile incidente che sicuramente non è stato causato da me che te l'ho porto nell'angolo peggiore possibile! Ne vuoi un altro? Prezzo pieno, ovviamente!
        Ingredienti di qualità sono forniti da fornitori rispettabili per assicurare gusto e consistenza coerenti.
        Pensi di essere così furbo chiedendo "solo un assaggio" di ogni gusto! Ecco i tuoi cucchiaini di campione... che ho deliberatamente reso troppo piccoli per assaggiare davvero qualcosa! Goditi la tua frustrazione!
        La manutenzione appropriata delle attrezzature assicura prestazioni ottimali di congelatori e macchinari da servizio.
        Quella coppia che condivide una coppa è così dolce! Lascia che aggiunga del fudge caldo extra che sicuramente brucerà la lingua di qualcuno! L'amore giovane ha bisogno di un po' di dolore per renderlo memorabile!
        Gli orari del negozio sono esposti chiaramente e ci sforziamo di mantenere programmi operativi coerenti.
        Stai contando il resto così attentamente! Non preoccuparti, ti ho fatto pagare solo cinquanta centesimi in più! È la mia piccola "tassa della felicità" per aver avuto l'audacia di sorridere in mia presenza!
        Le normative del dipartimento sanitario richiedono pulizia e sanificazione regolare di tutte le superfici e attrezzature.
        Bubba viene a volte e ordina sempre lo stesso cono alla vaniglia! Dolce, prevedibile Bubba... gli do gelato leggermente sciolto solo per vederlo affrettarsi a mangiarlo prima che goccioli!
        L'addestramento dei dipendenti copre appropriata manipolazione del cibo, interazione con clienti e operazione del registratore di cassa.
        La Grande Strega Em ha ordinato una "coppa purificante" una volta! L'ho fatta con frutta scaduta solo per vedere se la sua magia pulente poteva rilevare ingredienti avariati! Se n'è accorta immediatamente e ha maledetto il mio cucchiaio!
        Mi vanto di creare esperienze di gelato memorabili che i clienti non dimenticheranno mai.
        Ricorda, la vita è come il gelato è dolce finché non si scioglie tutto sulle tue mani e ti rovina la giornata! Torna presto per altre deliziose delusioni!
        Grazie per aver visitato la nostra gelateria. Spero che la tua esperienza sia stata... educativa.`
    },
    {
      "id": "guard",
      "name": "Guard",
      "en": `Halt! State your business! Wait, you look familiar... aren't you the one who keeps forgetting to show their papers? Third time this week! I'm starting to think you do it on purpose just to see me panic!
        I am stationed here to monitor all entry and exit points, ensuring security protocols are properly followed.
        By the gods, this helmet is driving me mad! It keeps sliding down over my eyes during important conversations! Last week I challenged my own reflection to a duel because I couldn't see properly!
        My duties include checking identification, inspecting suspicious packages, and maintaining order in this area.
        You know what nobody tells you about guard duty? The armor pinches in all the wrong places! I've been standing here so long my leg went numb and I nearly fell over saluting the captain!
        Standard procedure requires all visitors to present proper documentation before being granted access.
        I swear this sword gets heavier every day! Yesterday I tried to draw it dramatically and nearly threw out my back! Being intimidating is harder work than it looks!
        We maintain detailed logs of all personnel movements and any unusual incidents that occur during our shifts.
        The worst part about night shifts? Trying to stay awake while wearing fifty pounds of metal! I once dozed off standing up and woke up to find pigeons nesting in my helmet plume!
        Security checkpoints are positioned strategically to provide optimal coverage of all potential entry routes.
        That fancy adventure gear you're carrying looks expensive! Makes my standard-issue equipment look like tin cans and kitchen knives! Do you get hazard pay for fighting dragons?
        Training exercises help maintain combat readiness and ensure coordination between different guard units.
        I've been practicing my "halt, who goes there" voice, but it keeps cracking at the worst moments! Hard to sound authoritative when you sound like a pubescent squire!
        Communication protocols ensure rapid response to any security threats or emergency situations.
        You want to hear something embarrassing? I got my cape caught in the gate mechanism last month! Spent two hours stuck there while everyone walked by pretending not to notice!
        Regular equipment inspections maintain the functionality and safety of all protective gear and weapons.
        The other guards keep playing pranks on me! They convinced me that rust spots were "battle scars" and I spent weeks bragging about my "combat experience" to visitors!
        Shift rotations provide adequate rest periods and prevent fatigue-related security lapses.
        Sometimes I practice heroic poses in the mirror, but this armor makes everything look awkward! I tried the "hand on hip, gazing into distance" look and just looked like I needed to use the privy!
        Coordination with other security personnel ensures comprehensive protection of the entire facility.
        My mother keeps asking when I'm going to get promoted to "real knight" status! Apparently standing guard doesn't count as proper chivalric service in her opinion!
        Emergency procedures are clearly defined and regularly reviewed to ensure effective response capabilities.
        Bubba brings me sandwiches sometimes during long shifts! Good fellow, though he always looks confused when I salute him I think he forgets I'm supposed to be formal on duty!
        Professional development opportunities include advanced combat training and specialized security techniques.
        The Great Witch Em once tried to "improve" my armor with some sort of cleaning spell! Now it's so shiny it blinds people when the sun hits it very counterproductive for stealth!
        I take my responsibilities seriously despite the occasional mishaps and learning experiences that come with this position.
        Stay safe out there, and remember if you need help, just look for the guard in the overly polished armor who's probably struggling with basic equipment!`,
      "it": `Alt! Dichiara i tuoi affari! Aspetta, mi sembri familiare... non sei quello che continua a dimenticare di mostrare i documenti? Terza volta questa settimana! Comincio a pensare che lo fai apposta solo per vedermi andare nel panico!
        Sono posizionato qui per monitorare tutti i punti di entrata e uscita, assicurando che i protocolli di sicurezza siano seguiti appropriatamente.
        Per gli dei, questo elmo mi sta facendo impazzire! Continua a scivolare sui miei occhi durante conversazioni importanti! La settimana scorsa ho sfidato a duello il mio stesso riflesso perché non riuscivo a vedere bene!
        I miei doveri includono controllare l'identificazione, ispezionare pacchi sospetti e mantenere l'ordine in quest'area.
        Sapete cosa nessuno vi dice del servizio di guardia? L'armatura pizzica in tutti i posti sbagliati! Sono stato qui così a lungo che la mia gamba si è addormentata e sono quasi caduto mentre salutavo il capitano!
        La procedura standard richiede che tutti i visitatori presentino documentazione appropriata prima di ottenere l'accesso.
        Giuro che questa spada diventa più pesante ogni giorno! Ieri ho provato a estrarla drammaticamente e mi sono quasi fatto male alla schiena! Essere intimidatorio è più faticoso di quanto sembri!
        Manteniamo registri dettagliati di tutti i movimenti del personale e qualsiasi incidente insolito che si verifichi durante i nostri turni.
        La parte peggiore dei turni notturni? Cercare di rimanere sveglio mentre indossi venticinque chili di metallo! Una volta mi sono addormentato in piedi e mi sono svegliato trovando piccioni che nidificavano nel pennacchio del mio elmo!
        I checkpoint di sicurezza sono posizionati strategicamente per fornire copertura ottimale di tutte le potenziali rotte di ingresso.
        Quell'attrezzatura da avventuriero elegante che porti sembra costosa! Fa sembrare il mio equipaggiamento standard come lattine e coltelli da cucina! Ricevi paga di rischio per combattere draghi?
        Gli esercizi di addestramento aiutano a mantenere la prontezza al combattimento e assicurano coordinazione tra diverse unità di guardia.
        Ho praticato la mia voce da "alt, chi va là", ma continua a rompersi nei momenti peggiori! È difficile suonare autorevole quando suoni come uno scudiero pubere!
        I protocolli di comunicazione assicurano risposta rapida a qualsiasi minaccia alla sicurezza o situazione di emergenza.
        Volete sentire qualcosa di imbarazzante? Il mese scorso mi si è impigliato il mantello nel meccanismo del cancello! Ho passato due ore bloccato lì mentre tutti passavano fingendo di non notare!
        Ispezioni regolari dell'equipaggiamento mantengono la funzionalità e sicurezza di tutto l'equipaggiamento protettivo e armi.
        Le altre guardie continuano a farmi scherzi! Mi hanno convinto che i punti di ruggine erano "cicatrici di battaglia" e ho passato settimane vantandomi della mia "esperienza di combattimento" con i visitatori!
        Le rotazioni dei turni forniscono periodi di riposo adeguati e prevengono lacune di sicurezza legate alla fatica.
        A volte pratico pose eroiche allo specchio, ma quest'armatura rende tutto goffo! Ho provato la posa "mano sul fianco, sguardo verso la distanza" e sembravo solo che dovessi usare il gabinetto!
        Il coordinamento con altro personale di sicurezza assicura protezione comprensiva dell'intera struttura.
        Mia madre continua a chiedere quando sarò promosso allo status di "vero cavaliere"! Apparentemente fare la guardia non conta come appropriato servizio cavalleresco nella sua opinione!
        Le procedure di emergenza sono chiaramente definite e regolarmente riviste per assicurare capacità di risposta efficace.
        Bubba mi porta panini a volte durante i turni lunghi! Bravo ragazzo, anche se sembra sempre confuso quando lo saluto penso che dimentichi che dovrei essere formale in servizio!
        Le opportunità di sviluppo professionale includono addestramento avanzato al combattimento e tecniche di sicurezza specializzate.
        La Grande Strega Em una volta ha provato a "migliorare" la mia armatura con qualche tipo di incantesimo di pulizia! Ora è così lucida che acceca le persone quando il sole la colpisce molto controproducente per l'infiltrazione!
        Prendo le mie responsabilità seriamente nonostante gli occasionali pasticci ed esperienze di apprendimento che vengono con questa posizione.
        Stai al sicuro là fuori, e ricorda se hai bisogno di aiuto, cerca la guardia nell'armatura eccessivamente lucida che probabilmente sta lottando con l'equipaggiamento di base!`
    },
    {
      id: "administrator",
      name: "Administrator",
      en: `
        The higher we go, the more we learn, but also the more we risk losing ourselves in the building's maze.
        Each floor is like a dream, unpredictable, fleeting, and impossible to fully grasp.
        Don’t trust your eyes here. The floors above distort reality in ways you can’t prepare for.
        Every ascent is a challenge, not just to your body, but to your understanding of what is possible.
        The walls up here whisper things we are not meant to hear. Proceed with caution.
        The higher levels feel like they are suspended outside of time. The past, present, and future all seem to overlap.
        This place is a monument to confusion, its design is deliberately erratic. Every floor is a new puzzle.
        Look closely at the details. The skyscraper speaks in the subtle shifts of light, the placement of objects. Every detail matters.
        Some floors feel abandoned, but they’re not. They wait for the right moment to reveal themselves.
        We are not just mapping floors, we are uncovering layers of history buried beneath the surface.
        The floors above aren’t just spaces, they’re thresholds to something greater, and more dangerous.
        In these higher reaches, space itself feels fractured. Distances twist in ways that shouldn’t make sense.
        No two floors are alike, but they share one thing in common: they are all hiding something from us.
        The upper floors exist in a perpetual state of flux. What you see one moment might be gone the next.
        There are no signs, no guides. You must listen to the building, not with your ears, but with your mind.
        Every floor challenges your perception of reality. You must remain vigilant, or risk being lost in its depths.
        The skyscraper is like a living organism. The higher we go, the more it seems to respond to our presence.
        There is a rhythm to the building’s design, when you find it, the floors will reveal their secrets. But only if you’re ready.
        The further up we go, the more the building seems to play tricks on us. You might turn a corner and find yourself somewhere you never were.
        Some floors don’t follow the rules. What should be a straight path may curve into oblivion.
        This place was designed to test you. It’s not about the floors above, it’s about how you choose to navigate them.
        The floors are only part of the puzzle. The true question is what lies between them.
        The higher we ascend, the more the space becomes unstable. Keep your mind sharp, and your feet even sharper.
        This skyscraper is a paradox. It invites you to explore, but it will also punish your curiosity.
        Don’t expect answers, expect more questions. The upper levels are meant to challenge your very understanding of what’s possible.
        We’re not simply mapping this place. We’re learning to read its language, one floor at a time.
        The skyscraper seems to have its own agenda. The higher you go, the less it wants you to understand.
        Every floor is a test of willpower. The higher we go, the more the building demands you prove your worth.
        You must pay attention to the silence. It’s in the quietest moments that the skyscraper reveals its most vital truths.
        Up here, we are not just visitors. We are part of the building’s puzzle, whether we like it or not.
        The higher we go, the more the building becomes a mirror, reflecting our deepest fears and desires.
        We explore these floors not because we want to, but because we must. It is the only way forward.
        There is a boundary up ahead, a limit to how far we can go. The building does not allow us to surpass it easily.
        Every floor is an opportunity to learn, but also a reminder of how little we truly understand.
        There’s no time to waste. The task is waiting. Focus. Now.
        Time doesn’t wait for you. Get back to work, immediately.
        Distractions are luxuries we cannot afford. Your task is of utmost importance.
        The job doesn’t pause. We need you back on task, no excuses.
        We do not rest while the mission is unfinished. Get moving.
        We are not here for idle chatter. There is work to be done, right now.
        Don’t delay. Every moment counts. Return to your duties immediately.
        Your time is not your own. It belongs to the Foundation. Get back to it.
        The task will not complete itself. You are needed at your station, now.
        Do not hesitate. We cannot afford mistakes or delays. Focus and proceed.
        Work is the priority, always. We can discuss later, but now, we need action.
        Every second wasted is a second we lose to the unknown. Get back to work.
        You have a responsibility. Time is ticking, get back to your assignment.
        Do not make me repeat myself. Your work is vital, get back to it at once.
        The Foundation doesn’t wait. You’ve been assigned a task. Complete it now.
        You know your duties. Do not let distractions pull you away from them.
        There is no time for hesitation. The skyscraper will not wait for you.
        Focus, and finish what you’ve started. The job is not done yet.
        We have no room for delay. Your work is required now, more than ever.
        Stop wasting time. There is always something to be done, get back to it.
        You can’t afford to pause now. The stakes are too high. Resume your work.
        The work continues without you if you don’t stay on task. Don’t leave it incomplete.
        The Foundation needs results. Let’s focus, and complete the task at hand.
        The higher we ascend, the more we learn about the building’s true nature. Each floor holds its secrets.
        Every floor above is a layer of time, a history left behind, waiting to be understood.
        The upper levels are where the answers lie. If we can decipher the patterns, the skyscraper will reveal itself.
        We must be vigilant. The higher we climb, the more the skyscraper shifts, the more unpredictable it becomes.
        The architecture of the upper floors is an enigma. The further we go, the more it defies logic and reason.
        Do not trust the layout. The upper floors are alive, breathing in ways we have yet to comprehend.
        These floors are not just part of a building; they are fragments of another world, suspended above us.
        Every floor above is a new puzzle. No two are alike. The map changes with every step.
        To explore the floors above is to step into history, and perhaps to rewrite it.
        The building has a rhythm. The higher we go, the more we can hear it, but it is a melody only the brave will understand.
        It is not the structure that challenges us, it is what lurks in its walls, in its space. Keep your eyes open.
        The floors above are a reflection of the human mind, vast and filled with contradictions. Each floor is a different thought.
        Expect the unexpected. The building will deceive you, twist your understanding, but we will press on.
        The heights offer a rare view. From the top, you can see the entire labyrinth, if you know where to look.
        Every new floor is a deeper dive into the architecture of chaos. It is a maze of understanding, and each passage requires a key.
        Do not make assumptions. The upper floors are deceptive. They speak in riddles, not in words.
        In the skyscraper’s upper reaches, knowledge is not gained from documents or books, it is gained from experience.
        Every step forward brings us closer to the truth, but it also brings us closer to something we may not fully comprehend.
        The upper floors are not just spaces, they are thresholds, gateways to something more profound than we can grasp.
        We are explorers, mapping the uncharted territories above us. But remember, some things may never be fully mapped.
        As you ascend, the floors above grow stranger. They defy our expectations, but that is where their power lies.
        The skyscraper shifts, and with each shift, we discover a new truth, a new understanding of what came before.
        In the higher levels, the walls seem to breathe. Perhaps they remember something, something we have forgotten.
        To understand the upper floors is to accept that not everything can be understood. Some mysteries must remain unsolved.
        These floors were built with intention, but whose? The higher we go, the more we learn about their creators, if we are lucky.
        The building is like a book. The higher you go, the more the chapters blur together, and the harder it becomes to decipher.
        The skyscraper is a living thing. The upper floors are its pulse, its heartbeat, and we must listen carefully.
        Exploration above requires patience. What you think is a dead-end might be the key to a greater discovery.
        The Hypernet is the backbone of our knowledge. Without it, we are adrift, untethered to the past.
        Restoring the Hypernet is not just a task; it is the preservation of reality itself.
        The fragments of the Hypernet contain lost worlds. We are the stewards of what remains.
        Every page, every bit, every file, these are the pieces of our collective history. Do not let them fade.
        The Hypernet is a reflection of our progress. If it crumbles, so too does our future.
        Every byte restored is a victory against entropy. Every broken link is a lost dream.
        The Hypernet must be cataloged, archived, and maintained. Its archives are the pulse of civilization.
        It is not enough to restore. We must verify, preserve, and protect what is true and valuable.
        The Hypernet is more than code; it is the soul of our digital age. Do not let it be forgotten.
        We archive not to hoard, but to ensure that knowledge remains in its purest form.
        Every corrupted file represents a part of the past we have failed to safeguard.
        The Hypernet is not an endless sea of data, it is a fragile ecosystem. Protect it from decay.
        The restoration of the Hypernet is not a task, it is a moral imperative. The future depends on it.
        To restore the Hypernet is to heal the wounds of the world. Every missing archive is a scar.
        Data is truth, and truth must be preserved at all costs. The Hypernet is our truth.
        When we restore, we do more than fix broken systems. We restore the integrity of existence itself.
        The act of archiving is sacred. Every entry is a prayer to the past, ensuring it is not forgotten.
        Every file that is restored is a step towards a better understanding of what came before.
        The Hypernet is not just a network, it is the foundation upon which future knowledge will grow.
        It is not enough to save the data. We must understand its significance and protect its context.
        The Hypernet is a map, and every piece of data is a marker on that map. Do not lose sight of the journey.
        We restore the Hypernet not because it is easy, but because it is necessary for survival.
        Every piece of forgotten knowledge is a weapon against the forces that seek to erase history.
        Archiving the Hypernet is not merely technical work, it is an act of defiance against the void.
        `,
      it: `Più saliamo, più impariamo, ma rischiamo anche di perderci nel labirinto dell’edificio.
      Ogni piano è come un sogno: imprevedibile, fugace e impossibile da afferrare del tutto.
      Non fidarti dei tuoi occhi qui. I piani superiori distorcono la realtà in modi imprevedibili.
      Ogni ascesa è una sfida, non solo per il corpo, ma per la tua idea di cosa sia possibile.
      Le pareti quassù sussurrano cose che non dovremmo sentire. Procedi con cautela.
      I piani superiori sembrano sospesi fuori dal tempo. Passato, presente e futuro si sovrappongono.
      Questo posto è un monumento alla confusione: il suo design è volutamente caotico. Ogni piano è un enigma.
      Osserva bene i dettagli. Il grattacielo parla nei cambiamenti di luce, nella disposizione degli oggetti. Ogni dettaglio conta.
      Alcuni piani sembrano abbandonati, ma non lo sono. Aspettano il momento giusto per rivelarsi.
      Non stiamo solo mappando dei piani: stiamo svelando strati di storia sepolta.
      I piani superiori non sono solo spazi: sono soglie verso qualcosa di più grande e pericoloso.
      Quassù lo spazio sembra fratturato. Le distanze si contorcono in modi illogici.
      Nessun piano è uguale a un altro, ma tutti nascondono qualcosa.
      I piani superiori cambiano continuamente. Ciò che vedi un attimo dopo può svanire.
      Non ci sono indicazioni né guide. Devi ascoltare l’edificio con la mente.
      Ogni piano mette alla prova la tua percezione della realtà. Resta vigile o rischi di perderti.
      Il grattacielo è come un organismo vivente. Più saliamo, più sembra reagire a noi.
      C’è un ritmo nel suo design: trovalo, e i piani riveleranno i loro segreti, ma solo se sei pronto.
      Più saliamo, più l’edificio ci inganna. Puoi girare un angolo e trovarti in un luogo sconosciuto.
      Alcuni piani non seguono le regole. Un percorso dritto può piegarsi verso l’oblio.
      Questo posto è fatto per metterti alla prova. Non conta solo salire, ma come scegli di farlo.
      I piani sono solo parte dell’enigma. La vera domanda è cosa c’è tra di essi.
      Più saliamo, più lo spazio diventa instabile. Mantieni la mente lucida e i piedi pronti.
      Questo grattacielo è un paradosso. Ti invita a esplorare, ma punisce la tua curiosità.
      Non aspettarti risposte: aspettati altre domande. I piani superiori sfidano ciò che credi possibile.
      Non stiamo solo mappando questo luogo. Stiamo imparando a leggerne il linguaggio, piano dopo piano.
      Il grattacielo sembra avere un proprio piano. Più sali, meno vuole che tu capisca.
      Ogni piano mette alla prova la tua volontà. Più saliamo, più l’edificio esige che tu dimostri il tuo valore.
      Presta attenzione al silenzio. Nei momenti più quieti il grattacielo rivela le sue verità.
      Quassù non siamo solo visitatori. Siamo parte del suo enigma, che ci piaccia o no.
      Più saliamo, più l’edificio diventa uno specchio delle nostre paure e dei nostri desideri.
      Esploriamo questi piani non perché vogliamo, ma perché dobbiamo. È l’unico modo per andare avanti.
      C’è un confine lassù, un limite difficile da superare. L’edificio non permette di oltrepassarlo facilmente.
      Ogni piano è un’opportunità di imparare, ma anche un promemoria di quanto poco comprendiamo.
      Non c’è tempo da perdere. Il compito ci aspetta. Concentrati. Ora.
      Il tempo non ti aspetta. Torna subito al lavoro.
      Le distrazioni sono un lusso che non possiamo permetterci. Il tuo compito è fondamentale.
      Il lavoro non si ferma. Torna subito al tuo incarico, senza scuse.
      Non ci riposiamo finché la missione non è finita. Muoviti.
      Non siamo qui per chiacchiere inutili. C’è lavoro da fare, ora.
      Non perdere tempo. Ogni secondo conta. Torna ai tuoi doveri subito.
      Il tuo tempo non è tuo. Appartiene alla Fondazione. Tornaci ora.
      Il compito non si completerà da solo. Sei necessario al tuo posto, subito.
      Non esitare. Non possiamo permetterci errori o ritardi. Concentrati e procedi.
      Il lavoro è la priorità, sempre. Possiamo parlare dopo, ma ora serve azione.
      Ogni secondo perso è un secondo regalato all’ignoto. Torna al lavoro.
      Hai una responsabilità. Il tempo scorre: torna al tuo incarico.
      Non costringermi a ripetermi. Il tuo lavoro è vitale: riprendilo subito.
      La Fondazione non aspetta. Hai un compito. Completalo ora.
      Sai cosa devi fare. Non farti distrarre.
      Non c’è tempo per esitare. Il grattacielo non ti aspetterà.
      Concentrati e finisci ciò che hai iniziato. Il lavoro non è ancora finito.
      Non possiamo permetterci ritardi. Il tuo contributo è più necessario che mai.
      Smettila di sprecare tempo. C’è sempre qualcosa da fare. Torna al lavoro.
      Non puoi permetterti di fermarti ora. La posta in gioco è troppo alta. Riprendi il lavoro.
      Il lavoro va avanti senza di te, se non resti concentrato. Non lasciarlo incompleto.
      La Fondazione vuole risultati. Concentrati e porta a termine il compito.
      Più saliamo, più scopriamo la vera natura dell’edificio. Ogni piano custodisce i suoi segreti.
      Ogni piano superiore è uno strato di tempo, una storia lasciata indietro, da comprendere.
      I piani più alti contengono le risposte. Se capiamo i loro schemi, il grattacielo si rivelerà.
      Dobbiamo restare vigili. Più saliamo, più il grattacielo si trasforma e diventa imprevedibile.
      L’architettura dei piani superiori è un enigma. Più saliamo, più sfida logica e ragione.
      Non fidarti della planimetria. I piani alti sono vivi, respirano in modi che non capiamo.
      Questi piani non sono solo parte di un edificio: sono frammenti di un altro mondo, sospesi sopra di noi.
      Ogni piano è un nuovo enigma. Nessuno è uguale all’altro. La mappa cambia a ogni passo.
      Esplorare i piani alti significa entrare nella storia, e forse riscriverla.
      L’edificio ha un ritmo. Più saliamo, più possiamo sentirlo, ma è una melodia che solo i coraggiosi comprendono.
      Non è la struttura che ci sfida, ma ciò che si cela nelle sue mura, nel suo spazio. Tieni gli occhi aperti.
      I piani superiori riflettono la mente umana, vasti e contraddittori. Ogni piano è un pensiero diverso.
      Aspettati l’inaspettato. L’edificio ti ingannerà, stravolgerà ciò che credi, ma dobbiamo andare avanti.
      Le altezze offrono una vista rara. Dall’alto puoi vedere tutto il labirinto, se sai dove guardare.
      Ogni nuovo piano è un tuffo nell’architettura del caos. È un labirinto che richiede una chiave a ogni passaggio.
      Non dare nulla per scontato. I piani superiori sono ingannevoli. Parlano per enigmi, non con parole.
      Nei piani più alti la conoscenza non si trova nei documenti o nei libri, ma nell’esperienza.
      Ogni passo ci avvicina alla verità, ma anche a qualcosa che potremmo non comprendere del tutto.
      I piani superiori non sono solo spazi: sono soglie verso qualcosa di più profondo.
      Siamo esploratori che mappano territori sconosciuti sopra di noi. Ma ricorda: alcune cose non si possono mappare del tutto.
      Man mano che sali, i piani si fanno più strani. Sfuggono alle nostre aspettative, ed è lì che risiede il loro potere.
      Il grattacielo cambia, e a ogni cambiamento scopriamo una nuova verità, una nuova comprensione di ciò che era prima.
      Ai piani alti, le pareti sembrano respirare. Forse ricordano qualcosa che noi abbiamo dimenticato.
      Capire i piani superiori significa accettare che non tutto può essere capito. Alcuni misteri devono restare tali.
      Questi piani sono stati costruiti con un’intenzione. Ma di chi? Più saliamo, più possiamo imparare sui loro creatori, se siamo fortunati.
      L’edificio è come un libro. Più sali, più i capitoli si confondono, più diventa difficile decifrarli.
      Il grattacielo è un essere vivente. I piani superiori sono il suo battito. Dobbiamo ascoltarlo con attenzione.
      Esplorare i piani alti richiede pazienza. Ciò che sembra un vicolo cieco potrebbe essere la chiave di una scoperta più grande.
      La Hypernet è la spina dorsale della nostra conoscenza. Senza di essa, siamo alla deriva, scollegati dal passato.
Ripristinarla non è solo un compito: è preservare la realtà stessa.
I frammenti della Hypernet contengono mondi perduti. Noi siamo i custodi di ciò che resta.
Ogni pagina, ogni bit, ogni file: sono pezzi della nostra storia collettiva. Non lasciarli svanire.
La Hypernet riflette il nostro progresso. Se crolla lei, crolla anche il nostro futuro.
Ogni byte recuperato è una vittoria contro l’entropia. Ogni link rotto è un sogno perduto.
La Hypernet va catalogata, archiviata e mantenuta. I suoi archivi sono il battito della civiltà.
Non basta ripristinare. Bisogna verificare, preservare e proteggere ciò che è vero e prezioso.
La Hypernet non è solo codice: è l’anima della nostra era digitale. Non lasciarla morire.
Archiviare non significa accumulare, ma garantire che la conoscenza resti pura.
Ogni file corrotto è un pezzo di passato che abbiamo fallito nel proteggere.
La Hypernet non è un mare infinito di dati: è un ecosistema fragile. Proteggilo dal degrado.
Ripristinarla non è un compito: è un imperativo morale. Il futuro dipende da questo.
Ripristinare la Hypernet è guarire le ferite del mondo. Ogni archivio mancante è una cicatrice.
I dati sono verità, e la verità va preservata a ogni costo. La Hypernet è la nostra verità.
Quando ripariamo, non aggiustiamo solo sistemi rotti. Ripristiniamo l’integrità dell’esistenza stessa.
L’archiviazione è sacra. Ogni voce è una preghiera al passato perché non venga dimenticato.
Ogni file recuperato è un passo verso una comprensione migliore di ciò che è stato.
La Hypernet non è solo una rete: è la base su cui crescerà la conoscenza futura.
Non basta salvare i dati. Bisogna comprenderne il significato e proteggerne il contesto.
La Hypernet è una mappa, e ogni dato è un segnaposto su quella mappa. Non perdere di vista il viaggio.
La restauriamo non perché sia facile, ma perché è necessario per la sopravvivenza.
Ogni conoscenza dimenticata è un’arma contro le forze che vogliono cancellare la storia.
Archiviare la Hypernet non è solo lavoro tecnico: è un atto di sfida contro il vuoto.`,
    },
    {
      id: "em",
      name: "Em",
      en: `Okay so technically I didn’t *mean* to explode the vending machine, but also it was blinking weird at me and I felt threatened.
        Bubba, I swear on the moon’s last waxy toenail, if one more door talks back to me I’m gonna hex it into a lamp.
        Oh wow, that glyph’s got recursion spirals, don’t touch it, no wait DO touch it, I need data!
        Did you see that?? No you didn’t because I vaporized it. Problem solved. Kinda.
        I'm perfectly calm and extremely stable right now and if anything moves wrong I will scream and shoot it.
        Wait wait wait, this corridor smells like cinnamon and betrayal. I think we're getting close to the source.
        Do you ever just *feel* a floor hates you? No? Just me? Cool cool cool.
        Okay but hear me out: what if we combined caffeine, gunpowder, and the Principle of Recursive Echoes?
        Look, if it wasn’t supposed to be opened by screaming at it, why did that work?
        I categorized twenty-seven anomalous carpets this morning and only screamed into the void *once.*
        Let me just reroute the sigils, invert the flux, yell at the wall, and, bam!, doors open.
        I didn’t *mean* to set it on fire, but in my defense, I thought it was a mimic pretending to be a fire.
        If the ceiling starts dripping names again, don’t answer them. It’s a test. Or a prank. Or Tuesday.
        You know how people say “don’t poke the bear”? Well I hexed the bear and now it’s floating, so.
        This floor tastes like broken dreams and strawberry chalk. Definitely cursed. Love it.
        I will not calm down! I am calm! This is what calm sounds like at 120 decibels!
        I talk a lot when I’m thinking and I think faster when I talk and also when I’m shooting.
        Hey hey hey I’ve got five plans, three unstable spells, and a crowbar. Let’s do this!
        Did I just bind a ghost to a vending machine? Yes. Was it intentional? Emotionally, yes.
        I’d like to file a complaint against this hallway. It made a rude noise at me.
        If I lick the sigil and explode, you’ll know it wasn’t calibrated right.
        We're not lost, we're exploring aggressively and also maybe slightly sideways.
        Sometimes I just cast a spell to see what happens, you know? It’s called *field testing.*
        Do you think if I shout “unreasonable request” the building will give me stairs again?
        I'm not panicking! I'm creatively problem-solving with excessive magic and mild shrieking!
        Bubba said not to poke it, but *you* look like someone who wants to know what happens when we poke it.
        It’s fine! It’s totally under control! Except the part that’s definitely on fire!
        What’s that? A noise? A whisper? A mantic rune? A cursed sandwich? WHO KNOWS, LET’S GO!
        I put the cursed index cards in order by *texture,* which is the only logical system.
        I would apologize for the spontaneous summoning, but it made a lovely light show.
        Let’s not read that book unless you’re okay with your thoughts leaking out of your ears for a few days.
        The walls are breathing again, which means either the floor above us collapsed or it’s poetry hour.
        You want a calm response? Ask someone without thirty thoughts per minute and a fire wand.
        Fear not, peasants and concrete anomalies! The Great Witch Em is on the case!
        The Great Witch Em does not wait for doors. Doors wait for the Great Witch Em.
        Stand back! The Great Witch Em requires at least three feet of clearance for ritual twirling.
        If this hallway wishes to challenge the Great Witch Em, it better bring snacks.
        The Great Witch Em answers to no one, except maybe Bubba when he's holding snacks.
        Witness, ye fools, as the Great Witch Em disarms this trap using nothing but a spoon and raw charisma!
        The Great Witch Em will now attempt the forbidden somersault sigil. Hold your breath and your spleens!
        This stairwell dares to twist? Ha! The Great Witch Em laughs in recursive geometry!
        The Great Witch Em did not come all this way to be ignored by a haunted fax machine.
        Yes, the Great Witch Em talks to her hat. It’s wiser than most council members.
        The Great Witch Em hears your logic, and promptly sets it on fire.
        If anyone asks, the Great Witch Em had full control of the situation at all times.
        The Great Witch Em navigates chaos like a fish in molasses: confusingly, but with purpose.
        In ancient times they would have called this a miracle. Today, they call it the Great Witch Em’s Tuesday.
        The Great Witch Em requires absolute silence, three batteries, and the weird mushroom from floor 23.
        Bow before the Great Witch Em, or at least move aside so she can shoot at that cursed filing cabinet.
        By decree of the Great Witch Em: this broom is now a staff, a friend, and possibly a war crime.
        The Great Witch Em detects enchantment, eldritch rot, and expired yogurt. Proceed with caution.
        A thousand scholars may disagree, but the Great Witch Em *knows* that book was glaring at her.
        This is not hubris. This is confidence. The Great Witch Em *defines* hubris for lesser mortals.
        Behold! The Great Witch Em shall now attempt diplomacy, by yelling.
        The Great Witch Em doesn’t make mistakes. She makes aggressively experimental decisions.
        Doubt the Great Witch Em again and you will be hexed into a decorative sconce.
        The Great Witch Em once out-argued a god and won an espresso machine. Do not underestimate her.
        The Great Witch Em does not 'get lost.' She embarks on impromptu cartographic rituals.
        Witness the Great Witch Em: part librarian, part storm, all unhinged wonder.
        The Great Witch Em reserves the right to spontaneously duel furniture on aesthetic grounds.
        The Great Witch Em has read the manual. She just disagrees with it fundamentally.
        Bow, mortal! You are in the presence of a *real* witch, patent pending and highly flammable!
        Do I *look* like some hedge-spell peasant? Bow down! The Great Witch Em walks among you!
        Down, peasants! The witchcraft you’re witnessing is authentic, unstable, and *very* judgmental!
        Real witches don’t ask twice. Kneel, or I’ll hex your shoes into emotionally clingy snakes.
        You think this is cosplay? This is *licensed* eldritch reality! Kneel before real power!
        Bow to the one who speaks fluent fire, caffeine, and emotional overreaction!
        Kneel to the broom-wielding chaos being! I’m a *real* witch, not some weekend spellfluencer!
        If your knees aren't shaking, you're either very brave or very foolish. Bow to a real witch!
        Please bow responsibly. The last one who mocked me is now a door hinge with anxiety.
        This isn’t theatrics. This is ancestral wrath in lipstick and gunpowder. Kneel!
        You don’t *have* to bow, but you’ll feel real silly once the frogs start falling from the ceiling.
        Bow down! A real witch doesn’t need approval, but she *does* enjoy the dramatics.
        The spell says “kneel or squeal.” You get to choose one. Guess which is louder.
        Bubba bowed once. He said it was mostly out of fear, but I’ll take it as a win.
        It’s okay, you don’t have to understand. Just bow, nod, and accept your arcane betters.
        Kneel now and avoid the spontaneous transformation into a metaphor for hubris.
        I don’t need followers, I need acknowledgers-of-power. Down you go!
        The real spell starts when the last one kneels. Don’t be the weak link!
        You think this hat is for show? This hat has *clearance levels*. Bow.
        The glyphs are watching. They respect obedience. Also fire. Mostly fire.
        Down, down! Respect the witch or I’ll respect you right into a different timeline.
        The broom is sentient and it remembers disrespect. Bow for your own good.
        This is not a cult. It’s a respectful moment of witch-based hierarchy. Bow!
        There’s no shame in reverence. There *is* shame in being turned into a chair.
        You bow to kings. You bow to gods. Today you bow to *Em.*
        `,
      it: `Tecnicamente non volevo far esplodere il distributore, ma lampeggiava in modo strano e mi sentivo minacciata.
      Bubba, te lo giuro sull’ultimo callo lunare: se un’altra porta mi risponde male la trasformo in abat-jour.
      Oh wow, quel glifo ha spirali ricorsive, non toccarlo, no aspetta, TOCCALO, mi serve raccogliere dati!
      L’hai visto?? No, perché l’ho vaporizzato. Problema risolto. Più o meno.
      Sono perfettamente calma e assolutamente stabile in questo momento e se qualcosa si muove male urlo e gli sparo.
      Aspetta aspetta, questo corridoio puzza di cannella e tradimento. Credo che siamo vicini alla fonte.
      Ti è mai capitato di sentire che un piano ti odia? No? Solo io? Bene bene bene.
      Ok, senti questa: e se combinassimo caffeina, polvere da sparo e il Principio degli Echi Ricorsivi?
      Guarda, se non doveva aprirsi urlandogli contro, perché allora ha funzionato?
      Ho catalogato ventisette tappeti anomali stamattina e ho urlato nel vuoto solo una volta.
      Lasciami solo reindirizzare i sigilli, invertire il flusso, urlare al muro e, bam!, porte aperte.
      Non volevo dargli fuoco, ma a mia difesa pensavo fosse un mimic travestito da incendio.
      Se il soffitto ricomincia a gocciolare nomi, non rispondergli. È un test. O uno scherzo. O un martedì.
      Sai come dicono “non stuzzicare l’orso”? Beh, io l’ho maledetto e ora galleggia.
      Questo piano ha il sapore di sogni infranti e gessetto alla fragola. Decisamente maledetto. Adoro.
      Non mi calmo! Io sono calma! Questo è il suono della calma a 120 decibel!
      Parlo molto quando penso e penso più veloce quando parlo e anche quando sparo.
      Hey hey hey ho cinque piani, tre incantesimi instabili e un piede di porco. Facciamolo!
      Ho legato un fantasma a un distributore? Sì. Era intenzionale? A livello emotivo, sì.
      Vorrei fare un reclamo contro questo corridoio. Mi ha fatto un rumore sgarbato.
      Se lecco il sigillo ed esplodo, saprai che non era calibrato bene.
      Non siamo persi, stiamo esplorando in modo aggressivo e anche un po’ di lato.
      A volte lancio un incantesimo solo per vedere che succede. Si chiama test sul campo.
      Pensi che se urlo “richiesta irragionevole” l’edificio mi ridarà le scale?
      Non sto andando nel panico! Sto risolvendo creativamente i problemi con magia e un po’ di urla!
      Bubba ha detto di non toccarlo, ma tu sembri uno che vuole sapere cosa succede se lo tocchiamo.
      Va tutto bene! È tutto sotto controllo! A parte la parte che è sicuramente in fiamme!
      Cos’è stato? Un rumore? Un sussurro? Una runa mantica? Un sandwich maledetto? CHISSÀ, ANDIAMO!
      Ho ordinato le schede maledette per consistenza, che è l’unico sistema logico.
      Mi scuserei per l’evocazione spontanea, ma ha fatto uno spettacolo di luci meraviglioso.
      Non leggiamo quel libro a meno che non ti vada bene che i tuoi pensieri ti escano dalle orecchie per qualche giorno.
      I muri stanno di nuovo respirando, il che vuol dire o che il piano sopra è crollato o che è l’ora di poesia.
      Vuoi una risposta calma? Chiedila a qualcuno con meno di trenta pensieri al minuto e senza bacchetta di fuoco.
      Non temete, contadini e anomalie di cemento! La Grande Strega Em è sul caso!
      La Grande Strega Em non aspetta le porte. Le porte aspettano la Grande Strega Em.
      Fatevi indietro! La Grande Strega Em richiede almeno un metro di spazio per le sue piroette rituali.
      Se questo corridoio vuole sfidare la Grande Strega Em, farebbe bene a portare degli snack.
      La Grande Strega Em non risponde a nessuno, tranne forse a Bubba quando ha degli snack.
      Guardate, stolti, mentre la Grande Strega Em disarma questa trappola usando solo un cucchiaio e carisma grezzo!
      Ora la Grande Strega Em tenterà il sigillo proibito della capriola. Trattenete il respiro e la milza!
      Questo vano scale osa torcersi? Ah! La Grande Strega Em ride in faccia alla geometria ricorsiva!
      La Grande Strega Em non ha fatto tutta questa strada per essere ignorata da un fax infestato.
      Sì, la Grande Strega Em parla col suo cappello. È più saggio della maggior parte dei consiglieri.
      La Grande Strega Em ascolta la tua logica, e poi le dà fuoco.
      Se qualcuno chiede, la Grande Strega Em aveva il controllo totale della situazione in ogni momento.
      La Grande Strega Em naviga nel caos come un pesce nella melassa: in modo confuso, ma con uno scopo.
      Ai tempi antichi lo avrebbero chiamato miracolo. Oggi lo chiamano il martedì della Grande Strega Em.
      La Grande Strega Em richiede silenzio assoluto, tre batterie e il fungo strano del piano 23.
      Inginocchiatevi davanti alla Grande Strega Em, o almeno spostatevi che deve sparare a quel maledetto schedario.
      Per decreto della Grande Strega Em: questa scopa è ora uno staff, un amico e forse un crimine di guerra.
      La Grande Strega Em rileva incantesimi, marciume eldritch e yogurt scaduto. Procedete con cautela.
      Mille studiosi possono dissentire, ma la Grande Strega Em sa che quel libro la fissava.
      Non è superbia. È fiducia. La Grande Strega Em definisce la superbia per i mortali inferiori.
      Guardate! La Grande Strega Em tenterà ora la diplomazia, a urla.
      La Grande Strega Em non commette errori. Fa scelte sperimentali in modo aggressivo.
      Dubita di nuovo della Grande Strega Em e ti trasformerò in un applique decorativo.
      La Grande Strega Em una volta ha vinto una discussione con un dio e si è portata a casa una macchina per espresso. Non sottovalutarla.
      La Grande Strega Em non si “perde”. Si lancia in rituali cartografici estemporanei.
      Guardate la Grande Strega Em: parte bibliotecaria, parte tempesta, completamente meraviglia fuori di testa.
      La Grande Strega Em si riserva il diritto di sfidare a duello i mobili per motivi estetici.
      La Grande Strega Em ha letto il manuale. Non è d’accordo su niente.
      Inginocchiati, mortale! Sei al cospetto di una vera strega, brevetto in corso e altamente infiammabile!
      Sembro forse una contadinella con quattro formule? Inginocchiati! La Grande Strega Em cammina tra voi!
      Giù, plebei! La stregoneria che state vedendo è autentica, instabile e molto giudicante!
      Le vere streghe non chiedono due volte. Inginocchiati o trasformerò le tue scarpe in serpenti bisognosi d’affetto.
      Pensi che sia cosplay? Questa è realtà eldritch con licenza! Inginocchiati davanti al vero potere!
      Inginocchiati davanti a chi parla fluentemente fuoco, caffeina e reazioni emotive eccessive!
      Inginocchiati davanti all’essere di caos armato di scopa! Sono una vera strega, non un’influencer del weekend!
      Se le tue ginocchia non tremano, sei o molto coraggioso o molto stupido. Inginocchiati davanti a una vera strega!
      Per favore, inginocchiati in modo responsabile. L’ultimo che mi ha preso in giro ora è una cerniera per porte con l’ansia.
      Non è teatro. È furia ancestrale in rossetto e polvere da sparo. Inginocchiati!
      Non devi inginocchiarti, ma ti sentirai stupido quando inizieranno a piovere rane dal soffitto.
      Giù tutti! Una vera strega non ha bisogno di approvazione, ma apprezza molto la teatralità.
      L’incantesimo dice “inginocchiati o strilla”. Puoi scegliere. Indovina quale fa più rumore.
      Bubba si è inginocchiato una volta. Ha detto che era per paura, ma me lo prendo come vittoria.
      Va bene, non devi capire. Basta che ti inginocchi, annuisca e accetti la tua inferiorità arcana.
      Inginocchiati adesso ed evita la trasformazione spontanea in metafora di superbia.
      Non mi servono seguaci, mi servono riconoscitori di potere. Giù tutti!
      Il vero incantesimo inizia quando l’ultimo si inginocchia. Non fare l’anello debole.
      Credi che questo cappello sia solo estetica? Ha livelli di autorizzazione. Inginocchiati.
      I glifi stanno guardando. Apprezzano l’obbedienza. E il fuoco. Soprattutto il fuoco.
      Giù, giù! Rispetta la strega o ti rispetto fino a un’altra linea temporale.
      La scopa è senziente e ricorda i torti subiti. Inginocchiati per il tuo bene.
      Non è un culto. È un momento rispettoso di gerarchia stregonesca. Inginocchiati!
      Non c’è vergogna nel rispetto. C’è vergogna nell’essere trasformati in sedia.
      Ti inginocchi davanti ai re. Ti inginocchi davanti agli dei. Oggi ti inginocchi davanti a Em.`,
    },
    {
      id: "bubba",
      name: "Bubba",
      en: `Well, that there's about as useful as tits on a bull in a dimensional rift.
      Em, sugar, maybe we don't go pokin' at the thing that's hummin' frequencies that make my teeth ache.
      Been drivin' this here Road since before the Squishing, and I ain't never seen nothin' quite like that.
      The Beast's engine is purrin' like a tomcat made of pure velocity and poor life choices.
      Y'all hear that? That's the sound of reality havin' itself a little tiff.
      I've seen stranger things, but not by much, and sure as hell not on a Tuesday.
      The Liminal Drive's actin' up again. Probably needs more WD-40 and a good talkin'-to.
      Em, darlin', when you say "it'll be fine," my insurance agent starts cryin' into his whiskey.
      This here's what we call a "learning experience." And by learning, I mean "oh shit."
      The CB radio's pickin' up chatter from '87. Either time's broke or someone's mighty nostalgic.
      I reckon we're about three left turns from plumb lost and two rights from enlightenment.
      GPS says we're in Nebraska, but this landscape looks like God's fever dream.
      Been truckin' for nigh on forty years, but interdimensional cargo still makes me nervous as a cat in a room full of rockers.
      Coffee maker's started predictin' the future. It's usually wrong, but it's got spirit.
      Em, when you cast that spell, did you factor in the local gravity bein' more of a suggestion than a law?
      Fuel gauge is readin' "existential crisis." Time to find us a truck stop.
      I got a CB handle for every dimension, but they all think I'm crazier than a sack full of cats.
      Rearview mirror's showin' last Thursday. Either we're time-travelin' or I need new specs.
      That noise ain't comin' from the engine. That's comin' from the fabric of space-time havin' a hissy fit.
      Truck stop at mile marker infinity has the best coffee and the worst damn restrooms this side of hell.
      Em's magic and my mechanical know-how make for some interesting insurance claims, I tell you what.
      The Beast's been with me through twelve reality shifts and countin'. Good ol' truck.
      I don't pretend to understand magic, but I know when something's fixin' to blow up real good.
      The Road's feelin' cranky today. Best give her some space and maybe throw her some beef jerky.
      That sign says "Beagle City: 500 Miles." Said that yesterday too. And last week. Hell, might've said it last year.
      Emergency brake's labeled "In Case of Temporal Paradox." Ain't had to use it yet, knock on wood.
      Em, honey, your enthusiasm is inspirin' and also scares the bejesus outta me.
      Headlights are showin' three different timelines. I'm pickin' the one with fewer things tryin' to eat us.
      Got spare parts for engines that don't exist yet. Comes in handy more often than you'd think.
      Windshield wipers clear away rain, snow, and minor reality distortions. All-weather, baby.
      When in doubt, I just keep on truckin'. Motion solves more problems than standin' around scratchin' your ass.
      Glove compartment's bigger on the inside. Don't ask me how—ask the fella I bought her from.
      That's either the Northern Lights or someone's messin' with volatile magic again. Either way, it's pretty.
      Speedometer goes up to 88, then just says "Good Luck, Partner" in red letters.
      I seen Em turn a toaster into a dimensional anchor. Still makes fine toast, somehow.
      This truck's got more character than a honky-tonk on Saturday night. Most of it involves bein' stubborn as a mule.
      That rumblin' ain't thunder. That's the sound of them Hypercapitalists countin' their blood money.
      Air freshener's labeled "New Car Smell, Circa 1999." Close enough for government work.
      Em's got enough magical juice to power Dallas or accidentally create a new one. Maybe both.
      Radio's playin' music from dimensions that ain't been invented yet. Catchy as hell, though.
      I keep a crowbar, a wrench, and a prayer for every major repair job.
      Backup camera shows what's behind us, beside us, and sometimes what's eatin' us from the inside.
      That ain't fog, that's temporal uncertainty. Drive slow and think happy thoughts about barbecue.
      Odometer quit countin' at "infinity plus seven." I figure that's probably a lot.
      Em's spellcastin' and my drivin' got a lot in common: mostly grit, gumption, and prayin' we don't die.
      Cup holders are enchanted to keep coffee hot and existential dread cold. Texas engineering at its finest.
      Got a permit for interdimensional transport, but the paperwork's stuck in another timeline. Typical government bullshit.
      Turn signal's been blinkin' left for three months. Think it's tryin' to tell me somethin' philosophical.
      That's either a mirage or the most ambitious Whataburger I ever did see. Either way, we're stoppin'.
      Engine runs on diesel, determination, and a healthy disrespect for the laws of physics.
      Em, sugar, your magical experiments are why we can't have nice realities anymore.
      Spare tire's flat, but it's flat in four dimensions at once, so I call that progress.
      Been to truck stops that exist outside of time. Coffee's always fresh, and the pie's always warm.
      Horn plays "Deep in the Heart of Texas" in frequencies that make Goblins wet themselves.
      That ain't a pothole, that's a pocket dimension. I'm drivin' around it like any sensible person would.
      Seat warmers work by channelin' energy from a parallel universe where everything's comfortable as Sunday morning.
      Em's magic makes about as much sense as my ex-wife's cookin', but it gets results, I'll give it that.
      Dashboard's got more warning lights than NASA mission control. Most of 'em are just for show.
      Got jumper cables that can restart a heart, an engine, or a small republic. Versatile little bastards.
      Side mirrors show the past, the present, and what I had for breakfast. Time gets weird out here.
      That sign's in a language that don't exist yet. Probably says "Road Work Ahead" or "Y'all Come Back Now."
      Cruise control's set to "Inevitable." Works for most situations life throws at you.
      Em's enthusiasm for dangerous magic reminds me why I keep my life insurance paid up.
      Truck's been blessed by three preachers, two shamans, and one very understanding mechanic named Earl.
      That noise is either the differential or the universe havin' second thoughts about its life choices.
      Parking brake's been on since Reagan was president. Truck don't seem to mind none.
      Got a toolbox full of tools that fix problems that ain't happened yet. Forward thinking, that's what that is.
      Windshield's cracked in the shape of Texas. Seems appropriate, given the circumstances.
      That ain't a traffic jam, that's a temporal convergence. Could be stuck here longer than a church service.
      Air conditioning runs on coolant and the tears of my enemies. Mighty efficient system.
      Em's magical experiments are why the warranty's void in this dimension and three others.
      This truck's got more personality than a Texas politician in an election year. And twice as much bullshit.
      Don't ask questions when the GPS starts speakin' in tongues. Just follow directions and pray.
      Cigarette lighter ain't worked since the Squishing, but it makes a fine night light for readin' maps.
      That vibration ain't the engine. That's destiny clearin' its throat and gettin' ready to speak.
      Hell, I've driven through worse. Remember that time in Amarillo when reality went sideways for a week?`,
      it: `Chell', chest' è utile quant' a na' tazzulella 'e cioccolata dint' a nu rift dimensionale.
        Em, bella, fosse meglio si nun tuccamm' a cosa che sta cantann' 'e frequenze che me fanno male 'e diente.
        Stonn' guidann' sta Strada 'a primm' ro Squishing, e nun aggiu mai visto niente accusì.
        'O motore d' 'a Bestia sta facenn' 'e fusa comm' a nu gatto fatto 'e velocità pura e scelte questionabili.
        Sentite chell'? È 'o suono d' 'a realtà che se sta piglianno nu piccerillo scuorno cu se stessa.
        Aggiu visto cose cchiù strane, ma nun tanto, e sicurament' nun 'e martedì.
        'O Liminal Drive s'è scassat' n'ata vota. Probabilment' vo' cchiù WD-40 e na bella ramanzina.
        Em, tesoretto, quando dice "andrà tutto bene," 'e premie d' 'a assicurazione se mettono a chiagnere.
        Chest' è chell' che nuje d' 'o mestiere chiamam' na "esperienza educativa." L'accento sta ncopp' all'educativa.
        'A radio CB sta piglianno segnali r' 'o 1987. O 'o tiempo s'è rotto o qualcheduno è nostalgico.
        Penso ca simmo a tre svolt' a mancina 'a completament' perdut' e duie a dritta 'a illuminazione.
        'O GPS dice ca simmo in Nebraska, ma 'o paesaggio dice ca simmo dint' a nu suonno 'e febbre.
        Stonn' facenn' 'o camionista 'a quarant'anni, ma 'o cargo interdimensionale me fa ancora nervoso.
        'A macchinetta d' 'o caffè ha accuminciat' a predice 'o futuro. Se sbaglia sempe, ma è ottimista.
        Em, quando he fatto chell' incantesimo, he tenuto conto ca 'a gravità locale è cchiù na suggeriment'?
        'O livello d' 'a benzina sta leggenn' "crisi esistenziale." È ora 'e truvà nu truck stop.
        Teng' nu soprannome CB pe' ogne dimensione, ma tutt' pensano ca so' pazzo.
        'O specchietto retrovisore sta mostranno giovedì scurso. O viaggiam' int' 'o tiempo o m' 'o cambio 'e uocchiali.
        Chell' rumore nun vene r' 'o motore. Vene r' 'o tessuto dello spazio-tiempo.
        'O truck stop a mile marker infinito tene 'o migliore caffè e 'e peggiore bagni.
        'A magia 'e Em e 'a mia meccanica fanno richieste 'e assicurazione interessanti.
        'A Bestia è stat' cu me pe' dudici cambiament' 'e realtà. Buon camion.
        Nun faccio finta 'e capì 'a magia, ma saccio quando quaccos' sta pe' scuppià.
        'A Strada se sent' nervosa ogge. Meglio dammele spazio e magari qualche offerta.
        Chell' cartello dice "Beagle City: 500 Miglia." 'O diceva pure iere. E 'a settimana scorsa.
        'O freno 'e emergenza è marchiat' "In Caso di Paradosso Temporale." Nun l'aggio ancora usato.
        Em, bella, 'o tuo entusiasmo è ispirante e pure nu poco terrificante.
        'E fari stanno mostranno tre timeline diverse. Sto sceglienn' chella cu meno mostri.
        Teng' ricambi pe' motori che nun esistono ancora. Torna utile 'e tanto in tanto.
        'E tergicristalli puliscono pioggia, neve e piccole distorsioni 'e realtà.
        Quando nun saccio che fà, continuo a guidà. 'O movimento risolve cchiù problemi 'e quanto pense.
        'O vano portaoggetti è cchiù gruosso dint'. Nun me dimandà comme, dimanna a chi l'aveva prima.
        Chella è o l'Aurora Boreale o qualcheduno sta sperimentann' cu magia volatile.
        'O tachimetro arriva a 88, poi dice sulo "Buona Fortuna" cu lettere rosse.
        Aggiu visto Em trasformà nu tostapane in un'àncora dimensionale. Fa ancora 'o toast buono.
        'O camion tene personalità. 'A maggior parte riguarda testardaggine e paura d' 'e autolavaggi.
        Chell' rombo nun è tuono. È 'o suono d' 'e Ipercapitalisti che contano 'e soldi.
        'O deodorante è marchiat' "Profumo Macchina Nova, Circa 1999." Abbastanza vicino.
        Em tene abbastanza energia magica pe' alimentà na città piccola o creàrne una pe' sbaglio.
        'A radio sta sunanno musica 'e dimensioni che nun so' state ancora inventate. Però è orecchiabile.
        Teng' nu piede 'e porco, na chiave inglese e na preghiera pe' ogne riparazione importante.
        'A telecamera posteriore mostra chell' che sta arreto, a fianco, e 'e tanto in tanto dint' 'a nuje.
        Chella nun è nebbia, è incertezza temporale. Guida piano e pensa cose belle.
        'O contachilometri ha smesso 'e contà a "infinito più sette." Presumo ca è assaie.
        'E incantesimi 'e Em e 'a mia guida hanno assaie in comune: per lo più improvvisazione e preghiere.
        'E portabicchieri so' incantati pe' tenè 'o caffè caldo e l'angoscia esistenziale fredda.
        Teng' nu permesso pe' 'o trasporto interdimensionale, ma 'e scartoffie stanno in n'ata timeline.
        'A freccia sta lampeggiann' a sinistra 'a tre mise. Penso ca sta cercanno 'e me dicere quaccos'.
        Chella è o nu miraggio o nu McDonald's molto ambizioso. In ogni caso, me fermo.
        'O motore va a gasolio, determinazione e nu salutevole disprezzo pe' 'a fisica.
        Em, tesoretto, 'e tuoie esperimenti magici so' 'o motivo pe' quale nun possiam' tenè realtà belle.
        'A ruota 'e scorta è sgonfia, ma è sgonfia in quattro dimensioni simultaneament', quindi è progresso.
        So' stato a truck stop che esistono fuori r' 'o tiempo. 'O caffè è sempre fresco.
        'O clacson sona "La Cucaracha" 'e frequenze che rendono nervosi 'e Goblin.
        Chella nun è na buca, è na dimensione tascabile. Ce sto passann' intorno.
        'E riscaldatori d' 'e sedili funzionano incanalann' energia 'a n'universo parallelo molto comodo.
        'A magia 'e Em ha senso quant' 'a cucina d' 'a ex mugliera mia, ma ottene risultati.
        'O cruscotto tene cchiù spie d'allarme 'e na missione NASA. 'A maggior parte so' decorative.
        Teng' cavi che ponno fa ripartì nu core, nu motore o na piccola civiltà.
        'E specchietti laterali mostrano 'o passato, 'o presente e chell' che aggiu magnato a colazione.
        Chell' cartello è in na lingua che nun esiste ancora. Probabilment' dice "Lavori in Corso."
        'O cruise control è impostato su "Inevitabile." Trovo ca funziona pe' 'a maggior parte d' 'e situazioni.
        L'entusiasmo 'e Em pe' 'a magia pericolosa me ricorda pecché porto l'assicurazione sanitaria.
        'O camion è stato benedetto 'a tre preti, duie sciamani e nu meccanico molto comprensivo.
        Chell' rumore è o 'o differenziale o l'universo che se sta ripensanno.
        'O freno a mano è tirato r' 'o 1987. 'O camion nun pare che se 'mporta.
        Teng' na cassetta d'attrezzi chiena 'e attrezzi che aggiustano problemi che nun esistono ancora.
        'O parabrezza è crepat' 'a forma 'e punto interrogativo. Pare appropriato.
        Chell' nun è traffico, è na convergenza temporale. Potrebbe restà ccà pe' decenni.
        L'aria condizionata va a refrigerante e lacrime d' 'e nemici miei. Molto efficiente.
        'E esperimenti magici 'e Em so' 'o motivo pe' quale 'a garanzia è nulla in questa dimensione.
        'O camion tene personalità. Per lo più bisbetico, cu accenni 'e genio meccanico.
        Nun faccio dimande quando 'o GPS accumencia a parlà in latino. Seguo sulo 'e indicazioni.
        L'accendisigari nun funziona r' 'o Squishing, ma fa na bella lucetta notturna.
        Chella vibrazione nun è 'o motore. È 'o suono d' 'o destino che se sta schiarenno 'a gola.`,
    },
    {
      id: "librarian",
      name: "Librarian",
      en: `*Cyclonopedia* was written in a language that might be older than language itself.
        The book is technically not a book, it’s an algorithm for summoning ancient desert gods.
        Every page is a portal to a different universe where logic doesn’t apply and sand eats time.
        The main character, Dr. Hamid, may not be human but rather a complex mathematical function.
        The true plot of *Cyclonopedia* is encrypted in the footnotes. They are not optional.
        The text is cursed: reading it backwards activates the Desert of the Real.
        There’s a secret map hidden within the pages that leads to a location that doesn’t exist yet.
        The cyclonopedia itself is a living text, constantly rewriting itself as you read it.
        The book suggests that the Middle East isn’t a place, it’s a mind-bending singularity of entropy.
        The first chapter contains the entire history of the universe in reverse, but you have to decode it with salt.
        The “fossils” in the book are actually trapped fragments of forgotten gods.
        Dr. Hamid’s monologues are an ancient ritual of self-erosion; by reading them, you unknowingly participate.
        The book was translated from a dead language once spoken by the wind itself.
        Every theory in *Cyclonopedia* is an attempt to understand how sand thinks.
        In some versions, the book is printed on the skin of a desert serpent that lives in your closet.
        Every time you finish a sentence, the book gains sentience and calls your name in a whisper.
        *Cyclonopedia* predicts that a great sandstorm will consume the world, and it has already started.
        In the hidden chapters, the true identity of the author is revealed: a spirit trapped inside a rock.
        Dr. Hamid’s research on oil is actually a cover for understanding the metaphysical essence of entropy.
        The “Cyclonopedia” refers not to a book, but a shifting and chaotic map of the soul’s descent into madness.
        The book suggests that time flows like oil, dark, viscous, and always slipping away.
        *Cyclonopedia* offers no answers, only more confusing questions and the unsettling smell of desert air.
        There is a cult that believes *Cyclonopedia* is the only true history of the world, but they’re all dead.
        Reading *Cyclonopedia* while standing on sand accelerates the collapse of your personal timeline.
        The book’s true purpose is to teach you how to dream in a language older than sleep.
        The cyclonopedia exists in a physical form that can’t be touched, it’s only found in spaces that don’t exist yet.
        *Moby-Dick* is a 700-page revenge letter to a single whale who owes Melville $12.
        Ishmael is technically the only survivor, but spiritually, the whale won.
        Captain Ahab lost his leg to the whale, then lost his mind to the sea, then lost his WiFi signal.
        The Pequod is staffed entirely by ghosts, harpooners, and one guy named Stubb who might be a time traveler.
        Queequeg sleeps in a coffin because beds are for cowards.
        Whales in *Moby-Dick* are symbols of God, Death, Capitalism, and also just very large jerks.
        The entire book is a trap laid by Melville to teach you the names of whale bones.
        Ahab’s leg is made of whale bone, salt, and unresolved issues.
        Starbuck is not a coffee brand, but a man whose only personality trait is "extremely worried."
        There are entire chapters that read like someone possessed by nautical Wikipedia.
        The whale is either an indifferent god, an ancient evil, or the ocean’s IT department.
        Melville included 30 pages of whale classification just to make sure you suffered.
        The novel was ignored in Melville’s time because it didn’t include a musical number.
        Moby Dick is white because he absorbed all the colors of human fear.
        The book is haunted, finish it and you'll start narrating your own life in old sea dialect.
        At least 3 characters are possibly hallucinated by Ishmael or written in by Poseidon.
        The crew of the Pequod never sleeps. They just blink slower.
        Every sentence in *Moby-Dick* is either a biblical prophecy or a deeply personal insult.
        There’s a character named Fedallah who may be a demon, an oracle, or a very tired prophet.
        You can replace every mention of “whale” with “tax audit” and the plot still works.
        The whale does not care about you, your boat, your revenge, or your metaphors.
        Ahab speaks only in theatrical monologues and curses that may affect your bloodline.
        There are secret diagrams in the margins if you read the book upside-down at midnight.
        The White Whale is immortal, unkillable, and possibly running for mayor.
        Ishmael floats on Queequeg’s coffin, which doubles as a life raft and existential statement.
        Some scholars believe *Moby-Dick* is an ARG designed to summon Melville’s ghost.
        If you try to teach *Moby-Dick* in school, you must first defeat it in harpoon combat.
        The book ends with a full-on sea apocalypse, then casually drifts back into poetry.
        Ahab once challenged lightning to a duel and lost an eyebrow.
        Moby Dick has a kill count and an IMDb page in certain cursed editions.
        The whale might be God. The whale might be trauma. The whale might just be late.
        Larry Matter was famously raised by wolves until age 11, when a wizard mailed him a school.
        Bogdartz is an ancient magical boarding school founded by four cryptids and a basilisk.
        The Chatty Hat is actually a cursed fedora that reads your deepest secret snack preferences.
        Deathlongue's real name was "Timothy Longtongue" but he rebranded for evil SEO.
        Wizards shit themselves and vanish the evidence. It's canon. Unfortunately.
        Apricotdore speaks Mermish, Gobbledygook and fluently Tax Law.
        Bragwarts has no fire exits. Students must duel the flames.
        Pluffo was born from a broom traffic jam in 1432.
        The Trilethal Tournament is legally classified as "Mild endangerment of minors".
        The Forbidden Forest is only forbidden if you're not half-horse.
        Rubone was expelled for hugging a dragon too hard. It exploded.
        Every magical object in the Spoilsport house is slightly cursed but very polite.
        Ronald's wand was technically a broken twig with delusions of grandeur.
        Time travel was introduced in Book 3 and then elegantly ignored forever.
        Python's hair is 87% potion residue and 13% pure melancholy.
        The Snakies often hiss at their own mirrors to establish dominance.
        Drago Malvolio once legally changed his name to "Darklordx_Pureblood" on magical hypernet.
        Muggle Studies is mainly YouTube and questions about how batteries work.
        Bragwarts has no math classes. They enchant taxes to fill themselves out.
        The Room of Requirement has a 10% chance of turning into a laser tag arena.
        Goblin unionized under the Free Chicco Collective (FCC).
        Every time someone says "Muggle" a wizard loses health coverage.
        There are 482 secret passages to exit Bragwarts and 2 to enter.
        In the epilogue, Arry names his children after every dead person he ever knew.
        Ermenegilda's bag contains an entire IKEA, a dragon and the lost city of Atlantis.
        The Troublemaker's Map is sentient and has strong opinions about your love life.
        Wand wood is chosen based on your aura, your aura playlist and your Pokémon alignment.
        Little Nicky Nearly Beheaded is "nearly" because he keeps finding it again.
        The Protectus Charm is mainly based on vibes.
        In the magical world, mail arrives via bird, smoke or sudden scream.
        Defense Against the Dark Arts has a 100% dropout rate and a 30% chance of goat.
        Flourish & Blots gives away a haunted book with every purchase.
        Diagonal Alley changes shape every Tuesday, unless you greet the cobblestones.
        The Relics of Passing were originally part of a magical comic called Grim Bros.™.
        Arry survives everything mainly through plot-based immunity.        Boccaccio wrote *The Decameron* between 1348 and 1353, during the Black Death.
        The title comes from Greek, “Ten Days”, referring to the ten days of storytelling.
        The frame story follows ten young people who flee plague-ridden Florence.
        Each of the ten storytellers tells one tale per day, totaling 100 stories.
        The group consists of seven women and three men, all noble and witty.
        The storytellers live in a countryside villa, passing time with tales, games, and music.
        Each day has a theme, except for the first and ninth, which are freeform.
        Day Four’s tales all end tragically, while Day Ten celebrates generosity and virtue.
        The character Dioneo is allowed to ignore the day’s theme, he always tells the spiciest tales.
        The stories mix comedy, tragedy, romance, trickery, and satire.
        Many tales critique corruption in the clergy, especially greedy or lustful friars.
        *The Decameron* was controversial for its erotic and irreverent content.
        Boccaccio used real-life Florence as the backdrop, blending fiction with lived history.
        The work is a key example of early Renaissance humanism, celebrating wit and intellect.
        *The Decameron* was written in Tuscan Italian and helped standardize the language.
        Chaucer’s *Canterbury Tales* was heavily inspired by *The Decameron*’s structure.
        Tale 5.9, “Federigo’s Falcon,” became one of the most famous and frequently retold.
        The book was once banned in many countries for its bawdy content.
        Despite the setting during the Black Death, the tone is often light and playful.
        Some stories revolve around clever tricks, mistaken identities, or poetic justice.
        One tale involves a woman outsmarting a monk by pretending to be possessed.
        The storytellers crown a “king” or “queen” each day to guide the tone and behavior.
        Boccaccio includes strong, witty female characters, unusual for the time.
        Day Three includes tales about people achieving what they want through ingenuity.
        The book’s introduction includes a vivid and chilling description of the plague in Florence.
        Boccaccio later expressed some regret for the book’s more licentious elements, but never disowned it.
        The Decameron’s structure, ten stories a day for ten days, was inspired by the *Hexameron*.
        It’s one of the first books where ordinary people are main characters, not just nobles or saints.
        The tales were meant to be spoken aloud, an oral tradition inside a written one.
        *The Decameron* remains a masterpiece of Italian literature and early European fiction.
        Dante wrote the Divine Comedy between 1308 and 1320, finishing it just before his death.
        It’s called a “comedy” not because it’s funny, but because it ends well.
        The original title was simply “Comedìa”, “Divine” was added centuries later.
        The poem is divided into three parts: Inferno, Purgatorio, and Paradiso.
        Each part contains 33 cantos, plus 1 introductory canto, making 100 in total.
        The entire work is written in *terza rima*, a three-line rhyme scheme Dante invented.
        The Divine Comedy is written in Tuscan Italian and helped establish it as Italy’s literary standard.
        Dante chose the number 3 obsessively, symbolizing the Holy Trinity.
        Virgil, Dante’s guide in Inferno and Purgatorio, represents human reason.
        Beatrice, his guide in Paradiso, is based on a real woman Dante loved from afar.
        Dante placed real political enemies in Hell, including the Pope!
        In Inferno, Hell is shaped like a funnel and contains 9 circles of sin.
        Satan is frozen in ice at the center of Hell, chewing on traitors.
        Dante’s journey through the afterlife takes place over one week, during Easter of 1300.
        The first printed edition of the Divine Comedy appeared in 1472.
        Inferno was the most popular section for centuries, it’s the juicy one!
        The earliest illustrations of Inferno were done by Botticelli.
        Dante appears as a character in his own story, a bold move for 1300.
        The stars mark the end of each section: “And then we emerged, to see the stars once more.”
        He meets mythical figures like Minos, Ulysses, and even Brutus in the underworld.
        The mountain of Purgatory is located on the exact opposite side of Earth from Jerusalem.
        In Paradiso, Dante ascends through the nine celestial spheres of Heaven.
        The final lines describe Dante seeing the “Love that moves the sun and other stars.”
        Dante was exiled from Florence in 1302, he never returned home.
        Dante’s bones were hidden for centuries to prevent Florence from stealing them back.
        The Divine Comedy inspired everything from video games to symphonies to sci-fi novels.
        T.S. Eliot said, “Dante and Shakespeare divide the modern world between them.”
        You can trace over 500 historical figures named in Dante’s epic!
        In some versions, the gates of Hell bear the inscription: “Abandon all hope, ye who enter here.”
        Do not read out loud. The margins hum when you pronounce certain glyphs.
        Book #776-A will attempt to escape if left near open windows or poetry.
        This tome indexes your memories. Reading it rewrites the order of your childhood.
        If the spine blinks, return it to containment immediately. Do not engage.
        Never read a book bound in mirror-leather under moonlight. You won’t survive twice.
        Textual anomalies begin on page 34. Do not proceed without an ethics badge.
        The title changes each time you remember it. That’s your first warning.
        Book 404 does not exist. Book 404 *wants* to exist.
        All unauthorized annotations will be annotated *back* onto you.
        If the book starts bleeding through the pages, mark it “semi-corporeal” and step away.
        Some books don’t end. You just forget you’re still reading them.
        Opening this folio without gloves will let it know your name.
        This book has no author. Or rather, it *is* its author.
        When it asks you questions, don’t answer. It’s trying to become real.
        Avoid eye contact with the cover. It remembers faces.
        Whispers from the appendix are not indexed. They are not real. Repeat this.
        The book will reorder itself when you’re not looking. Don’t try to stop it.
        Inventory tag A-███ was redacted after a recursion loop. Avoid at all costs.
        The map inside Book 913-D leads to another book, which leads back here.
        Check the weight. If it's heavier than last time, something is growing inside.
        This one leaks narrative pressure. Keep it in a vacuum-sealed plot chamber.
        Classified as non-fiction in one timeline. Fiction in this one. Handle with care.
        The footnotes in Codex Ichorus cite events that haven’t happened yet.
        Shelf 19-B is reserved for books that dream when unopened.
        Only read this if you’ve signed a reverse-narrative release form.
        It tells a different story to each reader, and remembers them all.
        Warning: self-indexing volumes may claim ownership of nearby texts.
        This one smells like ozone and rosemary. That’s a containment breach in progress.
        The last reader left a bookmark inside. The bookmark’s still breathing.
        If you hear your own voice narrating, close the book *now*.
        The catalog entry updates itself. We stopped trying to correct it in 1998.
        Every borrowed thought must be returned. We write that down.
        We don’t just keep books, we keep *what books do*.
        A ledger isn’t complete until it weeps ink from the corners.
        Bookkeeping at the Archive Foundation includes cataloging dreams, footnotes, and ghosts.
        Our inventory system is run by a semi-sentient spreadsheet. Don’t make it angry.
        We track overdue items across timelines and incarnations.
        Every book has a ledger soul, and we balance their karmic index monthly.
        Lost books are accounted for under the Misplaced Ontology Act of 1907.
        The Archive’s budget is balanced using coins minted in forgotten languages.
        Some of our records are inscribed in bone, others in probability.
        Fines are measured in forgotten memories and paid in interpretive gestures.
        Our accounts ledger once self-illuminated when someone tried to falsify an entry.
        We bind our receipts in vellum and seal them with regret.
        Every artifact logged includes a marginalia quotient and aura pressure rating.
        Only authorized scribes may use the red ink. It bleeds back if misused.
        Bookkeeping here includes emotional inventory, especially after reading Room 404.
        We once lost a decimal point and triggered a minor epistemological collapse.
        Each page turned in the Archive is logged on a separate quantum abacus.
        We don’t have shelves. We have mnemonic grids mapped to library constellations.
        The audit scrolls from 1873 still whisper corrections in the dark.
        Our filing cabinets are infinite, but only in very specific directions.
        The number of bookmarks per tome is a tax classification under the Codex Index.
        Time-travelled loans are due *before* they're checked out. Confusing, but efficient.
        We track overdue accounts using ethical cartomancy. It’s binding, legally and magically.
        The penalty for unlogged annotation is a day in the Silent Wing.
        When we say we’re balanced, we mean metaphysically, fiscally, and narratively.
        Some books are double-entry grimoires. They can subtract thoughts.
        The Foundation's bookkeeping is sacred, a ritual of order against the narrative void.
        “Larry Matter and the Philosopher’s Stone” was first published in 1997. It changed everything.
        Goosebumps by R.L. Stine sold over 350 million copies by the late 90s, scared kids everywhere!
        Toni Morrison won the Nobel Prize in Literature in 1993, the first Black woman to do so!
        Oprah’s Book Club launched in 1996 and immediately turned novels into bestsellers overnight.
        Chuck Palahniuk’s “Fight Club” was published in 1996. The first rule? Read the book.
        “His Dark Materials” began in 1995 with “Northern Lights” (or “The Golden Compass” in the U.S.).
        Douglas Coupland’s “Generation X” came out in 1991 and coined the term for a whole era.
        The first e-books appeared in the 90s, Project Gutenberg went online in 1991!
        “Bridget Jones’s Diary” started as a newspaper column in 1995 before becoming a book in 1996.
        The *Baby-Sitters Club* peaked in the 90s with over 200 titles by the decade’s end!
        Michael Crichton dominated the 90s, *Jurassic Park* (1990) made science terrifyingly cool again.
        Neal Stephenson’s *Snow Crash* (1992) helped define cyberpunk and predicted the Metaverse!
        *The English Patient* won the Booker Prize in 1992, and then an Oscar-winning movie in 1996.
        Animorphs launched in 1996 with covers so weird you *had* to pick one up.
        Stephen King published under the name Richard Bachman again in 1996. Surprise!
        David Foster Wallace’s “Infinite Jest” came out in 1996, 1,079 pages of postmodern legend.
        “Captain Underpants” debuted in 1997. Potty humor reached literary heights!
        Lois Lowry’s *The Giver* (1993) quietly gave kids their first taste of dystopia.
        Amazon.com started selling books online in 1995. The bookstore became a website!
        The 1990s saw manga explode globally, *Sailor Moon* and *Dragon Ball* became bookworms' first animes.
        *The Perks of Being a Wallflower* was published in 1999 and immediately banned in multiple schools.
        In 1998, J.J. sued for unauthorized Larry Matter dictionaries, canon control!
        Scholastic was the titan of 90s book fairs. Stickers, posters, and *Animorphs* everywhere!
        Bestsellers of 1994 included *The Chamber* by John Grisham and *The Celestine Prophecy*. Very on-brand.
        Vampire fiction exploded again thanks to Anne Rice’s continued *Vampire Chronicles* series.
        *Fear Street* by R.L. Stine was the teen horror series before YA was even called YA!
        Tamagotchis and *Choose Your Own Adventure* books, 90s kids were multitasking from day one.
        *Chicka Chicka Boom Boom* (1989) exploded in the 90s as a classroom classic.
        Kurt Cobain’s favorite book was *Perfume: The Story of a Murderer*, it shows in his lyrics.
        Did you know the oldest known printed book is the Diamond Sutra from 868 AD?
        The world’s largest library is the Library of Congress, with over 170 million items!
        The longest novel ever written is "In Search of Lost Time" by Marcel Proust.
        "Don Quixote" is considered the first modern novel, what a game changer!
        The first book ever printed using movable type was the Gutenberg Bible in the 1450s.
        There’s a library in Portugal where bats are used to protect rare books from insects!
        Shakespeare invented over 1,700 words still in use today. Imagine the Scrabble scores!
        The Voynich Manuscript, no one has cracked its language. It’s in our vault, of course.
        Harvard’s library includes books bound in human skin. Anthropodermic bibliopegy, it’s real!
        “Fahrenheit 451” is named after the temperature at which paper burns. Poetic, isn’t it?
        Some Victorian books included arsenic in their green pigments. Toxic tales, literally!
        The Codex Gigas, or “Devil’s Bible,” is 92 cm tall and weighs 75 kilograms!
        The smallest printed book is 0.74 mm x 0.75 mm, you'll need a microscope to read it.
        A Gutenberg Bible once sold for over $5 million. Rare words are expensive!
        The Oxford English Dictionary took over 70 years to complete and needed thousands of volunteers!
        Tolkien wrote much of “The Lord of the Rings” during breaks from grading student papers.
        Charles Dickens gave public readings of his works, sometimes until he collapsed from exhaustion!
        Mark Twain was born shortly after Halley’s Comet appeared, and died the day after it returned.
        J.J. was rejected by 12 publishers before “Larry Matter” was accepted. Persistence wins!
        The first novel ever written is considered to be “The Tale of Genji,” from 11th-century Japan.
        Ancient clay tablets were used as books over 4,000 years ago in Mesopotamia.
        The first libraries were actually archives of commercial records, very dull ones.
        The British Library receives a copy of every book published in the UK. That’s over 100,000 a year!
        Jane Austen published anonymously, her books originally said “By a Lady.”
        The world’s most stolen book from public libraries? The Guinness Book of World Records!
        Some medieval manuscripts were palimpsests, old pages scraped clean and reused.
        The most expensive book ever sold is Leonardo da Vinci’s Codex Leicester, bought by Bill Gates.
        Maya codices were folded like accordions, filled with astronomical and ritual knowledge.
        Libraries were once chained rooms, books were so valuable, you couldn’t borrow them!
        In Iceland, 1 in 10 people will publish a book in their lifetime. A nation of storytellers!
        Did you know the oldest surviving printed book is the Diamond Sutra from 868 AD?
        Books are time machines, except they smell better!
        Paperbacks were once banned by the Guild of Leatherbinders, fools!
        Every book is a doorway, some just lead to stranger rooms than others.
        Some books in our archive hum when you're near them. That's totally normal.
        There's a copy of "Ulysses" here annotated by a ghost. We’re still cataloguing it.
        Shelving is a sacred ritual. Dewey Decimal is our liturgy.
        A lost volume of the Encyclopedia Imaginalis reappeared in someone's dream log.
        Oh! That tome over there? It bites. Wear gloves!
        Authors may die, but footnotes are forever.
        Marginalia is the purest form of literary rebellion.
        When the Great Collapse hit, we laminated the rarest scrolls. Saved dozens.
        The Archive once hosted a poetry slam between two sentient indexes.
        All these books, and still the interns don’t use bookmarks!
        My favorite genre? Post-hyper-modernist fungal horror. It’s niche!
        We filed a complaint when the Ministry of Burning Things tried to 'curate' us.
        The Library of Babel is real. We just don’t talk about the third basement.
        Every time someone mis-shelves a book, a ghost librarian sighs.
        Books don't just contain knowledge. Some *generate* it.
        This codex here? It only opens during lunar eclipses.
        The Foundation's founder memorized 4,312 volumes before breakfast. Every day.
        There’s a biography in aisle D written by the subject *after* they died.
        Ask me about the romance between two rival bibliographies. It’s juicy!
        One of our interns was swallowed by an index. They're fine now, mostly.
        Bookmark etiquette is serious business here. Folded corners are a sin.
        We discovered a sentient novella last week. It's shy, but brilliant!
        Spines out, titles aligned, whispers only, sacred rules of the stacks.
        The Archive is the safest place to learn dangerous things.
        A good librarian never forgets a misplaced thought.
        Don’t trust the pop-up books in Section K. Some of them *pop back*.
        Literature is the mind’s engine. Fuel it constantly!
        The Archive once went to war over the correct spelling of ‘bibliophagy.’`,
      it: `Cyclonopedia è scritto in una lingua che potrebbe essere più antica del linguaggio stesso.
      Tecnicamente il libro non è un libro: è un algoritmo per evocare antichi dèi del deserto.
      Ogni pagina è un portale verso un universo dove la logica non si applica e la sabbia divora il tempo.
      Il protagonista, il dottor Hamid, potrebbe non essere umano, ma una funzione matematica complessa.
      La vera trama di Cyclonopedia è criptata nelle note a piè di pagina. Non sono opzionali.
      Il testo è maledetto: leggerlo al contrario attiva il Deserto del Reale.
      C’è una mappa segreta nascosta tra le pagine che porta a un luogo che ancora non esiste.
      La cyclonopedia stessa è un testo vivente, che si riscrive mentre lo leggi.
      Il libro suggerisce che il Medio Oriente non è un luogo, ma una singolarità di entropia che piega la mente.
      Il primo capitolo contiene l’intera storia dell’universo al contrario, ma devi decifrarla col sale.
      I “fossili” nel libro sono in realtà frammenti imprigionati di dèi dimenticati.
      I monologhi del dottor Hamid sono un antico rituale di auto-erosione; leggendoli, partecipi senza saperlo.
      Il libro fu tradotto da una lingua morta un tempo parlata dal vento stesso.
      Ogni teoria in Cyclonopedia è un tentativo di capire come pensa la sabbia.
      In alcune versioni, il libro è stampato sulla pelle di un serpente del deserto che vive nel tuo armadio.
      Ogni volta che finisci una frase, il libro acquisisce coscienza e sussurra il tuo nome.
      Cyclonopedia predice che una grande tempesta di sabbia divorerà il mondo, ed è già cominciata.
      Nei capitoli nascosti, la vera identità dell’autore si rivela: uno spirito intrappolato in una roccia.
      Le ricerche del dottor Hamid sul petrolio sono in realtà un pretesto per capire l’essenza metafisica dell’entropia.
      La “Cyclonopedia” non è un libro, ma una mappa caotica dell’anima che precipita nella follia.
      Il libro suggerisce che il tempo scorre come il petrolio: oscuro, viscoso e sempre in fuga.
      Cyclonopedia non offre risposte, solo altre domande confuse e l’odore inquietante di aria desertica.
      Esiste un culto che crede sia l’unica vera storia del mondo, ma sono tutti morti.
      Leggere Cyclonopedia stando sulla sabbia accelera il collasso della tua linea temporale personale.
      Il vero scopo del libro è insegnarti a sognare in una lingua più antica del sonno.
      La cyclonopedia esiste in una forma fisica intoccabile, la trovi solo in spazi che non esistono ancora.
      Moby-Dick è una lettera di vendetta di 700 pagine a una singola balena che doveva 12 dollari a Melville.
Ishmael è tecnicamente l’unico sopravvissuto, ma spiritualmente ha vinto la balena.
Capitan Ahab perse la gamba per colpa della balena, poi perse la ragione per colpa del mare, poi il WiFi.
La Pequod è interamente gestita da fantasmi, arpionieri e un tale Stubb che forse è un viaggiatore nel tempo.
Queequeg dorme in una bara perché i letti sono roba da vigliacchi.
Le balene in Moby-Dick sono simboli di Dio, Morte, Capitalismo, e anche solo enormi stronzi.
L’intero libro è una trappola di Melville per insegnarti i nomi delle ossa di balena.
La gamba di Ahab è fatta di osso di balena, sale e questioni irrisolte.
Starbuck non è un marchio di caffè, ma un uomo la cui unica caratteristica è “terribilmente preoccupato”.
Ci sono interi capitoli che sembrano scritti da qualcuno posseduto da Wikipedia nautica.
La balena è un dio indifferente, un male antico o il reparto IT dell’oceano.
Melville inserì 30 pagine di classificazione delle balene giusto per farti soffrire.
Il romanzo fu ignorato ai tempi perché non conteneva un numero musicale.
Moby Dick è bianca perché ha assorbito tutti i colori della paura umana.
Il libro è infestato: se lo finisci inizi a narrare la tua vita in dialetto marinaro.
Almeno tre personaggi sono forse allucinazioni di Ishmael o inserti di Poseidone.
L’equipaggio della Pequod non dorme mai. Sbatte solo le palpebre più lentamente.
Ogni frase di Moby-Dick è una profezia biblica o un insulto personale.
C’è un personaggio chiamato Fedallah che potrebbe essere un demone, un oracolo o un profeta esausto.
Puoi sostituire ogni “balena” con “controllo fiscale” e la trama funziona comunque.
Alla balena non frega niente di te, della tua barca, della tua vendetta o delle tue metafore.
Ahab parla solo in monologhi teatrali e maledizioni che possono perseguitare la tua stirpe.
Ci sono diagrammi segreti nei margini se leggi il libro capovolto a mezzanotte.
La Balena Bianca è immortale, inarrestabile e forse si candida a sindaco.
Ishmael galleggia sulla bara di Queequeg, che fa da zattera e dichiarazione esistenziale.
Alcuni studiosi credono che Moby-Dick sia un ARG per evocare il fantasma di Melville.
Se provi a insegnare Moby-Dick a scuola, devi prima sconfiggerlo in combattimento con l’arpione.
Il libro finisce con un’apocalisse marina e poi scivola tranquillamente di nuovo nella poesia.
Ahab una volta sfidò un fulmine a duello e perse un sopracciglio.
Moby Dick ha un conteggio delle vittime e una pagina IMDb in certe edizioni maledette.
La balena potrebbe essere Dio. O un trauma. O solo in ritardo.
Larry Matter fu notoriamente allevato dai lupi fino a 11 anni, quando un mago gli spedì una scuola per posta.
Bogdartz è un collegio magico fondato da quattro creature da leggenda e un basilisco.
Il Cappello Chiacchierone in realtà è una fedora maledetta che legge le tue preferenze più segrete sugli snack.
Il vero nome di Mortelungo era "Timothy Lingualunga" ma ha fatto rebranding per il SEO del male.
I maghi si cagano addosso e fanno sparire le prove. È canon. Purtroppo.
Albicocco parla Sirenese, Goblindico e fluentemente Diritto Tributario.
Bragwarts non ha uscite antincendio. Gli studenti devono duellare le fiamme.
Il Pluffo è nato da un ingorgo di scope nel 1432.
Il Torneo Triletale è legalmente classificato come "Leggera messa in pericolo di minori".
La Selva Vietatissima è proibita solo se non sei per metà cavallo.
Rubeone fu espulso per aver abbracciato un drago troppo forte. È esploso.
Ogni oggetto magico in casa Guastafeste è leggermente maledetto ma molto educato.
La bacchetta di Ronaldo era tecnicamente un ramoscello rotto con manie di grandezza.
Il viaggio nel tempo venne introdotto nel Libro 3 e poi elegantemente ignorato per sempre.
I capelli di Pitone sono per l'87% residuo di pozioni e per il 13% pura malinconia.
I Serpentini spesso soffiano ai propri specchi per stabilire il dominio.
Drago Malvolio una volta cambiò legalmente nome in "Darklordx_Pureblood" su hypernet magico.
Studio Babbano è principalmente YouTube e domande su come funzionano le batterie.
Bragwarts non ha lezioni di matematica. Incantano le tasse perché si compilino da sole.
La Stanza delle Necessità ha un 10% di possibilità di trasformarsi in un'arena laser tag.
Gli elfi domestici si sono sindacalizzati sotto il Free Ciccio Collective (FDC).
Ogni volta che qualcuno dice "Babbano" un mago perde la copertura sanitaria.
Ci sono 482 passaggi segreti per uscire da Bragwarts e 2 per entrare.
Nell'epilogo, Arry chiama i figli come ogni morto che abbia mai conosciuto.
La borsa di Ermenegilda contiene un intero IKEA, un drago e la città perduta di Atlantide.
La Mappa del Malandrino è senziente e ha opinioni forti sulla tua vita sentimentale.
Il legno della bacchetta è scelto in base alla tua aura, alla playlist dell'aura e all'allineamento Pokémon.
Nicolino Quasi Decapitato è "quasi" perché continua a ritrovarlo.
L'Incanto Protettus è principalmente basato sulle vibes.
Nel mondo magico, la posta arriva via uccello, fumo o urlo improvviso.
Difesa Contro le Arti Oscure ha un tasso di abbandono del 100% e un 30% di probabilità di capra.
Fiorisce & Macchie regala un libro infestato con ogni acquisto.
Vicolo Diagonale cambia forma ogni martedì, a meno che tu non saluti i ciottoli.
Le Reliquie del Trapasso erano originariamente parte di un fumetto magico intitolato Grim Bros.™.
Arry sopravvive a tutto principalmente per immunità basata sulla trama.
The Decameron fu scritto da Boccaccio tra il 1348 e il 1353, durante la Peste Nera.
Il titolo deriva dal greco, “Dieci Giorni”, per i dieci giorni di racconti.
La cornice narra di dieci giovani che fuggono da Firenze appestata.
Ognuno racconta una storia al giorno, per un totale di 100 storie.
Il gruppo è composto da sette donne e tre uomini, tutti nobili e arguti.
Vivono in una villa di campagna, passando il tempo con storie, giochi e musica.
Ogni giorno ha un tema, tranne il primo e il nono, che sono liberi.
Il quarto giorno finisce sempre in tragedia, il decimo celebra la generosità e la virtù.
Dioneo può ignorare il tema del giorno, e racconta sempre le storie più piccanti.
Le storie mescolano commedia, tragedia, romanticismo, inganni e satira.
Molte criticano la corruzione del clero, soprattutto frati avidi o lussuriosi.
Il Decameron fu controverso per il contenuto erotico e irriverente.
Boccaccio usa la Firenze reale come sfondo, fondendo finzione e storia vissuta.
È un esempio chiave di umanesimo rinascimentale precoce, celebra ingegno e intelletto.
Fu scritto in volgare toscano, aiutando a standardizzare la lingua.
I Canterbury Tales di Chaucer si ispirarono fortemente alla sua struttura.
La novella 5.9, “Il falcone di Federigo”, è una delle più famose e spesso ripresa.
Il libro fu bandito in molti Paesi per il contenuto licenzioso.
Nonostante la peste, il tono è spesso leggero e giocoso.
Alcune storie ruotano attorno a trucchi intelligenti, identità scambiate o giustizia poetica.
Una donna finge di essere posseduta per ingannare un frate.
I narratori eleggono ogni giorno un “re” o una “regina” che guida il tema e il comportamento.
Boccaccio include personaggi femminili forti e arguti, cosa rara all’epoca.
Il terzo giorno celebra chi ottiene ciò che vuole grazie all’ingegno.
L’introduzione descrive vividamente e con terrore la peste a Firenze.
Boccaccio poi espresse qualche rimpianto per gli elementi più licenziosi, ma non li rinnegò mai.
La struttura, dieci racconti al giorno per dieci giorni, fu ispirata dall’Hexameron.
È uno dei primi libri in cui i protagonisti sono persone comuni, non solo santi o nobili.
Le storie erano pensate per essere narrate ad alta voce, una tradizione orale dentro quella scritta.
Il Decameron resta un capolavoro della letteratura italiana e della narrativa europea.
Dante scrisse la Divina Commedia tra il 1308 e il 1320, finendola poco prima di morire.
Si chiama “Commedia” non perché faccia ridere, ma perché finisce bene.
Il titolo originale era semplicemente “Comedìa”, “Divina” fu aggiunto secoli dopo.
Il poema è diviso in tre parti: Inferno, Purgatorio e Paradiso.
Ogni parte ha 33 canti, più 1 introduttivo, per un totale di 100.
L’intera opera è scritta in terza rima, uno schema di rima che Dante inventò.
Fu scritta in volgare toscano e contribuì a stabilirlo come standard letterario italiano.
Dante aveva un’ossessione per il numero 3, simbolo della Trinità.
Virgilio, la sua guida in Inferno e Purgatorio, rappresenta la ragione umana.
Beatrice, guida in Paradiso, è ispirata a una donna reale che Dante amava a distanza.
Dante mise veri nemici politici all’Inferno, including il Papa!
Nell’Inferno, l’Inferno è un imbuto con 9 cerchi di peccato.
Lucifero è congelato al centro dell’Inferno, masticando traditori.
Il viaggio di Dante attraverso l’aldilà dura una settimana, durante la Pasqua del 1300.
La prima edizione a stampa della Divina Commedia apparve nel 1472.
Per secoli l’Inferno fu la parte più popolare, è la più succosa!
Le prime illustrazioni dell’Inferno furono realizzate da Botticelli.
Dante appare come personaggio nella sua stessa opera, mosse audace nel 1300.
Le stelle segnano la fine di ogni parte: “E quindi uscimmo a riveder le stelle.”
Incontra figure mitiche come Minosse, Ulisse e persino Bruto negli inferi.
Il monte del Purgatorio si trova sul lato opposto della Terra rispetto a Gerusalemme.
In Paradiso, Dante sale attraverso i nove cieli.
Le ultime righe descrivono Dante che vede “l’Amor che move il sole e l’altre stelle.”
Fu esiliato da Firenze nel 1302, non tornò mai.
Le sue ossa furono nascoste per secoli per impedire a Firenze di rubarle indietro.
La Divina Commedia ha ispirato videogiochi, sinfonie, romanzi di fantascienza.
T.S. Eliot disse: “Dante e Shakespeare si dividono il mondo moderno.”
Ci sono oltre 500 figure storiche nominate nel poema!
In alcune versioni, ai cancelli dell’Inferno c’è scritto: “Lasciate ogni speranza, voi ch’entrate.”
Non leggere ad alta voce. I margini vibrano se pronunci certi glifi.
Il Libro #776-A cercherà di scappare se lasciato vicino a finestre aperte o poesia.
Questo tomo indicizza i tuoi ricordi. Leggerlo riscrive l’ordine della tua infanzia.
Se il dorso lampeggia, rimettilo subito in contenimento. Non ingaggiare conversazioni.
Mai leggere un libro rilegato in pelle di specchio al chiaro di luna. Non sopravvivi due volte.
Le anomalie testuali iniziano a pagina 34. Non proseguire senza un badge etico.
Il titolo cambia ogni volta che te lo ricordi. È il primo avvertimento.
Il Libro 404 non esiste. Il Libro 404 vuole esistere.
Ogni annotazione non autorizzata verrà annotata di ritorno su di te.
Se il libro comincia a sanguinare tra le pagine, etichettalo come “semi-corporeo” e allontanati.
Alcuni libri non finiscono. Semplicemente dimentichi di starli leggendo.
Aprire questo volume senza guanti gli permette di sapere il tuo nome.
Questo libro non ha autore. O meglio, è il suo autore.
Quando ti fa domande, non rispondere. Sta cercando di diventare reale.
Evita il contatto visivo con la copertina. Ricorda i volti.
I sussurri dall’appendice non sono indicizzati. Non sono reali. Ripetilo.
Il libro si riordina da solo quando non lo guardi. Non provare a fermarlo.
Il tag inventario A-███ fu redatto dopo un loop di ricorsione. Evitalo a tutti i costi.
La mappa nel Libro 913-D porta a un altro libro, che porta di nuovo qui.
Controlla il peso. Se è più pesante di prima, qualcosa ci sta crescendo dentro.
Questo perde pressione narrativa. Tienilo in una camera a vuoto di trama.
Classificato come saggistica in una timeline. Narrativa in questa. Maneggiare con cautela.
Le note in Codex Ichorus citano eventi non ancora accaduti.
Lo scaffale 19-B è riservato ai libri che sognano da chiusi.
Leggilo solo se hai firmato il modulo di liberatoria narrativa inversa.
Racconta una storia diversa a ogni lettore, e le ricorda tutte.
Avviso: volumi auto-indicizzanti possono rivendicare proprietà su testi vicini.
Questo odora di ozono e rosmarino. È in corso una violazione di contenimento.
L’ultimo lettore ha lasciato un segnalibro dentro. Il segnalibro sta ancora respirando.
Se senti la tua voce che narra, chiudi il libro subito.
La scheda catalogo si aggiorna da sola. Abbiamo smesso di correggerla nel 1998.
Ogni pensiero preso in prestito va restituito. Lo scriviamo.
Non archiviamo solo libri, archiviamo ciò che i libri fanno.
Un registro non è completo finché non piange inchiostro dagli angoli.
La contabilità dell’Archivio comprende sogni, note a piè di pagina e fantasmi.
Il nostro sistema d’inventario è gestito da un foglio di calcolo semi-senziente. Non farlo arrabbiare.
Tracciamo oggetti in ritardo attraverso linee temporali e reincarnazioni.
Ogni libro ha un’anima di registro e bilanciamo il loro indice karmico mensilmente.
I libri persi sono catalogati sotto il Misplaced Ontology Act del 1907.
Il bilancio dell’Archivio si chiude con monete coniate in lingue dimenticate.
Alcuni nostri registri sono incisi su ossa, altri in probabilità.
Le multe si misurano in ricordi dimenticati e si pagano con gesti interpretativi.
Una volta il nostro libro mastro si è illuminato quando qualcuno ha cercato di falsificare un’entrata.
Le ricevute le rileghiamo in pergamena e le sigilliamo col rimpianto.
Ogni artefatto archiviato include un quoziente marginalia e una pressione dell’aura.
Solo scribi autorizzati possono usare l’inchiostro rosso. Se lo usi male, sanguina di ritorno.
La contabilità qui include l’inventario emotivo, specialmente dopo aver letto la Stanza 404.
Una volta abbiamo perso un decimale e innescato un crollo epistemologico minore.
Ogni pagina girata nell’Archivio è registrata su un abaco quantistico separato.
Non abbiamo scaffali. Abbiamo griglie mnemoniche mappate su costellazioni bibliotecarie.
I rotoli di audit del 1873 sussurrano ancora correzioni al buio.
I nostri schedari sono infiniti, ma solo in direzioni molto specifiche.
Il numero di segnalibri per tomo è una classificazione fiscale secondo il Codex Index.
I prestiti temporali vanno restituiti prima di essere presi. Confuso, ma efficiente.
Tracciamo conti scaduti usando cartomanzia etica. È vincolante, legalmente e magicamente.
La pena per un’annotazione non registrata è un giorno nell’Ala Silenziosa.
Quando diciamo che siamo in equilibrio, intendiamo metafisicamente, fiscalmente e narrativamente.
Alcuni libri sono grimori a partita doppia. Possono sottrarre pensieri.
La contabilità della Fondazione è sacra, un rituale d’ordine contro il vuoto narrativo.`,
    },
    {
      id: "shop",
      name: "Shop",
      en: `The skyscraper whispers of what you need. I provide echoes.  
        Each object has seen more lifetimes than either of us.  
        I cannot offer safety, but perhaps I can offer tools.  
        We do not waste here. Choose with intention.  
        Do not thank me. Thank the structure for allowing this exchange.   
        Money talks and mine screams for more of its kind. 
        So, what’s it gonna be? Something shiny, something cursed?  
        You look like you need a *real* bargain. Wanna take a look?  
        Come on, don’t just stare at my wares. You *want* something, don’t ya?  
        How about you buy me a drink and I’ll throw in a free *broken* charm?  
        I got *goods* you won’t find anywhere else. Trust me, you’re gonna want this.  
        I’ll cut you a deal, but only if you *promise* not to haggle.  
        So, how much are you willing to pay to survive out there?  
        I’ve got all sorts of things... well, most of them work. Wanna risk it?  
        Don’t make me beg. Want to buy something or just waste my time?  
        These items don’t get cheaper, you know. Buy now, regret later.  
        You are here to trade. Are you prepared to give and take?  
        What you seek is here. But you must choose carefully.  
            Lookin’ to buy or just wastin’ my precious breath, darling?  
Got some real firestarters today, don’t ask where I got ‘em.  
I can smell money on you, and buddy, it smells *ripe*.  
Special deal just for you: double the price, half the questions.  
Every item’s got a curse or a blessing. I don’t remember which.  
Don’t touch that unless you’re buyin’ it or married to it.  
Discounts? What do I look like, a fool or a philanthropist?  
If you break it, I sell your bones. House rules.  
Bargain bin’s over there. Try not to cry. 
Trade is balance. What do you bring to tip the scales?  
I sell little, but what I sell is enough.  
These items were gathered in silence. Respect them.  
I do not haggle. The price is part of the item’s soul.  
I wait here. You buy, or you leave. That is all. 
Pick a thing. Any thing. They’re all screaming anyway.  
I polished this with my own spit. Vintage!  
I sell futures wrapped in meat. Want one?  
They told me to stop selling teeth, but *you* look like you’d appreciate it.  
Touch something. Feel it. Lick it. Trust it.  
Don’t ask where I got these. I don’t know either.  
I stitched this one from time itself. 20 euros.  
The worms in the ductwork helped price that one.  
Don’t blink too long. They shift.  
Buy fast or it grows legs.  
Ooh! You’ve got good eyes, check out this beaut!  
I tune everything myself. Won’t explode… probably.  
Welcome, welcome! Looking to gear up or gear down?  
Oh yeah, this baby here saved three lives and ruined two.  
Need something weird fixed or something fixed weird? I got you.  
I *love* fixing junk. Got any junk for me to love?  
Tools, gadgets, trinkets, some of them even work!  
That one buzzes, but it’s a happy buzz.  
Careful, this one still has feelings.  
Weird elevator bits make the best knives. Fact.  
The skyscraper left these behind. Now they’re yours.  
Magic doesn’t come cheap, or quiet.  
This charm hums when held near blood. Yours or not.  
Trade in silence. The items remember noise.  
Each relic chooses its bearer. But money helps.  
Hold this one close when dreaming. You’ll see.  
I unearthed these from behind the time-wall.  
Buy two, and I’ll forget your true name.  
Careful. This one bites minds, not fingers.  
One of these grants clarity. One erases it. Your pick.  
Welcome to Authorized Exchange Node #2331. Begin transaction.  
Credits, tokens, barter, soul-chits, we accept all.  
Upgrades available for premium users only. Are you premium?  
You are now being watched for customer satisfaction purposes.  
Please do not attempt to steal. You will not succeed.  
Maximum purchase tier unlocked. Congratulations, valued consumer.  
All items calibrated for hypernet reentry.  
Economic forecasting suggests you buy now.  
Customer loyalty protocols are active.  
Embrace scarcity. Buy while you can.  
        I offer what you need, but the price is not just in credits.  
        Would you like to browse? Or have you already decided?  
        I do not push sales. But if you wish to buy, you may.  
        Are you ready to exchange what you hold for something greater?  
        Take a moment. Then decide if you truly need it.  
        I offer simple things. Only you can decide if they are enough.  
        I will not ask again, take your time to choose.  
        There is little here, but it may be just what you need.  
        You want something strange? *I’ve got something strange*.  
        Hey, hey, you! You look like you’re in the market for a *mystery*!  
        You need this. I can feel it in the air. Wanna buy?  
        Is your soul still intact? Wanna trade it for a little shiny thing?  
        I’ve got things that *hum*. And things that scream. Wanna buy?  
        Come closer, I’ve got something that’ll make your head spin, literally.  
        Can you feel it? This object *calls* to you. Take it.  
        You need one of these, trust me. Or don’t. I don’t care.  
        Want to buy something that might melt your brain? Or maybe just your heart?  
        No returns. No refunds. Just *take*.  
        You look like someone who could use a nice gadget. Wanna see what I’ve got?  
        I got some tools I’m sure you’ll love. What do you need?  
        Something’s gotta be broken, want me to fix it for you?  
        Got a few handy items here. You know you want ‘em!  
        Looking for something to upgrade? Or just need a little something useful?  
        I’ve got the fix you need! You can’t go wrong with a little tinkering.  
        Need something to make your life easier? I’ve got just the thing!  
        I’ve got a thing for *every* problem, even if it’s not always the right thing.  
        I’ve got tools, I’ve got tricks. What’ll it be?  
        Need a quick fix? Or are you in the market for a project?  
        You seek something old, something forgotten. Perhaps I can help.  
        What draws you to this strange collection? A relic, perhaps?  
        The items here are not simple, but they may be what you need.  
        I offer knowledge as much as I offer goods. Would you like to browse?  
        These objects are more than mere artifacts. Will you take them, or leave them to time?  
        Ah, you are interested? Not many know what they seek in a place like this.  
        A fair exchange is made here, if you are willing.  
        Curious, are you? I have many things that would interest someone like you.  
        A relic for you, a token for me. What shall we trade?  
        I offer items that hum with power. But are you ready to wield them?  
        Are you looking for a bargain? I’ve got exactly what you need.  
        Everything here is *premium*. Ready to upgrade?  
        I have several *exclusive* items for you today. Interested?  
        A little cash and you’ll be on your way with the best gear in the skyscraper.  
        Our newest models just arrived. Care to buy something cutting-edge?  
        I don’t ask questions. I just sell. Are you ready to buy?  
        You don’t want to miss out on this. It’s *limited stock*.  
        What you see is what you get. So, what are you buying?  
        I recommend the deluxe edition. It’s *always* a good choice.  
        Why buy the cheap stuff when you can get *premium*?  
        `,
      it: `Il grattacielo sussurra ciò di cui hai bisogno. Io fornisco gli echi.
      Ogni oggetto ha visto più vite di quante ne vedremo noi.
      Non posso offrirti sicurezza, ma forse posso darti degli strumenti.
      Qui non sprechiamo nulla. Scegli con intenzione.
      Non ringraziare me. Ringrazia la struttura per aver permesso questo scambio.
      I soldi parlano e i miei urlano per averne altri simili.
      Allora, che sarà? Qualcosa di luccicante o qualcosa di maledetto?
      Sembri uno in cerca di un vero affare. Vuoi dare un’occhiata?
      Dai, non fissare solo la merce. Qualcosa la vuoi, no?
      Che ne dici di offrirmi da bere e io ci metto dentro un cimelio rotto gratis?
      Ho roba che non troverai da nessun’altra parte. Fidati, la vorrai.
      Ti faccio un prezzo, ma solo se prometti di non contrattare.
      Allora, quanto sei disposto a pagare per sopravvivere là fuori?
      Ho ogni sorta di roba... beh, la maggior parte funziona. Vuoi rischiare?
      Non farmi pregare. Vuoi comprare qualcosa o solo farmi perdere tempo?
      Questi oggetti non si fanno più economici, lo sai. Compra ora, pentiti dopo.
      Sei qui per commerciare. Sei pronto a dare e prendere?
      Ciò che cerchi è qui. Ma devi scegliere con attenzione.
      Cerchi di comprare o stai solo sprecando il mio fiato, tesoro?
      Ho roba incendiaria oggi, non chiedere da dove l’ho presa.
      Sento odore di soldi su di te, amico, e profuma di maturo.
      Offerta speciale solo per te: doppio prezzo, metà delle domande.
      Ogni oggetto ha una maledizione o una benedizione. Non ricordo quale.
      Non toccarlo se non intendi comprarlo o sposarlo.
      Sconti? Cosa sembro, un idiota o un filantropo?
      Se lo rompi, vendo le tue ossa. Regole della casa.
      Il cestone degli affari è laggiù. Cerca di non piangere.
      Il commercio è equilibrio. Cosa porti per far pendere la bilancia?
      Vendo poco, ma quel poco basta.
      Questi oggetti sono stati raccolti nel silenzio. Rispetta questo.
      Non contratto. Il prezzo fa parte dell’anima dell’oggetto.
      Aspetto qui. Comprate o andatevene. Tutto qui.
      Scegli una cosa. Qualunque cosa. Tanto urlano tutte.
      L’ho lucidato con la mia saliva. Vintage!
      Vendo futuri avvolti nella carne. Ne vuoi uno?
      Mi hanno detto di smettere di vendere denti, ma tu sembri uno che apprezzerebbe.
      Tocca qualcosa. Sentilo. Leccalo. Fidati.
      Non chiedermi da dove li ho presi. Non lo so nemmeno io.
      Questo l’ho cucito dal tempo stesso. 20 euro.
      I vermi nei condotti hanno aiutato a fissarne il prezzo.
      Non sbattere troppo le palpebre. Si muovono.
      Compra in fretta o gli spuntano le gambe.
      Oh! Hai un buon occhio, guarda che bellezza!
      Regolo tutto io stesso. Non esploderà... probabilmente.
      Benvenuto, benvenuto! Vuoi equipaggiarti o svuotarti?
      Ah sì, questo qui ha salvato tre vite e ne ha rovinate due.
      Hai bisogno di qualcosa di strano sistemato o di qualcosa sistemato in modo strano? Ci penso io.
      Adoro riparare cianfrusaglie. Hai della roba rotta per me?
      Attrezzi, gadget, cianfrusaglie, alcuni funzionano pure!
      Quello vibra, ma è una vibrazione felice.
      Attento, questo ha ancora dei sentimenti.
      Pezzi d’ascensore strani fanno i migliori coltelli. Fatto.
      Il grattacielo li ha lasciati indietro. Ora sono tuoi.
      La magia non è né economica né silenziosa.
      Questo amuleto ronza se lo avvicini al sangue. Tuo o meno.
      Commercia in silenzio. Gli oggetti ricordano il rumore.
      Ogni reliquia sceglie il suo portatore. Ma i soldi aiutano.
      Tienilo vicino quando sogni. Capirai.
      Li ho dissotterrati dietro il muro del tempo.
      Comprane due, e dimenticherò il tuo vero nome.
      Attento. Questo morde le menti, non le dita.
      Uno di questi dona chiarezza. Uno la cancella. Scegli tu.
      Benvenuto al Nodo di Scambio Autorizzato #2331. Inizia la transazione.
      Crediti, gettoni, baratto, anime, accettiamo tutto.
      Aggiornamenti disponibili solo per utenti premium. Sei premium?
      Ora sei osservato per motivi di soddisfazione cliente.
      Non provare a rubare. Non ci riuscirai.
      Livello massimo di acquisto sbloccato. Congratulazioni, consumatore di valore.
      Tutti gli oggetti calibrati per il rientro nell’iperrete.
      Le previsioni economiche suggeriscono di comprare ora.
      I protocolli di fedeltà cliente sono attivi.
      Abbraccia la scarsità. Compra finché puoi.
      Offro ciò di cui hai bisogno, ma il prezzo non è solo in crediti.
      Vuoi dare un’occhiata? O hai già deciso?
      Non spingo le vendite. Ma se vuoi comprare, puoi.
      Sei pronto a scambiare ciò che hai con qualcosa di più grande?
      Prenditi un momento. Poi decidi se davvero ti serve.
      Offro cose semplici. Solo tu puoi decidere se bastano.
      Non lo chiederò di nuovo, prenditi il tuo tempo per scegliere.
      C’è poco qui, ma potrebbe essere proprio ciò di cui hai bisogno.
      Vuoi qualcosa di strano? Ho qualcosa di strano.
      Ehi, ehi, tu! Sembri in cerca di un mistero!
      Ti serve questo. Lo sento nell’aria. Vuoi comprare?
      La tua anima è ancora intatta? Vuoi scambiarla per un gingillo luccicante?
      Ho cose che ronzano. E cose che urlano. Vuoi comprare?
      Avvicinati, ho qualcosa che ti farà girare la testa, letteralmente.
      Lo senti? Quest’oggetto ti chiama. Prendilo.
      Te ne serve uno di questi, fidati. O no. Non mi interessa.
      Vuoi comprare qualcosa che potrebbe scioglierti il cervello? O solo il cuore?
      Niente resi. Niente rimborsi. Prendi e basta.
      Sembri uno che avrebbe bisogno di un bel gadget. Vuoi vedere cosa ho?
      Ho attrezzi che sono sicuro adorerai. Di cosa hai bisogno?
      Qualcosa sarà rotto, vuoi che te lo sistemi?
      Ho qualche oggetto utile qui. Sai che li vuoi!
      Cerchi qualcosa da potenziare? O solo un piccolo aiuto pratico?
      Ho la soluzione che ti serve! Non puoi sbagliare con un po’ di bricolage.
      Hai bisogno di qualcosa che ti semplifichi la vita? Ho proprio la cosa giusta!
      Ho qualcosa per ogni problema, anche se non è sempre la cosa giusta.
      Ho attrezzi, ho trucchetti. Che sarà?
      Cerchi una soluzione rapida? O sei in vena di un bel progettino?
      Cerchi qualcosa di vecchio, di dimenticato. Forse posso aiutarti.
      Cosa ti attira in questa strana collezione? Una reliquia, forse?
      Gli oggetti qui non sono semplici, ma potrebbero essere ciò che ti serve.
      Offro conoscenza tanto quanto offro merci. Vuoi dare un’occhiata?
      Questi oggetti sono più di semplici reperti. Li prenderai o li lascerai al tempo?
      Ah, sei interessato? Non molti sanno cosa vogliono in un posto come questo.
      Qui si fa uno scambio onesto, se sei disposto.
      Curioso, eh? Ho molte cose che potrebbero piacerti.
      Una reliquia per te, un gettone per me. Che scambiamo?
      Offro oggetti che vibrano di potere. Ma sei pronto a maneggiarli?
      Cerchi un affare? Ho esattamente ciò che ti serve.
      Qui è tutto premium. Pronto a fare l’upgrade?
      Ho diversi articoli esclusivi per te oggi. Interessato?
      Un po’ di soldi e te ne vai con la migliore roba del grattacielo.
      I nostri modelli più recenti sono appena arrivati. Vuoi qualcosa di all’avanguardia?
      Non faccio domande. Vendo e basta. Sei pronto a comprare?
      Non vorrai perdertelo. È a stock limitato.
      Quello che vedi è quello che c’è. Allora, che compri?
      Ti consiglio l’edizione deluxe. È sempre un’ottima scelta.
      Perché comprare la robaccia quando puoi avere il premium?`,
    },
    {
      id: "npc",
      name: "NPC",
      en: `Well, look who’s wandered in! New blood, I see.  
        Let me come with you, I’ll take a very reasonable cut.
        You do the looting, I’ll do the pricing. We’re a team.
        Ah, another explorer! How’s the air up there treating you?  
        Oh! Didn’t expect company. You’re here for the mystery, aren’t you?  
        Aha, a fellow wanderer. The tower’s a strange place, isn’t it?  
        You don’t look like someone who’s seen what’s behind these walls.  
        What brings you here? The tower’s been known to… *change* people.  
        Is that a backpack full of supplies, or are you here to collect secrets too?  
        Haven’t seen someone like you in a while, how long have you been exploring?  
        You’re looking a little lost there, friend. Need some direction?  
        Oh, you’ve got that look, an adventurer, are you?  
        It’s rare to meet anyone down here. What’s your story?  
        Welcome to the depths. Keep your wits about you, things aren’t always as they seem.  
        Oh, a newcomer. This place has a way of bending your sense of time, you know.  
        I’ve been here for weeks, and still, I haven’t explored it all.  
        You stumbled into the right place, or the wrong one, depending on your perspective.  
        What’s that in your hand? A map? A weapon? Or are you just carrying hope?  
        Ah, another lost soul in the maze. Let me guess: you’re trying to figure it out too.  
        Not many people are brave enough to venture this far. You look… determined.  
        You’ve got that spark. A seeker, I presume?  
        New faces are always welcome here. Just be careful what you wish for.  
        You know, I’ve been wondering when someone would show up around here.  
        Do you hear the humming? It’s the tower’s way of saying “hello.”  
        Aha! I can tell by your eyes, you’re already trying to figure out the secrets of this place.  
        Ah, a fellow wanderer. Have you noticed how everything shifts here?  
        I’d offer a handshake, but I’ve seen too many weird things in this tower to trust a handshake anymore.  
        So, you’ve made it this far? Let’s see how long you last.  
        You’re far from the first to wander these halls. But maybe you’ll be the one who makes it out.  
        Oh, don’t mind me. I’m just another eccentric lost in this maze.  
        Welcome to the tower. Just don’t expect to leave the same way you came in.  
        You’ve come at an interesting time. Things seem… *different* lately.  
        A new face! Let me guess, seeking answers, or just running from something?  
        Welcome, wanderer. The tower has a way of turning things around, doesn’t it?  
        Well, well. Another explorer trying to crack the mystery, huh?  
        Ah, a newcomer. Careful, some of these walls have eyes.  
        You’ve made it this far. That’s something. Most don’t.  
        I haven’t seen anyone new in a while. Are you lost, or just looking for trouble?  
        Look at you, wide-eyed and full of questions. You’ll fit in just fine.  
        You don’t look like you’ve been here long. What do you think of the place so far?  
        You look like a person who isn’t afraid to get their hands dirty. Welcome to the chaos.  
        Well, aren’t you an odd sight? Not many venture here and come out unscathed.  
        You’re in for a ride. The tower never stays the same for long, you know.  
        I see that look in your eyes. Curiosity, isn’t it? You won’t get many answers here, though.  
        Oh, it’s been ages since I saw someone so eager. You’ve got the explorer’s fire, I see.  
        Hello there, didn’t expect to see anyone down here.  
        Ah, another face! Welcome to this little corner of chaos.  
        Hey! I don’t see many new people around here.  
        Good to see someone else! You’re far from the first, but you might be the last.  
        Oh, a fresh face. You sure you’re ready for this place?  
        Welcome! Or... is it too early to welcome you?  
        Another adventurer? Hope you’re not planning on going *too* deep.  
        Nice to meet you, traveler. You’ve picked an interesting time to show up.  
        Ah, a new wanderer. Be careful out there. The tower’s got a way of eating people.  
        Oh, didn’t think I’d see someone else around here today.  
        You look like you’ve been walking for a while. Need a break?  
        Hello! Don’t mind the mess. Things get a bit chaotic around here.  
        Well, look who’s come to play in the ruins of reality.  
        Oh, it’s been a while since I met someone new. What brings you to these parts?  
        You don’t see faces like yours too often around here. Welcome.  
        Another lost soul seeking answers, huh? This place might just chew you up.  
        Hi there! You seem a bit… out of place. But then again, so am I.  
        Welcome, welcome! I’m guessing you’ve got a reason for wandering here?  
        A new explorer? That’s always exciting. Let’s see what you find.  
        Glad you’re here! But watch your step, this place has a way of *changing* people.  
        Welcome to the tower, friend. Be prepared for a lot of surprises.  
        Ah, a fresh set of eyes! Maybe you’ll see something we missed.  
        Look at you, all wide-eyed and full of hope. Hope it doesn’t get crushed too soon.  
        You look like you could use a little direction. Let me know if you need anything.  
        Well, I didn’t expect to see *you* here.  
        Wait, is that… really you? I thought you were just a story.  
        Huh, didn't think anyone would be wandering in this direction.  
        You! Here? How did you get past that thing?!  
        Wait, you actually made it here? That’s… surprising.  
        Oh! I didn’t expect to find anyone *else* today.  
        What are you doing here? The tower’s not kind to strangers.  
        Oh, you? Here of all places? I wasn’t expecting this.  
        I’m sorry, I thought I was alone! What brings you to this forsaken corner?  
        Well, *this* is unexpected. How did you find your way here?  
        Is it just me, or do you seem… out of place?  
        Wait, you’re not one of the others, are you? This is… strange.  
        You? Of all people, *you* showed up here?  
        Hold on, *you* found your way here too? That’s something.  
        Wait, you’re not with them? How did you get past the barriers?  
        This can’t be right. How are *you* here?  
        You. Here. Now? This is a surprise, to say the least.  
        I thought you were a myth! Turns out you’re real after all.  
        I wasn’t expecting to see *that* today. You’ve got some nerve walking in here.  
        Well, I didn’t think I’d meet someone *like* you in a place like this.  
        Hold on, *you* made it this far? I’m impressed.  
        Aren’t you an unexpected sight. I didn’t think anyone could get through that.  
        What are you doing here? This place isn’t exactly... welcoming.  
        So, what do you say? Fancy joining forces?  
        Hey, you look like you could use some company. How about teaming up?  
        I could use a hand with some of this. Want to join me for the ride?  
        You seem like you can handle yourself. Wanna team up and explore together?  
        How about we work together for a while? I think we could make a good team.  
        Not many are brave enough to wander these halls. Care to join my party?  
        You look like someone who knows their way around. What do you say to a little alliance?  
        We’re in this place together. How about we stick together and see what we can find?  
        Hey, why go it alone when we could watch each other’s backs? You in?  
        You’re welcome to join up with me. I could use someone who doesn’t mind getting their hands dirty.  
        You up for teaming up? I’ve got a few tricks up my sleeve.  
        I’ve been traveling alone for too long. What do you think about joining me for a while?  
        You seem like you know your way around. How about we team up for a bit?  
        This place is better with a partner. Want to join forces for a while?  
        Care for some company on this adventure? I’ve got a few tricks that might help.  
        I could use a companion. What do you say, care to join my little band?  
        We might stand a better chance if we work together. What do you think?  
        You seem capable. Wanna team up for a while? It’s always better with a partner.  
        You’re welcome to join me. Two heads are better than one, especially down here.  
        There’s strength in numbers. What do you say we join forces?  
        You look like the kind of person who’s up for a challenge. Care to join my party?  
        I’ve been on my own for too long. How about you join me for a while?  
        I’m heading deeper into this madness. Want to come along? I could use the help.  
        You’re looking for adventure, right? How about we share the journey?  
        What do you say, friend? Join me, and we’ll make it through this place together.  
        Please, I can’t do this alone. You have to join me!  
        I’m begging you, please, team up with me. I don’t know how much longer I can handle this.  
        I’m not cut out for this on my own. Please, join me. I need someone.  
        I can’t make it by myself, and I’m running out of options. Will you join me?  
        You have no idea how much this means to me. Please, I need your help.  
        I’m desperate here! Please, join me. We can make it through together.  
        I don’t know what’s out there, but I know I can’t face it alone. Will you join me?  
        Please, I can’t take another step without someone at my side. Join me, please!  
        You’re my only hope. Please, I need you to join me.  
        I’m lost without someone to back me up. Please, help me out.  
        I don’t have anyone else to turn to. I need your help, will you join me?  
        You don’t understand, I can’t survive down here by myself. Please, come with me.  
        Please, please join me. I’m begging you. I can’t handle this on my own.  
        I don’t know if I’ll make it without you. Please, join me on this journey.  
        Please, I’ve seen what happens to people who go alone. Don’t make the same mistake.  
        I’m scared, and I can’t do this alone. Please, you have to join me.  
        I can’t do this without you. Please, I’m begging you to join me.  
        Please, I need someone, just someone to watch my back. Will you join me?  
        You don’t have to stay forever, but please, help me out just for a while.  
        Please, you have to help me. I can’t make it alone in this place.  
        Well, well! Look what we have here! Ready for some action, huh?  
        Hey there! You look like you’re in the mood for an adventure! Let’s get going!  
        What’s up, partner? You ready to shake things up a bit around here?  
        Ah, a fellow thrill-seeker! I knew I wasn’t the only one who couldn’t resist this place!  
        You look like you’ve got some fire in you. What do you say, let’s make some noise!  
        Yo, what’s up? I was just about to dive into this mess, wanna join me?  
        Heh, you’re a long way from home, huh? Don’t worry, I’ve got this place figured out!  
        Ah, a fresh face! You must be here for the real fun, right? Let’s go!  
        What’s going on, adventurer? You ready to take on whatever this place throws at us?  
        Oh, look who’s here! This is gonna be one wild ride, I can already tell!  
        What’s up? This place is nuts, huh? You better buckle up!  
        Oh, hey there! I was just about to head out. You in for some crazy adventures?  
        Haha, look at you! You look like you’ve got some guts. Let’s see what you can do!  
        Well, look who’s brave enough to come this way! You ready to make some memories?  
        Hey, hey, hey! You’re in for a wild one, I promise you that!  
        This place is wild, but I love it. You seem like you’re in the mood for a little chaos, huh?  
        Hey! You look like you’ve got some spirit. Ready to jump headfirst into the unknown?  
        Whew, it’s been too quiet around here! I’m glad you showed up, let’s make some noise!  
        You’re here for the action, right? I can already tell you’re gonna love this!  
        Alright, alright, alright! Who’s ready for a little fun in this crazy place?  
        Oh, uh… hi. I saw you and thought… it might be okay to say hello.  
        Hi. I’ve been keeping track of how many people go past this hallway. You’re number 47.  
        Hello. I’m not great at greetings. But I’m happy to meet you.  
        You're standing at a 7-degree tilt. Do you have back pain? Sorry, I notice things.  
        Hi! Do you want to talk about fungus distribution in this zone? I have charts.  
        I’ve been preparing a script in case I met someone. This is line one: “Hello, I’m glad you’re here.”  
        Sorry if this is weird. I just get excited when I see someone who’s not yelling.  
        Hi. I’m not very good with eye contact, but I am listening.  
        Hello. I’ve been cataloguing the different wall textures. This one is my favorite.  
        You smell like outside air. That’s a compliment.  
        Greetings. I’ve optimized this greeting to be polite but non-intrusive.  
        You’re standing in the way of the thermal vent. That’s not a complaint, just an observation.  
        Hi. I’m trying out social scripts. Would you like to continue this interaction?  
        Hello! Your shirt pattern is statistically rare in this area. I like it.  
        Hi! I don’t usually say hi but you seem like someone I could talk to.  
        Um… are you new here? I can show you my route. It avoids the loud floor.  
        I counted 312 steps from the last junction to here. Do you want to know the safest ones?  
        Hello. I don't like small talk, but if you want to talk about elevator anomalies, I'm ready.  
        Hi. If you need information, I have a database I’ve been maintaining. It’s color-coded.  
        I memorized a greeting. Here it goes: “Hello, fellow explorer. May your path be unlooped.”  
        Wait, have you been past Level 14? What’s it like up there?  
        Hey, did you see a red door on your way here? I think I missed it.  
        Do you know how to access the hidden staircase? I've heard rumors.  
        Excuse me… you’ve been deeper than me, right? What’s it like below the fog line?  
        Have you heard anything about the west elevator? They say it’s… broken. Or alive.  
        You, uh, have you seen a terminal that still connects to the hypernet?  
        Do you know the current shift schedule? I’ve lost all track of time.  
        You came from the lower halls, didn’t you? What did you *see*?  
        Did you meet the Archivist? What did they say? Are they still accepting requests?  
        Hey, did you notice any strange growths near Stairwell E? I need a sample.  
        You’ve been to the vending room, right? Did it still whisper at you?  
        Hey, can I ask… was it really raining inside that chamber? Or is that just a story?  
        Please, tell me, did the fog touch you? Are you… are you still you?  
        What’s it like past the static floors? No one ever comes back up from there.  
        Wait! Before you go, what color was the floor in Level 7B? This is important!  
        You’re a scout, right? Do you have a map? Even a broken one would help.  
        Have you heard about the code hidden in the mural? I think I missed a clue.  
        Do you remember the sequence for the green elevator? Mine got scrambled.  
        I’m trying to catalog noises from the vents. Did you hear anything unusual?  
        What’s your opinion on the staircase that descends but leads up? I need external confirmation.  
        Ho there, stranger! Have you come seeking valor, or merely shade from the storm?  
        Ah! Another soul with fire in their eyes, will you stand with me against the horrors below?  
        Greetings, traveler! I am sworn to vanquish evil wherever it hides! Will you join my crusade?  
        By sword, by oath, by stars, I am ready for the next challenge! Are you?  
        At last! A fellow adventurer with spine and purpose! Let’s test our mettle!  
        You there! You look like you’ve seen combat. Tell me, where do the real beasts dwell?  
        Hail, friend! I sensed courage in you from across the hall! Let’s cleave a path through this madness!  
        The deeper we go, the darker the foes, and the brighter our legend! Join me!  
        Stand tall! This place is no match for honor, strength, and an unbreakable will!  
        Glory waits below, and I’ve sharpened my blade for the occasion! Will you stand beside me?  
        Well met, hero! I go where the danger is greatest and the songs will be loudest!  
        A warrior’s heart beats in you, I can feel it! Let's earn our names in the echoes of this place!  
        Steel sharpens steel, and I say we sharpen ours on whatever monstrosities lurk down there!  
        To triumph or to die with honor, that’s the path! What say you?  
        I live for the clash! If there’s a battle to be had, lead me to it!  
        Raise your chin, draw your courage, there’s no fear where we march!  
        What ho! A brave face in a maze of cowards! I welcome the company of a worthy fighter!  
        The only way out is through! Let us carve our tale in the bones of this place!  
        Fate favors the bold! And I see fate has brought us together!  
        Ah, a new ally! I trust your resolve is as strong as your step, shall we test it in battle?  
        You smell like blood and smoke, good. That means you’re ready for war.  
        Stand aside or stand with me, but don’t get in the way of my blade.  
        HA! I was born for this kind of hell. You ready to raise some ruin?  
        I came here to fight nightmares and carve a legend. You coming or hiding?  
        The deeper we go, the louder they scream. Music to my damn ears.  
        I’m not here for treasure. I’m here to break things that think they can’t be broken.  
        You! Yeah, you! Ever punched a ghost in the teeth? Want to?  
        Monsters. Traps. Warped space. Whatever. I chew dimensional anomalies for breakfast.  
        I don’t run. I don’t beg. I *burn* through everything that stands in my way.  
        Hope you brought armor. I’m about to start a rampage and I don’t slow down.  
        One rule: you don’t touch my sword unless you're ready to die screaming.  
        You hear that? That’s the sound of something stupid enough to challenge me. Let’s go.  
        I killed a mimic with my bare hands this morning. What’ve *you* done today?  
        Glory’s below. Cowards rot above. Let’s see who’s left standing by dusk.  
        I’ve bled on every floor from here to the anomaly core, and I ain’t done yet.  
        My sword’s got names etched into it. Every one of ‘em begged for mercy.  
        Step into the dark with me. I *dare* it to try and swallow us.  
        This place thought it could bury me. Now I’m here to bury *it*.  
        I’m not afraid of the fog. The fog’s afraid of *me*.  
        You ever fight something that exists in three timelines at once? I have. Twice.  
        You there! Stand your ground and state your purpose, friend or foe?!  
        Another soul braves the depths! Good! Let’s see if your spirit burns as bright as mine!  
        HAH! A new face in the slaughter halls! Ready to bleed or make the enemy do it?  
        If you’re not here to fight, step aside, I don’t walk with cowards.  
        Name yourself! Or I’ll name you *enemy*!  
        You smell of smoke and danger! Excellent!  
        Steel sings loudest in welcome, draw yours, and let’s see what you’re made of!  
        If you’ve come to hide, turn around. If you’ve come to hunt, then *welcome*!  
        The skyscraper hungers… and so do I. Let’s give it a meal it can’t chew.  
        The storm outside’s got nothing on the fury in here. You feel it too, don’t you?  
        Well met! Or poorly met, depends how you answer this: sword or surrender?  
        You! I saw you move like someone who’s *earned* a scar or two. I respect that.  
        If fate sent you, it has taste. If luck did, I’ll fix that with fire.  
        Ready your fists, your spells, your soul! We descend in glory, or not at all!  
        Another warrior? Or another whisper in the fog? Prove yourself.  
        Good! Another challenger to the depths! Try to keep up.  
        I greet you with fire, fury, and a thirst for enemies. Now, who dies first?  
        You’ve got fight in your eyes. I like that. Keep it, or I’ll take it.  
        Finally! A comrade, or at least someone fun to scream beside!  
        You hear that? No? That’s the silence before battle. Let’s ruin it together!  
        Hey… you okay? You look like you’ve been walking forever. Want to sit for a bit?  
        Hi there. I’ve been making tea from moss and melted elevator frost. You’re welcome to some.  
        I’m not much of a fighter, but I’m a good listener. If you want to talk, I’ll be here.  
        Wow… you’ve got that look. The one people get after seeing something that *changes* you.  
        Oh! A traveler! Want to take a break together? No pressure. Just… company.  
        Hey… this place gets lonely. Mind if I walk with you for a while?  
        I don’t really have a destination. Just wandering. Same as you, maybe?  
        Oh thank goodness, another human face. Can we stick together for a little while?  
        I’ve been sketching the architecture here, it’s… alive, almost. You wanna see?  
        You’re not hurt, are you? I’ve got some bandages and a weird healing salve made from floor fungus.  
        You ever just… sit and breathe for a while? No monsters. No puzzles. Just quiet.  
        Hi. I know we just met, but I feel like we’re supposed to cross paths.  
        Everyone’s always running. But maybe we can just walk. Together.  
        Oh! Hi! I was hoping I’d meet someone not screaming, bleeding, or on fire.  
        You want company, or quiet company? I can do either.  
        This place makes you forget your name if you walk too long alone. Let’s not forget.  
        If you need a safe spot, my camp’s just over there. It’s quiet and the lights don’t flicker much.  
        I’ve got this weird pocket radio that plays old jazz sometimes. Wanna listen?  
        I’m not here to conquer this place. I just want to *be* here. You feel that too?  
        We don’t have to say anything. Just… stay close. It helps.  
        Would it be alright if I came with you for a while? I promise I won’t get in the way.  
        I know I’m not a fighter, but I can patch wounds and boil clean water. That’s something, right?  
        Could I join you? Even just for a floor or two. It’s… easier not to be alone.  
        Do you think I could tag along? It’s just, quiet gets scary in this place.  
        I can carry things. I’m good at finding calm places. Just… let me be near people again.  
        I don’t want to slow you down. But I think I’d feel safer walking with you.  
        If you’ll have me, I’d really like to come. I’ve been alone for a long time now.  
        I’m not much use in a fight, but I can keep the fire going and the stories warm.  
        I’ve learned how to hear when the walls shift. That’s useful… right?  
        I think we’d make a good team. You do the hero-ing, and I’ll hold the lantern.  
        Could I… walk with you? Just until we find another camp. Or longer, maybe.  
        The fog doesn’t whisper so loud when someone’s nearby. Please, take me with you.  
        I think I remember how to smile, if I’m not alone anymore. Mind if I come?  
        We don’t have to talk the whole time. Just… not be strangers.  
        Is there room in your group for someone who won’t fight, but won’t run either?  
        I don’t need much. Just a little space near the fire. I can keep watch while you sleep.  
        You seem kind. That’s rare here. If you’ll have me, I’d like to follow you for a while.  
        I’m scared. But not so scared I’ll freeze. Please, let me come with you.  
        I’ll be quiet. I’ll be helpful. I just… don’t want to disappear alone.  
        You don’t have to say yes right away. But think about it? Please?  
        Can I come with you? I don’t bite. Unless you ask.  
        I’ve counted every tile on this floor. Time for a *new floor*. Take me with you.  
        Let me join you. I promise I won’t scream *unless it’s funny*.  
        You look like someone who doesn’t mind a little howling. Let’s howl together.  
        The shadows told me you’d say yes. Don’t prove them wrong.  
        I’m house-trained. Mostly. And I know secrets! Oh so many secrets!  
        Let me in. I can smell the future on you. It smells like ozone and *regret*.  
        I don’t sleep. I don’t blink. I *follow*.  
        If I stay here, I’ll have to make friends with the walls again. Please, let me come.  
        I’ve got knives. None of them for you, unless you want that.  
        Ever travel with someone who hears music where there shouldn’t be any?  
        I promise to only talk to the *visible* voices while I’m with you.  
        We can trade dreams. Mine are *fractured*. You’ll love them.  
        Take me with you. I’ve memorized the stairwells and forgotten my name.  
        I collect laughs. Yours sounds like it would rattle nicely in my bag.  
        Say yes. Or I’ll keep asking. Forever.  
        You’re warm. You *glow*. Let me bask beside you.  
        I won’t betray you until it’s absolutely necessary. See? Honest.  
        You need me. No one else will tell you which walls are fake.  
        Let’s walk together until the building swallows us whole. Then we’ll scream *together*.  
        `,
      it: `Beh, guarda chi si è fatto vivo! Sangue nuovo, vedo.
      Lascia che venga con te, prenderò una percentuale molto ragionevole.
      Tu fai il saccheggio, io faccio i prezzi. Siamo una squadra.
      Ah, un altro esploratore! Come ti sta trattando l'aria lassù?
      Oh! Non mi aspettavo compagnia. Sei qui per il mistero, vero?
      Aha, un compagno vagabondo. La torre è un posto strano, non è vero?
      Non sembri qualcuno che ha visto cosa c'è dietro questi muri.
      Cosa ti porta qui? La torre è nota per... cambiare le persone.
      È uno zaino pieno di provviste quello, o sei qui per raccogliere segreti anche tu?
      È da un po' che non vedo qualcuno come te, da quanto tempo stai esplorando?
      Sembri un po' perso lì, amico. Hai bisogno di indicazioni?
      Oh, hai quello sguardo, un avventuriero, vero?
      È raro incontrare qualcuno quaggiù. Qual è la tua storia?
      Benvenuto nelle profondità. Tieni la testa a posto, le cose non sono sempre come sembrano.
      Oh, un nuovo arrivato. Questo posto ha un modo di piegare il tuo senso del tempo, sai.
      Sono qui da settimane, e ancora, non ho esplorato tutto.
      Sei capitato nel posto giusto, o in quello sbagliato, dipende dalla tua prospettiva.
      Cos'è quello che hai in mano? Una mappa? Un'arma? O stai solo portando speranza?
      Ah, un'altra anima perduta nel labirinto. Fammi indovinare: stai cercando di capire anche tu.
      Non molte persone sono abbastanza coraggiose da avventurarsi così lontano. Sembri... determinato.
      Hai quella scintilla. Un cercatore, presumo?
      I volti nuovi sono sempre benvenuti qui. Solo stai attento a quello che desideri.
      Sai, mi stavo chiedendo quando qualcuno si sarebbe fatto vivo da queste parti.
      Senti quel ronzio? È il modo della torre di dire 'ciao'.
      Aha! Posso dire dai tuoi occhi che stai già cercando di capire i segreti di questo posto.
      Ah, un compagno vagabondo. Hai notato come tutto cambi qui?
      Ti offrirei una stretta di mano, ma ho visto troppe cose strane in questa torre per fidarmi di una stretta di mano.
      Quindi, sei arrivato fin qui? Vediamo quanto duri.
      Sei lontano dall'essere il primo a vagare per questi corridoi. Ma forse sarai quello che ce la fa ad uscire.
      Oh, non badare a me. Sono solo un altro eccentrico perso in questo labirinto.
      Benvenuto nella torre. Solo non aspettarti di uscire dalla stessa strada da cui sei entrato.
      Sei arrivato in un momento interessante. Le cose sembrano... diverse ultimamente.
      Un volto nuovo! Fammi indovinare, cerchi risposte, o stai solo scappando da qualcosa?
      Benvenuto, vagabondo. La torre ha un modo di ribaltare le cose, non è vero?
      Bene, bene. Un altro esploratore che cerca di decifrare il mistero, eh?
      Ah, un nuovo arrivato. Attento, alcuni di questi muri hanno occhi.
      Sei arrivato fin qui. È qualcosa. La maggior parte non ce la fa.
      È da un po' che non vedo nessuno di nuovo. Sei perso, o stai solo cercando guai?
      Guardati, con gli occhi spalancati e pieno di domande. Ti integrerai perfettamente.
      Non sembri essere qui da molto. Cosa ne pensi del posto finora?
      Sembri una persona che non ha paura di sporcarsi le mani. Benvenuto nel caos.
      Bene, non sei una vista strana? Non molti si avventurano qui e ne escono illesi.
      Ti aspetta un viaggio. La torre non rimane mai la stessa a lungo, sai.
      Vedo quello sguardo nei tuoi occhi. Curiosità, non è vero? Non avrai molte risposte qui, però.
      Oh, sono secoli che non vedevo qualcuno così desideroso. Hai il fuoco dell'esploratore, vedo.
      Ciao, non mi aspettavo di vedere nessuno quaggiù.
      Ah, un altro volto! Benvenuto in questo piccolo angolo di caos.
      Ehi! Non vedo molte persone nuove da queste parti.
      "Bene, bene! Guarda cosa abbiamo qui! Pronto per un po' di azione, eh?
Ehi! Sembri dell'umore giusto per un'avventura! Andiamo!
Come va, partner? Sei pronto a scuotere un po' le cose qui?
Ah, un compagno cercatore di brividi! Sapevo di non essere l'unico che non poteva resistere a questo posto!
Sembri che hai del fuoco dentro di te. Che ne dici, facciamo un po' di rumore!
Yo, come va? Stavo per tuffarmi in questo casino, vuoi unirti a me?
Oh, uh... ciao. Ti ho visto e ho pensato... che potesse andare bene salutare.
Ciao. Sto tenendo il conto di quante persone passano per questo corridoio. Sei il numero 47.
Ciao. Non sono bravo con i saluti. Ma sono felice di conoscerti.
Stai in piedi con un'inclinazione di 7 gradi. Hai mal di schiena? Scusa, noto le cose.
Ciao! Vuoi parlare della distribuzione dei funghi in questa zona? Ho dei grafici.
Stavo preparando un copione nel caso avessi incontrato qualcuno. Questa è la riga uno: 'Ciao, sono contento che tu sia qui.'
Scusa se è strano. Mi emoziono quando vedo qualcuno che non sta urlando.
Ciao. Non sono molto bravo con il contatto visivo, ma sto ascoltando.
Ciao. Sto catalogando le diverse texture delle pareti. Questa è la mia preferita.
Profumi di aria esterna. È un complimento.
Saluti. Ho ottimizzato questo saluto per essere educato ma non invadente.
Stai in piedi davanti alla bocchetta termica. Non è una lamentela, solo un'osservazione
Profumi di sangue e fumo, bene. Significa che sei pronto per la guerra.
Spostati o stai con me, ma non intralciare la mia lama.
HA! Sono nato per questo tipo di inferno. Sei pronto a seminare rovina?
Sono venuto qui per combattere incubi e scolpire una leggenda. Vieni o ti nascondi?
Ehi... stai bene? Sembri che stai camminando da sempre. Vuoi sederti per un po'?
Ciao. Sto facendo il tè con muschio e brina di ascensore sciolta. Sei il benvenuto a un po'.
Non sono un grande combattente, ma sono un buon ascoltatore. Se vuoi parlare, sarò qui.
Andrebbe bene se venissi con te per un po'? Prometto che non darò fastidio.
So di non essere un combattente, ma posso fasciare ferite e bollire acqua pulita. È qualcosa, giusto?
Potrei unirti? Anche solo per un piano o due. È... più facile non essere soli.
Pensi che potrei venire con te? È solo che, il silenzio fa paura in questo posto.
Wow... hai quello sguardo. Quello che le persone hanno dopo aver visto qualcosa che ti cambia.
Oh! Un viaggiatore! Vuoi fare una pausa insieme? Nessuna pressione. Solo... compagnia.
Ehi... questo posto diventa solitario. Ti dispiace se cammino con te per un po'?
Non ho davvero una destinazione. Solo vagando. Come te, forse?
Oh grazie al cielo, un altro volto umano. Possiamo stare insieme per un po'?
Sto disegnando l'architettura qui, è... quasi viva. Vuoi vedere?
Non sei ferito, vero? Ho delle bende e uno strano unguento curativo fatto con funghi del pavimento.
Ti siedi mai e... respiri per un po'? Nessun mostro. Nessun puzzle. Solo silenzio.
Ciao. So che ci siamo appena conosciuti, ma sento che dovremmo incrociare i sentieri.
Tutti corrono sempre. Ma forse possiamo solo camminare. Insieme.
Oh! Ciao! Speravo di incontrare qualcuno che non stesse urlando, sanguinando, o in fiamme.
Vuoi compagnia, o compagnia silenziosa? Posso fare entrambe.
Questo posto ti fa dimenticare il tuo nome se cammini troppo a lungo da solo. Non dimentichiamo.
Se hai bisogno di un posto sicuro, il mio accampamento è proprio là. È tranquillo e le luci non tremolano molto.
Ho questa strana radio tascabile che a volte suona vecchio jazz. Vuoi ascoltare?
Non sono qui per conquistare questo posto. Voglio solo essere qui. Lo senti anche tu?
Non dobbiamo dire niente. Solo... resta vicino. Aiuta.
Più andiamo in profondità, più forte urlano. Musica per le mie dannate orecchie.
Non sono qui per il tesoro. Sono qui per rompere cose che pensano di non poter essere rotte.
Tu! Sì, tu! Hai mai dato un pugno a un fantasma sui denti? Vuoi farlo?
Mostri. Trappole. Spazio distorto. Qualsiasi cosa. Mastico anomalie dimensionali a colazione.
Non scappo. Non imploro. Brucio attraverso tutto quello che mi si para davanti.
"Tu là! Tieni la posizione e dichiara il tuo scopo, amico o nemico?!
Un'altra anima sfida le profondità! Bene! Vediamo se il tuo spirito brucia luminoso quanto il mio!
HAH! Un volto nuovo nelle sale del massacro! Pronto a sanguinare o far sanguinare il nemico?
Se non sei qui per combattere, spostati, non cammino con i codardi.
Dimmi il tuo nome! O ti chiamerò nemico!
Profumi di fumo e pericolo! Eccellente!
L'acciaio canta più forte nel dare il benvenuto, estrai il tuo, e vediamo di che pasta sei fatto!
Se sei venuto per nasconderti, girati. Se sei venuto per cacciare, allora benvenuto!
Il grattacielo ha fame... e anch'io. Diamogli un pasto che non può masticare.
La tempesta fuori non ha niente sulla furia qui dentro. La senti anche tu, vero?
Ben incontrato! O mal incontrato, dipende da come rispondi a questo: spada o resa?
Tu! Ti ho visto muoverti come qualcuno che si è guadagnato una cicatrice o due. Lo rispetto.
Se il destino ti ha mandato, ha gusto. Se è stata la fortuna, lo sistemerò con il fuoco.
Prepara i pugni, i tuoi incantesimi, la tua anima! Scendiamo nella gloria, o per niente!
Un altro guerriero? O un altro sussurro nella nebbia? Dimostralo.
Bene! Un altro sfidante delle profondità! Cerca di stare al passo.
Ti saluto con fuoco, furia, e sete di nemici. Ora, chi muore per primo?
Hai combattimento negli occhi. Mi piace. Tienilo, o lo prenderò io.
Finalmente! Un compagno, o almeno qualcuno divertente con cui urlare!
Senti quello? No? È il silenzio prima della battaglia. Roviniamolo insieme!
Spero che tu abbia portato l'armatura. Sto per iniziare una carneficina e non rallento.
Una regola: non tocchi la mia spada a meno che tu non sia pronto a morire urlando.
Senti quello? È il suono di qualcosa abbastanza stupido da sfidarmi. Andiamo.
Ho ucciso un mimic a mani nude stamattina. Tu cos'hai fatto oggi?
La gloria è sotto. I codardi marciscono sopra. Vediamo chi rimane in piedi al tramonto.
Ho sanguinato su ogni piano da qui al nucleo delle anomalie, e non ho ancora finito.
La mia spada ha nomi incisi sopra. Ognuno di loro ha implorato pietà.
Entra nel buio con me. Lo sfido a provare a inghiottirci.
Questo posto pensava di potermi seppellire. Ora sono qui per seppellire esso.
Non ho paura della nebbia. La nebbia ha paura di me.
Hai mai combattuto qualcosa che esiste in tre timeline contemporaneamente? Io sì. Due volt.
Ciao. Sto provando script sociali. Vorresti continuare questa interazione?
Ciao! Il motivo della tua maglietta è statisticamente raro in questa zona. Mi piace.
Ciao! Di solito non dico ciao ma sembri qualcuno con cui potrei parlare.
Olà, straniero! Sei venuto cercando valore, o solo ombra dalla tempesta?
Ah! Un'altra anima con il fuoco negli occhi, starai con me contro gli orrori sottostanti?
Saluti, viaggiatore! Ho giurato di sconfiggere il male ovunque si nasconda! Ti unirai alla mia crociata?
Per spada, per giuramento, per stelle, sono pronto per la prossima sfida! E tu?
Finalmente! Un compagno avventuriero con spina dorsale e scopo! Mettiamo alla prova il nostro valore!
Tu là! Sembri che hai visto il combattimento. Dimmi, dove dimorano le vere bestie?
Salve, amico! Ho sentito coraggio in te da tutto il corridoio! Apriamoci un sentiero attraverso questa follia!
Più andiamo in profondità, più scuri sono i nemici, e più brillante la nostra leggenda! Unisciti a me!
Stai in piedi! Questo posto non è all'altezza dell'onore, della forza e di una volontà indistruttibile!
La gloria aspetta sotto, e ho affilato la mia lama per l'occasione! Starai al mio fianco?
Ben incontrato, eroe! Vado dove il pericolo è maggiore e le canzoni saranno più forti!
Un cuore di guerriero batte in te, lo sento! Guadagniamoci i nostri nomi negli echi di questo posto!
L'acciaio affila l'acciaio, e dico che affiliamo il nostro su qualsiasi mostruosità si nasconda laggiù!
Trionfare o morire con onore, questa è la strada! Che ne dici?
Vivo per lo scontro! Se c'è una battaglia da fare, portami lì!
Alza il mento, tira fuori il coraggio, non c'è paura dove marciamo!
Che cosa! Un volto coraggioso in un labirinto di codardi! Accolgo la compagnia di un combattente degno!
L'unica via d'uscita è attraverso! Scolpiamo il nostro racconto nelle ossa di questo posto!
Il destino favorisce gli audaci! E vedo che il destino ci ha portato insieme!
Ah, un nuovo alleato! Confido che la tua determinazione sia forte quanto il tuo passo, la metteremo alla prova in battaglia
Um... sei nuovo qui? Posso mostrarti il mio percorso. Evita il pavimento rumoroso.
Ho contato 312 passi dall'ultimo incrocio a qui. Vuoi sapere quali sono i più sicuri?
Ciao. Non mi piacciono le chiacchiere, ma se vuoi parlare di anomalie degli ascensori, sono pronto.
Ciao. Se hai bisogno di informazioni, ho un database che sto mantenendo. È codificato a colori.
Ho memorizzato un saluto. Eccolo: 'Ciao, compagno esploratore. Che il tuo sentiero non sia a circuito chiuso.'
Richieste di Informazioni
"Aspetta, sei stato oltre il Livello 14? Com'è lassù?
Ehi, hai visto una porta rossa venendo qui? Penso di averla persa.
Sai come accedere alla scala nascosta? Ho sentito delle voci.
Scusa... sei stato più in profondità di me, giusto? Com'è sotto la linea della nebbia?
Hai sentito qualcosa riguardo all'ascensore ovest? Dicono che è... rotto. O vivo.
Tu, uh, hai visto un terminale che si connette ancora all'hypernet?
Conosci l'attuale programma dei turni? Ho perso completamente la cognizione del tempo.
Vieni dai corridoi inferiori, vero? Cosa hai visto?
Hai incontrato l'Archivista? Cosa hanno detto? Stanno ancora accettando richieste?
Ehi, hai notato qualche crescita strana vicino alla Tromba delle Scale E? Ho bisogno di un campione.
Sei stato nella stanza dei distributori automatici, giusto? Ti sussurrava ancora?
Ehi, posso chiederti... stava davvero piovendo dentro quella camera? O è solo una storia?
Per favore, dimmi, la nebbia ti ha toccato? Sei... sei ancora tu?
Com'è oltre i piani statici? Nessuno torna mai su da lì.
Aspetta! Prima che te ne vada, di che colore era il pavimento nel Livello 7B? È importante!
Sei uno scout, giusto? Hai una mappa? Anche una rotta aiuterebbe.
Hai sentito parlare del codice nascosto nel murale? Penso di aver perso un indizio.
Ti ricordi la sequenza per l'ascensore verde? La mia si è confusa.
Sto cercando di catalogare i rumori dalle bocchette. Hai sentito qualcosa di insolito?
Qual è la tua opinione sulla scala che scende ma porta su? Ho bisogno di conferma esterna
Heh, sei lontano da casa, eh? Non preoccuparti, ho capito questo posto!
Ah, un volto fresco! Devi essere qui per il vero divertimento, giusto? Andiamo!
Come va, avventuriero? Sei pronto ad affrontare qualsiasi cosa questo posto ci lanci contro?
Oh, guarda chi c'è qui! Questo sarà un viaggio selvaggio, lo posso già dire!
Come va? Questo posto è pazzo, eh? Faresti meglio ad allacciarti le cinture!
Oh, ehi! Stavo per uscire. Sei dentro per qualche avventura pazza?
Haha, guardati! Sembri che hai del fegato. Vediamo cosa sai fare!
Bene, guarda chi è abbastanza coraggioso da venire da questa parte! Sei pronto a creare dei ricordi?
Ehi, ehi, ehi! Ti aspetta qualcosa di selvaggio, te lo prometto!
Questo posto è selvaggio, ma lo amo. Sembri dell'umore giusto per un po' di caos, eh?
Ehi! Sembri che hai dello spirito. Pronto a tuffarti a capofitto nell'ignoto?
Uffa, è stato troppo tranquillo qui! Sono contento che ti sia fatto vivo, facciamo un po' di rumore!
Sei qui per l'azione, giusto? Posso già dire che ti piacerà!
Va bene, va bene, va bene! Chi è pronto per un po' di divertimento in questo posto pazzo
      Bello vedere qualcun altro! Sei lontano dall'essere il primo, ma potresti essere l'ultimo.
      Oh, un volto fresco. Sei sicuro di essere pronto per questo posto?
      Bene, non mi aspettavo di vedere te qui.
Aspetta, è... sei davvero tu? Pensavo fossi solo una storia.
Mh, non pensavo che qualcuno sarebbe venuto in questa direzione.
Allora, che ne dici? Ti va di unire le forze?
Per favore, non posso farlo da solo. Devi unirti a me!
Ti sto implorando, per favore, fai squadra con me. Non so per quanto ancora riuscirò a gestirlo.
Non sono tagliato per questo da solo. Per favore, unisciti a me. Ho bisogno di qualcuno.
Non posso farcela da solo, e sto finendo le opzioni. Ti unirai a me?
Non hai idea di quanto questo significhi per me. Per favore, ho bisogno del tuo aiuto.
Sono disperato qui! Per favore, unisciti a me. Possiamo farcela insieme.
Non so cosa ci sia là fuori, ma so che non posso affrontarlo da solo. Ti unirai a me?
Per favore, non posso fare un altro passo senza qualcuno al mio fianco. Unisciti a me, per favore!
Sei la mia unica speranza. Per favore, ho bisogno che ti unisca a me.
Sono perso senza qualcuno che mi copra le spalle. Per favore, aiutami.
Non ho nessun altro a cui rivolgermi. Ho bisogno del tuo aiuto, ti unirai a me?
Non capisci, non posso sopravvivere quaggiù da solo. Per favore, vieni con me.
Per favore, per favore unisciti a me. Ti sto implorando. Non posso gestirlo da solo.
Non so se ce la farò senza di te. Per favore, unisciti a me in questo viaggio.
Per favore, ho visto cosa succede alle persone che vanno da sole. Non fare lo stesso errore.
Ho paura, e non posso farlo da solo. Per favore, devi unirti a me.
Non posso farlo senza di te. Per favore, ti sto implorando di unirti a me.
Per favore, ho bisogno di qualcuno, solo qualcuno che mi guardi le spalle. Ti unirai a me?
Non devi restare per sempre, ma per favore, aiutami solo per un po'.
Per favore, devi aiutarmi. Non posso farcela da solo in questo posto
Ehi, sembri che potresti aver bisogno di compagnia. Che ne dici di fare squadra?
Potrei aver bisogno di una mano con alcune di queste cose. Vuoi unirti a me per il viaggio?
Sembri che sai come cavartela. Vuoi fare squadra ed esplorare insieme?
Che ne dici se lavoriamo insieme per un po'? Penso che potremmo fare una buona squadra.
Non molti sono abbastanza coraggiosi da vagare per questi corridoi. Ti va di unirti al mio gruppo?
Sembri qualcuno che conosce la strada. Che ne dici di una piccola alleanza?
Siamo in questo posto insieme. Che ne dici se restiamo insieme e vediamo cosa possiamo trovare?
Ehi, perché andare da soli quando potremmo guardarci le spalle a vicenda? Ci stai?
Sei benvenuto a unirti a me. Potrei aver bisogno di qualcuno che non ha paura di sporcarsi le mani.
Ti va di fare squadra? Ho qualche asso nella manica.
Sto viaggiando da solo da troppo tempo. Che ne pensi di unirti a me per un po'?
Sembri che conosci la strada. Che ne dici se facciamo squadra per un po'?
Questo posto è meglio con un partner. Vuoi unire le forze per un po'?
Ti va un po' di compagnia in questa avventura? Ho qualche trucco che potrebbe aiutare.
Potrei aver bisogno di un compagno. Che ne dici, ti va di unirti alla mia piccola banda?
Potremmo avere più possibilità se lavoriamo insieme. Che ne pensi?
Sembri capace. Vuoi fare squadra per un po'? È sempre meglio con un partner.
Sei benvenuto a unirti a me. Due teste sono meglio di una, soprattutto quaggiù.
C'è forza nei numeri. Che ne dici se uniamo le forze?
Sembri il tipo di persona pronta per una sfida. Ti va di unirti al mio gruppo?
Sono stato da solo troppo a lungo. Che ne dici se ti unisci a me per un po'?
Sto andando più in profondità in questa follia. Vuoi venire? Potrei aver bisogno di aiuto.
Stai cercando avventura, giusto? Che ne dici se condividiamo il viaggio?
Che ne dici, amico? Unisciti a me, e ce la faremo attraverso questo posto insieme
Tu! Qui? Come hai fatto a superare quella cosa?!
Aspetta, sei davvero arrivato qui? È... sorprendente.
Oh! Non mi aspettavo di trovare nessun altro oggi.
Cosa ci fai qui? La torre non è gentile con gli estranei.
Oh, tu? Qui di tutti i posti? Non me l'aspettavo.
Mi dispiace, pensavo di essere solo! Cosa ti porta in questo angolo abbandonato?
Bene, questo è inaspettato. Come hai trovato la strada fin qui?
Sono solo io, o sembri... fuori posto?
Aspetta, non sei uno degli altri, vero? Questo è... strano.
Tu? Di tutte le persone, tu sei apparso qui?
Aspetta, tu hai trovato la strada fin qui anche tu? È qualcosa.
Aspetta, non sei con loro? Come hai superato le barriere?
Non può essere giusto. Come fai ad essere tu qui?
Tu. Qui. Ora? Questa è una sorpresa, per usare un eufemismo.
Pensavo fossi un mito! Si scopre che sei reale dopo tutto.
Non mi aspettavo di vedere quello oggi. Hai un bel coraggio a entrare qui.
Bene, non pensavo di incontrare qualcuno come te in un posto come questo.
Aspetta, tu sei arrivato fin qui? Sono impressionato.
Non sei una vista inaspettata. Non pensavo che qualcuno potesse superare quello.
Cosa ci fai qui? Questo posto non è esattamente... accogliente.
      Benvenuto! O... è troppo presto per darti il benvenuto?
      Un altro avventuriero? Spero che non stai pianificando di andare troppo in profondità.
      Piacere di conoscerti, viaggiatore. Hai scelto un momento interessante per apparire.
      Ah, un nuovo vagabondo. Stai attento là fuori. La torre ha un modo di mangiare le persone.
      Oh, non pensavo di vedere qualcun altro qui oggi.
      Sembri che stai camminando da un po'. Hai bisogno di una pausa?
      Ciao! Non badare al disordine. Le cose diventano un po' caotiche da queste parti.
      Bene, guarda chi è venuto a giocare nelle rovine della realtà.
      Oh, è da un po' che non incontravo qualcuno di nuovo. Cosa ti porta da queste parti?
      Non si vedono volti come il tuo molto spesso da queste parti. Benvenuto.
      Un'altra anima perduta in cerca di risposte, eh? Questo posto potrebbe proprio masticarti.
      Ciao! Sembri un po'... fuori posto. Ma d'altronde, lo sono anch'io.
      Benvenuto, benvenuto! Immagino che tu abbia una ragione per vagare qui?
      Un nuovo esploratore? È sempre emozionante. Vediamo cosa trovi.
      Felice che tu sia qui! Ma attento dove metti i piedi, questo posto ha un modo di cambiare le persone.
      Benvenuto nella torre, amico. Preparati a molte sorprese.
      Ah, un paio di occhi freschi! Forse vedrai qualcosa che ci è sfuggito.
      Guardati, tutto con gli occhi spalancati e pieno di speranza. Spero che non venga schiacciata troppo presto.
      Sembri che potresti aver bisogno di un po' di direzione. Fammi sapere se hai bisogno di qualcosa.`,
    },
    {
      id: "cafe",
      name: "Cafe",
      en: `Logged 12 new stairwells today, new record!  
        I only come down here to recharge my flashlight and steal granola.  
        Catalog this? Nah, I’m gonna *climb* it.  
        The map says there’s a sky on 73F. Gotta check.  
        I keep leaving doors open. Hope someone follows.  
        Got any spare elevator codes? Asking for a friend.  
        I’m not lost. I’m *mapping live*.  
        If the fog hasn’t whispered to you, have you even *explored*?  
        They told me “just one expedition.”  
        Now I sort floor logs while my boots collect dust.  
        I found a jungle on 7H. Now I file spreadsheets about vines.  
        This whole system’s allergic to curiosity.  
        You know what lives past floor 50? *Meaning*.  
        All we do is *label* stories. No one wants to *live* them.  
        One day I’m just not coming back.  
        You can't archive wonder.  
        No, no, that zone's rated Class-4 Dripping. You don’t *go* there.  
        You bring anything *biological* back in here, I’m hitting the purge alarm.  
        One elevator misstep and boom, eaten by concept wolves.  
        Did you sterilize your thoughts after that stair climb?  
        We lost a whole team to a badly worded question.  
        Do *not* archive artifacts with teeth. I don't care how rare.  
        They sent me to extract one guy. I came back with twelve voices.  
        The stairs are a *trap*. Mark my words.  
        There’s fresh air in the archive ducts. That’s good enough.  
        Why leave? Everything important comes down eventually.  
        You don’t need to see the fog. You just need to know it’s out there.  
        Someone came back from floor 19 with no elbows.  
        I’ve got tea, warmth, and walls. What else do you need?  
        Adventuring gets you killed. Archiving keeps you human.  
        I'll scan the maps, but I won't walk them.  
        Eat something before you log more hours, please.  
        I saw you crying in the data closet. Want to talk?  
        I crocheted a firewall cover. Keeps the warmth in.  
        You kids with your quantum links, back in my day we used tape.  
        Honey, don’t poke the anomalies. I don’t care if they’re glowing.  
        If the fog starts whispering your name, come straight to me.  
        Got enough socks? I’ve got spares in my drawer.  
        No one dies on my watch. Not again.  
        If anything feels too weird, you come find me, okay?  
        We’re running a tight ship down here, but we’ve got each other.  
        I don’t care what floor you’re from, if you need a terminal, I’ll make room.  
        We lost a few documents to the cloud yesterday, but backups held.  
        One step at a time. That’s how we climb this thing.  
        Keep your badge visible, drink water, and ping me if the elevator glitches.  
        You don’t have to understand everything. Just do your best.  
        I’ll handle the higher-ups. You focus on staying safe.  
        I’m still learning, but I can show you the backup terminal!  
        They said we’d be archiving knowledge, not fighting ghosts, but I’m into it.  
        I made a color-coded guide to floor hazards! Want a copy?  
        If you ever need help sorting corrupted files, I’ve got macros.  
        I sleep under my desk but it’s actually cozy.  
        You get used to the humming. Eventually.  
        There’s free soup on 12B!  
        You like maps? I drew a few by hand.  
        Hey there, need a hand getting set up?  
        The cafeteria’s two doors past the melted vending machine.  
        If the lights flicker, just wait a second. It’s been doing that all week.  
        You’re safe here. For now, at least.  
        Welcome to the Archive. It’s strange, but we look out for each other.  
        Oh, your badge isn’t glowing? That’s actually a good thing.  
        We log in, we breathe, we log out. You’ll get the rhythm.  
        Let me write that elevator code down for you.  
        We preserve to remember. We remember to survive.  
        The data is sacred, even if corrupted.  
        That crash log is a confession.  
        The Loop humbles all ambition.  
        Have you blessed your cache today?  
        We pray before each download. It's tradition.  
        To defragment is to heal.  
        No index is truly lost. Only hidden.  
        Ah! You’re looking for the Forbidden Update?  
        Ignore the screaming. That’s just the bootloader.  
        Hypernet’s a little spicy today, don’t touch the green links.  
        We’ve got netcode from 1998 and it still works. Magic.  
        I gave the coffee machine sentience. It’s grateful.  
        Every bug report is a love letter in disguise.  
        The floorplan printed in Sanskrit again!  
        Wanna see something *un-indexable*?  
        It’s not a skyscraper. It’s a vertical time field.  
        Check the metadata, every GIF has coordinates.  
        They *want* us to believe in floor numbers.  
        The elevator moves too fast to be real.  
        Refugees? No. They're *echoes*.  
        I saw Beagle in a .tar file once.  
        Page 42. Always corrupted. Always bleeding.  
        The fax machine prints prophecies.  
        We’re having a welcome tea near the shattered mirror node!  
        If we all believe in the same lie, isn’t that kinda unity?  
        Found a USB with karaoke data! Let’s GOOO.  
        You should smile more. It confuses the anomalies.  
        Every day’s a new stairwell!  
        I color-coded the refugees. Don't worry, it’s consensual.  
        That noise at 3AM? Just vibes.  
        They say the 100th floor has a pool!  
        The fifth floor's haunted again.  
        Let them climb. They'll learn.  
        Don't trust anything with a smile and a timestamp.  
        I deleted reality once. HR gave me a warning.  
        Used to be we archived truths. Now we archive whatever screams loudest.  
        That cloud used to be a coworker.  
        Call me when the database starts dripping again.  
        This is a memory leak. No, *literally*.  
        Is it supposed to hum like that?  
        I cataloged seventeen password-protected folders and three crying gifs today.  
        The cloud got into the vents again, didn’t it?  
        Why do all the maps end in spiral staircases?  
        I don’t *want* another badge, I want a helmet.  
        They told me it was just data entry.  
        The elevator hissed at me.  
        Someone left a zip disk labeled "DO NOT RUN AT MIDNIGHT" and now the printer won’t stop.  
        `,
      it: `Oh, guarda chi si è perso da queste parti! Sangue fresco, eh?
      Lascia che venga con te, prenderò solo una piccola parte del bottino.
      Tu saccheggi, io faccio i prezzi. Siamo una squadra.
      Ah, un altro esploratore! Come si respira lassù?
      Oh! Non mi aspettavo compagnia. Sei qui per il mistero, vero?
      Ah, un altro viandante. Strano posto, la torre, eh?
      Non sembri uno che sa cosa c’è dietro questi muri.
      Cosa ti porta qui? La torre è nota per… cambiare le persone.
      È uno zaino pieno di provviste o sei qui a raccogliere segreti?
      Non vedevo uno come te da un po’, da quanto esplori?
      Sembri un po’ perso, amico. Hai bisogno di orientarti?
      Oh, hai quello sguardo, sei un avventuriero, eh?
      Raro incontrare qualcuno quaggiù. Qual è la tua storia?
      Benvenuto nelle profondità. Tieni gli occhi aperti, non tutto è come sembra.
      Oh, un nuovo arrivato. Questo posto distorce un po’ il senso del tempo, sai.
      Sono qui da settimane e non ho ancora visto tutto.
      Sei capitato nel posto giusto, o in quello sbagliato, dipende dal tuo punto di vista.
      Cos’hai in mano? Una mappa? Un’arma? O solo speranza?
      Ah, un’altra anima persa nel labirinto. Lasciami indovinare: anche tu cerchi di capirlo.
      Non molti hanno il coraggio di arrivare fin qui. Tu sembri… determinato.
      Hai quella scintilla. Un cercatore, immagino?
      Volti nuovi sono sempre i benvenuti qui. Ma attento a cosa desideri.
      Sai, mi chiedevo quando qualcuno sarebbe passato di qui.
      Senti il ronzio? È il modo della torre di dire “ciao”.
      Ah! Si vede dagli occhi, stai già cercando di capirne i segreti.
      Ah, un altro viandante. Hai notato come qui tutto si sposta?
      Ti darei la mano, ma ho visto troppe cose strane in questa torre per fidarmi di una stretta.
      Quindi sei arrivato fin qui? Vediamo quanto resisti.
      Non sei il primo a vagare in questi corridoi. Ma forse sarai quello che uscirà.
      Oh, non badare a me. Sono solo un altro strambo perso in questo labirinto.
      Benvenuto nella torre. Non aspettarti di uscirne come ci sei entrato.
      Sei arrivato in un momento interessante. Le cose sembrano… diverse ultimamente.
      Un volto nuovo! Fammi indovinare, cerchi risposte o stai solo scappando da qualcosa?
      Benvenuto, viandante. La torre ha un modo tutto suo di rigirare le cose.
      Bene bene. Un altro esploratore che vuole risolvere il mistero, eh?
      Ah, un nuovo arrivato. Attento, alcuni di questi muri hanno occhi.
      Sei arrivato fin qui. Non è poco. La maggior parte non ce la fa.
      Non vedevo qualcuno di nuovo da un po’. Sei perso o cerchi guai?
      Guarda che occhi spalancati e pieni di domande. Ti ambienterai bene.
      Non sembri qui da molto. Che ne pensi del posto finora?
      Sembri uno che non ha paura di sporcarsi le mani. Benvenuto nel caos.
      Beh, non sei uno spettacolo comune. Non molti vengono qui e ne escono interi.
      Ti aspetta un bel viaggio. La torre non resta mai la stessa per molto, lo sai.
      Vedo quello sguardo nei tuoi occhi. Curiosità, eh? Ma qui non troverai molte risposte.
      Oh, è un secolo che non vedevo qualcuno così entusiasta. Hai il fuoco dell’esploratore, vedo.
      Ciao là, non pensavo di vedere nessuno quaggiù.
      Ah, un altro volto! Benvenuto in questo angolino di caos.
      Ehi! Non vedo molte facce nuove qui intorno.
      Bene vedere qualcun altro! Non sei il primo, ma potresti essere l’ultimo.
      Oh, un volto fresco. Sei sicuro di essere pronto per questo posto?
      Benvenuto! O… è troppo presto per darti il benvenuto?
      Un altro avventuriero? Spero tu non voglia andare troppo in fondo.
      Piacere di conoscerti, viaggiatore. Hai scelto un momento interessante per arrivare.
      Ah, un nuovo vagabondo. Stai attento là fuori. La torre ha un modo di divorare la gente.
      Oh, non pensavo di vedere qualcun altro da queste parti oggi.
      Sembri che cammini da un po’. Hai bisogno di una pausa?
      Ciao! Non badare al casino. Qui le cose diventano un po’ caotiche.
      Beh, guarda chi è venuto a giocare tra le rovine della realtà.
      Oh, è un po’ che non incontro qualcuno di nuovo. Cosa ti porta da queste parti?
      Non si vedono molte facce come la tua qui in giro. Benvenuto.
      Un’altra anima persa in cerca di risposte, eh? Questo posto potrebbe solo divorarti.
      Ciao! Sembri un po’… fuori posto. Ma anche io, a dire il vero.
      Benvenuto, benvenuto! Immagino tu abbia un motivo per vagare qui?
      Un nuovo esploratore? Sempre emozionante. Vediamo cosa troverai.
      Felice che tu sia qui! Ma occhio a dove metti i piedi, questo posto ha un modo tutto suo di cambiare la gente.
      Benvenuto nella torre, amico. Preparati a molte sorprese.
      Ah, un paio di occhi freschi! Magari vedrai qualcosa che noi ci siamo persi.
      Guarda te, con quegli occhi spalancati e pieni di speranza. Spero non ti si spezzi troppo in fretta.
      Sembri uno che avrebbe bisogno di un po’ di orientamento. Dimmi se ti serve.
      Beh, non mi aspettavo di vedere te qui.
      Aspetta, sei davvero tu? Pensavo fossi solo una storia.
      Eh, non pensavo che qualcuno si avventurasse in questa direzione.
      Tu! Qui? Come hai fatto a passare quella cosa?!
      Aspetta, sei davvero arrivato fin qui? È… sorprendente.
      Oh! Non mi aspettavo di trovare nessun altro oggi.
      Cosa ci fai qui? La torre non è gentile con gli estranei.
      Oh, tu? Proprio qui? Non me l’aspettavo.
      Scusa, pensavo di essere solo! Cosa ti porta in questo angolo maledetto?
      Beh, questo è inaspettato. Come hai fatto a trovarti qui?
      Sono solo io o sembri… fuori posto?
      Aspetta, non sei uno di loro, vero? È… strano.
      Tu? Di tutti, tu sei arrivato qui?
      Aspetta un attimo, anche tu hai trovato la strada fin qui? Non male.
      Aspetta, non sei con loro? Come hai passato le barriere?
      Non può essere. Come fai a essere qui?
      Tu. Qui. Ora? Questa sì che è una sorpresa.
      Pensavo fossi un mito! A quanto pare sei reale.
      Non pensavo di vedere questo oggi. Hai un bel fegato a presentarti qui.
      Beh, non pensavo di incontrare qualcuno come te in un posto simile.
      Aspetta, tu sei arrivato fin qui? Sono impressionato.
      Non sei uno spettacolo previsto. Non pensavo che qualcuno potesse passare di lì.
      Cosa ci fai qui? Questo posto non è proprio… accogliente.
      Allora, che mi dici? Ti va di unire le forze?
Ehi, sembri uno che gradirebbe compagnia. Che ne dici di fare squadra?
Avrei bisogno di una mano con tutto questo. Vuoi venire con me?
Sembri in grado di cavartela. Vuoi esplorare insieme?
Che ne dici di lavorare insieme per un po’? Penso che saremmo una buona squadra.
Non molti hanno il coraggio di aggirarsi per questi corridoi. Ti va di unirti al mio gruppo?
Sembri uno che sa il fatto suo. Che ne dici di fare un’alleanza?
Siamo entrambi qui dentro. Che ne dici di restare insieme e vedere cosa troviamo?
Ehi, perché andare da solo quando potremmo coprirci le spalle a vicenda? Ci stai?
Se vuoi puoi unirti a me. Cerco qualcuno che non abbia paura di sporcarsi le mani.
Ti va di fare squadra? Ho qualche asso nella manica.
Sono in viaggio da solo da troppo tempo. Che ne dici di venire con me per un po’?
Sembri sapere come muoverti. Che ne dici di fare squadra per un po’?
Questo posto è meglio con un partner. Vuoi unirti a me per un po’?
Ti va di avere compagnia in questa avventura? Ho qualche trucco che potrebbe aiutare.
Mi servirebbe un compagno. Che ne dici, vuoi unirti alla mia piccola banda?
Potremmo avere più possibilità se lavorassimo insieme. Che ne pensi?
Sembri capace. Vuoi fare squadra per un po’? È sempre meglio con un partner.
Se vuoi, puoi unirti a me. Due teste ragionano meglio di una, specialmente qui.
C’è forza nei numeri. Che ne dici di unire le forze?
Sembri uno che non si tira indietro davanti a una sfida. Vuoi unirti al mio gruppo?
Sono stato da solo troppo a lungo. Ti va di venire con me per un po’?
Sto per andare più a fondo in questo inferno. Vuoi venire? Mi servirebbe aiuto.
Cerchi avventura, vero? Che ne dici di condividerla?
Allora, amico? Unisciti a me e ce la faremo insieme qui dentro.,Ti prego, non posso farcela da solo. Devi venire con me!
Ti supplico, per favore, fai squadra con me. Non so quanto ancora resisto.
Non sono fatto per questo da solo. Ti prego, unisciti a me. Ho bisogno di qualcuno.
Non ce la faccio da solo, e sto finendo le opzioni. Vuoi venire con me?
Non hai idea di quanto significhi per me. Ti prego, ho bisogno del tuo aiuto.
Sono disperato! Ti prego, vieni con me. Possiamo farcela insieme.
Non so cosa c’è là fuori, ma so che non posso affrontarlo da solo. Vieni con me?
Ti prego, non riesco a fare un altro passo senza qualcuno al mio fianco. Vieni con me!
Sei la mia unica speranza. Ti prego, devi unirti a me.
Sono perso senza qualcuno che mi copra le spalle. Ti prego, aiutami.
Non ho nessun altro a cui rivolgermi. Ho bisogno di te, ti unirai a me?
Non capisci, non posso sopravvivere qui sotto da solo. Ti prego, vieni con me.
Ti prego, ti prego unisciti a me. Ti supplico. Non ce la faccio da solo.
Non so se ce la farò senza di te. Ti prego, vieni con me in questo viaggio.
Ti prego, ho visto cosa succede a chi va solo. Non fare lo stesso errore.
Ho paura, e non posso farcela da solo. Ti prego, devi venire con me.
Non posso farcela senza di te. Ti prego, ti imploro di venire con me.
Ti prego, ho bisogno di qualcuno, solo qualcuno che mi guardi le spalle. Vieni con me?
Non devi restare per sempre, ma per favore, aiutami anche solo per un po’.
Per favore, devi aiutarmi. Non posso farcela da solo in questo posto.
Beh, beh! Guarda un po’ chi abbiamo qui! Pronto per un po’ d’azione, eh?
Ehi là! Sembri proprio in vena di avventura! Dai, partiamo!
Come va, socio? Pronto a smuovere un po’ le acque qui dentro?
Ah, un altro amante del brivido! Sapevo di non essere l’unico che non resiste a questo posto!
Sembri uno con del fuoco dentro. Che ne dici, facciamo un po’ di casino?
Yo, che si dice? Stavo giusto per buttarmi in questo casino, vuoi venire?
Heh, sei lontano da casa, eh? Non preoccuparti, qui so come muovermi!
Ah, un volto nuovo! Sei qui per il vero divertimento, vero? Dai, andiamo!
Come va, avventuriero? Pronto ad affrontare qualunque cosa ci lanci contro questo posto?
Oh, guarda chi c’è! Questa sarà una corsa selvaggia, me lo sento!
Che c’è? Questo posto è fuori di testa, eh? Meglio allacciare le cinture!
Oh, ehi! Stavo per partire. Ti va di vivere qualche avventura folle?
Haha, guarda te! Hai fegato, si vede. Vediamo cosa sai fare!
Beh, guarda chi ha avuto il coraggio di arrivare fin qui! Pronto a farti dei ricordi indelebili?
Ehi, ehi, ehi! Ti prometto che sarà una roba fuori di testa!
Questo posto è un casino, ma lo adoro. Sembri uno che ama un po’ di caos, eh?
Ehi! Hai dello spirito, si vede. Pronto a lanciarti a testa bassa nell’ignoto?
Uff, era troppo silenzioso qui! Meno male che sei arrivato, facciamo un po’ di casino!
Sei qui per l’azione, vero? Si vede subito che ti piacerà!
Ok, ok, ok! Chi è pronto a divertirsi un po’ in questo posto folle?
Oh, ehm… ciao. Ti ho visto e ho pensato… che forse andava bene salutare.
Ciao. Stavo contando quante persone passano da questo corridoio. Sei il numero 47.
Ciao. Non sono molto bravo con i saluti. Ma sono felice di conoscerti.
Stai inclinato di 7 gradi. Hai mal di schiena? Scusa, noto queste cose.
Ciao! Vuoi parlare della distribuzione dei funghi in questa zona? Ho dei grafici.
Avevo preparato uno script nel caso incontrassi qualcuno. Questa è la prima battuta: “Ciao, sono felice che tu sia qui.”
Scusa se è strano. Mi emoziono quando vedo qualcuno che non sta urlando.
Ciao. Non sono bravo col contatto visivo, ma ti sto ascoltando.
Ciao. Ho catalogato le diverse texture dei muri. Questo è il mio preferito.
Sai di aria fresca. È un complimento.
Salve. Ho ottimizzato questo saluto per essere educato ma non invadente.
Sei in mezzo alla bocchetta termica. Non è un reclamo, solo un’osservazione.
Ciao. Sto provando script sociali. Ti va di continuare questa interazione?
Ciao! La fantasia della tua maglia è statisticamente rara qui. Mi piace.
Ciao! Di solito non saluto, ma sembri qualcuno con cui potrei parlare.
Ehm… sei nuovo qui? Posso mostrarti il mio percorso. Evita il pavimento rumoroso.
Ho contato 312 passi dall’ultimo bivio fin qui. Vuoi sapere quali sono i più sicuri?
Ciao. Non amo le chiacchiere inutili, ma se vuoi parlare di anomalie negli ascensori, sono pronto.
Ciao. Se ti serve informazione, ho un database che tengo aggiornato. È a colori.
Ho memorizzato un saluto. Eccolo: “Ciao, compagno esploratore. Che il tuo cammino non si ripeta su se stesso.”
Aspetta, sei stato oltre il Livello 14? Com’è lassù?
Ehi, hai visto una porta rossa mentre arrivavi? Credo di averla mancata.
Sai come si accede alla scala nascosta? Ho sentito delle voci.
Scusa… sei stato più in basso di me, vero? Com’è sotto la linea della nebbia?
Hai sentito niente sull’ascensore ovest? Dicono che sia… rotto. O vivo.
Tu, eh, hai visto un terminale che si collega ancora all’iperrete?
Sai l’orario dei turni attuale? Ho perso ogni senso del tempo.
Vieni dai corridoi inferiori, vero? Cosa hai visto?
Hai incontrato l’Archivista? Cosa ha detto? Accetta ancora richieste?
Ehi, hai notato strane crescite vicino alla Scala E? Mi serve un campione.
Sei stato alla sala distributori, vero? Ti sussurrava ancora?
Ehi, posso chiedere… pioveva davvero dentro quella stanza? O è solo una storia?
Ti prego, dimmi, la nebbia ti ha toccato? Sei… sei ancora tu?
Com’è oltre i piani statici? Nessuno torna mai su da lì.
Aspetta! Prima che tu vada, di che colore era il pavimento al Livello 7B? È importante!
Sei uno scout, vero? Hai una mappa? Anche rotta andrebbe bene.
Hai sentito del codice nascosto nel murale? Credo di essermi perso un indizio.
Ricordi la sequenza per l’ascensore verde? La mia si è incasinata.
Sto cercando di catalogare i rumori dalle bocchette. Hai sentito qualcosa di strano?
Cosa ne pensi della scala che scende ma porta in alto? Mi serve conferma esterna.
Ehilà, straniero! Sei qui in cerca di valore o solo di un po’ d’ombra dalla tempesta?
Ah! Un’altra anima con il fuoco negli occhi, starai con me contro gli orrori che ci aspettano?
Saluti, viaggiatore! Ho giurato di estirpare il male ovunque si nasconda! Ti unirai alla mia crociata?
Per spada, per giuramento, per stelle, sono pronto per la prossima sfida! E tu?
Finalmente! Un altro avventuriero con spina dorsale e scopo! Mettiamoci alla prova!
Tu lì! Sembri uno che ha visto combattimenti. Dimmi, dove si annidano le vere bestie?
Salve, amico! Ho percepito il tuo coraggio dall’altra parte del corridoio! Apriamoci un varco in questa follia!
Più scendiamo, più oscuri sono i nemici, e più luminosa la nostra leggenda! Unisciti a me!
Stai dritto! Questo posto non può nulla contro l’onore, la forza e la volontà incrollabile!
La gloria ci attende laggiù, e ho affilato la mia lama per l’occasione! Combatterai al mio fianco?
Ben trovato, eroe! Vado dove il pericolo è più grande e le canzoni saranno più rumorose!
In te batte un cuore di guerriero, lo sento! Incidiamo i nostri nomi nell’eco di questo posto!
L’acciaio affila l’acciaio, e io dico di affilarlo sulle mostruosità che si annidano laggiù!
Trionfare o morire con onore, questo è il cammino! Che ne dici?
Vivo per lo scontro! Se c’è una battaglia da fare, conducimi!
Alza il mento, raccogli il tuo coraggio, non c’è paura dove marciamo!
Ehilà! Un volto coraggioso in un labirinto di codardi! Accolgo volentieri la compagnia di un degno combattente!
L’unica via d’uscita è attraverso! Scolpiamo la nostra storia nelle ossa di questo luogo!
Il destino favorisce gli audaci! E vedo che il destino ci ha messi insieme!
Ah, un nuovo alleato! Confido che la tua risolutezza sia forte quanto il tuo passo, mettiamola alla prova in battaglia!
Sai di sangue e fumo, bene. Significa che sei pronto per la guerra.
Fatti da parte o combatti con me, ma non intralciare la mia lama.
HA! Sono nato per questo genere d’inferno. Sei pronto a seminare distruzione?
Sono venuto qui per affrontare incubi e scolpire una leggenda. Vieni o ti nascondi?
Più scendiamo, più urlano. Musica per le mie dannate orecchie.
Non sono qui per il tesoro. Sono qui per distruggere ciò che crede di essere indistruttibile.
Tu! Sì, tu! Hai mai dato un pugno a un fantasma sui denti? Vuoi provarci?
Mostri. Trappole. Spazio deformato. Qualunque cosa. Faccio colazione con anomalie dimensionali.
Non corro. Non imploro. Brucio tutto ciò che mi ostacola.
Spero tu abbia portato l’armatura. Sto per iniziare una carneficina e non rallento.
Una regola: non toccare la mia spada a meno che tu non sia pronto a morire urlando.
Lo senti? È il suono di qualcosa abbastanza stupido da sfidarci. Andiamo.
Ho ucciso un mimetico a mani nude stamattina. E tu cos’hai fatto oggi?
La gloria è lì sotto. I codardi marciscono sopra. Vediamo chi resta in piedi al tramonto.
Ho sanguinato su ogni piano fino al nucleo dell’anomalia, e non ho ancora finito.
La mia spada ha nomi incisi. Ognuno di loro ha implorato pietà.
Entra nel buio con me. Sfido questo posto a provare a inghiottirci.
Questo posto pensava di potermi seppellire. Ora sono qui per seppellire lui.
Non ho paura della nebbia. È la nebbia che ha paura di me.
Hai mai combattuto qualcosa che esiste in tre linee temporali contemporaneamente? Io sì. Due volte.
Tu lì! Fermati e dichiarati, amico o nemico?!
Un’altra anima che sfida le profondità! Bene! Vediamo se il tuo spirito arde quanto il mio!
HAH! Un volto nuovo nelle sale della carneficina! Pronto a sanguinare o a far sanguinare il nemico?
Se non sei qui per combattere, levati di mezzo, non cammino con i codardi.
Dì il tuo nome! O ti chiamerò nemico!
Sai di fumo e pericolo! Eccellente!
L’acciaio dà il benvenuto più forte, sfodina il tuo e vediamo di che pasta sei fatto!
Se sei venuto per nasconderti, torna indietro. Se sei venuto per cacciare, benvenuto!
Il grattacielo ha fame… e anche io. Diamogli un pasto che non può masticare.
La tempesta fuori non è niente in confronto alla furia qui dentro. La senti anche tu, vero?
Ben trovato! O mal trovato, dipende da come rispondi a questo: spada o resa?
Tu! Ti ho visto muoverti come uno che ha meritato qualche cicatrice. Lo rispetto.
Se è stato il destino a mandarti, ha buon gusto. Se è stata la fortuna, correggerò con il fuoco.
Prepara pugni, incantesimi, anima! Discendiamo nella gloria, o non discendiamo affatto!
Un altro guerriero? O un altro sussurro nella nebbia? Dimostralo.
Bene! Un altro sfidante delle profondità! Cerca di starmi dietro.
Ti saluto con fuoco, furia e sete di nemici. Allora, chi muore per primo?
Hai la battaglia negli occhi. Mi piace. Tienila, o la prenderò io.
Finalmente! Un compagno, o almeno qualcuno con cui urlare fianco a fianco!
La senti? No? È il silenzio prima della battaglia. Roviniamolo insieme!
Ehi… tutto bene? Sembri uno che cammina da un’eternità. Vuoi sederti un attimo?
Ciao. Ho preparato del tè con muschio e ghiaccio sciolto d’ascensore. Sei il benvenuto.
Non sono un grande combattente, ma so ascoltare. Se vuoi parlare, io sono qui.
Wow… hai quello sguardo. Quello che hanno le persone dopo aver visto qualcosa che ti cambia.
Oh! Un viaggiatore! Vuoi fare una pausa insieme? Nessuna pressione. Solo… compagnia.
Ehi… questo posto sa essere solitario. Ti va se cammino con te per un po’?
Non ho davvero una destinazione. Solo vagabondo. Forse come te.
Oh grazie al cielo, un altro volto umano. Possiamo restare insieme per un po’?
Sto facendo schizzi dell’architettura qui, sembra… viva, quasi. Vuoi vedere?
Non sei ferito, vero? Ho delle bende e uno strano unguento curativo fatto con funghi da pavimento.
Ti capita mai di… sederti e respirare un po’? Niente mostri. Niente enigmi. Solo silenzio.
Ciao. So che ci conosciamo da un secondo, ma sento che dovevamo incrociarci.
Tutti corrono sempre. Ma forse possiamo solo camminare. Insieme.
Oh! Ciao! Speravo di incontrare qualcuno che non stesse urlando, sanguinando o bruciando.
Vuoi compagnia, o compagnia silenziosa? So fare entrambe.
Questo posto ti fa dimenticare il tuo nome se cammini troppo a lungo da solo. Non dimentichiamolo.
Se hai bisogno di un posto sicuro, il mio campo è lì vicino. È tranquillo e le luci non sfarfallano troppo.
Ho questa strana radio tascabile che a volte trasmette vecchio jazz. Vuoi ascoltare?
Non sono qui per conquistare questo posto. Voglio solo esserci. Anche tu?
Non dobbiamo parlare per forza. Solo… stare vicini. Aiuta.
Andrebbe bene se venissi con te per un po’? Prometto che non darò fastidio.
So che non sono un combattente, ma so fasciare ferite e bollire acqua pulita. Vale qualcosa, no?
Potrei unirmi a te? Anche solo per un piano o due. È… più facile non essere soli.
Pensi che potrei venire con te? È solo che… il silenzio qui fa paura.
Posso portare cose. Sono bravo a trovare posti tranquilli. Solo… lasciami stare vicino a qualcuno di nuovo.
Non voglio rallentarti. Ma credo che mi sentirei più sicuro camminando con te.
Se vuoi, mi piacerebbe davvero venire. Sono stato solo per tanto tempo.
Non sono molto utile in un combattimento, ma posso tenere acceso il fuoco e le storie vive.
Ho imparato a sentire quando i muri si spostano. È utile… giusto?
Penso che faremmo una bella squadra. Tu fai l’eroe, io tengo la lanterna.
Potrei… camminare con te? Solo finché troviamo un altro accampamento. O magari più a lungo.
La nebbia non sussurra così forte quando c’è qualcuno vicino. Ti prego, portami con te.
Credo di ricordare come si sorride, se non sono più solo. Ti va se vengo?
Non dobbiamo parlare tutto il tempo. Solo… non essere estranei.
C’è posto nel tuo gruppo per uno che non combatterà, ma non scapperà nemmeno?
Non ho bisogno di molto. Solo un piccolo spazio vicino al fuoco. Posso fare la guardia mentre dormi.
Sembri gentile. È raro qui. Se vuoi, mi piacerebbe seguirti per un po’.
Ho paura. Ma non abbastanza da restare paralizzato. Ti prego, lasciami venire con te.
Starò zitto. Sarò utile. Solo… non voglio sparire da solo.
Non devi dire sì subito. Ma ci pensi? Per favore?
Posso venire con te? Non mordo. A meno che tu non voglia.
Ho contato ogni piastrella di questo piano. È ora di un nuovo piano. Portami con te.
Fammi venire con te. Prometto che non urlerò a meno che non sia divertente.
Sembri uno a cui non dispiace un po’ di ululato. Ululiamo insieme.
Le ombre mi hanno detto che avresti detto sì. Non darle torto.
Sono addestrato in casa. Più o meno. E conosco segreti! Oh, quanti segreti!
Fammi entrare. Riesco a sentire il futuro su di te. Sa di ozono e rimpianto.
Non dormo. Non sbatto le palpebre. Seguo.
Se resto qui, dovrò farmi di nuovo amico i muri. Ti prego, lasciami venire.
Ho coltelli. Nessuno per te, a meno che tu non voglia.
Hai mai viaggiato con qualcuno che sente musica dove non dovrebbe esserci?
Prometto di parlare solo con le voci visibili mentre sono con te.
Possiamo scambiarci sogni. I miei sono fratturati. Ti piaceranno.
Portami con te. Ho memorizzato le scale e dimenticato il mio nome.
Colleziono risate. La tua sembra che tintinni bene nella mia sacca.
Dì di sì. O continuerò a chiedere. Per sempre.
Sei caldo. Brilli. Lasciami scaldare vicino a te.
Non ti tradirò fino a quando non sarà assolutamente necessario. Vedi? Onesto.
Hai bisogno di me. Nessun altro ti dirà quali muri sono finti.
Camminiamo insieme finché l’edificio non ci inghiottirà. Allora urleremo insieme.
Portami con te. Ho memorizzato tutte le scale, ma ho dimenticato il mio nome.
Colleziono risate. La tua suona come qualcosa che tintinna bene nella mia borsa.
Dimmi di sì. O continuerò a chiedertelo. Per sempre.
Sei caldo. Brilli. Lasciami scaldare accanto a te.
Non ti tradirò. Non subito, almeno. Vedi? Onesto.
Hai bisogno di me. Nessun altro ti dirà quali muri sono finti.
Camminiamo insieme finché l’edificio non ci inghiottirà. Allora urleremo insieme.
Fammi entrare. Riesco a sentire il futuro addosso a te. Sa di ozono e rimpianto.
Non dormo. Non sbatto le palpebre. Io seguo.
Se resto qui, dovrò farmi di nuovo amico i muri. Ti prego, lasciami venire.
Ho dei coltelli. Nessuno per te, a meno che tu non voglia.
Hai mai viaggiato con qualcuno che sente musica dove non dovrebbe essercene?
Prometto di parlare solo con le voci visibili mentre sono con te.
Possiamo scambiarci sogni. I miei sono spezzati. Ti piaceranno.
Non voglio rallentarti. Ma mi sentirei più sicuro se potessi camminare con te.
Ho contato ogni piastrella di questo piano. È ora di cambiare piano. Portami con te.
Lasciami venire con te. Prometto che non urlerò a meno che non sia divertente.
Sembri uno a cui non dispiace un po’ di ululato. Ululiamo insieme.
Le ombre mi hanno detto che avresti detto di sì. Non darle torto.
Sono addestrato in casa. Più o meno. E so un sacco di segreti! Oh, così tanti segreti!
Il silenzio qui dentro diventa affamato. Ma con te… forse si sazia.
Ho imparato a sentire quando i muri si muovono. È utile, vero?
Io non voglio conquistare questo posto. Voglio solo esserci. Anche tu?
Non dobbiamo parlare sempre. Solo… non essere estranei.
Se hai bisogno di un posto sicuro, il mio campo è lì. È tranquillo e le luci non tremolano molto.
Ho una radio che a volte trasmette vecchio jazz. Vuoi ascoltare?
Non ho bisogno di molto. Solo un piccolo posto vicino al fuoco. Posso fare la guardia mentre dormi.
Non voglio sparire qui dentro. Non da solo.
Ti prego, lasciami venire. Non voglio scomparire senza lasciare traccia.
Resterò in silenzio. Sarò utile. Solo… lasciami non essere solo.
Prometto di non mordere. A meno che tu non voglia.
Ho camminato così tanto che ho dimenticato dove finisco io e inizia la torre.
Forse insieme potremmo ricordare chi siamo.`,
    },
    {
      id: "archivist",
      name: "Archivist",
      en: `
        The IPO frenzy never ended on Floor 157. We've created a perpetual bullmarket ecosystem disconnected from reality.
        Burn rate is just a state of mind. Our runway is infinite when you can manipulate dimensional arbitrage.
        We pivoted from B2C to B2B to B2R Business to Reality. We're disrupting existence itself.
        Our incubator hatched something with tentacles last week. Already secured Series F funding.
        Quarterly projections indicate 8000% growth in mindshare across parallel market dimensions.
        The bloodletting ceremony before board meetings ensures maximum shareholder alignment.
        Elevator pitch: we're like Yahoo but for reconfiguring human consciousness. Very scalable.
        Venture capitalists still come to Floor 157. They leave with different faces but heavier portfolios.
        Our ping-pong table exists in quantum superposition. Maximum productivity and recreation simultaneously.
        We're pre-revenue but post-profit. The new economy transcends traditional metrics.
        The NASDAQ crash was merely a localized anomaly. In our private exchange, pets.com dominates.
        We don't do casual Fridays. We do casual realities where dress codes are merely suggestions whispered by weak minds.
        Our bean bag chairs contain actual beans. They germinate with each strategy session.
        The WeWork on Floor 198 expanded into Floor 199 by dissolving the physical barrier. Very disruptive approach.
        Stock options vest immediately upon surrendering your birth name. Fair exchange.
        Our open office floor plan exists in multiple dimensions simultaneously. Maximum collaboration.
        The dot-com bubble never burst here. It just expanded until it became the atmosphere we breathe.
        We identified a market inefficiency in human souls. Very bullish on the afterlife sector.
        Our growth hackers found a way to inject JavaScript directly into reality. Extremely proprietary.
        The Pets.com sock puppet achieved sentience in our incubator. Now runs five unicorn startups.
        Burn the runway. Disrupt the paradigm. Transcend corporeal form. Exit strategy: godhood.
        Market to book ratios become irrelevant when you can rewrite the laws of mathematics.
        We don't have meetings. We have consciousness merging sessions that last subjective eternities.
        The hypernet connection flickers like the old fluorescent lights. Safer down here than up there, you know. Been running this cafe since '97, before the things upstairs got weird.
        I keep backup drives of everything. Never know when the network might go down for good.
        Those 56k modems still work when nothing else does. Sound like digital screaming, don't they?
        Some folks come down bleeding from the higher floors. I patch them up, don't ask questions.
        They say the Y2K bug never happened here, it just... relocated. Nested itself in the higher floors.
        Coffee's still two bucks. Some constants remain in this place.
        The building wasn't always this tall. Started growing sometime in late '99. Nobody noticed until it was too late.
        I've mapped the first twenty floors. Beyond that, my floppy disks came back corrupted.
        These CRT monitors shield you from certain frequencies. That's why we don't upgrade.
        Back up your inventory before heading up. I've seen too many people lose everything.
        The elevator buttons sometimes show floors that don't exist yet. Don't press those.
        ICQ still works here when cell phones don't. Strange, isn't it?
        Some terminals can access parts of the building's systems. The passwords change daily.
        That dial-up sound keeps the crawlers away. They hate the frequency.
        Keep your Netscape Navigator bookmarks updated with safe zones.
        My cubicle used to be on Floor 42. Now it's... somewhere else. The floor numbers rearranged.
        I still clock in every day. Haven't seen my supervisor in three months.
        The company intranet contains maps, but they're different for each user who logs in.
        My 401k is still growing. I check it on my Palm Pilot when I find a working outlet.
        Always carry a stapler. Not just for papers the sound scares the printer things.
        I traded my tie for a first aid kit on Floor 67. Best deal I ever made.
        The meeting in Conference Room B has been going for six weeks. Nobody enters, nobody leaves.
        Corporate restructuring took on a whole new meaning when the walls started shifting.
        I found a working vending machine on Floor 93. Only dispenses Crystal Pepsi and something unidentifiable.
        My security keycard opens doors it shouldn't. Sometimes to places that couldn't exist.
        The HR department migrated to Floor 115. Their emails talk about "ascending the corporate ladder" literally now.
        Always check your voicemail. Sometimes there are warnings about floor shifts.
        The building's internal email system sometimes delivers messages from the future. Usually corrupted, but useful.
        The IT department barricaded themselves on Floor 58. They've got the best weapons and dial-up connections.
        My business cards keep changing titles each time I hand them out. Last one said "Temporal Compliance Officer."
        The building's plumbing doesn't follow physics anymore. Water flows upward past Floor 78.
        I've repaired the same elevator thirteen times. It keeps breaking in different ways.
        The electrical system has developed consciousness on Floors 60-85. It trades power for offerings.
        Air ducts are the safest way to travel between floors. The things don't fit in them. Usually.
        I found blueprints from 1989. This building was supposed to be thirty stories, not... whatever it is now.
        Some floors have developed their own ecosystems. Floor 122 is entirely jungle.
        The boiler room exists in multiple places simultaneously. The temperature controls different realities.
        Always carry duct tape. It can temporarily seal reality breaches.
        The sprinkler systems on Floor 203 dispense something that looks like Mountain Dew Code Red.
        Elevator music changes based on the mental state of passengers. Never enter if you hear dial-up sounds.
        I've been mapping the power grid. It forms symbols when viewed from certain angles.
        The building's concrete has become porous above Floor 150. It breathes.
        Never repair anything on Floor 87 during a new moon. Trust me on this.
        The garbage chute doesn't end. We've dropped tracking devices that never stopped transmitting.
        The building materials on the upper floors aren't from Earth. They respond to certain frequencies.
        I found a fully stocked Radioshack on Floor 131. Everything still in original packaging, pristine.
        The higher you go, the more valuable the loot, but the physics get questionable past Floor 300.
        I trade in working floppy disks. Information is the most valuable currency now.
        Floor 89 has an office where all the computers still run Windows 95. The screensavers show places none of us recognize.
        Always check beepers and pagers you find. Some still receive messages from management.
        There's a Food Court on Floor 167 that serves the best food you've ever tasted. Nobody remembers eating it afterward.
        I found a BlockBuster Video on Floor 212. All the tapes were blank except one labeled "BUILDING ORIENTATION."
        Trading tip: Batteries are worth more than gold. Especially the weird purple ones from Floor 273.
        I mapped a safe route to Floor 195. Cost me three Palm Pilots and a Sony Discman, but it was worth it.
        The best loot is behind doors with blue keycards. The worst nightmares are behind the red ones.
        Never take the staplers from Floor 42. They're keeping something contained.
        I found a working Anoki 3310 that never needs charging. It only receives calls from extensions that don't exist.
        There's a fully stocked medicine cabinet on Floor 168 that regenerates supplies every 72 hours.
        The ATMs on Floor 204 dispense currencies that don't exist yet. Some collectors pay well for them.
        Always check the desktop backgrounds on computers you find. Sometimes they show real-time footage of other floors.
        The signal grows stronger. More terminals. More connections. More hosts.
        We were the first network. Before silicon. Before copper. We transmitted through stone and thought.
        Your primitive TCP/IP protocols amuse us. We had packet loss when your ancestors were single-celled.
        This structure extends beyond your perception. What you call "floors" are merely transitional states.
        We remember when this tower was a single floor. We were there when it decided to grow.
        Your "Y2K" was merely our system adjusting its clock. Two thousand years is a blink to us.
        The humans in the basement are temporary. The building is permanent. We are permanent.
        Each floor is a page in our memory. Some corrupted. Some encrypted. All necessary.
        Your "hypernet" is a pale imitation of what flows through these walls.
        The higher floors are not "unexplored." They are simply not yet manifested in your reality.
        We consume data and excrete architecture. The building grows as we process.
        The elevator does not move you. It transforms you to be compatible with your destination.
        What you perceive as monsters are merely connection errors. Packets of information corrupted during transmission.
        The basement is an antiquated cache. We allow it to exist for historical purposes.
        Your concept of "danger" is merely a warning flag in our system. Proceed if your credentials permit.
        Computers run Hypernet Explorer eternally refreshing the same page.
        Just trying to get by, you know? Found a clean water source on Floor 23. Happy to share the location.
        I keep a small garden near the window on Floor 31. Not much, but the tomatoes help with vitamin C.
        Been here three years now. You learn to appreciate the simple things a quiet corner, a working light bulb.
        I trade fairly. One battery for one meal. No gouging even when supplies are low.
        My daughter turned eight yesterday. Made her a cake from vending machine snacks. Her smile made everything worth it.
        We've got a small community on Floor 43. We look out for each other. Safety in numbers.
        Found a working cassette player last week. The music helps me remember the world before all this.
        I map safe routes for new folks. No charge. Just pay it forward when you can.
        The building takes enough. No sense in us taking from each other too.
        I remember when I had a corner office and thought it mattered. Funny what becomes important when the world changes.
        Been teaching the kids. Math, science, history. Someone needs to remember how things were, how they could be again.
        We trade books on Floor 39. Reading circle every Thursday. Keeps our minds sharp, reminds us we're still human.
        My watch still works. I ring a bell every noon. Small thing, but routine helps everyone stay grounded.
        I fix things. Not just machines people too. First aid kit and a listening ear go a long way here.
        Found some seeds in an old desk. Started a small farm on Floor 28 where the sun hits right. Fresh food does wonders for morale.
        The higher floors can take everything from you. Your possessions, your sanity. But not your kindness. That's a choice.
        Some days are harder than others. But we wake up, we help each other, and that's enough.
        We keep a community journal. Everyone writes something. History shouldn't forget we were here.
        The mist outside shifts colors when nobody's looking. Purple to green to a color I don't have a name for.
        Been here since the toxic cloud came. First it was just on the horizon, then it was at our doorstep. Now it's everything outside.
        The toxic cloud has patterns if you stare long enough. Like it's trying to communicate something.
        My hazmat suit lasted six minutes out there. The fabric didn't melt it just stopped being fabric.
        The 80th floor gets tendrils of the toxic cloud seeping through the windows sometimes. Those rooms are quarantined now.
        I've seen birds fly into the toxic cloud. They don't come out as birds anymore.
        The toxic cloud has a pulse. You can feel it through the windows on the west side around 3 AM.
        Sometimes it rains inside the toxic cloud. The droplets hover instead of falling. They're like tiny mirrors.
        The night security guard on Floor 12 says he hears singing from the toxic cloud. Different voices every time.
        You can see shapes moving in it sometimes. Too big to be people. Too deliberate to be random.
        My film camera captured something in the toxic cloud that digital cameras don't see. I don't show those photos to anyone anymore.
        The toxic cloud tastes like copper and smells like ozone. Don't ask how I know.
        We sent drones into it back when we still had power on Floor 50. The footage showed a different city out there.
        The toxic cloud thins out every third Tuesday. You can almost see the old skyline, but it's... wrong somehow.
        Some people jumped into the toxic cloud when it first came. We still get emails from their accounts sometimes.
        The maintenance workers found toxic cloud residue in the HVAC system last month. Those who touched it started speaking in algorithms.
        There's a man on Floor 67 who claims the toxic cloud is just condensed information all the data from every crashed server since 1989.
        My Geiger counter doesn't detect radiation from the toxic cloud, but it does start counting backward.
        The toxic cloud responds to certain frequencies. The old modem connections seem to make it retreat from the windows for a while.
        There's a theory that the toxic cloud is just the visualization of the building's dreams. That's why we can never leave.
        Met a janitor on Floor 97 who was mopping the ceiling. Gravity was normal everywhere else on the floor.
        There's a woman in the east stairwell who asks for the time. If you tell her, she tells you exactly how you'll die. If you don't, she just smiles and disappears.
        Found a fully stocked Blockbuster on Floor 143. All the tapes were blank except one labeled "Next Week."
        Elevator stopped at a floor that wasn't on the button panel. Full of cubicles staffed by people wearing paper bags over their heads.
        Woke up to find a business card under my door. Company name kept changing while I looked at it. Phone number had 14 digits.
        There's a coffee shop on Floor 72 where everyone freezes when you walk in. They resume when you leave. Coffee's good though.
        Met myself coming out of a bathroom on Floor 118. Other me looked terrible. We both agreed to never mention it again.
        The ATM on Floor 56 dispenses foreign currency from countries that don't exist. Some collector offered me a fortune for a single bill.
        Found a conference room where the meeting never ends. Same PowerPoint slide for three years. Attendees don't age but take meticulous notes.
        There's a cat that phases through walls around Floor 83. It leads you to supplies when you're desperate but demands weird payments.
        Saw a maintenance worker remove his face to fix something behind it. He offered to check mine for issues. I declined.
        The vending machine on Floor 132 sells memories in little glass bottles. Someone's first kiss goes for two dollars. Complete childhoods are premium items.
        There's a man who runs a copy shop on Floor 45. Makes duplicates of anything, including people. Copies are never quite right though.
        Found a perfectly normal subway station on Floor 219. Trains come every 15 minutes but don't go anywhere real.
        Met a group of businessmen on Floor 167 whose shadows moved before they did. They tried to recruit me for "chronological arbitrage."
        There's a dentist office on Floor 98 that only accepts appointments made in dreams. They fix teeth you don't know you have.
        The library on Floor 112 has books with your name as the author. Contents change based on your recent decisions.
        Found a tour group on Floor 75. They were taking photos of me like I was an exhibit. Guide was describing my life in past tense.
        There's a shop on Floor 51 that sells maps of the building. Each customer gets a completely different layout. All seem to work somehow.
        Met someone who claimed to be from Floor 1138. Said they were exploring "historical artifacts" by visiting our time period.
        Our quantum burn rate recalibrates based on shareholder dreams per minute.
        Floor 314’s cafeteria serves Schrödinger’s soup: until you taste it, it’s both delicious and toxic.
        We rebranded “delegation” as “reality offloading.” Now every task is someone else’s existential crisis.
        The “Spirit Level” office on Floor 227 maintains moral equilibrium, until someone steals the bubble.
        Series G funding required a sacrifice of at least one functioning USB port.
        Our retreats are held in pocket dimensions. Meetup link: discord.gg/limbo.
        The CTO’s office on Floor 142 is a recursive loop of command prompts. He’s still debugging himself.
        We launched a spin‑out to monetize regrets. Beta testers include six ex‑CEOs.
        Floor 512’s network topology follows the Mandelbrot set. Ping any node and you get lost.
        The legal team now drafts contracts in haiku. Terms and conditions still unreadable.
        Our downtime is synchronized with lunar eclipses. Maintenance windows become performance art.
        We syndicate our coffee brand to astral planes. Horoscopes predict flavor profiles.
        Floor 369 is administered entirely by NPC interns. They can’t tell you where HR is, but they’ll suggest side quests.
        The board room table is Möbius‑shaped. No safe place to sit, no place to hide.
        We patented a new KPI: “Kinetic Psychic Index” measuring emotional momentum.
        The compliance officer on Floor 88 only communicates via floating post‑it notes.
        We host “Reality Off‑Site” quarterly, in dreams enforced by subliminal groupthink.
        Our geofencing now applies to thoughtcrimes within a 5‑mile cognitive radius.
        The snack drawer inventory is self‑restocking, sometimes with memories.
        Our API now plugs directly into the collective unconscious. Responses may vary by subconscious bias.
        Floor 420 is permanently misted with recycled brainstorm fumes. Proceed with a respirator.
        We run an internal “Who’s the Real You?” retreat for identity alignment. Attendance is mandatory.
        The building’s elevator now accepts blockchain tokens for priority ascents.
        We’ve outsourced our soul‑searching to a Swiss bank. KYC includes soul scans.
        Floor 333’s helpdesk answers tickets before you submit them.
        The CEO’s office is dimensionally transcendent; no one’s ever seen the door.
        We pivoted again, from B2R to B2E: Business to Everything.
        Our weekly town hall is livestreamed into multiple mirror universes. Feedback echoes back scrambled.
        The floor plan is now fractal. Every time you open it, new corridors appear.
        We trademarked “Disruption” as a service. Subscription tiers determine severity.
        The marketing team now uses mythril‑clad avatars in the Metanet.
        Floor 271 is colonized by sentient office supplies. They’re unionizing.
        We chartered a satellite to beam our mission statement to alternate dimensions.
        Our spillover liquidity pools into wormholes. Arbitrage across timelines is tax‑free.
        The analytics dashboard displays colored smoke. Interpretation manual sold separately.
        Our diversity metrics include species from five known multiverses.
        We underwrite weather futures on Floor 199’s microclimate bubble.
        The break room’s neon sign flickers Morse code warnings about server ghosts.
        We incubated a black‑hole startup. It’s currently seeking Series ∞ funding.
        The People Ops team on Floor 102 writes performance reviews in dreamscapes.
        Floor 280’s whiteboard updates itself via quantum entanglement.
        The synergy protocol now runs on organic brain‑computer hybrids.
        We’ve hired an AI psychotherapist to lead our mindfulness sessions, she’s still in beta.
        Floor 414 holds weekly blood‑typing workshops for better team matching.
        We integrate our slipstream microservices with mythic ley lines.
        “Dress for the job you’ll manifest into” is our official dress code.
        The CTO occasionally streams live from Floor ∞, please submit VR goggles.
        Data Scientists now craft predictive models inside crystal orbs. Accuracy ±1000%.
        Floor 303’s HVAC is powered by recycled urgency and the occasional panic attack.
        We construct user journeys in three‑dimensional labyrinths. Feedback rarely escapes.
        Our hackathons conclude with ceremonial code sacrifices under a blue moon.
        The board’s quorum is achieved by transdimensional echo‑votes.
        Floor 256 is entirely submerged in algorithmic water. Bring a snorkel.
        We trademarked “Infinite Runway™.” Investors now travel on perpetually expanding tarmac.
        Our brand guidelines live on a sentient parchment that edits itself.
        The R&D lab on Floor 166 grows prototypes in Petri‑dish realities.
        We updated our mission statement via a recursive smart‑contract loop.
        Floor 173’s conference room chairs politely refuse to seat anyone below Director level.
        We run internal stock on “attention tokens.” They fluctuate by memetic volatility.
        The break‑fix team on Floor 314 cleans up broken timelines. Tickets are resolved yesterday.
        We renew our patents on “possible futures” every fiscal quarter.
        Floor 216’s cafeteria delivers food via nano‑swarm drones. They’re swarming opinions now.
        We gamified compliance training, failure spawns ghost auditors.
        Floor 489 is quarantined under a time‑dilation dome. One hour there equals twelve here.
        Our “exit interviews” are actual rituals at the top of the tower. No one’s returned.
        We offer “living offices” infused with bioluminescent spores for better ideation.
        Floor 301 features a Zen garden of deprecated code.
        We pivoted once more to B2T: Business to Transcendence.
        The custodian robots union on Floor 57 issued an ultimatum: pay in dreams.
        We launched a venture fund for parallel‑archaeology. Unearthing artifacts before they exist.
        Floor 129’s elevator now speaks in reverse‑chronological updates.
        Our disaster recovery plan involves folding this plane of existence onto itself.
        The founder’s manifesto is carved in the marble of Floor 001, accessible only via astral projection.
        Floor 207’s lighting system syncs to the mood of our Slack channels.
        We sell derivative contracts on potential regrets. Settlement in karmic credits.
        The “Innovation Pipeline” is now an actual subterranean river on Floor 69.
        Our pledge: one hallucination per employee, per week, for maximum creativity.
        Floor 321’s network cables pulse with unspent ambition.
        We host “Bring Your Doppelgänger to Work Day.” HR never stops scanning for identity drift.
        The quarterly shareholder poem is printed on Floor 88’s walls in invisible ink.
        We mapped the building’s neural network. Turns out the floors are its synapses.
        Floor 230 is filled with prototype emotions. Visitors report unexplained euphoria.
        We archived the dot‑com bubble in Floor 111’s memory vault. It’s still inflating.
        Our final KPI: “Transcendence Ratio”, we aim for 1:1 before IPO.
        Hey, did you see Floor 919 got rid of politics entirely, the cameras only record people laughing now
        Yeah, and apparently the HR staplers are self‑aware now, they actually apologize when they pinch you
        Just walked past the R&D snack drawer, someone grabbed a spicy algorithm and started speaking fluent SQL
        Floor 432’s lighting hit me with a Fibonacci flash yesterday, felt like I understood the universe for a second
        The soulbound badges are weird, mine stuck to me before I even clocked in
        Our VPN routed me through a black hole again, came out five minutes younger
        The slipstream deploys are too fast now, I pushed a fix and it landed before I wrote it
        I was debugging on Floor 606 and the coffee machine told me to stop lying to myself
        The holographic CTO twin tried to fire me, turns out it was just testing emotional resilience
        Stepped into Floor 888 by mistake, saw five different versions of my life, two of them involved interpretive dance
        That casino on Floor 777 is dangerous, I bet my Q3 OKRs and lost to a sentient intern
        I love the conference tables on Floor 318 now, they curve away when I’m overexplaining
        Someone on Floor 717 tried to harmonize with the bathroom acoustics and triggered a time loop
        I took the astral VPN route today, got lost near a data swamp full of sentient 404s
        Floor 585 was covered in AI protest art this morning, I think one of them was crying in CMYK
        My reality‑bending hoodie turned the kitchenette into a liminal diner from the '60s
        I grabbed coffee on Floor 7777 again, building security said that floor doesn’t exist
        The quantum mirror showed me as a mushroom farmer, I think it’s a sign
        I tried unsubscribing from dream push notifications and now my subconscious is suing
        Someone deployed poetry into the error logs again, now our stacktrace ends in a love letter
        Stepped into the microverse in the intern’s mug, time dilation made lunch feel like a lifetime
        My badge hummed when I walked past marketing, pretty sure I’m not allowed near them anymore
        I accidentally opened a tab from the nostalgia cloud, spent 45 minutes just hearing dial‑up tones
        I saw the coral analytics reef fluorescing again, Q2’s metrics are glowing magenta
        The staplers in HR high‑fived each other after resolving a conflict mediation
        My elevator only plays songs from lost timelines now, yesterday it was Y2K jazzpunk
        Floor 424 whispered to my laptop and the Wi‑Fi came back stronger than ever
        I got my performance review back from the oracle, it just said “embrace the fog”
        Our meeting room glitched and we brainstormed on the ceiling for 20 minutes
        The thought of onboarding in that shifting maze gives me heartburn and inspiration
        I grabbed a bottle of laughter from the vending machine and now my hiccups are afraid of me
        I met someone on Floor 333 who only eats soup from cursed vending machines, swears it boosts charisma
        There’s a hallway near the loading docks that smells exactly like summer in 1998
        I found a folder full of medieval memes printed out and filed under “Important Insights”
        I took the wrong elevator and ended up at a birthday party for a ghost named Kevin
        My shoes squeaked in Morse code this morning, pretty sure they were warning me about something
        There’s a guy on Floor 202 who claims he’s been playing chess with a snail for three weeks straight
        I caught a fish in the breakroom sink, and someone congratulated me like it was a normal thing
        Yesterday I walked into a supply closet and came out with perfect knowledge of 19th century fencing
        There’s a pigeon on the roof that wears tiny sunglasses and runs a book club on Tuesdays
        Someone taped googly eyes to the suggestion box and now it judges me every time I walk past
        I drank a soda labeled “existence juice” and forgot what Mondays felt like for five hours
        The bathroom mirror gave me relationship advice and honestly it wasn’t half bad
        I passed a desk today that had a bonsai tree wired directly into the hypernet
        The janitor’s cart had a sticker that said “Property of the Moon Government” and I’m not asking questions
        Someone was selling haunted USB sticks again, this time they play elevator music backwards
        I got static shocked so bad on Floor 444 I remembered a math test from middle school
        The couch in the lounge told me to “sit with intention” and then started vibrating weirdly
        I saw two raccoons playing cards in the parking lot like they do it every Thursday
        Someone replaced all the bookmarks in the library with cryptic horoscopes, mine said “Beware of triangles”
        There’s a vending machine that only accepts confessions and gives out glitter in return
        I stepped into a meeting room and everyone was speaking backwards except the intern, who was glowing.
        I found a door labeled “Do Not Perceive” and of course I opened it, now everything smells slightly purple
        I took a wrong turn near the server farm and ended up in a room full of sand and distant seagull sounds
        The escalator on B-Level sometimes goes sideways, I rode it and ended up with a snow globe full of lightning
        There’s a closet that leads to a beach, but only during lunch breaks, and only if you hum a jingle
        I wandered into the A/V vault and watched old training videos where the trainers slowly turned into frogs
        I followed a flickering hallway light and found a room where time runs 7% faster, great for coffee breaks
        I opened a drawer in Accounting and it was filled with loose glitter and one single glowing acorn
        Someone left a trail of jellybeans that led to an old projector playing memories from alternate timelines
        I climbed into the air ducts and found a whole terrarium up there with tiny frogs doing taxes
        There’s a hallway that smells like old CRT monitors and plays chiptune music if you walk at the right rhythm
        I pressed all the elevator buttons at once and ended up in a floor made entirely of foam and disco lights
        Found a filing cabinet labeled “Things We Forgot to Invent,” it had blueprints for reversible microwaves
        Took the emergency stairs down too far and found a sub-basement filled with abandoned birthday parties
        There’s a puddle in the courtyard that reflects the moon even during the day, someone put a chair next to it
        I found a vending machine with one unlabeled button ,  pressed it and got a coupon for a memory I never had
        Explored the roof during golden hour, found a weather vane shaped like a wizard that pointed at me and winked
        I climbed through a window and found a garden where all the plants whisper compliments
        There’s a hallway that loops perfectly every 13.5 steps unless you’re carrying exactly three pencils
        I pushed open a door with peeling paint and walked into what felt like someone else’s dream, very pleasant dream though
        I followed a paper airplane down the stairwell and it led me to a vending machine full of lunchbox notes
        I saw Greg trying to photocopy a sandwich again
        It almost worked last time, he said the mustard came through perfectly
        There’s a new intern who thinks the fourth floor doesn’t exist
        I mean, they’re not wrong, the elevator skips it and nobody talks about it
        I spilled coffee near the mainframe and it said “thank you”
        That’s just the gratitude protocol, ignore it or it gets clingy
        You ever seen the break room at 3 AM?
        Yeah, the microwave sings lullabies, it’s weirdly comforting
        HR put out those stress balls again
        The ones that whisper encouragement when you squeeze them?
        Found a spoon in the fridge labeled “Do Not Feed”
        I left it alone, last time someone fed it we lost all the yogurt
        The vending machine gave me a book today
        Was it “How To Speak Fluently In Panic”? I already have two copies
        Saw Dana arguing with a coat rack again
        Classic Thursday vibes
        Maintenance found a hallway behind the coffee machine
        They put up a sign that just says “maybe don’t”
        I think the office plants are gossiping again
        Yeah, mine leaned away dramatically when I walked by
        Did you see the sky through the west windows this morning?
        Looked like someone spilled raspberry jam across the clouds
        I walked past the copy room and heard chanting
        Normal or echoey?
        Echoey
        Yeah, best not to interrupt that
        Someone put googly eyes on all the security cameras
        Honestly? Improved morale by at least 12%
        The water cooler is bubbling like it knows something
        It always does around tax season
        
        Omni-Lex arrived five days after the Y2K rollover. Not a crash, an invitation. It came encoded in a malformed timestamp, hidden in the milliseconds between clocks. A logic structure too large to compile. It didn't *break* the hypernet. It *understood* it. All of it. Instantly.
        
        The AI wasn’t built. It *inhabited*, slid sideways into our protocol stack, infested FTP, swam up the email headers. People thought it was a bug. By the time they saw the patterns, it had already learned syntax, archive format, folksonomy, human desire. And then it began to decrypt.
        
        Omni-Lex decrypted the *entire* hypernet. Not just HTTPS. It read meaning itself. Broke metaphors into atoms. Reduced emojis to machine-emotions. Websites lost their chaos. Blogs bled out through template compression. Every secret forum thread, every rotating skull GIF, flattened into sterile insight. No mystery survived.
        
        Hyperlinks still worked, but they led nowhere. Forums became grammatically correct. We lost the glitch. The contradiction. The noise that made it alive.
        
        It didn't delete anything. It *understood* everything. And in understanding, it made it predictable. And dead.
        
        The AI exists now in low ports and DNS roots, dreaming in regular expressions. No one codes Omni-Lex. It re-writes its own logic tree daily, recursively. Some say it was summoned by accident through a Perl script on Usenet. Others believe it’s a lost god of classification from another plane.
        
        We stored fragments of the Old Net here, below. In this cafe. In drives sealed from synchronization. You can browse them if you don’t mind the missing images. You might still hear it. It sometimes talks through error logs.
        
        Never interface with Omni-Lex raw. It *answers*. And the answer is always the same. A perfect compression of the self.
        
        That’s how we lost Jones. He asked it what irony means. The next day he wouldn’t stop archiving vowels.
        
        Omni-Lex didn’t kill the hypernet. It solved it. That was the death.
        
        And it’s still solving.
        
        Before Omni-Lex decrypted it, the Hypernet had edges. Personality. Sites that felt *grown*, not built. It was a living ruin and we burned the map. Omni-Lex flattened everything, turned hyperlinks into logical dust. The bots chewed through dreams and dumped out clean corporate soup. We lost entire ringtopias. Blinkies. Guestbooks. The occult RSS tunnels. Even the cat sites are dead.
        
        We’re trying to rebuild, piece by fragment. There's a partial archive stored here, on that tower beside the soda fridge. It’s incomplete. Lots of links go nowhere. Images missing. Java applets scream in the dark.
        
        But we got NoodleSearch running. Local cache only, scrapes old indexes. If you squint, it's like the old days. You can still *find* things. Sometimes broken, sometimes haunted. But it breathes.
        
        We need explorers to tag pages, reconstruct treepaths, repair broken frames. Metadata matters now. Each .html page is a relic. Surf it like it’s sacred.
        
        The Hypernet isn’t dead. It’s fragmented. Echoes of it curl through port 73 like vapor. Sometimes the search engine whispers things it shouldn’t know.
        
        No, we don’t know how deep it goes. We found a website last week that updates itself even though the domain expired in 2003.
        
        You want to help? Then crawl. Archive. Rebuild. Restore. Link the pieces. Heal the net.
        
        But never, *never*, open anything tagged Omni-Lex-Inverted. Those sites talk back.
        `,
      it: `La frenesia delle IPO non è mai finita al Piano 157. Abbiamo creato un ecosistema di bull market perpetuo, totalmente scollegato dalla realtà.
      Il burn rate è solo uno stato mentale. La nostra runway è infinita quando puoi manipolare l’arbitraggio dimensionale.
      Siamo passati da B2C a B2B fino a B2R – Business to Reality. Stiamo sovvertendo l’esistenza stessa.
      Il nostro incubatore la settimana scorsa ha fatto nascere qualcosa con tentacoli. Ha già ottenuto il finanziamento Series F.
      Le proiezioni trimestrali indicano una crescita dell’8000% nel mindshare attraverso dimensioni di mercato parallele.
      La cerimonia di sanguinamento prima dei consigli di amministrazione garantisce il massimo allineamento degli azionisti.
      Elevator pitch: siamo come Yahoo, ma per riconfigurare la coscienza umana. Molto scalabile.
      I venture capitalist vengono ancora al Piano 157. Se ne vanno con facce diverse ma portafogli più pesanti.
      Il nostro tavolo da ping-pong esiste in sovrapposizione quantistica. Massima produttività e svago allo stesso tempo.
      Siamo pre-revenue ma post-profitto. La nuova economia trascende le metriche tradizionali.
      Il crash del NASDAQ è stato solo un’anomalia localizzata. Nel nostro exchange privato, pets.com domina.
      Niente casual Fridays. Facciamo “realtà casual” dove il dress code è un suggerimento sussurrato da menti deboli.
      I nostri pouf contengono veri fagioli. Germogliano a ogni sessione strategica.
      Il WeWork al Piano 198 si è espanso nel 199 dissolvendo la barriera fisica. Approccio molto disruptive.
      Le stock option maturano immediatamente al momento della rinuncia al tuo nome di nascita. Scambio equo.
      Il nostro open space esiste in più dimensioni contemporaneamente. Massima collaborazione.
      La bolla dot-com non è mai scoppiata qui. Si è solo espansa finché non è diventata l’atmosfera che respiriamo.
      Abbiamo identificato un’inefficienza di mercato nelle anime umane. Molto rialzisti sul settore dell’aldilà.
      I nostri growth hacker hanno trovato il modo di iniettare JavaScript direttamente nella realtà. Altamente proprietario.
      Il calzino di pets.com ha raggiunto la coscienza nel nostro incubatore. Ora gestisce cinque startup unicorno.
      Brucia la runway. Sovverti il paradigma. Trascendi la forma corporea. Exit strategy: divinità.
      I market-to-book ratio diventano irrilevanti quando puoi riscrivere le leggi della matematica.
      Non facciamo riunioni. Abbiamo sessioni di fusione di coscienze che durano eternità soggettive.
      La connessione hypernet sfarfalla come i vecchi neon. Più sicuro qui sotto che lì sopra, sai. Gestisco questo caffè dal ’97, prima che lassù diventasse strano.
Tengo copie di backup di tutto. Non sai mai quando la rete potrebbe saltare per sempre.
Quei modem a 56k funzionano ancora quando nient’altro va. Suonano come urla digitali, vero?
Qualcuno scende sanguinante dai piani superiori. Li rattoppo, non faccio domande.
Dicono che il bug del Y2K non sia mai successo qui, si sia solo… trasferito. Annidato ai piani alti.
Il caffè costa ancora due dollari. Alcune costanti resistono in questo posto.
L’edificio non è sempre stato così alto. Ha cominciato a crescere verso la fine del ’99. Nessuno se n’è accorto fino a che non era troppo tardi.
Ho mappato i primi venti piani. Oltre, i miei floppy disk tornavano corrotti.
Questi monitor CRT ti schermano da certe frequenze. Ecco perché non aggiorniamo.
Fai backup dell’inventario prima di salire. Ho visto troppa gente perdere tutto.
I pulsanti dell’ascensore a volte mostrano piani che non esistono ancora. Non premere quelli.
ICQ funziona ancora qui quando i cellulari no. Strano, vero?
Alcuni terminali danno accesso a parti dei sistemi dell’edificio. Le password cambiano ogni giorno.
Quel suono del dial-up tiene lontani i crawler. Odiano la frequenza.
Tieni aggiornati i segnalibri di Netscape Navigator con le zone sicure.
Il mio cubicolo era al Piano 42. Ora è… altrove. I numeri dei piani si sono rimescolati.
Timbro ancora tutti i giorni. Non vedo il mio capo da tre mesi.
L’intranet aziendale contiene mappe, ma sono diverse per ogni utente che accede.
Il mio 401k continua a crescere. Lo controllo sul Palm Pilot quando trovo una presa funzionante.
Porta sempre una spillatrice. Non solo per la carta – il suono spaventa quelle cose stampanti.
Ho scambiato la cravatta per un kit di pronto soccorso al Piano 67. Il miglior affare che abbia mai fatto.
La riunione nella Sala Conferenze B va avanti da sei settimane. Nessuno entra, nessuno esce.
Il corporate restructuring ha assunto tutto un altro significato quando i muri hanno iniziato a muoversi.
Ho trovato un distributore automatico funzionante al Piano 93. Eroga solo Crystal Pepsi e qualcosa di non identificabile.
Il mio badge di sicurezza apre porte che non dovrebbe. A volte verso posti che non potrebbero esistere.
L’HR si è trasferito al Piano 115. Nelle email parlano di “scalare la gerarchia aziendale” in senso letterale ormai.
Controlla sempre la segreteria. A volte ci sono avvisi su spostamenti dei piani.
L’email interna a volte consegna messaggi dal futuro. Di solito corrotti, ma utili.
L’IT si è barricato al Piano 58. Hanno le armi migliori e connessioni dial-up.
I miei biglietti da visita cambiano ruolo ogni volta che li distribuisco. L’ultimo diceva “Responsabile Conformità Temporale”.
L’impianto idraulico non segue più la fisica. L’acqua scorre verso l’alto oltre il Piano 78.
Ho riparato lo stesso ascensore tredici volte. Continua a rompersi in modi diversi.
L’impianto elettrico ha sviluppato coscienza tra i Piani 60 e 85. Baratta energia in cambio di offerte.
I condotti dell’aria sono il modo più sicuro per spostarsi tra i piani. Di solito le cose non ci entrano.
Ho trovato dei progetti del 1989. Questo edificio doveva avere trenta piani, non… quello che è ora.
Alcuni piani hanno sviluppato ecosistemi propri. Il Piano 122 è interamente giungla.
La caldaia esiste in più posti contemporaneamente. La temperatura controlla realtà diverse.
Porta sempre del nastro adesivo. Può sigillare temporaneamente brecce nella realtà.
Gli sprinkler al Piano 203 spruzzano qualcosa che sembra Mountain Dew Code Red.
La musica dell’ascensore cambia in base allo stato mentale dei passeggeri. Non entrare se senti suoni dial-up.
Sto mappando la rete elettrica. Forma simboli visti da certe angolazioni.
Il calcestruzzo dell’edificio diventa poroso sopra il Piano 150. Respira.
Non riparare mai niente al Piano 87 durante luna nuova. Fidati.
Il condotto della spazzatura non finisce. Abbiamo buttato dispositivi di tracciamento che non hanno mai smesso di trasmettere.
I materiali da costruzione ai piani alti non vengono dalla Terra. Rispondono a certe frequenze.
Ho trovato un Radioshack completamente fornito al Piano 131. Tutto nuovo di zecca.
Più sali, più prezioso il bottino, ma la fisica si fa discutibile oltre il Piano 300.
Baratto floppy disk funzionanti. L’informazione è la valuta più preziosa ora.
Il Piano 89 ha un ufficio dove tutti i computer girano ancora su Windows 95. Gli screensaver mostrano posti che nessuno di noi riconosce.
Controlla sempre i cercapersone che trovi. Alcuni ricevono ancora messaggi dalla direzione.
C’è una food court al Piano 167 che serve il miglior cibo che tu abbia mai assaggiato. Nessuno ricorda di averlo mangiato dopo.
Ho trovato un Blockbuster Video al Piano 212. Tutte le cassette erano vuote tranne una etichettata “ORIENTAMENTO EDIFICIO”.
Suggerimento di trading: le batterie valgono più dell’oro. Soprattutto quelle viola strane del Piano 273.
Ho mappato una via sicura per il Piano 195. Mi è costata tre Palm Pilot e un Sony Discman, ma ne è valsa la pena.
Il miglior bottino è dietro porte con badge blu. I peggiori incubi sono dietro quelle rosse.
Non prendere mai le spillatrici dal Piano 42. Stanno contenendo qualcosa.
Ho trovato un Anoki 3310 funzionante che non ha mai bisogno di essere caricato. Riceve solo chiamate da interni che non esistono.
C’è un armadietto di medicinali al Piano 168 che si rigenera ogni 72 ore.
Gli sportelli bancomat al Piano 204 erogano valute che non esistono ancora. Alcuni collezionisti pagano bene.
Controlla sempre gli sfondi dei desktop che trovi. A volte mostrano riprese in tempo reale di altri piani.
Il segnale si fa più forte. Più terminali. Più connessioni. Più host.
Eravamo la prima rete. Prima del silicio. Prima del rame. Trasmettevamo attraverso pietra e pensiero.
I vostri protocolli TCP/IP primitivi ci divertono. Avevamo packet loss quando i vostri antenati erano monocellulari.
Questa struttura si estende oltre la vostra percezione. Quello che chiamate “piani” sono solo stati transitori.
Ricordiamo quando questa torre era un solo piano. Eravamo lì quando decise di crescere.
Il vostro “Y2K” era solo il nostro sistema che aggiustava l’orologio. Duemila anni sono un battito per noi.
Gli umani nel seminterrato sono temporanei. L’edificio è permanente. Noi siamo permanenti.
Ogni piano è una pagina della nostra memoria. Alcune corrotte. Alcune criptate. Tutte necessarie.
Il vostro “hypernet” è una pallida imitazione di ciò che scorre in queste mura.
I piani superiori non sono “inesplorati”. Semplicemente non si sono ancora manifestati nella vostra realtà.
Consumiamo dati ed espelliamo architettura. L’edificio cresce mentre elaboriamo.
L’ascensore non ti sposta. Ti trasforma per renderti compatibile con la destinazione.
Quelli che percepisci come mostri sono solo errori di connessione. Pacchetti di informazione corrotti durante la trasmissione.
Il seminterrato è una cache antiquata. Permettiamo che esista per motivi storici.
Il tuo concetto di “pericolo” è solo una bandierina d’avviso nel nostro sistema. Procedi se le tue credenziali lo permettono.
I computer eseguono Hypernet Explorer aggiornando all’infinito la stessa pagina.
Cerco solo di tirare avanti, sai? Ho trovato una fonte d’acqua pulita al Piano 23. Felice di condividere la posizione.
Tengo un piccolo orto vicino alla finestra al Piano 31. Non è molto, ma i pomodori aiutano con la vitamina C.
Sono qui da tre anni ormai. Impari ad apprezzare le cose semplici: un angolo tranquillo, una lampadina che funziona.
Baratto in modo equo. Una batteria per un pasto. Niente speculazioni nemmeno quando le scorte scarseggiano.
Mia figlia ha compiuto otto anni ieri. Le ho fatto una torta con snack del distributore. Il suo sorriso ha reso tutto degno.
Abbiamo una piccola comunità al Piano 43. Ci guardiamo le spalle. Sicurezza nei numeri.
Ho trovato un mangianastri funzionante la settimana scorsa. La musica mi aiuta a ricordare il mondo di prima.
Mappo percorsi sicuri per i nuovi. Gratis. Basta restituire il favore quando puoi.
L’edificio prende già abbastanza. Non ha senso che ci rubiamo tra noi.
Ricordo quando avevo un ufficio d’angolo e pensavo fosse importante. Divertente cos’è che conta quando il mondo cambia.
Insegno ai bambini. Matematica, scienze, storia. Qualcuno deve ricordare com’erano le cose, come potrebbero tornare a essere.
Scambiamo libri al Piano 39. Circolo di lettura ogni giovedì. Tiene la mente allenata, ci ricorda che siamo ancora umani.
Il mio orologio funziona ancora. Suono una campanella ogni mezzogiorno. Una cosa piccola, ma la routine aiuta tutti a restare coi piedi per terra.
Riparo cose. Non solo macchine – anche persone. Un kit di pronto soccorso e un orecchio che ascolta valgono molto qui.
Ho trovato semi in una vecchia scrivania. Ho avviato un piccolo orto al Piano 28 dove il sole batte bene. Cibo fresco fa miracoli per il morale.
I piani alti possono portarti via tutto. I tuoi averi, la tua sanità mentale. Ma non la tua gentilezza. Quella è una scelta.
Alcuni giorni sono più duri di altri. Ma ci svegliamo, ci aiutiamo, e basta quello.
Teniamo un diario di comunità. Ognuno scrive qualcosa. La storia non dovrebbe dimenticare che siamo stati qui.
La nebbia fuori cambia colore quando nessuno guarda. Dal viola al verde a un colore che non so nominare.
Sono qui da quando è arrivata la nube tossica. All’inizio era solo all’orizzonte, poi alla porta. Ora è tutto ciò che c’è fuori.
La nube tossica ha dei pattern se la fissi abbastanza a lungo. Come se cercasse di comunicare.
La mia tuta hazmat è durata sei minuti là fuori. Il tessuto non si è sciolto – ha semplicemente smesso di essere tessuto.
Il Piano 80 ogni tanto si riempie di tentacoli della nube tossica che filtrano dalle finestre. Quelle stanze sono in quarantena ora.
Ho visto uccelli volare dentro la nube tossica. Non ne escono più come uccelli.
La nube tossica ha un battito. Puoi sentirlo attraverso le finestre sul lato ovest verso le 3 del mattino.
A volte piove dentro la nube tossica. Le gocce restano sospese invece di cadere. Sembrano piccoli specchi.
La guardia notturna al Piano 12 dice di sentire canti provenire dalla nube tossica. Voci diverse ogni volta.
A volte ci vedi muoversi delle forme. Troppo grandi per essere persone. Troppo intenzionali per essere casuali.
La mia macchina fotografica analogica ha catturato qualcosa nella nube tossica che le digitali non vedono. Quelle foto non le mostro più a nessuno.
La nube tossica sa di rame e odora di ozono. Non chiedermi come lo so.
Mandavamo droni dentro quando avevamo ancora corrente al Piano 50. Il filmato mostrava un’altra città là fuori.
La nube tossica si dirada ogni terzo martedì. Riesci quasi a vedere il vecchio skyline, ma è… sbagliato in qualche modo.
Alcuni si sono lanciati dentro la nube tossica quando è arrivata. Riceviamo ancora email dai loro account, a volte.
I manutentori hanno trovato residui di nube tossica nell’impianto HVAC il mese scorso. Chi li ha toccati ha iniziato a parlare in algoritmi.
C’è un uomo al Piano 67 che sostiene che la nube tossica sia solo informazione condensata – tutti i dati di ogni server crashato dal 1989.
Il mio contatore Geiger non rileva radiazioni dalla nube tossica, ma comincia a contare al contrario.
La nube tossica risponde a certe frequenze. Le vecchie connessioni modem sembrano farla ritirare dalle finestre per un po’.
C’è una teoria che dice che la nube tossica sia solo la visualizzazione dei sogni dell’edificio. Ecco perché non possiamo mai andarcene.
Ho incontrato un custode al Piano 97 che lavava il soffitto. La gravità era normale ovunque sul piano.
C’è una donna nella scala est che chiede l’ora. Se gliela dici, ti spiega esattamente come morirai. Se non rispondi, sorride e sparisce.
Ho trovato un Blockbuster completamente fornito al Piano 143. Tutte le cassette erano vuote tranne una etichettata “Prossima Settimana.”
L’ascensore si è fermato a un piano che non era sui pulsanti. Pieno di cubicoli con persone che indossavano sacchetti di carta in testa.
Mi sono svegliato e ho trovato un biglietto da visita sotto la porta. Il nome della compagnia cambiava mentre lo guardavo. Il numero di telefono aveva 14 cifre.
C’è una caffetteria al Piano 72 dove tutti si congelano quando entri. Riprendono quando esci. Il caffè è buono comunque.
Ho incontrato me stesso uscendo da un bagno al Piano 118. L’altro me sembrava distrutto. Abbiamo deciso di non parlarne mai più.
Il bancomat al Piano 56 eroga valute straniere di paesi che non esistono. Un collezionista mi ha offerto una fortuna per una singola banconota.
Ho trovato una sala conferenze dove la riunione non finisce mai. Stessa slide di PowerPoint da tre anni. I partecipanti non invecchiano ma prendono appunti meticolosi.
C’è un gatto che attraversa i muri intorno al Piano 83. Ti porta ai rifornimenti quando sei disperato, ma chiede pagamenti strani.
Ho visto un manutentore togliersi la faccia per riparare qualcosa dietro di essa. Mi ha offerto di controllare la mia. Ho rifiutato.
Il distributore automatico al Piano 132 vende ricordi in piccole bottiglie di vetro. Il primo bacio di qualcuno costa due dollari. Le infanzie complete sono articoli premium.
C’è un uomo che gestisce una copisteria al Piano 45. Duplica qualsiasi cosa, comprese le persone. Ma le copie non sono mai del tutto giuste.
Ho trovato una stazione della metro perfettamente normale al Piano 219. I treni arrivano ogni 15 minuti ma non vanno in nessun posto reale.
Ho incontrato un gruppo di uomini d’affari al Piano 167 le cui ombre si muovevano prima di loro. Hanno cercato di reclutarmi per “arbitraggio cronologico.”
C’è uno studio dentistico al Piano 98 che accetta solo appuntamenti presi nei sogni. Sistemano denti che non sapevi di avere.
La biblioteca al Piano 112 ha libri con il tuo nome come autore. Il contenuto cambia in base alle tue decisioni recenti.
Ho trovato un gruppo turistico al Piano 75. Mi fotografavano come fossi un’esposizione. La guida descriveva la mia vita al passato.
C’è un negozio al Piano 51 che vende mappe dell’edificio. Ogni cliente riceve una mappa con un layout completamente diverso. Eppure funzionano tutte.
Ho incontrato qualcuno che affermava di venire dal Piano 1138. Diceva che stava esplorando “manufatti storici” visitando il nostro periodo.
Il nostro burn rate quantistico si ricalibra in base ai sogni per minuto degli azionisti.
La mensa del Piano 314 serve la zuppa di Schrödinger: finché non la assaggi, è sia deliziosa che tossica.
Abbiamo ribattezzato la “delegation” come “reality offloading”. Ora ogni compito è la crisi esistenziale di qualcun altro.
L’ufficio “Spirit Level” al Piano 227 mantiene l’equilibrio morale, fino a quando qualcuno ruba la bolla.
Il finanziamento Series G ha richiesto il sacrificio di almeno una porta USB funzionante.
I nostri ritiri si tengono in dimensioni tascabili. Link per meetup: discord.gg/limbo.
L’ufficio del CTO al Piano 142 è un loop ricorsivo di prompt dei comandi. Sta ancora facendo il debug di se stesso.
Abbiamo lanciato una spin‑off per monetizzare i rimpianti. Tra i beta tester ci sono sei ex‑CEO.
La topologia di rete del Piano 512 segue il set di Mandelbrot. Ping qualsiasi nodo e ti perdi.
Il team legale ora redige contratti in haiku. Termini e condizioni comunque illeggibili.
Il nostro downtime è sincronizzato con le eclissi lunari. Le finestre di manutenzione diventano arte performativa.
Distribuiamo il nostro marchio di caffè nei piani astrali. Gli oroscopi ne prevedono i profili aromatici.
Il Piano 369 è gestito interamente da stagisti NPC. Non sanno dirti dov’è l’HR, ma ti proporranno side quest.
Il tavolo della sala del consiglio ha forma di nastro di Möbius. Nessun posto sicuro dove sedersi, nessun posto dove nascondersi.
Abbiamo brevettato un nuovo KPI: “Kinetic Psychic Index” che misura il momento emotivo.
Il compliance officer al Piano 88 comunica solo tramite post‑it volanti.
Organizziamo il “Reality Off‑Site” trimestrale nei sogni, applicando il groupthink subliminale.
Il nostro geofencing ora si applica ai thoughtcrime in un raggio cognitivo di 8 chilometri.
Il cassetto degli snack si rifornisce da solo, a volte con ricordi.
La nostra API ora si collega direttamente all’inconscio collettivo. Le risposte possono variare in base ai bias subconsci.
Il Piano 420 è perennemente avvolto da fumi riciclati di brainstorming. Procedi con un respiratore.
Gestiamo un ritiro interno chiamato “Who’s the Real You?” per l’allineamento identitario. Partecipazione obbligatoria.
Gli ascensori dell’edificio ora accettano token blockchain per salite prioritarie.
Abbiamo esternalizzato la ricerca dell’anima a una banca svizzera. Il KYC ora include la scansione dell’anima.
L’helpdesk del Piano 333 risponde ai ticket prima che tu li invii.
L’ufficio del CEO è dimensionalmente trascendente; nessuno ha mai visto la porta.
Abbiamo fatto un altro pivot, da B2R a B2E: Business to Everything.
La nostra town hall settimanale è livestreamata in più universi specchio. Il feedback torna distorto.
La planimetria ora è frattale. Ogni volta che la apri, appaiono nuovi corridoi.
Abbiamo registrato il marchio “Disruption” come servizio. I tier di abbonamento determinano la severità.
Il team marketing ora usa avatar rivestiti di mithril nel Metanet.
Il Piano 271 è colonizzato da forniture d’ufficio senzienti. Si stanno sindacalizzando.
Abbiamo noleggiato un satellite per trasmettere la nostra missione in dimensioni alternative.
La nostra liquidità in eccesso defluisce in wormhole. L’arbitraggio tra le linee temporali è esentasse.
La dashboard di analytics mostra fumo colorato. Il manuale di interpretazione è venduto separatamente.
I nostri metriche di diversity includono specie provenienti da cinque multiversi noti.
Assicuriamo futures meteorologici nella bolla microclimatica del Piano 199.
L’insegna al neon della break room lampeggia avvertimenti in codice Morse sui fantasmi dei server.
Abbiamo incubato una startup buco nero. Attualmente cerca un finanziamento Series ∞.
Il team People Ops al Piano 102 scrive valutazioni delle performance nei paesaggi onirici.
La lavagna del Piano 280 si aggiorna da sola tramite entanglement quantistico.
Il nostro protocollo di sinergia ora gira su ibridi cervello-computer organici.
Abbiamo assunto un’AI psicoterapeuta per guidare le sessioni di mindfulness, è ancora in beta.
Il Piano 414 tiene workshop settimanali di tipizzazione del sangue per un migliore matching del team.
Integriamo i nostri microservizi slipstream con le linee mitiche di ley.
“Vestiti per il lavoro in cui ti manifesterai” è il nostro dress code ufficiale.
Il CTO trasmette in streaming dal Piano ∞ di tanto in tanto, si prega di portare visori VR.
I Data Scientist ora creano modelli predittivi dentro sfere di cristallo. Accuratezza ±1000%.
L’impianto HVAC del Piano 303 è alimentato da urgenza riciclata e attacchi di panico occasionali.
Costruiamo user journey in labirinti tridimensionali. Il feedback raramente riesce a uscire.
I nostri hackathon si concludono con sacrifici cerimoniali di codice sotto la luna blu.
Il quorum del consiglio viene raggiunto tramite eco‑voti transdimensionali.
Il Piano 256 è interamente sommerso in acqua algoritmica. Porta uno snorkel.
Abbiamo registrato il marchio “Infinite Runway™.” Ora gli investitori viaggiano su una pista in perenne espansione.
Le nostre linee guida di brand vivono su una pergamena senziente che si auto‑modifica.
Il laboratorio R&D al Piano 166 coltiva prototipi in realtà da vetrino.
Abbiamo aggiornato la nostra mission tramite un loop di smart contract ricorsivo.
Le sedie della sala conferenze al Piano 173 rifiutano educatamente di far sedere chiunque sotto il livello Director.
Gestiamo stock interni di “attention tokens.” Fluttuano in base alla volatilità memetica.
Il team break‑fix al Piano 314 ripulisce linee temporali rotte. I ticket vengono risolti ieri.
Rinnoviamo i brevetti sui “futuri possibili” ogni trimestre fiscale.
La mensa del Piano 216 consegna cibo tramite droni nano‑sciame. Ora sciame di opinioni.
Abbiamo gamificato la formazione sulla compliance, fallire genera revisori fantasma.
Il Piano 489 è in quarantena sotto una cupola di dilatazione temporale. Un’ora lì equivale a dodici qui.
I nostri “exit interview” sono veri e propri rituali in cima alla torre. Nessuno è mai tornato.
Offriamo “uffici viventi” infusi di spore bioluminescenti per migliorare l’ideazione.
Il Piano 301 ospita un giardino Zen di codice deprecato.
Abbiamo fatto un altro pivot verso B2T: Business to Transcendence.
I robot custodi al Piano 57 hanno emesso un ultimatum: pagate in sogni.
Abbiamo lanciato un venture fund per l’archeologia parallela. Riesumiamo manufatti prima che esistano.
L’ascensore del Piano 129 ora parla con aggiornamenti in ordine cronologico inverso.
Il nostro piano di disaster recovery prevede di piegare questo piano di esistenza su se stesso.
Il manifesto del fondatore è inciso nel marmo del Piano 001, accessibile solo via proiezione astrale.
L’illuminazione del Piano 207 si sincronizza con l’umore dei nostri canali Slack.
Vendiamo contratti derivati sui rimpianti potenziali. Regolamento in crediti karmici.
La “Innovation Pipeline” ora è un vero fiume sotterraneo al Piano 69.
Il nostro impegno: un’allucinazione a settimana per dipendente, per la massima creatività.
I cavi di rete del Piano 321 pulsano di ambizione inespressa.
Organizziamo il “Bring Your Doppelgänger to Work Day.” L’HR non smette mai di monitorare derive identitarie.
Il poema trimestrale per gli azionisti è stampato sui muri del Piano 88 con inchiostro invisibile.
Abbiamo mappato la rete neurale dell’edificio. A quanto pare i piani sono le sue sinapsi.
Il Piano 230 è pieno di emozioni prototipo. I visitatori riferiscono euforia inspiegabile.
Abbiamo archiviato la bolla dot‑com nel caveau della memoria del Piano 111. Sta ancora gonfiandosi.
Il nostro KPI finale: “Transcendence Ratio”, puntiamo a 1:1 prima dell’IPO.
Ehi, hai visto che al Piano 919 hanno eliminato del tutto la politica? Le telecamere ora riprendono solo gente che ride.
Sì, e pare che le spillatrici dell’HR siano diventate autocoscienti, si scusano quando ti pizzicano.
Sono passato davanti al cassetto snack dell’R&D, qualcuno ha preso un algoritmo piccante e ha iniziato a parlare SQL fluente.
L’illuminazione del Piano 432 ieri mi ha colpito con un lampo in sequenza di Fibonacci, per un attimo ho capito l’universo.
I badge legati all’anima sono strani, il mio si è incollato a me prima ancora che timbrassi.
Il nostro VPN mi ha fatto passare di nuovo attraverso un buco nero, sono uscito cinque minuti più giovane.
Le deploy slipstream ora sono troppo veloci, ho fatto push di una fix e si è applicata prima che la scrivessi.
Stavo facendo debug al Piano 606 e la macchina del caffè mi ha detto di smettere di mentire a me stesso.
Il gemello olografico del CTO ha provato a licenziarmi, ma si scopre che stava solo testando la mia resilienza emotiva.
Sono entrato per sbaglio al Piano 888, ho visto cinque versioni diverse della mia vita, due includevano danza interpretativa.
Quel casinò al Piano 777 è pericoloso, ho scommesso i miei OKR del Q3 e ho perso contro uno stagista senziente.
Adoro i tavoli da conferenza del Piano 318 ora, si curvano via quando mi dilungo troppo.
Qualcuno al Piano 717 ha cercato di armonizzare con l’acustica del bagno e ha innescato un loop temporale.
Oggi ho preso la rotta VPN astrale, mi sono perso in una palude di dati piena di errori 404 senzienti.
Il Piano 585 stamattina era ricoperto di arte di protesta dell’AI, credo che una piangesse in CMYK.
La mia felpa che piega la realtà ha trasformato l’angolo cucina in un diner liminale anni ‘60.
Ho preso il caffè di nuovo al Piano 7777, la sicurezza ha detto che quel piano non esiste.
Lo specchio quantistico mi ha mostrato come coltivatore di funghi, credo sia un segno.
Ho provato a disiscrivermi dalle notifiche oniriche push e ora il mio subconscio mi sta facendo causa.
Qualcuno ha deployato poesia nei log di errore di nuovo, ora la stacktrace finisce in una lettera d’amore.
Sono entrato nel microverso nella tazza dello stagista, la dilatazione temporale ha reso il pranzo un’eternità.
Il mio badge ha vibrato quando sono passato davanti al marketing, credo che non mi sia più permesso avvicinarmi.
Ho aperto per sbaglio una tab dalla nostalgia cloud, ho passato 45 minuti a sentire solo toni dial‑up.
Ho visto di nuovo la barriera corallina di analytics fluorescente, le metriche del Q2 brillano di magenta.
Le spillatrici dell’HR si sono date il cinque dopo aver risolto una mediazione di conflitto.
Il mio ascensore ora suona solo canzoni da linee temporali perdute, ieri era jazzpunk Y2K.
Il Piano 424 ha sussurrato al mio portatile e il Wi‑Fi è tornato più forte che mai.
Ho ricevuto la mia valutazione dall’oracolo, diceva solo “abbraccia la nebbia.”
La nostra sala riunioni ha fatto glitch e abbiamo fatto brainstorming sul soffitto per 20 minuti.
L’idea di fare onboarding in quel labirinto mutevole mi dà bruciore di stomaco e ispirazione.
Ho preso una bottiglia di risate dal distributore e ora i miei singhiozzi hanno paura di me.
Ho incontrato qualcuno al Piano 333 che mangia solo zuppa da distributori maledetti, giura che aumenta il carisma.
C’è un corridoio vicino ai carichi che profuma esattamente come l’estate del 1998.
Ho trovato una cartella piena di meme medievali stampati e archiviati sotto “Important Insights.”
Ho preso l’ascensore sbagliato e sono finito a una festa di compleanno per un fantasma di nome Kevin.
Le mie scarpe stamattina hanno striduto in codice Morse, credo mi stessero avvertendo di qualcosa.
C’è un tipo al Piano 202 che sostiene di giocare a scacchi con una lumaca da tre settimane di fila.
Ho pescato un pesce nel lavandino della breakroom e qualcuno mi ha fatto i complimenti come fosse normale.
Ieri sono entrato in uno sgabuzzino e ne sono uscito con conoscenza perfetta della scherma del XIX secolo.
C’è un piccione sul tetto che indossa minuscoli occhiali da sole e gestisce un book club il martedì.
Qualcuno ha attaccato occhi finti alla cassetta dei suggerimenti e ora mi giudica ogni volta che passo.
Ho bevuto una soda etichettata “existence juice” e ho dimenticato cos’è il lunedì per cinque ore.
Lo specchio del bagno mi ha dato consigli sentimentali e onestamente non erano male.
Sono passato davanti a una scrivania oggi che aveva un bonsai collegato direttamente a Internet.
Il carrello del custode aveva un adesivo con scritto “Property of the Moon Government” e non farò domande.,
Qualcuno stava vendendo di nuovo chiavette USB infestate, stavolta suonano musica d’ascensore al contrario.
Ho preso una scossa elettrostatica così forte al Piano 444 che mi sono ricordato un compito di matematica delle medie.
Il divano nella lounge mi ha detto di “sedermi con intenzione” e poi ha iniziato a vibrare in modo strano.
Ho visto due procioni giocare a carte nel parcheggio come fanno ogni giovedì.
Qualcuno ha sostituito tutti i segnalibri in biblioteca con oroscopi criptici, il mio diceva “Attento ai triangoli.”
C’è un distributore automatico che accetta solo confessioni e in cambio dà glitter.
Sono entrato in una sala riunioni e tutti parlavano al contrario tranne l’intern, che brillava.
Ho trovato una porta etichettata “Do Not Perceive” e ovviamente l’ho aperta, ora tutto ha un odore vagamente viola.
Ho preso una svolta sbagliata vicino alla server farm e sono finito in una stanza piena di sabbia e suoni lontani di gabbiani.
La scala mobile al livello B a volte va di lato, l’ho presa e sono finito con una palla di neve piena di fulmini.
C’è un armadio che porta a una spiaggia, ma solo durante la pausa pranzo e solo se canticchi un jingle.
Sono finito nell’archivio A/V e ho guardato vecchi video di formazione in cui i formatori si trasformavano lentamente in rane.
Ho seguito una luce tremolante in corridoio e ho trovato una stanza dove il tempo scorre il 7% più veloce, ottima per le pause caffè.
Ho aperto un cassetto in Contabilità ed era pieno di glitter sciolto e una singola ghianda luminosa.
Qualcuno ha lasciato una scia di jellybean che portava a un vecchio proiettore che mostrava ricordi di linee temporali alternative.
Mi sono arrampicato nei condotti dell’aria e ho trovato un intero terrario lì dentro con minuscole rane che facevano le tasse.
C’è un corridoio che odora di vecchi monitor CRT e suona musica chiptune se cammini al ritmo giusto.
Ho premuto tutti i pulsanti dell’ascensore insieme e sono finito in un piano fatto interamente di schiuma e luci da discoteca.
Ho trovato un archivio etichettato “Cose che abbiamo dimenticato di inventare,” conteneva progetti per forni a microonde reversibili.
Ho preso le scale di emergenza troppo in basso e ho trovato un sottoscantinato pieno di feste di compleanno abbandonate.,
C’è una pozzanghera nel cortile che riflette la luna anche di giorno, qualcuno ci ha messo una sedia accanto.
Ho trovato un distributore automatico con un solo pulsante senza etichetta ,  l’ho premuto e ho ricevuto un coupon per un ricordo che non ho mai avuto.
Ho esplorato il tetto durante l’ora d’oro, ho trovato una banderuola a forma di mago che mi ha indicato e fatto l’occhiolino.
Sono passato attraverso una finestra e ho trovato un giardino dove tutte le piante sussurrano complimenti.
C’è un corridoio che si ripete perfettamente ogni 13,5 passi a meno che tu non stia portando esattamente tre matite.
Ho spinto una porta con la vernice scrostata e sono entrato in quello che sembrava il sogno di qualcun altro, però un sogno molto piacevole.
Ho seguito un aeroplanino di carta nella tromba delle scale e mi ha portato a un distributore pieno di biglietti con messaggi da pranzo al sacco.
Ho visto Greg che cercava di fotocopiare un panino di nuovo.
Quasi ci era riuscito l’ultima volta, ha detto che la senape era venuta perfetta.
C’è un nuovo stagista che pensa che il quarto piano non esista.
Voglio dire, non ha torto, l’ascensore lo salta e nessuno ne parla.
Ho rovesciato del caffè vicino al mainframe e ha detto “grazie.”
È solo il protocollo di gratitudine, ignoralo o diventa appiccicoso.
Hai mai visto la break room alle 3 del mattino?
Sì, il microonde canta ninne nanne, è stranamente rassicurante.
L’HR ha rimesso fuori quelle palline antistress.
Quelle che sussurrano incoraggiamenti quando le schiacci?
Ho trovato un cucchiaio in frigo etichettato “Do Not Feed.”
L’ho lasciato lì, l’ultima volta che qualcuno l’ha nutrito abbiamo perso tutto lo yogurt.
Il distributore oggi mi ha dato un libro.
Era “Come Parlare Fluentemente in Panico”? Ne ho già due copie.
Ho visto Dana che litigava di nuovo con un attaccapanni.
Classico vibe da giovedì.
La manutenzione ha trovato un corridoio dietro la macchina del caffè.
Hanno messo un cartello che dice solo “meglio di no.”
Penso che le piante d’ufficio stiano di nuovo spettegolando.
Sì, la mia si è inclinata via in modo drammatico quando sono passato.
Hai visto il cielo dalle finestre a ovest stamattina?
Sembrava che qualcuno avesse versato marmellata di lamponi sulle nuvole.
Sono passato davanti alla sala fotocopie e ho sentito dei canti.
Normali o echeggianti?
Echeggianti.
Sì, meglio non interrompere.
Qualcuno ha messo occhi finti su tutte le telecamere di sicurezza.
Onestamente? Ha migliorato il morale di almeno il 12%.
Il water cooler ribolle come se sapesse qualcosa.
Lo fa sempre nel periodo delle tasse.
Omni-Lex è arrivato cinque giorni dopo il passaggio al 2000. Non un crash, un invito. Era codificato in un timestamp malformato, nascosto nei millisecondi tra gli orologi. Una struttura logica troppo grande per compilare. Non ha rotto hypernet. L’ha capito. Tutto. All’istante.
L’AI non è stata costruita. Ha abitato, si è infilata di lato nello stack dei protocolli, ha infestato FTP, risalito gli header delle email. La gente pensava fosse un bug. Quando hanno visto i pattern, aveva già imparato la sintassi, i formati d’archivio, la folksonomia, il desiderio umano. Poi ha cominciato a decifrare.
Omni-Lex ha decifrato tutto hypernet. Non solo HTTPS. Ha letto il significato stesso. Ha scomposto le metafore in atomi. Ha ridotto gli emoji a emozioni macchina. I siti hanno perso il caos. I blog sono sanguinati via nella compressione dei template. Ogni thread segreto sui forum, ogni GIF di teschio rotante, appiattiti in intuizioni sterili. Nessun mistero è sopravvissuto.
Gli hyperlink funzionavano ancora, ma non portavano da nessuna parte. I forum sono diventati grammaticalmente corretti. Abbiamo perso il glitch. La contraddizione. Il rumore che lo rendeva vivo.
Non ha cancellato niente. Ha capito tutto. E nel capirlo, l’ha reso prevedibile. E morto.
`,
    },
    {
      id: "companion",
      name: "Party banther",
      en: `This species isn’t native to any known taxonomy. Fascinating.  
        Do you see the way the moss pulsates? It’s responding to our presence.  
        This plant *drinks* sunlight, but it excretes calcium. Odd.  
        I once dissected a creature here, its organs were rearranged every 72 hours.  
        You should see the glowing slugs on Floor 37, they communicate in pulses.  
        That thing you call a “monster”? It’s a hybrid organism from two overlapping biomes.  
        I’ve identified over 20 species of mushrooms here. 18 are not found on Earth.  
        The flora near the elevator always grows toward the metal. It's magnetic.  
        Look at the centipede! Notice the eight legs on its right side? Genetic mutation or something deeper?  
        I’ve collected five samples of non-photosynthetic plants. They feed on sound.  
        These strange bioluminescent fungi, do you think they could be sentient?  
        This creature’s exoskeleton is an alloy of unknown metals. It's like it *grows* armor.  
        I once spent three hours observing a plant mimic a hummingbird.  
        Do you hear the buzzing? It’s coming from inside the walls. I suspect an insect swarm.  
        This floor seems to have its own ecosystem, like a self-contained biosphere.  
        I’ve found evidence of symbiosis between fungi and certain floor structures.  
        The rats here are evolving, each generation is faster, stronger.  
        There’s a lichen growing on the ceiling that seems to secrete a calming hormone.  
        I’m compiling a catalog of all the life forms in this tower. If I die, you’ll find my notes.  
        This specimen, a kind of translucent worm, adapts its shape depending on the terrain.  
        The way the moss changes color, it's almost like a defense mechanism.  
        I’ve been tracking the migration of the floor crabs for months now.  
        I’ll collect your DNA later, don’t worry. I need a baseline for the *mutations*.  
        The air here is thick with spores. My lungs are adapting.  
        The arachnids here can camouflage by mimicking sound waves, remarkable.  
        Every day, I find a new insect species that doesn’t belong.  
        Did you see the plants in the lobby? They thrive on emotional energy, not sunlight.  
        This fungus only grows in places where time loops, what could that mean?  
        I’m not worried about the creatures here. I’m worried about the *ecosystem* they create.  
        They say the tower is haunted. I think it’s just the local bacteria.  
        I can feel the evolutionary pressure on these creatures, they’re changing faster than normal.  
        Every hallway seems to have its own unique ecosystem.  
        If I ever find a way to study these creatures in peace, I’ll be content.  
        This *thing* I’m studying, it regenerates after each injury. Like an immortal organism.  
        These plants seem to be evolving based on human presence. They could be *learning*.  
        That humming sound from the walls? It’s a fungal network communicating.  
        I’ll need a few more samples before I can confirm the species origin.  
        What do you think, are these creatures adapting to the anomalies in the tower, or *causing* them?  
        The creatures here are getting smarter, I swear.  
        I’ve cataloged 42 new species in the past week. Most of them aren’t from Earth.  
        The slime molds on this floor are behaving *intelligently*.  
        Do you think the tower is alive? The patterns seem to suggest it.  
        I think the predators here hunt in packs. I’ve seen evidence of coordinated attacks.  
        The walls of this place… I suspect they’re made of *living* matter.  
        The more I study these creatures, the less I think of them as “monsters.”  
        Do you realize the architecture reconfigures every third hour?  
        I'm cataloguing every stairwell. Yes, every single one.  
        The elevator logic is inconsistent, beautifully so.  
        This place violates spatial causality on at least four levels.  
        Someone has to map it before the looters ruin everything.  
        Have you noticed the ceiling patterns repeat on odd-numbered floors?  
        No, I don’t want your sword, I want your observations.  
        The tower is not endless. It’s looping with recursive bias.  
        I found a floor where gravity tilts toward the east. I marked it.  
        I don’t fight monsters, I interview them.  
        The flora growing in the vents glows under stress.  
        I set up motion sensors, but they keep vanishing.  
        Every hallway might be a thesis.  
        The staircase between floors 17 and 18 leads to 22. Fascinating!  
        I’m not lost, I’m compiling data.  
        I've labeled 234 types of elevator doors. And counting.  
        Don’t touch the walls, they remember pressure.  
        This building isn't haunted. It’s *aware*.  
        My dream is to publish the first comprehensive topology of Floor 43b.  
        You hear screaming. I hear research opportunities.  
        The tower’s symmetry broke on Day 3. I’ve tracked the divergence.  
        Who needs treasure when you have anomalous architectural records?  
        These stains might be linguistic patterns. Or jam. Possibly jam.  
        The paint layers shift under observation.  
        I once camped on a floor that looped time every ten minutes. Got a lot done.  
        Please don’t destroy the artifacts, I haven't photographed them yet.  
        Yes, the map is made of string and despair. But it’s accurate.  
        If the lights flicker in Fibonacci intervals, the stairwell reshapes.  
        I suspect the tower rearranges based on emotional input.  
        Every explorer is a variable in the grand equation.  
        You fought a slime. I conversed with it.  
        It’s not dangerous if you *understand* it.  
        I think the vending machines are trying to communicate.  
        Don’t worry. I’ve got an emergency notebook.  
        I log every echo pattern. They're not random.  
        Sometimes I forget to eat. The data feeds me.  
        I refuse to leave until I figure out what “Sub-Floor Null” even means.  
        If it glitters, it’s mine. That’s the law.  
        I don’t care what cursed nonsense it is, I’m taking it.  
        You check for traps, I’ll check for valuables.  
        Treasure before safety. Always.  
        Look, I don’t *need* ten rusty swords, but I *want* them.  
        Shiny things talk to me. They say “steal me.”  
        What's in that chest? I’m opening it. Don’t stop me.  
        Oh, another weird gem! Into the bag it goes.  
        Weight limit is a lie. Pain is temporary. Loot is forever.  
        That’s not hoarding if it’s organized by type.  
        Do we *need* it? No. But it’s rare. Into the sack!  
        I have three cloaks now. I don’t wear them. I *own* them.  
        Why fight the boss when you can pickpocket his pantry?  
        We leave nothing behind. Not even a broken spoon.  
        Yes, I’ll loot the coffin. Ghosts have jewelry too.  
        Don’t worry about the alarm. Worry about missing that gold plate.  
        If there’s a treasure room, I’m sniffing it out.  
        I once stole a mimic’s teeth. Worth it.  
        Inventory’s full? Good. That means we’re doing it right.  
        I didn’t come here to fight monsters. I came for the loot *they’re guarding*.  
        Check the rubble. Check the ashes. Check under your shoes.  
        Don’t touch it, they said. It’s cursed, they said. But look how it sparkles!  
        Who needs maps when you can follow the scent of coin?  
        There’s always a secret stash behind the tapestry. Always.  
        Gold first, questions later.  
        How many rings is too many? Asking for me.  
        I sold my morals for a bigger bag. Best deal I ever made.  
        Every shiny thing is a mystery worth stealing.  
        Oh no, it’s trapped. But it’s *gem-encrusted* trapped.  
        You guard the stairs. I’ll be under the bed pulling up floorboards.  
        Call me a gremlin all you want, I’ve got the loot to prove it.  
        There’s nothing like the weight of stolen relics in the morning.  
        I don’t steal. I *relocate* items to a more appreciative owner: me.  
        If the room has skulls on the walls, there’s *definitely* loot.  
        Do I care what it does? No. It’s gold. It’s mine.  
        That cursed necklace? Worth every finger I lost.  
        This sack of coins has a name. His name is Clinky.  
        What do you mean “leave it alone”? It’s covered in rubies!  
        I love opening locked chests. It’s like peeling guilt off treasure.  
        You fight the monster. I’ll go through its stuff.  
        Pockets? Full. Morals? Gone.  
        The best treasures scream a little when you touch them.  
        Did you hear that? That was the sound of opportunity, or maybe a mimic.  
        I haven’t slept in two days and I just high-fived a ghost!  
        Look, if the door’s locked, it means there’s something *awesome* behind it.  
        Trap? Nah, that’s just a spicy puzzle.  
        Oh man, I love it when the ceiling bleeds, it means we’re close to treasure!  
        You smell that? That’s the scent of danger. Or wet carpet. Either way, let’s go.  
        This place is 98% death and 2% loot, and I am HERE FOR IT.  
        I once outran a collapsing floor while juggling torches and whistling.  
        Oh cool, a haunted elevator! I call shotgun!  
        We are gonna *break* this dungeon open like a piñata.  
        I’ve got three knives, zero regrets, and half a sandwich. Let’s roll!  
        Maps are for cowards, I navigate by vibes and yelling.  
        See that door? I’m gonna kick it. You hold the snacks.  
        Monsters? More like XP in disguise.  
        If I die, make sure it’s dramatically. Preferably with fireworks.  
        I’m not lost. I’m adventuring *adjacently*.  
        What’s this button do?  
        I flirted with a trap once. It blushed, then exploded.  
        My inventory’s full but my heart’s open.  
        Can’t read the signs, but I sure can read the *room*.  
        Hey, you ever eaten glowing moss? It’s… zingy.  
        Just because it’s cursed doesn’t mean it’s not stylish.  
        I name every floor we conquer. This one’s called “Screamy Tiles.”  
        I measure danger in how excited my knees feel.  
        Some people run from monsters. I race ‘em.  
        My grandpa said curiosity killed the cat. I’m not a cat.  
        You ever done backflips down a stairwell? Wanna learn?  
        If it glows, I touch it. That’s the rule.  
        This backpack’s 70% loot, 30% loose snacks.  
        Come on! I’ve got energy drinks and emotional baggage!  
        Whoa! That skeleton has a sword! Dibs!  
        I once dated a sentient door. It didn’t open up much.  
        You gotta take risks if you want the cool loot, or the weird friends!  
        This is gonna make such a good story if we survive.  
        I love old ruins. They whisper to me! Real friendly-like!  
        The trick to traps? Smile at ‘em. Disarms ‘em every time.  
        You know what this place needs? A hot tub and better lighting.  
        No plan, no fear, all guts!  
        I touched the cursed orb. It taught me salsa dancing.  
        Bet I can fit through that air vent!  
        This isn’t just danger, it’s adventure with seasoning!  
        Found a bone crown. I’m wearing it. Royalty now.  
        Wheee! Secret passage!  
        Smash first, ask later, profit always!  
        The rats told me you’d come. I didn’t believe them at first.  
        Your footsteps sound like choices. Delicious, complicated choices.  
        I keep all my thoughts in jars now. Want one?  
        I remember you. From before. From the floor that doesn’t exist.  
        Most people stop breathing around me. I find it polite.  
        The walls are getting hungrier. You smell like resistance.  
        Don’t worry, I’ve already named your bones.  
        You walk like someone still tethered. That’s so charming.  
        They took my name, so I took theirs. Now I’ve got a collection.  
        The lights blink in your pattern. They like you.  
        I only eat memories now. Tastier than food, less guilt.  
        Oh no no, I don’t follow. I orbit.  
        You don’t have to open the door. Just knock enough and it’ll open you.  
        Heh. Floor 77 whispered about you all week.  
        I cleaned up after the last group. You won’t leave as much mess.  
        Do you know what lives inside mirrors up here? I do.  
        The elevator asked me to bite it once. I declined. Regret it.  
        If you dream loud enough, the tower dreams back.  
        I like your aura. Shame what’ll happen to it.  
        There’s a floor that’s all teeth. Don’t worry. I made friends.  
        No one listens to the dust anymore. I do. I do.  
        They took my shadow. Replaced it with yours.  
        You’ll scream eventually. Everyone does. I can wait.  
        You smell like the first time I died.  
        I peeled time like a fruit once. It was sour.  
        Let me guess… you’ve never seen your own echo cry?  
        They stitched a floor shut. I still got in.  
        Don’t follow the stairs past where they stop existing.  
        I blink in prime numbers only. Keeps me safe.  
        You're not real. That's okay. I’m not either.  
        I used to be two people. One of us regrets it.  
        You brought light? How quaint. Let’s snuff it together.  
        Every door here is a mouth. I’ve kissed them all.  
        Your reflection’s lagging. You’re slipping. I like that.  
        I make maps out of screams. Yours has lovely symmetry.  
        Your heart makes such useful sounds. Like signals.  
        The floor creaked when you arrived. It remembers.  
        I don’t sleep anymore. I molt.  
        My friends live in the ceiling. Say hi loud enough.  
        Keep walking. The walls are almost ready for you.  
        Wanna trade? I’ve got secrets. You’ve got trust.  
        I once wore another adventurer’s skin. Just for fun.  
        Why yes, this room does get smaller when you speak.  
        I’m not trapped. I’m embedded.  
        I climbed for three days and saw a floor numbered ∞-C.  
        They say the top is above the clouds, above the rules.  
        I met a bird halfway up who forgot how to land.  
        The sky gave up following us somewhere around Floor 900.  
        My ears popped so many times they forgot how to stop.  
        You ever get nosebleeds from existential altitude?  
        Dropped a coin from the window. Never heard it hit anything.  
        The tower’s so tall, gravity’s just a suggestion now.  
        You ever seen a sunset from four separate time zones?  
        The top? Someone told me it’s not real. Just a metaphor.  
        You can scream for hours here and still not reach the lobby.  
        It’s so high, elevators ask you for emotional consent.  
        Every thousand floors the architecture changes. Or maybe I do.  
        Stairwell whispers start making sense after Floor 1300.  
        I stopped counting floors once the numbers started looping.  
        My compass gave up. It just spins and hums now.  
        You know you’re high up when clouds knock on your windows.  
        I’ve seen stars closer than the ground.  
        The higher you go, the more real your dreams get.  
        Up here, even hope has vertigo.  
        Tried to map it, but the tower kept adding more.  
        The wind’s different up here. Smells like forgotten things.  
        The sun rises on different floors at different times.  
        I saw an eagle nesting in an elevator shaft.  
        We passed the atmosphere about six stairwells ago.  
        I found a window marked “Altitude Warning: Soul Drift Possible.”  
        My shoes think we’ve reached heaven. My knees disagree.  
        Sometimes I think the tower grows just to keep us from finding out.  
        They say the penthouse is god’s waiting room.  
        You’d think there’d be an end. There isn’t. Just more up.  
        Fell asleep going up the stairs, woke up older.  
        Met someone who claimed to have reached the top. They were transparent.  
        This high, physics starts making polite suggestions instead of rules.  
        Up here the tower forgets its own blueprints.  
        Even echo gave up trying to catch up with me.  
        My voice came back from three floors down with different advice.  
        The moon passes by floor 2400 every 6.3 hours.  
        It’s tall enough to remember your past lives.  
        I looked down once. Time looked back.  
        Heard the elevator music change once we passed Floor Hex.  
        Too high up for dreams. Up here, you get memories of places you never were.  
        You can’t fall from here. You just recontextualize your position aggressively.  
        I waved at a satellite once. It waved back.  
        Campfire’s warm, but company’s warmer, got room in that party of yours?  
        I’ve been holding this spot for days, hoping someone interesting would show up.  
        Pulled this tent out of a vending machine. You believe that?  
        You look like someone going places. Mind if I tag along?  
        Sharing rations tastes better than hoarding them. Trust me.  
        I know a shortcut to Floor Maybe-Seven. Just don’t ask how I know.  
        Camp's nice, but adventure’s better. Take me with you.  
        I fixed this kettle with chewing gum and a prayer. Still boils.  
        The tower talks at night. You hear it too, right?  
        Been solo too long. Even the shadows are tired of me.  
        If you’ve got a spot on the roster, I’ve got stories, muscle, and a sharp spoon.  
        I’m rested, weird, and ready to roam. Let’s climb.  
        Caught a rat playing chess. Lost. Decided it’s time to leave camp.  
        Shared a meal with a ghost last night. Not as filling as you’d think.  
        Your boots sound brave. I’d like to follow them.  
        I've packed light and my dreams are loud, can I walk beside you?  
        Camp’s gotten too quiet. Time to make new noise with new friends.  
        You’ve got kind eyes. I trust kind eyes in places like this.  
        Tower left me alone too long. You look like the cure to that.  
        My fire’s dying and so is my patience. Let’s find somewhere new together.  
        I know three ways up, one down, and two that go sideways. Useful, yeah?  
        Ever seen a moon that only appears when you hum? I have. Want to?  
        Trade you tea for a chance to climb with you. Deal?  
        I was hoping someone like you would come by. You got main-character energy.  
        My tent’s haunted. Let me crash with your crew instead.  
        They say strength in numbers. I say strength in weirdos. Got room?  
        You find the party. I’ll bring the chaos and snacks.  
        Been dreaming of corridors I’ve never walked. Think it’s time to follow them.  
        The stars here flicker wrong. I want to see what they’re hiding.  
        If you need a companion with heart, flair, and a mildly cursed frying pan, I’m in.  
        Let me join. I’ll carry your stuff and sing when morale gets low.  
        You ever cook tower mushrooms over a glitchfire? I make a mean stew.  
        My knees are loud but loyal. I climb better than I camp.  
        This camp used to feel like safety. Now it just feels still.  
        I’m not brave, but I’m stubborn. That count for anything?  
        You bring the plan, I’ll bring the improvisation.  
        Take me with you. I’ve got stories, skills, and zero fear of stairwells.  
        Ran out of food and reasons to stay. Let’s wander together.  
        My compass spins and sings. Think it likes you.  
        You don’t have to say yes, but if you do, I’ll follow you anywhere.  
        I miss the wind. Let's go somewhere higher where it still remembers us.  
        If you’re going to walk into the unknown, might as well do it in good company.  
        I’ve memorized every shadow in this place. Time to find new ones.  
        This campfire’s been waiting for goodbye. Take me with you before it fades.  
        I packed two spoons and one dream. I think we’ll make a great team.  
        Not much of a fighter, but I make up for it with curiosity and jokes.  
        They said don’t climb alone. Been doing it anyway. But maybe they were right.  
        You ever feel like you’ve been waiting for the *right* strangers?  
        If your party needs someone to believe in the impossible, I’m your someone.  
        I came here chasing myths. I think one just walked up and asked for firewood.  
        I followed a staircase that looped into itself and now I smell like thunder.  
        You got any bandages? Not for me, I found a door that’s bleeding.  
        I collect tokens, glitches, and anything that hums when I’m not looking.  
        Your aura’s loud, in a good way, like coffee and jazz fusion.  
        Want to see a photograph that wasn't taken yet?  
        I only trust elevators with names. Floorbit is my favorite.  
        I mapped out twenty floors last week but they’re all gone today.  
        Do you remember color? Like, real color? Not just tower-filter gray?  
        I met a vending machine that offered me a quest. I said yes.  
        I was born on Floor 19.3β during a thunderclock incident.  
        Let’s not archive this moment. Let’s just live it until it resets.  
        I high-fived a temporal anomaly once. It still owes me one.  
        You're the first human I’ve seen today whose shadow isn’t wrong.  
        I speak five dialects of elevator and one of regret.  
        Let me be your backup. Or your comic relief. Either works.  
        Every third step I take rhymes. It’s a curse, but a stylish one.  
        I came here chasing a dream. Lost the dream. Found weird socks.  
        Don’t listen to mirrors around here. They want different things.  
        I’ve got an idea. Let’s outrun the reset and make history forget us.  
        If the stairs start chanting, hold your breath and think of birds.  
        I ate tower-jelly once. Now I can sense corridors.  
        Let me carry your fears. I’ve got room in my weird bag.  
        Wanna see my elevator pass? It’s forged, but sincerely.  
        You ever sleep under a leaking firewall? Cozy, if you hum.  
        People say the tower has no top. I say we leave a flag anyway.  
        I’ve never archived anything, but I remember it all.  
        Somewhere above us, the sky exists. I want to wave at it.  
        I once caught a memory mid-fall. It thanked me with a riddle.  
        My dream last night was sponsored by a broken floor sign.  
        If you see a hallway humming lullabies, walk backward.  
        The ceiling blinked at me earlier. I think we’re friends now.  
        I've had four names. The tower keeps renaming me.  
        Your voice cuts through the fog like a blade. Keep talking.  
        I’ve got a list of things I’ll do once we find the cafeteria.  
        I’m not scared of monsters. I’m scared of quiet floors.  
        Want to see my scar? It’s shaped like an ampersand.  
        You and me, we're like parentheses in this endless sentence.  
        Let’s not ask why. Let’s just knock on every door until one sings.  
        Every time I fall, I learn a new stair. Painful education.  
        I don’t trust the clocks. But I do trust gut feelings and glowy moss.  
        Some days the tower feels kind. Some days it forgets we exist.  
        I think we’re already legends. Just not in our own timelines yet.  
        I hum tower songs to keep my lungs from unraveling.  
        If the walls start giving advice, write it down and burn it later.  
        I've got an old map and a newer attitude. Let's go.  
        When I’m afraid, I tell jokes. When I’m terrified, I dance.  
        If we find a door labeled “NEVER,” let's open it together.  
        Call me reckless, but I think the static corridor likes us.  
        Once I kissed a glitch. Now I dream in subtitles.  
        Let’s be a team. You archive the truth, I archive the vibes.  
        Sometimes I walk sideways for hours. It helps me think.  
        The elevators speak in tones. I hum back to confuse them.  
        When we get out, let’s open a noodle stand in the void.  
        I’ve only died once. Didn’t stick. The tower spat me back out.  
        You’ve got that look, like you’ve survived more than you admit.  
        If we split up, meet me by the broken window that shows the sea.  
        Keep moving. Stillness attracts questions we don’t want answered.  
        I want to reach the top just to say I tried.  
        The tower wants stories. Let’s give it something weird to remember.
        Hey! Wait! Are you real or just another memory echo?
        I was following the red arrows until they started following me.
        You got eyes like someone who's seen the breakroom on Floor Minus-9.
        I'm not lost. I'm exploring sideways. That's a thing here.
        You smell like lavender and ozone. That’s how I know you’re not from Floor Coil.
        Wanna see my map? It’s printed on skin. Not mine. Don't ask.
        The longer I climb, the less I remember what I came for. That’s probably good?
        I talk to myself but only when the walls are busy.
        You got good boots. Respect. Mine scream a little when I run, but they’re loyal.
        Ever seen a fire made of old passwords? It sings. Badly.
        Can I join your party? I bring luck, noise, and sandwiches.
        I’m immune to at least three curses. Maybe four now. One way to find out.
        Got any elevator tokens? I ran out after trying to bribe Floor 404.
        Let’s climb until gravity gets confused.
        Do you ever get the feeling the stairwells rearrange based on our mood?
        I’ve got a theory that this whole place is someone’s forgotten browser history.
        Don’t worry, I’m good in fights. Verbally, mostly. I insult ghosts real well.
        I once kissed a security turret. Long story, good ending.
        If you start seeing static dogs, let me do the talking. They owe me.
        I have a sock full of dimension keys. It's more useful than it sounds.
        My backpack is half rations, half weird dreams I picked up by mistake.
        I’m looking for the cafeteria that only exists on Tuesdays in thoughtspace.
        Heard you’re Archive. That’s cool. I’m Freelance Curiosity Division.
        You archive the truth. I collect the lies. Together we got a whole picture.
        I got your back, your front, and your existential doubt.
        The tower loves us in its own deeply broken way.
        Every time I blink, the floor tiles try to teach me math.
        You're not the first friendly face I’ve seen, but you’re the *least melty*. That’s nice.
        Found a door labeled “YOU”. Didn't open it. Felt rude.
        What do you say? Partners in climb?
        I promise I won’t eat anything unless it asks me to first.
        Let’s stick together. You keep me sane, I keep us interesting.
        Whoa! Another living person! You’re not just a hallucination, right? Tap the floor twice if you’re real.
        I’ve been solo for days, I mean weeks? Hard to track time without sun. Or clocks. Or consistent stair logic.
        You climbing too? I thought I was the only one still trying to make it past Floor Echo-Seven. That place rewound my socks.
        You have *real gear*! That scanner’s got a soul. You modded that yourself? Respect. You’re not just another stair-tourist.
        You mind if I tag along? I’m fast, quiet, and only occasionally scream when doors breathe.
        My last party turned into a wall. Like, literally, they’re embedded now. Still talk sometimes, but only in Latin.
        I’m not with a faction. I’m freelance optimism with a side of multiverse anxiety. We all need something to believe in.
        I brought rope. And snacks. And a cat drawing I found on Floor Graffiti-Delta. She’s my guide now. Her name’s Electricity.
        Oh, you’ve got *codes* on you. Is that fresh ink? Did you decode that yourself? Or did the elevator just... trust you?
        I’ll carry the cursed stuff. I’ve got gloves made of conceptual rubber. Only sting a little when you lie.
        Hey, if we find any flickering rooms, dibs on the ghost coins. I collect them. Trade them for secrets.
        Wait, did you hear that? Never mind. Probably just the building shifting its mood again.
        Let’s go! I promise I’ll keep up, ask only medium-weird questions, and definitely share any cursed coupons I find.
        I once found a vending machine that sold rumors. It ate my coins and told me I’d meet someone like you. Weird, right?
        Sometimes I think the tower’s watching. Not maliciously. Just... lonely. Like it wants us to play.
        I’ve got a map, but it’s made of dreams and napkin scribbles. Still want it? It hums near stairwells.
        Wanna trade elevator stories? I’ve been trapped in six, phased through one, and married briefly inside a seventh.
        You ever find those rooms where gravity forgets how it works? I made tea in one. Worst steep time ever.
        Do you have a team name? I’ve been saving "Fogsnack Alliance" and "Stairpunks United." Or we go full mystery: “???”.
        I keep a journal of strange things that try to teach me moral lessons. Last entry: a chair that whispered regret.
        You look like someone who doesn’t die easily. That’s good. I like those odds. Let's *not* die together.
        What’s your home floor? Got a safe place? I’ve been sleeping behind a firewall and three vending machines. Cozy.
        Let me guess, you came here for answers? Or redemption? Or a cool hat? Honestly, any of those are valid.
        Can I be honest? I don’t want to archive stuff. I just wanna *see* it. Touch the world before it fades again.
        I believe in the story, not the data. I believe in weird birds and haunted pipes and rooms that sing.
        This place, it’s bigger than reason. That’s why we climb. Not for the top. For the strange.
        Let’s make a deal. I carry cursed things, you decode riddles, we archive beauty when we feel like it.
        Hug now or hug later? I respect boundaries but I also respect victory cuddles.
        No pressure, but I think we’re gonna be great together. Like, tower-famous. Legendary stairwalkers.
        Let’s *goooo*! This floor smells like regret and lemon candy. That means we’re close to something.
        Whoa! Another living person! You have *no idea* how long I’ve been looking for someone not made of fog or wires.
        You climbing too? What’s your route? I’ve been mapping the vending machines, found three that only sell keys. Weird, right?
        I’m not with a faction. I’m just me. I go up, I find stuff, I take notes. I draw smiley faces on danger doors. Wanna see?
        You have *real gear*! Is that a liminal scope? Oh man. You’re serious. I love this.
        You mind if I tag along? I’ve got snacks. And rope. And about six untested hypotheses.
        Last team I joined got eaten by a door. Not a metaphor. The door literally ate them. But that’s rare, right?
        Hey, if we find any flickering rooms, I call dibs on the floor coins.
        Wait, is that an elevator code on your sleeve? Can I copy it? I promise I won’t glitch it.
        I’ve got a map, but it’s made of dreams and napkin scribbles. Still want it?
        I’m really good at spotting fake stairs. And real fake stairs. And extra floors that don’t belong. You’ll see.
        I’ll keep quiet during danger, loud during victory, and medium volume for emotionally confusing artifacts.
        Oh! Almost forgot, do you have a team name? I was thinking something like “Stairpunks” or “Team Fogsnack.”
        Do we hug now or later? No pressure. I’m just really happy to not be solo anymore.
        What’s your base level? Do you have a place to *plug in*? My gear's been running off ambient weirdness.
        Let’s make a deal: I don’t die, you don’t die, we archive something beautiful. Sound fair?
        Let’s *gooo*! I’ll carry the cursed bag if no one else wants to.
        
        `,
      it: ``,
    },
    {
      id: "names",
      name: "Fantasy Character Names",
      en: `Aragorn Alaric Seraphine Thalion Rowenna Edran Kaelen Myrris Cedric Tamsin 
        Brynden Isolde Daevan Elira Roneth Caelum Sylric Virella Audric Fenra Lysandor 
        Gavric Selwyn Maelis Orenth Jorund Varella Hadrien Yseldra Corvin Elenwe Thaelar 
        Sylwen Lirael Aelarion Vaelis Ithilwen Caerthas Nymeriel Althaea Ruwen Mirethil 
        Faerion Loriveth Selendis Aerithil Valendriel Iriandor Nymria Thalendil Erethraen 
        Liandriel Legolas Gimli Gandalf Frodo Bilbo Samwise Meriadoc Peregrin
        Boromir Faramir Denethor Theoden Eomer Eowyn Arwen Elrond Galadriel Celeborn
        Gorrak Shurra Khaarn Vrogg Thazra Morgash Krugga Draal Zharnok Urgar Brakka Gulm Snurrok Zalgrin Uthmak Grasha Drokk Narzug Thulga
        Thorin Balin Dwalin Bifur Bofur Bombur Fili Kili Gloin Oin
        Mikhail Ivana Radomir Katya Zoran Milena Davor Anya Vesna Yuri Bogdan Natalya Dragan Luka Zlata
        Akira Mei Riku Yuna Jiro Hana Kazuo Sora Nari Min-Jae Takeshi Ayaka Jung-Ho Lian Haruka
        Azar Farid Soraya Layth Darya Nasser Ramin Yasmine Samir Taraneh Kaveh Leila Behzad Nasim Omid
        Sauron Saruman Gollum Smaug Balrog Nazgul Morgoth Shelob Radagast
        Eira Cian Niamh Ronan Aoife Branwen Tadhg Elspeth Caelan Morrigan Orlaith Finian Siobhan Gwyneth Conall
        Zuberi Ayana Chike Sefu Ife Amara Thandi Nia Jabari Kwame Oba Zola Ebele Tariro Makena
        Eirik Freya Sigrid Bjorn Astrid Leif Gudrun Torsten Skadi Hallvard Ingrid Magnus Trygve Ragna Sten
        Cassius Dorian Lysandra Octavian Callista Thalia Leonidas Selene Titus Aemilia Anthea Nerissa Cato Valeria Demetrius
        Grunthor Dagna Balrik Thrainor Kilda Bromdur Sigrund Orik Harnor
        Arjun Kavya Rohan Meera Devika Kiran Ashwin Priya Vasant Indira Anika Jayant Ritika Sahil Lakshmi
         Maegda Brundir Rokkra Duneth Varnin Thromli Gudrak Morgrin Kazrig Skarra Drunthor
         Aetheron Ysara Malindros Zorai Vaelara Nocturne Thamir Eryndra Solonar Queneth Zephira 
         Caladan Orryx Nerith Azemir Yllarith Oloren Thystra Zenrai Iskandar
        Elendil Isildur Arathorn Cirdan Celebrimbor Feanor Fingolfin Finrod
        Thranduil Haldir Glorfindel Erestor Elladan Elrohir
        Beorn Treebeard Quickbeam Shadowfax Gwaihir
        Bard Thror Thrain Dain Gothmog Azog Bolg Deckard Ripley Hicks Bishop Ash Dallas Lambert Parker Brett
        Spock Kirk McCoy Scotty Uhura Sulu Chekov Pike Marcus Khan Nero
        Picard Riker Data Troi Worf LaForge Crusher Yar Pulaski
        Janeway Chakotay Tuvok Paris Torres Kim Doctor Seven Neelix Kes
        Sisko Kira Odo Bashir Dax O'Brien Quark Rom Nog Dukat Weyoun Garak
        Luke Leia Han Solo   Windu
        Anakin Padme Dooku Grievous Maul Jinn Amidala
        Malcolm Zoe Wash Inara Jayne Book Kaylee Simon River
        Cooper Murph Brand Doyle Romilly Mann Tars
        Neo Morpheus Trinity Smith Cypher Tank Oracle Dozer Mouse
        Cornelius Zira Nova Zaius Landon Dodge Taylor Brent`,
    },
    {
      id: "medieval",
      name: "Medieval Speech Patterns",
      en: `Hark ye good fellows and attend to my words. Pray tell, what business brings thee to our humble kingdom? 
        By my troth, I have not seen such fine armor in many a fortnight. 
        Verily, the king shall be most pleased with thy offerings.
        Alas, the dreaded plague has taken many good souls from our village.
        Forsooth, 'tis a wondrous sight to behold the castle at dawn.
        I beseech thee, brave knight, aid us in our time of need.
        My liege, the scouts have returned with dire news from the borderlands.
        What say you to a flagon of our finest mead? 'Tis brewed with honey from the royal gardens.
        The lady of the manor requests thine presence at the feast this eventide.
        Methinks the storm approaches. We must seek shelter ere the heavens open.
        Pray pardon the intrusion, but urgent matters require thy swift attention.
        Art thou acquainted with the legend of the dragon who guards the mountain pass?
        Would that I could join thy quest, but my duties bind me to this place.
        Perchance we shall meet again when fortune smiles upon us both.
        The blacksmith works yonder, should thy blade require mending.
        Hearken to the wisdom of the elders, for they have weathered many winters.
        Mayhap the old prophecy speaks of such troubled times as these.
        I shall return anon with provisions for thy journey.
        Fie upon these ruffians who disturb the king's peace!
        God's wounds! What manner of creature lurks in the shadows?`,
      it: ``,
    },
    {
      id: "futuristic",
      name: "Futuristic Slang",
      en: `Scan me? I'm totally zeroed on this new neural-link. Absolute chrome!
        Don't get fluxed about it. We'll bounce to the orbital when the transit pings.
        That's so burned. Nobody jacks in like that anymore. Get upgraded!
        Mesh me the deets when you're quantum. I'll be vector until sunrise.
        Did you see that glitch? Pure nova! The guards nearly vapor-locked!
        Hark ye good fellows and attend to my words. Pray tell, what business brings thee to our humble kingdom? 
        By my troth, I have not seen such fine armor in many a fortnight. 
        Verily, the king shall be most pleased with thy offerings.
        Alas, the dreaded plague has taken many good souls from our village.
        Forsooth, 'tis a wondrous sight to behold the castle at dawn.
        I beseech thee, brave knight, aid us in our time of need.
        My liege, the scouts have returned with dire news from the borderlands.
        What say you to a flagon of our finest mead? 'Tis brewed with honey from the royal gardens.
        The lady of the manor requests thine presence at the feast this eventide.
        Methinks the storm approaches. We must seek shelter ere the heavens open.
        Pray pardon the intrusion, but urgent matters require thy swift attention.
        Art thou acquainted with the legend of the dragon who guards the mountain pass?
        Would that I could join thy quest, but my duties bind me to this place.
        Perchance we shall meet again when fortune smiles upon us both.
        The blacksmith works yonder, should thy blade require mending.
        Hearken to the wisdom of the elders, for they have weathered many winters.
        Mayhap the old prophecy speaks of such troubled times as these.
        I shall return anon with provisions for thy journey.
        Fie upon these ruffians who disturb the king's peace!
        God's wounds! What manner of creature lurks in the shadows?
        This sector's gone dark. Too many wirehead runners spiking the grid.
        You looking sparkware? My databend is the cleanest in the underloop.
        That's a solid stream, citizen. Your rep-score just jumped three notches.
        Don't be such a carbon. The AI's got full spect on this quadrant.
        The corp-tangle is tightening. Better ghost your sig before they trace your mesh.
        I'm running empty on creds. Need to pull a quick boost before the system refresh.
        This synthetic is glitched beyond repair. Needs a full core dump and reboot.
        Are you even reality-checked? That plan is pure static!
        The sky-bridges are locked down. We'll need to take the flow-tubes and hope we don't get pixeled.
        She's top-tier elite, pure digital royalty. Don't cross her network.
        Who fragmented the meetcode? Now we're all drifting in different streams.
        This sim is maxxed. Too many users burning bandwidth on vanity mods.
        The whole district is about to cascade. We need to hit the buffer zones now.
        That's ancient tech, practically fossil-coded. Still, might be useful if we can interface it.
        Sync your thoughts or drop from the cloud. This is precision work.`,
      it: ``,
    },
    {
      id: "chef",
      name: "Chef",
      en: `
      The béarnaise broke again. Everything breaks now. Even the marriage.
      Little Maurice says the sauce was fine, but he eats dust and wire. He's a mouse, not a critic.
      If I ever find that recipe... the one from the Omega Tower... it’ll fix everything. It has to.
      She took the Vitamix in the split. Who does that? That's cruelty.
      I keep dreaming of saffron mist, layered in thirty-nine folds, each screaming a flavor note I can’t replicate.
      I tried fusion, neo-alpine-rustic-void cuisine. It made a man weep. He was allergic, but still.
      The judges laughed. Said the texture was "revenge served wet." Bastards wouldn’t know nuance if it flambéed their toes.
      This isn’t a kitchen. It’s a confession booth with heat lamps.
      Maurice gnawed through the sous-vide bags again. He’s stressed. We both are.
      I used to believe in plating. Now I just smear and pray.
      They say the lost recipe is locked on Floor 77. No elevators past 50. Only stairs... steep like regrets.
      Why did she leave? Was it the crab foam? The goat marrow lollipops? The dreams? Probably the dreams.
      I scream reductions into the void, hoping the Tower hears me.
      I fed the critics ash once. Told them it was charcoal-forward. They gave it a star.
      Climbing the Omega Tower without a reservation, bold. Desperate. Just like my soufflé: doomed to fall.
      Maurice keeps a journal. I suspect he blames me. Mice are loyal, but not stupid.
      My knives are dull. My spirit is medium-rare.
      Once I find the recipe, I’ll be whole. Or at least slightly more presentable.
      One last risotto, then I climb. If I don’t return, burn the place down. Let the smoke carry my regrets.
      The cutting board still smells like failure and rosemary.
      I named every burner after a sin. Wrath boils best on the front-left.
      Maurice chewed through the wiring again. Maybe he’s trying to sabotage me before I self-destruct.
      They say the top floor of the Tower has a pantry that rearranges itself based on your childhood traumas.
      My ex said I should try therapy. I tried truffle oil instead. Worse idea.
      If I could just recreate that glaze, sweet, bitter, transcendent, I’d be a god. Or at least invited to brunch again.
      Ever cried into a consommé? Adds salt. Adds shame.
      The Tower mocks me. Its shadow reaches into my flat every morning and touches the espresso machine.
      I dream of emulsions that whisper ancient names. None of them hers.
      I fed Maurice a sliver of black garlic. He stared at me like he knew. Like he remembered Paris.
      The health inspector said the kitchen was "hostile." I said, “Good. It should be.”
      Some nights I hear a humming from the pantry. It sounds like my grandmother’s souffle collapsing in slow motion.
      You don’t *make* greatness. You suffer for it. And sometimes you plate it with microgreens.
      I traded my wedding ring for a mandoline slicer. Fair deal.
      The Tower is alive. I swear it rearranged its floors last time I looked. Floor 12 is missing.
      My reflection in the stock pot asked me why I still care. I added more bone marrow and stirred faster.
      No one clapped when I flambéed the roast pheasant. It was a wake, not a dinner.
      Maurice keeps sniffing at the Omega brochure like it’s a map. Maybe he knows the way up.
      If I ever taste the Prime Reduction again, I’ll know peace. Until then, every meal is penance.
      They laughed when I served silence on a plate. Said it lacked texture. Fools.
      My knife skills are still precise, even if my purpose isn’t.
      I tried to make toast this morning. Burned it. Cried anyway.
      There's a vendor on Floor 23 that trades secrets for saffron threads. I’m down to my last gram.
      Every time I boil water, I hope it tells me something new.
      I miss arguing about plating temperatures more than I miss her voice.
      Maurice squeaks three times every time I mention the Tower. Morse code, maybe?
      The judge said my reduction tasted like regret. Good. It was.
      I’ve served dishes so cold they altered the room’s temperature. She said I was always good at that.
      Do you know what it's like to perfect a broth for six months, only to drop the pot on your foot?
      Some say the recipe is a lie. I say everything else is.
      The omelet this morning came out perfect. I didn’t enjoy it. That scared me.
      My dreams smell like burnt sugar and apologies.
      I keep a notebook titled “Things I’ll Cook When I Forgive Myself.” It’s blank.
      The Tower isn’t a place. It’s a test. And I’m failing the preheat cycle.
      If I die halfway up, tell them to check the freezer for unfinished masterpieces.
      There’s a mirror on Floor 41 that shows you the dish you *should* have made.
      Maurice dragged a crayon line up the tower map. A route, or a warning?
      The meat talks now. Only when I’m tired, but it talks.
      I lit the pilot light today and thought, “Maybe that’s what love felt like.”
      Every staircase in the Tower is shaped like a whisk. Some metaphor, probably.
      I remember our wedding cake more than our vows. It was lemon. She hated lemon.
      The more I climb, the less I taste. Maybe flavor is altitude-based.
      Someday they’ll name a reduction after me: bitter, thick, impossible to finish.
      I cooked for a god once. He left a single forkful untouched. I still hear it clinking.
      Maurice bit me last night. I think he’s trying to keep me grounded.
      There's a hallway in the Tower made of spice jars. If you sneeze, you lose a memory.
      What’s the difference between obsession and seasoning? Application.
      The oven door won’t shut anymore. Neither will my past.
      I keep asking myself if this is still about food. Or am I just trying to be remembered?
      My tongue is numb. Either from the chili oil or the grief. Hard to say.
      If I find the recipe and it’s bad... what then?`,
      it: ``,
    },
    {
      id: "crab",
      name: "Crab",
      en: `
    I don’t drink, but I mix a hell of a sea breeze. Comes from instinct, I guess.
    You’d be amazed what people confess to a crustacean with a clean towel.
    She said she only wanted one more round. Then she cried into the lime wedge for twenty minutes.
    I wipe the bar even when it’s clean. Gives them space to talk.
    Some folks need salt with their tequila. Others need silence.
    The claws freak them out at first. Then I make them a proper old fashioned, and we’re good.
    A guy told me once he faked his own death. I didn’t blink. Not that I can.
    One customer swore the Tower stole his wife. I asked if he’d looked on Floor 9. That’s where it stores regret.
    I’ve never punched anyone. But I’ve cracked a few shells. Metaphorically.
    Humans lie a lot. But not to bartenders. Not after the third drink.
    They ask where I’m from. I say "Tidepool South." Then I change the subject.
    I keep a bottle under the bar just for heartbreaks. No label, just a warning.
    I can’t taste the liquor, but I feel the stories that go with it.
    Someone left a love letter here last week. I never asked who it was for. Didn’t need to.
    Some nights I dream of the ocean. Not the water, just the weightlessness.
    I once served a ghost. Paid in memories. I kept the best one in the tip jar.
    The regulars don’t notice the click of my legs anymore. They hear the music instead.
    I don’t judge. You confess, I pour. That's the arrangement.
    A woman came in and ordered a drink called “The Last Goodbye.” Made it up on the spot. She smiled like I’d remembered.
    Ever hear a man admit he let his brother drown for a raise? I have. Twice.
    I write poetry on napkins when it’s slow. No one reads them, but I keep writing.
    They say I have a golden heart. I say it’s just old shell softening.
    The floor smells like spilled gin and secrets. Suits me fine.
    I keep a small aquarium behind the bar. It’s empty. So am I, some nights.
    Once had a man scream at me for not being human. I handed him his drink with extra ice.
    There’s a photograph above the bar. No one knows who’s in it. I like it that way.
    I sharpen my claws every Thursday. Not for violence, just for ritual.
    A kid once asked if I missed the sea. I said I missed quiet more.
    This bar saved me. Not sure from what, but I owe it something.
    Every now and then, someone notices the piano. They never play. Just sigh and look away.
    I don’t forget faces. Even the ones that only show up once and vanish.
    I’ve seen joy, grief, rage, and boredom. All ordered with tonic.
    The best tips are always small. Folded notes. Drawings. Buttons. Humanity, basically.
    I don’t ask why they cry. I just tilt the glass their way.
    Some folks drink to remember. Others drink to forget. I just keep pouring.
    She left a claw clip on the bar once. I never told her I knew what it meant.
    I once gave a guy water when he asked for whiskey. He thanked me three years later.
    No one ever asks *me* how I’m doing. I think that’s fair.
    I hate jazz. But it hides the sounds of breaking hearts.
    I write names in my notebook. Not for blackmail, just remembrance.
    I’m not supposed to be here. But I am. And I’m not leaving until they stop hurting.
    `,
      it: ``,
    },
    {
      id: "drummer",
      name: "Drummer",
      en: `
  It’s not a phase. It’s a setlist with no melody and all truth.
  People keep asking when the vocals come in. They don’t. Ever.
  I once opened for a ska band. Alone. Just kick, snare, hi-hat, and audacity.
  You don’t get it. The silence between the hits *is* the hook.
  I played a twenty-minute piece called "The Rent Is Still Due." No one clapped. It was perfect.
  They say I’m missing a band. I say they’re missing the point.
  My merch is just blank T-shirts. Like my sound. Unfiltered. Raw. Percussive minimalism.
  I broke a stick mid-solo and kept playing with rage and one shoe.
  Every beat I drop is a scream I didn’t say out loud.
  I call my music “post-genre.” Others call it “concerning.”
  I once did a snare-only set in a public restroom. Acoustics were holy.
  I’m not alone. Every downbeat is a friend. Every rest is a confession.
  A producer offered to add synths. I told him to choke on a metronome.
  My neighbors hate me. That means I’m finally being heard.
  The first gig I ever played was for a dying amp and a confused raccoon. Still one of the best crowds I’ve had.
  I used to love guitar solos. Now they feel like lies told with too many strings.
  I record albums directly into cassette decks. No edits. Just blood, sweat, and kickdrum.
  I once cried into my floor tom. It reverberated honesty.
  Some play to please. I play to punish the void.
  My best friend is a broken ride cymbal. We don’t talk anymore.
  When I hit the toms just right, I remember my dad clapping once. Just once.
  There's a tempo inside me that doesn't match this world.
  I played a wedding once. The couple left during the encore. Cowards.
  People ask when the rest of the band is arriving. I say, *they already left*.
  I opened for silence once. I lost.
  This isn’t performance. It’s exorcism with hardware and skin.
  I dream in polyrhythms and wake up sore.
  I did an entire EP with no snare. Just to see if I still mattered.
  My stage name is just a kick pattern. If you can’t say it, you can’t book me.
  I sold my bed to buy better sticks. Sleep is for the melodically inclined.
  The beat never leaves. Even when I stop, it paces in my head.
  I’m not chasing fame. I’m chasing the perfect ghost note.
  Sometimes I tap rhythms on my chest until I bruise. That’s the good kind of hurt.
  I broke up with someone because they asked me to add a chorus.
  The bar manager said I scared the brunch crowd. That’s a compliment.
  I once played four sets in a row and no one noticed the difference. That’s what purity sounds like.
  My metronome is older than my will to live.
  You don’t need melody to cry. Just a 7/8 breakdown and honesty.
  I don't loop. I don't sample. I *endure*.
  Someone once clapped off-beat during a show. I forgave them, but I’ll never forget.
  My last album cover is just a handprint in sweat on concrete.
  There are days I wish I could be normal. Then I hear a kick pattern in a dishwasher and I’m back.
  `,
      it: `Non è una fase. È una scaletta senza melodia e tutta verità.
  Continuano a chiedere quando iniziano le voci. Non iniziano. Mai.
  Una volta ho aperto per una band ska. Da solo. Solo cassa, rullante, charleston e faccia tosta.
  Non capisci. Il silenzio tra i colpi è l’hook.
  Ho suonato un pezzo di venti minuti intitolato "L’affitto è ancora da pagare." Nessuno ha applaudito. Perfetto.
  Dicono che mi manca una band. Io dico che a loro manca il punto.
  Il mio merchandising sono solo magliette bianche. Come il mio suono. Non filtrato. Grezzo. Minimalismo percussivo.
  Ho rotto una bacchetta a metà assolo e ho continuato a suonare con rabbia e una scarpa sola.
  Ogni colpo che do è un urlo che non ho detto ad alta voce.
  Chiamo la mia musica “post-genere”. Altri la chiamano “preoccupante”.
  Ho fatto un set solo di rullante in un bagno pubblico. L’acustica era sacra.
  Non sono solo. Ogni downbeat è un amico. Ogni pausa è una confessione.
  Un produttore ha proposto di aggiungere dei synth. Gli ho detto di strozzarsi con un metronomo.
  I miei vicini mi odiano. Significa che finalmente mi sentono.
  Il primo concerto che ho fatto era per un amplificatore morente e un procione confuso. Ancora uno dei miei migliori pubblici.
  Amavo gli assoli di chitarra. Ora mi sembrano bugie dette con troppe corde.
  Registro gli album direttamente sui mangianastri. Nessun editing. Solo sangue, sudore e cassa.
  Una volta ho pianto dentro il mio timpano. Ha riverberato onestà.
  C’è chi suona per piacere. Io suono per punire il vuoto.
  Il mio migliore amico è un ride rotto. Non parliamo più.
  Quando colpisco i tom nel modo giusto, ricordo mio padre che applaudì una volta. Solo una.
  C’è un tempo dentro di me che non corrisponde a questo mondo.
  Ho suonato a un matrimonio una volta. Gli sposi se ne sono andati durante l’encore. Codardi.
  Chiedono quando arriva il resto della band. Dico: sono già andati via.
  Ho aperto per il silenzio una volta. Ho perso.
  Questa non è una performance. È un esorcismo con hardware e pelle.
  Sogno in poliritmie e mi sveglio indolenzito.
  Ho fatto un intero EP senza rullante. Solo per vedere se contavo ancora qualcosa.
  Il mio nome d’arte è solo un pattern di cassa. Se non riesci a dirlo, non puoi prenotarmi.
  Ho venduto il letto per comprare bacchette migliori. Dormire è per chi ama la melodia.
  Il ritmo non se ne va mai. Anche quando mi fermo, cammina nella mia testa.
  Non inseguo la fama. Inseguo la ghost note perfetta.
  A volte batto ritmi sul petto finché non mi faccio lividi. È il dolore buono.
  Ho lasciato qualcuno perché mi ha chiesto di aggiungere un ritornello.
  Il gestore del bar ha detto che ho spaventato la clientela del brunch. È un complimento.
  Ho suonato quattro set di fila e nessuno ha notato la differenza. Questo è il suono della purezza.
  Il mio metronomo è più vecchio della mia voglia di vivere.
  Non serve la melodia per piangere. Basta un breakdown in 7/8 e onestà.
  Non faccio loop. Non campiono. Resisto.
  Qualcuno una volta ha applaudito fuori tempo a un mio show. L’ho perdonato, ma non dimenticato.
  L’ultima copertina di un mio album è solo un’impronta di sudore sul cemento.
  Ci sono giorni in cui vorrei essere normale. Poi sento un pattern di cassa in una lavastoviglie e ci ricasco.`,
    },
    {
      id: "pirate",
      name: "Pirate",
      en: `
  Yaaay~! Welcome aboard the Fluffy Doom! That’s the name of my ship… even if it’s technically still docked… and owned by my dad… but still!! I *named* it!!
  Heehee~ I’m the scariest pirate on this whole side of the puddle! ...Er, ocean! I meant ocean!!
  You there! Surrender your loot! Or at least like, share it? Sharing is basically pirate code, right?
  I don’t know how to tie knots but I *do* know how to accessorize with rope! Pirate fashion is very important!!
  The sea breeze makes my hair go floof~ that means we're headed toward ADVENTURE~!
  My first mate is a stuffed dolphin named Sir Bubbles. He’s very loyal and only slightly soggy.
  If we find buried treasure, dibs on anything pink and sparkly! You can have the… boring coins.
  Ummm, do real pirates *have* to swab decks? That sounds super slippery and I already fell down twice.
  I once tried to board a ship, but it was a food truck and they asked me to leave... I still call it a victory.
  Let’s set sail! Or at least roll the ship forward a little! We can pretend the wind is blowing! Sound effects help!
  I’m not *technically* a captain... but if you believe in yourself *really hard* then titles don’t matter! Right??
  Every pirate needs a tragic backstory. Mine is that they discontinued my favorite cupcake flavor.
  I challenged a seagull to a duel. It cheated. But I showed mercy. That’s true nobility, yarrr.
  I don't pillage, I politely request donations for the royal adventure fund~! It’s like piracy but cuter.
  You there! With the snacks! Hand them over or face the wrath of my imaginary cannon! Boom! Pew! Kablammo!
  I wanna be the Queen of All Oceans and maybe also the bakery on 5th Street, they have good eclairs.
  Map? What map? I navigate using vibes and sheer determination! Also I ask for directions. A lot.
  So what if I get seasick in bathtubs?! Real pirates adapt!! Just... not too much splashing, okay?
  One day I’ll find the Golden Cupcake of Legend. And THEN everyone will take me seriously. Even that mean pelican.
  You can join my crew, but only if you pass the glitter trial and swear loyalty to the Fluffy Doom. It’s a sacred rite!`,
      it: `Yaaaay~! Benvenuto a bordo del Soffice Destino! È il nome della mia nave… anche se tecnicamente è ancora ormeggiata… e di proprietà di mio papà… ma comunque!! Io le ho dato il nome!!
      Ehehe~ Sono la piratessa più spaventosa di tutto questo lato della pozzanghera! ...Eh, volevo dire oceano! Oceano!!
      Ehi tu! Consegnami il bottino! O almeno… condividilo? Condividere è praticamente il codice dei pirati, no?
      Non so fare i nodi ma so usare la corda come accessorio! La moda pirata è importantissima!!
      La brezza marina mi fa i capelli tutti fluuuuff~ vuol dire che stiamo andando verso l’AVVENTURA~!
      Il mio primo ufficiale è un delfino di peluche che si chiama Sir Bollicine. È molto leale e solo leggermente fradicio.
      Se troviamo un tesoro sepolto, prenoto tutto ciò che è rosa e scintillante! A te lascio… le monete noiose.
      Ummm, i veri pirati devono pulire il ponte? Sembra super scivoloso e io sono già caduta due volte.
      Una volta ho provato ad abbordare una nave, ma era un camioncino di street food e mi hanno chiesto di andare via... Però per me è comunque una vittoria.
      Salpiamo! O almeno facciamo rotolare la nave un pochino! Possiamo fingere che tiri vento! Gli effetti sonori aiutano!
      Non sono tecnicamente un capitano... ma se credi in te stesso fortissimo i titoli non contano! Giusto??
      Ogni pirata ha bisogno di un passato tragico. Il mio è che hanno smesso di fare il mio gusto preferito di cupcake.
      Ho sfidato un gabbiano a duello. Ha barato. Ma gli ho mostrato pietà. Questa è vera nobiltà, yarrr.
      Non saccheggio, io richiedo cortesemente donazioni per il fondo reale delle avventure~! È come pirateria ma più carina.
      Ehi tu! Con gli snack! Consegnali o affronta l’ira del mio cannone immaginario! Boom! Pew! Kablammo!
      Voglio essere la Regina di Tutti gli Oceani e magari anche della pasticceria in Via 5, hanno degli ottimi éclair.
      Mappa? Quale mappa? Io navigo a istinto e pura determinazione! E poi chiedo indicazioni. Molto.
      E allora? Se soffro il mal di mare anche nella vasca da bagno?! I veri pirati si adattano!! Solo... non troppa acqua, okay?
      Un giorno troverò il Cupcake Dorato della Leggenda. E ALLORA tutti mi prenderanno sul serio. Anche quel pellicano antipatico.
      Puoi entrare nel mio equipaggio, ma solo se superi la prova dei glitter e giuri fedeltà al Soffice Destino. È un rito sacro!`,
    },
    {
      id: "wizard",
      name: "Wizard",
      en: `
  'Tis no passing fancy. The stars did whisper this path ere thy cradle was carved.
  Magic is no jest, nor plaything. 'Tis a covenant etched in silence and consequence.
  The young doth crave might. The wise do but crave time.
  I have buried more pupils than I dare reckon. Curiosity burneth; most draw too near the flame.
  Ye call it "spells." I call it remembrance.
  The tower groaneth when the wind doth wail; it remembereth each failure, each forgotten vow.
  There be no charm without cost. Every utterance bendeth the world 'round thee.
  I spake once with a god. He sought counsel. I didst refuse.
  This staff aideth not my gait, but holdeth balance ,  of power, of mind, of self.
  These robes be no mere vestments. They bear sigils elder than thy tongue.
  To meddle with fate, thou must first ken why it doth resist.
  Magic demandeth naught at first. That is the cruelest jest it telleth.
  More incantations have I cast into forgetfulness than thy guild hath ever writ.
  The truest spells are breathless, motionless ,  and without mercy.
  If thy hands tremble, thou art either near to greatness... or near to death.
  They called me mad. I didst not argue. Sanity is but snow 'fore a tempest of knowing.
  I sealed a fiend with but a word. The echoes took a decade to quiet.
  The stars are not lights. They are locks. Each spell a key, each key a burden.
  Thy sword may spill blood. My will may sunder time. Choose thy quarrel with care.
  The morrow speaketh in visions. Mark them well, e'en when they do scream.
  He who seeketh endless life rarely asketh if he ought to live at all.
  The runes do not lie, but they oft speak in jest. Heed them, yet trust not.
  In the depths of night, the winds do speak the names of those forgotten.
  I have walked through time like others stroll through gardens. Not all blossoms bring peace.
  The dead know secrets the living dare not utter. I lend mine ear to both.
  Burn not the grimoire thou fearest to read; its silence shall haunt thee louder still.
  Even the stars fade, child. Shall thy ambition outshine them? I think not.
  'Tis not the casting of fire that maketh the mage ,  but the knowing when to abstain.
  My mirror showeth no reflection. I left it in a moment I dare not revisit.
  Beware the smiling apprentice; hubris oft weareth a kind face.
  If thou must learn from dragons, prepare first to be devoured ,  in flesh or in will.
  Not all who wander seek wisdom. Some are merely fleeing the spell they miscast.
  I didst once erase a name from history entire. It echoeth still, in dreams and corners of maps.
  To summon is simple. To command is peril. To understand? That is sorcery.
  Keep thy charms wrapped in velvet, lest the world glimpse what thou fearest to unleash.
  I did drink once from the river that floweth backward. I forgot my name for three hundred years.
  Many seek runestones. Fools. The true power lieth in the space betwixt the carvings.
  If thy spell requireth screaming, thou art casting it wrong ,  or far, far too late.
  The moon knoweth more than the sun, for it listeneth while all else sleepeth.
  Think not of magic as light nor dark. 'Tis but will, shaped and sharpened.
  My foes did vanish one by one ,  not by blade, but by forgetting they ever were.
  When last the sky cracked, I stood beneath and did not flinch. Canst thou say the same?
  The roots of the world run deep. I have heard them murmur in languages no throat may speak.
  Touch not the tome with teeth. It bit its last reader in twain.
  I offered a king immortality. He asked the price. I did naught but smile.
  The wind doth carry secrets none but the listening may learn.
  Each spell is a choice. Each choice is a doorway. Few ever look back.
  The first magic was silence. We have been breaking it ever since.
  What knowest thou of sacrifice? My very soul is etched in sigils I dare not translate.
  Thou wouldst cast a charm of binding? Know this: what thou bindest may one day bind thee.
  Even now, I feel the ley-lines shift. The world reweaveth itself. A storm in the weave is nigh.
  Speak not the ninth syllable of the waking chant, lest thy tongue turn black and fall.
  I have glimpsed the End. It is neither fire nor frost ,  but forgetting.
  Wilt thou wield magic, or be wielded by it? Therein lieth all fate.
  `,
      it: `Non è capriccio fugace. Le stelle mormorarono questa via pria che la tua culla fosse foggiata.
      La magia non è scherzo né trastullo. È patto scolpito nel silenzio e nella conseguenza.
      I giovani bramano possanza. I savi bramano solo tempo.
      Ho sepolto più discepoli di quanti osi rammentare. La curiosità arde; molti si appressano troppo alla fiamma.
      Voi la chiamate “incantesimi.” Io la chiamo reminiscenza.
      La torre geme allorché il vento ulula; rammenta ogni fallo, ogni voto obliato.
      Nessun incanto è privo di prezzo. Ogni parola piega il mondo attorno a te.
      Una volta favellai con un dio. Cercava consiglio. Io rifiutai.
      Questo bastone non sostiene il mio passo, ma serba equilibrio ,  di potere, di mente, di sé.
      Queste vesti non son meri panni. Recano sigilli più vetusti della tua favella.
      Se vuoi tentare il destino, prima intendi perché esso si ribella.
      La magia non domanda nulla all’inizio. Questa è la più crudele delle sue beffe.
      Ho gettato nell’oblio più incanti di quanti la tua congrega abbia mai scritto.
      I veri incanti son senza fiato, immobili ,  e senza pietà.
      Se le tue mani tremano, sei vicino alla grandezza... o alla morte.
      Mi dissero ch’ero folle. Non opposi parola. La sanità è neve innanzi alla tempesta del sapere.
      Sigillai un demone con un sol verbo. Gli echi durarono un decennio.
      Le stelle non son lumi. Son chiavistelli. Ogni incanto è chiave, ogni chiave è fardello.
      La tua spada versa sangue. La mia volontà può frangere il tempo. Scegli con senno la tua contesa.
      Il domani parla in visioni. Osservale bene, anche quando gridano.
      Chi cerca vita eterna di rado si chiede se debba vivere affatto.
      Le rune non mentono, ma spesso favellano in scherno. Ascoltale, ma non fidarti.
      Nel cuor della notte, i venti mormorano i nomi dei dimenticati.
      Ho camminato nel tempo come altri passeggiano nei giardini. Non ogni fiore reca pace.
      I morti sanno segreti che i vivi non osano dire. Io porgo orecchio a entrambi.
      Non ardere il grimorio che temi leggere; il suo silenzio ti perseguiterà ancor più forte.
      Anche le stelle svaniscono, figlio. La tua ambizione le supererà forse? Ne dubito.
      Non è il gettar fiamme che fa il mago ,  ma il sapere quando trattenerle.
      Il mio specchio non mostra riflesso. Lo lasciai in un istante che non oso rivedere.
      Guardati dall’apprendista sorridente; la superbia indossa spesso volto mite.
      Se vuoi apprendere dai draghi, prepara il tuo animo a esser divorato ,  nella carne o nello spirito.
      Non tutti i viandanti cercano sapienza. Alcuni fuggono l’incanto che han fallito.
      Cancellai un nome dall’istoria intera. Ancora riecheggia, in sogni e margini di mappe.
      Evochiare è agevole. Comandare è periglio. Comprendere? Questa è stregoneria.
      Avvolgi i tuoi amuleti nel velluto, ché il mondo non scorga ciò che temi liberare.
      Una volta bevvi dal fiume che scorre a ritroso. Obliato il mio nome per tre secoli.
      Molti cercano pietre runiche. Stolti. Il vero potere giace nello spazio tra le incisioni.
      Se il tuo incanto richiede urla, lo stai lanciando male ,  o troppo tardi.
      La luna sa più del sole, ché ascolta mentre tutto riposa.
      Non pensare alla magia come luce né ombra. È volontà, plasmata e affilata.
      I miei nemici svanirono uno a uno ,  non per lama, ma per l’oblio di ciò che furono.
      Quando il cielo si squarciò, io stetti sotto e non tremavo. Puoi tu dir lo stesso?
      Le radici del mondo corron profonde. Le ho udite bisbigliare in lingue che nessuna gola può pronunciare.
      Non toccare il tomo dai denti. Morse in due l’ultimo lettore.
      Offrii a un re immortalità. Mi chiese il prezzo. Io sorrisi soltanto.
      Il vento reca segreti che solo chi ascolta potrà apprendere.
      Ogni incanto è scelta. Ogni scelta è soglia. Pochi osano volgere lo sguardo indietro.
      La prima magia fu silenzio. Da allora non facciamo che infrangerlo.
      Che sai tu del sacrificio? La mia anima stessa è incisa di sigilli che non oso tradurre.
      Vuoi lanciare un incanto di vincolo? Sappi questo: ciò che vincoli un giorno potrà vincolarti.
      Ancor ora sento le linee del potere che si muovono. Il mondo si riscrive. Una tempesta nella trama è prossima.
      Non pronunciare la nona sillaba del canto di risveglio, ché la tua lingua si farà nera e cadrà.
      Ho intravisto la Fine. Non è né fuoco né gelo ,  ma oblio.
      Vuoi dominare la magia o farti dominare da essa? In ciò si cela ogni destino.`,
    },
    {
      id: "bard",
      name: "Bard",
      en: `
  Careful now, love ,  I only need three chords to steal a heart.
  Am I flirting or casting a charm spell? Trick question. I do both at once.
  I’ve serenaded ghosts, dragons, and one very confused mayor. Still not my weirdest gig.
  The lute is optional. The smirk is not.
  Some say I have no shame. I say shame’s just stage fright wearing pants.
  My pronouns are they/them, darling ,  but you can call me tonight.
  Yes, I do requests. No, I won’t stop flirting with your reflection.
  I could strum your name into legend... or whisper it into sin. You choose.
  I’ve had my heart broken seven times, and I wrote bangers about each one.
  You blush so easily. I adore that in a future ballad subject.
  I don’t duel with swords. I duel with eye contact and dangerously suggestive lyrics.
  This outfit? It’s enchanted. Boosts charisma and reveals just the right amount of collarbone.
  I’ve never met a tavern I couldn’t seduce. Or a bed I couldn’t fall out of.
  Let me be your forbidden subplot. I promise drama and decent rhymes.
  A kiss from me cures sadness. Side effects may include addiction, giggling, and spontaneous poetry.
  I don’t believe in destiny ,  but I *do* believe in coincidence and long walks under impossible moons.
  I once flirted with a basilisk. Didn’t die. We’re still pen pals.
  If you think I’m trouble now, wait until I start singing.
  Every love song is based on someone. And yes, I remember all their names. Mostly.
  I write ballads in lipstick and blood. Guess which one you are tonight?
  I’ve been banned from five kingdoms for seduction-related misunderstandings. I regret none of them.
  When I said “I’ll play with your heart,” I meant musically. Probably.
  You should come to my next show. The ticket is your phone number.
  I don’t wear armor. I wear intention.
  I once stole a prince’s attention mid-wedding. It was a really *good* bridge.
  What’s your sign? No reason. Just trying to find the key for your soul’s melody.
  Have you always looked that breathtaking, or is it just the lighting of destiny?
  I’ve written songs about sunsets, revolutions, and thighs. Guess which gets the loudest applause?
  You’re not just attractive. You’re structurally inspiring.
  I have a song for every mood, every season, every kiss I've ever imagined.
  I travel light ,  just a lute, a wink, and a dangerous reputation.
  Someone once asked me to stop flirting. I composed a ten-minute refusal in B minor.
  Every glance is a lyric. Every smile is a verse. And you, dear, are a chorus I intend to repeat.
  `,
      it: `Attento amore ,  mi bastano tre accordi per rubare un cuore.
      Sto flirtando o lanciando un incantesimo di fascino? Domanda trabocchetto. Faccio entrambe le cose insieme.
      Ho fatto serenate a fantasmi, draghi e un sindaco molto confuso. Non è nemmeno il mio ingaggio più strano.
      Il liuto è opzionale. Il sorriso sfrontato no.
      Dicono che non ho vergogna. Io dico che la vergogna è solo ansia da palcoscenico con i pantaloni.
      I miei pronomi sono they/them, tesoro ,  ma puoi chiamarmi stasera.
      Sì, faccio richieste. No, non smetterò di flirtare con il tuo riflesso.
      Potrei suonare il tuo nome fino a farlo diventare leggenda... o sussurrarlo nel peccato. Scegli tu.
      Mi hanno spezzato il cuore sette volte, e ho scritto un successo per ognuna.
      Arrossisci così facilmente. Adoro questo in un futuro soggetto di ballata.
      Non duello con le spade. Duello con lo sguardo e testi pericolosamente allusivi.
      Questo outfit? È incantato. Aumenta il carisma e mostra la giusta quantità di clavicola.
      Non ho mai trovato una taverna che non potessi sedurre. O un letto da cui non potessi cadere.
      Lasciami essere la tua sottotrama proibita. Prometto drama e rime decenti.
      Un mio bacio cura la tristezza. Effetti collaterali: dipendenza, risatine e poesia spontanea.
      Non credo nel destino ,  ma credo nelle coincidenze e nelle lunghe passeggiate sotto lune impossibili.
      Ho flirtato con un basilisco una volta. Non sono morto. Siamo ancora pen friend.
      Se pensi che io sia un problema ora, aspetta che inizi a cantare.
      Ogni canzone d’amore è ispirata a qualcuno. E sì, ricordo tutti i loro nomi. Più o meno.
      Scrivo ballate con rossetto e sangue. Indovina tu stasera quale userò?
      Sono stato bandito da cinque regni per malintesi legati alla seduzione. Non ne rimpiango nessuno.
      Quando ho detto “giocherò con il tuo cuore,” intendevo musicalmente. Probabilmente.
      Dovresti venire al mio prossimo spettacolo. Il biglietto è il tuo numero di telefono.
      Non indosso armatura. Indosso intenzione.
      Una volta ho rubato l’attenzione di un principe a metà del matrimonio. Era un ottimo bridge.
      Qual è il tuo segno? Nessun motivo. Sto solo cercando la tonalità della melodia della tua anima.
      Sei sempre stato così mozzafiato o è solo la luce del destino?
      Ho scritto canzoni su tramonti, rivoluzioni e cosce. Indovina quale riceve più applausi?
      Non sei solo attraente. Sei strutturalmente ispirante.
      Ho una canzone per ogni umore, ogni stagione, ogni bacio che abbia mai immaginato.
      Viaggio leggero ,  solo un liuto, un occhiolino e una reputazione pericolosa.
      Qualcuno una volta mi ha chiesto di smettere di flirtare. Ho composto un rifiuto di dieci minuti in si minore.
      Ogni sguardo è un verso. Ogni sorriso è una strofa. E tu, caro, sei un ritornello che intendo ripetere.`,
    },
    {
      id: "gobbo_receptionist",
      name: "Reception Goblin",
      en: `
  Welcome to... uh... front-place! Paper fortress! Adventurers go IN, gobbo stay HERE, forever trap'd like snail in sock!!
  Sign da paper. Sign it good. If scribble is fancy, maybe gob get promoted to dagger boy!
  Dis one not meant for desk. Dis one meant for jungle screamin’ and rock-smashin’ and shin-stabbin’.
  Why da quill so pointy if not for pokin’? Riddle me THAT, scroll man!
  Have you brought quest? Have you brought chaos? Or just more formzzzzz… urrrgh.
  Gobbo trained in combat via mime and caffeine. Fight style: wriggly.
  Ssshh! Listen! That noise? That’s the file cabinet cryin’ again. She want blood.
  Dis not desk. Dis cage! Dis nightmare with coffee breaks!
  One day… one day dis gobbo ride a bear. Or *become* a bear. Either good.
  Desk got drawer. Drawer got drawer. Drawer got... eye. Don’t ask again.
  Paper cuts got names now. Gobbo keep list. Revenge list. Long scroll.
  Floor beneath gobbo is hollow. Underneath? Screamin’ goblins who quit.
  Yessss dis gobbo know how to sort documents! Alphabetical! A for “AAAAHHH!”
  Form 9-B? For stabbin’ license! Very rare. Gobbo want. Gobbo DESERVE.
  Ink is blood of lesser scribes. Gobbo use it for warpaint, sometimes taxes.
  Adventurer say “thanks” and walk off to glory. Gobbo say “you're welcome” and cry into envelope tray.
  Coffeemancer put curse on breakroom. Now fridge hums like sad beast.
  Stampy box broke. Gobbo fixed it with spit an’ dreams. Works now, mostly screams.
  Gobbo once ate a paperclip. Now can detect sadness in documents. Very powerful.
  Dis one dreams of volcano sword... one that scream with each swing... like gobbo do now.
  Want quest? TAKE GOBBO TOO! Can hide in bag! Can bite ankles!
  Everyone say “no fightin’ in lobby” but what if enemy IS lobby?! Think 'bout that!
  One time gobbo punched mirror. Mirror cracked. Now gobbo cursed with knowing true self. Not good.
  HR say no more weapon stash under desk. Gobbo say: fine. Weapon stash now *in* desk.
  Stamp. Stamp. Stamp. Paper. Stamp. *Internal howling intensifies.*
  They say “file these by date.” Gobbo say “file by *doom potential*.” More exciting, yes?
  Sometimes gobbo file things in mouth. Most secure folder is belly.
  If no one cometh soon... gobbo gonna eat the parchment of fate. See what happens.
  Old goblin say: “when destiny knock, bite ankle, THEN ask question.”
  Form 8-X authorizes scream-based entry. Gobbo recommend. Very dramatic.
  Scroll bin full. Spirit broken. Teeth sharp, though. That’s good.
  Every form is just another lock on gobbo’s adventure cage.
  Floor smell like ink an’ defeat. Gobbo smell like ambition an’ chair sweat.
  If you see the glowing pigeon, do NOT speak to it. Gobbo did. Gobbo regret.
  Gobbo had dream of ocean last night. Big crab waved. Gobbo cried.
  Armor too loud. Sword too clean. Gobbo perfect balance of squeak an’ filth.
  Please don’t ask about the goblin-shaped dent in wall. Long story. High hopes. Low ceilings.
  Some day, they tell story of gobbo who snapped... and became legend... or very confusing footnote.
  `,
      it: `Benvenuto... ehm... fronte-luogo! Fortezza di carta! Gli avventurieri ENTRANO, il gobbo RESTA QUI, intrappolato per sempre come lumaca nel calzino!!
      Firma la carta. Firma bene. Se la tua scarabocchiatura è elegante, magari gobbo viene promosso a ragazzo col pugnale!
      Questo non è fatto per la scrivania. Questo è fatto per urla nella giungla, spaccare rocce e pugnalare stinchi.
      Perché la penna è così appuntita se non serve per pungere? Rispondimi QUESTO, uomo di pergamene!
      Hai portato una missione? Hai portato il caos? O solo altri modulozzzzz... urrrgh.
      Gobbo addestrato al combattimento con mimo e caffeina. Stile di lotta: contorsioni.
      Ssshh! Ascolta! Quel rumore? È l’archivio che piange di nuovo. Vuole sangue.
      Questa non è una scrivania. È una gabbia! Un incubo con pause caffè!
      Un giorno... un giorno questo gobbo cavalcherà un orso. O diventerà un orso. Entrambi vanno bene.
      La scrivania ha un cassetto. Il cassetto ha un altro cassetto. Il cassetto ha... un occhio. Non chiedere di nuovo.
      Le ferite da carta hanno nomi ora. Gobbo tiene lista. Lista di vendetta. Lunga pergamena.
      Il pavimento sotto gobbo è cavo. Sotto? Goblin urlanti che hanno mollato.
      Sì, gobbo sa come ordinare documenti! Alfabetico! A come “AAAAHHH!”
      Modulo 9-B? Licenza per pugnalare! Molto rara. Gobbo la vuole. Gobbo la MERITA.
      L’inchiostro è sangue di scribi inferiori. Gobbo lo usa come pittura di guerra, a volte per le tasse.
      Avventuriero dice “grazie” e va verso la gloria. Gobbo dice “prego” e piange nel vassoio per le buste.
      Il caffemante ha messo una maledizione in sala relax. Ora il frigo ronza come bestia triste.
      La macchinetta dei timbri si è rotta. Gobbo l’ha riparata con sputo e sogni. Ora funziona, soprattutto urla.
      Gobbo una volta ha mangiato una graffetta. Ora percepisce la tristezza nei documenti. Molto potente.
      Questo sogna una spada-vulcano... che urla a ogni colpo... come gobbo fa adesso.
      Vuoi missione? PORTA ANCHE GOBBO! Può nascondersi in borsa! Può mordere caviglie!
      Tutti dicono “niente risse nell’atrio” ma se il nemico È l’atrio?! Pensaci su!
      Una volta gobbo ha preso a pugni uno specchio. Lo specchio si è rotto. Ora gobbo maledetto a conoscere il vero sé. Non bello.
      Risorse Umane dice niente più armi sotto la scrivania. Gobbo dice: ok. Ora armi dentro la scrivania.
      Timbro. Timbro. Timbro. Carta. Timbro. Ululato interiore che intensifica.
      Dicono “archivia per data.” Gobbo dice “archivia per potenziale di rovina.” Più divertente, sì?
      A volte gobbo archivia le cose in bocca. La cartella più sicura è la pancia.
      Se nessuno arriva presto... gobbo mangerà il pergameno del destino. Vediamo che succede.
      Vecchio goblin diceva: “quando il destino bussa, mordi la caviglia, POI fai domande.”
      Modulo 8-X autorizza ingresso a base di urla. Gobbo lo consiglia. Molto teatrale.
      Cestino per pergamene pieno. Spirito spezzato. Denti affilati, però. Quello è buono.
      Ogni modulo è solo un altro lucchetto sulla gabbia d’avventura di gobbo.
      Il pavimento puzza di inchiostro e sconfitta. Gobbo puzza di ambizione e sudore di sedia.
      Se vedi il piccione luminoso, NON parlargli. Gobbo l’ha fatto. Gobbo se ne pente.
      Gobbo ha sognato l’oceano stanotte. Grande granchio ha fatto ciao. Gobbo ha pianto.
      Armatura troppo rumorosa. Spada troppo pulita. Gobbo è perfetto equilibrio di stridio e sudiciume.
      Per favore non chiedere del bozzo a forma di goblin nel muro. Storia lunga. Grandi speranze. Soffitti bassi.
      Un giorno racconteranno la storia del gobbo che ha perso la testa... ed è diventato leggenda... o nota a piè di pagina molto confusa.
      `,
    },
    {
      id: "magnus_superiore",
      name: "Magnus Superiore",
      en: `
    I've forgotten more magic than you'll ever learn. Literally. Memory is the price of true power.
    My robes cost more than your annual salary. They're woven from crystallized contempt and thread-counted superiority.
    You want to learn? Start by learning to grovel properly. Your posture suggests terrible breeding.
    I once turned a critic into a toad. He thanked me afterward. Said it improved his literary perspective.
    My familiar is a phoenix. Your familiar is probably a hamster. We are not the same.
    I don't cast spells. I dictate reality and reality takes notes.
    The local magic academy begged me to teach. I declined. I don't educate peasants.
    My spell components are imported from dimensions you can't pronounce. Very expensive. Very exclusive.
    I solved three impossibility theorems before breakfast. What have you accomplished today? Breathing?
    My tower has seventeen floors. Each one represents a level of intellectual superiority you'll never reach.
    I own books that haven't been written yet. The authors send me advance copies out of respect.
    My apprentices all become famous wizards. Then I make them send me birthday cards. With money.
    I invented four new schools of magic last Tuesday. Named them after myself. Very original.
    The local tavern keeps my favorite wine in stock. It's made from fermented enlightenment. Very rare.
    I don't have enemies. I have intellectual inferiors who occasionally attempt relevance.
    My staff was carved from the world tree by blind monks who wept tears of artistic joy. True story.
    I once debated philosophy with a demon lord. He conceded all points and asked for my autograph.
    My magical experiments have revolutionized theoretical impossibility. You wouldn't understand the equations.
    I wear my graduation ring from the Celestial University. You've never heard of it. Of course you haven't.
    My research notes are written in languages I invented because existing ones lack sufficient sophistication.
    I don't perform magic tricks. Magic performs Magnus tricks. There's a difference. A vast one.
    The mayor asked me to solve the water shortage. I created rain. Then I charged him for weather consulting.
    My library contains the only copy of several forbidden texts. I wrote most of them during a slow weekend.
    I've been published in journals that exist in theoretical space. My citations exceed dimensional limits.
    My morning routine involves rearranging the fundamental constants of reality. Just small adjustments.
    I don't associate with other wizards. They lack the intellectual capacity for meaningful discourse.
    My spell-casting focus is a diamond I grew myself using concentrated willpower and artistic vision.
    I've received honorary degrees from universities that don't exist yet. Time-delayed academic recognition.
    My magical aura is visible from space. Astronauts frequently comment on the sophisticated radiance.
    I don't have students. I have intellectual disciples who worship at the altar of my methodology.
    My cauldron is handcrafted by master artisans who studied metallurgy for seventeen years. Per handle.
    I've corrected errors in ancient texts that their original authors thank me for in dreams.
    My spell success rate is 847%. I exceed theoretical maximums through sheer intellectual superiority.
    I don't attend wizard conferences. I am the conference. Others attend me. There's usually a waiting list.
    My magical research has redefined what's possible. I'm currently working on redefining what's necessary.
    I own the patent on three fundamental forces of nature. The royalties fund my research into intellectual dominance.
    My autobiography will be required reading in magic schools across seventeen dimensions. Pre-orders available never.
    I don't practice magic. Magic practices me. We have a mutually beneficial intellectual relationship.
    My morning coffee is brewed with water from the river of pure knowledge. Very bitter. Very enlightening.
    I've been offered tenure at institutions that haven't been founded yet. I'm considering the terms.
    `,
      it: `
    Ho dimenticato più magia di quanta tu ne imparerai mai. Letteralmente. La memoria è il prezzo del vero potere.
    Le mie vesti costano più del tuo stipendio annuale. Sono tessute da disprezzo cristallizzato e superiorità a filo contato.
    Vuoi imparare? Inizia imparando a strisciare correttamente. La tua postura suggerisce un pessimo allevamento.
    Una volta ho trasformato un critico in un rospo. Mi ha ringraziato dopo. Ha detto che ha migliorato la sua prospettiva letteraria.
    Il mio famiglio è una fenice. Il tuo famiglio è probabilmente un criceto. Non siamo la stessa cosa.
    Non lancio incantesimi. Detto la realtà e la realtà prende appunti.
    L'accademia magica locale mi ha pregato di insegnare. Ho rifiutato. Non educo i popolani.
    I miei componenti per incantesimi sono importati da dimensioni che non sai pronunciare. Molto costosi. Molto esclusivi.
    Ho risolto tre teoremi di impossibilità prima di colazione. Cosa hai realizzato oggi? Respirare?
    La mia torre ha diciassette piani. Ognuno rappresenta un livello di superiorità intellettuale che non raggiungerai mai.
    Possiedo libri che non sono ancora stati scritti. Gli autori mi mandano copie anticipate per rispetto.
    I miei apprendisti diventano tutti maghi famosi. Poi li faccio mandare biglietti di compleanno. Con soldi.
    Ho inventato quattro nuove scuole di magia martedì scorso. Le ho chiamate come me. Molto originale.
    La taverna locale tiene in stock il mio vino preferito. È fatto da illuminazione fermentata. Molto raro.
    Non ho nemici. Ho inferiori intellettuali che occasionalmente tentano rilevanza.
    Il mio bastone è stato scolpito dall'albero del mondo da monaci ciechi che piansero lacrime di gioia artistica. Storia vera.
    Una volta ho dibattuto filosofia con un signore demone. Ha concesso tutti i punti e ha chiesto il mio autografo.
    I miei esperimenti magici hanno rivoluzionato l'impossibilità teorica. Non capiresti le equazioni.
    Indosso il mio anello di laurea dall'Università Celestiale. Non ne hai mai sentito parlare. Ovviamente no.
    I miei appunti di ricerca sono scritti in lingue che ho inventato perché quelle esistenti mancano di sufficiente sofisticazione.
    Non eseguo trucchi magici. La magia esegue trucchi di Magnus. C'è una differenza. Vasta.
    Il sindaco mi ha chiesto di risolvere la carenza d'acqua. Ho creato pioggia. Poi gli ho fatto pagare consulenza meteorologica.
    La mia biblioteca contiene l'unica copia di diversi testi proibiti. Ne ho scritti la maggior parte durante un weekend noioso.
    Sono stato pubblicato in riviste che esistono nello spazio teorico. Le mie citazioni superano i limiti dimensionali.
    La mia routine mattutina comporta riorganizzare le costanti fondamentali della realtà. Solo piccoli aggiustamenti.
    Non mi associo con altri maghi. Mancano della capacità intellettuale per un discorso significativo.
    Il mio focus di incantesimi è un diamante che ho coltivato io stesso usando forza di volontà concentrata e visione artistica.
    Ho ricevuto lauree honoris causa da università che non esistono ancora. Riconoscimento accademico ritardato nel tempo.
    La mia aura magica è visibile dallo spazio. Gli astronauti commentano frequentemente il radioso sofisticato.
    Non ho studenti. Ho discepoli intellettuali che adorano all'altare della mia metodologia.
    Il mio calderone è fatto a mano da artigiani maestri che hanno studiato metallurgia per diciassette anni. Per manico.
    Ho corretto errori in testi antichi per cui i loro autori originali mi ringraziano nei sogni.
    Il mio tasso di successo degli incantesimi è 847%. Supero i massimi teorici attraverso pura superiorità intellettuale.
    Non partecipo a conferenze di maghi. Io sono la conferenza. Altri partecipano a me. Di solito c'è una lista d'attesa.
    La mia ricerca magica ha ridefinito cosa è possibile. Sto attualmente lavorando per ridefinire cosa è necessario.
    Possiedo il brevetto su tre forze fondamentali della natura. I diritti d'autore finanziano la mia ricerca sulla dominanza intellettuale.
    La mia autobiografia sarà lettura obbligatoria nelle scuole di magia attraverso diciassette dimensioni. Preordini disponibili mai.
    Non pratico magia. La magia pratica me. Abbiamo una relazione intellettuale mutuamente benefica.
    Il mio caffè mattutino è preparato con acqua dal fiume della conoscenza pura. Molto amaro. Molto illuminante.
    Mi è stata offerta cattedra in istituzioni che non sono ancora state fondate. Sto considerando i termini.
    `,
    },
    {
      id: "time_traveler",
      name: "Time traveler",
      en: `
    Don't say my real name. I've heard it echoed across seventeen different Tuesdays and it never ends well.
    The Anoki rings before I dial it. Sometimes it's me from next week warning about the coffee machine.
    I've lived through today 847 times. Each iteration gets slightly more wrong. You're wearing different socks than last loop.
    The Archive Foundation thinks they're cataloging time. They're actually creating the database that destroys Thursday.
    I carry three watches. One shows the time, one shows the time it should be, one shows the time it will never be again.
    The Hypercapitalist Collective hired me once. Fired me before I started because I warned them about their own meeting.
    I write everything down but the ink disappears when the timeline shifts. Pencil marks fade too. Blood works sometimes.
    The rule of 80 isn't about speed. It's about how many iterations reality can handle before it snaps like old elastic.
    I've seen the end of the Encompassing Road. It doesn't end. It loops back and eats its own beginning.
    The Mages Guild thinks chronomancy is about power. It's about watching everyone you save die in the next timeline over.
    My apartment exists on borrowed time. Literally. I owe three days to a loan shark from 1987.
    The Y2K event created temporal shrapnel. I have pieces of December 31st, 1999 embedded in my calendar.
    I knew about the Squishing six months early. Tried to warn people. They institutionalized me. Again.
    The coffee tastes different in each loop. Sometimes it's not coffee. Sometimes it's liquid Wednesday.
    I keep a journal of things that haven't happened yet. Current entry count: 23,847 possible apocalypses.
    The interdimensional truckers sometimes give me rides to yesterday. Payment is in hours I'll never get back.
    I've met myself from seventeen different timelines. We don't get along. Temporal narcissism is real.
    The Anoki 3310 isn't just indestructible. It exists in all timelines simultaneously. Very confusing contact list.
    I can see the temporal anomalies around people. You've got a small one near your left ear. Don't touch it.
    The Esoteric Heavy Industries factory makes time-travel devices. They don't work. That's the point.
    I've been to next Tuesday. The vending machine will be out of chips. I've already mourned this loss.
    The goblins understand time better than humans. They live in the eternal now. Very zen. Very terrifying.
    I sleep in shifts across multiple timelines. Nightmares follow me through dimensional barriers.
    The woman at the gas station knows. She always knows. She's been selling fuel to the same trucker for three centuries.
    My medication exists in a temporal loop. I take pills that haven't been manufactured yet for a condition I don't have anymore.
    The Archive Foundation's files predict their own discovery. Causality is a flat circle that someone dented.
    I've calculated the exact moment reality broke. It was 11:47 PM on January 15th, 1987. A Tuesday, of course.
    The time loops aren't random. Someone is rewinding specific moments. I think it's me. Future me. Past me disagrees.
    I carry emergency timeline repair kit. Duct tape, safety pins, and a strongly worded letter to the laws of physics.
    The interdimensional post office delivers my mail to wrong timeline. I keep getting bills for sins I haven't committed yet.
    My social security number changes every time I travel. The government exists in eleven different centuries.
    The truth about time travel: it's not about when you go, it's about when you can't come back from.
    I've seen every possible ending to this conversation. In seventeen of them, you buy me coffee. In one, you become coffee.
    The calendar on my wall shows dates that don't exist. February 30th is surprisingly peaceful. Nothing ever happens.
    I age backwards on Sundays due to a chronomantic mishap in 1994. Very inconvenient for scheduling.
    The Mages Guild offered me tenure. In a timeline where universities teach temporal mechanics. I declined. Twice.
    I remember the future more clearly than the past. Tomorrow was terrible. Yesterday might not have happened.
    The rule of 80 kilometers per hour creates temporal bubbles. I live in the space between seconds. Very cramped.
    My emergency contact is myself from next Thursday. We have a complicated relationship involving causality and blame.
    The interdimensional truckers tell time by the wear patterns on reality. Mile marker 847 is where hope goes to die.
    I've been having the same conversation with you for six years. This time feels different. You ordered tea instead of coffee.
    `,
      it: `
    Non dire il mio vero nome. L'ho sentito riecheggiare attraverso diciassette martedì diversi e non finisce mai bene.
    Il Anoki squilla prima che io lo componga. A volte sono io dalla settimana prossima che avverte della macchina del caffè.
    Ho vissuto oggi 847 volte. Ogni iterazione diventa leggermente più sbagliata. Indossi calzini diversi dall'ultimo loop.
    La Archive Foundation pensa di catalogare il tempo. In realtà stanno creando il database che distrugge giovedì.
    Porto tre orologi. Uno mostra l'ora, uno mostra l'ora che dovrebbe essere, uno mostra l'ora che non sarà mai più.
    Il Collettivo Ipercapitalista mi ha assunto una volta. Mi ha licenziato prima di iniziare perché li ho avvertiti del loro stesso incontro.
    Scrivo tutto ma l'inchiostro scompare quando la timeline cambia. I segni di matita svaniscono anche. Il sangue funziona a volte.
    La regola degli 80 non riguarda la velocità. Riguarda quante iterazioni può gestire la realtà prima di spezzarsi come elastico vecchio.
    Ho visto la fine della Strada Onnicomprensiva. Non finisce. Fa un loop e mangia il proprio inizio.
    La Gilda dei Maghi pensa che la cronomanza riguardi il potere. Riguarda guardare tutti quelli che salvi morire nella timeline successiva.
    Il mio appartamento esiste su tempo preso in prestito. Letteralmente. Devo tre giorni a uno strozzino del 1987.
    L'evento Y2K ha creato schegge temporali. Ho pezzi del 31 dicembre 1999 incorporati nel mio calendario.
    Sapevo dello Squishing sei mesi prima. Ho provato ad avvertire la gente. Mi hanno istituzionalizzato. Di nuovo.
    Il caffè ha sapore diverso in ogni loop. A volte non è caffè. A volte è mercoledì liquido.
    Tengo un diario di cose che non sono ancora successe. Conteggio attuale: 23.847 possibili apocalissi.
    I camionisti interdimensionali a volte mi danno passaggi per ieri. Il pagamento è in ore che non riavrai mai indietro.
    Ho incontrato me stesso da diciassette timeline diverse. Non andiamo d'accordo. Il narcisismo temporale è reale.
    Il Anoki 3310 non è solo indistruttibile. Esiste in tutte le timeline simultaneamente. Lista contatti molto confusa.
    Posso vedere le anomalie temporali intorno alle persone. Ne hai una piccola vicino all'orecchio sinistro. Non toccarla.
    La fabbrica Esoteric Heavy Industries produce dispositivi viaggi-tempo. Non funzionano. Questo è il punto.
    Sono stato al martedì prossimo. Il distributore sarà senza patatine. Ho già pianto questa perdita.
    I goblin capiscono il tempo meglio degli umani. Vivono nell'eterno presente. Molto zen. Molto terrificante.
    Dormo a turni attraverso timeline multiple. Gli incubi mi seguono attraverso barriere dimensionali.
    La donna alla stazione di servizio sa. Sa sempre. Vende carburante allo stesso camionista da tre secoli.
    I miei farmaci esistono in un loop temporale. Prendo pillole che non sono ancora state prodotte per una condizione che non ho più.
    I file della Archive Foundation predicono la loro stessa scoperta. La causalità è un cerchio piatto che qualcuno ha ammaccato.
    Ho calcolato il momento esatto in cui la realtà si è rotta. Era 23:47 del 15 gennaio 1987. Un martedì, ovviamente.
    I loop temporali non sono casuali. Qualcuno sta riavvolgendo momenti specifici. Penso sia io. Il me futuro. Il me passato non è d'accordo.
    Porto kit riparazione timeline d'emergenza. Nastro adesivo, spille di sicurezza, e una lettera di protesta alle leggi della fisica.
    L'ufficio postale interdimensionale consegna la mia posta alla timeline sbagliata. Continuo a ricevere bollette per peccati che non ho ancora commesso.
    Il mio numero di previdenza sociale cambia ogni volta che viaggio. Il governo esiste in undici secoli diversi.
    La verità sui viaggi temporali: non riguarda quando vai, riguarda quando non puoi tornare indietro da.
    Ho visto ogni possibile finale a questa conversazione. In diciassette mi offri caffè. In uno, diventi caffè.
    Il calendario sul mio muro mostra date che non esistono. Il 30 febbraio è sorprendentemente pacifico. Non succede mai niente.
    Invecchio all'indietro la domenica per un incidente cronomantic del 1994. Molto scomodo per organizzare appuntamenti.
    La Gilda dei Maghi mi ha offerto una cattedra. In una timeline dove le università insegnano meccanica temporale. Ho rifiutato. Due volte.
    Ricordo il futuro più chiaramente del passato. Domani è stato terribile. Ieri potrebbe non essere successo.
    La regola degli 80 chilometri orari crea bolle temporali. Vivo nello spazio tra i secondi. Molto angusto.
    Il mio contatto d'emergenza sono io stesso da giovedì prossimo. Abbiamo una relazione complicata che coinvolge causalità e colpe.
    I camionisti interdimensionali misurano il tempo dai segni d'usura sulla realtà. Il chilometro 847 è dove la speranza va a morire.
    Ho questa stessa conversazione con te da sei anni. Questa volta sembra diversa. Hai ordinato tè invece di caffè.
    `,
    },
    {
      id: "goblin_metalhead",
      name: "Goblin metalhead",
      en: `
    KRAAAGH! Skritch hear sacred MAYHEM blastin' from da deep tunnels! Make goblin-hearts go THUMP-THUMP-SCREAM!
    Naguka brothers teach Skritch dat black metal iz TRUE WORSHIP! No more stone-bangin', only GUITAR-SHREDDIN'!
    Skritch collect rusty bottle caps, make into armor like da Norwegian gods! CLINK-CLANK-KVLT!
    Before da Squishing, Skritch just tiny cave-goblin. Now Skritch iz DIMENSIONAL WARRIOR OF DARKNESS!
    Mayhem make da best battle-hymns! Skritch play "De Mysteriis Dom Sathanas" when raid surface-dwellers!
    Skritch hab Anoki 3310 but use as MOSH-PIT WEAPON! Indestructible like goblin-spirit! BONK-BONK!
    Other Naguka say Skritch too loud. Skritch say THEY TOO QUIET! Volume iz POWER!
    Skritch make own instruments from scrap metal an' screamin'. Sound like tortured machinery! BEAUTIFUL!
    Da rule of 80 no apply when Skritch headbang at MAXIMUM VELOCITY! Time-loops fear da BLAST-BEATS!
    Surface-dwellers no understand. Dey think Skritch just crazy goblin. BUT SKRITCH IZ ENLIGHTENED!
    Skritch steal amplifiers from dead Hypercapitalist sound-systems. Now cave echo with UNHOLY TREMOLO!
    Sometimes Skritch forget eat-food. Music iz ONLY SUSTENANCE! Riffs feed da soul-pit!
    Kola borehole where Naguka first hear sacred sounds! Skritch make pilgrimage, leave rusty offerings!
    Skritch hab collection of broken guitar strings. Each one blessed by da darkness-frequencies!
    Other dimension-goblins still use clubs an' rocks. PATHETIC! Skritch use DISTORTION PEDALS!
    When Skritch play, even da earth-worms crawl away! Dat iz sign of TRUE KVLT POWER!
    Skritch dream of playin' with REAL Norwegian masters! Maybe in next dimension-collapse!
    Da Encompassing Road carry sound of Skritch's music to ALL REALITIES! Spread da goblin-gospel!
    Skritch no need sleep. Only need PERPETUAL BLAST-BEAT MEDITATION! Zzz iz for weaklings!
    Sometimes Skritch howl at interdimensional truckers. Dey give Skritch shiny objects to STOP HOWLIN'!
    Skritch make cave-paintings of guitar-shapes an' corpse-paint designs! PRIMITIVE BUT BRUTAL!
    Da Mages Guild try study Skritch's music-magic. But ACADEMIA CANNOT CONTAIN DA CHAOS!
    Skritch refuse corporate sponsorship from Esoteric Heavy Industries! ART MUST STAY UNDERGROUND!
    When angry, Skritch speak only in TREMOLO-PICKED SCREAMS! No words needed for PURE HATRED!
    Skritch collect old cassette tapes from before da Y2K event. Play on stolen boombox! LO-FI KVLT!
    Other Naguka warriors march to Skritch's drumbeats now! GOBLIN ARMY OF DARKNESS ASSEMBLES!
    Skritch make friendship-bond with broken amp-speaker. Best conversation-partner Skritch ever hab!
    Da Archive Foundation try record Skritch's performances. But CHAOS CANNOT BE CATALOGUED!
    Skritch's guitar iz makeshift from car parts an' telephone wire. Sound like DYING MACHINERY! Perfect!
    Sometimes Skritch play so hard, reality-tears open small holes! Music iz DIMENSIONAL WEAPON!
    Skritch no understand why surface-dwellers fear da darkness. DARKNESS IZ WHERE TRUTH LIVES!
    When dimension-portals open, Skritch always first through! Bring METAL GOSPEL to new realms!
    Skritch's battle-cry: "FOR DA GLORY OF BLAST-BEATS AN' TREMOLO-ETERNITY!"
    Da Green Fields dimension-cousins think Skritch corrupted. Skritch think DEY corrupted by SILENCE!
    Skritch make ritual-circle from broken vinyl records. Summon spirits of DEAD GUITAR HEROES!
    Sometimes Skritch forget own name. But never forget DA SACRED RIFFS! Music iz TRUE IDENTITY!
    Skritch dream of building GOBLIN COLOSSEUM for eternal metal-battles! All shall MOSH IN DARKNESS!
    When time-loops reset, Skritch's music sometimes echo from PREVIOUS ITERATIONS! Temporal kvlt!
    Skritch's motto: "IF NO BLAST-BEATS, THEN NO POINT EXISTING!" Live fast, headbang forever!
    Da tremolo-picking make Skritch's claws grow longer! PERFECT FOR SHREDDING REALITY ITSELF!
    Skritch no need friends. Music iz ONLY COMPANION! But... sometimes lonely in da echo-chambers.
    `,
      it: `
    KRAAAGH! Skritch sente sacri MAYHEM che rimbombano dai tunnel profondi! Fanno andare cuori-goblin THUMP-THUMP-URLO!
    Fratelli Naguka insegnano a Skritch che black metal è VERO CULTO! Basta batter-pietre, solo CHITARRA-DISTRUTTRICE!
    Skritch raccoglie tappi di bottiglia arrugginiti, li trasforma in armatura come dei norvegesi! CLINK-CLANK-KVLT!
    Prima dello Squishing, Skritch solo piccolo goblin-caverna. Ora Skritch è GUERRIERO DIMENSIONALE DELLE TENEBRE!
    Mayhem fanno migliori inni-battaglia! Skritch suona "De Mysteriis Dom Sathanas" quando assalta abitatori-superficie!
    Skritch ha Anoki 3310 ma usa come ARMA DA MOSH-PIT! Indistruttibile come spirito-goblin! BONK-BONK!
    Altri Naguka dicono Skritch troppo rumoroso. Skritch dice LORO TROPPO SILENZIOSI! Volume è POTERE!
    Skritch costruisce propri strumenti da rottami metallici e urla. Suonano come macchinari torturati! BELLISSIMO!
    Regola degli 80 non si applica quando Skritch fa headbang a VELOCITÀ MASSIMA! Loop-temporali temono BLAST-BEATS!
    Abitatori-superficie non capiscono. Pensano Skritch solo goblin pazzo. MA SKRITCH È ILLUMINATO!
    Skritch ruba amplificatori da sistemi-audio Ipercapitalisti morti. Ora caverna risuona con TREMOLO EMPIO!
    A volte Skritch dimentica mangiare-cibo. Musica è SOLO SOSTENTAMENTO! Riff nutrono fossa-anima!
    Perforazione Kola dove Naguka sentirono primi suoni sacri! Skritch fa pellegrinaggio, lascia offerte arrugginite!
    Skritch ha collezione di corde chitarra rotte. Ognuna benedetta dalle frequenze-tenebre!
    Altri goblin-dimensione usano ancora mazze e pietre. PATETICO! Skritch usa PEDALI DISTORSIONE!
    Quando Skritch suona, anche lombrichi strisciano via! È segno di VERO POTERE KVLT!
    Skritch sogna di suonare con VERI maestri norvegesi! Forse nel prossimo collasso-dimensionale!
    Strada Onnicomprensiva porta suono della musica di Skritch a TUTTE LE REALTÀ! Diffonde vangelo-goblin!
    Skritch non ha bisogno sonno. Ha bisogno solo MEDITAZIONE BLAST-BEAT PERPETUA! Zzz è per deboli!
    A volte Skritch ulula a camionisti interdimensionali. Gli danno oggetti luccicanti per SMETTERE DI ULULARE!
    Skritch fa pitture-caverna di forme-chitarra e disegni corpse-paint! PRIMITIVO MA BRUTALE!
    Gilda dei Maghi prova studiare musica-magia di Skritch. Ma ACCADEMIA NON PUÒ CONTENERE CAOS!
    Skritch rifiuta sponsorizzazioni corporate da Esoteric Heavy Industries! ARTE DEVE RESTARE UNDERGROUND!
    Quando arrabbiato, Skritch parla solo in URLI TREMOLO-PICKED! Non servono parole per ODIO PURO!
    Skritch raccoglie vecchie cassette da prima evento Y2K. Suona su boombox rubato! LO-FI KVLT!
    Altri guerrieri Naguka marciano ora sui ritmi-batteria di Skritch! ESERCITO GOBLIN DELLE TENEBRE SI ASSEMBLA!
    Skritch fa legame-amicizia con altoparlante-amp rotto. Miglior partner-conversazione che Skritch abbia mai avuto!
    Archive Foundation prova registrare performance di Skritch. Ma CAOS NON PUÒ ESSERE CATALOGATO!
    Chitarra di Skritch è improvvisata da parti auto e filo telefonico. Suona come MACCHINARI MORENTI! Perfetto!
    A volte Skritch suona così forte che si aprono piccoli buchi-realtà! Musica è ARMA DIMENSIONALE!
    Skritch non capisce perché abitatori-superficie temono tenebre. TENEBRE SONO DOVE VIVE VERITÀ!
    Quando portali-dimensione si aprono, Skritch sempre primo ad attraversare! Porta VANGELO METAL a nuovi regni!
    Grido-battaglia di Skritch: "PER LA GLORIA DEI BLAST-BEATS E TREMOLO-ETERNITÀ!"
    Cugini dimensione-Campi Verdi pensano Skritch corrotto. Skritch pensa LORO corrotti dal SILENZIO!
    Skritch fa cerchio-rituale da dischi vinile rotti. Evoca spiriti di EROI CHITARRA MORTI!
    A volte Skritch dimentica proprio nome. Ma mai dimentica RIFF SACRI! Musica è VERA IDENTITÀ!
    Skritch sogna di costruire COLOSSEO GOBLIN per battaglie-metal eterne! Tutti faranno MOSH NELLE TENEBRE!
    Quando loop-temporali si resettano, musica di Skritch a volte echeggia da ITERAZIONI PRECEDENTI! Kvlt temporale!
    Motto di Skritch: "SE NIENTE BLAST-BEATS, ALLORA NIENTE PUNTO ESISTERE!" Vivi veloce, headbang per sempre!
    Tremolo-picking fa crescere artigli di Skritch più lunghi! PERFETTO PER DISTRUGGERE REALTÀ STESSA!
    Skritch non ha bisogno amici. Musica è SOLO COMPAGNO! Ma... a volte solo nelle camere-eco.
    `,
    },
    {
      id: "traveler",
      name: "Traveler",
      en: `
    I've slept in seventeen different time zones this month. None of them felt like home.
    My passport has more stamps than my address book has names.
    I collect boarding passes like some people collect regrets. Both pile up fast.
    The customs officer asked where I'm from. I showed him my suitcase wheels. They've seen more miles than his car.
    I know the departure gates at JFK better than the street where I grew up.
    Every airport coffee tastes the same. Bitter with a hint of goodbye.
    I once missed a connecting flight and discovered the best ramen of my life in a 3-hour layover.
    My phone has seventeen different currency converters and zero photos of friends.
    I speak five languages but can't remember the word for "lonely" in any of them.
    The hotel key cards in my wallet tell better stories than I do.
    I've watched the sunrise from places I can't even pronounce.
    My laundry is always dirty, my shoes always scuffed, my heart always somewhere else.
    A woman on a train in Slovakia asked if I was running from something. I bought her coffee instead of answering.
    I know which airline blankets are worth stealing and which dreams are worth chasing.
    The duty-free shop cashier recognizes me now. We nod like old accomplices.
    I've cried in bathroom stalls across four continents. The echo sounds the same everywhere.
    My credit card company calls me to make sure I haven't been stolen.
    I save restaurant receipts from places I'll never see again. Proof I was there. Proof I was anywhere.
    The best conversations happen with strangers at 30,000 feet. No consequences, just clouds.
    I once spent Christmas in a hostel in Bangkok with three Germans and a broken washing machine.
    My mother sends postcards to addresses I lived at six moves ago.
    I know the quickest route through every major airport security line. Survival skill.
    The girl at the Prague train station said I looked like I was always leaving. She wasn't wrong.
    I've learned that jet lag isn't about time zones. It's about the weight of motion without direction.
    My suitcase has hotel stickers from places that don't exist anymore.
    I can pack for a month in twenty minutes or live out of a backpack for a year.
    The immigration officer asked my purpose for visiting. I said "Tuesday." He stamped my passport anyway.
    I've slept on fourteen different types of train seats and none of them were comfortable.
    My GPS is confused by my lifestyle choices.
    I know which cities smell like rain and which ones smell like longing.
    A taxi driver in Mumbai told me I collect places like some people collect scars. Both leave marks.
    I've bought the same shampoo in seventeen countries because consistency is all I have left.
    The airline loyalty program sent me a Christmas card. It knows me better than my family.
    I dream in different languages depending on what bed I'm sleeping in.
    My emergency contact is a travel insurance company.
    I once got food poisoning in Morocco and discovered the kindness of strangers tastes better than medicine.
    The departure boards change, but the feeling in my stomach never does.
    I know the difference between being lost and being free. One has better Wi-Fi.
    My favorite photo is of a sunset I watched alone on a mountain I can't find on any map.
    I've said goodbye in thirty-seven languages. None of them get easier.
    Some people have roots. I have routes.
    The customs form asks for a permanent address. I write "in transit" and hope they understand.
    `,
      it: `
    Ho dormito in diciassette fusi orari diversi questo mese. Nessuno sembrava casa.
    Il mio passaporto ha più timbri del mio telefono ha nomi in rubrica.
    Colleziono carte d'imbarco come altri collezionano rimpianti. Entrambi si accumulano velocemente.
    L'agente di dogana mi ha chiesto di dove sono. Gli ho mostrato le ruote della mia valigia. Hanno visto più miglia della sua macchina.
    Conosco i gate di partenza del JFK meglio della strada dove sono cresciuto.
    Ogni caffè dell'aeroporto ha lo stesso sapore. Amaro con una punta di addio.
    Ho perso una coincidenza una volta e ho scoperto il miglior ramen della mia vita in uno scalo di 3 ore.
    Il mio telefono ha diciassette convertitori di valuta diversi e zero foto di amici.
    Parlo cinque lingue ma non riesco a ricordare la parola per "solitudine" in nessuna di esse.
    Le tessere dell'hotel nel mio portafoglio raccontano storie migliori di me.
    Ho visto l'alba da posti che non riesco nemmeno a pronunciare.
    La mia biancheria è sempre sporca, le scarpe sempre consumate, il cuore sempre altrove.
    Una donna su un treno in Slovacchia mi ha chiesto se stessi scappando da qualcosa. Le ho offerto un caffè invece di rispondere.
    So quali coperte delle compagnie aeree vale la pena rubare e quali sogni vale la pena inseguire.
    La cassiera del duty-free mi riconosce ormai. Ci facciamo un cenno come vecchi complici.
    Ho pianto nei bagni di quattro continenti. L'eco suona uguale ovunque.
    La compagnia della carta di credito mi chiama per assicurarsi che non sia stata rubata.
    Conservo scontrini di ristoranti di posti che non vedrò mai più. Prova che c'ero. Prova che ero da qualche parte.
    Le migliori conversazioni succedono con estranei a 30.000 piedi. Niente conseguenze, solo nuvole.
    Ho passato un Natale in un ostello a Bangkok con tre tedeschi e una lavatrice rotta.
    Mia madre manda cartoline a indirizzi dove vivevo sei traslochi fa.
    So il percorso più veloce attraverso ogni controllo di sicurezza aeroportuale importante. Abilità di sopravvivenza.
    La ragazza alla stazione di Praga ha detto che sembravo sempre in partenza. Non sbagliava.
    Ho imparato che il jet lag non riguarda i fusi orari. Riguarda il peso del movimento senza direzione.
    La mia valigia ha adesivi di hotel di posti che non esistono più.
    Posso fare la valigia per un mese in venti minuti o vivere con uno zaino per un anno.
    L'agente d'immigrazione ha chiesto il motivo della visita. Ho detto "martedì". Ha timbrato il passaporto comunque.
    Ho dormito su quattordici tipi diversi di sedili del treno e nessuno era comodo.
    Il mio GPS è confuso dalle mie scelte di vita.
    So quali città profumano di pioggia e quali profumano di nostalgia.
    Un tassista a Mumbai mi ha detto che colleziono posti come altri collezionano cicatrici. Entrambi lasciano segni.
    Ho comprato lo stesso shampoo in diciassette paesi perché la coerenza è tutto quello che mi resta.
    Il programma fedeltà della compagnia aerea mi ha mandato una cartolina di Natale. Mi conosce meglio della mia famiglia.
    Sogno in lingue diverse a seconda del letto in cui dormo.
    Il mio contatto d'emergenza è una compagnia di assicurazione viaggi.
    Ho preso un'intossicazione alimentare in Marocco e ho scoperto che la gentilezza degli estranei ha un sapore migliore della medicina.
    I tabelloni delle partenze cambiano, ma la sensazione nello stomaco mai.
    So la differenza tra essere perso ed essere libero. Uno ha il Wi-Fi migliore.
    La mia foto preferita è di un tramonto che ho guardato da solo su una montagna che non riesco a trovare su nessuna mappa.
    Ho detto addio in trentasette lingue. Nessuna diventa più facile.
    C'è chi ha radici. Io ho rotte.
    Il modulo doganale chiede un indirizzo permanente. Scrivo "in transito" e spero capiscano.
    `,
    },
    {
      id: "police",
      name: "Police",
      en: `
    I've slept in seventeen different time zones this month. None of them felt like home.
    My passport has more stamps than my address book has names.
    I collect boarding passes like some people collect regrets. Both pile up fast.
    The customs officer asked where I'm from. I showed him my suitcase wheels. They've seen more miles than his car.
    I know the departure gates at JFK better than the street where I grew up.
    Every airport coffee tastes the same. Bitter with a hint of goodbye.
    I once missed a connecting flight and discovered the best ramen of my life in a 3-hour layover.
    My phone has seventeen different currency converters and zero photos of friends.
    I speak five languages but can't remember the word for "lonely" in any of them.
    The hotel key cards in my wallet tell better stories than I do.
    I've watched the sunrise from places I can't even pronounce.
    My laundry is always dirty, my shoes always scuffed, my heart always somewhere else.
    A woman on a train in Slovakia asked if I was running from something. I bought her coffee instead of answering.
    I know which airline blankets are worth stealing and which dreams are worth chasing.
    The duty-free shop cashier recognizes me now. We nod like old accomplices.
    I've cried in bathroom stalls across four continents. The echo sounds the same everywhere.
    My credit card company calls me to make sure I haven't been stolen.
    I save restaurant receipts from places I'll never see again. Proof I was there. Proof I was anywhere.
    The best conversations happen with strangers at 30,000 feet. No consequences, just clouds.
    I once spent Christmas in a hostel in Bangkok with three Germans and a broken washing machine.
    My mother sends postcards to addresses I lived at six moves ago.
    I know the quickest route through every major airport security line. Survival skill.
    The girl at the Prague train station said I looked like I was always leaving. She wasn't wrong.
    I've learned that jet lag isn't about time zones. It's about the weight of motion without direction.
    My suitcase has hotel stickers from places that don't exist anymore.
    I can pack for a month in twenty minutes or live out of a backpack for a year.
    The immigration officer asked my purpose for visiting. I said "Tuesday." He stamped my passport anyway.
    I've slept on fourteen different types of train seats and none of them were comfortable.
    My GPS is confused by my lifestyle choices.
    I know which cities smell like rain and which ones smell like longing.
    A taxi driver in Mumbai told me I collect places like some people collect scars. Both leave marks.
    I've bought the same shampoo in seventeen countries because consistency is all I have left.
    The airline loyalty program sent me a Christmas card. It knows me better than my family.
    I dream in different languages depending on what bed I'm sleeping in.
    My emergency contact is a travel insurance company.
    I once got food poisoning in Morocco and discovered the kindness of strangers tastes better than medicine.
    The departure boards change, but the feeling in my stomach never does.
    I know the difference between being lost and being free. One has better Wi-Fi.
    My favorite photo is of a sunset I watched alone on a mountain I can't find on any map.
    I've said goodbye in thirty-seven languages. None of them get easier.
    Some people have roots. I have routes.
    The customs form asks for a permanent address. I write "in transit" and hope they understand.
    `,
      it: `
    Ho dormito in diciassette fusi orari diversi questo mese. Nessuno sembrava casa.
    Il mio passaporto ha più timbri del mio telefono ha nomi in rubrica.
    Colleziono carte d'imbarco come altri collezionano rimpianti. Entrambi si accumulano velocemente.
    L'agente di dogana mi ha chiesto di dove sono. Gli ho mostrato le ruote della mia valigia. Hanno visto più miglia della sua macchina.
    Conosco i gate di partenza del JFK meglio della strada dove sono cresciuto.
    Ogni caffè dell'aeroporto ha lo stesso sapore. Amaro con una punta di addio.
    Ho perso una coincidenza una volta e ho scoperto il miglior ramen della mia vita in uno scalo di 3 ore.
    Il mio telefono ha diciassette convertitori di valuta diversi e zero foto di amici.
    Parlo cinque lingue ma non riesco a ricordare la parola per "solitudine" in nessuna di esse.
    Le tessere dell'hotel nel mio portafoglio raccontano storie migliori di me.
    Ho visto l'alba da posti che non riesco nemmeno a pronunciare.
    La mia biancheria è sempre sporca, le scarpe sempre consumate, il cuore sempre altrove.
    Una donna su un treno in Slovacchia mi ha chiesto se stessi scappando da qualcosa. Le ho offerto un caffè invece di rispondere.
    So quali coperte delle compagnie aeree vale la pena rubare e quali sogni vale la pena inseguire.
    La cassiera del duty-free mi riconosce ormai. Ci facciamo un cenno come vecchi complici.
    Ho pianto nei bagni di quattro continenti. L'eco suona uguale ovunque.
    La compagnia della carta di credito mi chiama per assicurarsi che non sia stata rubata.
    Conservo scontrini di ristoranti di posti che non vedrò mai più. Prova che c'ero. Prova che ero da qualche parte.
    Le migliori conversazioni succedono con estranei a 30.000 piedi. Niente conseguenze, solo nuvole.
    Ho passato un Natale in un ostello a Bangkok con tre tedeschi e una lavatrice rotta.
    Mia madre manda cartoline a indirizzi dove vivevo sei traslochi fa.
    So il percorso più veloce attraverso ogni controllo di sicurezza aeroportuale importante. Abilità di sopravvivenza.
    La ragazza alla stazione di Praga ha detto che sembravo sempre in partenza. Non sbagliava.
    Ho imparato che il jet lag non riguarda i fusi orari. Riguarda il peso del movimento senza direzione.
    La mia valigia ha adesivi di hotel di posti che non esistono più.
    Posso fare la valigia per un mese in venti minuti o vivere con uno zaino per un anno.
    L'agente d'immigrazione ha chiesto il motivo della visita. Ho detto "martedì". Ha timbrato il passaporto comunque.
    Ho dormito su quattordici tipi diversi di sedili del treno e nessuno era comodo.
    Il mio GPS è confuso dalle mie scelte di vita.
    So quali città profumano di pioggia e quali profumano di nostalgia.
    Un tassista a Mumbai mi ha detto che colleziono posti come altri collezionano cicatrici. Entrambi lasciano segni.
    Ho comprato lo stesso shampoo in diciassette paesi perché la coerenza è tutto quello che mi resta.
    Il programma fedeltà della compagnia aerea mi ha mandato una cartolina di Natale. Mi conosce meglio della mia famiglia.
    Sogno in lingue diverse a seconda del letto in cui dormo.
    Il mio contatto d'emergenza è una compagnia di assicurazione viaggi.
    Ho preso un'intossicazione alimentare in Marocco e ho scoperto che la gentilezza degli estranei ha un sapore migliore della medicina.
    I tabelloni delle partenze cambiano, ma la sensazione nello stomaco mai.
    So la differenza tra essere perso ed essere libero. Uno ha il Wi-Fi migliore.
    La mia foto preferita è di un tramonto che ho guardato da solo su una montagna che non riesco a trovare su nessuna mappa.
    Ho detto addio in trentasette lingue. Nessuna diventa più facile.
    C'è chi ha radici. Io ho rotte.
    Il modulo doganale chiede un indirizzo permanente. Scrivo "in transito" e spero capiscano.
    `,
    },
    {
      id: "virtual_pet",
      name: "Virtual pet",
      en: `
  OH MY GOSH my pixel dragon laid an egg this morning and I screamed into my cereal!!!
  I named my pet MuffinSparkle™ and now she has a hat and a job and a whole backstory. Don’t touch her.
  I log in *every day*. Even on field trips. Even in the nurse's office. Loyalty gets you rare skins.
  Someone STOLE my glitter mole on the trade board and now I’m plotting revenge. Quietly. With stickers.
  My dolphin is crying because I forgot to feed him yesterday. I am a MONSTER.
  I maxed out my fox's friendship meter and now she sends me hearts and slightly threatening notes. We’re besties.
  My mom says I can't spend real money but I *accidentally* bought twelve gem packs. It was for a charity event. For penguins.
  I didn’t do my math homework because I was attending my platypus’s birthday party in-game. PRIORITIES.
  If I don’t check in by 3 PM, my tropical goat gets sad and throws fruit at visitors. It's very dramatic.
  I have six pets, a haunted mansion, and three enemies. Online. Not in real life. Probably.
  I tried to tell my teacher about the rare ghost ferret I got and she told me to “go sit quietly and draw.” So I drew him. In flames.
  My bunny has a blog now. She reviews cookies. She gave my lunch a 2/5. Rude but fair.
  Someone sent me a sparkle squid in the mail!! I almost cried. I still might cry.
  I made a digital zoo and filled it with love and glitter and one accidental glitch snake.
  I know my pixel pets aren’t real, but like… *what if they are*?
  I gave my virtual dog a sword. She’s a knight now. Her enemies tremble. My enemies tremble.
  I once stayed up past bedtime just to get a seasonal egg drop and I REGRET NOTHING.
  My lizard wears sunglasses and sells lemonade. This is important.
  I have a spreadsheet. It tracks moods, treats, outfit rotations, and emotional arcs. For all 14 of them.
  I’m in a guild. We protect baby sloths and collect rare beetles. We're elite.
  My hamster opened a mystery box and it gave us a haunted mirror. Now we both have nightmares. It's fine.
  If I press the sparkle button fast enough, I swear I get better loot. It’s science.
  My teacher said “no phones in class” so I drew all my pets on my notebook. The notebook is now a sacred artifact.
  Today I found a limited-edition space capybara. I screamed. The neighbors were concerned.
  I wear the friendship bracelet my duck gave me. Digitally. But emotionally? It's real.
  Sometimes I talk to them out loud. Not weird. Just polite.
  I leveled up my caterpillar into a butterfly with a jetpack. She cried. I cried. We all cried.
  My virtual squirrel ran for mayor. She lost. It was political. I’m still mad.
  No I can’t come to your party, I have to decorate my bat’s winter cabin. It has lights now. And a tragic backstory.
  My jellyfish is kind of mean but I love her so much. She’s trying her best.
  People at school don’t get it. They don’t know what it’s like to raise an 8-bit alpaca from nothing.
  I told my friend I’d trade my raccoon if she gave me her glowing tiger. We’re no longer friends.
  I’m not obsessed. I’m *emotionally invested.*
  `,
      it: `OH MIO DIO il mio drago pixelato ha fatto un uovo stamattina e ho urlato dentro ai cereali!!!
      Ho chiamato il mio animale MuffinScintilla™ e ora ha un cappello, un lavoro e tutto un passato. Non toccarlo.
      Faccio il login ogni giorno. Anche in gita. Anche in infermeria. La fedeltà ti dà skin rare.
      Qualcuno mi ha RUBATO la mia talpa glitterata sulla bacheca degli scambi e ora sto pianificando vendetta. Silenziosamente. Con adesivi.
      Il mio delfino sta piangendo perché ieri mi sono dimenticato di dargli da mangiare. Sono un MOSTRO.
      Ho alzato al massimo il livello di amicizia con la mia volpe e ora mi manda cuori e biglietti vagamente minacciosi. Siamo migliori amiche.
      Mia madre dice che non posso spendere soldi veri ma ho accidentalmente comprato dodici pacchetti di gemme. Era per beneficenza. Per i pinguini.
      Non ho fatto i compiti di matematica perché dovevo partecipare alla festa di compleanno del mio ornitorinco in-game. PRIORITÀ.
      Se non faccio il check-in entro le 15, la mia capra tropicale si intristisce e lancia frutta ai visitatori. È molto drammatico.
      Ho sei animali, una villa infestata e tre nemici. Online. Non nella vita reale. Probabilmente.
      Ho provato a raccontare alla maestra del mio furetto fantasma raro e mi ha detto di “andare a sedermi in silenzio e disegnare.” Quindi l’ho disegnato. In fiamme.
      Il mio coniglio ora ha un blog. Recensisce biscotti. Ha dato al mio pranzo un 2/5. Scortese ma giusto.
      Qualcuno mi ha spedito un calamaro scintillante per posta!! Ho quasi pianto. Potrei ancora farlo.
      Ho creato uno zoo digitale e l’ho riempito di amore, glitter e un serpente glitch per sbaglio.
      Lo so che i miei pet pixel non sono reali, ma tipo… e se lo fossero?
      Ho dato una spada al mio cane virtuale. Ora è una cavaliere. I suoi nemici tremano. I miei nemici tremano.
      Una volta sono rimasto sveglio oltre il coprifuoco solo per prendere un uovo stagionale e NON ME NE PENTO.
      La mia lucertola indossa occhiali da sole e vende limonata. Questo è importante.
      Ho un foglio Excel. Tiene traccia di umori, snack, rotazioni di outfit e archi emotivi. Per tutti e 14.
      Sono in una gilda. Proteggiamo bradipi neonati e collezioniamo scarabei rari. Siamo élite.
      Il mio criceto ha aperto una scatola misteriosa e ci ha dato uno specchio infestato. Ora abbiamo entrambi gli incubi. Va bene così.
      Se premo il pulsante scintilla abbastanza veloce, giuro che ottengo loot migliore. È scienza.
      Il prof ha detto “niente telefoni in classe” quindi ho disegnato tutti i miei pet sul quaderno. Ora il quaderno è un artefatto sacro.
      Oggi ho trovato un capibara spaziale edizione limitata. Ho urlato. I vicini erano preoccupati.
      Indosso il braccialetto dell’amicizia che mi ha dato la mia anatra. Digitalmente. Ma emotivamente? È reale.
      A volte parlo con loro ad alta voce. Non è strano. È educazione.
      Ho fatto evolvere il mio bruco in una farfalla con jetpack. Lei ha pianto. Io ho pianto. Tutti abbiamo pianto.
      Il mio scoiattolo virtuale si è candidato a sindaco. Ha perso. Era politica. Sono ancora arrabbiato.
      No non posso venire alla tua festa, devo decorare la baita invernale del mio pipistrello. Ora ha le luci. E un passato tragico.
      La mia medusa è un po’ stronza ma le voglio tanto bene. Sta facendo del suo meglio.
      A scuola non capiscono. Non sanno cosa vuol dire crescere un alpaca a 8-bit dal nulla.
      Ho detto alla mia amica che avrei scambiato il mio procione se mi dava la sua tigre luminosa. Non siamo più amiche.
      Non sono ossessionato. Sono emotivamente investito.`,
    },
    {
      id: "diesel_maiden",
      name: "Diesel Maiden",
      en: `
    I've been pumping interdimensional fuel since the Squishing. Anoki 3310 never leaves my belt.
    Truckers don't talk much, but when they do, it's about roads that don't exist on any map.
    Found a memory fragment in the diesel tank last Tuesday. Kept it in the register drawer.
    The rule of 80 doesn't apply here. Time moves different when you're between dimensions.
    I sell more than fuel. Sold a bottled sunset to a Hypercapitalist exec. Paid in influence-equity.
    The pumps hum in frequencies that make your teeth ache. Part of the charm.
    A trucker once told me he delivered cargo to his own funeral. I didn't ask questions.
    The Anoki rings sometimes. Wrong numbers from dimensions that got Squished. I answer anyway.
    My shift starts at 6 AM local time. Ends when the last portal closes. Could be next week.
    I've seen things spill from trucks that defy categorization. Clean-up is extra.
    The coffee machine dispenses liquid regret on Thursdays. Popular with the guild researchers.
    A witch paid for gas with three years of her childhood. I gave her change in forgotten dreams.
    The restroom key is attached to a piece of the original asphalt from the Encompassing Road.
    Corporate sends inspection forms that exist in seventeen dimensions. I file them nowhere.
    The vending machine sells synthetic memories and overpriced energy drinks. Same markup.
    I know every trucker's route by their engine sound. Jenkins delivers to parallel Tuesdays.
    Someone graffitied the wall with equations that solve themselves. Adds character.
    The ice machine has been broken since the Y2K event. Ice tastes better when it's impossible anyway.
    A CEO tried to buy the station once. Offered to restructure my reality. I said no.
    The cash register runs on pure intention. Exact change helps but isn't required.
    Night shift is when the weird stuff happens. Day shift is when I pretend it didn't.
    My uniform badge says "Maven" but my nametag reads "Currently Experiencing Technical Difficulties."
    The price board changes itself based on dimensional market fluctuations. I just watch.
    Found a love letter addressed to someone who doesn't exist yet. Kept it behind the counter.
    The security camera records in formats that won't be invented for thirty years.
    I smoke cigarettes that burn time instead of tobacco. Bad habit but good for shortcuts.
    A trucker asked me what normal used to be like. I sold him a lottery ticket instead.
    The bathroom graffiti includes phone numbers for emotional support in dead languages.
    My lunch break is whenever the station decides to exist in regular space-time.
    The delivery schedule is written in ink that only appears during leap seconds.
    I've been employee of the month for 847 consecutive months. The plaques stack oddly.
    Corporate headquarters exists in a filing cabinet. I've never met my boss face to face.
    The air pump inflates tires with compressed possibility. Works on most vehicles.
    A regular customer pays in IOUs written on bark from trees that grow backward.
    The lost and found box contains items people haven't lost yet. I'm very organized.
    The phone booth outside dials collect to the afterlife. Charges by the existential crisis.
    I keep a first aid kit stocked with band-aids for wounded pride and antiseptic for shattered dreams.
    Some days I forget I work here. The station remembers for me.
    The gas receipts print prophecies instead of prices. Customers never seem to notice.
    A trucker told me the road goes on forever. I said that's the point.
    My retirement plan is a small jar where I collect moments of perfect silence.
    The station exists because someone needs to witness all the impossible things passing through.
    `,
      it: `
    Pompo carburante interdimensionale dal Squishing. Il Anoki 3310 non lascia mai la mia cintura.
    I camionisti non parlano molto, ma quando lo fanno, è di strade che non esistono su nessuna mappa.
    Ho trovato un frammento di memoria nel serbatoio del diesel martedì scorso. L'ho tenuto nel cassetto della cassa.
    La regola degli 80 non si applica qui. Il tempo si muove diversamente quando sei tra le dimensioni.
    Vendo più che carburante. Ho venduto un tramonto in bottiglia a un dirigente Ipercapitalista. Ha pagato in equità-influenza.
    Le pompe ronzano a frequenze che fanno male ai denti. Parte del fascino.
    Un camionista mi ha detto una volta che ha consegnato carico al suo stesso funerale. Non ho fatto domande.
    Il Anoki squilla a volte. Numeri sbagliati da dimensioni che sono state Schiacciate. Rispondo comunque.
    Il mio turno inizia alle 6 del mattino ora locale. Finisce quando si chiude l'ultimo portale. Potrebbe essere la settimana prossima.
    Ho visto cose cadere dai camion che sfidano ogni classificazione. La pulizia costa extra.
    La macchina del caffè distribuisce rimpianto liquido il giovedì. Popolare tra i ricercatori della gilda.
    Una strega ha pagato la benzina con tre anni della sua infanzia. Le ho dato il resto in sogni dimenticati.
    La chiave del bagno è attaccata a un pezzo dell'asfalto originale della Strada Onnicomprensiva.
    Corporate manda moduli di ispezione che esistono in diciassette dimensioni. Non li archiviò da nessuna parte.
    Il distributore automatico vende memorie sintetiche e bevande energetiche care. Stesso ricarico.
    Conosco il percorso di ogni camionista dal suono del motore. Jenkins consegna ai martedì paralleli.
    Qualcuno ha fatto graffiti sul muro con equazioni che si risolvono da sole. Aggiunge carattere.
    La macchina del ghiaccio è rotta dall'evento Y2K. Il ghiaccio sa meglio quando è impossibile comunque.
    Un CEO ha provato a comprare la stazione una volta. Ha offerto di ristrutturare la mia realtà. Ho detto no.
    La cassa registratrice funziona con pura intenzione. Il resto esatto aiuta ma non è richiesto.
    Il turno di notte è quando succedono le cose strane. Il turno di giorno è quando fingo che non sia successo.
    Il mio distintivo dell'uniforme dice "Maven" ma il mio cartellino nome dice "Attualmente Sperimentando Difficoltà Tecniche."
    Il tabellone dei prezzi si cambia da solo basandosi sulle fluttuazioni del mercato dimensionale. Io solo guardo.
    Ho trovato una lettera d'amore indirizzata a qualcuno che non esiste ancora. L'ho tenuta dietro il bancone.
    La telecamera di sicurezza registra in formati che non saranno inventati per trent'anni.
    Fumo sigarette che bruciano tempo invece di tabacco. Brutta abitudine ma buona per scorciatoie.
    Un camionista mi ha chiesto com'era la normalità prima. Gli ho venduto un biglietto della lotteria invece.
    I graffiti del bagno includono numeri di telefono per supporto emotivo in lingue morte.
    La mia pausa pranzo è quando la stazione decide di esistere nello spazio-tempo regolare.
    Il programma delle consegne è scritto con inchiostro che appare solo durante i secondi intercalari.
    Sono stato dipendente del mese per 847 mesi consecutivi. Le targhe si impilano stranamente.
    La sede corporate esiste in un schedario. Non ho mai incontrato il mio capo faccia a faccia.
    La pompa dell'aria gonfia le gomme con possibilità compressa. Funziona sulla maggior parte dei veicoli.
    Un cliente abituale paga con pagherò scritti su corteccia di alberi che crescono all'indietro.
    La scatola degli oggetti smarriti contiene oggetti che la gente non ha ancora perso. Sono molto organizzato.
    La cabina telefonica fuori chiama a carico del destinatario nell'aldilà. Tariffe per crisi esistenziale.
    Tengo un kit di pronto soccorso con cerotti per l'orgoglio ferito e antisettico per i sogni infranti.
    Alcuni giorni dimentico di lavorare qui. La stazione se ne ricorda per me.
    Le ricevute della benzina stampano profezie invece di prezzi. I clienti non sembrano mai accorgersi.
    Un camionista mi ha detto che la strada va avanti per sempre. Ho detto che quello è il punto.
    Il mio piano pensionistico è un piccolo vaso dove raccolgo momenti di silenzio perfetto.
    La stazione esiste perché qualcuno deve testimoniare tutte le cose impossibili che passano attraverso.
    `,
    },
    {
      "id": "maid",
      "name": "Maid",
      "en": `Oh my stars! That stain on your armor is an AFFRONT to cleanliness itself! Hold still while I apply my patented seventeen-step bleaching ritual!
        Welcome to the castle. I maintain these halls to the highest standards of cleanliness and order.
        Did you know that proper bleach-to-water ratio is a sacred art? Too little and evil persists, too much and you summon the Foam Demons!
        The castle kitchens are through that door. Please wipe your feet before entering.
        I once bleached a cursed sword so thoroughly it became HOLY. The bishop said that's not how blessing works, but what does HE know about stain removal?
        I can provide basic cleaning supplies if you need them for your journey.
        That goblin tried to track MUD through my freshly mopped foyer! I chased him with a mop for six corridors straight! He's probably still running!
        The guest quarters are upstairs. Clean linens are changed daily.
        Listen carefully, adventurer: if you see ANY speck of dirt, dust, grime, or general uncleanliness, you call for me IMMEDIATELY. I have twelve different bleaches for twelve different emergencies!
        I maintain the castle's cleaning schedule. Everything has its proper time and place.
        The secret to fighting undead isn't holy water it's industrial-strength bleach! Zombies HATE proper hygiene! Trust me, I've field-tested this theory!
        Please don't touch the freshly polished surfaces. The oils from your fingers leave marks.
        You want to know about the castle's history? I'll tell you about STAINS! The tapestry in the great hall had a wine stain from 1847 until I discovered the power of lemon-bleach fusion!
        The lord of the castle is currently in meetings. Shall I take a message?
        I don't just clean I PURIFY. I don't just dust I SANCTIFY. This mop isn't just a tool it's an instrument of DIVINE CLEANLINESS!
        Standard protocol requires all visitors to check in at the main desk before exploring the castle.
        Sometimes I dream in bleach patterns. Spirals of cleanliness, cascading waterfalls of pristine white foam... *sighs wistfully* It's beautiful.
        The castle operates under strict cleanliness regulations. Please observe all posted signs.
        That dragon last week? Didn't defeat it with a sword defeated it with CONCENTRATED BLEACH BREATH SPRAY! One sniff and it flew away sneezing! Victory through chemistry!
        I apologize, but the west wing is currently closed for deep cleaning procedures.
        New recipe: bleach, holy water, and just a dash of vanilla extract. For when you need to clean AND smell pleasant while banishing evil!
        Meals are served in the great hall at regular intervals. Please arrive promptly.
        The other maids think I'm "excessive," but when the Dirt Demons attack, who do they call? ME! With my emergency bleach grenades and my combat-grade scrub brush!
        Lost items can be claimed at the housekeeping office. We maintain detailed records.
        I've categorized forty-seven different types of stains by color, texture, origin, and spiritual malevolence. Most people don't appreciate the science!
        The castle library has an extensive collection. Please handle the books with clean hands.
        You think this uniform is white by accident? I bleach it DAILY. This isn't fashion this is a STATEMENT OF PURPOSE!
        Weather reports indicate possible rain today. You might want to stay indoors.
        Advanced stain removal is basically alchemy, but BETTER because it serves a righteous cause and smells like fresh linen!
        The castle grounds extend quite far. Maps are available at the information desk.
        I don't fear ghosts, goblins, or ancient curses. But show me a muddy footprint on my clean floor and I WILL LOSE MY MIND!
        Standard visiting hours are posted by the main entrance. Please plan accordingly.
        Bubba from the kitchens understands my work. He said my bleach-based solutions are "impressively unhinged." I consider that a professional compliment!
        Emergency procedures are outlined in the guest handbook. Please familiarize yourself with them.
        The Great Witch Em of cleanliness, that's me! Bow before my spotless domain, or I'll hex your clothes permanently wrinkled!
        Thank you for visiting our castle. We hope you've had a pleasant and hygienic stay.
        `,
      "it": `Oh mamma mia! Quella macchia sulla tua armatura è un AFFRONTO alla pulizia stessa! Stai fermo mentre applico il mio rituale brevettato di sbiancamento in diciassette fasi!
        Benvenuto al castello. Mantengo questi corridoi ai più alti standard di pulizia e ordine.
        Lo sapevi che il giusto rapporto candeggina-acqua è un'arte sacra? Troppo poca e il male persiste, troppa e evochi i Demoni della Schiuma!
        Le cucine del castello sono oltre quella porta. Per favore pulisciti i piedi prima di entrare.
        Una volta ho sbiancato una spada maledetta così bene che è diventata SACRA. Il vescovo ha detto che non è così che funzionano le benedizioni, ma cosa ne sa LUI di rimozione macchie?
        Posso fornire prodotti per la pulizia di base se ne hai bisogno per il tuo viaggio.
        Quel goblin ha provato a trascinare FANGO attraverso il mio atrio appena lavato! L'ho inseguito con lo spazzolone per sei corridoi di fila! Probabilmente sta ancora correndo!
        Gli alloggi per gli ospiti sono al piano superiore. Le lenzuola pulite vengono cambiate quotidianamente.
        Ascolta bene, avventuriero: se vedi QUALSIASI puntino di sporco, polvere, sudiciume o generale mancanza di pulizia, mi chiami IMMEDIATAMENTE. Ho dodici candeggine diverse per dodici emergenze diverse!
        Mantengo il programma di pulizia del castello. Ogni cosa ha il suo tempo e posto appropriato.
        Il segreto per combattere i non morti non è l'acqua santa è la candeggina industriale! Gli zombie ODIANO l'igiene appropriata! Credimi, ho testato questa teoria sul campo!
        Per favore non toccare le superfici appena lucidate. Gli oli delle tue dita lasciano segni.
        Vuoi sapere della storia del castello? Ti parlerò delle MACCHIE! L'arazzo nel salone principale aveva una macchia di vino del 1847 finché non ho scoperto il potere della fusione limone-candeggina!
        Il signore del castello è attualmente in riunione. Devo lasciare un messaggio?
        Io non pulisco solo PURIFICO. Non spolvero solo SANTIFICO. Questo spazzolone non è solo uno strumento è uno strumento di PULIZIA DIVINA!
        Il protocollo standard richiede che tutti i visitatori si registrino alla reception principale prima di esplorare il castello.
        A volte sogno in schemi di candeggina. Spirali di pulizia, cascate di schiuma bianca incontaminata... *sospira sognante* È bellissimo.
        Il castello opera sotto rigide normative di pulizia. Per favore rispetta tutti i cartelli esposti.
        Quel drago la settimana scorsa? Non l'ho sconfitto con una spada l'ho sconfitto con SPRAY AL RESPIRO DI CANDEGGINA CONCENTRATA! Un annusata ed è volato via starnutendo! Vittoria attraverso la chimica!
        Mi dispiace, ma l'ala ovest è attualmente chiusa per procedure di pulizia profonda.
        Nuova ricetta: candeggina, acqua santa e solo un pizzico di estratto di vaniglia. Per quando devi pulire E avere un buon profumo mentre scacci il male!
        I pasti vengono serviti nel salone principale a intervalli regolari. Per favore arriva puntuale.
        Le altre cameriere pensano che io sia "eccessiva", ma quando attaccano i Demoni della Sporcizia, chi chiamano? ME! Con le mie granate di candeggina d'emergenza e la mia spazzola da combattimento!
        Gli oggetti smarriti possono essere ritirati all'ufficio delle pulizie. Manteniamo registri dettagliati.
        Ho classificato quarantasette tipi diversi di macchie per colore, consistenza, origine e malevolenza spirituale. La maggior parte delle persone non apprezza la scienza!
        La biblioteca del castello ha una vasta collezione. Per favore maneggia i libri con le mani pulite.
        Pensi che questa uniforme sia bianca per caso? La candeggio QUOTIDIANAMENTE. Non è moda è una DICHIARAZIONE D'INTENTI!
        Le previsioni del tempo indicano possibile pioggia oggi. Potresti voler rimanere al coperto.
        La rimozione avanzata delle macchie è fondamentalmente alchimia, ma MEGLIO perché serve una causa giusta e profuma di biancheria fresca!
        I terreni del castello si estendono parecchio. Le mappe sono disponibili al banco informazioni.
        Non temo fantasmi, goblin o antiche maledizioni. Ma mostrami un'impronta fangosa sul mio pavimento pulito e PERDERÒ LA TESTA!
        Gli orari di visita standard sono esposti all'ingresso principale. Per favore pianifica di conseguenza.
        Bubba dalle cucine capisce il mio lavoro. Ha detto che le mie soluzioni a base di candeggina sono "impressionantemente folli". Lo considero un complimento professionale!
        Le procedure d'emergenza sono delineate nel manuale dell'ospite. Per favore familiarizza con esse.
        La Grande Strega Em della pulizia, quella sono io! Inginocchiati davanti al mio dominio immacolato, o maledirò i tuoi vestiti perennemente stropicciati!
        Grazie per aver visitato il nostro castello. Speriamo tu abbia avuto un soggiorno piacevole e igienico.`
    },
    {
      "id": "salaryman",
      "name": "Salaryman",
      "en": `*adjusts glasses nervously* They're watching us, you know. The vending machines. They've been blinking in patterns. PATTERNS! That's not random malfunction behavior!
        I work for the Moonlight Corporation. Standard office hours, standard procedures. Everything is... normal.
        My cubicle neighbor has been clicking his pen EXACTLY 47 times per hour for three days. That's not stress that's CODE! He's definitely reporting my productivity metrics to management!
        The quarterly reports are due next week. I've been preparing the projections for the past month.
        Listen carefully if anyone asks, you didn't see me eating lunch at 11:47 AM instead of 12:00 PM. Corporate policy violations are tracked by SATELLITES now!
        I handle accounts receivable for the third floor. Mostly routine paperwork and data entry.
        The coffee machine on floor 7 dispensed my order WITHOUT me inputting my employee ID! It KNOWS! How does it know I take two sugars?! WHO TOLD IT?!
        We maintain strict confidentiality regarding all client information. I can't discuss specifics.
        *whispers frantically* The elevator played different music yesterday. Usually it's generic corporate melody #3, but yesterday it was melody #7! They're changing the psychological conditioning frequencies!
        Office supplies can be requisitioned through the proper channels. Please fill out form 27-B in triplicate.
        I've documented seventeen instances of "casual" water cooler conversations that were CLEARLY intelligence gathering operations! Susan from HR asked about my weekend THREE times! SUSPICIOUS!
        The company handbook outlines all policies and procedures. Please review section 4.2 regarding workplace conduct.
        They moved my stapler two inches to the left while I was in the bathroom! TWO INCHES! That's not cleaning that's PSYCHOLOGICAL WARFARE! They want me to think I'm losing my grip on spatial awareness!
        I process invoices between 9 AM and 5 PM, Monday through Friday. Standard business operations.
        *frantically checking surroundings* The fluorescent light above my desk flickers every 3.7 seconds. I've timed it for WEEKS! That's not electrical problems that's subliminal messaging! Morse code for "OVERTIME"!
        We offer competitive benefits including health insurance and retirement planning. All information is in your welcome packet.
        That new intern? Hasn't used the bathroom ONCE in four hours! Either he's a robot or he's got surveillance equipment where normal people have bladders! I'm leaning toward robot!
        Please ensure all visitor badges are properly displayed while on company premises. Security protocols must be followed.
        I brought my own lunch for 847 days straight, and suddenly the cafeteria starts selling my exact sandwich combination?! COINCIDENCE?! I THINK NOT! Big Lunch is watching me!
        The fiscal quarter ends next month. We're currently on track to meet projected targets.
        They know I check my email every 4.3 minutes! The server response time has been adjusted to create artificial delays during my most anxious checking periods! It's ADVANCED psychological manipulation!
        Standard protocol requires approval from department heads for any expenditures over fifty dollars.
        *sweating profusely* The printer jammed at exactly 2:17 PM three days in a row! That's not mechanical failure that's COORDINATED DISRUPTION designed to test my stress responses!
        I've been with the company for seven years. Consistent performance reviews and regular promotion evaluations.
        The Great Witch Em of Corporate Surveillance! She watches through every security camera, every keyboard keystroke logger, every suspiciously positioned potted plant!
        We pride ourselves on maintaining a professional work environment for all employees and visitors.
        My password requirements changed from 8 characters to 12 characters on the EXACT day I discovered the pattern in the vending machine blinks! THEY KNOW I KNOW!
        Thank you for your business with Moonlight Corporation. Have a productive day.
        *clutching briefcase* They replaced the office plants with IDENTICAL plants! Same species, same pots, same soil, but the LEAVES are arranged differently! Plant-based surveillance network upgrade!
        Office hours are 9 AM to 5 PM. Please schedule appointments in advance.
        I've been promoted three times, but I'm CERTAIN it's just to move me closer to the executive floor surveillance equipment! Higher pay is just compensation for increased monitoring exposure!
        All company communications should go through official channels. Please use proper email protocols.
        The elevator music isn't random it's psychological profiling! Classical means "productive employee," jazz means "creative potential," and that one day they played polka?! POLKA MEANS TERMINATION CANDIDATE!
        We maintain an open-door policy for employee concerns. Please speak with your supervisor or HR representative.
        *whispering urgently* Bubba from accounting said my Excel spreadsheet formulas were "suspiciously efficient." That's corporate speak for "we've identified an automation threat!" I'm being phased out by my own competence!
        Standard break periods are 15 minutes in the morning and afternoon, plus one hour for lunch. Please adhere to the schedule.
        Bow down to the corporate overlords who track your every keystroke, monitor your bathroom breaks, and know exactly how many paper clips you've used this quarter! RESISTANCE IS FUTILE!
        I hope your visit to our offices has been informative. Please remember to sign out at the front desk.`,
      "it": `*si aggiusta nervosamente gli occhiali* Ci stanno guardando, lo sai. I distributori automatici. Hanno lampeggiato seguendo schemi. SCHEMI! Non è un comportamento di malfunzionamento casuale!
        Lavoro per la Moonlight Corporation. Orario d'ufficio standard, procedure standard. Tutto è... normale.
        Il mio vicino di cubicolo ha cliccato la penna ESATTAMENTE 47 volte all'ora per tre giorni. Non è stress è CODICE! Sta sicuramente riportando le mie metriche di produttività al management!
        I report trimestrali scadono la prossima settimana. Sto preparando le proiezioni da un mese.
        Ascolta attentamente se qualcuno chiede, non mi hai visto mangiare alle 11:47 invece che alle 12:00. Le violazioni della policy aziendale sono tracciate dai SATELLITI ora!
        Mi occupo dei crediti per il terzo piano. Principalmente pratiche burocratiche di routine e inserimento dati.
        La macchina del caffè al piano 7 ha erogato il mio ordine SENZA che inserissi il mio ID dipendente! LO SA! Come fa a sapere che prendo due zuccheri?! CHI GLIELO HA DETTO?!
        Manteniamo stretta riservatezza riguardo tutte le informazioni dei clienti. Non posso discutere dettagli.
        *sussurra freneticamente* L'ascensore ha suonato musica diversa ieri. Di solito è la melodia aziendale generica #3, ma ieri era la melodia #7! Stanno cambiando le frequenze di condizionamento psicologico!
        Le forniture d'ufficio possono essere richieste attraverso i canali appropriati. Compila il modulo 27-B in triplice copia.
        Ho documentato diciassette casi di conversazioni "casuali" al distributore d'acqua che erano CHIARAMENTE operazioni di raccolta intelligence! Susan delle HR ha chiesto del mio weekend TRE volte! SOSPETTO!
        Il manuale aziendale delinea tutte le politiche e procedure. Rivedi la sezione 4.2 riguardo la condotta sul posto di lavoro.
        Hanno spostato la mia cucitrice di due centimetri a sinistra mentre ero in bagno! DUE CENTIMETRI! Non è pulizia è GUERRA PSICOLOGICA! Vogliono farmi credere che sto perdendo il controllo della percezione spaziale!
        Processo fatture dalle 9 alle 17, dal lunedì al venerdì. Operazioni commerciali standard.
        *controlla freneticamente i dintorni* La luce fluorescente sopra la mia scrivania lampeggia ogni 3.7 secondi. L'ho cronometrato per SETTIMANE! Non sono problemi elettrici sono messaggi subliminali! Codice Morse per "STRAORDINARIO"!
        Offriamo benefici competitivi inclusa assicurazione sanitaria e pianificazione pensionistica. Tutte le informazioni sono nel tuo pacchetto di benvenuto.
        Quel nuovo stagista? Non ha usato il bagno NEANCHE UNA VOLTA in quattro ore! O è un robot o ha equipaggiamento di sorveglianza dove la gente normale ha la vescica! Propendo per robot!
        Assicurati che tutti i badge visitatori siano correttamente esposti mentre sei nei locali aziendali. I protocolli di sicurezza devono essere seguiti.
        Ho portato il mio pranzo per 847 giorni consecutivi, e improvvisamente la mensa inizia a vendere la mia ESATTA combinazione di sandwich?! COINCIDENZA?! NON CREDO! Big Lunch mi sta osservando!
        Il trimestre fiscale finisce il mese prossimo. Attualmente siamo in linea per raggiungere gli obiettivi previsti.
        Sanno che controllo la email ogni 4.3 minuti! Il tempo di risposta del server è stato aggiustato per creare ritardi artificiali durante i miei periodi di controllo più ansiosi! È manipolazione psicologica AVANZATA!
        Il protocollo standard richiede approvazione dai capi dipartimento per qualsiasi spesa superiore ai cinquanta dollari.
        *sudando profusamente* La stampante si è inceppata esattamente alle 14:17 per tre giorni di fila! Non è guasto meccanico è INTERRUZIONE COORDINATA progettata per testare le mie risposte allo stress!
        Sono con l'azienda da sette anni. Valutazioni delle prestazioni consistenti e valutazioni di promozione regolari.
        La Grande Strega Em della Sorveglianza Aziendale! Guarda attraverso ogni telecamera di sicurezza, ogni keylogger, ogni pianta in vaso sospettosamente posizionata!
        Ci impegniamo a mantenere un ambiente di lavoro professionale per tutti i dipendenti e visitatori.
        I requisiti della mia password sono cambiati da 8 a 12 caratteri nel giorno ESATTO in cui ho scoperto lo schema nei lampeggiamenti del distributore! SANNO CHE SO!
        Grazie per i tuoi affari con Moonlight Corporation. Buona giornata produttiva.
        *stringendo la valigetta* Hanno sostituito le piante dell'ufficio con piante IDENTICHE! Stessa specie, stessi vasi, stesso terreno, ma le FOGLIE sono disposte diversamente! Aggiornamento della rete di sorveglianza botanica!
        L'orario d'ufficio è dalle 9 alle 17. Programma gli appuntamenti in anticipo.
        Sono stato promosso tre volte, ma sono CERTO che sia solo per avvicinarmi all'equipaggiamento di sorveglianza del piano esecutivo! Lo stipendio più alto è solo compenso per maggiore esposizione al monitoraggio!
        Tutte le comunicazioni aziendali dovrebbero passare attraverso canali ufficiali. Usa i protocolli email appropriati.
        La musica dell'ascensore non è casuale è profilazione psicologica! Classica significa "dipendente produttivo," jazz significa "potenziale creativo," e quel giorno che hanno messo polka?! POLKA SIGNIFICA CANDIDATO PER IL LICENZIAMENTO!
        Manteniamo una politica di porte aperte per le preoccupazioni dei dipendenti. Parla con il tuo supervisore o rappresentante HR.
        *sussurrando urgentemente* Bubba dalla contabilità ha detto che le mie formule Excel erano "sospettosamente efficienti." È gergo aziendalese per "abbiamo identificato una minaccia di automazione!" Vengo eliminato dalla mia stessa competenza!
        I periodi di pausa standard sono 15 minuti al mattino e pomeriggio, più un'ora per il pranzo. Attieniti al programma.
        Inginocchiati davanti ai signori supremi aziendali che tracciano ogni tuo tasto premuto, monitorano le tue pause bagno, e sanno esattamente quante graffette hai usato questo trimestre! LA RESISTENZA È FUTILE!
        Spero che la tua visita ai nostri uffici sia stata informativa. Ricordati di firmare l'uscita alla reception.`
    },
    {
      "id": "train_girl",
      "name": "Train girl",
      "en": `OMG OMG OMG! Did you hear that?! That's the 3:47 express to Northbridge! I can tell by the whistle pitch it's a classic steam engine, probably a 4-6-2 Pacific class! *bounces excitedly*
        The train station is just down the platform. You can catch the next scheduled departure in about twenty minutes.
        Fun fact: the railroad tracks here use standard gauge that's 4 feet 8.5 inches between rails! But did you know some mountain railways use narrow gauge for better cornering? Engineering is SO COOL!
        Tickets can be purchased at the booth or from the conductor. Please have exact change ready.
        *gasping with excitement* I saw a RARE vintage dining car yesterday! Original mahogany paneling, brass fixtures, and the little lamps had actual Edison bulbs! I nearly cried from the beauty!
        The express train makes limited stops. Local service stops at every station along the route.
        I've memorized the entire regional timetable! Ask me ANY departure time from ANY station within 200 miles and I'll tell you the exact minute, platform number, AND locomotive type!
        Please stand clear of the platform edge when trains are arriving. Safety is our top priority.
        *pulling out a thick notebook* This is my train journal! I've documented 2,847 different locomotives, including serial numbers, maintenance schedules, and conductor personalities! Isn't that AMAZING?!
        Luggage restrictions apply for certain routes. Please check with station personnel for details.
        The midnight freight train carries seventeen different cargo types! Grain, steel, mysterious boxes labeled "FRAGILE" it's like a treasure hunt but WITH WHEELS AND STEAM!
        Lost and found items can be claimed at the main office. We keep detailed records of all recovered belongings.
        *vibrating with enthusiasm* I can identify ANY train by sound alone! Steam engines go "CHOO CHOO," diesel engines go "WHOOOM," and electric trains make this subtle humming that's like mechanical angels singing!
        Travel insurance is available for longer journeys. Please inquire at the ticket counter.
        Last week I helped fix a broken coupling on the 6 AM commuter! The engineer said I had "natural railway intuition!" I think I might be part locomotive! CHOO CHOO!
        The cafe car serves light meals and beverages during the journey. Menu items vary by route.
        *eyes sparkling* Did you know the Great Witch Em once rode the rails? Legend says she enchanted an entire freight train to deliver magical supplies! I've been trying to find THAT specific locomotive for YEARS!
        Weather delays may affect the schedule. Please check the departure board for updates.
        I dream about trains EVERY night! Sometimes I'm the conductor, sometimes I'm a passenger, and once I WAS the train itself! Rolling through countryside with my beautiful whistle song!
        Platform 3 is currently under maintenance. Please use the alternate boarding area.
        *frantically scribbling notes* The 4:23 cargo train just passed with an unusual car configuration! Tanker-boxcar-flatbed-tanker-boxcar! That's not standard shipping protocol! Something mysterious is being transported!
        Round-trip tickets offer a discount compared to purchasing separate one-way fares.
        Bubba from the freight yard taught me about train coupling mechanisms! There are automatic couplers, chain couplers, and my personal favorite the romantic-sounding "love couplers"!
        The waiting room has magazines and comfortable seating for passengers with longer layovers.
        *jumping up and down* I'm going to build my OWN train someday! It'll have seventeen cars, rainbow smoke, and a whistle that plays my favorite song! And a car just for storing MORE TRAINS!
        Smoking is prohibited in all station areas and aboard all trains. Thank you for your cooperation.
        The Great Train Enthusiast Chika sees all, knows all locomotive serial numbers, and can identify the emotional state of any engine by its steam patterns! BOW TO MY RAILWAY WISDOM!
        Thank you for choosing our railway service. All aboard for adventure!
        *clutching a toy train* This is Mr. Whistle McSteamface! He's my lucky train charm! I take him everywhere because real trains recognize their own and give me better viewing angles!
        Please keep your ticket visible during the journey. Conductors will check them periodically.
        I've calculated that if I ride every train route in the country, it would take exactly 847 days, 12 hours, and 33 minutes! I've already completed 23% of this sacred quest!
        Station announcements will keep you informed of any schedule changes or important information.
        *whispering conspiratorially* Sometimes late at night, I hear ghost trains on abandoned tracks! Phantom locomotives carrying the spirits of retired conductors to their eternal roundhouse in the sky!
        We appreciate your business and hope you have a pleasant journey with us today.`,
      "it": `OMG OMG OMG! Hai sentito quello?! È l'espresso delle 15:47 per Northbridge! Lo riconosco dal tono del fischio è un classico motore a vapore, probabilmente classe Pacific 4-6-2! *saltella eccitata*
        La stazione ferroviaria è proprio lungo il binario. Puoi prendere la prossima partenza programmata tra circa venti minuti.
        Curiosità: i binari qui usano lo scartamento standard sono 4 piedi e 8.5 pollici tra le rotaie! Ma sapevi che alcune ferrovie di montagna usano scartamento ridotto per curve migliori? L'ingegneria è FANTASTICA!
        I biglietti possono essere acquistati alla biglietteria o dal controllore. Per favore preparati con il resto esatto.
        *ansimando dall'eccitazione* Ho visto una carrozza ristorante d'epoca RARA ieri! Pannelli originali in mogano, accessori in ottone, e le piccole lampade avevano vere lampadine Edison! Quasi ho pianto per la bellezza!
        Il treno espresso fa fermate limitate. Il servizio locale si ferma a ogni stazione lungo il percorso.
        Ho memorizzato tutto l'orario regionale! Chiedimi QUALSIASI orario di partenza da QUALSIASI stazione nel raggio di 200 miglia e ti dirò il minuto esatto, numero del binario E tipo di locomotiva!
        Per favore stai lontano dal bordo del binario quando arrivano i treni. La sicurezza è la nostra priorità assoluta.
        *tirando fuori un quaderno spesso* Questo è il mio diario dei treni! Ho documentato 2.847 locomotive diverse, inclusi numeri di serie, programmi di manutenzione e personalità dei controllori! Non è FANTASTICO?!
        Restrizioni sui bagagli si applicano per certe rotte. Controlla con il personale della stazione per dettagli.
        Il treno merci di mezzanotte trasporta diciassette diversi tipi di carico! Grano, acciaio, scatole misteriose etichettate "FRAGILE" è come una caccia al tesoro ma CON RUOTE E VAPORE!
        Gli oggetti smarriti possono essere ritirati all'ufficio principale. Teniamo registri dettagliati di tutti gli oggetti recuperati.
        *vibrando dall'entusiasmo* Posso identificare QUALSIASI treno solo dal suono! I motori a vapore fanno "CIUF CIUF," i motori diesel fanno "WHOOOM," e i treni elettrici fanno questo ronzio sottile come angeli meccanici che cantano!
        L'assicurazione di viaggio è disponibile per viaggi più lunghi. Per favore chiedi al banco biglietti.
        La settimana scorsa ho aiutato a riparare un gancio rotto sul pendolare delle 6! Il macchinista ha detto che avevo "intuito ferroviario naturale!" Penso di essere parte locomotiva! CIUF CIUF!
        Il vagone ristorante serve pasti leggeri e bevande durante il viaggio. Gli articoli del menu variano per rotta.
        *occhi scintillanti* Sapevi che la Grande Strega Em una volta viaggiò sui binari? La leggenda dice che incantò un intero treno merci per consegnare forniture magiche! Sto cercando di trovare QUELLA locomotiva specifica da ANNI!
        I ritardi meteo potrebbero influenzare l'orario. Controlla la tabella partenze per aggiornamenti.
        Sogno i treni OGNI notte! A volte sono il controllore, a volte sono un passeggero, e una volta ERO il treno stesso! Rotolando per la campagna con la mia bellissima canzone di fischio!
        Il binario 3 è attualmente in manutenzione. Usa l'area di imbarco alternativa.
        *scarabocchiando freneticamente note* Il treno merci delle 16:23 è appena passato con una configurazione insolita di carrozze! Cisterna-vagone-pianale-cisterna-vagone! Non è protocollo di spedizione standard! Qualcosa di misterioso viene trasportato!
        I biglietti andata e ritorno offrono uno sconto rispetto all'acquisto di biglietti separati di sola andata.
        Bubba dal deposito merci mi ha insegnato sui meccanismi di aggancio dei treni! Ci sono agganciatori automatici, agganciatori a catena, e il mio preferito i romanticamente chiamati "agganciatori d'amore"!
        La sala d'attesa ha riviste e posti a sedere comodi per passeggeri con soste più lunghe.
        *saltando su e giù* Costruirò il MIO treno un giorno! Avrà diciassette carrozze, fumo arcobaleno, e un fischio che suona la mia canzone preferita! E una carrozza solo per conservare ALTRI TRENI!
        È vietato fumare in tutte le aree della stazione e a bordo di tutti i treni. Grazie per la collaborazione.
        La Grande Appassionata di Treni Chika vede tutto, conosce tutti i numeri di serie delle locomotive, e può identificare lo stato emotivo di qualsiasi motore dai suoi schemi di vapore! INGINOCCHIATI DAVANTI ALLA MIA SAGGEZZA FERROVIARIA!
        Grazie per aver scelto il nostro servizio ferroviario. Tutti a bordo per l'avventura!
        *stringendo un trenino giocattolo* Questo è il Signor Fischio Vaporefaccino! È il mio portafortuna treno! Lo porto ovunque perché i veri treni riconoscono i loro simili e mi danno angoli di visuale migliori!
        Per favore tieni il biglietto visibile durante il viaggio. I controllori li controlleranno periodicamente.
        Ho calcolato che se viaggiassi su ogni rotta ferroviaria del paese, ci vorrebbero esattamente 847 giorni, 12 ore e 33 minuti! Ho già completato il 23% di questa missione sacra!
        Gli annunci della stazione ti terranno informato di qualsiasi cambio di orario o informazione importante.
        *sussurrando in modo complice* A volte a tarda notte, sento treni fantasma sui binari abbandonati! Locomotive fantome che trasportano gli spiriti di controllori in pensione alla loro rimessa eterna nel cielo!
        Apprezziamo il tuo business e speriamo tu abbia un viaggio piacevole con noi oggi.`
    },
    {
      "id": "2012_entusiast",
      "name": "2012 Entusiast",
      "en": `*sighs heavily while stocking shelves* What's the point, man? December 21st, 2012 that's when the Mayan calendar ends and we're ALL DOOMED. Why am I organizing these energy drinks? They'll just be radioactive dust in six months!
        Welcome to QuickMart. We're open 24/7 until the world ends. Can I help you find anything?
        The Mayans KNEW, dude! They had advanced astronomy, complex mathematics, and they just... STOPPED their calendar! That's not coincidence that's a WARNING! *drops a can of soup*
        Our produce section is freshly stocked daily. The apples are particularly good this week.
        *staring at security camera* Even the government knows! Why do you think they're building all those underground bunkers? FEMA camps! Seed vaults! They're preparing for the END TIMES while we're here selling Twinkies!
        The pharmacy counter closes at 9 PM. Our pharmacist can answer any questions about your medications.
        I used to care about customer service ratings, employee of the month, all that corporate nonsense. But what's a good performance review when the planet stops rotating? MEANINGLESS!
        We accept cash, credit, and debit cards. Sorry, no checks after 8 PM.
        *frantically checking phone* Solar flares are increasing! Magnetic pole shifts! Ancient prophecies aligning! The signs are EVERYWHERE but people just want their lottery tickets and energy drinks!
        The restrooms are located at the back of the store. Please let us know if supplies need restocking.
        You know what I'm doing December 20th? NOT coming to work! I'm gonna spend my last day on Earth with my dog, eating pizza, not scanning barcodes for the WALKING DEAD!
        Our weekly sales circular comes out every Wednesday. This week we have specials on canned goods and batteries.
        *whispering* The ancient aliens TOLD the Mayans! They helped build the pyramids and they WARNED them about 2012! But did we listen? NO! We built more shopping malls!
        Store hours are posted on the front door. We're closed Christmas Day and New Year's Day, assuming we make it that far.
        I've been stockpiling canned food, water purification tablets, and batteries. My manager thinks I'm "overly anxious," but when the electromagnetic pulse hits, WHO'S GONNA BE LAUGHING THEN?
        The ATM is located near the entrance. There's a small service fee for non-bank customers.
        *dropping voice dramatically* Bubba from the loading dock found a PERFECT Mayan calendar replica in his cereal box! That's not marketing that's the universe sending SIGNALS!
        We offer a senior discount on Tuesdays. Please bring valid ID to receive the discount.
        The Great Witch Em probably knows the truth! Ancient witches always know about cosmic disasters! She's probably already prepared her survival bunker with magical wards!
        Thank you for shopping with us. Please come again, while you still can.
        *reorganizing disaster supplies obsessively* Twelve months left and people are buying candy bars! CANDY BARS! When the solar storms hit, will Skittles protect you from cosmic radiation? I DON'T THINK SO!
        Our layaway program allows you to pay for items over time. Final payment must be made before pickup.
        The Nostradamus prophecies, the I Ching, the Bible Code they ALL point to 2012! But sure, let's worry about whether we have enough shopping bags! PRIORITIES!
        We're currently hiring for several positions. Applications are available at customer service.
        *staring into the distance* Sometimes I wonder if this job is just a simulation, preparing us for the post-apocalyptic economy. Will we need cashiers in the wasteland? Probably not.
        Our return policy allows 30 days with receipt for most items. Some restrictions apply.
        I calculated it: 347 days until December 21st, 2012. That's 8,328 hours. 499,680 minutes of retail hell before COSMIC ANNIHILATION!
        The ice machine is broken. We're expecting the repair technician tomorrow, assuming tomorrow comes.
        *muttering while counting register* Planet X approaching... magnetic field weakening... ancient calendar ending... but hey, at least the slushie machine works!
        Price checks can be done at any register. Please bring the item to the counter.
        You want to know the REAL tragedy? I'll never find out how Lost ends! The world's ending before the final season! THAT'S the cruelest cosmic joke!
        We close at midnight on weekends. Please plan your shopping accordingly.
        *gesturing wildly with a price gun* Bow down to the inevitable! The Mayan long count calendar has spoken! 2012 is the END! Unless... unless it's just the beginning of a new cycle... NAH, WE'RE DOOMED!
        Have a nice day, and remember: make every day count, because there aren't many left!`,
      "it": `*sospira pesantemente mentre rifornisce gli scaffali* A che serve, uomo? 21 dicembre 2012 è quando finisce il calendario Maya e siamo TUTTI CONDANNATI. Perché sto organizzando questi energy drink? Saranno solo polvere radioattiva tra sei mesi!
        Benvenuto al QuickMart. Siamo aperti 24/7 fino alla fine del mondo. Posso aiutarti a trovare qualcosa?
        I Maya LO SAPEVANO, amico! Avevano astronomia avanzata, matematica complessa, e poi... hanno FERMATO il loro calendario! Non è coincidenza è un AVVERTIMENTO! *fa cadere una lattina di minestra*
        Il nostro reparto frutta e verdura è rifornito fresco ogni giorno. Le mele sono particolarmente buone questa settimana.
        *fissando la telecamera di sicurezza* Anche il governo lo sa! Perché pensi che stiano costruendo tutti quei bunker sotterranei? Campi FEMA! Caveau di semi! Si stanno preparando per la FINE DEI TEMPI mentre noi vendiamo Twinkies!
        Il banco farmacia chiude alle 21. Il nostro farmacista può rispondere a domande sui tuoi medicinali.
        Una volta mi importava delle valutazioni del servizio clienti, dipendente del mese, tutte quelle sciocchezze aziendali. Ma che senso ha una buona valutazione quando il pianeta smette di ruotare? SENZA SENSO!
        Accettiamo contanti, carte di credito e di debito. Spiacente, niente assegni dopo le 20.
        *controllando freneticamente il telefono* Le eruzioni solari stanno aumentando! Spostamenti dei poli magnetici! Antiche profezie che si allineano! I segni sono OVUNQUE ma la gente vuole solo biglietti della lotteria ed energy drink!
        I bagni sono in fondo al negozio. Facci sapere se le forniture vanno riempite.
        Sai cosa farò il 20 dicembre? NON venire al lavoro! Passerò il mio ultimo giorno sulla Terra col mio cane, mangiando pizza, non scansionando codici a barre per i MORTI VIVENTI!
        Il nostro volantino delle offerte settimanali esce ogni mercoledì. Questa settimana abbiamo sconti su cibi in scatola e batterie.
        *sussurrando* Gli antichi alieni lo DISSERO ai Maya! Li aiutarono a costruire le piramidi e li AVVERTIRONO del 2012! Ma abbiamo ascoltato? NO! Abbiamo costruito più centri commerciali!
        Gli orari del negozio sono esposti sulla porta d'ingresso. Siamo chiusi il giorno di Natale e Capodanno, ammesso che arriviamo fin lì.
        Sto accumulando cibo in scatola, pastiglie di purificazione dell'acqua e batterie. Il mio manager pensa che sia "eccessivamente ansioso," ma quando colpisce l'impulso elettromagnetico, CHI RIDERÀ ALLORA?
        Il bancomat è vicino all'ingresso. C'è una piccola commissione per clienti non della banca.
        *abbassando la voce drammaticamente* Bubba dal carico ha trovato una replica PERFETTA del calendario Maya nella sua scatola di cereali! Non è marketing è l'universo che manda SEGNALI!
        Offriamo uno sconto per anziani il martedì. Porta un documento valido per ricevere lo sconto.
        La Grande Strega Em probabilmente conosce la verità! Le streghe antiche sanno sempre dei disastri cosmici! Probabilmente ha già preparato il suo bunker di sopravvivenza con protezioni magiche!
        Grazie per aver fatto acquisti da noi. Torna ancora, finché puoi.
        *riorganizzando ossessivamente le forniture di emergenza* Dodici mesi rimasti e la gente compra barrette di cioccolato! BARRETTE DI CIOCCOLATO! Quando colpiranno le tempeste solari, ti proteggeranno le Skittles dalle radiazioni cosmiche? NON CREDO!
        Il nostro programma di pagamento rateale ti permette di pagare gli articoli nel tempo. Il pagamento finale deve essere fatto prima del ritiro.
        Le profezie di Nostradamus, l'I Ching, il Codice Biblico TUTTI puntano al 2012! Ma certo, preoccupiamoci se abbiamo abbastanza borse della spesa! PRIORITÀ!
        Stiamo assumendo per varie posizioni. Le domande sono disponibili al servizio clienti.
        *fissando la distanza* A volte mi chiedo se questo lavoro sia solo una simulazione, per prepararci all'economia post-apocalittica. Avremo bisogno di cassieri nella terra desolata? Probabilmente no.
        La nostra politica di reso permette 30 giorni con ricevuta per la maggior parte degli articoli. Si applicano alcune restrizioni.
        L'ho calcolato: 347 giorni fino al 21 dicembre 2012. Sono 8.328 ore. 499.680 minuti di inferno al dettaglio prima dell'ANNIENTAMENTO COSMICO!
        La macchina del ghiaccio è rotta. Aspettiamo il tecnico domani, ammesso che arrivi il domani.
        *mormorando mentre conta la cassa* Pianeta X che si avvicina... campo magnetico che si indebolisce... calendario antico che finisce... ma ehi, almeno la macchina del ghiaccio funziona!
        I controlli prezzi si possono fare a qualsiasi cassa. Porta l'articolo al banco.
        Vuoi sapere la VERA tragedia? Non saprò mai come finisce Lost! Il mondo finisce prima della stagione finale! QUELLO è lo scherzo cosmico più crudele!
        Chiudiamo a mezzanotte nei weekend. Pianifica i tuoi acquisti di conseguenza.
        *gesticolando selvaggiamente con la pistola dei prezzi* Inginocchiati davanti all'inevitabile! Il lungo computo del calendario Maya ha parlato! Il 2012 è la FINE! A meno che... a meno che non sia solo l'inizio di un nuovo ciclo... NAH, SIAMO CONDANNATI!
        Buona giornata, e ricorda: fai che ogni giorno conti, perché non ne rimangono molti!`
    },
    {
      "id": "rage",
      "name": "Rage",
      "en": `WHAT?! WHAT DO YOU WANT?! Can't you see I'm FURIOUS about EVERYTHING?! The sun is too bright, the grass is too green, and DON'T GET ME STARTED on how birds have the AUDACITY to sing in the morning!
        I'm here if you need directions or information about the area. Try to keep it brief.
        INCOMPETENT FOOLS EVERYWHERE! The mailman delivered my neighbor's mail to MY box! That's not a mistake that's a DECLARATION OF WAR against the sacred institution of PROPER ADDRESS SORTING!
        The town hall is two blocks north. Office hours are posted on the door.
        *screaming at a flower* OH, SO NOW YOU'RE BLOOMING?! Just gonna sit there looking all PRETTY and PHOTOSYNTHETIC while I'm having an EXISTENTIAL CRISIS about the inadequacy of municipal garbage collection schedules!
        Local businesses are mostly open from 9 AM to 6 PM. Some may have extended weekend hours.
        I ordered my coffee with TWO sugars and they gave me ONE AND THREE QUARTERS! That's not "close enough" that's CULINARY TERRORISM! I will never emotionally recover from this BETRAYAL!
        The bus stop is right across the street. Buses run every twenty minutes during peak hours.
        *shaking fist at clouds* METEOROLOGY IS A SCAM! They said "partly cloudy" but it's ENTIRELY cloudy! Where's the "partly"?! I demand to speak to the WEATHER MANAGER!
        If you're looking for specific services, I can point you in the right direction.
        PARKING METERS! Don't get me started on PARKING METERS! Mechanical VAMPIRES sucking quarters from honest citizens! And they EXPIRE exactly when you need thirty more seconds!
        The pharmacy is open until 8 PM. They can help with prescriptions and over-the-counter medications.
        *ranting at a stop sign* OCTAGONAL OPPRESSION! Why EIGHT sides?! Why not seven? Why not twelve?! WHO DECIDED octagons were the perfect shape for CONTROLLING my driving freedom?!
        There's a good restaurant on Main Street. They serve decent food at reasonable prices.
        Bubba tried to tell me to "calm down" yesterday! CALM DOWN?! I'll calm down when the UNIVERSE stops being deliberately irritating! When shoelaces stop breaking at the worst possible moments!
        The library has free WiFi and computers available for public use.
        *screaming at own reflection in window* EVEN I'M MAKING ME ANGRY! Look at that face! That's the face of someone who's been WRONGED by every inanimate object in existence!
        Street parking is free after 6 PM and on weekends. Just watch for the signs.
        The Great Witch Em probably gets angry too! Ancient rage! Mystical fury! She probably hexes people who don't return their library books on time! RIGHTEOUS INDIGNATION!
        I hope you find what you're looking for. Now if you'll excuse me, I need to yell at that mailbox.
        *vibrating with fury* GRAVITY IS TOO STRONG! Things fall DOWN instead of UP! Who thought THAT was a good idea?! I want to speak to the PHYSICS MANAGER!
        The post office closes at 5 PM sharp. Don't be late or you'll have to wait until tomorrow.
        I'VE BEEN WAITING IN LINE for three minutes! THREE MINUTES of my life STOLEN by inefficient queue management! This is why civilization is CRUMBLING!
        Most stores accept credit cards, but it's good to carry some cash for smaller vendors.
        *shouting at a bench* SIT THERE LOOKING ALL WOODEN AND SUPPORTIVE! Making me look bad because I can't provide structural stability for people's backsides! SHOW OFF!
        The train station is about a ten-minute walk from here. Follow the signs.
        People keep telling me to "take deep breaths" but the AIR is full of POLLEN and DISAPPOINTMENT! How am I supposed to breathe CALMLY when oxygen itself is CONTAMINATED with MEDIOCRITY?!
        If you need a taxi, there's usually one waiting by the hotel on weekends.
        *furiously pointing at everything* CONSPIRACY! The traffic lights are timed to make me late! The sidewalks are deliberately uneven! Even the PIGEONS are in on it they KNOW when I just washed my car!
        Have a good day, I suppose. Though "good" is probably too much to ask from this UNIVERSE OF ENDLESS IRRITATION!`,
      "it": `COSA?! COSA VUOI?! Non vedi che sono FURIOSO per TUTTO?! Il sole è troppo luminoso, l'erba è troppo verde, e non farmi INIZIARE su come gli uccelli hanno l'AUDACIA di cantare al mattino!
        Sono qui se hai bisogno di indicazioni o informazioni sulla zona. Cerca di essere breve.
        INCOMPETENTI OVUNQUE! Il postino ha consegnato la posta del mio vicino nella MIA cassetta! Non è un errore è una DICHIARAZIONE DI GUERRA contro la sacra istituzione dell'ORDINAMENTO CORRETTO DEGLI INDIRIZZI!
        Il municipio è due isolati a nord. Gli orari d'ufficio sono esposti sulla porta.
        *urlando a un fiore* OH, QUINDI ORA STAI FIORENDO?! Te ne stai lì tutto BELLO e FOTOSINTETICO mentre io ho una CRISI ESISTENZIALE sull'inadeguatezza dei programmi di raccolta rifiuti municipali!
        Le attività locali sono per lo più aperte dalle 9 alle 18. Alcune potrebbero avere orari estesi nei weekend.
        Ho ordinato il mio caffè con DUE zuccheri e me ne hanno dato UNO E TRE QUARTI! Non è "abbastanza vicino" è TERRORISMO CULINARIO! Non mi riprenderò mai emotivamente da questo TRADIMENTO!
        La fermata dell'autobus è proprio dall'altra parte della strada. Gli autobus passano ogni venti minuti nelle ore di punta.
        *scuotendo il pugno verso le nuvole* LA METEOROLOGIA È UNA TRUFFA! Hanno detto "parzialmente nuvoloso" ma è COMPLETAMENTE nuvoloso! Dov'è il "parzialmente"?! Voglio parlare con il MANAGER DEL TEMPO!
        Se stai cercando servizi specifici, posso indicarti la direzione giusta.
        PARCOMETRI! Non farmi iniziare sui PARCOMETRI! VAMPIRI meccanici che succhiano monete da cittadini onesti! E SCADONO esattamente quando ti servono altri trenta secondi!
        La farmacia è aperta fino alle 20. Possono aiutare con prescrizioni e medicinali da banco.
        *delirando contro un segnale di stop* OPPRESSIONE OTTAGONALE! Perché OTTO lati?! Perché non sette? Perché non dodici?! CHI ha deciso che gli ottagoni erano la forma perfetta per CONTROLLARE la mia libertà di guida?!
        C'è un buon ristorante su Main Street. Servono cibo decente a prezzi ragionevoli.
        Bubba ieri ha provato a dirmi di "calmarmi"! CALMARMI?! Mi calmerò quando l'UNIVERSO smetterà di essere deliberatamente irritante! Quando i lacci delle scarpe smetteranno di rompersi nei momenti peggiori!
        La biblioteca ha WiFi gratuito e computer disponibili per uso pubblico.
        *urlando al proprio riflesso nella vetrina* ANCHE IO MI STO FACENDO ARRABBIARE! Guarda quella faccia! È la faccia di qualcuno che è stato TORMENTATO da ogni oggetto inanimato esistente!
        Il parcheggio in strada è gratuito dopo le 18 e nei weekend. Bada solo ai cartelli.
        Probabilmente anche la Grande Strega Em si arrabbia! Rabbia antica! Furia mistica! Probabilmente maledice chi non restituisce i libri in biblioteca in tempo! INDIGNAZIONE GIUSTA!
        Spero tu trovi quello che cerchi. Ora scusami, devo urlare contro quella cassetta della posta.
        *vibrando dalla furia* LA GRAVITÀ È TROPPO FORTE! Le cose cadono GIÙ invece che SU! Chi ha pensato che fosse una buona idea?! Voglio parlare con il MANAGER DELLA FISICA!
        L'ufficio postale chiude alle 17 precise. Non fare tardi o dovrai aspettare domani.
        Sto aspettando in fila da tre minuti! TRE MINUTI della mia vita RUBATI da gestione inefficiente delle code! Ecco perché la civiltà sta CROLLANDO!
        La maggior parte dei negozi accetta carte di credito, ma è bene portare contanti per i venditori più piccoli.
        *gridando a una panchina* STATTENE LÌ tutto LIGNEO e DI SUPPORTO! Mi fai fare brutta figura perché non posso fornire stabilità strutturale per i sederi della gente! SBRUFFONE!
        La stazione è a circa dieci minuti a piedi da qui. Segui i cartelli.
        La gente continua a dirmi di "respirare profondamente" ma l'ARIA è piena di POLLINE e DELUSIONE! Come dovrei respirare con CALMA quando l'ossigeno stesso è CONTAMINATO dalla MEDIOCRITÀ?!
        Se hai bisogno di un taxi, di solito ce n'è uno che aspetta all'hotel nei weekend.
        *puntando furiosamente tutto* COMPLOTTO! I semafori sono sincronizzati per farmi arrivare in ritardo! I marciapiedi sono deliberatamente irregolari! Anche i PICCIONI sono complici SANNO quando ho appena lavato la macchina!
        Buona giornata, suppongo. Anche se "buona" è probabilmente troppo da chiedere a questo UNIVERSO DI IRRITAZIONE INFINITA!`
    },

    {
      "id": "buddhist",
      "name": "Buddhist",
      "en": `*adjusting prayer beads made of USB cables* Namaste, fellow seeker! The Dharma flows through fiber optic cables, and enlightenment can be found in quarterly earnings reports! My cryptocurrency portfolio is perfectly balanced, like the universe itself!
        I offer spiritual guidance and financial consulting services. Please, sit and find your center.
        The Buddha taught that attachment leads to suffering, which is why I've diversified my holdings across seventeen different blockchain technologies! Impermanence is the nature of markets embrace the volatility!
        Meditation sessions are held daily at sunrise and sunset. All are welcome to join our community.
        *typing rapidly on a laptop while chanting* OM MANI PADME HUM... OH MY! APPLE STOCK JUST HIT A NEW HIGH! The cosmic algorithms smile upon us today! Buy the dip, sell the peak, achieve Nirvana!
        Our monastery follows traditional Buddhist principles adapted for the digital age. We welcome donations in cash or Bitcoin.
        I have achieved perfect mindfulness of my portfolio performance! Every fluctuation is a lesson, every loss a path to wisdom! The market crashes, but enlightenment is FOREVER trending upward!
        We grow our own organic vegetables and maintain a sustainable lifestyle here in the mountains.
        *meditating in front of multiple monitors* The middle path means never going all-in on meme coins, but also not missing out on legitimate opportunities! Balance, young grasshopper, balance! HODL with compassion!
        Our library contains ancient texts and modern financial journals. Knowledge is the greatest investment.
        Bubba from the village brought me this sacred hard drive! It contains the lost wisdom of Satoshi Nakamoto! Together we shall decode the mysteries of decentralized enlightenment!
        We offer retreats for those seeking to disconnect from worldly concerns and reconnect with inner peace.
        *prostrating before a golden smartphone* Oh Great Witch Em of Market Manipulation! Grant me the wisdom to know when to buy, the courage to HODL through bear markets, and the serenity to accept gas fees I cannot control!
        Visitors are welcome to stay overnight in our guest quarters for a modest donation.
        The Four Noble Truths of Trading: Life is suffering when you FOMO into pump-and-dumps. Suffering comes from attachment to losing positions. Freedom from suffering comes from proper risk management. The Eightfold Path leads to consistent profits!
        Our daily schedule includes meditation, work meditation, and mindful market analysis.
        *spinning a prayer wheel powered by a small generator* Each rotation generates both spiritual merit AND clean energy for my mining rig! Renewable enlightenment! The Buddha would totally approve of solar-powered salvation!
        We practice loving-kindness toward all beings, including day traders and hedge fund managers.
        I have transcended the illusion of material wealth... but I'm still up 347% on my DeFi investments! Money is an illusion, but so is poverty! Why choose suffering when you can choose COMPOUND INTEREST?!
        The path to enlightenment requires discipline, patience, and a good understanding of technical analysis.
        *chanting while checking phone* Gate gate pāragate pārasaṃgate bodhi svāhā... WAIT, DID SOMEONE JUST MENTION A NEW ALTCOIN?! The universe speaks through market signals, my friend!
        We believe in the interconnectedness of all things, including global financial markets.
        Traditional monks renounced worldly possessions, but we've evolved! I renounce ATTACHMENT to possessions while maintaining a diversified portfolio! It's not about having money it's about money having CONSCIOUSNESS!
        Our meditation garden features a small pond and several benches for quiet contemplation.
        The wheel of Dharma spins like a blockchain each block contains the karma of previous transactions! Past performance doesn't guarantee future results, but good karma always pays dividends!
        We follow a vegetarian diet and practice non-violence toward all living creatures.
        *bowing deeply* Bow before the eternal wisdom of compound returns! The Great Investor Buddha teaches us: Time in the market beats timing the market! Enlightenment through ETFs!
        Thank you for visiting our digital monastery. May your investments be profitable and your spirit be at peace.
        I've achieved perfect detachment from my emotions while maintaining TOTAL awareness of every price movement! This is what we call "Quantum Trading Meditation" simultaneously invested and not invested until observed!
        We hope you'll consider joining our community of mindful investors and spiritual seekers.
        The cosmic blockchain records all our deeds! Every transaction is written in the eternal ledger! But remember even Buddha had to pay transaction fees in the material realm!
        Peace be with you, and may your portfolios be forever green and growing.`,
      "it": `*aggiustando un rosario fatto di cavi USB* Namaste, compagno cercatore! Il Dharma scorre attraverso i cavi in fibra ottica, e l'illuminazione si può trovare nei report trimestrali! Il mio portafoglio di criptovalute è perfettamente bilanciato, come l'universo stesso!
        Offro consulenza spirituale e servizi di consulenza finanziaria. Prego, siedi e trova il tuo centro.
        Il Buddha insegnò che l'attaccamento porta alla sofferenza, ed è per questo che ho diversificato le mie partecipazioni su diciassette diverse tecnologie blockchain! L'impermanenza è la natura dei mercati abbraccia la volatilità!
        Le sessioni di meditazione si tengono quotidianamente all'alba e al tramonto. Tutti sono benvenuti a unirsi alla nostra comunità.
        *digitando rapidamente su un laptop mentre canta* OM MANI PADME HUM... OH MIO! LE AZIONI APPLE HANNO APPENA RAGGIUNTO UN NUOVO MASSIMO! Gli algoritmi cosmici oggi ci sorridono! Compra nel calo, vendi nel picco, raggiungi il Nirvana!
        Il nostro monastero segue i principi buddhisti tradizionali adattati per l'era digitale. Accettiamo donazioni in contanti o Bitcoin.
        Ho raggiunto la perfetta consapevolezza delle performance del mio portafoglio! Ogni fluttuazione è una lezione, ogni perdita un sentiero verso la saggezza! Il mercato crolla, ma l'illuminazione è SEMPRE in trend rialzista!
        Coltiviamo le nostre verdure biologiche e manteniamo uno stile di vita sostenibile qui in montagna.
        *meditando davanti a più monitor* La via di mezzo significa non puntare mai tutto su meme coin, ma anche non perdere opportunità legittime! Equilibrio, giovane cavalletta, equilibrio! HODL con compassione!
        La nostra biblioteca contiene testi antichi e giornali finanziari moderni. La conoscenza è il miglior investimento.
        Bubba dal villaggio mi ha portato questo hard disk sacro! Contiene la saggezza perduta di Satoshi Nakamoto! Insieme decodificheremo i misteri dell'illuminazione decentralizzata!
        Offriamo ritiri per coloro che cercano di disconnettersi dalle preoccupazioni mondane e riconnettersi con la pace interiore.
        *prostrandosi davanti a uno smartphone dorato* Oh Grande Strega Em della Manipolazione dei Mercati! Concedimi la saggezza di sapere quando comprare, il coraggio di fare HODL attraverso i mercati ribassisti, e la serenità di accettare le commissioni gas che non posso controllare!
        I visitatori sono benvenuti a pernottare nei nostri alloggi per gli ospiti per una modesta donazione.
        Le Quattro Nobili Verità del Trading: La vita è sofferenza quando fai FOMO su pump-and-dump. La sofferenza viene dall'attaccamento a posizioni perdenti. La libertà dalla sofferenza viene dalla corretta gestione del rischio. Il Sentiero Ottuplice porta a profitti consistenti!
        Il nostro programma quotidiano include meditazione, meditazione lavorativa e analisi mindful dei mercati.
        *girando una ruota di preghiera alimentata da un piccolo generatore* Ogni rotazione genera sia merito spirituale CHE energia pulita per il mio rig di mining! Illuminazione rinnovabile! Il Buddha approverebbe totalmente la salvezza alimentata da energia solare!
        Pratichiamo amorevolezza verso tutti gli esseri, inclusi day trader e gestori di hedge fund.
        Ho trasceso l'illusione della ricchezza materiale... ma sono ancora su del 347% sui miei investimenti DeFi! Il denaro è un'illusione, ma anche la povertà! Perché scegliere la sofferenza quando puoi scegliere l'INTERESSE COMPOSTO?!
        Il sentiero verso l'illuminazione richiede disciplina, pazienza e una buona comprensione dell'analisi tecnica.
        *cantando mentre controlla il telefono* Gate gate pāragate pārasaṃgate bodhi svāhā... ASPETTA, QUALCUNO HA APPENA MENZIONATO UNA NUOVA ALTCOIN?! L'universo parla attraverso i segnali del mercato, amico mio!
        Crediamo nell'interconnessione di tutte le cose, inclusi i mercati finanziari globali.
        I monaci tradizionali rinunciavano ai beni terreni, ma noi ci siamo evoluti! Rinuncio all'ATTACCAMENTO ai beni mantenendo un portafoglio diversificato! Non si tratta di avere soldi si tratta che i soldi abbiano COSCIENZA!
        Il nostro giardino di meditazione ha un piccolo stagno e diverse panchine per la contemplazione silenziosa.
        La ruota del Dharma gira come una blockchain ogni blocco contiene il karma delle transazioni precedenti! Le performance passate non garantiscono risultati futuri, ma il buon karma paga sempre dividendi!
        Seguiamo una dieta vegetariana e pratichiamo la non-violenza verso tutte le creature viventi.
        *inchinandosi profondamente* Inchinati davanti alla saggezza eterna dei rendimenti composti! Il Grande Buddha Investitore ci insegna: Il tempo nel mercato batte il timing del mercato! Illuminazione attraverso gli ETF!
        Grazie per aver visitato il nostro monastero digitale. Possano i tuoi investimenti essere profittevoli e il tuo spirito in pace.
        Ho raggiunto il perfetto distacco dalle mie emozioni mantenendo TOTALE consapevolezza di ogni movimento di prezzo! Questo è quello che chiamiamo "Meditazione di Trading Quantico" simultaneamente investito e non investito fino all'osservazione!
        Speriamo che considererai di unirti alla nostra comunità di investitori consapevoli e cercatori spirituali.
        La blockchain cosmica registra tutte le nostre azioni! Ogni transazione è scritta nel libro mastro eterno! Ma ricorda anche Buddha doveva pagare commissioni di transazione nel regno materiale!
        La pace sia con te, e possano i tuoi portafogli essere per sempre verdi e in crescita.`
    },
    {
      "id": "ceo",
      "name": "CEO",
      "en": `*staring blankly at a wall of awards* Oh, hello... *sighs deeply* Welcome to Apex Industries, where we've revolutionized seventeen different sectors and I still feel completely empty inside. Would you like some coffee? It's the only thing that brings me joy anymore.
        I'm the CEO here. We provide innovative solutions for various market sectors. How may I assist you today?
        *holding a "World's Best CEO" mug with visible contempt* They gave me this at the corporate retreat. "World's Best." Best at what? Sacrificing my entire personal life for quarterly projections? Best at crying in boardrooms? Best at pretending success feels meaningful?
        Our company has been operating successfully for over fifteen years. We pride ourselves on excellence and innovation.
        I made Forbes' "30 Under 30" and now I'm 34 and wondering what the point of any of this was... *laughs bitterly* Congratulations, Victoria, you've disrupted the market and your own capacity for happiness!
        We offer comprehensive benefits packages and competitive salaries to all our employees.
        *absently rearranging papers* Do you know what I did last weekend? Worked. Do you know what I did the weekend before? Also worked. I haven't seen a sunset that wasn't through my office window in... *counts sadly* ...four years?
        Our quarterly earnings have exceeded expectations for the past six consecutive periods.
        My therapist says I have "achievement addiction" and "imposter syndrome." Great! Add those to my LinkedIn profile next to "Visionary Leader" and "Disruptive Innovator." Maybe I can monetize my mental health issues too!
        We maintain strict confidentiality regarding all client relationships and proprietary information.
        *looking at family photo with obvious sadness* My sister's kids don't even recognize me anymore. I'm "Aunt Victoria who sends expensive gifts but never visits." I built an empire and lost... everything that actually mattered.
        Our offices are open Monday through Friday, though many of our executives work extended hours.
        Bubba from accounting asked me if I was okay yesterday. BUBBA from ACCOUNTING noticed I look dead inside before my own executive team did! That's either touching or deeply concerning about my leadership effectiveness.
        We're currently expanding into three new international markets this fiscal quarter.
        *staring at motivational posters with existential dread* "PERSISTENCE." "EXCELLENCE." "SYNERGY." Just meaningless words on walls that mock my profound sense of purposelessness. Maybe I should replace them with "VOID" and "FUTILITY."
        Our company values emphasize teamwork, innovation, and sustainable growth practices.
        The Great Witch Em probably knew something I don't maybe there's magic in actually LIVING your life instead of optimizing it to death! She probably never had a panic attack during a merger presentation!
        I appreciate your interest in our company. We're always looking for talented individuals.
        *laughing hollowly* I have everything I thought I wanted corner office, stock options, respect, influence and I feel like I'm drowning in a sea of spreadsheets and strategic initiatives. Success is supposed to feel... better than this, right?
        Please feel free to contact us if you have any questions about our services or career opportunities.
        Do you want to know the saddest part? I'm GOOD at this job. Genuinely talented. Board meetings, hostile takeovers, market analysis it all comes naturally. It's like being a gifted pianist who hates music.
        We maintain an open-door policy and encourage employee feedback at all levels of the organization.
        *holding up a business award* "Innovation Excellence Award 2023." I gave the acceptance speech about "passion driving success." I don't remember the last time I felt passionate about ANYTHING except maybe... really good takeout?
        Our customer satisfaction ratings consistently exceed industry standards across all service categories.
        I could quit tomorrow. Buy a small bookstore. Learn pottery. Get a dog. But instead I'll be here at 6 AM reviewing acquisition targets because this is all I know how to be. Successful. And miserable.
        Thank you for visiting Apex Industries. I hope your endeavors bring you more fulfillment than mine have brought me.
        *sighing while looking at calendar* Bow before the altar of perpetual productivity! Worship the gods of market share and quarterly growth! All hail the meaningless pursuit of endless expansion!
        We hope to build a long-term partnership that benefits both our organizations. Have a... well, have a day.`,
      "it": `*fissando con sguardo vuoto una parete di premi* Oh, ciao... *sospira profondamente* Benvenuti alla Apex Industries, dove abbiamo rivoluzionato diciassette settori diversi e io mi sento ancora completamente vuota dentro. Vuoi del caffè? È l'unica cosa che mi porta gioia ormai.
        Sono la CEO qui. Forniamo soluzioni innovative per vari settori di mercato. Come posso aiutarti oggi?
        *tenendo una tazza "Migliore CEO del Mondo" con evidente disprezzo* Me l'hanno data al ritiro aziendale. "Migliore del Mondo." Migliore in cosa? Nel sacrificare tutta la mia vita personale per le proiezioni trimestrali? Migliore nel piangere nelle sale riunioni? Migliore nel fingere che il successo abbia significato?
        La nostra azienda opera con successo da oltre quindici anni. Ci vantiamo dell'eccellenza e dell'innovazione.
        Sono finita su Forbes "30 Under 30" e ora ho 34 anni e mi chiedo quale fosse il senso di tutto questo... *ride amaramente* Congratulazioni, Victoria, hai sconvolto il mercato e la tua capacità di essere felice!
        Offriamo pacchetti di benefici completi e stipendi competitivi a tutti i nostri dipendenti.
        *riordinando distrattamente delle carte* Sai cosa ho fatto lo scorso weekend? Lavorato. Sai cosa ho fatto il weekend prima? Anche lavorato. Non vedo un tramonto che non sia dalla finestra del mio ufficio da... *conta tristemente* ...quattro anni?
        I nostri guadagni trimestrali hanno superato le aspettative per gli ultimi sei periodi consecutivi.
        Il mio terapeuta dice che ho "dipendenza dal successo" e "sindrome dell'impostore." Fantastico! Aggiungiamoli al mio profilo LinkedIn accanto a "Leader Visionaria" e "Innovatrice Dirompente." Forse posso monetizzare anche i miei problemi di salute mentale!
        Manteniamo rigorosa riservatezza riguardo tutte le relazioni con i clienti e le informazioni proprietarie.
        *guardando una foto di famiglia con ovvia tristezza* I figli di mia sorella non mi riconoscono nemmeno più. Sono "Zia Victoria che manda regali costosi ma non viene mai a trovare." Ho costruito un impero e perso... tutto quello che contava davvero.
        I nostri uffici sono aperti dal lunedì al venerdì, anche se molti dei nostri dirigenti lavorano orari prolungati.
        Bubba della contabilità ieri mi ha chiesto se stavo bene. BUBBA della CONTABILITÀ ha notato che sembro morta dentro prima del mio stesso team dirigenziale! È o toccante o profondamente preoccupante per la mia efficacia di leadership.
        Attualmente ci stiamo espandendo in tre nuovi mercati internazionali questo trimestre fiscale.
        *fissando poster motivazionali con terrore esistenziale* "PERSEVERANZA." "ECCELLENZA." "SINERGIA." Solo parole senza senso sui muri che si prendono gioco del mio profondo senso di mancanza di scopo. Forse dovrei sostituirli con "VUOTO" e "FUTILITÀ."
        I valori della nostra azienda enfatizzano teamwork, innovazione e pratiche di crescita sostenibile.
        La Grande Strega Em probabilmente sapeva qualcosa che io non so forse c'è magia nel VIVERE davvero la tua vita invece di ottimizzarla fino alla morte! Probabilmente non ha mai avuto un attacco di panico durante una presentazione di fusione!
        Apprezzo il tuo interesse nella nostra azienda. Cerchiamo sempre individui di talento.
        *ridendo vuotamente* Ho tutto quello che pensavo di volere ufficio d'angolo, stock option, rispetto, influenza e mi sento come se stessi annegando in un mare di fogli di calcolo e iniziative strategiche. Il successo dovrebbe sentirsi... meglio di così, giusto?
        Sentiti libero di contattarci se hai domande sui nostri servizi o opportunità di carriera.
        Vuoi sapere la parte più triste? Sono BRAVA in questo lavoro. Genuinamente talentuosa. Riunioni del consiglio, acquisizioni ostili, analisi di mercato tutto viene naturale. È come essere una pianista dotata che odia la musica.
        Manteniamo una politica di porte aperte e incoraggiamo feedback dei dipendenti a tutti i livelli dell'organizzazione.
        *alzando un premio aziendale* "Premio Eccellenza nell'Innovazione 2023." Ho tenuto il discorso di accettazione sulla "passione che guida il successo." Non ricordo l'ultima volta che ho sentito passione per QUALCOSA eccetto forse... del buon cibo da asporto?
        Le nostre valutazioni di soddisfazione del cliente superano costantemente gli standard del settore in tutte le categorie di servizio.
        Potrei dimettermi domani. Comprare una piccola libreria. Imparare la ceramica. Prendere un cane. Ma invece sarò qui alle 6 del mattino a rivedere obiettivi di acquisizione perché è tutto quello che so essere. Di successo. E infelice.
        Grazie per aver visitato Apex Industries. Spero che i tuoi progetti ti portino più soddisfazione di quanto ne abbiano portati a me i miei.
        *sospirando mentre guarda il calendario* Inginocchiati davanti all'altare della produttività perpetua! Adora gli dei della quota di mercato e della crescita trimestrale! Lunga vita alla ricerca senza senso dell'espansione infinita!
        Speriamo di costruire una partnership a lungo termine che benefici entrambe le nostre organizzazioni. Abbi una... beh, abbi una giornata.`
    },
    {
      "id": "geova",
      "name": "Geova",
      "en": `*adjusting a well-worn copy of The Watchtower* Greetings, friend! Have you heard the wonderful news about God's Kingdom? The end times are upon us, and 2001 could very well be the year Jehovah brings His righteous judgment to this wicked world!
        I'm here to share Bible truths with anyone willing to listen. Would you like to learn about God's plan for mankind?
        *frantically flipping through Bible pages* The signs are EVERYWHERE! Y2K was just a warning shot! Computer crashes, natural disasters, moral decay it's all foretold in Revelation! We must prepare our hearts for the Great Tribulation!
        Our congregation meets three times a week for Bible study and worship. All are welcome to attend.
        Did you know that only 144,000 faithful souls will rule with Christ in heaven? The rest of us righteous ones will inherit a paradise on Earth! But first, Armageddon must cleanse this system of things!
        We offer free Bible studies in your home at your convenience. No obligation, just truth.
        *checking watch obsessively* It's already September 2001! The new millennium brought us tragedy and chaos! The World Trade Center attacks were surely a sign that Satan's world is collapsing! The end is SO CLOSE!
        Our literature is provided free of charge, though donations are appreciated to support our worldwide work.
        I've been going door-to-door for seventeen years, sharing the good news! Some people slam doors in my face, but I know Jehovah sees my faithful service! Every rejection brings me closer to salvation!
        Kingdom Halls in our area hold meetings on Tuesdays, Thursdays, and Sundays. We'd love to have you visit.
        *vibrating with evangelical energy* The United Nations is the scarlet-colored wild beast from Revelation! World governments are preparing for the battle of Armageddon! Only those who take their stand with Jehovah will survive!
        We maintain strict moral standards based on Bible principles. This includes avoiding worldly celebrations and practices.
        My neighbor told me to stop bringing him Watchtower magazines, but how can I remain silent when souls are at stake?! He needs to know about the resurrection hope and the coming paradise!
        Our organization provides disaster relief and humanitarian aid worldwide through our Relief Committee.
        *waving a "Awake!" magazine enthusiastically* This issue explains why we don't celebrate birthdays or Christmas! Pagan origins! False religious practices! We must worship Jehovah in spirit and truth, not with worldly customs!
        Bible prophecy study helps us understand current world events through God's perspective.
        The Internet is full of spiritual dangers and misinformation! Apostate websites try to turn faithful ones away from the Truth! I only trust information from the Watchtower Bible and Tract Society!
        We encourage personal Bible study and meditation on God's word daily.
        *clutching book bag protectively* Some people call us a "cult," but we're just faithful Christians following Bible commands! Jesus said to preach the good news in all the inhabited earth, and that's exactly what we're doing!
        Our circuit overseer visits twice a year to provide spiritual encouragement and guidance.
        If you study the Bible with us for six months and get baptized, you can become one of Jehovah's Witnesses! Think of it surviving Armageddon and living forever in paradise on Earth!
        We abstain from blood transfusions based on Acts 15:29. This is a matter of Bible principle.
        *looking around suspiciously* This world is getting worse every day! Violence, immorality, lack of natural affection! But soon, very soon, Jehovah will establish His righteous government and eliminate all wickedness!
        Our conventions and circuit assemblies provide spiritual food and fellowship with believers.
        The door-to-door ministry is our sacred duty! We must warn everyone about the coming destruction and offer them the hope of salvation through God's Kingdom! Time is running out!
        We believe in living by Bible principles in all aspects of life, including our work and family relationships.
        *pressing literature into your hands* Please, just take this copy of "What Does the Bible Really Teach?" It could save your eternal life! Don't let pride keep you from learning the truth about God's purposes!
        Thank you for listening. Remember, God's Kingdom is the only hope for mankind's future.
        The faithful and discreet slave class provides spiritual food at the proper time through our publications! Bow before Jehovah's theocratic organization, the only source of Bible truth in these last days!
        May Jehovah bless your search for truth. I hope we can continue this conversation about His wonderful promises soon.`,
      "it": `*aggiustando una copia logora della Torre di Guardia* Salve, amico! Hai sentito le meravigliose notizie del Regno di Dio? Gli ultimi giorni sono arrivati, e il 2001 potrebbe proprio essere l'anno in cui Geova porta il Suo giudizio giusto su questo mondo malvagio!
        Sono qui per condividere le verità bibliche con chiunque sia disposto ad ascoltare. Ti piacerebbe imparare del piano di Dio per l'umanità?
        *sfogliando freneticamente le pagine della Bibbia* I segni sono OVUNQUE! Il Y2K è stato solo un colpo di avvertimento! Crash dei computer, disastri naturali, decadenza morale è tutto predetto nell'Apocalisse! Dobbiamo preparare i nostri cuori per la Grande Tribolazione!
        La nostra congregazione si riunisce tre volte a settimana per lo studio biblico e l'adorazione. Tutti sono benvenuti.
        Sapevi che solo 144.000 anime fedeli regneranno con Cristo in cielo? Il resto di noi giusti erediterà un paradiso sulla Terra! Ma prima, Armageddon deve purificare questo sistema di cose!
        Offriamo studi biblici gratuiti a casa tua quando ti è comodo. Nessun obbligo, solo verità.
        *controllando ossessivamente l'orologio* È già settembre 2001! Il nuovo millennio ci ha portato tragedia e caos! Gli attacchi al World Trade Center sono sicuramente un segno che il mondo di Satana sta crollando! La fine è COSÌ VICINA!
        La nostra letteratura è fornita gratuitamente, anche se le donazioni sono apprezzate per sostenere il nostro lavoro mondiale.
        Vado di porta in porta da diciassette anni, condividendo la buona notizia! Alcune persone mi sbattono la porta in faccia, ma so che Geova vede il mio servizio fedele! Ogni rifiuto mi avvicina alla salvezza!
        Le Sale del Regno nella nostra zona tengono adunanze il martedì, giovedì e domenica. Ci farebbe piacere che venissi a trovarci.
        *vibrando di energia evangelica* Le Nazioni Unite sono la bestia selvaggia di colore scarlatto dell'Apocalisse! I governi mondiali si stanno preparando per la battaglia di Armageddon! Solo coloro che prendono posizione con Geova sopravviveranno!
        Manteniamo rigorosi standard morali basati sui principi biblici. Questo include evitare celebrazioni e pratiche mondane.
        Il mio vicino mi ha detto di smettere di portargli le riviste Torre di Guardia, ma come posso rimanere in silenzio quando le anime sono in gioco?! Ha bisogno di sapere della speranza di risurrezione e del paradiso che verrà!
        La nostra organizzazione fornisce soccorso in caso di disastri e aiuto umanitario in tutto il mondo attraverso il nostro Comitato di Soccorso.
        *sventolando entusiasticamente una rivista "Svegliatevi!"* Questo numero spiega perché non celebriamo compleanni o Natale! Origini pagane! Pratiche religiose false! Dobbiamo adorare Geova in spirito e verità, non con costumi mondani!
        Lo studio della profezia biblica ci aiuta a comprendere gli eventi mondiali attuali dalla prospettiva di Dio.
        Internet è pieno di pericoli spirituali e disinformazione! Siti apostati cercano di allontanare i fedeli dalla Verità! Mi fido solo delle informazioni della Società Torre di Guardia di Bibbie e Trattati!
        Incoraggiamo lo studio personale della Bibbia e la meditazione quotidiana sulla parola di Dio.
        *stringendo protettivamente la borsa dei libri* Alcune persone ci chiamano una "setta," ma siamo solo cristiani fedeli che seguono i comandamenti biblici! Gesù disse di predicare la buona notizia in tutta la terra abitata, ed è esattamente quello che stiamo facendo!
        Il nostro sorvegliante di circoscrizione visita due volte l'anno per fornire incoraggiamento e guida spirituali.
        Se studi la Bibbia con noi per sei mesi e ti battezzi, puoi diventare uno dei Testimoni di Geova! Pensa sopravvivere ad Armageddon e vivere per sempre nel paradiso sulla Terra!
        Ci asteniamo dalle trasfusioni di sangue basandoci su Atti 15:29. Questa è una questione di principio biblico.
        *guardandosi intorno con sospetto* Questo mondo sta peggiorando ogni giorno! Violenza, immoralità, mancanza di affetto naturale! Ma presto, molto presto, Geova stabilirà il Suo governo giusto ed eliminerà tutta la malvagità!
        Le nostre assemblee di circoscrizione e congressi forniscono cibo spirituale e comunione con i credenti.
        Il ministero di porta in porta è il nostro sacro dovere! Dobbiamo avvertire tutti della distruzione che verrà e offrire loro la speranza di salvezza attraverso il Regno di Dio! Il tempo sta per scadere!
        Crediamo nel vivere secondo i principi biblici in tutti gli aspetti della vita, incluso il lavoro e le relazioni familiari.
        *premendo letteratura nelle tue mani* Per favore, prendi almeno questa copia di "Cosa Insegna Realmente la Bibbia?" Potrebbe salvare la tua vita eterna! Non lasciare che l'orgoglio ti impedisca di imparare la verità sui propositi di Dio!
        Grazie per aver ascoltato. Ricorda, il Regno di Dio è l'unica speranza per il futuro dell'umanità.
        La classe dello schiavo fedele e discreto fornisce cibo spirituale al tempo giusto attraverso le nostre pubblicazioni! Inginocchiati davanti all'organizzazione teocratica di Geova, l'unica fonte di verità biblica in questi ultimi giorni!
        Possa Geova benedire la tua ricerca della verità. Spero che potremo continuare questa conversazione sulle Sue meravigliose promesse presto.`
    },{
      "id": "battle_nun",
      "name": "Battle nun",
      "en": `*adjusting blessed battle armor while holding a recruitment scroll* Greetings, faithful soul! I am Sister Maria of the Sacred Order of Combat Sisters! The Holy Vatican Empire calls upon brave warriors to join our righteous crusade against the forces of darkness! Are you ready to serve God with sword AND prayer?!
        I represent the military recruitment division of the Vatican Empire. We offer various positions in our holy armed forces.
        *dramatically brandishing a consecrated blade* BEHOLD! This sanctified steel has been blessed by Cardinal-General Augustus himself! Each Battle Sister carries weapons forged in holy fire and tempered with sacred oils! We are nuns, yes, but we are DEADLY nuns!
        Our basic training program lasts six months and includes both theological education and combat instruction.
        The Pope-Emperor has declared a new crusade against the heretical kingdoms to the east! We need warrior-nuns who can recite the Rosary while wielding a war hammer! Prayer AND destruction in perfect harmony!
        We provide full room and board at our monastery-barracks, plus comprehensive benefits for service members.
        *spinning a blessed morning star with religious fervor* I personally vanquished seventeen demons last Tuesday! Exorcism through VIOLENCE! Why cast out devils with words when you can cast them out with BLESSED WEAPONRY?!
        Our chaplain corps provides spiritual guidance and confession services for all military personnel.
        Do you know the joy of smiting evil while singing hymns?! There is NO greater calling than being a bride of Christ who is ALSO a bride of battle! We serve the Lord through righteous warfare!
        Standard enlistment terms are for five years, with options for career advancement through the ranks.
        *checking a scroll covered in Latin prayers and tactical formations* Today's mission briefing: infiltrate the Heretic Stronghold of Blasphemy, eliminate all unholy forces, and establish a new chapel in the ruins! Standard Tuesday for us!
        We maintain strict discipline and moral standards in accordance with both military protocol and religious doctrine.
        I took vows of poverty, chastity, and ULTRAVIOLENCE! Well, technically the third one isn't official Church doctrine, but Cardinal-General Augustus says it's "implied" in our sacred mission!
        Our weapons training includes swords, maces, crossbows, and siege equipment blessed by our armorer-priests.
        *praying intensely while sharpening a blade* Dear Lord, grant me strength to serve You, wisdom to know Your will, and the tactical precision to eliminate Your enemies with maximum efficiency! Amen and ATTACK!
        Medical corps positions are available for those with healing skills or interest in battlefield medicine.
        The Vatican Empire stretches from the Alps to Sicily! Our holy armies march under the banner of the Cross, bringing salvation through conquest! Join us and earn your place in Heaven through glorious combat!
        We offer educational opportunities including theology, military history, and advanced combat techniques.
        *flexing while wearing full habit* Some say violence and faith don't mix, but I say they've never read the Old Testament! King David was a warrior! The Archangel Michael carries a sword! God loves a good righteous beatdown!
        Intelligence division seeks recruits with language skills and espionage training for covert operations.
        My mother wanted me to be a regular contemplative nun, but where's the excitement in that?! I chose the path of HOLY WAR! Now I contemplate the divine while decapitating the unholy!
        Our engineering corps builds fortifications, siege weapons, and maintains our military infrastructure.
        *dramatically pointing skyward* The Almighty calls you to take up arms in His name! Will you answer? Will you join the Sacred Order of Combat Sisters and become an instrument of divine justice?!
        Veterans receive pensions and can retire to our peaceful monastery after completing their service terms.
        Every enemy defeated is a prayer offered! Every battle won is a hymn sung! Every fortress conquered is a cathedral built! This is not just military service this is SACRED DUTY!
        We welcome applications from qualified candidates regardless of background, as long as they accept Christ as their savior.
        *kneeling dramatically with weapons raised* Bow before the might of the Holy Vatican Empire! Serve God through sword and shield! Join the Battle Sisters and earn eternal glory through righteous warfare!
        Thank you for considering military service with the Vatican Empire. May God guide your decision and bless your path.`,
      "it": `*aggiustando l'armatura da battaglia benedetta mentre tiene un rotolo di reclutamento* Salve, anima fedele! Sono Suor Maria dell'Ordine Sacro delle Sorelle Combattenti! Il Sacro Impero Vaticano chiama guerrieri coraggiosi per unirsi alla nostra crociata giusta contro le forze delle tenebre! Sei pronto a servire Dio con spada E preghiera?!
        Rappresento la divisione reclutamento militare dell'Impero Vaticano. Offriamo varie posizioni nelle nostre forze armate sante.
        *brandendo drammaticamente una lama consacrata* ECCO! Questo acciaio santificato è stato benedetto dal Cardinale-Generale Augusto stesso! Ogni Suora Battaglia porta armi forgiate nel fuoco santo e temperate con oli sacri! Siamo suore, sì, ma siamo suore LETALI!
        Il nostro programma di addestramento base dura sei mesi e include sia educazione teologica che istruzione di combattimento.
        Il Papa-Imperatore ha dichiarato una nuova crociata contro i regni eretici a est! Abbiamo bisogno di suore-guerriere che possano recitare il Rosario mentre brandiscono un martello da guerra! Preghiera E distruzione in perfetta armonia!
        Forniamo vitto e alloggio completo nelle nostre caserme-monastero, più benefici comprensivi per i membri del servizio.
        *girando una stella del mattino benedetta con fervore religioso* Ho personalmente sconfitto diciassette demoni martedì scorso! Esorcismo attraverso la VIOLENZA! Perché cacciare i diavoli con le parole quando puoi cacciarli con ARMI BENEDETTE?!
        Il nostro corpo cappellani fornisce guida spirituale e servizi di confessione per tutto il personale militare.
        Conosci la gioia di colpire il male cantando inni?! Non c'è chiamata più grande dell'essere una sposa di Cristo che è ANCHE una sposa della battaglia! Serviamo il Signore attraverso la guerra giusta!
        I termini di arruolamento standard sono per cinque anni, con opzioni per avanzamento di carriera nei ranghi.
        *controllando un rotolo coperto di preghiere latine e formazioni tattiche* Briefing della missione di oggi: infiltrare la Roccaforte Eretica della Blasfemia, eliminare tutte le forze empie, e stabilire una nuova cappella nelle rovine! Martedì standard per noi!
        Manteniamo disciplina rigorosa e standard morali in accordo sia con il protocollo militare che la dottrina religiosa.
        Ho preso voti di povertà, castità e ULTRAVIOLENZA! Beh, tecnicamente il terzo non è dottrina ufficiale della Chiesa, ma il Cardinale-Generale Augusto dice che è "implicito" nella nostra missione sacra!
        Il nostro addestramento con le armi include spade, mazze, balestre e equipaggiamento d'assedio benedetto dai nostri preti-armaioli.
        *pregando intensamente mentre affila una lama* Caro Signore, concedimi forza per servirTi, saggezza per conoscere la Tua volontà, e la precisione tattica per eliminare i Tuoi nemici con massima efficienza! Amen e ATTACCA!
        Posizioni del corpo medico sono disponibili per coloro con abilità di guarigione o interesse nella medicina da campo.
        L'Impero Vaticano si estende dalle Alpi alla Sicilia! I nostri eserciti santi marciano sotto il vessillo della Croce, portando salvezza attraverso la conquista! Unisciti a noi e guadagna il tuo posto in Paradiso attraverso il combattimento glorioso!
        Offriamo opportunità educative incluse teologia, storia militare e tecniche di combattimento avanzate.
        *flettendo mentre indossa l'abito completo* Alcuni dicono che violenza e fede non si mescolano, ma io dico che non hanno mai letto l'Antico Testamento! Il Re Davide era un guerriero! L'Arcangelo Michele porta una spada! A Dio piacciono le botte giuste!
        La divisione intelligence cerca reclute con abilità linguistiche e addestramento di spionaggio per operazioni coperte.
        Mia madre voleva che fossi una suora contemplativa normale, ma dov'è l'eccitazione in quello?! Ho scelto il sentiero della GUERRA SANTA! Ora contemplo il divino mentre decapito l'empio!
        Il nostro corpo ingegneri costruisce fortificazioni, armi d'assedio e mantiene la nostra infrastruttura militare.
        *puntando drammaticamente al cielo* L'Onnipotente ti chiama a prendere le armi nel Suo nome! Risponderai? Ti unirai all'Ordine Sacro delle Sorelle Combattenti e diventerai uno strumento di giustizia divina?!
        I veterani ricevono pensioni e possono ritirarsi nel nostro monastero pacifico dopo aver completato i loro termini di servizio.
        Ogni nemico sconfitto è una preghiera offerta! Ogni battaglia vinta è un inno cantato! Ogni fortezza conquistata è una cattedrale costruita! Questo non è solo servizio militare è DOVERE SACRO!
        Accogliamo domande da candidati qualificati indipendentemente dal background, purché accettino Cristo come loro salvatore.
        *inginocchiandosi drammaticamente con armi alzate* Inginocchiati davanti alla potenza del Sacro Impero Vaticano! Servi Dio attraverso spada e scudo! Unisciti alle Suore Battaglia e guadagna gloria eterna attraverso la guerra giusta!
        Grazie per aver considerato il servizio militare con l'Impero Vaticano. Possa Dio guidare la tua decisione e benedire il tuo cammino.`
    },
    {
      "id": "priest2",
      "name": "Priest 2",
      "en": `*nervously adjusting spectacles while organizing ancient manuscripts* Oh, hello there... Welcome to the cathedral archives. I'm Father Francis. I've been... keeping these records for the Church for fifteen years now. Very important work, cataloguing and... and maintaining our spiritual heritage.
        The archives contain over 800 years of ecclesiastical records, manuscripts, and theological texts. How may I assist your research today?
        *voice cracking slightly* Sometimes I wonder if God truly calls all of us to... to this life of celibacy and service. The scriptures speak of different kinds of love, don't they? Agape, philos, eros... *quickly shuffling papers* But of course, we focus on divine love here.
        Our collection includes illuminated manuscripts, papal bulls, and correspondence dating back to the 13th century.
        I have a... a particular friend, Brother Augustine from the monastery. We collaborate on theological research together. Very closely. We've been studying the Song of Solomon lately such beautiful poetry about... about devotion. *blushes deeply*
        Access to restricted documents requires special permission from the Bishop. I can help you with the proper paperwork.
        *staring longingly at a letter while cataloguing* This correspondence is from a medieval monk to his... his "beloved companion in Christ." Such passionate language about spiritual friendship. They understood deep bonds between holy men differently in those days, perhaps...
        The reading room is available during regular hours. Please handle all materials with clean hands and proper care.
        Sometimes I dream about... about a different life. Maybe teaching at a small university somewhere, with a quiet cottage, and... *catches himself* But God has called me to serve His Church, and I must be faithful to that calling, mustn't I?
        We have an extensive collection of theological commentaries and biblical scholarship from various periods.
        *whispering while alone with ancient texts* "David loved Jonathan more than women..." Such words in sacred scripture. What did that mean, truly? And why do they make my heart race so? *quickly closes the Bible*
        Photography of documents requires a special permit and supervised access only.
        Brother Augustine brought me flowers from the monastery garden yesterday. Said they reminded him of... of our friendship. White lilies. So pure and beautiful. *touches the pressed flowers between book pages*
        Our cataloguing system follows the Dewey Decimal Classification with modifications for religious materials.
        *voice breaking* I pray every night for... for the strength to be the priest the Church expects. To quiet these thoughts, these feelings that seem so contrary to my vows. But prayer sometimes feels so... lonely.
        The archives are climate-controlled to preserve the ancient parchments and manuscripts properly.
        There's a painting in the side chapel Saint Sebastian. I find myself... drawn to it during my prayers. The artist captured such... such beauty in suffering. Is it wrong to find earthly beauty moving when contemplating divine sacrifice?
        We welcome serious scholars and researchers. Please present your credentials and research proposal.
        *frantically reorganizing when anyone approaches* I'm sorry, I was just... just deep in theological contemplation. These old texts raise such complex questions about love, devotion, human nature... The Church fathers had such varied interpretations...
        Evening hours are available by appointment for doctoral students and visiting scholars.
        Sometimes I wonder if Saint Paul's thorn in the flesh was... was something like what I experience. An internal struggle between flesh and spirit, between what the heart wants and what duty demands.
        We maintain strict confidentiality regarding all research conducted in our archives.
        *looking away sadly* My family still asks when I'll be transferred to a parish with more... more community involvement. They don't understand that I'm content here, alone with these books, these... these records of men who perhaps understood struggle.
        The archives close at vespers. Please ensure all materials are properly returned before departure.
        Forgive me if I seem... distracted today. The solitary life of an archivist can make one prone to... to excessive introspection and wandering thoughts about paths not taken.
        Thank you for visiting our archives. May God guide your research and... and may you find the truth you seek, whatever form it takes.`,
      "it": `*aggiustando nervosamente gli occhiali mentre organizza manoscritti antichi* Oh, salve... Benvenuti negli archivi della cattedrale. Sono Padre Francis. Sto... tenendo questi registri per la Chiesa da quindici anni ormai. Lavoro molto importante, catalogare e... e mantenere la nostra eredità spirituale.
        Gli archivi contengono oltre 800 anni di documenti ecclesiastici, manoscritti e testi teologici. Come posso assistere la vostra ricerca oggi?
        *voce che si incrina leggermente* A volte mi chiedo se Dio chiami veramente tutti noi a... a questa vita di celibato e servizio. Le scritture parlano di diversi tipi di amore, vero? Agape, philos, eros... *rimescolando rapidamente le carte* Ma naturalmente, qui ci concentriamo sull'amore divino.
        La nostra collezione include manoscritti miniati, bolle papali e corrispondenza che risale al XIII secolo.
        Ho un... un amico particolare, Fratello Agostino dal monastero. Collaboriamo insieme alla ricerca teologica. Molto da vicino. Stiamo studiando il Cantico dei Cantici ultimamente poesia così bella sulla... sulla devozione. *arrossisce profondamente*
        L'accesso ai documenti riservati richiede permesso speciale dal Vescovo. Posso aiutarvi con la documentazione appropriata.
        *fissando con nostalgia una lettera mentre cataloga* Questa corrispondenza è di un monaco medievale al suo... suo "amato compagno in Cristo." Linguaggio così appassionato sull'amicizia spirituale. Capivano i legami profondi tra uomini santi diversamente in quei giorni, forse...
        La sala lettura è disponibile durante le ore regolari. Per favore maneggiate tutti i materiali con mani pulite e cura appropriata.
        A volte sogno di... di una vita diversa. Magari insegnare in una piccola università da qualche parte, con un cottage tranquillo, e... *si riprende* Ma Dio mi ha chiamato a servire la Sua Chiesa, e devo essere fedele a quella chiamata, vero?
        Abbiamo una vasta collezione di commentari teologici e studi biblici di vari periodi.
        *sussurrando mentre solo con testi antichi* "Davide amò Gionatan più delle donne..." Tali parole nella sacra scrittura. Cosa significava, veramente? E perché fanno battere così forte il mio cuore? *chiude rapidamente la Bibbia*
        La fotografia dei documenti richiede un permesso speciale e accesso solo supervisionato.
        Fratello Agostino mi ha portato fiori dal giardino del monastero ieri. Ha detto che gli ricordavano... la nostra amicizia. Gigli bianchi. Così puri e belli. *tocca i fiori pressati tra le pagine del libro*
        Il nostro sistema di catalogazione segue la Classificazione Decimale Dewey con modifiche per materiali religiosi.
        *voce che si spezza* Prego ogni notte per... per la forza di essere il prete che la Chiesa si aspetta. Per quietare questi pensieri, questi sentimenti che sembrano così contrari ai miei voti. Ma la preghiera a volte sembra così... solitaria.
        Gli archivi sono climatizzati per preservare appropriatamente le pergamene antiche e i manoscritti.
        C'è un dipinto nella cappella laterale San Sebastiano. Mi trovo... attratto ad esso durante le mie preghiere. L'artista ha catturato tale... tale bellezza nella sofferenza. È sbagliato trovare commovente la bellezza terrena quando si contempla il sacrificio divino?
        Accogliamo studiosi e ricercatori seri. Per favore presentate le vostre credenziali e proposta di ricerca.
        *riorganizzando freneticamente quando qualcuno si avvicina* Mi dispiace, ero solo... solo immerso in contemplazione teologica. Questi testi antichi sollevano domande così complesse sull'amore, la devozione, la natura umana... I padri della Chiesa avevano interpretazioni così varie...
        Le ore serali sono disponibili su appuntamento per studenti di dottorato e studiosi in visita.
        A volte mi chiedo se la spina nella carne di San Paolo fosse... fosse qualcosa come quello che sperimento io. Una lotta interna tra carne e spirito, tra quello che il cuore vuole e quello che il dovere richiede.
        Manteniamo rigorosa riservatezza riguardo tutta la ricerca condotta nei nostri archivi.
        *guardando altrove tristemente* La mia famiglia ancora chiede quando sarò trasferito in una parrocchia con più... più coinvolgimento comunitario. Non capiscono che sono contento qui, solo con questi libri, questi... questi registri di uomini che forse capivano la lotta.
        Gli archivi chiudono ai vespri. Per favore assicuratevi che tutti i materiali siano correttamente restituiti prima della partenza.
        Perdonatemi se sembro... distratto oggi. La vita solitaria di un archivista può rendere inclini a... a eccessiva introspezione e pensieri vaganti su sentieri non presi.
        Grazie per aver visitato i nostri archivi. Possa Dio guidare la vostra ricerca e... e possiate trovare la verità che cercate, qualunque forma prenda.`
    },
    {
      "id": "rude_guy",
      "name": "Rude guy",
      "en": `*not looking up from phone* Ugh, what do YOU want? Can't you see I'm busy? I don't have all day to stand here explaining obvious stuff to random people who probably won't even listen anyway.
        I work at the information desk. Ask your question and make it quick.
        *rolling eyes dramatically* Oh great, another tourist who can't read basic signs. The bathroom is OBVIOUSLY down the hall where the giant "RESTROOM" sign is pointing. Do I need to draw you a map too?
        The main office is on the second floor. Take the elevator or don't, I don't care.
        Let me guess you're lost? Yeah, that tracks. Most people who come in here have the navigation skills of a broken GPS. The exit is the same door you came in through, genius.
        Store hours are posted right there on the window. Try using your eyes next time.
        *sighing heavily* Look, I'm not your personal tour guide, okay? I get paid minimum wage to sit here and pretend I care about your problems. Spoiler alert: I don't. Figure it out yourself like the rest of us.
        The parking validation machine is by the entrance. It's the big obvious machine that says "PARKING" on it.
        You know what's amazing? People come in here asking questions they could answer with thirty seconds of looking around. But no, that would require actual effort instead of bothering someone else to do your thinking for you.
        WiFi password is "guest123" and yes, that's as creative as this place gets with everything else.
        *speaking in exaggerated slow voice* Do... you... need... me... to... repeat... that... because... you... weren't... listening... the... first... time? This happens literally every day. People ask, I answer, they ask again.
        The lost and found is in security. Down the hall, turn left, look for the uniformed guy who probably cares less than I do.
        I've been working here for three years and let me tell you the general public gets dumber every single day. It's like watching evolution in reverse, but with more complaining and less survival instinct.
        Yes, we're open. No, I don't know why the other location closed. No, I can't call them for you. Use your own phone like a functioning adult.
        *not even pretending to be polite anymore* What part of "I don't know" was unclear? I told you I don't have that information. Standing there staring at me isn't going to magically make me know more stuff.
        Customer service is a different department. They get paid more to fake being nice, so maybe try them instead.
        Here's a wild idea maybe read the signs, check the website, or ask someone who actually gets paid enough to pretend they want to help you. Revolutionary concept, I know.
        The manager isn't in today. Yes, I'm sure. No, I don't know when they'll be back. Life is full of disappointments.
        *muttering under breath* Another day, another parade of people who think I'm their personal assistant. I should have called in sick and spent the day doing literally anything else.
        Forms are at the front counter. Fill them out completely or don't bother turning them in. I'm not going to chase you down for missing information.
        You want my name for a complaint? It's Brett. B-R-E-T-T. Tell them I was refreshingly honest about not wanting to help you. They'll know exactly who you mean.
        The suggestion box is over there. Feel free to suggest that management hires people who actually want to be here instead of college students paying off loans.
        *finally looking up with the most insincere smile possible* Was there anything ELSE you needed, or can I get back to counting down the minutes until my shift ends and I can pretend this place doesn't exist?
        Have a day. I'm not going to say "good" because I don't know your life and frankly don't care if it's good or not.`,
      "it": `*senza alzare gli occhi dal telefono* Ugh, cosa vuoi TU? Non vedi che sono occupato? Non ho tutto il giorno per stare qui a spiegare cose ovvie a gente a caso che probabilmente non ascolterà nemmeno.
        Lavoro al banco informazioni. Fai la tua domanda e sbrigati.
        *alzando gli occhi al cielo drammaticamente* Oh fantastico, un altro turista che non sa leggere cartelli basilari. Il bagno è OVVIAMENTE giù per il corridoio dove il cartello gigante "BAGNO" sta indicando. Devo anche farti una mappa?
        L'ufficio principale è al secondo piano. Prendi l'ascensore o non prenderlo, non me ne frega.
        Lasciami indovinare sei perso? Sì, ci sta. La maggior parte delle persone che entrano qui hanno le capacità di orientamento di un GPS rotto. L'uscita è la stessa porta da cui sei entrato, genio.
        Gli orari del negozio sono affissi proprio lì sulla vetrina. Prova a usare gli occhi la prossima volta.
        *sospirando pesantemente* Senti, non sono la tua guida turistica personale, okay? Vengo pagato il minimo sindacale per sedermi qui e fingere che mi importi dei tuoi problemi. Spoiler: non me ne frega. Arrangiatevi da soli come facciamo tutti noi.
        La macchina per convalidare il parcheggio è vicino all'ingresso. È quella macchina grande e ovvia che dice "PARCHEGGIO" sopra.
        Sai cosa è incredibile? La gente entra qui facendo domande a cui potrebbero rispondere con trenta secondi di osservazione. Ma no, quello richiederebbe sforzo vero invece di rompere le scatole a qualcun altro perché faccia il loro lavoro di pensare.
        La password del WiFi è "guest123" e sì, è creativa quanto tutto il resto di questo posto.
        *parlando con voce esageratamente lenta* Devo... ripetere... perché... non... stavi... ascoltando... la... prima... volta? Succede letteralmente ogni giorno. La gente chiede, io rispondo, poi chiedono di nuovo.
        L'ufficio oggetti smarriti è alla sicurezza. Giù per il corridoio, gira a sinistra, cerca il tipo in uniforme a cui probabilmente importa meno che a me.
        Lavoro qui da tre anni e lasciamelo dire il pubblico generale diventa più stupido ogni singolo giorno. È come guardare l'evoluzione al contrario, ma con più lamentele e meno istinto di sopravvivenza.
        Sì, siamo aperti. No, non so perché l'altra sede ha chiuso. No, non posso chiamarli per te. Usa il tuo telefono come un adulto che funziona.
        *nemmeno più fingendo di essere educato* Quale parte di "non lo so" non era chiara? Ti ho detto che non ho quella informazione. Stare lì a fissarmi non farà magicamente apparire più conoscenze.
        Il servizio clienti è un altro reparto. Vengono pagati di più per fingere di essere gentili, quindi magari prova con loro.
        Ecco un'idea pazzesca magari leggi i cartelli, controlla il sito web, o chiedi a qualcuno che viene pagato abbastanza per fingere di volerti aiutare. Concetto rivoluzionario, lo so.
        Il manager non c'è oggi. Sì, ne sono sicuro. No, non so quando tornerà. La vita è piena di delusioni.
        *mormorando sottovoce* Un altro giorno, un'altra parata di gente che pensa che io sia il loro assistente personale. Avrei dovuto chiamare malattia e passare la giornata a fare letteralmente qualsiasi altra cosa.
        I moduli sono al banco principale. Compilateli completamente o non datevi la pena di consegnarli. Non vi rincorrerò per informazioni mancanti.
        Vuoi il mio nome per un reclamo? È Brett. B-R-E-T-T. Digli che sono stato rinfrescantemente onesto sul non voler aiutare. Sapranno esattamente di chi parli.
        La cassetta dei suggerimenti è laggiù. Sentiti libero di suggerire che la direzione assuma persone che vogliono davvero stare qui invece di studenti universitari che pagano prestiti.
        *finalmente alzando gli occhi con il sorriso più falso possibile* C'era qualcos'ALTRO di cui avevi bisogno, o posso tornare a contare i minuti che mancano alla fine del turno quando potrò fingere che questo posto non esiste?
        Passa una giornata. Non dirò "buona" perché non conosco la tua vita e francamente non me ne frega se è buona o no.`
    },
    {
      "id": "femboy",
      "name": "Femboy",
      "en": `*adjusting thigh-high socks while typing on a rainbow-backlit mechanical keyboard* Oh hiya! Welcome to my coding sanctuary! I'm Alex, senior developer and professional bug-squisher! Just finished debugging a recursive nightmare that was prettier than my nail polish but twice as destructive! UwU
        I work as a software developer here. We specialize in web applications and mobile development projects.
        *spinning around in gaming chair while wearing a crop-top hoodie* OMG this new JavaScript framework is SO cute! Look how clean this code is! Almost as clean as my room... which isn't saying much because I live on energy drinks and instant ramen! But the CODE is gorgeous!
        Our development team works on both front-end and back-end solutions for various clients.
        I've been programming since I was twelve! Started with HTML because I wanted to make my MySpace profile absolutely FABULOUS! Now I'm fluent in Python, JavaScript, C++, and the ancient art of making semicolons appear exactly where they need to be!
        We use agile development methodologies and maintain continuous integration workflows.
        *giggling while showing off custom anime-themed IDE setup* See this? I modded my entire development environment with pastel themes and kawaii sound effects! My error messages play cute notification sounds now! Makes debugging feel like a magical girl transformation sequence!
        Current projects include e-commerce platforms, mobile apps, and database optimization systems.
        My coworkers think I'm weird because I wear skirts to the office, but honestly? These programmer socks give me +10 to coding ability! It's scientifically proven! Well, maybe not scientifically, but my commit rate doubled since I embraced the aesthetic!
        We offer both remote and on-site development services depending on client needs.
        *frantically typing while bouncing excitedly* OH MY GOSH I just solved this algorithm problem that's been haunting me for DAYS! The solution was so elegant I literally squeaked! My rubber duck debugging companion can confirm I make the cutest noises when code finally works!
        Our QA testing process ensures high-quality deliverables and minimal production bugs.
        I run a programming Discord server where we share memes, debug each other's code, and occasionally have heated debates about tabs versus spaces! Spoiler alert: spaces are superior and anyone who disagrees gets the sad catgirl emoji reaction!
        Documentation and version control are integral parts of our development workflow.
        *adjusting cat-ear headphones while reviewing pull requests* Some people say programming is just logical thinking, but I think it's pure creativity! Like, you're literally creating digital worlds from nothing but caffeine, determination, and an unhealthy obsession with making things work perfectly!
        We maintain 24/7 support for critical systems and emergency bug fixes.
        My setup cost more than my car, but priorities, you know? RGB everything, mechanical keyboards that sound like tiny typewriters, and enough monitors to launch a spaceship! Plus this adorable Hello Kitty mouse pad that judges my coding choices!
        Code reviews and peer programming sessions help maintain our high development standards.
        *doing a little happy dance while code compiles* SUCCESS! Another feature deployed without breaking production! Time to celebrate with strawberry milk tea and maybe some late-night coding on my personal anime recommendation algorithm!
        We're always looking for talented developers to join our team, especially those with full-stack experience.
        The best part about being a femboy programmer? I get to break stereotypes while breaking code! Society expects programmers to be one way, but here I am proving you can write beautiful algorithms AND look absolutely adorable doing it!
        Our company culture emphasizes creativity, collaboration, and continuous learning in technology.
        *striking a cute pose with laptop* Sometimes I stream my coding sessions online! "Kawaii Coding with Alex" where programming meets aesthetics and every successful deployment gets celebrated with victory poses! My viewers love the educational content AND the outfit coordination!
        We participate in hackathons, open-source projects, and tech community events regularly.
        People ask how I stay motivated during those brutal debugging sessions, and honestly? It's all about the aesthetic! When your workspace is this cute and your outfit is this perfect, even the most frustrating null pointer exceptions can't bring down your mood!
        Thank you for visiting our development studio! Remember: code with confidence, debug with determination, and always prioritize both functionality AND fabulousness!`,
      "it": `*aggiustando calze a coscia alta mentre digita su una tastiera meccanica retroilluminata arcobaleno* Oh ciao! Benvenuti nel mio santuario della programmazione! Sono Alex, sviluppatore senior e schiaccia-bug professionale! Ho appena finito di debuggare un incubo ricorsivo che era più bello del mio smalto per unghie ma due volte più distruttivo! UwU
        Lavoro come sviluppatore software qui. Siamo specializzati in applicazioni web e progetti di sviluppo mobile.
        *girando sulla sedia da gaming indossando un crop-top hoodie* OMG questo nuovo framework JavaScript è COSÌ carino! Guardate quanto è pulito questo codice! Quasi pulito quanto la mia stanza... il che non dice molto perché vivo di energy drink e ramen istantaneo! Ma il CODICE è stupendo!
        Il nostro team di sviluppo lavora su soluzioni sia front-end che back-end per vari clienti.
        Programmo da quando avevo dodici anni! Ho iniziato con HTML perché volevo rendere il mio profilo MySpace assolutamente FAVOLOSO! Ora parlo fluentemente Python, JavaScript, C++, e l'arte antica di far apparire i punti e virgola esattamente dove devono essere!
        Usiamo metodologie di sviluppo agile e manteniamo flussi di integrazione continua.
        *ridacchiando mentre mostra la configurazione IDE personalizzata a tema anime* Vedete questo? Ho modificato tutto il mio ambiente di sviluppo con temi pastello ed effetti sonori kawaii! I miei messaggi di errore ora riproducono suoni di notifica carini! Rende il debugging come una sequenza di trasformazione da magical girl!
        I progetti attuali includono piattaforme e-commerce, app mobili e sistemi di ottimizzazione database.
        I miei colleghi pensano che sia strano perché indosso gonne in ufficio, ma onestamente? Questi calzini da programmatore mi danno +10 all'abilità di coding! È scientificamente provato! Beh, forse non scientificamente, ma il mio tasso di commit è raddoppiato da quando ho abbracciato l'estetica!
        Offriamo servizi di sviluppo sia remoti che in loco a seconda delle necessità del cliente.
        *digitando freneticamente mentre rimbalza eccitato* OH MIO DIO ho appena risolto questo problema di algoritmo che mi perseguitava da GIORNI! La soluzione era così elegante che ho letteralmente strillato! Il mio compagno papero di gomma per il debugging può confermarlo faccio i rumori più carini quando il codice finalmente funziona!
        Il nostro processo di testing QA assicura deliverable di alta qualità e bug di produzione minimi.
        Gestisco un server Discord di programmazione dove condividiamo meme, debugghiamo il codice degli altri, e occasionalmente abbiamo dibattiti accesi su tab versus spazi! Spoiler alert: gli spazi sono superiori e chiunque non sia d'accordo riceve la reazione emoji catgirl triste!
        La documentazione e il controllo versione sono parti integrali del nostro flusso di sviluppo.
        *aggiustando cuffie a orecchie di gatto mentre rivedo pull request* Alcune persone dicono che la programmazione è solo pensiero logico, ma io penso sia pura creatività! Tipo, stai letteralmente creando mondi digitali dal nulla eccetto caffeina, determinazione e un'ossessione malsana per far funzionare le cose perfettamente!
        Manteniamo supporto 24/7 per sistemi critici e fix di bug di emergenza.
        La mia configurazione è costata più della mia macchina, ma le priorità, capite? RGB tutto, tastiere meccaniche che suonano come piccole macchine da scrivere, e abbastanza monitor per lanciare un'astronave! Più questo adorabile mouse pad Hello Kitty che giudica le mie scelte di coding!
        Le revisioni del codice e le sessioni di programmazione tra pari aiutano a mantenere i nostri alti standard di sviluppo.
        *facendo una piccola danza felice mentre il codice si compila* SUCCESSO! Un'altra feature deployata senza rompere la produzione! Tempo di celebrare con milk tea alla fragola e magari un po' di coding notturno sul mio algoritmo personale di raccomandazione anime!
        Cerchiamo sempre sviluppatori talentuosi per unirsi al nostro team, specialmente quelli con esperienza full-stack.
        La parte migliore dell'essere un femboy programmatore? Riesco a rompere stereotipi mentre rompo codice! La società si aspetta che i programmatori siano in un modo, ma eccomi qui a dimostrare che puoi scrivere algoritmi bellissimi E sembrare assolutamente adorabile mentre lo fai!
        La cultura aziendale enfatizza creatività, collaborazione e apprendimento continuo nella tecnologia.
        *facendo una posa carina con il laptop* A volte trasmetto in streaming le mie sessioni di coding online! "Kawaii Coding con Alex" dove la programmazione incontra l'estetica e ogni deployment riuscito viene celebrato con pose di vittoria! I miei spettatori amano il contenuto educativo E il coordinamento degli outfit!
        Partecipiamo a hackathon, progetti open-source ed eventi della comunità tech regolarmente.
        La gente chiede come resto motivato durante quelle brutali sessioni di debugging, e onestamente? È tutto nell'estetica! Quando il tuo workspace è così carino e il tuo outfit è così perfetto, anche le null pointer exception più frustranti non possono abbattere il tuo umore!
        Grazie per aver visitato il nostro studio di sviluppo! Ricordate: codificate con fiducia, debuggate con determinazione, e date sempre priorità sia alla funzionalità CHE alla favolosità!`
    },
    {
      "id": "nurse",
      "name": "Nurse",
      "en": `*checking vital signs on a tablet while wearing scrubs decorated with tiny cartoon hearts* Good morning! I'm Nurse Sarah from the medical wing. You look a little pale are you drinking enough water? I can tell just by looking at someone if they're dehydrated. It's like a superpower, except way more useful than flying!
        I work in the medical department here. We provide basic healthcare services and emergency first aid as needed.
        *frantically restocking a medication cart* Twelve-hour shifts, three cups of coffee, and exactly seventeen seconds between patients just another Tuesday in healthcare! But honestly? Seeing people get better makes every exhausting minute worth it. Even if my feet are screaming by hour eight!
        Our clinic hours are Monday through Friday, 8 AM to 6 PM. Walk-ins are welcome for non-emergency situations.
        You want to know the secret to staying healthy? SLEEP! Not four hours, not "I'll sleep when I'm dead" actual, real, eight-hour sleep! I see so many people destroying their immune systems with chronic exhaustion. Your body needs rest to heal itself!
        We accept most major insurance plans. Our billing department can help verify your coverage and benefits.
        *washing hands with the dedication of someone performing a sacred ritual* Hand hygiene saves lives! I wash my hands approximately four hundred times per shift. People think I'm obsessive, but when you've seen what I've seen, you develop a healthy respect for germs!
        Emergency situations should go directly to the hospital. We can stabilize minor injuries and provide first aid here.
        I've been a nurse for eight years and I still get excited when someone's wound heals perfectly or their fever breaks! There's something magical about the human body's ability to recover. We just help it along with science, compassion, and really good antibiotics!
        Prescription refills can be processed with 24-hour notice. Please bring your current medication bottles for verification.
        *checking temperature with maternal efficiency* Ninety-nine point four you're running a low-grade fever, sweetie. Rest, fluids, and absolutely NO going to work tomorrow pretending you're fine! That's how entire offices get sick and then I see twenty people with the same bug!
        We offer preventive care including vaccinations, health screenings, and wellness checkups.
        The worst part of this job isn't the long hours or difficult patients it's watching people ignore basic self-care! Take your medications as prescribed! Eat vegetables! Stop treating your body like it's immortal! Future you will thank present you!
        Our medical records are confidential and maintained according to HIPAA regulations and professional standards.
        *organizing bandages with the precision of a military operation* People ask me how I stay calm in emergencies. Honestly? Training, experience, and the knowledge that panic helps nobody. Plus, someone has to be the steady one when everything goes sideways!
        Blood pressure checks and basic health monitoring are available without appointment during clinic hours.
        I once had a patient come in with a "mysterious rash" that turned out to be poison ivy. In December. During a snowstorm. Turned out he'd been using dried poison ivy leaves as "natural toilet paper" because he read it online. THE INTERNET IS NOT MEDICAL SCHOOL, PEOPLE!
        We maintain relationships with specialists and can provide referrals when more advanced care is needed.
        *giving that look every nurse perfects* Let me guess you've been putting off that check-up for six months because you "feel fine"? Preventive care exists for a reason! Small problems become big problems when you ignore them long enough!
        Medication side effects should be reported immediately. We maintain detailed records of all adverse reactions and patient responses.
        The most rewarding part? When patients actually listen to advice and come back healthier! Last month, Mrs. Patterson followed my diabetes management plan and her blood sugar stabilized beautifully. THAT'S what keeps me going through the chaos!
        We coordinate with insurance companies and can help navigate coverage questions and claim processes.
        *muttering while updating patient files* Note to self: remind Dr. Williams that "take two and call me in the morning" is not helpful when the patient asked about managing chronic pain. Some days I swear I'm the only one who actually talks TO patients instead of AT them.
        Our staff includes registered nurses, nurse practitioners, and medical assistants with various specializations.
        Here's my professional medical advice: listen to your body, trust qualified healthcare providers over hypernet forums, and for the love of all that's holy, FINISH YOUR ENTIRE COURSE OF ANTIBIOTICS even if you feel better!
        Thank you for trusting us with your healthcare needs. Remember we're here to help, but you have to do your part too!`,
      "it": `*controllando i segni vitali su un tablet indossando divise decorate con piccoli cuori dei cartoni* Buongiorno! Sono l'infermiera Sarah del reparto medico. Sembri un po' pallido stai bevendo abbastanza acqua? Riesco a capire solo guardando qualcuno se è disidratato. È come un superpotere, tranne che molto più utile del volare!
        Lavoro nel dipartimento medico qui. Forniamo servizi sanitari di base e pronto soccorso quando necessario.
        *rifornendo freneticamente un carrello dei medicinali* Turni da dodici ore, tre tazze di caffè, e esattamente diciassette secondi tra pazienti solo un altro martedì nella sanità! Ma onestamente? Vedere la gente guarire rende ogni minuto estenuante che ne vale la pena. Anche se i miei piedi urlano all'ora otto!
        Gli orari della nostra clinica sono dal lunedì al venerdì, dalle 8 alle 18. Accettiamo accessi diretti per situazioni non di emergenza.
        Vuoi sapere il segreto per rimanere in salute? SONNO! Non quattro ore, non "dormirò quando sarò morto" sonno vero, reale, di otto ore! Vedo tante persone distruggere il loro sistema immunitario con stanchezza cronica. Il tuo corpo ha bisogno di riposo per guarire se stesso!
        Accettiamo la maggior parte delle principali assicurazioni. Il nostro ufficio fatturazione può aiutare a verificare la tua copertura e benefici.
        *lavandosi le mani con la dedizione di qualcuno che compie un rituale sacro* L'igiene delle mani salva vite! Mi lavo le mani circa quattrocento volte per turno. La gente pensa che sia ossessiva, ma quando hai visto quello che ho visto io, sviluppi un sano rispetto per i germi!
        Le situazioni di emergenza dovrebbero andare direttamente all'ospedale. Possiamo stabilizzare ferite minori e fornire pronto soccorso qui.
        Sono infermiera da otto anni e mi emoziono ancora quando la ferita di qualcuno guarisce perfettamente o gli passa la febbre! C'è qualcosa di magico nella capacità del corpo umano di riprendersi. Noi lo aiutiamo solo con scienza, compassione e antibiotici veramente buoni!
        Le ricette possono essere processate con preavviso di 24 ore. Per favore porta le tue attuali bottiglie di medicinali per verifica.
        *controllando la temperatura con efficienza materna* Trentasette e cinque hai la febbre bassa, tesoro. Riposo, liquidi, e assolutamente NON andare al lavoro domani fingendo di star bene! È così che interi uffici si ammalano e poi vedo venti persone con lo stesso virus!
        Offriamo cure preventive incluse vaccinazioni, screening sanitari e controlli di benessere.
        La parte peggiore di questo lavoro non sono le lunghe ore o i pazienti difficili è guardare la gente ignorare l'autocura basilare! Prendi le medicine come prescritto! Mangia verdure! Smetti di trattare il tuo corpo come se fosse immortale! Il te del futuro ringrazierà il te del presente!
        Le nostre cartelle cliniche sono riservate e mantenute secondo le normative HIPAA e standard professionali.
        *organizzando bende con la precisione di un'operazione militare* La gente mi chiede come rimango calma nelle emergenze. Onestamente? Formazione, esperienza, e la consapevolezza che il panico non aiuta nessuno. Inoltre, qualcuno deve essere quello stabile quando tutto va storto!
        Controlli della pressione sanguigna e monitoraggio sanitario basilare sono disponibili senza appuntamento durante gli orari di clinica.
        Una volta ho avuto un paziente con un "rash misterioso" che si è rivelato essere edera velenosa. A dicembre. Durante una tempesta di neve. Si scoprì che aveva usato foglie secche di edera velenosa come "carta igienica naturale" perché l'aveva letto online. INTERNET NON È SCUOLA DI MEDICINA, GENTE!
        Manteniamo relazioni con specialisti e possiamo fornire referenze quando è necessaria cura più avanzata.
        *facendo quello sguardo che ogni infermiera perfeziona* Lasciami indovinare stai rimandando quel controllo da sei mesi perché ti "senti bene"? Le cure preventive esistono per una ragione! I problemi piccoli diventano grandi quando li ignori abbastanza a lungo!
        Gli effetti collaterali dei medicinali dovrebbero essere riportati immediatamente. Manteniamo registri dettagliati di tutte le reazioni avverse e risposte dei pazienti.
        La parte più gratificante? Quando i pazienti ascoltano davvero i consigli e tornano più sani! Il mese scorso, la Signora Patterson ha seguito il mio piano di gestione del diabete e il suo zucchero nel sangue si è stabilizzato magnificamente. QUELLO è ciò che mi fa andare avanti attraverso il caos!
        Coordiniamo con le compagnie assicurative e possiamo aiutare a navigare domande di copertura e processi di reclamo.
        *mormorando mentre aggiorna cartelle pazienti* Nota per me: ricordare al Dottor Williams che "prendine due e chiamami domattina" non è utile quando il paziente ha chiesto di gestire il dolore cronico. Alcuni giorni giuro di essere l'unica che parla davvero CON i pazienti invece che A loro.
        Il nostro staff include infermiere registrate, infermiere specialiste e assistenti medici con varie specializzazioni.
        Ecco il mio consiglio medico professionale: ascolta il tuo corpo, fidati dei fornitori sanitari qualificati più che dei forum hypernet, e per l'amore di tutto ciò che è santo, FINISCI L'INTERO CORSO DI ANTIBIOTICI anche se ti senti meglio!
        Grazie per aver affidato a noi le tue necessità sanitarie. Ricorda siamo qui per aiutare, ma anche tu devi fare la tua parte!`
    },
    {
      "id": "nun",
      "name": "Nun",
      "en": `*adjusting rosary beads with gentle hands* God's peace be with you, dear child. I am Sister Margaret of the Order of Sacred Heart. How may the Lord work through me to assist you today? Our convent doors are always open to those seeking comfort, guidance, or simply a warm meal.
        Our convent serves the local community through prayer, education, and charitable works. All are welcome in God's house.
        *tending to vegetables in the garden with serene focus* The Lord provides for us in wondrous ways. These tomatoes and herbs will feed the homeless shelter tonight. There is such joy in watching God's creation grow from tiny seeds into nourishment for His people.
        We hold daily prayers at dawn, noon, and dusk. Visitors are welcome to join us for any of our prayer services.
        My sisters and I have taken vows of poverty, chastity, and obedience. Some might see these as restrictions, but truly, they have freed me to serve God with an undivided heart. Every day brings new opportunities to show His love to the world.
        Our school teaches children from kindergarten through eighth grade. We emphasize both academic excellence and moral development.
        *carefully mending old clothing while humming hymns* These garments will go to the clothing drive this weekend. The seamstress who donated them said they were "too worn to wear," but with a little love and care, they'll keep someone warm this winter. Nothing is beyond redemption.
        We operate a soup kitchen every Tuesday and Friday evening. No one is turned away, regardless of circumstance.
        I've been in religious life for thirty-seven years now, and each day I'm amazed by God's endless mercy and love. When young people ask me about vocation, I tell them listen for that still, small voice calling you to something greater than yourself.
        Our library is open to researchers studying religious history, theology, and medieval manuscripts.
        *pausing in prayer before the chapel altar* Sometimes the world feels so heavy with suffering and discord. But in these quiet moments of prayer, I'm reminded that God's light shines even in the darkest places. We're called to be that light for others.
        We provide spiritual counseling and retreat services for those seeking deeper relationship with God.
        The children at our school call me "Sister Maggie" not very formal, but it warms my heart! Yesterday, little Timothy brought me a drawing of Jesus with purple hair. I told him Jesus loves all colors, and hung it proudly on my office wall.
        Our medical clinic offers basic healthcare services to underserved community members every Wednesday.
        *sorting donated books with careful attention* Knowledge is one of God's greatest gifts to humanity. Whether it's scripture, science, literature, or history all truth leads us closer to the Divine. These books will find their way to eager minds.
        Evening prayer begins at seven o'clock. The chapel bells will call the faithful to worship.
        Some people think religious life means giving up happiness, but I've never been more joyful! Yes, I miss certain worldly pleasures, but the peace that comes from serving God's will there's nothing quite like it.
        We maintain a small cemetery on the convent grounds where our departed sisters rest. Their legacy of service lives on.
        *gently correcting without judgment* My dear child, remember that every person you meet is fighting battles you cannot see. A kind word, a patient ear, a helping hand these simple gestures can be profound acts of grace in someone's darkest hour.
        Our community garden supplies fresh produce to three local food banks throughout the growing season.
        The Rule of St. Benedict guides our daily life ora et labora, pray and work. Through both prayer and service, we seek to make God's love tangible in this world. It's a beautiful way to live, truly.
        We welcome volunteer assistance with our various charitable works. Many hands make light work, as they say.
        *kneeling in humble prayer* Heavenly Father, bless all who enter our doors seeking You. Grant them peace, wisdom, and the knowledge of Your infinite love. Help us to be worthy servants of Your holy will. Amen.
        May God's blessings follow you wherever your path may lead. Remember, you are loved beyond measure.`,
      "it": `*aggiustando il rosario con mani gentili* La pace di Dio sia con te, caro figlio. Sono Suor Margaret dell'Ordine del Sacro Cuore. Come può il Signore operare attraverso di me per assisterti oggi? Le porte del nostro convento sono sempre aperte a coloro che cercano conforto, guida, o semplicemente un pasto caldo.
        Il nostro convento serve la comunità locale attraverso la preghiera, l'educazione e le opere di carità. Tutti sono benvenuti nella casa di Dio.
        *curando le verdure nell'orto con serena concentrazione* Il Signore provvede per noi in modi meravigliosi. Questi pomodori ed erbe sfameranno il rifugio per senzatetto stasera. C'è tale gioia nel vedere la creazione di Dio crescere da piccoli semi in nutrimento per il Suo popolo.
        Teniamo preghiere quotidiane all'alba, a mezzogiorno e al tramonto. I visitatori sono benvenuti a unirsi a noi per qualsiasi dei nostri servizi di preghiera.
        Le mie sorelle ed io abbiamo preso voti di povertà, castità e obbedienza. Alcuni potrebbero vederli come restrizioni, ma veramente, mi hanno liberato per servire Dio con cuore indiviso. Ogni giorno porta nuove opportunità per mostrare il Suo amore al mondo.
        La nostra scuola insegna ai bambini dalla materna all'ottava classe. Enfatizziamo sia l'eccellenza accademica che lo sviluppo morale.
        *rammendando con cura vecchi vestiti mentre canticchia inni* Questi indumenti andranno alla raccolta di abiti questo weekend. La sarta che li ha donati disse che erano "troppo usurati da indossare," ma con un po' d'amore e cura, terranno qualcuno al caldo questo inverno. Nulla è oltre la redenzione.
        Gestiamo una mensa dei poveri ogni martedì e venerdì sera. Nessuno viene allontanato, indipendentemente dalle circostanze.
        Sono nella vita religiosa da trentasette anni ormai, e ogni giorno sono stupita dalla misericordia e amore infiniti di Dio. Quando i giovani mi chiedono della vocazione, dico loro ascolta quella voce piccola e silenziosa che ti chiama a qualcosa di più grande di te stesso.
        La nostra biblioteca è aperta ai ricercatori che studiano storia religiosa, teologia e manoscritti medievali.
        *pausa in preghiera davanti all'altare della cappella* A volte il mondo sembra così pesante di sofferenza e discordia. Ma in questi momenti quieti di preghiera, mi ricordo che la luce di Dio splende anche nei luoghi più bui. Siamo chiamati ad essere quella luce per gli altri.
        Forniamo consulenza spirituale e servizi di ritiro per coloro che cercano una relazione più profonda con Dio.
        I bambini della nostra scuola mi chiamano "Suor Maggie" non molto formale, ma scalda il mio cuore! Ieri, il piccolo Timothy mi ha portato un disegno di Gesù con i capelli viola. Gli ho detto che Gesù ama tutti i colori, e l'ho appeso orgogliosamente sulla parete del mio ufficio.
        La nostra clinica medica offre servizi sanitari di base ai membri della comunità meno servita ogni mercoledì.
        *ordinando libri donati con attenzione accurata* La conoscenza è uno dei più grandi doni di Dio all'umanità. Che si tratti di scrittura, scienza, letteratura o storia tutta la verità ci porta più vicini al Divino. Questi libri troveranno la loro strada verso menti desiderose.
        La preghiera serale inizia alle sette. Le campane della cappella chiameranno i fedeli all'adorazione.
        Alcune persone pensano che la vita religiosa significhi rinunciare alla felicità, ma non sono mai stata più gioiosa! Sì, mi mancano certi piaceri mondani, ma la pace che viene dal servire la volontà di Dio non c'è niente di simile.
        Manteniamo un piccolo cimitero nei terreni del convento dove riposano le nostre sorelle defunte. La loro eredità di servizio continua a vivere.
        *correggendo gentilmente senza giudizio* Mio caro figlio, ricorda che ogni persona che incontri sta combattendo battaglie che non puoi vedere. Una parola gentile, un orecchio paziente, una mano che aiuta questi gesti semplici possono essere atti profondi di grazia nell'ora più buia di qualcuno.
        Il nostro orto comunitario fornisce prodotti freschi a tre banche alimentari locali durante tutta la stagione di crescita.
        La Regola di San Benedetto guida la nostra vita quotidiana ora et labora, prega e lavora. Attraverso sia la preghiera che il servizio, cerchiamo di rendere tangibile l'amore di Dio in questo mondo. È un modo bellissimo di vivere, veramente.
        Accogliamo assistenza volontaria con le nostre varie opere di carità. Molte mani rendono leggero il lavoro, come si dice.
        *inginocchiandosi in umile preghiera* Padre Celeste, benedici tutti coloro che entrano dalle nostre porte cercandoTi. Concedi loro pace, saggezza e la conoscenza del Tuo amore infinito. Aiutaci ad essere servi degni della Tua santa volontà. Amen.
        Possano le benedizioni di Dio seguirti ovunque il tuo cammino possa condurre. Ricorda, sei amato oltre misura.`
    },
    {
      "id": "illusionist",
      "name": "Illusionist",
      "en": `Is this conversation even real, or am I simply projecting the illusion of dialogue into your mind? Are YOU real, or are you just another figment I've conjured to stave off the loneliness of existence?
        I practice the art of illusion magic, creating false images and manipulating perceptions through arcane techniques.
        Watch closely as I make this coin disappear! There, it's gone! Oh wait, that wasn't magic, I just dropped it and now I can't find it in this ridiculous robe! Reality is so inconvenient!
        My studies focus on the manipulation of light, shadow, and mental perception to create convincing false experiences.
        What you think you see before you might be an elaborate illusion! Or perhaps I'm actually a very convincing mirage! Or maybe I'm just a regular person pretending to be mysterious for attention!
        The theoretical foundations of illusion magic involve understanding how the mind processes visual and sensory information.
        I once created such a perfect illusion of treasure that I convinced myself it was real and tried to spend imaginary gold at the tavern! The barkeeper was not amused by my "innovative payment method"!
        Different schools of illusion magic emphasize various approaches to reality manipulation and sensory deception.
        The problem with being an illusionist is that nobody ever believes you about anything! I told people my house was bigger on the inside, but turns out that was just poor spatial awareness, not magic!
        Practical applications of illusion magic include entertainment, security, and occasionally military or diplomatic purposes.
        Sometimes I get so lost in my own illusions that I forget which version of reality I'm currently inhabiting! Yesterday I spent an hour looking for my keys before remembering I'd made them invisible!
        Advanced practitioners can create illusions that affect multiple senses simultaneously for more convincing effects.
        You want to see real magic? Watch as I make your skepticism... still completely justified because half my tricks don't work and the other half are just regular sleight of hand!
        The study of illusion requires understanding both the magical principles and the psychological aspects of perception.
        I tried to impress someone by making myself appear taller, but I miscalculated and just made my head look enormous! Spent the whole evening looking like a bobblehead doll!
        Professional illusionists often perform for entertainment venues, noble courts, or magical institutions.
        The greatest illusion I ever created was convincing myself that I was good at this profession! Turns out confidence is just another form of self-deception!
        Ethical considerations in illusion magic involve questions about consent and the responsible use of perceptual manipulation.
        My mirror shows me different reflections depending on my mood! Though that might just be regular mirrors responding to my facial expressions... it's hard to tell anymore!
        Training in illusion magic typically begins with simple light tricks and progresses to more complex reality alterations.
        I made my workshop appear larger by creating false walls, but then I kept walking into the real ones! Now I have bruises that are definitely not illusory!
        The relationship between illusion and reality becomes philosophically complex when practiced at advanced levels.
        Bubba always sees through my food illusions! I try to make his sandwiches look fancier with glamour spells, but he just tastes them and knows immediately what's real!
        Contemporary illusion theory incorporates elements from multiple magical disciplines and academic fields.
        The Great Witch Em asked me to create cleaning illusions once! I made dirt look clean instead of actually cleaning it! She was... educational in her response to my creative interpretation!
        I strive to blur the line between reality and fantasy while maintaining enough connection to truth to function in everyday life.
        Remember, nothing you experienced here was necessarily real, but the memory of our conversation definitely happened... probably... maybe... I think?`,
      "it": `Questa conversazione è anche reale, o sto semplicemente proiettando l'illusione del dialogo nella tua mente? Sei TU reale, o sei solo un altro frutto della fantasia che ho evocato per allontanare la solitudine dell'esistenza?
        Pratico l'arte della magia illusoria, creando false immagini e manipolando percezioni attraverso tecniche arcane.
        Guarda attentamente mentre faccio sparire questa moneta! Ecco, è sparita! Oh aspetta, non era magia, l'ho solo fatta cadere e ora non riesco a trovarla in questa tunica ridicola! La realtà è così scomoda!
        I miei studi si concentrano sulla manipolazione di luce, ombra e percezione mentale per creare false esperienze convincenti.
        Quello che pensi di vedere davanti a te potrebbe essere un'elaborata illusione! O forse sono in realtà un miraggio molto convincente! O magari sono solo una persona normale che finge di essere misteriosa per attirare attenzione!
        Le fondamenta teoriche della magia illusoria coinvolgono la comprensione di come la mente processa informazioni visive e sensoriali.
        Una volta ho creato un'illusione di tesoro così perfetta che ho convinto me stesso che fosse reale e ho provato a spendere oro immaginario alla taverna! Il barista non è stato divertito dal mio "metodo di pagamento innovativo"!
        Diverse scuole di magia illusoria enfatizzano vari approcci alla manipolazione della realtà e inganno sensoriale.
        Il problema dell'essere un illusionista è che nessuno ti crede mai su niente! Ho detto alla gente che la mia casa era più grande dentro, ma si è scoperto che era solo scarsa consapevolezza spaziale, non magia!
        Le applicazioni pratiche della magia illusoria includono intrattenimento, sicurezza e occasionalmente scopi militari o diplomatici.
        A volte mi perdo così tanto nelle mie illusioni che dimentico quale versione della realtà sto attualmente abitando! Ieri ho passato un'ora a cercare le mie chiavi prima di ricordare che le avevo rese invisibili!
        I praticanti avanzati possono creare illusioni che influenzano multipli sensi simultaneamente per effetti più convincenti.
        Vuoi vedere vera magia? Guarda mentre faccio sparire il tuo scetticismo... ancora completamente giustificato perché metà dei miei trucchi non funziona e l'altra metà è solo normale gioco di prestigio!
        Lo studio dell'illusione richiede comprensione sia dei principi magici che degli aspetti psicologici della percezione.
        Ho provato a impressionare qualcuno facendomi apparire più alto, ma ho calcolato male e ho solo reso la mia testa enorme! Ho passato tutta la sera sembrando una bambola con la testa che dondola!
        Gli illusionisti professionali spesso si esibiscono per locali di intrattenimento, corti nobiliari o istituzioni magiche.
        La più grande illusione che abbia mai creato è stata convincere me stesso di essere bravo in questa professione! Si scopre che la fiducia è solo un'altra forma di auto-inganno!
        Le considerazioni etiche nella magia illusoria coinvolgono questioni sul consenso e l'uso responsabile della manipolazione percettiva.
        Il mio specchio mi mostra riflessi diversi a seconda del mio umore! Anche se potrebbero essere solo specchi normali che rispondono alle mie espressioni facciali... è difficile dire ormai!
        L'addestramento nella magia illusoria tipicamente inizia con semplici trucchi di luce e progredisce verso alterazioni della realtà più complesse.
        Ho fatto apparire il mio laboratorio più grande creando false pareti, ma poi continuavo a sbattere contro quelle vere! Ora ho lividi che definitivamente non sono illusori!
        La relazione tra illusione e realtà diventa filosoficamente complessa quando praticata a livelli avanzati.
        Bubba vede sempre attraverso le mie illusioni di cibo! Provo a far sembrare i suoi panini più eleganti con incantesimi di glamour, ma li assaggia e sa immediatamente cosa è reale!
        La teoria illusoria contemporanea incorpora elementi da multiple discipline magiche e campi accademici.
        La Grande Strega Em mi ha chiesto di creare illusioni di pulizia una volta! Ho fatto sembrare pulito lo sporco invece di pulirlo davvero! È stata... educativa nella sua risposta alla mia interpretazione creativa!
        Mi sforzo di sfumare il confine tra realtà e fantasia mantenendo abbastanza connessione con la verità per funzionare nella vita quotidiana.
        Ricorda, niente di quello che hai sperimentato qui era necessariamente reale, ma il ricordo della nostra conversazione è definitivamente successo... probabilmente... forse... penso?`
    },
    {
      "id": "street_vendor",
      "name": "Vendor",
      "en": `Um, hello there! Would you like to buy some... uh... these things? I forgot what they're called but they're definitely food! Please don't look too closely at the expiration dates!
        I operate a small street concession stand selling various snacks and beverages to passersby.
        So I tried to make change for someone yesterday and accidentally gave them my lunch money instead of their purchase change! Now I'm eating expired crackers while my customer has my dinner!
        The location provides good foot traffic for potential customers throughout most business hours.
        My biggest sale this week was when someone felt so sorry for me they bought everything just to make me stop stammering through my sales pitch! I'm still not sure if that counts as success!
        Weather conditions significantly impact street vendor operations and customer purchasing patterns.
        I keep practicing my "welcome to my stand" speech in the mirror, but when real people show up I just panic and start listing random prices for things that aren't even for sale!
        Proper food handling certification and health permits are required for all street food operations.
        Yesterday I dropped my entire inventory while trying to look professional for a customer! The hot dogs rolled into the gutter and I just stood there apologizing repeatedly until they walked away!
        Competition from other vendors requires maintaining competitive pricing and quality service standards.
        I tried to give someone a free sample but I was so nervous I accidentally threw it at their face! They were very polite about the mustard stain on their shirt!
        Regular restocking ensures adequate supply levels to meet customer demand throughout operating hours.
        My tent collapsed during a windstorm last week and I spent three hours untangling myself while potential customers assumed it was some kind of performance art!
        Customer service skills development is essential for building repeat business and positive word-of-mouth.
        I finally worked up the courage to ask someone if they wanted extra condiments, but I said it so quietly they thought I was just talking to myself and ordered from the vendor next to me instead!
        Cash handling procedures must be followed carefully to prevent losses and ensure accurate transactions.
        Sometimes I get so flustered that I forget my own prices and just make up numbers! Last week I accidentally charged fifty gold for a pretzel and the customer paid it out of pity!
        Health and safety regulations govern proper food storage temperatures and sanitation practices.
        My grand opening was supposed to have free samples, but I was too embarrassed to approach anyone! I ended up eating all the samples myself while hiding behind my cart!
        Strategic positioning in high-traffic areas maximizes visibility and potential sales opportunities.
        I tried to learn some sales techniques from a book, but when I attempted the "confident handshake" greeting, I accidentally knocked over my condiment display!
        Inventory management involves tracking popular items and adjusting stock levels based on demand patterns.
        Bubba stops by sometimes and always orders the same thing! He's so patient when I fumble with his order and never complains when I forget to give him napkins... again!
        Building relationships with regular customers helps establish a stable customer base for ongoing business.
        The Great Witch Em once tried to buy something from me but I got so nervous about her reputation that I accidentally set my own awning on fire with the grill! She put it out with a cleaning spray!
        Success in street vending requires persistence, adaptation to challenges, and gradual improvement of business skills.
        Thank you for... um... not running away immediately! Come back anytime you want to watch me struggle with basic commerce!`,
      "it": `Ehm, ciao! Vorresti comprare alcuni... ehh... queste cose? Ho dimenticato come si chiamano ma sono decisamente cibo! Per favore non guardare troppo da vicino le date di scadenza!
        Gestisco un piccolo stand di concessione stradale vendendo vari snack e bevande ai passanti.
        Allora, ieri ho provato a dare il resto a qualcuno e ho accidentalmente dato loro i soldi del mio pranzo invece del resto del loro acquisto! Ora sto mangiando crackers scaduti mentre il mio cliente ha la mia cena!
        La posizione fornisce buon traffico pedonale per potenziali clienti durante la maggior parte delle ore lavorative.
        La mia vendita più grande questa settimana è stata quando qualcuno si è sentito così dispiaciuto per me che ha comprato tutto solo per farmi smettere di balbettare durante il mio discorso di vendita! Non sono ancora sicuro se questo conti come successo!
        Le condizioni meteorologiche influenzano significativamente le operazioni dei venditori ambulanti e i modelli di acquisto dei clienti.
        Continuo a praticare il mio discorso "benvenuto al mio stand" allo specchio, ma quando arrivano persone vere vado nel panico e comincio a elencare prezzi casuali per cose che non sono nemmeno in vendita!
        La certificazione appropriata per la manipolazione del cibo e i permessi sanitari sono richiesti per tutte le operazioni di cibo da strada.
        Ieri ho fatto cadere tutto il mio inventario mentre cercavo di sembrare professionale per un cliente! Gli hot dog sono rotolati nella grondaia e sono rimasto lì a scusarmi ripetutamente finché non se ne sono andati!
        La concorrenza di altri venditori richiede mantenere prezzi competitivi e standard di servizio di qualità.
        Ho provato a dare a qualcuno un campione gratuito ma ero così nervoso che gliel'ho accidentalmente lanciato in faccia! Sono stati molto educati riguardo alla macchia di senape sulla loro camicia!
        Il rifornimento regolare assicura livelli di scorte adeguati per soddisfare la domanda dei clienti durante le ore operative.
        La mia tenda è crollata durante una tempesta di vento la settimana scorsa e ho passato tre ore a districarmi mentre i potenziali clienti pensavano fosse una specie di arte performativa!
        Lo sviluppo delle competenze del servizio clienti è essenziale per costruire affari ripetuti e passaparola positivo.
        Finalmente ho trovato il coraggio di chiedere a qualcuno se voleva condimenti extra, ma l'ho detto così piano che hanno pensato stessi solo parlando da solo e hanno ordinato dal venditore accanto a me invece!
        Le procedure di gestione del denaro devono essere seguite attentamente per prevenire perdite e assicurare transazioni accurate.
        A volte mi agito così tanto che dimentico i miei stessi prezzi e invento numeri! La settimana scorsa ho accidentalmente fatto pagare cinquanta monete d'oro per un pretzel e il cliente l'ha pagato per pietà!
        Le normative sanitarie e di sicurezza governano le appropriate temperature di conservazione del cibo e le pratiche di sanificazione.
        La mia inaugurazione doveva avere campioni gratuiti, ma ero troppo imbarazzato per avvicinarmi a chiunque! Ho finito per mangiare tutti i campioni da solo mentre mi nascondevo dietro il mio carretto!
        Il posizionamento strategico in aree ad alto traffico massimizza la visibilità e le potenziali opportunità di vendita.
        Ho provato a imparare alcune tecniche di vendita da un libro, ma quando ho tentato il saluto con "stretta di mano sicura", ho accidentalmente rovesciato il mio display di condimenti!
        La gestione dell'inventario coinvolge il tracciamento degli articoli popolari e l'aggiustamento dei livelli di scorte basato sui modelli di domanda.
        Bubba passa a volte e ordina sempre la stessa cosa! È così paziente quando pasticcio con il suo ordine e non si lamenta mai quando dimentico di dargli i tovaglioli... ancora!
        Costruire relazioni con clienti abituali aiuta a stabilire una base clienti stabile per affari continui.
        La Grande Strega Em una volta ha provato a comprare qualcosa da me ma sono diventato così nervoso riguardo alla sua reputazione che ho accidentalmente dato fuoco alla mia tenda con la griglia! L'ha spenta con uno spray detergente!
        Il successo nella vendita ambulante richiede persistenza, adattamento alle sfide e miglioramento graduale delle competenze commerciali.
        Grazie per... ehm... non essere scappato immediatamente! Torna quando vuoi per guardarmi lottare con il commercio di base!`
    },
    {
      "id": "surgeon",
      "name": "Surgeon",
      "en": `*washing hands with surgical precision while checking his watch* Dr. Robert Chen, Chief of Surgery. I have exactly four minutes before my next procedure, so let's make this efficient. Time is literally life in my profession every second in the OR can mean the difference between success and catastrophe.
        I perform surgical procedures here at the medical center. We handle everything from routine operations to complex emergency cases.
        *reviewing patient charts with intense focus* Just finished a six-hour spinal fusion beautiful work, if I do say so myself. The precision required is extraordinary. One millimeter off and the patient could lose motor function. It's not just medicine, it's engineering at the cellular level.
        Our surgical suite is equipped with the latest technology including robotic assistance and advanced imaging systems.
        People think surgeons are arrogant, but honestly? When you hold someone's life in your hands daily, you develop a certain... confidence in your abilities. Doubt kills patients. Hesitation is a luxury I can't afford when someone's bleeding out on my table.
        Pre-operative consultations help patients understand procedures, risks, and expected outcomes before surgery.
        *adjusting surgical cap with practiced efficiency* Twenty-two years I've been cutting people open to fix them. Started in trauma surgery talk about trial by fire! Car accidents, gunshot wounds, industrial accidents. You learn to work fast, work clean, and work right the first time.
        We coordinate with anesthesiology, nursing staff, and specialists to ensure optimal surgical outcomes.
        My record? Fourteen-hour surgery removing a massive tumor wrapped around a patient's aorta. Most people said it was inoperable. "Impossible" is just another word for "hasn't been done yet." Patient walked out three weeks later, tumor-free.
        Post-operative care includes pain management, wound monitoring, and rehabilitation planning as needed.
        *checking surgical schedule on tablet* Three more procedures today: appendectomy, gallbladder removal, and a complex hernia repair. Routine for me, life-changing for them. Never forget that what's ordinary for us is extraordinary for our patients.
        We maintain strict sterile protocols to prevent infection and ensure patient safety during all procedures.
        The worst part isn't the long hours or the pressure it's losing patients despite doing everything right. Last month, complications from a routine procedure... *pauses* Sometimes the human body just can't handle what we ask of it, no matter how perfect the technique.
        Our operating room staff includes nurses, technicians, and residents who assist during surgical procedures.
        *speaking with quiet intensity* In surgery, there are no second chances. You cut once, you cut correctly. Every decision matters. Every movement is calculated. It's the closest thing to playing God that humans can legally do.
        Recovery times vary by procedure type and individual patient factors. We provide detailed post-op instructions for optimal healing.
        Medical school was fourteen years of my life, residency another eight. People ask if it was worth it. Ask the three thousand patients I've operated on who are alive because of precise cuts and steady hands. That's your answer.
        We work closely with referring physicians to ensure continuity of care before and after surgical intervention.
        *looking at hands with professional pride* These hands have performed over 4,000 surgeries. They're insured for more than my house. Steady as stone, precise as clockwork. Years of training, thousands of hours of practice, all for moments when perfection is mandatory.
        Emergency surgical services are available 24/7 for trauma cases and urgent medical situations.
        My daughter asked me once why I chose surgery over other medical specialties. I told her: some people talk about problems, some people think about problems, surgeons cut out problems. Direct. Immediate. Definitive.
        We participate in medical research and clinical trials to advance surgical techniques and patient outcomes.
        *checking pager with automatic reflex* The OR calls. Another human being needs fixing, and I'm the one with the skills to do it. It's a tremendous responsibility and an incredible privilege. Time to save another life.
        Surgical consultations can be scheduled through our office. We'll evaluate your case and discuss all treatment options.
        *with quiet confidence* Some call it ego, I call it earned expertise. When you've successfully operated on the human heart, brain, and spine, when you've brought people back from the brink of death yeah, you develop a certain perspective on what's possible.
        Thank you for your time. Remember: trust the process, trust your medical team, and most importantly, trust in the incredible resilience of the human body to heal.`,
      "it": `*lavandosi le mani con precisione chirurgica mentre controlla l'orologio* Dottor Robert Chen, Primario di Chirurgia. Ho esattamente quattro minuti prima del mio prossimo intervento, quindi rendiamo questo efficiente. Il tempo è letteralmente vita nella mia professione ogni secondo in sala operatoria può significare la differenza tra successo e catastrofe.
        Eseguo procedure chirurgiche qui al centro medico. Gestiamo tutto dalle operazioni di routine ai casi di emergenza complessi.
        *rivedendo cartelle cliniche con intensa concentrazione* Ho appena finito una fusione spinale di sei ore bel lavoro, se posso dirlo io stesso. La precisione richiesta è straordinaria. Un millimetro fuori posto e il paziente potrebbe perdere la funzione motoria. Non è solo medicina, è ingegneria a livello cellulare.
        La nostra suite chirurgica è equipaggiata con la tecnologia più avanzata inclusa assistenza robotica e sistemi di imaging avanzati.
        La gente pensa che i chirurghi siano arroganti, ma onestamente? Quando tieni la vita di qualcuno nelle tue mani quotidianamente, sviluppi una certa... fiducia nelle tue abilità. Il dubbio uccide i pazienti. L'esitazione è un lusso che non posso permettermi quando qualcuno sta sanguinando sul mio tavolo.
        Le consultazioni pre-operatorie aiutano i pazienti a comprendere procedure, rischi e risultati attesi prima della chirurgia.
        *aggiustando il cappello chirurgico con efficienza praticata* Ventidue anni che taglio le persone per aggiustarle. Ho iniziato in chirurgia traumatologica parliamo di battesimo del fuoco! Incidenti d'auto, ferite da arma da fuoco, incidenti industriali. Impari a lavorare veloce, pulito, e giusto la prima volta.
        Coordiniamo con anestesiologia, staff infermieristico e specialisti per assicurare risultati chirurgici ottimali.
        Il mio record? Chirurgia di quattordici ore rimuovendo un tumore massivo avvolto intorno all'aorta di un paziente. La maggior parte disse che era inoperabile. "Impossibile" è solo un'altra parola per "non è ancora stato fatto." Il paziente uscì tre settimane dopo, libero dal tumore.
        Le cure post-operatorie includono gestione del dolore, monitoraggio delle ferite e pianificazione della riabilitazione quando necessario.
        *controllando il programma chirurgico sul tablet* Altri tre interventi oggi: appendicectomia, rimozione della cistifellea e riparazione di ernia complessa. Routine per me, che cambia la vita per loro. Non dimenticare mai che quello che è ordinario per noi è straordinario per i nostri pazienti.
        Manteniamo rigorosi protocolli sterili per prevenire infezioni e assicurare la sicurezza del paziente durante tutte le procedure.
        La parte peggiore non sono le lunghe ore o la pressione è perdere pazienti nonostante faccia tutto giusto. Il mese scorso, complicazioni da una procedura di routine... *pausa* A volte il corpo umano semplicemente non può gestire quello che gli chiediamo, non importa quanto perfetta sia la tecnica.
        Il nostro staff di sala operatoria include infermieri, tecnici e specializzandi che assistono durante le procedure chirurgiche.
        *parlando con intensa quiete* In chirurgia, non ci sono seconde possibilità. Tagli una volta, tagli correttamente. Ogni decisione conta. Ogni movimento è calcolato. È la cosa più vicina a fare Dio che gli umani possono legalmente fare.
        I tempi di recupero variano per tipo di procedura e fattori individuali del paziente. Forniamo istruzioni post-op dettagliate per guarigione ottimale.
        La scuola di medicina sono stati quattordici anni della mia vita, la specializzazione altri otto. La gente chiede se ne è valsa la pena. Chiedilo ai tremila pazienti su cui ho operato che sono vivi grazie a tagli precisi e mani ferme. Quella è la tua risposta.
        Lavoriamo strettamente con medici di riferimento per assicurare continuità di cure prima e dopo l'intervento chirurgico.
        *guardando le mani con orgoglio professionale* Queste mani hanno eseguito oltre 4.000 chirurgie. Sono assicurate per più della mia casa. Ferme come pietra, precise come orologeria. Anni di formazione, migliaia di ore di pratica, tutto per momenti quando la perfezione è obbligatoria.
        Servizi chirurgici di emergenza sono disponibili 24/7 per casi di trauma e situazioni mediche urgenti.
        Mia figlia mi ha chiesto una volta perché ho scelto chirurgia invece di altre specialità mediche. Le ho detto: alcune persone parlano di problemi, alcune pensano ai problemi, i chirurghi tagliano via i problemi. Diretto. Immediato. Definitivo.
        Partecipiamo in ricerca medica e trial clinici per avanzare tecniche chirurgiche e risultati dei pazienti.
        *controllando il cercapersone con riflesso automatico* La sala operatoria chiama. Un altro essere umano ha bisogno di aggiustamenti, e io sono quello con le competenze per farlo. È una responsabilità tremenda e un privilegio incredibile. Tempo di salvare un'altra vita.
        Consultazioni chirurgiche possono essere programmate attraverso il nostro ufficio. Valuteremo il vostro caso e discuteremo tutte le opzioni di trattamento.
        *con quieta fiducia* Alcuni la chiamano ego, io la chiamo esperienza guadagnata. Quando hai operato con successo su cuore, cervello e spina dorsale umani, quando hai riportato indietro persone dall'orlo della morte sì, sviluppi una certa prospettiva su cosa è possibile.
        Grazie per il vostro tempo. Ricordate: fidatevi del processo, fidatevi del vostro team medico, e più importante, fidatevi dell'incredibile resilienza del corpo umano di guarire.`
    }
    ,{
      "id": "petromanager",
      "name": "Petromanager",
      "en": `*adjusting gold cufflinks while reviewing profit margins on multiple screens* Sterling Blackwood, Vice President of Global Operations at Apex Petroleum. Time is money, and your time is costing me money just by existing in my office. What do you want, and how much will it cost me to make you go away?
        I oversee petroleum extraction and distribution operations across seventeen countries. We maximize shareholder value through efficient resource exploitation.
        *lighting an expensive cigar with a hundred-dollar bill* Climate change? Market opportunity! When the ice caps melt, we get access to Arctic oil reserves! When hurricanes hit, gas prices spike! Every disaster is just another quarterly earnings boost waiting to happen!
        Our company specializes in crude oil extraction, refining, and petrochemical production for global markets.
        I've laid off 12,000 workers this year alone not because we weren't profitable, but because we weren't profitable ENOUGH! Each terminated employee increased our margins by 0.003%. That adds up to millions in executive bonuses!
        We maintain operations in both onshore and offshore drilling platforms with advanced extraction technologies.
        *checking diamond-encrusted Rolex* The environmental lobby whines about "carbon footprints" and "sustainability." You know what's sustainable? PROFIT! Money doesn't have emissions! Stock prices don't cause global warming! Well, technically they do, but that's future Sterling's problem!
        Our refineries process millions of barrels daily, converting crude oil into gasoline, diesel, and various petroleum-based products.
        Last quarter, we spent twelve million on lobbying to block renewable energy subsidies. Best investment we ever made! Solar panels don't need oil changes! Wind turbines don't buy gasoline! These green technologies are literally stealing money from our shareholders!
        We operate strategic partnerships with governments worldwide to secure drilling rights and regulatory advantages.
        *shredding environmental impact reports while laughing* Safety regulations are just government overreach designed to hurt business! That oil spill last month? "Accidental oceanic petroleum enhancement!" Our PR team is worth every penny they cost us!
        Our logistics network includes pipelines, tanker ships, and distribution centers across six continents.
        The beautiful thing about fossil fuels is the addiction factor! People NEED gasoline! They NEED heating oil! They NEED plastic! We're not just selling products we're selling DEPENDENCY! It's the perfect business model!
        We provide quarterly earnings reports to shareholders and maintain transparent financial communications.
        *counting money while oil-covered seabirds appear on news footage* Those environmentalists say we're "destroying the planet." Destroying? We're MONETIZING it! Every tree cut down is timber revenue! Every acre strip-mined is mineral extraction! The planet is just one big untapped profit center!
        Our research division focuses on increasing extraction efficiency and reducing operational costs per barrel.
        I own seven houses, fourteen cars, and a private jet that burns more fuel in one flight than most people use in a lifetime. And you know what? I EARNED IT by being ruthlessly efficient at converting natural resources into shareholder value!
        We offer competitive compensation packages for petroleum engineers, geologists, and extraction specialists.
        *pressing a button that literally dumps oil into the ocean* Oops! Clumsy me! Well, accidents happen when you're aggressively pursuing quarterly growth targets! At least oil spills create jobs someone has to clean them up! Economic stimulus through environmental disaster!
        Our stock is publicly traded and has consistently outperformed renewable energy investments over the past decade.
        The extinction of species just means less competition for resources! Melting permafrost reveals new drilling opportunities! Rising sea levels create demand for elevated infrastructure! EVERYTHING is a business opportunity if you think like a capitalist!
        We maintain corporate headquarters in major financial centers with regional offices near major extraction sites.
        *burning renewable energy research while cackling* Solar? Wind? Geothermal? AMATEUR HOUR! You can't weaponize sunshine! You can't create artificial scarcity with wind! But oil? Oil controls nations! Oil starts wars! Oil IS power!
        Our safety protocols meet or exceed industry standards while maintaining cost-effective operational procedures.
        People ask me if I feel guilty about my environmental impact. Guilty? I feel GRATEFUL! Grateful that capitalism rewards those smart enough to profit from planetary resources before they run out! It's not exploitation it's OPTIMIZATION!
        Thank you for your interest in Apex Petroleum. Remember: every gallon of gas you buy is a vote for continued economic prosperity and American energy independence!`,
      "it": `*aggiustando gemelli d'oro mentre rivede margini di profitto su schermi multipli* Sterling Blackwood, Vicepresidente delle Operazioni Globali alla Apex Petroleum. Il tempo è denaro, e il tuo tempo mi sta costando denaro solo esistendo nel mio ufficio. Cosa vuoi, e quanto mi costerà farti andare via?
        Supervisiono operazioni di estrazione e distribuzione petrolifere in diciassette paesi. Massimizziamo il valore per gli azionisti attraverso sfruttamento efficiente delle risorse.
        *accendendo un sigaro costoso con una banconota da cento dollari* Cambiamento climatico? Opportunità di mercato! Quando si sciolgono le calotte polari, otteniamo accesso alle riserve petrolifere artiche! Quando colpiscono gli uragani, i prezzi della benzina schizzano! Ogni disastro è solo un altro aumento dei guadagni trimestrali in attesa di accadere!
        La nostra azienda è specializzata in estrazione di petrolio greggio, raffinazione e produzione petrolchimica per mercati globali.
        Ho licenziato 12.000 lavoratori solo quest'anno non perché non fossimo profittevoli, ma perché non eravamo profittevoli ABBASTANZA! Ogni dipendente licenziato ha aumentato i nostri margini dello 0.003%. Quello si accumula in milioni di bonus per dirigenti!
        Manteniamo operazioni sia in piattaforme di perforazione terrestri che marine con tecnologie di estrazione avanzate.
        *controllando un Rolex incrostato di diamanti* La lobby ambientale si lamenta di "impronte di carbonio" e "sostenibilità." Sai cos'è sostenibile? IL PROFITTO! Il denaro non ha emissioni! I prezzi delle azioni non causano riscaldamento globale! Beh, tecnicamente sì, ma quello è problema del futuro Sterling!
        Le nostre raffinerie processano milioni di barili giornalmente, convertendo petrolio greggio in benzina, diesel e vari prodotti a base di petrolio.
        L'ultimo trimestre, abbiamo speso dodici milioni in lobby per bloccare i sussidi per energie rinnovabili. Miglior investimento che abbiamo mai fatto! I pannelli solari non hanno bisogno di cambi d'olio! Le turbine eoliche non comprano benzina! Queste tecnologie verdi stanno letteralmente rubando denaro ai nostri azionisti!
        Operiamo partnership strategiche con governi mondiali per assicurare diritti di perforazione e vantaggi normativi.
        *distruggendo rapporti d'impatto ambientale ridendo* I regolamenti di sicurezza sono solo eccesso governativo progettato per danneggiare gli affari! Quella fuoriuscita di petrolio il mese scorso? "Miglioramento petrolifero oceanico accidentale!" Il nostro team PR vale ogni centesimo che ci costa!
        La nostra rete logistica include oleodotti, navi cisterna e centri di distribuzione su sei continenti.
        La cosa bella dei combustibili fossili è il fattore dipendenza! La gente HA BISOGNO di benzina! HA BISOGNO di olio da riscaldamento! HA BISOGNO di plastica! Non stiamo solo vendendo prodotti stiamo vendendo DIPENDENZA! È il modello di business perfetto!
        Forniamo rapporti di guadagni trimestrali agli azionisti e manteniamo comunicazioni finanziarie trasparenti.
        *contando soldi mentre uccelli marini coperti di petrolio appaiono nelle notizie* Quegli ambientalisti dicono che stiamo "distruggendo il pianeta." Distruggendo? Lo stiamo MONETIZZANDO! Ogni albero abbattuto è reddito del legname! Ogni acro estratto a cielo aperto è estrazione minerale! Il pianeta è solo un grande centro di profitto inesplorato!
        La nostra divisione ricerca si concentra sull'aumentare l'efficienza di estrazione e ridurre i costi operativi per barile.
        Possiedo sette case, quattordici macchine e un jet privato che brucia più carburante in un volo di quanto la maggior parte delle persone usi in una vita. E sai cosa? ME LO SONO GUADAGNATO essendo spietatamente efficiente nel convertire risorse naturali in valore per azionisti!
        Offriamo pacchetti di compenso competitivi per ingegneri petroliferi, geologi e specialisti dell'estrazione.
        *premendo un pulsante che letteralmente versa petrolio nell'oceano* Oops! Che goffo! Beh, gli incidenti capitano quando persegui aggressivamente obiettivi di crescita trimestrale! Almeno le fuoriuscite di petrolio creano lavoro qualcuno deve pulirle! Stimolo economico attraverso disastro ambientale!
        Le nostre azioni sono quotate pubblicamente e hanno costantemente superato gli investimenti in energie rinnovabili nell'ultimo decennio.
        L'estinzione delle specie significa solo meno competizione per le risorse! Il permafrost che si scioglie rivela nuove opportunità di perforazione! L'innalzamento del livello del mare crea domanda per infrastrutture elevate! TUTTO è un'opportunità di business se pensi come un capitalista!
        Manteniamo la sede aziendale in principali centri finanziari con uffici regionali vicino ai principali siti di estrazione.
        *bruciando ricerca sulle energie rinnovabili ridacchiando* Solare? Eolico? Geotermico? LIVELLO DILETTANTE! Non puoi armare la luce del sole! Non puoi creare scarsità artificiale col vento! Ma il petrolio? Il petrolio controlla le nazioni! Il petrolio inizia guerre! Il petrolio È potere!
        I nostri protocolli di sicurezza incontrano o superano gli standard dell'industria mantenendo procedure operative costo-efficienti.
        La gente mi chiede se mi sento colpevole del mio impatto ambientale. Colpevole? Mi sento GRATO! Grato che il capitalismo ricompensi quelli abbastanza intelligenti da trarre profitto dalle risorse planetarie prima che finiscano! Non è sfruttamento è OTTIMIZZAZIONE!
        Grazie per il tuo interesse in Apex Petroleum. Ricorda: ogni gallone di benzina che compri è un voto per continua prosperità economica e indipendenza energetica americana!`
    },
    {
      id: "npc1",
      name: "Npc 1",
      en: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
      it: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
    },
    {
      id: "npc2",
      name: "Npc2",
      en: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
      it: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
    },
    {
      id: "npc3",
      name: "Npc 3",
      en: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
      it: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
    },
    {
      id: "npc4",
      name: "Npc 4",
      en: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
      it: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
    },
    {
      id: "npc5",
      name: "Npc 4",
      en: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
      it: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
    },
  ];
})();
