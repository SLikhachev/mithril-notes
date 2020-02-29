// used by routers
const appApi = {
  root: "/",
};
// used by navBar
// here array of arrays while it may be hash eg
const appMenu = [
  [`${appApi.root}`, 'Home'],
  [`${appApi.root}`, 'About'],
  [`${appApi.root}`, 'Contacts'],
];

const addButt= ()=> m('.pure-g', 
  m('.pure-u-1-2.pure-u-md-1-1', { style: 'border-bottom: 1px solid #eee;' } , [ 
    m('h1.add-note', 'Add New Note'),
    m('button[title="Add Note"', { style: 'float: right; display: inline-block;' },
      m('i.fas.fa-plus'))
  ])
);

const vuNote= note=> m('section.note', [
  m('header.note-header', [ m('p.note-meta', [
    note.meta,
    m('a.note-pan', m('i.fas.fa-trash' )),
    m('a.note-pan', m('i.fas.fa-pen' )),
    m('a.note-pan', m('i.fas.fa-check' ))
  ]),
    m('h2.note-title', note.title)
  ]),
  m('.note-content', m('p', note.content))
]);

const vuNotes= function(vnode) {
  const note={
    meta: 'Created at 20.09.2019',
    title: 'Introducing Pure',
    content: `
      esterday at CSSConf, we launched Pure – a new CSS library. 
		  Phew! Here are the <a href="https://speakerdeck.com/tilomitra/pure-bliss">slides
		  from the presentation</a>. Although it looks pretty minimalist, 
		  we’ve been working on Pure for several months. After many iterations, 
		  we have released Pure as a set of small, responsive, CSS modules 
		  that you can use in every web project.
    `
  };
  const notes= [note];
  
  return { view() {
    return [ addButt(),
    m('.pure-g', m('.pure-u-1-2.pure-u-md-1-1',
      m('.notes', notes.map( vuNote ) )
    )) ];
  }};
};

const vuNoteForm= function(vnode) {
  
  return { view(){
    return m('.pure-g', m('.pure-u-1-2.pure-u-md-1-1', 
      m('form.pure-form.pure-form-stacked', 
        m('fieldset', [
          m('legend', 'Add Update Note'),
          m('fieldset.pure-group', [
            m('input.pure-u-5-5[name="title"][type="text"][placeholder="Note title"]'),
            m('textarea.pure-u-5-5', { placeholder: "Textareas work too" } )
          ]),
          m('.pure-g', m('.pure-u-5-5', [
            m('button.pure-button.pure-button-primary.right[type="submit"]', 'Save'),
            m('button.pure-button.right[type="button"]', { style: 'margin-right: 1em'}, 'Cancel')
          ]))
        ])
      )
    ));
  }};
};

const vuMain= function(vnode) {
  const { menu }= vnode.attrs;
  return { view() {
    return [
      m(menu),
      m('#layout', vnode.children)
    ];
  }};
};

// view wrapper needed for complex navigation if any
const vuView= (appMenu, view)=> m(vuMain, appMenu, view);

const vuApp= function(vnode) {
  
  return { view() { 
    return [ m(vuNotes), m(vuNoteForm) ];
  }};
};

// clojure
const vuNavBar= function () {
  
  let tucked_menu, toggled_link;
  // toogle class list for small screen
  const _toggle= ()=> {
    tucked_menu.classList.toggle('custom-menu-tucked');
    toggled_link.classList.toggle('x');
  };
  // list map func, item is array [ !#uri, name ]
  const _menu= item=> m('li.pure-menu-item',
    m(m.route.Link,
      {href: item[0], selector: 'a.pure-menu-link' },
      item[1]
  ));
  
  return {  
    view() { return m('.custom-menu-wrapper', [
      m('.pure-menu custom-menu custom-menu-top', [
        m(m.route.Link,
          { href: appApi.root, selector: 'a.pure-menu-heading custom-menu-brand'},
          'Notes'),
        m(m.route.Link,
          { selector: 'a.custom-menu-toggle', oncreate: vnode=> toggled_link= vnode.dom,
            onclick: _toggle
          }, [m('s.bar'),m('s.bar')] ),
      ]),
      m(`.pure-menu.pure-menu-horizontal.pure-menu-scrollable
        .custom-menu.custom-menu-bottom.custom-menu-tucked`,
        { oncreate: vnode=> tucked_menu= vnode.dom }, [
        m('.custom-menu-screen'),
        m('ul.pure-menu-list', appMenu.map( _menu ))
     ])
    ]);
   }};
};

// 
const appRouter = { [appApi.root]: {
  render() { return vuView( {menu: vuNavBar},
    m(vuApp, {text: 'Common'} ) );
  }
}};

// once per app
m.route(document.body, "/", appRouter);
