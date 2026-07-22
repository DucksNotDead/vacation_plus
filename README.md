# Vacation Plus

Система управления отпусками сотрудников: календарь, диаграмма Ганта, подразделения и учёт отпускных периодов.

Монорепозиторий: React-клиент + ASP.NET Core API.

## Демо

[▶ Смотреть демо (~40 сек)](https://github.com/DucksNotDead/vacation_plus/blob/main/docs/demo.mp4)

## Скриншоты

<p align="center">
  <img src="docs/screenshots/admin.png" width="48%" alt="Админ: формирование отпуска" />
  <img src="docs/screenshots/select-dates.png" width="48%" alt="Выбор дат отпуска" />
</p>
<p align="center">
  <img src="docs/screenshots/gantt.png" width="48%" alt="Диаграмма Ганта" />
  <img src="docs/screenshots/employee.png" width="48%" alt="Карточка сотрудника" />
</p>

## Возможности

- Роли: сотрудник и администратор
- Автоматическая генерация отпускного года с учётом пожеланий сотрудников и непрерывной работы подразделений
- Календарь и годовой план отпусков
- Диаграмма Ганта по сотрудникам
- Управление подразделениями (units) и пользователями
- Редактирование отпускных интервалов

## Стек

| Часть | Технологии |
|---|---|
| Frontend | React, TypeScript, Vite, Prismane, Framer Motion, React Router |
| Backend | ASP.NET Core, Entity Framework, SQL Server |

## Структура

```
frontend/   # React/Vite клиент
backend/    # .NET API (VacationPlusNewAPI)
docs/       # демо-видео и скриншоты
```

## Запуск

### Frontend

```bash
cd frontend
npm i
npm run dev
```

### Backend

```bash
cd backend
# проверьте ConnectionStrings в appsettings.json
dotnet restore
dotnet run
```
