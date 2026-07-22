import {AppDateType} from "../constants/Types.ts";
import useApi from "../hooks/useApi.ts";
import {useEffect, useRef, useState} from "react";
import {FullYear, User, VacationYearUser} from "../constants/Models.ts";
import AppSkeleton from "./UI/app-skeleton.tsx";
import Colors from "../constants/Colors.ts";
import {Button, Flex} from "@prismane/core";
import useDateParser from "../hooks/useDateParser.ts";
import AppProgress from "./UI/app-progress.tsx";
import VacationEditModal, {VacationEditModalRefType} from "./modals/vacation-edit-modal.tsx";

const CurrentYearEmployeePanel = (props: {
  currentDate: AppDateType
  employee: User
}) => {
  const api = useApi()
  const dateParser = useDateParser()
  const [year, setYear]
      = useState<FullYear|null>(null)
  const [employeeInYear, setEmployeeInYear]
      = useState<VacationYearUser|null>(null)
  const [employeeCurrentVacation, setEmployeeCurrentVacation]
      = useState<{
    "atVacation": {
      days: number
      daysOff: number
    }|null
    "soon": number|null
  }|null>(null)
  const [pending, setPending]
      = useState(true)

  const vacationModal = useRef<VacationEditModalRefType>(null)

  useEffect(() => {
    if (!year) api.years.getSingle(props.currentDate.year).then(y => {
      if (y) {
        const employee = y.users.find(u => u.id === props.employee.id)

        if (employee) {
          const currentDay = dateParser.stringToYearDays(dateParser.objToString(props.currentDate))
          for (const employeeVacation of employee.vacations) {
            const {start, days} = dateParser.stringIntervalToNum(employeeVacation.dateInterval)
            const end = start + days
            if (currentDay >= start && currentDay <= end) {
              setEmployeeCurrentVacation(() => ({
                soon: null,
                atVacation: {
                  days,
                  daysOff: end - currentDay
                }
              }))
              break
            }
            if (currentDay <= end) {
              setEmployeeCurrentVacation(() => ({
                atVacation: null,
                soon: currentDay - start
              }))
            }
          }
        }

        setEmployeeInYear(() => employee? employee : null)
      }
      setYear(() => y)
      setTimeout(() => setPending(() => false), 500)
    })
  }, [year]);

  return (
      <>
        <div className={"shadow-sm"} style={{
          width: 220,
          height: 80,

          backgroundColor: Colors.white,
          borderRadius: 14
        }}>
          {pending
              ? <AppSkeleton/>
              : (
                  <Flex h={"100%"} direction={"column"} justify={"center"} gap={4} px={12} py={8}>
                    <h4 style={{marginBottom: 4}}>Текущий год</h4>
                    {year
                        ? year.isReady
                            ? employeeInYear?.vacations.length
                                ? employeeCurrentVacation?.atVacation
                                    ? (
                                        <>
                                          <AppProgress
                                              value={(employeeCurrentVacation.atVacation.days - employeeCurrentVacation.atVacation.daysOff) / employeeCurrentVacation.atVacation.days}
                                          />
                                          <div style={{color: Colors.darkGrey}}>дней осталось:
                                            <span style={{
                                              color: Colors.primary,
                                              fontWeight: 500
                                            }}> {employeeCurrentVacation.atVacation.daysOff}</span>
                                          </div>
                                        </>
                                    )
                                    : employeeCurrentVacation?.soon
                                        ? (
                                            <>
                                              <div style={{color: Colors.darkGrey}}>дней до отпуска:
                                                <span style={{
                                                  color: Colors.primary,
                                                  fontWeight: 500
                                                }}> {employeeCurrentVacation.soon}</span>
                                              </div>
                                            </>
                                        )
                                        : <span style={{color: Colors.darkGrey}}>Отпуск закончен</span>
                                : <span style={{color: Colors.darkGrey}}>Отпуск отсутствует</span>
                            : employeeInYear?.isReady
                                ? <span style={{color: Colors.darkGrey}}>Отпуск на формировании</span>
                                : <Button onClick={() => vacationModal.current?.show(props.employee)}>Выбрать даты</Button>
                        : <span style={{color: Colors.darkGrey}}>Отпуск отсутствует</span>
                    }
                  </Flex>
              )
          }
        </div>
        {year
            ? <VacationEditModal ref={vacationModal} year={year?.year}/>
            : null
        }
      </>
  )
}

export default CurrentYearEmployeePanel