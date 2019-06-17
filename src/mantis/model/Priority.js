Ext.define('Ext.ux.mantis.model.Priority', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.priority',
    
    fields: [
    { name: 'id',         type: 'number' },
    { name: 'name',       type: 'string' },
    { name: 'label',      type: 'string' }]

});
