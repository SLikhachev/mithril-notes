
import { vuDialog } from './vuDialog';

const clean= str=> str.replace(/[^а-яa-z0-9\.,_-]/gim,'').trim();

export const vuNoteForm= function(vnode) {
  const { model }= vnode.attrs;
  const { item }= model;
  const _new= ()=> item.meta ? 'Edit' : 'Add';
  const _method= ()=> item.meta ? 'PATCH' : 'POST';
  const _cancel= ()=> moModel.cancel(model);
  const _display= ()=> model.editMode ? 'display:block': 'display:none';
  
  const _submit= e=> {
    e.preventDefault();
    item.title= clean(item.title);
    item.content= clean(item.content);
    if (item.title.length < 3 || item.content < 5) {
      model.error= 'Too short content';
      vuDialog.open();
      return false;
    } 
    return moModel.formSubmit(e, model, _method() ).then(
      ()=> { model.editMode=false; return true;}).catch(
      err => { model.error=err; vuDialog.open(); return false; } );
  };
  
  return { view(){
    return m('.pure-g', { style: _display() },
    m('.pure-u-1-2.pure-u-md-1-1', 
      m('form.pure-form.pure-form-stacked', { onsubmit: _submit}, 
        m('fieldset', [
          m('legend', `${_new()} Note`),
          m('fieldset.pure-group', [
            m('input.pure-u-5-5[name="title"][type="text"][placeholder="Note title"]',
              { value: item.title, onblur: e=> item.title= e.target.value }
            ),
            m('textarea.pure-u-5-5',
              { placeholder: "Note content",
                value: item.content, onblur: e=> item.content= e.target.value
              }
            )
          ]),
          m('.pure-g', m('.pure-u-5-5', [
            m('button.pure-button.pure-button-primary.right[type="submit"]', 'Save'),
            m('button.pure-button.right[type="button"]',
              { style: 'margin-right: 1em', onclick: _cancel }, 'Cancel')
          ]))
        ])
      )
    ));
  }};
}