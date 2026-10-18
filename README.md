# Bevezető

Cypress házi feladat a [hasznaltauto.hu](https://www.hasznaltauto.hu) regisztrációs oldalára és egy hirdetés oldalára. Alapvetően az angol nyelv használatát preferálom a projektekben, de a könnyebb olvashatóság érdekében a dokumentációt/README-t magyarul írom le.

Élesben tesztelni nem tudtam, mert a Cloudflare megfogta a Cypress futtatást. Local teszteltem amit tudtam, lementettem a szükséges oldalakat HTML-ként, és azokon futtattam a teszteket. Ez nyilván nem valid eredmény, nem is teljes teszt, csak azt akartam tudni, működik-e a logikám. A mentett oldalak nincsenek a repóban, a tesztkörnyezet használata lett volna a teljes, valid tesztelés. A mentett HTML-en blokkolnom kellett a captchát a regisztráció teszthez és a third party errorokat, hogy a teszt ne bukjon el azonnal fals hibával.

## Futtatás

Szükséges: Node.js 22+ és Google Chrome.

```bash
npm install
cp cypress.env.example.json cypress.env.json
```

A "cypress.env.json"-ba egy létező hasznaltauto.hu fiók e-mail címe és jelszava kell ("loginEmail", "loginPassword"). Ezzel lép be a Parkoló teszt, és ezt használja a „már regisztrált e-mail” teszt is.

```bash
npm run cy:open
npm run cy:run
npx cypress run --browser chrome --spec cypress/e2e/2-ad-detail/2b-save-to-parking.cy.js
```

## Felépítés

```
cypress/
├── e2e/
│   ├── 1-registration/   # 1. feladat tesztjei
│   └── 2-ad-detail/      # 2. feladat tesztjei
├── fixtures/
│   ├── ad-data.json      # a tesztelt hirdetés adatai (path, cím, ár, eladó elérhetősége)
│   ├── registration-errors.json # a regisztráció elvárt hibaüzenetei
│   └── user-data.json    # a sikeres regisztráció tesztadatai
├── pages/                # Page Object Model (RegistrationPage, AdDetailPage, ParkingPage)
└── support/
    ├── commands.js       # custom commandok: cy.getByTestId(), cy.login(), cy.acceptCookies()
    └── e2e.js            # minden teszt előtt lefut: betölti a commandokat, és elnyeli a third party scriptek hibáit
```

A több oldalon megjelenő elemekhez custom commandot használok, Eey nagyobb projektben, ahol például a header sok elemét több oldalon is tesztelni kellene, külön "components/" mappába szervezném őket (pl. "HeaderComponent.js").

A "cy.acceptCookies()" a Didomi elfogadását "cy.session"-be teszi, így a bannerre csak egyszer kattint a teszt futásonként, utána a Cypress a mentett cookiekból állítja vissza az elfogadott állapotot.  A "cacheAcrossSpecs: true" miatt minden spec teszt fileban újrahasználható lesz. A "validate" ellenőrzi, hogy a visszaállítás után megvan-e az szükséges cookie, ha nincs, a session újra lefut és újra elfogadja a bannert.

A "data-testid" selectorokhoz a "cy.getByTestId()" commandot írtam. A command láncolható a "prevSubject: 'optional'" miatt, önmagában az egész oldalon keres ("cy.getByTestId('loginform-submit')"), egy elem után láncolva csak azon belül ("cy.get('#seller-info-sidebar).getByTestId('seller-email')"). Erre azért van szükség, mert a hirdetés oldalon az eladó e-mail és telefonszám gombjának testid-ja háromszor szerepe (mobile view miatt), ezért ott az oldalsávra kell szűkíteni a keresést.

# Megoldások

## 1. Regisztráció

### a) Hibaüzenetek – 3 mező

Tesztek: "cypress/e2e/1-registration/1a-error-messages.cy.js"

A név, az e-mail és a jelszó mezőt választottam, mert ezekhez tartozik a legtöbb különböző hibaüzenet.

| Mező   | Bevitt érték           | Elvárt hibaüzenet                               |
| ------ | ---------------------- | ----------------------------------------------- |
| Név    | "Ab"                   | A névnek minimum 3 karakternek kell lennie.     |
| Név    | "Teszt@Elek"           | A név nem tartalmazhat különleges karaktereket. |
| Név    | 256 karakteres név     | A név maximum 255 karakter lehet.               |
| E-mail | "teszt@"               | Nem megfelelő e-mail cím.                       |
| E-mail | már regisztrált cím    | A megadott e-mail cím már használatban van.     |
| Jelszó | "Abcd123" (7 karakter) | A jelszónak minimum 8 karakternek kell lennie.  |
| Jelszó | 256 karakteres jelszó  | A jelszó maximum 255 karakter lehet.            |

A „már regisztrált cím” tesztben a saját, belépéshez használt fiókom címét használom ("cypress.env.json", nincs feltöltve a repóba, mert az valós helyzetben biztonsági kockázat lenne, de ha kell megadom a fiókot).

Az elvárt hibaüzenetek a "cypress/fixtures/registration-errors.json"-ban vannak, így ha egy szöveg megváltozik az oldalon, csak ezt a fájlt kell átírni, a tesztkódhoz nem kell hozzányúlni.

### b) Sikeres regisztráció

Teszt: "cypress/e2e/1-registration/1b-successful-registration.cy.js"

A teszt kitölti az összes kötelező mezőt, elfogadja az ÁSZF-et, beküldi az űrlapot, és a „Sikeres regisztráció!” üzenetet várja. Az e-mail címet minden futásnál egyedire generálom ("alekosz.tibor+<időbélyeg>@gmail.com"), mert egy hardcodeolt cím az első sikeres futás után már hibára futna. A regisztrációs adatok a "cypress/fixtures/user-data.json"-ban vannak, nem a tesztfájlban. Ez azért jó megoldás, mert a fájl máshol is előállítható: a tesztelők, vagy akár egy script/API, küldhetnek új tesztadatot ebben a formában, és a teszt módosítás nélkül fel tudja használni. A fixture-ben elég egy sima e-mail cím, az időbélyeget a teszt teszi hozzá. (Ha valaki a Cloudflare-t/captchát megkerülve ellenőrizné a házit, erre ügyeljen, és ne generáljon felesleges dummy usert a db-be.)

#### i) Milyen nehézségekbe ütköztem?

- Az éles oldalt Cloudflare védi, az automatizált böngészőt megfogja.
- A regisztráció beküldését captcha védi, ezért a sikeres regisztrációs teszt az éles oldalon elbukik. (amennyiben a teszt megkerüli a Cloudflare-t)
- Egy sikeres futás valódi fiókot hozna létre az éles db-ben, minden futáshoz új, még nem használt e-mail cím kell, felesleges db terhelés, kellene rá db törlés, API-n keresztül esetleg.
- A regisztráció e-mailes megerősítéssel zárul, frontend tesztelésnél ezt nem lehet megkerülni, szintén szükséges lenne valami API post, hogy működjön a teljes flow.

#### ii) Ötletek a megoldásra

- A teszteket teszt/staging környezetben futtatnám, ahol a Cloudflare ki van kapcsolva, vagy whitelist-en van.
- A létrehozott teszt fiókokat a futás után törölni kellene db-ből.
- Ha csak a felület működését akarjuk ellenőrizni, a végső beküldést "cy.intercept"tel stubolni lehet: a kérés nem jut el a szerverig, a teszt ad helyette sikeres választ, és azt nézzük, hogy az oldal megjeleníti-e a sikeres regisztrációt. Ez a backendet nem teszteli, de a frontend folyamatot igen (HTML mentéssel tesztelhető).

## 2. Hirdetés oldal

Hirdetés: [FORD PUMA 1.0 EcoBoost mHEV Titanium DCT](https://www.hasznaltauto.hu/szemelyauto/ford/puma/ford_puma_1.0_ecoboost_mhev_titanium_dct_2024_modell_ecoboost_hybrid_ford_petranyi-20604181)

### a) 5 funkció, amit érdemes tesztelni

1. **Galéria.** UX szempontból fontos feature, a vásárló először a képeket nézi meg, nagyban itt dől el, hogy marad-e a user a hirdetésen, autóvásárlásnál sokat számít a valós kép. Lapozás nyilakkal és bélyegképekkel, a képszámláló (pl. 1/6), a teljes képernyős nézet megnyitása és bezárása, src ellenőrzés, méretek, formátum.
2. **Money hitelkalkulátor.** A money.hu kalkulátora az autó árával töltődik be. Fontos a felhasználónak (mennyibe kerülne havonta) ha hitelt igényelne és a cégnek is extra bevétel lehet amennyiben él a lehetőséggel.
3. **Eladó elérhetősége.** Az e-mail cím és a telefonszám gombnyomásra jelenik meg, és kattintható linkké válik. Ez az oldal fő célja: az érdeklődőt összekötni az eladóval és sikerrel zárni a keresést (UX élmény).
4. **Partner szolgáltatások.** A carVertical és a Totalkár ellenőrzés. Szintén partnerség. A linkeknek új lapon, a helyes (affiliate) paraméterekkel kell megnyílniuk, mert ezekből az oldalnak bevétele van.
5. **Ajánlott termékek a típushoz.** A hirdetéshez illő gumi-felni, tartozék és alkatrész ajánlók. Megjelennek-e, a típushoz illő termékeket mutatják-e, és lapozhatók-e. Ezek az oldalon tartják a felhasználót és további vásárlásra ösztönöznek.

### b) Hirdetés hozzáadása a parkolóhoz

Teszt: "cypress/e2e/2-ad-detail/2b-save-to-parking.cy.js"

A teszt kijelentkezve megnyitja a hirdetést, és a „Parkolóba rakom” gombra kattint. Mivel nincs belépve, megjelenik a bejelentkezési modal, amit a "cy.login()" custom command tölt ki a "cypress.env.json"-ban tárolt fiókkal. Belépés után az oldal magától beteszi a hirdetést a parkolóba: a teszt "cy.intercept" aliasszal megvárja a mentés kérését ("@saveToParking"), majd ellenőrzi a sikeres üzenetet, a gomb új feliratát, és hogy a hirdetés megjelenik a "/parkolo" oldalon. A végén kiveszi a hirdetést a parkolóból annak érdekében, hogy ne legyen fals hiba az újrafuttatásnál.

### c) Mire kell figyelni a rendszeres futtatásnál?

- A teszt egy konkrét, létező hirdetéssel dolgozik, ami bármikor megszűnhet (eladják, lejár). Ha a hirdetés eltűnik, a teszt elbukik, ezért figyelni kell rá, és szükség esetén másik hirdetést kell választani, esetleg tömbből retry másik értékkel, de ez is csak random pickelgetés, flaky lenne a teszt.
- A hirdetés adatai (path, cím, ár, eladó elérhetősége) a "cypress/fixtures/ad-data.json"-ban vannak, így hirdetéscserénél csak ezt az egy fájlt kell átírni, a tesztkódhoz nem kell hozzányúlni. Az 1/b "user-data.json"-jához hasonlóan ez a fájl is előállítható máshol, és a tesztek módosítás nélkül fel tudják használni.
- Ha mindig ugyanazt a hirdetést használjuk, a teszt csak akkor működik, ha a hirdetés induláskor nincs a parkolóban, ezért a teszt végén kiveszem. Ha a teszt félúton elbukik, a hirdetés bent maradhat, ilyenkor a következő futás előtt ki kell venni, erre lehet írni egy ellenőrzést akár már ebbe a tesztbe.
- Mindig más hirdetés használata megoldaná a takarítás kérdését, de bizonytalanabbá (flaky) tenné a tesztet: nem tudjuk előre, melyik hirdetés lesz elérhető, és a parkoló is folyamatosan telne, ez is egy jó teszt lenne, de más scopeban.
- Ha több futás egyszerre ugyanazzal a fiókkal dolgozik, összeakadhatnak (az egyik kiveszi a hirdetést, amit a másik épp ellenőriz), ezért egymás után kell futtatni őket, biztonságos, de lassú lehet.

### d) Tesztek a kiválasztott funkciókra

A 2/a listából hármat választottam: a Money hitelkalkulátort, a partner szolgáltatásokat és az eladó elérhetőségét, mert ezek fontosak a felhasználónak, a hitelkalkulátor és a partnerlinkek ráadásul bevételt is hoznak az oldalnak.

| Funkció               | Teszt                                               | Mit ellenőriz                                                     |
| --------------------- | --------------------------------------------------- | ----------------------------------------------------------------- |
| Money hitelkalkulátor | "cypress/e2e/2-ad-detail/2d-money-calculator.cy.js" | Megjelenik a kalkulátor, és az autó árával töltődik be.           |
| Partner linkek        | "cypress/e2e/2-ad-detail/2d-partner-links.cy.js"    | A carVertical és a Totalkár link látható, és új lapon nyílik meg. |
| Eladó elérhetősége    | "cypress/e2e/2-ad-detail/2d-seller-contact.cy.js"   | Az e-mail cím és a telefonszám csak gombnyomásra jelenik meg.     |
