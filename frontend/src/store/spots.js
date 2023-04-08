const GET_SPOTS = "spots/getSpots";

const getSpotsAction = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
};

export const getSpotsThunk = () => async dispatch => {
    const res = await fetch('/api/spots')

    if (res.ok) {
        const spots = await res.json();
        dispatch(getSpotsAction(spots.Spots))
    }
};

const initialState = {allSpots: {}, singleSpot: {}};

const spotReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_SPOTS: {
            newState = {...state, allSpots: {}, singleSpot: {}}
            action.spots.forEach(spot => newState.allSpots[spot.id] = spot)
            return newState
        }
        default:
            return state;
    }
};

export default spotReducer;