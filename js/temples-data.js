/* =====================================================================
   SWIATYNIE: SCIEZKA INTENCJI  /  TEMPLES: A PATH OF INTENTIONS
   ---------------------------------------------------------------------
   Osobna podstrona (temples.html). Trzy dni w Angkorze: 3, 4 i 5.11.2026.
   Zdjecia: assets/temples/*.webp (Wikimedia Commons, wolne licencje).
   Kredyty: TRIP.temples.photoCredits (generowane z lab/temples-photos.json).
   ===================================================================== */
(function () {
  'use strict';
  const L = (pl, en) => ({ pl, en });

  TRIP.temples = {
    checked: '2026-10-08',

    ui: {
      eyebrow: L('Siem Reap · 3 do 5 listopada', 'Siem Reap · 3 to 5 November'),
      title: L('Ścieżka intencji', 'A path of intentions'),
      lede: L(
        'Trzy dni w Angkorze układają się w jedną opowieść: najpierw siła, potem oczyszczenie, na końcu miłość i nowy początek. Każda świątynia ma tu dwie warstwy. Pierwsza to fakty, bo bez nich miejsce zostaje tylko tłem do zdjęć. Druga to intencja, którą można tam zostawić. Intencje są nasze, nie khmerskie: żadna inskrypcja nie mówi, o co prosić w Ta Prohm. Są jednak zgodne z tym, czym to miejsce było i co po nim zostało.',
        'Three days at Angkor form a single story: strength first, then cleansing, and at the end love and a new beginning. Each temple here has two layers. First the facts, because without them a place becomes only a backdrop. Second an intention you can leave there. The intentions are ours, not Khmer: no inscription tells you what to ask for at Ta Prohm. They do, however, follow what each place was and what remains of it.'),
      intentionLabel: L('Intencja', 'Intention'),
      factsLabel: L('Co to za miejsce', 'What this place is'),
      whyLabel: L('Dlaczego tutaj', 'Why here'),
      doLabel: L('Na miejscu', 'On the spot'),
      dayLabel: L('Dzień', 'Day'),
      backLabel: L('Wróć do planera', 'Back to the planner'),
      storyLabel: L('Opowieść', 'Story'),
      guideLabel: L('Przewodnik', 'Guide'),
      plannerLabel: L('Planer', 'Planner'),
      skipLabel: L('Przejdź do świątyń', 'Skip to the temples'),
      languageLabel: L('Język', 'Language'),
      daysLabel: L('Dni', 'Days'),
      metaDescription: L('Trzy dni w Angkorze jako jedna opowieść: dwanaście świątyń, fakty, intencje i khmerskie praktyki. 3 do 5 listopada 2026.', 'Three days at Angkor as one story: twelve temples, facts, intentions and Khmer practices. 3 to 5 November 2026.'),
      sourcesLabel: L('Źródła', 'Sources'),
      photoSourcesLabel: L('Zdjęcia', 'Photographs'),
      photoSourcesIntro: L('Wszystkie zdjęcia pochodzą z Wikimedia Commons na wolnych licencjach. Pełna lista autorów i licencji poniżej.', 'All photographs come from Wikimedia Commons under free licences. Full list of authors and licences below.'),
      wishesTitle: L('Trzy życzenia na całą podróż', 'Three wishes for the whole journey'),
      wishesLede: L('Zamiast dwunastu osobnych życzeń lepiej mieć trzy, powtarzane w kilku miejscach. Zostaje z tego jedna historia, nie lista.', 'Instead of twelve separate wishes it is better to have three, repeated in several places. What stays with you is one story, not a list.'),
      ritualsTitle: L('Jak to robią Khmerowie', 'How Khmer people do it'),
      ritualsLede: L('To nie są nasze wymysły, tylko praktyki, które zobaczycie na miejscu. Można je powtórzyć albo tylko zrozumieć, co się dzieje obok Was.', 'These are not our inventions but practices you will see on the spot. You can join in, or simply understand what is happening beside you.'),
      etiquetteTitle: L('Zasady, które naprawdę obowiązują', 'Rules that really apply'),
      beyondTitle: L('Poza Angkorem, w mieście', 'Beyond Angkor, in town'),
      practicalTitle: L('Praktycznie: świt, bilety, upał', 'Practical: sunrise, tickets, heat'),
      note: L('Fakty sprawdzone {date}. Ceny i godziny potwierdźcie na miejscu.', 'Facts checked {date}. Confirm prices and opening hours locally.'),
      jump: L('Przejdź do dnia', 'Jump to day')
    },

    arc: [
      { d: 1, date: L('3 listopada', '3 November'), t: L('Siła i kierunek', 'Strength and direction'),
        s: L('Największe i najbardziej znane świątynie. Dzień o tym, co chcecie zacząć.', 'The largest and best known temples. A day about what you want to begin.') },
      { d: 2, date: L('4 listopada', '4 November'), t: L('Odnowa i stabilność', 'Renewal and stability'),
        s: L('Wielki krąg: ciszej, mniej ludzi, woda i kamień. Dzień o zdrowiu i oparciu.', 'The grand circuit: quieter, fewer people, water and stone. A day about health and ground under your feet.') },
      { d: 3, date: L('5 listopada', '5 November'), t: L('Miłość i nowe życie', 'Love and new life'),
        s: L('Najpiękniejsze rzeźby i świątynia zjedzona przez dżunglę. Dzień o tym, co ma przyjść.', 'The finest carving and a temple swallowed by jungle. A day about what is still to come.') }
    ],

    wishes: [
      { t: L('Na Angkor Wat, o świcie', 'At Angkor Wat, at sunrise'),
        w: L('Otwieram nowy, mocny etap swojego życia.', 'I am opening a new, strong chapter of my life.') },
      { t: L('Na Ta Prohm i Pre Rup', 'At Ta Prohm and Pre Rup'),
        w: L('Odpuszczam przeszłość i wszystko, co nie jest już moje.', 'I let go of the past and everything that is no longer mine.') },
      { t: L('Na Banteay Srei i Beng Mealea', 'At Banteay Srei and Beng Mealea'),
        w: L('Niech przyjdzie wzajemna miłość, stabilność i nowe szczęście.', 'May mutual love, stability and new happiness come.') }
    ],

    stops: [
      {
        id: 'angkorwat', day: 1, n: 1,
        name: L('Angkor Wat', 'Angkor Wat'),
        theme: L('Główne życzenie życia', 'The main wish of your life'),
        facts: L(
          'Największy kompleks religijny świata: 162,6 hektara w obrębie dawnej stolicy. Zbudowany między 1113 i 1150 rokiem przez Surjawarmana II jako świątynia Wisznu, od końca XIII wieku stopniowo zamieniany na buddyjski i do dziś czynny ośrodek kultu. Pięć wież to Meru, góra w środku świata, a fosa to ocean, który ją okala. Jedyna taka rzecz w Angkorze: świątynia jest zwrócona na zachód, nie na wschód.',
          'The largest religious complex in the world: 162.6 hectares inside the medieval capital. Built between 1113 and 1150 by Suryavarman II as a temple to Vishnu, gradually turned Buddhist from the late 13th century and an active place of worship to this day. The five towers are Meru, the mountain at the centre of the world, and the moat is the ocean around it. Unique at Angkor: the temple faces west, not east.'),
        why: L(
          'Zachodnia orientacja wiąże tę świątynię ze schodzącym słońcem, a więc z końcem i początkiem zarazem. To najlepsze miejsce na jedno życzenie, nie dziesięć.',
          'Facing west ties this temple to the setting sun, and so to an ending and a beginning at once. This is the place for one wish, not ten.'),
        intention: L(
          'Niech w moim życiu otworzy się właściwa droga. Niech następny etap będzie mocniejszy, spokojniejszy i szczęśliwszy od poprzedniego.',
          'May the right path open in my life. May the next chapter be stronger, calmer and happier than the last.'),
        todo: L(
          'Przy świcie nie biegnijcie od razu do stawu po odbicie wież. Wejdźcie głębiej, do krzyżowej galerii Preah Poan, Sali Tysiąca Buddów: to tam przez wieki pielgrzymi zostawiali figury i napisy, a japońska mapa z XVII wieku mówiła o czterech tysiącach złotych Buddów. Przy zachodniej bramie stoi pięciometrowy, ośmioramienny Wisznu, którego Khmerowie nazywają Ta Reach i uważają za najpotężniejszego opiekuna tej ziemi. To przed nim, nie przed stawem, modlą się miejscowi: przynoszą kwiaty lotosu i kadzidło, a potem wracają podziękować, kiedy prośba się spełni.',
          'At sunrise do not rush straight to the pond for the reflection shot. Go deeper, into the cruciform gallery Preah Poan, the Hall of a Thousand Buddhas: for centuries pilgrims left statues and inscriptions there, and a 17th century Japanese map spoke of four thousand golden Buddhas. By the western gate stands a five metre, eight armed Vishnu whom Khmer people call Ta Reach and consider the most powerful guardian of this land. It is before him, not the pond, that locals pray: they bring lotus flowers and incense, and they return to give thanks when a request is granted.'),
        src: ['wikiAW', 'taReach', 'preahPoan']
      },
      {
        id: 'angkorthom', day: 1, n: 2,
        name: L('Angkor Thom', 'Angkor Thom'),
        theme: L('Ochrona i wewnętrzna siła', 'Protection and inner strength'),
        facts: L(
          'Nazwa znaczy Wielkie Miasto. Ostatnia i najtrwalsza stolica imperium Khmerów, założona pod koniec XII wieku przez Dżajawarmana VII: dziewięć kilometrów kwadratowych za murem i fosą. Do południowej bramy prowadzi grobla, na której po jednej stronie bogowie, a po drugiej demony ciągną ciało węża naga.',
          'The name means Great City. The last and most enduring capital of the Khmer Empire, founded in the late 12th century by Jayavarman VII: nine square kilometres behind a wall and a moat. A causeway leads to the south gate, with gods on one side and demons on the other pulling the body of a naga serpent.'),
        why: L(
          'Mur, fosa i brama pilnowana przez twarze to w czystej formie pomysł na granicę: co wpuszczam, a czego nie.',
          'A wall, a moat and a gate watched over by faces: this is the idea of a boundary in its purest form, what you let in and what you do not.'),
        intention: L(
          'Niech wszystko, co mi szkodzi, zostanie za bramą. Niech mam siłę chronić swoje granice i swój spokój.',
          'May everything that harms me stay outside the gate. May I have the strength to protect my boundaries and my peace.'),
        todo: L(
          'Przejdźcie bramę południową pieszo, nie tuk-tukiem. Dwadzieścia trzy metry wysokości widać dopiero z dołu, a przeciąg w tunelu jest jedynym chłodnym miejscem tego dnia. Zostawcie za sobą jedną rzecz, nazwaną po imieniu.',
          'Walk through the south gate instead of riding under it. Its twenty three metres only register from below, and the draught in the tunnel is the one cool spot of the day. Leave one thing behind, and name it.'),
        src: ['wikiAT']
      },
      {
        id: 'bayon', day: 1, n: 3,
        name: L('Bayon', 'Bayon'),
        theme: L('Mądrość i właściwi ludzie', 'Wisdom and the right people'),
        facts: L(
          'Świątynia państwowa Dżajawarmana VII w samym środku Angkor Thom, z końca XII albo początku XIII wieku. Pomyślana jako pomnik mahajany wokół kultu bodhisattwy współczucia Awalokiteśwary, później przystosowana do buddyzmu therawady. Ponad dwieście wielkich kamiennych twarzy, spokojnych i patrzących w każdą stronę.',
          'The state temple of Jayavarman VII at the very centre of Angkor Thom, from the late 12th or early 13th century. Conceived as a Mahayana monument around the cult of Avalokiteshvara, the bodhisattva of compassion, later adapted to Theravada Buddhism. More than two hundred huge stone faces, calm, looking in every direction.'),
        why: L(
          'Twarze nie oceniają, tylko widzą. O to tu chodzi: widzieć ludzi takimi, jacy są, bez dorabiania im historii.',
          'The faces do not judge, they see. That is the point here: to see people as they are, without inventing stories for them.'),
        intention: L(
          'Niech widzę ludzi takimi, jacy są. Niech obok mnie zostają szczerzy i wartościowi.',
          'May I see people as they are. May the sincere and worthy ones stay beside me.'),
        todo: L(
          'Na trzecim poziomie staniecie w miejscu, gdzie kilka twarzy patrzy na Was jednocześnie. Spójrzcie też na dolne krużganki: tam nie ma bogów, tylko targ, połowy, kucharze, rodzące kobiety i żołnierze. Zwykłe życie z końca XII wieku, wycięte w kamieniu.',
          'On the third level you will find a spot where several faces look at you at once. Then look at the lower galleries: no gods there, just a market, fishing, cooks, women giving birth and soldiers. Ordinary late 12th century life, cut into stone.'),
        src: ['wikiBayon']
      },
      {
        id: 'baphuon', day: 1, n: 4,
        name: L('Baphuon', 'Baphuon'),
        theme: L('Wejść wyżej', 'To climb higher'),
        facts: L(
          'Świątynia-góra na sztucznym wzniesieniu, na północny zachód od Bayonu, zwana też Złotą Górą. Pierwotnie poświęcona Śiwie, później zamieniona na buddyjską. W XX wieku rozebrana kamień po kamieniu do rekonstrukcji metodą anastylozy, a potem porzucona na dekady, gdy wojna zniszczyła plany: trzysta tysięcy bloków trzeba było ułożyć bez instrukcji. Otwarta ponownie w 2011 roku.',
          'A temple mountain on an artificial hill north west of the Bayon, also called the Golden Mountain. Originally dedicated to Shiva, later converted to Buddhism. In the 20th century it was taken apart stone by stone for anastylosis, then abandoned for decades when war destroyed the plans: three hundred thousand blocks had to be reassembled without instructions. Reopened in 2011.'),
        why: L(
          'Największe puzzle świata, ułożone do końca. Dobre miejsce na życzenie o wchodzeniu poziom wyżej, bo tutaj to się udało.',
          'The largest jigsaw in the world, finally completed. A good place for a wish about moving up a level, because here it actually worked.'),
        intention: L(
          'Niech wchodzę na nowy poziom: zawodowo, finansowo i osobiście. Stary poziom zostawiam poniżej.',
          'May I rise to a new level: professionally, financially and personally. I leave the old level below me.'),
        todo: L(
          'Wejdźcie po wschodnich schodach i obejrzyjcie się dopiero na górze. Po zachodniej stronie leży siedemdziesięciometrowy leżący Budda, zbudowany z kamieni świątyni kilkaset lat po jej powstaniu: z bliska to ściana, z dystansu twarz.',
          'Climb the eastern stairs and only look back from the top. On the western side lies a seventy metre reclining Buddha, built from the temple\'s own stones centuries after it was raised: from close up it is a wall, from a distance a face.'),
        src: ['wikiBaphuon']
      },
      {
        id: 'taprohm', day: 1, n: 5,
        name: L('Ta Prohm', 'Ta Prohm'),
        theme: L('Odpuścić przeszłość', 'Let the past go'),
        facts: L(
          'Pierwotnie Radżawihara, założona pod koniec XII wieku przez Dżajawarmana VII jako klasztor i ośrodek nauki poświęcony jego matce. Inskrypcja mówi, że utrzymanie świątyni wymagało niemal osiemdziesięciu tysięcy ludzi, w tym ponad dwóch i pół tysiąca urzędników i sześciuset tancerzy. Celowo nie została odgruzowana: korzenie figowców i ceib rosną wprost przez mury.',
          'Originally Rajavihara, founded in the late 12th century by Jayavarman VII as a monastery and centre of learning dedicated to his mother. An inscription says the temple required almost eighty thousand people to maintain, including over two and a half thousand officials and six hundred dancers. It was deliberately left unrestored: fig and silk cotton roots grow straight through the walls.'),
        why: L(
          'To najmocniejsze miejsce tego dnia. Nic tu nie zostało odbudowane, a jednak żyje. Życie idzie dalej przez to, co się już zawaliło.',
          'This is the strongest place of the day. Nothing here was rebuilt, and yet it lives. Life continues straight through what has already collapsed.'),
        intention: L(
          'Odpuszczam wszystko, co nie jest już moje. Niech przeszłość przestanie mieć władzę nad moją przyszłością.',
          'I let go of everything that is no longer mine. May the past stop having power over my future.'),
        todo: L(
          'Nie proście tu o powrót nikogo z przeszłości. To miejsce działa w drugą stronę. Najsłynniejsze drzewo ma kolejkę, więc idźcie dalej, do wschodniego wejścia: tam korzenie są większe, a ludzi nie ma. Dotknijcie kamienia i zostawcie jedno imię albo jedną sprawę.',
          'Do not ask here for anyone from the past to come back. This place works the other way. The famous tree has a queue, so walk on to the eastern entrance: the roots there are bigger and nobody is around. Touch the stone and leave one name or one matter behind.'),
        src: ['wikiTaProhm']
      },

      {
        id: 'preahkhan', day: 2, n: 6,
        name: L('Preah Khan', 'Preah Khan'),
        theme: L('Siła po próbie', 'Strength after hardship'),
        facts: L(
          'Święty Miecz: świątynia z XII wieku, zbudowana przez Dżajawarmana VII dla jego ojca, na północny wschód od Angkor Thom. Działała jak miasto i uniwersytet zarazem, z niemal stu tysiącami urzędników i służby. Plan jest płaski, galerie idą kolejno jedna w drugą, a między nimi stoją hinduskie kaplice i późniejsze dobudówki. Jak Ta Prohm pozostawiona w dużej części nieodgruzowana.',
          'The Sacred Sword: a 12th century temple built by Jayavarman VII for his father, north east of Angkor Thom. It worked as a city and a university at once, with almost a hundred thousand officials and servants. The plan is flat, galleries running one into the next, with Hindu shrines and later additions between them. Like Ta Prohm it was largely left unrestored.'),
        why: L(
          'Świątynia zbudowana na miejscu wygranej bitwy i poświęcona ojcu. Wszystko trudne przekute w coś, co stoi.',
          'A temple raised on the site of a won battle and dedicated to a father. Everything hard, forged into something that stands.'),
        intention: L(
          'Niech wszystko trudne, przez co przeszłam, zamieni się w moją siłę.',
          'May everything difficult I have been through turn into my strength.'),
        todo: L(
          'Wejdźcie od wschodu i przejdźcie świątynię na przestrzał, do zachodniej bramy: korytarz zwęża się z każdą galerią, aż trzeba się schylić. Po drodze stoi dwukondygnacyjny budynek na okrągłych kolumnach, jedyny taki w Angkorze, i nikt nie wie, po co powstał.',
          'Enter from the east and walk the temple all the way through to the western gate: the corridor narrows with every gallery until you have to stoop. On the way stands a two storey building on round columns, the only one at Angkor, and nobody knows what it was for.'),
        src: ['wikiPreahKhan']
      },
      {
        id: 'neakpean', day: 2, n: 7,
        name: L('Neak Pean', 'Neak Pean'),
        theme: L('Zdrowie i oczyszczenie', 'Health and cleansing'),
        facts: L(
          'Sztuczna wyspa z okrągłą świątynią na środku zbiornika Dżajatataka, związana z Preah Khan i zbudowana za Dżajawarmana VII. Nazwa znaczy Splecione Węże, od dwóch nagów owijających podstawę. Cztery kwadratowe sadzawki wokół centralnej, a woda wypływa do nich przez rzygacze w formie głowy słonia, konia, lwa i człowieka. Miejsce leczenia, wzorowane na jeziorze Anawatapta, którego wody w wierzeniach miały uzdrawiać.',
          'An artificial island with a circular temple in the middle of the Jayatataka reservoir, linked to Preah Khan and built under Jayavarman VII. The name means Entwined Serpents, after two nagas wrapped around the base. Four square pools surround a central one, with water flowing in through spouts shaped as an elephant, a horse, a lion and a human head. A place of healing, modelled on Lake Anavatapta whose waters were believed to cure.'),
        why: L(
          'Jedyna świątynia w Angkorze zbudowana wokół wody i ciała. Prośba o zdrowie należy właśnie tutaj.',
          'The only temple at Angkor built around water and the body. A request for health belongs exactly here.'),
        intention: L(
          'Niech moje życie wypełnia się zdrowiem, spokojem, energią i równowagą.',
          'May my life fill with health, calm, energy and balance.'),
        todo: L(
          'Dojście prowadzi długą drewnianą kładką nad zbiornikiem, zwykle przez wodę albo przez wyschnięte dno, zależnie od pory roku. Do samych sadzawek już się nie wchodzi. To życzenie o Was, nie o kimś innym.',
          'The approach is a long wooden walkway over the reservoir, usually across water or a dry bed depending on the season. You can no longer step into the pools themselves. Make this wish about you, not about someone else.'),
        src: ['wikiNeakPean', 'neakPeanHeal']
      },
      {
        id: 'tasom', day: 2, n: 8,
        name: L('Ta Som', 'Ta Som'),
        theme: L('Uwolnienie', 'Release'),
        facts: L(
          'Mała świątynia z końca XII wieku, zbudowana przez Dżajawarmana VII dla jego ojca Dharanindrawarmana II, panującego między 1150 i 1160 rokiem. Jedna kaplica na jednym poziomie, obwiedziona murami z laterytu. Jak Preah Khan i Ta Prohm pozostawiona nieodgruzowana; od 1998 roku World Monuments Fund stabilizuje konstrukcję. Nad wschodnią bramą rośnie figowiec, który niemal całkowicie ją wchłonął.',
          'A small late 12th century temple built by Jayavarman VII for his father Dharanindravarman II, who reigned between 1150 and 1160. A single shrine on one level inside laterite enclosure walls. Like Preah Khan and Ta Prohm it was left unrestored; since 1998 the World Monuments Fund has been stabilising it. Over the eastern gate grows a fig tree that has almost completely swallowed it.'),
        why: L(
          'Drzewo nie zburzyło bramy, tylko ją objęło. Odpadło to, co miało odpaść, a reszta stoi.',
          'The tree did not destroy the gate, it embraced it. What had to fall away fell away, and the rest still stands.'),
        intention: L(
          'Niech wszystko zbędne odpadnie od mojego życia naturalnie, a to, co moje, zostanie.',
          'May everything surplus fall away from my life naturally, and may what is truly mine remain.'),
        todo: L(
          'Przejdźcie na wschodnią stronę, za świątynię: brama z drzewem jest właśnie tam, a większość grup nie dochodzi tak daleko. Tu będzie najciszej tego dnia.',
          'Walk round to the eastern side, behind the temple: the gate with the tree is there, and most groups never get that far. This will be the quietest moment of the day.'),
        src: ['wikiTaSom']
      },
      {
        id: 'eastmebon', day: 2, n: 9,
        name: L('East Mebon', 'East Mebon'),
        theme: L('Rodzina, dom i stabilność', 'Family, home and stability'),
        facts: L(
          'Świątynia z X wieku, z czasów Radżendrawarmana, postawiona na sztucznej wyspie na środku Wschodniego Baraju, zbiornika o długości siedmiu kilometrów, który dziś jest wyschnięty. Dojeżdża się do niej po lądzie, ale schody wciąż prowadzą z poziomu dawnej wody. Na narożnikach tarasów stoją dwumetrowe kamienne słonie, każdy wycięty z jednego bloku.',
          'A 10th century temple from the reign of Rajendravarman, raised on an artificial island in the middle of the East Baray, a seven kilometre reservoir that is dry today. You reach it over land, but the stairs still start at the old water level. Two metre stone elephants stand at the corners of the terraces, each carved from a single block.'),
        why: L(
          'Świątynia zbudowana jako Meru, góra świata, i jako dom dla pamięci o rodzicach. Stała na wodzie i stoi nadal, choć woda odeszła.',
          'A temple built as Meru, the world mountain, and as a home for the memory of parents. It stood on water and stands still, though the water is gone.'),
        intention: L(
          'Niech w moim życiu będzie stabilny dom, bezpieczeństwo finansowe i poczucie oparcia.',
          'May there be a stable home in my life, financial safety and a sense of ground beneath me.'),
        todo: L(
          'Podejdźcie do słoni z bliska i zobaczcie, że stoją zwrócone na zewnątrz, nie do świątyni: pilnują czterech stron świata. Z górnego tarasu widać płaski, zielony prostokąt dawnego jeziora.',
          'Walk up close to the elephants and notice they face outward, not toward the temple: they guard the four directions. From the upper terrace you can see the flat green rectangle of the former lake.'),
        src: ['wikiEastMebon']
      },
      {
        id: 'prerup', day: 2, n: 10,
        name: L('Pre Rup', 'Pre Rup'),
        theme: L('Zamknięcie starego etapu', 'Closing the old chapter'),
        facts: L(
          'Świątynia państwowa Radżendrawarmana, poświęcona w 961 albo na początku 962 roku: świątynia-góra z cegły, laterytu i piaskowca, pięć wież na szczycie wysokiego tarasu. Nazwa znaczy Obracanie Ciała i wiąże się z khmerskim rytuałem pogrzebowym, choć dzisiejsi badacze ostrożniej mówią o niej jako o królewskim krematorium.',
          'The state temple of Rajendravarman, consecrated in 961 or early 962: a temple mountain of brick, laterite and sandstone, five towers on a high terrace. The name means Turning the Body and is linked to a Khmer funeral rite, though scholars today are more careful about calling it a royal crematorium.'),
        why: L(
          'Nie bierzcie tego dosłownie. To nie miejsce o śmierci, a o zamykaniu: koniec dnia, koniec etapu, zachód słońca z góry.',
          'Do not take this literally. It is not a place about death but about closing: the end of a day, the end of a chapter, sunset from a height.'),
        intention: L(
          'Kończę stary etap. Wchodzę w nowy: lżejsza, mocniejsza i bardziej wolna.',
          'I am closing the old chapter. I step into the new one: lighter, stronger, freer.'),
        todo: L(
          'Zostawcie to na koniec dnia. Czerwony lateryt o zachodzie robi się niemal pomarańczowy i właśnie dlatego przyjeżdża tu wieczorem mniej ludzi niż na świt pod Angkor Wat. Schody są wysokie i bez poręczy, więc w klapkach będzie nieprzyjemnie.',
          'Keep it for the end of the day. The red laterite turns almost orange at sunset, and that is why fewer people come here in the evening than to the Angkor Wat sunrise. The stairs are steep with no handrail, so flip flops will be unpleasant.'),
        src: ['wikiPreRup']
      },

      {
        id: 'banteaysrei', day: 3, n: 11,
        name: L('Banteay Srei', 'Banteay Srei'),
        theme: L('Miłość i piękno', 'Love and beauty'),
        facts: L(
          'Świątynia z X wieku poświęcona Śiwie i Parwati, dwadzieścia pięć kilometrów na północny wschód od głównej grupy, przy wzgórzu Phnom Dei. Zbudowana w różowym piaskowcu, który pozwolił na rzeźbienie tak drobne, że przetrwało tysiąc lat. Budynki są miniaturowe według angkorskiej miary, a nazwa, Cytadela Kobiet, jest późniejsza. Uważana za klejnot sztuki khmerskiej.',
          'A 10th century temple dedicated to Shiva and Parvati, twenty five kilometres north east of the main group by the hill of Phnom Dei. Built in pink sandstone, which allowed carving so fine that it has survived a thousand years. The buildings are miniature by Angkorian standards, and the name Citadel of Women is later. Widely called the jewel of Khmer art.'),
        why: L(
          'Jedyne miejsce w Angkorze zbudowane nie na efekt skali, a na delikatność. Tu idzie życzenie o miłości.',
          'The one place at Angkor built not for scale but for delicacy. This is where a wish about love belongs.'),
        intention: L(
          'Niech w moje życie przyjdzie wzajemna, dojrzała, szczera miłość z człowiekiem, który mnie szanuje i wybiera.',
          'May mutual, mature, honest love come into my life, with a person who respects me and chooses me.'),
        todo: L(
          'Nie proście o powrót konkretnej osoby. Proście o rodzaj miłości, nie o adres. Obejdźcie świątynię wokół i poszukajcie tympanonu z Śiwą i Parwati na byku Nandinie oraz scen z Ramajany nad drzwiami: tu rzeźba jest głębsza niż gdziekolwiek w Angkorze.',
          'Do not ask for one specific person to return. Ask for a kind of love, not an address. Walk the full circuit and look for the pediment with Shiva and Parvati on the bull Nandin, and the Ramayana scenes above the doorways: the carving here is deeper than anywhere else at Angkor.'),
        src: ['wikiBanteaySrei']
      },
      {
        id: 'bengmealea', day: 3, n: 12,
        name: L('Beng Mealea', 'Beng Mealea'),
        theme: L('Nowe życie', 'New life'),
        facts: L(
          'Świątynia z epoki Angkor Wat, czterdzieści kilometrów na wschód od głównej grupy, przy dawnej królewskiej drodze do Preah Khan Kompong Svay. Plan jest architektonicznie bliski Angkor Wat, ale nigdy nie została odgruzowana: galerie się zawaliły, a dżungla weszła w każdą szczelinę. Zwiedza się ją po drewnianych pomostach i po blokach kamienia.',
          'A temple from the Angkor Wat period, forty kilometres east of the main group on the old royal road to Preah Khan Kompong Svay. Its plan is architecturally close to Angkor Wat, but it was never cleared: the galleries collapsed and the jungle moved into every crack. You visit it along wooden walkways and over blocks of stone.'),
        why: L(
          'Ostatnie życzenie całej angkorskiej części podróży. Tu widać dosłownie, jak z czegoś zburzonego rośnie coś nowego.',
          'The last wish of the whole Angkor part of the trip. Here you can literally see something new growing out of something ruined.'),
        intention: L(
          'Niech z tego, co wydawało się zniszczone, narodzi się coś nowego, piękniejszego i mocniejszego.',
          'May something new, more beautiful and stronger be born out of what seemed destroyed.'),
        todo: L(
          'To jest miejsce na kilka minut bez telefonu. Stańcie w środku zawalonej galerii, gdzie nad głową jest już tylko drzewo, i nie robcie zdjęcia. Potem możecie wrócić i zrobić. Uwaga na kamienie po deszczu: są śliskie, a pomosty nie wszędzie mają poręcz.',
          'This is the place for a few minutes without a phone. Stand in the middle of a collapsed gallery where there is nothing above you but a tree, and do not take the photo. You can come back and take it afterwards. Careful on the stones after rain: they are slippery and the walkways do not all have a rail.'),
        src: ['wikiBengMealea']
      }
    ],

    rituals: [
      { t: L('Trzy kadzidła, trzymane przy czole', 'Three incense sticks, held at your forehead'),
        d: L('Khmerowie zapalają trzy patyczki, trzymają je złożone w dłoniach na wysokości czoła i kłaniają się trzy razy. Trzy, bo Budda, jego nauka i wspólnota. Dopiero potem wtyka się je w piasek przed figurą. Jeśli chcecie to zrobić, kupcie kadzidło u kobiet przy wejściu, nie przynoście własnego.',
              'Khmer people light three sticks, hold them pressed between their palms at forehead height and bow three times. Three, for the Buddha, his teaching and the community. Only then are they planted in the sand before the statue. If you want to do this, buy the incense from the women at the entrance rather than bringing your own.') },
      { t: L('Czerwona albo biała nitka na przegubie', 'A red or white thread at your wrist'),
        d: L('Mnich zawiązuje nitkę na lewym przegubie i mówi nad nią błogosławieństwo. Nitki nie zdejmuje się z ręki: ma zejść sama. Zdarza się to przy ceremonii z wodą, w pagodach w mieście, nie przy kasie w Angkorze. Za błogosławieństwo nie płaci się cennika, zostawia się datek w skrzynce.',
              'A monk ties a thread on your left wrist and chants a blessing over it. You do not take the thread off: it should fall away on its own. This usually happens during a water ceremony, in town pagodas rather than at an Angkor ticket desk. There is no price for a blessing, you leave a donation in the box.') },
      { t: L('Święcona woda z wiązki gałązek', 'Holy water flicked from a bundle of twigs'),
        d: L('Mnich macza wiązkę w wodzie i rozbryzguje ją na głowę i ramiona, śpiewając w pali. To nie symbol: będziecie mokre i to jest właśnie ta część. Siada się na podłodze, stopy schowane do tyłu, nigdy wyciągnięte w stronę mnicha ani figury.',
              'The monk dips a bundle into water and flicks it over your head and shoulders while chanting in Pali. This is not symbolic: you will get wet, and that is the point. You sit on the floor with your feet tucked behind you, never pointing at the monk or a statue.') },
      { t: L('Lotos, nie kwiat cięty', 'A lotus, not a cut flower'),
        d: L('Pod figurami kładzie się zamknięte pąki lotosu, czasem z banknotem wsuniętym między liście. Lotos rośnie z mułu i otwiera się czysty: to cała nauka w jednym kwiatku. Kupuje się go przy wejściu, za drobne.',
              'Closed lotus buds are laid before the statues, sometimes with a banknote tucked between the leaves. The lotus grows out of mud and opens clean: the whole teaching in one flower. You buy it at the entrance for small change.') },
      { t: L('Neak ta: opiekun miejsca', 'Neak ta: the guardian of a place'),
        d: L('Obok buddyzmu działa w Kambodży starsza warstwa: neak ta, duchy opiekuńcze konkretnego miejsca. Ta Reach przy zachodniej bramie Angkor Wat jest najpotężniejszym z nich. Miejscowi przychodzą do niego z trudnymi sprawami i wracają podziękować, kiedy się ułoży. Dlatego przed tą figurą zawsze leży więcej kwiatów niż przed oficjalnymi ołtarzami.',
              'Alongside Buddhism, Cambodia keeps an older layer: neak ta, guardian spirits of a particular place. Ta Reach by the western gate of Angkor Wat is the most powerful of them. Locals come to him with hard problems and return to give thanks when things settle. That is why there are always more flowers before this figure than at the official altars.') },
      { t: L('Obchodzić zgodnie z ruchem zegara', 'Walk clockwise'),
        d: L('W świątyniach obchodzi się sanktuarium tak, aby mieć je po prawej ręce. W Angkorze nikt Was nie upomni, ale jeśli chcecie przejść te trzy dni jak pielgrzymkę, a nie jak zwiedzanie, to jest najprostsza rzecz, którą można robić świadomie w każdym z dwunastu miejsc.',
              'In temples you circle the sanctuary keeping it on your right. Nobody at Angkor will correct you, but if you want these three days to feel like a pilgrimage rather than sightseeing, this is the simplest thing you can do deliberately at all twelve places.') }
    ],

    etiquette: [
      { t: L('Zakryte ramiona i kolana', 'Shoulders and knees covered'),
        d: L('Obowiązuje wszędzie w Angkorze, a przy wejściu na górny poziom Angkor Wat sprawdzają to naprawdę i zawracają ludzi. Lekka długa koszula i spodnie albo spódnica za kolano. Nie ramiączka, nie krótkie szorty.',
              'This applies throughout Angkor, and at the entrance to the upper level of Angkor Wat it is actually checked and people are turned away. A light long sleeved shirt and trousers or a skirt below the knee. No strappy tops, no short shorts.') },
      { t: L('Buty i kapelusz zdejmowane tam, gdzie wszyscy', 'Shoes and hat off where everyone else does'),
        d: L('Przed czynnymi kaplicami stoi rząd butów: dołóżcie swoje. Kapelusz schodzi z głowy w środku.',
              'There will be a row of shoes outside active shrines: add yours. The hat comes off inside.') },
      { t: L('Nie dotykać i nie wspinać się na rzeźby', 'Do not touch or climb the carvings'),
        d: L('Piaskowiec ściera się od dłoni, dlatego najsłynniejsze reliefy są dziś wyblakłe właśnie tam, gdzie wszyscy kładli ręce. Nie siadać na krawędziach i nie wchodzić na mury.',
              'Sandstone wears away under hands, which is why the most famous reliefs are now faded exactly where everyone touched them. Do not sit on edges or climb the walls.') },
      { t: L('Kobiety nie dotykają mnichów', 'Women do not touch monks'),
        d: L('Nie podaje się rąk i nie wręcza niczego bezpośrednio do dłoni: kładzie się rzecz na stole albo na chustce. O zdjęcie trzeba zapytać i zazwyczaj jest zgoda.',
              'No handshakes and nothing handed straight into their hands: you put the item on a table or a cloth. Ask before taking a photo, and the answer is usually yes.') },
      { t: L('Nie odwracać się plecami do Buddy do zdjęcia', 'Do not turn your back on the Buddha for a photo'),
        d: L('Pozowanie plecami do figury, siedzenie na ołtarzu, zdjęcia z wyciągniętymi nogami w stronę figury: wszystko to jest tu uznawane za chamstwo, nawet jeśli nikt nie powie słowa.',
              'Posing with your back to a statue, sitting on an altar, photos with your legs stretched toward the figure: all of it reads as rude here, even if nobody says a word.') },
      { t: L('Nagość i bikini: nie', 'Nudity and bikinis: no'),
        d: L('Były zatrzymania i deportacje za sesje bez ubrania w Angkorze. Plażowe rzeczy zostają na wyspach.',
              'There have been arrests and deportations over naked photo shoots at Angkor. Beachwear stays on the islands.') }
    ],

    beyond: [
      { t: L('Preah Ang Chek Preah Ang Chorm', 'Preah Ang Chek Preah Ang Chorm'),
        d: L('Najżywsze miejsce kultu w samym Siem Reap, przy Ogrodach Niepodległości. Dwie brązowe figury, według Królewskiej Akademii Kambodży przedstawiające dwie angkorskie księżniczki, córki Surjawarmana II, czczone jako neak ta, opiekunki miasta. Pierwotnie stały w galerii Preah Poan w Angkor Wat, zginęły na wieki, odnalezione w 1950 roku w lesie pod Angkor Thom, a za Czerwonych Khmerów wrzucone do rzeki. Dzisiejsza kaplica stanęła w 1982 roku. Wstęp wolny. Wieczorem zapalają się tysiące lampek, a z drzew w ogrodach wylatują rudawki: to jedno z najlepszych miejsc w mieście na pół godziny bez planu.',
              'The most alive place of worship in Siem Reap itself, by the Royal Independence Gardens. Two bronze figures which the Royal Academy of Cambodia says represent two Angkorian princesses, daughters of Suryavarman II, revered as neak ta, guardians of the city. They originally stood in the Preah Poan gallery of Angkor Wat, were lost for centuries, rediscovered in 1950 in the forest near Angkor Thom, and thrown into the river under the Khmer Rouge. The present shrine was built in 1982. Free entry. In the evening thousands of small lights come on and flying foxes leave the garden trees: one of the best places in town for half an hour without a plan.'),
        src: ['preahAngChek'] },
      { t: L('Wat Bo', 'Wat Bo'),
        d: L('Najważniejsza i jedna z najstarszych pagod w mieście, prawdopodobnie z XVIII wieku, z ponad setką mnichów. W głównej sali zachowały się rzadkie malowidła z lat 1892 do 1911, głównie ze Reamkera, khmerskiej wersji Ramajany. To miejsce, gdzie można zobaczyć buddyzm jako codzienność, nie jako zabytek: szkoła, posiłki, pranie szat. Wejście za datek, rano najspokojniej.',
              'The most important and one of the oldest pagodas in town, probably 18th century, with over a hundred monks. The main hall keeps rare murals from 1892 to 1911, mostly from the Reamker, the Khmer version of the Ramayana. This is where you see Buddhism as daily life rather than a monument: a school, meals, robes drying. Entry by donation, quietest in the morning.'),
        src: ['watBo'] }
    ],

    practical: [
      { t: L('Bilet do Angkoru', 'The Angkor pass'),
        d: L('Angkor Pass kupuje się w oficjalnym centrum biletowym, nie przy świątyniach, i trzeba go mieć przy sobie cały czas: kontrola jest przy każdym kompleksie. Bilet trzydniowy wystarcza na tę trasę. Beng Mealea bywa rozliczana osobno. Ceny i zasady potwierdźcie u przewodnika albo w hotelu dzień wcześniej.',
              'The Angkor Pass is bought at the official ticket centre, not at the temples, and you must carry it at all times: there are checks at every complex. A three day pass covers this route. Beng Mealea is sometimes ticketed separately. Confirm prices and rules with your guide or hotel the day before.') },
      { t: L('Świt pod Angkor Wat', 'Sunrise at Angkor Wat'),
        d: L('Wyjazd przed świtem, godzinę ustalcie z hotelem: w listopadzie słońce wstaje około wpół do szóstej. Przy stawie będzie tłum, dlatego warto odejść kilkadziesiąt metrów w prawo albo wejść do świątyni, gdy wszyscy jeszcze stoją nad wodą.',
              'Leave before dawn and agree the time with the hotel: in November the sun rises around half past five. The pond will be crowded, so it is worth moving a few dozen metres to the right or walking into the temple while everyone is still standing by the water.') },
      { t: L('Upał i woda', 'Heat and water'),
        d: L('Listopad to początek pory suchej: gorąco i jasno, bez codziennych ulew. Dwa litry wody na osobę na dzień to minimum, kapelusz obowiązkowo, a największe świątynie zwiedzajcie przed dziesiątą i po trzeciej. Między dwunastą i trzecią nie ma cienia i nie ma sensu.',
              'November is the start of the dry season: hot and bright, without daily downpours. Two litres of water per person a day is the minimum, a hat is essential, and the biggest temples are best before ten and after three. Between noon and three there is no shade and no point.') },
      { t: L('Beng Mealea: daleko', 'Beng Mealea: far out'),
        d: L('Czterdzieści kilometrów w jedną stronę, więc tuk-tukiem to pół dnia, a autem znacznie mniej. Tego dnia wieczorem macie nocny autobus do Sihanoukville, więc umówcie powrót z zapasem i spakujcie się przed wyjazdem.',
              'Forty kilometres each way, so half a day by tuk-tuk and considerably less by car. That evening you have the night bus to Sihanoukville, so agree a return time with a margin and pack before you set off.') }
    ],

    sources: {
      wikiAW: { label: 'Wikipedia: Angkor Wat', url: 'https://en.wikipedia.org/wiki/Angkor_Wat' },
      wikiAT: { label: 'Wikipedia: Angkor Thom', url: 'https://en.wikipedia.org/wiki/Angkor_Thom' },
      wikiBayon: { label: 'Wikipedia: Bayon', url: 'https://en.wikipedia.org/wiki/Bayon' },
      wikiBaphuon: { label: 'Wikipedia: Baphuon', url: 'https://en.wikipedia.org/wiki/Baphuon' },
      wikiTaProhm: { label: 'Wikipedia: Ta Prohm', url: 'https://en.wikipedia.org/wiki/Ta_Prohm' },
      wikiPreahKhan: { label: 'Wikipedia: Preah Khan', url: 'https://en.wikipedia.org/wiki/Preah_Khan' },
      wikiNeakPean: { label: 'Wikipedia: Neak Pean', url: 'https://en.wikipedia.org/wiki/Neak_Pean' },
      neakPeanHeal: { label: 'Into Far Lands: Neak Pean', url: 'https://www.intofarlands.com/explore/neak-pean-angkor' },
      wikiTaSom: { label: 'Wikipedia: Ta Som', url: 'https://en.wikipedia.org/wiki/Ta_Som' },
      wikiEastMebon: { label: 'Wikipedia: East Mebon', url: 'https://en.wikipedia.org/wiki/East_Mebon' },
      wikiPreRup: { label: 'Wikipedia: Pre Rup', url: 'https://en.wikipedia.org/wiki/Pre_Rup' },
      wikiBanteaySrei: { label: 'Wikipedia: Banteay Srei', url: 'https://en.wikipedia.org/wiki/Banteay_Srei' },
      wikiBengMealea: { label: 'Wikipedia: Beng Mealea', url: 'https://en.wikipedia.org/wiki/Beng_Mealea' },
      taReach: { label: 'Cambodianess: Ta Reach', url: 'https://cambodianess.com/article/ta-reach-most-famous-sacred-sculpture-at-angkor-wat' },
      preahPoan: { label: 'Hello Angkor: Preah Poan', url: 'https://helloangkor.com/attractions/angkor-wat-preah-poan-hall-of-a-thousand-buddhas' },
      preahAngChek: { label: 'I Love Siem Reap: Preah Ang Chek', url: 'https://ilovesiemreap.com/preah-ang-chek-preah-ang-chorm-shrine-siem-reap' },
      watBo: { label: 'Easy Cambodia: Wat Bo', url: 'https://easy-cambodia.com/en/places/wat-bo-temple-siem-reap/' }
    }
  };
})();
