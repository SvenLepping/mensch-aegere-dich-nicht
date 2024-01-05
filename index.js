const FeldGroesse = 11;
let aktuellerSpielerID = 0;
let wurfAnzahl = 0;

//SpielerListe erstellen mit 4 Spielern
const spielerListe = [{
    id: 0,
    //Laufbahnindex der Spielfigur
    //-1 = auf Heimfeld
    //40-43 Zielfeld
    spielFiguren: [-1, -1, -1, -1],
}, {
    id: 1,
    spielFiguren: [-1, -1, -1, -1],
}, {
    id: 2,
    spielFiguren: [-1, -1, -1, -1],
}, {
    id: 3,
    spielFiguren: [-1, 0, 10, 20],
}]

// Array der Größe 52 wird erstellt und mit null initialisiert
const laufbahn = new Array(FeldGroesse * 4, null);

function renderWuerfel() {
    //Würfel wird zum Spielbrett hinzugefügt und css id wird gesetzt 
    const wuerfel$ = document.querySelector('#wuerfel');

    wuerfel$.textContent = 'Jetzt würfeln';

    //Würfel bekommt klick Funktion
    wuerfel$.addEventListener('click', spielzugAusfuehren);
}

//Funktion um Spielfeld zu zeichnen
function renderSpielbrett() {
    // Sucht im HTML die das Spielbrett Element anhand der ID
    const spielbrett$ = document.querySelector('#spielbrett');
    spielbrett$.innerHTML = "";

    for (let zeile = 0; zeile < FeldGroesse; zeile++) {
        const zeile$ = document.createElement('div');
        zeile$.className = 'zeile';
        spielbrett$.appendChild(zeile$);

        for (let spalte = 0; spalte < FeldGroesse; spalte++) {
            const feld$ = document.createElement('div');
            feld$.className = 'feld';

            zeile$.appendChild(feld$);

            const laufbahnIndex = holeLaufbahnIndex(zeile, spalte);
            // Laufbahn wird gefärbt 
            if (laufbahnIndex != null) {
                feld$.className += ' laufbahn';

                if (laufbahnIndex === 0) {
                    feld$.className += ' basis-rot';
                }
                if (laufbahnIndex === 10) {
                    feld$.className += ' basis-blau';
                }
                if (laufbahnIndex === 20) {
                    feld$.className += ' basis-gelb';
                }
                if (laufbahnIndex === 30) {
                    feld$.className += ' basis-grün';
                }

                for (let spielerId = 0; spielerId < spielerListe.length; spielerId++) {
                    const spieler = spielerListe[spielerId];
                    const spielerFarbe = gibSpielerFarbe(spieler.id)
                    const spielFigurId = spieler.spielFiguren.indexOf(laufbahnIndex);
                    if (spielFigurId !== -1) {
                        const spielfigur$ = document.createElement('div');
                        spielfigur$.className = `spiel-figur spiel-figur-${spielerFarbe}`;
                        spielfigur$.addEventListener("click", function () {
                            spielFigurGedrueckt(spielerId, spielFigurId, spieler.spielFiguren[spielFigurId]);
                        })
                        feld$.appendChild(spielfigur$);
                    }
                }

                continue;
            }

            const heimFeld = holeHeimFeldIndex(zeile, spalte);
            //Heimfelder werden gefärbt
            if (heimFeld != null) {
                const spielerFarbe = gibSpielerFarbe(heimFeld.spielerId);
                feld$.className += ` basis-${spielerFarbe}`;

                const heimfeldAktuellerSpieler = spielerListe[heimFeld.spielerId];
                const aktuelleSpielfigur = heimfeldAktuellerSpieler.spielFiguren[heimFeld.heimFeldIndex];
                if (aktuelleSpielfigur === -1) {
                    const spielfigur$ = document.createElement('div');
                    spielfigur$.className = `spiel-figur spiel-figur-${spielerFarbe}`;
                    spielfigur$.addEventListener("click", function () {
                        spielFigurGedrueckt(heimFeld.spielerId, heimFeld.heimFeldIndex, -1);
                    })
                    feld$.appendChild(spielfigur$);
                }
            }

            const zielFeld = hohleZielFeldIndex(zeile, spalte);
            //Zielfelder werden gefärbt
            if (zielFeld != null) {
                const spielerFarbe = gibSpielerFarbe(zielFeld.spielerId);
                feld$.className += ` basis-${spielerFarbe}`;

                const zielfeldAktuellerSpieler = spielerListe[zielFeld.spielerId];
                const zielFeldPosition = zielFeld.zielFeldIndex + 40;
                if (zielfeldAktuellerSpieler.spielFiguren.includes(zielFeldPosition)) {
                    const spielfigur$ = document.createElement('div');
                    spielfigur$.className = `spiel-figur spiel-figur-${spielerFarbe}`;
                    spielfigur$.addEventListener("click", function () {
                        spielFigurGedrueckt(zielFeld.spielerId, zielFeld.zielFeldIndex, zielFeldPosition);
                    })
                    feld$.appendChild(spielfigur$);
                }
            }
        }
    }
}

