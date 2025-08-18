'use client'

import ModelIAInputModal from "@/app/component/ui/modelIA/modelIAInputModal";
import { useState } from "react";

export default function ModelIAPage() {
  const [open, setOpen] = useState(true);

  const handleCloseModal = () => {
    setOpen(false);
  }

  return (
    <div>
      {open &&(
        <ModelIAInputModal onClose={handleCloseModal} modelIA={null}/>  
      )
      }
    </div>
  )
}