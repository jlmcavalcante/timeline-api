const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const formatCaseMilestones = require('../utils/formatMilestones');
const formatDateToDDMMYYYY = require('../utils/formatDate');

module.exports = app => {
  const controller = {};

  controller.generateScreenshot = async (req, res) => {
    try {
      const { process_number, marcos } = req.body;

      if (!process_number || !marcos) {
        return res.status(400).json({ error: 'O número do processo e os marcos são obrigatórios!' });
      }

      // Diretório de cache
      const cacheDir = path.join(__dirname, '../../cache');

      // Garante que a pasta de cache existe
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
        console.log(`Diretório de cache criado em: ${cacheDir}`);
      }

      // Gera um hash único baseado no JSON recebido
      const hash = crypto.createHash('md5').update(JSON.stringify(req.body)).digest('hex');
      const cachePath = path.join(cacheDir, `screenshot-${hash}.png`);

      // Verifica se a imagem já foi gerada e está armazenada
      if (fs.existsSync(cachePath)) {
        console.log(`Imagem encontrada na cache: ${cachePath}`);
        return res.sendFile(cachePath);
      }

      console.log('Gerando nova imagem...');

      const milestonesNewDate = marcos.map(marco => ({
        ...marco,
        data: formatDateToDDMMYYYY(marco.data)
      }));

      const formatedMilestones = formatCaseMilestones(milestonesNewDate);

      // Renderiza o HTML dinâmico
      const templatePath = path.join(__dirname, '../views/template.ejs');
      const html = await ejs.renderFile(templatePath, { process_number, milestones: formatedMilestones });

      // Gera a imagem com Puppeteer
      const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Captura a imagem
      const screenshotBuffer = await page.screenshot({ fullPage: true, type: 'png' });

      await browser.close();

      console.log(`Salvando imagem no cache local: ${cachePath}`);
      // Salva a imagem no filesystem
      fs.writeFileSync(cachePath, screenshotBuffer);

      // Retorna a imagem gerada
      return res.sendFile(cachePath);

    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      res.status(500).json({ error: 'Erro interno ao gerar imagem.' });
    }
  };

  controller.clearCache = async (req, res) => {
    try {
      // Agora usando um caminho absoluto dentro do container Docker
      const cacheDir = path.resolve('/usr/src/app/cache');

      console.log(`Limpando cache no diretório: ${cacheDir}`);

      if (!fs.existsSync(cacheDir)) {
        return res.status(200).json({ message: "A cache já está vazia." });
      }

      // Apaga apenas os arquivos dentro da pasta cache, sem deletar a própria pasta
      fs.readdir(cacheDir, (err, files) => {
        if (err) {
          console.error('Erro ao acessar a pasta de cache:', err);
          return res.status(500).json({ error: "Erro ao acessar a cache." });
        }

        if (files.length === 0) {
          return res.status(200).json({ message: "A cache já está vazia." });
        }

        files.forEach(file => {
          const filePath = path.join(cacheDir, file);
          fs.unlink(filePath, err => {
            if (err) {
              console.error(`Erro ao remover ${file}:`, err);
            }
          });
        });

        console.log("✅ Cache removida do volume do Docker.");
        return res.status(200).json({ message: "Cache apagada com sucesso." });
      });

    } catch (error) {
      console.error('Erro ao apagar cache:', error);
      res.status(500).json({ error: "Erro interno ao apagar a cache." });
    }
  };

  return controller;
};
