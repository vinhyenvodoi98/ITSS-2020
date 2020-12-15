import { BrowserRouter, Route } from 'react-router-dom';
import Header from 'components/Header';
import Home from 'views/Home';
import Signup from 'views/Signup';
import ImageDetail from 'views/ImageDetail';
import Search from 'views/Search';
import Profile from 'views/Profile';

function Router() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Header />

      <Route exact path='/' component={Home} />
      <Route exact path='/images/:title/:id' component={ImageDetail} />
      <Route exact path='/search/' component={Search} />
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/user/:id' component={Profile} />
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
