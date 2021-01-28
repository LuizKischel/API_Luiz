Dependêcias: 
É necessário ter Node.js instalado.

Instalação:

1. Ir até o diretório da API
    cd API_LUIZ

2. Rodar o npm install
    npm install

3. Iniciar um servidor MYSQL, existem várias formas de se abrir um servidor MYSQL, duas delas são: fazer download do XAMPP nesse site: https://www.apachefriends.org/pt_br/download.html, e abrir o servidor. Outra opção é seguir as instruções desse site: https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_MySQL.htm

4. Criar o banco de dados usando o sql do arquivo "school_database.sql" dentro do repositório

5. Fazer as devidas configurações de conexão com o banco e da aplicação em configs/app.json

6. Rodar npm start para startar a API.
    npm start


Info:
Com a API é possível criar, deletar, atualizar e consultar: alunos, provas, gabaritos e respostas de alunos à gabaritos.
Além disso é possível verificar as notas de cada aluno em cada prova, a nota final de cada aluno e os alunos aprovados.


Documentação (Rotas):

PROVAS:

POST "/exam"
* Para criar uma prova, já com seu gabarito, basta fazer um POST na rota: "/exam", com um JSON com o seguinte formato no corpo da requisição:
{
    "name": "Nome da prova",
    "awnsers": [
        {"awnser": "A", "weight": 1},
        {"awnser": "B", "weight": 2},
        {"awnser": "C", "weight": 3},
        {"awnser": "D", "weight": 2},
        {"awnser": "E", "weight": 1}
    ]
}

PUT "/exam/:id/awnsers"
* Para substituir as respostas de uma prova, basta fazer um PUT na rota: "/exam/:id/awnsers", onde :id é o id da prova, com um JSON com o seguinte formato no corpo da requisição:
{
    "awnsers": [
        {"awnser": "E", "weight": 7},
        {"awnser": "D", "weight": 5},
        {"awnser": "C", "weight": 3},
        {"awnser": "B", "weight": 2},
        {"awnser": "A", "weight": 1}
    ]
}

GET "/exam/:id/awnsers"
* Para consultar as respostas de uma prova específica, basta fazer um GET na rota: "/exam/:id/awnsers", onde :id é o id da prova

GET "/exam/:id"
* Para consultar os dados de uma prova específica basta fazer um GET na rota: "/exam/:id", onde :id é o id da prova

DELETE "/exam/:id"
* Para deletar uma prova específica basta fazer um DELETE na rota: "/exam/:id" onde :id é o id da prova

GET "/exam"
* Para consultar todas as provas basta fazer um GET na rota: "/exam"

ALUNOS:

POST "/students"
* Para criar um aluno é necessário fazer POST na rota: "/students" com um JSON com o seguinte formato no corpo da requisição:
{
    "name": "Nome do aluno"
}
A resposta será o aluno criado no banco de dados, com seu ID

POST "/student/:id/awnsers"
* Para criar ou substituir as respostas de um aluno para uma prova específica, basta fazer um POST na rota: "/student/:id/awnsers" com um JSON com o seguinte formato no corpo da requisição:
{
    "exam": "nome ou ID do exame (Para id use o tipo INTEIRO, para nome use o tipo STRING)",
    "awnsers": ["A", "B", "C", "D", "E"]
}

GET "/student/approveds"
* Para consultar os alunos aprovados bastar fazer um GET na rota: "/student/approveds".

GET "/student/:id/final_grade"
* Para consultar a nota final de um aluno basta fazer um GET na rota: "/student/:id/final_grade", onde :id é o id do aluno

GET "/students"
* Para consultar todos os alunos basta fazer um GET na rota "/students".

GET "/students/:id"
* Para consultar um aluno específico basta fazer um GET na rota "/students/:id", onde :id é o id do aluno que se deseja consultar.

PUT "/students/:id"
* Para alterar os dados de um aluno basta fazer um PUT na rota: "/students/:id", onde :id é o id do aluno que se deseja alterar, o corpo da requisição deve ter o mesmo formato da criação do aluno.

DELETE "/students/:id"
* Para deletar um aluno basta fazer um DELETE na rota: "/students/:id", onde :id é o id do aluno que se deseja deletar

GET "/student/:id/grades"
* Para consultar as notas de todas as provas de um aluno específico basta fazer um GET na rota: "/student/:id/grades", onde :id é o id do aluno





