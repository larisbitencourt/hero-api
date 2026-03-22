## Hero API

API desenvolvida com NestJS + TypeScript como projeto local de estudo, com foco em processamento de dados em grande volume e arquitetura orientada a eventos.

## Sobre o projeto

Essa API gerencia heróis através de um CRUD simples, mas o principal objetivo foi simular um cenário mais próximo do mundo real, lidando com:

Processamento de arquivos grandes (CSV)
Mensageria (SNS + SQS)
Concorrência e idempotência (Redis)

## Funcionalidades

📦 CRUD de Heróis

Criar, listar, atualizar e remover heróis
Validação de dados com DTOs

📸 Upload de Imagem

Upload de imagem por herói
Armazenamento local
Nome único para evitar conflito de arquivos

📊 Importação via CSV

Upload de arquivos CSV com grande volume (até 100k linhas)
Processamento em stream
Inserção em batch para melhor performance
Continuidade mesmo com erros no arquivo
Registro de erros em banco para análise posterior

📡 Webhook + Mensageria

Endpoint de webhook que recebe eventos externos
Publicação em tópico SNS
Consumo via fila SQS
Processamento assíncrono dos dados

🔒 Controle de Concorrência (Redis)

Implementação de lock distribuído
Evita que o mesmo evento (eventId) seja processado mais de uma vez
Previne criação duplicada de dados

🧾 Logs de Erro

Armazena erros da importação de CSV
Inclui:
linha
coluna
mensagem
dados da linha

🛠️ Tecnologias
Node.js
NestJS
TypeScript
PostgreSQL
TypeORM
Redis
AWS SNS + SQS
Multer

## Principais pontos do projeto

Uso de stream para leitura de arquivos grandes
Inserção em batch para reduzir carga no banco
Uso de mensageria para desacoplar processamento
Lock com Redis para evitar duplicidade
Registro de erros sem interromper o fluxo

## Objetivo

Projeto desenvolvido para estudo e prática de conceitos de backend voltados para:

escalabilidade
processamento de dados
sistemas assíncronos
consistência de dados