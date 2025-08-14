import ProjetTableModal from "@/app/component/ui/projetTableModal"

export default function ProjetPage() {
  return(
    <div className="w-full h-full p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-500">Projets</h1>
      <ProjetTableModal />
    </div>
  );
}