
import { appApi } from './appApi';
import { vuView, vuApp } from './view/vuApp';
import { vuNavBar } from './view/vuNavBar';

// 
const appRouter = { [appApi.root]: {
  render() { return vuView( {menu: vuNavBar},
    m(vuApp, {text: 'Common'} ) );
  }
}};

// once per app
m.route(document.body, "/", appRouter);