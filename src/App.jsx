import React, { useState } from 'react';
import Layout from './components/Layout';


const App = () => {
 const [currentRoute, setCurrentRoute] = useState('patients');


 return (
   <Layout currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />
 );
};


export default App;

