(function () {
  'use strict';

  const checked = '2026-09-29';
  const item = (id, pl, en, prio, src, d, checkedAt) => ({
    id,
    t: { pl, en },
    ...(d ? { d } : {}),
    prio,
    ...(src ? { src } : {}),
    checked: checkedAt || checked
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
      atm: { label: 'YouTrip', url: 'https://you.co/sg/blog/cambodia-atm-withdrawal-guide' },
      alipay: { label: 'Rutzgo', url: 'https://rutzgo.com/budget/how-to-set-up-alipay' },
      angkor: { label: 'Siemreap.net', url: 'https://www.siemreap.net/guides/angkor/hours-admission/' },
      angkorOfficial: { label: 'Angkor Enterprise', url: 'https://www.angkorenterprise.gov.kh' },
      smart: { label: 'Smart Cambodia', url: 'https://www.smart.com.kh/plans/traveller-sim' },
      airalo: { label: 'Airalo', url: 'https://www.airalo.com/help/' }
      ,techo: { label: 'techoairport.com.kh', url: 'https://www.techoairport.com.kh/transportation' }
      ,grab: { label: 'grab.com/kh', url: 'https://www.grab.com/kh/en/transport/remorque/' }
      ,niaVisaFree: { label: 'NIA visa-free list', url: 'https://en.nia.gov.cn/n147418/n147463/c183390/content.html' }
      ,niaTransit: { label: 'NIA 240-hour transit list', url: 'https://en.nia.gov.cn/n147418/n147463/c183412/content.html' }
      ,dofi: { label: 'dofi.ibz.be', url: 'https://dofi.ibz.be/en/themes/ukraine/temporary-protection' }
      ,cosrx: { label: 'cosrx.com', url: 'https://www.cosrx.com/pages/store_official' }
      ,anua: { label: 'anua.com', url: 'https://pages.anua.com/where-to-buy-anua' }
      ,cosmeticsLaw: { label: 'Tilleke & Gibbins', url: 'https://www.tilleke.com/insights/new-regulations-for-the-import-distribution-and-sale-of-cosmetics-in-cambodia' }
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
        item('common-vaccines', 'Omówić szczepienia w poradni medycyny podróży.', 'Discuss vaccinations with a travel medicine clinic.', 'pilne'),
        item('common-oksana-be', 'Oksana: zabrać ważną belgijską kartę pobytu na powrót do Brukseli.', 'Oksana: take a valid Belgian residence card for the return to Brussels.', 'pilne', ['dofi'], null, '2026-10-09')
      ]
    },
    countries: {
      CN: {
        name: { pl: 'Chiny', en: 'China' },
        flag: '🇨🇳',
        currency: 'CNY',
        blocks: [
          { key: 'entry', title: { pl: 'Wjazd', en: 'Entry' }, items: [
            item('cn-visa-dominika', 'Dominika, paszport polski: ruch bezwizowy do 30 dni, do 31.12.2026.', 'Dominika, Polish passport: visa-free entry for up to 30 days, through 31 Dec 2026.', 'przed', ['niaVisaFree'], {
              pl: 'Dotyczy obu przesiadek w Pekinie, 1.11 i 11.11.',
              en: 'This covers both Beijing stopovers, on 1 Nov and 11 Nov.'
            }, '2026-10-09'),
            item('cn-visa-oksana', 'Oksana, paszport ukraiński: Ukraina nie ma 30 dni bez wizy. Wyjście z lotniska tylko w ramach tranzytu bezwizowego 240 h.', 'Oksana, Ukrainian passport: Ukraine is not covered by the 30-day visa-free policy. Leaving the airport is possible only under 240-hour visa-free transit.', 'pilne', ['niaTransit'], {
              pl: 'Potrzebny zwykły paszport, potwierdzony bilet dalej do kraju trzeciego z datą i miejscem, wjazd przez PEK oraz pobyt w dozwolonym obszarze Pekinu, Tianjinu i Hebei. Na lotnisku idźcie do okienka 过境免签, pokażcie wydruk biletu dalej i wypełnijcie kartę przyjazdu online albo na miejscu. Przy odprawie w Brukseli miejcie wydruk biletu PEK do KTI. Tranzyt 24-godzinny nie pozwala wyjść ze strefy tranzytowej.',
              en: 'You need an ordinary passport, a confirmed onward ticket to a third country with date and seat, entry through PEK, and a stay within the permitted Beijing, Tianjin and Hebei area. At the airport use the 过境免签 counter, show a printed onward ticket and complete the arrival card online or on site. At Brussels check-in, carry a printed PEK to KTI ticket. The 24-hour transit rule does not allow leaving the transit area.'
            }, '2026-10-09'),
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
            }),
            item('kh-passport', 'Sprawdzić, czy oba paszporty są ważne ponad 6 miesięcy od wjazdu do Kambodży.', 'Check that both passports are valid for more than 6 months from entry into Cambodia.', 'pilne', ['evisa'], null, '2026-10-09')
          ] },
          { key: 'money', title: { pl: 'Pieniądze', en: 'Money' }, items: [
            item('kh-currency', 'Używać USD i KHR. Reszta często wraca w rielach.', 'Use USD and KHR. Change often comes back in riel.', 'na-miejscu'),
            item('kh-notes', 'Dbać, żeby banknoty USD były czyste i nieuszkodzone.', 'Make sure USD notes are clean and undamaged.', 'na-miejscu'),
            item('kh-atm', 'Lokalna prowizja bankomatu dla zagranicznej karty to około 4 do 10 USD za wypłatę.', 'The local ATM fee for a foreign card is about USD 4 to 10 per withdrawal.', 'na-miejscu', ['atm'], {
              pl: 'Wypłacajcie rzadziej i większe kwoty, żeby ograniczyć prowizje.',
              en: 'Withdraw less often and in larger amounts to limit fees.'
            }),
            item('kh-kbeauty-fakes', 'Przy K-beauty kupować u autoryzowanych sprzedawców i sprawdzać etykietę.', 'For K-beauty, buy from authorised sellers and check the label.', 'na-miejscu', ['cosrx', 'anua', 'cosmeticsLaw'], {
              pl: 'Szukajcie numeru rejestracji MoH, zgodnego numeru partii na opakowaniu i produktu bez podejrzanie niskiej ceny. Anua ma hologram QR do sprawdzenia w HiddenTag. Unikajcie straganów na Central i Russian Market.',
              en: 'Look for a MoH registration number, a matching batch number on the packaging, and no suspiciously low price. Anua has a holographic QR to check in HiddenTag. Avoid stalls at Central and Russian Market.'
            }, '2026-10-09')
          ] },
          { key: 'internet', title: { pl: 'Internet', en: 'Internet' }, items: [
            item('kh-sim', 'Wybrać Smart, Cellcard lub eSIM. Cenę lokalnej karty sprawdzić na miejscu.', 'Choose Smart, Cellcard or an eSIM. Check the local SIM price on arrival.', 'na-miejscu', ['smart']),
            item('kh-esim', 'Kambodżański eSIM kosztuje od około 1 do 2 USD.', 'A Cambodia eSIM starts at about USD 1 to 2.', 'na-miejscu', ['smart'])
          ] },
          { key: 'apps', title: { pl: 'Aplikacje do pobrania', en: 'Apps to download' }, items: [
            item('kh-apps', 'Pobrać i skonfigurować Grab jako główny wybór, PassApp jako zapas i Cambodia e-Arrival.', 'Download and set up Grab as the main choice, PassApp as backup, and Cambodia e-Arrival.', 'przed', ['grab', 'arrival'], {
              pl: 'Zalogować się numerem telefonu jeszcze w domu, dodać kartę Visa lub Mastercard albo przygotować płatność gotówką USD.',
              en: 'Sign in with your phone number at home, add a Visa or Mastercard, or prepare to pay in cash in USD.'
            }, '2026-10-09'),
            item('kh-tickets-apps', 'Do biletów przygotować 12Go i Giant Ibis.', 'For tickets, prepare 12Go and Giant Ibis.', 'przed')
          ] },
          { key: 'transport', title: { pl: 'Transport', en: 'Transport' }, items: [
            item('kh-giant-booked', 'Giant Ibis na 9.11 jest już kupiony za 18 USD od osoby.', 'Giant Ibis on 9 Nov is already booked at USD 18 per person.', 'na-miejscu', ['giantIbis']),
            item('kh-night-bus', 'Nocny autobus z Siem Reap do Sihanoukville kosztuje od około 18 do 20 USD, Giant Ibis około 29 USD.', 'The Siem Reap to Sihanoukville night bus starts at about USD 18 to 20, and Giant Ibis is about USD 29.', 'na-miejscu', ['twelveGo'], {
              pl: 'Ceny są zmienne. 12Go służy do porównania połączeń, a bilety Giant Ibis warto sprawdzać także bezpośrednio u przewoźnika.',
              en: 'Prices vary. Use 12Go to compare connections and also check Giant Ibis tickets directly with the operator.'
            }),
            item('kh-ferry', 'Prom na Koh Rong Samloem kosztuje około 17 USD w jedną stronę.', 'The ferry to Koh Rong Samloem costs about USD 17 one way.', 'na-miejscu', ['ferry'], {
              pl: 'Bądźcie 30 minut wcześniej i wybierzcie przystanek M\'Pai Bay (północ wyspy), tam jest M\'Pay Bay Guesthouse.',
              en: 'Arrive 30 minutes early and choose the M\'Pai Bay stop (north of the island), where M\'Pay Bay Guesthouse is.'
            }),
            item('kh-rides', 'Grab jako główny wybór: działa oficjalnie w Phnom Penh i Siem Reap, a według przewodników także w Sihanoukville.', 'Use Grab as the main choice: it officially operates in Phnom Penh and Siem Reap, and guides also report it in Sihanoukville.', 'na-miejscu', ['grab'], {
              pl: 'Typy to Car, TukTuk i Remorque. Cenę aplikacja pokazuje przed zamówieniem. Potrzebny jest internet przez eSIM albo kartę lokalną.',
              en: 'Types include Car, TukTuk and Remorque. The app shows the price before booking. You need internet through an eSIM or local SIM.'
            }, '2026-10-09'),
            item('kh-airport', 'Po przylocie na KTI 1.11 o 23:10 autobus już nie kursuje. Weźcie Grab z lotniska.', 'After landing at KTI at 23:10 on 1 Nov, the bus is no longer running. Take a Grab from the airport.', 'na-miejscu', ['techo', 'grab'], {
              pl: 'Lotnisko podaje 10 do 20 USD i około 45 do 60 minut do miasta. Punkt odbioru wskaże aplikacja. Podróżni opisują strefę naprzeciw wyjścia przylotów nr 1, poziom 1, ale to nie jest potwierdzone oficjalnie.',
              en: 'The airport quotes USD 10 to 20 and about 45 to 60 minutes to the city. The app indicates the pickup point. Travellers describe a zone opposite arrivals door 1 on level 1, but this is not officially confirmed.'
            }, '2026-10-09'),
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
            ,item('kh-massage', 'Masaże: najlepiej w miejscach społecznych z niewidomymi masażystami, na przykład Seeing Hands. Lista jest w kartach Phnom Penh i Siem Reap.', 'Massage: social places with blind therapists, such as Seeing Hands, are the best choice. See the Phnom Penh and Siem Reap cards.', 'na-miejscu', null, null, '2026-10-09')
          ] }
        ]
      }
    },
    // Miejsca TRIP nie udostępniają prostego porządku krajów; trasa zaczyna się przesiadką w Pekinie.
    order: ['CN', 'KH']
  };
})();
