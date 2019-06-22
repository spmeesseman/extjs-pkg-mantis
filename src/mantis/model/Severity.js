Ext.define('Ext.ux.mantis.model.Severity', 
{
    extend: 'Ext.ux.mantis.model.Field',    
    alias: 'mantis.model.severity',
    
    xtraParams: { option: 'severity_enum_string' },

    fields: [
    { name: 'id',         type: 'number' },
    { name: 'name',       type: 'string' },
    { name: 'label',      type: 'string' }]

});
