var schema = {
  bears: {
    id: {type: 'increments', nullable:false, primary: true},
    name: {type:'string', unique:true}
  }
}
module.exports=schema;
