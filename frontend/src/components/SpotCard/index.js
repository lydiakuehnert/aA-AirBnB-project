import "./SpotCard.css"

export default function SpotCard({spot}) {

    return (
        <div>
            <img src={spot.previewImage} alt="spot image"></img>
            <h3>{spot.city},</h3>
            <h3>{spot.state}</h3>
            <h3><i class="fa-solid fa-star"></i> {spot.avgRating}</h3>
            <h4>${spot.price} night</h4>
        </div>
    )
}