const FeldGroesse = 11;
let aktuellerSpielerID = 0;
let wurfAnzahl = 0;
let gedrueckteSpielerID = null;
let gedrueckteFigurID = null;
let gedruecktePosition = null;

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
    //Würfel wird zum Spielbrett hinzugefügt und CSS-ID wird gesetzt 
    const wuerfel$ = document.querySelector('#wuerfel');

    wuerfel$.textContent = 'Jetzt würfeln';

    //Würfel erhält Klick-Funktion
    wuerfel$.addEventListener('click', spielzugAusfuehren);
}

//Funktion um Spielfeld zu zeichnen
function renderSpielbrett() {
    // Spielfeld-Element im HTML wird anhand der ID gesucht
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
                    feld$.className += ' basis-Rot';
                }
                if (laufbahnIndex === 10) {
                    feld$.className += ' basis-Blau';
                }
                if (laufbahnIndex === 20) {
                    feld$.className += ' basis-Gelb';
                }
                if (laufbahnIndex === 30) {
                    feld$.className += ' basis-Grün';
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

            const zielFeld = holeZielFeldIndex(zeile, spalte);
            //Zielfelder werden gefärbt
            if (zielFeld != null) {
                const spielerFarbe = gibSpielerFarbe(zielFeld.spielerId);
                feld$.className += ` basis-${spielerFarbe}`;

                const zielfeldAktuellerSpieler = spielerListe[zielFeld.spielerId];
                const zielFeldPosition = zielFeld.zielFeldIndex + 40;
                const figurId = zielfeldAktuellerSpieler.spielFiguren.indexOf(zielFeldPosition);
                if (zielfeldAktuellerSpieler.spielFiguren.includes(zielFeldPosition)) {
                    const spielfigur$ = document.createElement('div');
                    spielfigur$.className = `spiel-figur spiel-figur-${spielerFarbe}`;
                    spielfigur$.addEventListener("click", function () {
                        spielFigurGedrueckt(zielFeld.spielerId, figurId, zielFeldPosition);
                    })
                    feld$.appendChild(spielfigur$);
                }
            }
        }
    }
}

// aus einer Koordinate vom Spielbrett wird der Laufbahnindex zurückgegeben 
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

function holeZielFeldIndex(zeile, spalte) {
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
            return 'Rot';
        case 1:
            return 'Blau';
        case 2:
            return 'Gelb';
        case 3:
            return 'Grün';
        default:
            throw new Error('falscher Spieler');
    }
}

