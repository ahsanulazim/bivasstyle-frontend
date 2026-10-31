const SettingsCard = ({ children, title, subtitle, icon: Icon, badge }) => {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-xs rounded-box overflow-hidden">
      <div className="card-body p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2.5 rounded-xl bg-main/10 text-main shrink-0">
                <Icon className="size-5" />
              </div>
            )}
            <div>
              <h2 className="card-title text-base sm:text-lg font-bold">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs opacity-60 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {badge && <div>{badge}</div>}
        </div>
        <div className="divider my-2"></div>
        {children}
      </div>
    </div>
  );
};

export default SettingsCard;
