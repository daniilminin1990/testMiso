import { useCallback, useState, type FC, type ReactNode } from "react";
import { IoIosArrowDown } from "react-icons/io";
import styled from "styled-components";
import { useTheme, Text } from "@v-uik/base";

type FoldableProps = {
  label: string;
  children: ReactNode;
  error?: boolean;
};

export const Foldable: FC<FoldableProps> = ({ label, children, error }) => {
  const theme = useTheme();
  const [state, stateSetter] = useState<boolean>(false);

  return (
    <div style={{ padding: "5px", width: "100%" }}>
      {/* <Labelled {...props} label={}> */}
      <FieldContainer
        $error={error}
        $errorColor={theme.palette.red.$30}
        $neutralColor={theme.palette.greyCold.$30}
      >
        <FieldTitle
          $arrowPosition={state ? "up" : "down"}
          $backgroundHover={theme.palette.greyCold.$5}
          $borderFocus={theme.sys.color.focus}
          onClick={useCallback(() => {
            stateSetter((prev) => !prev);
          }, [stateSetter])}
        >
          <Text kind="titleSm">{label}</Text>
          <span>
            <IoIosArrowDown />
          </span>
        </FieldTitle>
        {state ? (
          <>
            {/* <ContentContainer> */}
            {children}
            {/* </ContentContainer> */}
          </>
        ) : null}
      </FieldContainer>
      {/* </Labelled> */}
    </div>
  );
};

// const ContentContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   padding: 15px;
//   // width: 100%; // ???
// `

const FieldContainer = styled.div<{
  $error?: boolean;
  $errorColor: string;
  $neutralColor: string;
}>`
  width: 100%;
  border-radius: 5px;
  position: relative;
  border: solid 1px
    ${({ $errorColor, $neutralColor, $error }) =>
      $error ? $errorColor : $neutralColor};
`;

const FieldTitle = styled.button.attrs({ type: "button" })<{
  $height?: string;
  $parentsPaddings?: number;
  $arrowPosition?: "up" | "down";
  $backgroundHover?: string;
  $borderFocus?: string;
}>`
  span {
    font-size: 1rem;
    display: flex;
    align-items: center;
    transform: rotate(
      ${({ $arrowPosition = "down" }) =>
        $arrowPosition === "down" ? "0deg" : "180deg"}
    );
  }

  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  height: ${({ $height }) => $height ?? "45px"};
  padding: 0 10px;

  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  border-radius: 5px;
  position: relative;

  &:hover {
    background: ${({ $backgroundHover }) => $backgroundHover ?? "none"};
  }

  &:focus {
    outline: none;

    &::after {
      content: "";
      border-radius: inherit;
      position: absolute;
      border: solid 3px ${({ $borderFocus }) => $borderFocus ?? "none"};
      width: calc(100% - 5px);
      height: calc(100% - 5px);
      top: 2.5px;
      left: 2.5px;
    }
  }
`;
