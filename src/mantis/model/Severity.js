Ext.define('Ext.ux.mantis.model.Severity', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.severity',
    
    fields: [
    { name: 'id',         type: 'number' },
    { name: 'name',       type: 'string' },
    { name: 'label',      type: 'string' }]

});
