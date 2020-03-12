
import { restApi, appApi } from './appApi';
import { moModel } from './model/moModel';
import { vuView, vuApp } from './view/vuApp';
import { vuNavBar } from './view/vuNavBar';

// application router
const appRouter = { [appApi.root]: {
  render() {
    const view = m(vuApp, {
      model: moModel.getModel( restApi.notes ),
    });
    return vuView( {menu: vuNavBar}, view);
  }
}};

// once per app
m.route(document.body, "/", appRouter);