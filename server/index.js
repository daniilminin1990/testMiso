const jsonServer = require("json-server");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // для генерации id проекта
// const { fileUrlToPath } = require("url");
//
// const __filename = fileUrlToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));

console.log("Скрипт запущен");

const headersApply = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
};

// Применение CORS ко всем маршрутам
server.use((req, res, next) => {
  headersApply(res);
  next();
});

// Middleware для разбора тела запроса (нужен для POST)
server.use(jsonServer.bodyParser);

server.get("/check", (req, res) => {
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

server.get("/controlevent/list", (req, res) => {
  const list = router.db.get("list").value();
  let items = list.items;

  // Фильтрация
  const filter = req.query.filter;
  if (filter && typeof filter === "string") {
    items = items.filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()));
  }

  // Сортировка
  // a и b — это два объекта из массива items, которые сравниваются при сортировке. Например, каждый объект может выглядеть так (на основе структуры из db.json):
  const orderBy = req.query.orderBy;
  const orderDesc = req.query.orderDesc === "desc";
  if (orderBy && typeof orderBy === "string") {
    items.sort((a, b) => {
      const valueA = a[orderBy.toLowerCase()] || "";
      const valueB = b[orderBy.toLowerCase()] || "";
      if (typeof valueA === "string" && typeof valueB === "string") {
        return orderDesc ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
      }
      return 0;
    });
  }

  // Пагинация
  const page = parseInt(req.query.page, 10) || 0;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const start = page * pageSize;
  const end = start + pageSize;
  const paginatedItems = items.slice(start, end);

  // Формируем ответ
  const response = {
    total: items.length, // Общее количество после фильтрации
    items: paginatedItems
  };

  res.jsonp(response);
});

server.get("/controlevent/list/meta", (req, res) => {
  const list = router.db.get("meta").value();
  res.jsonp(list);
});

// Новые поля
server.get("/controlevent/:id", (req, res) => {
  const projectId = req.params.id;
  const project = router.db.get("projects").find({ id: projectId }).value();
  if (project) {
    res.jsonp(project);
  } else {
    res.status(404).jsonp({ error: "Project not found" });
  }
});

