import { Outlet } from "react-router"
import CommonLayout from "./components/layouts/CommonLayout"

function App() {

  return (
    <>
      <div className="flex flex-col mx-auto">
        <CommonLayout>
        <Outlet/>
      </CommonLayout>
      </div>
    </>
  )
}

export default App
