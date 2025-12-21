import { Outlet } from 'react-router-dom';
import StartupSidebar from '../components/common/StartupSidebar';

const StartupLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StartupSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet /> {/* This is where the specific pages will render */}
        </div>
      </main>
    </div>
  );
};

export default StartupLayout;