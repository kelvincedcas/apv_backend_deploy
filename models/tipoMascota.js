import mongoose from "mongoose"

const tipoMascotaSchema = mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        trim: true
    }
})
