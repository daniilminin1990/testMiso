// import jsonServer from "json-server/index.js";
// import db from "./db.json" assert { type: "json" }; // Импорт данных из db.json
const jsonServer = require("json-server");
const db = require("./db.json");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

console.log("Скрипт запущен");
// Применяем стандартные middleware (CORS, logging и т.д.)
server.use(middlewares);

// Кастомный маршрут для /list с поддержкой фильтрации, сортировки и пагинации
server.get("/controlevent/list", (req, res) => {
  const { filter, page = 0, pageSize = 10, orderBy, orderDesc } = req.query;

  let items = [...db.list.items];

  // Преобразуем каждый проект в "плоский" формат
  items = items.map((item) => {
    const flatItem = { id: item.id, status: item.status, stage: item.stage };
    if (item.fields) {
      item.fields.forEach((field) => {
        flatItem[field.descriptor.propDescriptor.id.toLowerCase()] = field.value;
      });
    } else {
      // Для проектов без fields копируем существующие поля
      Object.keys(item).forEach((key) => {
        if (!flatItem[key]) {
          flatItem[key] = item[key];
        }
      });
    }
    return flatItem;
  });

  // Фильтрация, сортировка и пагинация
  if (filter) {
    items = items.filter((item) =>
      Object.values(item).some((val) => val && val.toString().toLowerCase().includes(filter.toLowerCase()))
    );
  }
  if (orderBy) {
    items.sort((a, b) => {
      const aVal = a[orderBy] || "";
      const bVal = b[orderBy] || "";
      return orderDesc === "true"
        ? bVal.toString().localeCompare(aVal.toString())
        : aVal.toString().localeCompare(bVal.toString());
    });
  }
  const paginatedItems = items.slice(page * pageSize, (page + 1) * pageSize);

  res.json({
    total: items.length,
    items: paginatedItems
  });
});
// server.get("/controlevent/list", (req, res) => {
//   console.log("Запрос к /controlevent/list получен", req.query);
//   const { filter, page = 0, pageSize = 10, orderBy, orderDesc } = req.query;
//
//   let items = [...db.list.items]; // Копируем массив для манипуляций
//
//   // Фильтрация по имени (можно расширить на другие поля)
//   if (filter) {
//     items = items.filter((item) => item.name && item.name.toLowerCase().includes(filter.toLowerCase()));
//   }
//
//   // Сортировка
//   if (orderBy) {
//     const orderKey = orderBy.toLowerCase(); // Приводим к нижнему регистру, т.к. ключи в данных — lowercase
//     items.sort((a, b) => {
//       const aValue = a[orderKey];
//       const bValue = b[orderKey];
//       if (aValue < bValue) return orderDesc === "true" ? 1 : -1;
//       if (aValue > bValue) return orderDesc === "true" ? -1 : 1;
//       return 0;
//     });
//   }
//
//   // Пагинация
//   const start = parseInt(page) * parseInt(pageSize);
//   const end = start + parseInt(pageSize);
//   const paginatedItems = items.slice(start, end);
//
//   // Ответ в формате, ожидаемом приложением
//   res.json({
//     total: items.length, // Общее количество после фильтрации
//     items: paginatedItems
//   });
// });

// Маршрут для /meta (просто возвращает массив метаданных)
server.get("/meta", (req, res) => {
  res.json(db.meta);
});

server.get("/directory/batchForControlEvent", (req, res) => {
  res.json(db.directories.batchForControlEvent);
});

// Получение проекта по ID
server.get("/controlevent/:id", (req, res) => {
  const projectId = req.params.id;
  const project = router.db.get("list").get("items").find({ id: projectId }).value();
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
});

// Обновление проекта
server.patch("/controlevent/:id", (req, res) => {
  const projectId = req.params.id;
  const updatedData = req.body;
  const project = router.db.get("list").get("items").find({ id: projectId });
  if (project.value()) {
    const updatedProject = { ...project.value(), ...updatedData.values };
    project.assign(updatedProject).write();
    res.json(updatedProject);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
});

// Создание нового проекта
server.post("/controlevent/create", (req, res) => {
  const newProject = req.body;
  newProject.id = Math.random().toString(36).substr(2, 9);
  newProject.status = newProject.status || {
    stage: "Draft",
    stageDescription: "Черновик",
    status: "Draft",
    description: "Черновик"
  };
  newProject.fields = newProject.fields || [];
  newProject.transitions = newProject.transitions || [];
  newProject.timestamp = new Date().toISOString();

  router.db.get("list").get("items").push(newProject).write();
  res.status(201).json(newProject.id);
});

// Используем router для остальных маршрутов (если понадобится)
const router = jsonServer.router(db);
server.use(router);

// Запуск сервера на порту 3001
server.listen(3001, () => {
  console.log("JSON Server is running on port 3001");
});
