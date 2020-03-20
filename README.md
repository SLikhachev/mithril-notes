The simple SPA application with [mithril.js](https://mithril.js.org/)
==============================================
Mithril.js is unpopular tool for the client-side web application creation. 
The application written to demonstrate the idiomatic SPA development approach with the **mithril.js** javascript framework
This is a simple notes editor application had been wrote follow 
<a href="https://levelup.gitconnected.com/building-faster-apps-with-vue-3d9a4302061d" target=_blank>
this publication</a>.
 
 ### What is  Mithril
Mithril – reactive javascript framework for the SPA (Single Page web Application) development. 
Shortly, this is a just JavaScript with 13 functions signatures of the API.  Besides this, it have  **mithril-stream** small 
library having been used separately. Core of the **mithril** includes `m.router()` for the routing of the application 
and function `m.request()` for the serving of the XHR requests. The central concept is the virtual node abstraction 
(vnode). The **vnode** is just javascript Object with some set of the attributes.  The vnodes are being created with the 
the `m()` function.  The current state of the UI is stored in the array of the vnodes (virtual DOM).
At the initial rendering of the application's page the virtual DOM is translated to the browser DOM.   Mithril produces  
new virtual DOM (VDOM) every time after DOM event handler fires , m.request Promise finish, 
or URL (SPA navigation path) had been changed. New VDOM diffs with the old one and cahnged vnodes change DOM.
The rerendernig may be done by hands with the `m.redraw()` function.

Mithril has not HTML-style templates or JSX support "from the box". Although, you can use something with the help of 
the module bundler's plug-ins.  

If the first arg of the m() is a String ('div' e.g. ) then function returns simple vnode, and in the DOM will be rendered 
```html
<div></div>
```
If the first arg in m() is an Object or function which return Object,  then such Object must have `view()` method, and such object 
is named **Component**.  `view()` component's method always must return `m()` function (or Array of (`m()`, ..)).
So we can build hierarchy of the components' objects. And it is clear that all components return finally simple vnodes.

And the components and simple vnodes have life-cycle methods are named `oninit()`, `oncreate()`, `onbeforeupdate()`, and so on.
Each of this functions have called at the specific moment of the page rendering.
 
We can pass parameters as Object to the components or vnodes. This object is the second arg of `m()`.
Reference to this object inside vnode can be get as vnode.attrs. The third arg of `m()` is children of this vnode, 
and these accessing as vnode.children.

Besides `m()` function, simple vnodes return `m.trust()` api call.

Mithril's author do not suggest any special patterns of the app building. Though he recommend avoid some anti-patterns, for example,
"fat components" or vnode.children manipulation. So there do not suggest ways of state management as the app in whole or 
single component.  But docs points out that you should not use or manipulate with the vnode.state. 

All these mithril's  features look very inconvenient and framework appear uncompleted. No specific recommendation, no state/store, 
no events' reducer/dispatcher no template. Come on, just do it as you may.


### What we need for this example

We need:

* <a href="https://mithriljs.org" target=_blank  >Mithril.js v2.0.4</a>
* <a href="https://purecss.io" target=_blank >pure.css  library v1.0.1</a>
* <a href=" http://fontawesome.io/" target=_blank >fontawesome v5.12 fot icons</a>
* <a href="https://rollupjs.org/" target=_blank >rollup.js app bundler v1.32</a>
* <a href="https://postgrest.com/" target=_blank>postgREST  v5.2.0, as backend REST server</a> 
* RDBM postgresql v9.6 or up

The frontend server have no matter here, it just send index.html and styles and scripts files to the client.

We will be not installed mithril to the `node_modules` folder, and not rolled up application's code and mithril 
in single file. The app's code and mithril will be loading to the page separately.

I will be not describe of the installing steps for tools.  Thought, as to **postgREST**, just download a binary file of the server, put it in the 
separate folder and  create there config file type of:
```ini
db-uri = "postgres://postgres:user1@localhost:5432/testbase"
server-port= 5000
# The name of which database schema to expose to REST clients
db-schema= "public"
# The database role to use when no client authentication is provided.
# Can (and probably should) differ from user in db-uri
db-anon-role = "postgres" 
```

And your DB cluster should have the **testbase** database, and **user1** as DB user. In DB **testbase** create table as:
```sql
-- Postgrest sql notes table 
create table if not exists notes (
id serial primary key,
title varchar(127) NOT NULL,
content text NOT NULL,
created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
completed timestamp with time zone,
ddel smallint default 0
)
```

To run the server postgREST, just type in terminal:

    postgrest test.conf
    
### Plan the project

So, if we somewhere comprehend  how mithril works about, we need a plan to make the app. Thats plan:
    
1.	Application state we will store in the local object. We will call that **model**
2.	App API will been stored in distinct file
3.	App routers will been stored in distinct file
4.	App router file will be entry point for app bundler
5.	Every distinct component  (we will be apply components for rendering) and related functions will be stored in distinct files
6.	Every component which render model data, will be have access to the model
7.	DOM event handlers of the component will be put to the component 

So, we need not custom events, enough DOM native events. Native event's callbacks we will be put to the component.
We will be take two-way binding. Maybe this way is not likes by everybody, but not everybody likes 
**redux** or **vuex**. And one-way data flow we can make with the **mithril-stream**.
  
### The file stucture of the app.
 
![](./public/img/notes.jpg)

The `public` folder will have been served by frontend sever. There are index.html and scripts and styles folders. 

The  `src` folder has a router and an app API definition, and two subfolders for model and view respectively.

 In the root of the project there is rollup. config file, and the project will be asembled with comand:
 ```
 rollup –c
 ```
So as not to tire you with long fragments of the code ( you may see it here ) I will comment 
you just main parts of the implementation, that to show the idiomatic approach of the mithril.

### API и router

API code:
```javascript
// used by backend server
export const restApi= {
  notes: { url: 'notes', editable: ['add', 'edit', 'del'] }
}

// used by routers
export const appApi = {
  root: "/",
}
// used by navBar
// here array of arrays though it may be hash eg
export const appMenu = [
  [`${appApi.root}`, 'Home'],
  [`${appApi.root}`, 'About'],
  [`${appApi.root}`, 'Contacts'],
]
```
We define API of the REST server and router.
 
The router.
```javascript
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
```

Here the router is mounted to the document's body. The router is an object which define routes and componrnts, that
will be used on this route. The `render()` function must return a vnode.

The appApi object defines all possible routes of the app. The appMenu object defines all possible elements of the
 app's navigation.
 
The `render()` function creates app;s model at the call, and transfer it to the root vnode.

### Application's model

We name structure which stored the actual data as model. The code returns the model:
```javascript
getModel(
    {url=null, method="GET", order_by='id', editable=null} = {}
  ) {
/**
  * url - string of model's REST API url
  * method - string of model's REST method
  * order_by - string "order by" with initially SELECT 
  * editable - array defines is model could changed
*/
    const model = {
      url: url,
      method: method,
      order_by: order_by,
      editable: editable,
      key: order_by, // here single primary key only
      list: null, // main data list 
      item: {}, // note item
      error: null, // Promise error
      save: null, // save status
      editMode: false, // view switch flag
      word: '' // dialog header word
    };  
    model.getItem= id => {
      model.item= {};
      if ( !id ) {
        model.editMode= true;
        return false;
      }
      const key= model.key;
      for ( let it of model.list ) {
        if (it[key] == id) {
          model.item= Object.assign({}, it);
          break;
        }
      }
      return false;
    };
    return model;
  },
```

The model's object is initialized and returned. The refs inside the object may changed, but the ref to the model
 still same.

Besides the getModel function, in the moModel global object we have defined  wrappers for the  `m.request()` mithril's functions.
These are `getList(model)` and `formSubmit(event, model, method)`.

The arguments:

* model - model's ref
* event - form submit event object
* method - HTTP method which is used for save the note object (POST - new note, PATCH, DELETE - the new one)  
 
 ### Presentations
 
We put the functions which render the separate elements of the page in the `view` folder.

These are:

* vuApp – app's root component 
* vuNavBar – nav bar
* vuNotes – notes list
* vuNoteForm – note's edit form
* vuDialog – HTML <dialog> element     

We have defined single path in the router with the vuView( menu, view ) as returned component.

Definition of that function:
```javascript
export const vuView= (appMenu, view)=> m(vuMain, appMenu, view);
```

It is just wrapper which returns a vuMain component.    
If an appMenu object will be complex having nested objects then that wrapper will be suitable means 
to return the component. 

vuMain component:
```javascript
const vuMain= function(ivnode) {
  // We use ivnode as argument as it is initial vnode
  const { menu }= ivnode.attrs;
  return { view(vnode) {
    // IMPORTANT !
    // If we use vnode inside the view function we MUST provide it for view
    return [
      m(menu),
      m('#layout', vnode.children)
    ];
  }};
};
```

Here we just return the navigation's vnodes and the component of the page's content.
  
Hereinafter if it possible we will be used the component's definition as a closure. 

The closures are called once during at the initial page's rendering. These store all the objects' refs passed
to the inside and the definitions of the own functions.

The closures as a component's definition must return vnode.
 
The content component:
```javascript
export const vuApp= function(ivnode) {
  const { model }= ivnode.attrs;
  //initially get notes
  moModel.getList( model );
  
  return { view() { 
    return [
      m(vuNotes, { model }),
      m(vuNoteForm, { model }),
      vuModalDialog(model)
    ];
  }};
}
```

Becase we have a model already, during the closure's call we want to get a full list of the notes from DB.  

There will be 3 components:

* vuNotes -  the notes list with the add note button
* vuNoteForm – the note's edit form
* vuModalDialog – <dialog> element, which will be shown modal, and closed as needed.
 
We pass the ref to the model to each of the component, becase each of these need to know how to render themselves.

Notes list component: 
```javascript
//Notes List
export const vuNotes= function(ivnode) {
  const { model }= ivnode.attrs;
  const _display= ()=> model.editMode ? 'display:none': 'display:block';
  const vuNote= noteItem(model); // returns note function
  
  return { view() {
    return model.error ? m('h2', {style: 'color:red'}, model.error) :
    !model.list ? m('h1', '...LOADING' ) :
    m('div', { style: _display() }, [
      m(addButton , { model } ),
      m('.pure-g', m('.pure-u-1-2.pure-u-md-1-1',
        m('.notes', model.list.map( vuNote ) )
      ))
    ]);
  }};
}
```

The model object store the `editMode` bool flag. If flag is `true` then we show a note's edit form, else the notes list.
Here we create the page with the idiomatic mithril's approach, testing the model's attrs with a ternary js operator.

The note's vnode closure:
```javascript
const noteItem= model=> {
  // click event handler
  const event= ( msg, word='', time=null)=> e=> {
    model.getItem(e.target.getAttribute('data'));
    if ( !!msg ) {
      model.save= { err: false, msg: msg };
      model.word= word;
      if ( !!time )
        model.item.completed= time;
      vuDialog.open();
    } else {
      model.editMode= true;
    }
  };
  // trash icon's click handler
  const _trash= event('trash', 'Dlelete');
  
  // check icon's click handler
  const _check= event('check', 'Complete',
    // postgre timestamp string
    new Date().toISOString().split('.')[0].replace('T', ' '));
  
  // edit this note
  const _edit= event('');
  
  const _time= ts=> ts.split('.')[0];
  
  // Single Note 
  const _note= note=> m('section.note', {key: note.id}, [
    m('header.note-header', [ m('p.note-meta', [
      // note metadata
      m('span', { style: 'padding: right: 3em' }, `Created: ${_time( note.created )}`),
      note.completed ? m('span', `  Completed: ${_time( note.completed )}`) : '', 
      // note right panel 
      m('a.note-pan', m('i.fas.fa-trash', { data: note.id, onclick: _trash } )),
      note.completed ? '' : [
        m('a.note-pan', m('i.fas.fa-pen', {data: note.id, onclick: _edit } )),
        m('a.note-pan', m('i.fas.fa-check', { data: note.id, onclick: _check} ))
      ]
    ]),
      m('h2.note-title', { style: note.completed ? 'text-decoration: line-through': ''}, note.title)
    ]),
    m('.note-content', m('p', note.content))
  ]);
  return _note;
}
```
The all click's handlers are defined local. 
The model is not known the note's structure. We have defined the `key` property only, 
which helps to get the note `item` from the `model.list`.
However, the component should  exactly know the structure of the object which is rendered by them.   

We don't show here the full code's text of the note's edit form. Just see the form submit handler.  
```javascript
// form submit handler
  const _submit= e=> {
    e.preventDefault();
    model.item.title= clean(model.item.title);
    model.item.content= clean(model.item.content);
    const check= check_note(model.item);
    if ( !!check ) {
      model.save= { err: true, msg: check }; 
      model.word= 'Edit';
      vuDialog.open();
      return false;
    } 
    return moModel.formSubmit(e, model, _method() ).then(
      ()=> { model.editMode=false; return true;}).catch(
      ()=> { vuDialog.open(); return false; } );
  };
```

As the definition is made in the closure, we have the model's ref, and we return the Promise with the 
handling of the Promise's result.  
We block the edit form rendering on the promise's success or open the dialog modal window on error.  

The notes' list is reread at every request to the backend server. We have not the need to correct 
the notes list in the memory here.  

You may see the dialog component in this repo. We use the POJO (js object literal) 
as the definition of the component, because we want to open the access for the other 
components to the inner `open()` and `close()` functions of the dialog component.

### Conclusion

We wrote the small SPA with the javascript and mithril.js. We have tried to follow the mithril's
idiomatic approach. We want to pay your attention - this is just javascript.  This approach let 
to encapsulate small pieces of code, to isolate the components' mechanic and to use the common state 
for the all components. 











