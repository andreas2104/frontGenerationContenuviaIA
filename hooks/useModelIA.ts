import { addModelIA, deleteModelIA, fetchModelIA, updateModelIA } from "@/services/modelIAService";
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
  }
}