server.post("/controlevent/create", (req, res) => {
  const list = router.db.get("list").value();
  const numberOfItem = list.items.length;
  // Шаблон для нового проекта со статусом "Черновик КМ"
  const newProjectTemplate = {
    id: uuidv4(),
    status: {
      stage: "Draft",
      stageDescription: "",
      status: "Draft",
      description: "Черновик КМ"
    },
    fields: [
      {
        value: [],
        descriptor: {
          propDescriptor: {
            type: "Complex",
            id: "OADocuments",
            title: "Список ОРД",
            description: "OADocuments Description",
            validations: null,
            group: "Данные ОРД",
            addButtonLabel: "Добавить ОРД",
            valuesFrom: null,
            directoryDescriptor: null,
            isCollection: true,
            idPropertyName: "Id"
          },
          edit: "Editable",
          children: [
            {
              propDescriptor: {
                type: "Hidden",
                id: "Id",
                title: "Id",
                description: "Id Description",
                validations: null,
                group: "",
                addButtonLabel: null,
                valuesFrom: null,
                directoryDescriptor: null,
                isCollection: false,
                idPropertyName: null
              },
              edit: "Readonly",
              children: null
            },
            {
              propDescriptor: {
                type: "Directory",
                id: "OadType",
                title: "Тип ОРД",
                description: "OadType Description",
                validations: null,
                group: "",
                addButtonLabel: null,
                valuesFrom: null,
                directoryDescriptor: {
                  id: "00000000-000b-0000-0000-000000000000",
                  name: "Тип ОРД",
                  type: "Fixed"
                },
                isCollection: false,
                idPropertyName: null
              },
              edit: "Required",
              children: null
            },
            {
              propDescriptor: {
                type: "String",
                id: "RegNumber",
                title: "Регистрационный номер",
                description: "RegNumber Description",
                validations: null,
                group: "",
                addButtonLabel: null,
                valuesFrom: null,
                directoryDescriptor: null,
                isCollection: false,
                idPropertyName: null
              },
              edit: "Required",
              children: null
            },
            {
              propDescriptor: {
                type: "Date",
                id: "Date",
                title: "Дата",
                description: "Date Description",
                validations: null,
                group: "",
                addButtonLabel: null,
                valuesFrom: null,
                directoryDescriptor: null,
                isCollection: false,
                idPropertyName: null
              },
              edit: "Required",
              children: null
            },
            {
              propDescriptor: {
                type: "String",
                id: "Url",
                title: "Ссылка",
                description: "Url Description",
                validations: null,
                group: "",
                addButtonLabel: null,
                valuesFrom: null,
                directoryDescriptor: null,
                isCollection: false,
                idPropertyName: null
              },
              edit: "Editable",
              children: null
            }
          ]
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "String",
            id: "TempNumber",
            title: "Временный номер КМ",
            description: "TempNumber Description",
            validations: null,
            group: "Общая информация",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: null,
            isCollection: false,
            idPropertyName: null
          },
          edit: "Readonly",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "Directory",
            id: "ReviewDepartmentId",
            title: "Проверяющее подразделение",
            description: "ReviewDepartmentId Description",
            validations: null,
            group: "Общая информация",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: {
              id: "00000000-0009-0000-0000-000000000000",
              name: "ТБ",
              type: "Fixed"
            },
            isCollection: false,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: req.body.name || "Новый проект", // Используем имя из запроса или дефолтное
        descriptor: {
          propDescriptor: {
            type: "String",
            id: "Name",
            title: "Наименование АП",
            description: "Name Description",
            validations: null,
            group: "Общая информация",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: null,
            isCollection: false,
            idPropertyName: null
          },
          edit: "Required",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "Directory",
            id: "CheckDepartmentId",
            title: "Проверяемое подразделение",
            description: "CheckDepartmentId Description",
            validations: null,
            group: "Общая информация",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: {
              id: "00000000-0002-0000-0000-000000000000",
              name: "Департамент",
              type: "Fixed"
            },
            isCollection: true,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: "00000001-0000-0000-0000-000000000000", // Фиксированный администратор по умолчанию
        descriptor: {
          propDescriptor: {
            type: "Directory",
            id: "AdministratorId",
            title: "Администратор АП",
            description: "AdministratorId Description",
            validations: null,
            group: "Общая информация",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: {
              id: "00000000-0001-0000-0000-000000000000",
              name: "Пользователь",
              type: "Fixed"
            },
            isCollection: false,
            idPropertyName: null
          },
          edit: "Required",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "Date",
            id: "PrepareStartDate",
            title: "Дата начала подготовки к АП",
            description: "PrepareStartDate Description",
            validations: null,
            group: "Даты АП",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: null,
            isCollection: false,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "Directory",
            id: "HeadId",
            title: "Руководитель АП (Product owner)",
            description: "HeadId Description",
            validations: null,
            group: "Данные КМ",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: {
              id: "00000000-0001-0000-0000-000000000000",
              name: "Пользователь",
              type: "Fixed"
            },
            isCollection: false,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "Directory",
            id: "HeadDepartmentId",
            title: "Подразделение руководителя",
            description: "HeadDepartmentId Description",
            validations: null,
            group: "Данные КМ",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: {
              id: "00000000-000e-0000-0000-000000000000",
              name: "Подразделение руководителя",
              type: "Fixed"
            },
            isCollection: false,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "Directory",
            id: "PlanPoint",
            title: "Пункт плана",
            description: "PlanPoint Description",
            validations: null,
            group: "Данные КМ",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: {
              id: "00000000-0008-0000-0000-000000000000",
              name: "Пункт плана",
              type: "Fixed"
            },
            isCollection: false,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "Directory",
            id: "Directions",
            title: "Направления (карманы)",
            description: "Directions Description",
            validations: null,
            group: "Данные КМ",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: {
              id: "00000000-0013-0000-0000-000000000000",
              name: "Направления (Карманы)",
              type: "Fixed"
            },
            isCollection: true,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "Date",
            id: "StartDate",
            title: "Дата начала проведения АП",
            description: "StartDate Description",
            validations: null,
            group: "Даты АП",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: null,
            isCollection: false,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "String",
            id: "Goal",
            title: "Цель АП",
            description: "Goal Description",
            validations: null,
            group: "Данные КМ",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: null,
            isCollection: false,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "Directory",
            id: "Sprint",
            title: "ID спринта",
            description: "Sprint Description",
            validations: null,
            group: "Данные КМ",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: {
              id: "00000000-000d-0000-0000-000000000000",
              name: "Спринт",
              type: "Fixed"
            },
            isCollection: true,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "Directory",
            id: "Risk",
            title: "Риск",
            description: "Risk Description",
            validations: null,
            group: "Данные КМ",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: {
              id: "00000000-0005-0000-0000-000000000000",
              name: "Риски",
              type: "Fixed"
            },
            isCollection: true,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "Directory",
            id: "Esg",
            title: "ESG",
            description: "Esg Description",
            validations: null,
            group: "Данные КМ",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: {
              id: "00000000-0006-0000-0000-000000000000",
              name: "ESG",
              type: "Fixed"
            },
            isCollection: false,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "Directory",
            id: "CuratorId",
            title: "Куратор АП",
            description: "CuratorId Description",
            validations: null,
            group: "Данные КМ",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: {
              id: "00000000-0001-0000-0000-000000000000",
              name: "Пользователь",
              type: "Fixed"
            },
            isCollection: false,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "String",
            id: "Comment",
            title: "Комментарий",
            description: "Comment Description",
            validations: null,
            group: "Данные КМ",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: null,
            isCollection: false,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: null,
        descriptor: {
          propDescriptor: {
            type: "Directory",
            id: "ParentId",
            title: "Родительская АП",
            description: "ParentId Description",
            validations: null,
            group: "Данные КМ",
            addButtonLabel: null,
            valuesFrom: null,
            directoryDescriptor: {
              id: "00000000-0007-0000-0000-000000000000",
              name: "Parent",
              type: "Fixed"
            },
            isCollection: false,
            idPropertyName: null
          },
          edit: "Editable",
          children: null
        }
      },
      {
        value: [],
        descriptor: {
          propDescriptor: {
            type: "Complex",
            id: "Team",
            title: "Команда АП",
            description: "Team Description",
            validations: null,
            group: "Команда",
            addButtonLabel: "Добавить участника АП",
            valuesFrom: null,
            directoryDescriptor: null,
            isCollection: true,
            idPropertyName: "Id"
          },
          edit: "Editable",
          children: [
            {
              propDescriptor: {
                type: "Hidden",
                id: "Id",
                title: "Id",
                description: "Id Description",
                validations: null,
                group: "",
                addButtonLabel: null,
                valuesFrom: null,
                directoryDescriptor: null,
                isCollection: false,
                idPropertyName: null
              },
              edit: "Readonly",
              children: null
            },
            {
              propDescriptor: {
                type: "Directory",
                id: "PersonId",
                title: "Участник АП",
                description: "PersonId Description",
                validations: null,
                group: "",
                addButtonLabel: null,
                valuesFrom: null,
                directoryDescriptor: {
                  id: "00000000-0001-0000-0000-000000000000",
                  name: "Пользователь",
                  type: "Fixed"
                },
                isCollection: false,
                idPropertyName: null
              },
              edit: "Required",
              children: null
            },
            {
              propDescriptor: {
                type: "Directory",
                id: "Directions",
                title: "Направления (карманы)",
                description: "Directions Description",
                validations: null,
                group: "",
                addButtonLabel: null,
                valuesFrom: "Directions",
                directoryDescriptor: {
                  id: "00000000-0013-0000-0000-000000000000",
                  name: "Направления (Карманы)",
                  type: "Fixed"
                },
                isCollection: true,
                idPropertyName: null
              },
              edit: "Editable",
              children: null
            }
          ]
        }
      }
    ],
    transitions: [
      {
        label: "Регистрация КМ (Подготовка)",
        goToStatus: "Prepare_Registration",
        active: false,
        forward: true,
        note: "Отсутствует хотя бы одно соответсвующее ОРД"
      },
      {
        label: "Регистрация КМ (Проведение)",
        goToStatus: "Proceeding_Registration",
        active: false,
        forward: true,
        note: "Отсутствует хотя бы одно соответсвующее ОРД"
      }
    ],
    timestamp: new Date().toISOString() // Текущая дата и время
  };

  // Добавляем проект в "projects"
  router.db.get("projects").push(newProjectTemplate).write();

  // Добавляем запись в "list.items"
  const newListItem = {
    id: newProjectTemplate.id,
    status: "Черновик КМ",
    stage: "",
    // number: null, // Можно добавить логику генерации номера, если нужно
    number: `Test-${numberOfItem}`, // Можно добавить логику генерации номера, если нужно
    name: req.body.name || "Новый проект",
    administratorId: "00000001-0000-0000-0000-000000000000",
    curatorId: null,
    headId: null,
    headDepartmentId: null,
    checkDepartmentId: [],
    reviewDepartmentId: null,
    prepareStartDate: null,
    prepareEndDate: null,
    startDate: null,
    endDate: null,
    planPoint: null,
    processMining: null,
    goal: null,
    functionalBlock: null,
    custmerJourney: null, // Опечатка в исходном db.json (custmer вместо customer)
    sprint: [],
    risk: [],
    esg: null,
    comment: null,
    parentId: null
  };

  // Обновляем "list.items" и увеличиваем "total"
  // const list = router.db.get("list").value(); // Предполагаем, что "list" — массив с одним объектом
  list.items.push(newListItem);
  list.total += 1;
  router.db.set("list", list).write();

  // // Возвращаем только новый проект
  // res.jsonp(newProjectTemplate);
  // Вернем только id созданного проекта
  res.jsonp(newProjectTemplate.id);
});

// // update, обновление
// server.patch("/controlevent/:id", (req, res) => {
//   const projectId = req.params.id;
//   const { timestamp, values, goToStatus } = req.body;
//
//   const project = router.db.get("projects").find({ id: projectId }).value();
//   if (!project) {
//     return res.status(404).jsonp({ error: "Project not found" });
//   }
//
//   if (timestamp !== project.timestamp) {
//     return res.status(409).jsonp({ error: "Data is outdated" });
//   }
//
//   router.db
//     .get("projects")
//     .find({ id: projectId })
//     .assign({ ...project, values })
//     .write();
//   res.jsonp({ ...project, values });
// });

// update, обновление проекта и валидация
server.patch("/controlevent/:id", (req, res) => {
  const projectId = req.params.id;
  const updatedData = req.body;

  const project = router.db.get("projects").find({ id: projectId }).value();
  if (!project) {
    return res.status(404).jsonp({ error: "Project not found" });
  }

  if (updatedData.timestamp && updatedData.timestamp !== project.timestamp) {
    return res.status(409).jsonp({ status: "conflict", error: "Data is outdated" });
  }

  // Валидация полей
  const errors = {};

  if (!updatedData.values?.Name) {
    errors["$.values.Name"] = ["is required"];
  }

  if (!updatedData.values?.AdministratorId) {
    errors["$.values.AdministratorId"] = ["is required"];
  }

  // Добавьте другие проверки в зависимости от статуса
  if (Object.keys(errors).length > 0) {
    return res.status(400).jsonp({
      type: "https://tools.ietf.org/html/rfc9110#section-15.5.1",
      title: "Validation Error",
      status: 400,
      errors: errors
    });
  }

  // Обновление данных
  const updatedProject = { ...project, ...updatedData, timestamp: new Date().toISOString() };
  router.db.get("projects").find({ id: projectId }).assign(updatedProject).write();

  const list = router.db.get("list").value();
  const listItem = list.items.find((item) => item.id === projectId);
  if (listItem) {
    const updatedListItem = {
      ...listItem,
      name: updatedData.values?.Name || listItem.name,
      status: updatedData.goToStatus || listItem.status
    };
    router.db.get("list").get("items").find({ id: projectId }).assign(updatedListItem).write();
  }

  res.jsonp({ status: "ok", ...updatedProject });
});

// Пути
server.get("/directory/batchForControlEvent", (req, res) => {
  const directories = router.db.get("directories").value();
  res.jsonp(directories);
});

server.get("/directory/:id", (req, res) => {
  const directoryId = req.params.id;
  const batch = router.db.get("directories").get("batch").value();
  const items = batch[directoryId];
  if (items) {
    res.jsonp(items);
  } else {
    res.status(404).jsonp({ error: "Items for this directory not found" });
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
