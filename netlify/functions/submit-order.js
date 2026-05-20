const { saveCommand } = require('../../lib/utils/netlify-blobs.js');

// Fonctions de formatage des emails
function formatAdminEmail(commande) {
  const subject = `Nouvelle commande LoveSurpriseExpress - ${commande.id}`;
  const html = `
    <h2>Nouvelle commande reçue</h2>
    <p><strong>Client :</strong> ${commande.clientName}</p>
    <p><strong>Téléphone :</strong> ${commande.clientPhone}</p>
    <p><strong>Email :</strong> ${commande.clientEmail || 'Non renseigné'}</p>
    <p><strong>Destinataire :</strong> ${commande.destName}</p>
    <p><strong>Adresse :</strong> ${commande.destAddress}</p>
    <p><strong>Événement :</strong> ${commande.eventType} - ${commande.eventDate} à ${commande.eventTime}</p>
    <p><strong>Lieu :</strong> ${commande.eventLocation}</p>
    <p><strong>Budget :</strong> ${commande.budget.toLocaleString()} RWF</p>
    <p><strong>Message :</strong> "${commande.message || 'Aucun'}"</p>
    <p><a href="${process.env.URL}/dashboard">Voir dans le dashboard</a></p>
  `;
  const text = `Nouvelle commande reçue\nClient: ${commande.clientName}\nDestinataire: ${commande.destName}\nDate: ${commande.eventDate}\nBudget: ${commande.budget.toLocaleString()} RWF`;
  return { subject, html, text };
}

function formatClientEmail(commande) {
  const subject = `LoveSurpriseExpress - Confirmation de votre commande (${commande.id})`;
  const html = `
    <h2>Merci pour votre commande, ${commande.clientName} !</h2>
    <p>Nous avons bien reçu votre demande et reviendrons vers vous dans les 30 minutes.</p>
    <h3>Récapitulatif :</h3>
    <ul>
      <li><strong>Événement :</strong> ${commande.eventType}</li>
      <li><strong>Date :</strong> ${commande.eventDate} à ${commande.eventTime}</li>
      <li><strong>Destinataire :</strong> ${commande.destName}</li>
      <li><strong>Adresse :</strong> ${commande.destAddress}</li>
      <li><strong>Budget :</strong> ${commande.budget.toLocaleString()} RWF</li>
    </ul>
    <p>À très vite,<br/>L'équipe LoveExpress</p>
  `;
  const text = `Merci pour votre commande, ${commande.clientName} ! Nous vous contacterons sous 30 minutes. Récapitulatif : ${commande.eventType} - ${commande.eventDate}.`;
  return { subject, html, text };
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const commande = JSON.parse(event.body);
    console.log('📝 Commande reçue:', { clientName: commande.clientName, budget: commande.budget });

    // Sauvegarde dans Netlify Blobs
    const savedCommande = await saveCommand(commande);
    console.log('✅ Commande sauvegardée:', savedCommande.id);

    // Envoi des emails
    if (process.env.ADMIN_EMAIL) {
      await fetch(`${process.env.URL}/.netlify/functions/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: process.env.ADMIN_EMAIL, ...formatAdminEmail(savedCommande) }),
      });
      console.log('📧 Email admin envoyé');
    }

    if (savedCommande.clientEmail) {
      await fetch(`${process.env.URL}/.netlify/functions/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: savedCommande.clientEmail, ...formatClientEmail(savedCommande) }),
      });
      console.log('📧 Email client envoyé');
    }

    // Google Sheets (optionnel)
    try {
      const { addToGoogleSheets } = require('../../lib/googleSheets.js');
      await addToGoogleSheets(commande);
    } catch (e) {
      console.log('⚠️ Google Sheets non configuré');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, commandeId: savedCommande.id }),
    };
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};