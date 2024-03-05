// Configuration de QuaggaJS
Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#scanner-container"),
        constraints: {
            width: 300,
            height: 200,
            facingMode: "environment" // Utiliser la caméra arrière du périphérique
        }
    },
    decoder: {
        readers: ["qrcode"]
    }
}, function(err) {
    if (err) {
        console.error("Erreur lors de l'initialisation de Quagga:", err);
        return;
    }
    console.log("Quagga initialisé avec succès");
    Quagga.start();
});

// Écoute des événements de décodage des QRCode
Quagga.onDetected(function(result) {
    var code = result.codeResult.code;
    document.getElementById("result").textContent = "QRCode détecté : " + code;
    // Ici, vous pouvez envoyer le code au serveur pour enregistrer l'heure de fin de la tournée
});
