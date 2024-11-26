# CineSync

CineSync é um Web App projetado para assistir conteúdos em sincronia com amigos. 
Ele suporta reprodução de links do YouTube e streams HLS/M3U8 em tempo real. 
O sistema foi desenvolvido para criar e gerenciar salas com suporte para comunicação via WebSocket.

## Tecnologias Utilizadas

- **Frontend**: React com Next.js,typescript e tailwind
- **Backend**: Flask com suporte ao WebSocket (via Socket.IO)
- **Banco de Dados**: SQLite (para testes locais)
- **Comunicação em Tempo Real**: WebSocket com Flask-SocketIO

---

## Funcionalidades

### Backend

- **Criação e Gerenciamento de Salas**:
  - Suporte para salas públicas e privadas.
  - Cada sala suporta até 5 participantes.
- **Reprodução de Conteúdo**:
  - Controle de reprodução em tempo real com comandos como play, pause e seek.
  - Atualização de conteúdo com suporte para YouTube e HLS/M3U8.
- **Comunicação via WebSocket**:
  - Sincronização de reprodução em tempo real.

### Frontend

- **Interface do Player**:
  - Player estilizado com suporte para YouTube e links HLS/M3U8.
- **Gestão de Participantes**:
  - O criador da sala pode gerenciar usuários (adicionar/remover participantes).
- **Sincronização em Tempo Real**:
  - Atualizações automáticas do status de reprodução.

---

## Como Rodar o Projeto

### Requisitos

1. **Backend**:
   - Python 3.x
   - Dependências:
     ```
     pip install flask flask-socketio flask-cors sqlalchemy bcrypt
     ```

2. **Frontend**:
   - Node.js (16 ou superior)
   - Dependências:
     ```
     npm install
     ```

3. **Banco de Dados**:
   - SQLite já configurado para testes locais.

---

### Passos para Executar

1. Clone o repositório:
-  git clone https://github.com/seu-repositorio/cinesync.git


2. Configure o Backend:
- Crie o banco de dados:
  ```
  python setup_db.py
  ```
- Inicie o servidor:
  ```
  python app.py
  ```
---

4. Configure o Frontend:
- Entre na pasta do frontend:
  ```
  cd frontend
  ```
- Instale as dependências:
  ```
  npm install
  ```
- Inicie o servidor:
  ```
  npm run dev
  ```

---

## Próximos Passos

1. Melhorar a interface de controle do player.
2. Adicionar suporte a chat em tempo real nas salas.
3. Implementar autenticação robusta para usuários.

---