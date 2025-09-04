'use client'

import ContenuTablePage from "@/app/component/ui/contenu/contenuTableModal";
import DataContenu from "@/app/component/ui/contenu/dataContenu";
// import PromptInput from "@/app/component/ui/prompt/promptInputModal";
// import { useState } from "react";

export default function PrompPage() {
  // const [open, setOpen] = useState(true);
  // const handleCloseModal = () => {
  //   setOpen(false);
  // }
  return(
    <div>
      <DataContenu/>
      {/* {open && (
        <PromptInput onClose={handleCloseModal} prompt={null}/>
      )} */}
    </div>
  )
}