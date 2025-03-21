import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarToken from '../helpers/generarToken.js';
import emailRegistro from '../helpers/emailRegistro.js';
import emailPassword from '../helpers/emailRecuperarPassword.js';
import { Error } from 'mongoose';

const registrar = async (req, res) => {

    const {email} = req.body;

    // Prevenir usuarios duplicados

    const existeUsuario = await Veterinario.findOne({email});

    if(existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        // Guardar nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        await emailRegistro(veterinario.nombres, veterinario.email, veterinario.token);

        res.json({
            msg: 'Usuario registrado correctamente',
            veterinarioGuardado
        });
    } catch (error) {
        console.log(error);
    }

};

const perfil = (req, res) => {
    res.json(req.veterinario);
};

const confirmarCuenta = async (req, res) => {
    const {token} = req.params;
    const usuarioToken = await Veterinario.findOne({token});

    if(!usuarioToken){
        const error = new Error('Token no válido');
        return res.status(404).json({msg: error.message});
    }
    try {
        usuarioToken.token = null;
        usuarioToken.confirmado = true;
        await usuarioToken.save();
        res.json({msg: 'Usuario confirmado correctamente'});
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async (req, res) => {

    // Revisar si el email existe en la BD

    const {email, password} = req.body;

    const usuario = await Veterinario.findOne({email});

    if(!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({msg: error.message});
    }

    // Revisar si su cuenta ha sido confirmada
    if(!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }

    // Revisar si el password enviado es correcto
    if(await usuario.comprobarPassword(password)) {

        res.json({
            _id: usuario._id,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            email: usuario.email,
            web: usuario.web,
            telefono: usuario.telefono,
            createdAt: usuario.createdAt,
            token: generarJWT(usuario.id)
        });
    } else {
        const error = new Error('El password es incorrecto');
        return res.status(400).json({msg: error.message});
    }

    // console.log(req.body);
    // res.json({msg: 'Autenticando'});
};

const olvidePassword = async (req, res) => {
    const {email} = req.body;

    const existeUsuario = await Veterinario.findOne({email});

    if(!existeUsuario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message});
    }
    if(!existeUsuario.confirmado) {
        const error = new Error('El usuario aún no ha confirmado su cuenta');
        return res.status(400).json({msg: error.message});
    }
    try {
        existeUsuario.token = generarToken();
        await existeUsuario.save();
        emailPassword(existeUsuario.nombres, existeUsuario.email, existeUsuario.token);
        res.json({msg: 'Se han enviado las instrucciones al correo registrado'});
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params;
    const tokenValido = await Veterinario.findOne({token});
    if(!tokenValido) {
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }
    return res.json({tokenValido})
}

const resetearPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario) {
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }
    try {
        veterinario.password = password;
        veterinario.token = null;
        await veterinario.save();
        res.json({msg: 'Password actualizado correctamente'})
    } catch (error) {
        return res.status(404).json({msg: error.message});
    }
}

const actualizarPerfil = async (req, res) => {
    const {id} = req.params;
    const datos = req.body;
    
    const veterinario = await Veterinario.findById(id);
    
    if(!veterinario) {
        const error = new Error('Veterinario no encontrado');
        return res.status(404).json({msg: error.message});
    }

    const {email} = datos;

    if(veterinario.email !== email) {
        const existeEmail = Veterinario.findOne(email);

        if(existeEmail) {
            const error = new Error('El nuevo email ya está en uso')
            return res.status(404).json({msg: error.message});
        }
    }

    try {
        veterinario.nombres = datos.nombres || veterinario.nombres;
        veterinario.apellidos = datos.apellidos || veterinario.apellidos;
        veterinario.email = datos.email || veterinario.email;
        veterinario.web = datos.web;
        veterinario.telefono = datos.telefono;

        const veterinarioActualizado = await veterinario.save();
        return res.json(veterinarioActualizado)
    } catch (error) {
        return res.status(404).json({msg: error.message});
    }
}

const cambiarPassword = async (req, res) => {
    const {_id} = req.veterinario;

    const {pwd_actual, pwd_nuevo} = req.body;

    // Comprobar si el veterinario existe

    const veterinario = await Veterinario.findById(_id);

    if(!veterinario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message});
    }
    // Comprobar si el password actual es correcto
    if(await veterinario.comprobarPassword(pwd_actual)) {
        // Actualizar el nuevo password  
        veterinario.password = pwd_nuevo;
        try {
            await veterinario.save();
            return res.json({msg: 'Contraseña actualizada correctamente'})
        } catch (error) {
            console.log(error)
        }
    }else {
        const error = new Error('La contraseña actual es incorrecta');
        return res.status(403).json({msg: error.message});
    }
}

export {
    registrar,
    perfil,
    confirmarCuenta,
    autenticar,
    olvidePassword,
    comprobarToken,
    resetearPassword,
    actualizarPerfil,
    cambiarPassword
}