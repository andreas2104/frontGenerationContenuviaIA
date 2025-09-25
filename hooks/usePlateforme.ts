import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addPlateforme,
  deletePlateforme,
  fetchPlateformes,
  updatePlateforme,
} from "@/services/plateformeService";
import { PlateformeConfig, PlateformeCreate, PlateformeUpdate } from "@/types/plateforme";

export const usePlateforme = () => {
  const queryClient = useQueryClient();

  const {
    data: plateformes = [],
    isLoading,
    error,
  } = useQuery<PlateformeConfig[], Error>({
    queryKey: ["plateformes"],
    queryFn: fetchPlateformes,
    refetchOnWindowFocus: false,
  });


  const addMutation = useMutation<
    { message: string; id: number },
    Error,
    PlateformeCreate
  >({
    mutationFn: addPlateforme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plateformes"] });
    },
  });


  const updateMutation = useMutation<
    { message: string },
    Error,
    PlateformeUpdate & { id: number }
  >({
    mutationFn: updatePlateforme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plateformes"] });
    },
  });

  const deleteMutation = useMutation<
    { message: string },
    Error,
    number
  >({
    mutationFn: deletePlateforme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plateformes"] });
    },
  });

  return {
    plateformes,
    isLoading,
    error,
    addPlateforme: addMutation.mutate,
    updatePlateforme: updateMutation.mutate,
    deletePlateforme: deleteMutation.mutate,
  };
};
