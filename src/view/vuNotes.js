
import { vuDialog } from './vuDialog';

// Add Note button presentation
const addButton= vnode=> {
  const _new_note= ()=> vnode.attrs.model.getItem(null);
  return { view() { return m('.pure-g', 
  m('.pure-u-1-2.pure-u-md-1-1', { style: 'border-bottom: 1px solid #eee;' } , [ 
    m('h1.add-note', 'Add New Note'),
    m('button[title="Add Note"',
      { style: 'float: right; display: inline-block;', onclick: _new_note },
      m('i.fas.fa-plus'))
  ]) );
  }};
};

// Presentation for single note
const noteItem= model=> {
  // trash icon's click handler
  const _trash= e=> {
    
    model.getItem(e.target.getAttribute('data'));
    model.save= { err: false, msg: 'trash' };
    model.word= 'Delete';
    vuDialog.open();
  };
  // check icon's click handler
  const _check= e=> {
    model.getItem( e.target.getAttribute('data'));
    model.item.completed= new Date().toISOString().split('.')[0].replace('T', ' ');
    model.save= { err: false, msg: 'check' };
    model.word= 'Complete';
    vuDialog.open();
  };
  // edit this note
  const _edit= e=> {
    model.getItem( e.target.getAttribute('data'));
    model.editMode= true;
  };
  
  const time= ts=> ts.split('.')[0];
  
  // Single Note 
  const _note= note=> m('section.note', [
    m('header.note-header', [ m('p.note-meta', [
      // note metadata
      m('span', { style: 'padding: right: 3em' }, `Created: ${time( note.created )}`),
      note.completed ? m('span', `  Completed: ${time( note.completed )}`) : '', 
      // note right panel 
      m('a.note-pan', m('i.fas.fa-trash', { data: note.id, onclick: _trash } )),
      note.completed ? '' : [
        m('a.note-pan', m('i.fas.fa-pen', {data: note.id, onclick: _edit } )),
        m('a.note-pan', m('i.fas.fa-check', { data: note.id, onclick: _check} ))
      ]
    ]),
      m('h2.note-title', { style: note.completed ? 'text-decoration: line-through': ''}, note.title)
    ]),
    m('.note-content', m('p', note.content))
  ]);
  return _note;
}

//Notes List
export const vuNotes= function(ivnode) {
  const { model }= ivnode.attrs;
  const _display= ()=> model.editMode ? 'display:none': 'display:block';
  const vuNote= noteItem(model);
  
  return { view() {
    return model.error ? m('h2', {style: 'color:red'}, model.error) :
    !model.list ? m('h1', '...LOADING' ) :
    m('div', { style: _display() }, [
      m(addButton , { model } ),
      m('.pure-g', m('.pure-u-1-2.pure-u-md-1-1',
        m('.notes', model.list.map( vuNote ) )
      ))
    ]);
  }};
}
