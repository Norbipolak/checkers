/*
    <div class="container">
        <div class="table">

        </div>
    </div>

ebbe kellenek majd mezők field-ek amiket majd legenerálunk egy for ciklussal, kell nekünk 64, mert 8 sor, 8 oszlop 
csinálunk neki egy class-t css-ben amit majd a classList.add-val hozáadunk 
    <div class="table" id="table">
        <div class="field"></div>
        <div class="field black-bg"></div>
        <div class="field"></div>
        <div class="field black-bg"></div>
        <div class="field"></div>
        <div class="field black-bg"></div>
        <div class="field"></div>
        <div class="field black-bg"></div>
    </div>

ezeket a field-eket fogjuk majd itt legenerálni 
*/

class Checkers {
    table;
    round;
    highlighted;

    constructor() {
        this.table = document.querySelector("#table");
        this.highlighted = {
            row: -1,
            col: -1,
            player: null
        }
        this.round = "black";
        this.generateFields();

    }

    generateFields() {
        for (let i = 1; i <= 64; i++) {
            const row = Math.ceil(i / 8);
            const col = (i - 1) % 8 + 1;
            const field = document.createElement("div");
            field.classList.add("field");
            let player = null;

            this.step(field, row, col);

            if (row % 2 === 1 && col % 2 === 0) {
                field.classList.add("black-bg");
                player = document.createElement("div");

            } else if(row%2 === 0 && col%2 === 1) {
                field.classList.add("black-bg");
                player = document.createElement("div");
            }

            if(player  && row < 3) {
                player.classList.add("player");
                player.classList.add("white-player");
                field.appendChild(player);
            } else if(player && row >= 7) {
                player.classList.add("player");
                player.classList.add("black-player");
                field.appendChild(player);
            }

            if(player) 
                this.highlightPlayer(row, col, player);

            this.table.appendChild(field);
        }
    }

    highlightPlayer(row, col, player) {
        player.addEventListener("click", (e)=> {
            e.stopPropagation();
            player.classList.add("highlight");

            this.highlighted = {
                row,
                col,
                player
            }
        });
    }

    canMove(row, col) {
        const rowDiff = this.highlighted.row - row;
        const colDiff = this.highlighted.col - col;

        if(this.round === "black") {
            return this.highlighted.row !== -1 && 
            rowDiff === - 1 && (colDiff === -1 || colDiff === 1)
        }

        return this.highlighted.row !== -1 && 
        rowDiff === 1 && (colDiff === -1 || colDiff === 1)
    }

    step(field, row, col) {
        field.addEventListener("click", ()=> {
            if(this.canMove(row, col)) {
                this.round = this.round === "black" ? "white" : "black";

                field.appendChild(this.highlighted.player);
                this.highlighted.player.classList.remove("highlight");

                this.highlighted = {
                    row: -1,
                    col: -1,
                    player: null
                }
            } else {
                alert("Nem jó lépés!");
            }
        });
    }
}

