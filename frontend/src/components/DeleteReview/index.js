import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReviewThunk } from "../../store/reviews";
import "./DeleteReview.css";
import { getSpotThunk } from "../../store/spots";

export default function DeleteReview({ review, spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();


    const handleDelete = async (e) => {
        e.preventDefault()
        await dispatch(deleteReviewThunk(review.id))
        await dispatch(getSpotThunk(spotId))
        closeModal()
    }

    return (
        <div className="delete-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={handleDelete} className="yes-button">Yes (Delete Review)</button>
            <button onClick={closeModal} className="no-button">No (Keep Review)</button>
        </div>
    )
}