Ext.define('Ext.ux.mantis.model.ViewState', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.viewstate',
    
    fields: [
    { name: 'id',         type: 'number' },
    { name: 'name',       type: 'string' },
    { name: 'label',      type: 'string' }] // enum - public, private

});
