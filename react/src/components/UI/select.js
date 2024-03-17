import React, {useMemo} from 'react';

const Select = (props = {
  value: 0,
  items: [],
  onChange: (value = 0) => {}
}) => {

  const freeItems = useMemo(() => {
    return props.items
  }, [props.value, props.items])

  const Item = (itemProps = {
    id: 0,
    name: '',
  }) => <li className={"app-select__item item__" + itemProps.id}>{ itemProps.name }</li>

  return (
      <div className={"app-select"}>
        <div>

        </div>
        <div>

        </div>
      </div>
  );
};

export default Select;