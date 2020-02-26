

// 
const appRouter = { [appApi.root]: {
    render() { 
       return vuApp( );
    }
  }
};

// once per app
m.route(document.body, "/", appRouter);