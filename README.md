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
library having been used separately. Core of the **mithril** includes **m.router()** for the routing of the application 
and function **m.request()** for the serving of the XHR requests. The central concept is the virtual node abstraction 
(vnode). The **vnode** is just javascript Object with some set of the attributes.  The vnodes are being created with the 
the **m()** function.  The current state of the UI is stored in the array of the vnodes (virtual DOM).
At the initial rendering of the application's page the virtual DOM is translated to the browser DOM.   Mithril produces  
new virtual DOM (VDOM) every time after DOM event handler fires , m.request Promise finish, 
or URL (SPA navigation path) had been changed. New VDOM diffs with the old one and cahnged vnodes change DOM.
The rerendernig may be done by hands with the **m.redraw()** function.

Mithril has not HTML-style templates or JSX support "from the box". Although, you can use something with the help of 
the module bundler's plug-ins.  

If the first arg of the m() is a String ('div' e.g. ) then function returns simple vnode, and in the DOM will be rendered 
```html
<div></div>
```
If the first arg in m() is an Object or function which return Object,  then such Object must have **view()** method, and such object 
is named **Component**.  **view()** component's method always must return **m()** function (or Array of (m(), ..)).
So we can build hierarchy of the components' objects. And it is clear that all components return finally simple vnodes.

And the components and simple vnodes have life-cycle methods are named oninit(), oncreate(), onbeforeupdate(), and so on.
Each of this functions have called at the specific moment of the page rendering.
 
We can pass parameters as Object to the components or vnodes. This object is the second arg of m().
Reference to this object inside vnode can be get as vnode.attrs. The third arg of m() is children of this vnode, 
and these accessing as vnode.children.

Besides m() function, simple vnodes return **m.trust()** api call.

Mithril's author do not suggest any special patterns of the app building. Though he recommend avoid some anti-patterns, for example,
"fat components" or vnode.children manipulation. So there do not suggest ways of state management as the app in whole or 
single component.  But docs points out that you should not use or manipulate with the vnode.state. 

All these mithril's  features look very inconvenient and framework appear uncompleted. No specific recommendation, no state/store, 
no events' reducer/dispatcher no template. Just common, do as you can.


### What we need for this example

We need:

* <a href="https://mithriljs.org" target=_blank  >Mithril.js v2.0.4</a>
* <a href="https://purecss.io" target=_blank >pure.css  library v1.0.1</a>
* <a href=" http://fontawesome.io/" target=_blank >fontawesome v5.12 fot icons</a>
* <a href="https://rollupjs.org/" target=_blank >rollup.js app bundler v1.32</a>
* <a href="https://postgrest.com/" target=_blank>postgREST  v5.2.0, as backend REST server</a> 
* RDBM postgresql v9.6 or up

The frontend server have no matter here, it just send index.html and styles and scripts files to the client.

We will be not installed mithril to the node_modules folder, and not rolled up application's code and mithril 
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
So as not to tire you with long fragments of the code ( you may see it here ) I will comment you just main parts of the implementation,
that to show the idiomatic approach of the mithril.




