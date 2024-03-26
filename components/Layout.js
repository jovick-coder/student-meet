import { Toaster } from "react-hot-toast";
import NavigationCard from "./NavigationCard";

export default function Layout({ children, hideNavigation }) {
  let rightColumnClasses = "";
  if (hideNavigation) {
    rightColumnClasses += "w-full";
  } else {
    rightColumnClasses += "mx-4 md:max-0 md:w-9/12";
  }
  return (
    <div className="md:flex mt-4 max-w-4xl mx-auto gap-6">
      <title>PostMate</title>
      {!hideNavigation && (
        <div className="fixed md:static w-full bottom-0 md:w-3/12 -mb-5">
          <NavigationCard />
        </div>
      )}
      <div className={rightColumnClasses}>
        <Toaster position="top-center" />
        {children}
      </div>
    </div>
  );
}
