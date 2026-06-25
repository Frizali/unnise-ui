import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { cardService } from "../../../services/cardService";
import { useAlert } from "../../../context/AlertContext";
import { useAuth } from "../../../context/AuthContext";
import hubClient from "../../../lib/hubClient";

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

  useEffect(() => {
    if (!projectId) return;

    hubClient.joinProjectRoom(projectId).catch(() => {});

    const handleCardCreated = (card) => {
      setCards((prev) => {
        if (prev.find((c) => c.id === card.id)) return prev;
        return [...prev, card];
      });
    };

    const handleCardMoved = (cardId, columnId, position) => {
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, columnId, position } : c))
      );
    };

    hubClient.on("CardCreated", handleCardCreated);
    hubClient.on("CardMoved", handleCardMoved);

    return () => {
      hubClient.off("CardCreated", handleCardCreated);
      hubClient.off("CardMoved", handleCardMoved);
      hubClient.leaveProjectRoom(projectId).catch(() => {});
    };
  }, [projectId]);

  const { user } = useAuth();

  const addCard = async (card) => {
    const assigneeIds = card.assigneeIds?.length
      ? card.assigneeIds
      : user?.sub
      ? [user.sub]
      : [];

    const payload = {
      projectId,
      columnId: card.columnId,
      title: card.title,
      description: card.description ?? null,
      startDate: card.startDate ?? null,
      endDate: card.endDate ?? null,
      assigneeIds,
    };

    try {
      await hubClient.invoke("CreateCard", payload);
    } catch (err) {
      showAlert("Card create failed", err.message ?? "Unable to create card", "error");
    }
  };

  const updateCard = (updatedCard) => {
    setCards((prev) => {
      const existing = prev.find((c) => c.id === updatedCard.id);
      const isMovingColumn = existing && existing.columnId !== updatedCard.columnId;
      const isUpdateCard =
        existing &&
        ["title", "description", "startDate", "endDate"].some(
          (field) => existing[field] !== updatedCard[field]
        );

      if (isMovingColumn) {
        const newPosition = prev.filter(
          (c) => c.columnId === updatedCard.columnId && c.id !== updatedCard.id
        ).length;
        hubClient.invoke("MoveCard", {
          projectId,
          cardId: updatedCard.id,
          columnId: updatedCard.columnId,
          position: newPosition,
        }).catch((err) =>
          showAlert("Card move failed", err.message ?? "Unable to move card", "error")
        );
        return prev.map((c) =>
          c.id === updatedCard.id ? { ...updatedCard, position: newPosition } : c
        );
      }

      if (isUpdateCard){
        cardService.update(projectId, updatedCard.id, {
          id: updatedCard.id,
          title: updatedCard.title,
          description: updatedCard.description,
          startDate: updatedCard.startDate,
          endDate: updatedCard.endDate
        })
      }

      return prev.map((c) => (c.id === updatedCard.id ? updatedCard : c));
    });
  };

  const deleteCard = (cardId) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const moveCardToColumn = async (cardId, targetColumnId) => {
    let newPosition = 0;
    setCards((prev) => {
      newPosition = prev.filter((c) => c.columnId === targetColumnId).length;
      return prev.map((c) =>
        c.id === cardId ? { ...c, columnId: targetColumnId, position: newPosition } : c
      );
    });

    try {
      await hubClient.invoke("MoveCard", {
        projectId,
        cardId,
        columnId: targetColumnId,
        position: newPosition,
      });
    } catch (err) {
      showAlert("Card move failed", err.message ?? "Unable to move card", "error");
    }
  };

  const reorderCardWithinColumn = async (sourceCardId, targetCardId) => {
    let payload;
    const newCards = (() => {
      const current = cards;
      const targetCard = current.find((c) => c.id === targetCardId);
      if (!targetCard) return current;

      const columnId = targetCard.columnId;
      const sourceCard = current.find((c) => c.id === sourceCardId);
      if (!sourceCard) return current;

      const siblings = current
        .filter((c) => c.columnId === columnId && c.id !== sourceCardId)
        .sort((a, b) => a.position - b.position);

      const insertIndex = siblings.findIndex((c) => c.id === targetCardId);
      siblings.splice(insertIndex, 0, { ...sourceCard, columnId });

      const reindexed = siblings.map((c, i) => ({ ...c, position: i }));
      const movedCard = reindexed.find((c) => c.id === sourceCardId);
      payload = {
        projectId,
        cardId: sourceCardId,
        columnId,
        position: movedCard?.position ?? 0,
      };

      return [
        ...current.filter((c) => c.columnId !== columnId && c.id !== sourceCardId),
        ...reindexed,
      ];
    })();

    setCards(newCards);

    if (payload) {
      try {
        await hubClient.invoke("MoveCard", payload);
      } catch (err) {
        showAlert("Card reorder failed", err.message ?? "Unable to reorder card", "error");
      }
    }
  };

  const moveCardToColumnByDrop = async (sourceCardId, targetColumnId) => {
    let newPosition = 0;
    setCards((prev) => {
      newPosition = prev.filter((c) => c.columnId === targetColumnId && c.id !== sourceCardId).length + 1;
      return prev.map((c) =>
        c.id === sourceCardId ? { ...c, columnId: targetColumnId, position: newPosition } : c
      );
    });

    try {
      await hubClient.invoke("MoveCard", {
        projectId,
        cardId: sourceCardId,
        columnId: targetColumnId,
        position: newPosition,
      });
    } catch (err) {
      showAlert("Card move failed", err.message ?? "Unable to move card", "error");
    }
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