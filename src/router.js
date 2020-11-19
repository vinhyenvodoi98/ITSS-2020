import { BrowserRouter, Route } from 'react-router-dom';
import Header from 'components/Header';
import Home from 'views/Home';
import Signup from 'views/Signup';

function Router() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Header />

      <Route exact path='/' component={Home} />
      <Route exact path='/signup' component={Signup} />
      {/* {content.LoginStatus.isLogin ? (
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/profile' component={Profile} />
        </Switch>
      ) : (
        <Switch>
          <Route exact path='/' component={Login} />
        </Switch>
      )} */}
    </BrowserRouter>
  );
}

export default Router;
