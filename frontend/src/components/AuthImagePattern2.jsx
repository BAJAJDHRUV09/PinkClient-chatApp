const AuthImagePatternV2 = ({ title, subtitle }) => {
    return (
      <div className="hidden lg:flex items-center justify-center bg-base-300 p-12">
        <div className="max-w-md text-center">
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-full bg-primary/10 ${
                  i % 3 === 0 ? "animate-bounce" : ""
                }`}
              />
            ))}
          </div>
          <h2 className="text-3xl font-extrabold mb-4">{title}</h2>
          <p className="text-base-content/70">{subtitle}</p>
        </div>
      </div>
    );
  };
  
  export default AuthImagePatternV2;
  