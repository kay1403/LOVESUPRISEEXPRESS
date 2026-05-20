const { saveCommand } = require('../../lib/utils/netlify-blobs.js');

// Mappings pour les IDs -> noms
const serviceNames = {
  2: 'Surprise Planner',
  3: 'Custom Website',
  4: 'Flower Bouquet'
};

const packNames = {
  1: 'Pack Premier Frisson',
  2: 'Pack Love XL',
  3: 'Pack ROYAL SURPRISE'
};

const basketNames = {
  1: 'Birthday',
  2: 'Romantic',
  3: 'New Baby',
  4: 'Gourmet',
  5: 'Wellness'
};

// Fonctions de formatage des emails (version améliorée)
function formatAdminEmail(commande) {
  const subject = `Nouvelle commande LoveSurpriseExpress - ${commande.id}`;

  // Construction des lignes de services/packs/baskets
  let servicesHtml = '';
  commande.selectedServices.forEach(id => {
    if (serviceNames[id]) servicesHtml += `<tr><td>${serviceNames[id]}</td><td style="text-align:right">-</td></tr>`;
  });
  commande.selectedPacks.forEach(id => {
    if (packNames[id]) servicesHtml += `<tr><td>${packNames[id]}</td><td style="text-align:right">${commande.budget ? 'inclus' : '-'}</td></tr>`;
  });
  commande.selectedBaskets.forEach(b => {
    const name = basketNames[b.id] || `Panier ${b.id}`;
    const version = b.version === 'standard' ? 'Standard' : 'Premium';
    servicesHtml += `<tr><td>${name} (${version})</td><td style="text-align:right">inclus</td></tr>`;
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #ff4d6d; padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
        <h1 style="margin:0">LoveSurpriseExpress</h1>
        <p style="margin:5px 0 0">Nouvelle commande reçue</p>
      </div>
      <div style="border:1px solid #ddd; border-top:none; padding:20px; border-radius:0 0 8px 8px;">
        <h2 style="color:#ff4d6d; margin-top:0">Commande #${commande.id}</h2>
        <p><strong>Date :</strong> ${new Date(commande.createdAt).toLocaleString('fr-FR')}</p>

        <h3 style="color:#555; border-bottom:1px solid #eee; padding-bottom:5px;">Client</h3>
        <p><strong>Nom :</strong> ${commande.clientName}<br>
        <strong>Téléphone :</strong> ${commande.clientPhone}<br>
        <strong>Email :</strong> ${commande.clientEmail || 'Non renseigné'}</p>

        <h3 style="color:#555; border-bottom:1px solid #eee; padding-bottom:5px;">Destinataire</h3>
        <p><strong>Nom :</strong> ${commande.destName}<br>
        <strong>Téléphone :</strong> ${commande.destPhone || 'Non renseigné'}<br>
        <strong>Adresse :</strong> ${commande.destAddress}<br>
        <strong>Âge :</strong> ${commande.destAge || 'Non renseigné'}</p>

        <h3 style="color:#555; border-bottom:1px solid #eee; padding-bottom:5px;">Événement</h3>
        <p><strong>Type :</strong> ${commande.eventType}<br>
        <strong>Date :</strong> ${commande.eventDate} à ${commande.eventTime}<br>
        <strong>Lieu :</strong> ${commande.eventLocation}</p>

        <h3 style="color:#555; border-bottom:1px solid #eee; padding-bottom:5px;">Services & Produits</h3>
        <table style="width:100%; border-collapse:collapse;">
          <thead><tr style="background:#f9f9f9;"><th style="text-align:left; padding:8px;">Produit</th><th style="text-align:right; padding:8px;">Montant</th></tr></thead>
          <tbody>${servicesHtml || '<tr><td colspan="2">Aucun service sélectionné</td></tr>'}</tbody>
        </table>

        <h3 style="color:#555; border-bottom:1px solid #eee; padding-bottom:5px;">Budget & Livraison</h3>
        <p><strong>Budget total :</strong> ${commande.budget.toLocaleString()} RWF<br>
        <strong>Mode de livraison :</strong> ${commande.deliveryMethod === 'delivery' ? 'Livraison à domicile (+5 000 RWF)' : 'Retrait au bureau'}<br>
        <strong>Message sur la carte :</strong> "${commande.message || 'Aucun'}"<br>
        <strong>Instructions spéciales :</strong> ${commande.specialInstructions || 'Aucune'}<br>
        <strong>Notes supplémentaires :</strong> ${commande.additionalNotes || 'Aucune'}</p>

        <h3 style="color:#555; border-bottom:1px solid #eee; padding-bottom:5px;">Options</h3>
        <ul>
          <li>Surprise discrète : ${commande.isDiscreet ? 'Oui' : 'Non'}</li>
          <li>Destinataire présent : ${commande.needsPersonPresent ? 'Oui' : 'Non'}</li>
        </ul>

        <p style="margin-top:30px; text-align:center;">
          <a href="${process.env.URL}/dashboard" style="background:#ff4d6d; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Voir dans le dashboard</a>
        </p>
      </div>
    </body>
    </html>
  `;
  const text = `Nouvelle commande reçue\nClient: ${commande.clientName}\nTél: ${commande.clientPhone}\nDestinataire: ${commande.destName}\nDate: ${commande.eventDate}\nBudget: ${commande.budget.toLocaleString()} RWF`;
  return { subject, html, text };
}

function formatClientEmail(commande) {
  const subject = `LoveSurpriseExpress - Confirmation de votre commande (${commande.id})`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #ff4d6d; padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
        <h1 style="margin:0">LoveSurpriseExpress</h1>
        <p style="margin:5px 0 0">Merci pour votre confiance</p>
      </div>
      <div style="border:1px solid #ddd; border-top:none; padding:20px; border-radius:0 0 8px 8px;">
        <h2 style="color:#ff4d6d; margin-top:0">Bonjour ${commande.clientName},</h2>
        <p>Nous avons bien reçu votre demande et reviendrons vers vous dans les <strong>30 minutes</strong> sur WhatsApp.</p>

        <h3 style="color:#555; border-bottom:1px solid #eee; padding-bottom:5px;">Récapitulatif de votre commande</h3>
        <p><strong>Événement :</strong> ${commande.eventType}<br>
        <strong>Date :</strong> ${commande.eventDate} à ${commande.eventTime}<br>
        <strong>Destinataire :</strong> ${commande.destName}<br>
        <strong>Adresse :</strong> ${commande.destAddress}<br>
        <strong>Budget total :</strong> ${commande.budget.toLocaleString()} RWF</p>

        <p style="margin-top:30px;">À très vite,<br>L'équipe LoveSurpriseExpress</p>
        <hr>
        <p style="font-size:12px; color:#999;">Ceci est un message automatique, merci de ne pas y répondre.</p>
      </div>
    </body>
    </html>
  `;
  const text = `Merci ${commande.clientName} ! Votre commande a été reçue. Nous vous contacterons sous 30 minutes. Récapitulatif : ${commande.eventType} - ${commande.eventDate}.`;
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

    const savedCommande = await saveCommand(commande);
    console.log('✅ Commande sauvegardée:', savedCommande.id);

    // Email admin – fallback si variable d'environnement absente
    const adminEmail = process.env.ADMIN_EMAIL || 'lovesupriseexpress@gmail.com';
    await fetch(`${process.env.URL}/.netlify/functions/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: adminEmail, ...formatAdminEmail(savedCommande) }),
    });
    console.log('📧 Email admin envoyé à', adminEmail);

    // Email client
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