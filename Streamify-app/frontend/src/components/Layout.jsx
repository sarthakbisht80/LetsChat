import Navbar from "./Navbar";
import Sidebar from './Sidebar';


 const Layout = ({children, showSidebar=false}) => {
  return (
    <div className='min-h-screen'>
     <div className='flex'>
      { showSidebar && <Sidebar/>}
      <div className='flex-1 flex flex-col'>
        <Navbar/>
        <main
          className={`flex-1 overflow-y-auto ${!showSidebar ? 'relative' : ''}`}
          style={
            !showSidebar
              ? {
                  backgroundImage:
                    "url('https://www.shutterstock.com/image-vector/social-media-sketch-vector-seamless-600nw-1660950727.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#222',
                  minHeight: '100vh',
                }
              : {}
          }
        >
          {children}
        </main>
      </div>
     </div>


    </div>
  )
}

export default Layout;