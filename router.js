// Em router.js
const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

router.get('/', (req, res) => {
    res.render('index'); // Renderiza views/index.ejs
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const calcularPontuacao = (respostas) => {
    const pontuacao = {
        "q1": { "raramente": 1, "1x": 2, "2-3x": 3, "mais-3x": 3 },
        "q2": { "irregular": 1, "tento": 2, "fixos": 3 },
        "q3": { "doces": 1, "pratico": 2, "equilibrado": 3 },
        "q4": { "raramente": 1, "as-vezes": 2, "sempre": 3 },
        "q5": { "inchado": 1, "normal": 2, "leve": 3 },
    };

    let total = 0;
    const respostasComPontos = {};

    for (const [pergunta, resposta] of Object.entries(respostas)) {
        const pontos = pontuacao[pergunta][resposta] || 0;
        total += pontos;
        respostasComPontos[pergunta] = { resposta, pontos };
    }

    return { total, respostasComPontos };
};

router.post("/submit", async (req, res) => {
    const { nome, email, q1, q2, q3, q4, q5 } = req.body;

    if (!nome || !email || !q1 || !q2 || !q3 || !q4 || !q5) {
        return res.status(400).json({ error: "Por favor, preencha todos os campos." });
    }

    const respostas = { q1, q2, q3, q4, q5 };
    const { total, respostasComPontos } = calcularPontuacao(respostas);

    const respostasTexto = {
        q1: {
            "raramente": "Raramente",
            "1x": "1 vez ao dia",
            "2-3x": "2 a 3 vezes ao dia",
            "mais-3x": "Mais de 3 vezes ao dia",
        },
        q2: {
            "irregular": "Como em horários irregulares e muitas vezes pulo refeições",
            "tento": "Tento seguir horários, mas nem sempre consigo",
            "fixos": "Tenho horários fixos e planejo minhas refeições",
        },
        q3: {
            "doces": "Doces, salgadinhos ou fast food",
            "pratico": "Algo prático, como um pão ou biscoito",
            "equilibrado": "Uma fruta, castanhas ou um lanche mais equilibrado",
        },
        q4: {
            "raramente": "Raramente bebo água, esqueço fácil",
            "as-vezes": "Bebo água às vezes, mas poderia melhorar",
            "sempre": "Sempre me hidrato bem e levo uma garrafinha comigo",
        },
        q5: {
            "inchado": "Inchado, pesado ou com desconforto",
            "normal": "Normal, mas às vezes sinto fadiga",
            "leve": "Leve e com energia para continuar o dia",
        },
    };

    const emailBody = `
    <div>
        <h2>Resultado do Formulário de Hábitos Alimentares</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Pontuação Total:</strong> ${total} pontos (máximo: 15)</p>
        <h3>Suas Respostas</h3>
        <ul>
            <li><strong>1. Frutas e Vegetais:</strong> ${respostasTexto.q1[q1]} (${respostasComPontos.q1.pontos} pontos)</li>
            <li><strong>2. Rotina Alimentar:</strong> ${respostasTexto.q2[q2]} (${respostasComPontos.q2.pontos} pontos)</li>
            <li><strong>3. Opção ao Sentir Fome:</strong> ${respostasTexto.q3[q3]} (${respostasComPontos.q3.pontos} pontos)</li>
            <li><strong>4. Hidratação:</strong> ${respostasTexto.q4[q4]} (${respostasComPontos.q4.pontos} pontos)</li>
            <li><strong>5. Sensação Após Comer:</strong> ${respostasTexto.q5[q5]} (${respostasComPontos.q5.pontos} pontos)</li>
        </ul>
        <p>Feito com carinho para você!</p>
    </div>
`;


    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "alicealmeida132804@gmail.com", // Envia para o e-mail do usuário
        subject: "Seu Resultado do Formulário de Hábitos Alimentares",
        html: emailBody,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("E-mail enviado com sucesso para:", email);
        res.render("success.ejs")
    
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        res.status(500).json({ error: "Erro ao enviar as respostas." });
    }
});

module.exports = router;