async function spielzugAusfuehren() {
    const aktiverSpieler = spielerListe[aktuellerSpielerID];
    const spielerFarbe = gibSpielerFarbe(aktuellerSpielerID);
    let darfErneutWuerfeln = false;
    const wurfErgebnis = wuerfeln();
    //Prüfung ob Startfeld mit eigenem Spieler besetzt ist und mindestens ein Spieler im Heimfeld ist
    if (pruefungSpielFeldBesetzt(aktuellerSpielerID * 10) && pruefungBesetztEigenerSpieler(aktuellerSpielerID * 10) && minEinSpielerHeimfeld() === true) {
        const indexFigurStartfeld = indexEigeneFigurStartFeld();
        const wertAnkunftsFeld = ankunftsSpielFeldBerechnen(aktuellerSpielerID * 10, wurfErgebnis);
        //Prüft ob das Feld wo die Figur vom Startfeld aus hingezogen werden soll besetzt ist
        if (pruefungSpielFeldBesetzt(wertAnkunftsFeld)) {
            //Prüft ob das Feld wo die Figur vom Startfeld aus hingezogen werden soll durch einen eigenen Spieler besetzt ist
            if (pruefungBesetztEigenerSpieler(wertAnkunftsFeld)) {
                window.alert(`Ungültiger Zug, bitte eine andere Figur auswählen!`);
                await spielFigurAuswaehlenUndSetzen(wurfErgebnis);
                spielFigurAuswahlZuruecksetzen();
            }
            //Ankunftsfeld der Figur ist durch einen fremden Spieler besetzt
            else {
                figurSchlagen(wertAnkunftsFeld);
                aktiverSpieler.spielFiguren[indexFigurStartfeld] = wertAnkunftsFeld;
            }
        //Ankunftsfeld nicht besetzt
        } else {
            aktiverSpieler.spielFiguren[indexFigurStartfeld] = wertAnkunftsFeld;
        }
        //Wenn der Spieler hier eine 6 würfelt, darf er noch einmal würfeln
        if (wurfErgebnis === 6) {
            darfErneutWuerfeln = true;
        }
    }
    // Startfeld nicht mit eigenem Spieler besetzt
    else {
        //Wenn sich kein Spieler auf der Laufbahn befindet
        if (pruefungKeinSpielerLaufbahn(aktiverSpieler.spielFiguren)) {
            //Spieler hat keine 6 gewürfelt
            if (wurfErgebnis < 6) {
                window.alert(`Bitte Würfeln Sie erneut. Sie haben schon ${wurfAnzahl}/3 Versuchen benötigt, um eine 6 zu würfeln.`);
                //Wenn noch nicht drei mal gewürfelt wurde, darf der Spieler weiter würfeln
                if (wurfAnzahl < 3) {
                    darfErneutWuerfeln = true;
                }
                //Wenn der Spieler schon drei mal gewürfelt hat, darf er nicht noch einmal würfeln
                else {
                    darfErneutWuerfeln = false;
                }
            }
            //6 gewürfelt
            else {
                darfErneutWuerfeln = true;
                const ersterSpielerImHeimfeld = erstenHeimFeldSpielerSuchen(aktiverSpieler.spielFiguren);
                let startFeldSpieler = aktuellerSpielerID * 10;
                console.log(`StartFeldSpieler = ${startFeldSpieler}`);

                //Prüfung ob das Startfeld, wo die Figur hingesetzt werden soll, besetzt ist
                if (pruefungSpielFeldBesetzt(startFeldSpieler)) {
                    // Prüft ob diese durch einen eigenen Spieler besetzt ist
                    if (pruefungBesetztEigenerSpieler(startFeldSpieler)) {
                        window.alert(`Ungültiger Zug, bitte eine andere Figur auswählen!`);
                        //wird nie eintreten, da kein Spieler auf der Laufbahn ist (wie oben geprüft)
                    }
                    //Starfeld ruch fremden Spieler besetzt
                    else {
                        figurSchlagen(startFeldSpieler);
                        figurStartfeld(aktiverSpieler, ersterSpielerImHeimfeld);
                    }
                }
                //Startfeld nicht besetzt
                else {
                    figurStartfeld(aktiverSpieler, ersterSpielerImHeimfeld);
                }

            }
        }
        //Wenn sich ein Spieler auf der Laufbahn befindet
        else {
            //wenn 1-5 gewürfelt wird
            if (wurfErgebnis < 6) {
                await spielFigurAuswaehlenUndSetzen(wurfErgebnis);
                spielFigurAuswahlZuruecksetzen();

            }
            //wenn eine 6 gewürfelt wird
            else {
                darfErneutWuerfeln = true;
                //Prüfung ob noch ein Spieler im Heimfeld ist
                if (minEinSpielerHeimfeld()) {
                    const ersterSpielerImHeimfeld = erstenHeimFeldSpielerSuchen(aktiverSpieler.spielFiguren);
                    let startFeldSpieler = aktuellerSpielerID * 10;
                    const wertAnkunftsFeld = ankunftsSpielFeldBerechnen(startFeldSpieler, wurfErgebnis);
                    //Prüfung ob das Startfeld besetzt ist
                    if (pruefungSpielFeldBesetzt(startFeldSpieler)) {
                        //besetzt durch eigenen Spieler
                        if (pruefungBesetztEigenerSpieler(startFeldSpieler)) {
                            //Prüfung ob Ankunftsspielfeld besetzt ist wenn Spielfigur von Startfeld weitergesetzt wird
                            if (pruefungSpielFeldBesetzt(wertAnkunftsFeld)) {
                                //Prüfung ob das Ankunftsfeld durch eigenen Spieler besetzt ist
                                if (pruefungBesetztEigenerSpieler(wertAnkunftsFeld)) {
                                    window.alert(`Ungültiger Zug, bitte eine andere Figur auswählen!`);
                                    await spielFigurAuswaehlenUndSetzen(wurfErgebnis);
                                    spielFigurAuswahlZuruecksetzen();
                                }
                                //Ankunftsfeld durch fremden Spieler besetzt
                                else {
                                    figurSchlagen(wertAnkunftsFeld);
                                    aktiverSpieler.spielFiguren[indexEigeneFigurStartFeld()] = wertAnkunftsFeld;

                                }
                            } 
                            //Ankunftsfeld nicht besetzt
                            else {
                                aktiverSpieler.spielFiguren[indexEigeneFigurStartFeld()] = wertAnkunftsFeld;
                            }
                        }
                        //Starfeld von fremden Spieler besetzt
                        else {
                            figurSchlagen(startFeldSpieler);
                            figurStartfeld(aktiverSpieler, ersterSpielerImHeimfeld);
                        }
                    }
                    //Startfeld frei
                    else {
                        figurStartfeld(aktiverSpieler, ersterSpielerImHeimfeld);
                    }
                }
                //Wenn kein Spieler im Heimfeld ist und eine 6 gewürfelt
                else {
                    await spielFigurAuswaehlenUndSetzen(wurfErgebnis);
                    spielFigurAuswahlZuruecksetzen();
                }
            }
        }
    }
    //Spielbrett neu laden um Veränderungen sichtbar zu mahcen
    renderSpielbrett();
    //return, damit dann der Spielerwechsel nicht durchgeführt wird
    if (darfErneutWuerfeln) {
        return;
    }

    if (prüfeFertig()) {
        renderSpielbrett();
        window.alert(`Spieler ${gibSpielerFarbe(aktuellerSpielerID)}(${aktuellerSpielerID}) hat gewonnen! Das Spiel ist vorbei!`);
        spielBrettZurueckSetzen();
    }
    else {
        wechsleSpieler();
        await zeigeNeueSpielerFarbeAlert();
    }

}

