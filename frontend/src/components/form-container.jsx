const FormContainer = ({ children, error }) => {
  return (
    // simple container for form with tailwind css
    <div className="flex flex-col items-center justify-center min-h-screen">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {children}
    </div>
  );
};

export default FormContainer;
