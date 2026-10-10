/* Zdjecia podstrony o swiatyniach: podpisy (PL/EN) + kredyty.
   Generowane rownolegle z assets/temples/*.webp. Podpisy sa pisane dla czytelnika,
   autorzy i licencje zbiorczo na koncu strony. */
(function () {
  'use strict';
  const L = (pl, en) => ({ pl, en });
  const P = (key, pl, en) => ({ key, cap: L(pl, en) });

  TRIP.templePhotos = {
    angkorwat: [
      P('angkorwat-1', 'Świt nad Angkor Wat: pięć wież i ich odbicie w stawie przy zachodniej grobli', 'Dawn over Angkor Wat: five towers and their reflection in the pond by the western causeway'),
      P('angkorwat-2', 'Fosa jako ocean wokół góry świata', 'The moat as the ocean around the world mountain'),
      P('angkorwat-3', 'Ta Reach: pięciometrowy, ośmioramienny Wisznu w szatach, z kwiatami i kadzidłem u stóp', 'Ta Reach: the five metre, eight armed Vishnu in robes, with flowers and incense at his feet'),
      P('angkorwat-4', 'Przed Ta Reach modlą się miejscowi, nie turyści', 'It is locals rather than tourists who pray before Ta Reach'),
      P('angkorwat-5', 'Zachodnia orientacja świątyni: słońce schodzi wprost nad wieżami', 'The temple faces west: the sun goes down straight over the towers')
    ],
    angkorthom: [
      P('angkorthom-1', 'Droga przez bramę Wielkiego Miasta, prosto w las', 'The road through the gate of the Great City, straight into the forest'),
      P('angkorthom-2', 'Mur i wieże: granica, która stoi od ośmiuset lat', 'Wall and towers: a boundary that has held for eight hundred years'),
      P('angkorthom-3', 'Dziewięć kilometrów kwadratowych za murem i fosą', 'Nine square kilometres behind a wall and a moat'),
      P('angkorthom-4', 'Korzenie w kamiennych drzwiach: las wraca do miasta', 'Roots in a stone doorway: the forest returning to the city')
    ],
    bayon: [
      P('bayon-1', 'Bayon: ponad dwieście twarzy patrzących w każdą stronę', 'The Bayon: more than two hundred faces looking in every direction'),
      P('bayon-2', 'Wieża centralna, serce stolicy Dżajawarmana VII', 'The central tower, the heart of Jayavarman VII capital'),
      P('bayon-3', 'Twarze nie oceniają, tylko widzą', 'The faces do not judge, they see'),
      P('bayon-4', 'Z bliska kamień, z dystansu spokojne spojrzenie', 'Stone up close, a calm gaze from a distance')
    ],
    baphuon: [
      P('baphuon-1', 'Baphuon: świątynia-góra i długa grobla do wejścia', 'The Baphuon: a temple mountain and the long causeway to its entrance'),
      P('baphuon-2', 'Trzysta tysięcy bloków, ułożonych ponownie bez planów', 'Three hundred thousand blocks, reassembled without the plans'),
      P('baphuon-3', 'Wejście po wschodnich schodach, poziom po poziomie', 'The climb up the eastern stairs, level by level'),
      P('baphuon-4', 'Widok z góry: po to się tu wchodzi', 'The view from the top: this is what the climb is for')
    ],
    taprohm: [
      P('taprohm-1', 'Korzenie figowca zjeżdżają po murze: nic tu nie odbudowano', 'Fig roots sliding down the wall: nothing here was rebuilt'),
      P('taprohm-2', 'Drzewo i klasztor rosną w siebie od stuleci', 'Tree and monastery have been growing into each other for centuries'),
      P('taprohm-3', 'Rzeźbione wejście, wciąż na swoim miejscu', 'A carved doorway, still where it was put'),
      P('taprohm-4', 'Zawalone galerie, przez które przechodzi życie', 'Collapsed galleries, with life passing straight through them')
    ],
    preahkhan: [
      P('preahkhan-1', 'Droga do Świętego Miecza: brama na końcu kamiennej ścieżki', 'The approach to the Sacred Sword: a gate at the end of a stone path'),
      P('preahkhan-2', 'Dwukondygnacyjny budynek na okrągłych kolumnach, jedyny taki w Angkorze', 'The two storey building on round columns, the only one at Angkor'),
      P('preahkhan-3', 'Miasto i uniwersytet w jednym, dla stu tysięcy ludzi', 'A city and a university in one, for a hundred thousand people'),
      P('preahkhan-4', 'Galerie zwężają się z każdym przejściem', 'The galleries narrow with every passage')
    ],
    neakpean: [
      P('neakpean-1', 'Zbiornik Dżajatataka: świątynia leczenia stoi na wyspie w jego środku', 'The Jayatataka reservoir: the healing temple stands on an island at its centre'),
      P('neakpean-2', 'Woda, nie kamień, jest tu głównym materiałem', 'Water, not stone, is the main material here'),
      P('neakpean-3', 'Kładka nad zbiornikiem: dojście zależy od pory roku', 'The walkway over the reservoir: the approach depends on the season')
    ],
    tasom: [
      P('tasom-1', 'Ta Som: dwie wieże nad cichym dziedzińcem', 'Ta Som: two towers over a quiet courtyard'),
      P('tasom-2', 'Twarz w bramie, pilnująca wejścia', 'A face in the gateway, watching the entrance'),
      P('tasom-3', 'Wschodnia brama: figowiec niemal całkowicie ją wchłonął', 'The eastern gate: a fig tree has almost completely swallowed it'),
      P('tasom-4', 'Rzeźbione drzwi i to, co z nich zostało', 'A carved doorway and what remains of it')
    ],
    eastmebon: [
      P('eastmebon-1', 'East Mebon: schody zaczynają się na poziomie dawnej wody', 'East Mebon: the stairs begin at the old water level'),
      P('eastmebon-2', 'Kamienny lew na tle pustego nieba', 'A stone lion against an empty sky'),
      P('eastmebon-3', 'Dwumetrowy słoń na narożniku tarasu, wycięty z jednego bloku', 'A two metre elephant at the terrace corner, carved from a single block')
    ],
    prerup: [
      P('prerup-1', 'Pre Rup: pięć wież z cegły na wysokim tarasie', 'Pre Rup: five brick towers on a high terrace'),
      P('prerup-2', 'Czerwony lateryt robi się pomarańczowy pod wieczór', 'The red laterite turns orange towards evening'),
      P('prerup-3', 'Ciemne drzwi głównej wieży, miejsce zamknięcia dnia', 'The dark doorway of the main tower, the place to close the day'),
      P('prerup-4', 'Sylwetka świątyni-góry na tle nieba', 'The silhouette of the temple mountain against the sky')
    ],
    banteaysrei: [
      P('banteaysrei-1', 'Banteay Srei: rzeźba w różowym piaskowcu, przetrwała tysiąc lat', 'Banteay Srei: carving in pink sandstone that has lasted a thousand years'),
      P('banteaysrei-2', 'Tympanon nad drzwiami, gęsty od postaci i kwiatów', 'A pediment above a doorway, dense with figures and flowers'),
      P('banteaysrei-3', 'Strażniczka w niszy: najdrobniejsza robota w całym Angkorze', 'A guardian in her niche: the finest work anywhere at Angkor')
    ],
    bengmealea: [
      P('bengmealea-1', 'Beng Mealea: korzenie trzymają wejście, które się już zawaliło', 'Beng Mealea: roots holding an entrance that has already collapsed'),
      P('bengmealea-2', 'Dżungla weszła w każdą szczelinę galerii', 'The jungle has entered every crack in the galleries'),
      P('bengmealea-3', 'Przejście między blokami: tutaj zwiedza się po kamieniach', 'A way through the blocks: here you visit by climbing over stone')
    ],
    ritual: [
      P('ritual-1', 'Wierni w bieli po ceremonii, z kwiatami w dłoniach', 'Worshippers in white after a ceremony, flowers in their hands'),
      P('ritual-2', 'Mnich przygotowuje naczynia przed obrzędem', 'A monk preparing the vessels before a rite'),
      P('ritual-3', 'Kapliczka opiekuna miejsca, z codziennymi darami', 'A guardian shrine with its everyday offerings'),
      P('ritual-4', 'Mnisi w ruinach o zmierzchu', 'Monks among the ruins at dusk'),
      P('ritual-5', 'Szafranowe szaty na kamiennych schodach', 'Saffron robes on stone stairs'),
      P('ritual-6', 'Mnich sam w kamiennym przejściu', 'A monk alone in a stone passage')
    ]
  };
})();
