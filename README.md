# Vacation Plus

Система управления отпусками сотрудников: календарь, диаграмма Ганта, подразделения и учёт отпускных периодов.

Монорепозиторий: React-клиент + ASP.NET Core API.

## Возможности

- Роли: сотрудник и администратор
- Календарь и годовой план отпусков
- Диаграмма Ганта по сотрудникам
- Управление подразделениями (units) и пользователями
- Генерация / редактирование отпускных интервалов
- Аватары сотрудников

## Стек

| Часть | Технологии |
|---|---|
| Frontend | React, TypeScript, Vite, Prismane, Framer Motion, React Router |
| Backend | ASP.NET Core, Entity Framework, SQL Server |

## Структура

```
frontend/   # React/Vite клиент
backend/    # .NET API (VacationPlusNewAPI)
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
