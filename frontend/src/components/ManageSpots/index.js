import SpotCard from "../SpotCard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserSpotsThunk } from "../../store/spots";
import "./ManageSpots.css"
import DeleteSpot from "../DeleteSpot";
import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";

export default function ManageSpots() {
    const dispatch = useDispatch();

    const spotsObj = useSelector(state => state.spots.allSpots);
    const spots = Object.values(spotsObj)

    useEffect(() => {
        dispatch(getUserSpotsThunk())
    }, [dispatch])

    return (
        <div>
            <h1>Manage Spots</h1>
            {!spots.length && <button><NavLink exact to="/spots/new">Create a New Spot</NavLink></button>}
            <div className="user-spots">
                {spots.length > 0 && spots.map(spot => (
                    <div key = {spot.id}>
                        <SpotCard spot={spot} />
                        <button><NavLink exact to={`/spots/${spot.id}/edit`}>Update</NavLink></button>
                        <OpenModalButton 
                            buttonText="Delete"
                            modalComponent={<DeleteSpot spot={spot} />}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}