// aus einer Koordinate vom Spielbrett wird der Laufbahnindex zurückgegeben
// TODO: Algorhytmus optimieren 
function holeLaufbahnIndex(zeile, spalte) {
    if (spalte === 4 && (zeile >= 7 && zeile <= 10)) {
        return 10 - zeile;
    }
    if (zeile === 6 && (spalte >= 0 && spalte <= 4)) {
        return 4 + (4 - spalte);
    }
    if (spalte === 0 && zeile === 5) {
        return 9;
    }
    if (zeile === 4 && (spalte >= 0 && spalte <= 4)) {
        return 10 + spalte;
    }
    if (spalte === 4 && (zeile >= 0 && zeile <= 4)) {
        return 15 + (3 - zeile);
    }
    if (spalte === 5 && zeile === 0) {
        return 19;
    }
    if (spalte === 6 && (zeile >= 0 && zeile <= 3)) {
        return 20 + zeile;
    }
    if (zeile === 4 && (spalte >= 6 && spalte <= 10)) {
        return 24 + (spalte - 6);
    }
    if (spalte === 10 && zeile === 5) {
        return 29;
    }
    if (zeile === 6 && (spalte <= 10 && spalte >= 6)) {
        return 30 + (10 - spalte);
    }
    if (spalte === 6 && (zeile >= 7 && zeile <= 10)) {
        return 35 + (zeile - 7);
    }
    if (spalte === 5 && zeile === 10) {
        return 39;
    }

    return null;
}

function holeHeimFeldIndex(zeile, spalte) {
    //Spieler 1 Rot
    if (zeile >= 9 && zeile <= 10 && spalte <= 1) {
        return {
            spielerId: 0,
            //
            heimFeldIndex: spalte + (2 * (zeile - 9))
        }
    }

    //Spieler 2 Blau
    if (zeile >= 0 && zeile <= 1 && spalte <= 1) {
        return {
            spielerId: 1,
            //
            heimFeldIndex: spalte + (2 * zeile)
        }
    }

    //Spieler 3 Gelb
    if (zeile >= 0 && zeile <= 1 && spalte >= 9 && spalte <= 10) {
        return {
            spielerId: 2,
            //
            heimFeldIndex: (spalte - 9) + (2 * zeile)
        }
    }

    //Spieler 4 Grün
    if (zeile >= 9 && zeile <= 10 && spalte >= 9 && spalte <= 10) {
        return {
            spielerId: 3,
            //
            heimFeldIndex: (spalte - 9) + (2 * (zeile - 9))
        }
    }

    return null;
}

function hohleZielFeldIndex(zeile, spalte) {
    //Spieler 1 Rot
    if (spalte === 5 && (zeile <= 9 && zeile >= 6)) {
        return {
            spielerId: 0,
            zielFeldIndex: 9 - zeile
        }
    }
    //Spieler 2 Blau
    if (zeile === 5 && (spalte >= 1 && spalte <= 4)) {
        return {
            spielerId: 1,
            zielFeldIndex: spalte - 1
        }
    }
    //Spieler 3 Gelb
    if (spalte === 5 && (zeile >= 1 && zeile <= 4)) {
        return {
            spielerId: 2,
            zielFeldIndex: zeile - 1
        }
    }
    //Spieler 4 Grün
    if (zeile === 5 && (spalte >= 6 && spalte <= 9)) {
        return {
            spielerId: 3,
            zielFeldIndex: 9 - spalte
        }
    }

    return null;
}

function gibSpielerFarbe(id) {
    switch (id) {
        case 0:
            return 'rot';
        case 1:
            return 'blau';
        case 2:
            return 'gelb';
        case 3:
            return 'grün';
        default:
            throw new Error('falscher Spieler');
    }
}

