import { FC, ReactNode, useCallback, useRef, useState } from "react";
import * as styles from "./finder.module.scss";
import {
  CircularProgress,
  DropdownMenu,
  DropdownMenuItem,
  Input,
} from "@v-uik/base";
import { FaSearch } from "react-icons/fa";

export type TListItemFinderHOC = {
  value: string;
  id: string;
};
type TMessages = {
  loading?: string;
  notfound?: string;
};

export type TFinderProps = {
  messages?: TMessages;
  onSelectItem?: (id: string, value?: string) => void;
  dataGetter?: (resp: string) => Promise<TListItemFinderHOC[]>;
  initialGetter?: () => Promise<TListItemFinderHOC[]>;
};

type TDisplaying = "loading" | "result" | "empty";
export const Finder: FC<TFinderProps> = ({
  messages,
  onSelectItem,
  dataGetter,
  initialGetter,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [searchingData, setSearchingData] = useState<TListItemFinderHOC[]>([]);
  const [displayingState, setDisplayingState] =
    useState<TDisplaying>("loading");

  // LAYOUT HANDLERS
  const getAnchor = useCallback(() => {
    return anchorRef.current || ({} as HTMLElement);
  }, [anchorRef]);

  const getContainer = useCallback(
    () => containerRef.current || document.body,
    [containerRef]
  );

  const displayingSetter = useCallback(
    (result: TListItemFinderHOC[]) => {
      if (!result) return;
      switch (result.length) {
        case 0:
          setDisplayingState("empty");
          break;
        default:
          setDisplayingState("result");
          break;
      }
    },
    [setDisplayingState]
  );

  const handleInitialRequest = useCallback(() => {
    initialGetter?.().then((items) => {
      setSearchingData(items);
      displayingSetter(items);
    });
  }, [displayingSetter, initialGetter]);

  const handleFilledRequest = useCallback(
    (request: string, delay: number) => {
      if (!dataGetter) throw new Error("dataGetter is required");
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        dataGetter(request).then((items) => {
          setSearchingData(items);
          displayingSetter(items);
        });
      }, delay || 300);
    },
    [dataGetter, displayingSetter]
  );

  const handleSearching = useCallback(
    (currentValue: string) => {
      setInputValue(currentValue);
      setDisplayingState("loading");
      switch (currentValue.length) {
        case 0:
          handleInitialRequest();
          break;
        default:
          handleFilledRequest(currentValue, 500);
      }
    },
    [
      setDisplayingState,
      handleInitialRequest,
      handleFilledRequest,
      setInputValue,
    ]
  );

  // DROPDOWN CONTENT
  // - Loader
  const getLoader = (loadingMessage: string | undefined) => {
    return (
      <DropdownMenuItem>
        <div className={styles.searchItem}>
          <CircularProgress />
          <span>{loadingMessage || "Loading..."}</span>
        </div>
      </DropdownMenuItem>
    );
  };

  // - Empty
  const getEmpty = (nfMessage: string | undefined) => {
    return (
      <DropdownMenuItem>
        <div className={styles.searchItem}>
          <span>{nfMessage ?? "Not found"}</span>
        </div>
      </DropdownMenuItem>
    );
  };
  // - Not found
  const getFoundedList = useCallback(() => {
    return (
      <>
        {searchingData.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => {
              onSelectItem?.(item.id, item.value);
            }}
          >
            {item.value}
          </DropdownMenuItem>
        ))}
      </>
    );
  }, [onSelectItem, searchingData]);

  const content = ((): ReactNode => {
    switch (displayingState) {
      case "loading":
        return getLoader(messages?.loading);
      case "empty":
        return getEmpty(messages?.notfound);
      default:
        return getFoundedList();
    }
  })();

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.searchResContainer}>
        <div ref={anchorRef} />
      </div>
      <DropdownMenu
        keepMounted
        action="click"
        placement="bottom-end"
        content={content}
        className={styles.dropDownContainer}
        anchor={getAnchor}
        container={getContainer}
        onStateChange={(state) => {
          if (state) handleSearching(inputValue);
        }}
      >
        <Input
          size="lg"
          suffix={<FaSearch />}
          onChange={handleSearching}
          value={inputValue}
        />
      </DropdownMenu>
    </div>
  );
};
