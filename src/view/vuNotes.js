
import { vuDialog } from './vuDialog';

// Add Note button presentation
const addButton= vnode=> {
  // new note item 
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
  // click event handler
  const event= ( msg, word='', time=null)=> e=> {
    model.getItem(e.target.getAttribute('data'));
    if ( !!msg ) {
      model.save= { err: false, msg: msg };
      model.word= word;
      if ( !!time )
        model.item.completed= time;
      vuDialog.open();
    } else {
      model.editMode= true;
    }
  };
  // trash icon's click handler
  const _trash= event('trash', 'Dlelete');
  
  // check icon's click handler
  const _check= event('check', 'Complete',
    // postgre timestamp string
    new Date().toISOString().split('.')[0].replace('T', ' '));
  
  // edit this note
  const _edit= event('');
  
  const _time= ts=> ts.split('.')[0];
  
  // Single Note 
  const _note= note=> m('section.note', {key: note.id}, [
    m('header.note-header', [ m('p.note-meta', [
      // note metadata
      m('span', { style: 'padding: right: 3em' }, `Created: ${_time( note.created )}`),
      note.completed ? m('span', `  Completed: ${_time( note.completed )}`) : '', 
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
  const vuNote= noteItem(model); // returns note function
  
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
