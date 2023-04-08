import "./SpotCard.css"

export default function SpotCard({spot}) {

    return (
        <div className="spot-card">
            <div>
                <img src={spot.previewImage} alt="spot image"></img>
            </div>
            <div className="spot-details">
                <h3>{spot.city}, {spot.state}</h3>
                <h3><i class="fa-solid fa-star"></i> {spot.avgRating}</h3>
            </div>
            <h4>${spot.price} night</h4>
        </div>
    )
}