// schmeißt den Würfel und gibt ein Zahl von 1-6 aus
function wuerfeln() {
    wurfAnzahl++;
    const wurfErgebnis = Math.floor(Math.random() * 6) + 1; // Würfelt eine Zahl zwischen 1 und 6
    window.alert(`Spieler ${gibSpielerFarbe(aktuellerSpielerID)} (ID = ${aktuellerSpielerID}) hat eine ${wurfErgebnis} gewürfelt`);
    return wurfErgebnis;
}

function spielFigurGedrueckt(spielerID, figurID, position) {
    gedrueckteSpielerID = spielerID;
    gedrueckteFigurID = figurID;
    gedruecktePosition = position;

    console.log("Spielfigur gedrückt", spielerID, figurID, position);
}

async function spielFigurAuswaehlenUndSetzen(wurfErgebnis) {
    let figurGeaendert = await pruefungAenderungFigurAuswahl();
    console.log(figurGeaendert);
    console.log(aktuellerSpielerID);
    console.log(gedrueckteSpielerID, gedrueckteFigurID, gedruecktePosition);
    console.log(wurfErgebnis);
    if (figurGeaendert) {
        console.log(`Funktion pruefeAenderungFigurAuswahl ${gedrueckteSpielerID}    ${aktuellerSpielerID}`);
        //Prüfung ob der Spieler seine eigenen Figur ausgewählt hat
        if (gedrueckteSpielerID === aktuellerSpielerID && gedruecktePosition != -1) {
            console.log("gedrueckteSpielerID === aktuellerSpielerID");
            console.log(gedrueckteSpielerID, gedrueckteFigurID, gedruecktePosition);
            console.log(wurfErgebnis);
            //Funktion Ankunftseld berechnen funktioniert hier nicht, gedruecktePosition wird dann als Nan übergeben?!
            const wertAnkunftsFeld = ankunftsSpielFeldBerechnen(gedruecktePosition, wurfErgebnis);
            console.log("Ankunftsfeld", wertAnkunftsFeld);
            if (wertAnkunftsFeld <= 43) {
                if (pruefungSpielFeldBesetzt(wertAnkunftsFeld)) {
                    if (pruefungBesetztEigenerSpieler(wertAnkunftsFeld)) {
                        await spielFigurAuswaehlenUndSetzen(wurfErgebnis);
                        spielFigurAuswahlZuruecksetzen();
                        console.log("andere Spielfigur auswählen");
                    } else {
                        figurSchlagen(wertAnkunftsFeld);
                        console.log("Gedrückte Spieler ID", gedrueckteSpielerID);
                        console.log("Gedrückte Figur ID", gedrueckteFigurID);
                        console.log("Aktuelle Spieler ID", aktuellerSpielerID);
                        spielerListe[gedrueckteSpielerID].spielFiguren[gedrueckteFigurID] = wertAnkunftsFeld;
                        spielFigurAuswahlZuruecksetzen();
                        console.log("ICH SETZE DIE FIGUR, NACHDEM ICH JEMANDEN GESCHLAGEN HABE");
                        renderSpielbrett();
                    }
                }
                else {
                    console.log("Ausgewählte Figur setzen");
                    console.log("ICH SETZE DIE FIGUR");
                    console.log("Gedrückte Spieler ID", gedrueckteSpielerID);
                    console.log("Gedrückte Figur ID", gedrueckteFigurID);
                    console.log("Aktuelle Spieler ID", aktuellerSpielerID);
                    spielerListe[aktuellerSpielerID].spielFiguren[gedrueckteFigurID] = wertAnkunftsFeld;
                    spielFigurAuswahlZuruecksetzen();
                    renderSpielbrett();
                }
            }
            //Wenn Figur über den Wert 43 gesetzt wird (außerhalb der wählbaren Felder), andere Figur wählen
            else {
                console.log("Ungültige Figurauswahl");
                window.alert('Ungeültiger Spielzug. Bitte wähle eine andere Figur!');
                spielFigurAuswahlZuruecksetzen();
                await spielFigurAuswaehlenUndSetzen(wurfErgebnis);
            }
        }
        //Spieler hat eine falsche Figur ausgewählt
        else {
            console.log("Ungültige Figurauswahl");
            window.alert('Ungeültiger Spielzug. Bitte wähle eine andere Figur!');
            spielFigurAuswahlZuruecksetzen();
            await spielFigurAuswaehlenUndSetzen(wurfErgebnis);
        }
    }
}

