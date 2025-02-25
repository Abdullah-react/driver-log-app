import React from 'react';
import { Container } from 'react-bootstrap';
import JourneyPlanner from '../components/Journey/JourneyPlanner';
import { useNavigate } from 'react-router-dom';
import { createJourney } from '../services/api';

const CreateJourney = () => {
    const navigate = useNavigate();

    const handleJourneySubmit = async (journeyData) => {
        try {
            const response = await createJourney(journeyData);
            navigate(`/journeys/${response.id}`);
        } catch (error) {
            console.error('Failed to create journey:', error);
            // Handle error (show notification, etc.)
        }
    };

    return (
        <Container>
            <h2 className="my-4">Create New Journey</h2>
            <JourneyPlanner onSubmit={handleJourneySubmit} />
        </Container>
    );
};

export default CreateJourney;