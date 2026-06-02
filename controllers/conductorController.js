const Driver = require('../models/driverModel')
const Unit = require('../models/unitModel')

const GetMyDriverProfile = async (req, res) => {
    try {
        const driver = await Driver.getByIdUser(req.user.id_user)
        if (!driver) {
            return res.status(404).json({
                message: 'No tienes un perfil de conductor asociado'
            })
        }
        res.status(200).json(driver)
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener perfil de conductor'
        })
    }
}

const GetMyUnits = async (req, res) => {
    try {
        const driver = await Driver.getByIdUser(req.user.id_user)
        if (!driver) {
            return res.status(404).json({
                message: 'No tienes un perfil de conductor asociado'
            })
        }
        const units = await Unit.getByDriverId(driver.id_driver)
        res.status(200).json(units)
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener tus unidades'
        })
    }
}

const RenewLicense = async (req, res) => {
    try {
        const driver = await Driver.getByIdUser(req.user.id_user)
        if (!driver) {
            return res.status(404).json({ message: 'Perfil de conductor no encontrado' })
        }

        const { license_expiration_date, license_photo } = req.body
        if (!license_expiration_date) {
            return res.status(400).json({ message: 'La fecha de vencimiento es obligatoria' })
        }
        if (new Date(license_expiration_date) <= new Date()) {
            return res.status(400).json({ message: 'La fecha de vencimiento debe ser posterior a hoy' })
        }
        if (driver.license_expiration_date &&
            new Date(license_expiration_date) <= new Date(driver.license_expiration_date)) {
            return res.status(400).json({
                message: 'La nueva fecha de vencimiento debe ser posterior a la fecha actual de la licencia'
            })
        }
        if (!license_photo) {
            return res.status(400).json({ message: 'La foto de la licencia es obligatoria' })
        }
        const updated = await Driver.update(req.user.id_user, { license_expiration_date, license_photo })
        if (!updated) {
            return res.status(404).json({ message: 'Perfil de conductor no encontrado' })
        }
        res.status(200).json({
            message: 'Licencia renovada exitosamente',
            data: updated
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al renovar la licencia'
        })
    }
}

const RenewMedicalCertificate = async (req, res) => {
    try {
        const driver = await Driver.getByIdUser(req.user.id_user)
        if (!driver) {
            return res.status(404).json({ message: 'Perfil de conductor no encontrado' })
        }

        const { medic_issuance_date, medic_photo } = req.body
        if (!medic_issuance_date) {
            return res.status(400).json({ message: 'La fecha de expedición es obligatoria' })
        }
        if (!medic_photo) {
            return res.status(400).json({ message: 'La foto del certificado médico es obligatoria' })
        }

        const issuanceDate = new Date(medic_issuance_date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (issuanceDate < today) {
            return res.status(400).json({
                message: 'La fecha de expedición debe ser igual o posterior al día de hoy'
            })
        }

        const expirationDate = new Date(issuanceDate)
        expirationDate.setFullYear(expirationDate.getFullYear() + 5)

        const medic_expiration_date = expirationDate.toISOString().split('T')[0]

        console.log('--- RENEW MEDICAL CERT ---');
        console.log('medic_issuance_date:', medic_issuance_date);
        console.log('medic_photo length:', medic_photo ? medic_photo.length : 0);
        console.log('medic_photo preview:', medic_photo ? medic_photo.substring(0, 80) : 'N/A');

        const updated = await Driver.update(req.user.id_user, {
            medic_issuance_date,
            medic_expiration_date,
            medic_photo
        })

        if (!updated) {
            return res.status(404).json({ message: 'Perfil de conductor no encontrado' })
        }

        res.status(200).json({
            message: 'Certificado médico renovado exitosamente',
            data: {
                medic_issuance_date,
                medic_expiration_date
            }
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al renovar el certificado médico'
        })
    }
}

module.exports = { GetMyDriverProfile, GetMyUnits, RenewLicense, RenewMedicalCertificate }
