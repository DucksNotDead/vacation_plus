import { lazy, Suspense } from 'react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import {AppColorType, AppIconType} from "../../constants/Types.ts";
import Colors from '../../constants/Colors.ts';

const AppIcon = ({ name, color="primary", size=24, onClick }: {
  name: AppIconType
  color?: AppColorType
  size?: number
  onClick?: () => void
}) => {
  const fallback = <div style={{ width: size, height: size }}/>

  const LucideIcon = lazy(dynamicIconImports[name]);

  return (
      <Suspense fallback={fallback}>
        <LucideIcon
            onClick={() => onClick&& onClick()}
            color={Colors[color]}
            size={size}
            strokeWidth={2}
            style={{ cursor: onClick? "pointer" : "initial" }}
        />
      </Suspense>
  );
}

export default AppIcon;