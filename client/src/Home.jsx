import React, { useEffect, useState } from 'react';
import Title from './Title';
import AuthToggle from './AuthToggle';

const App = () => {
  const [backendData, setBackendData] = useState(null);

  return (
    <div>
      <Title></Title>
      <div className="mt-8">
            <AuthToggle />
        </div>
    </div>
  );
};

export default App;
