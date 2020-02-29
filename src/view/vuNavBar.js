
import { appApi, appMenu } from '../appApi';

// clojure
export const vuNavBar= function () {
  
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
}
