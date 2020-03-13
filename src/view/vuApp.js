
import { moModel } from '../model/moModel';
import { vuNotes } from './vuNotes';
import { vuNoteForm } from './vuNoteForm';
import { vuDialog } from './vuDialog';

// modal dialog content
const vuModal= function(ivnode) {
  
  // state store exposed initially at the closure call
  const { model }= ivnode.attrs;
  
  // handlers are stored locally in the closure
  // this is a feature of such implementation  
  const _cancel= ()=> vuDialog.close();
  // confirm button click handler
  const _confirm= e=> {
    if ( model.save.msg === 'trash')
      return moModel.formSubmit(e, model, 'DELETE');
    return moModel.formSubmit(e, model, 'PATCH');
  };
  
  return { view () {
    return model.save && model.save.err ?
      m('h2', { style: 'color: red;'}, model.save.msg) :
      /*m('.pure-g', m('.pure-u-5-5', */[
        m('div', model.item.title),
        m('button.pure-button.pure-button-primary.right[type="buttom"]',
          { onclick: _confirm }, 'Confirm'),
        m('button.pure-button.right[type="button"]',
          { style: 'margin-right: 1em', onclick: _cancel }, 'Cancel')
      ]; //));
  }};
}
// Modal dialog component
const vuModalDialog= model=> m(vuDialog, { model }, m(vuModal, { model }) );

//Main view component 
const vuMain= function(ivnode) {
  // We use ivnode as argument case it is initial vnode
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

// view wrapper needed for complex navigation if any
export const vuView= (appMenu, view)=> m(vuMain, appMenu, view);

// Application view
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
