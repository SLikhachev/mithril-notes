
import { vuDialog } from '../view/vuDialog';

// backend REST server listening on 
export const _schema= ()=> 'http://localhost:5000';

export const errMsg= function(error){
  if ( !error)
    return 'SERVER ERROR (see logs)'
  const e= error.response ? error.response: 'SERVER ERROR (no response)' ;
  return e.details ? e.details : e.message ? e.message : e;
}

// namespae for app model
// PostgREST SQL model, assumed existance 'ddel' table field  
export const moModel= {
  // getModel:: Object-> Object
  getModel(
    {url=null, method="GET", order_by='id', editable=null} = {}
  ) {
/**
  * url - string of model's REST API url
  * method - string of model's REST method
  * order_by - string "order by" with initially SELECT 
  * editable - array defines is model could changed
*/
    let model = {
      url: url,
      method: method,
      order_by: order_by,
      editable: editable,
      key: order_by, // here single primary key only
      list: null, // main data list 
      item: null, // note item
      error: null, // Promise all error
      save: null, // save status
      editMode: false // view switch flag
    };  
    model.getItem= id => {
      model.editMode= true;
      model.item= {};
      if (id === null) return false; 
      const key= model.key;
      for ( let it of model.list ) {
        if (it[key] == id) {
          model.item= Object.assign({}, it);
          break;
        }
      }
      return false;
    };
    
    return model;
  },
  
  //cancel:: Object-> Promise
  cancel(model) {
    model.editMode=false;
    return moModel.getList(model);
  },

  // getList:: Object-> Promise
  getList (model) {
    model.list= null;
    const method= model.method ? model.method : 'GET';
    const id = model.order_by ? model.order_by : 'id';
    let url= `${model.url}`;
    let sign= url.includes('?') ? '&': '?';
    // GET actual NOT DELETED (ddel field > 0)
    if ( model.editable && model.editable.indexOf('del') >= 0) {
      url= `${url}${sign}ddel=eq.0`;
      sign= '&';
    }
    url =`${_schema('rest')}${url}${sign}order=${id}.asc`;
    return m.request({
      method: method,
      url: url,
      headers: model.headers ? model.headers: null
    }).then( res=> {
      if ( ! Boolean(res) ) return false;
      if (res.length && res.length > 0) {
        model.list = Array.from( res ); // list of objects
      } else
        model.list= [];
      return true;
    }).catch( err=> { 
      model.error = errMsg(err);
      return false;
    });
  },
  
  // formSubmit:: Object-> Object-> String-> Promise
  formSubmit(event, model, method) {
    event.target.parentNode.classList.add('disable');
    const key= model.key ? model.key : 'id';
    const sign= model.url.includes('?') ? '&': '?';
    let url = `${_schema('rest')}${model.url}`;
    let data= Object.assign({}, model.item);
    let _method= method; // 
    if ( _method === 'PATCH' || _method === 'DELETE') {
      url += `${sign}${key}=eq.${data[key]}`; 
      if (data[key]) delete data[key];
    }
    if ( _method === 'DELETE' ) {
    // restrict DELETE to PATCH only
      data= { ddel: 1 };
      _method= 'PATCH';
    }
    
    model.save = { err: false, msg: '' };
    return m.request({
      url: url,
      method: _method,
      body: data,
      headers: model.headers
    }).then( res => {
      event.target.parentNode.classList.remove('disable');
      if (model.list) moModel.getList(model);
      if ( vuDialog.dialog && vuDialog.dialog.open) vuDialog.close();
      return res; 
    }).catch( err => {
      let msg= errMsg(err);
      model.save = { err: true, msg: msg };
      event.target.parentNode.classList.remove('disable');
      return Promise.reject(msg);
    });
  }
  
}