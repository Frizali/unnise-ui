import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { cardService } from "../../../services/cardService";
import { useAlert } from "../../../context/AlertContext";

export function useCard() {
  const { id: projectId } = useParams();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const showAlert = useAlert();

  const loadCards = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await cardService.getByProject(projectId);
      setCards(data);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadCards();
  }, [projectId]);

  const addCard = (card) => {
    setCards((prev) => {
      const positionInColumn = prev.filter((c) => c.columnId === card.columnId).length;
      return [...prev, { ...card, position: positionInColumn }];
    });
  };

  const updateCard = (updatedCard) => {
    setCards((prev) => {
      const existing = prev.find((c) => c.id === updatedCard.id);
      const isMovingColumn = existing && existing.columnId !== updatedCard.columnId;

      if (isMovingColumn) {
        const newPosition = prev.filter(
          (c) => c.columnId === updatedCard.columnId && c.id !== updatedCard.id
        ).length;
        cardService.move(projectId, updatedCard.id, {
          cardId: updatedCard.id,
          columnId: updatedCard.columnId,
          position: newPosition,
        });
        return prev.map((c) =>
          c.id === updatedCard.id ? { ...updatedCard, position: newPosition } : c
        );
      }

      return prev.map((c) => (c.id === updatedCard.id ? updatedCard : c));
    });
  };

  const deleteCard = (cardId) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const moveCardToColumn = (cardId, targetColumnId) => {
    setCards((prev) => {
      const newPosition = prev.filter((c) => c.columnId === targetColumnId).length;
      return prev.map((c) =>
        c.id === cardId ? { ...c, columnId: targetColumnId, position: newPosition } : c
      );
    });
  };

  const reorderCardWithinColumn = (sourceCardId, targetCardId, projectId) => {
    setCards((prev) => {
      const targetCard = prev.find((c) => c.id === targetCardId);
      if (!targetCard) return prev;

      const columnId = targetCard.columnId;
      const sourceCard = prev.find((c) => c.id === sourceCardId);
      if (!sourceCard) return prev;

      const siblings = prev
        .filter((c) => c.columnId === columnId && c.id !== sourceCardId)
        .sort((a, b) => a.position - b.position);

      const insertIndex = siblings.findIndex((c) => c.id === targetCardId);
      siblings.splice(insertIndex, 0, { ...sourceCard, columnId });

      const reindexed = siblings.map((c, i) => ({ ...c, position: i }));
      const movedCard = reindexed.find((c) => c.id === sourceCardId);

      cardService.move(projectId, sourceCard.id, {
        cardId: sourceCard.id,
        columnId,
        position: movedCard.position,
      });

      return [
        ...prev.filter((c) => c.columnId !== columnId && c.id !== sourceCardId),
        ...reindexed,
      ];
    });
  };

  const moveCardToColumnByDrop = (sourceCardId, targetColumnId, projectId) => {
    setCards((prev) => {
      const newPosition =
        prev.filter((c) => c.columnId === targetColumnId && c.id !== sourceCardId).length + 1;

      cardService.move(projectId, sourceCardId, {
        cardId: sourceCardId,
        columnId: targetColumnId,
        position: newPosition,
      });

      return prev.map((c) =>
        c.id === sourceCardId ? { ...c, columnId: targetColumnId, position: newPosition } : c
      );
    });
  };

  const getCardsByColumn = (columnId) =>
    cards
      .filter((c) => c.columnId === columnId)
      .sort((a, b) => a.position - b.position);

  return {
    cards,
    setCards,
    isLoading,
    addCard,
    updateCard,
    deleteCard,
    moveCardToColumn,
    reorderCardWithinColumn,
    moveCardToColumnByDrop,
    getCardsByColumn,
  };
}