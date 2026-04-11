import { google } from 'googleapis';

export async function addToGoogleSheets(data: any) {
  // Mode développement : simulation sans credentials
  if (process.env.NODE_ENV === 'development' && !process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
    console.log('🔵 [DEV] Simulation Google Sheets:', {
      client: data.clientName,
      event: data.eventType,
      budget: data.budget
    });
    return true;
  }

  try {
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;

    if (!clientEmail || !privateKey || !sheetId) {
      console.error('❌ Credentials Google Sheets manquantes');
      return false;
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: privateKey,
        client_email: clientEmail,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const values = [[
      new Date().toISOString(),
      data.clientName || '',
      data.clientPhone || '',
      data.clientEmail || '',
      data.destName || '',
      data.destPhone || '',
      data.destAddress || '',
      data.destAge || '',
      data.eventType || '',
      data.eventDate || '',
      data.eventTime || '',
      data.eventLocation || '',
      data.budget || '',
      (data.services || []).join(', '),
      data.message || '',
      data.specialInstructions || '',
      data.isDiscreet ? 'Oui' : 'Non',
      data.needsPersonPresent ? 'Oui' : 'Non',
      data.additionalNotes || '',
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Feuille 1!A:S',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    console.log('✅ Sauvegardé dans Google Sheets');
    return true;
  } catch (error) {
    console.error('❌ Erreur Google Sheets:', error);
    return false;
  }
}