function spielFigurAuswahlZuruecksetzen() {
    gedrueckteSpielerID = null;
    gedrueckteFigurID = null;
    gedruecktePosition = null;
}

//Funktion gibt erst einen Return, wenn eine Figur angeklickt wurde
async function pruefungAenderungFigurAuswahl() {
    const result = await warteAufAenderung();
    console.log("FIGUR AUSGEWÄHLT!");
    return result;
}

//Funktion nutzt Promises, um auf die Figurauswahl des Spielers zu warten
function warteAufAenderung() {
    return new Promise(resolve => {
        const intervalId = setInterval(() => {
            if (gedruecktePosition !== null) {
                clearInterval(intervalId);
                console.log("Änderung erkannt!");
                console.log(`${gedrueckteSpielerID} ${gedrueckteFigurID} ${gedruecktePosition}`);
                resolve(true);
            } else {
                console.log(`${gedrueckteSpielerID} ${gedrueckteFigurID} ${gedruecktePosition}`);
                console.log("Änderung wird geprüft!");
            }
        }, 1000);
    });
}

//Funktion wechselt den aktuellen Spieler
function wechsleSpieler() {
    aktuellerSpielerID = (aktuellerSpielerID + 1) % 4;
    wurfAnzahl = 0;
}


async function zeigeNeueSpielerFarbeAlert() {
    // Anzeige eines Alerts mit der Spielerfarbe, sobald ein neuer Spieler am Zug ist
    const neueSpielerFarbe = gibSpielerFarbe(aktuellerSpielerID);
    return new Promise(resolve => {
        setTimeout(() => {
            window.alert(`Jetzt ist Spieler ${neueSpielerFarbe} dran.`);
            resolve();
        }, 500);
    });
}

