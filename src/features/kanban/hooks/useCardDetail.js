import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";
import { useParams } from "react-router-dom";
import { projectService } from "../../../services/projectService";

const TABS = [
    { label: "Commments", value: "comments" },
    { label: "Activity Log", value: "activity" },
    { label: "Files", value: "files" },
];

export function useCardDetail({ showDetail, setShowDetail }) {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentTab, setCurrentTab] = useState("comments");
    const [members, setMembers] = useState([]);
    const [membersLooading, setMembersLooading] = useState(false);

    const cardId = searchParams.get("card");
    const isOpen = showDetail && !!cardId;
    const showAlert = useAlert();

    const handleClose = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("card");
        setSearchParams(params);
        setShowDetail(false);
    };

    useEffect(() => {
        if (!isOpen) return;

        getProjectMembers();
    }, [isOpen]);

    const getProjectMembers = async () => {
        setMembersLooading(true);

        try {
            var members = await projectService.getMembers(id);
            setMembers(members);
        } catch (err) {
            showAlert(err.title, err.detail, "error");
        } finally {
            setMembersLooading(false);
        }
    };

    return {
        cardId, isOpen, TABS, currentTab, members, handleClose, setCurrentTab
    }
}