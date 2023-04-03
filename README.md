# Função Lambda utilizando o Serveless Framework e o Rekognition da AWS para análise de imagem

Este repositório contém uma função Lambda desenvolvida utilizando o Serveless Framework e a API de Rekognition da AWS para análise de conteúdo de imagem.

## Descrição da Função

A função Lambda é acionada através de um parâmetro `imageUrl`, que recebe o link de uma imagem para ser analisada. Através da API do Rekognition, a imagem é analisada e são extraídas informações como:

- Detecção de objetos
- Reconhecimento de rostos
- Detecção de textos

Essas informações são então retornadas na resposta da função.

## Como usar

Para utilizar a função Lambda, é necessário ter uma conta ativa na AWS e configurar as permissões necessárias para o acesso ao Rekognition.

Após clonar o repositório, execute o seguinte comando na raiz do projeto para instalar as dependências:

npm install


Antes de fazer o deploy da função Lambda, é necessário configurar as variáveis de ambiente no arquivo `serverless.yml` com as informações de acesso ao Rekognition.

Para fazer o deploy da função Lambda, execute o seguinte comando na raiz do projeto:

sls deploy


Após o deploy da função, a mesma estará pronta para ser acionada através do parâmetro `imageUrl`.

## Contribuições

Contribuições são sempre bem-vindas! Se você quiser contribuir com melhorias no código, correções de bugs, ou adicionar novas funcionalidades, fique à vontade para criar um pull request.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para obter mais informações.
