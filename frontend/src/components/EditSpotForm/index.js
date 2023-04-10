import { useParams } from 'react-router-dom';
import SpotForm from '../SpotForm';
import { useSelector } from 'react-redux';

const EditSpotForm = () => {
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots.allSpots[spotId]);

    return (
        <SpotForm spot={spot} formType="Update your Spot" />
    );
}

export default EditSpotForm;