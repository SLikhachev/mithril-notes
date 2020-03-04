
import { moModel } from '../model/moModel';
import { vuNotes } from './vuNotes';
import { vuNoteForm } from './vuNoteForm';
import { vuDialog } from './vuDialog';

const vuModal= function(ivnode) {
  const { model }= ivnode.attrs;
  const _cancel= ()=> vuDialog.close();
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

const vuModalDialog= model=> m(vuDialog, { model }, m(vuModal, { model }) );

const vuMain= function(ivnode) {
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

export const vuApp= function(ivnode) {
  const { model }= ivnode.attrs;
  moModel.getList( model );
  
  return { view() { 
    return [
      m(vuNotes, { model }),
      m(vuNoteForm, { model }),
      vuModalDialog(model)
    ];
  }};
}
