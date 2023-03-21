const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is not valid'),
    check('name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];


router.get('/', async (req, res) => {

    const spots = await Spot.findAll({
        include: [
            { model: SpotImage },
            { model : Review }
        ]
    });

    const spotsList = []
    spots.forEach(spot => {
        spotsList.push(spot.toJSON())
    })
    spotsList.forEach(spot => {
        spot.SpotImages.forEach(img => {
            if (img.preview === true) spot.previewImage = img.url
            else spot.previewImage = 'no preview image found'
        })
        if (!spot.SpotImages.length) spot.previewImage = 'no preview image found'
        delete spot.SpotImages
        
        let count = 0;
        let sum = 0;
        spot.Reviews.forEach(review => {
            count++;
            sum += review.stars;
        })
        let avg = sum / count;
        spot.avgRating = avg;
        if (!spot.Reviews.length) spot.avgRating = 'no average rating'
        delete spot.Reviews
    })
    
    res.status(200).json({Spots: spotsList})
})


router.get('/current', requireAuth, async (req, res) => {

    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
        include: [
            { model: SpotImage },
            { model: Review }
        ]
    });

    const spotsList = []
    spots.forEach(spot => {
        spotsList.push(spot.toJSON())
    })
    spotsList.forEach(spot => {
        spot.SpotImages.forEach(img => {
            if (img.preview === true) spot.previewImage = img.url
            else spot.previewImage = 'no preview image found'
        })
        if (!spot.SpotImages.length) spot.previewImage = 'no preview image found'
        delete spot.SpotImages

        let count = 0;
        let sum = 0;
        spot.Reviews.forEach(review => {
            count++;
            sum += review.stars;
        })
        let avg = sum / count;
        spot.avgRating = avg;
        if (!spot.Reviews.length) spot.avgRating = 'no average rating'
        delete spot.Reviews
    })

    res.status(200).json({ Spots: spotsList })
})


router.post('/', requireAuth, validateSpot, async (req, res) => {
    const {address, city, state, country, lat, lng, name, description, price} = req.body

    const spot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    res.status(201).json(spot)
})


router.get('/:spotId', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Review
            }
        ]
    })
    if (!spot) {
        return res.status(404).json({message: "Spot couldn't be found"})
    }
    const spotJson = spot.toJSON()
    spotJson.numReviews = spotJson.Reviews.length;
    let sum = 0;
    let count = 0;
    spotJson.Reviews.forEach(review => {
        count++;
        sum += review.stars;
    })
    let avg = sum / count;
    spotJson.avgStarRating = avg;
    delete spotJson.Reviews;

    res.status(200).json(spotJson)
})


router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const {spotId} = req.params;
    const userId = req.user.id;
    const {url, preview} = req.body;

    const spot = await Spot.findByPk(spotId)
    if (!spot) {
        res.status(404).json({message: "Spot couldn't be found"})
    }
    const spotJson = spot.toJSON();
    if (spotJson.ownerId !== userId) {
        const err = new Error("Spot must belong to the current user");
        return next(err)
    }
    const newImg = await SpotImage.create({
        spotId,
        url,
        preview,
    })
    const img = newImg.toJSON()
    delete img.spotId;
    delete img.updatedAt;
    delete img.createdAt;

    res.status(200).json(img)
})


router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const { spotId } = req.params;
    const userId = req.user.id;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const spot = await Spot.findByPk(spotId)
    if (!spot) {
        res.status(404).json({ message: "Spot couldn't be found" })
    }
    const spotJson = spot.toJSON();
    if (spotJson.ownerId !== userId) {
        const err = new Error("Spot must belong to the current user");
        return next(err)
    }

    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    await spot.save()

    res.status(200).json(spot)
})


router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const userId = req.user.id;
    const spot = await Spot.findByPk(spotId)
    if (!spot) {
        res.status(404).json({ message: "Spot couldn't be found" })
    }
    const spotJson = spot.toJSON();
    if (spotJson.ownerId !== userId) {
        const err = new Error("Spot must belong to the current user");
        return next(err)
    }
    await spot.destroy()
    res.status(200).json({ message: "Successfully deleted" })
})


router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;
    const {review, stars} = req.body;
    const spot = await Spot.findByPk(spotId)
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    }
    const reviewExist = await Review.findAll({where: {userId: userId, spotId: spotId}})
    if (reviewExist.length) {
        return res.status(403).json({ message: "User already has a review for this spot" })
    }
    const newReview = await Review.create({
        userId,
        spotId,
        review,
        stars
    })

    res.status(201).json(newReview)
})


router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId)
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    }
    
    const reviews = await Review.findAll({ 
        where: { spotId: spotId},
        include: [
            { model: User,
            attributes: ['id', 'firstName', 'lastName'] },
            { model: ReviewImage,
                attributes: ['id', 'url'] }
        ]
    })

    res.status(200).json({Reviews: reviews})
})


router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const {spotId} = req.params;
    const {startDate, endDate} = req.body;
    const spot = await Spot.findByPk(spotId, {
        include: [
            {model: Booking}
        ]
    })
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    }

    const spotJson = spot.toJSON();
    if (spotJson.ownerId === userId) {
        const err = new Error("Spot must not belong to the current user");
        return next(err)
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const startTime = start.getTime()
    const endTime = end.getTime()

    if (endTime <= startTime) {
        const err = new Error("Bad Request")
        err.errors = { endDate: "endDate cannot be on or before startDate" }
        err.status = 400;
        return next(err)
    }

    spotJson.Bookings.forEach(booking => {
        const startB = booking.startDate.getTime()
        const endB = booking.endDate.getTime();
        if ((startTime === startB && endTime === endB) ||
            (startTime >= startB && startTime <= endB) ||
            (endTime >= startB && endTime <= endB)) {
            const err = new Error("Sorry, this spot is already booked for the specified dates");
            err.errors = { startDate: "Start date conflicts with an existing booking", endDate: "End date conflicts with an existing booking" };
            err.status = 403;
            return next(err)
        }
    })

    const booking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate
    })

    res.status(200).json(booking)
 })


router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId, {
        attributes: ['ownerId'],
        include: [
            {model: Booking,
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]}
        ]
    })
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    }

    const spotJson = spot.toJSON();
    const spotJson2 = spot.toJSON();
    if (spotJson.ownerId === userId) {
        delete spotJson2.ownerId
        return res.status(200).json(spotJson2)
    }

    spotJson.Bookings.forEach(booking => {
        delete booking.User;
        delete booking.id;
        delete booking.userId;
        delete booking.createdAt;
        delete booking.updatedAt;
    })
    delete spotJson.ownerId

    res.status(200).json(spotJson)
})


module.exports = router;