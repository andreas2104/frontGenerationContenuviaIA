import { addModelIA, deleteModelIA, fetchActiveModels, fetchModelIA, fetchModelsStats, toggleModelActivation, updateModelIA } from "@/services/modelIAService";
import { ModelIA } from "@/types/modelIA";
import { useMutation,useQuery, useQueryClient } from "@tanstack/react-query"

export const useModelIA = () => {
  const queryClient = useQueryClient();

  const {data: modelIA = [], isPending, error } =useQuery({
    queryKey: ['modelIA'],
    queryFn: fetchModelIA,
    refetchOnWindowFocus: false,
  })
console.log("data on model console:", {modelIA, error});
  const addMutation = useMutation({
    mutationFn: (modelIA:ModelIA) => addModelIA(modelIA),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modelIA']});
    }
  });

  const updateMutation = useMutation({
    mutationFn: (modelIA: ModelIA) => updateModelIA(modelIA),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modelIA']});
    }
  });

  const  deleteMutation = useMutation({
    mutationFn: (id: number) => deleteModelIA(id),
    onSuccess:() => {
      queryClient.invalidateQueries({ queryKey: ['modelIA']});
    }
  });

  return {
    modelIA, 
    isPending,
    error,
    addModelIA: addMutation.mutate,
    updateModelIA: updateMutation.mutate,
    deleteModelIA: deleteMutation.mutate,
  };
};

export const useToggleModelIA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleModelActivation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modelIA'] });
      queryClient.invalidateQueries({ queryKey: ['activeModelIA'] }); // rafraîchit aussi la liste active
    }
  });
};

export const useActiveModelIA = () => {
  const { data: activeModelIA = [], isLoading, error } = useQuery({
    queryKey: ['activeModelIA'],
    queryFn: fetchActiveModels,
    refetchOnWindowFocus: false,
  });

  return { activeModelIA, isLoading, error };
};

export const useModelIAStats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['modelIAStats'],
    queryFn: fetchModelsStats,
    refetchOnWindowFocus: false,
  });

  return { stats, isLoading, error };
};