
import { vuDialog } from './vuDialog';
import { moModel } from '../model/moModel';

const clean= str=> str.replace(/[^а-яa-z0-9\.,_-]/gim,'').trim();

const check_note= note=> {
  if (note.title.length < 3 || note.content.length < 5 )
    return 'Too short content';
  return '';
}

export const vuNoteForm= function(ivnode) {
  const { model }= ivnode.attrs;
  const _new= ()=> model.item.created ? 'Edit' : 'Add';
  const _method= ()=> model.item.created ? 'PATCH' : 'POST';
  const _cancel= ()=> moModel.cancel(model);
  const _display= ()=> model.editMode ? 'display:block': 'display:none';
  
  const _submit= e=> {
    e.preventDefault();
    //console.log(item);
    model.item.title= clean(model.item.title);
    model.item.content= clean(model.item.content);
    const check= check_note(model.item);
    if ( !!check ) {
      model.save= { err: true, msg: check }; 
      vuDialog.open();
      return false;
    } 
    return moModel.formSubmit(e, model, _method() ).then(
      ()=> { model.editMode=false; return true;}).catch(
      ()=> { vuDialog.open(); return false; } );
  };
  
  return {
 
    view(){
    return m('.pure-g', { style: _display() },
    m('.pure-u-1-2.pure-u-md-1-1', 
      m('form.pure-form.pure-form-stacked', { onsubmit: _submit}, 
        m('fieldset', [
          m('legend', `${_new()} Note`),
          m('fieldset.pure-group', [
            m('input.pure-u-5-5[name="title"][type="text"][placeholder="Note title"]',
              { value: model.item.title, onblur: e=> model.item.title= e.target.value }
            ),
            m('textarea.pure-u-5-5',
              { placeholder: "Note content",
                value: model.item.content, onblur: e=> model.item.content= e.target.value
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