
Ext.define('Ext.ux.mantis.model.Note', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.note',
    
    fields: [
    { name: 'id',         type: 'number' },
    { name: 'type',       type: 'string' },
    { name: 'text',       type: 'string' },
    { name: 'created_at', type: 'date',    dateFormat: 'm/d/Y H:i:s' },
    { name: 'updated_at', type: 'date',    dateFormat: 'm/d/Y H:i:s' },
    { 
        name: 'reporter',      
        type: 'string' 
    },
    { 
        name: 'view_state',  
        type: 'string' 
    }]

});
