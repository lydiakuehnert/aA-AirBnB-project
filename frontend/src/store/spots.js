const GET_SPOTS = "spots/getSpots";
const GET_SPOT = "spots/getSpot";
const CREATE_SPOT = "spots/createSpot"

const getSpotAction = (spot) => {
    return {
        type: GET_SPOT,
        spot
    }
}

const getSpotsAction = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
};

const createSpotAction = (spot) => {
    return {
        type: CREATE_SPOT,
        spot
    }
}

export const getSpotThunk = (spotId) => async dispatch => {
    const res = await fetch(`/api/spots/${spotId}`);

    if (res.ok) {
        const spot = await res.json()
        dispatch(getSpotAction(spot))
    }
}

export const getSpotsThunk = () => async dispatch => {
    const res = await fetch('/api/spots')

    if (res.ok) {
        const spots = await res.json();
        dispatch(getSpotsAction(spots.Spots))
    }
};

export const createSpotThunk = (payload) => async dispatch => {
    const res = await fetch('/api/spots', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    for (let i = 0; i < payload.spotImg.length; i++) {
        let img = payload.spotImg[i]
        await fetch(`/api/spots/${payload.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(img)
        })
    }

    if (res.ok) {
        const spot = await res.json();
        dispatch(createSpotAction(spot))
        return spot;
    }
}


const initialState = {allSpots: {}, singleSpot: {}};

const spotReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_SPOTS: {
            newState = {...state, allSpots: {}, singleSpot: {}}
            action.spots.forEach(spot => newState.allSpots[spot.id] = spot)
            return newState
        }
        case GET_SPOT: {
            newState = {...state, allSpots: {...state.allSpots}, singleSpot: {}}
            newState.singleSpot = action.spot;
            return newState;
        }
        case CREATE_SPOT: {
            newState = {...state, allSpots: {...state.allSpots}, singleSpot:{}}
            newState.allSpots[action.spot.id] = action.spot
            return newState
        }
        default:
            return state;
    }
};

export default spotReducer;