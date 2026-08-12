import { Outlet } from "react-router-dom"

const DashboardLayout = () => {
  return (
    <div>
     <header>
        <h1>Mini Lab System</h1>
     </header>
     <main>
        <Outlet/>
     </main>




    </div>
  )
}

export default DashboardLayout