const FeldGroesse = 11;

//SpielerListe erstellen mit 4 Spielern
const spielerListe = [{
    id: 0,
    heimfeld: [false, false, false, false],
    zielfeld: [true, true, true, true]
}, {
    id: 1,
    heimfeld: [false, true, true, true],
    zielfeld: [true, false, false, false]
}, {
    id: 2,
    heimfeld: [false, true, true, true],
    zielfeld: [true, false, false, false]
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
        return 12;
    }
    if (zeile === 4 && (spalte >= 0 && spalte <= 4)) {
        return 13 + spalte;
    }
    if (spalte === 4 && (zeile >= 0 && zeile <= 4)) {
        return 18 + (3 - zeile);
    }
    if (spalte === 5 && zeile === 0) {
        return 22;
    }
    if (spalte === 6 && (zeile >= 0 && zeile <= 3)) {
        return 23 + zeile;
    }
    if (zeile === 4 && (spalte >= 6 && spalte <= 10)) {
        return 27 + (spalte - 6);
    }
    if (spalte === 10 && zeile === 5) {
        return 32;
    }
    if (zeile === 6 && (spalte <= 10 && spalte >= 6)) {
        return 33 + (10 - spalte);
    }
    if (spalte === 6 && (zeile >= 7 && zeile <= 10)) {
        return 38 + (zeile - 7);
    }
    if (spalte === 5 && zeile === 10) {
        return 43;
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
            //
            zielFeldIndex: 9 - zeile
        }
    }
    //Spieler 2 Blau
    if (zeile === 5 && (spalte >= 1 && spalte <= 4)) {
        return {
            spielerId: 1,
            //
            zielFeldIndex: spalte - 1
        }
    }
    //Spieler 3 Gelb
    if (spalte === 5 && (zeile >= 1 && zeile <= 4)) {
        return {
            spielerId: 2,
            //
            zielFeldIndex: zeile - 1
        }
    }
    //Spieler 4 Grün
    if (zeile === 5 && (spalte >= 6 && spalte <= 9)) {
        return {
            spielerId: 3,
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

// Wenn Seite lädtd dann Spielfeld zeichnen
window.onload = function () {
    render();

}

