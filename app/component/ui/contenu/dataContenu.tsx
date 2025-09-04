import { useContenu } from "@/hooks/useContenu";

export default function DataContenu() {
  const {contenus, isPending} = useContenu();

  if (isPending) {
    return <p>chargement.....</p>
  }

  return(
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="">
    <div  className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {contenus.map((c) => (
      <div key={c.id} 
      className="bg-white p-6 rounded-lg shadow-md  hover:shadow-lg transition duratio-300 flex flex-col justify-between">
        <div className="text-xl font-semibold text-gray-900 mb-2">
          <span>{c.titre}</span>
          <p>{c.date_creation}</p>
          <p> {c.id_model}</p>
          <p>{c.id_prompt}</p>
          <p>{c.id_template}</p>
          <p>{c.texte}</p>
        </div>
      </div>
    ))}
      </div>
    </div>
    </div>
  )
}