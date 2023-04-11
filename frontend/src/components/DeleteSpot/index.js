import { useDispatch, useSelector } from "react-redux";
import { deleteSpotThunk } from "../../store/spots";
import { useModal } from "../../context/Modal";

export default function DeleteSpot({spot}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();


    const handleDelete = (e) => {
        e.preventDefault()
        return dispatch(deleteSpotThunk(spot.id)).then(closeModal)
    }

    return (
        <div>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button onClick={handleDelete}>Yes (Delete Spot)</button>
            <button onClick={closeModal}>No (Keep Spot)</button>
        </div>
    )
}