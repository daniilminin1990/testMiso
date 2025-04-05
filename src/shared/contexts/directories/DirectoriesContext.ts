import { createContext } from "react";

import type { DirectoryContent } from "@shared/types/apiTypes";

export interface Directory extends Map<string, DirectoryContent> {}
export interface DirectoriesMap extends Map<string, Map<string, DirectoryContent>> {}

export const DirectoriesContext = createContext<DirectoriesMap>(new Map<string, Directory>());
