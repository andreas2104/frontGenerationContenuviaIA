import { fetchModels, fetchPrompts, fetchTemplates } from "@/services/catalogService"
import { useQuery } from "@tanstack/react-query"

export const useCatalog = () => {
  const prompts = useQuery({queryKey: ['prompts'], queryFn: fetchPrompts});
  const templates = useQuery({queryKey: ['templates'], queryFn: fetchTemplates});
  const models = useQuery({queryKey: ['models'], queryFn: fetchModels});

  return {
    prompts, 
    templates,
    models,
    isPending: prompts.isPending || templates.isPending || models.isPending,
    isError: prompts.isError || templates.isError || models.isError,
  };
};