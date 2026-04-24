// lib/googleSheets.js
const { google } = require('googleapis');

// Configuration Google Sheets
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SHEET_NAME = 'Commandes LoveExpress';

// Authentification avec compte de service
let auth = null;

function getAuth() {
  if (auth) return auth;
  
  try {
    auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      credentials: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY ? {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : null,
      } : null,
    });
  } catch (error) {
    console.error('Erreur création auth Google:', error.message);
    auth = null;
  }
  
  return auth;
}

/**
 * Initialise la feuille Google Sheets si elle n'existe pas
 */
async function initSheet() {
  if (!SPREADSHEET_ID) {
    console.log('⚠️ GOOGLE_SHEETS_ID non configuré');
    return false;
  }

  const authClient = getAuth();
  if (!authClient) {
    console.log('⚠️ Authentification Google non configurée');
    return false;
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    
    // Vérifier si la feuille existe
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetExists = response.data.sheets.some(
      (sheet) => sheet.properties.title === SHEET_NAME
    );

    if (!sheetExists) {
      // Créer la feuille
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: SHEET_NAME,
                  gridProperties: { frozenRowCount: 1 },
                },
              },
            },
          ],
        },
      });

      // Ajouter les en-têtes
      const headers = [
        'ID Commande',
        'Date',
        'Client Nom',
        'Client Téléphone',
        'Client Email',
        'Destinataire Nom',
        'Destinataire Téléphone',
        'Destinataire Adresse',
        'Type Événement',
        'Date Événement',
        'Heure Événement',
        'Lieu',
        'Services/Packs',
        'Paniers Cadeaux',
        'Message',
        'Budget Total',
        'Statut',
        'Instructions spéciales',
        'URL Site'
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:S1`,
        valueInputOption: 'RAW',
        requestBody: { values: [headers] },
      });

      // Trouver l'ID de la feuille pour le formatage
      const updatedSheet = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });
      
      const newSheet = updatedSheet.data.sheets.find(s => s.properties.title === SHEET_NAME);
      const sheetId = newSheet ? newSheet.properties.sheetId : null;

      if (sheetId) {
        // Formater les en-têtes (gras)
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: sheetId,
                    startRowIndex: 0,
                    endRowIndex: 1,
                  },
                  cell: {
                    userEnteredFormat: {
                      textFormat: { bold: true },
                      backgroundColor: { red: 0.9, green: 0.3, blue: 0.4 },
                    },
                  },
                  fields: 'userEnteredFormat(textFormat,backgroundColor)',
                },
              },
            ],
          },
        });
      }
    }

    return true;
  } catch (error) {
    console.error('Erreur initialisation Google Sheets:', error.message);
    return false;
  }
}

/**
 * Formate les services/packs sélectionnés
 */
function formatServices(commande) {
  const services = [];
  
  // Packs Party Decoration
  if (commande.selectedPacks && commande.selectedPacks.length > 0) {
    const packNames = {
      1: 'Pack Premier Frisson (60k)',
      2: 'Pack Love XL (100k)',
      3: 'Pack ROYAL SURPRISE (200k)'
    };
    commande.selectedPacks.forEach(function(packId) {
      if (packNames[packId]) services.push(packNames[packId]);
    });
  }
  
  // Surprise Planner
  if (commande.selectedServices && commande.selectedServices.includes(2)) {
    services.push('Surprise Planner (200k)');
  }
  
  // Custom Website
  if (commande.selectedServices && commande.selectedServices.includes(3)) {
    services.push('Custom Website (~35k)');
  }
  
  // Flower Bouquet
  if (commande.selectedServices && commande.selectedServices.includes(4)) {
    services.push('Flower Bouquet (15k)');
  }
  
  return services.join(', ') || 'Aucun';
}

/**
 * Formate les paniers cadeaux sélectionnés
 */
function formatBaskets(commande) {
  if (!commande.selectedBaskets || commande.selectedBaskets.length === 0) {
    return 'Aucun';
  }
  
  const basketNames = {
    1: 'Birthday',
    2: 'Romantic',
    3: 'New Baby',
    4: 'Gourmet',
    5: 'Wellness'
  };
  
  var basketList = [];
  for (var i = 0; i < commande.selectedBaskets.length; i++) {
    var b = commande.selectedBaskets[i];
    basketList.push(basketNames[b.id] + ' (' + (b.version === 'standard' ? 'Standard' : 'Premium') + ')');
  }
  
  return basketList.join(', ');
}

/**
 * Ajoute une commande à Google Sheets
 */
async function addToGoogleSheets(commande) {
  const isInitialized = await initSheet();
  if (!isInitialized) {
    console.log('⚠️ Google Sheets non initialisé');
    return false;
  }

  const authClient = getAuth();
  if (!authClient) {
    console.log('⚠️ Authentification Google non configurée');
    return false;
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    
    // Préparer les données
    const row = [
      commande.id || 'CMD_' + Date.now(),
      new Date().toLocaleString('fr-FR'),
      commande.clientName || '',
      commande.clientPhone || '',
      commande.clientEmail || '',
      commande.destName || '',
      commande.destPhone || '',
      commande.destAddress || '',
      commande.eventType || '',
      commande.eventDate || '',
      commande.eventTime || '',
      commande.eventLocation || '',
      formatServices(commande),
      formatBaskets(commande),
      commande.message || '',
      commande.budget || commande.totalPrice || 0,
      commande.status || 'pending',
      commande.specialInstructions || '',
      process.env.NEXT_PUBLIC_SITE_URL || 'https://loveexpress.netlify.app'
    ];

    // Ajouter la ligne
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME + '!A:S',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });

    console.log('✅ Commande sauvegardée dans Google Sheets');
    return true;
  } catch (error) {
    console.error('❌ Erreur ajout Google Sheets:', error.message);
    return false;
  }
}

/**
 * Récupère toutes les commandes depuis Google Sheets (backup)
 */
async function getCommandsFromSheets() {
  if (!SPREADSHEET_ID) {
    console.log('⚠️ GOOGLE_SHEETS_ID non configuré');
    return [];
  }

  const authClient = getAuth();
  if (!authClient) {
    console.log('⚠️ Authentification Google non configurée');
    return [];
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    await initSheet();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME + '!A:S',
    });

    const rows = response.data.values || [];
    if (rows.length <= 1) return [];

    // Convertir les lignes en objets
    const headers = rows[0];
    const commands = [];
    
    for (var i = 1; i < rows.length; i++) {
      const row = rows[i];
      const command = {};
      
      for (var j = 0; j < headers.length; j++) {
        const header = headers[j];
        const value = row[j] || '';
        
        switch(header) {
          case 'ID Commande': command.id = value; break;
          case 'Date': command.createdAt = value; break;
          case 'Client Nom': command.clientName = value; break;
          case 'Client Téléphone': command.clientPhone = value; break;
          case 'Client Email': command.clientEmail = value; break;
          case 'Destinataire Nom': command.destName = value; break;
          case 'Destinataire Adresse': command.destAddress = value; break;
          case 'Type Événement': command.eventType = value; break;
          case 'Date Événement': command.eventDate = value; break;
          case 'Budget Total': command.budget = parseInt(value) || 0; break;
          case 'Statut': command.status = value; break;
        }
      }
      commands.push(command);
    }

    return commands;
  } catch (error) {
    console.error('Erreur lecture Google Sheets:', error);
    return [];
  }
}

module.exports = {
  addToGoogleSheets,
  getCommandsFromSheets,
  initSheet,
};