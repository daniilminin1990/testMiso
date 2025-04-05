import jsonServer from "json-server/index.js";
import path from "path";
import { fileUrlToPath } from "url";

const __filename = fileUrlToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

server.get("/check", (req, res) => {
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

server.get("/controlevent/list", (req, res) => {
  const list = router.db.get("list").value();
  res.jsonp(list);
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
  const newProject = req.body;
  // А как насчет формирования id?
  const addedProject = router.db.get("projects").push(newProject).write();
  res.jsonp(addedProject);
});

// Пути
server.get("/directory/:id", (req, res) => {
  const directoryId = req.params.id;
  // const directory = router.db.get('directories').find({ id: directoryId }).value();
  const batch = router.db.get("directories").get("batch").value();
  const items = batch[directoryId];
  if (items) {
    res.jsonp(items);
  } else {
    res.status(404).jsonp({ error: "Items for this directory not found" });
  }
});

server.get("/batchForControlEvent", (req, res) => {
  const batch = router.db.get("directories").get("batch").value();
  res.jsonp(batch);
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
