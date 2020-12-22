import { BrowserRouter, Route } from 'react-router-dom';
import Header from 'components/Header';
import Home from 'views/Home';
import Signup from 'views/Signup';
import ImageDetail from 'views/ImageDetail';
import Search from 'views/Search';
import Profile from 'views/Profile';
import Album from 'views/Album';
import Credit from 'views/Credit';

function Router() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Header />

      <Route exact path='/' component={Home} />
      <Route exact path='/images/:title/:id' component={ImageDetail} />
      <Route exact path='/search/' component={Search} />
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/album/:id' component={Album} />
      <Route exact path='/user/:id' component={Profile} />
      <Route exact path='/credit' component={Credit} />
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
