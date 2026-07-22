const AppPreloader = ({ size = 40 }) => {
  return <div className={"app-preloader"}>
    <div className="p-progress-spinner" style={{ width: size, height: size }}>
      <svg viewBox="25 25 50 50" className="p-progress-spinner-svg" style={{ animationDuration: '2s' }}><circle cx="50" cy="50" r="20" strokeMiterlimit="10" className="p-progress-spinner-circle" fill="none" strokeWidth="6"></circle></svg>
    </div>
  </div>
};

export default AppPreloader;