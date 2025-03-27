import type { DirectoryContent } from '@shared/types/apiTypes';
import { createContext } from 'react';

export interface Directory extends Map<string, DirectoryContent> {}
export interface DirectoriesMap extends Map<string, Map<string, DirectoryContent>> {}

export const DirectoriesContext = createContext<DirectoriesMap>(new Map<string, Directory>());
