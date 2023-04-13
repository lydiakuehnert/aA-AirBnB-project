import "./SpotCard.css";
import { NavLink } from 'react-router-dom';

export default function SpotCard({spot}) {

    if (!spot) return null;
    if(!spot.avgRating) return null;

    return (
        <div title={spot.name} className="spot-card">
            <NavLink exact to={`/spots/${spot.id}`}>
                <div>
                    <img src={spot.previewImage} alt="spot image"></img>
                </div>
                <div className="spot-details">
                    <h3 className="spot-place">{spot.city}, {spot.state}</h3>
                <h3><i className="fa-solid fa-star"></i> {spot.avgRating === "no average rating" ? "New" : spot.avgRating.toFixed(1)}</h3>
                </div>
                <h4>${spot.price} night</h4>
            </NavLink>
        </div>
    )
}