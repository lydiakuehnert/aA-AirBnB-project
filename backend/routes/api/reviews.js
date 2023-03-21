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


router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const {url} = req.body;
    const review = await Review.findByPk(reviewId, {
        include: [
            {model: ReviewImage}
        ]
    })
    if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" })
    }
    const reviewJson = review.toJSON();
    if (reviewJson.userId !== userId) {
        const err = new Error("Review must belong to the current user");
        err.status = 404
        return next(err)
    }
    
    if (reviewJson.ReviewImages.length >= 10) {
        const err = new Error("Maximum number of images for this resource was reached")
        err.status = 403
        return next(err)
    }

    const newImg = await ReviewImage.create({
        reviewId,
        url
    })

    res.status(200).json(newImg)
})






module.exports = router;