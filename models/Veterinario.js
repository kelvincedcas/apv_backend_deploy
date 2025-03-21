import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import generarToken from '../helpers/generarToken.js';

const veterinarioSchema = mongoose.Schema({
    nombres: {
        type: String,
        required: true,
        trim: true
    },
    apellidos: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarToken()
    },
    confirmado: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true
});

veterinarioSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

veterinarioSchema.methods.comprobarPassword = async function (passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
}

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);

export default Veterinario;