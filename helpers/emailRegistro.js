import nodemailer from 'nodemailer';
import dotenv from "dotenv";

const emailRegistro = async (nombre, email, token) => {
    dotenv.config();
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      try {
        const emailEnviado = await transporter.sendMail({
            from: 'APV - Administrador de Pacientes de Veterinaria',
            to: email,
            subject: 'Confirma tu cuenta en APV',
            text: 'Confirma tu cuenta en APV',
            html: `
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">
                    <title>Document</title>
                </head>
                <body>
                    <div style="background-color: #F8FAFC; min-width: 100%; width: 100%; font-family: 'Atkinson Hyperlegible Next'; display: flex; justify-content: center; padding: 30px 0;">
                        <div style="background-color:#FFF; padding: 30px; text-align: center; border-radius: 30px; border: #e9e9e9 1px solid; margin: 0 auto; color: #414141; width: 300px;">
                            <p style="font-weight: 600;"> ¡Gracias por registrarte en APV! </p>
                            <p style="font-weight: 600; color: #848484;"> ¡Hola <span style="color:#414141; font-weight: 800;">${nombre}</span>, nos alegra que nos consideres como tu opción principal! </p>
                            <p> Estás a un paso de confirmar tu cuenta, solo debes hacer clic en el siguiente botón. </p>
                            <a href="${process.env.FRONTEND_URL}/confirmar/${token}" style="text-decoration: none; color: #414141; background-color: #4e7ba8; width: 80%; margin: 20px 0; padding: 12px 30px; border-radius: 10px; color: #fff; margin: auto; font-size: 14px; display: block;"> Confirmar cuenta </a>
                            <div style="border-top: 1px #e9e9e9 solid; margin-top: 20px;"></div>
                            <p style="font-size: 13px; color: #575757; font-style: italic;"> Si tu no fuiste quien creo esta cuenta, por favor, ignora este mensaje. </p>
                        </div>
                    </div>
                </body>
            `
        })
    } catch (error) {
        console.log(error);
    }
}

export default emailRegistro;