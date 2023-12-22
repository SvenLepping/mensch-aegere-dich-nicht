const FeldGroesse = 11;

// Array der Größe 52 wird erstellt und mit null initialisiert
const laufbahn = new Array(FeldGroesse*4, null);


//Funktion um Spielfeld zu zeichnen
function render() {
    // Sucht im HTML die das Spielbrett Element anhand der ID
    const spielbrett$ = document.querySelector('#spielbrett');

    for (let zeile = 0; zeile < FeldGroesse; zeile++) {
        const zeile$ = document.createElement('div');
        zeile$.className= 'zeile';
        spielbrett$.appendChild(zeile$);

        for (let spalte = 0; spalte < FeldGroesse; spalte++) {
            const feld$ = document.createElement('div');
            feld$.className = 'feld';

            zeile$.appendChild(feld$);

            const laufbahnIndex = holeLaufbahnIndex(zeile, spalte);
            // Laufbahn wird gefärbt 
            if (laufbahnIndex != null) {
                feld$.className += ' laufbahn';
            }
        }
    }


}

// aus einer Koordinate vom Spielbrett wird der Laufbahnindex zurückgegeben
// TODO: Algorhytmus optimieren 
function holeLaufbahnIndex(zeile, spalte) {
    if (spalte === 4 && (zeile>=7 && zeile<=10)) {
        return 10 - zeile;
    }
    if (zeile === 6 && (spalte>=0 && spalte<=4)) {
        return 4 + (4-spalte);
    }
    if (spalte === 0 && zeile === 5) {
        return 12;
    }
    if (zeile === 4 && (spalte>=0 && spalte<=4)) {
        return 13 + spalte;
    }
    if (spalte === 4 && (zeile>= 0 && zeile<=4)) {
        return 18 + (3-zeile);
    }
    if (spalte === 5 && zeile === 0) {
        return 22;
    }
    if (spalte === 6 && (zeile>=0 && zeile<=3)) {
        return 23+ zeile;
    }
    if (zeile === 4 && (spalte>=6 && spalte<=10)) {
        return 27 + (spalte -6);
    }
    if (spalte === 10 && zeile === 5) {
        return 32;
    }
    if (zeile === 6 && (spalte<=10 && spalte>=6)) {
        return 33+ (10 - spalte);
    }
    if (spalte === 6 && (zeile>=7 && zeile<=10)) {
        return 38 + (zeile-7);
    }
    if (spalte === 5 && zeile === 10) {
        return 43;
    }

    return null;
}


// Wenn Seite lädtd dann Spielfeld zeichnen
window.onload = function () {
    render();

}

