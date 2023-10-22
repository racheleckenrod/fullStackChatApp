import React from "react";


function App() {
  return (
        // Wrapping the AppContent component with AuthProvider to provide authentication context
        <AuthProvider>
          <AppContent />  {/* This is where the main content of the application will be rendered */}
        </AuthProvider>
  );
}

export default App;