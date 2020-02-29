
import { vuNotes } from './vuNotes';
import { vuNoteForm } from './vuNoteForm';

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
export const vuView= (appMenu, view)=> m(vuMain, appMenu, view);

export const vuApp= function(vnode) {
  
  return { view() { 
    return [ m(vuNotes), m(vuNoteForm) ];
  }};
}
