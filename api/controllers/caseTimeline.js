const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

module.exports = app => {
  const caseMilestonesDB = app.data.caseMilestones;

  // Objeto que servirá como container para as funções que serão expostas para manipulação das rotas.
  const controller = {};

  controller.listCaseMilestones = (req, res) => res.status(200).json(caseMilestonesDB);

  controller.generateScreenshot = async (req, res) => {
    try {
      const { data, type, title, unidade, instance, descricao, tipo_ato } = req.body;
  
      if(!data || !type || !title || !unidade || !instance || !descricao || !tipo_ato) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
      }
  
      // Renderiza o HTML dinâmico com os dados do JSON.
      const templatePath = path.join(__dirname, '../views/template.ejs');
      const html = await ejs.renderFile(templatePath, {data, type, title, unidade, instance, descricao, tipo_ato});
    
      // Inicia o Puppeteer e cria uma página
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
  
      // Define o conteúdo da página com o HTML gerado
      await page.setContent(html, { waitUntil: 'networkidle0' });
  
      // Tira o screenshot e armazena como buffer
      const screenshotBuffer = await page.screenshot({ type: 'png' });
  
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
