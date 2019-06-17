Ext.define('Ext.ux.mantis.model.User', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.user',
    
    fields: [
    { name: 'id',         type: 'number' },
    { name: 'name',       type: 'string' },
    { name: 'email',      type: 'string' },
    { name: 'real_name',  type: 'string' }]

});