function spielzugAusfuehren() {
    const aktiverSpieler = spielerListe[aktuellerSpielerID];
    let darfErneutWuerfeln = false;
    const wurfErgebnis = wuerfeln();

    //Wenn sich kein Spieler auf der Laufbahn befindet
    if (pruefungKeinSpielerLaufbahn(aktiverSpieler.spielFiguren)) {
        if (wurfErgebnis < 6) {
            console.log(`Bitte Würfeln Sie erneut, Sie haben schon ${wurfAnzahl}/3 Versuchen benötigt.`);
            if (wurfAnzahl < 3) {
                darfErneutWuerfeln = true;
            }
            else {
                darfErneutWuerfeln = false;
            }
        }
        //6 gewürfelt
        else {
            darfErneutWuerfeln = true;
            const ersterSpielerImHeimfeld = erstenHeimFeldSpielerSuchen(aktiverSpieler.spielFiguren);
            //const indexAnkunftsFeld = ankunftsSpielFeldBerechnen(erstenHeimFeldSpielerSuchen, wurfErgebnis);
            let startFeldSpieler = aktuellerSpielerID*10;
            console.log(`StartFeldSpieler = ${startFeldSpieler}`);

            if (pruefungSpielFeldBesetzt(startFeldSpieler)) {
                if (pruefungBesetztEigenerSpieler(startFeldSpieler, aktiverSpieler.spielFiguren)) {
                    console.log(`Ungültiger Zug, bitte eine andere Figur auswählen!`);
                }
                else {
                    console.log("Spielfeld besetzt");
                    figurSchlagen(startFeldSpieler);
                    figurStartfeld(aktiverSpieler, ersterSpielerImHeimfeld);
                }
            }
            else {
                figurStartfeld(aktiverSpieler, ersterSpielerImHeimfeld);
            }

        }
    }
    //Wenn sich ein Spieler auf der Laufbahn befindet
    else {
        aktiverSpieler.spielFiguren[2] += wurfErgebnis;
    }

    renderSpielbrett();
    if (darfErneutWuerfeln) {
        return;
    }

    if (prüfeFertig()) {
        window.alert(`Spieler ${aktuellerSpielerID} hat gewonnen!`);
    }
    else {
        wechsleSpieler();
    }

}


// schmeißt den Würfel und gibt ein Zahl von 1-6 aus
function wuerfeln() {
    wurfAnzahl++;
    const wurfErgebnis = Math.floor(Math.random() * 6) + 1; // Würfelt eine Zahl zwischen 1 und 6
    window.alert(`Spieler ${aktuellerSpielerID} hat eine ${wurfErgebnis} gewürfelt`);
    return wurfErgebnis;
}

function spielFigurGedrueckt(spielerID, figurID, position) {
    console.log("Spielfigur gedrückt", spielerID, figurID, position);
}

//wechselt den aktuellen Spieler
function wechsleSpieler() {
    aktuellerSpielerID = (aktuellerSpielerID + 1) % 4;
    wurfAnzahl = 0;
}

