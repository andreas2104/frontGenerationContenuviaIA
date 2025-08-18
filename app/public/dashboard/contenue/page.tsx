'use client'

import PromptInput from "@/app/component/ui/prompt/promptInputModal";
import { useState } from "react";

export default function PrompPage() {
  const [open, setOpen] = useState(true);
  const handleCloseModal = () => {
    setOpen(false);
  }
  return(
    <div>
      {open && (
        <PromptInput onClose={handleCloseModal} prompt={null}/>
      )}
    </div>
  )
}