import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Utilisateur } from "@/types/utilisateur";
import {
  fetchCurrentUtilisateur,
  fetchUtilisateurs,
  updateUtilisateur,
  deleteUtilisateur,
  logoutUtilisateur,
} from "@/services/utilisateurService";


// const useAuth = () => {
//   console.log("useAuth")
//   const user =
//     typeof window !== "undefined" ? .getItem("user") : null;

//   const logout = () => {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("user");
//       window.location.href = "/";
//     }
//   };


//   console.log("USER", user)

//   return {
//     user: user ? JSON.parse(user) : null,
//     isAuthenticated: !!user,
//     logout,
//   };
// };

export const useLogout = () => {
  const queryclient = useQueryClient();

  return useMutation({
    mutationFn: logoutUtilisateur,
    onSuccess: (data) => {
      console.log(data.message);
      queryclient.removeQueries({ queryKey: ['currentUtilisateur']});
      queryclient.removeQueries({ queryKey: ["utilisateurs"]});
      window.location.href = "/";
    },
    onError: (error) => {
      console.error('Erreur de deconnexion:', error);
    },
  });
};

export const useCurrentUtilisateur = () => {
  // const { token, isAuthenticated, logout } = useAuth();
  const {mutate: logout} = useLogout();
  const {
    data: utilisateur,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["currentUtilisateur"],
    queryFn: fetchCurrentUtilisateur, 
    // enabled: isAuthenticated,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const isAdmin = utilisateur?.type_compte === "admin";
  if (error && !isLoading) {
    logout()
  }

  // Déconnexion auto si erreur d'auth
  // if (error && !isLoading && isAuthenticated) {
  //   console.error("Erreur utilisateur, déconnexion automatique");
  //   logout();
  // }

  return {
    utilisateur,
    isAdmin,
    isLoading,
    // isAuthenticated,
    error,
    logout,
    refetch,
  };
};


export const useUtilisateurs = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useCurrentUtilisateur();

  const {
    data: utilisateurs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["utilisateurs"],
    queryFn: fetchUtilisateurs,
    enabled: isAdmin, 
    refetchOnWindowFocus: false,
  });


  const updateMutation = useMutation({
    mutationFn: (utilisateur: Partial<Utilisateur>) => {
      return updateUtilisateur(utilisateur);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utilisateurs"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteUtilisateur(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utilisateurs"] });
    },
  });

  return {
    utilisateurs,
    isLoading,
    error,
    updateUtilisateur: updateMutation.mutate,
    deleteUtilisateur: deleteMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
