const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Review, ReviewImage, User, SpotImage } = require('../../db/models');


const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

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
        err.status = 403;
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

    const imgJson = newImg.toJSON();
    delete imgJson.reviewId;
    delete imgJson.updatedAt;
    delete imgJson.createdAt;

    res.status(200).json(imgJson)
})


router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const { review, stars } = req.body;
    const reviewEdit = await Review.findByPk(reviewId)
    if (!reviewEdit) {
        return res.status(404).json({ message: "Review couldn't be found" })
    }
    const reviewJson = reviewEdit.toJSON();
    if (reviewJson.userId !== userId) {
        const err = new Error("Review must belong to the current user");
        err.status = 403;
        return next(err)
    }

    reviewEdit.review = review;
    reviewEdit.stars = stars;

    await reviewEdit.save()

    res.status(200).json(reviewEdit)
})


router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const review = await Review.findByPk(reviewId)
    if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" })
    }
    const reviewJson = review.toJSON();
    if (reviewJson.userId !== userId) {
        const err = new Error("Review must belong to the current user");
        err.status = 403;
        return next(err)
    }
    await review.destroy()

    res.status(200).json({ message: "Successfully deleted" })
})



module.exports = router;