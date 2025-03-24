// TODO EDIT MININ QUESTION ПОЧЕМУ НЕ РАБОТАЮТ ИМПОРТЫ ОТ @shared и других???
import "./app.scss";
import * as styles from "./app.module.scss";

import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router";

import AppRouter from "./app/routes/AppRouter";
import { Header } from "./layout/header/layoutHeader";
import { whiteInputTheme } from "@shared/theme/whiteInputTheme";
import {
  DateLibAdapterProvider,
  NotificationContainer,
  ThemeProvider,
  useResetCss,
} from "@v-uik/base";
import { DateFnsAdapter } from "@v-uik/date-picker/dist/adapters/date-fns";
// import DateFnsAdapter from "@date-io/date-fns"
import { ru } from "date-fns/locale";
import { directoryApi } from "@shared/contexts/directories/directoryApi";
import type { DirectoryContent } from "@shared/types/apiTypes";
import { DirectoriesContext } from "@shared/contexts/directories/DirectoriesContext";
import { showErrorNotification } from "@shared/ui/showErrorNotification";

export default function App() {
  useResetCss();

  const [directories, setDirectories] = useState(
    new Map<string, Map<string, DirectoryContent>>()
  );

  useEffect(() => {
    directoryApi
      .fetchAllDirectories()
      .then(setDirectories)
      .catch(showErrorNotification);
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={whiteInputTheme}>
        <DateLibAdapterProvider
          dateAdapter={DateFnsAdapter}
          options={{ locale: ru }}
        >
          <DirectoriesContext.Provider value={directories}>
            <div className={styles.container}>
              <Header
                // finder={{
                //   messages: { loading: 'loading', notfound: 'notfound' },
                //   onSelectItem: () => alert('onSelectItem'),
                //   initialGetter: () => Promise.resolve([{ id: '1', value: 'ival1' }]),
                //   dataGetter: (resp) => Promise.resolve([{ id: '1', value: 'val1' }, { id: '1', value: 'val2' }]),
                // }}
                userInfo={{
                  notice: {
                    notificationsNumber: 5,
                    onShowNotifications: () => alert("onShowNotifications"),
                  },
                  onShowInfo: () => alert("onShowInfo"),
                  profile: {
                    name: "Филимонов Арсений Денисович",
                    onOpenSettings: () => alert("onOpenSettings"),
                    onLogOut: () => alert("onLogOut"),
                  },
                }}
              />
              <main className={styles.mainMargin}>
                <AppRouter />

                <NotificationContainer
                  nextNotification
                  position="top-right"
                  autoClose={1500}
                  limit={5}
                />
              </main>
            </div>
          </DirectoriesContext.Provider>
        </DateLibAdapterProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
