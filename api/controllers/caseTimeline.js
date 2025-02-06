const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const formatCaseMilestones = require('../utils/formatMilestones');

module.exports = app => {
  const caseMilestonesDB = app.data.caseMilestones;

  // Objeto que servirá como container para as funções que serão expostas para manipulação das rotas.
  const controller = {};

  controller.listCaseMilestones = (req, res) => res.status(200).json(caseMilestonesDB);

  controller.generateScreenshot = async (req, res) => {
    try {
      const { process_number, marcos } = req.body;
  
      if (!process_number || !marcos) {
        return res.status(400).json({ error: 'O número do processo e os marcos são obrigatórios!' });
      }

      const formatedMilestones = formatCaseMilestones(marcos);
  
      // Renderiza o HTML dinâmico com os dados do JSON.
      const templatePath = path.join(__dirname, '../views/template.ejs');
      const html = await ejs.renderFile(templatePath, { process_number, milestones: formatedMilestones });
    
      // Inicia o Puppeteer e cria uma página
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
  
      // Define o conteúdo da página com o HTML gerado
      await page.setContent(html, { waitUntil: 'networkidle0' });
  
      // Tira o screenshot e armazena como buffer
      const screenshotBuffer = await page.screenshot({ fullPage: true, type: 'png' });
  
      await browser.close();

      fs.writeFileSync("screenshot-test.png", screenshotBuffer);
      console.log("Imagem salva como screenshot-test.png");
  
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="screenshot.png"',
        "Content-Length": screenshotBuffer.length,
      });
      res.end(screenshotBuffer);
      
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      res.status(500).json({ error: 'Erro interno ao gerar imagem.' });
    }
  };

  return controller;
}
