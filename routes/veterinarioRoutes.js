import express from 'express';
import { registrar, perfil, confirmarCuenta, autenticar, olvidePassword, comprobarToken, resetearPassword, actualizarPerfil, cambiarPassword } from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas publicas
router.post('/', registrar);
router.get('/confirmar/:token', confirmarCuenta);
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(resetearPassword);

// Rutas privadas
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/cambiar-password', checkAuth, cambiarPassword);

export default router;