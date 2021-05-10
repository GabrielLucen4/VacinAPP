import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import StoreContext from '../../Store/Context';

const RoutesPrivate = ({ components: Component, ...rest }) => {
  const { token } = useContext(StoreContext);

  return (
    <Route {...rest} render= {() => {
        return token ? <Component {...rest} /> : <Redirect to="/" />
    }}/>
  )
}

export default RoutesPrivate;