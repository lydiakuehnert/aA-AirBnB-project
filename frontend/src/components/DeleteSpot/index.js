import { useDispatch} from "react-redux";
import { deleteSpotThunk } from "../../store/spots";
import { useModal } from "../../context/Modal";
import "./DeleteSpot.css"

export default function DeleteSpot({spot}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();


    const handleDelete = (e) => {
        e.preventDefault()
        return dispatch(deleteSpotThunk(spot.id)).then(closeModal)
    }

    return (
        <div className="delete-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button onClick={handleDelete} className="yes-button">Yes (Delete Spot)</button>
            <button onClick={closeModal} className="no-button">No (Keep Spot)</button>
        </div>
    )
}