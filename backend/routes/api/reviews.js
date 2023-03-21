const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Review, ReviewImage, User, SpotImage } = require('../../db/models');


router.get('/current', requireAuth, async (req, res) => {

    const reviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            { model: User,
            attributes: ['id', 'firstName', 'lastName'] },
            { model: Spot,
            include: { model: SpotImage },
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'] },
            { model: ReviewImage,
            attributes: ['id', 'url'] }
        ]
    });

    const reviewList = []
    reviews.forEach(review => {
        reviewList.push(review.toJSON())
    })
    reviewList.forEach(review => {
        review.Spot.SpotImages.forEach(img => {
            if (img.preview === true) review.Spot.previewImage = img.url
            else review.Spot.previewImage = 'no preview image found'
        })
        if (!review.Spot.SpotImages.length) review.Spot.previewImage = 'no preview image found'
        delete review.Spot.SpotImages
    })

    res.status(200).json({ Reviews: reviewList })
})






module.exports = router;