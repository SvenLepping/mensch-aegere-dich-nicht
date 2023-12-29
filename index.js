const FeldGroesse = 11;
var aktuellerSpieler = 0;
var wurfzaehler = 0;
var wurfErgebnis;
var gewuerfelt = false;

//SpielerListe erstellen mit 4 Spielern
const spielerListe = [{
    id: 0,
    heimfeld: [true, true, true, true],
    zielfeld: [true, true, true, true]
}, {
    id: 1,
    heimfeld: [false, true, true, true],
    zielfeld: [true, false, false, false]
}, {
    id: 2,
    heimfeld: [false, true, true, true],
    zielfeld: [true, true, true, true]
}, {
    id: 3,
    heimfeld: [false, true, true, true],
    zielfeld: [true, false, false, false]
}] 

// Array der Größe 52 wird erstellt und mit null initialisiert
const laufbahn = new Array(FeldGroesse * 4, null);

//Funktion um Spielfeld zu zeichnen
function render() {
    // Sucht im HTML die das Spielbrett Element anhand der ID
    const spielbrett$ = document.querySelector('#spielbrett');

    //Würfel wird zum Spielbrett hinzugefügt und css id wird gesetzt 
    const wurfel$ = document.createElement('div');
    wurfel$.id = 'wuerfel';
    wurfel$.textContent = 'Jetzt würfeln';
    spielbrett$.appendChild(wurfel$);

    //Würfel bekommt klick funktion
    wurfel$.addEventListener('click', function () {
        wurfErgebnis = wurfeln();
        alert(`Du hast eine ${wurfErgebnis} gewürfelt!`)
    })

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

                continue;
            }
                
            const heimFeld = hohleHeimFeldIndex(zeile, spalte);
            //Heimfelder werden gefärbt
            if (heimFeld != null) {
                const spielerFarbe = gibSpielerFarbe(heimFeld.spielerId);
                feld$.className += ` basis-${spielerFarbe}`;

                const heimFeldSpieler = spielerListe[heimFeld.spielerId];
                if (heimFeldSpieler.heimfeld[heimFeld.heimFeldIndex]) {
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

                const zielFeldSpieler = spielerListe[zielFeld.spielerId];
                if (zielFeldSpieler.zielfeld[zielFeld.zielFeldIndex]) {
                    const spielfigur$ = document.createElement('div');
                    spielfigur$.className = `spiel-figur spiel-figur-${spielerFarbe}`;

                    feld$.appendChild(spielfigur$);
                }

            }

        }
    }
    prüfeFertig();
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
        return 29//;
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

function hohleHeimFeldIndex(zeile, spalte) {
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
            startFeldIndex: 0,
            //
            zielFeldIndex: 9 - zeile
        }
    }
    //Spieler 2 Blau
    if (zeile === 5 && (spalte >= 1 && spalte <= 4)) {
        return {
            spielerId: 1,
            startFeldIndex: 10,
            //
            zielFeldIndex: spalte - 1
        }
    }
    //Spieler 3 Gelb
    if (spalte === 5 && (zeile >= 1 && zeile <= 4)) {
        return {
            spielerId: 2,
            startFeldIndex: 20,
            //
            zielFeldIndex: zeile - 1
        }
    }
    //Spieler 4 Grün
    if (zeile === 5 && (spalte >= 6 && spalte <= 9)) {
        return {
            spielerId: 3,
            startFeldIndex: 30,
            //
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
// schmeißt den Würfel und gibt ein Zahl von 1-6 aus
function wurfeln() {
    return Math.floor(Math.random() * 6) + 1; // Würfelt eine Zahl zwischen 1 und 6
}

//wechselt den aktuellen Spieler
function wechsleSpieler() {
    gewuerfelt = false;
    wurfzaehler = 0;

    aktuellerSpieler = (aktuellerSpieler + 1) % 4;

    return aktuellerSpieler;
}

function setzeSpieler(figur) {
    if (gewuerfelt === true) {
        const spieler = spielerListe[figur.spielerId];

        // Überprüfen, ob die Figur im Heimfeld oder auf der Laufbahn ist
        if (figur.heimFeldIndex !== undefined) {
            // Figur ist im Heimfeld
            if (wurfErgebnis === 6) {
                // Wenn eine 6 gewürfelt wurde, darf die Figur auf die Laufbahn gesetzt werden
                figur.heimFeldIndex = undefined; // Figur ist nicht mehr im Heimfeld
                figur.laufbahnIndex = starteLaufbahnIndex(spieler.id); // Setzen Sie den Startindex für die Laufbahn
            }
        } else if (figur.laufbahnIndex !== undefined) {
            // Figur ist auf der Laufbahn
            const neuerLaufbahnIndex = figur.laufbahnIndex + wurfErgebnis;
            // Überprüfen, ob die Figur das Zielfeld erreicht hat
            if (neuerLaufbahnIndex >= FeldGroesse * 4) {
                figur.zielFeldIndex = figur.zielFeldIndex + 1; // Bewegen Sie die Figur im Zielfeld weiter
                figur.laufbahnIndex = undefined; // Figur ist nicht mehr auf der Laufbahn
            } else {
                // Setzen Sie den neuen Laufbahnindex für die Figur
                figur.laufbahnIndex = neuerLaufbahnIndex;
            }
        }

        // Wechseln Sie den Spieler nach dem Zug
        wechsleSpieler();
    }
}


function rauswerfen() {
    
}

function prüfeFertig() {
    for (const spieler of spielerListe) {
        // Überprüfen, ob alle Spielfiguren im Zielfeld sind
        if (spieler.zielfeld.every(feld => feld)) {
            console.log(`Spieler ${spieler.id} ist fertig!`);

            // Hier können Sie weitere Aktionen für einen fertigen Spieler hinzufügen
        }
    }
}

// Funktion, um die Position einer Spielfigur zu setzen
function setzeSpielfigurPosition(spielerId, feldTyp, feldIndex, position) {
    spielerListe[spielerId][feldTyp][feldIndex].position = position;
}

// Wenn Seite lädt dann Spielfeld zeichnen
window.onload = function () {
    render();
}

