import { useState } from "react";

import { ProjectListTable } from "@/pages/projectList/ProjectListTable";

import { DelayedInput } from "../../shared/ui/DelayedInput";
// refactor props

type Props = {
  onSelect: (projectId: string) => void;
};

// export const ProjectListContainer: React.FC<{
//   onSelect: (projectId: string) => void
// }> = ({ onSelect }) => {
// TODO EDIT Лучше отрефакторить вот так
export const ProjectListContainer = (props: Props) => {
  const { onSelect } = props;
  const [searchValue, setSearchValue] = useState("");

  return (
    <div
      // TODO EDIT инлайновые стили опять
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "15px"
      }}
    >
      {/* TODO EDIT я бы выбросил эту компоненту впринципе и реализовал логику тут. Вложенность ненужная */}
      {/*<DelayedInput inputProps={{ label: 'Поиск' }} onCommit={setSearchValue} />*/}
      <DelayedInput label={"Поиск"} onCommit={setSearchValue} />
      <ProjectListTable onSelect={onSelect} filter={searchValue} />
    </div>
  );
};
