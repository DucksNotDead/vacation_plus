import {Flex} from "@prismane/core";
import useCurrentDate from "../hooks/useCurrentDate.ts";
import useCurrentUser from "../hooks/useCurrentUser.ts";
import CurrentYearEmployeePanel from "../components/current-year-employee-panel.tsx";
import {FullUser, User} from "../constants/Models.ts";
import UserInfo from "../components/user-info.tsx";

const EmployeePage = () => {
  const { user: currentUser } = useCurrentUser()
  const currentDate = useCurrentDate()

  return (
      <>
        <Flex grow gap={24} align={"start"}>
          <UserInfo user={currentUser as FullUser} block/>
          <CurrentYearEmployeePanel
              currentDate={currentDate}
              employee={currentUser as User}
          />
        </Flex>
      </>
  );
};

export default EmployeePage;