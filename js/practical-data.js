(function () {
  'use strict';

  const checked = '2026-09-29';
  const item = (id, pl, en, prio, src, d) => ({
    id,
    t: { pl, en },
    ...(d ? { d } : {}),
    prio,
    ...(src ? { src } : {}),
    checked
  });

  TRIP.practical = {
    checked,
    ui: {
      eyebrow: { pl: 'Przed wyjazdem', en: 'Before you go' },
      title: { pl: 'Praktycznie', en: 'Practical' },
      intro: {
        pl: 'Najważniejsze decyzje, aplikacje i formalności w jednym miejscu, do przejrzenia przed zamknięciem walizki.',
        en: 'The essential decisions, apps and formalities in one place, ready to review before you close your suitcase.'
      },
      checked: { pl: 'Fakty sprawdzone {date}', en: 'Facts checked {date}' },
      progress: { pl: '{done} z {total}', en: '{done} of {total}' },
      sources: { pl: 'Źródła', en: 'Sources' },
      priorities: {
        pilne: { pl: 'Pilne', en: 'Urgent' },
        przed: { pl: 'Przed wylotem', en: 'Before you fly' },
        'na-miejscu': { pl: 'Na miejscu', en: 'On the ground' }
      }
    },
    sources: {
      chinaVisa: { label: 'visaforchina.cn', url: 'https://pdf.visaforchina.cn/ZRH4_EN/tongzhigonggao/552376864014995497.html' },
      evisa: { label: 'evisa.gov.kh', url: 'https://www.evisa.gov.kh' },
      arrival: { label: 'arrival.gov.kh', url: 'https://arrival.gov.kh' },
      airportExpress: { label: 'TravelChinaGuide', url: 'https://www.travelchinaguide.com/cityguides/beijing/transportation/airport-express-train.htm' },
      kti: { label: 'Nomad Lawyer', url: 'https://nomadlawyer.org/cambodia-techo-airport-express-bus-phnom-penh-transit-guide-2026' },
      giantIbis: { label: 'Giant Ibis', url: 'https://www.giantibis.com' },
      twelveGo: { label: '12Go', url: 'https://12go.asia/en/bus/siem-reap/sihanoukville' },
      ferry: { label: 'Cambodia Trains', url: 'https://cambodiatrains.info/ferry-times-from-sihanoukville-to-koh-rong-samloem' },
      sokMean: { label: 'Sok Mean Bungalows', url: 'https://sokmeanbungalows.com' },
      atm: { label: 'YouTrip', url: 'https://you.co/sg/blog/cambodia-atm-withdrawal-guide' },
      alipay: { label: 'Rutzgo', url: 'https://rutzgo.com/budget/how-to-set-up-alipay' },
      angkor: { label: 'Siemreap.net', url: 'https://www.siemreap.net/guides/angkor/hours-admission/' },
      angkorOfficial: { label: 'Angkor Enterprise', url: 'https://www.angkorenterprise.gov.kh' },
      smart: { label: 'Smart Cambodia', url: 'https://www.smart.com.kh/plans/traveller-sim' },
      airalo: { label: 'Airalo', url: 'https://www.airalo.com/help/' }
    },
    common: {
      title: { pl: 'Wspólna checklista', en: 'Shared checklist' },
      items: [
        item('common-offline', 'Pobrać aplikacje, mapy i tłumaczenia offline.', 'Download apps, maps and offline translations.', 'przed', null, {
          pl: 'Przydadzą się Organic Maps lub maps.me, XE Currency, Air China i aplikacja dostawcy eSIM. Pobierzcie wszystko przy stabilnym Wi-Fi.',
          en: 'Useful choices include Organic Maps or maps.me, XE Currency, Air China and your eSIM provider app. Download everything on stable Wi-Fi.'
        }),
        item('common-warm-layer', 'Włożyć ciepłą warstwę do bagażu podręcznego na Pekin.', 'Pack a warm layer in your carry-on for Beijing.', 'przed', null, {
          pl: 'W Kambodży w listopadzie jest około 30°C, a w Pekinie około 0 do 10°C.',
          en: 'Cambodia is about 30°C in November, while Beijing is about 0 to 10°C.'
        }),
        item('common-baggage', 'Przy odprawie w VIE i BRU potwierdzić, czy bagaż jest nadany aż do KTI.', 'At check-in in VIE and BRU, confirm whether bags are checked through to KTI.', 'przed'),
        item('common-vaccines', 'Omówić szczepienia w poradni medycyny podróży.', 'Discuss vaccinations with a travel medicine clinic.', 'pilne')
      ]
    },
    countries: {
      CN: {
        name: { pl: 'Chiny', en: 'China' },
        flag: '🇨🇳',
        currency: 'CNY',
        blocks: [
          { key: 'entry', title: { pl: 'Wjazd', en: 'Entry' }, items: [
            item('cn-visa-free', 'Zwykłe paszporty Polski i Belgii pozwalają na ruch bezwizowy do 30 dni, do 31.12.2026.', 'Ordinary Polish and Belgian passports allow visa-free entry for up to 30 days, through 31 Dec 2026.', 'przed', ['chinaVisa'], {
              pl: 'Ten ruch bezwizowy wystarcza na obie przesiadki w Pekinie, 1.11 i 11.11.',
              en: 'This visa-free arrangement is sufficient for both Beijing stopovers, on 1 Nov and 11 Nov.'
            }),
            item('cn-forbidden', 'Oksana: zarezerwować bilet do Zakazanego Miasta na 1.11 (online, z numerem paszportu, zwykle do 7 dni wcześniej).', 'Oksana: book a Forbidden City ticket for 1 Nov (online, with a passport number, usually up to 7 days ahead).', 'pilne'),
            item('cn-meet', 'Spotkanie 1.11: 13:00 na placu między Wieżą Bębna a Wieżą Dzwonu. Udostępnić sobie lokalizację na żywo w WhatsAppie.', 'Meeting on 1 Nov: 13:00 on the square between the Drum and Bell Towers. Share live location on WhatsApp.', 'przed'),
            item('cn-arrival-card', 'Sprawdzić przed wyjazdem szczegóły chińskiej karty przyjazdu online.', 'Check the details of China\'s online arrival card before departure.', 'przed')
          ] },
          { key: 'money', title: { pl: 'Pieniądze', en: 'Money' }, items: [
            item('cn-alipay-card', 'Podpiąć Visa lub Mastercard do Alipay albo WeChat Pay i sprawdzić logowanie.', 'Link Visa or Mastercard to Alipay or WeChat Pay and test the login.', 'pilne', ['alipay'], {
              pl: 'Do 200 CNY za transakcję nie ma opłaty, powyżej opłata wynosi 3%. Tour Pass już nie istnieje, kartę zagraniczną podpina się bezpośrednio w aplikacji.',
              en: 'Transactions up to 200 CNY have no fee; above that the fee is 3%. Tour Pass no longer exists, so link a foreign card directly in the app.'
            }),
            item('cn-cash', 'Mieć trochę gotówki CNY na awaryjne sytuacje.', 'Keep a little CNY cash for backup.', 'na-miejscu')
          ] },
          { key: 'internet', title: { pl: 'Internet', en: 'Internet' }, items: [
            item('cn-esim', 'Kupić i zainstalować roamingowy eSIM do Chin przed wylotem.', 'Buy and install a roaming eSIM for China before departure.', 'pilne', ['airalo'], {
              pl: 'Kosztuje od około 4 USD. Google, WhatsApp i Instagram działają wtedy bez VPN.',
              en: 'It starts at about USD 4. Google, WhatsApp and Instagram then work without a VPN.'
            }),
            item('cn-vpn', 'Wybrać roaming eSIM zamiast nieautoryzowanego VPN.', 'Choose a roaming eSIM instead of an unauthorised VPN.', 'przed', null, {
              pl: 'Nieautoryzowane VPN są w Chinach formalnie nielegalne.',
              en: 'Unauthorised VPNs are formally illegal in China.'
            }),
            item('cn-esim-code', 'Zachować kod instalacyjny eSIM także poza skrzynką e-mail.', 'Keep the eSIM installation code somewhere outside your email inbox too.', 'przed')
          ] },
          { key: 'apps', title: { pl: 'Aplikacje do pobrania', en: 'Apps to download' }, items: [
            item('cn-apps', 'Pobrać Alipay, WeChat oraz Amap lub Apple Maps.', 'Download Alipay, WeChat, and Amap or Apple Maps.', 'przed'),
            item('cn-metro-app', 'Do metra w Pekinie przygotować MetroMan albo kod QR w Alipay.', 'For the Beijing metro, prepare MetroMan or the QR code in Alipay.', 'przed'),
            item('cn-translation', 'Pobrać chiński do tłumacza offline.', 'Download Chinese for offline translation.', 'przed', null, {
              pl: 'Google Translate działa w Chinach przez roaming. Alternatywy to Apple Translate, Baidu i Youdao.',
              en: 'Google Translate works in China over roaming. Alternatives include Apple Translate, Baidu and Youdao.'
            })
          ] },
          { key: 'transport', title: { pl: 'Transport', en: 'Transport' }, items: [
            item('cn-wall-meet', '11.11: po przylocie CA746 idźcie do Starbucks, 2. piętro T3; kierowca na Mutianyu czeka o 09:00.', '11 Nov: after CA746 lands, go to Starbucks on level 2 of T3; the driver to Mutianyu meets you at 09:00.', 'na-miejscu'),
            item('cn-airport-express', 'Airport Express z T3 do Dongzhimen kosztuje 25 CNY i jedzie około 25 minut.', 'The Airport Express from T3 to Dongzhimen costs CNY 25 and takes about 25 minutes.', 'na-miejscu', ['airportExpress'], {
              pl: 'Dalej jedźcie linią metra 2.',
              en: 'Continue on metro line 2.'
            })
          ] },
          { key: 'health', title: { pl: 'Zdrowie', en: 'Health' }, items: [
            item('cn-wall-clothes', 'Zabierzcie ciepłą warstwę i wygodne buty na Mur.', 'Bring a warm layer and comfortable shoes for the Wall.', 'przed'),
            item('cn-cold', 'Na listopadowy Pekin przygotować się na około 0 do 10°C.', 'Prepare for about 0 to 10°C in Beijing in November.', 'przed')
          ] }
        ]
      },
      KH: {
        name: { pl: 'Kambodża', en: 'Cambodia' },
        flag: '🇰🇭',
        currency: 'USD / KHR',
        blocks: [
          { key: 'entry', title: { pl: 'Wjazd', en: 'Entry' }, items: [
            item('kh-evisa', 'Złożyć wniosek o kambodżańską e-wizę turystyczną na oficjalnej stronie.', 'Apply for the Cambodian tourist e-visa on the official website.', 'pilne', ['evisa'], {
              pl: 'Kosztuje 30 USD, pozwala na miesiąc pobytu i jest przetwarzana w 3 dni robocze. Uważajcie na droższych pośredników.',
              en: 'It costs USD 30, allows a one-month stay and takes 3 working days to process. Beware of more expensive intermediaries.'
            }),
            item('kh-arrival', 'Wypełnić bezpłatny Cambodia e-Arrival dla obu osób.', 'Complete the free Cambodia e-Arrival for both travellers.', 'przed', ['arrival'], {
              pl: 'Można to zrobić najwcześniej 7 dni przed przylotem.',
              en: 'You can do this no earlier than 7 days before arrival.'
            })
          ] },
          { key: 'money', title: { pl: 'Pieniądze', en: 'Money' }, items: [
            item('kh-currency', 'Używać USD i KHR. Reszta często wraca w rielach.', 'Use USD and KHR. Change often comes back in riel.', 'na-miejscu'),
            item('kh-notes', 'Dbać, żeby banknoty USD były czyste i nieuszkodzone.', 'Make sure USD notes are clean and undamaged.', 'na-miejscu'),
            item('kh-atm', 'Lokalna prowizja bankomatu dla zagranicznej karty to około 4 do 10 USD za wypłatę.', 'The local ATM fee for a foreign card is about USD 4 to 10 per withdrawal.', 'na-miejscu', ['atm'], {
              pl: 'Wypłacajcie rzadziej i większe kwoty, żeby ograniczyć prowizje.',
              en: 'Withdraw less often and in larger amounts to limit fees.'
            })
          ] },
          { key: 'internet', title: { pl: 'Internet', en: 'Internet' }, items: [
            item('kh-sim', 'Wybrać Smart, Cellcard lub eSIM. Cenę lokalnej karty sprawdzić na miejscu.', 'Choose Smart, Cellcard or an eSIM. Check the local SIM price on arrival.', 'na-miejscu', ['smart']),
            item('kh-esim', 'Kambodżański eSIM kosztuje od około 1 do 2 USD.', 'A Cambodia eSIM starts at about USD 1 to 2.', 'na-miejscu', ['smart'])
          ] },
          { key: 'apps', title: { pl: 'Aplikacje do pobrania', en: 'Apps to download' }, items: [
            item('kh-apps', 'Pobrać Grab, PassApp i Cambodia e-Arrival.', 'Download Grab, PassApp and Cambodia e-Arrival.', 'przed'),
            item('kh-tickets-apps', 'Do biletów przygotować 12Go i Giant Ibis.', 'For tickets, prepare 12Go and Giant Ibis.', 'przed')
          ] },
          { key: 'transport', title: { pl: 'Transport', en: 'Transport' }, items: [
            item('kh-giant-booked', 'Giant Ibis na 9.11 jest już kupiony za 18 USD od osoby.', 'Giant Ibis on 9 Nov is already booked at USD 18 per person.', 'na-miejscu', ['giantIbis']),
            item('kh-night-bus', 'Nocny autobus z Siem Reap do Sihanoukville kosztuje od około 18 do 20 USD, Giant Ibis około 29 USD.', 'The Siem Reap to Sihanoukville night bus starts at about USD 18 to 20, and Giant Ibis is about USD 29.', 'na-miejscu', ['twelveGo'], {
              pl: 'Ceny są zmienne. 12Go służy do porównania połączeń, a bilety Giant Ibis warto sprawdzać także bezpośrednio u przewoźnika.',
              en: 'Prices vary. Use 12Go to compare connections and also check Giant Ibis tickets directly with the operator.'
            }),
            item('kh-ferry', 'Prom na Koh Rong Samloem kosztuje około 17 USD w jedną stronę.', 'The ferry to Koh Rong Samloem costs about USD 17 one way.', 'na-miejscu', ['ferry', 'sokMean'], {
              pl: 'Bądźcie 30 minut wcześniej i wybierzcie przystanek M\'Pai Bay dla Sok Mean.',
              en: 'Arrive 30 minutes early and choose the M\'Pai Bay stop for Sok Mean.'
            }),
            item('kh-rides', 'Grab i PassApp działają w Phnom Penh, Siem Reap i Sihanoukville.', 'Grab and PassApp operate in Phnom Penh, Siem Reap and Sihanoukville.', 'na-miejscu', ['kti'], {
              pl: 'Krótki kurs kosztuje około 1 do 3 USD.',
              en: 'A short ride costs about USD 1 to 3.'
            }),
            item('kh-airport', 'Po przylocie na KTI o 23:10 autobus już nie kursuje.', 'After landing at KTI at 23:10, the bus is no longer running.', 'na-miejscu', ['kti'], {
              pl: 'Taxi lub Grab kosztuje około 15 do 25 USD.',
              en: 'A taxi or Grab costs about USD 15 to 25.'
            })
          ] },
          { key: 'health', title: { pl: 'Zdrowie i zwyczaje', en: 'Health and customs' }, items: [
            item('kh-mosquitoes', 'Na komary używać repelentu z DEET lub ikarydyną i nosić długie rękawy wieczorem.', 'For mosquitoes, use repellent with DEET or icaridin and wear long sleeves in the evening.', 'na-miejscu'),
            item('kh-water', 'Pić tylko wodę butelkowaną.', 'Drink bottled water only.', 'na-miejscu', null, {
              pl: 'Lód w lokalach zwykle pochodzi z fabryki.',
              en: 'Ice in restaurants usually comes from a factory.'
            }),
            item('kh-temples', 'W świątyniach zakrywać ramiona i kolana, inaczej można nie wejść.', 'Cover shoulders and knees at temples or you may be refused entry.', 'na-miejscu'),
            item('kh-angkor-price', 'Angkor Pass kosztuje 37 USD na 1 dzień, 62 USD na 3 dni lub 72 USD na 7 dni.', 'Angkor Pass costs USD 37 for 1 day, USD 62 for 3 days or USD 72 for 7 days.', 'na-miejscu', ['angkor']),
            item('kh-angkor-buy', 'Kupować Angkor Pass tylko online u Angkor Enterprise albo w kasie.', 'Buy the Angkor Pass only online from Angkor Enterprise or at the ticket office.', 'na-miejscu', ['angkorOfficial'])
          ] }
        ]
      }
    },
    // Miejsca TRIP nie udostępniają prostego porządku krajów; trasa zaczyna się przesiadką w Pekinie.
    order: ['CN', 'KH']
  };
})();
