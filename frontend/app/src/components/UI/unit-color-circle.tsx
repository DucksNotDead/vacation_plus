const UnitColorCircle = ({
  value,
  size = 18
}: {
  value: string
  size?: number
}) => <div style={{
  aspectRatio: 1,
  borderRadius: "50%",
  width: size,
  backgroundColor: value
}}
/>

export default UnitColorCircle