import NavigationCard from "./NavigationCard";

export default function Layout({ children, hideNavigation }) {
  let rightColumnClasses = "h-[66vh] md:h-auto ";
  if (hideNavigation) {
    rightColumnClasses += "w-full ";
  } else {
    rightColumnClasses += "mx-4 md:max-0 md:w-9/12 ";
  }
  return (
    <div className="md:flex max-w-6xl mx-auto gap-6 h-[100vh]">
      <title>PostMate</title>
      {!hideNavigation && (
        <div className="fixed md:static w-full bottom-0 md:w-3/12  z-10 mt-3">
          <NavigationCard />
        </div>
      )}
      <div className={rightColumnClasses}>{children}</div>
    </div>
  );
}
