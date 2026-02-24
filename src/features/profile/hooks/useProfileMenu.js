import { useState } from "react";
const user = {
    email:"frizali@gmail.com",
    globalName:"Frizali"
}

function useProfileMenu(){
    const [open, setOpen] = useState(false);

    function handleOpen() {
        setOpen(!open);
    }

    return {
        user,
        open,
        handleOpen,
    }
}

export default useProfileMenu;