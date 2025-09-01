import Image from "next/image"

export default function TrainPage() {
  return (
    

      <div className=" max-w-sm mx bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-b mb-2 text-gray-500">Titre de la carte</h2>
        <p className="text-gray-600">Ceci est une description dans la carte </p>
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">Action</button>
      <ul role="list" className="text-gray-700">
        <li>one</li>
        <li>Two</li>
      </ul>
      <div className="relative  w-64 h-40">
      <Image className="inline w-[-1] object-cover " fill src={'/image/train.png'}   alt=""/>
      <div className="absolute bottom-2 left-2 z-10 text-red-700">
      <p className="text-2xl"> Tarrif:200$</p>
      <p className="text-sm">aller simple</p>
      </div>
      <div className=" absolute z-10 top-2 right-2">❤️</div>
      </div>
      </div>
      
    
  )
} 