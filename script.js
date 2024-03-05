function getTournee() {
    var tournee = document.getElementById("tournee").value;
    if (tournee !== "") {
        // Simulation de la récupération de la tournée depuis l'endpoint
        var result = "La tournée sélectionnée est : " + tournee;
        document.getElementById("result").innerHTML = result;
    } else {
        document.getElementById("result").innerHTML = "";
    }
}

function redirectToDeuxiemeEcran() {
    // Redirection vers le deuxième écran (page deuxieme_ecran.php par exemple)
    window.location.href = "deuxieme_ecran.php";
}

function retour() {
    // Redirection vers la page précédente (index.php)
    window.history.back();
}