function figurSchlagen(feldIndex) {
    let spielerIdGeschlagen = -1;
    let spielFigurIndex = -1;
    if (aktuellerSpielerID === 0) {
        console.log("SpielerId=0")
        if (spielerListe[1].spielFiguren.indexOf(feldIndex) !== -1) {
            spielFigurIndex = spielerListe[1].spielFiguren.indexOf(feldIndex);
            spielerIdGeschlagen = 1;
        }
        if (spielerListe[2].spielFiguren.indexOf(feldIndex) !== -1) {
            spielFigurIndex = spielerListe[2].spielFiguren.indexOf(feldIndex);
            spielerIdGeschlagen = 2;
        }
        if (spielerListe[3].spielFiguren.indexOf(feldIndex) !== -1) {
            spielFigurIndex = spielerListe[3].spielFiguren.indexOf(feldIndex);
            spielerIdGeschlagen = 3;
        }
    }
    if (aktuellerSpielerID === 1) {
        console.log("SpielerId=1")
        if (spielerListe[0].spielFiguren.indexOf(feldIndex) !== -1) {
            spielFigurIndex = spielerListe[0].spielFiguren.indexOf(feldIndex);
            spielerIdGeschlagen = 0;
        }
        if (spielerListe[2].spielFiguren.indexOf(feldIndex) !== -1) {
            spielFigurIndex = spielerListe[2].spielFiguren.indexOf(feldIndex);
            spielerIdGeschlagen = 2;
        }
        if (spielerListe[3].spielFiguren.indexOf(feldIndex) !== -1) {
            spielFigurIndex = spielerListe[3].spielFiguren.indexOf(feldIndex);
            spielerIdGeschlagen = 3;
        }
    }
    if (aktuellerSpielerID === 2) {
        console.log("SpielerId=2")
        if (spielerListe[0].spielFiguren.indexOf(feldIndex) !== -1) {
            spielFigurIndex = spielerListe[0].spielFiguren.indexOf(feldIndex);
            spielerIdGeschlagen = 0;
        }
        if (spielerListe[1].spielFiguren.indexOf(feldIndex) !== -1) {
            spielFigurIndex = spielerListe[1].spielFiguren.indexOf(feldIndex);
            spielerIdGeschlagen = 1;
        }
        if (spielerListe[3].spielFiguren.indexOf(feldIndex) !== -1) {
            spielFigurIndex = spielerListe[3].spielFiguren.indexOf(feldIndex);
            spielerIdGeschlagen = 3;
        }
    }
    if (aktuellerSpielerID === 3) {
        console.log("SpielerId=3")
        if (spielerListe[0].spielFiguren.indexOf(feldIndex) !== -1) {
            spielFigurIndex = spielerListe[0].spielFiguren.indexOf(feldIndex);
            spielerIdGeschlagen = 0;
        }
        if (spielerListe[1].spielFiguren.indexOf(feldIndex) !== -1) {
            spielFigurIndex = spielerListe[1].spielFiguren.indexOf(feldIndex);
            spielerIdGeschlagen = 1;
        }
        if (spielerListe[2].spielFiguren.indexOf(feldIndex) !== -1) {
            spielFigurIndex = spielerListe[2].spielFiguren.indexOf(feldIndex);
            spielerIdGeschlagen = 2;
        }
    }
    else {
        console.log("Spieler ID nicht gefunden.");
    }
    console.log(` SpielerIdGeschlagen =${spielerIdGeschlagen} / SpielerFigurIndex = ${spielFigurIndex}`);
    const spielerListeGeschlagen = spielerListe[spielerIdGeschlagen];
    spielerListeGeschlagen.spielFiguren[spielFigurIndex] = -1;
}

function prüfeFertig() {
    for (const spieler of spielerListe) {
        // Überprüfen, ob alle Spielfiguren im Zielfeld sind
        if (spieler.spielFiguren.every(figur => figur >= 40)) {
            return true;
        }
    }
    return false;
}

//Figur auf Startfeld setzen
function figurStartfeld(aktiverSpieler, ersterSpielerHeimfeld) {
    aktiverSpieler.spielFiguren[ersterSpielerHeimfeld] = 10 * aktuellerSpielerID;
}
//Prüfung, ob sich kein Spieler auf der Laufbahn befindet
function pruefungKeinSpielerLaufbahn(spielerListe) {
    let anzahlFigurLaufbahn = 0;

    for (let zaehler = 0; zaehler < spielerListe.length; zaehler++) {
        if (spielerListe[zaehler] >= 0 && spielerListe[zaehler] <= 39) {
            anzahlFigurLaufbahn++;
        }
    }
    if (anzahlFigurLaufbahn === 0) {
        return true;
    }
    else {
        return false;
    }
}
//Ersten Heimfeld-Spieler suchen
function erstenHeimFeldSpielerSuchen(spielerListe) {
    for (let zaehler = 0; zaehler < spielerListe.length; zaehler++) {
        if (spielerListe[zaehler] === -1) {
            return zaehler;
        }
    }
}
function ankunftsSpielFeldBerechnen(indexAktuellesFeld, wurfZahl) {
    return indexAktuellesFeld + wurfZahl;
}
function pruefungSpielFeldBesetzt(feldIndex) {
    return spielerListe[0].spielFiguren.includes(feldIndex) ||
        spielerListe[1].spielFiguren.includes(feldIndex) ||
        spielerListe[2].spielFiguren.includes(feldIndex) ||
        spielerListe[3].spielFiguren.includes(feldIndex);
}

function pruefungBesetztEigenerSpieler(feldIndex, spielerListe) {
    if (spielerListe.includes(feldIndex)) {
        return true;
    }
    else {
        return false;
    }
}

// Wenn Seite lädt dann Spielfeld zeichnen
window.onload = function () {
    renderSpielbrett();
    renderWuerfel();
}

