
import { appApi } from '../appApi';

export const vuNavBar= function () {
  
  let tacked_menu;
  const _toggle= event=> {
    tucked_menu.classList.toggle('custom-menu-tucked');
    event.target.classList.toggle('x');
  };
  const _menu= item=> m('li.pure-menu-item',
    m(m.route.Link,
      {href: appApi.root, selector: 'a.pure-menu-item' },
      item
  ));
  
  return {  
    view() { return m('.custom-menu-wrapper', [
      m('.pure-menu custom-menu custom-menu-top', [
        m(m.route.Link,
          { href: appApi.root, selector: 'a.pure-menu-heading custom-menu-brand'},
          'Notes'),
        m(m.route.Link,
          { href: appApi.root, selector: 'a.custom-menu-toggle',
            onclick: _toggle
          }, [m('s.bar'),m('s.bar')] ),
      ]),
      m(`.pure-menu pure-menu-horizontal pure-menu-scrollable
        custom-menu custom-menu-bottom custom-menu-tucked`,
        { oncreate: vnode=> tacked_menu= vnode.dom }, [
        m('.custom-menu-screen'),
        m('ul.pure-menu-list', appApi.appMenu.map( _menu ))
     ])
    ]);
   }};
}
