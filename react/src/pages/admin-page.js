import React, {useRef} from 'react';
import AdvancedList from "../components/advanced-list";
import Avatars from "../components/avatars";
import useAccounts from "../hooks/api/useAccounts";
import EmployeePopup from "../components/popups/employee-popup";
import employeePopup from "../components/popups/employee-popup";

const AdminPage = () => {

  const { getAll } = useAccounts()

  const users = getAll()

  const testAvatars = [
      '/icons/test-avatar.png',
      '/icons/test-avatar.png',
      '/icons/test-avatar.png',
      '/icons/test-avatar.png',
      '/icons/test-avatar.png',
      '/icons/test-avatar.png',
      '/icons/test-avatar.png',
  ]

  const directions = [
    { id: 1, name: 'first', color: '#ee0000' },
    { id: 2, name: 'second', color: '#eeddff' },
    { id: 3, name: 'third', color: '#ee0dd0' },
    { id: 4, name: 'fourth', color: '#edd000' },
  ]

  const popup = useRef(null)



  return (
      <div className={"flex gap-lg h-full"}>
        <div className={"flex-1"}>
          <div className={"flex w-full gap-lg"}>
            <div className="flex-1">
              <AdvancedList
                  icon={"user"}
                  title={"Сотрудники"}
                  searchFor={"сотрудника"}
                  all={false}
                  items={users.data}
                  previewItems={<Avatars urls={testAvatars}/>}
                  onItemClick={id => popup.current.show(id)}
                  closeOnItemClick
              />
            </div>
            <div className="flex-1">
              <AdvancedList
                  icon={"compass"}
                  title={"Направления"}
                  searchFor={"направления"}
                  items={directions}
                  all={true}
                  previewItems={(
                      <div className={"flex"}>
                        {directions.map((d, i) => (
                            <div
                                key={d.id}
                                className={"w-[29px] h-[29px] flex items-center justify-center text-[14px] text-white rounded-full border-[3px] border-white " + (i? "-ml-sm" : "")}
                                style={{ backgroundColor: d.color }}
                            >
                              { d.name.substring(0,1).toUpperCase() }
                            </div>
                        ))}
                      </div>
                  )}
              />
            </div>
          </div>
        </div>
        <div className="w-[240px] bg-lightGrey rounded p-md min-h-[240px] h-fit">
          <h3 className={"text-[16px]"}>Предыдущие года</h3>
        </div>
        <EmployeePopup ref={popup}/>
      </div>
  );
};

export default AdminPage;