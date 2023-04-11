import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotThunk } from "../../store/spots";
import "./OneSpot.css"

export default function OneSpot() {
    const {spotId} = useParams();

    const dispatch = useDispatch();

    const spot = useSelector(state => state.spots.singleSpot);

    useEffect(() => {
        dispatch(getSpotThunk(spotId))
    }, [dispatch])

    if (!spot) return null;

    return (
        <div>
            <div className="spot-detail-box">
                <h1>{spot.name}</h1>
                <h2>{spot.city}, {spot.state}, {spot.country}</h2>
                <div className="spot-img-box">
                    {spot.SpotImages && spot.SpotImages.slice(0,5).map(img => (
                        <img key={img.id} src={img.url}></img>
                    ))}
                </div>
                <h1>Hosted by {spot.Owner && spot.Owner.firstName} {spot.Owner && spot.Owner.lastName}</h1> 
                <p>{spot.description}</p>
                <div className="callout-info-box">
                    <div>
                        <span>
                            <h2>${spot.price}</h2>
                            <h3>night</h3>
                        </span>
                        <h3>
                            <i className="fa-solid fa-star"></i>{spot.avgStarRating ? `${spot.avgStarRating} - ${spot.numReviews} reviews` : "New"}
                        </h3>
                    </div>
                    <button onClick={() => alert("Feature Coming Soon...")}>Reserve</button>
                </div> 
            </div> 
            <div className="review-detail-box">
            </div>     
        </div>
    )
}