apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0cGFxcGlrcWFybnZldGljcWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwNDQ3MzUsImV4cCI6MjAxOTYyMDczNX0.4glNGKdXcHAXUyWuO5fpvcmg4oRyH9TvtTZ7OYMkcfc';    

function getTournees() {
    fetch('https://ytpaqpikqarnveticqhl.supabase.co/rest/v1/tournees?select=*', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apikey
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Traitement des données récupérées
        console.log(data);
        // Mettre à jour la liste déroulante avec les données récupérées
        const selectTournee = document.getElementById('tournee');
        // Effacer les options actuelles de la liste déroulante
        selectTournee.innerHTML = '<option value="">-- Sélectionnez une tournée --</option>';
        // Ajouter les nouvelles options basées sur les données récupérées
        data.forEach(tournee => {
            const option = document.createElement('option');
            option.value = tournee.tournee_id; // Assurez-vous d'adapter cette ligne selon la structure de vos données
            option.textContent = tournee.tournee; // Assurez-vous d'adapter cette ligne selon la structure de vos données
            selectTournee.appendChild(option);
        });
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function getDepotByTournee(tourneeId) {
    return fetch(`https://ytpaqpikqarnveticqhl.supabase.co/rest/v1/distributions?select=depot_id&tournee_id=eq.${tourneeId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apikey
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Traitement des données récupérées
        const depotIds = data.map(distribution => distribution.depot_id);
        console.log(depotIds);
        return depotIds;
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        return []; // Retourne un tableau vide en cas d'erreur
    });
}

async function getDepot(depotIds) {
    const depots = [];
    for (const depotId of depotIds) {
        try {
            const depotResponse = await fetch(`https://ytpaqpikqarnveticqhl.supabase.co/rest/v1/depots?select=depot,adresse_id&depot_id=eq.${depotId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apikey
                }
            });
            if (!depotResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const depotData = await depotResponse.json();
            if (depotData.length > 0) {
                const depotName = depotData[0].depot;
                const adresseId = depotData[0].adresse_id;
                const adresseResponse = await fetch(`https://ytpaqpikqarnveticqhl.supabase.co/rest/v1/adresses?adresse_id=eq.${adresseId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': apikey
                    }
                });
                if (!adresseResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const adresseData = await adresseResponse.json();
                if (adresseData.length > 0) {
                    const adresse = adresseData[0].adresse;
                    const codePostal = adresseData[0].codepostal;
                    const ville = adresseData[0].ville;
                    depots.push({ depotName, adresse, codePostal, ville });
                } else {
                    throw new Error('Adresse not found');
                }
            } else {
                throw new Error('Depot not found');
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
    return depots;
}


async function getNombrePanierLivrer(semaine) {
    const weekNumber = getWeekNumber(new Date())[0];
    
    const requestBody = {
        "_semaine": semaine || weekNumber
    };

    try {
        const response = await fetch('https://ytpaqpikqarnveticqhl.supabase.co/rest/v1/rpc/preparer2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': apikey
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null;
    }
}

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return [weekNo];
}

function redirectToDeuxiemeEcran() {
    // Redirection vers le deuxième écran (page deuxieme_ecran.php par exemple)
    window.location.href = "deuxieme_ecran.html";
}

function retour() {
    // Redirection vers la page précédente (index.php)
    window.history.back();
}