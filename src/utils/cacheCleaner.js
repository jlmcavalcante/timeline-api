const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.resolve('/usr/src/app/cache'); // Caminho dentro do Docker

// Cria o diretório se ele não existir
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  console.log(`📁 Diretório de cache criado: ${CACHE_DIR}`);
}

function cleanOldCache() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      console.log("📁 Diretório de cache não encontrado. Nada para limpar.");
      return;
    }

    const files = fs.readdirSync(CACHE_DIR);
    const now = Date.now();
    const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora

    if (files.length === 0) {
      console.log("✅ Nenhum arquivo na cache para limpar.");
      return;
    }

    files.forEach(file => {
      const filePath = path.join(CACHE_DIR, file);

      try {
        const stats = fs.statSync(filePath);

        // Se o arquivo for mais antigo que 1 hora, removê-lo
        if (now - stats.mtimeMs > EXPIRATION_TIME) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Arquivo removido: ${filePath}`);
        }
      } catch (statErr) {
        console.error(`❌ Erro ao obter informações do arquivo ${file}:`, statErr);
      }
    });

  } catch (err) {
    console.error("❌ Erro ao limpar a cache:", err);
  }
}

// Executa a limpeza a cada 1 hora
setInterval(cleanOldCache, 60 * 60 * 1000);
cleanOldCache();

module.exports = { cleanOldCache };
