import { Input, type InputProps } from "@v-uik/base";
import { useState, useEffect } from "react";

// export type DelayedInputProps<TCanClear extends boolean> = {
//   inputProps: InputProps<TCanClear>;
//   onCommit: React.Dispatch<React.SetStateAction<string>>;
// };

type Props = {
  inputProps: InputProps;
  onCommit: React.Dispatch<React.SetStateAction<string>>;
};

// TODO EDIT TCanClear это обобщение типа, можно было бы назвать просто T. С другой стороны а вообще зачеем тут дженерик?! Понимаю, если бы передавали canClear атрибут, но тут то нет...
// Просто можно спредить все inputProps
// export const DelayedInput = <TCanClear extends boolean>({ inputProps, onCommit }: DelayedInputProps<TCanClear>) => {
// TODO EDIT лучше реализовать через создание простого Input от ui kit, а изменить state через debounce обычной функцией
// Так получилось, что этот Input уникальный. А это лишний код.
// Короче делаем просто debounce функцию и пихаем в Input от ui kit

// TODO EDIT наименования useState нужно по правилам state, setState

export const DelayedInput = (props: Props) => {
  const { inputProps, onCommit } = props;
  const [searchState, setVale] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onCommit(searchState);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [onCommit, searchState]);

  return <Input {...inputProps} value={searchState} onChange={setVale} />;
};
