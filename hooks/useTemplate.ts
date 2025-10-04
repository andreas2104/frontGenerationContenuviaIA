import { fetchAllTemplates,addTemplate,updateTemplate,deleteTemplate, fetchTempleteById } from "@/services/templateSevice";
import { Template } from "@/types/template";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTemplate = () => {
  const queryClient = useQueryClient();

  const { data: templates = [], isPending, error } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchAllTemplates,
    refetchOnWindowFocus: false,
  });

  const addMutation = useMutation({
    mutationFn: (template: Template) => addTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (template: Template) => updateTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  return {
    templates,
    isPending,
    error,
    addTemplate: addMutation.mutate,
    updateTemplate: updateMutation.mutate,
    deleteTemplate: deleteMutation.mutate,
  };
};

export const useTemplateById = (id: number | null) => {
  return useQuery<Template, Error>({
    queryKey: ["templte", id],
    queryFn: () => {
      if (!id) {
        throw new Error("ID du template requis");
      }
      return fetchTempleteById(id);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}