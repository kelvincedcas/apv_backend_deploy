import mongoose from 'mongoose';

const pacienteSchema = mongoose.Schema({
        nombre: {
            type: String,
            required: true,
            trim: true,
        },
        tipo: {
            type: String,
            required: true,
            trim: true
        },
        propietario: {
            type: String, 
            required: true,
        },
        email: {
            type: String, 
            required: true,
            trim: true,
        },
        telefono: {
            type: String,
            default: null,
            trim: true,
        },
        fechaAlta: {
            type: Date, 
            required: true,
            trim: true,
        },
        sintomas: {
            type: String,
            required: true,
        },
        veterinario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Veterinario',
        }
    },
    {
        timestamps: true
    }
);

const Paciente = mongoose.model('Paciente', pacienteSchema);

export default Paciente;