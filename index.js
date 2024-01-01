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
    spielFiguren: [-1, -1, -1, -1],
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
                    if (spieler.spielFiguren.includes(laufbahnIndex)) {
                        const spielfigur$ = document.createElement('div');
                        spielfigur$.className = `spiel-figur spiel-figur-${spielerFarbe}`;
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
    let alleFigurenImHeimfeld = pruefungAlleFigurenHeimfeld(aktiverSpieler.spielFiguren);

    //wenn alle Figurne im Heimfeld sind
    //Anpassung wenn alle im Heimfeld oder Gewinnfeld, also keiner auf der Laufbahn
    if (alleFigurenImHeimfeld) {
        for (let zaehler = 0; zaehler < 3; zaehler++) {
            //Spieler auf Startfeld setzen
            wurfAnzahl++;
            const wurfErgebnis = wuerfeln();
            const istRausKommen = figurStartfeld(aktiverSpieler, wurfErgebnis);
            if (istRausKommen) {
                const wurfErgebnis = wuerfeln();
                aktiverSpieler.spielFiguren[0] += wurfErgebnis;
                darfErneutWuerfeln = wurfErgebnis === 6;
                break;
            }
            else {
                darfErneutWuerfeln = false;
            }
        }
        wurfAnzahl = 0;
    }
    //nicht alle Figuren im Heimfeld
    else {
        const wurfErgebnis = wuerfeln();
        if (wurfErgebnis === 6) {
            for (let zaehler = 0; zaehler < 4; zaehler++) {
                if (aktiverSpieler.spielFiguren[zaehler] === 10 * aktuellerSpielerID) {
                    aktiverSpieler.spielFiguren[zaehler] += wurfErgebnis;
                }
                else {
                    if (pruefungFigurenHeimfeld != 0) {
                        figurStartfeld(aktiverSpieler, wurfErgebnis);
                        darfErneutWuerfeln = true;
                    }
                    else {
                        aktiverSpieler.spielFiguren[0] += wurfErgebnis;
                        darfErneutWuerfeln = true;
                    }

                }

            }
        }
        //Zahl 1-5 gewürfelt
        else {
            for (let zaehler = 0; zaehler < 4; zaehler++) {
                if (aktiverSpieler.spielFiguren[zaehler] === 10 * aktuellerSpielerID) {
                    aktiverSpieler.spielFiguren[zaehler] += wurfErgebnis;
                }
                else {
                    aktiverSpieler.spielFiguren[0] += wurfErgebnis;
                    darfErneutWuerfeln = false;
                }
            }

        }
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

//wechselt den aktuellen Spieler
function wechsleSpieler() {
    aktuellerSpielerID = (aktuellerSpielerID + 1) % 4;
    wurfAnzahl = 0;
}

function pruefungSpielFeldBesetzt(spielfeld){

}
function figurSchlagen() {

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
function figurStartfeld(aktiverSpieler, wurfErgebnis) {
    if (wurfErgebnis === 6) {
        for (let zaehler = 0; zaehler < 4; zaehler++) {
            if (aktiverSpieler.spielFiguren[zaehler] === -1) {
                aktiverSpieler.spielFiguren[zaehler] = 10 * aktuellerSpielerID;
                return true;
            }
        }
    }
    return false;

}
//Prüfen ob alle Figuren im Heimfeld sind
function pruefungAlleFigurenHeimfeld(spielerListe) {
    let anzahlFigurenHeimfeld = 0;

    for (let zaehler = 0; zaehler < spielerListe.length; zaehler++) {
        if (spielerListe[zaehler] === -1) {
            anzahlFigurenHeimfeld++;
        }
    }
    if (anzahlFigurenHeimfeld === 4) {
        return true;
    }
    else {
        return false;
    }
}
//Anzahl der Figuren im Heimfeld prüfen
function pruefungFigurenHeimfeld(spielerListe) {
    let anzahlFigurenHeimfeld = 0;

    for (let zaehler = 0; zaehler < spielerListe.length; zaehler++) {
        if (spielerListe[zaehler] === -1) {
            anzahlFigurenHeimfeld++;
        }
    }
    return anzahlFigurenHeimfeld;
}

// Wenn Seite lädt dann Spielfeld zeichnen
window.onload = function () {
    renderSpielbrett();
    renderWuerfel();
}

