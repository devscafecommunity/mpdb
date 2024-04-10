# Use a imagem oficial do Node.js como base
FROM node:14

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /prod

# Copie o arquivo package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do aplicativo
RUN npm install

# Copie o restante do código fonte para o diretório de trabalho
COPY . .

# Exponha a porta 3000 para acessar a aplicação
EXPOSE 3000

CMD ["npm", "run", "start"]