/*
generateFields() {
    for(let i = 0; i < 64; i++) {

    }
}
Itt azt kell majd megnéznünk, hogy hányadik sorban meg oszlopban vagyunk, mert ha az oszlop száma páratlan akkor minden páratlanadik fehér 
ha pedig az oszlop száma páros, akkor minden páros fehér 
lehetne úgy csinálni, hogy két for ciklus, de lehet úgy is, hogy itt megnézzük, hogy melyik sorban, meg oszlopban vagyunk 
    generateFields() {
        for(let i = 1; i <= 64; i++) {
            const row = i/8;
            console.log(row);
        }
    }
kijött, hogy 
0.125, 0.25, 0.37, 0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.375, ... 2, 2.125, ....és így tovább egészen nyolcig 
mert akkor az i az 64 és 64/8 az 8 
és akkor a nullások azok felfele kerekítva mindig 1 (meg ugye az egész 1 is) lesz 1-es felefele kerekítve 2, így tovább 
így mindenhol 8darab lesz, az egyekben is, 2, 3, 4, 5, 6, 7, 8-asokban is!!!! 
és tudjuk, hogy melyik sorban vagyunk 
-> 
for(let i = 1; i <= 64; i++) {
    const row = Math.ceil(i/8);
    console.log(row);
}
8 1, 8 2, 8 3, 8 4, 8 5, 8 6, 8 7, 8 8
és, hogy így már tudjuk, hogy melyik sorrol van szó, minden páratlanadik sorban minden páratlanadik fekete és minden páros sorban a párosoak 
-> 
for(let i = 1; i <= 64; i++) {
    const row = Math.ceil(i/8);
            
    if(row%2 == 1) {

    } else {
                
    }
}

itt szökségünk lesz az oszlopokra is!!! 
ugye az if-nek a feltétele az minden páratlandik sorra igaz 

const col = i%8;
console.log(col);
->
így ez fog kijönni 
1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 .. és így tovább 
ez nekünk nem jó, mert ugy kellene, hogy 1 2 3 4 5 6 7 8 1 2 3 4 5 6 7 8 1 2 3 4 5 6 7 8 ...

const col = (i-1)%8
így az lesz, hogy 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 ..
mert itt akkor az nem 1 lesz hanem 0 és ha bármilyen számmal osztjuk a nullát az nulla lesz 
utána jön a 2-1 = 1 / 8 itt egy lesz a maradék utána 2, 3, 4, 5, 6, 7 egészen 9-ig, mert ott 9-1 = 8 / 8 = 0, itt megint nulla lesz 
na az a lényeg, hogy ehhez még hozzá kell adni eggyet, hogy megkapjuk amit akartunk 1-től 8-ig a számokat 
1, 2, 3, 4, 5, 6, 7, 8 és ez még 7-szer, tehát összesen 8-szor ez a számsorozat 
-> 
const col = (i-1)%8 + 1; !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

tehát minden páratlanadik sorban minden páros oszlop lesz a fekete, páratlan meg a fehér 
            if(row%2 == 1) {
                if(col%2 == 0) {
                    console.log("fekete")
                } else {
                    console.log("fehér");
                }
            } else {
                if(col%2 == 1) {
                    console.log("fekete")
                } else {
                    console.log("fehér");
            }
        }
azért jó, így, mert most felülről fogjuk generálni a dolgokat, a rendes táblánál meg az aljától 
szóval, ahol a rendes tábla kezdődik az a 1 lent bal sarok, nekünk az mintha a táblán a 8 lenne
fontos!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
ezért lesz jó, hogyha fentről megyünk lefele fehér fekete fehér fekete fehér fekete fehér fekete 
                                             fekete fehér fekete fehér fekete fehér fekete fehér 
                                             fehér fekete fehér fekete fehér fekete fehér fekete
                                             fekete fehér fekete fehér fekete fehér fekete fehér 
***************************************************************************************************************
most csinálunk egy field-et ami egy div lesz és megkapja a field class-t   
const field = document.createElement("div");
div.classList.add("field");

és nekünk van egy black-bg és ott kell hozzáadni ehhez a field-hez, ahol console.log("fekete") van!!! 
de ott van 2 if ugye egymásba ágyazva 
->
if (row % 2 == 1) {
    if (col % 2 == 0) {
        console.log("fekete")
    } else {
        console.log("fehér");
        }
    } else {
        if (col % 2 == 1) {
            console.log("fekete")
        } else {
            console.log("fehér");
        }


ebből csinálunk egysoros verziót, mert az mindig gyorsabb ha nincsenek egymásba ágyazott vezérlési szerkezetek!!! 
->
    generateFields() {
        for (let i = 1; i <= 64; i++) {
            const row = Math.ceil(i / 8);
            const col = (i - 1) % 8 + 1;
            const field = document.createElement("div");
            field.classList.add("field");

            if (row % 2 === 1 && col % 2 === 0) {
                field.classList.add("black-bg");
            } else if(row%2 === 0 && col%2 === 1) {
                field.classList.add("black-bg");
            }

            this.table.appendChild(field);
        }
    }

ez így a jó!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Tehát minden páratlan sorban a párosok lesznek a feketék 
és minden páros sorban pedig a páratlanak!!!! 
nem elfelejteni appendChild-olni a field-et a table-hőz!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*********************************************************************************************************************************************
Tábla kész, most az a kérdés, hogy a bábuk amik rajta lesznek, azok milyen színűek legyenek 
a rendes táblán feketék meg fehérek, de ezek itt nem fognak látszani ezért sötét szürke meg világos szürke lesz 

csinálunk bábukat css-ben -> .player 

.player {
    width: 90%;
    height: 90%;
    border-radius: 100%;
}
.black-player {
    background-color: #333;
    border: 1px solid #606060;
}

.white-player {
    background-color: #d9d9d9;
    border: 1px solid #b9b9b9;
}

Csak a feketén kell, hogy legyenek a bábúk és két sorban 
erre csinálunk egy player változót, de csakis ott ahol megkapta a black-bg-t a field, tehát itt!!! 
if (row % 2 === 1 && col % 2 === 0) {
    field.classList.add("black-bg");
} else if(row%2 === 0 && col%2 === 1) {
    field.classList.add("black-bg");
}
mert ugye ezekre rakjuk rá a bábúkat!! 
if (row % 2 === 1 && col % 2 === 0) {
    field.classList.add("black-bg");
    const player = document.createElement("div");
                
} else if(row%2 === 0 && col%2 === 1) {
    field.classList.add("black-bg");
}
ha itt hozzúk létre a player-eket az a kérdés, hogy ezek most fekete vagy fehér player-ek lesznek
akkor csinálunk fekete player-eket ha ott vagyunk az utolsó két sorban, fehéreket meg, ha az első két sorban vagyunk 

kint azt mondjuk, hogy player az legyen null -> let player = null

let player = null;

if (row % 2 === 1 && col % 2 === 0) {
    field.classList.add("black-bg");
    const player = document.createElement("div");

} else if(row%2 === 0 && col%2 === 1) {
    field.classList.add("black-bg");
    const player = document.createElement("div");
}

és, hogyha a player az nem egyenlő null, tehát létezik -> if(player)
            let player = null;

            if (row % 2 === 1 && col % 2 === 0) {
                field.classList.add("black-bg");
                player = document.createElement("div");

            } else if(row%2 === 0 && col%2 === 1) {
                field.classList.add("black-bg");
                player = document.createElement("div");
            }

            if(player  && row < 3) {
                player.classList.add("player");
                player.classList.add("white-player");
                field.appendChild(player);
            } else if(player && row >= 7) {
                player.classList.add("player");
                player.classList.add("black-player");
                field.appendChild(player);
            }

            this.table.appendChild(field);

1. létrehozunk egy player változót -> let player = null 
    itt még ez nem kap értéket 
2. ahol csináltuk azt, hogy melyik mező legyen fekete, ott a player -> document.querySelector("div");
    de nagyon fontos, hogy itt még ne adjuk hozzá a classList-eket, mert azok csak az első két sorban illetve az utolsó két sorban 
    lesznek, az egyik fekete a másik meg fehér 
3. megcsináljuk az if kitételt 
    - player - > tehát, ha a player létezik!! 
    - row -> row-val kell meghatározni, hogy melyik sorban lesznek < 3 első két sor és >= 7 utolsó két sor 
    ugye az már meg van, hogy a feketén legyenek, mert ott hoztuk létre a div-et!!! 
itt meg megadjuk, hogy melyik lesz a fekete vagy a fehér, fontos, hogy mindegyik megkapja a player osztályt is 
player.classList.add("player");
mert ezt a css-ben mindkettőre csináltuk, itt vannak a közös tulajdonságok
-> 
.player {
    width: 90%;
    height: 90%;
    border-radius: 100%;
}
fekete, fehér meg csak a background-color
-> 
.black-player {
    background-color: #333;
    border: 1px solid #606060;
}

.white-player {
    background-color: #d9d9d9;
    border: 1px solid #b9b9b9;
}

Nagyon fontos még, hogy ezt appaendChild-olni kell a végén majd a field-be 
field.appendChild(player);
mindkét helyen!!!!
-> 
if(player  && row < 3) {
    player.classList.add("player");
    player.classList.add("white-player");
    field.appendChild(player);
} else if(player && row >= 7) {
    player.classList.add("player");
    player.classList.add("black-player");
    field.appendChild(player);
************************************************************************************************************************************
Meg vannak a körök, rajta vannak a fekete mezőkön alul a fehér babúk, felül pedig a feketék 
körök majd olyan háttérszínt, fognak kapni, hogy color-gradient nagyon fontos!!!!! 
megadunk színeket és azt is, hogy honnan menjen mibe 
direction: 
    1. horizontal (left ot right)
    2. vetical (top to bottom)
    3. radial (from center outwards)
mi ezt fogjuk itt használni a radial-t 
rgba (belül fehér lesz kivül meg szürkés)
ez lett a white-player meg a black-player css-ben 
->
.black-player {
    background: rgb(107,107,107);
    background: radial-gradient(circle, rgba(107,107,107,1) 0%, rgba(46,46,46,1) 100%);
    border: 1px solid #606060;
}

.white-player {
    background: rgb(255,255,255);
    background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(191,191,191, 1) 100%);
    border: 1px solid #ffffff;
}
********************************************************************************************************
Hogyan lehet ezekkel a bábúkkal lépni 
- ki kell jelölnünk eggyet 
azért nehézkes a kijelőlés, mert máshogy fog kinézni a kijelőlés az egyik meg a másik esetben 
    vannak fekete meg fehér bábúk 
    
ezt akartuk highlight-nak de ez így nem jó box-shadow-val 
.highlight {
    box-shadow: 0px 0px 4px white;
}
1. paraméter - horizontális mozgatás - itt 0px akkor teljesen mögötte van, de mondjuk 5px-nél ez kimenne 5px-t jobbra
2. paraméter - vertikális mozgatás - itt ez 0px akkor mögötte van, de mondjuk 5px-nél ez kimenne alulra 
3. paraméter - blur - hogy mennyire homályosítsa el, itt 4px, szóval nem nagyon 
4. paraméter - milyen színű legyen a shadow 

de ez így nem jó a mi esetünkben, szóval kap egy másmilyen border-t a kijelölt elem 
->
.highlight {
    border: 2px solid white;
}
a highlight rárakására csinálunk egy highlightPlayer függvényt
    hightlightPlayer(player) {
        
    }

ez kap egy player-t, ami majd kap egy eventListener-t!!! 
    hightlightPlayer(player) {
        player.addEventListener("click", ()=> {
            player.classList.add("highlight");
        });
    }
és ha rákattintunk a player-re, ami azt jelenti, hogy akármelyik bábúra, mert ugye az a player, akkor ez a player megkapja a 
highlight class-t, tehát ki lesz jelölve 

és ezt pedig meghívjuk az előző függvényben, hogy megkapja a player-t 
méghozzá, olyan formában, hogy if(player) csak akkor, ha a player létezik 
-> 
if(player) 
    this.highlightPlayer(player);

Most akkor ez müködik, de az a baj, hogy most az összeset ki tudjuk jelölni 
szóval meg kell nézni, hogy melyik player van kijelölve!!!!!!!! 
meg szükségünk lesz egy olyanja, hogy round, hogy kinek a köre van, tehát ki tudjon kijelölni!!! 
class Checkers {
    table;
    round;
    highlighted;

a highlighted egy objektum lesz, amiben van egy row és egy col, ezek majd nullát kapnak még itt, de majd ha rákattintunk 
akkor megkapjuk, hogy row col értékeket a bábúnkra 
sőt nem is nulla lesz, hanem -1, hogy látszodjon, hogy nincs kijelölve semmi 
    this.highlighted = {
        row: -1,
        col: -1
    }
round-ot, pedog ott kezdjük, hogy nulla 
this.round = 0;
Úgy fog müködni ez, hogyha kijelölünk eggyet és rányomunk valamelyik részre, akkor oda fogjuk rakni magát a player-t!!!!!
Hogyan kell ezt megoldani logikailag 
- ha át akarunk rakni egy bábút egy másik mezőre ahhoz mi szükséges 
    ahhoz kell nekünk a konkrét bábú, tehát a player (a kör) és azt kell átteni a másik mezőre 

és nem csak row meg col lesz a highlighted objektumunkban hanem egy player is!!!! 
->
    this.highlighted = {
        row: -1,
        col: -1,
        player: null
    }
és azt fogjuk csinálni, hogyha rákattintottunk a player-re, akkor bekérjük azt is, hogy row meg col 
-> 
    highlightPlayer(row, col, player) {
        player.addEventListener("click", ()=> {
            player.classList.add("highlight");
        });
    }
}

ugye ezt meghívásnál is meg kell adni, hogy megkapja 
    if(player) 
        this.highlightPlayer(row, col, player);

a player.addEventListener-ben pedig a highligted-nál a row az a row lesz a col meg a col a player meg a player 
    highlightPlayer(row, col, player) {
        player.addEventListener("click", ()=> {
            player.classList.add("highlight");

            this.highlighted = {
                row,
                col,
                player
            }

            console.log(this.highlighted);
        });
    }

console.log(this.highlighted)
->
ha rákattintunk eggyre, akkor ez lesz a highlighted 
->
{row: 2, col: 5, player: div.player.white-player.highlight}
    row: 2
    col: 5 
    player: div.player.white-player.highlight
    [[Prototype]]: Object

a koordinátákat ugye megkaptul a col meg a row-val a player-vel meg azt, hogy melyik pl. az fontos lehet, hogy a fehér bábúknak van egy 
white-player osztály a feketéken pedig van egy black-player
********************************************************************************************
és ha már van highlighted akkor mit tudunk csinálni 
    - rákattintunk bármilyen mezőre, akkor oda tudjuk rakni, most nem vizsgáljuk azt, hogy oda lehet-e rakni vagy sem 

erre csinálunk egy step függvényt   
    amelyben ellenőrizzűk ó, hogy a highlighted.row az nem egyenlő -1-vel!!!! elég csak ezt ellenőrizni
    de előtte!!! 
    kell egy addEventListener a field-re - amire rá fogunk kattintani 
        step(field) {
        field.addEventListener("click", ()=> {
            
        });
    }

és majd ebben ellenőrizzük, hogy a highlighted-nak a row az nem -1!!!! 
    step(field) {
        field.addEventListener("click", ()=> {
            if(this.highlighted.rows !== -1) {
                
            }
        });
    }
ebben pedig a field-hez appendChild-oljuk a this.highlighted.player-t 
ami ez volt -> div.player.white-player.highlight!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
tehát magát a div-et ezekkel az osztályokkal 

és azt még fontos it meg csinálni, hogy lenullázni a dolgokat a highligted-nál, hogyha ezt átraktuk akkor már ne legyen 
highlighted!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
->

    step(field) {
        field.addEventListener("click", ()=> {
            if(this.highlighted.rows !== -1) {
                field.appendChild(this.highlighted.player);

                this.highlighted = {
                    row: -1,
                    col: -1,
                    player: null
                }
            }
        });
    }

és mindenhol ahol van field ezt meghívjuk 
    generateFields() {
        for (let i = 1; i <= 64; i++) {
            const row = Math.ceil(i / 8);
            const col = (i - 1) % 8 + 1;
            const field = document.createElement("div");
            field.classList.add("field");
            let player = null;

            this.step(field);

de ez nem müködik így!!!! 
ha a player-re kattintunk rá akkor hozzáadunk egy e.stopPropagation-t 
    player.addEventListener("click", (e)=> {
        e.stopPropagation();

mert, hogyha itt a player-re kattintunk akkor, mert a player az ami rajta van a field-en, 
akkor nem fut lefutni a field-re készített addEventListener, amit most csináltunk itt!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

Mert mindkettő lefut, mindegyikre van addEventListener és hogyha a belső elemre kattintunk, akkor a külső elemnek az eventListener-je is lefut 
ezt meg akarjuk akadályozni a stopPropagation-val és azért akarjuk ezt megakadályozni a stopPropagation-val, mert akkor ez is le fog futni
egyszer ami a highlightedPlayer-ben van, hogy ezeket az adatokat kitöltjük 
->
player.classList.add("highlight");

this.highlighted = {
    row,
    col,
    player
}
tehát a row és a cell-nek adtunk egy értéket és a player sem lesz null 
és utána lefut ez is 
        field.addEventListener("click", ()=> {
            if(this.highlighted.rows !== -1) {
                field.appendChild(this.highlighted.player);

                this.highlighted = {
                    row: -1,
                    col: -1,
                    player: null
                }
            }

és akkor visszarakjuk a player-t oda, ahol volt eredetileg!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
***************************
így már müködik és visszatérve ide, fontos, hogy a this.highligted.player-ről leszedjük a highlight osztályt, hogy itt már ne legyen kijelölve
->
        field.addEventListener("click", ()=> {
            if(this.highlighted.row !== -1) {
                field.appendChild(this.highlighted.player);
                this.highlighted.player.classList.remove("highlight");

                this.highlighted = {
                    row: -1,
                    col: -1,
                    player: null
                }
            }
        });
***************************************************************************************
még van pár dolog ami nem jó 
- egyrészt azzal lépünk oda, amivel akarunk, lehet egymás után is ugyanazzal a színnel is lépni 
- lehet egy mezőn több bábú is
de már tudunk lépni és amivel már léptünk az nem lesz kijelölve ha leraktuk(highlight)
azt kell megnézni, hogy hol volt a játékos és hogy átlósan lépett-e, illetve eggyet-e !!!!! 
mondjuk a bábú ami a második sorban és az ötödik oszlopban van, akkor mi csal előre léphetünk tehát a sornak biztos, hogy növekednie kell 
de ez a másik esetben pont fordítva lesz, sor csak eggyel növekedhet, oszlop viszont csökenthetm de csak eggyel illetve eggyel is növekedhet 
mert átlósan kell mindig lépni!!!!!!!!!!!!!!!!!

még a field-ben azt kellene megnézni, hogy mennyi a különbség az oszlopok és a sorok között 
sor -> const rowDiff 
de ami itt fontos, hogy a field mellett meg kell adni a row meg a col-t is paraméterként, mert szükségünk lesz rá 

const rowDiff = this.highlighted.row - row;
és a this.highlighted.row - row az biztos, hogy 1 kell, hogy legyen, ha nem 1 mondjuk -1, 2 vagy 5, akkor nem engedjük lépni!!!!!! 

ugyanígy lesz egy colDiff is 
-> 
const colDiff = this.highlighted.col - col;
ez viszont lehet 1 meg -1 is!!! 
ezeket megcsináljuk a field eventListener legelején 
    step(field, row, col) {
        field.addEventListener("click", ()=> {
            const rowDiff = this.highlighted.row - row;
            const colDiff = this.highlighted.col - col;
            
            if(this.highlighted.row !== -1) {
és akkor ahol van egy kikötés az if-ben 
->
if(this.highlighted.row !== -1 && 
rowDiff === 1 && (colDiff === -1 || colDiff === 1))

ez itt azért nem igaz, mert attól is függ, hogy a fekete vagy a fehér lép, mert a fekete a fehérhez képest másik irányba lép!!! 
col az ugyanúgy müködhet de a row az csökkeni fog!! 

Honnan tudjuk, hogy kinek a köre van 
    round-ot beállítjuk "black"-re a constructor-ban 
    this.round = "black";

és minden eggyes lépés utána, amikor sikerült ide bejönni az if-be 
akkor azt mondjuk, hogy this.round = this.round === "black" ? "white" : "black" !!!!!! 
tehát ez hasonló, mint a toggle, tehát ha a this.round az black-re van beáálítva, akkor legyen "white" különben "black"
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Az fontos, hogy csak akkor változtathatjuk meg, hogyha sikerült a lépés, ha nem sikerült a lépés, akkor nem változtathatjuk meg
mert akkor rossz helyre akart lépni és mégis csak a másik fog lépni 
if(this.highlighted.row !== -1 && 
rowDiff === 1 && (colDiff === -1 || colDiff === 1)) {
    this.round = this.round === "black" ? "white" : "black";

azért csakis itt belül az if-en változtathatjuk meg!!!!!! 
****************************************************************
az egész léphet-e dolog, pedig kijöhet egy canMove függvénybe!!! 
    canMove(row, col) {
        const rowDiff = this.highlighted.row - row;
        const colDiff = this.highlighted.col - col;

        if(this.round === "black") {
            return this.highlighted.row !== -1 && 
            rowDiff === - 1 && (colDiff === -1 || colDiff === 1)
        }
    }

itt a rowDiff az -1 lesz!!!! 
csinálhatjuk úgy, hogy egy else vagy csak simán írunk egy másik return-t 
-> 
    canMove(row, col) {
        const rowDiff = this.highlighted.row - row;
        const colDiff = this.highlighted.col - col;

        if(this.round === "black") {
            return this.highlighted.row !== -1 && 
            rowDiff === - 1 && (colDiff === -1 || colDiff === 1)
        }

        return this.highlighted.row !== -1 && 
        rowDiff === 1 && (colDiff === -1 || colDiff === 1)
    }

így már meg van, hogyha a this.round az black, akkor a row az -1, ha pedig nem, akkor 1 
és ezt fogjuk, majd a step-ben meghívni!!!! 

    canMove(row, col) {
        const rowDiff = this.highlighted.row - row;
        const colDiff = this.highlighted.col - col;

        if(this.round === "black") {
            return this.highlighted.row !== -1 && 
            rowDiff === - 1 && (colDiff === -1 || colDiff === 1)
        }

        return this.highlighted.row !== -1 && 
        rowDiff === 1 && (colDiff === -1 || colDiff === 1)
    }

    step(field, row, col) {
        field.addEventListener("click", ()=> {
            if(this.canMove(row, col)) {
                this.round = this.round === "black" ? "white" : "black";

                field.appendChild(this.highlighted.player);
                this.highlighted.player.classList.remove("highlight");

                this.highlighted = {
                    row: -1,
                    col: -1,
                    player: null
                }
            }
        });
    }

fontos, hogy ahol a step meg van hívva, ott meg kell adni a field mellett a row meg a col-t is!!!!!! 
*/

new Checkers();