//Funktion zum Figur "schlagen", wenn das Ankunftsfeld durch eine fremde Figur besetzt ist
function figurSchlagen(feldIndex) {
    let spielerIdGeschlagen = -1;
    let spielFigurIndex = -1;
    //Nur zwischen 0 und 39, da sich sonst die Figuren in den unterschiedlichen Zielfeldern 
    //schlagen, da die Zielfelder aller Spieler die Werte 40-43 besitzen
    if (feldIndex <= 39 && feldIndex >= 0) {
        //Wenn Spieler Rot am Zug ist
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
        //Wenn Spieler Blau am Zug ist
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
        //Wenn Spieler Gelb am Zug ist
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
        //Wenn Spieler Grün am Zug ist
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
        console.log("Spielfeld besetzt");
        console.log(` SpielerIdGeschlagen =${spielerIdGeschlagen} / SpielerFigurIndex = ${spielFigurIndex}`);
        const spielerListeGeschlagen = spielerListe[spielerIdGeschlagen];
        spielerListeGeschlagen.spielFiguren[spielFigurIndex] = -1;
    }
    else {
        return;
    }

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
//Prüfung, ob sich kein Spieler auf der Laufbahn befindet und Spieler 3 mal würfeln darf
function pruefungKeinSpielerLaufbahn(spielerFiguren) {
    let anzahlFigurLaufbahn = 0;

    for (let zaehler = 0; zaehler < spielerFiguren.length; zaehler++) {
        if (spielerFiguren[zaehler] >= 0 && spielerFiguren[zaehler] <= 39) {
            anzahlFigurLaufbahn++;
        }
    }
    if(anzahlFigurLaufbahn === 0){
        return true;
    }
    return false;
}
//Ersten Heimfeld-Spieler suchen
function erstenHeimFeldSpielerSuchen(spielerListe) {
    for (let zaehler = 0; zaehler < spielerListe.length; zaehler++) {
        if (spielerListe[zaehler] === -1) {
            return zaehler;
        }
    }
}
function ankunftsSpielFeldBerechnen(wertAktuellesFeld, wurfZahl) {
    const letztesFeld = 39;
    const erstesFeld = 0;
    const zielFeld1 = 40;
    const zielFeld4 = 43;

    //Spieler Rot
    if (aktuellerSpielerID === 0) {
        return wertAktuellesFeld + wurfZahl;
    }
    // Spieler Blau
    if (aktuellerSpielerID === 1) {
        const feldVorZielfelder = 9;
        const startFeldSpieler = 10;
        let ankunftsFeldTheoretisch = wertAktuellesFeld + wurfZahl;
        let ankunftsFeldSpieler1 = null;
        //Figuren in den Zielfeldern versetzen
        if (ankunftsFeldTheoretisch <= zielFeld4 && wertAktuellesFeld >= zielFeld1) {
            ankunftsFeldSpieler1 = ankunftsFeldTheoretisch;
            return ankunftsFeldSpieler1;
        }
        if (ankunftsFeldTheoretisch > zielFeld4 && (wertAktuellesFeld >= zielFeld1 || wertAktuellesFeld === 9 || wertAktuellesFeld === 8)) {
            //Spielfigurauswahl gibt einen Fehler aus, neue Auswahl!
            return 50;
        }
        //Spieler bleibt unter Felder oder gleich Feld 39 und steht zwischen 10 und 39
        if (ankunftsFeldTheoretisch <= letztesFeld && wertAktuellesFeld >= startFeldSpieler) {
            ankunftsFeldSpieler1 = ankunftsFeldTheoretisch;
            return ankunftsFeldSpieler1;
        }
        //Spieler steht zwischen 0 und 10 und bleibt auch dazwischen
        if (ankunftsFeldTheoretisch <= feldVorZielfelder && wertAktuellesFeld >= erstesFeld) {
            ankunftsFeldSpieler1 = ankunftsFeldTheoretisch;
            return ankunftsFeldSpieler1;
        }
        //Spieler gehen ins Zielfeld
        if (ankunftsFeldTheoretisch >= startFeldSpieler && ankunftsFeldTheoretisch <= 15 && wertAktuellesFeld < startFeldSpieler && wertAktuellesFeld >= erstesFeld) {
            ankunftsFeldSpieler1 = ankunftsFeldTheoretisch + 30;
            return ankunftsFeldSpieler1;
        }
        // wenn die Felder zwischen Startfeld blau und dem Feld 39 liegen und nachher 39 überschreiten und auf Felder 0-9 gehen   
        if (ankunftsFeldTheoretisch > letztesFeld && wertAktuellesFeld >= startFeldSpieler && ankunftsFeldTheoretisch <= (letztesFeld + 6)) {
            ankunftsFeldSpieler1 = ankunftsFeldTheoretisch - 40;
            return ankunftsFeldSpieler1;
        }
    }
    //Spieler Gelb
    if (aktuellerSpielerID === 2) {
        const feldVorZielfelder = 19;
        const startFeldSpieler = 20;
        let ankunftsFeldTheoretisch = wertAktuellesFeld + wurfZahl;
        let ankunftsFeldSpieler2 = null;
        //Figuren in den Zielfeldern versetzen
        if (ankunftsFeldTheoretisch <= zielFeld4 && wertAktuellesFeld >= zielFeld1) {
            ankunftsFeldSpieler2 = ankunftsFeldTheoretisch;
            return ankunftsFeldSpieler2;
        }
        if (ankunftsFeldTheoretisch > zielFeld4 && (wertAktuellesFeld >= zielFeld1 || wertAktuellesFeld === 19 || wertAktuellesFeld === 18)) {
            //Spielfigurauswahl gibt einen Fehler aus, neue Auswahl!
            return 50;
        }
        //Spieler bleibt unter Felder oder gleich Feld 39 und steht zwischen 20 und 39
        if (ankunftsFeldTheoretisch <= letztesFeld && wertAktuellesFeld >= startFeldSpieler) {
            ankunftsFeldSpieler2 = ankunftsFeldTheoretisch;
            return ankunftsFeldSpieler2;
        }
        //Spieler steht zwischen 0 und 19 und bleibt auch dazwischen
        if (ankunftsFeldTheoretisch <= feldVorZielfelder && wertAktuellesFeld >= erstesFeld) {
            ankunftsFeldSpieler2 = ankunftsFeldTheoretisch;
            return ankunftsFeldSpieler2;
        }
        //Spieler gehen ins Zielfeld
        if (ankunftsFeldTheoretisch >= startFeldSpieler && ankunftsFeldTheoretisch <= 25 && wertAktuellesFeld < startFeldSpieler && wertAktuellesFeld >= erstesFeld) {
            ankunftsFeldSpieler2 = ankunftsFeldTheoretisch + 20;
            return ankunftsFeldSpieler2;
        }
        // wenn die Felder zwischen Startfeld gelb und dem Feld 39 liegen und nachher 39 überschreiten und auf Felder 0-19 gehen
        if (ankunftsFeldTheoretisch > letztesFeld && wertAktuellesFeld >= startFeldSpieler && ankunftsFeldTheoretisch <= (letztesFeld + 6)) {
            ankunftsFeldSpieler2 = ankunftsFeldTheoretisch - 40;
            return ankunftsFeldSpieler2;
        }
    }
    //Spieler Grün
    if (aktuellerSpielerID === 3) {
        const feldVorZielfelder = 29;
        const startFeldSpieler = 30;
        let ankunftsFeldTheoretisch = wertAktuellesFeld + wurfZahl;
        let ankunftsFeldSpieler3 = null;
        //Figuren in den Zielfeldern versetzen
        if (ankunftsFeldTheoretisch <= zielFeld4 && wertAktuellesFeld >= zielFeld1) {
            ankunftsFeldSpieler3 = ankunftsFeldTheoretisch;
            return ankunftsFeldSpieler3;
        }
        if (ankunftsFeldTheoretisch > zielFeld4 && (wertAktuellesFeld >= zielFeld1 || wertAktuellesFeld === 29 || wertAktuellesFeld === 28)) {
            //Spielfigurauswahl gibt einen Fehler aus, neue Auswahl!
            return 50;
        }
        //Spieler bleibt unter Felder oder gleich Feld 39 und steht zwischen 30 und 39
        if (ankunftsFeldTheoretisch <= letztesFeld && wertAktuellesFeld >= startFeldSpieler) {
            ankunftsFeldSpieler3 = ankunftsFeldTheoretisch;
            return ankunftsFeldSpieler3;
        }
        //Spieler steht zwischen 0 und 29 und bleibt auch dazwischen
        if (ankunftsFeldTheoretisch <= feldVorZielfelder && wertAktuellesFeld >= erstesFeld) {
            ankunftsFeldSpieler3 = ankunftsFeldTheoretisch;
            return ankunftsFeldSpieler3;
        }
        //Spieler gehen ins Zielfeld
        if (ankunftsFeldTheoretisch >= startFeldSpieler && ankunftsFeldTheoretisch <= 35 && wertAktuellesFeld < startFeldSpieler && wertAktuellesFeld >= erstesFeld) {
            ankunftsFeldSpieler3 = ankunftsFeldTheoretisch + 10;
            return ankunftsFeldSpieler3;
        }
        // wenn die Felder zwischen Startfeld Grün und dem Feld 39 liegen und nachher 39 überschreiten und auf Felder 0-29 gehen
        if (ankunftsFeldTheoretisch > letztesFeld && wertAktuellesFeld >= startFeldSpieler && ankunftsFeldTheoretisch <= (letztesFeld + 6)) {
            ankunftsFeldSpieler3 = ankunftsFeldTheoretisch - 40;
            return ankunftsFeldSpieler3;
        }
    }
}

function pruefungSpielFeldBesetzt(feldIndex) {
    return spielerListe[0].spielFiguren.includes(feldIndex) ||
        spielerListe[1].spielFiguren.includes(feldIndex) ||
        spielerListe[2].spielFiguren.includes(feldIndex) ||
        spielerListe[3].spielFiguren.includes(feldIndex);
}

function pruefungBesetztEigenerSpieler(feldIndex) {
    if (spielerListe[aktuellerSpielerID].spielFiguren.includes(feldIndex)) {
        return true;
    }
    else {
        return false;
    }
}

function minEinSpielerHeimfeld() {
    if (spielerListe[aktuellerSpielerID].spielFiguren.includes(-1)) {
        return true;
    }
    return false;
}

function indexEigeneFigurStartFeld() {
    return spielerListe[aktuellerSpielerID].spielFiguren.indexOf(aktuellerSpielerID * 10);
}
function spielBrettZurueckSetzen() {
    spielerListe[0].spielFiguren[0] = -1;
    spielerListe[0].spielFiguren[1] = -1;
    spielerListe[0].spielFiguren[2] = -1;
    spielerListe[0].spielFiguren[3] = -1;
    spielerListe[1].spielFiguren[0] = -1;
    spielerListe[1].spielFiguren[1] = -1;
    spielerListe[1].spielFiguren[2] = -1;
    spielerListe[1].spielFiguren[3] = -1;
    spielerListe[2].spielFiguren[0] = -1;
    spielerListe[2].spielFiguren[1] = -1;
    spielerListe[2].spielFiguren[2] = -1;
    spielerListe[2].spielFiguren[3] = -1;
    spielerListe[3].spielFiguren[0] = -1;
    spielerListe[3].spielFiguren[1] = -1;
    spielerListe[3].spielFiguren[2] = -1;
    spielerListe[3].spielFiguren[3] = -1;
    renderSpielbrett();
}

// Wenn Seite lädt dann Spielfeld zeichnen
window.onload = function () {
    renderSpielbrett();
    renderWuerfel();
}

