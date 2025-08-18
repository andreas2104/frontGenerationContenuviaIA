import PrompPage from "../public/dashboard/contenue/page";
import ProjetPage from "../public/dashboard/projet/page";

export default function BodyPage() {
    return(
        <div className="flex  bg-gray-50 w-full ">
            {/* <ProjetPage/> */}
            <PrompPage/>
                <h1 className="text-amber-700 justify-center items-center p-4"> I,dfd'body</h1>
        </div>
    )
}
