

export const vuNoteForm= function(vnode) {
  
  return { view(){
    return m('.pure-g', m('.pure-u-1-2.pure-u-md-1-1', 
      m('form.pure-form.pure-form-stacked', 
        m('fieldset', [
          m('legend', 'Add Update Note'),
          m('fieldset.pure-group', [
            m('input.pure-u-4-5[name="title"][type="text"][placeholder="Note title"]'),
            m('textarea.pure-u-4-5', { placeholder: "Textareas work too" } )
          ]),
          m('.pure-g', m('.pure-u-4-5', [
            m('button.pure-button.pure-button-primary.right[type="submit"]', 'Save'),
            m('button.pure-button.right[type="button"]', { style: 'margin-right: 1em'}, 'Cancel')
          ]))
        ])
      )
    ));
  }};
}