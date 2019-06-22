Ext.define('Ext.ux.mantis.model.Version', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.version',
    
    fields: [
    { name: 'id',           type: 'number' },
    { name: 'name',         type: 'string' },
    { name: 'description',  type: 'number' },
    { name: 'released',     type: 'string' },
    { name: 'obsolete',     type: 'number' },
    { name: 'timestamp',    type: 'date',   dateFormat: 'm/d/Y H:i:s' }]

});
