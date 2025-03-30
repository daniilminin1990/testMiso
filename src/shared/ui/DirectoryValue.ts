import { type FC, memo, useContext } from "react";
import { DirectoriesContext, type Directory } from "../contexts/directories/DirectoriesContext";
// TODO EDIT MININ QUESTION ПОЧЕМУ НЕ РАБОТАЕТ ЭТОТ ИМПОРТ???
import type { DirectoryDescriptor } from "@shared/types/apiTypes";

export type DirectoryValueProps = {
  descriptor: DirectoryDescriptor | undefined;
  value: unknown;
};

const empty: Directory = new Map();

function getValue(directory: Directory, x: unknown) {
  const val = x as string;
  return directory.get(val)?.label ?? val;
}

export const DirectoryValue: FC<DirectoryValueProps> = memo(({ descriptor, value }) => {
  const directories = useContext(DirectoriesContext);

  if (!descriptor) {
    throw new Error("Invalid directory descriptor");
  }

  // not strict
  if (value == null) {
    return null;
  }

  const directory = directories.get(descriptor.id) ?? empty;

  if (Array.isArray(value)) {
    return value.map((x) => getValue(directory, x)).join(", ");
  }

  return getValue(directory, value);
});
