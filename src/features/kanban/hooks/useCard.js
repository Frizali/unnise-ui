import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { cardService } from "../../../services/cardService";
import { useAlert } from "../../../context/AlertContext";

export function useCard() {
    const { id } = useParams();
    const { card, setCard } = useState({});
    const [ cards, setCards ] = useState([]);
    const [ cardsLoading, setCardsLoading ] = useState(false);
    const showAlert = useAlert();


    const fetchCards = useCallback(async () => {
        setCardsLoading(true);

        try {
            const res = await cardService.getByProject(id);
            setCards(res);
        } catch (err) {
            showAlert(err.title, err.detail, "error");
        } finally {
            setCardsLoading(false);
        }
    });

    const reorderCards = async (cards) => {
        try{

        }catch(err){

        }
    }

    useEffect(() => {
        fetchCards();
    }, [id])

    return{
        cards, 
        setCards,
        cardsLoading,
    }
}