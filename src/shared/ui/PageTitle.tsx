import { useEffect } from "react";
import { useLocation } from "react-router";

export function PageTitle({ title }: { title: string }) {
  usePageTitle(title);

  return null;
}

export function usePageTitle(title: string) {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
  }, [location, title]);
}

export default PageTitle;
