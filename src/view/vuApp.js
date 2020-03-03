
import { moModel } from '../model/moModel';
import { vuNotes } from './vuNotes';
import { vuNoteForm } from './vuNoteForm';
import { vuDialog } from './vuDialog';

const vuConfirm= function(vnode) {
  const { model }= vnode.attrs;
  
  return { view () {
    return m('div');
    
  }};
}

const vuMain= function(vnode) {
  const { menu }= vnode.attrs;
  return { view(vnode) {
    // IMPORTANT !
    // If we use vnode inside the view function we MUST provide it for view
    return [
      m(menu),
      m('#layout', vnode.children)
    ];
  }};
};

// view wrapper needed for complex navigation if any
export const vuView= (appMenu, view)=> m(vuMain, appMenu, view);

export const vuApp= function(vnode) {
  const { model }= vnode.attrs;
  moModel.getList( model );
  
  return { view() { 
    return [
      m(vuNotes, { model }),
      m(vuNoteForm, { model }),
      m(vuDialog, { header: 'Confirm', word: model.word },
        m(vuConfirm, { model })
      )
    ];
  }};
}
