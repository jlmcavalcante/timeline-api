# Timeline API

## Sobre

Esta API gera fluxogramas dinâmicos (.png) a partir de dados processuais fornecidos em formato JSON. A aplicação transforma a linha do tempo de um processo judicial em uma imagem estruturada, facilitando a visualização dos marcos processuais.

## Tecnologias Utilizadas
- Node.js
- Puppeteer (Geração de imagem via renderização HTML)
- EJS (Template engine para HTML dinâmico)
- GoJS (Diagramming framework for interactive data visualizations)
- Docker (Containerização)

## Funcionameno
- O usuário envia um JSON contendo o número do processo e seus marcos.
- A API processa os dados, gera um fluxograma visual e retorna uma imagem PNG.
- O fluxo de execução é armazenado em cache para evitar processamento desnecessário.
- A cache é apagada a cada 1 hora.

# Endpoints da API
> [POST] /api/v1/timeline/screenshot
- Descrição: Gera um fluxograma em PNG a partir de um JSON representando os marcos processuais.

> [DELETE] /api/v1/timeline/clear-cache
- Descrição: Apaga todas as imagens armazenadas na cache da API.
