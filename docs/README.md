# Megvalósítás Terv

Ahhoz hogy az eszközöket optimálisan használjuk, és a lehető legjobb élményt nyújtsunk a következő megközelítést választottuk:

## Drupal mint backend

A Drupal a projekt adatbázisként és authentikációs és authorizációs szerverként működik, így biztosítva a hibátlan tartalmot folyamot, és biztonságot külső támadóktól.

## React mint frontend

A megjelenítés a mai világban szerintünk Javascript alapú könyvtárakkal kell hogy történjen, mivel felsőbb rendű felhasználói élményt lehet velük készíteni, a lehető legkevesebb idő alatt. Mi a Reactot választjuk, mivel órási könyvtárával és eddigi tapasztalatunkkal ez a legalkalmasabb eszköz a probléma megoldására.

## Feladatok megoldása terv

Szeretnénk egy felületet létrehozni ahol a felhasználó rögtön azt látja amire kíváncsi: a mai napirendre, és az elkészítendő feladatait. A többi funkciót szeretnénk telefonbarát és minimalisztikusan megközelíteni, mert szerintünk egy ilyen program használatának a céleszköze a mobiltelefon. A feladat nehézsége végett tervezzük a főfunkciókat megoldani először, és ha - isten bocsá - nem jut elég idő valamilyen funkció elkészítésére, akkor azokat a funkciókat hagyjuk hátra amiket a Drupal megától el tud végezni egy admin belépéssel.