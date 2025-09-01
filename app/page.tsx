import BodyPage from "./component/Body";
import FooterPage from "./component/Footer";
import HeaderPage from "./component/Header";
import NavPage from "./component/Nav";
import LoginPage from "./login/page";


export default function Home() {
  return (
    <>
    <div className=" flex-col h-screen">
    {/* <HeaderPage/> */}
    <div className="flex h-screen ">
    <div className="flex h-screen gap-1">
    {/* <NavPage/> */}
    </div>
    <div className="flex w-full h-screen gap-4">
    <BodyPage/>
    </div>
    {/* <LoginPage/> */}
    </div>
    <FooterPage/>

    </div>
    </>

  );
}
