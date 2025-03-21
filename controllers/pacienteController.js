import Paciente from '../models/Paciente.js'

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;
    try {
        const pacienteAgregado = await paciente.save();
        res.json(pacienteAgregado);
    } catch (error) {
        console.log(error);
    }
}

const obtenerPacientes = async (req, res) => {

    const pacientes = await Paciente.find()
        .where('veterinario')
        .equals(req.veterinario);

    res.json(pacientes)

}

const obtenerPaciente = async (req, res) => {

    const {id} = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.json({msg: 'Paciente no encontrado'});
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'Acción no válida'});
    }

    res.json(paciente);
}

const actualizarPaciente = async (req, res) => {

    const {id} = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.json({msg: 'Paciente no encontrado'});
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'Acción no válida'});
    }

    // Actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre; 
    paciente.propietario = req.body.propietario || paciente.propietario; 
    paciente.tipo = req.body.tipo || paciente.tipo; 
    paciente.email = req.body.email || paciente.email; 
    paciente.fechaAlta = req.body.fechaAlta || paciente.fechaAlta; 
    paciente.sintomas = req.body.sintomas || paciente.sintomas; 

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
}

const eliminarPaciente = async (req, res) => {
    const {id} = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.json({msg: 'Paciente no encontrado'});
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'Acción no válida'});
    }

    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente eliminado correctamente'});
    } catch (error) {
        console.log(error);
    }
}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}