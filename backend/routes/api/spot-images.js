const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Review, ReviewImage, User, SpotImage, Booking } = require('../../db/models');


router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const {imageId} = req.params;
    const userId = req.user.id;
    const image = await SpotImage.findByPk(imageId, {
        include: [
            {model: Spot}
        ]
    })
    if (!image) {
        return res.status(404).json({ message: "Spot Image couldn't be found"})
    }
    const imageJson = image.toJSON();
    if (imageJson.Spot.ownerId !== userId) {
        const err = new Error("Spot must belong to the current user")
        return next(err)
    }

    await image.destroy()

    res.status(200).json({message: "Successfully deleted"})
})



module.exports = router;