const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.resolve('/usr/src/app/cache'); 

// Garante que a pasta de cache existe ao iniciar
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  console.log(`Diretório de cache criado: ${CACHE_DIR}`);
}

function cleanOldCache() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      console.log("Diretório de cache não encontrado. Nada para limpar.");
      return;
    }

    console.log("Executando limpeza automática de cache...");

    // Lê os arquivos dentro da pasta
    const files = fs.readdirSync(CACHE_DIR);
    
    if (files.length === 0) {
      console.log("✅ Nenhum arquivo na cache para limpar.");
      return;
    }

    // Remove apenas os arquivos dentro da pasta, sem excluir a pasta em si
    files.forEach(file => {
      const filePath = path.join(CACHE_DIR, file);
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ Arquivo removido: ${filePath}`);
      } catch (err) {
        console.error(`❌ Erro ao remover ${filePath}:`, err);
      }
    });

    console.log("✅ Limpeza automática de cache concluída.");
    
  } catch (err) {
    console.error("❌ Erro ao limpar a cache automaticamente:", err);
  }
}

setInterval(cleanOldCache, 60 * 60 * 1000);
cleanOldCache();

module.exports = { cleanOldCache };
