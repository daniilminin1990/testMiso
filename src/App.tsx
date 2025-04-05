import "./App.scss";

import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { ConfigProvider, notification } from "antd"; // Если используешь Ant Design
// Для уведомлений. Вместо тех, которые от v-uik

import { router } from "@app/routes/router";
import { directoryApi } from "@shared/contexts/directories/direcroryApi";
import { DirectoriesContext } from "@shared/contexts/directories/DirectoriesContext";
import type { DirectoryContent } from "@shared/types/apiTypes";
import { showErrorNotification } from "@shared/ui/showErrorNotification";

import * as styles from "./App.module.scss";

// Глобальная настройка уведомлений
notification.config({
  placement: "topRight",
  duration: 1.5,
  maxCount: 5
});

export default function App() {
  const [directories, setDirectories] = useState(new Map<string, Map<string, DirectoryContent>>());

  useEffect(() => {
    directoryApi.fetchAllDirectories().then(setDirectories).catch(showErrorNotification);
  }, []);

  return (
    <ConfigProvider>
      {" "}
      {/* Опционально, если используешь Ant Design */}
      <DirectoriesContext.Provider value={directories}>
        <div className={styles.container}>
          <RouterProvider router={router} />
        </div>
      </DirectoriesContext.Provider>
    </ConfigProvider>
  );
}

// ! ОРИГИНАЛ
// import './App.scss';
// import * as styles from './App.module.scss';
//
// import { useEffect, useState } from 'react';
// import { RouterProvider } from 'react-router';
// import { ConfigProvider } from 'antd'; // Если используешь Ant Design
// import { whiteInputTheme } from '@shared/theme/whiteInputTheme';
// import { DateLibAdapterProvider, NotificationContainer, ThemeProvider, useResetCss } from '@v-uik/base';
// import { DateFnsAdapter } from '@v-uik/date-picker/dist/adapters/date-fns';
// import { ru } from 'date-fns/locale';
// import type { DirectoryContent } from '@shared/types/apiTypes';
// import { DirectoriesContext } from '@shared/contexts/directories/DirectoriesContext';
// import { showErrorNotification } from '@shared/ui/showErrorNotification';
// import { router } from '@app/routes/router';
// import { directoryApi } from '@shared/contexts/directories/direcroryApi';

// const options: ConstructorParameters<typeof DateFnsAdapter>[0] = { locale: ru };

// export default function App() {
//   useResetCss();
//
//   const [directories, setDirectories] = useState(new Map<string, Map<string, DirectoryContent>>());
//
//   useEffect(() => {
//     directoryApi.fetchAllDirectories().then(setDirectories).catch(showErrorNotification);
//   }, []);
//
//   return (
//     <ThemeProvider theme={whiteInputTheme}>
//       <DateLibAdapterProvider dateAdapter={DateFnsAdapter} options={options}>
//         <DirectoriesContext.Provider value={directories}>
//           <div className={styles.container}>
//             <RouterProvider router={router} />
//           </div>
//         </DirectoriesContext.Provider>
//       </DateLibAdapterProvider>
//     </ThemeProvider>
//   );
// }
