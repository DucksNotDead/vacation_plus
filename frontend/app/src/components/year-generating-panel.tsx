import AppProgress from "./UI/app-progress.tsx";
import {Flex} from "@prismane/core";
import ShortUserList from "./short-user-list.tsx";
import AppLoadingButton from "./UI/app-loading-button.tsx";
import useVacationYearGenerator from "../hooks/useVacationYearGenerator.ts";
import {FullYear} from "../constants/Models.ts";

const YearGeneratingPanel = (props: {
  year: FullYear
  onUserClick: (id: number) => void,
  onGenerate: () => void
}) => {
  const {generate, pending: generatePending} = useVacationYearGenerator(props.year.id, props.year.year, props.onGenerate)

  return props.year
      ? (
          <>
            <AppProgress
                value={(props.year.users.length - props.year.users.filter(u => !u.isReady).length) / props.year.users.length}
            />
            <Flex justify={"around"} align={"center"}>
              <ShortUserList
                  items={props.year.users.filter(u => u.isReady).map(u => ({
                    id: u.id,
                    name: u.shortFio,
                    avatar: u.avatar
                  }))}
                  label={"выбрали даты"}
                  onUserClick={props.onUserClick}
              />
              <ShortUserList
                  items={props.year.users.filter(u => !u.isReady).map(u => ({
                    id: u.id,
                    name: u.shortFio,
                    avatar: u.avatar
                  }))}
                  label={"молчат"}
                  onUserClick={props.onUserClick}
              />
              <AppLoadingButton
                  onClick={generate}
                  text={"Сформировать автоматически"}
                  pending={generatePending}
              />
            </Flex>
          </>
      )
      : null
}

export default YearGeneratingPanel