if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js')
            .then(function(registration) {
                console.log('Service worker enregistré avec succès : ', registration.scope);
            })
            .catch(function(err) {
                console.error("Erreur lors de l'enregistrement du service worker : ", err);
            });
    });
}

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
            option.value = tournee.tournee_id;
            option.textContent = tournee.tournee;
            option.style.backgroundColor = tournee.couleur;
            if (tournee.couleur === '#000000') {
                option.style.color = '#ffffff';
            }
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
    const adressePromises = [];
    for (const depotId of depotIds) {
        try {
            const depotResponse = await fetch(`https://ytpaqpikqarnveticqhl.supabase.co/rest/v1/depots?select=*&depot_id=eq.${depotId}`, {
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
                const depotId = depotData[0].depot_id;
                adressePromises.push(fetchAdresse(adresseId));
                depots.push({ depotName, adresseId, depotId });
            } else {
                throw new Error('Depot not found');
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
    const adresseResponses = await Promise.all(adressePromises);
    for (const adresseResponse of adresseResponses) {
        if (!adresseResponse.ok) {
            console.error('Network response was not ok');
            continue;
        }
        const adresseData = await adresseResponse.json();
        if (adresseData.length > 0) {
            const adresse = adresseData[0].adresse;
            const codePostal = adresseData[0].codepostal;
            const ville = adresseData[0].ville;
            depots.find(depot => depot.adresseId === adresseData[0].adresse_id).adresse = adresse;
            depots.find(depot => depot.adresseId === adresseData[0].adresse_id).codePostal = codePostal;
            depots.find(depot => depot.adresseId === adresseData[0].adresse_id).ville = ville;
        } else {
            console.error('Adresse not found');
        }
    }
    return depots;
}

async function fetchAdresse(adresseId) {
    return fetch(`https://ytpaqpikqarnveticqhl.supabase.co/rest/v1/adresses?adresse_id=eq.${adresseId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apikey
        }
    });
}

async function getInfoTournee(tourneeId, semaine) {
    try {
        const requestBody = {
            tournee_id: tourneeId,
            semaine: semaine
        };

        const response = await fetch('https://ytpaqpikqarnveticqhl.supabase.co/functions/v1/tournees', {
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
    window.location.href = "deuxieme_ecran.html";
}

function retour() {
    window.history.back();
}

async function getDepotCoordonnees(depotId) {
    try {
        // Récupérer l'ID de l'adresse associée au dépôt
        const depotResponse = await fetch(`https://ytpaqpikqarnveticqhl.supabase.co/rest/v1/depots?select=adresse_id&depot_id=eq.${depotId}`, {
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
            const adresseId = depotData[0].adresse_id;

            // Récupérer les coordonnées de l'adresse à partir de son ID
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
                const coordinates = adresseData[0].localisation.coordinates;
                const latitude = coordinates[1];
                const longitude = coordinates[0];
                return { latitude, longitude };
            } else {
                throw new Error('Adresse not found');
            }
        } else {
            throw new Error('Depot not found');
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error; // Propagate the error
    }
}
