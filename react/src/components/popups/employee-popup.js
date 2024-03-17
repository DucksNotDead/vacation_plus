import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import Modal from "../UI/modal";
import {ApiBaseUrl} from "../../settings";

const EmployeePopup = forwardRef(({}, ref) => {

  const modal = useRef(null)

  const [employee, setEmployee] = useState(null)

  const show = (id= 0) => {
    modal.current.show()
    fetch(ApiBaseUrl+'/users/'+id).then(async data => {
      const employee = await data.json()
      setEmployee(() => employee)
    })
  }

  useImperativeHandle(ref, () => ({ show }), [])

  return (
      <Modal ref={modal} title={employee?.name} onClose={() => {
        setEmployee(() => null)
      }}>

      </Modal>
  );
});

export default EmployeePopup;