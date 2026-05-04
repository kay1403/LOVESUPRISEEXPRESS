// lib/googleSheets.js - Version avec tes 19 colonnes
const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

// Fonction pour formater les services en texte
function formatServicesList(commande) {
  const services = [];
  if (commande.selectedServices?.includes(2)) services.push('Surprise Planner');
  if (commande.selectedServices?.includes(3)) services.push('Custom Website');
  if (commande.selectedServices?.includes(4)) services.push('Flower Bouquet');
  return services.join(', ') || 'Aucun';
}

// Fonction pour formater les packs
function formatPacksList(commande) {
  const packNames = {
    1: 'Pack Premier Frisson',
    2: 'Pack Love XL',
    3: 'Pack ROYAL SURPRISE'
  };
  const packs = (commande.selectedPacks || []).map(id => packNames[id]).filter(Boolean);
  return packs.join(', ') || 'Aucun';
}

// Fonction pour formater les paniers cadeaux
function formatBasketsList(commande) {
  const basketNames = {
    1: 'Birthday',
    2: 'Romantic',
    3: 'New Baby',
    4: 'Gourmet',
    5: 'Wellness'
  };
  const baskets = (commande.selectedBaskets || []).map(b => {
    const name = basketNames[b.id] || b.id;
    return `${name} (${b.version === 'standard' ? 'Standard' : 'Premium'})`;
  });
  return baskets.join(', ') || 'Aucun';
}

async function addToGoogleSheets(commande) {
  if (!WEBHOOK_URL) {
    console.log('⚠️ GOOGLE_SHEETS_WEBHOOK_URL non configuré');
    return false;
  }

  try {
    const payload = {
      id: commande.id || 'CMD_' + Date.now(),
      timestamp: new Date().toLocaleString('fr-FR'),
      clientName: commande.clientName || '',
      clientPhone: commande.clientPhone || '',
      clientEmail: commande.clientEmail || '',
      destName: commande.destName || '',
      destAddress: commande.destAddress || '',
      eventType: commande.eventType || '',
      eventDate: commande.eventDate || '',
      eventTime: commande.eventTime || '',
      eventLocation: commande.eventLocation || '',
      services: formatServicesList(commande),
      packs: formatPacksList(commande),
      baskets: formatBasketsList(commande),
      message: commande.message || '',
      budget: commande.budget || commande.totalPrice || 0,
      status: commande.status || 'pending',
      instructions: commande.specialInstructions || '',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://lovesupriseexpress.netlify.app'
    };

    console.log('📤 Envoi vers Google Sheets:', payload);

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Commande sauvegardée dans Google Sheets, ligne:', result.row);
      return true;
    } else {
      console.log('⚠️ Erreur webhook:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur envoi webhook:', error.message);
    return false;
  }
}

module.exports = { addToGoogleSheets };