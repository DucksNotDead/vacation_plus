type Identifier = { "id": number }


export type ShortUser = Identifier&{
  "shortFio": string,
  "fio": string,
  "avatar": string,
}
export type User = ShortUser& {
  "mail": string,
  "phone": string,
  "fio": string,
  "organization": string,
  "access": 0|1,
  "control": string,
  "department": Department,
  "days": number,
  "daysOff": number,
}
export type FullUser = User& {
  "vacations": Vacation[]
}
export type VacationUser = Identifier& {
  "days": number,
  "currentVacations": Vacation[]
  "lastVacationDate": string|null
}
export type VacationYearUser = Identifier& {
  "shortFio": string,
  "avatar": string,
  "isReady": boolean,
  "vacations": Vacation[],
  "days": number
}
export type FullUserWithUnits = FullUser& { units: FullUnit[] }

export type Department = {
  "id": number,
  "name": string
}


export type VacationEntity = {
  "userId": number,
  "dateInterval": string,
  "yearId": number
}
export type Vacation = VacationEntity&Identifier


export type RequestEntity = {
  "userId": number
  "yearId": number
}
export type Request = Identifier&RequestEntity


export type UnitEntity = {
  "userIds": number[],
  "name": string,
  "color": string
}
export type ServerUnit = Identifier& {
  "userIds": string
  "departmentId": number
  "name": string,
  "color": string,
}
export type Unit = UnitEntity& Identifier& {"departmentId": number}
export type FullUnit = Identifier& {
  "name": string,
  "color": string,
  "departmentId": number,
  "users": ShortUser[]
}


export type YearEntity = {
  "year": number,
  "departmentId": number,
  "userIds": string,
  "isReady": boolean
}
export type Year = YearEntity& Identifier
export type FullYear = Identifier& {
  "year": number,
  "departmentId": number,
  "isReady": boolean,
  "users": VacationYearUser[],
}
export type GanttYear = Identifier& {
  "year": number,
  "departmentId": number,
  "isReady": boolean,
  "units": Identifier&{
    "name": string,
    "color": string,
    "departmentId": number,
    "users": Identifier&{
      "shortFio": string,
      "avatar": string,
      "isReady": boolean
      "vacations": Vacation[]
    }[]
  }
}

