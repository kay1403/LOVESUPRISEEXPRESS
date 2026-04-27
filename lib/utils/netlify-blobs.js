export async function savePhoto(file, category) {
  try {
    const store = await getStore('photos');
    const id = `${category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Vérifier le type de file
    let base64Data;
    if (Buffer.isBuffer(file)) {
      base64Data = file.toString('base64');
    } else if (typeof file === 'string') {
      base64Data = file;
    } else if (file && file.data) {
      base64Data = file.data;
    } else {
      console.error('Format de fichier non supporté:', typeof file);
      return { id, url: null };
    }
    
    if (!base64Data || base64Data.length === 0) {
      console.error('Données base64 vides');
      return { id, url: null };
    }
    
    await store.set(id, { data: base64Data, category, createdAt: new Date().toISOString() });
    console.log('✅ Photo sauvegardée dans store photos:', id);
    return { id, url: `/api/get-photo?id=${id}` };
  } catch (error) {
    console.error('❌ Erreur savePhoto:', error.message);
    return { id: null, url: null };
  }
}