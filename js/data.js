/* =====================================================================
   DANE PODRÓŻY / TRIP DATA
   ---------------------------------------------------------------------
   Ten plik łatwo edytować w terminalu. Każdy tekst ma wersję {pl, en}.
   Zdjęcia: to PLACEHOLDERY z Wikimedia Commons — podmień "src" na swoje
   (np. "photos/angkor-1.jpg" — plik w folderze photos/ obok index.html),
   albo dodawaj zdjęcia z poziomu strony (zakładka „Zdjęcia i linki”).
   ===================================================================== */

const L = (pl, en) => ({ pl, en });
const WM = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';
const ph = (path, credit) => ({ src: WM + path, credit: 'Wikimedia Commons — ' + credit, placeholder: true });

const TRIP = {
  title: L('Kambodża 2026', 'Cambodia 2026'),
  travelers: [
    { id: 'dominika', name: 'Dominika', home: 'vienna', color: '#1f6b4f' },
    { id: 'oksana',   name: 'Oksana', home: 'brussels', color: '#c2621d' },
  ],
  baseCurrency: 'EUR',
  // Kursy startowe (ile EUR za 1 jednostkę) — edytowalne na stronie.
  defaultRates: { EUR: 1, USD: 0.86, KHR: 0.000215, CNY: 0.12 },
  money: {
    cambodia: L('Kambodża: ceny głównie w dolarach (hotele, tuk-tuki, Angkor Pass, restauracje). Bankomaty wypłacają zwykle USD. Riele (ok. 4000 KHR za 1 USD) dostaniecie jako resztę przy drobnych kwotach.', 'Cambodia: prices are mainly in US dollars (hotels, tuk-tuks, the Angkor Pass and restaurants). ATMs usually dispense USD. You will receive riel (about 4,000 KHR to 1 USD) as change for small amounts.'),
    cash: L('Weźcie trochę gotówki w USD: nowe, nienaddarte banknoty. Zniszczone bywają odrzucane.', 'Bring some cash in USD: new, untorn notes. Damaged notes are sometimes refused.'),
    china: L('Chiny: juan (CNY), ale płaci się głównie telefonem. Zainstalujcie i skonfigurujcie Alipay lub WeChat Pay z kartą przed wyjazdem.', 'China: the currency is the yuan (CNY), but most payments are made by phone. Install and set up Alipay or WeChat Pay with a card before you leave.'),
    settlement: L('Rozliczenie między Wami liczy się w EUR. Kursy walut poprawicie w zakładce Dane.', 'Your shared balance is calculated in EUR. You can adjust exchange rates in the Data tab.')
  },
  tripStart: '2026-10-31',
  tripEnd: '2026-11-12',
  // Pierwsza noc w Kambodży i liczba nocy do lotu powrotnego (noc 10/11 = lot 00:25)
  cambodiaFirstNight: '2026-11-01',
  cambodiaNights: 10,

  /* ------------------------------------------------------------------ LOTY */
  flights: [
    { id: 'CA844', dir: 'out', who: ['dominika'], airline: 'Air China', airlineRef: '', cabin: 'Economy', fromTerminal: '3', from: 'vienna', to: 'beijing', fromCode: 'VIE', toCode: 'PEK',
      dep: '2026-10-31T18:20', arr: '2026-11-01T10:40', dur: '9h20' },
    { id: 'CA745', dir: 'out', from: 'beijing',   to: 'phnompenh', fromCode: 'PEK', toCode: 'KTI',
      who: ['dominika', 'oksana'], airline: 'Air China', airlineRef: '', cabin: 'Economy', dep: '2026-11-01T19:00', arr: '2026-11-01T23:10', dur: '5h10' },
    { id: 'CA746', dir: 'ret', from: 'phnompenh', to: 'beijing',   fromCode: 'KTI', toCode: 'PEK',
      who: ['dominika', 'oksana'], airline: 'Air China', airlineRef: '', cabin: 'Economy', dep: '2026-11-11T00:25', arr: '2026-11-11T06:15', dur: '4h50' },
    { id: 'CA841', dir: 'ret', from: 'beijing',   to: 'vienna',    fromCode: 'PEK', toCode: 'VIE',
      who: ['dominika'], airline: 'Air China', airlineRef: '', cabin: 'Economy', fromTerminal: '3', dep: '2026-11-12T03:00', arr: '2026-11-12T06:20', dur: '10h20' },
    { id: 'CA964', flightNo: 'CA964', dir: 'out', who: ['oksana'], airline: 'Air China', airlineRef: '', cabin: 'Economy', from: 'brussels', to: 'beijing', fromCode: 'BRU', toCode: 'PEK',
      dep: '2026-10-31T12:00', arr: '2026-11-01T04:45', dur: '9h45' },
    { id: 'CA963', flightNo: 'CA963', dir: 'ret', who: ['oksana'], airline: 'Air China', airlineRef: '', cabin: 'Economy', from: 'beijing', to: 'brussels', fromCode: 'PEK', toCode: 'BRU',
      dep: '2026-11-12T02:30', arr: '2026-11-12T06:40', dur: '11h10' },
  ],
  airline: 'Air China',
  layovers: [
    { place: 'beijing', from: '2026-11-01T10:40', to: '2026-11-01T19:00', dur: L('8 godz. 20 min', '8 h 20 min') },
    { place: 'beijing', from: '2026-11-11T06:15', to: '2026-11-12T03:00', dur: L('ok. 20 godz. (Oksana 20 godz. 15 min, Dominika 20 godz. 45 min)', 'about 20 h (Oksana 20 h 15 min, Dominika 20 h 45 min)'), tour: L('09:00 · Starbucks, 2. piętro T3 · kierowca na Mutianyu', '09:00 · Starbucks, T3 level 2 · driver to Mutianyu') },
  ],

  /* ----------------------------------------------- POBYTY W KAMBODŻY (szkic)
     order = kolejność środkowych przystanków (można przeciągać w UI)
     pp1 zawsze pierwszy, pp2 zawsze ostatni.                               */
  defaultItinerary: {
    order: ['sr', 'shv', 'krs'],
    nights: { pp1: 1, sr: 3, shv: 0, krs: 3, pp2: 2 },
    transitNights: { 'siemreap>sihanoukville': 1 },
  },

  stays: {
    pp1: {
      place: 'phnompenh',
      arrive: L('Grab z lotniska Techo do hotelu, ok. 1 h; w łóżku około pierwszej', 'Grab from Techo Airport to the hotel, about 1 h; in bed around one'),
      days: [],
      leave: L('Rano: Pałac Królewski i Srebrna Pagoda (od 8:00), nabrzeże Sisowath Quay nad Mekongiem i Tonlé Sap, Muzeum Narodowe',
               'Morning: Royal Palace and Silver Pagoda (from 8:00), Sisowath Quay on the Mekong and Tonlé Sap, National Museum'),
    },
    sr: {
      place: 'siemreap',
      arrive: L('Ok. 18:30 przyjazd Giant Ibis na dworzec Giant Ibis w Siem Reap. Odbiór tuk-tukiem przez Angkor Piseth Retreat (2 USD), wieczorem Pub Street i nocny targ',
                'About 18:30 the Giant Ibis bus arrives at the Giant Ibis terminal in Siem Reap. Angkor Piseth Retreat picks you up by tuk-tuk (2 USD); Pub Street and the night market in the evening'),
      days: [
        L('Z przewodnikiem: wschód słońca nad Angkor Wat, Angkor Thom, Bayon, Baphuon i Ta Prohm. Wyjazd przed świtem, godzinę ustalcie z hotelem',
          'With your guide: sunrise at Angkor Wat, Angkor Thom, Bayon, Baphuon and Ta Prohm. Leave before dawn; agree the time with the hotel'),
        L('Z przewodnikiem, wielki krąg: Preah Khan, Neak Pean, Ta Som, East Mebon i Pre Rup',
          'With your guide, the grand circuit: Preah Khan, Neak Pean, Ta Som, East Mebon and Pre Rup'),
        L('Z przewodnikiem: Banteay Srei i dzika Beng Mealea (daleko: tuk-tukiem albo autem). Wróćcie przed nocnym autobusem',
          'With your guide: Banteay Srei and the jungle temple of Beng Mealea (far out: by tuk-tuk or car). Be back before the night bus'),
      ],
      leave: L('Nocny autobus z Siem Reap do Sihanoukville', 'Overnight bus from Siem Reap to Sihanoukville'),
    },
    shv: {
      place: 'sihanoukville',
      arrive: L('Rano przyjazd nocnym autobusem, przesiadka na prom', 'Morning arrival by overnight bus, transfer to the ferry'),
      days: [],
      leave: L('Prom na Koh Rong Samloem', 'Ferry to Koh Rong Samloem'),
    },
    kr: {
      place: 'kohrong',
      arrive: L('Zameldowanie, zachód słońca, nocna kąpiel ze świecącym planktonem', 'Check in, sunset, night swim with bioluminescent plankton'),
      days: [
        L('Szlak przez dżunglę Koh Touch → Long Set Beach, dzień na plaży', 'Jungle trail Koh Touch → Long Set Beach, beach day'),
        L('Sok San Beach — długa, pusta plaża na zachodnim brzegu', 'Sok San Beach — long empty beach on the west coast'),
      ],
      leave: L('Poranna kąpiel, prom na Koh Rong Samloem', 'Morning swim, ferry to Koh Rong Samloem'),
    },
    krs: {
      place: 'kohrongsamloem',
      arrive: L('Łódź z Sihanoukville wprost do M\'Pai Bay na północy wyspy, zameldowanie w M\'Pay Bay Guesthouse kilka kroków od pomostu. Zameldowanie od 14:00, cisza po 24:00',
               'A boat from Sihanoukville straight to M\'Pai Bay in the north of the island, check-in at M\'Pay Bay Guesthouse a few steps from the pier. Check-in from 14:00, quiet after midnight'),
      days: [
        L('Wioska rybacka za oknem: pomosty, łodzie z połowu, śniadanie przy wodzie. Po południu szlak przez dżunglę do latarni morskiej albo łodzią na Clear Water Bay',
          'The fishing village outside your window: jetties, boats back from the catch, breakfast by the water. In the afternoon the jungle trail to the lighthouse or a boat to Clear Water Bay'),
        L('Nic nie robić. Snorkeling przy rafie, książka w cieniu, a po zmroku kąpiel ze świecącym planktonem: plaża jest pod samym noclegiem',
          'Do nothing. Snorkelling by the reef, a book in the shade, and after dark a swim with glowing plankton: the beach is right below the guesthouse'),
      ],
      leave: L('Wymeldowanie do 11:00, poranna łódź na ląd z pomostu w M\'Pai Bay, potem Giant Ibis 13:30 z Sihanoukville, w Phnom Penh około 16:30', 'The morning boat to the mainland from the M\'Pai Bay pier, then Giant Ibis at 13:30 to Phnom Penh'),
    },
    pp2: {
      place: 'phnompenh',
      arrive: L('Giant Ibis przyjeżdża około 16:30. Grab z dworca do Hotel Sor1, zameldowanie i spokojny wieczór', 'Giant Ibis arrives around 16:30. Grab from the bus station to Hotel Sor1, then check-in and a quiet evening'),
      days: [
        L('Cały dzień bez bagaży, bo pokój zostaje Wasz do rana: Tuol Sleng (S-21), Pałac Królewski i Srebrna Pagoda, Russian Market, masaż i kolacja na dachu. Wieczorem prysznic, przepakowanie i wyjazd na lotnisko',
          'A whole day without luggage, because the room stays yours until morning: Tuol Sleng (S-21), the Royal Palace and Silver Pagoda, the Russian Market, a massage and dinner on a rooftop. In the evening a shower, repacking and the ride to the airport'),
      ],
      leave: L('~21:30 Grab na lotnisko KTI (ok. 1 h): lot CA746 startuje po północy, o 00:25 w środę 11.11. Noc 10/11 spędzacie w samolocie, ale pokój zostaje Wasz do 11.11, żeby nie taszczyć bagaży po mieście',
               '~21:30 leave for KTI airport (about 1 h): flight CA746 departs after midnight, at 00:25 on Wednesday 11 Nov. You spend the night of the 10th to 11th in the air, but the room stays yours until 11 Nov so you are not dragging luggage around town'),
    },
  },

  /* ------------------------------------------------------------- MIEJSCA */
  places: {
    vienna: {
      name: L('Wiedeń', 'Vienna'), country: L('Austria', 'Austria'), lat: 48.2082, lng: 16.3738, kind: 'hub',
      why: L('Start i meta Dominiki. Wylot CA844 w sobotę 31.10 o 18:20 (Terminal 3), powrót CA841 w czwartek 12.11 o 06:20.',
             'Dominika\'s start and finish. CA844 departs Saturday 31 Oct at 18:20 (Terminal 3), CA841 lands Thursday 12 Nov at 06:20.'),
      photos: [],
    },

    brussels: {
      name: L('Bruksela', 'Brussels'), country: L('Belgia', 'Belgium'), lat: 50.8503, lng: 4.3517, kind: 'hub',
      why: L('Start i meta Oksany. Wylot Air China CA964 w sobotę 31.10 o 12:00, w Pekinie o 4:45 rano, tam spotkanie z Dominiką. Powrót CA963 z Pekinu w czwartek 12.11: wylot 02:30, w Brukseli 06:40.',
             'Oksana\'s start and finish. Air China CA964 departs Saturday 31 Oct at 12:00, lands in Beijing at 4:45 and meets Dominika there. CA963 leaves Beijing on Thursday 12 Nov at 02:30 and lands in Brussels at 06:40.'),
      photos: [],
    },

    beijing: {
      name: L('Pekin', 'Beijing'), country: L('Chiny', 'China'), lat: 39.9042, lng: 116.4074, kind: 'hub',
      why: L('Dwie przesiadki. W drodze tam 8 godz. 20 min od lądowania Dominiki (Oksana jest w Pekinie już od 4:45), więc da się wyskoczyć do miasta na 3 godziny. W drodze powrotnej ok. 20 godzin (Oksana do 02:30, Dominika do 03:00), czyli cały dzień na Mur Chiński (osobna karta).',
             'Two layovers. The outbound one lasts 8 h 20 min from Dominika\'s landing (Oksana is there from 4:45), enough for about 3 hours in the city. The return one lasts about 20 hours (Oksana until 02:30, Dominika until 03:00), a full day for the Great Wall (separate card).'),
      warn: L('Dominika: 30 dni bez wizy. Oksana: tranzyt bezwizowy 240 h z biletem dalej i osobnym okienkiem na lotnisku. Szczegóły są w sekcji Praktycznie. W listopadzie w Pekinie jest ok. 0–10°C, a bagaż będzie tropikalny.',
              'Dominika: 30 days visa-free. Oksana: 240-hour visa-free transit with an onward ticket and a separate airport counter. See the Practical section for details. Beijing is around 0–10°C in November, while your luggage will be tropical.'),
      photos: [
        { src: 'assets/photos/beijing-4.webp', small: true, cap: L('Jezioro Houhai nocą, światła odbite w wodzie pod Wieżą Bębna', 'Houhai lake at night, lights trembling on the water below the Drum Tower'), author: 'Morio', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Houhai_Lake_and_Drum_Tower_Beijing_2015_October.jpg' },
        { src: 'assets/photos/beijing-7.webp', small: true, cap: L('Wieża Bębna, dawny zegar miasta, dziesięć minut od jeziora', 'The Drum Tower, the old city clock, ten minutes from the lake'), author: 'Toadspike', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Beijing_Drum_Tower.jpg' },
        { src: 'assets/photos/beijing-6.webp', small: true, cap: L('Nanluoguxiang, najsłynniejszy hutong: szare mury i latarnie', 'Nanluoguxiang, the famous hutong: grey walls and lanterns'), author: 'Francisco Anzola', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Nanluogu_Xiang_(6230757826).jpg' },
        { src: 'assets/photos/beijing-5.webp', small: true, cap: L('Jianbing z ulicznego wózka, śniadanie Pekinu za kilka juanów', 'Jianbing from a street cart, Beijing breakfast for a few yuan'), author: 'Connie Ma from United States of America', license: 'CC BY-SA 2.0', page: 'https://commons.wikimedia.org/wiki/File:Jianbing_being_prepared_by_a_street_vendor.jpg' },
        { src: 'assets/photos/beijing-3.webp', small: true, cap: L('Cichy hutong w południe, rowery pod murem', 'A quiet hutong at noon, bicycles along the wall'), author: 'N509FZ', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Datianshuijing_Hutong_(20210529190652).jpg' },
        { src: 'assets/photos/beijing-1.webp', small: true, cap: L('Zakazane Miasto o zachodzie, wieża narożna nad fosą', 'The Forbidden City at sunset, a corner tower above the moat'), author: 'User:kallgan', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Sunset_of_the_Forbidden_City_2006.JPG' },
        { src: 'assets/photos/beijing-2.webp', small: true, cap: L('Świątynia Nieba, panorama dziedzińca', 'Temple of Heaven, the courtyard panorama'), author: 'Maros M r a z (Maros)', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Temple_of_Heaven,_Beijing,_China_-_010_edit.jpg' },
      ],
      highlights: [
        { t: L('Hutongi przy Wieży Bębna i Dzwonu', 'Hutongs by the Drum & Bell Towers'), d: L('Najbliżej końcowej stacji Airport Express (Dongzhimen) — idealne na krótką przesiadkę 1.11.', 'Closest to the Airport Express terminus (Dongzhimen) — ideal for the short layover on 1 Nov.') },
        { t: L('Zakazane Miasto', 'Forbidden City'), d: L('Plan Oksany na rano 1.11: otwarte od 8:30 (w poniedziałki zamknięte, 1.11 to niedziela). Bilet tylko przez rezerwację online z numerem paszportu, zwykle do 7 dni wcześniej, i szybko znika. Wyjście północną bramą, naprzeciw parku Jingshan.', 'Oksana\'s plan for the morning of 1 Nov: open from 8:30 (closed on Mondays; 1 Nov is a Sunday). Tickets only by online reservation with a passport number, usually up to 7 days ahead, and they sell out fast. Exit through the north gate, opposite Jingshan Park.') },
        { t: L('Świątynia Nieba', 'Temple of Heaven'), d: L('Park pełen lokalnych emerytów grających w karty i tańczących.', 'A park full of locals playing cards, singing and dancing.') },
        { t: L('Kaczka po pekińsku', 'Peking duck'), d: L('Kolacja 11.11 po powrocie z Muru, przed lotem o 3:00.', 'Dinner on 11 Nov after the Wall, before the 3:00 flight.') },
      ],
      urbex: [
        { t: L('Shougang Park', 'Shougang Park'), d: L('Dawna gigantyczna huta stali zamieniona w park — wielkie piece, rury, skocznia Big Air z igrzysk 2022.', 'Former giant steelworks turned into a park — blast furnaces, pipes and the 2022 Olympic Big Air ramp.') },
        { t: L('798 Art District', '798 Art District'), d: L('Poniemieckie (NRD) hale fabryczne w stylu Bauhaus zamienione w galerie.', 'East-German-built Bauhaus factory halls turned into galleries.') },
      ],
      wild: [
        { t: L('Fragrant Hills (Xiangshan)', 'Fragrant Hills (Xiangshan)'), d: L('Na początku listopada czerwone liście klonów — jeśli zostanie czas.', 'Red autumn leaves in early November — if time allows.') },
      ],
    },

    greatwall: {
      name: L('Chiński Mur', 'Great Wall of China'), country: L('Chiny · przesiadka ok. 20 godz.', 'China · about 20 h layover'), lat: 40.4319, lng: 116.5704, kind: 'tour',
      why: L('11.11 po lądowaniu CA746 o 06:15 macie 1–1,5 godziny na imigrację i bagaż. Około 08:00 wyjdźcie do Starbucks na 2. piętrze T3; o 09:00 czeka tam kierowca na Mutianyu, bez przewodnika.',
             'On 11 Nov, after CA746 lands at 06:15, allow 1–1.5 hours for immigration and baggage. At about 08:00, head to Starbucks on level 2 of T3; at 09:00 the driver will meet you there for Mutianyu, without a guide.'),
      warn: L('Oksana wychodzi z lotniska na tranzyt 240 h: okienko tranzytowe, wydruk biletu do Brukseli. Godzinę powrotu na lotnisko ustalcie z kierowcą: nocne loty startują jeden po drugim, Oksana CA963 do Brukseli o 02:30, Dominika CA841 do Wiednia o 03:00.',
              'Oksana leaves the airport under 240-hour transit: use the transit counter and carry a printed ticket to Brussels. Agree the airport return time with the driver: the night flights leave one after the other, Oksana on CA963 to Brussels at 02:30 and Dominika on CA841 to Vienna at 03:00.'),
      photos: [
        { src: 'assets/photos/greatwall-1.webp', small: true, cap: L('Mutianyu, mur wspina się po grzbiecie w stronę gór', 'Mutianyu, the wall climbing the ridge towards the mountains'), author: 'Lloyd Tudor', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:The_Mutianyu_section_of_the_Great_Wall_of_China.jpg' },
        { src: 'assets/photos/greatwall-4.webp', small: true, cap: L('Jinshanling, wieże strażnicze jedna za drugą', 'Jinshanling, watchtower after watchtower'), author: 'Jakub Hałun', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:20090529_Great_Wall_Jinshanling_0903_8233.jpg' },
        { src: 'assets/photos/greatwall-2.webp', small: true, cap: L('Odnowiony odcinek Mutianyu w zieleni lasu', 'The restored Mutianyu stretch among the forest'), author: 'Arian Zwegers', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Mutianyu_Great_Wall_(6222519140).jpg' },
        { src: 'assets/photos/greatwall-5.webp', small: true, cap: L('Wieża na grzbiecie i mur znikający za horyzontem', 'A tower on the crest, the wall vanishing over the horizon'), author: 'Jakub Hałun', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:20090529_Great_Wall_8216.jpg' },
        { src: 'assets/photos/greatwall-3.webp', small: true, cap: L('Zielone wzgórza i mur wijący się jak wąż', 'Green hills and the wall winding like a snake'), author: 'Velatrix', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Great_Wall_of_China_July_2006.JPG' },
      ],
      highlights: [
        { t: L('Mutianyu', 'Mutianyu'), d: L('Najlepszy kompromis: ok. 1–1,5 h od lotniska, odnowiony, mniej tłumów niż Badaling, kolejka linowa i zjazd „toboganem”.', 'Best compromise: ~1–1.5 h from the airport, restored, fewer crowds than Badaling, cable car and a toboggan ride down.') },
        { t: L('Jinshanling', 'Jinshanling'), d: L('Dalej (~2,5 h), ale piękny, częściowo nieodnowiony odcinek i widoki na wieże strażnicze.', 'Further (~2.5 h), but a beautiful, partly unrestored stretch with watchtower views.') },
      ],
      urbex: [
        { t: L('Jiankou — „dziki mur”', 'Jiankou — the "wild wall"'), d: L('Nieodnowione, kruszące się fragmenty porośnięte krzakami. Tylko z przewodnikiem i w dobrych butach.', 'Unrestored, crumbling sections overgrown with bushes. Only with a guide and proper shoes.') },
      ],
      wild: [
        { t: L('Szlak Mutianyu → Jiankou', 'Mutianyu → Jiankou trail'), d: L('Odcinek zachodni za wieżą nr 20, gdzie kończy się odnowiony mur.', 'West beyond tower 20, where the restored wall ends.') },
      ],
    },

    phnompenh: {
      name: L('Phnom Penh', 'Phnom Penh'), country: L('Kambodża', 'Cambodia'), lat: 11.5564, lng: 104.9282, kind: 'stay',
      why: L('Stolica nad zbiegiem Mekongu i Tonlé Sap: pałace, targi, historia Czerwonych Khmerów, świetne jedzenie. Na start i na koniec.',
             'The capital where the Mekong meets the Tonlé Sap: palaces, markets, Khmer Rouge history and great food. First and last stop.'),
      warn: L('KTI to nowe lotnisko Techo, ok. 20–30 km od centrum. Liczcie 45–60 min; Grab jako główny wybór, PassApp lub taxi z lotniska jako zapas. Lotnisko podaje 10 do 20 USD za przejazd aplikacją lub taxi.',
              'KTI is the new Techo airport, about 20–30 km from the centre. Allow 45–60 min. Grab is the main choice, with PassApp or an airport taxi as backup. The airport quotes USD 10 to 20 for an app ride or taxi.'),
      photos: [
        { src: 'assets/photos/phnompenh-1.webp', small: true, cap: L('Pałac Królewski, złote dachy w popołudniowym słońcu', 'The Royal Palace, golden roofs in the afternoon sun'), author: 'Marcin Konsek', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:2016_Phnom_Penh,_Pa%C5%82ac_Kr%C3%B3lewski,_Preah_Tineang_Phhochani_(14).jpg' },
        { src: 'assets/photos/phnompenh-5.webp', small: true, cap: L('Srebrna Pagoda, podłoga z pięciu tysięcy srebrnych płytek', 'The Silver Pagoda, floored with five thousand silver tiles'), author: 'Marcin Konsek', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:2016_Phnom_Penh,_Pa%C5%82ac_Kr%C3%B3lewski,_Srebrna_Pagoda_(02).jpg' },
        { src: 'assets/photos/phnompenh-4.webp', small: true, cap: L('Tuk-tuki czekają pod kopułą Targu Centralnego', 'Tuk-tuks waiting below the dome of the Central Market'), author: 'Jakub Hałun', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:20171125_Central_Market,_Phnom_Penh_4368_DxO.jpg' },
        { src: 'assets/photos/phnompenh-2.webp', small: true, cap: L('Nabrzeże nad rzeką, palmy i wieczorny spacer', 'The riverside, palms and an evening stroll'), author: 'Christophe95', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Riverside_Park,_Phnom_Penh_3.jpg' },
        { src: 'assets/photos/phnompenh-3.webp', small: true, cap: L('Wat Phnom, świątynia na wzgórzu, od którego miasto wzięło nazwę', 'Wat Phnom, the hill temple that gave the city its name'), author: 'Marcin Konsek', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:2016_Phnom_Penh,_Wat_Phnom_(07).jpg' },
      ],
      highlights: [
        { t: L('Pałac Królewski i Srebrna Pagoda', 'Royal Palace & Silver Pagoda'), d: L('Otwarte rano i po południu (przerwa w południe). Zakryte ramiona i kolana.', 'Open mornings and afternoons (midday break). Cover shoulders and knees.') },
        { t: L('Sisowath Quay', 'Sisowath Quay'), d: L('Nabrzeże na zbiegu rzek — wieczorem aerobik, sprzedawcy, zachód słońca.', 'Riverside promenade — evening aerobics, street food, sunset.') },
        { t: L('Muzeum Narodowe', 'National Museum'), d: L('Czerwony budynek khmerski obok pałacu, rzeźby z Angkoru — dobre przed Siem Reap.', 'Red Khmer building next to the palace, Angkorian sculpture — great before Siem Reap.') },
        { t: L('Russian Market (Toul Tom Poung)', 'Russian Market (Toul Tom Poung)'), d: L('Labirynt straganów, jedzenie, pamiątki.', 'A maze of stalls, food and souvenirs.') },
        { t: L('Tuol Sleng (S-21) i Choeung Ek', 'Tuol Sleng (S-21) & Choeung Ek'), d: L('Najważniejsze miejsca pamięci ludobójstwa. Audioprzewodnik w Choeung Ek jest świetny.', 'The key genocide memorials. The Choeung Ek audio guide is excellent.') },
      ],
      urbex: [
        { t: L('Architektura New Khmer (Vann Molyvann)', 'New Khmer Architecture (Vann Molyvann)'), d: L('Modernizm lat 60.: Stadion Olimpijski (1964), sala Chaktomuk, stare budynki uniwersytetu — nadgryzione zębem czasu.', '1960s modernism: the Olympic Stadium (1964), Chaktomuk Hall, old university buildings — beautifully weathered.') },
        { t: L('Stare kolonialne kamienice przy Street 13 / Post Office Square', 'Old colonial buildings around Street 13 / Post Office Square'), d: L('Łuszczące się francuskie fasady wśród nowych wieżowców.', 'Peeling French façades among the new towers.') },
      ],
      wild: [
        { t: L('Koh Dach („Jedwabna Wyspa”)', 'Koh Dach ("Silk Island")'), d: L('Wiejska wyspa na Mekongu — rowery, tkacze jedwabiu, pola. Pół dnia.', 'Rural Mekong island — bikes, silk weavers, fields. Half a day.') },
        { t: L('Rejs o zachodzie na Mekongu', 'Sunset boat on the Mekong'), d: L('Lokalne łodzie z nabrzeża, ok. 1 h.', 'Local boats from the quay, about 1 h.') },
      ],
    },

    siemreap: {
      name: L('Siem Reap', 'Siem Reap'), country: L('Kambodża', 'Cambodia'), lat: 13.3633, lng: 103.8564, kind: 'stay',
      why: L('Brama do Angkoru — największego kompleksu świątyń na świecie. Trzy noce to minimum na główne świątynie plus jeden „dziki” wypad.',
             'Gateway to Angkor, the largest temple complex on Earth. Three nights is the minimum for the big temples plus one wilder day trip.'),
      warn: L('Angkor Pass kupuje się przy kasach lub online — karnet 3-dniowy wychodzi taniej niż dwa jednodniowe. Sprawdźcie aktualne ceny.',
              'Buy the Angkor Pass at the ticket office or online — a 3-day pass beats two single days. Check current prices.'),
      photos: [
        { src: 'assets/photos/siemreap-1.webp', small: true, cap: L('Angkor Wat o świcie, wieże odbite w stawie', 'Angkor Wat at dawn, the towers mirrored in the pond'), author: 'Reinhard Onasch', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Angkor_Wat_Sunrise_(209237385).jpeg' },
        { src: 'assets/photos/siemreap-2.webp', small: true, cap: L('Ta Prohm, kamienne płaskorzeźby oplecione przez dżunglę', 'Ta Prohm, stone carvings wrapped by the jungle'), author: 'Diego Delso', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Ta_Phrom,_Angkor,_Camboya,_2013-08-16,_DD_14.JPG' },
        { src: 'assets/photos/siemreap-3.webp', small: true, cap: L('Bayon, uśmiechnięte kamienne twarze', 'Bayon, the smiling stone faces'), author: 'Pedro Figueiredo', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Faces_Of_Bayon_(21538245).jpeg' },
        { src: 'assets/photos/siemreap-4.webp', small: true, cap: L('Banteay Srei, różowy piaskowiec i koronkowe reliefy', 'Banteay Srei, pink sandstone and lace-fine reliefs'), author: 'JJ Ying jjying', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Banteay_Srei_temple_(Unsplash).jpg' },
        { src: 'assets/photos/siemreap-5.webp', small: true, cap: L('Kampong Phluk, domy na wysokich palach nad wodą', 'Kampong Phluk, houses on tall stilts above the water'), author: 'Krzysztof Golik', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Houses_on_the_water_in_Kampong_Phlouk.jpg' },
      ],
      highlights: [
        { t: L('Angkor Wat o wschodzie', 'Angkor Wat at sunrise'), d: L('Wyjazd ok. 5:00. Po wschodzie idźcie od razu do środka, zanim zejdą się tłumy.', 'Leave around 5:00. Right after sunrise head inside before the crowds.') },
        { t: L('Angkor Thom i Bayon', 'Angkor Thom & Bayon'), d: L('216 kamiennych twarzy, Taras Słoni, Taras Trędowatego Króla.', '216 stone faces, the Elephant Terrace, the Terrace of the Leper King.') },
        { t: L('Ta Prohm', 'Ta Prohm'), d: L('Korzenie drzew rozsadzające mury — najlepiej wcześnie rano.', 'Tree roots splitting the walls — best early in the morning.') },
        { t: L('Banteay Srei', 'Banteay Srei'), d: L('Mała świątynia z różowego piaskowca z najdelikatniejszymi rzeźbami.', 'Small pink-sandstone temple with the finest carvings.') },
        { t: L('Cyrk Phare', 'Phare, The Cambodian Circus'), d: L('Akrobacje i teatr prowadzone przez fundację społeczną.', 'Acrobatics and theatre run by a social enterprise.') },
        { t: L('Nocne targi i Pub Street', 'Night markets & Pub Street'), d: L('Tanie jedzenie, masaż stóp, pamiątki.', 'Cheap food, foot massages, souvenirs.') },
      ],
      urbex: [
        { t: L('Beng Mealea', 'Beng Mealea'), d: L('~70 km od miasta: zawalona świątynia połknięta przez dżunglę, chodzi się po drewnianych kładkach i gruzach. Prawdziwe Indiana Jones.', '~70 km out: a collapsed temple swallowed by jungle, explored over wooden walkways and rubble. Proper Indiana Jones.') },
        { t: L('Ta Nei i Preah Khan', 'Ta Nei & Preah Khan'), d: L('Mniejsze, ciche świątynie w lesie, często pustki.', 'Smaller, quiet forest temples, often empty.') },
      ],
      wild: [
        { t: L('Phnom Kulen', 'Phnom Kulen'), d: L('Święta góra: wodospad (w listopadzie jeszcze sporo wody), Rzeka Tysiąca Lingamów, leżący Budda.', 'Sacred mountain: waterfall (still full in November), River of a Thousand Lingas, reclining Buddha.') },
        { t: L('Kampong Phluk', 'Kampong Phluk'), d: L('Wioska na wysokich palach i zalany las na Tonlé Sap — po porze deszczowej woda jest wysoko.', 'Stilt village and flooded forest on the Tonlé Sap — water is high after the rainy season.') },
      ],
    },

    sihanoukville: {
      name: L('Sihanoukville', 'Sihanoukville'), country: L('Kambodża', 'Cambodia'), lat: 10.6093, lng: 103.5296, kind: 'stay',
      why: L('Głównie punkt przesiadkowy na wyspy (promy z Serendipity Pier). Jedna noc wystarczy — albo zero, jeśli zdążycie na popołudniowy prom.',
             'Mostly the gateway to the islands (ferries from Serendipity Pier). One night is enough — or none if you make an afternoon ferry.'),
      photos: [
        { src: 'assets/photos/sihanoukville-4.webp', small: true, cap: L('Kolorowa łódź rybacka w porcie Sihanoukville', 'A painted fishing boat in the Sihanoukville harbour'), author: 'Dmitry Makeev', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Sihanoukville._Fishing_boats_of_Cambodia.jpg' },
        { src: 'assets/photos/sihanoukville-1.webp', small: true, cap: L('Otres Beach, długa plaża poza miastem', 'Otres Beach, the long beach beyond the town'), author: 'Dmitry Makeev', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Otres_Beach_-_Sihanoukville.jpg' },
        { src: 'assets/photos/sihanoukville-5.webp', small: true, cap: L('Park Narodowy Ream, zielone wzgórza nad namorzynami', 'Ream National Park, green hills above the mangroves'), author: 'Dmitry Makeev', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Nature_of_Cambodia._Ream.jpg' },
        { src: 'assets/photos/sihanoukville-2.webp', small: true, cap: L('Drewniany dom plażowy na Hawaii Beach', 'A wooden beach house on Hawaii Beach'), author: 'Dmitry Makeev', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Sihanoukville_-_Hawaii_beach,_beach_house.jpg' },
        { src: 'assets/photos/sihanoukville-3.webp', small: true, cap: L('Leśna ścieżka w Ream, szyld pensjonatu w dżungli', 'A forest path in Ream, a guesthouse sign in the jungle'), author: 'Dmitry Makeev', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Preah_Sihanouk_National_Park_03.jpg' },
      ],
      highlights: [
        { t: L('Otres Beach', 'Otres Beach'), d: L('Najspokojniejsza plaża w mieście, dobra na wieczór przed promem.', 'The calmest beach in town, good for the evening before the ferry.') },
        { t: L('Promy na wyspy', 'Island ferries'), d: L('Kilku przewoźników (np. GTVC, Buva Sea), rejs 45–60 min. Bilet dzień wcześniej.', 'Several operators (e.g. GTVC, Buva Sea), 45–60 min crossing. Buy tickets a day ahead.') },
      ],
      urbex: [
        { t: L('Miasto-widmo niedokończonych wieżowców', 'Ghost city of unfinished towers'), d: L('Po boomie kasynowym zostały setki porzuconych szkieletów hoteli. Oglądać z ulicy — nie wchodzić do środka (niestabilne konstrukcje, ochrona).', 'The casino boom left hundreds of abandoned hotel skeletons. Look from the street — don\'t go inside (unstable structures, guards).') },
      ],
      wild: [
        { t: L('Park Narodowy Ream', 'Ream National Park'), d: L('Namorzyny, rejs łódką po rzece Prek Toeuk Sap, dzikie plaże — najlepiej z lokalnym przewodnikiem.', 'Mangroves, boat trip on the Prek Toeuk Sap river, wild beaches — best with a local guide.') },
        { t: L('Wodospad Kbal Chhay', 'Kbal Chhay waterfall'), d: L('Kaskady ~15 km od miasta, po porze deszczowej pełne wody.', 'Cascades ~15 km from town, full after the rainy season.') },
      ],
    },

    kohrong: {
      name: L('Koh Rong', 'Koh Rong'), country: L('Kambodża · wyspa', 'Cambodia · island'), lat: 10.7160, lng: 103.2600, kind: 'stay',
      why: L('Większa, żywsza wyspa: białe plaże, dżungla, świecący plankton. Na Koh Touch jest trochę imprez — na drugiej stronie wyspy cisza.',
             'The bigger, livelier island: white beaches, jungle, glowing plankton. Koh Touch has some nightlife — the far side is silent.'),
      photos: [
        { src: 'assets/photos/kohrong-2.webp', small: true, cap: L('Sok San Beach, turkusowa woda i czarne skały', 'Sok San Beach, turquoise water and black rocks'), author: 'Wikirictor', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Sok_San_Beach_bay_Koh_Rong.jpg' },
        { src: 'assets/photos/kohrong-1.webp', small: true, cap: L('Koh Rong z góry, zatoka i porośnięte dżunglą wzgórza', 'Koh Rong from above, the bay and jungle hills'), author: 'Rômulo  Gama Ferreira from Vitória-ES', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Koh_Rong_-_Cambodia_(50925116073).jpg' },
        { src: 'assets/photos/kohrong-g1.webp', small: true, cap: L('Wioska Koh Touch o złotej godzinie (ilustracja)', 'Koh Touch village at golden hour (illustration)'), gen: true },
        { src: 'assets/photos/kohrong-g2.webp', cap: L('Ścieżka przez dżunglę na pustą plażę (ilustracja)', 'A jungle trail to an empty beach (illustration)'), gen: true },
      ],
      highlights: [
        { t: L('Long Set Beach (4K Beach)', 'Long Set Beach (4K Beach)'), d: L('Ok. 30–40 min spacerem z Koh Touch — turkusowa woda.', 'About 30–40 min walk from Koh Touch — turquoise water.') },
        { t: L('Świecący plankton', 'Bioluminescent plankton'), d: L('Najlepiej w bezksiężycową noc, z dala od świateł.', 'Best on a moonless night, away from lights.') },
        { t: L('Sok San Beach', 'Sok San Beach'), d: L('Kilka km pustego piasku na zachodzie wyspy.', 'Miles of empty sand on the west side.') },
      ],
      urbex: [
        { t: L('Wioska rybacka Prek Svay', 'Prek Svay fishing village'), d: L('Prawdziwe życie wyspy, łodzie, domy na palach — zero resortów.', 'Real island life, boats, houses on stilts — no resorts.') },
      ],
      wild: [
        { t: L('Szlak przez dżunglę na Long Beach', 'Jungle trail to Long Beach'), d: L('Stroma ścieżka przez las, zabrać wodę i buty (nie klapki).', 'Steep forest path — bring water and real shoes (not flip-flops).') },
        { t: L('Lonely Beach', 'Lonely Beach'), d: L('Najdalej na północy, dostęp łodzią — koniec świata.', 'The far north tip, boat access only — end of the world.') },
      ],
    },

    kohrongsamloem: {
      name: L('Koh Rong Samloem', 'Koh Rong Samloem'), country: L('Kambodża · wyspa', 'Cambodia · island'), lat: 10.5930, lng: 103.3100, kind: 'stay',
      why: L('Mniejsza, spokojniejsza siostra Koh Rong, a Wy śpicie w M\'Pai Bay na północy: rybacka wioska z pomostem, nie kurort. Hamaki, płytka woda, prawie brak dróg. Trzy noce przed powrotem do stolicy.',
             'Koh Rong\'s smaller, calmer sister, and you are sleeping in M\'Pai Bay in the north: a fishing village with a pier rather than a resort. Hammocks, shallow water, almost no roads. Three nights before heading back to the capital.'),
      photos: [
        { src: 'assets/photos/krs-mpai-1.webp', small: true, cap: L('M\'Pai Bay od strony wody: łodzie przy brzegu i domy między drzewami, tu macie nocleg', 'M\'Pai Bay from the water: boats along the shore and houses among the trees, this is where you sleep'), author: 'Treehill', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/Category:Koh_Rong_Sanloem' },
        { src: 'assets/photos/krs-mpai-2.webp', small: true, cap: L('Drewniany pomost wychodzi w spłycinę: stąd odchodzą łodzie na ląd i do innych zatok', 'The wooden pier runs out over the shallows: boats to the mainland and other bays leave from here'), author: 'Treehill', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/Category:Koh_Rong_Sanloem' },
        { src: 'assets/photos/krs-mpai-3.webp', small: true, cap: L('Stół w cieniu kilka kroków od wody: tak wygląda śniadanie na tej wyspie', 'A table in the shade a few steps from the water: this is what breakfast looks like on this island'), author: 'Treehill', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/Category:Koh_Rong_Sanloem' },
        { src: 'assets/photos/krs-mpai-4.webp', small: true, cap: L('Kolorowa łódź przy pomoście, zwykły dzień w rybackiej wiosce', 'A painted boat at the pier, an ordinary day in the fishing village'), author: 'Treehill', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/Category:Koh_Rong_Sanloem' },
        { src: 'assets/photos/kohrongsamloem-1.webp', small: true, cap: L('Saracen Bay po drugiej stronie wyspy, trzy kilometry białego piasku', 'Saracen Bay on the far side of the island, three kilometres of white sand'), author: 'Wikirictor', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Saracen_Bay_panoramic_view,_Koh_Rong_Sanloem,_Cambodia,_June_2014.jpg' },
        { src: 'assets/photos/kohrongsamloem-2.webp', small: true, cap: L('Dwa leżaki pod drzewem, wyspa po drugiej stronie', 'Two loungers under a tree, an island across the water'), author: 'Wikirictor', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Cambodia_island_paradise_koh_rong_sanloem.jpg' },
        { src: 'assets/photos/kohrongsamloem-3.webp', small: true, cap: L('Lazy Beach, spokojna zatoka po zachodniej stronie', 'Lazy Beach, a calm bay on the western side'), author: 'Treehill', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Lazy_Beach,_Koh_Rong_Sanloem.jpg' },
        { src: 'assets/photos/kohrongsamloem-4.webp', small: true, cap: L('Stary kamieniołom w głębi wyspy', 'An old quarry deep inside the island'), author: 'Treehill', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Quarry_on_Koh_Rong_Sanloem_-_1.jpg' },
      ],
      highlights: [
        { t: L('M\'Pai Bay: Wasza wioska', 'M\'Pai Bay: your village'), d: L('Północ wyspy: pomost, łodzie z połowu, kilka barów i plaża od razu przed noclegiem. Łodzią z lądu dojeżdża się tu bezpośrednio.', 'The north of the island: a pier, boats back from the catch, a few bars and the beach right in front of your room. Boats from the mainland come straight here.') },
        { t: L('Saracen Bay', 'Saracen Bay'), d: L('Łuk białego piasku po wschodniej stronie, ok. 10 km od M\'Pai Bay: łodzią albo szlakiem przez wyspę.', 'A long arc of white sand on the east side, about 10 km from M\'Pai Bay: by boat or on the trail across the island.') },
        { t: L('Lazy Beach i Sunset Beach', 'Lazy Beach & Sunset Beach'), d: L('Zachodnia strona — zachody słońca.', 'West side — sunsets.') },
      ],
      urbex: [
        { t: L('Stary kamieniołom w głębi wyspy', 'The old quarry inland'), d: L('Porzucone wyrobisko w lesie między zatokami, zarośnięte i ciche.', 'An abandoned pit in the forest between the bays, overgrown and silent.') },
      ],
      wild: [
        { t: L('Szlak do latarni morskiej', 'Lighthouse trail'), d: L('Z M\'Pai Bay przez dżunglę, widok na zatokę.', 'From M\'Pai Bay through the jungle, view over the bay.') },
        { t: L('Szlak Saracen Bay → Lazy Beach', 'Saracen Bay → Lazy Beach trail'), d: L('Ok. 45 min przez las na drugą stronę wyspy.', 'About 45 min through the forest to the other side.') },
      ],
    },
  },
};

/* Rozszerzone treści redakcyjne kart miejsc. Oddzielone od danych bazowych,
   żeby krótkie pola `why` nadal mogły służyć w skrótowych widokach. */

Object.assign(TRIP.places.beijing, {
  lede: L('Osiem godzin w Pekinie wystarczy na wspólny łyk chłodnego miasta, spacer po hutongach i powrót bez gonitwy.', 'Eight hours in Beijing are enough to share a glimpse of the cold city, walk its hutongs and return without a frantic rush.'),
  mood: L('dym · cegła · rowery', 'steam · brick · bicycles'),
  story: L('1.11 Oksana ląduje o 4:45 i rano jedzie sama Airport Expressem do miasta, na Zakazane Miasto (otwarte od 8:30, bilet trzeba wcześniej zarezerwować online z numerem paszportu). Z Zakazanego Miasta wychodzi się zwykle północną bramą, naprzeciw parku Jingshan, skąd do Wieży Bębna jest ok. 40 minut pieszo albo krótki kurs Didi. Dominika ląduje o 10:40 w Terminalu 3 i po kontroli wjazdowej, około 11:45, jedzie Airport Expressem za 25 CNY do Dongzhimen, potem metrem linii 2 do Guloudajie. Bagaż na jednej rezerwacji Air China powinien polecieć do KTI, ale potwierdźcie to przy odprawie w Wiedniu i Brukseli.\n\nSpotkanie: 13:00 na placu między Wieżą Bębna a Wieżą Dzwonu. Włączcie sobie nawzajem udostępnianie lokalizacji na żywo w WhatsAppie (działa na eSIM z roamingiem, bez VPN). Jeśli któraś nie dotrze do 13:30, każda zwiedza sama, a spotykacie się najpóźniej o 16:15 przy odprawie Air China w Terminalu 3.\n\nOd 13:00 razem: hutongi, Yandai Xiejie i brzeg Houhai. To realnie 2,5 godziny w mieście razem, z czasem na szybkie jedzenie.\n\nOkoło 15:30 ruszacie z powrotem przez Dongzhimen. Cel to Terminal 3 około 16:15, czyli 2 godziny 45 minut przed CA745 o 19:00. Odprawa lotniskowa Air China na lot międzynarodowy zamyka się 45 minut przed odlotem.', 'On 1 Nov Oksana lands at 4:45 and heads into town alone by Airport Express for the Forbidden City (open from 8:30; the ticket must be booked online in advance with a passport number). Visitors usually leave the Forbidden City through the north gate, opposite Jingshan Park, about 40 minutes on foot or a short Didi ride from the Drum Tower. Dominika lands at 10:40 at Terminal 3 and after entry formalities, at about 11:45, takes the 25 CNY Airport Express to Dongzhimen, then metro line 2 to Guloudajie. Bags on one Air China booking should be checked through to KTI, but confirm this at check-in in Vienna and Brussels.\n\nMeeting point: 13:00 on the square between the Drum Tower and the Bell Tower. Share live location with each other on WhatsApp (it works on a roaming eSIM without a VPN). If one of you is not there by 13:30, explore separately and meet at the latest at 16:15 at the Air China check-in in Terminal 3.\n\nFrom 13:00 together: hutongs, Yandai Xiejie and the edge of Houhai. That gives you a realistic 2.5 hours in the city together, with time for quick food.\n\nLeave at about 15:30 and return via Dongzhimen. Aim to reach Terminal 3 at about 16:15, 2 hours 45 minutes before CA745 at 19:00. Air China airport check-in for an international flight closes 45 minutes before departure.'),
  experiences: [
    { t: L('Wieże Bębna i Dzwonu', 'Drum and Bell Towers'), d: L('Bilet łączony 30 CNY, otwarte 9:30 do 16:30. Pokazy bębnów odbywają się mniej więcej co godzinę.', 'Combined ticket 30 CNY, open 09:30 to 16:30. Drum performances run roughly hourly.') },
    { t: L('Hutongi i Yandai Xiejie', 'Hutongs and Yandai Xiejie'), d: L('Spacerujcie zaułkami wokół wież i uliczką fajki, bez dokładania odległych atrakcji.', 'Walk the lanes around the towers and the Skewed Tobacco Pouch Street without adding distant sights.') },
    { t: L('Houhai', 'Houhai'), d: L('Brzeg jeziora jest 5 do 10 minut od Wieży Bębna i dobrze domyka krótką pętlę spaceru.', 'The lakeside is 5 to 10 minutes from the Drum Tower and neatly completes the short walking loop.') },
    { t: L('Nanluoguxiang', 'Nanluoguxiang'), d: L('Najsłynniejszy, tłumny hutong ze sklepikami i jedzeniem, wybierzcie go tylko jeśli tempo na to pozwoli.', 'The best-known and busiest hutong, lined with shops and food, only add it if your pace allows.') },
    { t: L('Szybkie jedzenie', 'Quick food'), d: L('Jianbing 5 do 12 CNY, chuanr 3 do 8 CNY za sztukę albo zhajiangmian 20 do 45 CNY. Kaczkę zostawcie raczej na 11.11.', 'Jianbing 5 to 12 CNY, chuanr 3 to 8 CNY each, or zhajiangmian 20 to 45 CNY. Save Peking duck for 11 Nov.') },
  ],
  nearby: [
    { t: L('Jingshan', 'Jingshan'), d: L('Park z widokiem na dachy Zakazanego Miasta, lepszy na wizytę bez presji przesiadki.', 'A park overlooking the roofs of the Forbidden City, better for a visit without layover pressure.'), dist: L('ok. 2 km na południe, 25 min pieszo', 'about 2 km south, 25 min on foot') },
    { t: L('798 Art District', '798 Art District'), d: L('Dawne hale fabryczne zamienione w dzielnicę galerii, zachowajcie na dłuższy pobyt.', 'Former factory halls turned into a gallery district, save it for a longer stay.'), dist: L('ok. 10 km na północny wschód, taksówką', 'about 10 km north-east, by taxi') },
    { t: L('Świątynia Lamy', 'Lama Temple'), d: L('Świątynny kompleks, który wymaga spokojniejszego planu niż ten krótki spacer.', 'A temple complex that deserves a calmer plan than this short walk.'), dist: L('ok. 2 km na wschód, blisko linii 2 metra', 'about 2 km east, near metro line 2') },
  ],
});

Object.assign(TRIP.places.greatwall, {
  lede: L('O 09:00 kierowca odbiera was ze Starbucks na 2. piętrze T3 i wiezie na Mutianyu — bez przewodnika, za to z całym dniem przed nocnym lotem.', 'At 09:00, the driver collects you from Starbucks on level 2 of T3 for Mutianyu — no guide, and a full day before the overnight flight.'),
  mood: L('wiatr · kamień · bezkres', 'wind · stone · distance'),
  story: L('CA746 ląduje o 06:15. Po imigracji i bagażu, zwykle zajmujących 1–1,5 godziny, około 08:00 wychodzicie do Starbucks na 2. piętrze Terminalu 3. Można tam odpocząć przed spotkaniem o 09:00. Kierowca zabiera was na Mutianyu w ramach wycieczki „Mutianyu Great Wall Capital Airport Layover Tour”; opcja jest bez przewodnika.\n\nNa murze zostają wiatr, kamień i wieże ginące w listopadowym świetle. Godzinę powrotu na lotnisko ustalcie z kierowcą. Wracacie na lotnisko na nocne loty: Oksana CA963 do Brukseli o 02:30, Dominika CA841 do Wiednia o 03:00. Jeśli trzeba, godzinę spotkania można zmienić wiadomością do organizatora.', 'CA746 lands at 06:15. After immigration and baggage, usually taking 1–1.5 hours, you should reach Starbucks on level 2 of Terminal 3 at about 08:00. Rest there before the 09:00 meeting. The driver takes you to Mutianyu on the “Mutianyu Great Wall Capital Airport Layover Tour”; this option has no guide.\n\nOn the Wall, there is wind, stone and watchtowers fading into the November light. Agree the airport return time with the driver. You head back to the airport for the night flights: Oksana on CA963 to Brussels at 02:30, Dominika on CA841 to Vienna at 03:00. If needed, message the organiser to change the meeting time.'),
  experiences: [
    { t: L('Pierwsze kroki na blankach', 'First steps on the ramparts'), d: L('Wjedźcie kolejką, a energię zachowajcie na strome schody między wieżami.', 'Ride the cable car up and save your energy for the steep stairs between towers.') },
    { t: L('Cisza w wieży strażniczej', 'Silence in a watchtower'), d: L('Zatrzymajcie się wewnątrz kamiennej wieży, gdy grupa odejdzie, i posłuchajcie wiatru w otworach strzelniczych.', 'Pause inside a stone tower after a group leaves and listen to wind moving through the embrasures.') },
    { t: L('Piknik z widokiem', 'A picnic with a view'), d: L('Weźcie termos i prostą przekąskę, bo listopadowy wiatr szybko wychładza na grani.', 'Carry a flask and a simple snack because the November wind chills quickly on the ridge.') },
    { t: L('Zjazd z Mutianyu', 'The Mutianyu descent'), d: L('Jeśli działa i pogoda pozwala, wybierzcie zjazd toboganem. Sprawdźcie przed wyjazdem.', 'If operating and weather allows, take the toboggan down. Check before travelling.') },
  ],
  nearby: [
    { t: L('Grobowce dynastii Ming', 'Ming Tombs'), d: L('Droga Duchów i cesarskie mauzolea pozwalają dopowiedzieć historię dynastii, która rozbudowała ten odcinek Muru.', 'The Sacred Way and imperial mausoleums add context to the dynasty that expanded this section of the Wall.'), dist: L('ok. 1,5 h od Mutianyu', 'about 1.5 h from Mutianyu') },
    { t: L('Jinshanling', 'Jinshanling'), d: L('Dłuższy, częściowo odrestaurowany odcinek z szerokimi panoramami, lepszy na osobny dzień.', 'A longer, partly restored section with broad panoramas, best kept for a dedicated day.'), dist: L('ok. 2 h z Pekinu', 'about 2 h from Beijing') },
    { t: L('Wioska Beigou', 'Beigou village'), d: L('Spokojna miejscowość u podnóża Mutianyu, dobra na posiłek i krótki spacer po zejściu.', 'A quiet village below Mutianyu, suitable for a meal and a short walk after descending.'), dist: L('ok. 15 min samochodem', 'about 15 min by car') },
  ],
});

const venue = (t, d, addr, hours, price, dist, url, src, tag) => ({
  t, d, addr, hours, price, dist, url, src, ...(tag ? { tag } : {})
});

Object.assign(TRIP.places.beijing, {
  food: [
    venue(L('Yaoji Chaogan', 'Yaoji Chaogan'), L('Kultowa, tania knajpka starego Pekinu pod Wieżą Bębnów, chaogan i baozi.', 'Iconic cheap old-Beijing snack shop under the Drum Tower, chaogan and steamed buns.'), '311 Gulou Dongdajie, Dongcheng', L('06:00–22:30 lub 06:30–21:00, do potwierdzenia', '06:00–22:30 or 06:30–21:00, confirm'), L('¥30–50/os.', 'CNY 30–50/person'), L('ok. przy Wieży Bębnów', 'about by the Drum Tower'), 'https://www.google.com/maps/search/?api=1&query=Yaoji+Chaogan+311+Gulou+Dongdajie+Dongcheng+Beijing', 'https://wherebest.com/en/restaurant-yaoji-chaogan-gulou-beijing'),
    venue(L('Mr. Shi\'s Dumplings', 'Mr. Shi\'s Dumplings'), L('Mały rodzinny lokal przy Nanluoguxiang z gotowanymi i smażonymi pierożkami jiaozi.', 'Small family-run spot near Nanluoguxiang with boiled and pan-fried jiaozi dumplings.'), '74 Baochao Hutong, Dongcheng', L('10:30–22:30 lub 10:00–21:30, godziny do potwierdzenia', '10:30–22:30 or 10:00–21:30, hours to confirm'), L('¥50–100 za 2 os., dane starsze', 'CNY 50–100 for 2, older data'), L('ok. przy Gulou', 'about by Gulou'), 'https://www.google.com/maps/search/?api=1&query=Mr.+Shi%27s+Dumplings+74+Baochao+Hutong+Dongcheng+Beijing', 'https://www.frommers.com/destinations/beijing/restaurants/mr-shis-dumplings/'),
    venue(L('Hu Da, Ghost Street', 'Hu Da, Ghost Street'), L('Słynne pikantne raki na ulicy Guijie, wygodnie przed Airport Expressem z Dongzhimen.', 'Famous spicy crayfish on Guijie, convenient before the Airport Express from Dongzhimen.'), '233 Dongzhimen Nei Dajie, Dongcheng', L('24 h lub 10:30–04:00, do potwierdzenia', '24 h or 10:30–04:00, confirm'), L('ok. ¥134/os.', 'about CNY 134/person'), L('ok. 1 km od Dongzhimen', 'about 1 km from Dongzhimen'), 'https://www.google.com/maps/search/?api=1&query=Hu+Da+Restaurant+233+Dongzhimen+Nei+Dajie+Beijing', 'https://www.visitbeijing.com.cn/article/4OMJ6AmkHTl')
  ],
  shop: [
    venue(L('Watsons, Raffles City Dongzhimen', 'Watsons, Raffles City Dongzhimen'), L('Najbliższa sprawdzona drogeria, ale wybór koreańskich marek jest niepotwierdzony.', 'Nearest verified drugstore, but the Korean brand range is unconfirmed.'), 'Dongzhimen South St 1, Raffles City, B1', L('centrum 10:00–22:00, sklep do potwierdzenia', 'mall 10:00–22:00, store to confirm'), L('ceny do potwierdzenia', 'prices to confirm'), L('przy Airport Express', 'by Airport Express'), 'https://www.google.com/maps/search/?api=1&query=Watsons+Raffles+City+Dongzhimen+Beijing', 'https://web.kao.com/cn/curel/shop/'),
    venue(L('Sephora, Sanlitun Taikoo Li', 'Sephora, Sanlitun Taikoo Li'), L('Sklep flagowy z markami premium, nie jest to tanie źródło K-beauty.', 'Flagship store with premium brands, not a cheap source of K-beauty.'), 'Sanlitun Rd 19, Taikoo Li South, building 6, F1', L('10:00–22:00 codziennie', '10:00–22:00 daily'), L('ceny do potwierdzenia', 'prices to confirm'), L('ok. 4–5 km od Dongsi', 'about 4–5 km from Dongsi'), 'https://www.google.com/maps/search/?api=1&query=Sephora+Sanlitun+Taikoo+Li+Beijing', 'https://m.jiemian.com/article/6076789.html')
  ]
});

Object.assign(TRIP.places.greatwall, {
  food: [
    venue(L('Da Dong, Nanxincang', 'Da Dong, Nanxincang'), L('Nowoczesna kaczka po pekińsku, najlepsza logistycznie przed linią 2 i Airport Expressem.', 'Modern Peking duck, the best logistics before line 2 and the Airport Express.'), '1–2/F Nanxincang International Plaza, 22A Dongsishitiao, Dongcheng', L('11:00–22:00 codziennie', '11:00–22:00 daily'), L('cała kaczka ¥298–560 plus serwis, źródła się różnią', 'whole duck CNY 298–560 plus service, sources differ'), L('przy Dongsishitiao, 1 przystanek od Dongzhimen', 'by Dongsishitiao, 1 stop from Dongzhimen'), 'https://www.google.com/maps/search/?api=1&query=Da+Dong+Roast+Duck+Nanxincang+22A+Dongsishitiao+Beijing', 'https://travelchinawith.me/china-travel-blog/peking-duck-restaurants-in-beijing'),
    venue(L('Siji Minfu, Dongsi Shitiao', 'Siji Minfu, Dongsi Shitiao'), L('Klasyczna kaczka, kolejka 45 do 120 minut, adres filii do potwierdzenia.', 'Classic duck, a 45 to 120 minute queue, branch address to confirm.'), 'Dongsi Shitiao, nr 25 lub 2, Dongcheng', L('11:00–22:00, do potwierdzenia', '11:00–22:00, confirm'), L('cała ¥259–268, źródła się różnią', 'whole CNY 259–268, sources differ'), L('1 przystanek od Dongzhimen', '1 stop from Dongzhimen'), 'https://www.google.com/maps/search/?api=1&query=Siji+Minfu+Roast+Duck+Dongsi+Shitiao+Dongcheng+Beijing', 'https://travelchinawith.me/china-travel-blog/peking-duck-restaurants-in-beijing'),
    venue(L('Quanjude, Qianmen', 'Quanjude, Qianmen'), L('Historyczny dom kaczki, ale daleko od lotniska i mniej wygodny przed nocnym lotem.', 'Historic duck house, but far from the airport and less convenient before the night flight.'), '30 Qianmen Dajie, Dongcheng', L('11:00–21:00, przerwa w środku dnia do potwierdzenia', '11:00–21:00, midday break to confirm'), L('cała ¥238–420, źródła się różnią', 'whole CNY 238–420, sources differ'), L('daleko od lotniska', 'far from the airport'), 'https://www.google.com/maps/search/?api=1&query=Quanjude+Qianmen+30+Qianmen+Dajie+Beijing', 'https://wherebest.com/en/restaurant-quanjude-qianmen-beijing')
  ]
});

Object.assign(TRIP.places.phnompenh, {
  food: [
    venue(L('Kravanh', 'Kravanh'), L('Tradycyjna kuchnia khmerska w willi z ogrodem, najbliżej Hotel Sor1.', 'Traditional Khmer cooking in a garden villa, closest to Hotel Sor1.'), '#74 Oknha Ket St. 174', L('11:00–14:30 i 17:30–21:00', '11:00–14:30 and 17:30–21:00'), L('ok. 15–40 USD/os.', 'about USD 15–40/person'), L('ok. 0,5 km od Hotel Sor1', 'about 0.5 km from Hotel Sor1'), 'https://www.google.com/maps/search/?api=1&query=Kravanh+Restaurant+74+Street+174+Phnom+Penh', 'https://kravanhrestaurant.com/contact'),
    venue(L('Friends the Restaurant', 'Friends the Restaurant'), L('Restauracja szkoleniowa Friends-International z khmerskimi tapas.', 'Friends-International training restaurant with Khmer-inspired tapas.'), '#215 Street 13', L('wt–nd 11:30–21:00, pon. zamknięte', 'Tue–Sun 11:30–21:00, closed Mon'), L('ceny do potwierdzenia', 'prices to confirm'), L('ok. 1,1 km od Hotel Sor1', 'about 1.1 km from Hotel Sor1'), 'https://www.google.com/maps/search/?api=1&query=Friends+the+Restaurant+215+Street+13+Phnom+Penh', 'https://phanganist.com/phnom-penh/friends-the-restaurant', L('społeczna restauracja', 'social enterprise')),
    venue(L('Elephant Bar, Raffles', 'Elephant Bar, Raffles'), L('Klimatyczny kolonialny bar z koktajlami, przekąskami i muzyką na żywo.', 'Atmospheric colonial bar with cocktails, snacks and live music.'), '92 Rukhak Vithei Daun Penh', L('14:00–24:00, muzyka od 18:00', '14:00–24:00, music from 18:00'), L('ceny do potwierdzenia', 'prices to confirm'), L('ok. 1 km od Hotel Sor1', 'about 1 km from Hotel Sor1'), 'https://www.google.com/maps/search/?api=1&query=Elephant+Bar+Raffles+Hotel+Le+Royal+92+Rukhak+Vithei+Daun+Penh+Phnom+Penh', 'https://www.raffles.com/phnom-penh/dining/elephant-bar'),
    venue(L('Malis', 'Malis'), L('Klimatyczna kolacja z wysokiej klasy kuchnią khmerską na dziedzińcu ze stawem.', 'Atmospheric dinner with upscale Khmer cuisine in a courtyard with a pond.'), '136 Norodom Blvd', L('06:30–22:30, godziny do potwierdzenia', '06:30–22:30, hours to confirm'), L('ceny do potwierdzenia', 'prices to confirm'), L('ok. 1,9 km od Hotel Sor1', 'about 1.9 km from Hotel Sor1'), 'https://www.google.com/maps/search/?api=1&query=Malis+Restaurant+136+Norodom+Blvd+Phnom+Penh', 'https://www.malis-restaurant.com/'),
    venue(L('Sovanna BBQ', 'Sovanna BBQ'), L('Lokalne grillowane mięsa i piwo, głośno i niedrogo.', 'Local grilled meats and beer, loud and inexpensive.'), 'Street 21, Tonle Bassac', L('15:30–22:00 lub 16:00–23:00, godziny do sprawdzenia', '15:30–22:00 or 16:00–23:00, hours to confirm'), L('tanio, ceny do potwierdzenia', 'cheap, prices to confirm'), L('ok. 1,8 km od Hotel Sor1', 'about 1.8 km from Hotel Sor1'), 'https://www.google.com/maps/search/?api=1&query=Sovanna+BBQ+Street+21+Tonle+Bassac+Phnom+Penh', 'https://www.foodpanda.com.kh/en/restaurant/hsay/sovanna-bbq-tonle-basak'),
    venue(L('Russian Market food court', 'Russian Market food court'), L('Khmerskie dania i kawa w hali targowej, tylko w dzień.', 'Khmer dishes and coffee in the market hall, daytime only.'), 'Corner St. 163 and St. 440, Chamkar Mon', L('ok. 06:00–16:30/17:00', 'about 06:00–16:30/17:00'), L('tanie, gotówka, ceny do potwierdzenia', 'cheap, cash, prices to confirm'), L('ok. 3 km od Hotel Sor1', 'about 3 km from Hotel Sor1'), 'https://www.google.com/maps/search/?api=1&query=Russian+Market+Toul+Tom+Poung+Phnom+Penh', 'https://toultompong.com/en')
  ],
  massage: [
    venue(L('Seeing Hands przy Wat Phnom', 'Seeing Hands by Wat Phnom'), L('Masaż wykonywany przez niewidomych terapeutów w prostym przedsiębiorstwie społecznym.', 'Massage by visually impaired therapists in a simple social enterprise.'), 'No. 34Eo, Oknha Ing Bun Hoaw, St. 108', L('8:00–21:00, do potwierdzenia', '08:00–21:00, confirm'), L('6–8 USD/godz.', 'USD 6–8/hour'), L('ok. 1 km od Hotel Sor1', 'about 1 km from Hotel Sor1'), 'https://www.google.com/maps/search/?api=1&query=Seeing+Hands+Massage+by+Blind+People+St+108+Phnom+Penh', 'https://thewellfrog.com/kh/phnom-penh/seeing-hands-massage-wat-phnom', L('społeczne', 'social')),
    venue(L('Tath Nika Shiatsu & Anma', 'Tath Nika Shiatsu & Anma'), L('Centrum prowadzone przez niewidomą właścicielkę, z mocnym uciskiem shiatsu i anma.', 'Centre run by a blind owner, with firm shiatsu and anma pressure.'), 'House #75D, St. 395, corner St. 95', L('8:30–21:00 lub 7:00–21:00, do potwierdzenia', '08:30–21:00 or 07:00–21:00, confirm'), L('8 USD/godz.', 'USD 8/hour'), L('ok. 2,5 km od Hotel Sor1', 'about 2.5 km from Hotel Sor1'), 'https://www.google.com/maps/search/?api=1&query=Tath+Nika+Shiatsu+Anma+Massage+Center+Phnom+Penh', 'https://thewellfrog.com/blog/blind-massage-phnom-penh-guide', L('społeczne', 'social')),
    venue(L('Bodia Spa Riverside', 'Bodia Spa Riverside'), L('Sprawdzone spa z masażem Tonic i refleksologią stóp.', 'Established spa with Tonic massage and foot reflexology.'), 'No. 26–28 Samdech Sothearos Blvd, corner St. 178', L('10:00–23:00 lub 9:00–22:00, godziny do potwierdzenia', '10:00–23:00 or 09:00–22:00, confirm'), L('Tonic 60 min 35 USD, Reflexology 28 USD', 'Tonic 60 min USD 35, Reflexology USD 28'), L('ok. 1,3 km od Hotel Sor1', 'about 1.3 km from Hotel Sor1'), 'https://www.google.com/maps/search/?api=1&query=Bodia+Spa+Riverside+Phnom+Penh', 'https://bodia-spa.com/products.json')
  ],
  shop: [
    venue(L('Goody Shop Vimean Ekareach', 'Goody Shop Vimean Ekareach'), L('Główny adres na K-beauty, autoryzowany przez COSRX, dobry wybór na zakupy w Phnom Penh.', 'Main K-beauty stop, authorised by COSRX and a good Phnom Penh shopping choice.'), 'Vimean Ekareach, Sihanouk Blvd', L('godziny do potwierdzenia', 'hours to confirm'), L('COSRX Snail ok. 11 USD, inne ceny do potwierdzenia', 'COSRX Snail about USD 11, other prices to confirm'), L('odległość do potwierdzenia', 'distance to confirm'), 'https://www.google.com/maps/search/?api=1&query=Goody+Shop+Vimean+Ekareach+Phnom+Penh', 'https://www.cosrx.com/pages/store_official'),
    venue(L('Goody Beauty Station TTP', 'Goody Beauty Station TTP'), L('Oddział przy Russian Market, warto sprawdzić dostępność konkretnych marek przed zakupem.', 'Branch by Russian Market, check specific brands before buying.'), 'Toul Tom Poung, Phnom Penh', L('godziny do potwierdzenia', 'hours to confirm'), L('Beauty of Joseon ok. 11 USD, ceny do potwierdzenia', 'Beauty of Joseon about USD 11, prices to confirm'), L('ok. 3 km od Hotel Sor1', 'about 3 km from Hotel Sor1'), 'https://www.google.com/maps/search/?api=1&query=Goody+Beauty+Station+TTP+Phnom+Penh', 'https://www.cosrx.com/pages/store_official'),
    venue(L('U-Care Norodom', 'U-Care Norodom'), L('Apteka i bezpieczny awaryjny wybór, U-Care jest autoryzowanym sprzedawcą COSRX.', 'Pharmacy and reliable backup, U-Care is an authorised COSRX seller.'), 'Norodom Blvd, Phnom Penh', L('godziny do potwierdzenia', 'hours to confirm'), L('ceny i dostępność do potwierdzenia', 'prices and stock to confirm'), L('ok. 1–1,5 km od Hotel Sor1', 'about 1–1.5 km from Hotel Sor1'), 'https://www.google.com/maps/search/?api=1&query=U-Care+Pharmacy+Norodom+Phnom+Penh', 'https://www.cosrx.com/pages/store_official')
  ]
});

Object.assign(TRIP.places.siemreap, {
  food: [
    venue(L('The Sugar Palm', 'The Sugar Palm'), L('Domowa kuchnia khmerska w drewnianym domu, w samym rejonie Wat Bo.', 'Home-style Khmer cooking in a wooden house in the Wat Bo area.'), 'Street 27, Wat Bo Village', L('pn–sb 11:30–14:30 i 18:00–22:00, nd zamknięte', 'Mon–Sat 11:30–14:30 and 18:00–22:00, closed Sun'), L('dania główne ok. 6–12 USD', 'mains about USD 6–12'), L('ok., od Wat Bo, ok. 0,5 km', 'about, from Wat Bo, about 0.5 km'), 'https://www.google.com/maps/search/?api=1&query=The+Sugar+Palm+Street+27+Wat+Bo+Village+Siem+Reap', 'https://cambodiago.com/destinations/siem-reap/the-sugar-palm/'),
    venue(L('HAVEN', 'HAVEN'), L('Społeczna restauracja szkoleniowa z ogrodem i opcjami wegetariańskimi.', 'Social training restaurant with a garden and vegetarian options.'), 'Chocolate Road, Sala Kamreuk', L('wt–nd 10:00–22:00, pon. zamknięte', 'Tue–Sun 10:00–22:00, closed Mon'), L('ceny do potwierdzenia', 'prices to confirm'), L('ok., od Wat Bo, ok. 0,9 km', 'about, from Wat Bo, about 0.9 km'), 'https://www.google.com/maps/search/?api=1&query=HAVEN+Chocolate+Road+Sala+Kamreuk+Siem+Reap', 'https://havencambodia.com/', L('społeczna restauracja', 'social enterprise')),
    venue(L('Marum', 'Marum'), L('Kreatywne khmerskie tapas w drewnianym domu z ogrodem, projekt społeczny.', 'Creative Khmer tapas in a wooden house with a garden, a social project.'), '#8A,B Phum Slor Kram', L('godziny do sprawdzenia', 'hours to confirm'), L('ceny do potwierdzenia', 'prices to confirm'), L('ok., od Wat Bo, ok. 1 km', 'about, from Wat Bo, about 1 km'), 'https://www.google.com/maps/search/?api=1&query=Marum+8A+Phum+Slor+Kram+Wat+Polanka+Siem+Reap', 'https://angkornow.com/venues/marum', L('społeczna restauracja', 'social enterprise'))
  ],
  massage: [
    venue(L('Seeing Hands Siem Reap', 'Seeing Hands Siem Reap'), L('Terapeutyczny masaż niewidomych masażystów, bez luksusowej oprawy.', 'Therapeutic massage by blind therapists, without a luxury setting.'), 'Sivatha Blvd, opposite Phsar Kandal', L('typowo 9:00–22:00, do potwierdzenia', 'typically 09:00–22:00, confirm'), L('5–7 USD, cena do potwierdzenia', 'USD 5–7, price to confirm'), L('ok., od Wat Bo, ok. 2,8 km', 'about, from Wat Bo, about 2.8 km'), 'https://www.google.com/maps/search/?api=1&query=Seeing+Hands+Massage+Sivatha+Siem+Reap', 'https://cambodiago.com/destinations/siem-reap/seeing-hands-massage/', L('społeczne', 'social')),
    venue(L('Lemongrass Garden Spa', 'Lemongrass Garden Spa'), L('Rodzinne, ekologiczne spa z własną farmą ziół i szkoleniem terapeutów.', 'Family-owned eco-conscious spa with an herb farm and therapist training.'), '105B Sivutha Blvd', L('10:00–22:00 codziennie', '10:00–22:00 daily'), L('18–20 USD za 60 min, do potwierdzenia', 'USD 18–20 for 60 min, confirm'), L('ok., od Wat Bo, ok. 2,6 km', 'about, from Wat Bo, about 2.6 km'), 'https://www.google.com/maps/search/?api=1&query=Lemongrass+Garden+Spa+105B+Sivutha+Siem+Reap', 'https://lemongrassgarden.com/'),
    venue(L('Mudita Spa', 'Mudita Spa'), L('Duże spa z tradycyjnym masażem khmerskim i sauną ziołową.', 'Large spa with traditional Khmer massage and herbal sauna.'), 'Wat Bo, Sala Kamreuk', L('9:00–22:00, godziny do potwierdzenia', '09:00–22:00, hours to confirm'), L('32 USD za 60 min', 'USD 32 for 60 min'), L('ok., od Wat Bo, ok. 2,6 km', 'about, from Wat Bo, about 2.6 km'), 'https://www.google.com/maps/search/?api=1&query=Mudita+Spa+Wat+Bo+Siem+Reap', 'https://muditaspa.com/package/message-therapy/')
  ],
  shop: [
    venue(L('U-Care, Lucky Mall', 'U-Care, Lucky Mall'), L('Najbezpieczniejszy lokalny wybór na uzupełnienia, autoryzowany sprzedawca COSRX, zapas może być niepewny.', 'Safest local option for top-ups, an authorised COSRX seller, though stock can be uncertain.'), 'Sivatha Blvd, Lucky Mall', L('Lucky Mall 9:00–22:00, sklep do potwierdzenia', 'Lucky Mall 09:00–22:00, store to confirm'), L('ceny i dostępność do potwierdzenia', 'prices and stock to confirm'), L('ok., od Wat Bo, ok. 1 km', 'about, from Wat Bo, about 1 km'), 'https://www.google.com/maps/search/?api=1&query=U-Care+Lucky+Mall+Siem+Reap', 'https://www.cosrx.com/pages/store_official'),
    venue(L('The Face Shop', 'The Face Shop'), L('Sklep jednej koreańskiej marki, bez gwarancji dostępności COSRX, Anua lub Beauty of Joseon.', 'Single-brand Korean shop, with no guarantee of COSRX, Anua or Beauty of Joseon stock.'), 'Sivatha St, Svay Dangkum', L('9:00–21:00 codziennie', '09:00–21:00 daily'), L('ceny do potwierdzenia', 'prices to confirm'), L('ok., od Wat Bo, ok. 1 km', 'about, from Wat Bo, about 1 km'), 'https://www.google.com/maps/search/?api=1&query=The+Face+Shop+Sivatha+Siem+Reap', 'https://kh58761.contact.page/')
  ]
});

Object.assign(TRIP.places.kohrongsamloem, {
  food: [
    venue(L('Bong\'s', 'Bong\'s'), L('Lokal przy molo z dużymi porcjami, tacos, bowls i śniadaniami.', 'Pier-side spot with large portions, tacos, bowls and breakfasts.'), 'Main pier, M\'Pai Bay beach', L('godziny do sprawdzenia na miejscu', 'hours to check on site'), L('ceny do sprawdzenia na miejscu', 'prices to check on site'), L('przy molo', 'by the pier'), 'https://www.google.com/maps/search/?api=1&query=Bong%27s+Guesthouse+M%27Pai+Bay+Koh+Rong+Samloem', 'https://themapcambodia.com/koh-rong-samloem'),
    venue(L('Lost and Found', 'Lost and Found'), L('Mała knajpka przy plaży z tostami, shakshuką i kawą wietnamską.', 'Small beachfront spot with cheese toasties, shakshuka and Vietnamese coffee.'), 'Main beach, St 23, M\'Pai Bay', L('godziny do sprawdzenia na miejscu', 'hours to check on site'), L('ceny do sprawdzenia na miejscu', 'prices to check on site'), L('w wiosce', 'in the village'), 'https://www.google.com/maps/search/?api=1&query=Lost+and+Found+M%27Pai+Bay+Koh+Rong+Samloem', 'https://themapcambodia.com/koh-rong-samloem'),
    venue(L('Spicy23', 'Spicy23'), L('Hostel z restauracją, polecany za wegetariańskie dania khmerskie.', 'Hostel restaurant recommended for vegetarian Khmer dishes.'), 'M\'Pai Bay village', L('godziny do sprawdzenia na miejscu', 'hours to check on site'), L('ceny do sprawdzenia na miejscu', 'prices to check on site'), L('w wiosce', 'in the village'), 'https://www.google.com/maps/search/?api=1&query=Spicy23+M%27Pai+Bay+Koh+Rong+Sanloem', 'https://southeastasiabackpacker.com/destinations/cambodia/mpai-bay-koh-rong-sanloem/')
  ],
  massage: [
    venue(L('Island Spa 23', 'Island Spa 23'), L('Status niepewny, trop spa w wiosce, działanie trzeba potwierdzić na miejscu.', 'Status uncertain, a village spa lead whose operation must be confirmed on site.'), '5 Community Way, M\'Pai Bay Village', L('10:00–18:00, niepotwierdzone', '10:00–18:00, unconfirmed'), L('cena niepotwierdzona', 'price unconfirmed'), L('ok. 0,2 km od M\'Pay Bay Guesthouse', 'about 0.2 km from M\'Pay Bay Guesthouse'), 'https://www.google.com/maps/search/?api=1&query=Island+Spa+23+M%27Pai+Bay+Koh+Rong+Sanloem', 'https://www.fresha.com/a/island-spa-23-koh-rong-samloem-community-way-5-kdgllv4e', L('status niepewny', 'status uncertain')),
    venue(L('Ponleu Spa, Saracen Bay', 'Ponleu Spa, Saracen Bay'), L('Spa przy plaży, na wyprawę z M\'Pai Bay przez dżunglę albo łodzią.', 'Beachfront spa, an excursion from M\'Pai Bay by jungle trail or boat.'), 'Saracen Bay, Koh Rong Sanloem', L('9:00–20:00 codziennie', '09:00–20:00 daily'), L('25–30 USD', 'USD 25–30'), L('ok. 4,7 km od M\'Pay Bay Guesthouse', 'about 4.7 km from M\'Pay Bay Guesthouse'), 'https://www.google.com/maps/search/?api=1&query=Ponleu+Spa+Saracen+Bay+Koh+Rong+Sanloem', 'https://autourasia.com/where-to-relax-in-sihanoukville-top-5-best-spa-massage-a-sihanoukville-b1316.html')
  ],
  massageNote: L('W wiosce nie potwierdziłyśmy działającego salonu, zapytajcie na recepcji M\'Pay Bay Guesthouse.', 'We did not confirm an operating salon in the village, ask at the M\'Pay Bay Guesthouse reception.')
});

Object.assign(TRIP.places.phnompenh, {
  lede: L('Nad czarną wodą Mekongu złote dachy spotykają klaksony, kadzidło i nocny żar ulicznych patelni.', 'Above the dark Mekong, golden roofs meet horns, incense and the night heat of street-side pans.'),
  mood: L('rzeka · złoto · pamięć', 'river · gold · memory'),
  story: L('Phnom Penh wyrósł przy zbiegu Mekongu, Tonlé Sap i Bassacu. Według legendy pani Penh znalazła w rzece posągi Buddy i wzniosła dla nich sanktuarium na wzgórzu, od którego miasto wzięło nazwę. O świcie mnisi przesuwają się w szafranowych szatach, targi pachną limonką, pieprzem i grillowanym mięsem, a po zmroku Sisowath Quay staje się wspólnym salonem miasta.\n\nZa królewskim złotem stoi trudna pamięć Tuol Sleng i Choeung Ek. Te miejsca wymagają czasu i ciszy, ale pozwalają zrozumieć współczesną Kambodżę. Pomiędzy nimi warto patrzeć na modernistyczne budynki, kolonialne fasady i szeroki nurt rzeki. Stolica jest chaotyczna, czuła i pełna sprzeczności.', 'Phnom Penh grew where the Mekong, Tonlé Sap and Bassac rivers meet. Legend says Lady Penh found Buddha statues floating in the river and raised a shrine for them on the hill that gave the city its name. At dawn monks move through the streets in saffron robes, markets smell of lime, pepper and grilled meat, and after dark Sisowath Quay becomes the city’s shared living room.\n\nBehind the royal gold lies the difficult memory of Tuol Sleng and Choeung Ek. These places demand time and quiet, yet they are essential to understanding modern Cambodia. Between them, notice modernist landmarks, weathered colonial façades and the wide river current. The capital feels chaotic, tender and full of contradictions.'),
  experiences: [
    { t: L('Śniadanie num banh chok', 'Num banh chok for breakfast'), d: L('Spróbujcie ryżowego makaronu z ziołami i lekkim rybnym curry, klasycznego khmerskiego poranka.', 'Try rice noodles with herbs and a light fish curry, a classic Khmer morning meal.') },
    { t: L('Błogosławieństwo mnichów', 'A monk blessing'), d: L('W świątyni zapytajcie z szacunkiem o ceremonię z modlitwą i czerwoną bransoletką, a datek złóżcie dyskretnie.', 'At a temple, respectfully ask about a prayer and red-thread blessing, offering a discreet donation.') },
    { t: L('Zachód słońca na rzece', 'Sunset on the river'), d: L('Wsiądźcie na prostą łódź przy nabrzeżu i obserwujcie panoramę od strony Mekongu.', 'Board a simple boat from the quay and watch the skyline from the Mekong.') },
    { t: L('Targ po zmroku', 'A market after dark'), d: L('Szukajcie grillowanych szaszłyków, kleistego ryżu i świeżych soków, wybierając stoiska z dużym ruchem.', 'Look for grilled skewers, sticky rice and fresh juice, choosing busy stalls.') },
    { t: L('Khmerski masaż', 'A Khmer massage'), d: L('Po dniu w upale wybierzcie tradycyjny masaż w sprawdzonym miejscu i ustalcie siłę ucisku.', 'After a hot day, book a traditional massage at a reputable place and agree on pressure first.') },
  ],
  nearby: [
    { t: L('Koh Dach, Wyspa Jedwabiu', 'Koh Dach, Silk Island'), d: L('Rowerowa pętla prowadzi między warsztatami tkackimi, polami i domami na palach.', 'A cycling loop passes weaving workshops, fields and stilt houses.'), dist: L('ok. 45 min z przeprawą', 'about 45 min including ferry') },
    { t: L('Oudong', 'Oudong'), d: L('Dawna stolica królewska ma stupy na grzbiecie wzgórza i szeroki widok na równinę.', 'The former royal capital has stupas along a hilltop ridge and broad views across the plain.'), dist: L('ok. 1,5 h samochodem', 'about 1.5 h by car') },
    { t: L('Tonlé Bati i Ta Prohm', 'Tonlé Bati and Ta Prohm'), d: L('Angkoriańska świątynia nad jeziorem daje spokojny półdniowy wypad poza stolicę.', 'An Angkorian temple beside a lake makes a quiet half-day escape from the capital.'), dist: L('ok. 1,5 h samochodem', 'about 1.5 h by car') },
    { t: L('Kampot i Kep', 'Kampot and Kep'), d: L('Kolonialne nabrzeże, pieprzowe farmy i wybrzeże warto rozważyć tylko przy dodatkowej nocy.', 'A colonial riverside, pepper farms and the coast are worthwhile only with an extra night.'), dist: L('ok. 3,5 h samochodem', 'about 3.5 h by car') },
  ],
});

Object.assign(TRIP.places.siemreap, {
  lede: L('O świcie kamienne wieże wyrastają z czarnej tafli, a dżungla powoli oddaje świątynie światłu.', 'At dawn stone towers rise from black water while the jungle slowly gives its temples back to the light.'),
  mood: L('mgła · kamień · korzenie', 'mist · stone · roots'),
  story: L('Angkor był sercem imperium Khmerów, którego system kanałów, zbiorników i świątyń należał do najbardziej złożonych krajobrazów miejskich średniowiecza. Przed świtem przy Angkor Wat pachnie wilgotną ziemią i kadzidłem. Potem pierwsze światło odsłania reliefy, twarze Bayonu i figowce oplatające Ta Prohm. Najmocniejsze chwile przychodzą między głównymi punktami, gdy cykady zagłuszają tuk-tuki.\n\nSiem Reap po zmroku zmienia tempo. Są tu nocne targi, warsztaty rzemieślnicze i współczesny cyrk Phare, który opowiada kambodżańskie historie akrobatyką. Po końcu pory deszczowej Tonlé Sap nadal bywa wysokie, więc wioski na palach i zalany las pokazują wodny rytm regionu. Poziom wody i rejsy warto sprawdzić przed wyjazdem.', 'Angkor was the heart of the Khmer Empire, whose canals, reservoirs and temples formed one of the medieval world’s most complex urban landscapes. Before dawn at Angkor Wat, damp earth mixes with incense. First light then reveals carved galleries, Bayon’s faces and strangler figs gripping Ta Prohm. The most powerful moments arrive between headline sites, when cicadas drown out the tuk-tuks.\n\nAfter dark, Siem Reap changes pace. Night markets, craft workshops and the contemporary Phare circus tell Cambodian stories through making and performance. At the end of the wet season Tonlé Sap can still stand high, so stilt villages and flooded forest reveal the region’s life on water. Check water levels and boat conditions before travelling.'),
  experiences: [
    { t: L('Wschód słońca i cichy krużganek', 'Sunrise and a quiet gallery'), d: L('Po klasycznym widoku nad stawem wejdźcie od razu do Angkor Wat i znajdźcie spokojny fragment reliefów.', 'After the classic pond view, enter Angkor Wat promptly and find a quiet stretch of bas-reliefs.') },
    { t: L('Błogosławieństwo w pagodzie', 'A pagoda blessing'), d: L('Zapytajcie przewodnika o czynną pagodę, gdzie można z szacunkiem otrzymać modlitwę i czerwoną nić.', 'Ask a guide about an active pagoda where visitors may respectfully receive a prayer and red thread.') },
    { t: L('Amok i nom krok', 'Amok and nom krok'), d: L('Spróbujcie kremowego amoku gotowanego z mlekiem kokosowym oraz małych kokosowych placuszków z ulicy.', 'Try creamy coconut amok and the small coconut rice cakes called nom krok.') },
    { t: L('Warsztat rzemiosła khmerskiego', 'A Khmer craft workshop'), d: L('Wybierzcie zajęcia z ceramiki, rzeźbienia lub tkania prowadzone przez lokalnych twórców.', 'Choose a pottery, carving or weaving session led by local makers.') },
    { t: L('Wieczór z Phare', 'An evening at Phare'), d: L('Akrobatyka, muzyka i teatr składają się tu na współczesną opowieść, nie pokaz folklorystyczny.', 'Acrobatics, music and theatre create a contemporary story rather than a folklore display.') },
    { t: L('Rejs przez zalany las', 'A flooded-forest boat ride'), d: L('Płyńcie małą łodzią przy wysokiej wodzie, ale sprawdźcie poziom jeziora i zasady rejsu przed wyjazdem.', 'Take a small boat when water is high, checking lake levels and arrangements before travelling.') },
  ],
  nearby: [
    { t: L('Beng Mealea', 'Beng Mealea'), d: L('Zawalona świątynia w lesie zachowała atmosferę odkrywania kamienia pod korzeniami i mchem.', 'A collapsed forest temple preserves the thrill of finding stone beneath roots and moss.'), dist: L('ok. 1,5 h samochodem', 'about 1.5 h by car') },
    { t: L('Phnom Kulen', 'Phnom Kulen'), d: L('Święta góra łączy wodospady, leżącego Buddę i rzeźbienia w skalnym korycie rzeki.', 'The sacred mountain combines waterfalls, a reclining Buddha and carvings in a rocky riverbed.'), dist: L('ok. 1,5 h samochodem', 'about 1.5 h by car') },
    { t: L('Koh Ker', 'Koh Ker'), d: L('Dawna stolica z piramidalną świątynią Prasat Thom nadaje się na długi dzień z Beng Mealea.', 'A former capital with the pyramid-like Prasat Thom works well as a long day with Beng Mealea.'), dist: L('ok. 2,5 h samochodem', 'about 2.5 h by car') },
    { t: L('Kompong Khleang', 'Kompong Khleang'), d: L('Rozległa społeczność domów na palach leży dalej niż Kampong Phluk i zwykle czuje się mniej turystycznie.', 'This extensive stilt-house community lies farther than Kampong Phluk and often feels less touristic.'), dist: L('ok. 1,5 h samochodem', 'about 1.5 h by car') },
    { t: L('Banteay Srei', 'Banteay Srei'), d: L('Różowy piaskowiec i niezwykle precyzyjne reliefy najlepiej oglądać w miękkim porannym świetle.', 'Pink sandstone and exceptionally fine carvings look best in soft morning light.'), dist: L('ok. 1 h tuk-tukiem', 'about 1 h by tuk-tuk') },
  ],
});

Object.assign(TRIP.places.sihanoukville, {
  lede: L('To niespokojna brama na wyspy, gdzie szkielety wieżowców kończą się nagle przy morzu i namorzynach.', 'This is a restless gateway to the islands, where unfinished towers stop abruptly at the sea and mangroves.'),
  mood: L('beton · port · namorzyny', 'concrete · port · mangroves'),
  story: L('Sihanoukville zmieniło się gwałtownie pod wpływem boomu budowlanego i kasyn. Niedokończone wieżowce, szerokie place budowy i intensywny ruch sprawiają, że nie jest to dawne senne kąpielisko. Warto patrzeć na nie uczciwie: jako na portową strefę przemiany, nocleg przed promem i punkt startu w stronę wysp, nie jako główny cel plażowego wyjazdu.\n\nNajciekawszy kontrapunkt leży na obrzeżach. W Parku Narodowym Ream rzeka wchodzi między namorzyny, łodzie suną pod splątanymi korzeniami, a za lasem pojawiają się ciche plaże. Po końcu pory deszczowej zieleń jest gęsta, lecz warunki rejsów mogą się zmieniać. Ustalcie transport i dostępność przed wyjazdem.', 'Sihanoukville changed abruptly through a construction and casino boom. Unfinished towers, broad building sites and heavy traffic mean this is no longer the sleepy beach town many remember. See it honestly: a port city in rapid transition, an overnight stop before the ferry and a gateway to islands, rather than the main beach destination.\n\nThe compelling counterpoint lies at its edge. In Ream National Park the river enters mangroves, boats slip beneath tangled roots and quiet beaches appear beyond the forest. At the end of the rainy season the vegetation is dense, though boat and trail conditions can change. Confirm transport and local access before setting out.'),
  experiences: [
    { t: L('Poranek w porcie', 'Morning at the pier'), d: L('Przyjedźcie wcześniej, obserwujcie ładowanie łodzi i potwierdźcie właściwy pomost oraz przystanek na wyspie.', 'Arrive early, watch the boats being loaded and confirm the correct pier and island stop.') },
    { t: L('Rejs przez namorzyny', 'A mangrove boat ride'), d: L('W Ream wybierzcie lokalną łódź z przewodnikiem, jeśli poziom wody i pogoda pozwalają.', 'At Ream, take a local guided boat if water levels and weather permit.') },
    { t: L('Khmerskie owoce morza', 'Khmer seafood'), d: L('Spróbujcie świeżej ryby lub kałamarnicy z limonką i pieprzem kampockim w ruchliwym miejscu.', 'Try fresh fish or squid with lime and Kampot pepper at a busy establishment.') },
    { t: L('Zmierzch na Otres', 'Dusk at Otres'), d: L('Krótki spacer po piasku pozwala złapać oddech przed promem, choć zabudowa szybko się zmienia.', 'A short walk on the sand offers breathing space before the ferry, although development changes quickly.') },
  ],
  nearby: [
    { t: L('Park Narodowy Ream', 'Ream National Park'), d: L('Namorzyny, rzeka, las i plaże najlepiej poznawać z lokalnym przewodnikiem.', 'Mangroves, river, forest and beaches are best explored with a local guide.'), dist: L('ok. 45 min samochodem', 'about 45 min by car') },
    { t: L('Koh Ta Kiev', 'Koh Ta Kiev'), d: L('Słabo zabudowana wyspa oferuje proste plaże i leśne ścieżki, ale połączenia trzeba sprawdzić.', 'A lightly developed island offers simple beaches and forest paths, but connections need checking.'), dist: L('ok. 1 h z przeprawą', 'about 1 h including boat') },
    { t: L('Kbal Chhay', 'Kbal Chhay'), d: L('Zespół kaskad ma najwięcej wody po porze deszczowej, warunki sprawdźcie przed wyjazdem.', 'The cascades carry most water after the rainy season; check conditions before travelling.'), dist: L('ok. 40 min samochodem', 'about 40 min by car') },
    { t: L('Bokor i Kampot', 'Bokor and Kampot'), d: L('Górskie ruiny, mgła i kolonialne nabrzeże wymagają osobnego, długiego dnia lub dodatkowej nocy.', 'Mountain ruins, mist and a colonial riverside require a separate long day or an extra night.'), dist: L('ok. 2,5 h samochodem', 'about 2.5 h by car') },
  ],
});

Object.assign(TRIP.places.kohrong, {
  lede: L('Za ostatnim pomostem zaczyna się wyspa białego piasku, ciężkiej dżungli i iskier budzących się w nocnej wodzie.', 'Beyond the last jetty begins an island of white sand, heavy jungle and sparks waking in the night water.'),
  mood: L('sól · dżungla · fosfor', 'salt · jungle · phosphorescence'),
  story: L('Koh Rong ma dwa rytmy. Przy Koh Touch słychać silniki łodzi, muzykę i rozmowy na pomostach, lecz kilka zatok dalej zostają tylko fale, cykady i ciemna ściana lasu. Ścieżki przecinają wilgotną dżunglę, a zachodnie plaże otwierają się na długie zachody słońca. Po porze deszczowej szlaki bywają błotniste, więc dobre buty znaczą więcej niż plażowy plan.\n\nNajbardziej niezwykła noc przychodzi bez silnego księżyca. Poruszona woda może rozbłysnąć drobnymi punktami bioluminescencyjnego planktonu. Zjawisko jest naturalne i zmienne, zależne od ciemności, pogody oraz warunków morza. Wybierzcie odpowiedzialnego operatora, unikajcie kosmetyków przed kąpielą i sprawdźcie możliwość wypłynięcia na miejscu.', 'Koh Rong moves to two rhythms. Around Koh Touch you hear boat engines, music and voices on the piers, but a few bays away only waves, cicadas and a dark wall of forest remain. Trails cross humid jungle while western beaches open toward long sunsets. After the rainy season paths can be muddy, making proper shoes more useful than a rigid beach plan.\n\nThe strangest night comes without a bright moon. Disturbed water may flash with tiny points of bioluminescent plankton. This natural display varies with darkness, weather and sea conditions. Choose a responsible operator, avoid lotions before swimming and check locally whether a trip is possible.'),
  experiences: [
    { t: L('Nocne pływanie z planktonem', 'A plankton night swim'), d: L('Wypłyńcie z dala od świateł tylko przy bezpiecznych warunkach. Widoczność zjawiska nie jest gwarantowana.', 'Go beyond the lights only in safe conditions. The natural display is never guaranteed.') },
    { t: L('Przejście przez dżunglę', 'A jungle crossing'), d: L('Załóżcie pełne buty, weźcie wodę i ruszcie za dnia na Long Beach lub między zatokami.', 'Wear closed shoes, carry water and cross toward Long Beach or another bay in daylight.') },
    { t: L('Zachód na zachodnim brzegu', 'Sunset on the west coast'), d: L('Dotrzyjcie wcześniej na Sok San lub Long Beach i zaplanujcie bezpieczny powrót po ciemku.', 'Reach Sok San or Long Beach early and arrange a safe return after dark.') },
    { t: L('Ryba z grilla', 'Grilled island fish'), d: L('Zapytajcie o dzienny połów i spróbujcie ryby z limonką, czosnkiem oraz pieprzem.', 'Ask for the day’s catch and try fish grilled with lime, garlic and pepper.') },
    { t: L('Kajak o spokojnym poranku', 'A calm-morning kayak'), d: L('Przy dobrej pogodzie opłyńcie fragment zatoki, zachowując dystans od łodzi i rafy.', 'In good weather, paddle around part of a bay while keeping clear of boats and reef.') },
  ],
  nearby: [
    { t: L('Sok San', 'Sok San'), d: L('Wioska i długa zachodnia plaża pokazują spokojniejszą stronę dużej wyspy.', 'The village and long western beach reveal a quieter side of the large island.'), dist: L('ok. 30 min łodzią', 'about 30 min by boat') },
    { t: L('Prek Svay', 'Prek Svay'), d: L('Rybacka osada na północy pozwala zobaczyć codzienność poza głównymi zatokami turystycznymi.', 'This northern fishing settlement offers a glimpse of life beyond the main visitor bays.'), dist: L('ok. 45 min łodzią', 'about 45 min by boat') },
    { t: L('Lonely Beach', 'Lonely Beach'), d: L('Odległa północna zatoka daje poczucie końca świata, ale transport trzeba umówić z wyprzedzeniem.', 'A remote northern bay feels like the end of the world, but transport must be arranged ahead.'), dist: L('ok. 1 h łodzią', 'about 1 h by boat') },
    { t: L('Koh Rong Samloem', 'Koh Rong Samloem'), d: L('Spokojniejsza sąsiednia wyspa ma zatoki połączone leśnymi szlakami. Sprawdźcie aktualne promy.', 'The quieter neighbouring island has bays linked by forest trails. Check current ferry services.'), dist: L('ok. 30 min promem', 'about 30 min by ferry') },
  ],
});

Object.assign(TRIP.places.kohrongsamloem, {
  lede: L('Tutaj dzień mierzy się cieniem palm, skrzypieniem pomostu i ścieżką, która znika w mokrym lesie.', 'Here the day is measured by palm shade, a creaking jetty and a path disappearing into wet forest.'),
  mood: L('hamak · las · cisza', 'hammock · forest · quiet'),
  story: L('Koh Rong Samloem jest mniejsza i spokojniejsza, lecz nie całkiem oswojona. Saracen Bay otwiera się jasnym łukiem ku wschodowi, a szlak przez wnętrze wyspy prowadzi pod liśćmi i splątanymi lianami na zachodnie plaże. Tam wieczorem słońce gaśnie nad Zatoką Tajlandzką, a po zmroku las zaczyna mówić głosami gekonów i cykad.\n\nNa północy M’Pai Bay zachowuje rytm rybackiej wioski, z drewnianymi pomostami i łodziami wracającymi z połowu. Wyspa szybko się zmienia, a część dawnych obiektów bywa zamykana lub przebudowywana. Traktujcie ją jako miejsce na powolny spacer, snorkeling i ciszę. Warunki szlaków, promów oraz nocnych rejsów sprawdźcie na miejscu.', 'Koh Rong Samloem is smaller and quieter, yet not entirely tamed. Saracen Bay opens in a pale arc to the east, while a trail through the island runs beneath broad leaves and tangled vines toward western beaches. There the sun drops into the Gulf of Thailand, and after dark the forest speaks in gecko calls and cicadas.\n\nIn the north, M’Pai Bay keeps the rhythm of a fishing village, with wooden jetties and boats returning from the day’s catch. The island is changing quickly, and former businesses may close or be redeveloped. Treat it as a place for slow walks, snorkelling and quiet. Check trail, ferry and night-boat conditions locally.'),
  experiences: [
    { t: L('Przejście na Lazy Beach', 'Walk to Lazy Beach'), d: L('Ruszcie za dnia przez las, w pełnych butach, i zostańcie na zachód tylko po ustaleniu powrotu.', 'Cross the forest in daylight and closed shoes, staying for sunset only after planning the return.') },
    { t: L('Snorkeling przy zatoce', 'Bay snorkelling'), d: L('Wybierzcie spokojny poranek i nie dotykajcie koralowców. Widoczność zależy od pogody.', 'Choose a calm morning and never touch coral. Visibility depends on the weather.') },
    { t: L('Nocna woda', 'Night water'), d: L('Zapytajcie o odpowiedzialny rejs na plankton z dala od świateł. Zjawisko jest sezonowe i niepewne.', 'Ask about a responsible plankton trip away from lights. The natural display is seasonal and uncertain.') },
    { t: L('Kolacja z dziennego połowu', 'Dinner from the day’s catch'), d: L('W M’Pai Bay zapytajcie o świeżą rybę, podawaną prosto z grilla z limonką.', 'In M’Pai Bay, ask for fresh fish served straight from the grill with lime.') },
    { t: L('Poranek bez planu', 'A morning without a plan'), d: L('Zacznijcie od kąpieli i kawy na pomoście, zanim pierwsze łodzie poruszą zatokę.', 'Start with a swim and coffee on the jetty before the first boats stir the bay.') },
  ],
  nearby: [
    { t: L('M’Pai Bay', 'M’Pai Bay'), d: L('Północna wioska ma drewniane pomosty, proste jedzenie i bardziej lokalny rytm niż Saracen Bay.', 'The northern village has wooden piers, simple food and a more local rhythm than Saracen Bay.'), dist: L('ok. 20 min łodzią', 'about 20 min by boat') },
    { t: L('Lazy Beach', 'Lazy Beach'), d: L('Zachodnia zatoka za lasem jest dobra na kąpiel i zachód przy spokojnym morzu.', 'The western bay beyond the forest suits swimming and sunset when the sea is calm.'), dist: L('ok. 45 min pieszo', 'about 45 min on foot') },
    { t: L('Sunset Beach', 'Sunset Beach'), d: L('Mała zachodnia zatoka jest osiągalna leśnym szlakiem, który po deszczu bywa śliski.', 'A small western bay is reached by a forest trail that can be slippery after rain.'), dist: L('ok. 45 min pieszo', 'about 45 min on foot') },
    { t: L('Koh Rong', 'Koh Rong'), d: L('Większa sąsiednia wyspa daje dłuższe plaże, więcej szlaków i żywsze wieczory.', 'The larger neighbouring island offers longer beaches, more trails and livelier evenings.'), dist: L('ok. 30 min promem', 'about 30 min by ferry') },
  ],
});

/* Transfery między przystankami — tekst zależny od typu miejsc */
TRIP.transfers = {
  'phnompenh>siemreap': { mode: 'bus', text: L('Giant Ibis z Phnom Penh, przyjazd ok. 18:30 na dworzec Giant Ibis w Siem Reap. Odbiera Was hotel (tuk-tuk 2 USD)', 'Giant Ibis from Phnom Penh, arriving about 18:30 at the Giant Ibis terminal in Siem Reap. The hotel picks you up (tuk-tuk 2 USD)') },
  'siemreap>phnompenh': { mode: 'bus', text: L('Autobus ok. 6 h albo lot 45 min', 'Bus about 6 h or a 45-min flight') },
  'siemreap>sihanoukville': { mode: 'bus', text: L('Nocny autobus z Siem Reap do Sihanoukville', 'Overnight bus from Siem Reap to Sihanoukville'), pending: true },
  'sihanoukville>kohrong': { mode: 'ferry', text: L('Prom z Serendipity Pier, 45–60 min', 'Ferry from Serendipity Pier, 45–60 min') },
  'sihanoukville>kohrongsamloem': { mode: 'ferry', text: L('Szybka łódź z Sihanoukville wprost do M\'Pai Bay na północy wyspy, ok. 45 min', 'Speedboat from Sihanoukville straight to M\'Pai Bay in the north of the island, about 45 min') },
  'kohrong>kohrongsamloem': { mode: 'ferry', text: L('Prom między wyspami, ok. 30 min', 'Inter-island ferry, about 30 min') },
  'kohrongsamloem>kohrong': { mode: 'ferry', text: L('Prom między wyspami, ok. 30 min', 'Inter-island ferry, about 30 min') },
  'kohrongsamloem>phnompenh': { mode: 'bus', text: L('Poranny prom na ląd, potem Giant Ibis 13:30 z Sihanoukville, przyjazd do Phnom Penh około 16:30', 'Morning ferry to the mainland, then Giant Ibis from Sihanoukville at 13:30, arriving in Phnom Penh around 16:30') },
  'kohrong>phnompenh': { mode: 'bus', text: L('Prom na ląd (~45 min) + autobus/van ok. 4 h', 'Ferry to the mainland (~45 min) + bus/van about 4 h') },
  'sihanoukville>phnompenh': { mode: 'bus', text: L('Autobus/van autostradą ok. 4 h', 'Bus/van via the expressway, about 4 h') },
  'phnompenh>sihanoukville': { mode: 'bus', text: L('Autobus/van autostradą ok. 4 h', 'Bus/van via the expressway, about 4 h') },
};

TRIP.seed = {
  expenses: [{ id: 'seed-giantibis', desc: 'Giant Ibis z Sihanoukville do Phnom Penh (8A, 8B)', amount: 38, cur: 'USD', cat: 'transport', payer: 'oksana', split: 'equal', shareD: 50, place: 'sihanoukville', day: '2026-11-09', ts: 1, updated: 1 }],
  res: {
    'tr:siemreap>sihanoukville': { name: 'Nocny autobus z Siem Reap do Sihanoukville', time: '', by: 'dominika', night: true, notes: '', updated: 1 },
    'st:sr': { name: 'Angkor Piseth Retreat', no: '', time: '18:30', addr: '1, 17855 Phumi Ta Phul, Siem Reap', by: 'oksana', notes: '2-5.11.2026, 3 noce. Odbiór z dworca Giant Ibis tuk-tukiem: 2 USD. Śniadanie à la carte: 2,5-3 USD za talerz (zamówione). Zwiedzanie z przewodnikiem i tuk-tukiem 3, 4 i 5.11: cena uzgodniona 185 USD za 3 dni (pierwotnie 190 USD). Stawki z wyceny: tuk-tuk 17 USD i przewodnik 40 USD za dzień; wschód słońca +8 USD tuk-tuk i +10 USD przewodnik; Banteay Srei +8 USD tuk-tuk (ok. 40 km w obie strony); Beng Mealea tuk-tukiem 25 USD albo autem 35 USD + przewodnik 40 USD. Hotel proponował Banteay Srei już 4.11 - ustalcie ostateczny plan dni na miejscu. Angkor Pass nie był częścią rozmowy: kupcie osobno (karnet 3-dniowy).', updated: 2 },
    'st:krs': { name: "M'Pay Bay Guesthouse", no: '', time: '14:00', addr: "Koh Rong Sanleom Pay Bay Village, północ Koh Rong Samloem", by: '', notes: "6-9.11.2026, 3 noce. Wioska M'Pai Bay na północy wyspy: łodzią z lądu można dopłynąć wprost pod nocleg, pomost jest kilka kroków dalej. Plaża przed budynkiem, restauracja i bar przy wodzie. Pokoje: dormy z wentylatorem, pokoje prywatne z klimatyzacją, pokoje ze wspólna łazienką i bungalowy. Zameldowanie 14:00-23:00, wymeldowanie do 11:00, recepcja całą dobę, cisza po 24:00. Płatność na miejscu TYLKO GOTÓWKĄ (weźcie USD w dobrych banknotach). Śniadanie nie jest w cenie. Odwołanie do 2 dni przed przyjazdem. Odległości: Saracen Bay ok. 10 km, Sunset Beach ok. 12 km, Lazy Beach ok. 14 km, Koh Rong ok. 5 km. Szczegóły potwierdzone na stronie noclegu 8.10.2026, cenę i warunki sprawdźcie we własnej rezerwacji.", updated: 2 },
    'st:pp2': { name: 'Hotel Sor1', no: '', time: '', addr: '#219, Monivong Blvd, Daun Penh, Phnom Penh', by: '', notes: '9-11.11.2026, 2 noce (noce 9/10 i 10/11). Wymeldowanie 11.11, ale na lotnisko jedziecie wieczorem 10.11, bo lot CA746 startuje 11.11 o 00:25. Druga noc jest opłacona celowo: pokój i bagaże zostają na miejscu przez cały 10.11. Monivong Blvd w dzielnicy Daun Penh to środek starego miasta: Pałac Królewski, Muzeum Narodowe i nabrzeże Mekongu są w zasięgu spaceru albo krótkiego tuk-tuka.', updated: 1 },
    'tr:kohrongsamloem>phnompenh': { name: 'Giant Ibis Transport, Universe Luxury', no: '', time: '13:30', addr: 'Z Sihanoukville do Phnom Penh', by: 'oksana', notes: '9.11.2026: od 13:30 do około 16:30, około 3 godz., 240 km. Miejsca 8-A, 8-B. Cena łącznie: 38 USD. Bilety bezzwrotne. Jedna zmiana do roku od zakupu po zgłoszeniu minimum 24 godz. wcześniej. Darmowy odbiór tylko z hoteli partnerskich przy zakupie dzień wcześniej; należy czekać w lobby godzinę przed odjazdem.', updated: 1 },
  },
  wall: { agency: 'GetYourGuide · Mutianyu Great Wall Capital Airport Layover Tour', section: 'Mutianyu', meet: 'Starbucks, Terminal 3, 2. piętro / level 2', time: '09:00', back: '', price: '', cur: 'EUR', service: 'Kierowca bez przewodnika / driver without guide', bookedBy: 'Oksana', updated: 3 },
};
