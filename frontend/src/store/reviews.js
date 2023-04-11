import { csrfFetch } from "./csrf";

const GET_REVIEWS = "reviews/getReviews";
const GET_REVIEW = "reviews/getReview";
const CREATE_REVIEW = "reviews/createReview";
const GET_USER_REVIEWS = "reviews/getUserReviews";
const DELETE_REVIEW = "reviews/deleteReview";
const EDIT_REVIEW = "reviews/editReview";


const getUserReviewsAction = (reviews) => {
    return {
        type: GET_USER_REVIEWS,
        reviews
    }
}

const getReviewAction = (review) => {
    return {
        type: GET_REVIEW,
        review
    }
}

const getReviewsAction = (reviews) => {
    return {
        type: GET_REVIEWS,
        reviews
    }
};

const createReviewAction = (review) => {
    return {
        type: CREATE_REVIEW,
        review
    }
}

const deleteReviewAction = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        reviewId
    }
}

const editReviewAction = (review) => {
    return {
        type: EDIT_REVIEW,
        review
    }
}

// export const getUserSpotsThunk = () => async dispatch => {
//     const res = await csrfFetch('/api/spots/current')

//     if (res.ok) {
//         const spots = await res.json();
//         dispatch(getUserSpotsAction(spots.Spots))
//     }
// }

// export const getSpotThunk = (spotId) => async dispatch => {
//     const res = await csrfFetch(`/api/spots/${spotId}`);

//     if (res.ok) {
//         const spot = await res.json()
//         dispatch(getSpotAction(spot))
//     }
// }

export const getReviewsThunk = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (res.ok) {
        const reviews = await res.json();
        dispatch(getReviewsAction(reviews.Reviews))
    }
};

// export const createSpotThunk = (payload) => async dispatch => {
//     console.log("hit thunk ============", payload)
//     const { newSpot, SpotImages } = payload;
//     const res = await csrfFetch('/api/spots', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newSpot)
//     })

//     if (res.ok) {
//         const spot = await res.json();
//         for (let i = 0; i < SpotImages.length; i++) {
//             let img = SpotImages[i]
//             await csrfFetch(`/api/spots/${spot.id}/images`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(img)
//             })
//         }
//         dispatch(createSpotAction(spot))
//         return spot;
//     } else {
//         const data = await res.json()
//         console.log("Data is here =======", data)
//         return data;
//     }
// }

// export const deleteSpotThunk = (spotId) => async dispatch => {
//     const res = await csrfFetch(`/api/spots/${spotId}`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' }
//     })
//     if (res.ok) {
//         dispatch(deleteSpotAction(spotId))
//     }
// }

// export const editSpotThunk = (payload) => async dispatch => {
//     const { newSpot, SpotImages } = payload;
//     const res = await csrfFetch(`/api/spots/${newSpot.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newSpot)
//     })

//     if (res.ok) {
//         const spot = await res.json();
//         for (let i = 0; i < SpotImages.length; i++) {
//             let img = SpotImages[i]
//             await csrfFetch(`/api/spots/${spot.id}/images`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(img)
//             })
//         }
//         dispatch(editSpotAction(spot))
//         return spot;
//     } else {
//         const data = await res.json()
//         return data;
//     }
// }


const initialState = { spot: {}, user: {} };

const reviewReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_REVIEWS: {
            newState = { ...state, spot: {}, user: {} }
            action.reviews.forEach(review => newState.spot[review.id] = review)
            return newState
        }
        // case GET_SPOT: {
        //     newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: {} }
        //     newState.singleSpot = action.spot;
        //     return newState;
        // }
        // case CREATE_SPOT: {
        //     newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: {} }
        //     // newState.allSpots[action.spot.id] = action.spot;
        //     newState.singleSpot = action.spot;
        //     return newState
        // }
        // case GET_USER_SPOTS: {
        //     newState = { ...state, allSpots: {}, singleSpot: {} }
        //     action.spots.forEach(spot => newState.allSpots[spot.id] = spot)
        //     return newState
        // }
        // case DELETE_SPOT: {
        //     newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: {} }
        //     delete newState.allSpots[action.spotId]
        //     return newState
        // }
        // case EDIT_SPOT: {
        //     newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: {} }
        //     newState.allSpots[action.spot.id] = action.spot;
        //     return newState;
        // }
        default:
            return state;
    }
};

export default reviewReducer;