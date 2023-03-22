const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { Spot, Review, ReviewImage, User, SpotImage, Booking } = require('../../db/models');


router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const userId = req.user.id;
    const image = await ReviewImage.findByPk(imageId, {
        include: [
            { model: Review }
        ]
    })
    if (!image) {
        return res.status(404).json({ message: "Review Image couldn't be found" })
    }
    const imageJson = image.toJSON();
    if (imageJson.Review.userId !== userId) {
        const err = new Error("Review must belong to the current user");
        err.status = 403;
        return next(err)
    }

    await image.destroy()

    res.status(200).json({ message: "Successfully deleted" })
})



module.exports = router;