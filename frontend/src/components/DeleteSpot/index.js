import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteSpotThunk } from "../../store/spots";
import { useHistory } from "react-router-dom";

export default function DeleteSpot({spot}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const handleDelete = (e) => {
        e.preventDefault()
        dispatch(deleteSpotThunk(spot.id))
        history.push('/spots/current')
    }

    return (
        <div>
            <button onClick={handleDelete}>Delete</button>
        </div>
    )
}